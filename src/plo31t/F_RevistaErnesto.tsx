import React from "react";
import { AbsoluteFill, staticFile, Img } from "remotion";
import { Shot, Stage, BgCtx, at } from "./base";
import { FONT, COL, s, e, ei, spr, extrude, Flash } from "./lib";
import { Casa, ROOM, PT, camPath, screenOf, CKey, V3 } from "./casa";
import { Linterna, orbit } from "./mesa3d";

type Punto = "cabinet" | "basin" | "toilet" | "washer" | "tub" | "stack";

const PT_MAP: Record<Punto, [number, number, number]> = {
  cabinet: PT.cabinet,
  basin: PT.basin,
  toilet: PT.toilet,
  washer: PT.washer,
  tub: PT.tub,
  stack: PT.stack,
};

const FOCUS_MAP: Record<Punto, any> = {
  cabinet: "cabinet",
  basin: "basin",
  toilet: "toilet",
  washer: "laundry",
  tub: "tub",
  stack: "stack",
};

const DEFAULT_PUNTOS: { pt: Punto; label: string }[] = [
  { pt: "cabinet", label: "MUEBLE COCINA" },
  { pt: "basin", label: "LAVAMANOS" },
  { pt: "toilet", label: "INODORO" },
  { pt: "washer", label: "LAVADORA" },
  { pt: "tub", label: "BAÑERA" },
  { pt: "stack", label: "TINACO" },
];

const GREEN = "#3ddc84";

const Check: React.FC<{ t: number; at: number; x: number; y: number; label: string; out: number }> = ({ t, at, x, y, label, out }) => {
  if (t < at - 0.02) return null;
  const k = spr(t, at, 1.15);
  const fade = 1 - e(t, out - 0.5, out + 0.1);
  if (fade <= 0) return null;
  const sc = Math.min(1.2, k);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${sc})`, opacity: fade, filter: `drop-shadow(0 0 ${18 * (1 - Math.min(1, k)) + 6}px ${GREEN})` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(8,20,14,0.82)", border: `2px solid ${GREEN}`, borderRadius: 40, padding: "8px 18px 8px 10px", boxShadow: `0 8px 24px rgba(0,0,0,.5), 0 0 22px ${GREEN}66` }}>
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: GREEN, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 14px ${GREEN}` }}>
          <svg width="20" height="20" viewBox="0 0 24 24"><path d="M4 12 L10 18 L20 6" stroke="#062014" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 22, color: "#eafff2", letterSpacing: 1.5, textShadow: "0 2px 6px rgba(0,0,0,.8)" }}>{label}</div>
      </div>
    </div>
  );
};

const Crono: React.FC<{ t: number; at: number; out: number; minutos: number; veces: number; prog: number }> = ({ t, at, out, minutos, veces, prog }) => {
  const fade = 1 - e(t, out - 0.5, out + 0.1);
  if (fade <= 0) return null;
  const enter = spr(t, at, 1.1);
  const ang = prog * 360;
  const R = 78;
  const cx = 100, cy = 100;
  const rad = (ang - 90) * Math.PI / 180;
  const px = cx + R * Math.cos(rad), py = cy + R * Math.sin(rad);
  const big = ang > 180 ? 1 : 0;
  const arcPath = `M ${cx} ${cy - R} A ${R} ${R} 0 ${big} 1 ${px} ${py}`;
  return (
    <div style={{ position: "absolute", right: 60, top: 60, opacity: fade, transform: `scale(${Math.min(1.05, enter)})`, transformOrigin: "top right" }}>
      <div style={{ background: "rgba(10,16,26,0.82)", border: "2px solid rgba(255,216,74,0.55)", borderRadius: 24, padding: 18, boxShadow: "0 12px 40px rgba(0,0,0,.6)", backdropFilter: "blur(10px)" }}>
        <svg width={200} height={200} viewBox="0 0 200 200">
          <circle cx={cx} cy={cy} r={R} fill="rgba(0,0,0,0.35)" stroke="rgba(255,255,255,0.15)" strokeWidth={3} />
          {Array.from({ length: 60 }).map((_, i) => {
            const a = (i / 60) * Math.PI * 2 - Math.PI / 2;
            const r1 = i % 5 === 0 ? R - 14 : R - 7;
            return <line key={i} x1={cx + r1 * Math.cos(a)} y1={cy + r1 * Math.sin(a)} x2={cx + (R - 3) * Math.cos(a)} y2={cy + (R - 3) * Math.sin(a)} stroke="rgba(255,255,255,0.35)" strokeWidth={i % 5 === 0 ? 2 : 1} />;
          })}
          {ang > 1 && <path d={arcPath} stroke="#ffd84a" strokeWidth={6} fill="none" strokeLinecap="round" style={{ filter: "drop-shadow(0 0 6px #ffd84a)" }} />}
          <line x1={cx} y1={cy} x2={px} y2={py} stroke="#ff4a3d" strokeWidth={4} strokeLinecap="round" style={{ filter: "drop-shadow(0 0 4px #ff4a3d)" }} />
          <circle cx={cx} cy={cy} r={7} fill="#ff4a3d" />
        </svg>
        <div style={{ textAlign: "center", fontFamily: FONT, fontWeight: 900, color: "#fff", marginTop: -8 }}>
          <div style={{ fontSize: 40, letterSpacing: -1 }}>{minutos}<span style={{ fontSize: 20, color: "#ffd84a" }}> MIN</span></div>
          <div style={{ fontSize: 18, color: "#ffd84a", letterSpacing: 3, marginTop: 2 }}>× {veces} AL AÑO</div>
        </div>
      </div>
    </div>
  );
};

