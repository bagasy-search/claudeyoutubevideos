// Don Ernesto, el Funerario (ES) · Ernie Navarro (EN) · MUNDO del canal (fe01, 26-oct). Piezas firma de la serie:
// la FICHA del panteón (lápida de cantera con el dato), el MAPA de Guadalajara / San Antonio con el panteón, el RECIBO / contrato
// con líneas tachadas, el CALENDARIO del refrendo, el CONTADOR de pesos/dólares, la FOTO vieja de Don Refugio (sepia en la foto,
// nunca filtro sobre el video), el CAPÍTULO «Número N» y la CITA de «mi papá decía». Paleta: cantera, cempasúchil, veladora.
// Todo con at/out del plan (frases de la voz). Sin filtros, grano ni viñeta. Textos en props → sirve igual para el canal EN.
import React from "react";
import { Img, staticFile } from "remotion";
import { loadFont as loadCinzel } from "@remotion/google-fonts/Cinzel";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadCaveat } from "@remotion/google-fonts/Caveat";
import { FONT, e, ei, extrude, spr } from "./lib";

export const { fontFamily: SERIF_GRAB } = loadCinzel("normal", { weights: ["600", "700", "900"], subsets: ["latin"] });
export const { fontFamily: SERIF } = loadPlayfair("normal", { weights: ["600", "800", "900"], subsets: ["latin"] });
export const { fontFamily: MANO } = loadCaveat("normal", { weights: ["600", "700"], subsets: ["latin"] });

export const FE = {
  ink: "#f6efe3", dim: "rgba(246,239,227,.72)", cantera: "#cdbfa6", cantera2: "#a8987c", piedra: "#2b2621",
  cempa: "#f0c24b", cempa2: "#ffdc7a", vela: "#ffd590", rojo: "#b8322a", tinta: "#1f2a44", papel: "#f4ecd9", sepia: "#9a7447", noche: "#0f0d0b",
};
const K = (k: number) => Math.min(1, k);
const vis = (t: number, at: number, out: number) => e(t, at, at + 0.18) * (1 - e(t, out, out + 0.35));
// parpadeo de veladora determinista (suma de senos, sin random)
export const flick = (t: number, seed = 0) => 0.82 + 0.1 * Math.sin(t * 7.3 + seed) + 0.06 * Math.sin(t * 13.1 + seed * 2) + 0.04 * Math.sin(t * 23.7 + seed * 3);

