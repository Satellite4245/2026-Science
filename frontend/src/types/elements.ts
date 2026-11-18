export interface ElementStyle {
  symbol: string;
  sub: string;
  size: number;
  bg: string;
  border: string;
  textColor: string;
}

export const ELEMENT_STYLES: Record<string, ElementStyle> = {
  // 소립자
  "양성자": {
    symbol: "p⁺",
    sub: "Proton",
    size: 48,
    bg: "radial-gradient(circle at 35% 35%, #dc2626 0%, #991b1b 70%, #7f1d1d 100%)",
    border: "#f87171",
    textColor: "#ffffff",
  },
  "중성자": {
    symbol: "n⁰",
    sub: "Neutron",
    size: 48,
    bg: "radial-gradient(circle at 35% 35%, #475569 0%, #334155 70%, #1e293b 100%)",
    border: "#94a3b8",
    textColor: "#f8fafc",
  },
  "전자": {
    symbol: "e⁻",
    sub: "Electron",
    size: 44,
    bg: "radial-gradient(circle at 35% 35%, #0284c7 0%, #0369a1 70%, #0c4a6e 100%)",
    border: "#38bdf8",
    textColor: "#ffffff",
  },

  // 원소 및 이온
  "수소": {
    symbol: "H",
    sub: "Hydrogen",
    size: 54,
    bg: "radial-gradient(circle at 35% 35%, #e0f2fe 0%, #7dd3fc 65%, #38bdf8 100%)",
    border: "#38bdf8",
    textColor: "#0f172a",
  },
  "수소 이온": {
    symbol: "H⁺",
    sub: "Hydron",
    size: 52,
    bg: "radial-gradient(circle at 35% 35%, #cffafe 0%, #67e8f9 65%, #22d3ee 100%)",
    border: "#22d3ee",
    textColor: "#083344",
  },
  "탄소": {
    symbol: "C",
    sub: "Carbon",
    size: 64,
    bg: "radial-gradient(circle at 35% 35%, #d1fae5 0%, #6ee7b7 65%, #34d399 100%)",
    border: "#34d399",
    textColor: "#022c22",
  },
  "산소": {
    symbol: "O",
    sub: "Oxygen",
    size: 62,
    bg: "radial-gradient(circle at 35% 35%, #dbeafe 0%, #93c5fd 65%, #60a5fa 100%)",
    border: "#60a5fa",
    textColor: "#0f172a",
  },
  "나트륨": {
    symbol: "Na",
    sub: "Sodium",
    size: 72,
    bg: "radial-gradient(circle at 35% 35%, #fce7f3 0%, #f9a8d4 65%, #f472b6 100%)",
    border: "#f472b6",
    textColor: "#500724",
  },
  "염소": {
    symbol: "Cl",
    sub: "Chlorine",
    size: 70,
    bg: "radial-gradient(circle at 35% 35%, #dcfce7 0%, #86efac 65%, #4ade80 100%)",
    border: "#4ade80",
    textColor: "#052e16",
  },
  "수산화 이온": {
    symbol: "OH⁻",
    sub: "Hydroxide",
    size: 58,
    bg: "radial-gradient(circle at 35% 35%, #f3e8ff 0%, #d8b4fe 65%, #c084fc 100%)",
    border: "#c084fc",
    textColor: "#2e1065",
  },

  // 화합물
  "염화나트륨": {
    symbol: "NaCl",
    sub: "Salt",
    size: 76,
    bg: "radial-gradient(circle at 35% 35%, #ffedd5 0%, #fdba74 65%, #fb923c 100%)",
    border: "#fb923c",
    textColor: "#431407",
  },
  "물": {
    symbol: "H₂O",
    sub: "Water",
    size: 64,
    bg: "radial-gradient(circle at 35% 35%, #e0f2fe 0%, #7dd3fc 65%, #38bdf8 100%)",
    border: "#0ea5e9",
    textColor: "#082f49",
  },
  "염화나트륨 수용액": {
    symbol: "NaCl(aq)",
    sub: "Saline Sol.",
    size: 88,
    bg: "radial-gradient(circle at 35% 35%, #ccfbf1 0%, #5eead4 65%, #2dd4bf 100%)",
    border: "#14b8a6",
    textColor: "#042f2e",
  },
  "염산": {
    symbol: "HCl",
    sub: "Acid",
    size: 66,
    bg: "radial-gradient(circle at 35% 35%, #fef9c3 0%, #fde047 65%, #facc15 100%)",
    border: "#eab308",
    textColor: "#422006",
  },
  "수산화나트륨": {
    symbol: "NaOH",
    sub: "Base",
    size: 76,
    bg: "radial-gradient(circle at 35% 35%, #f3e8ff 0%, #d8b4fe 65%, #c084fc 100%)",
    border: "#a855f7",
    textColor: "#2e1065",
  },
  "이산화탄소": {
    symbol: "CO₂",
    sub: "Gas",
    size: 68,
    bg: "radial-gradient(circle at 35% 35%, #f1f5f9 0%, #cbd5e1 65%, #94a3b8 100%)",
    border: "#94a3b8",
    textColor: "#0f172a",
  },
  "포도당": {
    symbol: "C₆H₁₂O₆",
    sub: "Glucose",
    size: 90,
    bg: "radial-gradient(circle at 35% 35%, #fef3c7 0%, #fcd34d 65%, #f59e0b 100%)",
    border: "#f59e0b",
    textColor: "#451a03",
  },

  // 에너지
  "열에너지": {
    symbol: "ΔH",
    sub: "Thermal",
    size: 56,
    bg: "radial-gradient(circle at 35% 35%, #b91c1c 0%, #991b1b 70%, #7f1d1d 100%)",
    border: "#f87171",
    textColor: "#ffffff",
  },
  "빛 에너지": {
    symbol: "hν",
    sub: "Photon",
    size: 56,
    bg: "radial-gradient(circle at 35% 35%, #fef9c3 0%, #fde047 65%, #facc15 100%)",
    border: "#eab308",
    textColor: "#422006",
  },

  // 고에너지 반응 / 특수 생성물
  "우라늄-235": {
    symbol: "²³⁵U",
    sub: "Uranium",
    size: 88,
    bg: "radial-gradient(circle at 35% 35%, #ecfccb 0%, #bef264 65%, #a3e635 100%)",
    border: "#84cc16",
    textColor: "#1a2e05",
  },
  "핵분열 성공": {
    symbol: "Fission",
    sub: "핵분열",
    size: 88,
    bg: "radial-gradient(circle at 35% 35%, #be123c 0%, #9f1239 70%, #4c0519 100%)",
    border: "#fb7185",
    textColor: "#ffffff",
  },
  "알칼리 폭발재": {
    symbol: "NaOH+H₂",
    sub: "Alkali Ex",
    size: 84,
    bg: "radial-gradient(circle at 35% 35%, #c2410c 0%, #9a3412 70%, #7c2d12 100%)",
    border: "#fb923c",
    textColor: "#ffffff",
  },
  "초고온 수증기": {
    symbol: "H₂O(g)",
    sub: "Steam",
    size: 82,
    bg: "radial-gradient(circle at 35% 35%, #0369a1 0%, #075985 70%, #0c4a6e 100%)",
    border: "#38bdf8",
    textColor: "#f8fafc",
  },
  "반물질 잔해": {
    symbol: "e⁺/e⁻",
    sub: "Antimatter",
    size: 84,
    bg: "radial-gradient(circle at 35% 35%, #7e22ce 0%, #6b21a8 70%, #3b0764 100%)",
    border: "#c084fc",
    textColor: "#ffffff",
  },
  "코어 멜트다운": {
    symbol: "CRITICAL",
    sub: "Meltdown",
    size: 88,
    bg: "radial-gradient(circle at 35% 35%, #b91c1c 0%, #991b1b 70%, #450a0a 100%)",
    border: "#f87171",
    textColor: "#ffffff",
  },
  "8콤보 마스터": {
    symbol: "8×",
    sub: "Combo",
    size: 84,
    bg: "radial-gradient(circle at 35% 35%, #fef08a 0%, #fde047 65%, #facc15 100%)",
    border: "#eab308",
    textColor: "#422006",
  },
};

