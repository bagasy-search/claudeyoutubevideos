// ckeggs · componentes nuevos (Claude, 11-oct-2026). Público mayor: planos largos, movimiento lento, texto grande y poco.
// Mismas reglas del kit: a = segundo de entrada, d = cuadros, los tiempos de las props son segundos absolutos de la voz.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { SERIF, LABEL, HAND, fr, cl, ez, eo, lin, img, C, Grade, Grain, Mark, Print, Chip, Bed, Stage, sp } from "./Base";

type P<T> = React.FC<T & { a: number; d: number }>;
const useT = (a: number) => { const f = useCurrentFrame(); return { f, at: (t: number) => fr(t) - fr(a) }; };
const shadowTxt = "0 6px 26px rgba(0,0,0,0.65)";
// fondo a pantalla completa: clip foto3d si existe, si no la foto con empuje lento
const Full: React.FC<{ k: string; vid?: boolean; f: number; d: number; o?: string; dim?: number }> = ({ k, vid, f, d, o = "50% 50%", dim = 0 }) => (
  <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
    <AbsoluteFill style={{ transform: vid ? undefined : `scale(${1.04 + 0.08 * f / Math.max(1, d)})`, transformOrigin: o, filter: dim ? `brightness(${1 - dim})` : undefined }}>
      {vid ? <OffthreadVideo src={staticFile(`clips/${k}.mp4`)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        : <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
    </AbsoluteFill>
  </AbsoluteFill>
);
// palabras que entran en su sílaba (texto cinético grande, abajo a la izquierda); una frase por vez
const Words: React.FC<{ f: number; at: (t: number) => number; words: [string, number][]; size?: number; bottom?: number }> = ({ f, at, words, size = 110, bottom = 140 }) => {
  const G: [string, number][][] = [[]];
  words.forEach((w) => { G[G.length - 1].push(w); if (/[.!?]$/.test(w[0])) G.push([]); });
  const gs = G.filter((g) => g.length);
  const gi = gs.reduce((m, g, i) => (f >= at(g[0][1]) - 2 ? i : m), 0);
  return (
    <div style={{ position: "absolute", left: 120, right: 120, bottom, display: "flex", flexWrap: "wrap", gap: "0 28px" }}>
      {gs[gi].map(([w, t], i) => { const u = sp(f, at(t), 14, 200);
        return <div key={gi + "_" + i} style={{ fontFamily: SERIF, fontWeight: 900, fontSize: size, lineHeight: 1.05, color: C.porc, opacity: u, transform: `translateY(${(1 - u) * 50}px)`, textShadow: "0 8px 30px rgba(0,0,0,0.6)" }}>{w}</div>; })}
    </div>
  );
};

// ── APERTURA: la gota cae sobre el paño (foto 3D), anillo de onda en la palabra "drop", frase cinética ──
export const DropOpen: P<{ k: string; vid?: boolean; words: [string, number][]; ripple: number }> = ({ a, d, k, vid, words, ripple }) => {
  const { f, at } = useT(a);
  const r = (f - at(ripple)) / 26;
  return (
    <AbsoluteFill>
      <Full k={k} vid={vid} f={f} d={d} o="50% 40%" />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,8,14,0) 40%, rgba(10,8,14,0.6) 100%)" }} />
      {r > 0 && r < 1.4 ? [0, 0.25].map((o, i) => { const q = cl(r - o); return q > 0 ? <div key={i} style={{ position: "absolute", left: 960, top: 470, width: 40 + 700 * eo(q), height: (40 + 700 * eo(q)) * 0.36, translate: "-50% -50%", borderRadius: "50%", border: `${5 * (1 - q) + 1}px solid rgba(255,236,190,${0.7 * (1 - q)})` }} /> : null; }) : null}
      <Words f={f} at={at} words={words} />
      <Grade vig={0.35} />
    </AbsoluteFill>
  );
};

