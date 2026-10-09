// LorNet — kit de la red Loretta (5 canales): página REAL del libro con su marca, QR del CTA, línea verde BE CAREFUL,
// tabla "never mix" (completa y mini), temperaturas seguras, lista manuscrita que se ajusta sola y la pantalla final
// (siguiente video del canal + video de otro canal de la red). Todo en el look de LorTheme (papel crema, gingham, Fraunces/Caveat).
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { LOR, SERIF, HAND, rnd, hexA } from "./LorTheme";

const ease = Easing.bezier(0.16, 1, 0.3, 1);
const inOut = (f: number, dur: number, a = 12, b = 10) =>
  Math.min(interpolate(f, [0, a], [0, 1], { extrapolateRight: "clamp", easing: ease }), interpolate(f, [dur - b, dur], [1, 0], { extrapolateLeft: "clamp" }));

// mesa de madera clara (CSS puro, sin imágenes)
const Table: React.FC = () => (
  <AbsoluteFill style={{
    backgroundColor: "#B98B5E",
    backgroundImage: "repeating-linear-gradient(90deg, rgba(90,55,25,0.10) 0 2px, transparent 2px 38px), repeating-linear-gradient(90deg, rgba(255,240,210,0.08) 0 1px, transparent 1px 13px), radial-gradient(ellipse at 30% 20%, rgba(255,235,200,0.35), transparent 60%), radial-gradient(ellipse at 80% 90%, rgba(60,30,10,0.30), transparent 55%)",
  }} />
);

const PageTag: React.FC<{ page: number; tag: string; p: number }> = ({ page, tag, p }) => (
  <div style={{ position: "absolute", left: 70, top: 56, translate: `${(1 - p) * -60}px 0px`, opacity: p, display: "flex", alignItems: "center", gap: 0, boxShadow: `0 10px 26px ${LOR.shadow}` }}>
    <div style={{ background: LOR.gingham, color: LOR.white, fontFamily: SERIF, fontWeight: 900, fontSize: 40, letterSpacing: 3, padding: "14px 26px" }}>PAGE {page}</div>
    <div style={{ background: LOR.white, color: LOR.ink, fontFamily: SERIF, fontWeight: 700, fontSize: 34, letterSpacing: 4, padding: "17px 26px" }}>{tag}</div>
  </div>
);

