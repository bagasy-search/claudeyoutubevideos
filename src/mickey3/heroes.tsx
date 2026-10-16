// ── HÉROES de mickey3 (Mickey's Butcher Shop, video 3: nunca más carne para guiso de bandeja). Claude, 15-oct-2026.
//    Juego PROPIO, distinto del de mickey2: el mundo del MOSTRADOR — etiquetas de pistola de precios que se pegan, cartel pintado
//    en el vidrio de la vidriera (dorado de rotulista), lápiz graso rojo sobre papel de freezer, azulejo blanco del local.
//    Capas: textura real (azulejo / kraft / papel encerado / vidrio) + sombra proyectada + foto real + dato + acento con resorte.
//    Tipografías: 2 familias (Anton = carteles y precios · Permanent Marker = lápiz graso). Paleta: verde del local, dorado, naranja de etiqueta, rojo.
import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadMarker } from "@remotion/google-fonts/PermanentMarker";
import { useT, sp, ez, eo, cl, img, camAt, camStyle, P } from "../lkit/core";

const ANTON = loadAnton("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;
const MARK = loadMarker("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;
const GREEN = "#1E4637", GOLD = "#E0A526", ORANGE = "#F28C28", RED = "#B3262E", PENCIL = "#C62E2E", INK = "#1d1d1b", PAPER = "#FBFAF6", OK = "#2F7A4D";
type B = { t: number; txt: string };
// deriva lenta y continua de todo el componente: nunca un cuadro quieto entre evento y evento (el QC del MP4 lo mide)
const Drift: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ transform: `translate(${10 * Math.sin(f / 37)}px, ${6 * Math.cos(f / 51)}px) scale(${1.03 + 0.012 * Math.sin(f / 45)})` }}>{children}</AbsoluteFill>;
};
const shell = (c: React.ReactNode) => <AbsoluteFill style={{ overflow: "hidden" }}><Drift>{c}</Drift></AbsoluteFill>;

// ── capas base ───────────────────────────────────────────────────────────
const Tex: React.FC<{ k: string; f: number; T: number; dark?: number }> = ({ k, f, T, dark = 0 }) => (
  <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#111" }}>
    <AbsoluteFill style={{ transform: `scale(${1.05 + 0.04 * f / Math.max(1, T)}) translateY(${-10 * f / Math.max(1, T)}px)`, filter: dark ? `brightness(${1 - dark})` : undefined }}>
      <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </AbsoluteFill>
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(255,250,235,0.16) 0%, rgba(255,250,235,0) 45%)" }} />
  </AbsoluteFill>
);
// foto real con borde fino y sombra larga (como un recorte pegado en la pared del local)
const Pic: React.FC<{ k: string; w: number; h: number; x: number; y: number; u: number; rot?: number; f: number; children?: React.ReactNode }> = ({ k, w, h, x, y, u, rot = -1.5, f, children }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: cl(u * 2), transform: `translateX(${(1 - u) * -120}px) rotate(${rot}deg) scale(${0.92 + 0.08 * u})`,
    border: "10px solid #fff", boxShadow: "18px 30px 60px rgba(0,0,0,0.5), 0 4px 10px rgba(0,0,0,0.25)", overflow: "hidden", background: "#777" }}>
    <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.03 + 0.05 * f / 300})` }} />
    {children}
  </div>
);
// etiqueta de pistola de precios: rectángulo con esquinas cortadas, se "pega" (cae, aplasta, rebota)
const Sticker: React.FC<{ txt: string; sub?: string; u: number; x: number; y: number; rot?: number; bg?: string; size?: number; color?: string }> = ({ txt, sub, u, x, y, rot = -6, bg = ORANGE, size = 72, color = "#fff" }) => {
  const s = u <= 0 ? 0 : 1 + 0.6 * (1 - ez(u));
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s})`, opacity: cl(u * 4),
      background: bg, color, fontFamily: ANTON, fontSize: size, letterSpacing: 2, padding: `${size * 0.12}px ${size * 0.4}px`, lineHeight: 1.05, textAlign: "center",
      clipPath: "polygon(6% 0, 94% 0, 100% 14%, 100% 86%, 94% 100%, 6% 100%, 0 86%, 0 14%)", boxShadow: "0 10px 20px rgba(0,0,0,0.35)", whiteSpace: "nowrap" }}>
      {txt}{sub ? <div style={{ fontSize: size * 0.42, letterSpacing: 3, opacity: 0.92 }}>{sub}</div> : null}
    </div>
  );
};
// lápiz graso: texto que se escribe de izquierda a derecha
const Grease: React.FC<{ txt: string; u: number; size: number; color?: string; style?: React.CSSProperties }> = ({ txt, u, size, color = PENCIL, style }) => (
  <div style={{ fontFamily: MARK, fontSize: size, color, whiteSpace: "nowrap", lineHeight: 1.1, paddingRight: "0.3em", clipPath: `inset(-25% ${(100 - 100 * ez(u)) * 1.06 - 6}% -25% -2%)`, ...style }}>{txt}</div>
);
const Stroke: React.FC<{ d: string; u: number; color?: string; w?: number }> = ({ d, u, color = PENCIL, w = 9 }) => (
  <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
    <path d={d} stroke={color} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - eo(u)} />
  </svg>
);
const Check: React.FC<{ u: number; no?: boolean; size?: number }> = ({ u, no, size = 100 }) => (
  <svg width={size} height={size} viewBox="0 0 52 52" style={{ overflow: "visible" }}>
    {no ? <path d="M 10 10 L 42 42 M 42 10 L 10 42" stroke={PENCIL} strokeWidth={8} strokeLinecap="round" fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - eo(u)} />
      : <path d="M 8 28 L 21 40 L 44 12" stroke={OK} strokeWidth={8} strokeLinecap="round" fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - eo(u)} />}
  </svg>
);
// letrero de rotulista dorado (sobre vidrio): letras con filete oscuro y brillo que barre una vez
const SignTxt: React.FC<{ txt: string; u: number; size: number; f: number; color?: string }> = ({ txt, u, size, f, color = GOLD }) => (
  <div style={{ position: "relative", fontFamily: ANTON, fontSize: size, color, letterSpacing: 4, WebkitTextStroke: `${Math.max(2, size / 40)}px #3b2a08`, textShadow: "0 6px 16px rgba(0,0,0,0.5)",
    clipPath: `inset(-20% ${100 - 100 * ez(u)}% -20% -2%)`, whiteSpace: "nowrap" }}>
    {txt}
    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(100deg, transparent ${-30 + f * 2.2}%, rgba(255,255,255,0.55) ${-20 + f * 2.2}%, transparent ${-10 + f * 2.2}%)`, mixBlendMode: "overlay" }} />
  </div>
);

// 1 · la bandeja + etiqueta naranja que se pega en la palabra
export const TrayTag: P<{ k: string; t: number; txt: string; sub: string; bed?: string }> = ({ a, d, k, t, txt, sub, bed = "n_tx_tile" }) => {
  const { f, at } = useT(a);
  return shell(<><Tex k={bed} f={f} T={d} />
    <Pic k={k} w={1200} h={675} x={360} y={200} u={sp(f, 0, 15, 120)} rot={-1} f={f} />
    <Sticker txt={txt} sub={sub} u={cl((f - at(t) - 2) / 9)} x={1440} y={260} rot={8} size={96} />
  </>);
};

// 2 · la pistola de precios: el corte en foto y la etiqueta con el precio que se pega, nombre del corte en lápiz graso
export const PriceGun: P<{ k: string; t: number; price: string; name: string; sub: string; bed?: string }> = ({ a, d, k, t, price, name, sub, bed = "n_tx_kraft" }) => {
  const { f, at } = useT(a);
  return shell(<><Tex k={bed} f={f} T={d} />
    <Pic k={k} w={1060} h={596} x={110} y={240} u={sp(f, 0, 15, 120)} rot={-2} f={f} />
    <div style={{ position: "absolute", left: 1240, top: 300 }}><Grease txt={name} u={cl((f - 4) / 18)} size={Math.min(96, 600 / (name.length * 0.64))} /></div>
    <Sticker txt={price} sub={sub} u={cl((f - at(t)) / 9)} x={1520} y={600} rot={-7} size={150} bg={ORANGE} />
  </>);
};

// 3 · las dos mitades del tupper del bombero: seco vs gomoso; abajo "same pot · same 3 hours"
export const TwoHalves: P<{ l: { k: string; txt: string; t: number }; r: { k: string; txt: string; t: number }; same: B; bed?: string }> = ({ a, d, l, r, same, bed = "n_tx_tile" }) => {
  const { f, at } = useT(a);
  const side = (s: typeof l, i: number) => {
    const u = sp(f, at(s.t), 14, 130);
    return <div key={i} style={{ position: "absolute", left: i ? 980 : 100, top: 140, width: 840, height: 640, opacity: cl(u * 2), transform: `translateY(${(1 - u) * 60}px) rotate(${i ? 1.5 : -1.5}deg)`,
      border: "10px solid #fff", boxShadow: "18px 30px 60px rgba(0,0,0,0.5)", overflow: "hidden" }}>
      <Img src={img(s.k)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.04 + 0.04 * f / Math.max(1, d)})` }} />
      <div style={{ position: "absolute", left: 250, bottom: 90 }}><Sticker txt={s.txt} u={cl((f - at(s.t) - 8) / 9)} x={0} y={0} rot={i ? 4 : -4} size={70} bg={i ? INK : RED} /></div>
    </div>;
  };
  return shell(<><Tex k={bed} f={f} T={d} />{side(l, 0)}{side(r, 1)}
    <div style={{ position: "absolute", left: 0, right: 0, top: 860, display: "flex", justifyContent: "center" }}><Grease txt={same.txt} u={cl((f - at(same.t)) / 16)} size={84} color={INK} /></div>
  </>);
};

