// 4 pruebas de 10 s del estilo "fondo pintado + cabezones" — todo código, sin imágenes.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/NanumPenScript";
import { Personaje, TINTA } from "./Personaje";
import { Acabado, CAM_CALLE, CAM_ESC, FondoCalle, FondoCuarto, FondoDesierto, FondoEscondite, enPiso } from "./Fondos";

const { fontFamily: MANO } = loadFont();
const W = 1920, H = 1080;
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const ease = Easing.bezier(0.45, 0, 0.55, 1);

// cámara: zoom/paneo suave sobre todo el cuadro
const Camara: React.FC<{ z: number; x?: number; y?: number; blur?: number; children: React.ReactNode }> = ({ z, x = 0, y = 0, blur = 0, children }) => (
  <AbsoluteFill style={{ transform: `translate(${x}px, ${y}px) scale(${z})`, transformOrigin: "50% 50%", filter: blur ? `blur(${blur}px)` : undefined }}>{children}</AbsoluteFill>
);
const Capa: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>{children}</svg>
);

/* Tarjeta roja con texto escrito a mano */
const Tarjeta: React.FC<{ texto: string; desde: number; dur: number }> = ({ texto, desde, dur }) => {
  const f = useCurrentFrame() - desde;
  const prog = interpolate(f, [6, dur * 0.6], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
  return (
    <AbsoluteFill style={{ background: "#c4291f" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(255,120,90,.25), rgba(60,0,0,.45))" }} />
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <clipPath id="escribe"><rect x={600} y={0} width={720 * prog} height={H} /></clipPath>
        </defs>
        <text x={W / 2} y={H / 2 + 60} textAnchor="middle" fontFamily={MANO} fontSize={230} fill="#fbf4ec" clipPath="url(#escribe)">{texto}</text>
      </svg>
    </AbsoluteFill>
  );
};

/* ═════════════ PRUEBA 1 — Tarjeta "Mes 1" + calle vacía al amanecer ═════════════ */
export const Prueba1Calle: React.FC = () => {
  const f = useCurrentFrame();
  if (f < 66) return <Tarjeta texto="Mes 1" desde={0} dur={66} />;
  const t = f - 66;
  const z = interpolate(t, [0, 234], [1.04, 1.1], { easing: ease });
  const px = interpolate(t, [0, 234], [30, -40], { easing: ease });
  const wx = interpolate(t, [0, 120], [1.0, 5.2], { ...clamp, easing: Easing.out(Easing.sin) });
  const camina = t < 112;
  const mira = t < 120 ? 0 : interpolate(t, [120, 140, 165, 185], [0, -1, -1, 1], clamp);
  const habla = t > 192 && t < 232;
  const saluda = t > 196;
  const pj = enPiso(CAM_CALLE, [wx, wx < 1.8 ? 0.15 : 0, 7.7]);
  const sombraFin = enPiso(CAM_CALLE, [wx - 1.6, 0, 5.6]);
  const pajaros = Array.from({ length: 5 }).map((_, i) => ({ x: 300 + (t * (2.4 + i * 0.3)) + i * 70, y: 250 + i * 14 + Math.sin(t / 8 + i) * 6 }));
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Camara z={z} x={px}>
        <FondoCalle />
        <Capa>
          {pajaros.map((p, i) => {
            const a = Math.sin(t / 2.4 + i) * 8;
            return <path key={i} d={`M${p.x - 14},${p.y - a} Q${p.x - 6},${p.y - 6} ${p.x},${p.y} Q${p.x + 6},${p.y - 6} ${p.x + 14},${p.y - a}`} fill="none" stroke="#4a3540" strokeWidth={2.2} strokeLinecap="round" />;
          })}
          {/* sombra larga del personaje (sol bajo a la derecha) */}
          <path d={`M${pj.x},${pj.y} L${sombraFin.x},${sombraFin.y}`} stroke="#3b2550" strokeWidth={pj.s * 40} opacity={0.32} strokeLinecap="round" />
          <Personaje x={pj.x} y={pj.y} s={pj.s} luzLado={1} tinte="#ffb46b" tinteK={0.12} pelo={{ tipo: "gorro", color: "#d9762b", color2: "#b85c1b" }} campera="#3d5a73" camina={camina}
            mira={mira} habla={habla} expr={t > 150 && t < 192 ? "sorpresa" : "neutral"} brazos={saluda ? "saludo" : "abajo"} seed={3} />
        </Capa>
      </Camara>
      <Acabado id="p1" vig={0.5} />
      <Subtitulo f={t} desde={192} hasta={240} texto="¿Hola…? ¿No queda nadie despierto?" />
    </AbsoluteFill>
  );
};

/* subtítulo blanco tipo "hand-lettering" (como los rótulos del original) */
const Subtitulo: React.FC<{ f: number; desde: number; hasta: number; texto: string }> = ({ f, desde, hasta, texto }) => {
  const o = interpolate(f, [desde, desde + 6, hasta - 6, hasta], [0, 1, 1, 0], clamp);
  if (o <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, textAlign: "center", fontFamily: MANO, fontSize: 64, color: "#fff", opacity: o, textShadow: "0 3px 0 #000, 0 0 12px rgba(0,0,0,.8)" }}>{texto}</div>
  );
};

