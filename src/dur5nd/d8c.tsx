// dur5nd — componentes únicos de las paradas 4-1 (Beringia, Göbekli Tepe, Tíbet, Bonn) y el cierre.
import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { F, INK, RED, ORA, GOLD, SAND, Scene, Tag, Motes, ez, lin, sp, rnd, at, cl } from "./ukit";
import { SV, Tu } from "./pkit";
import { Perro, Lobo, BR } from "./dkit";
import { Land, T, MiniWatch, lp, UP } from "./dhelp";

// 34 · EL PUENTE QUE APARECE: el mar baja y entre Siberia y Alaska sale tierra; por el puente cruza una fila de animales
export const PuenteBeringia: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const k = ez(f, 20, 120);
  return (
    <Scene d={d} tint="#08101a" floor="160,210,255">
      <SV>
        <rect x={0} y={0} width={1920} height={1080} fill={`rgb(${lp(26, 40, k)},${lp(70, 70, k)},${lp(110, 96, k)})`} />
        <path d="M0,160 L640,200 L760,420 L700,700 L520,900 L0,960 Z" fill="#7a8a6a" />
        <path d="M1920,140 L1260,220 L1140,440 L1220,720 L1380,920 L1920,960 Z" fill="#7a8a6a" />
        <path d={`M700,${520 - 200 * k} Q960,${480 - 220 * k} 1220,${520 - 200 * k} L1220,${560 + 200 * k} Q960,${600 + 220 * k} 700,${560 + 200 * k} Z`} fill="#9aa47a" opacity={k} />
        {Array.from({ length: 6 }).map((_, i) => { const x = lp(640, 1280, ((f / 160 + i / 6) % 1)); return <g key={i} opacity={ez(f, 120, 140)} transform={`translate(${x},${540 + Math.sin(i) * 30})`}><ellipse rx={18} ry={10} fill="#2a1e14" /></g>; })}
        <text x={300} y={560} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={48} fill={INK}>SIBERIA</text>
        <text x={1620} y={560} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={48} fill={INK}>ALASKA</text>
        <line x1={960} x2={960} y1={900} y2={lp(900, 980, k)} stroke="#9fd8ff" strokeWidth={8} />
      </SV>
      <Tag a={60} t="BERINGIA" x={960} y={120} size={96} color={GOLD} />
      <Tag a={80} t="EL MAR, MUCHO MÁS BAJO" x={960} y={920} size={48} color="#9fd8ff" w={900} />
    </Scene>
  );
};

// 35 · LA CARRERA A NOME: ruta punteada sobre Alaska nevada, el trineo avanza y cuenta días y kilómetros
export const CarreraNome: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const k = ez(f, 10, d - 30);
  const P = (t: number) => ({ x: lp(1500, 360, t) + Math.sin(t * 9) * 60, y: lp(820, 300, t) + Math.cos(t * 6) * 40 });
  const pts = Array.from({ length: 61 }).map((_, i) => P(i / 60));
  const s = P(k);
  return (
    <Scene d={d} bg={p.bg} tint="#0a1018" floor="210,230,255">
      <SV>
        <rect x={0} y={0} width={1920} height={1080} fill="#dfe8ef" opacity={0.92} />
        <path d={`M${pts.map((q) => `${q.x},${q.y}`).join(" L")}`} stroke="#3a5a7a" strokeWidth={8} strokeDasharray="4 16" strokeLinecap="round" fill="none" />
        <path d={`M${pts.slice(0, Math.max(1, Math.floor(k * 60))).map((q) => `${q.x},${q.y}`).join(" L")}`} stroke={RED} strokeWidth={10} fill="none" />
        <circle cx={pts[60].x} cy={pts[60].y} r={20} fill={RED} />
        <text x={pts[60].x} y={pts[60].y - 40} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={52} fill="#13202c">NOME</text>
        <g transform={`translate(${s.x},${s.y})`}>{[0, 1, 2].map((i) => <Perro key={i} x={-60 - i * 60} y={0} s={0.45} b="husky" run />)}<rect x={-20} y={-30} width={60} height={24} fill="#5a3a22" /></g>
      </SV>
      <div style={{ position: "absolute", left: 1200, top: 120, fontFamily: F, fontWeight: 900, fontSize: 70, color: "#13202c", fontVariantNumeric: "tabular-nums" }}>{`${Math.round(k * 1085)} KM · DÍA ${1 + Math.floor(k * 5)}`}</div>
      <Tag a={20} t="1925 · MEDICAMENTO CONTRA LA DIFTERIA" x={760} y={950} size={46} color="#13202c" w={1300} />
    </Scene>
  );
};

