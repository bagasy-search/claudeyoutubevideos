// Kit del canal CLAUDIO EL ALBAÑIL — serie "La casa de Doña Marta" (todo DENTRO del mundo: cama real + sombra + luz):
//   ClFoilTest    la prueba del papel aluminio (30x30, cinta por los 4 lados, 48 h): se despega y muestra de qué lado están las gotas.
//                 result: "out" (gotas del lado de la casa = condensación) · "wall" (mojado del lado de la pared) · "dry" · "all" (los 3)
//   ClHouseMap    el plano de la casa de Doña Marta (hilo de la serie): cuartos arreglados con tilde, el de HOY latiendo, el PRÓXIMO con "?"
//   ClWardrobeGap vista de arriba: el ropero pegado a la pared fría (aire quieto, gotas, moho) → se separa 5 cm con la cinta métrica y el aire pasa
//   ClTapeTest    la prueba de la cinta de embalar: se pega, se frota con la uña y se arranca de golpe; result "clean" | "paint" | "salt"
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CL, LABEL, SERIF, HAND, rnd, clamp01, ease, hexA } from "./ClTheme";
import { Bed, Card, Contact, RoomLight, Tape, lin, pop, useOut } from "./ClParts";

const plaster = (c = "#CFE3D6"): React.CSSProperties => ({ background: `radial-gradient(circle at 30% 20%, ${c}, #B9D0C2 80%)` });
const Mold: React.FC<{ n?: number; x: number; y: number; w: number; h: number; k?: number; seed?: number }> = ({ n = 70, x, y, w, h, k = 1, seed = 1 }) => (
  <>{Array.from({ length: n }, (_, i) => { const r = rnd(seed * 97 + i); return <div key={i} style={{ position: "absolute", left: x + rnd(seed + i * 3) * w, top: y + rnd(seed + i * 7) * h, width: 6 + r * 22, height: 6 + r * 18, borderRadius: "50%", background: "#1A1C14", opacity: k * (0.45 + 0.55 * rnd(i + 11)), filter: "blur(0.6px)" }} />; })}</>
);
const Badge: React.FC<{ text: string; color?: string; o?: number; style?: React.CSSProperties }> = ({ text, color = CL.navy, o = 1, style }) => (
  <div style={{ opacity: o, background: color, color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: 44, letterSpacing: 2, padding: "8px 26px", borderRadius: 12, textTransform: "uppercase", boxShadow: `0 14px 30px ${CL.shadow}`, borderBottom: `6px solid ${CL.yellow}`, whiteSpace: "nowrap", ...style }}>{text}</div>
);

