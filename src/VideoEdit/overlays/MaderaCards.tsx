// MaderaCards.tsx — overlays A MEDIDA del video "madera" (Constructor Libre, Tomás).
// Mismo ADN que OxCards: el CLIP vivo corre DETRÁS, borroso + scrim, y encima entra
// contenido premium con motion suave (spring/fade, cero shake, cero filtro retro).
// Marca = serif EB Garamond (SANS) + paleta terrosa/pergamino. Se usan con overlay:true
// en build_madera → se renderizan ENCIMA del beat de clip vivo, sin robarle el slot.
import { AbsoluteFill, Img, staticFile, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SANS, acc, useTagReveal } from "./ui";

// ── scrim: difumina el clip vivo de fondo y lo oscurece (entra/sale suave) ──
const Scrim: React.FC<{ op: number; strength?: number }> = ({ op, strength = 15 }) => (
  <AbsoluteFill
    style={{
      backdropFilter: `blur(${strength * op}px) saturate(${1 - 0.22 * op})`,
      WebkitBackdropFilter: `blur(${strength * op}px)`,
      background: `radial-gradient(120% 120% at 50% 45%, rgba(24,17,10,0.34), rgba(18,12,7,0.64))`,
      opacity: op,
    }}
  />
);

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const PAPER = "#efe7d3"; // pergamino de marca
const INK = "#2a2620"; // tinta marrón oscura

