// Kit "Muro" del Constructor Libre (fb14b, silicato en paredes): revoque, ladrillo, gotas, cinta de pintor, vaso medidor, botella.
// PURO CSS y DOM: sin SVG, sin blur grande, sin backdrop-filter, sin feTurbulence. Las fotos van enteras.
// Ningún truco de Obra (fb14a) se repite: acá todo nace de la PARED (se moja, se seca, chupa, respira).
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, Easing } from "remotion";
import { Photo, FONTS, CL, hash, useOut } from "./Kit";

const { SERIF, SANS } = FONTS;
export const M = { cal: "#E9E3D6", cal2: "#D6CDBB", rev: "#A8A196", revD: "#5D574F", wet: "#3B3630", lad: "#A4553A", lad2: "#7E3B26", tape: "#3C7DD9", tapeY: "#E8D9A8", ink: "#1E1B18", agua: "#7FB7D9", ok: "#5E9A55", no: "#C0452F", glass: "rgba(210,232,240,0.22)" };
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = Easing.out(Easing.cubic);
const sp = (f: number, d = 0, damping = 14) => spring({ frame: f - d, fps: 30, config: { damping, mass: 0.8 } });
const tsh = "0 3px 14px rgba(0,0,0,0.7), 0 1px 2px rgba(0,0,0,0.8)";
// revoque a la cal hecho con gradientes; "wet" 0..1 lo oscurece desde abajo como una mancha de humedad
const revoque = (wet = 0, line = 70) => ({
  background: `radial-gradient(circle at 20% 30%, rgba(0,0,0,0.10) 0 1.5px, transparent 2.5px) 0 0 / 21px 17px, radial-gradient(circle at 60% 70%, rgba(255,255,255,0.18) 0 1px, transparent 2px) 0 0 / 13px 23px, linear-gradient(0deg, rgba(59,54,48,${0.85 * wet}) 0%, rgba(59,54,48,${0.55 * wet}) ${line - 12}%, rgba(255,255,255,${0.5 * wet}) ${line - 2}%, transparent ${line + 3}%), linear-gradient(180deg, ${M.cal}, ${M.cal2})`,
});
const ladrillos = () => ({ background: `linear-gradient(0deg, transparent 0 46px, ${M.cal2} 46px 50px) 0 0 / 100% 50px, repeating-linear-gradient(90deg, transparent 0 116px, ${M.cal2} 116px 120px), linear-gradient(160deg, ${M.lad}, ${M.lad2})` });
const Base: React.FC<{ bg?: string; dur: number; seed?: number; dim?: number }> = ({ bg, dur, seed = 3, dim = 0.55 }) => (
  <AbsoluteFill>
    {bg ? <Photo src={bg} seed={seed} dur={dur} /> : <AbsoluteFill style={revoque(0.3)} />}
    <AbsoluteFill style={{ background: `rgba(18,16,14,${Math.min(0.5, dim * 0.72)})` }} />
  </AbsoluteFill>
);
const Kick: React.FC<{ txt: string; f0?: number; color?: string; style?: React.CSSProperties }> = ({ txt, f0 = 0, color = M.agua, style }) => {
  const f = useCurrentFrame(); const p = sp(f, f0, 16);
  return <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 42, letterSpacing: 5, color, textShadow: tsh, opacity: p, transform: `translateX(${(1 - p) * -30}px)`, ...style }}>{txt}</div>;
};
const Big: React.FC<{ txt: string; f0?: number; size?: number; color?: string; style?: React.CSSProperties }> = ({ txt, f0 = 0, size = 90, color = "#F6F2EA", style }) => {
  const f = useCurrentFrame(); const p = sp(f, f0, 15);
  return <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: size, lineHeight: 1.08, color, textShadow: tsh, opacity: p, transform: `translateY(${(1 - p) * 30}px)`, ...style }}>{txt}</div>;
};
// tira de cinta de pintor (azul) con texto, pegada torcida
const Cinta: React.FC<{ txt: string; f0?: number; rot?: number; color?: string; size?: number; style?: React.CSSProperties }> = ({ txt, f0 = 0, rot = -2, color = M.tape, size = 44, style }) => {
  const f = useCurrentFrame(); const w = interpolate(f, [f0, f0 + 12], [0, 100], { ...CL, easing: ease });
  return <div style={{ display: "inline-block", background: color, padding: "10px 26px", transform: `rotate(${rot}deg)`, clipPath: `inset(0 ${100 - w}% 0 0)`, boxShadow: "0 6px 14px rgba(0,0,0,0.35)", fontFamily: SANS, fontWeight: 700, fontSize: size, color: color === M.tape ? "#F4F7FB" : M.ink, letterSpacing: 1, ...style }}>{txt}</div>;
};
// gota que cae (div redondo con punta), y en y0 se aplasta
const Gota: React.FC<{ x: number; f0: number; y1: number; size?: number }> = ({ x, f0, y1, size = 26 }) => {
  const f = useCurrentFrame(); const t = cl((f - f0) / 14); const y = -40 + (y1 + 40) * t * t; const sq = f - f0 > 14 ? interpolate(f - f0, [14, 22], [1, 0], CL) : 1;
  if (f < f0) return null;
  return <div style={{ position: "absolute", left: x, top: y, width: size, height: size * 1.3 * sq + 4, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.9), ${M.agua} 45%, rgba(40,90,120,0.9))`, opacity: sq }} />;
};

// ---------- (3)+(5) apertura de paso: la foto del paso; una brocha mojada "pinta" un rectángulo de revoque y el número aparece al secarse
export const ChapM: React.FC<{ n: number; N: number; title: string; src: string; dur: number }> = ({ n, N, title, src, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8);
  const brush = interpolate(f, [2, 20], [0, 100], { ...CL, easing: ease }); const dry = interpolate(f, [16, 40], [1, 0], CL);
  const right = n % 2 === 0;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Photo src={src} seed={n * 13 + 2} dur={dur} />
      <AbsoluteFill style={{ background: `linear-gradient(${right ? 270 : 90}deg, rgba(14,12,10,0.7), rgba(14,12,10,0.15) 55%, transparent 75%)` }} />
      <div style={{ position: "absolute", [right ? "right" : "left"]: 120, top: 220, width: 620 }}>
        <div style={{ position: "relative", height: 340, clipPath: `polygon(0 0, ${brush}% 0, ${brush - 4}% 18%, ${brush + 2}% 40%, ${brush - 3}% 63%, ${brush + 1}% 82%, ${brush - 2}% 100%, 0 100%)`, boxShadow: "0 30px 60px rgba(0,0,0,0.5)" }}>
          <div style={{ position: "absolute", inset: 0, ...revoque(dry * 0.9, 100) }} />
          <div style={{ position: "absolute", left: 44, top: 30, fontFamily: SANS, fontWeight: 700, fontSize: 28, letterSpacing: 8, color: "rgba(40,36,30,0.7)" }}>PASO</div>
          <div style={{ position: "absolute", left: 36, top: 56, fontFamily: SERIF, fontWeight: 700, fontSize: 230, lineHeight: 1, color: `rgba(70,62,52,${0.25 + 0.65 * (1 - dry)})` }}>{n}</div>
          <div style={{ position: "absolute", right: 44, bottom: 30, fontFamily: SERIF, fontSize: 60, color: "rgba(60,54,46,0.7)" }}>de {N}</div>
        </div>
        <Big txt={title} f0={16} size={72} style={{ marginTop: 28, maxWidth: 760 }} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- (2) progreso: una hilada de 12 ladrillos; los pasos hechos se "secan" (de oscuro a claro)
export const ProgM: React.FC<{ n: number; N: number; title: string; dur: number }> = ({ n, N, title, dur }) => {
  const f = useCurrentFrame(); const p = sp(f, 0, 18); const o = useOut(dur, 10);
  return (
    <div style={{ position: "absolute", left: 60, bottom: 44, display: "flex", alignItems: "center", gap: 18, opacity: p * o, transform: `translateY(${(1 - p) * 50}px)` }}>
      <div style={{ display: "flex", gap: 4, padding: 4, background: M.cal2, borderRadius: 3 }}>
        {Array.from({ length: N }, (_, i) => { const done = i < n - 1, now = i === n - 1; const sec = now ? interpolate(f, [6, 30], [0, 1], CL) : done ? 1 : 0;
          return <div key={i} style={{ width: 34, height: 18, background: `linear-gradient(0deg, rgba(40,30,25,${0.55 * (1 - sec)}), rgba(40,30,25,${0.55 * (1 - sec)})), ${M.lad}`, outline: now ? `2px solid ${M.agua}` : "none" }} />; })}
      </div>
      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 24, color: "#F4F1EA", textShadow: tsh, letterSpacing: 2 }}>{n} / {N} · {title.toUpperCase()}</div>
    </div>
  );
};

// ---------- índice / repaso: una pared de 12 ladrillos-tarjeta; en el repaso cada uno se seca cuando la voz lo nombra
export const MuroIdx: React.FC<{ head: string; cards: { n: number; title: string; src: string; f?: number }[]; recap?: boolean; bg?: string; dur: number }> = ({ head, cards, recap, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 10);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.7} />
      <Kick txt={head} style={{ position: "absolute", left: 120, top: 70 }} />
      <div style={{ position: "absolute", left: 110, right: 110, top: 150, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        {cards.map((c, i) => { const row = Math.floor(i / 4); const t0 = recap ? (c.f ?? 0) : 6 + i * 4; const p = sp(f, t0, 15); const lit = recap ? (f >= (c.f ?? 0) ? 1 : 0.35) : 1;
          return (
            <div key={i} style={{ position: "relative", height: 270, marginLeft: row % 2 ? 40 : 0, marginRight: row % 2 ? -40 : 0, overflow: "hidden", borderRadius: 3, border: `5px solid ${M.cal2}`, opacity: cl(p) * lit, transform: `translateY(${(1 - p) * 60}px)` }}>
              <Img src={staticFile(c.src)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: lit < 1 ? "grayscale(0.8) brightness(0.6)" : "none" }} />
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "10px 14px", background: "rgba(20,18,16,0.72)", fontFamily: SANS, fontWeight: 600, fontSize: 22, color: "#F2EEE6" }}><b style={{ color: M.agua }}>{c.n}</b> · {c.title}</div>
            </div>
          ); })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- precio: el litro escrito en cinta azul sobre el bidón (foto)
export const LitroM: React.FC<{ big: string; sub: string; bg?: string; dur: number }> = ({ big, sub, bg, dur }) => {
  const o = useOut(dur, 8);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.4} />
      <div style={{ position: "absolute", left: 640, top: 380, display: "flex", flexDirection: "column", gap: 24, alignItems: "flex-start" }}>
        <Cinta txt={big} f0={4} rot={-4} size={150} />
        <Cinta txt={sub} f0={14} rot={2} color={M.tapeY} size={40} style={{ marginLeft: 60 }} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- álbum: foto vieja clavada con una tachuela sobre una pared húmeda que se mancha detrás
export const TachuelaM: React.FC<{ src: string; caption: string; dur: number }> = ({ src, caption, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const p = sp(f, 4, 11); const wet = interpolate(f, [0, dur], [0.15, 0.7], CL);
  return (
    <AbsoluteFill style={{ opacity: o, ...revoque(wet, 46) }}>
      <div style={{ position: "absolute", left: 560, top: 140, width: 800, transform: `rotate(${-3 + (1 - p) * 8}deg) translateY(${(1 - p) * -80}px)`, transformOrigin: "50% 0%", background: "#F3EEE2", padding: "22px 22px 80px", boxShadow: "0 24px 50px rgba(0,0,0,0.45)" }}>
        <Img src={staticFile(src)} style={{ width: "100%", height: 470, objectFit: "cover", filter: "sepia(0.35) contrast(0.95)" }} />
        <div style={{ position: "absolute", left: 30, bottom: 22, fontFamily: SERIF, fontStyle: "italic", fontSize: 40, color: M.ink }}>{caption}</div>
        <div style={{ position: "absolute", left: "50%", top: -14, width: 34, height: 34, marginLeft: -17, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #F1D27A, #A57A1E)`, boxShadow: "0 5px 8px rgba(0,0,0,0.5)" }} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- álbum 2: la foto sube desde una caja de zapatos (las fotos de don Ernesto)