// ---------- 1. FICHA DEL PANTEÓN: lápida de cantera que sube con luz de veladora; el dato grabado ----------
export const Ficha: React.FC<{ t: number; at: number; out: number; kicker?: string; title: string; dato?: string; sub?: string; x?: number; y?: number; w?: number }> = ({ t, at, out, kicker, title, dato, sub, x = 1380, y = 560, w = 760 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = K(spr(t, at, 0.7)), f = flick(t, at), lt = ei(t, at + 0.35, at + 1.3);
  const h = w * 1.18;
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, opacity: o, perspective: 1800 }}>
      {/* resplandor de veladora en el piso */}
      <div style={{ position: "absolute", left: -w * 0.25, right: -w * 0.25, bottom: -h * 0.12, height: h * 0.4, background: `radial-gradient(ellipse at 50% 70%, rgba(255,190,90,${0.42 * f}), rgba(255,150,40,0) 65%)` }} />
      <div style={{ position: "absolute", inset: 0, transformOrigin: "50% 100%", transform: `rotateX(${(1 - k) * 32}deg) translateY(${(1 - k) * 90}px)` }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: `${w * 0.5}px ${w * 0.5}px 14px 14px`, overflow: "hidden",
          background: `linear-gradient(175deg, #ded3bf 0%, ${FE.cantera} 38%, ${FE.cantera2} 100%)`,
          boxShadow: `0 40px 90px rgba(0,0,0,.65), inset 0 0 0 10px rgba(255,255,255,.08), inset 0 -${h * 0.35}px ${h * 0.3}px rgba(60,40,20,.28)` }}>
          {/* vetas de la piedra (líneas finas, no grano) */}
          <svg width={w} height={h} style={{ position: "absolute", inset: 0, opacity: 0.18 }}>
            {[0.18, 0.31, 0.47, 0.62, 0.79].map((q, i) => <path key={i} d={`M0,${h * q} C${w * 0.3},${h * q - 18 + i * 6} ${w * 0.6},${h * q + 22 - i * 5} ${w},${h * q - 6}`} stroke="#5d4e38" strokeWidth={1.5} fill="none" />)}
          </svg>
          {/* luz cálida de abajo que parpadea */}
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(0deg, rgba(255,170,70,${0.3 * f}) 0%, rgba(255,170,70,0) 55%)`, mixBlendMode: "soft-light" }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: h * 0.13, textAlign: "center", color: "#3c3125" }}>
            <div style={{ fontFamily: SERIF_GRAB, fontWeight: 700, fontSize: w * 0.06, letterSpacing: w * 0.012, opacity: lt }}>✝</div>
            {kicker && <div style={{ fontFamily: SERIF_GRAB, fontWeight: 700, fontSize: w * 0.042, letterSpacing: w * 0.008, marginTop: 6, opacity: lt }}>{kicker}</div>}
            <div style={{ height: 3, width: w * 0.5 * lt, background: "#5d4e38", margin: `${w * 0.03}px auto`, opacity: 0.6 }} />
            <div style={{ fontFamily: SERIF_GRAB, fontWeight: 900, fontSize: w * 0.075, lineHeight: 1.12, padding: `0 ${w * 0.1}px`,
              textShadow: "0 -1px 0 rgba(0,0,0,.35), 0 1.5px 0 rgba(255,255,255,.45)", opacity: e(t, at + 0.5, at + 1.0) }}>{title}</div>
            {dato && <div style={{ fontFamily: SERIF_GRAB, fontWeight: 900, fontSize: w * 0.2, lineHeight: 1, marginTop: w * 0.05, color: "#2e251b",
              textShadow: "0 -2px 0 rgba(0,0,0,.4), 0 2px 0 rgba(255,255,255,.5)", transform: `scale(${0.9 + 0.1 * K(spr(t, at + 1.0, 0.9))})`, opacity: e(t, at + 0.95, at + 1.3) }}>{dato}</div>}
            {sub && <div style={{ fontFamily: SERIF, fontWeight: 600, fontStyle: "italic", fontSize: w * 0.05, marginTop: w * 0.05, padding: `0 ${w * 0.1}px`, opacity: e(t, at + 1.4, at + 1.8) }}>{sub}</div>}
          </div>
        </div>
        {/* cempasúchil al pie */}
        {[-0.38, -0.2, 0.22, 0.4].map((q, i) => <Cempa key={i} t={t} at={at + 0.6 + i * 0.12} x={w / 2 + q * w} y={h - 10} r={w * (0.055 + (i % 2) * 0.015)} />)}
      </div>
    </div>
  );
};

// flor de cempasúchil vectorial (pétalos en capas) que brota con resorte
export const Cempa: React.FC<{ t: number; at: number; x: number; y: number; r: number }> = ({ t, at, x, y, r }) => {
  const k = K(spr(t, at, 1.1)); if (k <= 0.01) return null;
  return (
    <svg width={r * 2.6} height={r * 2.6} style={{ position: "absolute", left: x - r * 1.3, top: y - r * 1.3, transform: `scale(${k}) rotate(${(1 - k) * 40}deg)` }} viewBox="-130 -130 260 260">
      {[0, 1, 2].map((L) => Array.from({ length: 14 }).map((_, i) => {
        const a = (i / 14) * Math.PI * 2 + L * 0.22, rr = 100 - L * 28;
        return <ellipse key={L + "_" + i} cx={Math.cos(a) * rr * 0.55} cy={Math.sin(a) * rr * 0.55} rx={rr * 0.42} ry={rr * 0.22} transform={`rotate(${(a * 180) / Math.PI} ${Math.cos(a) * rr * 0.55} ${Math.sin(a) * rr * 0.55})`}
          fill={["#e9800f", "#f39a1e", "#ffbb45"][L]} stroke="#b85e06" strokeWidth={2} />;
      }))}
      <circle r={18} fill="#c86a08" />
    </svg>
  );
};

// ---------- 2. MAPA: Guadalajara o San Antonio, con el panteón y la ruta ----------
const GDL: Record<string, [number, number, string]> = {
  catedral: [500, 470, "Catedral"], analco: [575, 575, "Analco"], mezquitan: [430, 300, "Panteón de Mezquitán"], belen: [520, 365, "Panteón de Belén"],
  sanjuan: [578, 478, "San Juan de Dios"], tlaquepaque: [650, 760, "Tlaquepaque"], zapopan: [230, 270, "Zapopan"], guadalajara: [720, 650, "Panteón de Guadalajara"],
};
const SAT: Record<string, [number, number, string]> = {
  downtown: [520, 470, "Downtown"], westside: [400, 500, "West Side"], sanfer1: [430, 560, "San Fernando #1"], sanfer2: [300, 470, "San Fernando #2"],
  guadalupe: [430, 505, "Guadalupe St"], zarzamora: [380, 590, "Zarzamora St"], market: [490, 470, "Market Square"],
  prospect: [380, 470, "Prospect Hill"], woodlawn: [370, 380, "Woodlawn Lake"], culebra: [300, 400, "Culebra Rd"], kelly: [330, 640, "Kelly Field"],
  eastside: [660, 470, "East Side"], southside: [520, 700, "South Side"], alamoheights: [590, 330, "Alamo Heights"], leonvalley: [200, 300, "Leon Valley"],
  medcenter: [330, 260, "Medical Center"], incarnate: [520, 350, "Incarnate Word"], bandera: [90, 160, "Bandera"], newbraunfels: [900, 120, "New Braunfels"],
};
export const Mapa: React.FC<{ t: number; at: number; out: number; city?: "gdl" | "sa"; pins: { at: number; l: string; tx?: string; col?: string }[]; route?: { at: number; from: string; to: string }; x?: number; y?: number; sc?: number; title?: string }> = ({ t, at, out, city = "gdl", pins, route, x = 960, y = 540, sc = 1, title }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = K(spr(t, at, 0.8)), L = city === "gdl" ? GDL : SAT;
  const draw = (a: number, d = 1.1) => K(e(t, a, a + d));
  const P = (n: string) => L[n] ?? Object.values(L)[0];
  const line = (pts: [number, number][], a: number, col: string, wdt: number) => {
    const d = pts.map((p, i) => (i ? "L" : "M") + p[0] + "," + p[1]).join(" ");
    let len = 0; for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    return <path d={d} stroke={col} strokeWidth={wdt} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={(1 - draw(a)) * len} />;
  };
  const roads = city === "gdl" ? <>
    <ellipse cx={500} cy={480} rx={410} ry={390} fill="none" stroke={FE.cempa} strokeWidth={9} opacity={0.75} strokeDasharray={2600} strokeDashoffset={(1 - draw(at + 0.1, 1.4)) * 2600} />
    {line([[560, 60], [558, 300], [555, 480], [560, 620], [600, 940]], at + 0.3, "#d8cdb8", 9)}
    {line([[430, 60], [432, 300], [440, 480], [450, 940]], at + 0.4, "#d8cdb8", 8)}
    {line([[80, 500], [300, 492], [500, 488], [760, 482], [940, 470]], at + 0.5, "#d8cdb8", 8)}
    {line([[575, 575], [650, 760]], at + 0.6, "#a99e8a", 5)}
    <text x={572} y={110} fill="#d8cdb8" fontSize={26} fontFamily={FONT} fontWeight={800} opacity={draw(at + 0.9)} transform="rotate(90 572 110)">CALZ. INDEPENDENCIA</text>
    <text x={400} y={120} fill="#d8cdb8" fontSize={26} fontFamily={FONT} fontWeight={800} opacity={draw(at + 0.9)} transform="rotate(90 400 120)">AV. FEDERALISMO</text>
    <text x={110} y={480} fill="#d8cdb8" fontSize={26} fontFamily={FONT} fontWeight={800} opacity={draw(at + 0.9)}>AV. VALLARTA · JUÁREZ</text>
    <text x={820} y={230} fill={FE.cempa} fontSize={26} fontFamily={FONT} fontWeight={800} opacity={draw(at + 0.9)}>PERIFÉRICO</text>
  </> : <>
    <ellipse cx={520} cy={480} rx={330} ry={300} fill="none" stroke={FE.cempa} strokeWidth={9} opacity={0.75} strokeDasharray={2100} strokeDashoffset={(1 - draw(at + 0.1, 1.4)) * 2100} />
    {line([[860, 120], [520, 470], [380, 900]], at + 0.3, "#d8cdb8", 9)}
    {line([[100, 250], [520, 470], [900, 760]], at + 0.4, "#d8cdb8", 9)}
    {line([[100, 520], [520, 470]], at + 0.5, "#a99e8a", 6)}
    <text x={810} y={150} fill="#d8cdb8" fontSize={28} fontFamily={FONT} fontWeight={800} opacity={draw(at + 0.9)}>I-35</text>
    <text x={110} y={240} fill="#d8cdb8" fontSize={28} fontFamily={FONT} fontWeight={800} opacity={draw(at + 0.9)}>I-10</text>
    <text x={800} y={300} fill={FE.cempa} fontSize={28} fontFamily={FONT} fontWeight={800} opacity={draw(at + 0.9)}>LOOP 410</text>
  </>;
  let rt: React.ReactNode = null;
  if (route && t >= route.at) {
    const [x1, y1] = P(route.from), [x2, y2] = P(route.to), q = K(e(t, route.at, route.at + 1.4)), mx = (x1 + x2) / 2, my = Math.min(y1, y2) - 110;
    const len = 1.3 * Math.hypot(x2 - x1, y2 - y1) + 200;
    rt = <path d={`M${x1},${y1} Q${mx},${my} ${x2},${y2}`} fill="none" stroke={FE.vela} strokeWidth={8} strokeLinecap="round" style={{ strokeDasharray: `${len * q} ${len}` }} />;
  }
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) perspective(1700px) rotateX(${20 - 12 * k}deg) scale(${sc * (0.82 + 0.18 * k)})` }}>
      <div style={{ width: 900, height: 900, borderRadius: 26, background: "radial-gradient(circle at 50% 45%, #2e2720, #15110e)", boxShadow: "0 50px 100px rgba(0,0,0,.6), inset 0 0 0 3px rgba(255,220,170,.10)", overflow: "hidden", position: "relative" }}>
        <svg viewBox="0 0 1000 1000" width={900} height={900} style={{ position: "absolute", inset: 0 }}>
          {Array.from({ length: 20 }).map((_, i) => <line key={"g" + i} x1={i * 50} y1={0} x2={i * 50} y2={1000} stroke="rgba(255,230,190,.045)" />)}
          {Array.from({ length: 20 }).map((_, i) => <line key={"h" + i} x1={0} y1={i * 50} x2={1000} y2={i * 50} stroke="rgba(255,230,190,.045)" />)}
          {roads}{rt}
        </svg>
        {pins.filter((p) => t >= p.at).map((p, i) => {
          const [px, py, nm] = P(p.l), q = K(spr(t, p.at, 1.1)), c = p.col ?? FE.cempa;
          return <div key={i} style={{ position: "absolute", left: px * 0.9, top: py * 0.9, transform: `translate(-50%,-100%) scale(${q})`, transformOrigin: "50% 100%" }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 30, color: FE.ink, background: "rgba(20,15,10,.88)", border: `3px solid ${c}`, borderRadius: 12, padding: "6px 14px", whiteSpace: "nowrap", marginBottom: 8 }}>{p.tx ?? nm}</div>
            <div style={{ width: 26, height: 26, borderRadius: 13, background: c, margin: "0 auto", boxShadow: `0 0 0 ${8 + 6 * Math.sin(t * 5)}px ${c}44` }} />
          </div>;
        })}
        <div style={{ position: "absolute", left: 32, top: 26, fontFamily: SERIF, fontWeight: 900, fontSize: 40, color: FE.cempa2, letterSpacing: 1 }}>{title ?? (city === "gdl" ? "Guadalajara, Jalisco" : "San Antonio, Texas")}</div>
      </div>
    </div>
  );
};

