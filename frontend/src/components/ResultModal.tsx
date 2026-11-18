import React, { useEffect, useId, useRef } from 'react';
import { Award, Clock, RotateCcw, ArrowRight, CheckCircle2 } from 'lucide-react';

export type ResultModalState =
  | {
      kind: 'stage_clear';
      target: string;
      timeLeft: number;
      stars: string;
      tier: string;
    }
  | {
      kind: 'course_complete';
      mode: 'NORMAL' | 'HARDCORE';
      target: string;
      timeLeft: number;
      stars: string;
      tier: string;
    }
  | {
      kind: 'timeout';
      stageName: string;
    };

interface ResultModalProps {
  result: ResultModalState | null;
  onRetryStage: () => void;
  onNextStage: () => void;
  onRestartCourse: () => void;
  onSwitchToHardcore: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  result,
  onRetryStage,
  onNextStage,
  onRestartCourse,
  onSwitchToHardcore,
}) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (result && !dialog.open) {
      dialog.showModal();
    } else if (!result && dialog.open) {
      dialog.close();
    }
  }, [result]);

  if (!result) {
    return (
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        className="m-auto w-[min(92vw,26rem)] rounded-2xl bg-[#111827] text-slate-100 border border-slate-700/80 p-0 shadow-2xl"
      />
    );
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
      }}
      onClose={() => {
        const dialog = dialogRef.current;
        if (!result || !dialog) return;
        try {
          if (!dialog.open) {
            dialog.showModal();
          }
        } catch {
          // Ignore if browser disallows reopening without user activation
        }
        if (!dialog.open) {
          if (result.kind === 'stage_clear') {
            onNextStage();
          } else if (result.kind === 'timeout') {
            onRetryStage();
          } else {
            onRestartCourse();
          }
        }
      }}
      {...({ closedby: 'none' } as Record<string, string>)}
      className="m-auto w-[min(92vw,26rem)] rounded-2xl bg-[#111827] text-slate-100 border border-slate-700/80 p-0 shadow-2xl overflow-hidden"
    >
      <div className="p-6 flex flex-col items-center text-center gap-4">
        {result.kind === 'timeout' ? (
          <>
            <div className="w-12 h-12 rounded-full bg-rose-950/80 border border-rose-700/70 flex items-center justify-center text-rose-300">
              <Clock className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <h2 id={titleId} className="text-lg font-bold text-slate-100">
                제한 시간 초과
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                [{result.stageName}]의 제한 시간이 종료되어 실험이 초기화됩니다.
              </p>
            </div>
            <button
              type="button"
              autoFocus
              onClick={onRetryStage}
              className="w-full py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              현재 단계 다시 도전
            </button>
          </>
        ) : result.kind === 'stage_clear' ? (
          <>
            <div className="w-12 h-12 rounded-full bg-emerald-950/80 border border-emerald-700/70 flex items-center justify-center text-emerald-300">
              <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <h2 id={titleId} className="text-lg font-bold text-slate-100">
                연구 과제 완료
              </h2>
              <div className="text-2xl tracking-widest text-amber-400 font-bold mt-2" aria-label={result.tier}>
                {result.stars}
              </div>
            </div>
            <div className="bg-[#182234] border border-slate-700/70 p-3.5 rounded-xl w-full text-xs text-slate-300 flex flex-col gap-1">
              <div>
                목표 물질 <strong className="text-slate-100">{result.target}</strong> 검증 완료
              </div>
              <div className="tabular-nums text-slate-400">남은 시간: {result.timeLeft}초</div>
              <div className="text-sky-300 font-semibold mt-0.5">{result.tier}</div>
            </div>
            <button
              type="button"
              autoFocus
              onClick={onNextStage}
              className="w-full py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              다음 단계로 이동
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-amber-950/80 border border-amber-700/70 flex items-center justify-center text-amber-300">
              <Award className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <h2 id={titleId} className="text-lg font-bold text-slate-100">
                {result.mode === 'NORMAL' ? '일반 화학 과정 모두 완료' : '하드코어 과정 모두 완료'}
              </h2>
              <div className="text-2xl tracking-widest text-amber-400 font-bold mt-2" aria-label={result.tier}>
                {result.stars}
              </div>
            </div>
            <div className="bg-[#182234] border border-slate-700/70 p-3.5 rounded-xl w-full text-xs text-slate-300 flex flex-col gap-1">
              <div>
                최종 과제 <strong className="text-slate-100">{result.target}</strong> 검증 완료
              </div>
              <div className="tabular-nums text-slate-400">남은 시간: {result.timeLeft}초</div>
              <div className="text-sky-300 font-semibold mt-0.5">{result.tier}</div>
            </div>
            <div className="flex flex-col gap-2 w-full">
              {result.mode === 'NORMAL' && (
                <button
                  type="button"
                  autoFocus
                  onClick={onSwitchToHardcore}
                  className="w-full py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm transition-colors cursor-pointer"
                >
                  하드코어 소립자 모드 시작
                </button>
              )}
              <button
                type="button"
                autoFocus={result.mode === 'HARDCORE'}
                onClick={onRestartCourse}
                className={`w-full py-2.5 px-4 rounded-xl font-bold text-sm transition-colors cursor-pointer ${
                  result.mode === 'HARDCORE'
                    ? 'bg-sky-500 hover:bg-sky-400 text-slate-950'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
              >
                1단계부터 다시하기
              </button>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
};
