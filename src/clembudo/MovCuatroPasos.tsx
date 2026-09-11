// MovCuatroPasos.tsx — MOVIMIENTO 3 de `clembudo` (El Constructor Libre).
// desde_s 373.5 · dur_f 1737 (57,9 s @30fps) · luz 0.45 → 0.25 (empieza SUCIO, termina LIMPIO Y SECO)
//
// Los cuatro pasos NO son cuatro tarjetas numeradas: son SEIS ACTOS de UNA MISMA ESCENA, con la
// MISMA PARED atravesándolos y el MISMO riel de cuatro herramientas al pie del cuadro, que se va
// encendiendo paso a paso. Una sola atmósfera (`<Atmos/>`), una sola cámara (función del frame
// GLOBAL), y la luz que se limpia a medida que el trabajo se resuelve.
//
// ╔═ TABLA DE HANDOFF ══════════════════════════════════════════════════════════════════════════╗
// ║ A1  f0–127   PRÓLOGO · la pared enferma y las cuatro herramientas   [clip s315]              ║
// ║     enterFrom {cam:{z 1.00, panX 0, panY 0, ry −3.2, rx 1.2}, luz 0.450, materia: "la pared"}║
// ║     exitTo    {cam:{z 1.06, panX −26, panY −8, ry −1.4, rx 0.6},  luz 0.446,                 ║
// ║                materia: "la pared + el riel de 4 herramientas"}                              ║
// ║  ── FRONTERA 1 @128 · CORTE EN EL BEAT (cae exacto en «1.»; general → plano medio) ──        ║
// ║ A2  f128–540 PASO 1 · EL ERROR EN SECO · la nube de esporas  [clip s316 → foto s317 → clip   ║
// ║     s317]  ★ el plano más fuerte del tramo: 13,8 s de aire; el riel baja y se apaga a 0.36  ║
// ║     enterFrom {cam:{z 1.06, panX −26, ry −1.4}, luz 0.446, materia: "la pared (ahora medio)"}║
// ║     exitTo    {cam:{z 1.02, panX 40, panY −4, ry 2.6, rx −0.4}, luz 0.398,                   ║
// ║                materia: "el polvo en suspensión"}                                            ║
// ║  ── FRONTERA 2 @541 · WIPE POR MATERIA (la columna de polvo SECO barre y detrás ya está la   ║
// ║     niebla MOJADA del pulverizador: el mismo material cambia de estado) ──                   ║
// ║ A3  f541–691 PASO 1 (corrección) · rociar, mojar, esperar 5 min   [clip s318]                ║
// ║     enterFrom {cam:{z 1.02→1.10, panX 40→10, ry 2.6}, luz 0.398, materia: "la niebla/agua"}  ║
// ║     exitTo    {cam:{z 1.10, panX 10, panY 8, ry 1.1}, luz 0.377, materia: "la pared mojada"} ║
// ║  ── FRONTERA 3 @692 · OCLUSIÓN (la ESPÁTULA de acero cruza y tapa el 100 % ~4 frames; la     ║
// ║     banda es el ACERO de la herramienta —medida en still: luma ≈86, entre los 97 y los 74   ║
// ║     de los dos planos—, ⛔ nunca el color del fondo) ──                                       ║
// ║ A4  f692–1019 PASO 2 · raspar en húmedo + LOS 30 CM (gráfico del halo) [clip s319 → s320]    ║
// ║     enterFrom {cam:{z 1.10→1.05, panX 10→−30, ry 1.1→−2.2}, luz 0.377, materia: "la pared"}  ║
// ║     exitTo    {cam:{z 1.00, panX 0, panY −6, ry 0.4}, luz 0.330,                             ║
// ║                materia: "el PARCHE (la mancha visible) + el anillo de margen punteado"}      ║
// ║  ── FRONTERA 4 @1020 · ZOOM-THROUGH (la cámara se mete DENTRO del parche del gráfico y sale  ║
// ║     en el macro real del anillo; el trazo punteado sobrevive y traza el anillo de la foto) ──║
// ║ A5  f1020–1316 EL ANILLO · lo que hay es más grande que lo que se ve  [foto s321 → clip s322]║
// ║     enterFrom {cam:{z 1.00, panX 0, ry 0.4}, luz 0.330, materia: "el parche + el punteado"}  ║
// ║     exitTo    {cam:{z 1.05, panX 20, panY 4, ry 1.5}, luz 0.281, materia: "la carta 3 del    ║
// ║                riel (la brocha), que ya viene levantándose desde f1276"}                      ║
// ║  ── FRONTERA 5 @1317 · MATCH-SHAPE (la carta nº3 del riel —rect redondeado con la foto de la ║
// ║     brocha adentro— se despega, crece y SE VUELVE el plano entero; el contenido conmuta de   ║
// ║     foto a clip del mismo asset en el beat «3.», así que la forma nunca se corta) ──         ║
// ║ A6  f1317–1736 PASOS 3 y 4 · generoso, y ESPERAR   [clip s323 → foto s324 → clip s324 →      ║
// ║     clip s325]. En f1552 («Esperar») el plano se repliega al tercio derecho y VUELVE EL      ║
// ║     AVATAR: la luz ya está limpia y el trabajo, seco.                                        ║
// ║     enterFrom {cam:{z 1.05, panX 20, ry 1.5}, luz 0.281, materia: "la carta 3 ya full"}      ║
// ║     exitTo    {cam:{z 1.06, panX 18, panY −4, ry −0.8, rx 0.5}, luz 0.250,                   ║
// ║                materia: "la pared seca en el panel derecho + el avatar al aire"}             ║
// ╚══════════════════════════════════════════════════════════════════════════════════════════════╝
//
// ⛔ Contrato: cero Math.random/Date · cero backdrop-filter · cero blur full-screen · OffthreadVideo
// (nunca <Video>, nunca loop: los clips duran 5,04 s y ninguna Sequence de clip pasa de 151 frames)
// · Easing.poly(n) en vez de quint · safe area 60 px · imports sólo de remotion/react/./Stage.
import React from "react";
import {
  AbsoluteFill, Easing, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame,
} from "remotion";
import {
  Atmos, C, Cam, FONT, Glass, Head, Kick, Occluder, SAFE, cam, camStyle, luz, rampIn, rng,
} from "./Stage";

