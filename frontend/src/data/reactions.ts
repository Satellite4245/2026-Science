export type ImpactType = 'normal' | 'fire' | 'hydrogen' | 'void' | 'nuke';
export type LogType = 'info' | 'success' | 'warning' | 'danger';

export interface ConstraintRule {
  id: string;
  check: (chamber: string[], count: (name: string) => number) => boolean;
  message: string;
}

export interface StoichiometryHint {
  id: string;
  check: (chamber: string[], count: (name: string) => number) => boolean;
  message: string;
}

export interface ReactionRule {
  id: string;
  category: 'normal' | 'hazard';
  title: string;
  equation: string;
  description: string;
  heatDelta: number;
  impactType: ImpactType;
  hazardLabel?: string;
  match: (chamber: string[], count: (name: string) => number) => boolean;
  consumed: string[];
  produced: string[];
  logMessage: string;
}

export const CONSTRAINT_RULES: ConstraintRule[] = [
  {
    id: 'no-direct-glucose',
    check: (_chamber, count) => count('탄소') >= 1 && count('산소') >= 1 && count('수소') >= 1,
    message: '반응 차단: 광합성 경로(CO₂ + H₂O + 빛 에너지)를 거쳐야 포도당을 합성할 수 있습니다.',
  },
  {
    id: 'no-hydroxide-split',
    check: (chamber) => chamber.length === 1 && chamber[0] === '수산화 이온',
    message: '반응 실패: 수산화 이온(OH⁻) 단독 분해는 불가능합니다.',
  },
  {
    id: 'no-uranium-electron',
    check: (_chamber, count) => count('우라늄-235') >= 1 && count('전자') >= 1,
    message: '반응 차단: 전자를 충돌시켜서는 핵분열을 유도할 수 없습니다. 중성자(n⁰)를 사용하세요.',
  },
];

