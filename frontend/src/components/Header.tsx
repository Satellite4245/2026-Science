import React from 'react';
import { Atom, BookOpen, Check, Clock, Volume2, VolumeX } from 'lucide-react';
import type { Stage } from '../types/elements';

interface HeaderProps {
  mode: 'NORMAL' | 'HARDCORE';
  level: number;
  stages: Stage[];
  completedStages: Set<string>;
  timeLeft: number;
  soundEnabled: boolean;
  onModeChange: (nextMode: 'NORMAL' | 'HARDCORE') => void;
  onSelectStage: (lvl: number) => void;
  onOpenSynth: () => void;
  onOpenCodex: () => void;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  level,
  stages,
  completedStages,
  timeLeft,
  soundEnabled,
  onModeChange,
  onSelectStage,
  onOpenSynth,
  onOpenCodex,
  onToggleSound,
}) => {
  const isLowTime = timeLeft <= 30;
  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');

  return (
    <header className="bg-[#111827] border-b border-slate-800 px-4 lg:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
      {/* 브랜드 */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-lg bg-[#182234] border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
          <Atom className="w-5 h-5" aria-hidden="true" />
        </div>
        <div>
          <div className="text-sm font-bold tracking-tight text-slate-100 leading-tight">
            Matter doesn&apos;t matter
          </div>
          <div className="text-[11px] text-slate-400 hidden sm:block">
            원소·소립자 반응 합성 시뮬레이션
          </div>
        </div>
      </div>

      {/* 모드 & 스테이지 */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div
          role="group"
          aria-label="실험 모드 선택"
          className="inline-flex items-center bg-[#0b111e] p-1 rounded-lg border border-slate-800"
        >
          <button
            type="button"
            onClick={() => onModeChange('NORMAL')}
            aria-pressed={mode === 'NORMAL'}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              mode === 'NORMAL'
                ? 'bg-sky-500 text-slate-950'
                : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            일반 화학
          </button>
          <button
            type="button"
            onClick={() => onModeChange('HARDCORE')}
            aria-pressed={mode === 'HARDCORE'}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              mode === 'HARDCORE'
                ? 'bg-sky-500 text-slate-950'
                : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            하드코어
          </button>
        </div>

        <nav aria-label="단계 선택" className="flex flex-wrap items-center gap-1">
          {stages.map((s) => {
            const isCurrent = s.level === level;
            const isDone = completedStages.has(`${mode}-${s.level}`);
            return (
              <button
                key={s.level}
                type="button"
                onClick={() => onSelectStage(s.level)}
                aria-current={isCurrent ? 'step' : undefined}
                aria-label={`${s.level}단계${isDone ? ' (완료)' : ''}`}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors inline-flex items-center gap-1 cursor-pointer tabular-nums whitespace-nowrap ${
                  isCurrent
                    ? 'bg-slate-700/90 text-sky-300 border-sky-400/70'
                    : isDone
                    ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60 hover:bg-emerald-950/60'
                    : 'bg-[#182234] text-slate-400 border-slate-700/70 hover:text-slate-100 hover:border-slate-600'
                }`}
              >
                <span>{s.level}단계</span>
                {isDone && <Check className="w-3 h-3 text-emerald-400" aria-hidden="true" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* 도구 & 타이머 */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onOpenSynth}
          disabled={mode === 'NORMAL'}
          title={
            mode === 'NORMAL'
              ? '하드코어 모드에서 소립자로 원소를 합성할 때 사용합니다'
              : '입자 가속 원소 합성기 열기'
          }
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors whitespace-nowrap ${
            mode === 'HARDCORE'
              ? 'bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border-sky-400/50 cursor-pointer'
              : 'bg-[#0b111e] text-slate-500 border-slate-800 cursor-not-allowed'
          }`}
        >
          <Atom className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{mode === 'HARDCORE' ? '원소 합성기' : '원소 합성기 (하드코어)'}</span>
        </button>

        <button
          type="button"
          onClick={onOpenCodex}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#182234] hover:bg-slate-700/80 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
        >
          <BookOpen className="w-3.5 h-3.5 text-sky-400" aria-hidden="true" />
          <span>반응 도감</span>
        </button>

        <div
          aria-label={`남은 시간 ${minutes}분 ${seconds}초`}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border font-mono text-xs font-bold tabular-nums whitespace-nowrap ${
            isLowTime
              ? 'bg-rose-950/60 border-rose-700/80 text-rose-300'
              : 'bg-[#0b111e] border-slate-800 text-slate-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
          <span>
            {minutes}:{seconds}
          </span>
        </div>

        <button
          type="button"
          onClick={onToggleSound}
          aria-label={soundEnabled ? '효과음 끄기' : '효과음 켜기'}
          title={soundEnabled ? '효과음 켜짐 (클릭해 끄기)' : '효과음 꺼짐 (클릭해 켜기)'}
          className="p-2 rounded-lg bg-[#182234] hover:bg-slate-700/80 border border-slate-700 transition-colors cursor-pointer"
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-sky-400" aria-hidden="true" />
          ) : (
            <VolumeX className="w-4 h-4 text-slate-400" aria-hidden="true" />
          )}
        </button>
      </div>
    </header>
  );
};