// 4 · avance: etiqueta colgante "coming up · trick #4"
export const Teaser: P<{ k: string; n: number; txt: string; t: number; bed?: string }> = ({ a, d, k, n, txt, t, bed = "n_tx_kraft" }) => {
  const { f, at } = useT(a);
  return shell(<><Tex k={bed} f={f} T={d} />
    <Pic k={k} w={980} h={551} x={840} y={260} u={sp(f, 0, 14, 120)} rot={2} f={f} />
    <div style={{ position: "absolute", left: 140, top: 230 }}>
      <Sticker txt="COMING UP" u={cl((f - 2) / 9)} x={190} y={0} rot={-5} size={56} bg={RED} />
      <div style={{ marginTop: 70, fontFamily: ANTON, fontSize: 190, color: INK, letterSpacing: 2, opacity: cl((f - 6) / 8) }}>TRICK #{n}</div>
      <Grease txt={txt} u={cl((f - at(t)) / 18)} size={84} />
    </div>
  </>);
};

// 5 · el año pintado en la vidriera (rotulista) + foto vieja del padre detrás del vidrio
export const YearsSign: P<{ k: string; year: string; t: number; sub: string; bed?: string }> = ({ a, d, k, year, t, sub, bed = "n_tx_glass" }) => {
  const { f, at } = useT(a);
  return shell(<><Tex k={bed} f={f} T={d} />
    <div style={{ position: "absolute", left: 1040, top: 210, width: 760, height: 560, border: "16px solid #F4EFE4", boxShadow: "20px 30px 60px rgba(0,0,0,0.5)", transform: "rotate(2deg)", overflow: "hidden", opacity: cl(f / 10) }}>
      <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </div>
    <div style={{ position: "absolute", left: 130, top: 250 }}>
      <SignTxt txt="SINCE" u={cl((f - 2) / 14)} size={110} f={f} />
      <SignTxt txt={year} u={cl((f - at(t)) / 16)} size={300} f={f} />
      <div style={{ fontFamily: MARK, fontSize: 60, color: "#F4EFE4", marginTop: 6, opacity: cl((f - at(t) - 16) / 10) }}>{sub}</div>
    </div>
  </>);
};

