import React from 'react';
import { ELEMENT_STYLES } from '../types/elements';

interface BubbleProps {
  name: string;
  scale?: number;
  onClick?: () => void;
  onRemove?: () => void;
  className?: string;
}

export const Bubble: React.FC<BubbleProps> = ({
  name,
  scale = 1,
  onClick,
  onRemove,
  className = '',
}) => {
  const style = ELEMENT_STYLES[name] || {
    symbol: name.substring(0, 3),
    sub: '',
    size: 60,
    bg: 'radial-gradient(circle at 35% 35%, #94a3b8 0%, #475569 60%, #1e293b 100%)',
    border: '#94a3b8',
    textColor: '#fff',
  };

  const size = Math.round(style.size * scale);
  const symLen = (style.symbol || '').length;
  let symRatio = 0.32;
  if (symLen >= 7) symRatio = 0.155;
  else if (symLen >= 5) symRatio = 0.185;
  else if (symLen >= 3) symRatio = 0.23;

  const symbolFontSize = Math.max(10, Math.round(size * symRatio));

  return (
    <div className={`relative inline-flex items-center justify-center select-none group ${className}`}>
      <div
        onClick={onClick}
        title={name}
        className="rounded-full relative flex flex-col items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95 shadow-lg overflow-hidden shrink-0"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          background: style.bg,
          border: `2.5px solid ${style.border}`,
          boxShadow: '0 8px 20px -4px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.7), inset 0 -4px 8px rgba(0,0,0,0.3)',
        }}
      >
        {/* 유리 광택 하이라이트 */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            top: '10%',
            left: '14%',
            width: '40%',
            height: '28%',
            background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.2) 75%, transparent 100%)',
            transform: 'rotate(-25deg)',
          }}
        />

        {/* 심볼 */}
        <span
          className="font-extrabold leading-none z-10 text-center tracking-tight drop-shadow-sm px-1 max-w-[90%] truncate"
          style={{
            fontSize: `${symbolFontSize}px`,
            color: style.textColor,
          }}
        >
          {style.symbol}
        </span>

        {/* 서브 레이블 */}
        {style.sub && size >= 48 && (
          <span
            className="font-bold leading-none z-10 text-center tracking-tight mt-0.5 opacity-90 max-w-[85%] truncate"
            style={{
              fontSize: `${Math.max(7, Math.round(size * 0.12))}px`,
              color: style.textColor,
            }}
          >
            {style.sub}
          </span>
        )}
      </div>

      {/* 제거 버튼 */}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-20"
        >
          &times;
        </button>
      )}
    </div>
  );
};