export const CajaM: React.FC<{ src: string; caption: string; bg?: string; dur: number }> = ({ src, caption, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const up = sp(f, 4, 13);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.65} />
      <div style={{ position: "absolute", left: 610, top: 160 + (1 - up) * 520, width: 700, background: "#F2EDE3", padding: 18, boxShadow: "0 20px 40px rgba(0,0,0,0.5)", transform: `rotate(${2 - up * 4}deg)` }}>
        <Img src={staticFile(src)} style={{ width: "100%", height: 430, objectFit: "cover" }} />
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 36, color: M.ink, marginTop: 14 }}>{caption}</div>
      </div>
      <div style={{ position: "absolute", left: 520, top: 760, width: 880, height: 320, background: "linear-gradient(180deg, #B98F5E, #8C6639)", boxShadow: "inset 0 18px 30px rgba(0,0,0,0.35), 0 -6px 0 #A07646" }} />
    </AbsoluteFill>
  );
};

// ---------- comentarios: dos tarjetas de comentario anónimas con sus me gusta subiendo
export const ComentM: React.FC<{ items: { txt: string; likes: number; f: number }[]; bg?: string; dur: number }> = ({ items, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.72} />
      <div style={{ position: "absolute", left: 260, right: 260, top: 230, display: "flex", flexDirection: "column", gap: 40 }}>
        {items.map((it, i) => { const p = sp(f, it.f, 14); const n = Math.round(interpolate(f, [it.f + 6, it.f + 30], [0, it.likes], CL));
          return (
            <div key={i} style={{ display: "flex", gap: 26, alignItems: "flex-start", background: "rgba(246,243,236,0.95)", borderRadius: 18, padding: "28px 34px", opacity: p, transform: `translateX(${(1 - p) * (i % 2 ? 140 : -140)}px)` }}>
              <div style={{ width: 70, height: 70, borderRadius: "50%", background: i % 2 ? M.ok : M.tape, flex: "0 0 70px" }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: SANS, fontSize: 24, color: "#7A746B", marginBottom: 8 }}>gente del oficio · comentario</div>
                <div style={{ fontFamily: SERIF, fontSize: 44, color: M.ink, lineHeight: 1.15 }}>{it.txt}</div>
                <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 30, color: M.tape, marginTop: 10 }}>▲ {n} me gusta</div>
              </div>
            </div>
          ); })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- poros: una lupa (círculo) recorre el revoque y adentro se ve el agua subiendo por canalitos