// ── LA PUERTA PARTIDA: una línea divide la puerta; mitad con huellas (se marca) / mitad espejo (brillo que barre) ──
export const HalfDoor: P<{ k: string; vid?: boolean; l: number; r: number; same?: number }> = ({ a, d, k, vid, l, r, same }) => {
  const { f, at } = useT(a);
  const line = eo(f / 20), L = sp(f, at(l), 13, 170), Rr = sp(f, at(r), 13, 170), S = same ? sp(f, at(same), 14, 160) : 0;
  const sweep = cl((f - at(r)) / 40);
  return (
    <AbsoluteFill>
      <Full k={k} vid={vid} f={f} d={d} />
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "50%", background: `rgba(192,57,43,${0.16 * L})` }} />
      {sweep > 0 && sweep < 1 ? <div style={{ position: "absolute", top: "-30%", bottom: "-30%", width: "16%", left: `${50 + 50 * sweep - 8}%`, transform: "rotate(10deg)", background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.35), rgba(255,255,255,0))" }} /> : null}
      <div style={{ position: "absolute", left: 958, top: 0, width: 4, height: `${100 * line}%`, background: "repeating-linear-gradient(180deg, #fff 0 26px, rgba(255,255,255,0) 26px 44px)", filter: "drop-shadow(0 0 6px rgba(0,0,0,0.6))" }} />
      <div style={{ position: "absolute", left: 140, top: 130, opacity: L, transform: `translateY(${(1 - L) * 30}px) rotate(-3deg)` }}><Chip txt="FINGERPRINTS" size={64} bg={C.red} color="#fff" /></div>
      <div style={{ position: "absolute", right: 140, top: 130, opacity: Rr, transform: `translateY(${(1 - Rr) * 30}px) rotate(3deg)` }}><Chip txt="LIKE A MIRROR" size={64} /></div>
      {same ? <div style={{ position: "absolute", left: 0, right: 0, bottom: 110, textAlign: "center", opacity: S, fontFamily: HAND, fontSize: 84, color: C.porc, textShadow: shadowTxt }}>same door · same morning</div> : null}
      <Grade vig={0.3} />
    </AbsoluteFill>
  );
};

// ── LA VETA: macro del acero; en t1 entra el roble al lado (misma idea); en t2 flechas que corren sobre las líneas ──
export const GrainMacro: P<{ k: string; oak: string; t1: number; t2: number }> = ({ a, d, k, oak, t1, t2 }) => {
  const { f, at } = useT(a);
  const o = sp(f, at(t1), 15, 100), ar = cl((f - at(t2)) / 12);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${100 - 50 * o}%`, overflow: "hidden" }}>
        <Img src={img(k)} style={{ position: "absolute", width: 1920, height: 1080, left: -240 * o, objectFit: "cover", transform: `scale(${1.05 + 0.06 * f / d})` }} />
        {[0.28, 0.5, 0.72].map((x, i) => (
          <div key={i} style={{ position: "absolute", left: `${x * 100}%`, top: 0, height: "100%", opacity: ar * 0.95 }}>
            <svg width={60} height={1080} style={{ position: "absolute", left: -30, top: 0 }}>
              <path d={`M30 ${60 + ((f * 3 + i * 200) % 700)} l0 260 M10 ${300 + ((f * 3 + i * 200) % 700)} l20 24 l20 -24`} stroke="#fff" strokeWidth={7} fill="none" strokeLinecap="round" opacity={0.85} />
            </svg>
          </div>
        ))}
        <div style={{ position: "absolute", left: 90, bottom: 110 }}><Chip txt="STAINLESS STEEL" size={52} /></div>
      </div>
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "50%", overflow: "hidden", transform: `translateX(${(1 - o) * 100}%)`, borderLeft: "8px solid #FBF5E6" }}>
        <Img src={img(oak)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.1 + 0.05 * f / d})` }} />
        <div style={{ position: "absolute", left: 70, bottom: 110 }}><Chip txt="A PIECE OF OAK" size={52} rot={2} /></div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 80, textAlign: "center", opacity: ar }}><span style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 96, color: C.porc, textShadow: shadowTxt }}>Find the grain first</span></div>
      <Grade vig={0.38} />
      <Grain />
    </AbsoluteFill>
  );
};