// 36 · COLA SOBRE LA NARIZ: husky hecho bolita en la nieve con la cola tapándole la nariz; la tormenta pasa por encima
export const ColaNariz: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const k = ez(f, 20, 70);
  return (
    <Scene d={d} tint="#0b1118" floor="200,230,255">
      <SV>
        <Land top="#5a6e82" mid="#a9bccd" ground="#e6eef4" gy={720} />
        <g transform="translate(960,820)">
          <ellipse cx={0} cy={10} rx={320} ry={40} fill="rgba(40,60,80,.25)" />
          <Perro x={0} y={0} s={2.6} b="husky" lie curl />
        </g>
        {Array.from({ length: 90 }).map((_, i) => <line key={i} x1={(rnd(i, 2) * 2200 - f * 12) % 2200 + 100} y1={(rnd(i, 3) * 1080 + f * 4) % 1080} x2={(rnd(i, 2) * 2200 - f * 12) % 2200 + 70} y2={(rnd(i, 3) * 1080 + f * 4) % 1080 + 6} stroke="#fff" strokeWidth={3} opacity={0.8} />)}
      </SV>
      <Tag a={50} t="DOBLE CAPA · COLA DE BUFANDA" x={960} y={150} size={68} color="#13202c" w={1300} />
    </Scene>
  );
};

// 37 · LOS PILARES EN T: pilares de piedra que se levantan en la colina; en cada uno se talla un animal
export const PilaresT: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const A = ["zorro", "jabalí", "serpiente", "buitre"];
  return (
    <Scene d={d} bg={p.bg} tint="#140e08" floor="255,200,120">
      <SV>
        <Land top="#e3c48e" mid="#d9a768" ground="#a5834e" gy={860} />
        {A.map((n, i) => { const k = sp(f, 10 + i * 22, 1.4, 12); const x = 380 + i * 400;
          return <g key={n} transform={`translate(${x},860) scale(1,${k})`}>
            <rect x={-40} y={-460} width={80} height={460} fill="#cdb48a" stroke="#8a7350" strokeWidth={4} />
            <rect x={-130} y={-540} width={260} height={90} fill="#d6bd92" stroke="#8a7350" strokeWidth={4} />
            <g opacity={ez(f, 60 + i * 20, 80 + i * 20)} stroke="#5a4426" strokeWidth={4} fill="none" transform="translate(0,-330) scale(2.4) translate(0,330)">
              {i === 0 && <path d="M-26,-320 l20,-30 l10,20 l14,-20 l2,40 l-10,30 l-40,40 m40,-40 l40,60" />}
              {i === 1 && <path d="M-30,-300 q20,-40 50,-20 l10,-10 l4,24 l-10,30 l-50,10 z m6,30 l-6,30 m40,-30 l6,30" />}
              {i === 2 && <path d="M-20,-380 q30,30 0,60 q-30,30 0,60 q30,30 0,60" />}
              {i === 3 && <path d="M-30,-320 l30,-20 l30,20 m-30,-20 l0,60 m-20,-10 l20,30 l20,-30" />}
            </g>
          </g>; })}
        <Tu x={1760} y={860} s={0.7} />
      </SV>
      <Tag a={40} t="+5 METROS · ANTES QUE STONEHENGE" x={960} y={120} size={60} color={INK} w={1400} />
    </Scene>
  );
};