const DUR = 1737;
const IMG = (n: string) => staticFile(`img/clembudo/${n}.png`);
const VID = (n: string) => staticFile(`broll/clembudo/${n}.mp4`);

// ── helpers puros ────────────────────────────────────────────────────────────────────────────
const ramp = (f: number, a: number, b: number, ease = Easing.out(Easing.cubic)) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });

const bell = (f: number, c: number, w: number) => Math.exp(-((f - c) / w) * ((f - c) / w));

// keyframes CONTINUAS sobre el frame GLOBAL: cada tramo arranca donde terminó el anterior, así que
// la cámara NUNCA se reinicia en 0 al cambiar de acto (el acto 3 hereda lo que dejó el acto 2).
type KF = [number, number][];
const kf = (f: number, ks: KF, ease = Easing.bezier(0.28, 0.02, 0.18, 1)) => {
  if (f <= ks[0][0]) return ks[0][1];
  for (let i = 0; i < ks.length - 1; i++) {
    const a = ks[i], b = ks[i + 1];
    if (f <= b[0]) {
      return interpolate(f, [a[0], b[0]], [a[1], b[1]], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease,
      });
    }
  }
  return ks[ks.length - 1][1];
};

const K_Z: KF = [[0, 1.0], [128, 1.06], [278, 1.14], [421, 1.02], [541, 1.1], [692, 1.05], [843, 1.0], [1020, 1.0], [1170, 1.06], [1317, 1.02], [1445, 1.0], [1620, 1.04], [1736, 1.06]];
const K_PX: KF = [[0, 0], [128, -26], [421, 40], [541, 10], [692, -30], [1020, 0], [1170, 20], [1317, -10], [1620, 6], [1736, 18]];
const K_PY: KF = [[0, 0], [278, -18], [541, 8], [843, -10], [1170, 4], [1445, -14], [1736, -4]];
const K_RY: KF = [[0, -3.2], [128, -1.4], [421, 2.6], [692, -2.2], [1020, 0.4], [1317, 1.8], [1736, -0.8]];
const K_RX: KF = [[0, 1.2], [278, -0.8], [692, 0.9], [1170, -0.6], [1736, 0.5]];

// plano de profundidad con la perspectiva YA compensada: a 1600px de perspective un translateZ(z)
// agranda ×1600/(1600−z), así que el scale inverso deja el tamaño en pantalla intacto (safe area).
const plane = (z: number, px = 0, py = 0): React.CSSProperties => ({
  position: "absolute", left: 0, top: 0, width: 1920, height: 1080,
  transform: `translate3d(${px.toFixed(2)}px, ${py.toFixed(2)}px, ${z}px) scale(${((1600 - z) / 1600).toFixed(4)})`,
  transformStyle: "preserve-3d",
});

const FILL: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover", display: "block" };

// foto con Ken-Burns (⛔ ninguna foto quieta: el hold tiene que estar VIVO)
const Foto: React.FC<{ n: string; d: number; z0?: number; z1?: number; dx?: number }> =
  ({ n, d, z0 = 1.04, z1 = 1.14, dx = 0 }) => {
    const f = useCurrentFrame();
    const s = interpolate(f, [0, d], [z0, z1], { extrapolateRight: "clamp", easing: Easing.bezier(0.3, 0, 0.3, 1) });
    const x = interpolate(f, [0, d], [0, dx], { extrapolateRight: "clamp" });
    return <Img src={IMG(n)} style={{ ...FILL, transform: `scale(${s.toFixed(4)}) translateX(${x.toFixed(2)}%)` }} />;
  };

