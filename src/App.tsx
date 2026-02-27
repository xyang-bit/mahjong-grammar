
import { useState } from 'react';
import { MahjongTile } from './components/MahjongTile';
import { useGameLogic } from './hooks/useGameLogic';
import { LESSONS, DECK_MANIFEST, POWER_UP_IDS, BASIC_SHELF_IDS } from './constants';

export default function App() {
    const game = useGameLogic();
    const { currentPlayer, players, mode, role, isMyTurn, myHand, currentProblem, currentProblemIndex, activeLesson } = game;
    const [playerName, setPlayerName] = useState('');
    const [targetRoomId, setTargetRoomId] = useState('');

    // Helper for layout adjustments
    const isBasicShelfVisible = (game.phase === 'MELD' && isMyTurn) || (game.phase === 'DRAW' && isMyTurn);

    // 1. MAIN MENU OVERLAY
    if (!mode) {
        return (
            <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[var(--color-bg-canvas)] p-6 gap-4 overflow-y-auto">
                <div className="text-center">
                    <h1 className="font-zcool text-6xl text-[var(--color-stroke-primary)] animate-bounce">
                        麻将中文
                    </h1>
                    <p className="text-[var(--color-stroke-primary)] font-bold opacity-60">Mahjong Grammar</p>
                </div>

                <div className="main-menu-card flex flex-col gap-6 w-full max-w-md bg-white p-6 shadow-xl">
                    {/* Name Input */}
                    <div>
                        <label className="block text-xs font-bold uppercase text-[var(--color-stroke-primary)] mb-1">
                            Your Name
                            <input
                                name="playerName"
                                id="playerName"
                                type="text"
                                value={playerName}
                                onChange={(e) => setPlayerName(e.target.value)}
                                placeholder="Enter Name..."
                                className="w-full bg-[var(--color-bg-canvas)] border-2 border-[var(--color-stroke-primary)] rounded-lg p-3 font-bold focus:outline-none focus:ring-2 focus:ring-[var(--color-noun-blue)] mt-1"
                            />
                        </label>
                    </div>

                    <div className="h-[2px] bg-[var(--color-stroke-primary)] opacity-10 w-full"></div>

                    {/* Multiplayer Actions */}
                    <div className="space-y-3">
                        <button
                            onClick={() => {
                                if (!playerName) return game.triggerMessage("Enter a name first!");
                                game.createLobby(playerName);
                            }}
                            className="w-full bg-[var(--color-verb-red)] text-white text-lg py-3 rounded-xl border-2 border-[var(--color-stroke-primary)] shadow-[4px_4px_0_var(--color-stroke-primary)] hover:translate-y-1 hover:shadow-none transition-all font-bold"
                        >
                            Host New Game
                        </button>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={targetRoomId}
                                onChange={(e) => setTargetRoomId(e.target.value)}
                                placeholder="Room Code"
                                className="flex-1 bg-[var(--color-bg-canvas)] border-2 border-[var(--color-stroke-primary)] rounded-lg p-3 font-bold uppercase"
                            />
                            <button
                                onClick={() => {
                                    if (!playerName) return game.triggerMessage("Enter a name first!");
                                    if (!targetRoomId) return game.triggerMessage("Enter a room code!");
                                    game.joinLobby(targetRoomId, playerName);
                                }}
                                className="bg-[var(--color-noun-blue)] text-white px-6 rounded-xl border-2 border-[var(--color-stroke-primary)] shadow-[4px_4px_0_var(--color-stroke-primary)] active:shadow-none active:translate-y-1 font-bold"
                            >
                                Join
                            </button>
                        </div>
                    </div>

                    <div className="text-center font-bold text-[var(--color-stroke-primary)] opacity-50 text-xs">- OR -</div>

                    {/* Offline / Lessons */}
                    <button
                        onClick={game.startOfflineSandbox}
                        className="w-full bg-[var(--color-func-yellow)] text-[var(--color-stroke-primary)] py-3 rounded-xl border-2 border-[var(--color-stroke-primary)] font-bold hover:brightness-110"
                    >
                        Offline Practice (Hot Seat)
                    </button>

                    <div className="space-y-2 pt-4">
                        <div className="text-xs font-bold uppercase opacity-50">Lessons</div>
                        <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                            {LESSONS.map((lesson) => (
                                <button
                                    key={lesson.id}
                                    onClick={() => game.startLesson(lesson.id)}
                                    className="w-full bg-[var(--color-bg-canvas)] text-left p-2 rounded-lg border border-[var(--color-stroke-primary)]/30 hover:bg-white hover:border-[var(--color-stroke-primary)] transition-all flex justify-between items-center text-sm"
                                >
                                    <span className="font-bold">{lesson.title}</span>
                                    <span className="opacity-50">Play →</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // 1.5 GLOBAL LOADING GUARD
    if ((mode === 'SANDBOX' || mode === 'LESSON' || mode === 'LOBBY') && (!players || players.length === 0)) {
        const loadingMessage = mode === 'LOBBY' ? 'Initializing Room...' : 'Syncing Table...';
        return (
            <div className="flex flex-col h-screen items-center justify-center bg-[var(--color-bg-canvas)] gap-4">
                <div className="font-zcool text-4xl animate-pulse text-[var(--color-stroke-primary)]">{loadingMessage}</div>
                <div className="text-sm font-bold opacity-50 uppercase tracking-widest text-[var(--color-stroke-primary)]/50">
                    {mode === 'LOBBY' ? 'Preparing your session' : 'Waiting for player data'}
                </div>
            </div>
        );
    }

    // 2. LOBBY STATE
    if (mode === 'LOBBY') {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-[var(--color-bg-canvas)] p-6">
                <div className="bg-white p-8 rounded-2xl border-[3px] border-[var(--color-stroke-primary)] shadow-2xl max-w-lg w-full text-center space-y-6">
                    <div>
                        <h2 className="text-2xl font-zcool mb-2">Lobby</h2>
                        {role === 'HOST' ? (
                            <div className="bg-[var(--color-func-yellow)] p-4 rounded-xl border-2 border-[var(--color-stroke-primary)] border-dashed">
                                <div className="text-xs uppercase font-bold opacity-60">Room Code</div>
                                <div className="text-4xl font-mono font-bold tracking-widest select-all">{game.roomId}</div>
                                <div className="text-xs mt-2 opacity-60">Share this code with players on other iPads</div>
                            </div>
                        ) : (
                            <div className="animate-pulse font-bold text-[var(--color-noun-blue)]">
                                Waiting for Host to start...
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <div className="text-xs font-bold uppercase opacity-50 text-left">Players ({players?.length || 0}/4)</div>
                        {players?.map(p => (
                            <div key={p.id} className="flex items-center gap-3 p-3 bg-[var(--color-bg-canvas)] rounded-lg border border-[var(--color-stroke-primary)]/20">
                                <div className="w-8 h-8 rounded-full bg-[var(--color-noun-blue)] text-white flex items-center justify-center font-bold">
                                    {p.name?.[0] || '?'}
                                </div>
                                <span className="font-bold">{p.name || 'Unknown'} {p.id === game.myPlayerId ? '(You)' : ''}</span>
                                {p.isHost && <span className="text-xs bg-[var(--color-func-yellow)] px-2 py-0.5 rounded text-[var(--color-stroke-primary)] border border-black">HOST</span>}
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button onClick={game.exitToMenu} className="flex-1 py-3 font-bold opacity-50 hover:opacity-100">Leave</button>
                        {role === 'HOST' && (
                            <button
                                onClick={game.startGame}
                                disabled={(players?.length || 0) < 2}
                                className="flex-[2] bg-[var(--color-verb-red)] text-white font-bold py-3 rounded-xl border-2 border-[var(--color-stroke-primary)] shadow-[4px_4px_0_black] active:shadow-none active:translate-y-1 disabled:opacity-50 disabled:shadow-none"
                            >
                                Start Game
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // 4. MAIN GAME UI (ACTIVE)
    return (
        <div className="h-screen w-full flex flex-col bg-[var(--color-bg-canvas)] overflow-hidden">

            {/* GLOBAL TOAST MESSAGE - Updated for better centering and overflow prevention */}
            {game.message && (
                <div className="fixed top-28 left-1/2 -translate-x-1/2 z-50 flex justify-center pointer-events-none w-full px-4 animate-in slide-in-from-top-4">
                    <div className="bg-[var(--color-stroke-primary)] text-white px-6 py-3 rounded-2xl font-bold shadow-2xl border-2 border-white text-center w-auto max-w-[90vw]">
                        {game.message}
                    </div>
                </div>
            )}

            {/* CHALLENGE WINDOW */}
            {game.phase === 'CHALLENGE' && game.challengeState && (game.players?.length > 0) && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--color-bg-canvas)]/90 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                    {(() => {
                        // RECURSIVE UI GUARD: Stop rendering entirely if critical data is missing
                        if (!game.players || game.players.length === 0 || !game.challengeState) return null;

                        return (
                            <div className="bg-white w-full max-w-2xl rounded-3xl border-4 border-[var(--color-stroke-primary)] shadow-[0_12px_0_var(--color-stroke-primary)] p-8 flex flex-col items-center space-y-8">
                                <div className="text-center space-y-2">
                                    <h2 className="text-2xl font-bold uppercase tracking-widest text-[var(--color-verb-red)]">Challenge Window</h2>
                                    <p className="font-bold opacity-60">Is this a valid Chinese sentence?</p>
                                </div>

                                {/* The Sentence */}
                                <div className="flex flex-wrap justify-center gap-4 py-8 px-4 bg-[var(--color-bg-canvas)] rounded-2xl border-2 border-dashed border-[var(--color-stroke-primary)]/20 w-full">
                                    {game.challengeState?.meld?.map((card, idx) => (
                                        <MahjongTile key={idx} card={card} size="lg" />
                                    ))}
                                </div>

                                {/* Timer */}
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-64 h-4 bg-[var(--color-bg-canvas)] rounded-full border-2 border-[var(--color-stroke-primary)] overflow-hidden">
                                        <div
                                            className="h-full bg-[var(--color-verb-red)] transition-all duration-500"
                                            style={{ width: `${Math.max(0, (game.challengeState.endTime - Date.now()) / (game.challengeState.status === 'CHALLENGED' ? 10000 : 5000)) * 100}%` }}
                                        />
                                    </div>
                                    <div className="text-sm font-bold opacity-50">Auto-accepting soon...</div>
                                </div>

                                {/* Peer Review Controls */}
                                <div className="w-full flex flex-col gap-4">
                                    {game.challengeState.status === 'PENDING' ? (
                                        <div className="flex justify-center">
                                            {(game.players?.[game.currentTurn || 0] && game.myPlayerId !== game.players[game.currentTurn || 0]?.id) ? (
                                                <button
                                                    onClick={game.challengeMeld}
                                                    className="bg-[var(--color-verb-red)] text-white px-12 py-4 rounded-2xl border-2 border-[var(--color-stroke-primary)] shadow-[0_6px_0_var(--color-stroke-primary)] active:shadow-none active:translate-y-1 font-bold text-xl hover:brightness-110 transition-all"
                                                >
                                                    Challenge!
                                                </button>
                                            ) : (
                                                <div className="text-[var(--color-noun-blue)] font-bold animate-pulse text-center">
                                                    {game.myPlayerId === game.players?.[game.currentTurn || 0]?.id
                                                        ? "Searching for errors..."
                                                        : "Waiting for peer review..."}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="space-y-6 w-full">
                                            <div className="text-center font-bold text-xl text-[var(--color-verb-red)] animate-bounce italic">
                                                SENTENCE CHALLENGED!
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <button
                                                    onClick={() => game.voteMeld(true)}
                                                    className={`py-6 rounded-2xl border-2 border-[var(--color-stroke-primary)] font-bold text-xl transition-all
                                                ${game.challengeState.votes[game.myPlayerId] === true
                                                            ? 'bg-[var(--color-adj-green)] text-white shadow-none translate-y-1'
                                                            : 'bg-white shadow-[0_6px_0_var(--color-stroke-primary)] hover:brightness-95'}`}
                                                >
                                                    Accept (Valid)
                                                </button>
                                                <button
                                                    onClick={() => game.voteMeld(false)}
                                                    className={`py-6 rounded-2xl border-2 border-[var(--color-stroke-primary)] font-bold text-xl transition-all
                                                ${game.challengeState.votes[game.myPlayerId] === false
                                                            ? 'bg-[var(--color-verb-red)] text-white shadow-none translate-y-1'
                                                            : 'bg-white shadow-[0_6px_0_var(--color-stroke-primary)] hover:brightness-95'}`}
                                                >
                                                    Reject (Error)
                                                </button>
                                            </div>

                                            {/* Vote Status */}
                                            <div className="flex justify-center gap-2">
                                                {game.players?.map(p => {
                                                    const vote = game.challengeState?.votes?.[p.id];
                                                    return (
                                                        <div key={p.id} className={`w-8 h-8 rounded-full border-2 border-[var(--color-stroke-primary)] flex items-center justify-center font-bold text-xs
                                                    ${vote === true ? 'bg-[var(--color-adj-green)] text-white' :
                                                                vote === false ? 'bg-[var(--color-verb-red)] text-white' :
                                                                    'bg-gray-200 opacity-50'}`}>
                                                            {p.name?.[0] || '?'}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>);
                    })()}
                </div>
            )}

            {/* TOP BAR */}
            <header className="flex flex-col bg-[var(--color-bg-canvas)] shadow-sm z-10">
                <div className="p-3 flex justify-between items-center border-b border-[var(--color-stroke-primary)]/10">
                    <button onClick={game.exitToMenu} className="text-xs font-bold underline opacity-50 hover:opacity-100">
                        ← Leave
                    </button>

                    {mode === 'LESSON' && currentProblem ? (
                        <div className="flex flex-col items-center animate-in fade-in slide-in-from-top-4">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-bold text-[var(--color-noun-blue)] uppercase tracking-wider">
                                    Problem {currentProblemIndex + 1} / {activeLesson?.problems.length}
                                </span>
                                <button onClick={game.getHint} className="bg-[var(--color-func-yellow)] rounded-full w-5 h-5 flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 text-xs">
                                    💡
                                </button>
                            </div>
                            <span className="font-zcool text-xl leading-none text-center px-4">
                                {currentProblem.prompt}
                            </span>
                            {/* HINT DISPLAY */}
                            {game.activeHint && (
                                <div className="mt-2 text-sm font-bold text-[var(--color-verb-red)] bg-white/50 px-3 py-1 rounded-lg border border-[var(--color-stroke-primary)]/20 animate-in fade-in slide-in-from-top-2">
                                    💡 {game.activeHint}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <h1 className="font-zcool text-xl text-[var(--color-stroke-primary)]">麻将中文</h1>
                            {role !== 'OFFLINE' && <span className="text-[10px] opacity-50 font-bold">Room: {game.roomId}</span>}
                        </div>
                    )}

                    <div className={`
                px-3 py-1 rounded-full border-2 border-[var(--color-stroke-primary)] font-bold text-xs md:text-sm uppercase tracking-wider
                ${game.phase === 'DRAW' ? 'bg-[var(--color-noun-blue)] text-white' : ''}
                ${game.phase === 'MELD' ? 'bg-[var(--color-func-yellow)] text-[var(--color-stroke-primary)]' : ''}
                ${game.phase === 'DISCARD' ? 'bg-[var(--color-verb-red)] text-white' : ''}
            `}>
                        {game.phase}
                    </div>
                </div>

                {/* Player Strip */}
                <div className="flex justify-between items-center px-4 py-2 bg-[var(--color-bg-surface)]/50 overflow-x-auto no-scrollbar gap-2">
                    {players?.map((p, idx) => {
                        const isActive = idx === game.currentTurn;
                        return (
                            <div
                                key={p.id}
                                className={`
                            flex flex-col items-center justify-center min-w-[70px] p-1 rounded-lg transition-all duration-300 relative
                            ${isActive ? 'bg-white shadow-[0_4px_0_var(--color-noun-blue)] border-2 border-[var(--color-noun-blue)] -translate-y-1' : 'opacity-60 grayscale scale-90'}
                        `}
                            >
                                {p.id === game.myPlayerId && <div className="absolute -top-2 bg-black text-white text-[8px] px-1 rounded">YOU</div>}
                                <div className="text-xs font-bold text-[var(--color-stroke-primary)] mb-1 truncate max-w-[60px]">{p.name}</div>

                                <div className="flex gap-2">
                                    {/* Hand Count */}
                                    <div className="flex items-center gap-1 text-[10px] font-bold bg-[var(--color-stroke-primary)] text-white px-2 py-0.5 rounded-full">
                                        <span>🀄</span>
                                        <span>{p.hand?.length || 0}</span>
                                    </div>
                                    {/* Score */}
                                    <div className="flex items-center gap-1 text-[10px] font-bold bg-[var(--color-func-yellow)] text-[var(--color-stroke-primary)] px-2 py-0.5 rounded-full border border-black">
                                        <span>⭐</span>
                                        <span>{p.score || 0}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </header>

            {/* PLAY AREA */}
            <main className="flex-1 overflow-y-auto p-4 space-y-6 pb-96 transition-all duration-300">

                {/* Center Field: Deck & Discard */}
                <section className="flex justify-center items-center gap-8 md:gap-16 py-2 min-h-[140px] max-w-5xl mx-auto w-full">
                    {/* Draw Deck */}
                    <div
                        className={`relative group ${game.phase === 'DRAW' && isMyTurn ? 'cursor-pointer animate-pulse' : 'opacity-50 grayscale cursor-not-allowed'}`}
                        onClick={() => {
                            if (isMyTurn) game.drawFromDeck();
                            else game.triggerMessage("Not your turn!");
                        }}
                    >
                        <div className="w-16 h-24 md:w-20 md:h-28 bg-[var(--color-stroke-primary)] rounded-[12px] flex items-center justify-center text-white font-zcool text-xl border-[3px] border-[var(--color-stroke-primary)] shadow-[0_6px_0_rgba(0,0,0,0.2)] transition-transform group-active:translate-y-1 group-active:shadow-none">
                            <div className="flex flex-col items-center">
                                <span className="text-xl md:text-2xl">🎴</span>
                                <span className="text-xs md:text-sm mt-1">{game.deck?.length || 0}</span>
                            </div>
                        </div>
                        <span className="absolute -bottom-6 w-full text-center text-[10px] md:text-xs font-bold uppercase tracking-wider text-[var(--color-stroke-primary)]">Draw</span>
                    </div>

                    {/* Discard Pile */}
                    <div
                        className={`relative ${game.phase === 'DRAW' && (game.discardPile?.length || 0) > 0 && isMyTurn ? 'cursor-pointer' : 'cursor-default'}`}
                        onClick={() => {
                            if (isMyTurn) game.drawFromDiscard();
                        }}
                    >
                        {(game.discardPile?.length || 0) > 0 ? (
                            <div className="relative">
                                <MahjongTile card={game.discardPile[0]} size="md" />
                                {(game.discardPile?.length || 0) > 1 && (
                                    <div className="absolute top-1 left-1 w-full h-full bg-white border-[3px] border-[var(--color-stroke-primary)] rounded-[12px] -z-10" />
                                )}
                            </div>
                        ) : (
                            <div className="w-16 h-24 md:w-20 md:h-28 border-[3px] border-dashed border-[var(--color-stroke-primary)] rounded-[12px] opacity-30 flex items-center justify-center">
                                <span className="text-2xl opacity-50">♻️</span>
                            </div>
                        )}
                        <span className="absolute -bottom-6 w-full text-center text-[10px] md:text-xs font-bold uppercase tracking-wider text-[var(--color-stroke-primary)]">Market</span>
                    </div>
                </section>

                {/* Melds (The "Table") */}
                <section className="space-y-6 max-w-5xl mx-auto w-full">
                    <div className="flex items-center gap-2 opacity-50">
                        <div className="h-[2px] bg-[var(--color-stroke-primary)] flex-1"></div>
                        <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--color-stroke-primary)]">
                            {mode === 'LESSON' ? 'Your Answer' : 'Table'}
                        </h2>
                        <div className="h-[2px] bg-[var(--color-stroke-primary)] flex-1"></div>
                    </div>

                    <div className="flex flex-col gap-6 items-center">
                        {players?.map((p) => {
                            if ((p?.melds?.length || 0) === 0) return null;
                            return (
                                <div key={p?.id || Math.random()} className="relative bg-white/40 p-3 rounded-2xl border border-[var(--color-stroke-primary)]/10 w-full max-w-2xl">
                                    <div className="absolute -top-3 left-3 bg-[var(--color-stroke-primary)] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                                        {p?.name || 'Unknown'}
                                    </div>
                                    <div className="flex flex-col gap-2 mt-2">
                                        {p.melds?.map((meld, mIdx) => (
                                            <div key={mIdx} className="flex gap-1 overflow-x-auto pb-1 justify-center">
                                                {meld?.map((card) => (
                                                    <MahjongTile key={card.id} card={card} size="sm" />
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

            </main>

            {/* CONTROL BAR */}
            <div className={`
        fixed bottom-80 left-0 w-full px-4 py-2 flex justify-center gap-4 pointer-events-none z-40
        transition-all duration-300
        ${game.phase === 'MELD' && isMyTurn ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
      `}>
                {game.phase === 'MELD' && (
                    <div className="flex gap-4 pointer-events-auto bg-[var(--color-bg-canvas)] p-2 rounded-2xl shadow-xl border-2 border-[var(--color-stroke-primary)]">
                        <button
                            onClick={game.confirmMeld}
                            disabled={(game.selectionQueue?.length || 0) < 1}
                            className="bg-[var(--color-verb-red)] text-white px-6 py-2 rounded-xl font-bold border-2 border-[var(--color-stroke-primary)] shadow-[0_4px_0_#A05D49] active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:shadow-none transition-all"
                        >
                            {mode === 'LESSON' ? 'Submit' : 'Meld'}
                        </button>
                        <button
                            onClick={game.skipMeld}
                            className="bg-[var(--color-bg-surface)] text-[var(--color-stroke-primary)] px-6 py-2 rounded-xl font-bold border-2 border-[var(--color-stroke-primary)] shadow-[0_4px_0_#ccc] active:translate-y-1 active:shadow-none transition-all"
                        >
                            Pass
                        </button>
                    </div>
                )}
            </div>

            {/* STATUS NOTIFICATIONS */}
            {!isMyTurn && (
                <div className="fixed bottom-80 w-full text-center pointer-events-none z-30">
                    <span className="bg-white/80 backdrop-blur text-[var(--color-stroke-primary)] px-4 py-2 rounded-full font-bold text-sm border border-[var(--color-stroke-primary)]">
                        {game.challengeState && game.challengeState.challengerId !== null && game.challengeState.challengerId !== undefined && players?.[game.challengeState.challengerId || 0]
                            ? `Challenged by ${players[game.challengeState.challengerId || 0]?.name || 'Unknown Player'}...`
                            : `Waiting for ${currentPlayer?.name || players?.[game.currentTurn || 0]?.name || 'Unknown Player'}...`}
                    </span>
                </div>
            )}

            {/* NEW: BASIC VOCAB SIDEBAR (Core Verbs) - Left Side */}
            {isBasicShelfVisible && (
                <div className={`
                fixed bottom-60 left-2 flex flex-col items-center p-2 bg-[#8FB996] border-2 border-[#2D5A27] rounded-xl shadow-lg z-40 transition-all
                ${game.phase === 'DRAW' ? 'opacity-50 grayscale pointer-events-none' : ''}
          `}>
                    <div className="text-[#1A3317] text-[10px] font-bold uppercase tracking-wider mb-2">
                        Core Words
                    </div>
                    <div className="grid grid-cols-2 gap-2 max-h-[40vh] overflow-y-auto no-scrollbar p-1">
                        {BASIC_SHELF_IDS.map(id => {
                            const card = DECK_MANIFEST.find(c => c.id === id);
                            if (!card) return null;
                            const isSelected = game.selectionQueue.some(item => item.type === 'SHELF' && item.identifier === id);
                            return (
                                <div key={id} className="scale-[1.05] relative">
                                    <MahjongTile
                                        card={card}
                                        size="sm"
                                        isSelected={isSelected}
                                        onClick={() => {
                                            if (game.phase === 'DRAW') game.triggerMessage("Draw first!");
                                            else game.togglePowerUp(id);
                                        }}
                                    />
                                    {isSelected && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--color-stroke-primary)] text-white text-[10px] px-1.5 rounded-full z-50">
                                            {game.selectionQueue.findIndex(item => item.type === 'SHELF' && item.identifier === id) + 1}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* HAND */}
            <footer className="hand-dock fixed bottom-0 w-full z-30 flex flex-col items-center">

                {/* NEW: GRAMMAR SHELF (POWER UPS) */}
                {((game.phase === 'MELD' && isMyTurn) || (game.phase === 'DRAW' && isMyTurn)) && (
                    <div className={`
                absolute -top-28 bg-[#5D4037] border-2 border-[#D4AF37] p-3 rounded-xl shadow-lg flex flex-col items-center max-w-[95vw] z-50 animate-in slide-in-from-bottom-4 transition-all
                ${game.phase === 'DRAW' ? 'opacity-50 grayscale pointer-events-none' : ''}
            `}>
                        <div className="flex items-center gap-3 mb-1 w-full justify-between px-1">
                            <span className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider">Magic Shelf</span>
                            <span className="text-white/80 text-[10px] font-mono">🔥 +2 Pts | 👑 x2 Mult</span>
                        </div>
                        <div className="flex gap-2 overflow-x-auto w-full no-scrollbar pb-1">
                            {POWER_UP_IDS.map(id => {
                                const card = DECK_MANIFEST.find(c => c.id === id);
                                if (!card) return null;
                                const isSelected = game.selectionQueue.some(item => item.type === 'SHELF' && item.identifier === id);
                                return (
                                    <div key={id} className={`scale-[1.15] mx-1.5 relative ${game.phase === 'DRAW' ? 'cursor-not-allowed' : ''}`}>
                                        <MahjongTile
                                            card={card}
                                            size="sm"
                                            isSelected={isSelected}
                                            onClick={() => {
                                                if (game.phase === 'DRAW') game.triggerMessage("Draw first!");
                                                else game.togglePowerUp(id);
                                            }}
                                        />
                                        {isSelected && (
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--color-stroke-primary)] text-white text-[10px] px-1.5 rounded-full z-50">
                                                {game.selectionQueue.findIndex(item => item.type === 'SHELF' && item.identifier === id) + 1}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                <div className="w-full flex justify-between items-center px-4 py-1">
                    <div className="w-8"></div>
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-1.5 bg-[var(--color-stroke-primary)] opacity-20 rounded-full mb-1"></div>
                        <div className="text-[10px] font-bold text-[var(--color-stroke-primary)] opacity-50 uppercase tracking-widest">
                            YOUR HAND
                        </div>
                    </div>
                    <button
                        onClick={game.sortHand}
                        className="text-[10px] font-bold bg-white/50 hover:bg-white px-2 py-1 rounded border border-[var(--color-stroke-primary)]"
                    >
                        Sort 🧹
                    </button>
                </div>

                <div className="w-full overflow-x-auto pb-6 px-4 no-scrollbar">
                    <div className="flex gap-2 md:gap-4 min-w-max mx-auto px-4 justify-center">
                        {myHand?.map((card, index) => {
                            const isSelected = game.selectionQueue?.some(item => item.type === 'HAND' && item.identifier === index);
                            return (
                                <div key={card?.id || index} className="relative pt-4 transition-all duration-300">
                                    {/* Order Indicator */}
                                    {isSelected && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--color-stroke-primary)] text-white text-[10px] px-1.5 rounded-full z-50">
                                            {game.selectionQueue.findIndex(item => item.type === 'HAND' && item.identifier === index) + 1}
                                        </div>
                                    )}

                                    <div className={`
                            absolute -top-1 left-1/2 -translate-x-1/2 text-xl z-40 transition-all duration-200
                            ${isSelected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
                        `}>
                                        🔻
                                    </div>

                                    <MahjongTile
                                        card={card}
                                        isSelected={isSelected}
                                        onClick={() => {
                                            if (!isMyTurn && role !== 'OFFLINE') {
                                                return game.triggerMessage("Wait for your turn!");
                                            }
                                            if (game.phase === 'MELD') game.toggleSelect(index);
                                            else if (game.phase === 'DISCARD') game.discardCard(index);
                                            else if (game.phase === 'DRAW') game.triggerMessage("Draw first!");
                                        }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </footer>
        </div>
    );
}