export const LupaM: React.FC<{ bg?: string; dur: number }> = ({ bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const p = sp(f, 2, 14); const lvl = interpolate(f, [12, Math.max(40, dur - 20)], [0, 85], CL);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.45} />
      <div style={{ position: "absolute", left: 620, top: 160, width: 680, height: 680, borderRadius: "50%", overflow: "hidden", border: "16px solid #2A2724", boxShadow: "0 30px 70px rgba(0,0,0,0.6), inset 0 0 40px rgba(0,0,0,0.5)", transform: `scale(${p})`, background: M.rev }}>
        {Array.from({ length: 13 }, (_, i) => { const x = 30 + i * 50 + (hash(i) % 20); const w = 10 + (hash(i + 7) % 14);
          return <div key={i} style={{ position: "absolute", left: x, top: 0, bottom: 0, width: w, background: "#4A443D", borderRadius: 8 }}>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${cl(lvl + (hash(i + 3) % 18) - 9, 0, 100)}%`, background: `linear-gradient(0deg, ${M.agua}, rgba(127,183,217,0.6))`, borderRadius: 8 }} />
          </div>; })}
      </div>
      <div style={{ position: "absolute", left: 120, top: 380, width: 440 }}><Kick txt="POR DENTRO" /><Big txt="Canales más finos que un pelo" f0={8} size={64} /></div>
      <div style={{ position: "absolute", right: 110, top: 440, width: 360 }}><Big txt="capilaridad" f0={30} size={58} color={M.agua} /></div>
    </AbsoluteFill>
  );
};

// ---------- tres humedades: tres cortes de pared; k = 1/2/3 enciende una; "si" estampa sirve/no sirve
export const TresM: React.FC<{ k: number | "si"; dur: number; bg?: string }> = ({ k, dur, bg }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8);
  const H = [{ t: "Condensación", s: "del aire de la casa", ok: false }, { t: "Filtración", s: "de afuera, la atraviesa", ok: true }, { t: "Sube del piso", s: "por los cimientos", ok: true }];
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.78} />
      <div style={{ position: "absolute", left: 150, right: 150, top: 170, display: "flex", gap: 50 }}>
        {H.map((h, i) => { const on = k === "si" || k === i + 1; const p = sp(f, 3 + i * 5, 15);
          return (
            <div key={i} style={{ flex: 1, opacity: p * (on ? 1 : 0.35), transform: `translateY(${(1 - p) * 40}px) scale(${on ? 1 : 0.94})` }}>
              <div style={{ position: "relative", height: 430, ...revoque(i === 2 ? 0.9 : 0, i === 2 ? 34 : 0), border: `6px solid ${on ? M.agua : "#55504A"}`, overflow: "hidden" }}>
                {i === 0 && Array.from({ length: 22 }, (_, j) => <div key={j} style={{ position: "absolute", left: 14 + (hash(j) % 300), top: 20 + (hash(j + 9) % 380), width: 10, height: 14, borderRadius: "50%", background: "rgba(90,140,170,0.75)" }} />)}
                {i === 1 && <div style={{ position: "absolute", left: 60, top: 90, width: 230, height: 190, borderRadius: "48% 52% 44% 56% / 55% 40% 60% 45%", background: "rgba(59,54,48,0.75)" }} />}
                {i === 1 && <div style={{ position: "absolute", left: -10, top: 0, bottom: 0, width: 30, background: "repeating-linear-gradient(170deg, rgba(127,183,217,0.8) 0 6px, transparent 6px 22px)" }} />}
              </div>
              <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 50, color: "#F4F1EA", textShadow: tsh, marginTop: 18 }}>{h.t}</div>
              <div style={{ fontFamily: SANS, fontSize: 28, color: "#D8D2C6", textShadow: tsh }}>{h.s}</div>
              {k === "si" && <div style={{ marginTop: 16, opacity: sp(f, 16 + i * 8, 10) }}><Cinta txt={h.ok ? "SILICATO SÍ" : "NO SIRVE: VENTILAR"} f0={16 + i * 8} color={h.ok ? M.ok : M.no} size={32} rot={i % 2 ? 2 : -2} /></div>}
            </div>
          ); })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- reloj de horas: una esfera de agua que se vacía (conic-gradient) hasta las horas indicadas
export const RelojM: React.FC<{ h: number; label: string; sub: string; bg?: string; dur: number }> = ({ h, label, sub, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const t = interpolate(f, [6, Math.min(dur - 10, 70)], [0, 1], { ...CL, easing: ease }); const shown = Math.round(t * h);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.6} />
      <div style={{ position: "absolute", left: 300, top: 220, width: 560, height: 560, borderRadius: "50%", background: `conic-gradient(${M.agua} 0 ${t * 360}deg, rgba(255,255,255,0.12) ${t * 360}deg 360deg)`, boxShadow: "0 30px 60px rgba(0,0,0,0.5)" }}>
        <div style={{ position: "absolute", inset: 46, borderRadius: "50%", background: "#1F1C19", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
          <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 190, color: "#F4F1EA", lineHeight: 1 }}>{shown}</div>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 36, letterSpacing: 8, color: M.agua }}>HORAS</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 960, top: 380, width: 760 }}><Big txt={label} f0={10} size={80} /><Kick txt={sub} f0={22} style={{ marginTop: 18 }} color="#E8E2D6" /></div>
    </AbsoluteFill>
  );
};

// ---------- prueba del plástico: corte lateral pared | plástico | habitación; las gotitas aparecen del lado que dice el modo
export const PlasticoM: React.FC<{ lado: "fuera" | "dentro"; dur: number; bg?: string }> = ({ lado, dur, bg }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const p = sp(f, 2, 15);
  const fuera = lado === "fuera";
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.75} />
      <div style={{ position: "absolute", left: 200, top: 180, width: 380, height: 640, ...revoque(fuera ? 0.1 : 0.8, 100), transform: `translateX(${(1 - p) * -200}px)` }} />
      <div style={{ position: "absolute", left: 580, top: 220, width: 120, marginLeft: -50, height: 560, background: "linear-gradient(90deg, rgba(230,236,240,0.30), rgba(255,255,255,0.12) 40%, rgba(230,236,240,0.32))", border: "2px solid rgba(240,244,248,0.7)", borderRadius: 6 }} />
      {Array.from({ length: 12 }, (_, i) => <Gota key={i} x={fuera ? 610 + (hash(i) % 60) : 470 + (hash(i) % 90)} f0={8 + i * 3} y1={240 + (hash(i + 4) % 480)} size={34} />)}
      <div style={{ position: "absolute", left: 210, top: 840, fontFamily: SANS, fontWeight: 700, fontSize: 40, letterSpacing: 4, color: "#F2ECE0", textShadow: tsh }}>PARED</div>
      <div style={{ position: "absolute", left: 640, top: 840, fontFamily: SANS, fontWeight: 700, fontSize: 40, letterSpacing: 4, color: "#F2ECE0", textShadow: tsh }}>HABITACIÓN</div>
      <div style={{ position: "absolute", left: 960, top: 300, width: 800 }}>
        <Kick txt={fuera ? "MOJADO POR FUERA" : "MOJADO POR DENTRO"} f0={6} />
        <Big txt={fuera ? "Condensación" : "Filtración o subida"} f0={14} size={96} />
        <div style={{ marginTop: 34 }}><Cinta txt={fuera ? "El silicato NO sirve" : "El silicato SÍ sirve"} f0={30} rot={-1} color={fuera ? M.no : M.ok} size={54} style={{ whiteSpace: "nowrap" }} /></div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Fuchs: una ficha de archivo con el siglo escrito y el teatro
export const FichaM: React.FC<{ title: string; lines: { txt: string; f: number }[]; bg?: string; dur: number }> = ({ title, lines, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const p = sp(f, 2, 13);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.7} />
      <div style={{ position: "absolute", left: 460, top: 170, width: 1000, background: "#EFE7D4", padding: "50px 60px", transform: `rotate(-1.5deg) translateY(${(1 - p) * 300}px)`, boxShadow: "0 30px 60px rgba(0,0,0,0.5)", backgroundImage: "repeating-linear-gradient(180deg, transparent 0 58px, rgba(60,125,217,0.25) 58px 60px)" }}>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 26, letterSpacing: 6, color: M.no }}>FICHA · SIGLO XIX</div>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 70, color: M.ink, margin: "12px 0 24px" }}>{title}</div>
        {lines.map((l, i) => <div key={i} style={{ fontFamily: SERIF, fontSize: 40, color: "#35302A", lineHeight: "60px", opacity: sp(f, l.f, 16) }}>— {l.txt}</div>)}
      </div>
    </AbsoluteFill>
  );
};

// ---------- química: poros vacíos que se llenan de gel (azul) y luego cristal (blanco brillante)
export const GelM: React.FC<{ bg?: string; dur: number }> = ({ bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const g = interpolate(f, [10, 50], [0, 1], CL); const c = interpolate(f, [60, 100], [0, 1], CL);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.7} />
      <div style={{ position: "absolute", left: 160, top: 200, width: 900, height: 640, background: M.rev, borderRadius: 8, overflow: "hidden", boxShadow: "0 30px 60px rgba(0,0,0,0.5)" }}>
        {Array.from({ length: 40 }, (_, i) => { const x = (hash(i) % 840) + 10, y = (hash(i + 50) % 580) + 10, r = 18 + (hash(i + 90) % 30); const gi = cl(g * 1.4 - (i % 7) * 0.06);
          return <div key={i} style={{ position: "absolute", left: x, top: y, width: r, height: r, borderRadius: "50%", background: "#3F3A34", boxShadow: "inset 0 3px 6px rgba(0,0,0,0.6)" }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", transform: `scale(${gi})`, background: c > 0 ? `rgba(240,248,252,${0.4 + 0.6 * c})` : "rgba(127,183,217,0.85)", boxShadow: c > 0.5 ? "0 0 8px rgba(255,255,255,0.8)" : "none" }} />
          </div>; })}
      </div>
      <div style={{ position: "absolute", left: 1130, top: 260, width: 640 }}>
        <Kick txt="SILICATO + CAL DEL CEMENTO" f0={4} />
        <Big txt={c > 0.3 ? "cristal que tapa el poro" : "un gel en el poro"} f0={c > 0.3 ? 60 : 12} size={78} color={c > 0.3 ? "#F4FAFC" : M.agua} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- dónde se compra: etiquetas colgando de un hilo
export const EtiqM: React.FC<{ items: { txt: string; f: number }[]; foot?: string; bg?: string; dur: number }> = ({ items, foot, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.6} />
      <div style={{ position: "absolute", left: 120, right: 120, top: 200, height: 4, background: "#CFC6B5" }} />
      {items.map((it, i) => { const p = sp(f, it.f, 9); const sw = Math.sin((f - it.f) / 7) * 6 * Math.exp(-(f - it.f) / 40);
        return <div key={i} style={{ position: "absolute", left: 220 + i * 520, top: 200, width: 400, transformOrigin: "50% 0", transform: `rotate(${(1 - p) * 70 + sw}deg)`, opacity: cl(p * 3) }}>
          <div style={{ width: 4, height: 70, background: "#CFC6B5", margin: "0 auto" }} />
          <div style={{ background: M.tapeY, borderRadius: "14px 14px 6px 6px", padding: "40px 30px", textAlign: "center", fontFamily: SERIF, fontWeight: 600, fontSize: 48, color: M.ink, boxShadow: "0 16px 30px rgba(0,0,0,0.45)" }}>{it.txt}</div>
        </div>; })}
      {foot && <div style={{ position: "absolute", left: 0, right: 0, bottom: 120, textAlign: "center" }}><Cinta txt={foot} f0={items[items.length - 1].f + 14} size={44} /></div>}
    </AbsoluteFill>
  );
};

// ---------- seguridad: tres cosas estarcidas con aerosol sobre la pared (letras que aparecen por rocío)
export const EstarcidoM: React.FC<{ items: { txt: string; f: number }[]; head: string; bg?: string; dur: number }> = ({ items, head, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8);
  return (
    <AbsoluteFill style={{ opacity: o, ...revoque(0.05) }}>
      {bg && <AbsoluteFill style={{ opacity: 0.25 }}><Photo src={bg} seed={4} dur={dur} /></AbsoluteFill>}
      <div style={{ position: "absolute", left: 160, top: 120, fontFamily: SANS, fontWeight: 700, fontSize: 34, letterSpacing: 8, color: M.no }}>{head}</div>
      {items.map((it, i) => { const t = cl((f - Math.min(it.f, dur - 70 + i * 6)) / 12);
        return <div key={i} style={{ position: "absolute", left: 160, top: 230 + i * 220, fontFamily: SANS, fontWeight: 700, fontSize: 150, letterSpacing: 4, color: `rgba(30,27,24,${0.92 * t})`, textShadow: t > 0 ? `0 0 ${10 * (1 - t) + 2}px rgba(30,27,24,${0.5 * t})` : "none" }}>{it.txt}</div>; })}
    </AbsoluteFill>
  );
};

// ---------- vidrio: un vidrio de ventana donde cae una gota y se abre una nube blanca que no sale
export const VentanaM: React.FC<{ bg?: string; dur: number }> = ({ bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const nube = interpolate(f, [24, 60], [0, 1], CL);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.35} />
      <div style={{ position: "absolute", left: 560, top: 110, width: 800, height: 860, border: "26px solid #B9BDC1", boxShadow: "inset 0 0 0 4px #8E9398, 0 30px 60px rgba(0,0,0,0.5)", background: M.glass }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 22, background: "#B9BDC1" }} />
        <Gota x={330} f0={8} y1={240} size={30} />
        <div style={{ position: "absolute", left: 345 - 160 * nube, top: 270 - 110 * nube, width: 320 * nube, height: 220 * nube, borderRadius: "46% 54% 40% 60% / 50% 45% 55% 50%", background: `radial-gradient(ellipse, rgba(250,250,248,0.85), rgba(240,240,236,0.35) 70%, transparent)` }} />
      </div>
      <div style={{ position: "absolute", left: 120, top: 700, width: 420 }}><Big txt="Mancha para siempre" f0={40} size={64} /></div>
    </AbsoluteFill>
  );
};

// ---------- golpe: anillos de sonido que salen del nudillo; firme = 1 anillo corto, hueco = muchos que retumban
export const GolpeM: React.FC<{ modo: "firme" | "hueco"; bg?: string; dur: number }> = ({ modo, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const hueco = modo === "hueco"; const n = hueco ? 6 : 1;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.55} />
      {Array.from({ length: n }, (_, i) => { const t = ((f - 6 - i * 8) / (hueco ? 40 : 18)); if (t < 0 || t > 1) return null;
        return <div key={i} style={{ position: "absolute", left: 760 - 400 * t, top: 540 - 400 * t, width: 800 * t, height: 800 * t, borderRadius: "50%", border: `${hueco ? 16 : 22}px solid ${hueco ? M.no : M.ok}`, opacity: 1 - t * 0.8 }} />; })}
      <div style={{ position: "absolute", left: 1060, top: 400, width: 700 }}>
        <Cinta txt={hueco ? "SUENA HUECO" : "SUENA FIRME"} f0={4} rot={-1} color={hueco ? M.no : M.ok} size={62} />
        <Big txt={hueco ? "hay agua detrás" : "el revoque está sano"} f0={14} size={56} style={{ marginTop: 26 }} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- salitre: cristalitos blancos que crecen a lo largo de la línea de humedad y un cepillo seco los barre
export const SalitreM: React.FC<{ bg?: string; dur: number }> = ({ bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const barre = interpolate(f, [55, 95], [-10, 110], CL);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.45} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 470, height: 200 }}>
        {Array.from({ length: 140 }, (_, i) => { const x = (i / 140) * 1920 + (hash(i) % 12); const g = cl((f - 4 - (i % 30)) / 20); const gone = x / 19.2 < barre;
          return <div key={i} style={{ position: "absolute", left: x, top: 60 + (hash(i + 3) % 70), width: 6 + (hash(i + 5) % 10), height: 6 + (hash(i + 8) % 10), background: "#FBFBF8", transform: `scale(${gone ? 0 : g}) rotate(${hash(i) % 90}deg)`, boxShadow: "0 0 4px rgba(255,255,255,0.8)" }} />; })}
      </div>
      <div style={{ position: "absolute", left: 120, top: 200 }}><Kick txt="SALITRE" /><Big txt="se saca en seco" f0={8} size={84} /></div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 150, textAlign: "center" }}><Cinta txt="nunca con agua al principio" f0={60} color={M.no} size={44} /></div>
    </AbsoluteFill>
  );
};

// ---------- tacto: la palma apoyada (contorno de mano hecho con dedos redondeados) que se pone tibia = lista
export const PalmaM: React.FC<{ bg?: string; dur: number }> = ({ bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const t = interpolate(f, [10, 50], [0, 1], CL);
  const col = `rgba(${Math.round(90 + 140 * t)}, ${Math.round(150 + 40 * t)}, ${Math.round(210 - 120 * t)}, 0.55)`;
  const dedo = (l: number, h: number, r: number) => <div style={{ position: "absolute", left: l, bottom: 300, width: 70, height: h, borderRadius: 35, background: col, transform: `rotate(${r}deg)`, transformOrigin: "50% 100%" }} />;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.4} />
      <div style={{ position: "absolute", left: 640, top: 160, width: 520, height: 760 }}>
        {dedo(40, 230, -18)}{dedo(130, 300, -5)}{dedo(220, 320, 0)}{dedo(310, 290, 5)}{dedo(410, 190, 38)}
        <div style={{ position: "absolute", left: 40, bottom: 20, width: 380, height: 320, borderRadius: "40% 40% 50% 50%", background: col }} />
      </div>
      <div style={{ position: "absolute", left: 1220, top: 360, width: 620 }}>
        <Kick txt={t > 0.6 ? "NO FRÍA, NO MOJADA" : "¿FRÍA Y MOJADA?"} color={t > 0.6 ? "#F1C27A" : M.agua} />
        <Big txt="Seca al tacto" f0={8} size={90} />
        <div style={{ marginTop: 26 }}><Cinta txt="2 o 3 días sin lluvia" f0={40} size={40} /></div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- dilución: vasos medidores que se llenan (1:4 y 1:2); "prof" muestra cuánto entra cada mezcla en la pared
export const VasosM: React.FC<{ modo: "1" | "2" | "prof"; bg?: string; dur: number }> = ({ modo, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8);
  const vaso = (i: number, sil: boolean, f0: number) => { const h = interpolate(f, [f0, f0 + 14], [0, 1], { ...CL, easing: ease });
    return <div key={i} style={{ position: "relative", width: 130, height: 220, border: "6px solid rgba(235,240,244,0.85)", borderTop: "none", borderRadius: "0 0 22px 22px", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${80 * h}%`, background: sil ? "linear-gradient(180deg, rgba(240,225,170,0.95), rgba(220,200,130,0.95))" : "linear-gradient(180deg, rgba(127,183,217,0.75), rgba(80,140,190,0.85))" }} />
    </div>; };
  if (modo === "prof") {
    const a = interpolate(f, [8, 40], [0, 1], CL), b = interpolate(f, [30, 60], [0, 1], CL);
    return (
      <AbsoluteFill style={{ opacity: o }}>
        <Base bg={bg} dur={dur} dim={0.75} />
        {[["1 : 4", "entra profundo", 0.85 * a, "primera mano"], ["1 : 2", "cierra la superficie", 0.3 * b, "segunda mano"]].map(([r, s, d, m], i) => (
          <div key={i} style={{ position: "absolute", left: 200 + i * 800, top: 200, width: 640 }}>
            <Kick txt={String(m).toUpperCase()} f0={4 + i * 26} />
            <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 110, color: "#F4F1EA", textShadow: tsh }}>{r}</div>
            <div style={{ position: "relative", height: 300, ...revoque(0), marginTop: 10 }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${100 * Number(d)}%`, background: "linear-gradient(90deg, rgba(240,225,170,0.9), rgba(240,225,170,0.25))" }} />
            </div>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 48, color: "#F4EFE4", marginTop: 14, textShadow: tsh }}>{s}</div>
          </div>
        ))}
      </AbsoluteFill>
    );
  }
  const n = modo === "1" ? 4 : 2;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.7} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center" }}><Kick txt={modo === "1" ? "PRIMERA MANO" : "SEGUNDA MANO"} style={{ display: "inline-block" }} /></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 330, display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 34 }}>
        {vaso(0, true, 6)}
        <div style={{ fontFamily: SERIF, fontSize: 100, color: "#F4F1EA", margin: "0 20px 50px" }}>+</div>
        {Array.from({ length: n }, (_, i) => vaso(i + 1, false, 18 + i * 8))}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, textAlign: "center", fontFamily: SERIF, fontWeight: 700, fontSize: 150, color: "#F4F1EA", textShadow: tsh }}>1 : {n}</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 830, textAlign: "center", fontFamily: SANS, fontSize: 34, color: "#DDD6CA" }}>silicato · agua</div>
    </AbsoluteFill>
  );
};

// ---------- cuánto preparar: la pared con cotas que se dibujan 4 m × 2,5 m = 10 m² → litros
export const CotasM: React.FC<{ rows: { txt: string; f: number }[]; bg?: string; dur: number }> = ({ rows, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const a = interpolate(f, [4, 22], [0, 1], CL), b = interpolate(f, [16, 34], [0, 1], CL);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.7} />
      <div style={{ position: "absolute", left: 150, top: 230, width: 880, height: 550, border: `4px dashed ${M.tapeY}`, background: "rgba(240,225,170,0.10)" }} />
      <div style={{ position: "absolute", left: 150, top: 190, width: 880 * a, height: 4, background: M.tapeY }} />
      <div style={{ position: "absolute", left: 150, top: 140, fontFamily: SANS, fontWeight: 700, fontSize: 40, color: M.tapeY, opacity: a }}>4 m</div>
      <div style={{ position: "absolute", left: 1060, top: 230, width: 4, height: 550 * b, background: M.tapeY }} />
      <div style={{ position: "absolute", left: 1080, top: 470, fontFamily: SANS, fontWeight: 700, fontSize: 40, color: M.tapeY, opacity: b }}>2,5 m</div>
      <div style={{ position: "absolute", left: 1240, top: 260, width: 600, display: "flex", flexDirection: "column", gap: 30 }}>
        {rows.map((r, i) => <Big key={i} txt={r.txt} f0={i === 0 ? Math.min(r.f, 6) : r.f} size={i === 0 ? 110 : 66} color={i === 0 ? "#F4F1EA" : "#E3DCCD"} />)}
      </div>
    </AbsoluteFill>
  );
};

// ---------- orden: flecha que sube por la pared y chorreaduras que caen sobre lo ya mojado
export const SubeM: React.FC<{ bg?: string; dur: number }> = ({ bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const up = interpolate(f, [6, 44], [0, 1], { ...CL, easing: ease });
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.4} />
      <div style={{ position: "absolute", left: 700, bottom: 100, width: 520, height: 820 * up, background: "linear-gradient(0deg, rgba(240,225,170,0.55), rgba(240,225,170,0.25))" }} />
      {Array.from({ length: 6 }, (_, i) => { const y = 820 * up; const len = interpolate(f, [20 + i * 4, 50 + i * 4], [0, 120], CL);
        return <div key={i} style={{ position: "absolute", left: 730 + i * 80, bottom: 100 + y - len, width: 8, height: len, borderRadius: 4, background: "rgba(240,225,170,0.8)" }} />; })}
      <div style={{ position: "absolute", left: 940, bottom: 100 + 820 * up - 40, width: 0, height: 0, borderLeft: "50px solid transparent", borderRight: "50px solid transparent", borderBottom: `70px solid ${M.tapeY}` }} />
      <div style={{ position: "absolute", left: 120, top: 380, width: 520 }}><Kick txt="EL ORDEN" /><Big txt="De abajo hacia arriba" f0={10} size={86} /></div>
    </AbsoluteFill>
  );
};

// ---------- chupa: medidor "la pared chupa" que baja hasta "ya no chupa" con cronómetro de 1 minuto
export const ChupaM: React.FC<{ bg?: string; dur: number }> = ({ bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const t = interpolate(f, [8, Math.max(30, dur - 30)], [0, 1], CL); const s = Math.round(t * 60);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.55} />
      <div style={{ position: "absolute", left: 200, top: 200, width: 120, height: 640, borderRadius: 60, background: "rgba(255,255,255,0.12)", overflow: "hidden", border: "5px solid rgba(240,240,236,0.6)" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${100 * (1 - t)}%`, background: `linear-gradient(0deg, ${M.agua}, rgba(127,183,217,0.5))` }} />
      </div>
      <div style={{ position: "absolute", left: 360, top: 200, fontFamily: SANS, fontWeight: 700, fontSize: 30, color: M.agua }}>CHUPA</div>
      <div style={{ position: "absolute", left: 360, top: 800, fontFamily: SANS, fontWeight: 700, fontSize: 30, color: "#F1C27A" }}>YA NO CHUPA</div>
      <div style={{ position: "absolute", left: 900, top: 300, width: 860 }}>
        <Big txt="Brilla más de un minuto" f0={6} size={84} />
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 200, color: t >= 1 ? "#F1C27A" : "#F4F1EA", marginTop: 10, textShadow: tsh }}>0:{String(s).padStart(2, "0")}</div>
        <Kick txt="esa es la señal: pasas al pedazo de al lado" f0={Math.max(30, dur - 30)} color="#F1C27A" />
      </div>
    </AbsoluteFill>
  );
};