// 38 · LA GUARDIA DE LA COLINA: el kangal echado arriba; los lobos se acercan, lo ven, dan la vuelta
export const GuardiaColina: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const turn = at(p, "hoyno", 120); const back = f > turn;
  const wx = (i: number) => (back ? lp(1300 + i * 140, 2200 + i * 140, ez(f, turn, turn + 70)) : lp(2200 + i * 140, 1300 + i * 140, ez(f, 0, turn)));
  return (
    <Scene d={d} tint="#0e0c0a" floor="255,200,140">
      <SV>
        <Land top="#55667a" mid="#c7a476" ground="#6a5a38" gy={860} />
        <path d="M-100,1080 Q300,520 760,560 Q1100,600 1500,1080 Z" fill="#7a6a42" />
        {Array.from({ length: 9 }).map((_, i) => <ellipse key={i} cx={260 + i * 70} cy={900 - Math.sin(i) * 40} rx={36} ry={24} fill="#efe6d2" />)}
        <Perro x={700} y={580} s={2} b="kangal" lie head={back ? 0 : -6} />
        {[0, 1, 2].map((i) => <Lobo key={i} x={wx(i)} y={900 - i * 20} s={1.3} flip={!back} walk={1} eyes={0.7} />)}
      </SV>
      <Tag a={turn} t="HOY NO" x={1500} y={300} size={110} color={GOLD} w={600} />
      <Tag a={20} t="40-65 KG · NO SE MUEVE" x={620} y={180} size={56} color={INK} w={900} />
    </Scene>
  );
};

// 39 · OXÍGENO: dos frascos de aire, nivel del mar y 4.500 m; al de arriba le faltan burbujas
export const OxigenoMenos: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const k = ez(f, 50, 100);
  const jar = (x: number, n: number, lab: string) => <g>
    <rect x={x - 220} y={300} width={440} height={520} rx={40} fill="rgba(255,255,255,.06)" stroke={INK} strokeWidth={6} />
    {Array.from({ length: 50 }).map((_, i) => <circle key={i} cx={x - 180 + rnd(i, 2) * 360 + Math.sin(f / 15 + i) * 6} cy={330 + rnd(i, 3) * 460 + Math.cos(f / 18 + i) * 6} r={13} fill="#9fd8ff" opacity={i < n ? 0.9 : 0} />)}
    <text x={x} y={890} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={46} fill={INK}>{lab}</text>
  </g>;
  return (
    <Scene d={d} bg={p.bg} tint="#0a0e14" floor="180,220,255">
      <SV>
        {jar(620, 50, "NIVEL DEL MAR")}
        {jar(1300, Math.round(lp(50, 30, k)), "4.500 M")}
      </SV>
      <Tag a={100} t="−40 % DE OXÍGENO" x={1300} y={170} size={78} color={RED} w={900} />
    </Scene>
  );
};

// 40 · EL GEN QUE VINO DEL LOBO: una hebra sale del lobo del Tíbet y se trenza en el mastín
export const GenLobo: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const k = ez(f, 30, 120);
  return (
    <Scene d={d} tint="#0b0b10" floor="200,200,255">
      <SV>
        <Land top="#8fa3b8" mid="#d6d2c2" ground="#9a9070" gy={840} />
        <Lobo x={420} y={820} s={2.6} c="#5a5a62" eyes={1} />
        <Perro x={1480} y={840} s={2.6} b="mastin" />
        {Array.from({ length: 26 }).map((_, i) => { const t = i / 25; if (t > k) return null; const x = lp(560, 1360, t), y = 520 - Math.sin(t * Math.PI) * 220;
          return <g key={i}><circle cx={x} cy={y + Math.sin(i + f / 10) * 26} r={10} fill={GOLD} /><circle cx={x} cy={y - Math.sin(i + f / 10) * 26} r={10} fill="#9a8cff" /><line x1={x} x2={x} y1={y + Math.sin(i + f / 10) * 26} y2={y - Math.sin(i + f / 10) * 26} stroke="rgba(240,235,229,.5)" strokeWidth={4} /></g>; })}
      </SV>
      <Tag a={10} t="LOBO DEL TÍBET" x={420} y={900} size={46} color={INK} w={600} />
      <Tag a={110} t="RESPIRAR CON POCO AIRE · HEREDADO" x={1100} y={150} size={56} color={GOLD} w={1300} />
    </Scene>
  );
};

// 41 · TRES DE CADA CUATRO: cuatro perros; tres se iluminan y son perros de calle, de pueblo, sin papeles
export const TresDeCuatro: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  return (
    <Scene d={d} bg={p.bg} tint="#0e0b08" floor="255,200,140">
      <SV>
        <rect x={0} y={820} width={1920} height={260} fill="#2a2018" />
        {[0, 1, 2, 3].map((i) => { const k = ez(f, 30 + i * 20, 50 + i * 20); const sr = i < 3;
          return <g key={i}><ellipse cx={360 + i * 400} cy={830} rx={160} ry={24} fill={sr ? `rgba(233,199,98,${0.35 * k})` : "rgba(0,0,0,.3)"} /><Perro x={360 + i * 400} y={820} s={2} b={sr ? "sinraza" : "pastor"} op={sr ? 0.4 + 0.6 * k : 0.35} wag={sr ? k : 0} /></g>; })}
      </SV>
      <Tag a={110} t="3 DE CADA 4 · SIN RAZA" x={960} y={160} size={88} color={GOLD} w={1400} />
    </Scene>
  );
};