// ───────────────── ClFoilTest
const FoilPanel: React.FC<{ result: "out" | "wall" | "dry"; t0: number; w: number; small?: boolean }> = ({ result, t0, w, small }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig();
  const s = w / 700, H = 560 * s;
  const appear = pop(f, fps, t0, 13);
  const tape = clamp01((f - t0 - 8) / 16);
  const clock = clamp01((f - t0 - 22) / (small ? 18 : 28));
  const peel = ease(clamp01((f - t0 - (small ? 44 : 56)) / 22));
  const drops = clamp01((f - t0 - (small ? 52 : 66)) / 20);
  const lab = result === "out" ? ["GOTAS AFUERA", "viene del aire: condensación"] : result === "wall" ? ["MOJADO DEL LADO DE LA PARED", "viene de adentro del muro"] : ["SECO DE LOS DOS LADOS", "mancha vieja: limpiar y pintar"];
  const F = 300 * s; // lado del cuadrado de aluminio
  const fx = (w - F) / 2, fy = H * 0.2;
  return (
    <div style={{ position: "relative", width: w, height: H + (small ? 140 : 170) * s, opacity: clamp01(appear * 1.5), scale: String(0.9 + 0.1 * appear) }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: w, height: H, borderRadius: 16 * s, overflow: "hidden", boxShadow: `0 26px 56px ${CL.shadow}`, border: `${8 * s}px solid ${CL.white}`, ...plaster() }}>
        <Mold n={small ? 40 : 70} x={fx - 60 * s} y={fy - 40 * s} w={F + 120 * s} h={F + 80 * s} seed={7} k={0.85} />
        {/* mancha mojada de la pared (sólo si el agua viene de adentro), visible bajo el aluminio levantado */}
        {result === "wall" ? <div style={{ position: "absolute", left: fx, top: fy, width: F, height: F, background: `rgba(70,90,80,${0.55 * peel})`, borderRadius: 6 }} /> : null}
        {/* el cuadrado de aluminio: se pega, la cinta por los 4 lados, después se despega doblándose hacia abajo */}
        <div style={{ position: "absolute", left: fx, top: fy, width: F, height: F, transformOrigin: "50% 100%", transform: `perspective(${900 * s}px) rotateX(${-peel * 72}deg)`, background: "linear-gradient(135deg, #F4F5F7 0%, #B9BDC4 35%, #EEF0F2 55%, #A5AAB2 80%, #E5E7EA 100%)", boxShadow: `0 ${6 * s}px ${14 * s}px rgba(0,0,0,0.25)` }}>
          {/* gotas del lado de la casa (frente del aluminio) */}
          {result === "out" ? Array.from({ length: 34 }, (_, i) => <div key={i} style={{ position: "absolute", left: rnd(i + 3) * (F - 20 * s), top: rnd(i + 9) * (F - 20 * s), width: (8 + rnd(i) * 14) * s, height: (10 + rnd(i) * 16) * s, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.95), rgba(140,175,205,0.75))", opacity: clamp01(clock * 1.4) }} />) : null}
          {/* cinta por los 4 lados */}
          {[[0, -10, F, 26], [0, F - 16, F, 26], [-10, 0, 26, F], [F - 16, 0, 26, F]].map(([x, y, ww, hh], i) => <div key={i} style={{ position: "absolute", left: x * 1, top: y * 1, width: ww * clamp01(tape * 1.3 - i * 0.1), height: hh, background: "rgba(214,190,120,0.75)", boxShadow: "inset 0 0 0 1px rgba(150,120,50,0.4)" }} />)}
        </div>
        {/* reloj 48 h */}
        <div style={{ position: "absolute", right: 22 * s, top: 18 * s, width: 120 * s, height: 120 * s, borderRadius: "50%", background: CL.white, boxShadow: `0 8px 18px ${CL.shadow}`, opacity: lin(f, t0 + 18, t0 + 24) * (1 - peel) }}>
          <svg viewBox="0 0 120 120" width={120 * s} height={120 * s}><circle cx={60} cy={60} r={52} fill="none" stroke={CL.navySoft} strokeWidth={10} /><circle cx={60} cy={60} r={52} fill="none" stroke={CL.nitrile} strokeWidth={10} strokeDasharray={327} strokeDashoffset={327 * (1 - clock)} transform="rotate(-90 60 60)" strokeLinecap="round" /><text x={60} y={70} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={30} fill={CL.ink}>{Math.round(48 * clock)} h</text></svg>
        </div>
        {/* gotas en la pared (agua de adentro) */}
        {result === "wall" ? Array.from({ length: 16 }, (_, i) => <div key={i} style={{ position: "absolute", left: fx + rnd(i + 30) * F, top: fy + rnd(i + 40) * F, width: 10 * s, height: 14 * s, borderRadius: "50%", background: "rgba(150,190,220,0.9)", opacity: drops }} />) : null}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: H + 18 * s, textAlign: "center", opacity: drops }}>
        <div style={{ display: "inline-block", background: result === "out" ? CL.nitrile : result === "wall" ? CL.red : CL.navy, color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: (small ? 30 : 44) * (small ? 1.6 : 1) * s, letterSpacing: 2, padding: `${6 * s}px ${22 * s}px`, borderRadius: 10 * s }}>{lab[0]}</div>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: (small ? 34 : 54) * (small ? 1.6 : 1) * s, color: CL.ink, marginTop: 4 * s }}>{lab[1]}</div>
      </div>
    </div>
  );
};
export const ClFoilTest: React.FC<{ result?: "out" | "wall" | "dry" | "all"; bed?: string; title?: string }> = ({ result = "out", bed, title = "30 x 30 cm · 48 horas" }) => {
  const f = useCurrentFrame(); const out = useOut(6);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={71} dim={0.34} />
      <Contact x={960} y={940} w={1300} o={0.32} />
      {result === "all" ? (
        <div style={{ position: "absolute", left: 960, top: 520, translate: "-50% -50%", display: "flex", gap: 40 }}>
          {(["out", "wall", "dry"] as const).map((r, i) => <FoilPanel key={r} result={r} t0={4 + i * 10} w={540} small />)}
        </div>
      ) : (
        <div style={{ position: "absolute", left: 960, top: 500, translate: "-50% -50%" }}><FoilPanel result={result} t0={4} w={820} /></div>
      )}
      <div style={{ position: "absolute", left: 110, top: 60, opacity: lin(f, 4, 12) }}><Badge text={title} /></div>
      <RoomLight k={0.35} />
    </AbsoluteFill>
  );
};