const Contador: React.FC<{ t: number; at: number; out: number; n: number; total: number }> = ({ t, at, out, n, total }) => {
  const fade = 1 - e(t, out - 0.5, out + 0.1);
  if (fade <= 0) return null;
  const enter = spr(t, at, 1.1);
  const pulse = n === total ? 1 + 0.08 * Math.sin(Math.max(0, t - at) * 8) * (1 - e(t, at, at + 0.6)) : 1;
  return (
    <div style={{ position: "absolute", left: 60, top: 60, opacity: fade, transform: `scale(${Math.min(1.05, enter) * pulse})`, transformOrigin: "top left" }}>
      <div style={{ background: "rgba(10,16,26,0.82)", border: `2px solid ${n === total ? GREEN : "rgba(255,255,255,0.2)"}`, borderRadius: 20, padding: "14px 26px", boxShadow: n === total ? `0 0 30px ${GREEN}88` : "0 12px 40px rgba(0,0,0,.6)", backdropFilter: "blur(10px)" }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 16, color: "#9fb3c8", letterSpacing: 4 }}>PUNTOS REVISADOS</div>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 92, lineHeight: 1, color: n === total ? GREEN : "#fff", textShadow: extrude(4, "rgba(0,0,0,.6)"), letterSpacing: -2 }}>
          {n}<span style={{ fontSize: 44, color: "#9fb3c8" }}>/{total}</span>
        </div>
      </div>
    </div>
  );
};

