import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  STAGES,
  type Stage,
  ELEMENT_STYLES,
} from './types/elements';
import { Bubble } from './components/Bubble';
import { ParticleColliderModal } from './components/ParticleColliderModal';
import { CodexModal } from './components/CodexModal';
import { sound } from './utils/sound';
import {
  Flame,
  Volume2,
  VolumeX,
  BookOpen,
  Atom,
  RotateCcw,
  Send,
  Sparkles,
  AlertTriangle,
  Radio,
} from 'lucide-react';

export function App() {
  const [mode, setMode] = useState<'NORMAL' | 'HARDCORE'>('NORMAL');
  const [level, setLevel] = useState<number>(1);
  const [inventory, setInventory] = useState<string[]>([]);
  const [chamber, setChamber] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(120);

  // 이펙트 & 게임플레이 상태
  const [combo, setCombo] = useState<number>(0);
  const [comboText, setComboText] = useState<string | null>(null);
  const [heat, setHeat] = useState<number>(0); // 0 ~ 100 위험도 게이지
  const [screenQuake, setScreenQuake] = useState<boolean>(false);
  const [screenShake, setScreenShake] = useState<boolean>(false);
  const [flashColor, setFlashColor] = useState<string | null>(null);
  const [cracked, setCracked] = useState<boolean>(false);
  const [emergencyBanner, setEmergencyBanner] = useState<string | null>(null);

  // 모달 제어
  const [isSynthOpen, setIsSynthOpen] = useState<boolean>(false);
  const [isCodexOpen, setIsCodexOpen] = useState<boolean>(false);
  const [resultModal, setResultModal] = useState<{
    show: boolean;
    stars: string;
    tier: string;
    desc: string;
  } | null>(null);

  // 로그
  const [logs, setLogs] = useState<Array<{ text: string; type: 'info' | 'success' | 'danger' | 'warning' }>>([]);
  const logEndRef = useRef<HTMLDivElement | null>(null);
  const comboTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 현재 스테이지
  const currentStageList = STAGES[mode];
  const currentStage: Stage = currentStageList.find((s) => s.level === level) || currentStageList[0];

  // 스테이지 로드
  const loadStage = (lvl: number, targetMode = mode) => {
    setLevel(lvl);
    const s = STAGES[targetMode].find((x) => x.level === lvl) || STAGES[targetMode][0];
    setInventory([...s.items]);
    setChamber([]);
    setTimeLeft(s.timeLimit);
    setHeat(0);
    setCombo(0);
    setCracked(false);
    setEmergencyBanner(null);
    addLog(`새로운 연구 과제: [${s.name}] 목표: ${s.target}`, 'info');
  };

  useEffect(() => {
    loadStage(1, mode);
  }, [mode]);

  // 타이머
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          sound.playFail();
          alert('⏱️ 제한 시간 초과! 반응물이 분해되어 실험이 실패했습니다.');
          loadStage(level);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [level, mode]);

  // 멜트다운 100% 검사
  useEffect(() => {
    if (heat >= 100) {
      triggerTotalMeltdown();
    }
  }, [heat]);

  // 로그 자동 스크롤
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = (text: string, type: 'info' | 'success' | 'danger' | 'warning' = 'info') => {
    setLogs((prev) => [...prev.slice(-30), { text, type }]);
  };

  // 타격감 & 스파크 연출 트리거
  const triggerImpactEffect = (type: 'normal' | 'fire' | 'hydrogen' | 'void' | 'nuke') => {
    if (type === 'normal') {
      setScreenShake(true);
      setTimeout(() => setScreenShake(false), 300);
      confetti({
        particleCount: 25,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#34d399', '#fde047'],
      });
    } else if (type === 'fire') {
      setScreenShake(true);
      setFlashColor('rgba(249, 115, 22, 0.4)');
      setTimeout(() => setFlashColor(null), 300);
      setTimeout(() => setScreenShake(false), 400);
      confetti({
        particleCount: 50,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#f97316', '#ef4444', '#facc15'],
      });
    } else if (type === 'hydrogen') {
      setScreenShake(true);
      setFlashColor('rgba(56, 189, 248, 0.5)');
      setTimeout(() => setFlashColor(null), 350);
      setTimeout(() => setScreenShake(false), 500);
      confetti({
        particleCount: 70,
        spread: 120,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#0284c7', '#ffffff'],
      });
    } else if (type === 'void') {
      setScreenShake(true);
      setFlashColor('rgba(168, 85, 247, 0.5)');
      setTimeout(() => setFlashColor(null), 400);
      setTimeout(() => setScreenShake(false), 600);
      confetti({
        particleCount: 80,
        spread: 140,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#7e22ce', '#3b0764', '#000000'],
      });
    } else if (type === 'nuke') {
      triggerCatastrophicSequence();
    }
  };

  // 콤보 증가
  const bumpCombo = () => {
    const nextCombo = combo + 1;
    setCombo(nextCombo);
    sound.playCombo(nextCombo);

    if (comboTimerRef.current) clearTimeout(comboTimerRef.current);

    const comboMessages = [
      '',
      '💥 REACTION HIT!',
      '🔥 DOUBLE COMBO!',
      '⚡ TRIPLE BURST!',
      '🌟 QUADRA FUSION!',
      '🚀 OVERDRIVE CRITICAL!',
    ];
    setComboText(comboMessages[Math.min(nextCombo, 5)] || `⚡ x${nextCombo} CHAIN COMBO!`);

    comboTimerRef.current = setTimeout(() => {
      setCombo(0);
      setComboText(null);
    }, 4500);
  };

  // 대폭발 & 방폭 차폐막 파손 시퀀스 (핵폭발 or 멜트다운 100%)
  const triggerCatastrophicSequence = () => {
    sound.playExplosion('nuke');
    setScreenQuake(true);
    setFlashColor('#ffffff');
    setCracked(true);
    setEmergencyBanner('⚠️ DANGER: CORE CONTAINMENT BREACH (연쇄 폭발로 방폭 격벽 파손!) ⚠️');

    confetti({
      particleCount: 150,
      spread: 160,
      origin: { y: 0.5 },
      colors: ['#ef4444', '#f97316', '#ffffff', '#eab308'],
    });

    setTimeout(() => {
      setFlashColor('rgba(239, 68, 68, 0.4)');
      setTimeout(() => setFlashColor(null), 800);
    }, 400);

    setTimeout(() => {
      setScreenQuake(false);
      setTimeout(() => {
        setEmergencyBanner(null);
      }, 5000);
    }, 3500);
  };

  // 과열 게이지 100% 멜트다운
  const triggerTotalMeltdown = () => {
    triggerCatastrophicSequence();
    addLog('🚨 [CORE MELTDOWN] 과열 위험도 100% 도달! 챔버 원소들이 격렬히 폭발하며 소실되었습니다!', 'danger');
    setChamber([]);
    setHeat(0);
  };

  // 원소 추가/제거
  const handleAddToChamber = (item: string) => {
    sound.playDrop();
    setChamber((prev) => [...prev, item]);
  };

  const handleRemoveFromChamber = (idx: number) => {
    sound.playClick();
    setChamber((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleClearChamber = () => {
    if (chamber.length > 0) {
      sound.playClick();
      setChamber([]);
      addLog('반응 챔버를 비웠습니다.', 'info');
    }
  };

  // 반응 처리 엔진
  const handleTriggerReaction = () => {
    if (chamber.length === 0) {
      sound.playFail();
      addLog('반응 챔버가 비어 있습니다.', 'warning');
      return;
    }

    const count = (name: string) => chamber.filter((x) => x === name).length;

    // 1. 제약 조건 검사: 탄소+산소+수소 직접 포도당 금지
    if (count('탄소') >= 1 && count('산소') >= 1 && count('수소') >= 1) {
      sound.playFail();
      addLog('⚠️ 반응 차단: 광합성 경로(CO₂ + H₂O + 빛 에너지)를 거쳐야 포도당을 합성할 수 있습니다!', 'danger');
      return;
    }

    // 2. 제약 조건: 수산화 이온 단독 분해 금지
    if (chamber.length === 1 && chamber[0] === '수산화 이온') {
      sound.playFail();
      addLog('⚠️ 반응 실패: 수산화 이온 단독 분해는 불가능합니다.', 'danger');
      return;
    }

    // 3. 제약 조건: 우라늄 + 전자 충돌 금지
    if (count('우라늄-235') >= 1 && count('전자') >= 1) {
      sound.playFail();
      addLog('⚠️ 반응 차단: 전자를 충돌시켜서는 핵분열을 유도할 수 없습니다! (중성자 충돌 필수)', 'danger');
      return;
    }

    // ----------------------------------------------------
    // [폭발 반응 1] 우라늄-235 + 중성자 = 핵분열 대폭발
    // ----------------------------------------------------
    if (count('우라늄-235') >= 1 && count('중성자') >= 1) {
      replaceChamber(['우라늄-235', '중성자'], ['핵분열 성공']);
      triggerImpactEffect('nuke');
      setHeat((prev) => Math.min(100, prev + 60));
      bumpCombo();
      addLog('💥 임계질량 초과 및 연쇄 핵분열 발생! 연구실 전면 대폭발!', 'danger');
      return;
    }

    // ----------------------------------------------------
    // [폭발 반응 2] 나트륨 + 물 = 알칼리 금속 격렬 폭발
    // ----------------------------------------------------
    if (count('나트륨') >= 1 && count('물') >= 1) {
      replaceChamber(['나트륨', '물'], ['알칼리 폭발재']);
      sound.playExplosion('medium');
      triggerImpactEffect('fire');
      setHeat((prev) => Math.min(100, prev + 35));
      bumpCombo();
      addLog('🔥💥 [알칼리 폭발] 나트륨이 물과 격렬히 반응하며 수소 가스를 분출하고 굉음을 내며 폭발했습니다!', 'danger');
      return;
    }

    // ----------------------------------------------------
    // [폭발 반응 3] 수소 + 산소 + 열에너지 = 수소 폭명기 점화 폭발
    // ----------------------------------------------------
    if (count('수소') >= 1 && count('산소') >= 1 && count('열에너지') >= 1) {
      replaceChamber(['수소', '산소', '열에너지'], ['초고온 수증기']);
      sound.playExplosion('medium');
      triggerImpactEffect('hydrogen');
      setHeat((prev) => Math.min(100, prev + 45));
      bumpCombo();
      addLog('⚡💥 [수소 폭명기 폭발] 열에너지에 의해 수소-산소 혼합 기체가 점화되어 강력한 충격파를 일으켰습니다!', 'danger');
      return;
    }

    // ----------------------------------------------------
    // [폭발 반응 4] 양성자 + 전자 + 열에너지 = 반물질 과밀도 붕괴
    // ----------------------------------------------------
    if (count('양성자') >= 1 && count('전자') >= 1 && count('열에너지') >= 1) {
      replaceChamber(['양성자', '전자', '열에너지'], ['반물질 잔해']);
      sound.playExplosion('medium');
      triggerImpactEffect('void');
      setHeat((prev) => Math.min(100, prev + 50));
      bumpCombo();
      addLog('🌀💥 [반물질 왜곡 붕괴] 고에너지 입자 쌍소멸로 인해 공간 왜곡 글리치 폭발이 일어났습니다!', 'danger');
      return;
    }

    // ----------------------------------------------------
    // [일반 화학 반응 1] 나트륨 + 염소 -> 염화나트륨
    // ----------------------------------------------------
    if (count('나트륨') >= 1 && count('염소') >= 1) {
      replaceChamber(['나트륨', '염소'], ['염화나트륨']);
      triggerImpactEffect('normal');
      setHeat((prev) => Math.min(100, prev + 10));
      bumpCombo();
      addLog('✨ [이온결합] Na + Cl → NaCl 소금 결정 합성 완료!', 'success');
      return;
    }

    // [일반 화학 반응 2] 염화나트륨 + 물 -> 염화나트륨 수용액
    if (count('염화나트륨') >= 1 && count('물') >= 1) {
      replaceChamber(['염화나트륨', '물'], ['염화나트륨 수용액']);
      triggerImpactEffect('normal');
      setHeat((prev) => Math.max(0, prev - 10)); // 흡열/안정화
      bumpCombo();
      addLog('🌊 [용해] NaCl이 물에 녹아 염화나트륨 수용액이 되었습니다.', 'success');
      return;
    }

    // [일반 화학 반응 3] 수소 이온 + 염소 -> 염산
    if (count('수소 이온') >= 1 && count('염소') >= 1) {
      replaceChamber(['수소 이온', '염소'], ['염산']);
      triggerImpactEffect('normal');
      setHeat((prev) => Math.min(100, prev + 15));
      bumpCombo();
      addLog('🧪 [산 합성] H⁺ + Cl → HCl 염산 합성!', 'success');
      return;
    }

    // [일반 화학 반응 4] 나트륨 + 수산화 이온 -> 수산화나트륨
    if (count('나트륨') >= 1 && count('수산화 이온') >= 1) {
      replaceChamber(['나트륨', '수산화 이온'], ['수산화나트륨']);
      triggerImpactEffect('normal');
      setHeat((prev) => Math.min(100, prev + 15));
      bumpCombo();
      addLog('🧪 [염기 합성] Na + OH⁻ → NaOH 수산화나트륨 합성!', 'success');
      return;
    }

    // [일반 화학 반응 5] 염산 + 수산화나트륨 -> 물 + 염화나트륨 (중화반응)
    if (count('염산') >= 1 && count('수산화나트륨') >= 1) {
      replaceChamber(['염산', '수산화나트륨'], ['물', '염화나트륨']);
      triggerImpactEffect('normal');
      setHeat((prev) => Math.min(100, prev + 20)); // 중화열
      bumpCombo();
      addLog('⚖️ [중화반응] HCl + NaOH → H₂O + NaCl 중화 발열반응 성공!', 'success');
      return;
    }

    // [일반 화학 반응 6] 수소 + 산소 -> 수산화 이온
    if (count('수소') === 1 && count('산소') === 1 && chamber.length === 2) {
      replaceChamber(['수소', '산소'], ['수산화 이온']);
      triggerImpactEffect('normal');
      bumpCombo();
      addLog('✨ 수소와 산소가 결합하여 수산화 이온(OH⁻)을 형성하였습니다.', 'success');
      return;
    }

    // [일반 화학 반응 7] 산소 + 수소 -> 물
    if ((count('산소') >= 1 && count('수소') >= 2) || (count('산소') >= 1 && count('수소') >= 1 && chamber.length === 2)) {
      if (count('수소') >= 2) {
        replaceChamber(['산소', '수소', '수소'], ['물']);
      } else {
        replaceChamber(['산소', '수소'], ['물']);
      }
      triggerImpactEffect('normal');
      bumpCombo();
      addLog('💧 [공유결합] 수소와 산소가 반응하여 순수한 물(H₂O)이 합성되었습니다.', 'success');
      return;
    }

    // [일반 화학 반응 8] 탄소 + 산소 -> 이산화탄소
    if (count('탄소') >= 1 && count('산소') >= 1) {
      replaceChamber(['탄소', '산소'], ['이산화탄소']);
      triggerImpactEffect('normal');
      bumpCombo();
      addLog('💨 [산화반응] 탄소가 산화되어 이산화탄소(CO₂) 기체 생성!', 'success');
      return;
    }

    // [일반 화학 반응 9] 탄소 + 열에너지 -> 빛 에너지
    if (count('탄소') >= 1 && count('열에너지') >= 1) {
      replaceChamber(['탄소', '열에너지'], ['빛 에너지']);
      triggerImpactEffect('normal');
      bumpCombo();
      addLog('☀️ [에너지 전환] 연소를 통해 강렬한 빛 에너지(Photon) 방출!', 'success');
      return;
    }

    // [일반 화학 반응 10] 광합성
    if (count('이산화탄소') >= 1 && count('물') >= 1 && count('빛 에너지') >= 1) {
      replaceChamber(['이산화탄소', '물', '빛 에너지'], ['포도당']);
      triggerImpactEffect('normal');
      bumpCombo();
      addLog('🌿 [광합성] CO₂ + H₂O + 빛 에너지 → 포도당(C₆H₁₂O₆) 합성 대성공!', 'success');
      return;
    }

    // 무반응
    sound.playFail();
    addLog('❌ 유효한 반응물이 조합되지 않았습니다. 도감을 확인하세요.', 'warning');
  };

  const replaceChamber = (consumed: string[], produced: string[]) => {
    const nextChamber = [...chamber];
    consumed.forEach((name) => {
      const idx = nextChamber.indexOf(name);
      if (idx !== -1) nextChamber.splice(idx, 1);
    });
    produced.forEach((p) => {
      nextChamber.push(p);
      if (!inventory.includes(p)) {
        setInventory((prev) => [...prev, p]);
      }
    });
    setChamber(nextChamber);
  };

  // 연구 제출
  const handleSubmit = () => {
    if (chamber.includes(currentStage.target)) {
      sound.playSuccess();
      const ratio = timeLeft / currentStage.timeLimit;
      let stars = '★☆☆';
      let tier = '수습 연구원 등급';
      if (ratio >= 0.6) {
        stars = '★★★';
        tier = '수석 연구원 (Master Scientist)';
      } else if (ratio >= 0.3) {
        stars = '★★☆';
        tier = '선임 연구원 (Senior Scientist)';
      }

      confetti({ particleCount: 100, spread: 100, origin: { y: 0.5 } });

      setResultModal({
        show: true,
        stars,
        tier,
        desc: `[${currentStage.target}] 제출 검증 완료! 잔여 시간: ${timeLeft}초`,
      });
    } else {
      sound.playFail();
      addLog(`⚠️ 제출 실패: 챔버에 '${currentStage.target}'이 없습니다!`, 'danger');
    }
  };

  const handleNextStage = () => {
    setResultModal(null);
    if (level < currentStageList.length) {
      loadStage(level + 1);
    } else {
      alert('🎉 모든 과제를 완수하셨습니다! 첫 번째 과제로 돌아갑니다.');
      loadStage(1);
    }
  };

  return (
    <div
      className={`h-screen w-screen flex flex-col bg-[#070b13] text-slate-100 overflow-hidden font-sans relative ${
        screenQuake ? 'quake-active' : ''
      } ${screenShake ? 'shake-active' : ''}`}
    >
      {/* 화면 번쩍임 플래시 오버레이 */}
      {flashColor && (
        <div
          className="fixed inset-0 pointer-events-none z-50 transition-opacity"
          style={{ backgroundColor: flashColor }}
        />
      )}

      {/* 방폭 유리 균열 오버레이 */}
      {cracked && <div className="screen-cracks" />}

      {/* 비상 경보 배너 */}
      {emergencyBanner && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white font-mono font-black text-sm px-6 py-2.5 rounded-xl border-2 border-red-200 shadow-[0_0_40px_rgba(239,68,68,0.9)] animate-pulse flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          <span>{emergencyBanner}</span>
        </div>
      )}

      {/* 콤보 팝업 플로팅 연출 */}
      {comboText && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-40 pointer-events-none flex flex-col items-center animate-bounce">
          <div className="text-3xl md:text-5xl font-black italic tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 drop-shadow-[0_0_20px_rgba(245,158,11,0.8)]">
            {comboText}
          </div>
          <div className="text-xs font-mono font-bold text-amber-300 tracking-widest mt-1">
            HEAT & POWER RUSHING!
          </div>
        </div>
      )}

      {/* 상단 네비게이션 헤더 */}
      <header className="relative z-10 bg-[#0d1527]/90 backdrop-blur-md border-b border-[#203358] px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-900 flex items-center justify-center text-xl shadow-[0_0_16px_rgba(56,189,248,0.4)] border border-white/30">
            ⚛️
          </div>
          <div>
            <div className="text-base font-black tracking-tight bg-gradient-to-r from-slate-100 to-cyan-400 bg-clip-text text-transparent">
              QUANTUM REACTION LAB
            </div>
            <div className="text-[11px] text-slate-400">초고에너지 화학 & 양자 파괴 시뮬레이터</div>
          </div>
        </div>

        {/* 모드 탭 */}
        <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setMode('NORMAL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'NORMAL'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🧪 일반 화학
          </button>
          <button
            onClick={() => setMode('HARDCORE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'HARDCORE'
                ? 'bg-gradient-to-r from-orange-500 to-rose-600 text-white shadow-md shadow-rose-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🔥 하드코어 소립자
          </button>
        </div>

        {/* 스테이지 탭 */}
        <div className="flex items-center gap-1.5">
          {currentStageList.map((s) => (
            <button
              key={s.level}
              onClick={() => loadStage(s.level)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                s.level === level
                  ? 'bg-slate-700 text-cyan-300 border-cyan-500 shadow-sm'
                  : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              L{s.level} ★
            </button>
          ))}
        </div>

        {/* 유틸리티 버튼 */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSynthOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-xs font-bold text-white hover:brightness-110 shadow-md shadow-purple-900/40"
          >
            <Atom className="w-4 h-4" />
            원소 합성기
          </button>

          <div
            className={`flex flex-col items-center px-3 py-1 rounded-lg border font-mono ${
              timeLeft <= 30
                ? 'bg-rose-950/60 border-rose-500 text-rose-300 animate-pulse'
                : 'bg-slate-900 border-slate-700 text-slate-200'
            }`}
          >
            <span className="text-[9px] uppercase tracking-wider text-slate-400">Time</span>
            <span className="text-sm font-bold">
              {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}
            </span>
          </div>

          <button
            onClick={() => {
              sound.enabled = !sound.enabled;
              // 강제 리렌더
              setMode((m) => m);
            }}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
          >
            {sound.enabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
          </button>

          <button
            onClick={() => setIsCodexOpen(true)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700"
          >
            <BookOpen className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 메인 레이아웃 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 좌측 보관함 패널 */}
        <aside className="w-72 bg-[#0d1527]/70 border-r border-[#203358] flex flex-col p-4 gap-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div>
              <div className="text-xs font-extrabold text-white">🎒 실험 보유 품목</div>
              <div className="text-[11px] text-slate-400">클릭하여 반응 챔버로 투입</div>
            </div>
            <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
              {inventory.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1">
            {inventory.map((item, idx) => (
              <div
                key={`${item}-${idx}`}
                onClick={() => handleAddToChamber(item)}
                className="bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/60 p-2.5 rounded-xl flex items-center gap-3 cursor-pointer transition-all hover:translate-x-1"
              >
                <Bubble name={item} scale={0.72} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-extrabold text-white truncate">{item}</div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {ELEMENT_STYLES[item]?.sub || '물질'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* 중앙 워크스페이스 */}
        <main className="flex-1 flex flex-col p-4 gap-4 overflow-hidden relative">
          {/* 미션 브리핑 카드 */}
          <section className="bg-[#15223c]/80 border border-[#203358] border-l-4 border-l-cyan-400 rounded-xl p-3.5 flex items-center gap-4 shadow-lg shrink-0">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-900 border border-white/20 flex items-center justify-center text-2xl shadow-md shrink-0">
              🧑‍🔬
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                  Stage {currentStage.level}
                </span>
                <h2 className="text-sm font-extrabold text-white truncate">{currentStage.name}</h2>
              </div>
              <p className="text-xs text-slate-300 mt-1 line-clamp-1">{currentStage.desc}</p>
              <div className="text-[11px] text-amber-400 font-semibold mt-0.5 flex items-center gap-1">
                <span>{currentStage.constraint}</span>
              </div>
            </div>
            <div className="flex flex-col items-center pl-4 border-l border-slate-800 shrink-0">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">목표 물질</span>
              <div className="mt-1">
                <Bubble name={currentStage.target} scale={0.85} />
              </div>
            </div>
          </section>

          {/* 반응 챔버 */}
          <section className="flex-1 bg-gradient-to-b from-[#0f1a30]/90 to-[#080e1b]/95 border-2 border-dashed border-cyan-500/30 rounded-2xl p-4 flex flex-col items-center justify-between relative overflow-hidden shadow-[inset_0_0_50px_rgba(0,0,0,0.7)]">
            {/* 챔버 상단: 위험도 / 멜트다운 게이지 시스템 */}
            <div className="w-full flex items-center justify-between px-4 z-10">
              <div className="flex items-center gap-2">
                <Radio className={`w-4 h-4 ${heat >= 75 ? 'text-rose-500 animate-spin' : 'text-cyan-400'}`} />
                <span className="text-xs font-mono font-bold tracking-wider text-slate-300">
                  CORE STABILITY
                </span>
              </div>

              {/* 과열 게이지 바 */}
              <div className="flex items-center gap-3 w-64 md:w-96">
                <div className="flex-1 h-3 bg-slate-900 rounded-full border border-slate-700 overflow-hidden relative">
                  <div
                    className={`h-full transition-all duration-300 ${
                      heat >= 80
                        ? 'bg-gradient-to-r from-orange-500 to-red-600 animate-pulse'
                        : heat >= 40
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                        : 'bg-gradient-to-r from-cyan-400 to-emerald-400'
                    }`}
                    style={{ width: `${heat}%` }}
                  />
                </div>
                <span
                  className={`text-xs font-mono font-black ${
                    heat >= 80 ? 'text-red-400 animate-pulse' : 'text-slate-300'
                  }`}
                >
                  {heat}%
                </span>
              </div>

              {/* 콤보 배율 표시 */}
              <div className="flex items-center gap-1 font-mono text-xs font-bold text-amber-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>COMBO x{combo}</span>
              </div>
            </div>

            {/* 원소들이 배치되는 필드 */}
            <div className="w-full flex-1 flex items-center justify-center flex-wrap gap-4 p-6 z-10 overflow-y-auto">
              {chamber.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-slate-500 gap-2 pointer-events-none">
                  <Flame className="w-8 h-8 opacity-40 animate-pulse" />
                  <span className="text-xs">좌측 보관함에서 원소를 클릭하여 챔버로 투입하세요</span>
                </div>
              ) : (
                chamber.map((item, idx) => (
                  <Bubble
                    key={`${item}-${idx}`}
                    name={item}
                    scale={1}
                    onRemove={() => handleRemoveFromChamber(idx)}
                  />
                ))
              )}
            </div>

            {/* 챔버 제어 버튼군 */}
            <div className="flex items-center gap-3 z-10 bg-[#0d1527]/90 px-4 py-2 rounded-xl border border-[#203358] shadow-xl">
              <button
                onClick={handleTriggerReaction}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/40 flex items-center gap-1.5 active:scale-95 transition-all"
              >
                <Sparkles className="w-4 h-4 fill-slate-950" />
                ⚡ 반응 실행
              </button>

              <button
                onClick={handleSubmit}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs shadow-lg shadow-emerald-500/40 flex items-center gap-1.5 active:scale-95 transition-all"
              >
                <Send className="w-4 h-4" />
                📤 연구원 제출
              </button>

              <button
                onClick={handleClearChamber}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 flex items-center gap-1.5 active:scale-95 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                비우기
              </button>
            </div>
          </section>

          {/* 하단 실험 기록 로그 */}
          <section className="h-28 bg-[#080d1a] border border-[#203358] rounded-xl p-3 flex flex-col gap-1 overflow-y-auto font-mono text-xs shrink-0">
            {logs.map((log, i) => (
              <div key={i} className="leading-tight flex items-start gap-2">
                <span className="text-slate-500 text-[10px]">[LOG]</span>
                <span
                  className={
                    log.type === 'success'
                      ? 'text-emerald-400 font-semibold'
                      : log.type === 'danger'
                      ? 'text-rose-400 font-bold'
                      : log.type === 'warning'
                      ? 'text-amber-400'
                      : 'text-slate-300'
                  }
                >
                  {log.text}
                </span>
              </div>
            ))}
            <div ref={logEndRef} />
          </section>
        </main>
      </div>

      {/* 모달 컴포넌트들 */}
      <ParticleColliderModal
        isOpen={isSynthOpen}
        onClose={() => setIsSynthOpen(false)}
        onSynthesized={(elem) => {
          if (!inventory.includes(elem)) {
            setInventory((prev) => [...prev, elem]);
          }
          addLog(`원소 합성기: [${elem}] 획득 완료!`, 'success');
        }}
      />

      <CodexModal isOpen={isCodexOpen} onClose={() => setIsCodexOpen(false)} />

      {/* 결과 모달 */}
      {resultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#0f172a] border border-[#203358] rounded-2xl w-full max-w-md p-6 flex flex-col items-center text-center gap-4 shadow-2xl">
            <div className="text-5xl">🎉</div>
            <h2 className="text-xl font-black text-white">연구 과제 성공!</h2>
            <div className="text-4xl tracking-widest text-amber-400 font-black drop-shadow-[0_0_15px_rgba(245,158,11,0.6)]">
              {resultModal.stars}
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl w-full text-xs text-slate-300 leading-relaxed">
              {resultModal.desc}
              <div className="mt-2 text-cyan-400 font-bold">{resultModal.tier}</div>
            </div>
            <button
              onClick={handleNextStage}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black rounded-xl shadow-lg shadow-cyan-500/40 transition-all active:scale-95"
            >
              다음 연구 과제로 진행 ➔
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default App;