// ───────────────── ClHouseMap — plano de la casa de Doña Marta (el hilo de la serie)
type Room = { k: string; label: string; x: number; y: number; w: number; h: number; up?: boolean };
const ROOMS: Room[] = [
  { k: "dormitorio", label: "Dormitorio", x: 0, y: 0, w: 380, h: 300 },
  { k: "ropero", label: "Ropero", x: 0, y: 300, w: 380, h: 170 },
  { k: "sala", label: "Sala", x: 380, y: 0, w: 420, h: 300 },
  { k: "pared", label: "Pared del zócalo", x: 380, y: 300, w: 420, h: 170 },
  { k: "cocina", label: "Cocina", x: 800, y: 0, w: 320, h: 470 },
  { k: "arriba", label: "Cuarto de arriba", x: 380, y: -250, w: 420, h: 230, up: true },
  { k: "techo", label: "Techo", x: 820, y: -250, w: 300, h: 230, up: true },
  { k: "grieta", label: "Pasillo", x: 0, y: -250, w: 380, h: 230, up: true },
];
export const ClHouseMap: React.FC<{ done?: string[]; now?: string; next?: string; bed?: string; title?: string }> = ({ done = [], now, next, bed, title = "La casa de Doña Marta" }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 2, 15);
  const X = 400, Y = 530;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={81} dim={0.4} />
      <div style={{ position: "absolute", left: 300, top: 60, width: 1320, height: 960, translate: `0 ${(1 - p) * 80}px`, transform: "perspective(1800px) rotateX(10deg)", opacity: clamp01(p * 1.4) }}>
        {/* papel de plano azul claro con cuadrícula */}
        <div style={{ position: "absolute", inset: 0, borderRadius: 10, background: "#F4EFE3", backgroundImage: "linear-gradient(rgba(60,90,140,0.12) 2px, transparent 2px), linear-gradient(90deg, rgba(60,90,140,0.12) 2px, transparent 2px)", backgroundSize: "40px 40px", boxShadow: `0 40px 80px ${CL.shadow}` }} />
        <div style={{ position: "absolute", left: 40, top: 24, fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: CL.ink }}>{title}</div>
        {ROOMS.map((r, i) => {
          const isDone = done.includes(r.k), isNow = now === r.k, isNext = next === r.k;
          const k = lin(f, 8 + i * 3, 18 + i * 3);
          const pulse = isNow ? 0.5 + 0.5 * Math.sin(f * 0.22) : 0;
          const nk = isNext ? lin(f, T * 0.45, T * 0.55) : 0;
          return (
            <div key={r.k} style={{ position: "absolute", left: X - 300 + r.x, top: Y - 60 + r.y, width: r.w, height: r.h, border: `8px solid ${CL.ink}`, marginLeft: -4, marginTop: -4, opacity: k, background: isNow ? hexA(CL.red, 0.18 + 0.2 * pulse) : isDone ? hexA("#5FA35A", 0.22) : isNext ? hexA(CL.yellow, 0.35 * nk) : "transparent", borderStyle: r.up ? "dashed" : "solid" }}>
              <div style={{ position: "absolute", left: 18, top: 10, fontFamily: HAND, fontWeight: 700, fontSize: 46, color: CL.ink }}>{r.label}</div>
              {isDone ? <svg width={90} height={80} style={{ position: "absolute", right: 14, bottom: 10 }}><path d="M10 42 L34 66 L82 10" fill="none" stroke="#3E8A3A" strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" /></svg> : null}
              {isNow ? <div style={{ position: "absolute", right: 14, bottom: 12, background: CL.red, color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: 34, padding: "4px 16px", borderRadius: 8, letterSpacing: 2, scale: String(1 + 0.06 * pulse) }}>HOY</div> : null}
              {isNext ? <div style={{ position: "absolute", left: "50%", top: "55%", translate: "-50% -50%", fontFamily: SERIF, fontWeight: 900, fontSize: 130, color: CL.ink, opacity: nk, scale: String(0.6 + 0.4 * nk) }}>?</div> : null}
            </div>
          );
        })}
        <div style={{ position: "absolute", right: 40, top: 34, fontFamily: LABEL, fontWeight: 600, fontSize: 30, letterSpacing: 3, color: CL.inkSoft }}>PLANTA ALTA · - - -</div>
      </div>
      <RoomLight k={0.35} />
    </AbsoluteFill>
  );
};