// ---------- 3. RECIBO / CONTRATO con renglones tachados en rojo (pluma) y sello ----------
export const Recibo: React.FC<{ t: number; at: number; out: number; title: string; folio?: string; rows: { at: number; tx: string; v?: string; tacha?: number; ok?: number }[]; total?: { at: number; tx: string; v: string }; sello?: { at: number; tx: string }; x?: number; y?: number; w?: number; rot?: number }> = ({ t, at, out, title, folio, rows, total, sello, x = 1340, y = 540, w = 820, rot = -2.5 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = K(spr(t, at, 0.8));
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - 330, width: w, opacity: o, transform: `perspective(1600px) rotateX(${(1 - k) * 25}deg) rotate(${rot + (1 - k) * -6}deg) translateY(${(1 - k) * 120}px)` }}>
      <div style={{ background: `linear-gradient(180deg, ${FE.papel}, #e9dfc6)`, borderRadius: 6, padding: "44px 56px 50px", boxShadow: "0 40px 90px rgba(0,0,0,.6), 0 2px 0 rgba(255,255,255,.6) inset", position: "relative", color: FE.tinta }}>
        <div style={{ borderBottom: `3px double ${FE.tinta}`, paddingBottom: 14 }}>
          {folio && <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 24, letterSpacing: 2, color: FE.rojo, marginBottom: 6 }}>{folio}</div>}
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 46, lineHeight: 1.1 }}>{title}</div>
        </div>
        {rows.map((r, i) => {
          const ro = e(t, r.at, r.at + 0.25), tq = r.tacha ? ei(t, r.tacha, r.tacha + 0.45) : 0, okq = r.ok ? K(spr(t, r.ok, 1)) : 0;
          return <div key={i} style={{ position: "relative", display: "flex", justifyContent: "space-between", fontFamily: FONT, fontWeight: 700, fontSize: 34, padding: "16px 0", borderBottom: "1.5px dashed rgba(31,42,68,.25)", opacity: ro, transform: `translateX(${(1 - ro) * 30}px)` }}>
            <span style={{ opacity: tq > 0.5 ? 0.55 : 1 }}>{r.tx}</span><span style={{ fontWeight: 900, opacity: tq > 0.5 ? 0.55 : 1 }}>{r.v ?? ""}</span>
            {tq > 0 && <svg width={w - 112} height={40} style={{ position: "absolute", left: -6, top: 20, overflow: "visible" }}>
              <path d={`M0,22 C${(w - 112) * 0.3},10 ${(w - 112) * 0.6},30 ${(w - 112) * tq},16`} stroke={FE.rojo} strokeWidth={6} fill="none" strokeLinecap="round" /></svg>}
            {okq > 0 && <div style={{ position: "absolute", right: 150, top: 0, fontFamily: MANO, fontSize: 60, color: "#1f7a3a", transform: `scale(${okq})` }}>✓</div>}
          </div>;
        })}
        {total && <div style={{ display: "flex", justifyContent: "space-between", fontFamily: SERIF, fontWeight: 900, fontSize: 48, marginTop: 22, opacity: e(t, total.at, total.at + 0.3) }}>
          <span>{total.tx}</span><span style={{ color: FE.rojo }}>{total.v}</span></div>}
        {sello && t >= sello.at && <div style={{ position: "absolute", left: 300, bottom: 30, transform: `rotate(-12deg) scale(${1.6 - 0.6 * K(spr(t, sello.at, 1.3))})`, opacity: e(t, sello.at, sello.at + 0.08) * 0.85,
          border: `6px solid ${FE.rojo}`, borderRadius: 14, padding: "10px 26px", fontFamily: FONT, fontWeight: 900, fontSize: 52, letterSpacing: 4, color: FE.rojo }}>{sello.tx}</div>}
      </div>
    </div>
  );
};