// Página real del libro (PNG 1920 de ancho, carta 612x792). focus "" = página entera; t/m/b = de cerca, paneo lento en esa zona.
export const LorPage: React.FC<{ src: string; page: number; tag: string; focus?: string; seed?: number }> = ({ src, page, tag, focus = "", seed = 1 }) => {
  const f = useCurrentFrame(); const { durationInFrames: d } = useVideoConfig();
  const k = interpolate(f, [0, d], [0, 1], { extrapolateRight: "clamp" });
  const p = interpolate(f, [4, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  const rot = -1.6 + rnd(seed) * 3.2;
  if (!focus) {
    const h = 1010, w = h * 612 / 792, z = 1 + 0.05 * k;
    return (
      <AbsoluteFill>
        <Table />
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <Img src={staticFile(src)} style={{ height: h, width: w, rotate: `${rot}deg`, scale: String(z), boxShadow: "0 30px 60px rgba(40,20,5,0.45), 0 4px 10px rgba(0,0,0,0.25)" }} />
        </AbsoluteFill>
        <PageTag page={page} tag={tag} p={p} />
      </AbsoluteFill>
    );
  }
  // de cerca: hoja de 1560 de ancho (alto 2019), se ve un tercio; paneo vertical suave dentro de la zona
  const W = 1560, H = W * 792 / 612;
  const zone: Record<string, [number, number]> = { t: [0.0, 0.12], m: [0.30, 0.42], b: [0.56, 0.66] };
  const [a, b] = zone[focus] || zone.m;
  const y = -(a + (b - a) * k) * (H - 1080);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Table />
      <Img src={staticFile(src)} style={{ position: "absolute", left: (1920 - W) / 2, top: y, width: W, height: H, rotate: `${rot * 0.4}deg`, boxShadow: "0 30px 70px rgba(40,20,5,0.5)" }} />
      <PageTag page={page} tag={tag} p={p} />
    </AbsoluteFill>
  );
};

// QR del CTA del medio: tapa del libro + cuadrado + la instrucción (nunca precio ni URL en pantalla)
export const LorQR: React.FC<{ qr: string; cover: string; book: string }> = ({ qr, cover, book }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: d } = useVideoConfig();
  const a = spring({ frame: f - 2, fps, config: { damping: 16, stiffness: 120 } });
  const b = spring({ frame: f - 10, fps, config: { damping: 14, stiffness: 120 } });
  const pulse = 1 + 0.015 * Math.sin(f / 9);
  const out = interpolate(f, [d - 10, d], [1, 0], { extrapolateLeft: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: LOR.paper, opacity: out }}>
      <AbsoluteFill style={{ backgroundImage: `radial-gradient(ellipse at 25% 30%, ${hexA(LOR.butterSoft, 0.6)}, transparent 60%)` }} />
      <Img src={staticFile(cover)} style={{ position: "absolute", left: 150, top: 120, height: 840, width: 840 * 612 / 792, rotate: `${-4 + 4 * (1 - a)}deg`, translate: `${(1 - a) * -200}px 0px`, boxShadow: "0 40px 70px rgba(40,20,5,0.4)" }} />
      <div style={{ position: "absolute", left: 960, top: 110, width: 820, display: "flex", flexDirection: "column", alignItems: "center", opacity: b, translate: `0px ${(1 - b) * 60}px` }}>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 62, color: LOR.gingham, rotate: "-2deg" }}>watching on the TV?</div>
        <div style={{ background: LOR.white, padding: 26, borderRadius: 18, boxShadow: `0 24px 50px ${LOR.shadow}`, marginTop: 10, scale: String(pulse) }}>
          <Img src={staticFile(qr)} style={{ width: 520, height: 520, display: "block" }} />
        </div>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 50, color: LOR.ink, marginTop: 30, textAlign: "center", lineHeight: 1.1 }}>Point your phone's camera<br />at the square</div>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 600, fontSize: 32, color: LOR.inkSoft, marginTop: 16, textAlign: "center" }}>{book}</div>
      </div>
    </AbsoluteFill>
  );
};

// Línea verde de seguridad (overlay) — cada vez que el libro tiene un límite
export const LorCareful: React.FC<{ text: string }> = ({ text }) => {
  const f = useCurrentFrame(); const { durationInFrames: d } = useVideoConfig();
  const p = inOut(f, d, 14, 10);
  const long = text.length > 90;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 90, right: 90, bottom: 56, translate: `0px ${(1 - p) * 140}px`, opacity: p, display: "flex", alignItems: "stretch", boxShadow: "0 14px 34px rgba(0,0,0,0.35)", borderRadius: 14, overflow: "hidden" }}>
        <div style={{ background: LOR.greenDeep, color: LOR.white, fontFamily: SERIF, fontWeight: 900, fontSize: 34, letterSpacing: 3, padding: "0 28px", display: "flex", alignItems: "center", whiteSpace: "nowrap" }}>⚠ BE CAREFUL</div>
        <div style={{ flex: 1, background: "rgba(232,244,226,0.97)", color: "#1F3B1A", fontFamily: SERIF, fontWeight: 600, fontSize: long ? 31 : 36, lineHeight: 1.22, padding: "18px 30px" }}>{text}</div>
      </div>
    </AbsoluteFill>
  );
};