// ───────────────── ClWardrobeGap — vista de arriba: el mueble pegado vs. a 5 cm
export const ClWardrobeGap: React.FC<{ bed?: string; label?: string }> = ({ bed, label = "5 cm" }) => {
  const f = useCurrentFrame(); const { durationInFrames: T } = useVideoConfig(); const out = useOut(6);
  const move = ease(clamp01((f - T * 0.42) / (T * 0.16)));
  const air = clamp01((f - T * 0.6) / (T * 0.3));
  const WX = 340, WY = 250, WW = 1240; // pared (arriba)
  const gap = 90 * move;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={91} dim={0.42} />
      <Contact x={960} y={900} w={1300} o={0.3} />
      {/* pared de afuera, fría */}
      <div style={{ position: "absolute", left: WX, top: WY - 110, width: WW, height: 110, background: "repeating-linear-gradient(90deg, #B5643E 0 120px, #D9C9B4 120px 128px)", borderBottom: "14px solid #CFE3D6", boxShadow: `0 10px 30px ${CL.shadow}` }} />
      <div style={{ position: "absolute", left: WX + 20, top: WY - 170, fontFamily: LABEL, fontWeight: 700, fontSize: 40, letterSpacing: 3, color: "#fff", background: "#4C7FB0", padding: "4px 18px", borderRadius: 8 }}>PARED DE AFUERA · FRÍA</div>
      {/* moho sobre la pared mientras el mueble está pegado; se va cuando pasa el aire */}
      <div style={{ position: "absolute", left: WX + 300, top: WY - 14, width: 640, height: 14, background: `rgba(26,28,20,${0.9 * (1 - air)})` }} />
      {/* gotas */}
      {Array.from({ length: 14 }, (_, i) => <div key={i} style={{ position: "absolute", left: WX + 320 + i * 44, top: WY + 2 + (i % 3) * 8, width: 14, height: 18, borderRadius: "50%", background: "rgba(140,180,215,0.9)", opacity: (1 - air) * lin(f, 6 + i, 14 + i) }} />)}
      {/* el ropero (vista de arriba, madera) */}
      <div style={{ position: "absolute", left: WX + 300, top: WY + gap, width: 640, height: 300, borderRadius: 10, background: "linear-gradient(90deg, #5A3A22, #7A5232 40%, #5E3D24)", boxShadow: `0 30px 50px ${CL.shadow}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 80, color: "#F5E6CF" }}>Ropero</div>
      </div>
      {/* aire quieto (antes) / aire que pasa (después) */}
      {Array.from({ length: 5 }, (_, i) => {
        const t = ((f * 0.02 + i / 5) % 1);
        return <div key={i} style={{ position: "absolute", left: WX + 220 + t * 820, top: WY + gap / 2 - 10, width: 70, height: 14, borderRadius: 7, background: hexA(CL.nitrile, 0.85), opacity: air * Math.sin(Math.PI * t) }} />;
      })}
      <div style={{ position: "absolute", left: WX + 960, top: WY + 140, opacity: lin(f, 10, 18) * (1 - move), fontFamily: HAND, fontWeight: 700, fontSize: 58, color: CL.red }}>aire quieto · pared mojada</div>
      {/* cinta métrica que marca los 5 cm */}
      <div style={{ position: "absolute", left: WX + 960, top: WY - 4, height: gap + 8, width: 46, background: CL.yellow, border: "3px solid #9A7A12", opacity: move, backgroundImage: "repeating-linear-gradient(180deg, #222 0 3px, transparent 3px 18px)" }} />
      <div style={{ position: "absolute", left: WX + 1030, top: WY + gap / 2 - 50, opacity: move }}><Badge text={label} color={CL.navy} style={{ fontSize: 64 }} /></div>
      <div style={{ position: "absolute", left: WX + 960, top: WY + 200, opacity: air, fontFamily: HAND, fontWeight: 700, fontSize: 58, color: "#3E8A3A" }}>el aire pasa · la pared se seca</div>
      <RoomLight k={0.35} />
    </AbsoluteFill>
  );
};

// ───────────────── ClTapeTest — la prueba de la cinta de embalar
export const ClTapeTest: React.FC<{ result?: "clean" | "paint" | "salt"; bed?: string }> = ({ result = "paint", bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 2, 14);
  const stick = clamp01((f - 8) / 12), rub = clamp01((f - 22) / 18), rip = ease(clamp01((f - 44) / 8));
  const shake = f >= 44 && f < 54 ? Math.sin((f - 44) * 2.4) * (54 - f) : 0;
  const W = 900, H = 560, TX = 210, TW = 480, TY = 230;
  const what = result === "clean" ? ["LA CINTA SALIÓ LIMPIA", "puede pintar encima"] : result === "paint" ? ["SALIÓ CON PINTURA", "no pinte encima"] : ["POLVITO BLANCO, SALADO", "salitre: humedad que sube"];
  const residue = result === "paint" ? "#E9E6DC" : result === "salt" ? "#FFFFFF" : "transparent";
  return (
    <AbsoluteFill style={{ opacity: out, translate: `${shake}px 0` }}>
      <Bed src={bed} seed={101} dim={0.36} />
      <Contact x={960} y={880} w={1000} o={0.3} />
      <div style={{ position: "absolute", left: 960, top: 480, translate: "-50% -50%", scale: String(0.9 + 0.1 * p), opacity: clamp01(p * 1.4) }}>
        <div style={{ position: "relative", width: W, height: H, borderRadius: 16, overflow: "hidden", boxShadow: `0 26px 56px ${CL.shadow}`, border: `8px solid ${CL.white}`, ...plaster("#E7E3D6") }}>
          {/* hueco que deja la cinta al arrancar (pintura de abajo / ladrillo) */}
          {result !== "clean" ? <div style={{ position: "absolute", left: TX, top: TY, width: TW, height: 90, opacity: rip, background: result === "paint" ? "linear-gradient(180deg, #B5643E 0 30%, #8E9A93 30% 50%, #F2EEE4 50% 70%, #A9B9AE 70% 100%)" : "#9C8F7A", border: "4px solid rgba(0,0,0,0.25)", backgroundImage: result === "salt" ? "radial-gradient(circle, rgba(255,255,255,0.95) 2px, transparent 3px)" : undefined, backgroundSize: result === "salt" ? "14px 14px" : undefined }} /> : null}
          {/* la cinta */}
          <div style={{ position: "absolute", left: TX, top: TY - rip * 320, width: TW * stick, height: 90, rotate: `${-rip * 18}deg`, transformOrigin: "100% 50%", background: "rgba(214,190,120,0.82)", boxShadow: "0 4px 10px rgba(0,0,0,0.18)" }}>
            {result !== "clean" ? <div style={{ position: "absolute", inset: 6, background: residue, opacity: rip * 0.95, backgroundImage: result === "salt" ? "radial-gradient(circle, #fff 2px, transparent 3px)" : undefined, backgroundSize: "12px 12px" }} /> : null}
          </div>
          {/* la uña que frota */}
          <div style={{ position: "absolute", left: TX + 40 + rub * (TW - 120), top: TY + 10, width: 70, height: 70, borderRadius: "50% 50% 40% 40%", background: "#E2B48F", opacity: rub > 0 && rub < 1 ? 1 : 0, boxShadow: "0 8px 14px rgba(0,0,0,0.25)" }} />
        </div>
        <div style={{ textAlign: "center", marginTop: 22, opacity: lin(f, 54, 62) }}>
          <Badge text={what[0]} color={result === "clean" ? "#3E8A3A" : CL.red} style={{ display: "inline-block" }} />
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 64, color: CL.ink, marginTop: 6 }}>{what[1]}</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 110, top: 60, opacity: lin(f, 4, 12) }}><Badge text="La prueba de $0 · 5 segundos" color={CL.navy} /></div>
      <RoomLight k={0.35} />
    </AbsoluteFill>
  );
};
