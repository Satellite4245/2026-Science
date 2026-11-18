import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  STAGES,
  type Stage,
  ELEMENT_STYLES,
} from './types/elements';
import { evaluateChamberReaction, type LogType } from './data/reactions';
import { Bubble } from './components/Bubble';
import { ParticleColliderModal } from './components/ParticleColliderModal';
import { CodexModal } from './components/CodexModal';
import { Header } from './components/Header';
import { MissionPanel } from './components/MissionPanel';
import { ResultModal, type ResultModalState } from './components/ResultModal';
import { sound } from './utils/sound';
import {
  Flame,
  RotateCcw,
  Send,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Info,
} from 'lucide-react';

interface FeedbackState {
  text: string;
  type: LogType;
}

const COMBO_TARGET = 8;
const COMBO_WINDOW_MS = 8000;

export function App() {
  const initialStage = STAGES.NORMAL[0];

  const [mode, setMode] = useState<'NORMAL' | 'HARDCORE'>('NORMAL');
  const [level, setLevel] = useState<number>(1);
  const [inventory, setInventory] = useState<string[]>(() => [...initialStage.items]);
  const [chamber, setChamber] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(initialStage.timeLimit);
  const [completedStages, setCompletedStages] = useState<Set<string>>(() => new Set());

  const [combo, setCombo] = useState<number>(0);
  const [heat, setHeat] = useState<number>(0);
  const [chamberNudge, setChamberNudge] = useState<boolean>(false);
  const [chamberEffect, setChamberEffect] = useState<'fission' | 'meltdown' | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => sound.enabled);

  // 모달 제어
  const [isSynthOpen, setIsSynthOpen] = useState<boolean>(false);
  const [isCodexOpen, setIsCodexOpen] = useState<boolean>(false);
  const [resultModal, setResultModal] = useState<ResultModalState | null>(null);
  const [resetCount, setResetCount] = useState<number>(0);

  // 인라인 피드백
  const [feedback, setFeedback] = useState<FeedbackState>({
    text: `연구 과제 시작: [${initialStage.name}] — 목표 물질은 '${initialStage.target}'입니다.`,
    type: 'info',
  });

  const comboTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nudgeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const effectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentStageList = STAGES[mode];
  const currentStage: Stage =
    currentStageList.find((s) => s.level === level) || currentStageList[0];
  const isTargetReady = chamber.includes(currentStage.target);
  const showTargetReadyBanner = isTargetReady && feedback.type !== 'danger';

  const pushFeedback = (text: string, type: LogType = 'info') => {
    setFeedback({ text, type });
  };

  const resetStage = (lvl: number, targetMode: 'NORMAL' | 'HARDCORE') => {
    const targetStage =
      STAGES[targetMode].find((x) => x.level === lvl) || STAGES[targetMode][0];
    if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
    if (effectTimerRef.current) clearTimeout(effectTimerRef.current);
    setMode(targetMode);
    setLevel(targetStage.level);
    setInventory([...targetStage.items]);
    setChamber([]);
    setTimeLeft(targetStage.timeLimit);
    setHeat(0);
    setCombo(0);
    setChamberEffect(null);
    setIsSynthOpen(false);
    setIsCodexOpen(false);
    setResultModal(null);
    setResetCount((c) => c + 1);
    pushFeedback(
      `연구 과제 시작: [${targetStage.name}] — 목표 물질은 '${targetStage.target}'입니다.`,
      'info',
    );
  };

  // 1초 카운트다운 타이머 및 과열도 자연 냉각 (결과 모달 표시 중에는 일시 정지)
  useEffect(() => {
    if (resultModal) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          sound.playFail();
          setIsSynthOpen(false);
          setIsCodexOpen(false);
          setResultModal({
            kind: 'timeout',
            stageName: currentStage.name,
          });
          return 0;
        }
        return prev - 1;
      });
      setHeat((prev) => (prev > 0 ? Math.max(0, prev - 1) : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [currentStage.name, resultModal]);

  // 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
      if (nudgeTimerRef.current) clearTimeout(nudgeTimerRef.current);
      if (effectTimerRef.current) clearTimeout(effectTimerRef.current);
    };
  }, []);

  const triggerChamberNudge = () => {
    setChamberNudge(false);
    requestAnimationFrame(() => {
      setChamberNudge(true);
    });
    if (nudgeTimerRef.current) clearTimeout(nudgeTimerRef.current);
    nudgeTimerRef.current = setTimeout(() => {
      setChamberNudge(false);
    }, 400);
  };

  const triggerChamberEffect = (effect: 'fission' | 'meltdown') => {
    setChamberEffect(null);
    requestAnimationFrame(() => {
      setChamberEffect(effect);
    });
    if (effectTimerRef.current) clearTimeout(effectTimerRef.current);
    effectTimerRef.current = setTimeout(
      () => setChamberEffect(null),
      effect === 'meltdown' ? 1200 : 1000,
    );
  };

  const handleComboAdvance = (
    nextChamber: string[],
    nextInventory: string[],
  ): { chamber: string[]; inventory: string[] } => {
    const nextCombo = combo + 1;
    setCombo(nextCombo);
    sound.playCombo(nextCombo);

    if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
    comboTimerRef.current = setTimeout(() => {
      setCombo(0);
    }, COMBO_WINDOW_MS);

    if (nextCombo >= COMBO_TARGET && currentStage.target === '8콤보 마스터') {
      const updatedInventory = nextInventory.includes('8콤보 마스터')
        ? nextInventory
        : [...nextInventory, '8콤보 마스터'];
      const updatedChamber = [...nextChamber, '8콤보 마스터'];
      pushFeedback(
        `${COMBO_TARGET}연속 반응 달성: [8콤보 마스터]가 생성되었습니다. 연구 결과를 제출하세요.`,
        'success',
      );
      return { chamber: updatedChamber, inventory: updatedInventory };
    }

    return { chamber: nextChamber, inventory: nextInventory };
  };

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
      pushFeedback('반응 챔버를 비웠습니다.', 'info');
    }
  };

  const handleTriggerReaction = () => {
    const result = evaluateChamberReaction(chamber);

    if (result.status === 'empty') {
      sound.playFail();
      pushFeedback(result.message, 'warning');
      return;
    }

    if (result.status === 'blocked') {
      sound.playFail();
      pushFeedback(result.message, result.logType);
      return;
    }

    if (result.status === 'none') {
      sound.playFail();
      pushFeedback(result.message, 'warning');
      return;
    }

    const { rule } = result;

    // 소비 및 생성 물질 반영
    const nextChamber = [...chamber];
    rule.consumed.forEach((name) => {
      const idx = nextChamber.indexOf(name);
      if (idx !== -1) nextChamber.splice(idx, 1);
    });

    const nextInventory = [...inventory];
    rule.produced.forEach((p) => {
      nextChamber.push(p);
      if (!nextInventory.includes(p)) {
        nextInventory.push(p);
      }
    });

    // 사운드 및 챔버 이펙트
    if (rule.impactType !== 'normal') {
      sound.playExplosion(rule.impactType === 'nuke' ? 'nuke' : 'medium');
      triggerChamberNudge();
      if (rule.impactType === 'nuke') {
        triggerChamberEffect('fission');
        void confetti({
          particleCount: 38,
          spread: 85,
          origin: { y: 0.58 },
          colors: ['#38bdf8', '#22d3ee', '#a3e635', '#f8fafc'],
        });
      }
    }

    // 과열도 계산 및 100% 멜트다운 처리
    const nextHeat = Math.max(0, Math.min(100, heat + rule.heatDelta));

    if (nextHeat >= 100) {
      sound.playExplosion('nuke');
      triggerChamberNudge();
      triggerChamberEffect('meltdown');
      void confetti({
        particleCount: 44,
        spread: 95,
        origin: { y: 0.58 },
        colors: ['#f43f5e', '#fb923c', '#facc15', '#fde68a'],
      });
      setHeat(0);

      if (currentStage.target === '코어 멜트다운') {
        const meltdownInv = nextInventory.includes('코어 멜트다운')
          ? nextInventory
          : [...nextInventory, '코어 멜트다운'];
        const meltdownChamber = ['코어 멜트다운'];
        setInventory(meltdownInv);
        setChamber(meltdownChamber);
        handleComboAdvance(meltdownChamber, meltdownInv);
        pushFeedback(
          '과열도 100% 도달: [코어 멜트다운]이 생성되었습니다. 연구 결과를 제출하세요.',
          'success',
        );
      } else {
        setInventory(nextInventory);
        setChamber([]);
        pushFeedback(
          '과열도 100% 도달: 챔버 과열로 내부 물질이 초기화되었습니다. 다시 투입해 주세요.',
          'danger',
        );
      }
      return;
    }

    setHeat(nextHeat);
    pushFeedback(rule.logMessage, rule.category === 'hazard' ? 'warning' : 'success');

    const afterCombo = handleComboAdvance(nextChamber, nextInventory);
    setChamber(afterCombo.chamber);
    setInventory(afterCombo.inventory);
  };

  const handleSubmit = () => {
    if (!chamber.includes(currentStage.target)) {
      sound.playFail();
      pushFeedback(
        `제출 불가: 챔버 안에 목표 물질 '${currentStage.target}'이 아직 없습니다.`,
        'danger',
      );
      return;
    }

    sound.playSuccess();
    setCompletedStages((prev) => {
      const next = new Set(prev);
      next.add(`${mode}-${level}`);
      return next;
    });

    const ratio = timeLeft / currentStage.timeLimit;
    let stars = '★☆☆';
    let tier = '수습 연구원 등급';
    if (ratio >= 0.6) {
      stars = '★★★';
      tier = '수석 연구원 등급';
    } else if (ratio >= 0.3) {
      stars = '★★☆';
      tier = '선임 연구원 등급';
    }

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      void confetti({ particleCount: 55, spread: 75, origin: { y: 0.6 } });
    }

    const isLastStage = level >= currentStageList.length;
    setResultModal({
      kind: isLastStage ? 'course_complete' : 'stage_clear',
      mode,
      target: currentStage.target,
      timeLeft,
      stars,
      tier,
    });
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    sound.enabled = next;
    setSoundEnabled(next);
  };

  return (
    <div className="min-h-screen lg:h-screen w-full flex flex-col bg-[#0b111e] text-slate-100 lg:overflow-hidden">
      <Header
        mode={mode}
        level={level}
        stages={currentStageList}
        completedStages={completedStages}
        timeLeft={timeLeft}
        soundEnabled={soundEnabled}
        onModeChange={(nextMode) => resetStage(1, nextMode)}
        onSelectStage={(lvl) => resetStage(lvl, mode)}
        onOpenSynth={() => setIsSynthOpen(true)}
        onOpenCodex={() => setIsCodexOpen(true)}
        onToggleSound={handleToggleSound}
      />

      <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
        {/* 좌측 보유 물질 패널 */}
        <aside
          aria-label="보유 물질 목록"
          className="w-full md:w-60 lg:w-72 bg-[#111827] border-b md:border-b-0 md:border-r border-slate-800 flex flex-col p-3.5 gap-2.5 shrink-0 max-h-56 md:max-h-none min-h-0"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 shrink-0">
            <div>
              <h2 className="text-xs font-bold text-slate-100">보유 물질</h2>
              <p className="text-[11px] text-slate-400">
                클릭해 투입 (여러 개 필요 시 반복 클릭)
              </p>
            </div>
            <span className="text-xs font-mono tabular-nums bg-[#182234] text-slate-300 border border-slate-700/70 px-2 py-0.5 rounded">
              {inventory.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-1 content-start auto-rows-max gap-2 pr-0.5">
            {inventory.map((item) => {
              const style = ELEMENT_STYLES[item];
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleAddToChamber(item)}
                  className="bg-[#182234] hover:bg-slate-800 border border-slate-700/70 hover:border-sky-400/60 p-2 rounded-xl flex items-center gap-2.5 text-left transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-sky-400"
                >
                  <Bubble name={item} scale={0.62} decorative />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-slate-100 truncate">{item}</div>
                    <div className="text-[11px] text-slate-400 font-mono truncate">
                      {style ? `${style.symbol} · ${style.sub}` : '물질'}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* 중앙 워크스페이스 */}
        <main className="flex-1 flex flex-col p-3.5 lg:p-4 gap-3 min-h-0 overflow-hidden">
          <MissionPanel
            mode={mode}
            stage={currentStage}
            inventory={inventory}
            chamber={chamber}
            isTargetReady={isTargetReady}
          />

          {/* 반응 챔버 */}
          <section
            aria-label="반응 챔버"
            className={`relative flex-1 min-h-[260px] bg-[#111827] border rounded-xl p-3.5 lg:p-4 flex flex-col justify-between gap-3 overflow-hidden transition-colors duration-300 ${
              chamberEffect === 'meltdown'
                ? 'border-rose-500/80 chamber-meltdown'
                : chamberEffect === 'fission'
                ? 'border-cyan-400/80 chamber-nudge'
                : chamberNudge
                ? 'border-slate-800 chamber-nudge'
                : 'border-slate-800'
            }`}
          >
            {chamberEffect === 'fission' && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-xl"
              >
                <div className="effect-fission-glow absolute inset-0" />
                <div className="effect-fission-ring absolute left-1/2 top-1/2 w-40 h-40 rounded-full border-2 border-cyan-300/90 shadow-[0_0_24px_rgba(34,211,238,0.65)]" />
                <div className="effect-fission-ring-delayed absolute left-1/2 top-1/2 w-40 h-40 rounded-full border border-lime-300/75 opacity-0" />
              </div>
            )}
            {chamberEffect === 'meltdown' && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-xl"
              >
                <div className="effect-meltdown-glow absolute inset-0" />
                <div className="effect-meltdown-ring absolute left-1/2 top-1/2 w-44 h-44 rounded-full border-2 border-rose-400/90 shadow-[0_0_28px_rgba(244,63,94,0.75)]" />
                <div className="effect-meltdown-ring-delayed absolute left-1/2 top-1/2 w-44 h-44 rounded-full border border-amber-400/80 opacity-0" />
              </div>
            )}
            {/* 챔버 상단: 과열도 게이지 & 연속 반응 콤보 */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800/80 shrink-0">
              <div className="flex items-center gap-2.5 flex-1 min-w-[220px]">
                <span className="text-xs font-semibold text-slate-300 shrink-0">
                  과열도 (HEAT)
                </span>
                <div
                  role="progressbar"
                  aria-label="챔버 과열도"
                  aria-valuenow={heat}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  className="flex-1 max-w-xs h-2.5 bg-[#0b111e] rounded-full border border-slate-800 overflow-hidden"
                >
                  <div
                    className={`h-full transition-all duration-300 ${
                      heat >= 80
                        ? 'bg-rose-500'
                        : heat >= 45
                        ? 'bg-amber-400'
                        : 'bg-sky-400'
                    }`}
                    style={{ width: `${heat}%` }}
                  />
                </div>
                <span
                  className={`text-xs font-mono font-bold tabular-nums shrink-0 ${
                    heat >= 80 ? 'text-rose-400' : 'text-slate-300'
                  }`}
                >
                  {heat}%
                </span>
                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  {currentStage.target === '코어 멜트다운'
                    ? '(100% 도달 목표)'
                    : '(100% 시 초기화)'}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-mono tabular-nums px-2.5 py-1 rounded-md bg-[#182234] border border-slate-700/70 text-slate-200">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" aria-hidden="true" />
                <span>
                  연속 반응{' '}
                  {currentStage.target === '8콤보 마스터'
                    ? `${Math.min(combo, COMBO_TARGET)}/${COMBO_TARGET}`
                    : `${combo}회`}
                </span>
              </div>
            </div>

            {/* 버블 배치 영역 */}
            <div className="flex-1 min-h-0 flex flex-col items-center overflow-y-auto py-2">
              {chamber.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center text-slate-400 gap-2 px-4 my-auto">
                  <Flame className="w-7 h-7 text-slate-500" aria-hidden="true" />
                  <p className="text-xs sm:text-sm">
                    왼쪽 보관함에서 물질을 클릭해 투입하세요. 같은 물질을 여러 번 누를 수 있습니다.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 w-full my-auto">
                  <div className="flex items-center justify-center flex-wrap gap-3.5 px-2">
                    {chamber.map((item, idx) => (
                      <Bubble
                        key={`${item}-${idx}`}
                        name={item}
                        scale={0.95}
                        onClick={() => handleRemoveFromChamber(idx)}
                        onRemove={() => handleRemoveFromChamber(idx)}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400">
                    버블을 클릭하거나 우상단 × 버튼으로 회수할 수 있습니다.
                  </span>
                </div>
              )}
            </div>

            {/* 인라인 반응 결과 피드백 배너 */}
            <div className="flex flex-col gap-2.5 shrink-0">
              <div
                role="status"
                aria-live="polite"
                className={`px-3 py-2 rounded-lg border text-xs flex items-center gap-2 ${
                  showTargetReadyBanner
                    ? 'bg-emerald-950/50 border-emerald-700/70 text-emerald-200'
                    : feedback.type === 'success'
                    ? 'bg-emerald-950/40 border-emerald-800/70 text-emerald-200'
                    : feedback.type === 'danger'
                    ? 'bg-rose-950/50 border-rose-800/70 text-rose-200'
                    : feedback.type === 'warning'
                    ? 'bg-amber-950/40 border-amber-800/70 text-amber-200'
                    : 'bg-[#182234] border-slate-700/70 text-slate-300'
                }`}
              >
                {showTargetReadyBanner || feedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" aria-hidden="true" />
                ) : feedback.type === 'danger' ? (
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" aria-hidden="true" />
                ) : feedback.type === 'warning' ? (
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" aria-hidden="true" />
                ) : (
                  <Info className="w-4 h-4 shrink-0 text-sky-400" aria-hidden="true" />
                )}
                <span className="leading-snug">
                  {showTargetReadyBanner
                    ? `목표 물질 [${currentStage.target}]이 챔버에 준비되었습니다. '연구 결과 제출'을 눌러 완료하세요.`
                    : feedback.text}
                </span>
              </div>

              {/* 챔버 제어 버튼군 */}
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                <button
                  type="button"
                  onClick={handleTriggerReaction}
                  className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                  반응 실행
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 border transition-colors cursor-pointer ${
                    isTargetReady
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 border-emerald-400'
                      : 'bg-[#182234] hover:bg-slate-700/80 text-slate-300 border-slate-700'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" aria-hidden="true" />
                  {isTargetReady ? '목표 준비 완료 — 연구 결과 제출' : '연구 결과 제출'}
                </button>

                <button
                  type="button"
                  onClick={handleClearChamber}
                  disabled={chamber.length === 0}
                  className="px-3.5 py-2 rounded-lg bg-[#182234] hover:bg-slate-700/80 disabled:opacity-45 disabled:cursor-not-allowed text-slate-300 font-semibold text-xs border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  비우기
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* 모달 컴포넌트 */}
      <ParticleColliderModal
        key={`${mode}-${level}-${resetCount}`}
        isOpen={isSynthOpen}
        onClose={() => setIsSynthOpen(false)}
        onSynthesized={(elem) => {
          if (!inventory.includes(elem)) {
            setInventory((prev) => [...prev, elem]);
          }
          pushFeedback(`원소 합성기: [${elem}]을(를) 합성해 보유 물질에 추가했습니다.`, 'success');
        }}
      />

      <CodexModal isOpen={isCodexOpen} onClose={() => setIsCodexOpen(false)} />

      <ResultModal
        result={resultModal}
        onRetryStage={() => resetStage(level, mode)}
        onNextStage={() => resetStage(level + 1, mode)}
        onRestartCourse={() => resetStage(1, mode)}
        onSwitchToHardcore={() => resetStage(1, 'HARDCORE')}
      />
    </div>
  );
}

export default App;