/* ═════════════ PRUEBA 2 — Diálogo en el escondite + primer plano pícaro ═════════════ */
export const Prueba2Escondite: React.FC = () => {
  const f = useCurrentFrame();
  const luz = 0.85 + Math.sin(f / 3) * 0.04 + (f % 53 < 3 ? -0.35 : 0);
  const A = { pelo: { tipo: "melena" as const, color: "#2a2422" }, campera: "#4c6b3a", seed: 11 };
  const B = { pelo: { tipo: "rodete" as const, color: "#7b3f8e" }, campera: "#c18b2e", remera: "#3b3b3b", seed: 23 };
  const pA = enPiso(CAM_ESC, [-0.6, 0, 2.2]), pB = enPiso(CAM_ESC, [1.0, 0, 2.6]);
  const luzE = { luzLado: 1 as const, tinte: "#ffc277", tinteK: 0.18 };
  let escena: React.ReactNode;
  if (f < 110) {
    const z = interpolate(f, [0, 110], [1.0, 1.04]);
    escena = (
      <Camara z={z}>
        <FondoEscondite luz={luz} />
        <Capa>
          <Personaje x={pA.x} y={pA.y} s={pA.s} {...luzE} {...A} habla={f > 8 && f < 100} brazos="gesto" expr="neutral" mira={0.7} />
          <Personaje x={pB.x} y={pB.y} s={pB.s} {...luzE} {...B} mira={-0.8} brazos="abajo" expr="neutral" />
        </Capa>
      </Camara>
    );
  } else if (f < 200) {
    const t = f - 110;
    const z = interpolate(t, [0, 90], [1, 1.08], { easing: ease });
    escena = (
      <>
        <Camara z={2.2} x={-60} y={150} blur={10}><FondoEscondite luz={luz} /></Camara>
        <Camara z={z}>
          <Capa>
            <Personaje x={960} y={1900} s={4.7} {...luzE} solapas linea={4} {...A} habla={t > 26 && t < 70} expr="picaro" mira={0.2} sinPiernas />
          </Capa>
        </Camara>
      </>
    );
  } else {
    const t = f - 200;
    escena = (
      <Camara z={1.04}>
        <FondoEscondite luz={luz} />
        <Capa>
          <Personaje x={pA.x} y={pA.y} s={pA.s} {...luzE} {...A} expr="nervioso" mira={0.8} brazos="abajo" />
          <Personaje x={pB.x} y={pB.y} s={pB.s} {...luzE} {...B} habla={t > 6 && t < 88} brazos="cruzados" expr="enojado" mira={-0.9} />
        </Capa>
      </Camara>
    );
  }
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {escena}
      <Acabado id="p2" vig={0.7} />
    </AbsoluteFill>
  );
};