// ---------- 4. CALENDARIO DEL REFRENDO: los años pasan en fichas, el último se encierra en rojo ----------
export const Refrendo: React.FC<{ t: number; at: number; out: number; from: number; years: number; venceAt?: number; title?: string; label?: string; x?: number; y?: number }> = ({ t, at, out, from, years, venceAt, title = "Fosa temporal", label = "VENCE · REFRENDO", x = 960, y = 560 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = K(spr(t, at, 0.8)), n = years + 1, run = venceAt ? venceAt - at - 0.6 : 2.6;
  const lit = Math.floor(e(t, at + 0.5, at + 0.5 + Math.max(1, run)) * n + 0.0001);
  const tw = Math.min(150, 1500 / n);
  const vq = venceAt ? K(spr(t, venceAt, 1)) : 0;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.85 + 0.15 * k})`, textAlign: "center" }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: FE.ink, textShadow: "0 6px 30px rgba(0,0,0,.7)", marginBottom: 30 }}>{title}</div>
      <div style={{ display: "flex", gap: 14, justifyContent: "center" }}>
        {Array.from({ length: n }).map((_, i) => {
          const on = i < lit, last = i === n - 1, q = on ? K(spr(t, at + 0.5 + (i / n) * Math.max(1, run), 1.2)) : 0;
          return <div key={i} style={{ width: tw, borderRadius: 10, overflow: "hidden", boxShadow: "0 14px 30px rgba(0,0,0,.5)", transform: `translateY(${(1 - q) * 24}px)`, opacity: 0.35 + 0.65 * q, position: "relative" }}>
            <div style={{ background: last ? FE.rojo : FE.cempa, height: tw * 0.26, fontFamily: FONT, fontWeight: 900, fontSize: tw * 0.15, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>{last ? "NOV" : "AÑO"}</div>
            <div style={{ background: FE.papel, height: tw * 0.7, fontFamily: SERIF, fontWeight: 900, fontSize: tw * 0.3, color: FE.tinta, display: "flex", alignItems: "center", justifyContent: "center" }}>{from + i}</div>
            {last && vq > 0 && <svg width={tw + 40} height={tw + 40} style={{ position: "absolute", left: -20, top: -12, overflow: "visible" }}>
              <ellipse cx={(tw + 40) / 2} cy={(tw + 40) / 2} rx={tw * 0.62} ry={tw * 0.58} fill="none" stroke={FE.rojo} strokeWidth={7} strokeDasharray={600} strokeDashoffset={600 * (1 - ei(t, venceAt!, venceAt! + 0.6))} strokeLinecap="round" /></svg>}
          </div>;
        })}
      </div>
      {venceAt && <div style={{ marginTop: 40, display: "inline-block", fontFamily: FONT, fontWeight: 900, fontSize: 46, letterSpacing: 4, color: "#fff", background: FE.rojo, padding: "12px 34px", borderRadius: 12, transform: `scale(${vq})`, boxShadow: "0 16px 40px rgba(0,0,0,.5)" }}>{label}</div>}
    </div>
  );
};

// ---------- 5. CONTADOR de pesos / dólares en una etiqueta de papel colgada ----------
export const Cuenta: React.FC<{ t: number; at: number; out: number; from?: number; to: number; dur?: number; pre?: string; suf?: string; sub?: string; x?: number; y?: number; size?: number; col?: string }> = ({ t, at, out, from = 0, to, dur = 1.6, pre = "$", suf = "", sub, x = 960, y = 520, size = 200, col = FE.ink }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = K(spr(t, at, 0.8)), q = ei(t, at + 0.15, at + 0.15 + dur), v = Math.round(from + (to - from) * q);
  const sw = Math.sin((t - at) * 2.2) * 2.5 * (1 - e(t, at, at + 3));
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${sw}deg) scale(${0.8 + 0.2 * k})`, textAlign: "center" }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: size, color: col, lineHeight: 1, textShadow: extrude(10, "#5a3a10") }}>{pre}{v.toLocaleString("es-MX")}{suf}</div>
      {sub && <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size * 0.2, color: FE.cempa2, marginTop: 18, letterSpacing: 2, opacity: e(t, at + 0.6, at + 1) }}>{sub}</div>}
    </div>
  );
};