// 6 · capítulo = etiqueta blanca de precio colgada de un hilo sobre el azulejo, con el número grande y el título en lápiz graso
export const TagChapter: P<{ n: number; title: string; k: string; big?: boolean; bed?: string }> = ({ a, d, n, title, k, big, bed = "n_tx_tile" }) => {
  const { f } = useT(a);
  const u = sp(f, 0, 9, 90), sw = Math.sin(f / 14) * 3 * Math.exp(-f / 40);
  return shell(<><Tex k={bed} f={f} T={d} />
    <Pic k={k} w={800} h={450} x={1000} y={330} u={sp(f, 8, 14, 120)} rot={2} f={f} />
    <div style={{ position: "absolute", left: 480, top: -20, transformOrigin: "50% 0", transform: `translateX(-50%) rotate(${(1 - u) * -25 + sw}deg)` }}>
      <div style={{ width: 4, height: 180, background: "#9b8b6e", margin: "0 auto" }} />
      <div style={{ width: 600, background: PAPER, borderRadius: 20, padding: "34px 40px 40px", textAlign: "center", boxShadow: "16px 34px 60px rgba(0,0,0,0.45)", border: `5px solid ${big ? ORANGE : "#d9d2c3"}` }}>
        <div style={{ width: 30, height: 30, borderRadius: 15, background: "#3a3328", margin: "0 auto 10px", boxShadow: "inset 0 3px 4px rgba(0,0,0,0.6)" }} />
        <div style={{ fontFamily: ANTON, fontSize: 64, letterSpacing: 14, color: GREEN }}>TRICK</div>
        <div style={{ fontFamily: ANTON, fontSize: big ? 280 : 240, lineHeight: 0.95, color: big ? ORANGE : INK }}>{n}</div>
        <div style={{ height: 6, background: PENCIL, margin: "16px 30px 20px", transform: `scaleX(${ez((f - 18) / 12)})` }} />
        {(() => {
          const w = title.split(" "); let cut = w.length, best = 1e9;
          if (title.length > 16) for (let i = 1; i < w.length; i++) { const dd = Math.abs(w.slice(0, i).join(" ").length - w.slice(i).join(" ").length); if (dd < best) { best = dd; cut = i; } }
          const L = [w.slice(0, cut).join(" "), w.slice(cut).join(" ")].filter(Boolean), m = Math.max(...L.map((x) => x.length));
          const sz = Math.min(60, 500 / (m * 0.62));
          return L.map((x, i) => <Grease key={i} txt={x} u={cl((f - 14 - i * 14) / 18)} size={sz} color={INK} style={{ display: "inline-block" }} />);
        })()}
      </div>
    </div>
  </>);
};

// 7 · la vaca de la pizarra en lápiz graso: no existe "músculo de guiso"; se iluminan round, sirloin, chuck y brisket en sus palabras
const COW = "M 92 214 L 150 156 L 205 162 L 236 196 L 300 172 L 760 166 Q 826 166 852 192 L 884 232 L 872 362 L 842 382 L 842 522 L 800 522 L 790 404 L 600 404 L 380 404 L 362 522 L 322 522 L 312 392 L 252 364 L 216 302 L 172 292 L 112 282 L 82 244 Z";
const PARTS: Record<string, { d: string; lx: number; ly: number; name: string }> = {
  chuck: { d: "M 236 196 L 300 172 L 420 170 L 420 330 L 244 330 Z", lx: 330, ly: 260, name: "CHUCK" },
  brisket: { d: "M 244 330 L 420 330 L 410 404 L 312 392 L 252 364 Z", lx: 330, ly: 372, name: "BRISKET" },
  sirloin: { d: "M 560 168 L 700 167 L 700 300 L 560 300 Z", lx: 630, ly: 236, name: "SIRLOIN" },
  round: { d: "M 700 167 L 760 166 Q 826 166 852 192 L 884 232 L 872 362 L 842 382 L 790 404 L 700 400 Z", lx: 780, ly: 290, name: "ROUND" },
};
export const CowMap: P<{ none: number; parts: { id: string; t: number }[]; bed?: string }> = ({ a, d, none, parts, bed = "n_tx_kraft" }) => {
  const { f, at } = useT(a);
  const S = 1.55, ox = 180, oy = 120;
  return shell(<><Tex k={bed} f={f} T={d} />
    <div style={{ position: "absolute", left: ox, top: oy, width: 1000 * S, height: 560 * S, background: PAPER, boxShadow: "18px 30px 60px rgba(0,0,0,0.4)", transform: "rotate(-1deg)" }} />
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <g transform={`translate(${ox + 40}, ${oy + 30}) scale(${S * 0.92})`}>
        {parts.map((p, i) => { const P0 = PARTS[p.id]; const u = cl((f - at(p.t)) / 8); return P0 ? <path key={i} d={P0.d} fill={GOLD} opacity={0.75 * u} /> : null; })}
        <path d={COW} fill="none" stroke={INK} strokeWidth={5} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - eo(f / 24)} />
        {Object.values(PARTS).map((P0, i) => <path key={i} d={P0.d} fill="none" stroke={PENCIL} strokeWidth={3} strokeDasharray="10 8" opacity={cl((f - 18) / 10)} />)}
        {parts.map((p, i) => { const P0 = PARTS[p.id]; return P0 ? <text key={i} x={P0.lx} y={P0.ly} fontFamily={ANTON} fontSize={30} fill={INK} textAnchor="middle" opacity={cl((f - at(p.t)) / 6)}>{P0.name}</text> : null; })}
      </g>
    </svg>
    <div style={{ position: "absolute", left: 1150, top: 150, transform: `rotate(-8deg) scale(${f >= at(none) ? 1 + 0.5 * (1 - ez((f - at(none)) / 8)) : 0})`, border: `9px solid ${PENCIL}`, padding: "8px 28px", color: PENCIL, fontFamily: ANTON, fontSize: 70, letterSpacing: 3, background: "rgba(251,250,246,0.85)" }}>NO "STEW" MUSCLE</div>
  </>);
};

// 8 · la bandeja de cerca: etiquetas de qué músculo es cada cubo
export const TrayExpose: P<{ k: string; tags: { t: number; txt: string; x: number; y: number }[] }> = ({ a, d, k, tags }) => {
  const { f, at } = useT(a);
  const cam = camAt(f, at, [{ t: a, s: 1.02, x: 960, y: 540 }, { t: tags[0].t, s: 1.14, x: 980, y: 520 }], 1.4);
  return shell(<>
    <AbsoluteFill style={camStyle(cam)}>
      <div style={{ position: "absolute", width: 1920, height: 1080 }}>
        <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        {tags.map((t, i) => <Sticker key={i} txt={t.txt} u={cl((f - at(t.t)) / 8)} x={t.x} y={t.y} rot={[-6, 5, -3, 7][i % 4]} size={58} bg={[ORANGE, "#fff", GOLD, ORANGE][i % 4]} color={i % 4 === 1 ? INK : "#fff"} />)}
      </div>
    </AbsoluteFill>
    <div style={{ position: "absolute", left: 80, bottom: 70 }}><Grease txt="4 muscles, 1 tray" u={cl((f - at(tags[tags.length - 1].t) - 6) / 16)} size={96} color="#fff" style={{ textShadow: "0 4px 14px rgba(0,0,0,0.9)" }} /></div>
  </>);
};