/* ═════════════ PRUEBA 3 — Streamer en vivo con chat y donación ═════════════ */
const CHAT = [
  ["kiwi_rojo", "#ff7b7b", "llegué tarde, qué pasó?"],
  ["Ruloman", "#7bd1ff", "jajaja la cara"],
  ["ana.pistacho", "#b4ff7b", "dormí 3 meses literal"],
  ["el_tano99", "#ffd27b", "F en el chat"],
  ["Mati_77", "#d59bff", "toma, para el café ☕"],
  ["perro_lunar", "#7bffd1", "eso no es legal 💀"],
  ["kiwi_rojo", "#ff7b7b", "DONÓ? 😱"],
  ["sofi_b", "#ff9bd4", "saludá al chat!!"],
  ["Ruloman", "#7bd1ff", "otra vez la alarma jaja"],
  ["noquis_ok", "#c2ff9b", "clip clip clip"],
];
export const Prueba3Streamer: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const don = 150;
  const sp = spring({ frame: f - don, fps, config: { damping: 9, stiffness: 120 } });
  const donVis = f >= don && f < don + 95;
  const verde = f >= don ? interpolate(f, [don, don + 8, don + 80, don + 100], [0, 0.18, 0.18, 0], clamp) : 0;
  const viewers = Math.floor(10431 + f * 2.7 + (f > don ? (f - don) * 9 : 0));
  const expr = f < don ? "neutral" : f < don + 40 ? "sorpresa" : "feliz";
  const nChat = Math.min(CHAT.length, Math.floor(f / 26) + 2);
  const z = interpolate(f, [0, 300], [1.0, 1.05]);
  const sacude = f > don && f < don + 14 ? Math.sin(f * 3) * 6 : 0;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Camara z={z} x={sacude}>
        <FondoCuarto />
        <AbsoluteFill style={{ background: `rgba(60,255,120,${verde})`, mixBlendMode: "overlay" }} />
        <Capa>
          <Personaje x={860} y={1580} s={3.4} luzLado={-1} tinte="#cfd9ff" tinteK={0.1} solapas linea={4} pelo={{ tipo: "gorra", color: "#2f6fb3", color2: "#1f4f85" }} campera="#3a3d44" remera="#e9e6df"
            auriculares habla={(f > 12 && f < 140) || (f > don + 44 && f < 290)} expr={expr} mira={f < don ? 0 : -0.4} brazos={f > don + 40 ? "gesto" : "manos"} sinPiernas seed={7} />
        </Capa>
      </Camara>
      {/* ─── UI de stream ─── */}
      <div style={{ position: "absolute", left: 40, top: 34, display: "flex", alignItems: "center", gap: 14, fontFamily: "Arial Black, Arial, sans-serif" }}>
        <div style={{ width: 74, height: 74, borderRadius: 40, background: "#b8231c", border: "4px solid #1d1714", display: "grid", placeItems: "center", color: "#fff", fontSize: 30 }}>◉</div>
        <div style={{ background: "#e02b20", color: "#fff", padding: "6px 14px", borderRadius: 8, fontSize: 28, opacity: Math.floor(f / 20) % 2 ? 1 : 0.8 }}>EN VIVO</div>
        <div style={{ background: "rgba(0,0,0,.55)", color: "#fff", padding: "6px 14px", borderRadius: 8, fontSize: 28 }}>👁 {viewers.toLocaleString("es-AR")}</div>
      </div>
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 470, background: "linear-gradient(90deg, rgba(20,20,24,.35), rgba(20,20,24,.72))", padding: "120px 26px 0", fontFamily: "Arial, sans-serif", fontSize: 25, color: "#eee", display: "flex", flexDirection: "column", justifyContent: "flex-end", paddingBottom: 140 }}>
        {CHAT.slice(0, nChat).map(([u, c, m], i) => {
          const entra = interpolate(f - (i - 2) * 26, [0, 8], [0, 1], clamp);
          return (
            <div key={i} style={{ marginBottom: 12, opacity: i < 2 ? 1 : entra, transform: `translateY(${(1 - (i < 2 ? 1 : entra)) * 20}px)` }}>
              <b style={{ color: c }}>{u}:</b> {m}
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 700, bottom: 30, display: "flex", gap: 30 }}>
        {["🎤", "📷", "⚙"].map((e, i) => <div key={i} style={{ width: 62, height: 62, borderRadius: 40, background: "rgba(255,255,255,.85)", border: "3px solid #1d1714", display: "grid", placeItems: "center", fontSize: 28 }}>{e}</div>)}
      </div>
      {donVis && (
        <div style={{ position: "absolute", left: 130, top: 300, transform: `scale(${sp}) rotate(${(1 - sp) * -8}deg)`, transformOrigin: "left center", fontFamily: MANO, color: "#fff", fontSize: 96, lineHeight: 0.95, textShadow: "0 4px 0 #000, 0 0 30px rgba(60,255,120,.9)" }}>
          Mati_77<br />te mandó<br /><span style={{ color: "#8dff9c" }}>50 monedas</span>
        </div>
      )}
      <Acabado id="p3" vig={0.4} />
    </AbsoluteFill>
  );
};

