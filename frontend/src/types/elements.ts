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
  "양성자": { symbol: "p⁺", sub: "Proton", size: 48, bg: "radial-gradient(circle at 35% 35%, #fca5a5 0%, #ef4444 60%, #991b1b 100%)", border: "#f87171", textColor: "#fff" },
  "중성자": { symbol: "n⁰", sub: "Neutron", size: 48, bg: "radial-gradient(circle at 35% 35%, #e2e8f0 0%, #94a3b8 60%, #475569 100%)", border: "#cbd5e1", textColor: "#fff" },
  "전자": { symbol: "e⁻", sub: "Electron", size: 42, bg: "radial-gradient(circle at 35% 35%, #bae6fd 0%, #38bdf8 60%, #0369a1 100%)", border: "#7dd3fc", textColor: "#fff" },

  // 원소 및 이온
  "수소": { symbol: "H", sub: "Hydrogen", size: 54, bg: "radial-gradient(circle at 35% 35%, #e0f2fe 0%, #7dd3fc 60%, #0284c7 100%)", border: "#38bdf8", textColor: "#0f172a" },
  "수소 이온": { symbol: "H⁺", sub: "Hydron", size: 50, bg: "radial-gradient(circle at 35% 35%, #cffafe 0%, #22d3ee 60%, #0891b2 100%)", border: "#67e8f9", textColor: "#083344" },
  "탄소": { symbol: "C", sub: "Carbon", size: 66, bg: "radial-gradient(circle at 35% 35%, #d1fae5 0%, #6ee7b7 60%, #059669 100%)", border: "#34d399", textColor: "#064e3b" },
  "산소": { symbol: "O", sub: "Oxygen", size: 62, bg: "radial-gradient(circle at 35% 35%, #dbeafe 0%, #60a5fa 60%, #1d4ed8 100%)", border: "#3b82f6", textColor: "#1e3a8a" },
  "나트륨": { symbol: "Na", sub: "Sodium", size: 76, bg: "radial-gradient(circle at 35% 35%, #fce7f3 0%, #f472b6 60%, #db2777 100%)", border: "#f43f5e", textColor: "#831843" },
  "염소": { symbol: "Cl", sub: "Chlorine", size: 72, bg: "radial-gradient(circle at 35% 35%, #dcfce7 0%, #86efac 60%, #16a34a 100%)", border: "#22c55e", textColor: "#14532d" },
  "수산화 이온": { symbol: "OH⁻", sub: "Hydroxide", size: 58, bg: "radial-gradient(circle at 35% 35%, #f3e8ff 0%, #c084fc 60%, #7e22ce 100%)", border: "#a855f7", textColor: "#3b0764" },

  // 화합물
  "염화나트륨": { symbol: "NaCl", sub: "Salt", size: 80, bg: "radial-gradient(circle at 35% 35%, #fed7aa 0%, #fb923c 60%, #c2410c 100%)", border: "#f97316", textColor: "#431407" },
  "물": { symbol: "H₂O", sub: "Water", size: 64, bg: "radial-gradient(circle at 35% 35%, #bae6fd 0%, #38bdf8 60%, #0369a1 100%)", border: "#0ea5e9", textColor: "#0c4a6e" },
  "염화나트륨 수용액": { symbol: "NaCl(aq)", sub: "Saline Sol.", size: 92, bg: "radial-gradient(circle at 35% 35%, #ccfbf1 0%, #2dd4bf 60%, #0f766e 100%)", border: "#14b8a6", textColor: "#134e4a" },
  "염산": { symbol: "HCl", sub: "Acid", size: 66, bg: "radial-gradient(circle at 35% 35%, #fef08a 0%, #facc15 60%, #ca8a04 100%)", border: "#eab308", textColor: "#713f12" },
  "수산화나트륨": { symbol: "NaOH", sub: "Base", size: 78, bg: "radial-gradient(circle at 35% 35%, #e9d5ff 0%, #a855f7 60%, #6b21a8 100%)", border: "#9333ea", textColor: "#3b0764" },
  "이산화탄소": { symbol: "CO₂", sub: "Gas", size: 68, bg: "radial-gradient(circle at 35% 35%, #cbd5e1 0%, #94a3b8 60%, #475569 100%)", border: "#64748b", textColor: "#0f172a" },
  "포도당": { symbol: "C₆H₁₂O₆", sub: "Glucose", size: 94, bg: "radial-gradient(circle at 35% 35%, #fef3c7 0%, #f59e0b 60%, #b45309 100%)", border: "#d97706", textColor: "#451a03" },

  // 에너지 및 특수물질
  "열에너지": { symbol: "🔥", sub: "Thermal", size: 54, bg: "radial-gradient(circle at 35% 35%, #fee2e2 0%, #f87171 60%, #dc2626 100%)", border: "#ef4444", textColor: "#7f1d1d" },
  "빛 에너지": { symbol: "⚡", sub: "Photon", size: 54, bg: "radial-gradient(circle at 35% 35%, #fef9c3 0%, #fde047 60%, #ca8a04 100%)", border: "#eab308", textColor: "#713f12" },

  // 폭발 결과물 / 특수물질
  "우라늄-235": { symbol: "²³⁵U", sub: "Uranium", size: 94, bg: "radial-gradient(circle at 35% 35%, #d9f99d 0%, #84cc16 60%, #3f6212 100%)", border: "#65a30d", textColor: "#1a2e05" },
  "핵분열 성공": { symbol: "💥", sub: "Nuclear Fission", size: 98, bg: "radial-gradient(circle at 35% 35%, #ffe4e6 0%, #f43f5e 60%, #9f1239 100%)", border: "#e11d48", textColor: "#4c0519" },
  "알칼리 폭발재": { symbol: "🔥💥", sub: "NaOH+H₂ Gas", size: 84, bg: "radial-gradient(circle at 35% 35%, #ffedd5 0%, #f97316 60%, #7c2d12 100%)", border: "#ea580c", textColor: "#fff" },
  "초고온 수증기": { symbol: "💨⚡", sub: "Superheated Gas", size: 84, bg: "radial-gradient(circle at 35% 35%, #e0f2fe 0%, #0284c7 60%, #0c4a6e 100%)", border: "#0ea5e9", textColor: "#fff" },
  "반물질 잔해": { symbol: "🌀", sub: "Dark Matter Void", size: 88, bg: "radial-gradient(circle at 35% 35%, #f3e8ff 0%, #7e22ce 60%, #3b0764 100%)", border: "#a855f7", textColor: "#fff" },
};