// 9 · el reloj del guiso: dos barras de tiempo sobre papel de freezer (round 1,5 h · chuck 2,5 h) y un cursor "your pot"
export const CookClock: P<{ round_t: number; chuck_t: number; long_t: number; short_t: number; bed?: string }> = ({ a, d, round_t, chuck_t, long_t, short_t, bed = "n_tx_freezer" }) => {
  const { f, at } = useT(a);
  const X0 = 360, W = 1300, hx = (h: number) => X0 + (W * h) / 3;
  const ru = ez((f - at(round_t)) / 20), cu = ez((f - at(chuck_t)) / 20);
  const cur = f < at(long_t) ? null : f < at(short_t) ? 2.6 * ez((f - at(long_t)) / 20) : 2.6 - 1.1 * ez((f - at(short_t)) / 20);
  const row = (y: number, name: string, done: number, u: number, col: string) => (
    <>
      <div style={{ position: "absolute", left: 120, top: y + 6, fontFamily: ANTON, fontSize: 64, color: INK }}>{name}</div>
      <div style={{ position: "absolute", left: X0, top: y, width: W, height: 90, background: "rgba(0,0,0,0.06)", borderRadius: 8 }} />
      <div style={{ position: "absolute", left: X0, top: y, width: (hx(done) - X0) * u, height: 90, background: col, borderRadius: 8, boxShadow: "0 8px 16px rgba(0,0,0,0.25)" }} />
      <div style={{ position: "absolute", left: hx(done) - 10, top: y - 20, width: 20, height: 130, background: INK, opacity: u }} />
    </>
  );
  return shell(<><Tex k={bed} f={f} T={d} />
    <div style={{ position: "absolute", left: 120, top: 110 }}><Grease txt="when is it tender?" u={cl(f / 16)} size={80} /></div>
    {row(300, "ROUND", 1.5, ru, GOLD)}
    {row(520, "CHUCK", 2.5, cu, GREEN)}
    {[0, 1, 2, 3].map((h) => <div key={h} style={{ position: "absolute", left: hx(h) - 40, top: 680, width: 80, textAlign: "center", fontFamily: ANTON, fontSize: 46, color: INK }}>{h}h</div>)}
    {cur !== null ? <>
      <div style={{ position: "absolute", left: hx(cur) - 4, top: 250, width: 8, height: 400, background: PENCIL }} />
      <div style={{ position: "absolute", left: hx(cur) - 120, top: 770, width: 240, textAlign: "center" }}><Grease txt="your pot" u={1} size={64} /></div>
      <div style={{ position: "absolute", left: 1000, top: 950 }}><Sticker txt={cur > 2 ? "round = sawdust" : "chuck = rubber"} u={1} x={0} y={0} rot={-3} size={64} bg={RED} /></div>
    </> : null}
  </>);
};

// 10 · el cubo que se encoge: 1 pulgada → piedrita gris; círculos que se achican un tercio
export const Shrink: P<{ k: string; a1: number; a2: number; a3: number; bed?: string }> = ({ a, d, k, a1, a2, a3, bed = "n_tx_freezer" }) => {
  const { f, at } = useT(a);
  const s1 = 1 - 0.34 * ez((f - at(a2)) / 30);
  return shell(<><Tex k={bed} f={f} T={d} />
    <Pic k={k} w={760} h={428} x={1040} y={170} u={sp(f, 0, 14, 120)} rot={2} f={f} />
    <div style={{ position: "absolute", left: 200, top: 260, width: 420, height: 420, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 300 * s1, height: 300 * s1, borderRadius: 30, background: `rgb(${Math.round(170 - 60 * (1 - s1) * 3)},${Math.round(50 + 40 * (1 - s1) * 3)},${Math.round(50 + 40 * (1 - s1) * 3)})`, boxShadow: "14px 20px 40px rgba(0,0,0,0.35)", opacity: cl((f - at(a1)) / 8) }} />
    </div>
    <div style={{ position: "absolute", left: 200, top: 720 }}><Grease txt="1 inch" u={cl((f - at(a1)) / 12)} size={84} color={INK} /></div>
    <div style={{ position: "absolute", left: 700, top: 420 }}><Grease txt="→ dries out" u={cl((f - at(a2)) / 14)} size={70} /></div>
    <div style={{ position: "absolute", left: 1040, top: 700 }}><Sticker txt="a little gray pebble" u={cl((f - at(a3)) / 9)} x={360} y={60} rot={-4} size={66} bg={INK} /></div>
  </>);
};

// 11 · lo lindo vs lo feo
export const UglyPretty: P<{ pretty: { k: string; txt: string; t: number }; ugly: { k: string; txt: string; t: number }; bed?: string }> = ({ a, d, pretty, ugly, bed = "n_tx_tile" }) => {
  const { f, at } = useT(a);
  const it = (s: typeof pretty, i: number) => {
    const u = sp(f, at(s.t), 14, 130);
    return <div key={i}>
      <Pic k={s.k} w={800} h={500} x={i ? 1010 : 110} y={170} u={u} rot={i ? 2 : -2} f={f} />
      <div style={{ position: "absolute", left: i ? 1100 : 200, top: 730, display: "flex", alignItems: "center", gap: 18, opacity: cl(u * 2) }}>
        <Check u={cl((f - at(s.t) - 6) / 10)} no={!i} size={96} />
        <Grease txt={s.txt} u={cl((f - at(s.t) - 4) / 14)} size={84} color={i ? OK : PENCIL} />
      </div>
    </div>;
  };
  return shell(<><Tex k={bed} f={f} T={d} />{it(pretty, 0)}{it(ugly, 1)}</>);
};

// 12 · regla y pelota de golf: "1 inch" tachado, "2 inches" en verde
export const CubeRuler: P<{ k: string; no: number; yes: number; ball: number; bed?: string }> = ({ a, d, k, no, yes, ball, bed = "n_tx_kraft" }) => {
  const { f, at } = useT(a);
  return shell(<><Tex k={bed} f={f} T={d} />
    <Pic k={k} w={1000} h={562} x={110} y={240} u={sp(f, 0, 14, 120)} rot={-1.5} f={f} />
    <div style={{ position: "absolute", left: 1230, top: 260 }}>
      <div style={{ position: "relative" }}>
        <Grease txt="1 inch" u={cl((f - at(no)) / 10)} size={110} color={INK} />
        <div style={{ position: "absolute", left: -10, top: 70, height: 12, width: 330 * ez((f - at(no) - 10) / 8), background: PENCIL, transform: "rotate(-5deg)" }} />
      </div>
      <div style={{ marginTop: 40 }}><Grease txt="2 inches" u={cl((f - at(yes)) / 12)} size={140} color={OK} /></div>
      <div style={{ position: "relative", marginTop: 40, height: 10 }}><Sticker txt="golf ball size" u={cl((f - at(ball)) / 9)} x={230} y={30} rot={-4} size={64} bg={GOLD} color={INK} /></div>
    </div>
  </>);
};

