
export type WordType = 'noun' | 'verb' | 'adj' | 'grammar' | 'wild';

export interface CardData {
    id: string;
    hanzi: string;
    pinyin: string;
    en: string;
    type: WordType;
    tier: 'core' | 'lesson';
}

export interface Player {
    id: number;
    peerId?: string; // Network ID
    name: string;
    hand: CardData[];
    melds: CardData[][];
    score: number;
    isHost: boolean;
}

export type GameMode = 'SANDBOX' | 'LESSON' | 'LOBBY';
export type NetworkRole = 'HOST' | 'CLIENT' | 'OFFLINE';

export interface LessonProblem {
    id: string;
    prompt: string; // English Prompt (e.g., "I am a teacher")
    solutions: string[]; // Valid Hanzi strings (e.g., "我是老师")
    requiredCardIds: string[]; // IDs required to solve this to ensure they are dealt
}

export interface Lesson {
    id: string;
    title: string;
    description: string;
    // Master list of vocab for this lesson (used for distractors)
    vocabularyIds: string[];
    problems: LessonProblem[];
}

// NETWORK PAYLOADS
export interface NetworkMessage {
    type: 'JOIN_REQUEST' | 'SYNC_STATE' | 'ACTION';
    payload: any;
}

export interface SyncStatePayload {
    players: Player[];
    deckCount: number;
    discardPile: CardData[];
    currentTurn: number;
    phase: 'DRAW' | 'MELD' | 'DISCARD';
}

export interface SelectionItem {
    type: 'HAND' | 'SHELF';
    identifier: string | number; // index for HAND, id for SHELF
}

export interface ActionPayload {
    actionType: 'DRAW_DECK' | 'DRAW_DISCARD' | 'MELD' | 'SKIP' | 'DISCARD' | 'SORT';
    data?: any; // index, or SelectionItem[]
}
