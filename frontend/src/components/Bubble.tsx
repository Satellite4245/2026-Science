import React from 'react';
import { X } from 'lucide-react';
import { ELEMENT_STYLES } from '../types/elements';

interface BubbleProps {
  name: string;
  scale?: number;
  onClick?: () => void;
  onRemove?: () => void;
  decorative?: boolean;
  className?: string;
}

export const Bubble: React.FC<BubbleProps> = ({
  name,
  scale = 1,
  onClick,
  onRemove,
  decorative = false,
  className = '',
}) => {
  const style = ELEMENT_STYLES[name] || {
    symbol: name.substring(0, 3),
    sub: '',
    size: 60,
    bg: 'radial-gradient(circle at 35% 35%, #475569 0%, #334155 70%, #1e293b 100%)',
    border: '#94a3b8',
    textColor: '#f8fafc',
  };

  const size = Math.round(style.size * scale);
  const symLen = (style.symbol || '').length;
  let symRatio = 0.31;
  if (symLen >= 7) symRatio = 0.155;
  else if (symLen >= 5) symRatio = 0.185;
  else if (symLen >= 3) symRatio = 0.22;

  const symbolFontSize = Math.max(10, Math.round(size * symRatio));
  const isInteractive = Boolean(onClick);

  const tokenVisual = (
    <span
      className={`rounded-full relative flex flex-col items-center justify-center shrink-0 overflow-hidden transition-transform duration-150 ${
        isInteractive ? 'hover:scale-[1.04] active:scale-95' : ''
      }`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background: style.bg,
        border: `1.5px solid ${style.border}`,
        boxShadow: '0 4px 12px rgba(2, 6, 23, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.22)',
      }}
    >
      <span
        className="font-bold leading-none z-10 text-center tracking-tight px-1 max-w-[92%] truncate"
        style={{
          fontSize: `${symbolFontSize}px`,
          color: style.textColor,
        }}
      >
        {style.symbol}
      </span>

      {style.sub && size >= 50 && (
        <span
          className="font-semibold leading-none z-10 text-center tracking-tight mt-0.5 max-w-[85%] truncate"
          style={{
            fontSize: `${Math.max(8, Math.round(size * 0.115))}px`,
            color: style.textColor,
            opacity: 0.85,
          }}
        >
          {style.sub}
        </span>
      )}
    </span>
  );

  return (
    <div
      aria-hidden={decorative || undefined}
      className={`relative inline-flex items-center justify-center select-none group ${className}`}
    >
      {isInteractive ? (
        <button
          type="button"
          onClick={onClick}
          aria-label={onRemove ? `${name} 챔버에서 제거` : name}
          className="rounded-full cursor-pointer focus-visible:outline-2 focus-visible:outline-sky-400 focus-visible:outline-offset-2"
        >
          {tokenVisual}
        </button>
      ) : (
        <div aria-label={decorative ? undefined : name} className="rounded-full">
          {tokenVisual}
        </div>
      )}

      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label={`${name} 제거`}
          className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-slate-900 hover:bg-rose-600 text-slate-200 hover:text-white border border-slate-600 hover:border-rose-400 flex items-center justify-center transition-colors shadow-sm z-20 cursor-pointer focus-visible:outline-2 focus-visible:outline-sky-400"
        >
          <X className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
};