// 13 · qué se deja y qué se saca
export const KeepTrim: P<{ keep: { k: string; txt: string; t: number }; trim: { k: string; txt: string; t: number }; bed?: string }> = ({ a, d, keep, trim, bed = "n_tx_freezer" }) => {
  const { f, at } = useT(a);
  const it = (s: typeof keep, i: number) => {
    const u = sp(f, at(s.t), 14, 130);
    return <div key={i}>
      <Pic k={s.k} w={800} h={500} x={i ? 1010 : 110} y={150} u={u} rot={i ? 1.5 : -1.5} f={f} />
      <div style={{ position: "absolute", left: i ? 1060 : 160, top: 720, opacity: cl(u * 2) }}><Sticker txt={s.txt} u={cl((f - at(s.t) - 6) / 9)} x={350} y={40} rot={i ? 3 : -3} size={66} bg={i ? RED : OK} /></div>
    </div>;
  };
  return shell(<><Tex k={bed} f={f} T={d} />{it(keep, 0)}{it(trim, 1)}</>);
};

// 14 · nota de sal sobre papel de freezer: "1 tsp kosher · 1½ lb" + "20 min"
export const SaltNote: P<{ k: string; t: number; wait: number; bed?: string }> = ({ a, d, k, t, wait, bed = "n_tx_freezer" }) => {
  const { f, at } = useT(a);
  return shell(<><Tex k={bed} f={f} T={d} />
    <Pic k={k} w={880} h={495} x={980} y={260} u={sp(f, 0, 14, 120)} rot={2} f={f} />
    <div style={{ position: "absolute", left: 140, top: 260 }}>
      <Grease txt="1 tsp kosher salt" u={cl((f - at(t)) / 18)} size={96} color={INK} />
      <Grease txt="for the 1½ lb" u={cl((f - at(t) - 14) / 14)} size={70} color={INK} style={{ marginTop: 10 }} />
      <div style={{ marginTop: 60 }}><Sticker txt="20 MIN" sub="helps it go in" u={cl((f - at(wait)) / 9)} x={190} y={60} rot={-5} size={96} bg={ORANGE} /></div>
    </div>
  </>);
};

// 15 · la grilla de 12 cubos: la mitad se dora (de rojo a marrón, con borde oscuro), la otra mitad queda cruda y se rotula "raw"
export const HalfGrid: P<{ half: number; raw: number; bed?: string }> = ({ a, d, half, raw, bed = "n_tx_freezer" }) => {
  const { f, at } = useT(a);
  return shell(<><Tex k={bed} f={f} T={d} />
    <div style={{ position: "absolute", left: 300, top: 180, display: "grid", gridTemplateColumns: "repeat(6, 200px)", gap: 30 }}>
      {Array.from({ length: 12 }, (_, i) => {
        const browned = i < 6, u = browned ? ez((f - at(half) - i * 3) / 20) : 0;
        const r = Math.round(176 + (110 - 176) * u), g = Math.round(52 + (60 - 52) * u), b = Math.round(58 + (30 - 58) * u);
        return <div key={i} style={{ width: 200, height: 200, borderRadius: 26, background: `rgb(${r},${g},${b})`, boxShadow: `inset 0 0 0 ${10 * u}px rgba(50,25,10,0.6), 12px 18px 30px rgba(0,0,0,0.3)`,
          opacity: cl((f - i * 1.5) / 8), transform: `scale(${0.9 + 0.1 * ez((f - i * 1.5) / 10)})` }} />;
      })}
    </div>
    <div style={{ position: "absolute", left: 300, top: 640 }}><Grease txt="← half: brown it hard" u={cl((f - at(half) - 8) / 16)} size={72} color={INK} /></div>
    <div style={{ position: "absolute", left: 980, top: 800 }}><Sticker txt="half: RAW" sub="straight into the liquid" u={cl((f - at(raw)) / 9)} x={300} y={40} rot={-4} size={84} bg={RED} /></div>
  </>);
};

// 16 · los dos trabajos: mitad dorada (color y sabor) / mitad cruda (blanda y jugosa)
export const TwoJobs: P<{ a_: { k: string; txt: string; sub: string; t: number }; b_: { k: string; txt: string; sub: string; t: number }; bed?: string }> = ({ a, d, a_, b_, bed = "n_tx_kraft" }) => {
  const { f, at } = useT(a);
  const it = (s: typeof a_, i: number) => {
    const u = sp(f, at(s.t), 14, 130);
    return <div key={i}>
      <Pic k={s.k} w={800} h={500} x={i ? 1010 : 110} y={150} u={u} rot={i ? 2 : -2} f={f} />
      <div style={{ position: "absolute", left: i ? 1060 : 160, top: 700, opacity: cl(u * 2) }}>
        <div style={{ fontFamily: ANTON, fontSize: 84, color: INK }}>{s.txt.toUpperCase()}</div>
        <Grease txt={s.sub} u={cl((f - at(s.t) - 6) / 14)} size={70} color={i ? OK : "#8a4b1e"} />
      </div>
    </div>;
  };
  return shell(<><Tex k={bed} f={f} T={d} />{it(a_, 0)}{it(b_, 1)}</>);
};

// 17 · la frase del padre, en el reverso de un papel de envolver, con la foto vieja al costado
export const Quote: P<{ k: string; t: number; txt: string; txt2: string; t2: number; bed?: string }> = ({ a, d, k, t, txt, txt2, t2, bed = "n_tx_kraft" }) => {
  const { f, at } = useT(a);
  return shell(<><Tex k={bed} f={f} T={d} />
    <Pic k={k} w={640} h={480} x={1180} y={280} u={sp(f, 0, 14, 120)} rot={3} f={f} />
    <div style={{ position: "absolute", left: 130, top: 300, width: 980 }}>
      <div style={{ fontFamily: ANTON, fontSize: 200, color: GOLD, lineHeight: 0.6, opacity: cl(f / 8) }}>“</div>
      {(() => {
        const w = txt.split(" "), h = Math.ceil(w.length / 2), L = [w.slice(0, h).join(" "), w.slice(h).join(" ")];
        const sz = Math.min(80, 960 / (Math.max(...L.map((x) => x.length)) * 0.64));
        return L.map((x, i) => <Grease key={i} txt={x} u={cl((f - at(t) - i * 16) / 16)} size={sz} color={INK} />);
      })()}
      <Grease txt={txt2} u={cl((f - at(t2)) / 12)} size={110} color={PENCIL} style={{ marginTop: 20 }} />
      <div style={{ fontFamily: ANTON, fontSize: 44, letterSpacing: 6, color: GREEN, marginTop: 30, opacity: cl((f - at(t2) - 10) / 10) }}>— POP, DORCHESTER</div>
    </div>
  </>);
};

