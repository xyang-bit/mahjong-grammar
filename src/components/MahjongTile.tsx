import React from 'react';
import { CardData } from '../types';

interface TileProps {
    card: CardData;
    onClick?: () => void;
    isSelected?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export const MahjongTile: React.FC<TileProps> = ({ card, onClick, isSelected, size = 'md' }) => {
    if (!card) return null;

    // Dynamic sizing for container
    const sizeClasses = {
        sm: 'w-12 h-16 text-xs',
        md: 'w-20 h-28 text-sm',
        lg: 'w-24 h-32 text-base',
    };

    // Helper to determine optimal font size for Hanzi based on length
    const getHanziSize = () => {
        const len = card.hanzi.length;
        if (size === 'sm') {
            if (len >= 4) return 'text-[0.65rem]';
            if (len === 3) return 'text-[0.75rem]';
            if (len === 2) return 'text-xs';
            return 'text-xl';
        }
        if (size === 'md') {
            if (len >= 4) return 'text-lg'; // e.g. dian zi you jian
            if (len === 3) return 'text-xl'; // e.g. dui bu qi
            if (len === 2) return 'text-3xl'; // e.g. peng you
            return 'text-5xl'; // e.g. wo
        }
        // lg default
        return 'text-5xl';
    };

    // Helper for Pinyin size
    const getPinyinSize = () => {
        const len = card.pinyin.length;
        if (size === 'sm') return 'text-[0.5em]';
        if (len > 10) return 'text-[0.65em]'; // Long pinyin scale down
        return 'text-[0.8em]';
    };

    return (
        <div
            onClick={onClick}
            className={`
        relative flex flex-col items-center justify-center gap-0.5 p-1
        bg-white border-[3px] border-[var(--color-stroke-primary)]
        rounded-[12px] cursor-pointer select-none transition-all duration-100 ease-out overflow-hidden
        type-${card.type}
        ${sizeClasses[size]}
        ${isSelected ? 'ring-4 ring-offset-2 ring-[var(--color-stroke-primary)] -translate-y-4' : 'tactile-press hover:-translate-y-1'}
      `}
            style={{
                boxShadow: isSelected
                    ? '0px 10px 0px var(--color-stroke-primary)'
                    : '', // Managed by CSS class
            }}
        >
            {/* Top: Pinyin (Nunito) */}
            <span className={`font-nunito font-bold text-[var(--color-stroke-primary)] opacity-80 leading-tight text-center w-full break-words ${getPinyinSize()}`}>
                {card.pinyin}
            </span>

            {/* Center: Hanzi (ZCOOL KuaiLe) */}
            <span
                className={`font-zcool leading-none text-center ${getHanziSize()}`}
                style={{ color: 'var(--tile-accent)' }}
            >
                {card.hanzi}
            </span>

            {/* Wildcard Badge */}
            {card.type === 'wild' && (
                <div className="absolute top-0.5 right-0.5 text-[6px] md:text-[8px] bg-[var(--color-wild-purple)] text-white px-1 rounded-full z-10">
                    WIL
                </div>
            )}
        </div>
    );
};