// ---------- 6. FOTO VIEJA de Don Refugio (sepia EN LA FOTO): cae sobre el escritorio con borde blanco y pie a mano ----------
export const FotoVieja: React.FC<{ t: number; at: number; out: number; src: string; pie: string; x?: number; y?: number; w?: number; rot?: number }> = ({ t, at, out, src, pie, x = 1350, y = 520, w = 640, rot = 4 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = K(spr(t, at, 0.75)), z = 1 + 0.05 * e(t, at, at + 8);
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - w * 0.62, width: w, opacity: o, transform: `perspective(1500px) rotateX(${(1 - k) * 35}deg) rotate(${rot - (1 - k) * 14}deg) translateY(${(1 - k) * -160}px)` }}>
      <div style={{ background: "#efe6d2", padding: `${w * 0.045}px ${w * 0.045}px ${w * 0.16}px`, boxShadow: "0 36px 80px rgba(0,0,0,.65)", borderRadius: 4, position: "relative" }}>
        <div style={{ overflow: "hidden", height: w * 0.82 }}>
          <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "sepia(0.85) contrast(0.92) brightness(1.02)", transform: `scale(${z})` }} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: w * 0.035, textAlign: "center", fontFamily: MANO, fontWeight: 700, fontSize: w * 0.075, color: "#3a2f22", opacity: e(t, at + 0.7, at + 1.2) }}>{pie}</div>
        {[[-1, -1], [1, -1]].map(([sx], i) => <div key={i} style={{ position: "absolute", top: -14, left: sx < 0 ? 30 : undefined, right: sx > 0 ? 30 : undefined, width: 110, height: 36, background: "rgba(235,225,195,.75)", transform: `rotate(${sx * 8}deg)`, boxShadow: "0 2px 6px rgba(0,0,0,.25)" }} />)}
      </div>
    </div>
  );
};

