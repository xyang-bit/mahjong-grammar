import { useState, useEffect, useRef } from 'react';
import { CardData, Player, WordType, GameMode, Lesson, NetworkRole, NetworkMessage, SyncStatePayload, ActionPayload, SelectionItem } from '../types';
import { generateDeck, DECK_MANIFEST, LESSONS } from '../constants';

// PeerJS global declaration
declare var Peer: any;

type Phase = 'DRAW' | 'MELD' | 'DISCARD';

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
    const [myPeerId, setMyPeerId] = useState<string>('');
    const [myPlayerId, setMyPlayerId] = useState<number>(1);
    const [hostId, setHostId] = useState<string>('');

    const peerRef = useRef<any>(null);
    const connectionsRef = useRef<any[]>([]);
    const hostConnectionRef = useRef<any>(null);

    // Helpers
    const currentPlayer = players[currentTurn];
    const isMyTurn = role === 'OFFLINE' || (players[currentTurn]?.id === myPlayerId);
    const myHand = players.find(p => p.id === myPlayerId)?.hand || [];
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

    // --- STRICT GRAMMAR VALIDATION ENGINE ---
    const validateSandboxMeld = (cards: CardData[]): ValidationResult => {
        if (cards.length < 2) return { isValid: false, error: "Sentence too short (min 2 words)" };

        const hanzis = cards.map(c => c.hanzi);
        const types = cards.map(c => c.type);
        const lastIdx = cards.length - 1;

        // Definitions for Transition Logic
        const particles = ['的', '了', '吗', '过', '呢', '吧', '得'];
        const conjunctions = ['但是', '因为', '所以', '虽然', '可是', '和', '跟'];
        const aspectMarkers = ['了', '过'];
        const questionWords = ['谁', '什么', '哪里', '为什么', '怎么', '几'];

        // 1. Mandatory Predicate Check
        const hasVerb = types.includes('verb');
        const hasAdj = types.includes('adj');
        const hasZai = hanzis.includes('在');
        const hasShi = hanzis.includes('是');
        if (!hasVerb && !hasAdj && !hasZai && !hasShi) {
            return { isValid: false, error: "Nonsense: Every sentence needs a predicate (is, at, an action, or a description)." };
        }

        // 2. Bigram (Transition) Analysis
        for (let i = 0; i < cards.length; i++) {
            const current = hanzis[i];
            const currType = types[i];
            const next = i < lastIdx ? hanzis[i + 1] : null;
            const nextType = i < lastIdx ? types[i + 1] : null;

            if (!next) continue;

            // A. Particle Stacking (e.g., "的的")
            if (particles.includes(current) && particles.includes(next)) {
                return { isValid: false, error: `Invalid Sequence: You cannot place the particle '${next}' after the particle '${current}'.` };
            }

            // B. Conjunction -> Particle (e.g., "但是的")
            if (conjunctions.includes(current) && particles.includes(next)) {
                return { isValid: false, error: `Grammar Error: A conjunction like '${current}' cannot be modified by the particle '${next}'.` };
            }

            // C. Aspect Marker Context (e.g., "晚上了")
            if (aspectMarkers.includes(next)) {
                if (currType !== 'verb' && currType !== 'adj') {
                    return { isValid: false, error: `Misplaced Marker: '${next}' must follow an action or description, not '${current}'.` };
                }
            }

            // D. 'de' (的) Context (e.g., "去的名字")
            if (current === '的' || ['我的', '你的', '他的'].includes(current)) {
                if (nextType === 'verb' && !['想', '喜欢', '要', '爱'].includes(next)) {
                    return { isValid: false, error: `Invalid usage of '${current}': It cannot modify the verb '${next}'.` };
                }
            }

            // E. Noun/Pronoun Clumping (e.g., "我你们")
            const isPronoun = (h: string) => ['我', '你', '他', '她', '我们', '你们', '他们', '您'].includes(h);
            if (isPronoun(current) && isPronoun(next)) {
                return { isValid: false, error: `Sequence Error: You cannot place two pronouns ('${current}' and '${next}') together.` };
            }
        }

        // 3. Question Logic
        const hasInterrogative = hanzis.some(h => questionWords.includes(h));
        const hasMa = hanzis.includes('吗');
        if (hasInterrogative && hasMa) {
            return { isValid: false, error: "Redundant Question: Use a question word ('谁') OR '吗', not both." };
        }
        if (hasMa && hanzis[lastIdx] !== '吗') {
            return { isValid: false, error: "'吗' (ma) must be at the very end of the sentence." };
        }

        // 4. Global Position Checks
        const illegalStarts = ['吗', '了', '的', '和', '过', '呢', '吧', '个', '口'];
        if (illegalStarts.includes(hanzis[0])) return { isValid: false, error: `Invalid Start: Cannot start with '${hanzis[0]}'.` };

        const illegalEnds = ['很', '不', '因为', '虽然', '想', '要', '叫', '姓', '在', '跟', '由于', '但是', '可是', '最'];
        if (illegalEnds.includes(hanzis[lastIdx])) return { isValid: false, error: `Incomplete: '${hanzis[lastIdx]}' cannot be the final word.` };

        return { isValid: true, error: null };
    };

    // --- NETWORK LOGIC ---

    useEffect(() => {
        return () => {
            if (peerRef.current) peerRef.current.destroy();
        };
    }, []);

    const createLobby = (playerName: string) => {
        const peer = new Peer(null, { debug: 2 });
        peerRef.current = peer;

        peer.on('open', (id: string) => {
            setMyPeerId(id);
            setRole('HOST');
            setMode('LOBBY');
            setHostId(id);
            setPlayers([{
                id: 1,
                name: playerName + " (Host)",
                hand: [],
                melds: [],
                score: 0,
                isHost: true,
                peerId: id
            }]);
            setMyPlayerId(1);
        });

        peer.on('connection', (conn: any) => {
            conn.on('data', (data: NetworkMessage) => {
                handleHostReceivedData(data, conn);
            });
            connectionsRef.current.push(conn);
        });
    };

    const joinLobby = (targetHostId: string, playerName: string) => {
        const peer = new Peer(null, { debug: 2 });
        peerRef.current = peer;

        peer.on('open', (id: string) => {
            setMyPeerId(id);
            setRole('CLIENT');
            setHostId(targetHostId);
            setMode('LOBBY');
            const conn = peer.connect(targetHostId);
            hostConnectionRef.current = conn;

            conn.on('open', () => {
                sendToHost({
                    type: 'JOIN_REQUEST',
                    payload: { name: playerName, peerId: id }
                });
            });

            conn.on('data', (data: NetworkMessage) => {
                handleClientReceivedData(data);
            });
        });

        peer.on('error', (err: any) => {
            triggerMessage("Connection Error: " + err.type);
            setMode(null);
        });
    };

    const handleHostReceivedData = (msg: NetworkMessage, _conn: any) => {
        if (msg.type === 'JOIN_REQUEST') {
            const newPlayerId = players.length + 1;
            const newPlayer: Player = {
                id: newPlayerId,
                name: msg.payload.name,
                peerId: msg.payload.peerId,
                hand: [],
                melds: [],
                score: 0,
                isHost: false
            };
            setPlayers(prev => {
                const updated = [...prev, newPlayer];
                setTimeout(() => broadcastState(updated), 100);
                return updated;
            });
            triggerMessage(`${newPlayer.name} joined!`);
        } else if (msg.type === 'ACTION') {
            processAction(msg.payload);
        }
    };

    const handleClientReceivedData = (msg: NetworkMessage) => {
        if (msg.type === 'SYNC_STATE') {
            const state: SyncStatePayload = msg.payload;
            setPlayers(state.players);
            setDiscardPile(state.discardPile);
            setCurrentTurn(state.currentTurn);
            setPhase(state.phase);
            if (mode === 'LOBBY' && (state.phase === 'DRAW' || state.phase === 'MELD')) {
                setMode('SANDBOX');
            }
            const me = state.players.find(p => p.peerId === myPeerId);
            if (me) setMyPlayerId(me.id);
        }
    };

    const broadcastState = (currentPlayers: Player[] = players, currentPhase: Phase = phase, currentTurnIdx: number = currentTurn, currentDiscard: CardData[] = discardPile) => {
        if (role !== 'HOST') return;
        const payload: SyncStatePayload = {
            players: currentPlayers,
            deckCount: deck.length,
            discardPile: currentDiscard,
            currentTurn: currentTurnIdx,
            phase: currentPhase
        };
        const msg: NetworkMessage = { type: 'SYNC_STATE', payload };
        connectionsRef.current.forEach(conn => {
            if (conn.open) conn.send(msg);
        });
    };

    const sendToHost = (msg: NetworkMessage) => {
        if (hostConnectionRef.current && hostConnectionRef.current.open) {
            hostConnectionRef.current.send(msg);
        }
    };

    const dispatchAction = (action: ActionPayload) => {
        if (role === 'CLIENT') {
            sendToHost({ type: 'ACTION', payload: action });
        } else {
            processAction(action);
        }
    };

    const processAction = (action: ActionPayload) => {
        let newPlayers = [...players];
        let newDiscard = [...discardPile];
        let newDeck = [...deck];
        let newPhase = phase;
        let newTurn = currentTurn;

        const activePIdx = currentTurn;
        const activeP = newPlayers[activePIdx];

        switch (action.actionType) {
            case 'DRAW_DECK':
                if (newDeck.length === 0) return;
                activeP.hand = [...activeP.hand, newDeck[0]];
                newDeck.shift();
                newPhase = 'MELD';
                break;

            case 'DRAW_DISCARD':
                if (newDiscard.length === 0) return;
                activeP.hand = [...activeP.hand, newDiscard[0]];
                newDiscard.shift();
                newPhase = 'MELD';
                break;

            case 'MELD':
                const sequence: SelectionItem[] = action.data;
                const cardsToMeld = sequence.map(item => {
                    if (item.type === 'HAND') return activeP.hand[item.identifier as number];
                    else {
                        const t = DECK_MANIFEST.find(c => c.id === item.identifier);
                        return t ? { ...t, id: `PU-${t.id}-${Date.now()}` } : null;
                    }
                }).filter((c): c is CardData => !!c);

                const indicesToRemove = sequence.filter(item => item.type === 'HAND').map(item => item.identifier as number);
                const fullSentence = cardsToMeld.map(c => c.hanzi).join('');

                if (mode === 'LESSON' && activeLesson) {
                    const currentProb = activeLesson.problems[currentProblemIndex];
                    if (currentProb.solutions.includes(fullSentence)) {
                        activeP.score += 100;
                        triggerMessage(`✨ Correct! +100pts`);
                        activeP.hand = [];
                        const nextIndex = currentProblemIndex + 1;
                        if (nextIndex < activeLesson.problems.length) {
                            setCurrentProblemIndex(nextIndex);
                            setHintLevel(0);
                            const nextProb = activeLesson.problems[nextIndex];
                            const { riggedHand, remainingDeck } = dealLessonHand(activeLesson, nextProb);
                            activeP.hand = riggedHand;
                            newDeck = remainingDeck;
                        } else {
                            triggerMessage(`🏆 Lesson Complete! Total Score: ${activeP.score}`);
                            setMode(null);
                            return;
                        }
                    } else {
                        triggerMessage("❌ Grammatically incorrect or word order is off.");
                        return;
                    }
                } else {
                    // SANDBOX VALIDATION
                    const validation = validateSandboxMeld(cardsToMeld);
                    if (!validation.isValid) {
                        triggerMessage(`⚠️ ${validation.error}`);
                        return;
                    }

                    let meldScore = cardsToMeld.length * 20;

                    // Bonus logic
                    const particleList = ['的', '了', '吗', '过', '呢', '得'];
                    let particleCount = 0;
                    cardsToMeld.forEach(c => { if (particleList.includes(c.hanzi)) particleCount++; });
                    meldScore += (particleCount * 10);

                    const hasConnectors = (fullSentence.includes('因为') && fullSentence.includes('所以')) ||
                        (fullSentence.includes('虽然') && fullSentence.includes('但是'));
                    if (hasConnectors) meldScore *= 2;

                    activeP.melds = [...activeP.melds, cardsToMeld];
                    activeP.hand = activeP.hand.filter((_, i) => !indicesToRemove.includes(i));
                    activeP.score += meldScore;

                    if (hasConnectors) triggerMessage(`👑 Multi-clause Bonus! +${meldScore}pts`);
                    else triggerMessage(`✅ Correct Construction! +${meldScore}pts`);
                }
                break;

            case 'SKIP':
                newPhase = 'DISCARD';
                break;

            case 'DISCARD':
                const indexToDiscard: number = action.data;
                const card = activeP.hand[indexToDiscard];
                activeP.hand = activeP.hand.filter((_, i) => i !== indexToDiscard);
                newDiscard = [card, ...newDiscard];
                if (newPlayers.length > 1) newTurn = (newTurn + 1) % newPlayers.length;
                newPhase = 'DRAW';
                break;

            case 'SORT':
                const typeOrder: Record<WordType, number> = { 'noun': 1, 'verb': 2, 'adj': 3, 'grammar': 4, 'wild': 5 };
                activeP.hand.sort((a, b) => typeOrder[a.type] - typeOrder[b.type]);
                break;
        }

        setPlayers(newPlayers);
        setDiscardPile(newDiscard);
        setDeck(newDeck);
        setPhase(newPhase);
        setCurrentTurn(newTurn);

        if (role === 'HOST') broadcastState(newPlayers, newPhase, newTurn, newDiscard);
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
        const generatedDeck = generateDeck(80);
        let currentCardIndex = 0;
        const dealtPlayers = players.map(p => {
            const hand = generatedDeck.slice(currentCardIndex, currentCardIndex + 10);
            currentCardIndex += 10;
            return { ...p, hand, score: 0 };
        });
        setDeck(generatedDeck.slice(currentCardIndex + 1));
        setDiscardPile([generatedDeck[currentCardIndex]]);
        setPlayers(dealtPlayers);
        setPhase('DRAW');
        setCurrentTurn(0);
        setMode('SANDBOX');
        setTimeout(() => broadcastState(dealtPlayers, 'DRAW', 0, [generatedDeck[currentCardIndex]]), 500);
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

    const exitToMenu = () => { setMode(null); if (peerRef.current) peerRef.current.destroy(); setRole('OFFLINE'); setSelectionQueue([]); };

    return {
        mode, activeLesson, currentProblem, currentProblemIndex, players, currentPlayer, currentTurn, deck, discardPile, phase, selectionQueue, message, role, hostId, myPlayerId, myPeerId, myHand, isMyTurn, activeHint, createLobby, joinLobby, startGame, startOfflineSandbox, startLesson, getHint, exitToMenu, drawFromDeck, drawFromDiscard, toggleSelect, togglePowerUp, confirmMeld, skipMeld, discardCard, sortHand, triggerMessage, setSelectionQueue
    };
};