// clip real. ⛔ OffthreadVideo SIEMPRE (con <Video> el farm sirve cuadros equivocados y se ve lageado).
const Clip: React.FC<{ n: string; z0?: number; z1?: number; d?: number }> =
  ({ n, z0 = 1.05, z1 = 1.12, d = 151 }) => {
    const f = useCurrentFrame();
    const s = interpolate(f, [0, d], [z0, z1], { extrapolateRight: "clamp", easing: Easing.linear });
    return <OffthreadVideo src={VID(n)} muted style={{ ...FILL, transform: `scale(${s.toFixed(4)})` }} />;
  };

// ── LA ESPÁTULA (costura 3) ──────────────────────────────────────────────────────────────────
// ⛔⛔ La banda NO puede llevar el color del fondo: eso no ocluye, hace un fundido a negro y se ve
// un flash. Ésta ES el acero de la espátula que él está usando en el plano siguiente (luma ≈134,
// la escena venía en ≈130). Cobertura opaca del 100 % durante ~4 frames, centrada en el swap.
const Espatula: React.FC<{ at: number; len?: number }> = ({ at, len = 11 }) => {
  const f = useCurrentFrame();
  if (f < at - len || f > at + len) return null;
  const x = interpolate(f, [at - len, at + len], [-270, 110], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
  });
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "hidden", pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute", left: `${x}%`, top: "-22%", width: "240%", height: "150%",
          transform: "rotate(-7deg)",
          // ⚠️ medido sobre stills: con el acero claro la banda daba luma 115 sobre una escena que
          // va de 97 a 74 → se leía como un flash. Bajado ~28 puntos, la banda mide ≈86 y queda
          // ENTRE los dos planos: ocluye sin pozo y sin destello.
          background:
            "linear-gradient(92deg, rgba(0,0,0,0) 0%, rgba(40,37,32,0.94) 9%, #55524A 15%, #6B665C 34%, #7C7668 52%, #666153 74%, #474338 85%, rgba(0,0,0,0) 100%)",
          boxShadow: "0 0 90px rgba(28,24,18,0.6)",
        }}
      />
      {/* el bisel brillante del filo: lo que hace que se lea ESPÁTULA y no "una banda gris" */}
      <div
        style={{
          position: "absolute", left: `${x + 196}%`, top: "-22%", width: "9%", height: "150%",
          transform: "rotate(-7deg)",
          background: "linear-gradient(90deg, rgba(198,190,170,0) 0%, rgba(200,193,173,0.9) 55%, rgba(66,62,53,0.9) 100%)",
        }}
      />
    </div>
  );
};

// ── LA NUBE DE ESPORAS (acto 2) ──────────────────────────────────────────────────────────────
// A contraluz de la ventana: sube y se abre. Determinística (rng de Stage); su densidad manda
// también cuánto se ENSUCIA la luz del acto 2.
const Esporas: React.FC<{ a: number; n?: number }> = ({ a, n = 72 }) => {
  const f = useCurrentFrame();
  if (a <= 0.004) return null;
  const out: React.ReactElement[] = [];
  for (let i = 0; i < n; i++) {
    const sx = rng(211, i), sy = rng(307, i), sp = 0.35 + rng(401, i) * 1.25;
    const k = ((f * sp + sy * 620) % 620) / 620;
    const x = 300 + sx * 1420 + Math.sin((f + i * 37) / 61) * (34 + sx * 70) + k * (sx - 0.5) * 260;
    const y = 1010 - k * 1080 + Math.cos((f + i * 23) / 79) * 16;
    const r = 1.4 + rng(509, i) * 4.6;
    const o = a * (0.1 + rng(601, i) * 0.34) * Math.sin(Math.PI * Math.min(1, k * 1.25));
    out.push(
      <div key={i} style={{
        position: "absolute", left: x, top: y, width: r, height: r, borderRadius: "50%",
        background: "#FFF4DA", opacity: o, boxShadow: `0 0 ${r * 3}px rgba(255,244,218,${o * 0.7})`,
      }} />,
    );
  }
  return <>{out}</>;
};

