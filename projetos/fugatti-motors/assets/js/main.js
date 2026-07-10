/* ============================================================
   FUGATTI MOTORS — interações + catálogo
   Preços aproximados ao mercado brasileiro (2024/2025).
   Fotos: Wikimedia Commons (uso demonstrativo).
   ============================================================ */
'use strict';

/* ---------- Catálogo ---------- */
const CARS = [
  {
    id: 'porsche-911-turbo-s', name: 'Porsche 911 Turbo S', tag: 'Ícone Alemão', badge: 'Flagship',
    price: 'R$ 2.190.000', accent: '#35e6ff', body: '#d9e1ec', glass: '#0d2233',
    engine: 'Boxer 3.8 6-cil. biturbo', drive: 'Tração integral (AWD)',
    power: 650, torque: 800, zero: 2.7, top: 330,
    desc: 'O motor boxer de 6 cilindros twin-turbo montado na traseira define o que é um esportivo de verdade. Tração integral, reflexos afiados e uso diário sem drama.',
  },
  {
    id: 'porsche-911-gt3-rs', name: 'Porsche 911 GT3 RS', tag: 'Pista homologada', badge: 'Aero Ativo',
    price: 'R$ 2.800.000', accent: '#7fe3ff', body: '#e7ebf0', glass: '#101c26',
    engine: 'Flat-6 4.0 aspirado (9.000 rpm)', drive: 'Tração traseira (RWD)',
    power: 525, torque: 465, zero: 3.2, top: 296,
    desc: 'Asa traseira gigante em modo DRS, aerodinâmica de carro de corrida e um motor aspirado que gira até 9.000 rpm. Nasceu para o autódromo.',
  },
  {
    id: 'porsche-911-gt2-rs', name: 'Porsche 911 GT2 RS', tag: 'O 911 mais radical', badge: 'Widowmaker',
    price: 'R$ 3.600.000', accent: '#ff6b6b', body: '#eceff3', glass: '#141018',
    engine: 'Flat-6 3.8 biturbo', drive: 'Tração traseira (RWD)',
    power: 700, torque: 750, zero: 2.7, top: 340,
    desc: 'Toda a potência do Turbo, só nas rodas traseiras. Apelidado de "widowmaker", é o 911 de rua mais extremo já feito.',
  },
  {
    id: 'porsche-macan', name: 'Porsche Macan GTS', tag: 'SUV Esportivo', badge: 'Uso Diário',
    price: 'R$ 640.000', accent: '#35e6ff', body: '#2b3442', glass: '#0a0f16',
    engine: 'V6 2.9 biturbo', drive: 'Tração integral (AWD)',
    power: 440, torque: 550, zero: 4.3, top: 272,
    brakes: 'Discos ventilados de aço de alto desempenho (opção cerâmica)',
    suspension: 'Suspensão pneumática adaptativa (air suspension)',
    desc: 'A porta de entrada do luxo Porsche: um SUV compacto que corre como esportivo e serve pra família. Prático sem abrir mão do DNA de pista.',
  },
  {
    id: 'mclaren-720s', name: 'McLaren 720S', tag: 'Supercarro Inglês', badge: 'Fibra de Carbono',
    price: 'R$ 4.900.000', accent: '#ff9f1c', body: '#e07b00', glass: '#2a1a04',
    engine: 'V8 4.0 biturbo', drive: 'Tração traseira (RWD)',
    power: 720, torque: 770, zero: 2.9, top: 341,
    desc: 'Monocasco de fibra de carbono, portas dihedral e uma relação peso-potência absurda. Leveza inglesa levada ao extremo.',
  },
  {
    id: 'ferrari-sf90', name: 'Ferrari SF90 Stradale', tag: 'Híbrido de 1000 cv', badge: 'PHEV Plug-in',
    price: 'R$ 5.900.000', accent: '#ff2d55', body: '#c81027', glass: '#2a0810',
    engine: 'V8 4.0 biturbo + 3 motores elétricos', drive: 'Tração integral (AWD híbrido)',
    power: 1000, torque: 800, zero: 2.5, top: 340,
    desc: 'A primeira Ferrari híbrida plug-in de série: 1000 cv combinados, tração integral elétrica na dianteira e modo 100% elétrico na cidade.',
  },
  {
    id: 'ferrari-296', name: 'Ferrari 296 GTB', tag: 'V6 Híbrido', badge: 'Piccolo V12',
    price: 'R$ 4.200.000', accent: '#ff3b5c', body: '#b3121f', glass: '#280810',
    engine: 'V6 3.0 biturbo + elétrico', drive: 'Tração traseira (RWD híbrido)',
    power: 830, torque: 740, zero: 2.9, top: 330,
    desc: 'Um V6 turbo híbrido que a Ferrari chama de "piccolo V12" pelo timbre agudo. Compacta, ágil e brutalmente rápida.',
  },
  {
    id: 'ferrari-812', name: 'Ferrari 812 Superfast', tag: 'V12 Aspirado', badge: '6.5L N/A',
    price: 'R$ 4.800.000', accent: '#ffd23f', body: '#f0b500', glass: '#2a2004',
    engine: 'V12 6.5 aspirado', drive: 'Tração traseira (RWD)',
    power: 800, torque: 718, zero: 2.9, top: 340,
    desc: 'O último dos grandes GTs de motor dianteiro V12 aspirado. 800 cavalos que sobem até 8.900 rpm com um som que arrepia.',
  },
  {
    id: 'ferrari-purosangue', name: 'Ferrari Purosangue', tag: 'SUV V12', badge: 'Primeiro SUV Ferrari',
    price: 'R$ 5.400.000', accent: '#ff4d4d', body: '#7a1020', glass: '#1a0508',
    engine: 'V12 6.5 aspirado', drive: 'Tração integral (AWD)',
    power: 725, torque: 716, zero: 3.3, top: 310,
    desc: 'O primeiro SUV da história da Ferrari — e ainda assim com um V12 aspirado na frente. Portas suicidas e 4 lugares de verdade.',
  },
  {
    id: 'audi-r8', name: 'Audi R8 V10 Performance', tag: 'Supercarro Alemão', badge: 'V10 Aspirado',
    price: 'R$ 1.750.000', accent: '#c7d0dc', body: '#9aa5b4', glass: '#141a22',
    engine: 'V10 5.2 aspirado', drive: 'Tração integral quattro',
    power: 620, torque: 580, zero: 3.1, top: 331,
    desc: 'Irmão de plataforma do Huracán, com a tração quattro e o refinamento Audi. Um V10 aspirado usável todos os dias.',
  },
  {
    id: 'lamborghini-huracan', name: 'Lamborghini Huracán', tag: 'Touro Italiano', badge: 'V10 Aspirado',
    price: 'R$ 3.700.000', accent: '#a3e635', body: '#7cb305', glass: '#16200a',
    engine: 'V10 5.2 aspirado', drive: 'Tração integral / traseira',
    power: 640, torque: 565, zero: 3.2, top: 325,
    desc: 'O V10 aspirado mais famoso do mundo. Linhas anguladas, som de fórmula e a teatralidade que só uma Lamborghini entrega.',
  },
  {
    id: 'lamborghini-revuelto', name: 'Lamborghini Revuelto', tag: 'Hypercar Híbrido', badge: 'V12 + 3 Elétricos',
    price: 'R$ 6.900.000', accent: '#a566ff', body: '#5b21b6', glass: '#160a2a',
    engine: 'V12 6.5 aspirado + 3 motores elétricos', drive: 'Tração integral (AWD híbrido)',
    power: 1015, torque: 725, zero: 2.5, top: 350,
    desc: 'A sucessora do Aventador: um V12 aspirado híbrido de mais de 1000 cv, com chassi de fibra de carbono e visual de nave espacial.',
  },
  {
    id: 'lamborghini-aventador', name: 'Lamborghini Aventador Ultimae', tag: 'V12 Clássico', badge: 'Edição Final',
    price: 'R$ 6.000.000', accent: '#ff8c00', body: '#e2680c', glass: '#2a1404',
    engine: 'V12 6.5 aspirado', drive: 'Tração integral (AWD)',
    power: 780, torque: 720, zero: 2.8, top: 355,
    desc: 'A despedida do lendário V12 aspirado puro da Lamborghini. Portas em tesoura, escape titânico e 780 cavalos sem qualquer ajuda elétrica.',
  },
  {
    id: 'amg-gt', name: 'Mercedes-AMG GT', tag: 'GT Alemão', badge: 'Handcrafted V8',
    price: 'R$ 1.600.000', accent: '#5eead4', body: '#1f2933', glass: '#080d12',
    engine: 'V8 4.0 biturbo', drive: 'Tração traseira / integral',
    power: 585, torque: 800, zero: 3.2, top: 315,
    desc: 'Capô longo, motor "one man, one engine" montado à mão em Affalterbach. O grand tourer que mistura brutalidade e elegância.',
  },
  {
    id: 'bugatti-chiron', name: 'Bugatti Chiron', tag: 'Hypercar Supremo', badge: 'W16 Quad-Turbo',
    price: 'R$ 32.000.000', accent: '#4d7dff', body: '#1e3a8a', glass: '#0a1428',
    engine: 'W16 8.0 quad-turbo', drive: 'Tração integral (AWD)',
    power: 1500, torque: 1600, zero: 2.4, top: 420,
    gearbox: 'Dupla embreagem de 7 marchas',
    chassis: 'Monocasco de fibra de carbono com estrutura em titânio',
    desc: 'Dezesseis cilindros, quatro turbos, mais de 1500 cavalos e a barreira dos 420 km/h. O ápice absoluto da engenharia automotiva.',
  },
  {
    id: 'aston-valkyrie', name: 'Aston Martin Valkyrie', tag: 'Fórmula 1 de rua', badge: 'V12 Cosworth',
    price: 'R$ 22.000.000', accent: '#22d3ee', body: '#14532d', glass: '#08160e',
    engine: 'V12 6.5 aspirado + KERS híbrido', drive: 'Tração traseira (RWD)',
    power: 1160, torque: 900, zero: 2.5, top: 350,
    desc: 'Projetado por Adrian Newey, o gênio da F1. Efeito solo extremo, V12 que gira a 11.000 rpm e a experiência mais próxima de um carro de corrida.',
  },
  {
    id: 'rolls-spectre', name: 'Rolls-Royce Spectre', tag: 'Luxo Elétrico', badge: '100% Elétrico',
    price: 'R$ 4.500.000', accent: '#c084fc', body: '#312e81', glass: '#0f0c28',
    engine: 'Dois motores elétricos + bateria', drive: 'Tração integral (AWD)',
    power: 585, torque: 900, zero: 4.5, top: 250,
    gearbox: 'Transmissão de redução única (100% elétrico)',
    suspension: 'Suspensão a ar Planar com câmeras de leitura do solo',
    desc: 'O primeiro Rolls-Royce totalmente elétrico. Silêncio absoluto, torque instantâneo e o teto estrelado que virou marca da casa.',
  },
];