// ---------- lámina: la hoja sujeta en una tablilla con pinza; una LUPA redonda viaja a cada foco (no zoom de cámara)
export const LaminaM: React.FC<{ src: string; focus: { x: number; y: number; f: number }[]; dur: number }> = ({ src, focus, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 10); const p = sp(f, 2, 15);
  let cur = focus[0], nxt = focus[0];
  for (let i = 0; i < focus.length; i++) if (f >= focus[i].f) { cur = focus[i]; nxt = focus[i + 1] || focus[i]; }
  const k = nxt === cur ? 1 : cl((f - cur.f) / 18); const W = 1500, H = 844, R = 230, Z = 2;
  const show = f >= focus[0].f && focus.indexOf(cur) < focus.length - 1;
  // deriva lenta continua (hoja que respira + lupa que tiembla en la mano): nunca hay cuadros idénticos
  const drift = 1 + 0.05 * (f / Math.max(1, dur)); const rot = 0.6 * Math.sin(f / 70); const wx = 1.6 * Math.sin(f / 23), wy = 1.2 * Math.cos(f / 29);
  const x = cur.x + wx * k, y = cur.y + wy * k;
  return (
    <AbsoluteFill style={{ opacity: o, background: "#2A2622" }}>
      <div style={{ position: "absolute", left: 210, top: 150, width: W, height: H, transform: `translateY(${(1 - p) * 500}px) scale(${drift}) rotate(${rot}deg)`, boxShadow: "0 30px 60px rgba(0,0,0,0.6)", background: "#F4F0E6", padding: 0 }}>
        <Img src={staticFile(src)} style={{ width: W, height: H, objectFit: "contain" }} />
        <div style={{ position: "absolute", left: W / 2 - 140, top: -70, width: 280, height: 90, borderRadius: 10, background: "linear-gradient(180deg, #CFCFC9, #8F8F8A)", boxShadow: "0 8px 14px rgba(0,0,0,0.5)" }} />
        {show && <div style={{ position: "absolute", left: (x / 100) * W - R, top: (y / 100) * H - R, width: 2 * R, height: 2 * R, borderRadius: "50%", overflow: "hidden", border: "12px solid #1E1B18", boxShadow: "0 20px 40px rgba(0,0,0,0.6)", opacity: k }}>
          <Img src={staticFile(src)} style={{ position: "absolute", width: W * Z, height: H * Z, left: -(x / 100) * W * Z + R, top: -(y / 100) * H * Z + R, objectFit: "contain" }} />
        </div>}
      </div>
    </AbsoluteFill>
  );
};