// ---------- CAPÍTULO «Número N» con veladora ----------
export const Capitulo: React.FC<{ t: number; at: number; out: number; n: string; title: string; sub?: string; kicker?: string }> = ({ t, at, out, n, title, sub, kicker = "NÚMERO" }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = K(spr(t, at, 0.8)), k2 = ei(t, at + 0.25, at + 0.9), f = flick(t, 3);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, fontFamily: FONT }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 30% 55%, rgba(15,10,6,.25), rgba(12,9,6,.85) 70%)" }} />
      <div style={{ position: "absolute", left: 120, top: 210, width: 470, height: 620, background: `radial-gradient(ellipse at 50% 60%, rgba(255,180,80,${0.28 * f}), rgba(255,140,40,0) 65%)` }} />
      <div style={{ position: "absolute", left: 150, top: 240, fontFamily: SERIF, fontSize: 500, fontWeight: 900, lineHeight: 1, color: FE.cempa, textShadow: extrude(12, "#6b3a08"), transform: `translateX(${(1 - k) * -140}px) scale(${0.82 + 0.18 * k})`, transformOrigin: "left center" }}>{n}</div>
      <div style={{ position: "absolute", left: 640, top: 380, width: 1150 }}>
        <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: 10, color: FE.dim, opacity: k2 }}>{kicker} {n}</div>
        <div style={{ height: 5, width: 860 * k2, background: FE.cempa, margin: "18px 0 22px", borderRadius: 3 }} />
        <div style={{ fontFamily: SERIF, fontSize: 92, fontWeight: 900, color: FE.ink, lineHeight: 1.05, transform: `translateY(${(1 - k2) * 40}px)`, opacity: k2, textShadow: "0 6px 30px rgba(0,0,0,.6)" }}>{title}</div>
        {sub && <div style={{ fontSize: 40, fontWeight: 700, color: FE.cempa2, marginTop: 20, opacity: e(t, at + 0.8, at + 1.2) }}>{sub}</div>}
      </div>
    </div>
  );
};