// 42 · LA FORMA MÁS VIEJA: once razas se van borrando y todas convergen en la misma silueta mediana, orejas paradas, cola en curva
export const FormaVieja: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const k = ez(f, 40, 140);
  const L = ["chihuahua", "bulldog", "teckel", "caniche", "golden", "dalmata", "galgo", "pastor", "husky", "kangal", "mastin"];
  return (
    <Scene d={d} tint="#0c0a08" floor="255,200,140">
      <SV>
        {L.map((b, i) => { const a = (i / L.length) * Math.PI * 2; return <Perro key={b} x={lp(960 + Math.cos(a) * 720, 960, k)} y={lp(600 + Math.sin(a) * 330, 760, k)} s={1} b={b} op={1 - k} />; })}
        <Perro x={960} y={760} s={lp(1, 2.6, k)} b="sinraza" op={k} wag={k} />
      </SV>
      <Tag a={130} t="LO QUE QUEDA CUANDO NADIE ELIGE" x={960} y={140} size={66} color={GOLD} w={1500} />
      <Tag a={150} t="15-25 KG · OREJAS PARADAS · COLA EN CURVA" x={960} y={900} size={42} color={INK} w={1500} />
    </Scene>
  );
};

// 43 · LA TUMBA DE BONN: corte de la tierra; hombre, mujer y dos perros; el cachorro con la etiqueta de lo que pasó
export const TumbaBonn: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const k = ez(f, 20, 80);
  return (
    <Scene d={d} bg={p.bg} tint="#0c0805" floor="255,180,100">
      <SV>
        <rect x={0} y={0} width={1920} height={300} fill="#3a4a5a" />
        {Array.from({ length: 6 }).map((_, i) => <rect key={i} x={0} y={300 + i * 130} width={1920} height={130} fill={["#5a4028", "#4e3622", "#62462c", "#4a3420", "#563c26", "#4a3220"][i]} />)}
        <rect x={360} y={560} width={1200} height={340} rx={30} fill="#2a1a0e" opacity={k} />
        <g opacity={k} stroke="#e9dcc4" strokeWidth={10} strokeLinecap="round" fill="none">
          <path d="M440,700 L760,700 M760,700 l40,-20 M440,700 l-30,10 M520,700 l-20,60 M640,700 l10,60" /><circle cx={840} cy={680} r={34} />
          <path d="M440,820 L740,820 M740,820 l40,-20 M500,820 l-10,50 M620,820 l10,50" /><circle cx={820} cy={800} r={26} />
        </g>
        <g opacity={ez(f, 60, 90)}><Perro x={1120} y={760} s={1.6} b="sinraza" lie op={0.85} /><Perro x={1380} y={860} s={1.1} b="sinraza" lie curl op={0.85} /></g>
        <g opacity={ez(f, 100, 120)}><line x1={1380} y1={810} x2={1500} y2={430} stroke={GOLD} strokeWidth={4} /><rect x={1280} y={260} width={560} height={180} rx={14} fill="rgba(12,10,9,.85)" stroke={GOLD} strokeWidth={4} /><text x={1560} y={325} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={42} fill={GOLD}>CACHORRO · 7 MESES</text><text x={1560} y={395} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={42} fill={INK}>MOQUILLO · LO CUIDARON</text></g>
      </SV>
      <Tag a={10} t="OBERKASSEL · 14.200 AÑOS" x={760} y={120} size={66} color={INK} w={1100} />
    </Scene>
  );
};

