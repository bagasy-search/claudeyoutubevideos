// KitNuevos.tsx — componentes NUEVOS de falifting (reloj de la rutina + mapa de músculos de la cara).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { F_INTER, F_OSWALD } from "../VideoEdit/kit/premium/theme";
import { Bed, C, Card, Sfx, inA } from "./Kit";

type P = { bed?: string; durationInFrames?: number };
const FPS = 30;
const atF = (at: number | undefined, i: number, base = 12, step = 18) => (typeof at === "number" ? Math.max(0, Math.round(at * FPS)) : base + i * step);

const Kicker: React.FC<{ children: React.ReactNode; o?: number }> = ({ children, o = 1 }) => (
  <div style={{ fontFamily: F_OSWALD, fontWeight: 700, fontSize: 30, letterSpacing: 4, textTransform: "uppercase", color: C.tealD, opacity: o }}>{children}</div>
);
const Wordy: React.FC<{ text: string; start: number; size?: number }> = ({ text, start, size = 72 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ fontFamily: F_OSWALD, fontWeight: 700, fontSize: size, lineHeight: 1.08, color: C.ink }}>
      {text.split(" ").map((w, i) => { const a = inA(f, start + i * 3, 8); return <span key={i} style={{ display: "inline-block", marginRight: size * 0.24, opacity: a, transform: `translateY(${((1 - a) * size * 0.4).toFixed(1)}px)` }}>{w}</span>; })}
    </div>
  );
};

/** RELOJ DE LA RUTINA: 7 estaciones × 1 min en un dial; la actual en ámbar, las hechas en teal. */
const EST = ["Frente", "Ojos", "Mejillas", "Boca", "Mandíbula", "Cuello", "Cierre"];
export const RoutineClock: React.FC<P & { active?: number; title?: string; sub?: string }> = ({ bed, active = 0, title = "", sub = "" }) => {
  const f = useCurrentFrame();
  const R = 250, cx = 330, cy = 330, gap = 3.2;
  const arc = (i: number, r: number, w: number) => {
    const a0 = (((i * 360) / 7 + gap / 2 - 90) * Math.PI) / 180, a1 = ((((i + 1) * 360) / 7 - gap / 2 - 90) * Math.PI) / 180;
    const ro = r + w / 2, ri = r - w / 2;
    const p = (rr: number, a: number) => `${(cx + rr * Math.cos(a)).toFixed(1)} ${(cy + rr * Math.sin(a)).toFixed(1)}`;
    return `M ${p(ro, a0)} A ${ro} ${ro} 0 0 1 ${p(ro, a1)} L ${p(ri, a1)} A ${ri} ${ri} 0 0 0 ${p(ri, a0)} Z`;
  };
  const sweep = inA(f, 6, active ? 18 : 40);
  const pulse = 1 + 0.035 * Math.sin(f / 6);
  return (
    <AbsoluteFill>
      <Bed src={bed} veil={0.5} />
      <Sfx at={6} src="node_pop.mp3" vol={0.26} />
      {active ? <Sfx at={20} src="sfx_paper_tick.mp3" vol={0.3} /> : null}
      <Card w={1560} h={780} x={50} y={52} pad={0}>
        <div style={{ display: "flex", height: "100%", alignItems: "center" }}>
          <svg width={660} height={660} viewBox="0 0 660 660" style={{ marginLeft: 50, flexShrink: 0 }}>
            <circle cx={cx} cy={cy} r={R + 62} fill="#fff" stroke={C.line} strokeWidth={2} />
            {EST.map((e, i) => {
              const n = i + 1;
              const shown = active ? true : i / 7 < sweep;
              const isA = n === active, done = !!active && n < active;
              const col = isA ? C.amber : done ? C.teal : active ? C.paper2 : C.teal;
              const a = (((i + 0.5) * 360) / 7 - 90) * Math.PI / 180;
              const s = isA ? pulse : 1;
              return (
                <g key={e} opacity={shown ? 1 : 0.12} transform={`translate(${cx} ${cy}) scale(${s.toFixed(4)}) translate(${-cx} ${-cy})`}>
                  <path d={arc(i, R, 78)} fill={col} stroke="#fff" strokeWidth={3} />
                  <text x={cx + R * Math.cos(a)} y={cy + R * Math.sin(a) + 14} textAnchor="middle" style={{ fontFamily: F_OSWALD, fontWeight: 800, fontSize: 44, fill: isA || done || !active ? "#fff" : C.ink2 }}>{n}</text>
                </g>
              );
            })}
            <text x={cx} y={cy + 20} textAnchor="middle" style={{ fontFamily: F_OSWALD, fontWeight: 800, fontSize: 150, fill: active ? C.amber : C.tealD }}>{active ? active : 7}</text>
            <text x={cx} y={cy + 82} textAnchor="middle" style={{ fontFamily: F_OSWALD, fontWeight: 700, fontSize: 40, letterSpacing: 3, fill: C.ink2 }}>{active ? "DE 7" : "MINUTOS"}</text>
          </svg>
          <div style={{ flex: 1, paddingLeft: 60, paddingRight: 60 }}>
            <Kicker o={inA(f, 8, 10)}>{active ? `Movimiento ${active} · 1 minuto` : "La rutina completa"}</Kicker>
            <div style={{ marginTop: 18 }}><Wordy text={title} start={12} size={active ? 104 : 80} /></div>
            <div style={{ height: 6, width: 320 * inA(f, 22, 14), background: active ? C.amber : C.teal, borderRadius: 3, marginTop: 14 }} />
            <div style={{ marginTop: 30, fontFamily: F_INTER, fontWeight: 600, fontSize: 46, lineHeight: 1.25, color: C.ink2, opacity: inA(f, 26, 12) }}>{sub}</div>
            {!active ? (
              <div style={{ marginTop: 34, display: "flex", flexWrap: "wrap", gap: 14 }}>
                {EST.map((e, i) => { const a = inA(f, 30 + i * 5, 8); return <div key={e} style={{ fontFamily: F_INTER, fontWeight: 700, fontSize: 30, color: C.tealD, background: "#E3F5F4", borderRadius: 40, padding: "8px 22px", opacity: a, transform: `translateY(${((1 - a) * 16).toFixed(1)}px)` }}>{i + 1} · {e}</div>; })}
              </div>
            ) : null}
          </div>
        </div>
      </Card>
    </AbsoluteFill>
  );
};