export const ATOMIC_REGISTRY: Record<string, string> = {
  "1,0,1": "수소",
  "1,0,0": "수소 이온",
  "6,6,6": "탄소",
  "8,8,8": "산소",
  "11,12,11": "나트륨",
  "17,18,17": "염소",
  "143,92,92": "우라늄-235"
};

export interface Stage {
  level: number;
  name: string;
  target: string;
  timeLimit: number;
  desc: string;
  constraint: string;
  items: string[];
}

export const STAGES: Record<'NORMAL' | 'HARDCORE', Stage[]> = {
  NORMAL: [
    {
      level: 1,
      name: "염화나트륨 수용액 제작",
      target: "염화나트륨 수용액",
      timeLimit: 120,
      desc: "염소와 나트륨의 이온결합을 통하여 염화나트륨을 제작하고, 이를 물과 섞어 염화나트륨 수용액을 만드세요.",
      constraint: "📌 염소(Cl) + 나트륨(Na) → 염화나트륨(NaCl) 후 물에 용해",
      items: ["염소", "나트륨", "물"]
    },
    {
      level: 2,
      name: "중화반응을 이용한 물 합성",
      target: "물",
      timeLimit: 120,
      desc: "수소 이온과 염소로 염산을, 나트륨과 수산화 이온으로 수산화나트륨을 만든 뒤 중화반응을 통해 물을 얻으세요.",
      constraint: "⚠️ 제한사항: 수산화 이온(OH⁻)을 분해하여 산소를 얻을 수 없습니다.",
      items: ["수소 이온", "염소", "나트륨", "수산화 이온"]
    },
    {
      level: 3,
      name: "광합성 산화환원 포도당 합성",
      target: "포도당",
      timeLimit: 150,
      desc: "탄소와 산소로 이산화탄소를, 산소와 수소로 물을 만드세요. 탄소에 열에너지를 가해 얻은 빛 에너지로 광합성을 진행하세요.",
      constraint: "⚠️ 제한사항: 탄소, 수소, 산소를 섞어 포도당을 직접 합성할 수 없습니다.",
      items: ["탄소", "산소", "수소", "열에너지"]
    }
  ],
  HARDCORE: [
    {
      level: 1,
      name: "[하드코어] 염화나트륨 수용액",
      target: "염화나트륨 수용액",
      timeLimit: 180,
      desc: "제공품 없이 소립자(p, n, e)만을 이용해 원소를 직접 합성해야 합니다. 염화나트륨 수용액을 완성하세요.",
      constraint: "⚛️ '원소 합성기' 팝업을 열어 나트륨, 염소, 수소, 산소를 합성하여 진행하세요.",
      items: ["양성자", "중성자", "전자"]
    },
    {
      level: 2,
      name: "[하드코어] 중화반응과 물",
      target: "물",
      timeLimit: 180,
      desc: "소립자로부터 수소 이온, 염소, 나트륨 및 물을 조립하고 산·염기 중화반응을 거쳐 순수한 물을 얻으세요.",
      constraint: "⚠️ 수산화 이온 단독 분해 금지 / 직접 입자 조립 필수",
      items: ["양성자", "중성자", "전자"]
    },
    {
      level: 3,
      name: "[하드코어] 광합성 포도당 합성",
      target: "포도당",
      timeLimit: 210,
      desc: "기초 입자로 원소를 합성하고 열에너지를 전환하여 빛 에너지를 획득한 후 광합성으로 포도당을 완성하세요.",
      constraint: "⚠️ 직접 포도당 조합 불가 (이산화탄소, 물, 빛 경유 필수)",
      items: ["양성자", "중성자", "전자", "열에너지"]
    },
    {
      level: 4,
      name: "[하드코어] 우라늄-235 임계질량 핵분열",
      target: "핵분열 성공",
      timeLimit: 180,
      desc: "소립자를 정확히 조합하여 우라늄-235를 합성하고, 중성자를 충돌시켜 임계질량을 초과한 핵분열 반응을 유도하세요.",
      constraint: "⚠️ 제약조건: 전자 충돌 핵분열 금지. 우라늄 규격: 양성자 143개, 중성자 92개, 전자 92개.",
      items: ["양성자", "중성자", "전자"]
    }
  ]
};