// ── HACIA DÓNDE VA LA VETA: flechas grandes que barren arriba-abajo (v) y/o de lado a lado (h) sobre la foto ──
const Arrows: React.FC<{ f: number; dir: "v" | "h"; u: number }> = ({ f, dir, u }) => (
  <AbsoluteFill style={{ opacity: u }}>
    {[0, 1, 2].map((i) => { const p = ((f * 2.2 + i * 90) % 270) / 270;
      const pos = dir === "v" ? { left: 560 + i * 400, top: 140 + p * 620 } : { top: 300 + i * 220, left: 260 + p * 1200 };
      return <svg key={i} width={140} height={140} style={{ position: "absolute", ...pos, transform: dir === "h" ? "rotate(-90deg)" : undefined, opacity: Math.sin(p * Math.PI) }}>
        <path d="M70 10 L70 110 M35 78 L70 118 L105 78" stroke="#fff" strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.6))" }} />
      </svg>; })}
  </AbsoluteFill>
);
export const GrainDir: P<{ k: string; vid?: boolean; v?: number; h?: number; lab?: string }> = ({ a, d, k, vid, v, h, lab }) => {
  const { f, at } = useT(a);
  const V = v != null ? sp(f, at(v), 14, 150) * (h != null && v < h ? 1 - cl((f - at(h)) / 8) : 1) : 0;
  const H = h != null ? sp(f, at(h), 14, 150) : 0;
  return (
    <AbsoluteFill>
      <Full k={k} vid={vid} f={f} d={d} dim={0.15} />
      {V > 0.01 ? <Arrows f={f} dir="v" u={V} /> : null}
      {H > 0.01 ? <Arrows f={f} dir="h" u={H} /> : null}
      {V > 0.01 ? <div style={{ position: "absolute", left: 120, top: 120, opacity: V, transform: `rotate(-3deg) scale(${0.8 + 0.2 * V})` }}><Chip txt="MOST: UP AND DOWN" size={60} /></div> : null}
      {H > 0.01 ? <div style={{ position: "absolute", left: 120, top: v != null ? 240 : 120, opacity: H, transform: `rotate(-2deg) scale(${0.8 + 0.2 * H})` }}><Chip txt={lab || "SOME: SIDE TO SIDE"} size={60} bg={C.lilacDeep} color="#fff" /></div> : null}
      <Grade vig={0.35} />
    </AbsoluteFill>
  );
};

// ── SÍ / NO: dos fotos enmarcadas; la del NO se tacha con sello rojo, la del SÍ recibe el tilde verde ──
export const DoDont: P<{ k: string; yes: { k: string; txt: string; t: number }; no: { k: string; txt: string; t: number } }> = ({ a, d, k, yes, no }) => {
  const { f, at } = useT(a);
  const N = sp(f, at(no.t), 13, 150), Y = sp(f, at(yes.t), 13, 150);
  const card = (x: { k: string; txt: string }, u: number, X: number, good: boolean, R: number) => (
    <div style={{ position: "absolute", left: X, top: 500, translate: "-50% -50%", opacity: cl(u * 2), transform: `translateY(${(1 - u) * 300}px) rotate(${R}deg)` }}>
      <Print k={x.k} w={720} h={460} f={f} />
      <div style={{ position: "absolute", left: "50%", top: "45%", translate: "-50% -50%", width: 180, height: 180, borderRadius: 99, background: good ? C.sage : C.red, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 20px 40px rgba(0,0,0,0.45)", transform: `scale(${eo(cl((f - (good ? at(yes.t) : at(no.t)) - 8) / 8))})` }}>
        <svg width={100} height={100}>{good ? <path d="M18 52 L42 76 L84 26" stroke="#fff" strokeWidth={16} fill="none" strokeLinecap="round" /> : <path d="M22 22 L78 78 M78 22 L22 78" stroke="#fff" strokeWidth={16} strokeLinecap="round" />}</svg>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: -86, textAlign: "center" }}><Chip txt={x.txt} size={44} bg={good ? "#FFFDF4" : C.red} color={good ? C.ink : "#fff"} rot={-R} /></div>
    </div>
  );
  return (
    <Stage f={f} T={d} drift={0.5}>
      <Bed k={k} f={f} T={d} dim={0.55} />
      {card(no, N, 520, false, -2.5)}
      {card(yes, Y, 1400, true, 2)}
      <Grade vig={0.4} />
    </Stage>
  );
};