// 44 · EL QUE NO SE CONGELA: el mini cronómetro del perro sin raza sigue corriendo junto al fuego mientras los demás quedan escarchados
export const SigueCorriendo: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const S = [47, 252, 690, 198000, 266400, 378000, 777600, 1641600, 3628800, 12960000, 39300000];
  return (
    <Scene d={d} tint="#070504" floor="255,160,70">
      <SV>
        {S.map((s, i) => <g key={i} opacity={ez(f, i * 4, 12 + i * 4) * 0.6}><MiniWatch x={170 + (i % 6) * 300} y={i < 6 ? 220 : 470} s={0.7} sec={s % 3600} frozen /></g>)}
        <g transform="translate(960,820)"><path d="M-50,-10 Q-40,-140 0,-200 Q30,-130 50,-10 Z" fill="#ff9a3a" opacity={0.9 + Math.sin(f / 3) * 0.1} /></g>
        <Perro x={700} y={880} s={1.8} b="sinraza" lie curl />
        <MiniWatch x={1300} y={760} s={1.2} sec={f / 30 * 60} col={GOLD} />
      </SV>
      <Tag a={60} t="▶ SIGUE CORRIENDO" x={1300} y={930} size={62} color={GOLD} w={800} />
    </Scene>
  );
};

// 45 · LA SUMA: los once tiempos caen en una pila y se convierten en «casi 2 años»; al lado, el perro de la calle con ∞
export const SumaDosAnos: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame();
  const L = ["47 S", "4 MIN", "11 MIN", "2 D", "3 D", "4 D", "9 D", "19 D", "42 D", "5 MESES", "15 MESES"];
  const k = ez(f, 120, 150);
  return (
    <Scene d={d} tint="#0c0a08" floor="255,200,140">
      <SV>
        {L.map((t, i) => { const s = sp(f, 10 + i * 9, 1, 12); return <g key={i} opacity={1 - k} transform={`translate(${620},${880 - i * 56 - (1 - s) * 400})`}><rect x={-200} y={-46} width={400} height={50} rx={10} fill={i > 8 ? RED : SAND} /><text y={-10} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={36} fill="#111">{t}</text></g>; })}
        <text x={620} y={600} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={120} fill={RED} opacity={k}>≈ 2 AÑOS</text>
        <text x={620} y={680} textAnchor="middle" fontFamily={F} fontWeight={800} fontSize={40} fill={INK} opacity={k}>11 RAZAS, SUMADAS</text>
        <Perro x={1400} y={820} s={2.4} b="sinraza" wag={1} />
        <text x={1400} y={500} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={170} fill={GOLD} opacity={ez(f, 140, 160)}>∞</text>
      </SV>
      <Tag a={160} t="Y EL DE LA CALLE, SOLO, YA VA GANANDO" x={960} y={110} size={56} color={GOLD} w={1500} />
    </Scene>
  );
};

// 46 · DORMIDO AL SOL: la vereda, el perro de la calle dormido; su sombra en la pared es la de un perro de la edad de hielo junto al fuego
export const PerroAlSol: React.FC<UP> = ({ d, p }) => {
  const f = useCurrentFrame(); const k = ez(f, 40, 110), br = Math.sin(f / 22) * 3;
  return (
    <Scene d={d} tint="#120c07" floor="255,200,120">
      <SV>
        <rect x={0} y={0} width={1920} height={760} fill="#d9b98c" />
        {Array.from({ length: 8 }).map((_, i) => <rect key={i} x={i * 250 + 20} y={80} width={210} height={300} fill="#c9a676" opacity={0.6} />)}
        <rect x={0} y={760} width={1920} height={320} fill="#9a8a74" />
        {Array.from({ length: 10 }).map((_, i) => <line key={i} x1={i * 210} x2={i * 210 - 60} y1={760} y2={1080} stroke="#8a7a64" strokeWidth={4} />)}
        <g transform={`translate(${lp(0, -40, k)},${-260}) scale(1,1.02)`} opacity={0.2 + 0.3 * k} style={{ filter: "brightness(0)" }}><Perro x={900} y={760} s={2.6} b="sinraza" lie curl op={1} /></g>
        <g opacity={k} transform="translate(1500,500)"><path d={`M-40,0 Q-30,${-110 - br * 4} 0,${-160 - br * 4} Q24,-100 40,0 Z`} fill="#3a2a1a" opacity={0.5} /></g>
        <g transform={`translate(0,${br})`}><Perro x={900} y={900} s={2.6} b="sinraza" lie curl /></g>
      </SV>
      <Tag a={60} t="LA FORMA MÁS VIEJA DE UN PERRO" x={960} y={110} size={66} color="#2a1a0e" w={1500} />
    </Scene>
  );
};
