import React, { useRef, useEffect } from 'react';
import { ATOMIC_REGISTRY } from '../types/elements';
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

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const angleRef = useRef<number>(0);

  useEffect(() => {
    let animId: number;
    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      angleRef.current += 0.03;

      // 오비탈 궤도
      if (e > 0) {
        const orbits = Math.min(4, Math.ceil(e / 4));
        for (let i = 1; i <= orbits; i++) {
          const rx = 35 + i * 18;
          const ry = 18 + i * 10;
          ctx.beginPath();
          ctx.ellipse(cx, cy, rx, ry, (i * Math.PI) / 3, 0, 2 * Math.PI);
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // 전자 위치
          const curAng = angleRef.current * (i % 2 === 0 ? 1 : -1) + i * 1.5;
          const rot = (i * Math.PI) / 3;
          const ex = cx + rx * Math.cos(curAng) * Math.cos(rot) - ry * Math.sin(curAng) * Math.sin(rot);
          const ey = cy + rx * Math.cos(curAng) * Math.sin(rot) + ry * Math.sin(curAng) * Math.cos(rot);

          ctx.beginPath();
          ctx.arc(ex, ey, 3.5, 0, 2 * Math.PI);
          ctx.fillStyle = '#38bdf8';
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // 원자핵 클러스터
      const nucleusRadius = Math.min(28, 10 + (p + n) * 0.15);
      ctx.beginPath();
      ctx.arc(cx, cy, nucleusRadius, 0, 2 * Math.PI);
      const grad = ctx.createRadialGradient(cx - 3, cy - 3, 2, cx, cy, nucleusRadius);
      grad.addColorStop(0, p > 0 ? '#fca5a5' : '#cbd5e1');
      grad.addColorStop(0.7, p > 0 ? '#ef4444' : '#64748b');
      grad.addColorStop(1, '#991b1b');
      ctx.fillStyle = grad;
      ctx.shadowColor = p > 0 ? 'rgba(239, 68, 68, 0.6)' : 'rgba(100, 116, 139, 0.4)';
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;

      animId = requestAnimationFrame(render);
    };

    if (isOpen) {
      animId = requestAnimationFrame(render);
    }
    return () => cancelAnimationFrame(animId);
  }, [isOpen, p, n, e]);

  if (!isOpen) return null;

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
        msg: `🎉 [${prod}] 가속 합성 대성공! (p:${p}, n:${n}, e:${e})`,
      });
      onSynthesized(prod);
    } else {
      sound.playExplosion('small');
      setAlertInfo({
        type: 'danger',
        msg: `💥 입자 불균형 자발붕괴! 유효한 원자 규격이 아닙니다. (p:${p}, n:${n}, e:${e})`,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
      <div className="bg-[#0f172a] border border-[#203358] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#203358] bg-[#0d1527]">
          <div className="flex items-center gap-2">
            <Atom className="w-6 h-6 text-cyan-400" />
            <h2 className="text-lg font-black text-white">입자 가속 원소 합성기</h2>
            <span className="text-xs text-purple-400 bg-purple-950/60 px-2.5 py-1 rounded-md border border-purple-800">
              Particle Collider
            </span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 바디 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* 소립자 컨트롤 */}
          <div className="flex flex-col gap-4">
            {/* 양성자 */}
            <div className="flex flex-col gap-1 bg-[#15223c] p-3 rounded-xl border border-slate-700/60">
              <div className="flex justify-between items-center text-xs font-bold text-rose-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_6px_#ef4444]" />
                  양성자 (Proton, p⁺)
                </span>
                <span className="font-mono text-white text-sm">{p}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                {[-10, -1, 1, 10, 50].map((step) => (
                  <button
                    key={step}
                    onClick={() => handleAdjust('p', step)}
                    className="flex-1 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded border border-slate-700"
                  >
                    {step > 0 ? `+${step}` : step}
                  </button>
                ))}
              </div>
            </div>

            {/* 중성자 */}
            <div className="flex flex-col gap-1 bg-[#15223c] p-3 rounded-xl border border-slate-700/60">
              <div className="flex justify-between items-center text-xs font-bold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shadow-[0_0_6px_#94a3b8]" />
                  중성자 (Neutron, n⁰)
                </span>
                <span className="font-mono text-white text-sm">{n}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                {[-10, -1, 1, 10, 50].map((step) => (
                  <button
                    key={step}
                    onClick={() => handleAdjust('n', step)}
                    className="flex-1 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded border border-slate-700"
                  >
                    {step > 0 ? `+${step}` : step}
                  </button>
                ))}
              </div>
            </div>

            {/* 전자 */}
            <div className="flex flex-col gap-1 bg-[#15223c] p-3 rounded-xl border border-slate-700/60">
              <div className="flex justify-between items-center text-xs font-bold text-cyan-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#38bdf8]" />
                  전자 (Electron, e⁻)
                </span>
                <span className="font-mono text-white text-sm">{e}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                {[-10, -1, 1, 10, 50].map((step) => (
                  <button
                    key={step}
                    onClick={() => handleAdjust('e', step)}
                    className="flex-1 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded border border-slate-700"
                  >
                    {step > 0 ? `+${step}` : step}
                  </button>
                ))}
              </div>
            </div>

            {/* 알림 메시지 */}
            {alertInfo && (
              <div
                className={`text-xs p-2.5 rounded-lg border font-semibold ${
                  alertInfo.type === 'success'
                    ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300'
                    : 'bg-rose-950/60 border-rose-500/60 text-rose-300 animate-pulse'
                }`}
              >
                {alertInfo.msg}
              </div>
            )}

            {/* 합성 버튼 */}
            <button
              onClick={handleSynthesize}
              className="mt-2 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold rounded-xl shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Zap className="w-5 h-5 fill-white" />
              원자핵 충돌 및 합성 실행
            </button>
          </div>

          {/* 원자 오비탈 프리뷰 */}
          <div className="flex flex-col items-center justify-center bg-[#070b13] p-4 rounded-xl border border-slate-800">
            <canvas ref={canvasRef} width={200} height={200} className="rounded-full bg-slate-950/80" />
            <div className="grid grid-cols-3 gap-2 w-full mt-4 font-mono text-center">
              <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                <div className="text-[10px] text-slate-500">원자번호(Z)</div>
                <div className="text-sm font-bold text-white">{p}</div>
              </div>
              <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                <div className="text-[10px] text-slate-500">질량수(A)</div>
                <div className="text-sm font-bold text-white">{p + n}</div>
              </div>
              <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                <div className="text-[10px] text-slate-500">순전하(Net)</div>
                <div className="text-sm font-bold text-white">{p - e > 0 ? `+${p - e}` : p - e}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