// ── CUIDADO: cinta de precaución que cruza, rótulo de la página y la frase grande ──
export const Careful: P<{ k: string; vid?: boolean; txt: string; tag: string }> = ({ a, d, k, vid, txt, tag }) => {
  const { f } = useT(a);
  const tp = eo(f / 14), t = sp(f, 10, 14, 150);
  return (
    <AbsoluteFill>
      <Full k={k} vid={vid} f={f} d={d} dim={0.2} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,8,14,0.55) 0%, rgba(10,8,14,0) 45%, rgba(10,8,14,0.55) 100%)" }} />
      <div style={{ position: "absolute", left: -100, top: 70, width: 2200 * tp, height: 74, transform: "rotate(-2deg)", background: "repeating-linear-gradient(-45deg, #F2C230 0 46px, #1E1A14 46px 92px)", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }} />
      <div style={{ position: "absolute", left: 120, top: 190, opacity: t, transform: `translateX(${(1 - t) * -40}px) rotate(-2deg)` }}><Chip txt={tag} size={50} bg="#F2C230" color="#1E1A14" /></div>
      <div style={{ position: "absolute", left: 120, right: 300, bottom: 130, opacity: t, transform: `translateY(${(1 - t) * 40}px)`, fontFamily: SERIF, fontWeight: 900, fontSize: 100, lineHeight: 1.05, color: C.porc, textShadow: shadowTxt }}>{txt}</div>
      <Grade vig={0.3} />
    </AbsoluteFill>
  );
};

// ── ARCHIVO REAL: película de dominio público (4:3) proyectada sobre su propio desenfoque, con temblor de gate y parpadeo;
//    o foto real enmarcada. Rótulo con año/lugar; opcional número grande al costado ──
export const Arc: P<{ src: string; vid?: boolean; cap: string; big?: string; credit?: string }> = ({ a, d, src, vid, cap, big, credit }) => {
  const { f } = useT(a);
  const c = sp(f, 8, 14, 150), b = big ? sp(f, 14, 12, 170) : 0;
  const wx = Math.sin(f * 1.7) * 1.2 + Math.sin(f * 0.37) * 0.8, wy = Math.cos(f * 2.3) * 0.9;
  const fl = 1 + 0.035 * Math.sin(f * 3.1) * Math.sin(f * 0.7);
  const W = big ? 1180 : 1360, H = W * 0.75, X = big ? 690 : 960;
  const media = (st: React.CSSProperties) => vid ? <OffthreadVideo src={staticFile(`arc/${src}.mp4`)} muted style={st} /> : <Img src={img(`img/ckeggs/${src}.jpg`)} style={st} />;
  return (
    <AbsoluteFill style={{ backgroundColor: "#0d0b09", overflow: "hidden" }}>
      <AbsoluteFill style={{ filter: "blur(30px) brightness(0.35) saturate(0.7)", transform: "scale(1.3)" }}>{media({ width: "100%", height: "100%", objectFit: "cover" })}</AbsoluteFill>
      <div style={{ position: "absolute", left: X, top: 540, width: W, height: vid ? H : H, translate: "-50% -50%", transform: `translate(${wx}px, ${wy}px) scale(${1 + 0.03 * f / d})`, boxShadow: "0 50px 100px rgba(0,0,0,0.7)", overflow: "hidden", borderRadius: vid ? 10 : 3, outline: vid ? undefined : "14px solid #FFFDF8" }}>
        <div style={{ width: "100%", height: "100%", filter: `brightness(${fl}) contrast(1.04)` }}>{media({ width: "100%", height: "100%", objectFit: "cover" })}</div>
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)" }} />
      </div>
      <div style={{ position: "absolute", left: X - W / 2 - 20, bottom: 40, opacity: c, transform: `translateY(${(1 - c) * 30}px) rotate(-1.5deg)`, display: "flex", gap: 14, alignItems: "center" }}>
        <Chip txt={vid ? "REAL FOOTAGE" : "REAL PHOTO"} size={30} bg={C.red} color="#fff" rot={0} />
        <Chip txt={cap} size={46} font={HAND} ls={0} rot={0} />
      </div>
      {credit ? <div style={{ position: "absolute", right: 30, bottom: 16, fontFamily: LABEL, fontSize: 20, letterSpacing: 1, color: "rgba(255,255,255,0.55)" }}>{credit}</div> : null}
      {big ? <div style={{ position: "absolute", left: 1330, right: 60, top: 300, textAlign: "center", opacity: b, transform: `scale(${1.25 - 0.25 * b})` }}>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 250, lineHeight: 0.9, color: C.porc, textShadow: shadowTxt }}>{big.split(" ")[0]}</div>
        <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 64, letterSpacing: 12, color: C.lilac }}>{big.split(" ").slice(1).join(" ")}</div>
      </div> : null}
      <Grain />
    </AbsoluteFill>
  );
};


