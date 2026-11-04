import React from 'react';
import { BookOpen, X } from 'lucide-react';

interface CodexModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodexModal: React.FC<CodexModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
      <div className="bg-[#0f172a] border border-[#203358] rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#203358] bg-[#0d1527]">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-black text-white">화학 반응 & 폭발 가이드</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex flex-col gap-4 text-sm">
          <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">기본 합성 & 중화 반응</div>

          <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 flex flex-col gap-1">
            <div className="font-bold text-white">1. 이온결합 소금 합성</div>
            <div className="text-cyan-300 font-mono text-xs">Na + Cl → NaCl</div>
            <div className="text-slate-400 text-xs">나트륨과 염소의 반응으로 소금을 생성합니다.</div>
          </div>

          <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 flex flex-col gap-1">
            <div className="font-bold text-white">2. 용해 (수용액)</div>
            <div className="text-cyan-300 font-mono text-xs">NaCl + H₂O → NaCl(aq)</div>
            <div className="text-slate-400 text-xs">염화나트륨 결정이 물에 녹아 수용액이 됩니다.</div>
          </div>

          <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 flex flex-col gap-1">
            <div className="font-bold text-white">4. 이산화탄소 & 물 합성 (화학 계수 준수)</div>
            <div className="text-cyan-300 font-mono text-xs">
              C + 2O → CO₂ (탄소 1 + 산소 2)<br />
              2H + O → H₂O (수소 2 + 산소 1)
            </div>
            <div className="text-slate-400 text-xs">화학양론적 원자 개수를 정확히 맞춰야 온전한 분자로 결합합니다. (부족 시 일산화탄소 불안정 혹은 수산화 이온 형성)</div>
          </div>

          <div className="text-xs font-bold text-rose-400 uppercase tracking-wider mt-2">🔥 고에너지 폭발 & 멜트다운 반응</div>

          <div className="bg-rose-950/20 p-3 rounded-xl border border-rose-900/50 flex flex-col gap-1">
            <div className="font-bold text-rose-300 flex items-center justify-between">
              <span>알칼리 금속 수용액 폭발</span>
              <span className="text-[10px] bg-rose-900/80 text-rose-200 px-2 py-0.5 rounded">위험도 +30%</span>
            </div>
            <div className="text-amber-300 font-mono text-xs">나트륨(Na) + 물(H₂O) → 알칼리 폭발재</div>
            <div className="text-slate-300 text-xs">격렬한 발열 반응으로 수소 가스가 연소하며 펑 터집니다!</div>
          </div>

          <div className="bg-rose-950/20 p-3 rounded-xl border border-rose-900/50 flex flex-col gap-1">
            <div className="font-bold text-rose-300 flex items-center justify-between">
              <span>수소 폭명기 점화 폭발</span>
              <span className="text-[10px] bg-rose-900/80 text-rose-200 px-2 py-0.5 rounded">위험도 +40%</span>
            </div>
            <div className="text-amber-300 font-mono text-xs">수소(H) + 산소(O) + 열에너지(🔥) → 초고온 수증기</div>
            <div className="text-slate-300 text-xs">급격한 연쇄 팽창 폭음과 함께 파괴 충격파를 형성합니다.</div>
          </div>

          <div className="bg-purple-950/20 p-3 rounded-xl border border-purple-900/50 flex flex-col gap-1">
            <div className="font-bold text-purple-300 flex items-center justify-between">
              <span>반물질 과밀도 붕괴</span>
              <span className="text-[10px] bg-purple-900/80 text-purple-200 px-2 py-0.5 rounded">위험도 +50%</span>
            </div>
            <div className="text-fuchsia-300 font-mono text-xs">양성자 + 전자 + 열에너지 → 반물질 잔해</div>
            <div className="text-slate-300 text-xs">시공간 왜곡 글리치와 함께 중심부 흡인 폭발이 일어납니다.</div>
          </div>

          <div className="bg-red-950/30 p-3 rounded-xl border border-red-700 flex flex-col gap-1">
            <div className="font-bold text-red-400 flex items-center justify-between">
              <span>임계질량 초과 핵분열 (최종 멜트다운)</span>
              <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded font-bold">CORE CRITICAL</span>
            </div>
            <div className="text-rose-200 font-mono text-xs">우라늄-235 (p:143, n:92, e:92) + 중성자(n)</div>
            <div className="text-red-300 text-xs">
              연쇄 핵분열이 폭발하여 실험실 차폐막 파손 및 전면적 대폭발이 일어납니다! (전자 충돌은 금지)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