// ---------- sobrante: barrido de luz rasante que revela parches brillantes y una esponja los levanta
export const RasanteM: React.FC<{ bg?: string; dur: number }> = ({ bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const sw = interpolate(f, [4, 40], [-30, 130], CL); const lev = interpolate(f, [50, 85], [1, 0], CL);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.5} />
      <AbsoluteFill style={{ background: `linear-gradient(100deg, transparent ${sw - 14}%, rgba(255,250,235,0.32) ${sw}%, transparent ${sw + 14}%)` }} />
      {[[400, 300], [880, 520], [1300, 260], [620, 720]].map(([x, y], i) => <div key={i} style={{ position: "absolute", left: x, top: y, width: 240, height: 150, borderRadius: "45% 55% 50% 50%", background: "radial-gradient(ellipse, rgba(255,255,250,0.55), transparent 70%)", opacity: cl((sw / 100) * 1.4 - i * 0.15) * lev }} />)}
      <div style={{ position: "absolute", left: 120, bottom: 120 }}><Kick txt="A LOS 20 MINUTOS" /><Big txt="Lo que brilla, no entró" f0={10} size={80} /></div>
    </AbsoluteFill>
  );
};

// ---------- litros: dos bidones que se vacían, la segunda mano gasta la mitad
export const BidonesM: React.FC<{ bg?: string; dur: number }> = ({ bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const a = interpolate(f, [6, 30], [1, 0], CL), b = interpolate(f, [24, 44], [1, 0.5], CL);
  const bid = (lvl: number, lab: string, sub: string, x: number) => (
    <div style={{ position: "absolute", left: x, top: 260, width: 300 }}>
      <div style={{ position: "relative", height: 420, borderRadius: "30px 30px 16px 16px", border: "6px solid rgba(240,240,236,0.8)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${100 * lvl}%`, background: "linear-gradient(180deg, rgba(240,225,170,0.9), rgba(214,192,120,0.95))" }} />
      </div>
      <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 70, color: "#F4F1EA", textShadow: tsh, marginTop: 16 }}>{lab}</div>
      <div style={{ fontFamily: SANS, fontSize: 30, color: "#DED7CB" }}>{sub}</div>
    </div>);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.7} />
      {bid(a, "1 litro", "primera mano", 520)}{bid(b, "½ litro", "segunda mano", 1100)}
    </AbsoluteFill>
  );
};