// ── VERSÍCULO: la página de una Biblia antigua; el texto entra despacio, la referencia debajo ──
export const VerseCard: P<{ k: string; verse: string; ref: string; t: number }> = ({ a, d, k, verse, ref, t }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(t), 12, 90), r = sp(f, at(t) + 40, 13, 120);
  return (
    <Stage f={f} T={d} drift={0.4}>
      <Bed k={k} f={f} T={d} dim={0.5} />
      <div style={{ position: "absolute", left: 960, top: 540, translate: "-50% -50%", width: 1420, padding: "110px 130px 100px", boxSizing: "border-box", background: "#F7F0DE", borderRadius: 6,
        boxShadow: "0 60px 110px rgba(0,0,0,0.55)", opacity: cl(u * 2), transform: `translateY(${(1 - u) * 60}px) rotate(-0.6deg)`,
        backgroundImage: "linear-gradient(180deg, rgba(120,90,40,0.06), rgba(120,90,40,0) 30%, rgba(120,90,40,0.07) 100%)" }}>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 70, lineHeight: 1.3, color: "#2B2620", textAlign: "center" }}>{verse}</div>
        <div style={{ marginTop: 56, textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 36, letterSpacing: 8, color: C.lilacDeep, opacity: r, transform: `translateY(${(1 - r) * 20}px)` }}>{ref}</div>
      </div>
      <Grade vig={0.42} />
      <Grain />
    </Stage>
  );
};

// ── LA ORACIÓN: cada frase entra en su palabra, una debajo de la otra, sobre la foto de las manos ──
export const PrayerLines: P<{ k: string; lines: { t: number; txt: string }[]; head?: string }> = ({ a, d, k, lines, head }) => {
  const { f, at } = useT(a);
  const h = sp(f, 0, 12, 110);
  return (
    <Stage f={f} T={d} drift={0.5}>
      <Bed k={k} f={f} T={d} dim={0.55} />
      {head ? <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", opacity: h, fontFamily: LABEL, fontWeight: 700, fontSize: 40, letterSpacing: 14, color: C.lilac }}>{head}</div> : null}
      <div style={{ position: "absolute", left: 0, right: 0, top: 260, bottom: 160, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 18 }}>
        {lines.map((l, i) => { const u = sp(f, at(l.t), 13, 150);
          return <div key={i} style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 100, lineHeight: 1.12, color: C.porc, textAlign: "center", opacity: cl(u * 2), transform: `translateY(${(1 - u) * 36}px)`, textShadow: "0 8px 30px rgba(0,0,0,0.65)" }}>{l.txt}</div>; })}
      </div>
      <Grade vig={0.4} />
      <Grain />
    </Stage>
  );
};


// ── HEROES (UPDATE 5, 11-oct): primeros 60 s con componentes propios, cada beat en su palabra ──
export const HeroPlatter: P<{ k: string; eggs: number[]; big: string; bigT: number; timerT: number }> = ({ a, d, k, eggs, big, bigT, timerT }) => {
  const { f, at } = useT(a);
  const par = (f / Math.max(1, d)) * -26; // paralaje: la bandeja se corre contra el fondo
  const bigU = sp(f, at(bigT), 12, 170), bigS = 0.9 + 0.1 * bigU;
  const tf = Math.max(0, f - at(timerT)); const secs = Math.max(0, 120 - Math.floor(tf / 30));
  const tim = sp(f, at(timerT), 14, 150);
  const mm = Math.floor(secs / 60), ss = String(secs % 60).padStart(2, "0");
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#15110c" }}>
      <AbsoluteFill style={{ transform: `scale(${1.08 + 0.06 * f / Math.max(1, d)})`, filter: "blur(4px) brightness(0.6) saturate(1.1)" }}>
        <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 960, top: 540, width: 1320, height: 600, translate: "-50% -50%", transform: `translateX(${par}px)`, borderRadius: "50%",
        background: "radial-gradient(ellipse at 50% 40%, #ffffff 0%, #f7f4ec 46%, #d9d2c3 78%, #b9b0a0 100%)", border: "14px solid rgba(255,255,255,0.85)", boxShadow: "0 60px 110px rgba(0,0,0,0.6), 0 0 0 4px rgba(255,255,255,0.25), inset 0 -22px 46px rgba(120,100,70,0.3)" }}>
        {eggs.map((et, i) => {
          const u = sp(f, at(et), 13, 180); const col = i % 6, row = Math.floor(i / 6);
          const x = 200 + col * 185, y = 170 + row * 190;
          return (
            <div key={i} style={{ position: "absolute", left: x, top: y, width: 168, height: 110, borderRadius: "50%", opacity: cl(u * 1.6),
              transform: `translateY(${(1 - u) * -90}px) scale(${0.3 + 0.7 * u})`, background: "radial-gradient(circle at 50% 42%, #ffffff 0%, #fbf8f1 66%, #e2d9c8 100%)", boxShadow: "0 16px 26px rgba(60,40,20,0.36)" }}>
              <div style={{ position: "absolute", left: 51, top: 22, width: 66, height: 66, borderRadius: "50%", background: "radial-gradient(circle at 45% 40%, #fff09a, #eab43a 78%)", boxShadow: "inset 0 -4px 8px rgba(160,100,20,0.35)" }} />
              <div style={{ position: "absolute", left: 76, top: 47, width: 10, height: 10, borderRadius: "50%", background: "#c25a1e", opacity: 0.75 }} />
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 960, bottom: 118, translate: "-50% 0", fontFamily: SERIF, fontWeight: 900, fontSize: 168, color: C.porc, textShadow: shadowTxt, letterSpacing: -2,
        opacity: cl(bigU * 1.4), transform: `scale(${bigS})`, whiteSpace: "nowrap" }}>{big}</div>
      <div style={{ position: "absolute", right: 110, top: 96, opacity: cl(tim * 1.3), transform: `translateY(${(1 - tim) * -30}px)` }}>
        <Chip txt={`${mm}:${ss}`} size={96} bg="#FFFDF4" color={C.red} rot={3} font={SERIF} ls={1} />
      </div>
      <Grade warm={1.2} vig={0.42} />
      <Grain />
    </AbsoluteFill>
  );
};

