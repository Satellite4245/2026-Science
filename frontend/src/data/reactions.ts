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
  reactionType: string;
  title: string;
  equation: string;
  description: string;
  sciencePoint: string;
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
    reactionType: '핵분열 연쇄 반응',
    title: '임계질량 초과 핵분열',
    equation: '²³⁵U (p:92, n:143, e:92) + n⁰ → 핵분열 성공',
    description: '우라늄-235에 중성자를 충돌시켜 연쇄 핵분열을 일으킵니다. (전자 충돌 금지)',
    sciencePoint: '전하가 없는 중성자(n⁰)가 ²³⁵U 원자핵에 흡수되면 불안정한 ²³⁶U가 되어 바륨·크립톤 등으로 쪼개지며 질량 결손(E=mc²)에 해당하는 막대한 에너지를 방출합니다.',
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
    reactionType: '알칼리 금속 산화·발열',
    title: '알칼리 금속 수용액 반응',
    equation: '나트륨(Na) + 물(H₂O) → 알칼리 폭발재',
    description: '나트륨이 물과 격렬히 반응해 수소가스를 방출하며 급격히 발열합니다.',
    sciencePoint: '1족 알칼리 금속인 나트륨(Na)은 최외각 전자 1개를 쉽게 잃어 물(H₂O)을 환원시키며, 이 과정에서 수산화나트륨(NaOH)과 수소 기체(H₂)가 생성되고 큰 반응열이 발생합니다.',
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
    reactionType: '연소·산화 발열',
    title: '수소 폭명기 점화 반응',
    equation: '2H + O + 열에너지(ΔH) → 초고온 수증기',
    description: '수소 2개와 산소 1개 혼합 기체에 열을 가해 초고온 수증기를 생성합니다.',
    sciencePoint: '수소와 산소 혼합 기체에 점화(활성화 에너지 공급)를 가하면 2H₂ + O₂ → 2H₂O 반응이 순식간에 진행되며 다량의 열에너지가 방출됩니다.',
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
    reactionType: '고에너지 입자 충돌',
    title: '입자 쌍소멸 반응',
    equation: '양성자(p⁺) + 전자(e⁻) + 열에너지(ΔH) → 반물질 잔해',
    description: '고에너지 열환경에서 양성자와 전자가 충돌해 반물질 잔해를 남깁니다.',
    sciencePoint: '고에너지 환경에서 입자와 반입자(또는 하전 입자)가 충돌하면 질량이 감마선 등의 복사 에너지로 전환되는 고에너지 물리 현상이 일어납니다.',
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
    reactionType: '이온결합',
    title: '이온결합 소금 합성',
    equation: 'Na + Cl → 염화나트륨(NaCl)',
    description: '나트륨과 염소가 이온 결합해 염화나트륨 결정을 만듭니다.',
    sciencePoint: '금속 원소 Na가 전자 1개를 비금속 원소 Cl에 전달해 Na⁺ 양이온과 Cl⁻ 음이온이 되고, 정전기적 인력으로 단단한 이온 결정(NaCl)을 이룹니다.',
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
    reactionType: '수화·용해 (흡열)',
    title: '용해 (수용액 생성)',
    equation: 'NaCl + H₂O → 염화나트륨 수용액',
    description: '염화나트륨이 물에 녹으며 챔버 과열도를 10% 낮춥니다.',
    sciencePoint: '극성 분자인 물(H₂O)이 Na⁺와 Cl⁻ 이온을 둘러싸는 수화 작용으로 이온 결정 격자를 분리시키며, 격자 에너지 흡수로 주위 온도가 소폭 내려갑니다.',
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
    reactionType: '산 생성',
    title: '산 합성 (염산)',
    equation: 'H⁺ + Cl → 염산(HCl)',
    description: '수소 이온과 염소가 결합해 염산을 생성합니다.',
    sciencePoint: '수소 이온(H⁺)을 내놓는 물질이 산(Acid)이며, 염화수소(HCl)가 물에 녹아 강산인 염산을 형성해 pH를 낮춥니다.',
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
    reactionType: '염기 생성',
    title: '염기 합성 (수산화나트륨)',
    equation: 'Na + OH⁻ → 수산화나트륨(NaOH)',
    description: '나트륨과 수산화 이온이 결합해 수산화나트륨을 생성합니다.',
    sciencePoint: '수산화 이온(OH⁻)을 내놓는 물질이 염기(Base)이며, Na⁺와 OH⁻가 결합한 NaOH는 대표적인 강염기입니다.',
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
    reactionType: '산·염기 중화 (발열)',
    title: '산·염기 중화반응',
    equation: 'HCl + NaOH → 물(H₂O) + 염화나트륨(NaCl)',
    description: '염산과 수산화나트륨이 중화반응해 물과 염화나트륨을 생성합니다.',
    sciencePoint: '산의 H⁺와 염기의 OH⁻가 1:1로 결합해 물(H₂O)이 되고, 구경꾼 이온 Na⁺와 Cl⁻가 염(NaCl)을 이루며 중화열이 발생합니다.',
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
    reactionType: '다원자 이온 형성',
    title: '수산화 이온 형성 (1:1)',
    equation: 'H + O → 수산화 이온(OH⁻)',
    description: '챔버에 수소 1개와 산소 1개만 있을 때 수산화 이온을 형성합니다. (물 합성은 2H + O)',
    sciencePoint: '산소 원자 1개와 수소 원자 1개가 공유결합한 뒤 전자 1개를 더 얻어 안정한 다원자 음이온(OH⁻)을 형성합니다.',
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
    reactionType: '공유결합',
    title: '물 분자 공유결합',
    equation: '2H + O → 물(H₂O)',
    description: '화학 계수(수소 2개 + 산소 1개)에 맞춰 물 분자를 합성합니다.',
    sciencePoint: '산소 원자 1개가 수소 원자 2개와 전자쌍을 각각 1쌍씩 공유(옥텟 규칙 충족)해 굽은형 극성 분자인 물(H₂O)을 만듭니다.',
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
    reactionType: '산화·공유결합',
    title: '이산화탄소 산화반응',
    equation: 'C + 2O → 이산화탄소(CO₂)',
    description: '화학 계수(탄소 1개 + 산소 2개)에 맞춰 이산화탄소를 합성합니다.',
    sciencePoint: '탄소 원자 1개가 산소 원자 2개와 각각 이중 공유결합(O=C=O)을 이루어 직선형 무극성 분자인 이산화탄소(CO₂)를 형성합니다.',
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
    reactionType: '에너지 전환·열복사',
    title: '빛 에너지 전환',
    equation: 'C + 열에너지(ΔH) → 빛 에너지(hν)',
    description: '탄소를 가열해 광합성에 필요한 빛 에너지를 방출합니다.',
    sciencePoint: '물질이 고온으로 가열되면 들뜬 전자가 바닥상태로 전이하거나 흑체복사를 일으켜 광자(빛 에너지, E=hν)를 방출합니다.',
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
    reactionType: '광합성 (동화작용)',
    title: '광합성 포도당 합성',
    equation: 'CO₂ + H₂O + 빛 에너지(hν) → 포도당(C₆H₁₂O₆)',
    description: '이산화탄소, 물, 빛 에너지를 결합해 포도당을 합성합니다.',
    sciencePoint: '6CO₂ + 6H₂O + 빛 에너지 → C₆H₁₂O₆ + 6O₂. 빛 에너지를 화학 에너지(포도당)로 저장하는 대표적인 흡열 동화작용입니다.',
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