// ---------- CITA «Mi papá decía…» en papel con letra a mano ----------
export const Dicho: React.FC<{ t: number; at: number; out: number; text: string; who?: string; x?: number; y?: number; w?: number }> = ({ t, at, out, text, who = "Lola Benavides", x = 960, y = 540, w = 1240 }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const words = text.split(" "), dur = Math.min(2.8, words.length * 0.17), k = K(spr(t, at, 0.8));
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - 210, width: w, opacity: o, transform: `rotate(${-1.2 + (1 - k) * -4}deg) scale(${0.92 + 0.08 * k})` }}>
      <div style={{ background: `linear-gradient(180deg, ${FE.papel}, #e6dabd)`, padding: "54px 70px 46px", borderRadius: 6, boxShadow: "0 40px 90px rgba(0,0,0,.6)", position: "relative" }}>
        <div style={{ position: "absolute", left: 26, top: -40, fontFamily: SERIF, fontSize: 210, color: FE.cempa, fontWeight: 900, lineHeight: 1 }}>“</div>
        <div style={{ fontFamily: MANO, fontWeight: 700, fontSize: 80, color: "#2b2418", lineHeight: 1.1 }}>
          {words.map((wd, i) => <span key={i} style={{ opacity: e(t, at + 0.2 + (i / words.length) * dur, at + 0.35 + (i / words.length) * dur) }}>{wd} </span>)}
        </div>
        <div style={{ fontFamily: SERIF, fontWeight: 800, fontStyle: "italic", fontSize: 38, color: "#7a5a2a", marginTop: 20, textAlign: "right", opacity: e(t, at + dur, at + dur + 0.3) }}>— {who}</div>
      </div>
    </div>
  );
};

// ---------- RÓTULO de lugar y año («Panteón de Mezquitán · 1999») abajo a la izquierda ----------
export const Lugar: React.FC<{ t: number; at: number; out: number; tx: string; sub?: string }> = ({ t, at, out, tx, sub }) => {
  const o = vis(t, at, out); if (o <= 0.01) return null;
  const k = ei(t, at, at + 0.6);
  return (
    <div style={{ position: "absolute", left: 90, bottom: 110, opacity: o }}>
      <div style={{ height: 4, width: 120 * k, background: FE.cempa, marginBottom: 14 }} />
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 56, color: FE.ink, textShadow: "0 4px 22px rgba(0,0,0,.85)", transform: `translateX(${(1 - k) * -30}px)` }}>{tx}</div>
      {sub && <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 4, color: FE.cempa2, marginTop: 6, textShadow: "0 3px 14px rgba(0,0,0,.9)", opacity: e(t, at + 0.4, at + 0.8) }}>{sub}</div>}
    </div>
  );
};
