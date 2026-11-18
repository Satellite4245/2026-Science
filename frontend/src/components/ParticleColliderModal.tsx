import React, { useEffect, useId, useRef } from 'react';
import { ATOMIC_REGISTRY, ATOMIC_SPECS } from '../types/elements';
import { sound } from '../utils/sound';
import { Atom, X, Zap } from 'lucide-react';

interface ParticleColliderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSynthesized: (element: string) => void;
}

export const ParticleColliderModal: React.FC<ParticleColliderModalProps> = ({
  isOpen,
  onClose,
  onSynthesized,
}) => {
  const [p, setP] = React.useState<number>(0);
  const [n, setN] = React.useState<number>(0);
  const [e, setE] = React.useState<number>(0);
  const [alertInfo, setAlertInfo] = React.useState<{ type: 'success' | 'danger'; msg: string } | null>(null);

  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const angleRef = useRef<number>(0);
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
    const isOutside = (ev: PointerEvent) => {
      const r = dialog.getBoundingClientRect();
      return ev.clientX < r.left || ev.clientX > r.right || ev.clientY < r.top || ev.clientY > r.bottom;
    };

    const handlePointerDown = (ev: PointerEvent) => {
      pressedOutside = isOutside(ev);
    };
    const handlePointerUp = (ev: PointerEvent) => {
      if (pressedOutside && isOutside(ev)) {
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

  useEffect(() => {
    let animId = 0;
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const drawFrame = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      if (!prefersReducedMotion) {
        angleRef.current += 0.025;
      }

      if (e > 0) {
        const orbits = Math.min(4, Math.ceil(e / 4));
        for (let i = 1; i <= orbits; i++) {
          const rx = 34 + i * 16;
          const ry = 17 + i * 9;
          ctx.beginPath();
          ctx.ellipse(cx, cy, rx, ry, (i * Math.PI) / 3, 0, 2 * Math.PI);
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
          ctx.lineWidth = 1.2;
          ctx.stroke();

          const curAng = angleRef.current * (i % 2 === 0 ? 1 : -1) + i * 1.5;
          const rot = (i * Math.PI) / 3;
          const ex = cx + rx * Math.cos(curAng) * Math.cos(rot) - ry * Math.sin(curAng) * Math.sin(rot);
          const ey = cy + rx * Math.cos(curAng) * Math.sin(rot) + ry * Math.sin(curAng) * Math.cos(rot);

          ctx.beginPath();
          ctx.arc(ex, ey, 3.5, 0, 2 * Math.PI);
          ctx.fillStyle = '#38bdf8';
          ctx.fill();
        }
      }

      const nucleusRadius = Math.min(26, 9 + (p + n) * 0.14);
      ctx.beginPath();
      ctx.arc(cx, cy, nucleusRadius, 0, 2 * Math.PI);
      const grad = ctx.createRadialGradient(cx - 3, cy - 3, 2, cx, cy, nucleusRadius);
      grad.addColorStop(0, p > 0 ? '#f87171' : '#94a3b8');
      grad.addColorStop(0.75, p > 0 ? '#dc2626' : '#475569');
      grad.addColorStop(1, p > 0 ? '#7f1d1d' : '#1e293b');
      ctx.fillStyle = grad;
      ctx.fill();

      if (!prefersReducedMotion) {
        animId = requestAnimationFrame(drawFrame);
      }
    };

    if (isOpen) {
      drawFrame();
    }
    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isOpen, p, n, e]);

  const handleAdjust = (type: 'p' | 'n' | 'e', delta: number) => {
    sound.playClick();
    if (type === 'p') setP((prev) => Math.max(0, Math.min(250, prev + delta)));
    if (type === 'n') setN((prev) => Math.max(0, Math.min(250, prev + delta)));
    if (type === 'e') setE((prev) => Math.max(0, Math.min(250, prev + delta)));
  };

  const handleSynthesize = () => {
    const key = `${p},${n},${e}`;
    if (ATOMIC_REGISTRY[key]) {
      const prod = ATOMIC_REGISTRY[key];
      sound.playSuccess();
      setAlertInfo({
        type: 'success',
        msg: `[${prod}] 합성 완료 (p:${p}, n:${n}, e:${e}) — 보유 품목에 추가되었습니다.`,
      });
      onSynthesized(prod);
    } else {
      sound.playExplosion('small');
      setAlertInfo({
        type: 'danger',
        msg: `규격 불일치 (p:${p}, n:${n}, e:${e}) — 아래 규격표를 참고해 입자 수를 맞추세요.`,
      });
    }
  };

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
      className="m-auto w-[min(94vw,48rem)] max-h-[88vh] rounded-2xl bg-[#111827] text-slate-100 border border-slate-700/80 p-0 shadow-2xl overflow-hidden"
    >
      <div className="flex flex-col max-h-[88vh]">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#0d1422] shrink-0">
          <div className="flex items-center gap-2.5">
            <Atom className="w-5 h-5 text-sky-400" aria-hidden="true" />
            <h2 id={titleId} className="text-base font-bold text-slate-100">
              입자 가속 원소 합성기
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="원소 합성기 닫기"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* 바디 */}
        <div className="p-5 overflow-y-auto flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 소립자 컨트롤 */}
            <div className="flex flex-col gap-3">
              {/* 양성자 */}
              <div className="flex flex-col gap-1.5 bg-[#182234] p-3 rounded-xl border border-slate-700/60">
                <div className="flex justify-between items-center text-xs font-semibold text-rose-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" aria-hidden="true" />
                    양성자 (p⁺)
                  </span>
                  <span className="font-mono tabular-nums text-white text-sm">{p}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {[-10, -1, 1, 10, 50].map((step) => (
                    <button
                      key={step}
                      type="button"
                      onClick={() => handleAdjust('p', step)}
                      className="flex-1 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded border border-slate-700 tabular-nums cursor-pointer"
                    >
                      {step > 0 ? `+${step}` : step}
                    </button>
                  ))}
                </div>
              </div>

              {/* 중성자 */}
              <div className="flex flex-col gap-1.5 bg-[#182234] p-3 rounded-xl border border-slate-700/60">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400" aria-hidden="true" />
                    중성자 (n⁰)
                  </span>
                  <span className="font-mono tabular-nums text-white text-sm">{n}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {[-10, -1, 1, 10, 50].map((step) => (
                    <button
                      key={step}
                      type="button"
                      onClick={() => handleAdjust('n', step)}
                      className="flex-1 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded border border-slate-700 tabular-nums cursor-pointer"
                    >
                      {step > 0 ? `+${step}` : step}
                    </button>
                  ))}
                </div>
              </div>

              {/* 전자 */}
              <div className="flex flex-col gap-1.5 bg-[#182234] p-3 rounded-xl border border-slate-700/60">
                <div className="flex justify-between items-center text-xs font-semibold text-sky-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-400" aria-hidden="true" />
                    전자 (e⁻)
                  </span>
                  <span className="font-mono tabular-nums text-white text-sm">{e}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {[-10, -1, 1, 10, 50].map((step) => (
                    <button
                      key={step}
                      type="button"
                      onClick={() => handleAdjust('e', step)}
                      className="flex-1 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded border border-slate-700 tabular-nums cursor-pointer"
                    >
                      {step > 0 ? `+${step}` : step}
                    </button>
                  ))}
                </div>
              </div>

              {alertInfo && (
                <div
                  role="status"
                  className={`text-xs p-2.5 rounded-lg border font-medium ${
                    alertInfo.type === 'success'
                      ? 'bg-emerald-950/60 border-emerald-700/70 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-700/70 text-rose-200'
                  }`}
                >
                  {alertInfo.msg}
                </div>
              )}

              <button
                type="button"
                onClick={handleSynthesize}
                className="py-2.5 px-4 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Zap className="w-4 h-4" aria-hidden="true" />
                입자 충돌 및 원소 합성
              </button>
            </div>

            {/* 원자 오비탈 프리뷰 */}
            <div className="flex flex-col items-center justify-center bg-[#0b111e] p-4 rounded-xl border border-slate-800">
              <canvas
                ref={canvasRef}
                width={184}
                height={184}
                aria-label={`양성자 ${p}개, 중성자 ${n}개, 전자 ${e}개 모형`}
                className="rounded-full bg-[#090e19]"
              />
              <div className="grid grid-cols-3 gap-2 w-full mt-3 font-mono text-center">
                <div className="bg-[#182234] p-2 rounded-lg border border-slate-800">
                  <div className="text-[11px] text-slate-400">원자번호(Z)</div>
                  <div className="text-sm font-bold tabular-nums text-white">{p}</div>
                </div>
                <div className="bg-[#182234] p-2 rounded-lg border border-slate-800">
                  <div className="text-[11px] text-slate-400">질량수(A)</div>
                  <div className="text-sm font-bold tabular-nums text-white">{p + n}</div>
                </div>
                <div className="bg-[#182234] p-2 rounded-lg border border-slate-800">
                  <div className="text-[11px] text-slate-400">순전하</div>
                  <div className="text-sm font-bold tabular-nums text-white">
                    {p - e > 0 ? `+${p - e}` : p - e}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 합성 가능 원소 규격 가이드 */}
          <div className="bg-[#0d1422] rounded-xl border border-slate-800 p-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-slate-300">
                합성 가능 원소 규격표 (참고용 · 위 버튼으로 입자 수를 맞추세요)
              </h3>
              <span className="text-[11px] text-slate-400">p⁺ / n⁰ / e⁻</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {ATOMIC_SPECS.map((spec) => (
                <div
                  key={spec.name}
                  className="bg-[#182234] border border-slate-700/60 rounded-lg px-2.5 py-2 flex flex-col gap-0.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-100">{spec.name}</span>
                    <span className="font-mono text-sky-300">{spec.symbol}</span>
                  </div>
                  <div className="font-mono tabular-nums text-[11px] text-slate-400">
                    {spec.protons} / {spec.neutrons} / {spec.electrons}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
};