// ── EL GRÁFICO DE LOS 30 CM (acto 4) ─────────────────────────────────────────────────────────
// De un vistazo: el trazo punteado de LO QUE SE VE, el halo de margen creciendo alrededor, y
// recién al final la mancha REAL —más grande— apareciendo DEBAJO, casi tocando el halo.
const CX = 940, CY = 486;
const Halo: React.FC<{ f: number }> = ({ f }) => {
  const seeA = ramp(f, 764, 792);
  const haloA = ramp(f, 800, 852);
  const grow = interpolate(f, [800, 892], [0.52, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.poly(5)) });
  const lock = 1 + 0.045 * bell(f, 906, 13);
  const calA = ramp(f, 816, 864);
  const realA = ramp(f, 923, 992);
  const realGrow = interpolate(f, [923, 1000], [0.42, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const breath = 1 + Math.sin(f / 41) * 0.006;
  const blob: React.CSSProperties = { position: "absolute", left: CX, top: CY };
  // chip de rótulo: va SENTADO sobre su propio trazo con cama oscura. Medido en still: sin cama y
  // suelto entre dos anillos, los tres rótulos se leían como si fueran del anillo equivocado.
  const chip = (x: number, y: number, o: number, color: string, txt: string, key: string) => (
    <div key={key} style={{
      position: "absolute", left: CX + x, top: CY + y, transform: "translate(-50%,-50%)",
      opacity: o, padding: "7px 18px 9px", borderRadius: 5,
      background: "rgba(18,15,11,0.78)", boxShadow: "0 6px 22px rgba(18,15,11,0.55)",
      borderLeft: `4px solid ${color}`, whiteSpace: "nowrap",
    }}>
      <Kick size={30} color={color}>{txt}</Kick>
    </div>
  );
  return (
    <>
      {/* caja de luz: el gráfico necesita su propio fondo o se pierde contra el b-roll */}
      <div style={{
        ...blob, width: 1500, height: 1120, marginLeft: -750, marginTop: -560,
        opacity: Math.max(seeA, haloA) * 0.95,
        background: "radial-gradient(46% 46% at 50% 50%, rgba(16,13,10,0.52) 0%, rgba(16,13,10,0.34) 56%, rgba(16,13,10,0) 78%)",
      }} />
      {/* la mancha REAL — aparece DEBAJO, más grande, y casi llega al halo */}
      <div style={{
        ...blob, width: 560, height: 396, marginLeft: -280, marginTop: -198, opacity: realA,
        transform: `scale(${(realGrow * breath).toFixed(4)})`,
        borderRadius: "47% 53% 62% 38% / 55% 39% 61% 45%",
        border: `4px dashed ${C.danger}`,
        background: "radial-gradient(56% 58% at 40% 38%, rgba(150,60,44,0.60) 0%, rgba(140,58,42,0.34) 58%, rgba(130,54,40,0.10) 100%), radial-gradient(40% 44% at 70% 68%, rgba(120,48,36,0.42) 0%, rgba(120,48,36,0) 100%)",
        boxShadow: "0 22px 60px rgba(42,38,32,0.42)",
      }} />
      {/* el HALO de margen: 30 cm más allá del borde visible */}
      <div style={{
        ...blob, width: 792, height: 578, marginLeft: -396, marginTop: -289, opacity: haloA,
        transform: `scale(${(grow * lock * breath).toFixed(4)})`,
        borderRadius: "52% 48% 44% 56% / 47% 55% 45% 53%",
        border: `5px dashed ${C.accentSoft}`,
        boxShadow: `0 0 0 2px rgba(124,138,90,0.34), 0 0 80px rgba(174,186,140,${(0.3 * haloA).toFixed(3)})`,
      }} />
      {/* LO QUE SE VE — el parche chiquito, el que la gente trata */}
      <div style={{
        ...blob, width: 312, height: 218, marginLeft: -156, marginTop: -109, opacity: seeA,
        transform: `scale(${breath.toFixed(4)})`,
        borderRadius: "58% 42% 47% 53% / 44% 56% 44% 56%",
        border: "4px dashed rgba(250,244,228,0.95)",
        background: "radial-gradient(58% 60% at 48% 44%, rgba(14,11,8,0.74) 0%, rgba(18,15,11,0.44) 62%, rgba(18,15,11,0.14) 100%)",
      }} />
      {/* calibre: del borde visible al borde del margen */}
      <div style={{ position: "absolute", left: CX + 156, top: CY + 96, width: 236 * grow, opacity: calA }}>
        <div style={{ position: "absolute", left: 0, top: 6, width: "100%", height: 4, background: C.accentSoft, boxShadow: "0 1px 6px rgba(18,15,11,0.9)" }} />
        <div style={{ position: "absolute", left: 0, top: -13, width: 4, height: 34, background: C.accentSoft }} />
        <div style={{ position: "absolute", right: 0, top: -13, width: 4, height: 34, background: C.accentSoft }} />
      </div>
      {chip(156 + 118 * grow, 96 - 46, calA, C.accentSoft, "30 cm", "cal")}
      {chip(0, -109, seeA, "rgba(250,244,228,0.95)", "Lo que se ve", "ve")}
      {chip(-150, 198, realA, "#E09A82", "Lo que hay", "hay")}
    </>
  );
};

// ── EL RIEL DE LAS CUATRO HERRAMIENTAS (la materia que cruza LAS CINCO FRONTERAS) ────────────
// ⛔ Cada carta lleva MATERIAL REAL adentro (la foto de ese paso), nunca forma+texto. Se encienden
// en orden y la nº3 es la que se despega en la frontera 5 para volverse el plano entero.
const PASOS = [
  { n: "clembudo_s318", t: "Mojar" },
  { n: "clembudo_s319", t: "Raspar" },
  { n: "clembudo_s323", t: "Aplicar" },
  { n: "clembudo_s324", t: "Esperar" },
];
const ON_AT = [128, 692, 1317, 1445];
const CW = 216, CH = 128, CGAP = 24, CY0 = 884; // 884+128+16 = 1028 → safe area 60 px respetada
const CX0 = (1920 - (CW * 4 + CGAP * 3)) / 2;
const cardX = (i: number) => CX0 + i * (CW + CGAP);
const stepOf = (f: number) => (f < 128 ? 0 : f < 692 ? 1 : f < 1317 ? 2 : f < 1445 ? 3 : 4);

const Riel: React.FC<{ f: number; dy: number; dim: number }> = ({ f, dy, dim }) => {
  const step = stepOf(f);
  const a = rampIn(f, 14) * dim;
  return (
    <div style={{ position: "absolute", left: 0, top: dy, width: 1920, height: 1080, opacity: a, transformStyle: "preserve-3d" }}>
      <div style={{ position: "absolute", left: CX0 - 26, top: CY0 + CH + 16, width: CW * 4 + CGAP * 3 + 52, height: 3, background: "linear-gradient(90deg, rgba(42,38,32,0) 0%, rgba(169,121,74,0.55) 12%, rgba(169,121,74,0.55) 88%, rgba(42,38,32,0) 100%)" }} />
      {PASOS.map((p, i) => {
        const on = step >= i + 1;
        const lit = interpolate(f, [ON_AT[i] - 8, ON_AT[i] + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
        const lift = lit * 16 + Math.sin((f + i * 47) / 63) * 1.6;
        // la carta 3 se despega en la frontera 5: acá se apaga para que la lleve el MATCH-SHAPE
        if (i === 2 && f >= 1276) return null;
        return (
          <div key={p.n} style={{ position: "absolute", left: cardX(i), top: CY0 - lift, transformStyle: "preserve-3d" }}>
            <Glass x={0} y={0} w={CW} h={CH} z={lit * 26} lift={0.55 + lit * 0.6} radius={12}>
              <Img src={IMG(p.n)} style={{ ...FILL, filter: on ? "none" : "grayscale(0.85)", opacity: on ? 1 : 0.5 }} />
              <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", background: on ? "linear-gradient(180deg, rgba(42,38,32,0) 40%, rgba(20,17,13,0.72) 100%)" : "linear-gradient(180deg, rgba(20,17,13,0.5) 0%, rgba(20,17,13,0.82) 100%)" }} />
              <div style={{ position: "absolute", left: 12, bottom: 8, fontFamily: FONT, fontSize: 30, fontWeight: 800, color: on ? "#F7F1DF" : "rgba(247,241,223,0.5)", letterSpacing: 2, textShadow: "0 2px 8px rgba(20,17,13,0.9)" }}>{p.t}</div>
              <div style={{ position: "absolute", right: 10, top: 2, fontFamily: FONT, fontSize: 40, fontWeight: 800, color: on ? C.accentSoft : "rgba(247,241,223,0.34)", textShadow: "0 2px 10px rgba(20,17,13,0.9)" }}>{i + 1}</div>
            </Glass>
            {on ? <div style={{ position: "absolute", left: 0, top: CH + 6, width: CW, height: 3, background: C.accentSoft, boxShadow: `0 0 14px ${C.accentSoft}`, opacity: lit }} /> : null}
          </div>
        );
      })}
    </div>
  );
};

// ── TEXTO (L8) — 1 idea por acto, titular ≤7 palabras, con tildes ────────────────────────────
type Slot = { a: number; b: number; k: string; h: string; right?: boolean; size?: number };
const SLOTS: Slot[] = [
  { a: 18, b: 122, k: "El tratamiento", h: "Cuatro pasos. Y el orden importa." },
  { a: 150, b: 330, k: "Paso 1", h: "Nunca cepilles el moho en seco." },
  { a: 560, b: 668, k: "Antes de tocar", h: "Rociar, mojar, esperar cinco minutos." },
  { a: 706, b: 792, k: "Paso 2", h: "Raspar con la pared húmeda." },
  { a: 1196, b: 1300, k: "El anillo", h: "La garantía se te cae." },
  { a: 1330, b: 1432, k: "Paso 3", h: "Generoso: la zona y el margen." },
  { a: 1578, b: 1732, k: "Paso 4", h: "Secar. De 24 a 48 horas.", right: true, size: 52 },
];

const Texto: React.FC<{ f: number }> = ({ f }) => {
  let s: Slot | null = null;
  for (let i = 0; i < SLOTS.length; i++) if (f >= SLOTS[i].a && f <= SLOTS[i].b + 12) s = SLOTS[i];
  if (!s) return null;
  const inA = ramp(f, s.a, s.a + 10);
  const outA = 1 - ramp(f, s.b, s.b + 12, Easing.in(Easing.cubic));
  const a = Math.min(inA, outA);
  return (
    <div style={{
      position: "absolute", left: s.right ? 1180 : SAFE + 20, bottom: 200, width: s.right ? 700 : 1000,
      opacity: a, transform: `translateY(${((1 - inA) * 26).toFixed(1)}px)`,
      clipPath: `inset(0 ${((1 - inA) * 100).toFixed(1)}% 0 0)`,
    }}>
      <div style={{ marginBottom: 12 }}><Kick size={32}>{s.k}</Kick></div>
      {/* cama oscura: ⛔ nunca texto claro fino sobre b-roll sin cama */}
      <div style={{ display: "inline-block", padding: "10px 26px 14px 22px", borderLeft: `5px solid ${C.gold}`, background: "linear-gradient(90deg, rgba(20,17,13,0.70) 0%, rgba(20,17,13,0.34) 78%, rgba(20,17,13,0) 100%)" }}>
        <Head size={s.size || 64}>{s.h}</Head>
      </div>
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════════════════════════
export const MovCuatroPasos: React.FC = () => {
  const f = useCurrentFrame();

  // ── UNA sola cámara, función del frame GLOBAL. `cam()` de Stage aporta la deriva viva (nunca
  //    queda del todo quieta) y las keyframes continuas aportan el encuadre de cada acto.
  const base = cam(f, DUR, { z: 1, panX: 0, panY: 0, ry: 0, rx: 0 }, { z: 1, panX: 0, panY: 0, ry: 0, rx: 0 });
  const CAM: Cam = {
    z: base.z * kf(f, K_Z),
    panX: base.panX + kf(f, K_PX),
    panY: base.panY + kf(f, K_PY),
    ry: base.ry + kf(f, K_RY),
    rx: base.rx + kf(f, K_RX),
  };
  const px = CAM.panX, py = CAM.panY;

  // ── UNA sola luz, que EVOLUCIONA 0.45 → 0.25: el tramo ACLARA a medida que el trabajo se
  //    resuelve. `sucio` sale de ahí, y el acto 2 le suma su propio pozo (la nube de esporas tapa
  //    la ventana) de forma SUAVE — evoluciona, no salta.
  const t = luz(f, DUR, 0.45, 0.25);
  const grime = interpolate(t, [0.25, 0.45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const nube = f > 120 && f < 560 ? bell(f, 372, 172) : 0;
  const sucio = Math.min(1, grime * 0.82 + nube * 0.5);
  const limpio = ramp(f, 1430, 1660, Easing.inOut(Easing.sin));

  // ── ZOOM-THROUGH de la frontera 4 (⛔ no es un fade: el acto 4 se va POR EL LENTE) ──
  // ANTI-HUECO: el plano que sale NO baja opacidad — es una imagen a sangre escalando, así que
  // tapa el cuadro a cualquier escala. Lo único que se desvanece es el trazo del gráfico. Y el
  // plano que entra llega a escala 1 EXACTO en f1020, que es donde el que sale se corta.
  const inZT = f >= 994 && f <= 1019;
  const ztOut = interpolate(f, [994, 1019], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });
  const ztOutS = inZT ? 1 + ztOut * 3.7 : 1;
  const ztOutA = 1 - ramp(f, 1006, 1019, Easing.in(Easing.quad));
  const ztInS = interpolate(f, [994, 1020], [0.17, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  // ── MATCH-SHAPE de la frontera 5: la carta nº3 del riel crece hasta ser el plano entero ──
  // el riel ATRAVIESA las cinco fronteras: no se va nunca (sería perder la materia que cruza).
  // En el acto 2 —el plano más fuerte— baja un poco y se apaga para dejarle el cuadro, y recién
  // al final se retira del todo, con los cuatro pasos ya encendidos.
  const rielDy = kf(f, [[0, 0], [132, 34], [516, 34], [556, 0], [1545, 0], [1616, 236], [1736, 236]]);
  const rielDim = kf(f, [[0, 1], [140, 0.36], [512, 0.36], [556, 1], [1736, 1]]);
  const ms = interpolate(f, [1276, 1332], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.poly(3)) });
  const msX = interpolate(ms, [0, 1], [cardX(2), -22]);
  const msY = interpolate(ms, [0, 1], [CY0 - 16 + rielDy, -22]);
  const msW = interpolate(ms, [0, 1], [CW, 1964]);
  const msH = interpolate(ms, [0, 1], [CH, 1124]);
  const msR = interpolate(ms, [0, 1], [12, 0]);

  // ── repliegue al tercio derecho: en «Esperar» VUELVE EL AVATAR (⛔ nunca boca ni mentón) ──
  const rev = ramp(f, 1552, 1624, Easing.inOut(Easing.poly(3)));
  // el panel se queda en el TERCIO DERECHO (x 1180→1860): la cara y el mentón del avatar viven
  // en el centro-izquierda y no se tocan nunca. ⛔ nada por encima de su boca.
  const pX = interpolate(rev, [0, 1], [msX, 1180]);
  const pY = interpolate(rev, [0, 1], [msY, 140]);
  const pW = interpolate(rev, [0, 1], [msW, 680]);
  const pH = interpolate(rev, [0, 1], [msH, 684]);
  const pR = interpolate(rev, [0, 1], [msR, 16]);
  const cover = 1 - rev; // el respaldo opaco se retira: debajo queda el avatar al aire

  return (
    <AbsoluteFill>
      {/* respaldo opaco: mientras el plano va a sangre tapa el avatar; en el repliegue se retira */}
      <AbsoluteFill style={{ opacity: cover, background: "linear-gradient(160deg, #241F19 0%, #17130F 58%, #100D0A 100%)" }} />

      {/* ══════════════ UNA SOLA CÁMARA ══════════════ */}
      <AbsoluteFill style={camStyle(CAM)}>

        {/* ─ L2 · EL PLANO: la MISMA pared atraviesa los seis actos ─ */}
        <div style={plane(-420, px * 0.42, py * 0.42)}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "hidden", transformOrigin: `${CX}px ${CY}px`, transform: `scale(${ztOutS.toFixed(4)})` }}>
            {/* A1 · la pared enferma y las cuatro herramientas en el piso */}
            <Sequence from={0} durationInFrames={128}><Clip n="clembudo_s315" d={128} z0={1.06} z1={1.13} /></Sequence>
            {/* A2 · EL ERROR: lijar en seco. Después el macro del haz. Foto→clip del MISMO asset:
                el clip i2v arranca EN su foto, así que el relevo es invisible y la animación de
                las partículas depositándose cae justo en «se posa en toda la casa» (f421). */}
            <Sequence from={128} durationInFrames={150}><Clip n="clembudo_s316" d={150} z0={1.04} z1={1.15} /></Sequence>
            <Sequence from={278} durationInFrames={143}><Foto n="clembudo_s317" d={143} z0={1.05} z1={1.19} dx={-1.6} /></Sequence>
            <Sequence from={421} durationInFrames={120}><Clip n="clembudo_s317" d={120} z0={1.19} z1={1.26} /></Sequence>
            {/* A3 · rociar, mojar, esperar */}
            <Sequence from={541} durationInFrames={151}><Clip n="clembudo_s318" d={151} z0={1.12} z1={1.04} /></Sequence>
            {/* A4 · raspar en húmedo, y medir el margen */}
            <Sequence from={692} durationInFrames={151}><Clip n="clembudo_s319" d={151} z0={1.03} z1={1.12} /></Sequence>
            {/* el clip de s320 arranca en f869 a propósito: así sus 151 frames llegan HASTA f1019
                y el zoom-through nunca se come el plano (anti-hueco). Los 26 frames previos los
                cubre su propia foto, que es el frame 0 del clip: relevo invisible. */}
            <Sequence from={843} durationInFrames={26}><Foto n="clembudo_s320" d={26} z0={1.02} z1={1.04} /></Sequence>
            <Sequence from={869} durationInFrames={151}><Clip n="clembudo_s320" d={151} z0={1.04} z1={1.1} /></Sequence>
            {/* A5 (2ª mitad) · Claudio frente al anillo que le volvió. Llega hasta f1332, que es
                donde el MATCH-SHAPE ya cubre el 100 %: nunca queda el respaldo a la vista. */}
            <Sequence from={1170} durationInFrames={12}><Foto n="clembudo_s322" d={12} z0={1.05} z1={1.06} /></Sequence>
            <Sequence from={1182} durationInFrames={151}><Clip n="clembudo_s322" d={151} z0={1.06} z1={1.14} /></Sequence>
          </div>
        </div>

        {/* ─ L3 · el plano que LLEGA por el zoom-through: el macro real del anillo ─ */}
        {f >= 994 && f <= 1169 ? (
          <div style={plane(-300, px * 0.6, py * 0.6)}>
            <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "hidden", transformOrigin: `${CX}px ${CY}px`, transform: `scale(${ztInS.toFixed(4)})` }}>
              <Sequence from={994} durationInFrames={176}><Foto n="clembudo_s321" d={176} z0={1.06} z1={1.16} /></Sequence>
              {/* GRADE del macro: medido en still daba luma 159 (el plano más claro de todo el
                  tramo, justo donde se habla del moho) y dejaba un salto de 68 puntos en el corte
                  de f1170. Bajado a ≈120, que es la línea del resto del movimiento. */}
              <div style={{
                position: "absolute", left: 0, top: 0, width: 1920, height: 1080,
                background: "radial-gradient(118% 86% at 50% 46%, rgba(26,22,17,0.20) 0%, rgba(20,17,13,0.56) 100%)",
              }} />
              {/* MATERIA QUE CRUZA: el trazo del PARCHE sobrevive el zoom-through y cae exacto
                  sobre el rectángulo tratado de la foto real — el anillo de moho queda AFUERA. */}
              <div style={{
                position: "absolute", left: CX, top: CY, width: 1216, height: 784, marginLeft: -608, marginTop: -392,
                borderRadius: 44, border: "4px dashed rgba(250,244,228,0.95)",
                boxShadow: "0 0 40px rgba(18,15,11,0.55)",
                opacity: (1 - ramp(f, 1104, 1162)) * ramp(f, 1026, 1050),
              }} />
            </div>
          </div>
        ) : null}

        {/* ─ L4 · la MANCHA que cruza: el gráfico del parche, y la carta que se vuelve pared ─ */}
        <div style={plane(-120, px * 0.22, py * 0.22)}>
          {f >= 760 && f <= 1019 ? (
            <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: `${CX}px ${CY}px`, transform: `scale(${ztOutS.toFixed(4)})`, opacity: ztOutA }}>
              <Halo f={f} />
            </div>
          ) : null}
          {f >= 1276 ? (
            <div style={{
              position: "absolute", left: pX, top: pY, width: pW, height: pH, borderRadius: pR, overflow: "hidden",
              boxShadow: `0 ${(24 * (1 - ms * 0.5) + rev * 26).toFixed(1)}px 70px rgba(20,17,13,${(0.42 * (1 - ms) + rev * 0.5).toFixed(3)})`,
            }}>
              <Sequence from={1276} durationInFrames={41}><Foto n="clembudo_s323" d={41} z0={1.02} z1={1.06} /></Sequence>
              <Sequence from={1317} durationInFrames={128}><Clip n="clembudo_s323" d={128} z0={1.06} z1={1.13} /></Sequence>
              <Sequence from={1445} durationInFrames={76}><Foto n="clembudo_s324" d={76} z0={1.04} z1={1.1} /></Sequence>
              <Sequence from={1521} durationInFrames={151}><Clip n="clembudo_s324" d={151} z0={1.1} z1={1.02} /></Sequence>
              <Sequence from={1672} durationInFrames={65}><Clip n="clembudo_s325" d={65} z0={1.04} z1={1.09} /></Sequence>
              <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", border: `${(rev * 2).toFixed(2)}px solid rgba(247,241,223,${(rev * 0.22).toFixed(3)})`, borderRadius: pR }} />
            </div>
          ) : null}
        </div>

        {/* ─ L6 · el riel de las cuatro herramientas (materia que cruza las cinco fronteras) ─ */}
        <div style={plane(200, -px * 0.3, -py * 0.3)}>
          <Riel f={f} dy={rielDy} dim={rielDim} />
        </div>

        {/* ─ L7 · la nube de esporas a contraluz (acto 2) ─ */}
        <div style={plane(340, -px * 0.7, -py * 0.7)}>
          <Esporas a={Math.min(1, nube * 1.5)} />
        </div>
      </AbsoluteFill>

      {/* ─ SUCIO → LIMPIO: la misma curva de luz que manda el tramo ─ */}
      <AbsoluteFill style={{ pointerEvents: "none", background: `linear-gradient(168deg, rgba(28,30,20,${(0.2 * sucio).toFixed(3)}) 0%, rgba(18,16,12,${(0.3 * sucio).toFixed(3)}) 100%)` }} />
      <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen", background: `linear-gradient(250deg, rgba(255,248,226,${(0.2 * limpio).toFixed(3)}) 0%, rgba(255,248,226,0.02) 46%, rgba(255,248,226,0) 72%)` }} />

      {/* ─ COSTURA 2 · WIPE POR MATERIA: el polvo SECO barre y detrás ya está la niebla MOJADA ─ */}
      {f >= 520 && f <= 566 ? (
        <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
          <div style={{
            position: "absolute", top: "-12%", height: "124%", width: 300,
            left: `${interpolate(f, [520, 566], [-16, 104], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) }).toFixed(2)}%`,
            transform: "translateX(-50%) rotate(5deg)",
            background: "linear-gradient(90deg, rgba(232,222,198,0) 0%, rgba(232,222,198,0.42) 38%, rgba(244,237,219,0.66) 52%, rgba(214,203,176,0.34) 70%, rgba(232,222,198,0) 100%)",
          }} />
          <Esporas a={0.95 * bell(f, 543, 22)} n={54} />
        </AbsoluteFill>
      ) : null}

      {/* ─ COSTURA 3 · la espátula de acero ocluye el 100 % ~4 frames (⛔ jamás el color del fondo) ─ */}
      <Espatula at={692} />
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <Occluder at={692} len={11} color="rgba(110,106,95,0.92)" angle={-7} />
      </AbsoluteFill>

      {/* ─ L8 · tipografía ─ */}
      <Texto f={f} />

      {/* ─ L9 · UNA sola atmósfera, montada una vez, que NUNCA se remonta entre actos ─ */}
      <Atmos t={t} dust={30} />
    </AbsoluteFill>
  );
};