/* Paleta monocromática — sobrescreve as cores por-carro por um tom prata único */
const ACCENT = '#eef0f3';
CARS.forEach(c => { c.accent = ACCENT; c.body = '#3b3e45'; c.glass = '#0d0f14'; });

/* ---------- Helpers de spec ---------- */
const clampPct = (v) => Math.max(6, Math.min(100, Math.round(v)));
function coreSpecs(c) {
  return [
    { name: 'Potência',          val: `${c.power} cv`,   pct: clampPct(c.power / 1500 * 100) },
    { name: 'Torque',            val: `${c.torque} Nm`,  pct: clampPct(c.torque / 1650 * 100) },
    { name: 'Aceleração 0–100',  val: `${c.zero.toFixed(1)} s`, pct: clampPct((5.2 - c.zero) / 2.9 * 100) },
    { name: 'Velocidade máxima', val: `${c.top} km/h`,   pct: clampPct(c.top / 440 * 100) },
  ];
}
/* Regiões clicáveis do blueprint — specs por parte do carro */
function regionData(c) {
  const gearbox    = c.gearbox    || 'Automático de dupla embreagem, 8 marchas';
  const chassis    = c.chassis    || 'Monocasco em alumínio e fibra de carbono';
  const brakes     = c.brakes     || 'Freios carbono-cerâmica de alto desempenho';
  const suspension = c.suspension || 'Suspensão adaptativa com amortecimento eletrônico';
  const aero       = c.aero       || 'Aerodinâmica ativa com difusor e asa traseira';
  const wheels     = c.wheels     || 'Rodas forjadas com pneus de alta performance';
  return [
    { id:'motor', num:'1', icon:'⚙', label:'Motor', x:26, y:44,
      specs:[['Configuração', c.engine], ['Potência', `${c.power} cv`], ['Torque', `${c.torque} Nm`]] },
    { id:'transmissao', num:'2', icon:'🔗', label:'Transmissão', x:45, y:60,
      specs:[['Câmbio', gearbox], ['Tração', c.drive]] },
    { id:'chassi', num:'3', icon:'▦', label:'Chassi', x:53, y:76,
      specs:[['Construção', chassis], ['Dinâmica', 'Baixo centro de gravidade e alta rigidez torcional']] },
    { id:'frenagem', num:'4', icon:'◉', label:'Frenagem', x:73, y:68,
      specs:[['Sistema', brakes], ['Assistências', 'ABS, controle de tração e estabilidade']] },
    { id:'suspensao', num:'5', icon:'◇', label:'Suspensão', x:24, y:72,
      specs:[['Tipo', suspension], ['Rodas / Pneus', wheels]] },
    { id:'aero', num:'6', icon:'✦', label:'Aerodinâmica', x:87, y:54,
      specs:[['Perfil', aero], ['Vel. máxima', `${c.top} km/h`], ['0–100 km/h', `${c.zero.toFixed(1)} s`]] },
  ];
}

