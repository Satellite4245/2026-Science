import React from 'react';
import { Check, Circle } from 'lucide-react';
import { ELEMENT_STYLES, type Stage, type StageStep } from '../types/elements';
import { Bubble } from './Bubble';

interface MissionPanelProps {
  mode: 'NORMAL' | 'HARDCORE';
  stage: Stage;
  inventory: string[];
  chamber: string[];
  isTargetReady: boolean;
}

function isStepDone(
  step: StageStep,
  inventory: string[],
  chamber: string[],
  isTargetReady: boolean,
): boolean {
  const hasItem = (name: string) => inventory.includes(name) || chamber.includes(name);
  if (step.isSubmitStep) {
    return false;
  }
  if (step.checkItem) {
    return hasItem(step.checkItem);
  }
  if (step.checkAllItems) {
    return step.checkAllItems.every((item) => hasItem(item));
  }
  return isTargetReady;
}

export const MissionPanel: React.FC<MissionPanelProps> = ({
  mode,
  stage,
  inventory,
  chamber,
  isTargetReady,
}) => {
  const targetStyle = ELEMENT_STYLES[stage.target];
  const stepStates = stage.steps.map((step) =>
    isStepDone(step, inventory, chamber, isTargetReady),
  );
  const firstPendingIdx = stepStates.findIndex((done) => !done);

  return (
    <section
      aria-label="현재 연구 목표"
      className="bg-[#111827] border border-slate-800 border-l-4 border-l-sky-400 rounded-xl p-3.5 lg:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shrink-0"
    >
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-sky-950/70 text-sky-300 border border-sky-800/70">
            {mode === 'NORMAL' ? '일반' : '하드코어'} · {stage.level}단계
          </span>
          <h1 className="text-base lg:text-lg font-bold text-slate-100 tracking-tight truncate">
            {stage.name}
          </h1>
        </div>

        <p className="text-xs lg:text-sm text-slate-300 leading-relaxed">{stage.desc}</p>

        <div className="text-xs text-amber-300/90 font-medium">{stage.constraint}</div>

        {/* 단계별 합성 체크리스트 */}
        <ol className="flex flex-wrap gap-x-4 gap-y-1.5 pt-1 border-t border-slate-800/80">
          {stage.steps.map((step, idx) => {
            const done = stepStates[idx];
            const isCurrent = idx === firstPendingIdx;
            return (
              <li
                key={step.label}
                className={`inline-flex items-center gap-1.5 text-xs ${
                  done
                    ? 'text-emerald-400'
                    : isCurrent
                    ? 'text-sky-300 font-semibold'
                    : 'text-slate-400'
                }`}
              >
                {done ? (
                  <Check className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                ) : (
                  <Circle className="w-3 h-3 shrink-0" aria-hidden="true" />
                )}
                <span>
                  {idx + 1}. {step.label}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      {/* 목표 물질 표시 */}
      <div className="flex sm:flex-col items-center justify-between sm:justify-center gap-2 sm:pl-4 sm:border-l border-slate-800 shrink-0">
        <div className="flex sm:flex-col items-center gap-2.5 sm:gap-1.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            목표 물질
          </span>
          <Bubble name={stage.target} scale={0.78} />
          <div className="text-left sm:text-center">
            <div className="text-xs font-bold text-slate-100">{stage.target}</div>
            {targetStyle?.symbol && (
              <div className="text-[11px] font-mono text-sky-300">{targetStyle.symbol}</div>
            )}
          </div>
        </div>

        {isTargetReady && (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-700/70">
            목표 준비 완료
          </span>
        )}
      </div>
    </section>
  );
};