const MIXROWS: [string, string, string][] = [
  ["Bleach", "vinegar, lemon or acid toilet cleaner", "chlorine gas"],
  ["Bleach", "ammonia or glass cleaner with ammonia", "chloramine gas"],
  ["Bleach", "rubbing alcohol", "harmful gases"],
  ["Hydrogen peroxide", "vinegar, stored in the same bottle", "a burning acid"],
  ["Two drain cleaners", "each other", "they boil and splash back"],
];
// Tarjeta chica "NEVER MIX" (overlay, arriba a la derecha) cada vez que aparece un químico
export const LorMixMini: React.FC = () => {
  const f = useCurrentFrame(); const { durationInFrames: d } = useVideoConfig();
  const p = inOut(f, d, 12, 10);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", right: 56, top: 50, width: 560, opacity: p, translate: `${(1 - p) * 120}px 0px`, background: "rgba(255,253,247,0.96)", borderRadius: 14, boxShadow: "0 14px 30px rgba(0,0,0,0.3)", overflow: "hidden" }}>
        <div style={{ background: LOR.gingham, color: LOR.white, fontFamily: SERIF, fontWeight: 900, fontSize: 30, letterSpacing: 4, padding: "10px 20px" }}>NEVER MIX</div>
        <div style={{ padding: "10px 20px 14px" }}>
          {MIXROWS.slice(0, 4).map((r, i) => (
            <div key={i} style={{ fontFamily: SERIF, fontSize: 24, color: LOR.ink, lineHeight: 1.3, padding: "4px 0", borderTop: i ? `1px solid ${LOR.paperEdge}` : "none" }}>
              <b>{r[0]}</b> + {r[1].replace(", stored in the same bottle", " (same bottle)")}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// La tabla completa de la página 3 de "The Best Way to Clean It"
export const LorNeverMix: React.FC = () => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const a = spring({ frame: f, fps, config: { damping: 18, stiffness: 110 } });
  return (
    <AbsoluteFill style={{ backgroundColor: LOR.paper, alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 1600, opacity: a, translate: `0px ${(1 - a) * 80}px` }}>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 88, color: LOR.gingham, letterSpacing: 2 }}>Never mix these</div>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 34, color: LOR.inkSoft, marginBottom: 24 }}>One thing at a time is safe. These mixtures make gases that can put you in the hospital.</div>
        <div style={{ display: "grid", gridTemplateColumns: "360px 760px 480px", background: LOR.white, borderRadius: 16, boxShadow: `0 24px 50px ${LOR.shadow}`, overflow: "hidden" }}>
          {["NEVER MIX", "WITH", "BECAUSE"].map((h) => <div key={h} style={{ background: LOR.ink, color: LOR.white, fontFamily: SERIF, fontWeight: 900, fontSize: 30, letterSpacing: 3, padding: "16px 22px" }}>{h}</div>)}
          {MIXROWS.map((r, i) => {
            const p = interpolate(f, [10 + i * 8, 22 + i * 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
            return r.map((c, j) => <div key={i + "-" + j} style={{ opacity: p, fontFamily: SERIF, fontWeight: j === 0 ? 900 : 500, fontSize: 36, color: j === 2 ? LOR.gingham : LOR.ink, padding: "18px 22px", borderTop: `2px solid ${LOR.paper2}`, background: i % 2 ? LOR.white : "#FBF6EA" }}>{c}</div>);
          })}
        </div>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 46, color: LOR.greenDeep, marginTop: 22 }}>Rinse between products · Open a window · Label every bottle · Gloves on</div>
      </div>
    </AbsoluteFill>
  );
};

// Temperaturas seguras + la regla de las 2 horas (Church Kitchen y Cooks for One)
export const LorSafeTemps: React.FC = () => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const a = spring({ frame: f, fps, config: { damping: 18, stiffness: 110 } });
  const rows: [string, string][] = [["Chicken & turkey", "165°F"], ["Ground beef & pork", "160°F"], ["Pork chops & roast", "145°F + rest 3 min"], ["Fish", "145°F"], ["Leftovers, reheated", "165°F, steaming"]];
  return (
    <AbsoluteFill style={{ backgroundColor: LOR.paper, alignItems: "center", justifyContent: "center", backgroundImage: `radial-gradient(ellipse at 80% 20%, ${hexA(LOR.ginghamSoft, 0.35)}, transparent 55%)` }}>
      <div style={{ width: 1500, opacity: a, translate: `0px ${(1 - a) * 80}px` }}>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 56, color: LOR.gingham }}>the church kitchen rules</div>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 92, color: LOR.ink, lineHeight: 1, marginBottom: 26 }}>Safe temperatures</div>
        <div style={{ background: LOR.white, borderRadius: 18, boxShadow: `0 24px 50px ${LOR.shadow}`, padding: "10px 40px" }}>
          {rows.map(([k, v], i) => {
            const p = interpolate(f, [8 + i * 7, 20 + i * 7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
            return (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 0", borderTop: i ? `2px dashed ${LOR.paperEdge}` : "none", opacity: p, translate: `${(1 - p) * 40}px 0px` }}>
                <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 48, color: LOR.ink }}>{k}</span>
                <span style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 56, color: LOR.gingham }}>{v}</span>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 24, background: LOR.greenDeep, color: LOR.white, borderRadius: 14, padding: "18px 30px", fontFamily: SERIF, fontWeight: 700, fontSize: 38 }}>
          Nothing sits out more than 2 hours (1 hour above 90°F). Leftovers in the fridge within 2 hours.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Lista manuscrita que ajusta el tamaño de letra al largo (resúmenes y "mistakes and fixes")