/* Wireframe/blueprint do carro (contorno luminoso) */
function blueprintSVG(c) {
  const a = c.accent;
  return `
  <svg class="blueprint-svg" viewBox="0 0 640 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Blueprint ${c.name}" style="--accent:${a}">
    <g fill="none" stroke="${a}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M70,214 C70,190 92,168 132,164 L214,158 C246,150 300,146 360,150 L470,156 C520,160 566,182 574,210"/>
      <path d="M96,222 L548,222"/>
      <path d="M212,162 C238,112 300,102 352,106 C404,110 440,132 458,164"/>
      <path d="M232,158 C252,126 300,120 336,122"/>
      <path d="M348,122 C392,126 420,140 438,158"/>
      <path d="M342,120 L344,158"/>
      <path d="M300,160 L308,214"/>
      <path d="M360,160 L366,214" opacity="0.55"/>
      <path d="M96,200 C220,192 440,192 556,204" opacity="0.7"/>
      <path d="M458,164 L560,182"/>
      <path d="M540,178 q22,4 26,22"/>
      <path d="M250,220 C244,186 248,150 264,140" opacity="0.45"/>
      <path d="M330,222 C326,182 330,152 346,132" opacity="0.45"/>
      <path d="M410,220 C408,184 412,158 430,150" opacity="0.45"/>
      <circle cx="178" cy="226" r="46"/><circle cx="178" cy="226" r="30" opacity="0.55"/><circle cx="178" cy="226" r="6"/>
      <circle cx="470" cy="226" r="46"/><circle cx="470" cy="226" r="30" opacity="0.55"/><circle cx="470" cy="226" r="6"/>
      <path d="M128,214 A52 52 0 0 1 228,214" opacity="0.7"/>
      <path d="M420,214 A52 52 0 0 1 520,214" opacity="0.7"/>
    </g>
  </svg>`;
}
const imgPath = (c) => `assets/img/${c.image || c.id + '.jpg'}`;