// ════ 1) MdMoistureGauge — MEDIDOR de humedad (aguja que sube al 20% y marca peligro) ════
// La aguja de un higrómetro barre de 0% a `value`%. Arco tricolor: seco (verde) →
// zona de peligro (terracota) a partir del 20%. Etiqueta "LÍNEA DEL HONGO" clavada al 20%.
export const MdMoistureGauge: React.FC<{ durationInFrames: number; value?: number; danger?: number; label?: string; accent?: string }> = ({ durationInFrames, value = 20, danger = 20, label = "Por encima del 20% el hongo vive", accent }) => {
  const a = acc(accent), { op } = useTagReveal(durationInFrames, 0), f = useCurrentFrame(), { fps } = useVideoConfig();
  const MAX = 40; // escala del dial 0..40%
  const A0 = -120, A1 = 120; // grados del arco
  const sweep = interpolate(f, [8, 8 + fps * 1.1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shown = Math.round(value * easeOut(sweep));
  const ang = (v: number) => A0 + (A1 - A0) * (Math.min(v, MAX) / MAX);
  const needle = ang(value * easeOut(sweep));
  const dz = ang(danger); // ángulo de la línea de peligro
  const R = 210, cx = 260, cy = 250;
  const pt = (deg: number, r: number) => { const rad = (deg - 90) * Math.PI / 180; return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)]; };
  const arc = (d0: number, d1: number, r: number) => { const [x0, y0] = pt(d0, r), [x1, y1] = pt(d1, r); const large = Math.abs(d1 - d0) > 180 ? 1 : 0; return `M ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1}`; };
  const dzReveal = interpolate(f, [fps * 0.9, fps * 1.3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Scrim op={op} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <div style={{ fontFamily: SANS, color: a, fontSize: 24, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", marginBottom: 4 }}>Humedad de la madera</div>
        <svg width="520" height="360" style={{ overflow: "visible" }}>
          <path d={arc(A0, A1, R)} fill="none" stroke="rgba(239,231,211,0.22)" strokeWidth="26" strokeLinecap="round" />
          <path d={arc(A0, dz, R)} fill="none" stroke="#7C8A5A" strokeWidth="26" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - sweep} />
          <path d={arc(dz, A1, R)} fill="none" stroke="#B0503C" strokeWidth="26" strokeLinecap="round" opacity={0.35 + 0.55 * dzReveal} />
          {/* marca de la línea de peligro (20%) */}
          <line x1={pt(dz, R - 34)[0]} y1={pt(dz, R - 34)[1]} x2={pt(dz, R + 34)[0]} y2={pt(dz, R + 34)[1]} stroke={PAPER} strokeWidth="4" opacity={dzReveal} />
          {/* aguja */}
          <line x1={cx} y1={cy} x2={pt(needle, R - 44)[0]} y2={pt(needle, R - 44)[1]} stroke={PAPER} strokeWidth="6" strokeLinecap="round" style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.6))" }} />
          <circle cx={cx} cy={cy} r="16" fill={PAPER} />
          <circle cx={cx} cy={cy} r="7" fill={INK} />
        </svg>
        <div style={{ fontFamily: SANS, fontWeight: 800, color: shown >= danger ? "#e08a72" : "#a9ba8c", fontSize: 110, lineHeight: 1, marginTop: -30, textShadow: "0 4px 22px rgba(0,0,0,0.6)" }}>{shown}%</div>
        <div style={{ position: "relative" }}>
          <div style={{ display: "inline-block", opacity: dzReveal, fontFamily: SANS, color: PAPER, fontSize: 30, fontWeight: 600, marginTop: 14, background: "rgba(176,80,60,0.85)", padding: "8px 20px", borderRadius: 8, boxShadow: "0 8px 22px rgba(0,0,0,0.4)" }}>{label}</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ════ 2) MdLifespanBar — BARRA DE VIDA de la madera (5 años sin tratar vs 100 tratada) ════
// Dos barras horizontales que crecen desde 0. La corta (sin tratar) llega a un tope
// bajo con banda de terracota; la larga (tratada/defendida) crece hasta el fondo.
export const MdLifespanBar: React.FC<{ durationInFrames: number; title?: string; low?: { label: string; years: string; value: number }; high?: { label: string; years: string; value: number }; accent?: string }> = ({ durationInFrames, title = "Cuánto dura la madera", low = { label: "Sin tratar", years: "5 años", value: 5 }, high = { label: "Defendida", years: "100 años", value: 100 }, accent }) => {
  const a = acc(accent), { op } = useTagReveal(durationInFrames, 0), f = useCurrentFrame(), { fps } = useVideoConfig();
  const grow = (d: number) => interpolate(f, [fps * (0.35 + d), fps * (1.5 + d)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const maxV = Math.max(low.value, high.value);
  const Row: React.FC<{ r: { label: string; years: string; value: number }; d: number; color: string; danger?: boolean }> = ({ r, d, color, danger }) => {
    const g = easeOut(grow(d));
    const w = (r.value / maxV) * 100 * g;
    const num = Math.round(r.value * g);
    return (
      <div style={{ marginBottom: 30 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
          <span style={{ fontFamily: SANS, color: PAPER, fontSize: 34, fontWeight: 700 }}>{r.label}</span>
          <span style={{ fontFamily: SANS, color: color, fontSize: 40, fontWeight: 800 }}>{num} años</span>
        </div>
        <div style={{ height: 44, borderRadius: 10, background: "rgba(239,231,211,0.14)", overflow: "hidden", border: "1px solid rgba(239,231,211,0.14)" }}>
          <div style={{ height: "100%", width: `${w}%`, background: danger ? "linear-gradient(90deg,#8a4030,#B0503C)" : "linear-gradient(90deg,#6E8B47,#8aa860)", borderRadius: 10, boxShadow: `0 0 20px ${color}66` }} />
        </div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Scrim op={op} strength={13} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 150px" }}>
        <div style={{ width: "100%", maxWidth: 1200 }}>
          <div style={{ fontFamily: SANS, color: "#fff", fontSize: 52, fontWeight: 800, marginBottom: 30, textShadow: "0 3px 16px rgba(0,0,0,0.6)" }}>{title}<span style={{ display: "inline-block", width: 70, height: 4, background: a, borderRadius: 3, marginLeft: 20, verticalAlign: "middle" }} /></div>
          <Row r={low} d={0} color="#e08a72" danger />
          <Row r={high} d={0.5} color="#a9ba8c" />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ════ 3) MdRecipeCard — FICHA-RECETA del borato (estilo cuaderno de taller) ════
// Tarjeta de pergamino con la receta: 3 ingredientes con icono, cantidades legibles,
// y una nota manuscrita. Sella la marca terrosa (papel, tinta sepia).
export const MdRecipeCard: React.FC<{ durationInFrames: number; title?: string; items?: { ing: string; qty: string; glyph: string }[]; note?: string; accent?: string }> = ({ durationInFrames, title = "La receta del borato", items = [{ ing: "Bórax", qty: "1 parte", glyph: "⬜" }, { ing: "Ácido bórico", qty: "1 parte", glyph: "◻" }, { ing: "Agua caliente", qty: "hasta saturar", glyph: "💧" }], note = "Mezclar hasta que el polvo asiente en el fondo", accent }) => {
  const a = acc(accent), { op } = useTagReveal(durationInFrames), f = useCurrentFrame(), { fps } = useVideoConfig();
  const card = spring({ frame: f - 3, fps, config: { damping: 15, stiffness: 120 } });
  const tilt = interpolate(card, [0, 1], [-3, -1.4]);
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Scrim op={op} strength={13} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 880, background: PAPER, borderRadius: 12, padding: "40px 52px", boxShadow: "0 30px 70px rgba(0,0,0,0.55)", border: "1px solid rgba(42,38,32,0.18)", transform: `rotate(${tilt}deg) translateY(${(1 - card) * 40}px) scale(${0.94 + 0.06 * card})` }}>
          <div style={{ fontFamily: SANS, color: a, fontSize: 22, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase" }}>Del cuaderno de taller</div>
          <div style={{ fontFamily: SANS, color: INK, fontSize: 56, fontWeight: 800, lineHeight: 1.05, marginTop: 4 }}>{title}</div>
          <div style={{ height: 2, background: "rgba(42,38,32,0.22)", margin: "22px 0 18px" }} />
          {items.map((it, i) => {
            const rp = interpolate(f, [fps * (0.55 + i * 0.2), fps * (0.9 + i * 0.2)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 14, opacity: rp, transform: `translateX(${(1 - rp) * 20}px)` }}>
                <div style={{ fontSize: 40, width: 52, textAlign: "center" }}>{it.glyph}</div>
                <div style={{ fontFamily: SANS, color: INK, fontSize: 42, fontWeight: 700, flex: 1 }}>{it.ing}</div>
                <div style={{ flex: "0 0 auto", borderBottom: "2px dotted rgba(42,38,32,0.3)", minWidth: 60, alignSelf: "flex-end", marginBottom: 10 }} />
                <div style={{ fontFamily: SANS, color: "#8a5a34", fontSize: 40, fontWeight: 800, fontStyle: "italic" }}>{it.qty}</div>
              </div>
            );
          })}
          <div style={{ fontFamily: SANS, color: "rgba(42,38,32,0.72)", fontSize: 30, fontStyle: "italic", marginTop: 16, borderLeft: `4px solid ${a}`, paddingLeft: 16 }}>{note}</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ════ 4) MdPostGroundLine — CORTE del poste: dónde se pudre (línea de la tierra) ════
// Poste vertical en corte con 3 zonas (punta al aire / línea de la tierra / fondo bajo
// barro). La banda de pudrición roja crece justo en la línea de tierra + callout.
export const MdPostGroundLine: React.FC<{ durationInFrames: number; title?: string; accent?: string }> = ({ durationInFrames, title = "Dónde se pudre el poste" }) => {
  const { op } = useTagReveal(durationInFrames, 0), f = useCurrentFrame(), { fps } = useVideoConfig();
  const soil = interpolate(f, [fps * 0.3, fps * 0.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rot = interpolate(f, [fps * 0.9, fps * 1.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lab = (d: number) => interpolate(f, [fps * d, fps * (d + 0.35)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const groundY = 300; // y de la línea de tierra
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Scrim op={op} strength={13} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "absolute", top: 80, fontFamily: SANS, color: "#fff", fontSize: 48, fontWeight: 800, textShadow: "0 3px 16px rgba(0,0,0,0.6)" }}>{title}</div>
        <svg width="720" height="620" viewBox="0 0 720 620" style={{ overflow: "visible" }}>
          {/* suelo */}
          <rect x="140" y={groundY} width="440" height={280 * soil} fill="rgba(90,66,42,0.5)" />
          <line x1="120" y1={groundY} x2="600" y2={groundY} stroke={PAPER} strokeWidth="3" strokeDasharray="10 8" opacity={soil} />
          {/* poste (madera) */}
          <rect x="320" y="60" width="80" height="500" rx="6" fill="#c9a56a" stroke={INK} strokeWidth="3" />
          {/* veta */}
          <line x1="345" y1="70" x2="345" y2="550" stroke="rgba(42,38,32,0.25)" strokeWidth="2" />
          <line x1="375" y1="70" x2="375" y2="550" stroke="rgba(42,38,32,0.25)" strokeWidth="2" />
          {/* banda de pudrición en la línea de la tierra */}
          <rect x="320" y={groundY - 44} width="80" height={88} rx="4" fill="#B0503C" opacity={rot * 0.92} />
          {/* etiquetas */}
          <g opacity={lab(0.6)}>
            <line x1="400" y1="150" x2="540" y2="150" stroke="#a9ba8c" strokeWidth="3" />
            <circle cx="400" cy="150" r="6" fill="#a9ba8c" />
            <text x="548" y="145" fontFamily={SANS} fontSize="30" fill={PAPER} fontWeight="700">Punta al aire</text>
            <text x="548" y="178" fontFamily={SANS} fontSize="24" fill="#a9ba8c">se seca: sano</text>
          </g>
          <g opacity={lab(1.2)}>
            <line x1="320" y1={groundY} x2="180" y2={groundY - 10} stroke="#e08a72" strokeWidth="3" />
            <circle cx="320" cy={groundY} r="7" fill="#e08a72" />
            <text x="30" y={groundY - 20} fontFamily={SANS} fontSize="30" fill="#e08a72" fontWeight="800">Línea de tierra</text>
            <text x="30" y={groundY + 12} fontFamily={SANS} fontSize="22" fill={PAPER}>agua + aire: se pudre</text>
          </g>
          <g opacity={lab(1.0)}>
            <line x1="400" y1="500" x2="540" y2="500" stroke="#a9ba8c" strokeWidth="3" />
            <circle cx="400" cy="500" r="6" fill="#a9ba8c" />
            <text x="548" y="495" fontFamily={SANS} fontSize="30" fill={PAPER} fontWeight="700">Fondo bajo barro</text>
            <text x="548" y="528" fontFamily={SANS} fontSize="24" fill="#a9ba8c">sin aire: sano</text>
          </g>
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ════ 5) MdCharReveal — REVEAL de capa quemada (shou sugi ban): la superficie se ennegrece ════
// Una tabla de madera cuyo frente se quema de arriba a abajo (barrido negro con brasa),
// dejando la capa de carbón. Chips explican por qué protege.
export const MdCharReveal: React.FC<{ durationInFrames: number; title?: string; chips?: string[]; accent?: string }> = ({ durationInFrames, title = "La capa quemada protege", chips = ["El carbón no es comida para el hongo", "Repele el agua", "Espanta a los insectos"], accent }) => {
  const a = acc(accent), { op } = useTagReveal(durationInFrames, 0), f = useCurrentFrame(), { fps } = useVideoConfig();
  const burn = interpolate(f, [fps * 0.4, fps * 1.7], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Scrim op={op} strength={13} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 34 }}>
        <div style={{ fontFamily: SANS, color: "#fff", fontSize: 50, fontWeight: 800, textShadow: "0 3px 16px rgba(0,0,0,0.6)" }}>{title}</div>
        <div style={{ position: "relative", width: 980, height: 260, borderRadius: 12, overflow: "hidden", border: `2px solid ${a}`, boxShadow: "0 22px 54px rgba(0,0,0,0.55)" }}>
          {/* madera cruda */}
          <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg,#c9a56a,#c9a56a 20px,#bd9a5e 20px,#bd9a5e 40px)" }} />
          {/* capa quemada que baja */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: `${burn}%`, background: "repeating-linear-gradient(0deg,#241d17,#241d17 18px,#171310 18px,#171310 40px)" }} />
          {/* brasa en el frente de quemado */}
          <div style={{ position: "absolute", left: 0, right: 0, top: `calc(${burn}% - 8px)`, height: 16, background: "linear-gradient(90deg,#ff7b2e,#ffb14d,#ff7b2e)", filter: "blur(3px)", opacity: burn > 1 && burn < 99 ? 0.9 : 0 }} />
        </div>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", maxWidth: 1000 }}>
          {chips.map((c, i) => {
            const cp = interpolate(f, [fps * (1.0 + i * 0.2), fps * (1.3 + i * 0.2)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return <div key={i} style={{ fontFamily: SANS, fontSize: 28, color: "#fff", padding: "10px 20px", borderRadius: 30, background: "rgba(24,17,10,0.55)", border: `1px solid ${a}`, opacity: cp, transform: `translateY(${(1 - cp) * 14}px)` }}>{c}</div>;
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ════ 6) MdMethodRecap — RECAP de los 4 métodos como fichas que entran en secuencia ════
export const MdMethodRecap: React.FC<{ durationInFrames: number; title?: string; methods?: { num: string; name: string; use: string; glyph: string }[]; accent?: string }> = ({ durationInFrames, title = "Los 4 métodos, en una", methods = [{ num: "1", name: "Aceite de linaza", use: "muebles y madera de adentro", glyph: "🪵" }, { num: "2", name: "Borato de $2", use: "veneno contra hongo y bichos", glyph: "🧪" }, { num: "3", name: "Quemar la madera", use: "postes y lo rústico", glyph: "🔥" }, { num: "4", name: "Sellar (en orden)", use: "secar → borato → sellar", glyph: "🛡" }], accent }) => {
  const a = acc(accent), { op } = useTagReveal(durationInFrames, 0), f = useCurrentFrame(), { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Scrim op={op} strength={14} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <div style={{ fontFamily: SANS, color: "#fff", fontSize: 46, fontWeight: 800, marginBottom: 26, textShadow: "0 3px 16px rgba(0,0,0,0.6)" }}>{title}</div>
        <div style={{ display: "flex", gap: 22 }}>
          {methods.map((m, i) => {
            const cp = spring({ frame: f - (6 + i * 8), fps, config: { damping: 14, stiffness: 130 } });
            return (
              <div key={i} style={{ width: 300, background: PAPER, borderRadius: 14, padding: "26px 24px", boxShadow: "0 20px 50px rgba(0,0,0,0.5)", border: "1px solid rgba(42,38,32,0.18)", opacity: cp, transform: `translateY(${(1 - cp) * 70}px) scale(${0.86 + 0.14 * cp})` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ width: 54, height: 54, borderRadius: "50%", background: a, color: PAPER, fontFamily: SANS, fontWeight: 800, fontSize: 34, display: "grid", placeItems: "center" }}>{m.num}</div>
                  <div style={{ fontSize: 44 }}>{m.glyph}</div>
                </div>
                <div style={{ fontFamily: SANS, color: INK, fontSize: 36, fontWeight: 800, lineHeight: 1.06, marginTop: 16 }}>{m.name}</div>
                <div style={{ fontFamily: SANS, color: "rgba(42,38,32,0.7)", fontSize: 26, lineHeight: 1.25, marginTop: 8 }}>{m.use}</div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ════ 7) MdNameTag — LOWER-THIRD rústico para Tomás (nombre + rol) ════
export const MdNameTag: React.FC<{ durationInFrames: number; name?: string; role?: string; accent?: string }> = ({ durationInFrames, name = "Tomás", role = "El Constructor Libre", accent }) => {
  const a = acc(accent), { op } = useTagReveal(durationInFrames), f = useCurrentFrame(), { fps } = useVideoConfig();
  const bar = interpolate(f, [4, fps * 0.9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const roleP = interpolate(f, [fps * 0.5, fps * 0.9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <div style={{ position: "absolute", left: 100, bottom: 130 }}>
        <div style={{ overflow: "hidden", height: 96 }}>
          <div style={{ background: PAPER, borderLeft: `6px solid ${a}`, borderRadius: 8, padding: "12px 30px", boxShadow: "0 14px 40px rgba(0,0,0,0.5)", transform: `translateX(${(1 - bar) * -60}px)`, opacity: bar }}>
            <div style={{ fontFamily: SANS, color: INK, fontSize: 58, fontWeight: 800, lineHeight: 1 }}>{name}</div>
          </div>
        </div>
        <div style={{ display: "inline-block", marginTop: 10, marginLeft: 8, fontFamily: SANS, color: PAPER, fontSize: 30, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", background: "rgba(124,138,90,0.9)", padding: "6px 18px", borderRadius: 6, opacity: roleP, transform: `translateX(${(1 - roleP) * -30}px)` }}>{role}</div>
      </div>
    </AbsoluteFill>
  );
};

// ════ 8) MdNextCard — ENDCARD del próximo video (teaser rústico) ════
export const MdNextCard: React.FC<{ durationInFrames: number; kicker?: string; title?: string; image?: string; accent?: string }> = ({ durationInFrames, kicker = "En el próximo video", title = "La humedad que sube por la pared", image, accent }) => {
  const a = acc(accent), { op } = useTagReveal(durationInFrames), f = useCurrentFrame(), { fps } = useVideoConfig();
  const card = spring({ frame: f - 4, fps, config: { damping: 15, stiffness: 110 } });
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Scrim op={op} strength={15} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 40, maxWidth: 1500, transform: `translateY(${(1 - card) * 40}px) scale(${0.94 + 0.06 * card})` }}>
          {image && (
            <div style={{ flex: "0 0 40%", aspectRatio: "4/3", borderRadius: 16, overflow: "hidden", border: `2px solid ${a}`, boxShadow: "0 22px 60px rgba(0,0,0,0.6)" }}>
              <Img src={staticFile(image)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: SANS, color: a, fontSize: 26, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase" }}>{kicker}</div>
            <div style={{ fontFamily: SANS, color: "#fff", fontSize: 70, fontWeight: 800, lineHeight: 1.06, marginTop: 10, textShadow: "0 3px 18px rgba(0,0,0,0.6)" }}>{title}</div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginTop: 26, fontFamily: SANS, color: PAPER, fontSize: 30, fontWeight: 700, background: "rgba(124,138,90,0.9)", padding: "12px 26px", borderRadius: 40 }}>
              <span style={{ fontSize: 22 }}>▶</span> No te lo pierdas
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