export const REACTION_RULES: ReactionRule[] = [
  // 고에너지 / 위험 반응 (우선 판정)
  {
    id: 'uranium-fission',
    category: 'hazard',
    title: '임계질량 초과 핵분열',
    equation: '²³⁵U (p:92, n:143, e:92) + n⁰ → 핵분열 성공',
    description: '우라늄-235에 중성자를 충돌시켜 연쇄 핵분열을 일으킵니다. (전자 충돌 금지)',
    heatDelta: 60,
    impactType: 'nuke',
    hazardLabel: '임계 반응',
    match: (_chamber, count) => count('우라늄-235') >= 1 && count('중성자') >= 1,
    consumed: ['우라늄-235', '중성자'],
    produced: ['핵분열 성공'],
    logMessage: '연쇄 핵분열 반응 발생: 임계질량을 초과하여 [핵분열 성공]을 얻었습니다.',
  },
  {
    id: 'alkali-explosion',
    category: 'hazard',
    title: '알칼리 금속 수용액 반응',
    equation: '나트륨(Na) + 물(H₂O) → 알칼리 폭발재',
    description: '나트륨이 물과 격렬히 반응해 수소가스를 방출하며 급격히 발열합니다.',
    heatDelta: 35,
    impactType: 'fire',
    match: (_chamber, count) => count('나트륨') >= 1 && count('물') >= 1,
    consumed: ['나트륨', '물'],
    produced: ['알칼리 폭발재'],
    logMessage: '알칼리 발열 반응: 나트륨과 물이 격렬히 반응하여 [알칼리 폭발재]가 생성되었습니다.',
  },
  {
    id: 'oxyhydrogen-ignition',
    category: 'hazard',
    title: '수소 폭명기 점화 반응',
    equation: '2H + O + 열에너지(ΔH) → 초고온 수증기',
    description: '수소 2개와 산소 1개 혼합 기체에 열을 가해 초고온 수증기를 생성합니다.',
    heatDelta: 45,
    impactType: 'hydrogen',
    match: (_chamber, count) => count('수소') >= 2 && count('산소') >= 1 && count('열에너지') >= 1,
    consumed: ['수소', '수소', '산소', '열에너지'],
    produced: ['초고온 수증기'],
    logMessage: '폭명기 점화 성공: 2H + O + 열에너지 반응으로 [초고온 수증기]가 생성되었습니다.',
  },
  {
    id: 'antimatter-annihilation',
    category: 'hazard',
    title: '입자 쌍소멸 반응',
    equation: '양성자(p⁺) + 전자(e⁻) + 열에너지(ΔH) → 반물질 잔해',
    description: '고에너지 열환경에서 양성자와 전자가 충돌해 반물질 잔해를 남깁니다.',
    heatDelta: 50,
    impactType: 'void',
    match: (_chamber, count) => count('양성자') >= 1 && count('전자') >= 1 && count('열에너지') >= 1,
    consumed: ['양성자', '전자', '열에너지'],
    produced: ['반물질 잔해'],
    logMessage: '고에너지 쌍소멸: 입자 충돌로 [반물질 잔해]가 생성되었습니다.',
  },

  // 일반 화학 반응 (10종)
  {
    id: 'nacl-synthesis',
    category: 'normal',
    title: '이온결합 소금 합성',
    equation: 'Na + Cl → 염화나트륨(NaCl)',
    description: '나트륨과 염소가 이온 결합해 염화나트륨 결정을 만듭니다.',
    heatDelta: 10,
    impactType: 'normal',
    match: (_chamber, count) => count('나트륨') >= 1 && count('염소') >= 1,
    consumed: ['나트륨', '염소'],
    produced: ['염화나트륨'],
    logMessage: '이온결합 성공: Na + Cl → 염화나트륨(NaCl)',
  },
  {
    id: 'nacl-dissolution',
    category: 'normal',
    title: '용해 (수용액 생성)',
    equation: 'NaCl + H₂O → 염화나트륨 수용액',
    description: '염화나트륨이 물에 녹으며 챔버 과열도를 10% 낮춥니다.',
    heatDelta: -10,
    impactType: 'normal',
    match: (_chamber, count) => count('염화나트륨') >= 1 && count('물') >= 1,
    consumed: ['염화나트륨', '물'],
    produced: ['염화나트륨 수용액'],
    logMessage: '용해 완료: NaCl이 물에 녹아 [염화나트륨 수용액]이 되었습니다. (과열도 -10%)',
  },
  {
    id: 'hcl-synthesis',
    category: 'normal',
    title: '산 합성 (염산)',
    equation: 'H⁺ + Cl → 염산(HCl)',
    description: '수소 이온과 염소가 결합해 염산을 생성합니다.',
    heatDelta: 15,
    impactType: 'normal',
    match: (_chamber, count) => count('수소 이온') >= 1 && count('염소') >= 1,
    consumed: ['수소 이온', '염소'],
    produced: ['염산'],
    logMessage: '산 합성 완료: H⁺ + Cl → 염산(HCl)',
  },
  {
    id: 'naoh-synthesis',
    category: 'normal',
    title: '염기 합성 (수산화나트륨)',
    equation: 'Na + OH⁻ → 수산화나트륨(NaOH)',
    description: '나트륨과 수산화 이온이 결합해 수산화나트륨을 생성합니다.',
    heatDelta: 15,
    impactType: 'normal',
    match: (_chamber, count) => count('나트륨') >= 1 && count('수산화 이온') >= 1,
    consumed: ['나트륨', '수산화 이온'],
    produced: ['수산화나트륨'],
    logMessage: '염기 합성 완료: Na + OH⁻ → 수산화나트륨(NaOH)',
  },
  {
    id: 'neutralization',
    category: 'normal',
    title: '산·염기 중화반응',
    equation: 'HCl + NaOH → 물(H₂O) + 염화나트륨(NaCl)',
    description: '염산과 수산화나트륨이 중화반응해 물과 염화나트륨을 생성합니다.',
    heatDelta: 20,
    impactType: 'normal',
    match: (_chamber, count) => count('염산') >= 1 && count('수산화나트륨') >= 1,
    consumed: ['염산', '수산화나트륨'],
    produced: ['물', '염화나트륨'],
    logMessage: '중화반응 완료: HCl + NaOH → H₂O + NaCl',
  },
  {
    id: 'hydroxide-synthesis',
    category: 'normal',
    title: '수산화 이온 형성 (1:1)',
    equation: 'H + O → 수산화 이온(OH⁻)',
    description: '챔버에 수소 1개와 산소 1개만 있을 때 수산화 이온을 형성합니다. (물 합성은 2H + O)',
    heatDelta: 0,
    impactType: 'normal',
    match: (chamber, count) => count('수소') === 1 && count('산소') === 1 && chamber.length === 2,
    consumed: ['수소', '산소'],
    produced: ['수산화 이온'],
    logMessage: '결합 완료: H(1) + O(1) → 수산화 이온(OH⁻) 생성 — 물(H₂O)을 만들려면 수소 2개 + 산소 1개를 투입하세요.',
  },
  {
    id: 'water-synthesis',
    category: 'normal',
    title: '물 분자 공유결합',
    equation: '2H + O → 물(H₂O)',
    description: '화학 계수(수소 2개 + 산소 1개)에 맞춰 물 분자를 합성합니다.',
    heatDelta: 0,
    impactType: 'normal',
    match: (_chamber, count) => count('수소') >= 2 && count('산소') >= 1,
    consumed: ['수소', '수소', '산소'],
    produced: ['물'],
    logMessage: '공유결합 완료: 2H + O → 물(H₂O)',
  },
  {
    id: 'co2-synthesis',
    category: 'normal',
    title: '이산화탄소 산화반응',
    equation: 'C + 2O → 이산화탄소(CO₂)',
    description: '화학 계수(탄소 1개 + 산소 2개)에 맞춰 이산화탄소를 합성합니다.',
    heatDelta: 0,
    impactType: 'normal',
    match: (_chamber, count) => count('탄소') >= 1 && count('산소') >= 2,
    consumed: ['탄소', '산소', '산소'],
    produced: ['이산화탄소'],
    logMessage: '산화반응 완료: C + 2O → 이산화탄소(CO₂)',
  },
  {
    id: 'photon-conversion',
    category: 'normal',
    title: '빛 에너지 전환',
    equation: 'C + 열에너지(ΔH) → 빛 에너지(hν)',
    description: '탄소를 가열해 광합성에 필요한 빛 에너지를 방출합니다.',
    heatDelta: 0,
    impactType: 'normal',
    match: (_chamber, count) => count('탄소') >= 1 && count('열에너지') >= 1,
    consumed: ['탄소', '열에너지'],
    produced: ['빛 에너지'],
    logMessage: '에너지 전환 완료: C + 열에너지 → 빛 에너지(hν)',
  },
  {
    id: 'photosynthesis',
    category: 'normal',
    title: '광합성 포도당 합성',
    equation: 'CO₂ + H₂O + 빛 에너지(hν) → 포도당(C₆H₁₂O₆)',
    description: '이산화탄소, 물, 빛 에너지를 결합해 포도당을 합성합니다.',
    heatDelta: 0,
    impactType: 'normal',
    match: (_chamber, count) =>
      count('이산화탄소') >= 1 && count('물') >= 1 && count('빛 에너지') >= 1,
    consumed: ['이산화탄소', '물', '빛 에너지'],
    produced: ['포도당'],
    logMessage: '광합성 성공: CO₂ + H₂O + 빛 에너지 → 포도당(C₆H₁₂O₆)',
  },
];