export const LorList: React.FC<{ title: string; lines: string[]; kicker?: string; seed?: number }> = ({ title, lines, kicker, seed = 3 }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: d } = useVideoConfig();
  const a = spring({ frame: f, fps, config: { damping: 18, stiffness: 110 } });
  const chars = lines.reduce((s, l) => s + Math.max(28, l.length), 0);
  const fs = Math.max(30, Math.min(54, Math.floor(Math.sqrt((1500 * 760) / (chars * 1.15)) * 0.98)));
  const per = Math.max(6, Math.min(22, Math.floor((d * 0.55) / Math.max(1, lines.length))));
  return (
    <AbsoluteFill style={{ backgroundColor: LOR.paper2, alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "relative", width: 1640, padding: "48px 70px 44px 110px", background: `linear-gradient(180deg, ${LOR.white}, ${LOR.paper})`, borderRadius: 10, boxShadow: `0 30px 60px ${LOR.shadow}`, rotate: `${(-1.2 + rnd(seed) * 2.4) * a}deg`, opacity: a, translate: `0px ${(1 - a) * 100}px` }}>
        <div style={{ position: "absolute", left: 80, top: 0, bottom: 0, width: 2, background: "rgba(200,60,60,0.4)" }} />
        {kicker ? <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 44, color: LOR.gingham }}>{kicker}</div> : null}
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: LOR.ink, lineHeight: 1.05, marginBottom: 18 }}>{title}</div>
        {lines.map((l, i) => {
          const t0 = 10 + i * per;
          const p = interpolate(f, [t0, t0 + per], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return <div key={i} style={{ fontFamily: HAND, fontWeight: 600, fontSize: fs, lineHeight: 1.18, color: "#243766", clipPath: `inset(0 ${100 - p}% 0 0)`, marginBottom: fs * 0.18 }}>{l}</div>;
        })}
      </div>
    </AbsoluteFill>
  );
};

// Pantalla final: el siguiente video del canal + el video de otro canal de la red (miniaturas reales de las tarjetas)
export const LorNext: React.FC<{ next: { title: string; thumb: string }; net: { title: string; thumb: string; channel: string } }> = ({ next, net }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const card = (c: { title: string; thumb: string }, label: string, at: number) => {
    const p = spring({ frame: f - at, fps, config: { damping: 15, stiffness: 120 } });
    return (
      <div style={{ width: 780, opacity: p, translate: `0px ${(1 - p) * 90}px` }}>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 34, letterSpacing: 3, color: LOR.white, background: LOR.gingham, display: "inline-block", padding: "8px 18px", marginBottom: 14 }}>{label}</div>
        <Img src={staticFile(c.thumb)} style={{ width: 780, height: 439, objectFit: "cover", borderRadius: 14, boxShadow: `0 24px 50px ${LOR.shadow}`, display: "block" }} />
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 36, color: LOR.ink, lineHeight: 1.15, marginTop: 16 }}>{c.title}</div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ backgroundColor: LOR.paper, alignItems: "center", justifyContent: "center", backgroundImage: `radial-gradient(ellipse at 50% 0%, ${hexA(LOR.butterSoft, 0.7)}, transparent 60%)` }}>
      <div style={{ display: "flex", gap: 120, alignItems: "flex-start" }}>
        {card(next, "WATCH NEXT", 4)}
        {card(net, `ON MY ${net.channel.toUpperCase()} CHANNEL`, 14)}
      </div>
    </AbsoluteFill>
  );
};