// ---------- semana: siete marcas de tiza en la pared, una por día, tachadas de a cinco
export const TizaM: React.FC<{ bg?: string; dur: number; foot?: string }> = ({ bg, dur, foot = "sin pintar, sin colgar nada" }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.62} />
      <div style={{ position: "absolute", left: 420, top: 330, display: "flex", gap: 46 }}>
        {Array.from({ length: 7 }, (_, i) => { const t = cl((f - 6 - i * 5) / 6); const cross = i === 4;
          return <div key={i} style={{ width: 16, height: 300, background: "#F4F1EA", borderRadius: 8, transform: cross ? `rotate(-62deg) translate(130px, -200px) scaleY(${t * 1.9})` : `scaleY(${t})`, transformOrigin: "50% 100%", opacity: 0.9, boxShadow: "0 0 6px rgba(255,255,255,0.4)" }} />; })}
      </div>
      <div style={{ position: "absolute", left: 1220, top: 360 }}><Big txt="7 días" f0={36} size={150} /><Kick txt={foot} f0={46} color="#E6E0D4" /></div>
    </AbsoluteFill>
  );
};

// ---------- respira: corte de pared con tres pinturas; el vapor (bolitas) pasa por la cal y el látex, choca con el esmalte
export const RespiraM: React.FC<{ bg?: string; dur: number }> = ({ bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8);
  const P = [{ t: "A la cal", ok: true, c: "#F3F0E6" }, { t: "Al agua / látex", ok: true, c: "#DCE7EC" }, { t: "Esmalte o goma", ok: false, c: "#8B3A2C" }];
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.78} />
      {P.map((p, i) => { const top = 170 + i * 270;
        return <div key={i} style={{ position: "absolute", left: 160, top, width: 1600, height: 220 }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 520, height: 220, ...revoque(0.15, 100) }} />
          <div style={{ position: "absolute", left: 520, top: 0, width: p.ok ? 18 : 40, height: 220, background: p.c }} />
          {Array.from({ length: 5 }, (_, j) => { const t = ((f - j * 9 - i * 4) % 60) / 60; const x = 60 + t * 860; const stop = !p.ok && x > 500; const xx = stop ? 500 - (j % 3) * 14 : x;
            return <div key={j} style={{ position: "absolute", left: xx, top: 40 + j * 34, width: 22, height: 22, borderRadius: "50%", background: "rgba(220,235,245,0.75)", opacity: stop ? 0.9 : 1 - t * 0.6 }} />; })}
          <div style={{ position: "absolute", left: 1000, top: 30, fontFamily: SERIF, fontWeight: 600, fontSize: 62, color: "#F4F1EA", textShadow: tsh, whiteSpace: "nowrap" }}>{p.t}</div>
          <div style={{ position: "absolute", left: 1000, top: 120 }}><Cinta txt={p.ok ? "RESPIRA" : "AHOGA"} f0={10 + i * 8} rot={0} color={p.ok ? M.ok : M.no} size={44} /></div>
        </div>; })}
    </AbsoluteFill>
  );
};

// ---------- vapor: la ampolla que se infla detrás de una pintura que no deja salir el vapor
export const AmpollaM: React.FC<{ bg?: string; dur: number }> = ({ bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const inf = interpolate(f, [10, 60], [0, 1], { ...CL, easing: ease });
  return (
    <AbsoluteFill style={{ opacity: o, ...revoque(0.2, 30), transform: `scale(${1 + 0.06 * f / Math.max(1, dur)})` }}>
      <div style={{ position: "absolute", left: 560, top: 300, width: 800, height: 420, transform: `scale(${1 + 0.03 * Math.sin(f / 18)})`, transformOrigin: "50% 100%" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 30, background: "#E4DFD4" }} />
        <div style={{ position: "absolute", left: 160, bottom: 20, width: 480, height: 360 * inf, borderRadius: "50% 50% 0 0", background: "radial-gradient(ellipse at 40% 30%, #FFFFFF, #E4DFD4 60%, #BDB6A8)", boxShadow: "0 -10px 30px rgba(0,0,0,0.25)" }} />
        {Array.from({ length: 8 }, (_, j) => { const t = ((f - j * 6) % 40) / 40; return <div key={j} style={{ position: "absolute", left: 220 + j * 48, bottom: 30 + t * 220 * inf, width: 16, height: 16, borderRadius: "50%", background: "rgba(127,183,217,0.7)", opacity: inf }} />; })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center" }}><Big txt="El vapor queda atrapado" f0={6} size={78} color={M.ink} style={{ textShadow: "none" }} /></div>
    </AbsoluteFill>
  );
};

// ---------- cuánto dura: escala de años honesta con una nota al pie (la causa primero)
export const AñosM: React.FC<{ bg?: string; dur: number }> = ({ bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const t = interpolate(f, [6, 40], [0, 1], { ...CL, easing: ease });
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.7} />
      <div style={{ position: "absolute", left: 200, right: 200, top: 470, height: 26, background: "rgba(255,255,255,0.15)", borderRadius: 13 }}>
        <div style={{ width: `${88 * t}%`, height: "100%", borderRadius: 13, background: `linear-gradient(90deg, ${M.agua}, #F1C27A)` }} />
      </div>
      {[0, 2, 5, 10].map((y, i) => <div key={i} style={{ position: "absolute", left: 200 + (y / 11.4) * 1520 - 20, top: 520, fontFamily: SANS, fontWeight: 700, fontSize: 46, color: "#F4EFE4", textShadow: tsh, whiteSpace: "nowrap", opacity: t * 1.2 > y / 10 ? 1 : 0.25 }}>{y} años</div>)}
      <div style={{ position: "absolute", left: 200, top: 260 }}><Big txt="Dura años, no para siempre" f0={4} size={80} /></div>
      <div style={{ position: "absolute", left: 200, top: 690 }}><Cinta txt="primero sacas la causa del agua" f0={30} rot={-1} color={M.tapeY} size={52} style={{ whiteSpace: "nowrap" }} /></div>
    </AbsoluteFill>
  );
};

// ---------- "seca": un globo de mensaje que llega cada vez que llueve (lluvia hecha con trazos)
export const MensajeM: React.FC<{ bg?: string; dur: number }> = ({ bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const p = sp(f, 12, 11);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.6} />
      <AbsoluteFill style={{ background: `repeating-linear-gradient(105deg, transparent 0 34px, rgba(200,220,235,0.18) 34px 36px)`, backgroundPosition: `0 ${f * 18}px` }} />
      <div style={{ position: "absolute", left: 760, top: 380, padding: "40px 80px", background: "#F4F2EC", borderRadius: "40px 40px 40px 6px", transform: `scale(${0.4 + 0.6 * p}) translateY(${(1 - p) * 60}px)`, opacity: p, transformOrigin: "0% 100%", boxShadow: "0 20px 40px rgba(0,0,0,0.45)", fontFamily: SERIF, fontWeight: 700, fontSize: 130, color: M.ink }}>seca.</div>
      <div style={{ position: "absolute", left: 760, top: 700, fontFamily: SANS, fontWeight: 600, fontSize: 44, color: "#F4EFE4", textShadow: tsh, opacity: sp(f, 26, 14) }}>don Ernesto · cada vez que llueve fuerte</div>
    </AbsoluteFill>
  );
};