// 18 · el orden de la harina: tachado "on the raw meat", tilde "on the vegetables", "1 MIN"
export const FlourOrder: P<{ k: string; no: number; yes: number; min_: number; bed?: string }> = ({ a, d, k, no, yes, min_, bed = "n_tx_freezer" }) => {
  const { f, at } = useT(a);
  return shell(<><Tex k={bed} f={f} T={d} />
    <Pic k={k} w={860} h={484} x={1000} y={300} u={sp(f, 0, 14, 120)} rot={2} f={f} />
    <div style={{ position: "absolute", left: 140, top: 240 }}>
      <div style={{ fontFamily: ANTON, fontSize: 80, color: GREEN, letterSpacing: 4, opacity: cl(f / 8) }}>2 TBSP FLOUR</div>
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 40 }}>
        <Check u={cl((f - at(no)) / 10)} no size={86} /><Grease txt="on the raw meat" u={cl((f - at(no)) / 14)} size={70} color={INK} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 30 }}>
        <Check u={cl((f - at(yes)) / 10)} size={86} /><Grease txt="on the vegetables" u={cl((f - at(yes)) / 14)} size={70} color={OK} />
      </div>
      <div style={{ position: "relative", marginTop: 70, height: 10 }}><Sticker txt="1 MIN" sub="then no raw taste" u={cl((f - at(min_)) / 9)} x={170} y={40} rot={-5} size={90} bg={ORANGE} /></div>
    </div>
  </>);
};