/* ---------- SVG de fallback (aparece se a foto falhar) ---------- */
function carSVG(c, extraClass = '') {
  const b = c.body, g = c.glass, a = c.accent;
  return `
  <svg class="car-svg ${extraClass}" viewBox="0 0 640 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${c.name}">
    <defs>
      <linearGradient id="body-${c.id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${b}"/><stop offset="1" stop-color="${shade(b,-32)}"/>
      </linearGradient>
      <linearGradient id="glass-${c.id}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${shade(g,40)}"/><stop offset="1" stop-color="${g}"/>
      </linearGradient>
    </defs>
    <ellipse class="part p-chassis" cx="320" cy="256" rx="238" ry="12" fill="${a}" opacity="0.22"/>
    <g class="part p-chassis">
      <rect x="118" y="212" width="404" height="20" rx="10" fill="${shade(b,-55)}"/>
      <rect x="150" y="206" width="340" height="10" rx="5" fill="${a}" opacity="0.35"/>
    </g>
    <g class="part p-engine">
      <rect x="150" y="168" width="120" height="52" rx="8" fill="${shade(b,-48)}" stroke="${a}" stroke-width="1.5"/>
      <line x1="168" y1="176" x2="168" y2="212" stroke="${a}" stroke-width="3" opacity="0.6"/>
      <line x1="186" y1="176" x2="186" y2="212" stroke="${a}" stroke-width="3" opacity="0.6"/>
      <line x1="204" y1="176" x2="204" y2="212" stroke="${a}" stroke-width="3" opacity="0.6"/>
      <line x1="222" y1="176" x2="222" y2="212" stroke="${a}" stroke-width="3" opacity="0.6"/>
      <circle cx="252" cy="182" r="9" fill="none" stroke="${a}" stroke-width="2"/>
    </g>
    <g class="part p-interior">
      <path d="M300,176 q10,-26 30,-26 q18,0 20,26 z" fill="${shade(b,-60)}"/>
      <path d="M348,176 q10,-24 28,-24 q16,0 18,24 z" fill="${shade(b,-60)}"/>
    </g>
    <g class="part p-body">
      <path d="M70,214 C70,190 92,168 132,164 L214,158 C246,150 300,146 360,150 L470,156 C520,160 566,182 574,210 C576,220 568,226 556,226 L92,226 C76,226 70,222 70,214 Z"
            fill="url(#body-${c.id})" stroke="${shade(b,30)}" stroke-width="1"/>
      <path d="M96,200 L556,200" stroke="${a}" stroke-width="2" opacity="0.45"/>
      <path d="M552,178 q18,2 20,18 l-22,2 z" fill="${a}" opacity="0.9"/>
      <rect x="74" y="182" width="26" height="8" rx="4" fill="${a}" opacity="0.9"/>
    </g>
    <g class="part p-cabin">
      <path d="M212,162 C238,112 300,102 352,106 C404,110 440,132 458,164 Z" fill="url(#body-${c.id})" stroke="${shade(b,30)}" stroke-width="1"/>
      <path d="M232,158 C252,126 300,120 336,122 L338,158 Z" fill="url(#glass-${c.id})"/>
      <path d="M348,122 C392,126 420,140 438,158 L352,158 Z" fill="url(#glass-${c.id})"/>
      <line x1="342" y1="120" x2="344" y2="158" stroke="${shade(b,20)}" stroke-width="3"/>
    </g>
    <g class="part p-spoiler">
      <rect x="60" y="150" width="86" height="9" rx="4" fill="${shade(b,-30)}"/>
      <rect x="66" y="158" width="7" height="26" rx="3" fill="${shade(b,-40)}"/>
      <rect x="132" y="158" width="7" height="26" rx="3" fill="${shade(b,-40)}"/>
    </g>
    <g class="part p-wheel-r">${wheel(178, 226, a)}</g>
    <g class="part p-wheel-f">${wheel(470, 226, a)}</g>
  </svg>`;
}
function wheel(cx, cy, a) {
  const spokes = [0,45,90,135,180,225,270,315].map(deg => {
    const rad = deg*Math.PI/180;
    return `<line x1="${cx+12*Math.cos(rad)}" y1="${cy+12*Math.sin(rad)}" x2="${cx+29*Math.cos(rad)}" y2="${cy+29*Math.sin(rad)}" stroke="#cbd5e6" stroke-width="3"/>`;
  }).join('');
  return `<circle cx="${cx}" cy="${cy}" r="46" fill="#0b0d14" stroke="#1b2230" stroke-width="2"/>
    <circle cx="${cx}" cy="${cy}" r="30" fill="none" stroke="${a}" stroke-width="2" opacity="0.65"/>${spokes}
    <circle cx="${cx}" cy="${cy}" r="9" fill="${a}"/>`;
}
function shade(hex, amt) {
  let h = hex.replace('#',''); if (h.length===3) h = h.split('').map(x=>x+x).join('');
  const num = parseInt(h,16);
  const cl = (x) => Math.max(0, Math.min(255, x));
  const r = cl((num>>16)+amt), gr = cl(((num>>8)&0xff)+amt), bl = cl((num&0xff)+amt);
  return '#'+((1<<24)+(r<<16)+(gr<<8)+bl).toString(16).slice(1);
}

