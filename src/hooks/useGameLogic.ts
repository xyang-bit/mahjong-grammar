import { useState, useEffect, useCallback } from 'react';
import { CardData, Player, WordType, GameMode, Lesson, NetworkRole, ActionPayload, SelectionItem, Phase, SyncStatePayload } from '../types';
import { generateDeck, DECK_MANIFEST, LESSONS } from '../constants';
import { db } from '../firebaseConfig';
import { ref, onValue, set, push, onChildAdded, remove, update, serverTimestamp } from 'firebase/database';

interface ValidationResult {
    isValid: boolean;
    error: string | null;
}

export const useGameLogic = () => {
    // GAME STATE
    const [mode, setMode] = useState<GameMode | null>(null);
    const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
    const [currentProblemIndex, setCurrentProblemIndex] = useState<number>(0);
    const [hintLevel, setHintLevel] = useState<number>(0);

    const [deck, setDeck] = useState<CardData[]>([]);
    const [discardPile, setDiscardPile] = useState<CardData[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);
    const [currentTurn, setCurrentTurn] = useState<number>(0);
    const [phase, setPhase] = useState<Phase>('DRAW');

    const [selectionQueue, setSelectionQueue] = useState<SelectionItem[]>([]);
    const [message, setMessage] = useState<string | null>(null);

    // NETWORK STATE
    const [role, setRole] = useState<NetworkRole>('OFFLINE');
    const [roomId, setRoomId] = useState<string>('');
    const [myPlayerId, setMyPlayerId] = useState<number>(1);
    const [challengeState, setChallengeState] = useState<SyncStatePayload['challenge'] | null>(null);

    // Helpers
    const currentPlayer = players?.[currentTurn] || { name: 'Connecting...', hand: [], melds: [], id: -1, score: 0, isHost: false } as Player;
    const isMyTurn = role === 'OFFLINE' || (players?.[currentTurn]?.id === myPlayerId);
    const myHand = players?.find(p => p.id === myPlayerId)?.hand || [];
    const currentProblem = activeLesson ? activeLesson.problems[currentProblemIndex] : null;

    let activeHint = "";
    if (mode === 'LESSON' && currentProblem && hintLevel > 0) {
        const sol = currentProblem.solutions[0];
        if (hintLevel === 1) activeHint = `Length: ${sol.length} characters`;
        else if (hintLevel === 2) activeHint = `Starts with: "${sol[0]}"`;
        else if (hintLevel >= 3) activeHint = `Answer: ${sol}`;
    }

    const triggerMessage = (msg: string) => {
        setMessage(msg);
        setTimeout(() => setMessage(null), 4000);
    };

    // --- ENHANCED GRAMMAR VALIDATION ENGINE ---
    const calculateMeldScore = (cards: CardData[]) => {
        let score = 5; // Base score for any valid meld
        const fullSentence = cards.map(c => c.hanzi).join('');

        // Grammar Complexity Bonuses
        const hasSubj = cards.some(c => c.isPronoun || c.type === 'noun');
        const hasVerb = cards.some(c => c.type === 'verb' || c.hanzi === '是' || c.hanzi === '在');
        const hasObj = cards.filter(c => c.type === 'noun' || c.type === 'adj').length >= 1;

        if (hasSubj && hasVerb && hasObj) score += 15; // Complete Sentence Bonus
        if (cards.some(c => c.isModifier)) score += 10; // Adjective/Adverb usage

        // Particle Multipliers (的, 了, 过, 得)
        const particles = ['的', '了', '过', '得'];
        const particleCount = cards.filter(c => particles.includes(c.hanzi)).length;
        if (particleCount > 0) score *= (Math.pow(2, particleCount));

        // Connector Multiplier (Multi-clause sentences)
        const hasConnectors = (fullSentence.includes('因为') && fullSentence.includes('所以')) ||
            (fullSentence.includes('虽然') && fullSentence.includes('但是'));
        if (hasConnectors) score *= 2;

        return score;
    };

    const validateSandboxMeld = (cards: CardData[]): ValidationResult => {
        if (cards.length < 2) return { isValid: false, error: "Sentence too short (min 2 words)" };

        const lastIdx = cards.length - 1;

        // 1. Mandatory Predicate Check
        const hasVerb = cards.some(c => c.type === 'verb');
        const hasAdj = cards.some(c => c.type === 'adj');
        const hasZai = cards.some(c => c.hanzi === '在');
        const hasShi = cards.some(c => c.hanzi === '是');
        if (!hasVerb && !hasAdj && !hasZai && !hasShi) {
            return { isValid: false, error: "Missing Action: Every sentence needs a verb or 'is'." };
        }

        // Iterate through cards for positional checks
        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            const prev = i > 0 ? cards[i - 1] : null;

            // 2. Measure/Unit Dependency
            if (card.isUnit) {
                if (i === 0) {
                    return { isValid: false, error: `Grammar: Unit '${card.hanzi}' cannot start a sentence.` };
                }
                const isNumber = prev?.isNumber || ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '几', '两'].includes(prev?.hanzi || '');
                const isDem = prev?.isDemonstrative || ['这', '那', '哪'].includes(prev?.hanzi || '');

                if (!isNumber && !isDem) {
                    return { isValid: false, error: `Grammar: Unit '${card.hanzi}' needs a number or 'this/that' before it.` };
                }
            }

            // 3. Adverb/Negation Positioning & Constituency
            if (card.isModifier) {
                // EXCEPTION: '没有' (mei you) can start a sentence (Existential "There is no...")
                if (i === 0 && card.hanzi !== '没有') {
                    return { isValid: false, error: `Start Error: Sentences cannot start with modifier '${card.hanzi}'.` };
                }

                const next = i < cards.length - 1 ? cards[i + 1] : null;
                const nextType = next?.type;

                // EXCEPTION: '没有' can be followed by a Noun (e.g. "No friends")
                const allowedFollowers = card.hanzi === '没有' ? ['verb', 'adj', 'noun'] : ['verb', 'adj'];

                if (!next || !allowedFollowers.includes(nextType || '')) {
                    const errorMsg = card.hanzi === '没有'
                        ? `Grammar: '没有' must be followed by a Noun, Verb, or Adjective.`
                        : `Grammar: Modifier '${card.hanzi}' must be followed by a Verb or Adjective.`;
                    return { isValid: false, error: errorMsg };
                }
            }
        }

        // 4. Transitivity & Termination Logic
        const lastCard = cards[lastIdx];
        if (lastCard.isTransitive) {
            return { isValid: false, error: `Incomplete Thought: Transitive verb '${lastCard.hanzi}' needs an object.` };
        }

        // 5. Semantic Flow (Time/Pronoun Ordering)
        const timeCards = cards.filter(c => c.isTime);
        const pronounCards = cards.filter(c => c.isPronoun);

        if (timeCards.length > 0 && pronounCards.length > 0) {
            const startCard = cards[0];
            if (!startCard.isTime && !startCard.isPronoun) {
                return { isValid: false, error: "Word Order: When using Time and Pronoun, one must start the sentence." };
            }
        }

        // 6. Redundant Question check
        const questionWords = ['谁', '什么', '哪里', '为什么', '怎么', '几'];
        const hasInterrogative = cards.some(c => questionWords.includes(c.hanzi));
        const hasMa = cards.some(c => c.hanzi === '吗');
        if (hasInterrogative && hasMa) {
            return { isValid: false, error: "Question Error: Don't use 'who/what' and 'ma' together." };
        }

        return { isValid: true, error: null };
    };

    // --- NETWORK LOGIC ---

    // Room ID Generator
    const generateRoomId = () => Math.random().toString(36).substring(2, 6).toUpperCase();

    const createLobby = async (playerName: string) => {
        const id = generateRoomId();
        const initialPlayers = [{
            id: 1,
            name: playerName + " (Host)",
            hand: [],
            melds: [],
            score: 0,
            isHost: true
        }];

        const roomState: any = {
            state: {
                players: initialPlayers,
                deckCount: 0,
                discardPile: [],
                currentTurn: 0,
                phase: 'DRAW',
                roomLocked: false,
                lastUpdated: serverTimestamp(),
                hostId: id // Using roomID as Host reference for simplicity
            },
            members: {
                1: playerName
            }
        };

        try {
            console.log("Attempting to create lobby with ID:", id);
            await set(ref(db, `rooms/${id}`), roomState);
            console.log("Lobby created successfully!");

            // LOCAL STATE INIT (Avoid blank screen before sync)
            setPlayers(initialPlayers);
            setRoomId(id);
            setRole('HOST');
            setMode('LOBBY');
            setMyPlayerId(1);
        } catch (err: any) {
            console.error("Firebase Create Lobby Error:", err);
            triggerMessage(`Failed to create room: ${err.message || 'Unknown error'}`);
        }
    };

    const joinLobby = async (targetRoomId: string, playerName: string) => {
        const id = targetRoomId.toUpperCase();
        const roomRefObj = ref(db, `rooms/${id}`);

        onValue(roomRefObj, (snapshot) => {
            const data = snapshot.val();
            if (!data) {
                triggerMessage("Room not found!");
                return;
            }

            if (data.state.roomLocked) {
                triggerMessage("Room is already in progress!");
                return;
            }

            const currentPlayers = data.state.players || [];
            if (currentPlayers.length >= 4) {
                triggerMessage("Room is full!");
                return;
            }

            // If I'm not already in the players list, join
            const existingPlayer = currentPlayers.find((p: any) => p.name === playerName);
            if (!existingPlayer && role === 'OFFLINE') {
                const newPlayerId = currentPlayers.length + 1;
                const newPlayer: Player = {
                    id: newPlayerId,
                    name: playerName,
                    hand: [],
                    melds: [],
                    score: 0,
                    isHost: false
                };

                const updatedPlayers = [...currentPlayers, newPlayer];
                update(ref(db, `rooms/${id}/state`), { players: updatedPlayers });
                update(ref(db, `rooms/${id}/members`), { [newPlayerId]: playerName });

                setMyPlayerId(newPlayerId);
                setRoomId(id);
                setRole('CLIENT');
                setMode('LOBBY');
            }
        }, { onlyOnce: true });
    };

    // HOST AUTHORITY ENGINE
    useEffect(() => {
        if (role !== 'HOST' || !roomId) return;

        const actionsRefObj = ref(db, `rooms/${roomId}/actions`);
        const unsubscribe = onChildAdded(actionsRefObj, (snapshot) => {
            const actionEntry = snapshot.val();
            if (actionEntry) {
                processAction(actionEntry.action, actionEntry.playerId);
                // Clean up the action after processing
                remove(ref(db, `rooms/${roomId}/actions/${snapshot.key}`));
            }
        });

        return () => unsubscribe();
    }, [role, roomId, players, deck, discardPile, currentTurn, phase]);

    // CLIENT SYNC ENGINE
    useEffect(() => {
        if (!roomId || role === 'OFFLINE') return;

        const stateRef = ref(db, `rooms/${roomId}/state`);
        const unsubscribe = onValue(stateRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setPlayers(data.players || []);
                // CRITICAL: Only clients should update local deck from sync data
                // The HOST is the source of truth and must keep the full deck data
                if (role === 'CLIENT') {
                    setDeck(new Array(data.deckCount).fill({}));
                }
                setDiscardPile(data.discardPile || []);
                setCurrentTurn(data.currentTurn);
                setPhase(data.phase);
                setChallengeState(data.challenge || null);
                if (mode === 'LOBBY' && data.roomLocked) {
                    setMode('SANDBOX');
                }
            }
        });

        return () => unsubscribe();
    }, [roomId, mode, role]);


    const broadcastState = useCallback((
        currentPlayers: Player[],
        currentPhase: Phase,
        currentTurnIdx: number,
        currentDiscard: CardData[],
        currentDeckLen: number,
        locked: boolean = true,
        challenge: SyncStatePayload['challenge'] | null = null
    ) => {
        if (role !== 'HOST' || !roomId) return;

        // Clean payload of undefined values for Firebase
        const cleanPayload = JSON.parse(JSON.stringify({
            players: [...currentPlayers],
            deckCount: currentDeckLen,
            discardPile: currentDiscard,
            currentTurn: currentTurnIdx,
            phase: currentPhase,
            roomLocked: locked,
            lastUpdated: Date.now(), // Fallback to Date.now if serverTimestamp is tricky in nested updates
            challenge: challenge
        }));

        console.log(`[Host] Broadcasting State: Phase=${currentPhase}, Turn=${currentTurnIdx}`);
        update(ref(db, `rooms/${roomId}/state`), cleanPayload);
    }, [role, roomId]);

    const dispatchAction = (action: ActionPayload) => {
        if (role === 'CLIENT') {
            push(ref(db, `rooms/${roomId}/actions`), {
                playerId: myPlayerId,
                action: action,
                timestamp: serverTimestamp()
            });
        } else if (role === 'HOST') {
            processAction(action, myPlayerId);
        } else {
            processAction(action, myPlayerId);
        }
    };

    const finalizeMeld = useCallback((cardsToMeld: CardData[]) => {
        if (role !== 'HOST') return;

        console.log("[Host] Finalizing Meld:", cardsToMeld.map(c => c.hanzi).join(''));
        const activePIdx = currentTurn;
        const activeP = players[activePIdx];
        if (!activeP) return;

        const meldScore = calculateMeldScore(cardsToMeld);

        let currentDeck = [...deck];
        const cardsNeeded = 11 - (activeP.hand?.length || 0);

        let newHand = activeP.hand ? activeP.hand.filter(c => !cardsToMeld.includes(c)) : [];
        if (cardsNeeded > 0) {
            const drawnCards = currentDeck.slice(0, cardsNeeded);

            // Verify Tile Structure: Ensure the deck data actually exists
            const validDrawnCards = drawnCards.filter(tile => {
                const isValid = tile && tile.hanzi && tile.pinyin && tile.type;
                if (!isValid) {
                    console.error("[Host] Detected corrupted/empty tile in deck during refill:", tile);
                }
                return isValid;
            });

            console.log('[Host] Refilling hand with drawn cards:', validDrawnCards);

            newHand = [...newHand, ...validDrawnCards];
            currentDeck = currentDeck.slice(cardsNeeded);
        }

        const updatedPlayers = players.map((p, idx) => {
            if (idx !== activePIdx) return p;
            const currentMelds = Array.isArray(p.melds) ? p.melds : [];
            return {
                ...p,
                hand: newHand,
                melds: [...currentMelds, cardsToMeld],
                score: p.score + meldScore
            };
        });

        triggerMessage(`Score Awarded: ${meldScore}pts!`);

        // Move to Discard phase after successful meld
        // CRITICAL: Clear the challenge state to remove overlays for everyone
        broadcastState(updatedPlayers, 'DISCARD', currentTurn, discardPile, currentDeck.length, true, null);
        setPlayers(updatedPlayers);
        setDeck(currentDeck);
        setPhase('DISCARD');
    }, [role, currentTurn, players, deck, discardPile, broadcastState]);

    const resolveChallenge = useCallback(() => {
        if (role !== 'HOST' || !challengeState) return;
        const votes = Object.values(challengeState.votes);
        const acceptCount = votes.filter(v => v === true).length;
        const rejectCount = votes.filter(v => v === false).length;

        console.log(`[Host] Resolving Challenge: Accept(${acceptCount}) vs Reject(${rejectCount})`);

        if (acceptCount >= rejectCount) {
            triggerMessage("Challenge Failed! Meld Accepted.");
            finalizeMeld(challengeState.meld);
        } else {
            triggerMessage("Challenge Successful! Meld Rejected.");
            const newPlayers = players.map((p, idx) => {
                if (idx !== currentTurn || !p) return p;
                const currentHand = p.hand || [];
                return { ...p, hand: [...currentHand, ...challengeState.meld] };
            });
            broadcastState(newPlayers, 'DISCARD', currentTurn, discardPile, deck.length, true, null);
        }
    }, [role, challengeState, players, currentTurn, discardPile, deck.length, broadcastState, finalizeMeld]);

    // HOST TIMER ENGINE (Challenge Window)
    useEffect(() => {
        if (role !== 'HOST' || !roomId || phase !== 'CHALLENGE' || !challengeState) return;

        console.log(`[Host] Challenge timer started (setInterval). Target: ${challengeState.endTime}`);

        const timer = setInterval(() => {
            const now = Date.now();
            if (now >= challengeState.endTime) {
                console.log("[Host] Challenge window expired. Finalizing state...");
                clearInterval(timer);
                if (challengeState.status === 'CHALLENGED') {
                    resolveChallenge();
                } else {
                    finalizeMeld(challengeState.meld);
                }
            }
        }, 1000); // Check every second

        return () => {
            console.log("[Host] Cleaning up challenge timer");
            clearInterval(timer);
        };
    }, [role, roomId, phase, challengeState, resolveChallenge, finalizeMeld]);

    const processAction = (action: ActionPayload, actorId: number) => {
        if (role === 'CLIENT') return;

        let newPlayers = [...players];
        let newDiscard = [...discardPile];
        let newDeck = [...deck];
        let newPhase = phase;
        let newTurn = currentTurn;

        const activePIdx = currentTurn;
        const activeP = newPlayers[activePIdx];

        if (!activeP) return; // Prevent crashes if player doesn't exist

        // Check for Challenge Actions
        if (action.actionType === 'CHALLENGE') {
            if (phase !== 'CHALLENGE' || !challengeState) return;
            if (actorId === activeP.id) return;
            const updatedChallenge = {
                ...challengeState,
                challengerId: actorId,
                status: 'CHALLENGED' as const,
                endTime: Date.now() + 10000
            };
            broadcastState(players, 'CHALLENGE', currentTurn, newDiscard, newDeck.length, true, updatedChallenge);
            return;
        }

        if (action.actionType === 'VOTE') {
            if (phase !== 'CHALLENGE' || !challengeState || challengeState.status !== 'CHALLENGED') return;
            const updatedVotes = { ...challengeState.votes, [actorId]: action.data as boolean };
            const updatedChallenge = { ...challengeState, votes: updatedVotes };
            broadcastState(players, 'CHALLENGE', currentTurn, newDiscard, newDeck.length, true, updatedChallenge);
            return;
        }

        switch (action.actionType) {
            case 'DRAW_DECK':
                if (phase !== 'DRAW') return;
                if (newDeck.length === 0) return;

                newPlayers[currentTurn] = { ...newPlayers[currentTurn], hand: [...(newPlayers[currentTurn]?.hand || []), newDeck[0]] };
                console.log("Hand updated:", newPlayers[currentTurn]?.hand);

                newDeck = newDeck.slice(1);

                // Immediate broadcast and local update to sync draw and clear any stale challenge
                broadcastState(newPlayers, 'MELD', currentTurn, newDiscard, newDeck.length, true, null);
                setPlayers(newPlayers);
                setDeck(newDeck);
                setPhase('MELD');
                return;

            case 'DRAW_DISCARD':
                if (phase !== 'DRAW') return;
                if (newDiscard.length === 0) return;

                newPlayers[currentTurn] = { ...newPlayers[currentTurn], hand: [...(newPlayers[currentTurn]?.hand || []), newDiscard[0]] };

                newDiscard = newDiscard.slice(1);

                // Immediate broadcast and local update to sync draw and clear any stale challenge
                broadcastState(newPlayers, 'MELD', currentTurn, newDiscard, newDeck.length, true, null);
                setPlayers(newPlayers);
                setDiscardPile(newDiscard);
                setPhase('MELD');
                return;

            case 'MELD':
                const sequence: SelectionItem[] = action.data;
                const cardsToMeld = sequence.map(item => {
                    if (item.type === 'HAND') return activeP.hand[item.identifier as number];
                    const t = DECK_MANIFEST.find(c => c.id === item.identifier);
                    return t ? { ...t, id: `PU-${t.id}-${Date.now()}` } : null;
                }).filter((c): c is CardData => !!c);

                const indicesToRemove = sequence.filter(item => item.type === 'HAND').map(item => item.identifier as number);

                // --- STAGE 1: AUTOMATED APP VALIDATION (Your Gold Standard) ---
                if (mode === 'LESSON' && activeLesson) {
                    const fullSentence = cardsToMeld.map(c => c.hanzi).join('');
                    const currentProb = activeLesson.problems[currentProblemIndex];
                    if (currentProb.solutions.includes(fullSentence)) {
                        triggerMessage(`✨ Correct! +100pts`);
                        const nextIndex = currentProblemIndex + 1;

                        const updatedPlayers = players.map((p, idx) => {
                            if (idx !== currentTurn) return p;
                            return { ...p, score: p.score + 100, hand: [] }; // Clear hand for lesson transition
                        });

                        if (nextIndex < activeLesson.problems.length) {
                            setCurrentProblemIndex(nextIndex);
                            setHintLevel(0);
                            const nextProb = activeLesson.problems[nextIndex];
                            const { riggedHand, remainingDeck } = dealLessonHand(activeLesson, nextProb);

                            // We need to update the hand for the next problem
                            const readyPlayers = updatedPlayers.map((p, idx) => {
                                if (idx !== currentTurn) return p;
                                return { ...p, hand: riggedHand };
                            });

                            setPlayers(readyPlayers);
                            setDeck(remainingDeck);
                            // Initial broadcast if needed, but LESSON is mostly OFFLINE
                        } else {
                            triggerMessage(`🏆 Lesson Complete!`);
                            setMode(null);
                        }
                        return;
                    }
                    else {
                        triggerMessage("❌ Grammatically incorrect or word order is off.");
                        return;
                    }
                } else {
                    // SANDBOX VALIDATION (App Check)
                    const validation = validateSandboxMeld(cardsToMeld);
                    if (!validation.isValid) {
                        triggerMessage(`⚠️ ${validation.error}`);
                        return; // Rejects immediately; turn doesn't advance
                    }

                    // --- STAGE 2: MULTIPLAYER CONSENSUS LOOP ---
                    if (role === 'HOST' && players.length > 1) {
                        // Remove cards from hand visually before the review
                        const updatedPlayers = players.map((p, idx) => {
                            if (idx !== currentTurn) return p;
                            return { ...p, hand: p.hand.filter((_, i) => !indicesToRemove.includes(i)) };
                        });

                        const challenge: SyncStatePayload['challenge'] = {
                            meld: cardsToMeld,
                            challengerId: null,
                            status: 'PENDING',
                            endTime: Date.now() + 5000,
                            votes: {}
                        };

                        newPhase = 'CHALLENGE';
                        broadcastState(updatedPlayers, 'CHALLENGE', currentTurn, newDiscard, newDeck.length, true, challenge);
                        return;
                    } else {
                        // Offline or Solo Sandbox: Award points immediately
                        const meldScore = calculateMeldScore(cardsToMeld);
                        const updatedPlayers = players.map((p, idx) => {
                            if (idx !== currentTurn) return p;
                            const currentMelds = Array.isArray(p.melds) ? p.melds : [];
                            return {
                                ...p,
                                melds: [...currentMelds, cardsToMeld],
                                hand: p.hand.filter((_, i) => !indicesToRemove.includes(i)),
                                score: p.score + meldScore
                            };
                        });

                        triggerMessage(`✅ Correct Construction! +${meldScore}pts`);
                        newPlayers = updatedPlayers;
                        newPhase = 'DISCARD';
                    }
                }
                break;

            case 'SKIP':
                // CRITICAL: Clear the challenge state to remove overlays for everyone
                broadcastState(players, 'DISCARD', currentTurn, discardPile, deck.length, true, null);
                setPlayers(players);
                setPhase('DISCARD');
                return;

            case 'DISCARD':
                const indexToDiscard: number = action.data;
                const discardedCard = players[currentTurn].hand[indexToDiscard];
                newPlayers = players.map((p, idx) => {
                    if (idx !== currentTurn) return p;
                    return { ...p, hand: p.hand.filter((_, i) => i !== indexToDiscard) };
                });
                newDiscard = [discardedCard, ...discardPile];
                if (players.length > 1) newTurn = (currentTurn + 1) % players.length;
                newPhase = 'DRAW';
                break;

            case 'SORT':
                const typeOrder: Record<WordType, number> = { 'noun': 1, 'verb': 2, 'adj': 3, 'grammar': 4, 'wild': 5 };
                newPlayers = players.map((p, idx) => {
                    if (idx !== currentTurn) return p;
                    return {
                        ...p,
                        hand: [...p.hand].sort((a, b) => typeOrder[a.type] - typeOrder[b.type])
                    };
                });
                break;
        }

        if (role === 'OFFLINE' || mode === 'LESSON') {
            setPlayers(newPlayers);
            setDiscardPile(newDiscard);
            setDeck(newDeck);
            setPhase(newPhase);
            setCurrentTurn(newTurn);
        } else if (role === 'HOST') {
            broadcastState(newPlayers, newPhase, newTurn, newDiscard, newDeck.length, true);
        }
    };

    const dealLessonHand = (lesson: Lesson, problem: any) => {
        const requiredCards = problem.requiredCardIds.map((id: string, idx: number) => {
            const t = DECK_MANIFEST.find(c => c.id === id);
            return t ? { ...t, id: `L-${id}-${idx}` } : null;
        }).filter(Boolean) as CardData[];

        const distractorCount = 6;
        const pool = lesson.vocabularyIds.map(id => DECK_MANIFEST.find(c => c.id === id)).filter(Boolean) as CardData[];
        const distractors = [];
        for (let i = 0; i < distractorCount; i++) {
            const t = pool[Math.floor(Math.random() * pool.length)];
            distractors.push({ ...t, id: `D-${t.id}-${i}` });
        }
        return { riggedHand: [...requiredCards, ...distractors].sort(() => Math.random() - 0.5), remainingDeck: generateDeck(20) };
    };

    const startLesson = (lessonId: string) => {
        const lesson = LESSONS.find(l => l.id === lessonId);
        if (!lesson) return;
        setRole('OFFLINE');
        setCurrentProblemIndex(0);
        setHintLevel(0);
        const { riggedHand, remainingDeck } = dealLessonHand(lesson, lesson.problems[0]);
        setPlayers([{ id: 1, name: 'Student', hand: riggedHand, melds: [], score: 0, isHost: true }]);
        setDeck(remainingDeck);
        setDiscardPile([]);
        setPhase('MELD');
        setMode('LESSON');
        setActiveLesson(lesson);
        setCurrentTurn(0);
        setMyPlayerId(1);
        triggerMessage(`Lesson Start: ${lesson.title}`);
    };

    const getHint = () => {
        if (!activeLesson || mode !== 'LESSON') return;
        setHintLevel(prev => Math.min(prev + 1, 3));
    };

    const startGame = () => {
        if (role !== 'HOST') return;
        const generatedDeck = generateDeck(80);
        let currentCardIndex = 0;
        const dealtPlayers = players.map(p => {
            const hand = generatedDeck.slice(currentCardIndex, currentCardIndex + 10);
            currentCardIndex += 10;
            return { ...p, hand, score: 0 };
        });
        const remainingDeck = generatedDeck.slice(currentCardIndex + 1);
        const initialDiscard = [generatedDeck[currentCardIndex]];

        setDeck(remainingDeck);
        setDiscardPile(initialDiscard);
        setPlayers(dealtPlayers);
        setPhase('DRAW');
        setCurrentTurn(0);
        setMode('SANDBOX');
        broadcastState(dealtPlayers, 'DRAW', 0, initialDiscard, remainingDeck.length, true, null);
    };

    const startOfflineSandbox = () => {
        setRole('OFFLINE');
        const newDeck = generateDeck(80);
        setPlayers([{ id: 1, name: 'Student', hand: newDeck.slice(0, 10), melds: [], score: 0, isHost: true }]);
        setDiscardPile([newDeck[10]]);
        setDeck(newDeck.slice(11));
        setPhase('DRAW');
        setCurrentTurn(0);
        setMode('SANDBOX');
        setMyPlayerId(1);
    };

    const drawFromDeck = () => dispatchAction({ actionType: 'DRAW_DECK' });
    const drawFromDiscard = () => dispatchAction({ actionType: 'DRAW_DISCARD' });
    const confirmMeld = () => { dispatchAction({ actionType: 'MELD', data: selectionQueue }); setSelectionQueue([]); };
    const skipMeld = () => { dispatchAction({ actionType: 'SKIP' }); setSelectionQueue([]); };
    const discardCard = (index: number) => { dispatchAction({ actionType: 'DISCARD', data: index }); setSelectionQueue([]); };
    const sortHand = () => dispatchAction({ actionType: 'SORT' });
    const challengeMeld = () => dispatchAction({ actionType: 'CHALLENGE' });
    const voteMeld = (vote: boolean) => dispatchAction({ actionType: 'VOTE', data: vote });

    const toggleSelect = (index: number) => {
        setSelectionQueue(prev => {
            const existing = prev.find(item => item.type === 'HAND' && item.identifier === index);
            return existing ? prev.filter(item => item !== existing) : [...prev, { type: 'HAND', identifier: index }];
        });
    };

    const togglePowerUp = (id: string) => {
        setSelectionQueue(prev => {
            const existing = prev.find(item => item.type === 'SHELF' && item.identifier === id);
            return existing ? prev.filter(item => item !== existing) : [...prev, { type: 'SHELF', identifier: id }];
        });
    };

    const exitToMenu = () => {
        setMode(null);
        setRoomId('');
        setRole('OFFLINE');
        setSelectionQueue([]);
    };

    return {
        mode, activeLesson, currentProblem, currentProblemIndex, players, currentPlayer, currentTurn, deck, discardPile, phase, selectionQueue, message, role, roomId, myPlayerId, myHand, isMyTurn, activeHint, challengeState, createLobby, joinLobby, startGame, startOfflineSandbox, startLesson, getHint, exitToMenu, drawFromDeck, drawFromDiscard, toggleSelect, togglePowerUp, confirmMeld, skipMeld, discardCard, sortHand, triggerMessage, setSelectionQueue, challengeMeld, voteMeld
    };
};