// 19 · tazas medidoras que se llenan: té oscuro (1) y caldo (2)
export const Cups: P<{ k: string; cups: { t: number; txt: string; c: string; n?: number }[]; bed?: string }> = ({ a, d, k, cups, bed = "n_tx_kraft" }) => {
  const { f, at } = useT(a);
  let x = 160;
  return shell(<><Tex k={bed} f={f} T={d} />
    <Pic k={k} w={760} h={428} x={1060} y={180} u={sp(f, 0, 14, 120)} rot={2} f={f} />
    {cups.map((c, i) => Array.from({ length: c.n || 1 }, (_, j) => {
      const u = ez((f - at(c.t) - j * 8) / 22), xx = x; x += 250;
      return <div key={`${i}-${j}`} style={{ position: "absolute", left: xx, top: 380, width: 200, height: 260, opacity: cl((f - at(c.t) - j * 8 + 6) / 6) }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "10px 10px 40px 40px", border: "6px solid rgba(255,255,255,0.9)", background: "rgba(255,255,255,0.18)", boxShadow: "12px 18px 30px rgba(0,0,0,0.3)", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${85 * u}%`, background: c.c }} />
        </div>
        <div style={{ position: "absolute", right: -50, top: 60, width: 40, height: 110, border: "6px solid rgba(255,255,255,0.9)", borderLeft: "none", borderRadius: "0 30px 30px 0" }} />
      </div>;
    }))}
    {cups.map((c, i) => <div key={i} style={{ position: "absolute", left: 150, top: 700 + i * 110 }}><Grease txt={c.txt} u={cl((f - at(c.t)) / 16)} size={76} color={i ? INK : "#5a2c14"} /></div>)}
  </>);
};

// 20 · instantánea de la madre (otra textura y otro marco que el de mickey2: foto con esquinas de álbum)
export const Snapshot3: P<{ k: string; caption: string; date: string; t: number; bed?: string }> = ({ a, d, k, caption, date, t, bed = "n_tx_kraft" }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 15, 100);
  const corner = (s: React.CSSProperties) => <div style={{ position: "absolute", width: 70, height: 70, background: "#2a241c", clipPath: "polygon(0 0, 100% 0, 0 100%)", ...s }} />;
  return shell(<><Tex k={bed} f={f} T={d} />
    <div style={{ position: "absolute", left: 960, top: 500, transform: `translate(-50%,-50%) scale(${0.85 + 0.15 * u}) rotate(${2 - 2 * u}deg)`, opacity: cl(u * 2) }}>
      <div style={{ position: "relative", padding: 24, background: "#F2EBDC", boxShadow: "20px 34px 70px rgba(0,0,0,0.5)" }}>
        <div style={{ width: 1100, height: 619, overflow: "hidden" }}><Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.02 + 0.04 * f / Math.max(1, d)})` }} /></div>
        {corner({ left: 0, top: 0 })}{corner({ right: 0, top: 0, transform: "scaleX(-1)" })}{corner({ left: 0, bottom: 0, transform: "scaleY(-1)" })}{corner({ right: 0, bottom: 0, transform: "scale(-1,-1)" })}
      </div>
    </div>
    <div style={{ position: "absolute", left: 420, top: 900 }}><Grease txt={`${caption} · ${date}`} u={cl((f - at(t) - 8) / 20)} size={70} color="#FBFAF6" style={{ textShadow: "0 3px 12px rgba(0,0,0,0.8)" }} /></div>
  </>);
};

// 21 · la línea del líquido: "just to the top" (tilde) vs "swimming = soup" (cruz)
export const LiquidLine: P<{ ok: { k: string; t: number }; no: { k: string; t: number }; bed?: string }> = ({ a, d, ok, no, bed = "n_tx_freezer" }) => {
  const { f, at } = useT(a);
  const it = (s: { k: string; t: number }, i: number, txt: string) => {
    const u = sp(f, at(s.t), 14, 130);
    return <div key={i}>
      <Pic k={s.k} w={800} h={500} x={i ? 1010 : 110} y={170} u={u} rot={i ? 2 : -2} f={f} />
      <div style={{ position: "absolute", left: i ? 1060 : 160, top: 720, display: "flex", alignItems: "center", gap: 16, opacity: cl(u * 2) }}>
        <Check u={cl((f - at(s.t) - 6) / 10)} no={!!i} size={90} /><Grease txt={txt} u={cl((f - at(s.t) - 4) / 14)} size={76} color={i ? PENCIL : OK} />
      </div>
    </div>;
  };
  return shell(<><Tex k={bed} f={f} T={d} />{it(ok, 0, "just to the top")}{it(no, 1, "swimming = soup")}</>);
};

// 22 · recordatorio del video anterior: la sartén debajo, con flecha de lápiz graso y "last video"
export const PanUnder: P<{ k: string; t: number; bed?: string }> = ({ a, d, k, t, bed = "n_tx_kraft" }) => {
  const { f, at } = useT(a);
  return shell(<><Tex k={bed} f={f} T={d} />
    <Pic k={k} w={1100} h={619} x={110} y={230} u={sp(f, 0, 14, 120)} rot={-1.5} f={f} />
    <Stroke d="M 1560 380 C 1440 470 1300 600 1080 700" u={cl((f - at(t)) / 16)} />
    <div style={{ position: "absolute", left: 1330, top: 240 }}><Grease txt="old cast iron pan" u={cl((f - at(t)) / 16)} size={66} color={INK} /></div>
    <div style={{ position: "absolute", left: 1400, top: 800 }}><Sticker txt="LAST VIDEO" u={cl((f - 4) / 9)} x={160} y={0} rot={6} size={60} bg={GREEN} /></div>
  </>);
};

// 23 · verduras en dos tandas: dos fotos con su momento
export const TwoRounds: P<{ r1: { k: string; txt: string; t: number }; r2: { k: string; txt: string; t: number }; bed?: string }> = ({ a, d, r1, r2, bed = "n_tx_freezer" }) => {
  const { f, at } = useT(a);
  const it = (s: typeof r1, i: number) => {
    const u = sp(f, at(s.t), 14, 130);
    return <div key={i}>
      <Pic k={s.k} w={800} h={480} x={i ? 1010 : 110} y={170} u={u} rot={i ? 2 : -2} f={f} />
      <div style={{ position: "absolute", left: i ? 1040 : 140, top: 700, opacity: cl(u * 2) }}>
        <Sticker txt={i ? "ROUND 2" : "ROUND 1"} u={cl((f - at(s.t) - 4) / 9)} x={130} y={20} rot={-4} size={60} bg={i ? ORANGE : GREEN} />
        <Grease txt={s.txt} u={cl((f - at(s.t) - 10) / 16)} size={56} color={INK} style={{ marginTop: 70 }} />
      </div>
    </div>;
  };
  return shell(<><Tex k={bed} f={f} T={d} />{it(r1, 0)}{it(r2, 1)}</>);
};

// 24 · prueba de la cuchara
export const SpoonTest: P<{ no: { k: string; txt: string; sub: string; t: number }; yes: { k: string; txt: string; sub: string; t: number }; bed?: string }> = ({ a, d, no, yes, bed = "n_tx_tile" }) => {
  const { f, at } = useT(a);
  const it = (s: typeof no, i: number) => {
    const u = sp(f, at(s.t), 14, 130);
    return <div key={i}>
      <Pic k={s.k} w={800} h={500} x={i ? 1010 : 110} y={150} u={u} rot={i ? 2 : -2} f={f} />
      <div style={{ position: "absolute", left: i ? 1060 : 160, top: 700, display: "flex", alignItems: "center", gap: 18, opacity: cl(u * 2) }}>
        <Check u={cl((f - at(s.t) - 6) / 10)} no={!i} size={96} />
        <div><div style={{ fontFamily: ANTON, fontSize: 76, color: INK }}>{s.txt.toUpperCase()}</div>
          <Grease txt={s.sub} u={cl((f - at(s.t) - 10) / 12)} size={62} color={i ? OK : PENCIL} /></div>
      </div>
    </div>;
  };
  return shell(<><Tex k={bed} f={f} T={d} />{it(no, 0)}{it(yes, 1)}</>);
};

// 25 · reloj de cocina mecánico (temporizador de perilla) que marca la franja 2:00-2:30
export const Clock3: P<{ k: string; a_: number; b_: number; t: number; bed?: string }> = ({ a, d, k, a_, b_, t, bed = "n_tx_kraft" }) => {
  const { f, at } = useT(a);
  const u = ez((f - at(t)) / 24);
  const ang = (h: number) => (h / 3) * 300 - 150;
  const arc = (h0: number, h1: number, r: number) => { const p = (h: number) => { const q = (ang(h) - 90) * Math.PI / 180; return [300 + r * Math.cos(q), 300 + r * Math.sin(q)]; }; const [x0, y0] = p(h0), [x1, y1] = p(h1); return `M ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1}`; };
  return shell(<><Tex k={bed} f={f} T={d} />
    <Pic k={k} w={760} h={428} x={1060} y={320} u={sp(f, 0, 14, 120)} rot={2} f={f} />
    <svg width={600} height={600} style={{ position: "absolute", left: 230, top: 200, filter: "drop-shadow(16px 24px 30px rgba(0,0,0,0.45))" }}>
      <circle cx={300} cy={300} r={280} fill={PAPER} stroke={GREEN} strokeWidth={22} />
      {[0, 0.5, 1, 1.5, 2, 2.5, 3].map((h) => { const q = (ang(h) - 90) * Math.PI / 180; return <text key={h} x={300 + 215 * Math.cos(q)} y={315 + 215 * Math.sin(q)} fontFamily={ANTON} fontSize={44} fill={INK} textAnchor="middle">{h % 1 ? "" : `${h}h`}</text>; })}
      <path d={arc(a_, a_ + (b_ - a_) * u, 250)} stroke={ORANGE} strokeWidth={36} fill="none" />
      <line x1={300} y1={300} x2={300 + 190 * Math.cos((ang(a_ + (b_ - a_) * u) - 90) * Math.PI / 180)} y2={300 + 190 * Math.sin((ang(a_ + (b_ - a_) * u) - 90) * Math.PI / 180)} stroke={PENCIL} strokeWidth={14} strokeLinecap="round" />
      <circle cx={300} cy={300} r={30} fill={INK} />
    </svg>
    <div style={{ position: "absolute", left: 250, top: 840 }}><Sticker txt="2 – 2½ HOURS" u={cl((f - at(t) - 10) / 9)} x={280} y={20} rot={-3} size={80} bg={ORANGE} /></div>
  </>);
};

// 26 · etiqueta de "si salió mal": papel de freezer con problema tachado en rojo y el arreglo en verde, foto del problema detrás
export const FixTag: P<{ k: string; n: number; prob: string; fix: string; t: number; bed?: string }> = ({ a, d, k, n, prob, fix, t, bed = "n_tx_freezer" }) => {
  const { f, at } = useT(a);
  return shell(<><Tex k={bed} f={f} T={d} />
    <Pic k={k} w={940} h={560} x={90} y={240} u={sp(f, 0, 14, 120)} rot={-2} f={f} />
    <div style={{ position: "absolute", left: 1130, top: 220, width: 700 }}>
      <div style={{ fontFamily: ANTON, fontSize: 56, letterSpacing: 6, color: GREEN, opacity: cl(f / 8) }}>IF IT WENT WRONG · #{n}</div>
      <div style={{ position: "relative", marginTop: 30 }}>
        <Grease txt={prob} u={cl((f - 4) / 16)} size={Math.min(80, 680 / (prob.length * 0.64))} color={INK} />
        <div style={{ position: "absolute", left: -10, top: "50%", height: 10, width: (Math.min(680, prob.length * 0.64 * 80) + 20) * ez((f - at(t) + 4) / 10), background: PENCIL, transform: "rotate(-3deg)" }} />
      </div>
      <div style={{ position: "relative", marginTop: 120, height: 10 }}><Sticker txt={fix.toUpperCase()} u={cl((f - at(t)) / 9)} x={320} y={0} rot={-3} size={64} bg={OK} /></div>
    </div>
  </>);
};

// 27 · el cartelito de la vidriera "NO STEW MEAT · ask Mickey", pintado en el vidrio
export const WindowCard: P<{ k: string; t: number; l1: string; l2: string; bed?: string }> = ({ a, d, k, t, l1, l2, bed = "n_tx_glass" }) => {
  const { f, at } = useT(a);
  return shell(<><Tex k={bed} f={f} T={d} />
    <div style={{ position: "absolute", left: 1180, top: 300, width: 620, height: 420, border: "14px solid #F4EFE4", boxShadow: "16px 26px 50px rgba(0,0,0,0.5)", overflow: "hidden", transform: "rotate(2deg)", opacity: cl(f / 10) }}>
      <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </div>
    <div style={{ position: "absolute", left: 150, top: 330 }}>
      <SignTxt txt={l1} u={cl((f - at(t)) / 18)} size={150} f={f} />
      <div style={{ fontFamily: MARK, fontSize: 110, color: "#F4EFE4", marginTop: 10, opacity: cl((f - at(t) - 16) / 10), textShadow: "0 4px 14px rgba(0,0,0,0.6)" }}>{l2}</div>
    </div>
  </>);
};

// 28 · bandeja $12 contra chuck $9: dos fotos y las etiquetas que se pegan
export const StickerVs: P<{ tray: { k: string; price: string; sub: string; t: number }; chuck: { k: string; price: string; sub: string; t: number }; per: B; bed?: string }> = ({ a, d, tray, chuck, per, bed = "n_tx_kraft" }) => {
  const { f, at } = useT(a);
  const it = (s: typeof tray, i: number) => <div key={i}>
    <Pic k={s.k} w={800} h={500} x={i ? 1010 : 110} y={200} u={sp(f, i ? at(s.t) - 10 : 0, 14, 130)} rot={i ? 2 : -2} f={f} />
    <Sticker txt={s.price} sub={s.sub} u={cl((f - at(s.t)) / 9)} x={i ? 1700 : 760} y={250} rot={i ? -6 : 6} size={110} bg={i ? OK : RED} />
  </div>;
  return shell(<><Tex k={bed} f={f} T={d} />{it(tray, 0)}{it(chuck, 1)}
    <div style={{ position: "absolute", left: 140, top: 760 }}><Grease txt={`tray: ${per.txt}`} u={cl((f - at(per.t)) / 16)} size={70} color={INK} /></div>
  </>);
};

// 29 · la cuenta en lápiz graso sobre papel de freezer + "under $2.50 a bowl" en etiqueta
export const Tally: P<{ k: string; rows: { t: number; txt: string; amt: string; big?: boolean }[]; per: B; bed?: string }> = ({ a, d, k, rows, per, bed = "n_tx_freezer" }) => {
  const { f, at } = useT(a);
  return shell(<><Tex k={bed} f={f} T={d} />
    <Pic k={k} w={760} h={428} x={1080} y={150} u={sp(f, 0, 14, 120)} rot={2} f={f} />
    <div style={{ position: "absolute", left: 140, top: 220, width: 880 }}>
      <Grease txt="chuck, 1½ lb ........ $9" u={cl(f / 14)} size={66} color={INK} />
      {rows.map((r, i) => <div key={i} style={{ marginTop: r.big ? 40 : 20, borderTop: r.big ? `6px solid ${INK}` : undefined, paddingTop: r.big ? 16 : 0 }}>
        <Grease txt={`${r.txt} ........ ${r.amt}`} u={cl((f - at(r.t)) / 16)} size={r.big ? 96 : 60} color={r.big ? PENCIL : INK} />
      </div>)}
    </div>
    <Sticker txt={per.txt.toUpperCase()} u={cl((f - at(per.t)) / 9)} x={1460} y={780} rot={-5} size={92} bg={ORANGE} />
  </>);
};

// 30 · la lista de los 8 trucos en lápiz graso, cada renglón con su tilde
export const MarkerList: P<{ head: string; items: B[]; bed?: string }> = ({ a, d, head, items, bed = "n_tx_freezer" }) => {
  const { f, at } = useT(a);
  return shell(<><Tex k={bed} f={f} T={d} />
    <div style={{ position: "absolute", left: 180, top: 110, fontFamily: ANTON, fontSize: 96, letterSpacing: 8, color: GREEN, opacity: cl(f / 8) }}>{head}</div>
    {items.map((it, i) => <div key={i} style={{ position: "absolute", left: 200, top: 290 + i * 170, display: "flex", alignItems: "center", gap: 30 }}>
      <Check u={cl((f - at(it.t) - 10) / 10)} size={90} />
      <Grease txt={it.txt} u={cl((f - at(it.t)) / 18)} size={96} color={INK} />
    </div>)}
  </>);
};

// 31 · pregunta para comentarios en un ticket de mostrador
export const CommentCard3: P<{ k: string; q: string; t: number; bed?: string }> = ({ a, d, k, q, t, bed = "n_tx_kraft" }) => {
  const { f, at } = useT(a);
  const u = sp(f, Math.max(0, at(t) - 8), 14, 120);
  return shell(<><Tex k={bed} f={f} T={d} />
    <Pic k={k} w={640} h={480} x={1180} y={160} u={sp(f, 0, 14, 120)} rot={3} f={f} />
    <div style={{ position: "absolute", left: 120, top: 280, width: 1000, background: PAPER, padding: "44px 54px", boxShadow: "16px 30px 60px rgba(0,0,0,0.45)", opacity: cl(u * 2), transform: `translateY(${(1 - u) * 60}px) rotate(-1deg)`,
      borderTop: `14px solid ${GREEN}` }}>
      <div style={{ fontFamily: ANTON, fontSize: 46, letterSpacing: 6, color: GREEN }}>MICKEY ASKS · COMMENTS</div>
      <div style={{ fontFamily: MARK, fontSize: 74, color: INK, marginTop: 24, lineHeight: 1.2 }}>{q}</div>
    </div>
  </>);
};