export const HeroCard: P<{ k: string; head: string; page: string; stamp: { t: number; txt: string }; lines: { t: number; txt: string }[]; hd: number }> = ({ a, d, k, head, page, stamp, lines, hd }) => {
  const { f, at } = useT(a);
  const drift = (f / Math.max(1, d)) * 16;
  const hu = sp(f, at(hd), 14, 150);
  const st = sp(f, at(stamp.t), 9, 260), sS = 1.7 - 0.7 * st;
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#15110c" }}>
      <AbsoluteFill style={{ transform: `scale(${1.06 + 0.06 * f / Math.max(1, d)})`, filter: "blur(12px) brightness(0.4) saturate(1.05)" }}>
        <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 960, top: 540, width: 1240, translate: "-50% -50%", transform: `translateY(${-drift}px) rotate(-1.2deg)`,
        background: "linear-gradient(180deg, #fffdf6 0%, #f8f0dc 100%)", borderRadius: 6, padding: "52px 64px 60px", boxShadow: "0 50px 90px rgba(0,0,0,0.55)", color: C.ink }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", opacity: cl(hu * 1.5) }}>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 70, color: C.ink, clipPath: `inset(0 ${(1 - hu) * 100}% 0 0)` }}>{head}</div>
          <Chip txt={page} size={38} bg={C.red} color="#fff" rot={3} />
        </div>
        <div style={{ height: 3, background: C.ink, margin: "44px 0 40px", transformOrigin: "left", transform: `scaleX(${hu})` }} />
        {lines.map((x, i) => {
          const u = sp(f, at(x.t), 16, 170);
          return (
            <div key={i} style={{ fontFamily: HAND, fontSize: 60, lineHeight: 1.45, color: C.ink, clipPath: `inset(0 ${(1 - u) * 100}% 0 0)`, opacity: cl(u * 2) }}>{x.txt}</div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 1290, top: 790, transform: `translate(-50%,-50%) rotate(-8deg) scale(${sS})`, opacity: cl(st * 2.2),
        border: `8px solid ${C.red}`, borderRadius: 10, padding: "14px 28px", background: "rgba(255,253,244,0.0)", fontFamily: SERIF, fontWeight: 900, fontSize: 60, color: C.red,
        textShadow: "0 4px 16px rgba(0,0,0,0.35)", whiteSpace: "nowrap", letterSpacing: 1 }}>{stamp.txt}</div>
      <Grade warm={1.2} vig={0.42} />
      <Grain />
    </AbsoluteFill>
  );
};

export const NEW: Record<string, React.FC<any>> = { DropOpen, HalfDoor, GrainMacro, GrainDir, DoDont, Careful, Arc, VerseCard, PrayerLines, HeroPlatter, HeroCard };