/** MAPA DE LOS MÚSCULOS DE LA CARA: cara de frente en línea limpia; cada músculo se enciende cuando se nombra. */
type Mus = { key: string; label: string; at?: number };
const LBL: Record<string, [number, number, number, "l" | "r"]> = {
  // punto sobre el músculo (x,y en el lienzo de 1640x900) · y de la etiqueta · lado
  frontal: [808, 227, 210, "r"], ojos: [731, 367, 367, "l"], cigo: [901, 477, 480, "r"], boca: [790, 574, 574, "l"], platisma: [808, 731, 730, "r"],
};
export const FaceMuscles: React.FC<P & { title?: string; muscles?: Mus[] }> = ({ bed, title = "", muscles = [] }) => {
  const f = useCurrentFrame();
  const t = (i: number) => atF(muscles[i]?.at, i, 16, 40);
  let cur = -1;
  muscles.forEach((_, i) => { if (f >= t(i)) cur = i; });
  const idx = (k: string) => muscles.findIndex((m) => m.key === k);
  const lit = (k: string) => { const i = idx(k); return i < 0 ? 0 : inA(f, t(i), 12); };
  const hot = (k: string) => cur >= 0 && muscles[cur]?.key === k;
  const sty = (k: string) => {
    const a = lit(k), h = hot(k);
    return { fill: h ? C.amber : C.teal, fillOpacity: +(0.1 + 0.62 * a * (h ? 1 : 0.55)).toFixed(3), stroke: h ? "#B8741A" : C.tealD, strokeOpacity: +(0.3 + 0.7 * a).toFixed(3), strokeWidth: 3,
      style: { filter: h ? `drop-shadow(0 0 ${(10 + 6 * Math.sin(f / 5)).toFixed(1)}px rgba(227,155,45,0.85))` : "none" } };
  };
  const a0 = inA(f, 2, 16);
  return (
    <AbsoluteFill>
      <Bed src={bed} veil={0.55} />
      {muscles.map((m, i) => <Sfx key={m.key} at={t(i)} src="chip_pop3d.mp3" vol={0.22} />)}
      <Card w={1640} h={900} x={50} y={52} pad={0}>
        <div style={{ position: "absolute", left: 60, top: 40, opacity: a0 }}>
          <Kicker>Debajo de la piel</Kicker>
          <div style={{ fontFamily: F_OSWALD, fontWeight: 700, fontSize: 60, color: C.ink, marginTop: 6 }}>{title}</div>
        </div>
        <svg width={1640} height={900} viewBox="0 0 1640 900" style={{ position: "absolute", left: 0, top: 0 }}>
          <g transform="translate(430 72) scale(0.9)" opacity={a0}>
            <path d="M330 600 C330 690 322 740 300 800 L540 800 C518 740 510 690 510 600 Z" fill="#F6E9DC" stroke={C.ink2} strokeWidth={3} />
            <path d="M170 870 C230 800 300 790 330 790 L510 790 C540 790 610 800 670 870" fill="none" stroke={C.ink2} strokeWidth={3} />
            <path d="M420 80 C560 80 640 190 640 340 C640 470 590 570 510 630 C470 660 370 660 330 630 C250 570 200 470 200 340 C200 190 280 80 420 80 Z" fill="#F9EFE4" stroke={C.ink2} strokeWidth={3} />
            <path d="M200 330 C185 330 178 360 185 390 C192 420 205 425 212 420" fill="#F9EFE4" stroke={C.ink2} strokeWidth={3} />
            <path d="M640 330 C655 330 662 360 655 390 C648 420 635 425 628 420" fill="#F9EFE4" stroke={C.ink2} strokeWidth={3} />
            <path d="M250 250 C260 150 330 110 420 110 C510 110 580 150 590 250 C540 232 480 226 420 226 C360 226 300 232 250 250 Z" {...sty("frontal")} />
            <ellipse cx={335} cy={330} rx={72} ry={52} {...sty("ojos")} />
            <ellipse cx={505} cy={330} rx={72} ry={52} {...sty("ojos")} />
            <path d="M262 380 L290 372 L372 520 L356 530 Z" {...sty("cigo")} />
            <path d="M578 380 L550 372 L468 520 L484 530 Z" {...sty("cigo")} />
            <ellipse cx={420} cy={545} rx={92} ry={48} {...sty("boca")} />
            <path d="M340 610 C335 690 318 750 290 800 L550 800 C522 750 505 690 500 610 C470 640 370 640 340 610 Z" {...sty("platisma")} />
            <path d="M285 300 Q335 280 385 300" fill="none" stroke={C.ink} strokeWidth={4} strokeLinecap="round" />
            <path d="M455 300 Q505 280 555 300" fill="none" stroke={C.ink} strokeWidth={4} strokeLinecap="round" />
            <path d="M300 335 Q335 318 370 335 Q335 350 300 335 Z" fill="#fff" stroke={C.ink} strokeWidth={3} /><circle cx={335} cy={335} r={9} fill={C.ink} />
            <path d="M470 335 Q505 318 540 335 Q505 350 470 335 Z" fill="#fff" stroke={C.ink} strokeWidth={3} /><circle cx={505} cy={335} r={9} fill={C.ink} />
            <path d="M420 350 L405 455 Q420 468 440 458" fill="none" stroke={C.ink2} strokeWidth={3} strokeLinecap="round" />
            <path d="M372 545 Q420 530 468 545 Q420 575 372 545 Z" fill="#E6A99A" stroke={C.ink} strokeWidth={3} />
          </g>
          {muscles.map((m, i) => {
            const L = LBL[m.key]; if (!L) return null;
            const a = inA(f, t(i), 12), h = hot(m.key);
            const [X, Y, LY, side] = L;
            const LX = side === "r" ? 1180 : 460;
            return (
              <g key={m.key} opacity={a}>
                <line x1={X} y1={Y} x2={X + (LX - X) * a} y2={Y + (LY - Y) * a} stroke={h ? C.amber : C.tealD} strokeWidth={4} />
                <circle cx={X} cy={Y} r={9} fill={h ? C.amber : C.tealD} />
              </g>
            );
          })}
        </svg>
        {muscles.map((m, i) => {
          const L = LBL[m.key]; if (!L) return null;
          const a = inA(f, t(i), 12), h = hot(m.key);
          const [, , LY, side] = L;
          return (
            <div key={m.key} style={{ position: "absolute", top: LY - 34, ...(side === "r" ? { left: 1190 } : { left: 30, width: 420, textAlign: "right" as const }), opacity: a,
              transform: `translateX(${((1 - a) * (side === "r" ? 30 : -30)).toFixed(1)}px) scale(${h ? 1.06 : 1})`, transformOrigin: side === "r" ? "left center" : "right center" }}>
              <span style={{ fontFamily: F_OSWALD, fontWeight: 700, fontSize: 42, color: "#fff", background: h ? C.amber : C.tealD, borderRadius: 14, padding: "6px 22px", boxShadow: "0 10px 26px rgba(0,0,0,0.18)", whiteSpace: "nowrap" }}>{m.label}</span>
            </div>
          );
        })}
      </Card>
    </AbsoluteFill>
  );
};

// componentes aprobados por el creador (prototipos con tracking facial)
export { Gravedad, FlechasTrack } from "../proto/Proto";
export { LaminaV2NB } from "../proto/LaminaV2";