export interface AtomicSpec {
  name: string;
  symbol: string;
  protons: number;
  neutrons: number;
  electrons: number;
  note?: string;
}

export const ATOMIC_SPECS: AtomicSpec[] = [
  { name: "수소", symbol: "H", protons: 1, neutrons: 0, electrons: 1 },
  { name: "수소 이온", symbol: "H⁺", protons: 1, neutrons: 0, electrons: 0, note: "양이온" },
  { name: "탄소", symbol: "C", protons: 6, neutrons: 6, electrons: 6 },
  { name: "산소", symbol: "O", protons: 8, neutrons: 8, electrons: 8 },
  { name: "나트륨", symbol: "Na", protons: 11, neutrons: 12, electrons: 11 },
  { name: "염소", symbol: "Cl", protons: 17, neutrons: 18, electrons: 17 },
  { name: "우라늄-235", symbol: "²³⁵U", protons: 92, neutrons: 143, electrons: 92, note: "방사성 동위원소" },
];

export const ATOMIC_REGISTRY: Record<string, string> = Object.fromEntries(
  ATOMIC_SPECS.map((spec) => [`${spec.protons},${spec.neutrons},${spec.electrons}`, spec.name]),
);

export interface StageStep {
  label: string;
  checkItem?: string;
  checkAllItems?: string[];
  isSubmitStep?: boolean;
}