/* ---------- Render dos cards ---------- */
const grid = document.getElementById('carGrid');
grid.innerHTML = CARS.map(c => `
  <article class="car-card reveal-up" style="--card-color:${c.accent}" data-id="${c.id}" tabindex="0" role="button" aria-label="Abrir folha técnica: ${c.name}">
    <div class="card-visual">
      <span class="card-badge">${c.badge}</span>
      ${carSVG(c)}
      <img class="car-photo" src="${imgPath(c)}" alt="${c.name}" loading="lazy" onerror="this.remove()">
    </div>
    <div class="card-info">
      <span class="card-tag">${c.tag}</span>
      <h3>${c.name}</h3>
      <div class="card-meta">
        <div><b>${c.power}</b><small>cavalos</small></div>
        <div><b>${c.zero.toFixed(1)}s</b><small>0–100</small></div>
        <div><b>${c.top}</b><small>km/h</small></div>
      </div>
      <div class="card-bottom">
        <span class="card-price">${c.price}</span>
        <span class="card-cta"><span>Montagem</span><span class="arrow">→</span></span>
      </div>
    </div>
  </article>
`).join('');

/* ---------- Folha técnica ---------- */
const sheet = document.getElementById('sheet');
const sheetBody = document.getElementById('sheetBody');
let lastFocused = null;