// ---------- errores: la foto con una X de cinta roja que se pega en dos tiras; k=0 es la portada de la sección
export const CruzM: React.FC<{ k: number; title: string; sub: string; bg?: string; dur: number }> = ({ k, title, sub, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const a = interpolate(f, [4, 14], [0, 1], CL), b = interpolate(f, [10, 20], [0, 1], CL);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.55} />
      {k > 0 && <div style={{ position: "absolute", left: 0, top: 300, width: 110 * a, height: 300, background: M.no, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 700, fontSize: 120, color: "#FBF4EA", overflow: "hidden", boxShadow: "0 10px 24px rgba(0,0,0,0.4)" }}>{b > 0.5 ? k : ""}</div>}
      {false && <>
        <div style={{ position: "absolute", left: 1140, top: 520, width: 640 * a, height: 64, background: M.no, transform: "rotate(38deg)", transformOrigin: "0 50%", marginLeft: -40, boxShadow: "0 6px 12px rgba(0,0,0,0.35)" }} />
        <div style={{ position: "absolute", left: 1640, top: 520, width: 640 * b, height: 64, background: M.no, transform: "rotate(142deg)", transformOrigin: "0 50%", marginLeft: -40, boxShadow: "0 6px 12px rgba(0,0,0,0.35)" }} />
      </>}
      <div style={{ position: "absolute", left: 140, top: 330, width: 1000 }}>
        <Kick txt={k > 0 ? `ERROR ${k} DE 5` : "LO QUE NO TIENES QUE HACER"} color={M.no} />
        <Big txt={title} f0={8} size={k > 0 ? 92 : 110} />
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 50, color: "#F6F1E6", marginTop: 24, textShadow: tsh, opacity: sp(f, 22, 16) }}>{sub}</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- preguntas: gotas que bajan por un vidrio, cada una trae una pregunta
export const GotasQM: React.FC<{ qs: { txt: string; f: number }[]; bg?: string; dur: number }> = ({ qs, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.55} />
      <AbsoluteFill style={{ background: M.glass }} />
      <div style={{ position: "absolute", left: 120, top: 70 }}><Kick txt="ME PREGUNTARON" /></div>
      {qs.map((q, i) => { const t = cl((f - q.f) / 22); const y = 140 + i * 145;
        return <div key={i} style={{ position: "absolute", left: 160 + (i % 2) * 120, top: y - 60 * (1 - t), opacity: t, display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ width: 40, height: 52, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: `radial-gradient(circle at 35% 35%, #fff, ${M.agua} 50%, #2E6C90)` }} />
          <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 56, color: "#F6F3EC", textShadow: tsh }}>{q.txt}</div>
        </div>; })}
    </AbsoluteFill>
  );
};

// ---------- tiempos: una franja de pared que pasa de mojada a seca, con cuatro marcas de lápiz
export const SecadoM: React.FC<{ rows: { a: string; b: string; f: number }[]; foot: string; bg?: string; dur: number }> = ({ rows, foot, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const last = rows[rows.length - 1].f; const dry = interpolate(f, [rows[0].f, last + 20], [0, 1], CL);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.7} />
      <div style={{ position: "absolute", left: 120, right: 120, top: 330, height: 260, background: `linear-gradient(90deg, rgba(225,218,204,1) ${dry * 100}%, ${M.wet} ${dry * 100 + 8}%)` }} />
      {rows.map((r, i) => { const p = sp(f, i === 0 ? Math.min(r.f, 2) : r.f, 15); const x = 160 + i * 420;
        return <div key={i} style={{ position: "absolute", left: x, top: 270, width: 380, opacity: p }}>
          <div style={{ width: 6, height: 380, background: "#2B2723", marginLeft: 10 }} />
          <div style={{ position: "absolute", left: 34, top: 110, fontFamily: SERIF, fontWeight: 700, fontSize: 64, color: f >= r.f + 10 && dry > i / 4 ? M.ink : "#F4F1EA" }}>{r.a}</div>
          <div style={{ position: "absolute", left: 34, top: 190, fontFamily: SANS, fontWeight: 700, fontSize: 38, color: f >= r.f + 10 && dry > i / 4 ? "#3B3630" : "#E6E0D4", width: 330 }}>{r.b}</div>
        </div>; })}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 150, textAlign: "center" }}><Cinta txt={foot} f0={last + 16} size={48} /></div>
    </AbsoluteFill>
  );
};

// ---------- costo: un ticket de ferretería que sale de la impresora renglón por renglón
export const TicketM: React.FC<{ rows: { t: string; v: string; f: number }[]; total?: string; fT?: number; bg?: string; dur: number }> = ({ rows, total, fT = 0, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const n = rows.filter((r) => f >= r.f).length + (total && f >= fT ? 2 : 0);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.7} />
      <div style={{ position: "absolute", left: 610, top: 80, width: 700, height: 40, background: "#2B2826", borderRadius: 10 }} />
      <div style={{ position: "absolute", left: 640, top: 110, width: 640, height: 110 + n * 92, overflow: "hidden", background: "#FBFAF5", boxShadow: "0 20px 40px rgba(0,0,0,0.5)", clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 12px), 96% 100%, 92% calc(100% - 12px), 88% 100%, 84% calc(100% - 12px), 80% 100%, 76% calc(100% - 12px), 72% 100%, 68% calc(100% - 12px), 64% 100%, 60% calc(100% - 12px), 56% 100%, 52% calc(100% - 12px), 48% 100%, 44% calc(100% - 12px), 40% 100%, 36% calc(100% - 12px), 32% 100%, 28% calc(100% - 12px), 24% 100%, 20% calc(100% - 12px), 16% 100%, 12% calc(100% - 12px), 8% 100%, 4% calc(100% - 12px), 0 100%)" }}>
        <div style={{ textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 30, letterSpacing: 6, padding: "30px 0 20px", color: M.ink }}>PARED DE 10 m²</div>
        {rows.map((r, i) => f >= r.f && <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "0 40px", height: 92, alignItems: "center", fontFamily: SANS, fontSize: 36, color: M.ink, borderTop: "2px dashed #CFC9BB" }}><span>{r.t}</span><b>{r.v}</b></div>)}
        {total && f >= fT && <div style={{ display: "flex", justifyContent: "space-between", padding: "40px 40px 0", fontFamily: SERIF, fontWeight: 700, fontSize: 64, color: M.ink, borderTop: "4px solid #1E1B18" }}><span>TOTAL</span><span>{total}</span></div>}
      </div>
    </AbsoluteFill>
  );
};

// ---------- premio: la botella cortada aparece sobre la foto con una cinta "lo que te prometí"
export const PromesaM: React.FC<{ src: string; title: string; sub: string; dur: number }> = ({ src, title, sub, dur }) => {
  const o = useOut(dur, 8);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Photo src={src} seed={21} dur={dur} />
      <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(14,12,10,0.8), transparent 60%)" }} />
      <div style={{ position: "absolute", left: 130, bottom: 140 }}><Cinta txt={sub} f0={4} size={40} /><Big txt={title} f0={12} size={120} style={{ marginTop: 20 }} /></div>
    </AbsoluteFill>
  );
};