/* ═════════════ PRUEBA 4 — Viaje en camioneta por el desierto ═════════════ */
const Camioneta: React.FC<{ f: number; children: React.ReactNode }> = ({ f, children }) => {
  const brillo = ((f * 9) % 2600) - 600;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="capot" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3b6e9c" /><stop offset="1" stopColor="#24476a" /></linearGradient>
        <linearGradient id="vidrio" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#bfe6f0" stopOpacity={0.28} /><stop offset="1" stopColor="#6fa9c0" stopOpacity={0.12} /></linearGradient>
        <clipPath id="parab"><path d="M300,190 Q960,130 1620,190 L1720,640 L200,640 Z" /></clipPath>
        <clipPath id="capotClip"><path d="M150,640 L1770,640 Q1960,760 1980,1100 L-60,1100 Q-40,760 150,640 Z" /></clipPath>
      </defs>
      {/* cabina: interior oscuro + luneta trasera con cielo */}
      <path d="M300,190 Q960,130 1620,190 L1720,640 L200,640 Z" fill="#2c3238" />
      <path d="M520,240 Q960,205 1400,240 L1440,420 L480,420 Z" fill="#9fcde3" stroke={TINTA} strokeWidth={4} />
      <path d="M480,420 H1440" stroke={TINTA} strokeWidth={6} />
      {/* bultos en la caja (visibles por la luneta) */}
      {[620, 760, 900, 1050, 1200, 1330].map((x, i) => <ellipse key={i} cx={x} cy={420} rx={70} ry={42} fill={["#cdb08a", "#b8986f", "#d6bd98"][i % 3]} stroke={TINTA} strokeWidth={3} />)}
      {/* asientos */}
      <path d="M420,640 L460,360 Q560,330 700,360 L740,640 Z M1180,640 L1220,360 Q1340,330 1460,360 L1500,640 Z" fill="#41505a" stroke={TINTA} strokeWidth={4} />
      <g clipPath="url(#parab)">{children}</g>
      {/* parabrisas: reflejos */}
      <path d="M300,190 Q960,130 1620,190 L1720,640 L200,640 Z" fill="url(#vidrio)" />
      <g clipPath="url(#parab)">
        <path d={`M${brillo},140 l180,0 l-260,520 l-90,0 Z`} fill="#fff" opacity={0.16} />
        <path d={`M${brillo + 260},140 l50,0 l-260,520 l-30,0 Z`} fill="#fff" opacity={0.12} />
      </g>
      {/* marco + parantes */}
      <path d="M300,190 Q960,130 1620,190 L1720,640 L200,640 Z" fill="none" stroke="#1f3448" strokeWidth={30} strokeLinejoin="round" />
      <path d="M300,190 Q960,130 1620,190 L1720,640 L200,640 Z" fill="none" stroke={TINTA} strokeWidth={4} />
      {/* espejo retrovisor */}
      <path d="M960,170 V205" stroke={TINTA} strokeWidth={6} />
      <rect x={900} y={200} width={120} height={36} rx={10} fill="#2c2c30" stroke={TINTA} strokeWidth={3} />
      {/* capot */}
      <path d="M150,640 L1770,640 Q1960,760 1980,1100 L-60,1100 Q-40,760 150,640 Z" fill="url(#capot)" stroke={TINTA} strokeWidth={5} />
      <g clipPath="url(#capotClip)">
        <path d="M760,640 L620,1100 M1160,640 L1300,1100" stroke="#1e3a56" strokeWidth={6} />
        <path d={`M${brillo * 0.8 - 200},640 l220,0 l-180,460 l-260,0 Z`} fill="#fff" opacity={0.12} />
        <path d="M200,700 Q960,670 1720,700" stroke="#8fb9dc" strokeWidth={10} opacity={0.5} fill="none" />
      </g>
      <path d="M150,640 H1770" stroke="#162b40" strokeWidth={14} />
    </svg>
  );
};

export const Prueba4Ruta: React.FC = () => {
  const f = useCurrentFrame();
  const t = f * 0.9;
  const bump = Math.sin(f / 2.2) * 2.2 + (f % 70 < 6 ? Math.sin((f % 70) / 6 * Math.PI) * -12 : 0);
  const z = interpolate(f, [0, 300], [1.0, 1.06]);
  const habla1 = f > 10 && f < 130; // acompañante
  const habla2 = f > 150 && f < 270; // conductor
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Camara z={1.0}><FondoDesierto t={t} /></Camara>
      <Camara z={z} y={bump}>
        <Camioneta f={f}>
          <Personaje x={1330} y={960} s={1.85} luzLado={1} tinte="#fff0c8" tinteK={0.08} solapas linea={3} pelo={{ tipo: "rodete", color: "#7b3f8e" }} campera="#c18b2e" remera="#3b3b3b" habla={habla1}
            expr={habla1 ? "feliz" : "neutral"} mira={-0.8} brazos="gesto" sinPiernas seed={23} />
          <Personaje x={610} y={960} s={1.85} luzLado={1} tinte="#fff0c8" tinteK={0.08} solapas linea={3} pelo={{ tipo: "gorro", color: "#d9762b", color2: "#b85c1b" }} campera="#3d5a73" habla={habla2}
            expr={habla2 ? "neutral" : "picaro"} mira={f > 140 ? 0.6 : 0} brazos="volante" sinPiernas seed={3} />
          {/* volante */}
          <g transform={`rotate(${Math.sin(f / 18) * 6} 610 640)`}>
            <ellipse cx={610} cy={640} rx={130} ry={46} fill="none" stroke="#1b1b1e" strokeWidth={16} />
            <path d="M610,640 V686 M490,640 H730" stroke="#1b1b1e" strokeWidth={10} />
          </g>
        </Camioneta>
      </Camara>
      <Acabado id="p4" vig={0.45} />
    </AbsoluteFill>
  );
};
