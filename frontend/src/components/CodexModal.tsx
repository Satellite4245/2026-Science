import React, { useEffect, useId, useRef } from 'react';
import { BookOpen, Flame, Atom, X } from 'lucide-react';
import { REACTION_RULES } from '../data/reactions';
import { ATOMIC_SPECS } from '../types/elements';

interface CodexModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodexModal: React.FC<CodexModalProps> = ({ isOpen, onClose }) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  // Fallback light-dismiss for browsers without native `closedby="any"`
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || 'closedBy' in HTMLDialogElement.prototype) return;

    let pressedOutside = false;
    const isOutside = (e: PointerEvent) => {
      const r = dialog.getBoundingClientRect();
      return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    };

    const handlePointerDown = (e: PointerEvent) => {
      pressedOutside = isOutside(e);
    };
    const handlePointerUp = (e: PointerEvent) => {
      if (pressedOutside && isOutside(e)) {
        dialog.close();
      }
      pressedOutside = false;
    };

    dialog.addEventListener('pointerdown', handlePointerDown);
    dialog.addEventListener('pointerup', handlePointerUp);
    return () => {
      dialog.removeEventListener('pointerdown', handlePointerDown);
      dialog.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  const normalRules = REACTION_RULES.filter((r) => r.category === 'normal');
  const hazardRules = REACTION_RULES.filter((r) => r.category === 'hazard');

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={() => {
        if (dialogRef.current) {
          dialogRef.current.returnValue = '';
        }
        onClose();
      }}
      {...({ closedby: 'any' } as Record<string, string>)}
      className="m-auto w-[min(92vw,42rem)] max-h-[85vh] rounded-2xl bg-[#111827] text-slate-100 border border-slate-700/80 p-0 shadow-2xl overflow-hidden"
    >
      <div className="flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#0d1422] shrink-0">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-sky-400" aria-hidden="true" />
            <h2 id={titleId} className="text-base font-bold text-slate-100">
              화학 반응 &amp; 원소 규격 도감
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="도감 닫기"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex flex-col gap-6 text-sm">
          {/* 일반 화학 반응 */}
          <section className="flex flex-col gap-2.5">
            <h3 className="text-xs font-semibold text-sky-400 uppercase tracking-wider">
              일반 화학 반응 ({normalRules.length}종)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {normalRules.map((rule, index) => (
                <div
                  key={rule.id}
                  className="bg-[#182234] p-3 rounded-xl border border-slate-700/60 flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-slate-100 text-xs">
                      {index + 1}. {rule.title}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-sky-950/80 text-sky-300 border border-sky-800/60">
                        {rule.reactionType}
                      </span>
                      {rule.heatDelta !== 0 && (
                        <span
                          className={`text-[11px] font-mono tabular-nums px-1.5 py-0.5 rounded ${
                            rule.heatDelta < 0
                              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                              : 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                          }`}
                        >
                          과열 {rule.heatDelta > 0 ? `+${rule.heatDelta}%` : `${rule.heatDelta}%`}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-sky-300 font-mono text-xs">{rule.equation}</div>
                  <p className="text-slate-400 text-xs leading-relaxed">{rule.description}</p>
                  <p className="text-slate-300/90 text-[11px] leading-relaxed bg-[#0d1422]/80 border border-slate-800 rounded-lg px-2.5 py-1.5 mt-0.5">
                    <span className="text-sky-400 font-semibold mr-1">원리:</span>
                    {rule.sciencePoint}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 고에너지 & 폭발 반응 */}
          <section className="flex flex-col gap-2.5">
            <h3 className="text-xs font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5" aria-hidden="true" />
              고에너지 &amp; 발열 폭발 반응 ({hazardRules.length}종)
            </h3>
            <div className="flex flex-col gap-2.5">
              {hazardRules.map((rule) => (
                <div
                  key={rule.id}
                  className="bg-rose-950/20 p-3 rounded-xl border border-rose-800/50 flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-rose-200 text-xs">{rule.title}</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-rose-950/70 text-rose-200 border border-rose-800/60">
                        {rule.reactionType}
                      </span>
                      <span className="text-[11px] font-mono tabular-nums bg-rose-950 text-rose-300 border border-rose-800 px-2 py-0.5 rounded">
                        과열 +{rule.heatDelta}%
                      </span>
                    </div>
                  </div>
                  <div className="text-amber-300 font-mono text-xs">{rule.equation}</div>
                  <p className="text-slate-300 text-xs leading-relaxed">{rule.description}</p>
                  <p className="text-slate-300/90 text-[11px] leading-relaxed bg-[#0d1422]/80 border border-rose-900/40 rounded-lg px-2.5 py-1.5 mt-0.5">
                    <span className="text-rose-300 font-semibold mr-1">원리:</span>
                    {rule.sciencePoint}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 원소 합성기 소립자 규격표 */}
          <section className="flex flex-col gap-2.5">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Atom className="w-3.5 h-3.5 text-sky-400" aria-hidden="true" />
              원소 합성기 소립자 규격 (하드코어 모드용)
            </h3>
            <div className="overflow-x-auto rounded-xl border border-slate-700/70 bg-[#182234]">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-700/70 text-slate-400 bg-[#0d1422]">
                    <th scope="col" className="py-2 px-3 font-semibold">원소 / 이온</th>
                    <th scope="col" className="py-2 px-3 font-semibold">기호</th>
                    <th scope="col" className="py-2 px-3 font-semibold text-right">양성자(p⁺)</th>
                    <th scope="col" className="py-2 px-3 font-semibold text-right">중성자(n⁰)</th>
                    <th scope="col" className="py-2 px-3 font-semibold text-right">전자(e⁻)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {ATOMIC_SPECS.map((spec) => (
                    <tr key={spec.name} className="hover:bg-slate-800/40">
                      <td className="py-2 px-3 font-medium text-slate-100">
                        {spec.name}
                        {spec.note && (
                          <span className="ml-1.5 text-[10px] text-slate-400">({spec.note})</span>
                        )}
                      </td>
                      <td className="py-2 px-3 font-mono text-sky-300">{spec.symbol}</td>
                      <td className="py-2 px-3 font-mono tabular-nums text-right text-rose-300">
                        {spec.protons}
                      </td>
                      <td className="py-2 px-3 font-mono tabular-nums text-right text-slate-300">
                        {spec.neutrons}
                      </td>
                      <td className="py-2 px-3 font-mono tabular-nums text-right text-sky-300">
                        {spec.electrons}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </dialog>
  );
};