function openSheet(id) {
  const c = CARS.find(x => x.id === id);
  if (!c) return;
  lastFocused = document.activeElement;
  const specs = coreSpecs(c);
  const regions = regionData(c);

  sheetBody.innerHTML = `
    <div class="sheet-hero" style="--accent:${c.accent}">
      <div class="sheet-title-block">
        <p class="eyebrow">${c.tag}</p>
        <h2>${c.name}</h2>
        <p class="price">${c.price}</p>
        <p class="sheet-desc">${c.desc}</p>
        <p class="engine-line"><span>⚙ ${c.engine}</span><span>◈ ${c.drive}</span></p>
      </div>
      <div class="sheet-media">
        ${carSVG(c)}
        <img class="car-photo" src="${imgPath(c)}" alt="${c.name}" onerror="this.remove()">
      </div>
    </div>

    <div class="stage-section">
      <h3 class="block-title" style="--accent:${c.accent}">◣ Anatomia do carro — clique em cada região</h3>
      <div class="blueprint" style="--accent:${c.accent}">
        <div class="bp-stage">
          ${blueprintSVG(c)}
          <div class="zone-highlight" id="zoneHi"></div>
          ${regions.map(r => `
            <button class="hotspot" data-region="${r.id}" style="left:${r.x}%;top:${r.y}%" aria-label="${r.label}">
              <span class="hs-dot">${r.num}</span><span class="hs-label">${r.label}</span>
            </button>`).join('')}
        </div>
        <div class="region-panel" id="regionPanel"></div>
      </div>
    </div>

    <div class="specs" style="--accent:${c.accent}">
      <h3 class="block-title">◣ Ficha técnica</h3>
      <div class="spec-quick">
        <div class="qcard"><b>${c.power}</b><small>cavalos</small></div>
        <div class="qcard"><b>${c.zero.toFixed(1)}s</b><small>0–100 km/h</small></div>
        <div class="qcard"><b>${c.top}</b><small>km/h máx</small></div>
        <div class="qcard"><b>${c.torque}</b><small>Nm torque</small></div>
      </div>
      ${specs.map(s => `
        <div class="spec-row">
          <div class="spec-top"><span class="spec-name">${s.name}</span><span class="spec-val">${s.val}</span></div>
          <div class="spec-bar"><div class="spec-fill" data-pct="${s.pct}"></div></div>
        </div>`).join('')}
    </div>

    <div class="sheet-footer" style="--accent:${c.accent}">
      <a href="#contato" class="btn btn-primary" data-close>Agendar test drive</a>
      <button class="btn btn-ghost" data-close>Voltar ao showroom</button>
    </div>
  `;

  sheet.classList.add('open');
  sheet.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  sheetBody.scrollTop = 0;

  const hi = sheetBody.querySelector('#zoneHi');
  const panel = sheetBody.querySelector('#regionPanel');
  const hotspots = sheetBody.querySelectorAll('.hotspot');
  function selectRegion(id) {
    const r = regions.find(x => x.id === id); if (!r) return;
    hotspots.forEach(h => h.classList.toggle('active', h.dataset.region === id));
    hi.style.left = r.x + '%'; hi.style.top = r.y + '%'; hi.classList.add('show');
    panel.innerHTML = `<div class="rp-head"><span class="rp-icon">${r.icon}</span><h4>${r.label}</h4></div>` +
      r.specs.map(([k, v]) => `<div class="rp-row"><span class="rp-k">${k}</span><span class="rp-v">${v}</span></div>`).join('');
  }
  hotspots.forEach(h => h.addEventListener('click', () => selectRegion(h.dataset.region)));
  selectRegion('motor');

  requestAnimationFrame(() => setTimeout(() => {
    sheetBody.querySelectorAll('.spec-fill').forEach(f => { f.style.width = f.dataset.pct + '%'; });
  }, 250));

  sheetBody.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeSheet));
  sheet.querySelector('.sheet-close').focus();
}

function closeSheet() {
  sheet.classList.remove('open');
  sheet.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lastFocused) lastFocused.focus();
}

grid.querySelectorAll('.car-card').forEach(card => {
  card.addEventListener('click', () => openSheet(card.dataset.id));
  card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openSheet(card.dataset.id); } });
});
sheet.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeSheet));
document.addEventListener('keydown', e => { if (e.key === 'Escape' && sheet.classList.contains('open')) closeSheet(); });

/* ---------- Nav on scroll ---------- */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 40), { passive: true });

/* ---------- Reveal on scroll ---------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('reveal'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal-up, .car-card').forEach((el, i) => {
  el.style.transitionDelay = (i % 3) * 80 + 'ms';
  io.observe(el);
});

/* ---------- Contadores do hero ---------- */
function animateCount(el) {
  const target = +el.dataset.count, dur = 1400, start = performance.now();
  (function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target);
    if (p < 1) requestAnimationFrame(tick);
  })(start);
}
const heroIO = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { animateCount(e.target); heroIO.unobserve(e.target); } });
}, { threshold: 0.5 });
document.querySelectorAll('.hero-stats [data-count]').forEach(el => heroIO.observe(el));