export interface Stage {
  level: number;
  name: string;
  target: string;
  timeLimit: number;
  desc: string;
  constraint: string;
  items: string[];
  steps: StageStep[];
}

export const ALL_ITEMS_POOL = [
  "수소", "산소", "탄소", "나트륨", "염소", "수소 이온", "수산화 이온",
  "물", "염화나트륨", "염산", "수산화나트륨", "이산화탄소", "열에너지", "빛 에너지",
];

export const STAGES: Record<'NORMAL' | 'HARDCORE', Stage[]> = {
  NORMAL: [
    {
      level: 1,
      name: "염화나트륨 수용액 제작",
      target: "염화나트륨 수용액",
      timeLimit: 120,
      desc: "염소와 나트륨을 결합해 염화나트륨(NaCl)을 만든 뒤, 물에 녹여 염화나트륨 수용액을 합성하세요.",
      constraint: "순서: Cl + Na → NaCl 합성 후 NaCl + H₂O 용해",
      items: ["염소", "나트륨", "물"],
      steps: [
        { label: "염소(Cl) + 나트륨(Na) → 염화나트륨(NaCl)", checkItem: "염화나트륨" },
        { label: "염화나트륨(NaCl) + 물(H₂O) → 수용액", checkItem: "염화나트륨 수용액" },
        { label: "목표 물질 확인 후 연구 결과 제출", isSubmitStep: true },
      ],
    },
    {
      level: 2,
      name: "중화반응을 이용한 물 합성",
      target: "물",
      timeLimit: 120,
      desc: "수소 이온과 염소로 염산을, 나트륨과 수산화 이온으로 수산화나트륨을 만든 뒤 중화반응으로 물을 얻으세요.",
      constraint: "주의: 수산화 이온(OH⁻)은 단독으로 분해할 수 없습니다.",
      items: ["수소 이온", "염소", "나트륨", "수산화 이온"],
      steps: [
        { label: "수소 이온(H⁺) + 염소(Cl) → 염산(HCl)", checkItem: "염산" },
        { label: "나트륨(Na) + 수산화 이온(OH⁻) → 수산화나트륨(NaOH)", checkItem: "수산화나트륨" },
        { label: "염산(HCl) + 수산화나트륨(NaOH) → 물(H₂O) + NaCl", checkItem: "물" },
        { label: "물(H₂O) 연구 결과 제출", isSubmitStep: true },
      ],
    },
    {
      level: 3,
      name: "광합성 포도당 합성",
      target: "포도당",
      timeLimit: 150,
      desc: "화학 반응식 계수에 맞춰 이산화탄소(C + 2O)와 물(2H + O), 빛 에너지(C + 열에너지)를 만든 뒤 광합성으로 포도당을 합성하세요.",
      constraint: "계수 준수: C + 2O → CO₂ / 2H + O → H₂O (직접 포도당 조합 불가)",
      items: ["탄소", "산소", "수소", "열에너지"],
      steps: [
        { label: "탄소 1 + 산소 2 → 이산화탄소(CO₂)", checkItem: "이산화탄소" },
        { label: "수소 2 + 산소 1 → 물(H₂O)", checkItem: "물" },
        { label: "탄소 + 열에너지 → 빛 에너지(hν)", checkItem: "빛 에너지" },
        { label: "CO₂ + H₂O + 빛 에너지 → 포도당(C₆H₁₂O₆)", checkItem: "포도당" },
        { label: "포도당 연구 결과 제출", isSubmitStep: true },
      ],
    },
    {
      level: 4,
      name: "물 합성 및 알칼리 반응",
      target: "알칼리 폭발재",
      timeLimit: 120,
      desc: "수소 2개와 산소 1개로 물을 합성한 뒤, 나트륨과 반응시켜 알칼리 폭발재를 얻으세요.",
      constraint: "계수: 수소(H) 2개 + 산소(O) 1개 → 물(H₂O) (과열 +35%)",
      items: ["수소", "산소", "나트륨"],
      steps: [
        { label: "수소 2 + 산소 1 → 물(H₂O)", checkItem: "물" },
        { label: "나트륨(Na) + 물(H₂O) → 알칼리 폭발재", checkItem: "알칼리 폭발재" },
        { label: "알칼리 폭발재 연구 결과 제출", isSubmitStep: true },
      ],
    },
    {
      level: 5,
      name: "수소 폭명기 점화 반응",
      target: "초고온 수증기",
      timeLimit: 90,
      desc: "수소 2개와 산소 1개, 열에너지를 함께 반응시켜 초고온 수증기를 생성하세요.",
      constraint: "조합: 수소(H) 2개 + 산소(O) 1개 + 열에너지(ΔH) (과열 +45%)",
      items: ["수소", "산소", "열에너지"],
      steps: [
        { label: "수소 2 + 산소 1 + 열에너지 → 초고온 수증기", checkItem: "초고온 수증기" },
        { label: "초고온 수증기 연구 결과 제출", isSubmitStep: true },
      ],
    },
    {
      level: 6,
      name: "연속 반응 콤보 실험",
      target: "8콤보 마스터",
      timeLimit: 180,
      desc: "기초 물질들을 활용해 콤보가 끊기기 전에(8초 이내) 반응을 8회 연속 성공시켜 8콤보 마스터를 획득하세요.",
      constraint: "목표: 유효 반응 8회 연속 성공 시 '8콤보 마스터' 자동 생성",
      items: ALL_ITEMS_POOL,
      steps: [
        { label: "끊기지 않고 유효 반응 8회 연속 성공", checkItem: "8콤보 마스터" },
        { label: "8콤보 마스터 연구 결과 제출", isSubmitStep: true },
      ],
    },
  ],
  HARDCORE: [
    {
      level: 1,
      name: "소립자 기반 염화나트륨 수용액",
      target: "염화나트륨 수용액",
      timeLimit: 180,
      desc: "상단의 원소 합성기에서 소립자(p, n, e)로 Na, Cl, H, O를 직접 조립한 뒤 염화나트륨 수용액을 만드세요.",
      constraint: "필수 도구: 상단 '원소 합성기'에서 Na·Cl·H·O 직접 합성",
      items: ["양성자", "중성자", "전자"],
      steps: [
        { label: "원소 합성기에서 Na, Cl, H, O 조립", checkAllItems: ["나트륨", "염소", "수소", "산소"] },
        { label: "2H + O → 물(H₂O) 및 Na + Cl → 염화나트륨(NaCl)", checkAllItems: ["물", "염화나트륨"] },
        { label: "NaCl + H₂O → 염화나트륨 수용액", checkItem: "염화나트륨 수용액" },
        { label: "연구 결과 제출", isSubmitStep: true },
      ],
    },
    {
      level: 2,
      name: "소립자 기반 중화반응",
      target: "물",
      timeLimit: 180,
      desc: "원소 합성기로 H⁺, Cl, Na, H, O를 조립해 수산화 이온(OH⁻), 염산, 수산화나트륨을 거쳐 중화반응으로 물을 얻으세요.",
      constraint: "주의: 수산화 이온 단독 분해 금지 / 입자 직접 조립 필수",
      items: ["양성자", "중성자", "전자"],
      steps: [
        { label: "원소 합성기에서 H⁺, Cl, Na, H, O 조립", checkAllItems: ["수소 이온", "염소", "나트륨", "수소", "산소"] },
        { label: "수소 1 + 산소 1 → 수산화 이온(OH⁻)", checkItem: "수산화 이온" },
        { label: "염산(HCl) & 수산화나트륨(NaOH) 합성", checkAllItems: ["염산", "수산화나트륨"] },
        { label: "염산 + 수산화나트륨 → 물(H₂O) 합성", checkItem: "물" },
        { label: "목표 물질 '물' 연구 결과 제출", isSubmitStep: true },
      ],
    },
    {
      level: 3,
      name: "소립자 기반 광합성 포도당",
      target: "포도당",
      timeLimit: 210,
      desc: "원소 합성기로 C, O, H를 조립하고 CO₂, 물, 빛 에너지를 생성한 뒤 광합성으로 포도당을 완성하세요.",
      constraint: "경로: CO₂ + H₂O + 빛 에너지 → 포도당 (직접 조합 불가)",
      items: ["양성자", "중성자", "전자", "열에너지"],
      steps: [
        { label: "원소 합성기에서 탄소(C), 산소(O), 수소(H) 조립", checkAllItems: ["탄소", "산소", "수소"] },
        { label: "CO₂, 물(H₂O), 빛 에너지(hν) 합성", checkAllItems: ["이산화탄소", "물", "빛 에너지"] },
        { label: "CO₂ + H₂O + 빛 에너지 → 포도당", checkItem: "포도당" },
        { label: "연구 결과 제출", isSubmitStep: true },
      ],
    },
    {
      level: 4,
      name: "우라늄-235 임계질량 핵분열",
      target: "핵분열 성공",
      timeLimit: 180,
      desc: "원소 합성기에서 우라늄-235(양성자 92, 중성자 143, 전자 92)를 합성하고 중성자(n⁰)를 충돌시켜 핵분열을 유도하세요.",
      constraint: "규격: p:92 / n:143 / e:92 (전자 충돌 핵분열 금지)",
      items: ["양성자", "중성자", "전자"],
      steps: [
        { label: "원소 합성기에서 ²³⁵U (p:92, n:143, e:92) 합성", checkItem: "우라늄-235" },
        { label: "²³⁵U + 중성자(n⁰) 반응 실행 → 핵분열 성공", checkItem: "핵분열 성공" },
        { label: "연구 결과 제출", isSubmitStep: true },
      ],
    },
    {
      level: 5,
      name: "입자 쌍소멸 반물질 반응",
      target: "반물질 잔해",
      timeLimit: 150,
      desc: "양성자, 전자, 열에너지를 함께 반응시켜 고에너지 쌍소멸 반응으로 반물질 잔해를 생성하세요.",
      constraint: "조합: 양성자(p⁺) + 전자(e⁻) + 열에너지(ΔH) (과열 +50%)",
      items: ["양성자", "중성자", "전자", "열에너지"],
      steps: [
        { label: "양성자 + 전자 + 열에너지 → 반물질 잔해", checkItem: "반물질 잔해" },
        { label: "반물질 잔해 연구 결과 제출", isSubmitStep: true },
      ],
    },
    {
      level: 6,
      name: "코어 과열 100% 멜트다운",
      target: "코어 멜트다운",
      timeLimit: 90,
      desc: "고에너지 발열 반응을 연속으로 실행해 챔버 과열도(HEAT)를 100%까지 폭주시켜 코어 멜트다운을 유도하세요.",
      constraint: "목표: 과열도 100% 도달 시 '코어 멜트다운' 자동 생성",
      items: ["양성자", "중성자", "전자", "열에너지"],
      steps: [
        { label: "고에너지 반응 반복으로 과열도(HEAT) 100% 도달", checkItem: "코어 멜트다운" },
        { label: "코어 멜트다운 연구 결과 제출", isSubmitStep: true },
      ],
    },
  ],
};