export const RevistaErnesto: React.FC<{
  t: number;
  at: number;
  out: number;
  clave: number;
  bg?: string;
  puntos?: { pt: Punto; label: string }[];
  minutos?: number;
  veces?: number;
}> = ({ t, at, out, clave, bg = "v015_truco15", puntos = DEFAULT_PUNTOS, minutos = 15, veces = 4 }) => {
  const N = puntos.length;
  const barrido0 = at + 0.6;
  const paso = 1.2;
  const puntosAt = puntos.map((_, i) => barrido0 + 0.6 + i * paso);
  const lastCheck = puntosAt[N - 1];
  const cronoAt = clave;
  const prog = Math.min(1, Math.max(0, (t - cronoAt) / 3));
  const checkCount = puntosAt.filter((p) => t >= p).length;

  const cam = camPath([
    { t: at - 0.3, ...ROOM.wideHi },
    { t: at + 1.5, ...ROOM.cabinet, arc: 0.4 },
    { t: at + 3.0, ...ROOM.basin },
    { t: at + 4.2, ...ROOM.toilet },
    { t: at + 5.4, ...ROOM.laundry },
    { t: at + 6.6, ...ROOM.tub },
    { t: at + 7.8, ...ROOM.stack },
    { t: out + 0.4, ...ROOM.wide },
  ] as CKey[])(t);

  const focus: any = (() => {
    for (let i = 0; i < N; i++) if (t >= puntosAt[i] - 0.1) return FOCUS_MAP[puntos[i].pt];
    return FOCUS_MAP[puntos[0].pt];
  })();
  const focusAmt = (() => {
    for (let i = 0; i < N; i++) if (t >= puntosAt[i] - 0.1 && t < puntosAt[i] + 0.9) return e(t, puntosAt[i] - 0.1, puntosAt[i] + 0.5);
    return 0.55;
  })();

  const plugs = [0, 0, 0, 0, 0].map((_, i) => (i < checkCount ? 1 : 0));

  return (
    <AbsoluteFill style={{ background: "#050a12" }}>
      <BgCtx.Provider value={bg}>
        <Stage t={t} a={at} b={out + 0.5} tint="#ffc890">
          <Casa
            t={t}
            cam={cam}
            ev={{
              build: e(t, at, at + 1.5),
              flow: 0.6,
              plugs,
              focus,
              focusAmt,
              glass: 0.4,
            }}
          />
          {/* linterna 3D barriendo: se dibuja en pantalla como mancha cálida que sigue el punto activo */}
          {(() => {
            const idx = Math.max(0, Math.min(N - 1, Math.floor((t - barrido0 - 0.6) / paso)));
            const q = screenOf(cam, PT_MAP[puntos[idx].pt]);
            const prev = idx > 0 ? screenOf(cam, PT_MAP[puntos[idx - 1].pt]) : q;
            const local = Math.min(1, Math.max(0, (t - (puntosAt[idx] - 0.6)) / 0.6));
            const x = prev.x + (q.x - prev.x) * local;
            const y = prev.y + (q.y - prev.y) * local;
            const vis = e(t, at + 0.6, at + 0.9) * (1 - e(t, out - 0.4, out));
            if (vis <= 0.01) return null;
            return (
              <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", opacity: vis, pointerEvents: "none" }}>
                <div style={{ width: 260, height: 260, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,225,170,0.55) 0%, rgba(255,200,120,0.22) 35%, rgba(255,180,90,0) 70%)`, filter: "blur(6px)" }} />
              </div>
            );
          })()}
          {/* calor residual de cada punto revisado */}
          {puntos.map((p, i) => {
            const tAt = puntosAt[i];
            if (t < tAt) return null;
            const q = screenOf(cam, PT_MAP[p.pt]);
            const life = 1 - e(t, tAt, tAt + 0.35);
            if (life <= 0.01) return null;
            return (
              <div key={i} style={{ position: "absolute", left: q.x, top: q.y, transform: "translate(-50%,-50%)", width: 180, height: 180, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,200,120,${0.5 * life}) 0%, rgba(255,170,80,0) 70%)`, filter: "blur(8px)" }} />
            );
          })}
          {/* checks anclados */}
          {puntos.map((p, i) => {
            const q = screenOf(cam, PT_MAP[p.pt]);
            return <Check key={i} t={t} at={puntosAt[i]} x={q.x + 40} y={q.y - 30} label={p.label} out={out} />;
          })}
          {/* flash final */}
          <Flash t={t} at={lastCheck + 0.05} peak={0.4} col={GREEN} w={900} />
        </Stage>
      </BgCtx.Provider>
      <Contador t={t} at={at + 0.6} out={out} n={checkCount} total={N} />
      <Crono t={t} at={cronoAt} out={out} minutos={minutos} veces={veces} prog={prog} />
    </AbsoluteFill>
  );
};

export const sfxRevistaErnesto = (at: number): [number, string, number?][] => [
  [at + 0.00, "whoosh"],
  [at + 0.60, "riser", -3],
  [at + 1.20, "pop", -4],
  [at + 1.80, "click", -2],
  [at + 2.40, "pop", -4],
  [at + 3.00, "click", -2],
  [at + 3.60, "pop", -4],
  [at + 4.20, "click", -2],
  [at + 4.80, "pop", -4],
  [at + 5.40, "click", -2],
  [at + 6.00, "pop", -4],
  [at + 6.60, "click", -2],
  [at + 7.20, "pop", -4],
  [at + 7.80, "ding", 0],
  [at + 7.90, "sparkle", -3],
];