export const STOICHIOMETRY_HINTS: StoichiometryHint[] = [
  {
    id: 'oxyhydrogen-missing-h',
    check: (_chamber, count) => count('수소') === 1 && count('산소') >= 1 && count('열에너지') >= 1,
    message: '수소(H)가 1개 부족합니다. 수소 폭명기 반응(2H + O + 열에너지)에는 수소가 2개 필요합니다.',
  },
  {
    id: 'water-missing-h',
    check: (chamber, count) =>
      count('수소') === 1 && count('산소') >= 1 && chamber.length >= 2 && !chamber.includes('열에너지'),
    message: '수소(H)가 1개 부족합니다. 물(H₂O) 합성은 수소 2개 + 산소 1개가 필요합니다. (보관함에서 수소를 한 번 더 누르세요)',
  },
  {
    id: 'co2-missing-o',
    check: (chamber, count) =>
      count('탄소') >= 1 && count('산소') === 1 && !chamber.includes('열에너지'),
    message: '산소(O)가 1개 부족합니다. 이산화탄소(CO₂) 합성은 탄소 1개 + 산소 2개가 필요합니다.',
  },
];

export type ReactionResult =
  | { status: 'empty'; message: string }
  | { status: 'blocked'; message: string; logType: 'danger' | 'warning' }
  | { status: 'matched'; rule: ReactionRule }
  | { status: 'none'; message: string };

export function evaluateChamberReaction(chamber: string[]): ReactionResult {
  if (chamber.length === 0) {
    return { status: 'empty', message: '반응 챔버가 비어 있습니다. 왼쪽 보관함에서 물질을 투입하세요.' };
  }

  const count = (name: string) => chamber.filter((x) => x === name).length;

  for (const constraint of CONSTRAINT_RULES) {
    if (constraint.check(chamber, count)) {
      return { status: 'blocked', message: constraint.message, logType: 'danger' };
    }
  }

  // 위험 반응이 일반 반응보다 먼저 매칭되며, 단 부족한 수소가 있을 때 힌트 처리
  const hazardRules = REACTION_RULES.filter((r) => r.category === 'hazard');
  for (const rule of hazardRules) {
    if (rule.match(chamber, count)) {
      return { status: 'matched', rule };
    }
  }

  if (STOICHIOMETRY_HINTS[0].check(chamber, count)) {
    return { status: 'blocked', message: STOICHIOMETRY_HINTS[0].message, logType: 'warning' };
  }

  const normalRules = REACTION_RULES.filter((r) => r.category === 'normal');
  for (const rule of normalRules) {
    if (rule.match(chamber, count)) {
      return { status: 'matched', rule };
    }
  }

  for (const hint of STOICHIOMETRY_HINTS.slice(1)) {
    if (hint.check(chamber, count)) {
      return { status: 'blocked', message: hint.message, logType: 'warning' };
    }
  }

  return {
    status: 'none',
    message: '유효한 반응 조합이 아닙니다. 상단 [반응 도감]이나 단계 안내를 확인하세요.',
  };
}