// ---------- botella: corte lateral de la botella acostada contra la pared, con el anillo de plastilina y el agua dentro
export const BotellaM: React.FC<{ teaser?: boolean; bg?: string; dur: number }> = ({ teaser, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const p = sp(f, 2, 14); const w = interpolate(f, [16, 40], [0, 0.8], CL);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.7} />
      <div style={{ position: "absolute", left: 300, top: 160, width: 240, height: 760, ...revoque(0.15, 100), boxShadow: "8px 0 20px rgba(0,0,0,0.4)" }} />
      <div style={{ position: "absolute", left: 540, top: 360, width: 700, height: 300, transform: `translateX(${(1 - p) * 400}px)` }}>
        <div style={{ position: "absolute", left: 0, top: -24, width: 40, height: 348, borderRadius: 14, background: "#8D8A84" }} />
        <div style={{ position: "absolute", left: 30, top: 0, width: 520, height: 300, borderRadius: "0 120px 120px 0", border: "6px solid rgba(235,242,246,0.85)", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${100 * w}%`, background: "rgba(127,183,217,0.7)" }} />
        </div>
        <div style={{ position: "absolute", left: 550, top: 110, width: 120, height: 80, borderRadius: "0 30px 30px 0", border: "6px solid rgba(235,242,246,0.85)", background: "#C7C2B8" }} />
        <div style={{ position: "absolute", left: 300, top: -20, width: 10, height: 40, background: "#2B2723" }} />
      </div>
      <div style={{ position: "absolute", left: 560, top: 720, display: "flex", gap: 40, opacity: sp(f, 24, 16) }}>
        <Cinta txt="plastilina" f0={24} color={M.tapeY} size={34} /><Cinta txt="agujerito para llenar" f0={30} color={M.tapeY} size={34} /><Cinta txt="pico tapado" f0={36} color={M.tapeY} size={34} />
      </div>
      {teaser && <div style={{ position: "absolute", right: 120, top: 160 }}><Cinta txt="AL FINAL DEL VIDEO" f0={10} color={M.no} size={46} rot={3} /></div>}
    </AbsoluteFill>
  );
};

// ---------- nivel: la raya de marcador y el agua que baja durante 10 minutos (cronómetro)
export const NivelM: React.FC<{ bg?: string; dur: number }> = ({ bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const t = interpolate(f, [10, Math.max(40, dur - 20)], [0, 1], CL);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.65} />
      {[["Pared cerrada", 0.04, 280, M.ok], ["Le falta una mano", 0.45, 1040, M.no]].map(([lab, drop, x, c], i) => (
        <div key={i} style={{ position: "absolute", left: Number(x), top: 230, width: 600 }}>
          <div style={{ position: "relative", width: 260, height: 480, border: "6px solid rgba(235,242,246,0.85)", borderRadius: "20px 20px 60px 60px", overflow: "hidden", margin: "0 auto" }}>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${85 - 85 * Number(drop) * t}%`, background: "rgba(127,183,217,0.7)" }} />
            <div style={{ position: "absolute", left: 0, right: 0, top: "15%", height: 6, background: "#1E1B18" }} />
          </div>
          <div style={{ textAlign: "center", marginTop: 20 }}><Cinta txt={String(lab)} f0={Math.max(40, dur - 20)} color={String(c)} size={38} /></div>
        </div>
      ))}
      <div style={{ position: "absolute", left: 0, right: 0, top: 90, textAlign: "center", fontFamily: SERIF, fontWeight: 700, fontSize: 90, color: "#F4F1EA", textShadow: tsh }}>{Math.round(t * 10)} min</div>
    </AbsoluteFill>
  );
};

// ---------- antes / después: dos botellas lado a lado (antes se vació, después bajó una uña)
export const DosBotM: React.FC<{ bg?: string; dur: number }> = ({ bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const t = interpolate(f, [8, 50], [0, 1], CL);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.7} />
      {[["ANTES", 0.92], ["A LA SEMANA", 0.03]].map(([lab, d], i) => (
        <div key={i} style={{ position: "absolute", left: 420 + i * 640, top: 200, width: 420, textAlign: "center" }}>
          <Kick txt={String(lab)} f0={4 + i * 10} style={{ marginBottom: 20 }} />
          <div style={{ position: "relative", width: 240, height: 520, margin: "0 auto", border: "6px solid rgba(235,242,246,0.85)", borderRadius: "20px 20px 60px 60px", overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${88 - 88 * Number(d) * t}%`, background: "rgba(127,183,217,0.7)" }} />
          </div>
        </div>
      ))}
    </AbsoluteFill>
  );
};

// ---------- Karsten: dos etiquetas de precio colgando, 100 dólares vs casi nada
export const PreciosM: React.FC<{ bg?: string; dur: number }> = ({ bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.7} />
      {[["tubo de Karsten", "US$ 100", M.no, 4], ["botella + plastilina", "≈ 0", M.ok, 20]].map(([a, b, c, f0], i) => { const p = sp(f, Number(f0), 10);
        return <div key={i} style={{ position: "absolute", left: 300 + i * 700, top: 260, width: 560, transform: `rotate(${(1 - p) * 30 + (i ? 4 : -4)}deg)`, transformOrigin: "10% 0", opacity: cl(p * 2) }}>
          <div style={{ background: "#F3EEE2", borderRadius: "16px 60px 60px 16px", padding: "50px 60px", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
            <div style={{ fontFamily: SANS, fontSize: 34, color: "#6B655C" }}>{a}</div>
            <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 130, color: String(c) }}>{b}</div>
          </div>
        </div>; })}
    </AbsoluteFill>
  );
};

// ---------- pregunta final: tres ladrillos sueltos con las opciones; cada uno se asienta en la hilada
export const VotoM: React.FC<{ opts: string[]; bg?: string; dur: number }> = ({ opts, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Base bg={bg} dur={dur} dim={0.62} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 170, textAlign: "center" }}><Big txt="¿Dónde llora tu pared?" f0={2} size={90} /></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 500, display: "flex", justifyContent: "center", gap: 40 }}>
        {opts.map((t, i) => { const p = sp(f, 10 + i * 7, 12);
          return <div key={i} style={{ width: 460, height: 190, ...ladrillos(), backgroundSize: "auto", background: `linear-gradient(160deg, ${M.lad}, ${M.lad2})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 700, fontSize: 60, color: "#FBF4EA", transform: `translateY(${(1 - p) * 120}px)`, opacity: p, boxShadow: "0 16px 30px rgba(0,0,0,0.5)" }}>{t}</div>; })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 760, textAlign: "center" }}><Kick txt="CUÉNTAMELO EN LOS COMENTARIOS" f0={34} color="#F1C27A" style={{ display: "inline-block" }} /></div>
    </AbsoluteFill>
  );
};

// ---------- overlays sobre el avatar: QR en una placa de revoque al costado; pantalla partida con la foto entrando como un panel de pared
export const QrM: React.FC<{ qr: string; cover: string; dur: number }> = ({ qr, cover, dur }) => {
  const f = useCurrentFrame(); const p = sp(f, 0, 15); const o = useOut(dur, 10);
  return (
    <div style={{ position: "absolute", right: 70, top: 170, width: 600, opacity: o, transform: `translateX(${(1 - p) * 700}px)` }}>
      <div style={{ ...revoque(0), padding: 30, borderRadius: 6, boxShadow: "0 30px 60px rgba(0,0,0,0.55)", display: "flex", gap: 24, alignItems: "center" }}>
        <Img src={staticFile(cover)} style={{ width: 220, height: 300, objectFit: "cover", boxShadow: "0 10px 20px rgba(0,0,0,0.4)" }} />
        <div style={{ flex: 1 }}>
          <Img src={staticFile(qr)} style={{ width: 280, height: 280, background: "#fff", padding: 10 }} />
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 24, color: M.ink, marginTop: 12 }}>Escanea con tu cámara</div>
        </div>
      </div>
      <div style={{ marginTop: -16, marginLeft: 30 }}><Cinta txt="la guía completa · en la descripción" f0={8} size={28} /></div>
    </div>
  );
};
export const PanelM: React.FC<{ src: string; label: string; dur: number }> = ({ src, label, dur }) => {
  const f = useCurrentFrame(); const p = sp(f, 0, 16); const o = useOut(dur, 10);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 900, opacity: o, clipPath: `inset(0 ${100 - 100 * p}% 0 0)` }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 14, background: M.cal2 }} />
      <div style={{ position: "absolute", left: 60, bottom: 80 }}><Cinta txt={label} f0={10} size={36} /></div>
    </div>
  );
};
