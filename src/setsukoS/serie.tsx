// serie Setsuko (02-07) · escenas y piezas de la lista. Todo es función pura de t (segundos), como en setsuko01.
// Look: papel washi + tinta sumi + sello hanko + tela teñida en índigo (aizome) para los cambios de capítulo.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, staticFile } from "remotion";
import { C, D, Hanko, P, Palabras, Pincel, SANS, SERIF, Washi, cl, e, eo, h, lerp, sm, spr, swing, tela } from "./lib";

type SP = { t: number; a: number; b: number; arg?: string };
type OP = { t: number; a: number; b: number } & Record<string, any>;
const KAN = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
const cap: React.CSSProperties = { fontFamily: SANS, fontWeight: 400, letterSpacing: "0.3em", textTransform: "uppercase" };
const sombra = "0 4px 30px rgba(0,0,0,.65), 0 1px 2px rgba(0,0,0,.6)";
const papel: React.CSSProperties = { background: "linear-gradient(180deg,#f8f4ea,#eee7d8)", boxShadow: "0 18px 40px rgba(15,10,0,.35)" };
const sale = (t: number, b: number, d = 0.35) => 1 - e(t, b - d, b);
const N = () => D.items.length;
const src = (f: string) => staticFile(P + f);
const esVideo = (f?: string) => !!f && f.endsWith(".mp4");

// fondo de material real desenfocado (foto o clip)
const Desenfoque: React.FC<{ f?: string; dark?: number }> = ({ f, dark = 0.45 }) => {
  const st: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover", filter: `blur(20px) brightness(${1 - dark}) saturate(.85)`, transform: "scale(1.15)" };
  if (!f) return <Washi />;
  return <AbsoluteFill style={{ overflow: "hidden", background: C.sumi }}>{esVideo(f) ? <OffthreadVideo src={src(f)} muted playbackRate={0.5} style={st} /> : <Img src={src(f)} style={st} />}</AbsoluteFill>;
};

// tarjeta de un ítem (foto + número kanji en sello + título), para el carrusel y el repaso
const Ficha: React.FC<{ i: number; w: number; dim?: number; check?: number; t?: number; at?: number }> = ({ i, w, dim = 0, check = 0 }) => {
  const it = D.items[i];
  return <div style={{ width: w, ...papel, padding: w * 0.035, paddingBottom: w * 0.03, borderRadius: 3, position: "relative" }}>
    <div style={{ width: "100%", height: w * 0.64, overflow: "hidden", position: "relative", background: C.sumi }}>
      <Img src={src(it.f)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `grayscale(${dim}) brightness(${1 - dim * 0.35})` }} />
      <div style={{ position: "absolute", left: w * 0.035, top: w * 0.035, width: w * 0.17, height: w * 0.17, borderRadius: w * 0.025, border: `${Math.max(2, w * 0.009)}px solid ${C.hanko}`, background: "rgba(248,244,234,.9)",
        color: C.hanko, fontFamily: SERIF, fontWeight: 500, fontSize: w * 0.1, display: "flex", alignItems: "center", justifyContent: "center", transform: "rotate(-5deg)" }}>{KAN[it.n] || it.n}</div>
    </div>
    <div style={{ display: "flex", alignItems: "baseline", gap: w * 0.035, marginTop: w * 0.04, minHeight: w * 0.2 }}>
      <span style={{ fontFamily: SANS, fontWeight: 500, fontSize: w * 0.05, color: C.hanko, letterSpacing: 2 }}>{String(it.n).padStart(2, "0")}</span>
      <span style={{ fontFamily: SERIF, fontWeight: 500, fontSize: w * 0.082, color: C.sumi, lineHeight: 1.08, opacity: 1 - dim * 0.5 }}>{it.t}</span>
    </div>
    {check > 0 && <div style={{ position: "absolute", right: -w * 0.06, top: -w * 0.06, opacity: cl(check * 2) }}>
      <div style={{ width: w * 0.24, height: w * 0.24, borderRadius: w * 0.04, border: `${w * 0.012}px solid ${C.hanko}`, color: C.hanko, background: "rgba(248,244,234,.85)", display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: SERIF, fontSize: w * 0.12, transform: `scale(${lerp(2, 1, check)}) rotate(${lerp(-30, -8, check)}deg)`, mixBlendMode: "multiply" }}>済</div>
    </div>}
  </div>;
};

// (1) CARRUSEL: las N tarjetas giran en un aro 3D sobre material desenfocado y terminan en abanico
export const Carrusel: React.FC<SP> = ({ t, a, b }) => {
  const n = N(), dur = b - a, k = t - a, fan = sm((k - dur * 0.6) / 1.2), rot = -k * 16.5;
  const R = 760, PR = 1250, w = 340;
  return <AbsoluteFill>
    <Desenfoque f={D.bg} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, rgba(20,14,8,0) 30%, rgba(20,14,8,.55) 100%)" }} />
    <div style={{ position: "absolute", top: 58, width: "100%", textAlign: "center", opacity: eo(t, a, 0.6), transform: `translateY(${(1 - eo(t, a, 0.6)) * -30}px)` }}>
      <div style={{ ...cap, fontSize: 24, color: "#f1d9a8", textShadow: sombra }}>{D.lista_sub || "today, one by one"}</div>
      <div style={{ fontFamily: SERIF, fontSize: 92, color: "#fbf8f1", textShadow: sombra, lineHeight: 1.05, marginTop: 8 }}>{D.lista_titulo}</div>
    </div>
    <AbsoluteFill style={{ perspective: 2200, perspectiveOrigin: "50% 42%" }}>
      {D.items.map((_, i) => {
        const ap = cl(spr(t, a + 0.15 + i * 0.16, 1.2));
        const th = ((((i * 360) / n + rot) % 360) + 540) % 360 - 180, rad = (th * Math.PI) / 180;
        const rx = R * Math.sin(rad), rz = R * (Math.cos(rad) - 1);
        const phi = -40 + (i * 80) / Math.max(1, n - 1), pr = (phi * Math.PI) / 180;
        const x = lerp(rx, PR * Math.sin(pr), fan), y = lerp(60, PR * (1 - Math.cos(pr)) + 40, fan), z = lerp(rz, i * 2, fan);
        const vis = lerp(cl(0.25 + 0.75 * Math.cos(rad), 0.12, 1), 1, fan);
        return <div key={i} style={{ position: "absolute", left: 960 - w / 2, top: 360, zIndex: Math.round(3000 + z), opacity: vis * ap,
          transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${lerp(th, 0, fan)}deg) rotateZ(${lerp(0, phi, fan)}deg) scale(${lerp(1, 0.84, fan) * ap})` }}><Ficha i={i} w={w} /></div>;
      })}
    </AbsoluteFill>
  </AbsoluteFill>;
};

// (10) REPASO: las tarjetas del carrusel en grilla; cada una recibe el sello 済 ("hecho") sobre su palabra
export const Repaso: React.FC<SP> = ({ t, a }) => {
  const n = N(), cols = n <= 8 ? 4 : 5, w = n <= 8 ? 360 : 300, gx = n <= 8 ? 420 : 350, gy = n <= 8 ? 400 : 400;
  const marcas: number[] = (D as any).repaso || [];
  return <AbsoluteFill>
    <Desenfoque f={D.bg} dark={0.5} />
    <div style={{ position: "absolute", top: 46, width: "100%", textAlign: "center", fontFamily: SERIF, fontSize: 70, color: "#fbf8f1", textShadow: sombra, opacity: eo(t, a, 0.5) }}>{D.repaso_titulo || D.lista_titulo}</div>
    {D.items.map((_, i) => {
      const c = i % cols, r = Math.floor(i / cols), rows = Math.ceil(n / cols), x0 = 960 - ((Math.min(cols, n) - 1) * gx) / 2 - w / 2, y0 = rows > 1 ? 185 : 340;
      const en = cl(spr(t, a + i * 0.08, 1.1)), at = marcas[i] ?? a + 1 + i * 0.6, lit = t >= at, ck = cl(spr(t, at, 1.4));
      const pop = lit ? 1 + 0.07 * Math.max(0, 1 - (t - at) / 0.35) : 1;
      return <div key={i} style={{ position: "absolute", left: x0 + c * gx, top: y0 + r * gy, opacity: en, transform: `translateY(${(1 - en) * 60}px) rotate(${((h(i, 40) * 7) | 0) * 0.5 - 1.5}deg) scale(${(lit ? 1 : 0.94) * pop})` }}>
        <Ficha i={i} w={w} dim={lit ? 0 : 0.85} check={lit ? ck : 0} />
      </div>;
    })}
  </AbsoluteFill>;
};

// tela índigo (aizome) que barre la pantalla entre capítulos; dir alterna izq/der/abajo
export const Tela: React.FC<OP> = ({ t, a, dir = 0 }) => {
  const d = 0.75, p = cl((t - a) / d); if (p <= 0 || p >= 1) return null;
  const pos = lerp(-1.25, 1.25, sm(p)), v = dir === 2;
  const base: React.CSSProperties = { position: "absolute", ...tela(C.ai), boxShadow: "0 0 80px rgba(0,0,0,.5)" };
  return <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
    <div style={{ ...base, ...(v ? { left: -100, right: -100, height: 1500, top: 540 + pos * 1300 - 750 } : { top: -100, bottom: -100, width: 2400, left: 960 + (dir === 1 ? -1 : 1) * pos * 2300 - 1200 }),
      transform: `rotate(${v ? 2 : -3}deg)`, borderRadius: 30 }}>
      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(90deg, rgba(255,255,255,.06) 0 2px, transparent 2px 46px), radial-gradient(60% 50% at 40% 50%, rgba(255,255,255,.12), transparent 70%)" }} />
      <div style={{ position: "absolute", ...(v ? { top: 30, left: 0, right: 0, height: 6 } : { left: 40, top: 0, bottom: 0, width: 6 }), background: "rgba(240,230,210,.55)" }} />
    </div>
  </AbsoluteFill>;
};

// (3) APERTURA de cada ítem: un mecanismo distinto por número (noren, sumi, papel que se despliega, sello vertical)
export const Apertura: React.FC<SP> = ({ t, a, b, arg }) => {
  const i = Number(arg) - 1, it = D.items[i], k = t - a, dur = b - a, modo = i % 4, der = i % 2 === 1;
  const zoom = 1.06 + 0.07 * cl(k / (dur + 0.4)), foto = <Img src={src(it.f)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})`, transformOrigin: `${der ? 35 : 65}% 45%` }} />;
  const lado: React.CSSProperties = der ? { right: 130, alignItems: "flex-end", textAlign: "right" } : { left: 130, alignItems: "flex-start" };
  const titulo = <div style={{ position: "absolute", top: 210, width: 880, display: "flex", flexDirection: "column", ...lado }}>
    <div style={{ ...cap, fontSize: 26, color: "#f1d9a8", textShadow: sombra, opacity: eo(t, a + 0.3, 0.4) }}>{D.item_rotulo || "number"} · {KAN[it.n]}</div>
    <svg width="520" height="300" viewBox="0 0 520 300" style={{ overflow: "visible" }}>
      <text x={der ? 520 : 0} y="262" textAnchor={der ? "end" : "start"} fontFamily={SERIF} fontSize="300" fill={`rgba(251,248,241,${eo(t, a + 1.1, 0.4)})`} stroke="#fbf8f1" strokeWidth={3}
        strokeDasharray={1400} strokeDashoffset={1400 * (1 - eo(t, a + 0.35, 0.9))}>{String(it.n).padStart(2, "0")}</text>
    </svg>
    <Palabras t={t} at={a + 0.9} txt={it.t} gap={0.14} style={{ fontFamily: SERIF, fontSize: 84, color: "#fbf8f1", textShadow: sombra, lineHeight: 1.08, justifyContent: der ? "flex-end" : "flex-start", maxWidth: 880 }} />
    {it.sub && <div style={{ ...cap, fontSize: 24, color: "#fbf8f1", textShadow: sombra, marginTop: 18, opacity: eo(t, a + 1.6, 0.5) }}>{it.sub}</div>}
    <div style={{ height: 4, background: C.hanko, marginTop: 18, width: 260 * eo(t, a + 1.4, 0.5) }} />
  </div>;
  const velo = <AbsoluteFill style={{ background: `linear-gradient(${der ? 270 : 90}deg, rgba(16,12,8,.86) 0%, rgba(16,12,8,.42) 45%, rgba(16,12,8,0) 72%)` }} />;
  if (modo === 0) { // noren: dos paños índigo con el kanji se abren hacia los lados
    const p = eo(t, a + 0.1, 0.9);
    return <AbsoluteFill style={{ background: C.sumi }}>{foto}{velo}{titulo}
      {[0, 1].map((s) => <div key={s} style={{ position: "absolute", top: -20, height: 760, width: 980, [s ? "right" : "left"]: 0, ...tela(C.ai), transformOrigin: s ? "100% 0" : "0 0",
        transform: `translateX(${(s ? 1 : -1) * p * 1000}px) rotate(${(s ? 1 : -1) * p * 6}deg)`, borderBottom: "10px solid #1a2d48", display: "flex", alignItems: "center", justifyContent: s ? "flex-start" : "flex-end",
        fontFamily: SERIF, fontSize: 260, color: "rgba(240,232,214,.9)" }}><span style={{ margin: "0 60px" }}>{s ? "" : KAN[it.n]}</span></div>)}
    </AbsoluteFill>;
  }
  if (modo === 1) { // pincelada sumi que pinta la foto en una franja y después la abre entera
    const p = eo(t, a + 0.05, 0.7), q = eo(t, a + 0.8, 0.6);
    return <AbsoluteFill style={{ background: C.washi }}><Washi />
      <AbsoluteFill style={{ clipPath: `inset(${lerp(40, 0, q)}% ${lerp(100 - p * 100, 0, q)}% ${lerp(40, 0, q)}% 0)` }}>{foto}{velo}</AbsoluteFill>
      {titulo}
    </AbsoluteFill>;
  }
  if (modo === 2) { // papel doblado en tres que se despliega (como el envoltorio tatoshi de un kimono)
    const ps = [0, 1, 2].map((j) => eo(t, a + 0.1 + j * 0.28, 0.5));
    return <AbsoluteFill style={{ background: C.washi }}><Washi />
      <AbsoluteFill style={{ perspective: 1800 }}>
        {[0, 1, 2].map((j) => <div key={j} style={{ position: "absolute", top: 0, bottom: 0, left: j * 640, width: 641, overflow: "hidden", transformOrigin: j === 0 ? "100% 50%" : j === 2 ? "0 50%" : "50% 50%",
          transform: j === 1 ? `scaleY(${lerp(0.6, 1, ps[0])})` : `rotateY(${(j === 0 ? 1 : -1) * (1 - ps[j]) * 100}deg)`, opacity: j === 1 ? ps[0] : cl(ps[j] * 1.5), boxShadow: "0 0 50px rgba(0,0,0,.3)" }}>
          <div style={{ position: "absolute", top: 0, left: -j * 640, width: 1920, height: 1080 }}>{foto}{velo}</div>
        </div>)}
      </AbsoluteFill>
      {titulo}
    </AbsoluteFill>;
  }
  // modo 3: el sello cae en el centro del papel, la foto se abre en círculo desde el sello
  const r = eo(t, a + 0.55, 0.9) * 130;
  return <AbsoluteFill style={{ background: C.washi }}><Washi />
    <AbsoluteFill style={{ clipPath: `circle(${r}% at ${der ? 70 : 30}% 50%)` }}>{foto}{velo}</AbsoluteFill>
    {t < a + 1.2 && <Hanko t={t} at={a + 0.3} x={der ? 1344 : 576} y={540} size={240} txt={KAN[it.n]} />}
    {titulo}
  </AbsoluteFill>;
};

// (7) MAPA de Kyoto: imagen gpt del barrio con coordenadas en %; la ruta se traza entre los puntos
export const Mapa: React.FC<SP> = ({ t, a, b, arg }) => {
  const R = ((D as any).rutas || {})[arg || "0"]; if (!R) return <Washi />;
  const pts: { x: number; y: number; en: string; jp?: string }[] = R.p, k = t - a, dur = b - a;
  const xs = pts.map((p) => p.x), ys = pts.map((p) => p.y), cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2;
  const span = Math.max(Math.max(...xs) - Math.min(...xs), (Math.max(...ys) - Math.min(...ys)) * 1.78, 8), zEnd = Math.min(3, Math.max(1, 55 / span));
  const q = sm(k / 1.4), z = lerp(zEnd * 1.35, zEnd, q) * (1 + 0.012 * k), tx = (50 - cx) * 19.2, ty = (50 - cy) * 10.8;
  const P2 = pts.map((p) => [p.x * 19.2, p.y * 10.8]);
  let d = `M${P2[0][0]} ${P2[0][1]}`; for (let j = 1; j < P2.length; j++) { const [x0, y0] = P2[j - 1], [x1, y1] = P2[j]; d += ` Q${(x0 + x1) / 2 - (y1 - y0) * 0.2} ${(y0 + y1) / 2 + (x1 - x0) * 0.2} ${x1} ${y1}`; }
  const line = eo(t, a + 0.5, Math.max(1, dur * 0.55));
  return <AbsoluteFill style={{ background: C.washi, overflow: "hidden", opacity: sale(t, b, 0.25) }}>
    <AbsoluteFill style={{ transform: `scale(${z}) translate(${tx}px, ${ty}px)` }}>
      <Img src={src((D as any).mapa || "g/mapa.jpg")} style={{ width: "100%", height: "100%", objectFit: "fill", filter: "sepia(.15)" }} />
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <path d={d} fill="none" stroke={C.hanko} strokeWidth={7 / z} strokeLinecap="round" pathLength={1000} strokeDasharray={1000} strokeDashoffset={1000 * (1 - line)} opacity={0.92} />
        {P2.map(([x, y], j) => { const on = cl(spr(t, a + 0.5 + (j / Math.max(1, P2.length - 1)) * Math.max(1, dur * 0.55), 1.3)); return <g key={j}><circle cx={x} cy={y} r={(13 / z) * on} fill={j === 0 ? C.hanko : C.ai} /><circle cx={x} cy={y} r={(30 / z) * on} fill="none" stroke={C.hanko} strokeWidth={3 / z} opacity={0.45} /></g>; })}
      </svg>
      {pts.map((p, j) => { const on = eo(t, a + 0.6 + (j / Math.max(1, pts.length - 1)) * Math.max(1, dur * 0.55), 0.4); return <div key={j} style={{ position: "absolute", left: P2[j][0], top: P2[j][1], opacity: on, transform: `scale(${1 / z}) translate(30px, -115%)`, transformOrigin: "0 0", whiteSpace: "nowrap", ...papel, padding: "4px 18px", borderRadius: 3, display: "flex", gap: 14, alignItems: "baseline" }}>
        <span style={{ fontFamily: SERIF, fontSize: 52, color: C.sumi }}>{p.en}</span>{p.jp && <span style={{ fontFamily: SERIF, fontSize: 40, color: C.hanko }}>{p.jp}</span>}
      </div>; })}
    </AbsoluteFill>
    {R.titulo && <div style={{ position: "absolute", left: 80, bottom: 70, ...cap, fontSize: 24, color: C.sumi, opacity: eo(t, a + 0.3, 0.5), ...papel, padding: "14px 26px" }}>{R.titulo}</div>}
  </AbsoluteFill>;
};

// (8) ÁLBUM: la foto de época sale de un sobre de papel y queda pegada con cinta en una página
export const Album: React.FC<SP> = ({ t, a, b, arg }) => {
  const [f, leyenda] = String(arg).split("|"), k = t - a, dur = b - a, r = (h(Number(a * 10) | 0, 3) < 0.5 ? -1 : 1) * 2.2;
  const sube = eo(t, a + 0.1, 0.9), cinta = (s: React.CSSProperties) => <div style={{ position: "absolute", width: 150, height: 44, background: "rgba(236,226,204,.82)", boxShadow: "0 2px 6px rgba(0,0,0,.18)", ...s }} />;
  return <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #4a3a2c 0%, #2a2019 70%, #1c1510 100%)", overflow: "hidden" }}>
    <AbsoluteFill style={{ transform: `scale(${1 + 0.05 * (k / dur)})` }}>
      <div style={{ position: "absolute", left: 360, top: 120 + (1 - sube) * 520, width: 1200, padding: "28px 28px 90px", background: "#f1e9d6", transform: `rotate(${r * sube}deg)`, boxShadow: "0 36px 80px rgba(0,0,0,.6)" }}>
        <div style={{ width: 1144, height: 700, overflow: "hidden", position: "relative" }}>
          <Img src={src(f)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "sepia(.3) contrast(1.02)" }} />
          <AbsoluteFill style={{ boxShadow: "inset 0 0 120px rgba(40,25,10,.45)" }} />
        </div>
        {leyenda && <div style={{ position: "absolute", bottom: 22, left: 40, fontFamily: SERIF, fontSize: 44, color: C.sumi, opacity: eo(t, a + 1.2, 0.5) }}>{leyenda}</div>}
        {cinta({ left: -48, top: -12, transform: "rotate(-38deg)", opacity: eo(t, a + 0.9, 0.2) })}
        {cinta({ right: -48, top: -12, transform: "rotate(38deg)", opacity: eo(t, a + 1.0, 0.2) })}
      </div>
      {/* el sobre, delante, se queda abajo */}
      <div style={{ position: "absolute", left: 300, top: 760 + (sube > 0.95 ? (sube - 0.95) * 4000 : 0), width: 1320, height: 420, background: "linear-gradient(180deg,#d9c9a6,#c8b48c)", boxShadow: "0 -10px 40px rgba(0,0,0,.4)",
        clipPath: "polygon(0 0, 50% 22%, 100% 0, 100% 100%, 0 100%)", opacity: 1 - e(t, a + 1.0, a + 1.4) }} />
    </AbsoluteFill>
  </AbsoluteFill>;
};

// ---------------- piezas ENCIMA (ov) ----------------

// (2) progreso de la lista "3 / 8" con puntos; sólo sobre material (se esconde en el avatar: lo decide el build)
export const Prog: React.FC<OP> = ({ t, a, b, n }) => {
  const o = eo(t, a, 0.3) * sale(t, b, 0.3), tot = N();
  return <div style={{ position: "absolute", right: 60, top: 52, opacity: o, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10, textShadow: sombra }}>
    <div style={{ ...cap, fontSize: 19, color: "#fbf8f1", letterSpacing: "0.22em" }}><span style={{ color: "#f1d9a8" }}>{String(n).padStart(2, "0")}</span> / {String(tot).padStart(2, "0")} · {D.items[n - 1]?.t.toUpperCase()}</div>
    <div style={{ display: "flex", gap: 7 }}>{D.items.map((_, i) => <div key={i} style={{ width: 24, height: 5, borderRadius: 3, background: i < n ? C.hanko : "rgba(251,248,241,.45)", boxShadow: "0 1px 4px rgba(0,0,0,.4)" }} />)}</div>
  </div>;
};

// la prueba de esta noche: tira de papel con hilo rojo (la firma de la serie)
export const Prueba: React.FC<OP> = ({ t, a, b, txt, lab }) => {
  const p = spr(t, a, 1.1), r = swing(t, a, 7, 1.8, 6);
  return <div style={{ position: "absolute", left: 110, top: 0, transformOrigin: "50% 0", transform: `rotate(${r}deg) translateY(${(cl(p) - 1) * 640}px)`, opacity: sale(t, b) }}>
    <div style={{ width: 3, height: 120, background: C.hanko, margin: "0 auto" }} />
    <div style={{ ...papel, width: 560, padding: "34px 40px 40px", borderTop: `6px solid ${C.hanko}` }}>
      <div style={{ ...cap, fontSize: 21, color: C.hanko }}>{lab || "your test for tonight"}</div>
      <Palabras t={t} at={a + 0.45} txt={txt} gap={0.07} style={{ fontFamily: SERIF, fontSize: 46, color: C.sumi, marginTop: 14, lineHeight: 1.18 }} />
      <Pincel t={t} at={a + 0.6 + String(txt).split(" ").length * 0.07} x={40} y={0} w={200} hgt={6} col={C.hanko} op={0.8} />
    </div>
  </div>;
};

// dato con fuente real (sólo si hay fuente): ficha de archivo abajo a la derecha
export const Dato: React.FC<OP> = ({ t, a, b, txt, fuente }) => {
  const p = eo(t, a, 0.45) * sale(t, b);
  return <div style={{ position: "absolute", right: 100, bottom: 96, width: 660, ...papel, padding: "28px 36px 26px", opacity: p, transform: `translateY(${(1 - eo(t, a, 0.45)) * 40}px)`, borderLeft: `5px solid ${C.ai}` }}>
    <Palabras t={t} at={a + 0.3} txt={txt} gap={0.07} style={{ fontFamily: SERIF, fontSize: 44, color: C.sumi, lineHeight: 1.2 }} />
    <div style={{ ...cap, fontSize: 17, color: C.nezumi, marginTop: 14, letterSpacing: "0.18em" }}>{fuente}</div>
  </div>;
};

// palabra japonesa explicada: kanji grande vertical + lectura + significado (sobre material)
export const Palabra: React.FC<OP> = ({ t, a, b, kan, rom, sig, lado }) => {
  const p = eo(t, a, 0.5) * sale(t, b), der = lado !== "izq";
  return <div style={{ position: "absolute", top: 120, [der ? "right" : "left"]: 110, display: "flex", flexDirection: der ? "row-reverse" : "row", gap: 30, alignItems: "flex-start", opacity: p, color: "#fbf8f1", textShadow: sombra }}>
    <div style={{ fontFamily: SERIF, fontSize: 130, writingMode: "vertical-rl", lineHeight: 1, letterSpacing: "0.06em", clipPath: `inset(0 0 ${(1 - eo(t, a, 0.8)) * 100}% 0)` }}>{kan}</div>
    <div style={{ marginTop: 14, textAlign: der ? "right" : "left" }}>
      <div style={{ fontFamily: SERIF, fontSize: 64, fontStyle: "italic" }}>{rom}</div>
      <div style={{ width: 90 * eo(t, a + 0.4, 0.4), height: 3, background: "#f1d9a8", margin: der ? "14px 0 14px auto" : "14px 0" }} />
      <div style={{ ...cap, fontSize: 24, maxWidth: 520 }}>{sig}</div>
    </div>
  </div>;
};

// (4) polaroid que cae al lado del avatar cuando recuerda algo
export const Polaroid: React.FC<OP> = ({ t, a, b, f, txt, izq }) => {
  const p = spr(t, a, 0.9), r = (h(Math.round(a * 7), 2) < 0.5 ? -1 : 1) * (4 + 4 * h(Math.round(a * 7), 3));
  return <div style={{ position: "absolute", ...(izq ? { left: 120 } : { right: 120 }), top: 150, width: 540, opacity: sale(t, b), transform: `translateY(${(cl(p) - 1) * 1000}px) rotate(${r + (1 - cl(p)) * 25}deg)` }}>
    <div style={{ background: "#fbf8f1", padding: "24px 24px 100px", boxShadow: "0 30px 60px rgba(0,0,0,.5)", position: "relative" }}>
      <div style={{ width: 492, height: 420, overflow: "hidden" }}><Img src={src(f)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "sepia(.25) contrast(.97)" }} /></div>
      <div style={{ position: "absolute", bottom: 26, left: 0, right: 0, textAlign: "center", fontFamily: SERIF, fontSize: 40, color: C.sumi, fontStyle: "italic" }}>{txt}</div>
      <div style={{ position: "absolute", top: -18, left: 200, width: 140, height: 40, background: "rgba(234,223,203,.85)", transform: "rotate(-3deg)", boxShadow: "0 2px 6px rgba(0,0,0,.15)" }} />
    </div>
  </div>;
};

// (4) 50/50: la foto entra por la derecha y ocupa la mitad (el avatar se corre solo, ver Body)
export const Mitad: React.FC<OP> = ({ t, a, b, f }) => {
  const p = eo(t, a, 0.4) * sale(t, b, 0.35), z = 1.04 + 0.05 * cl((t - a) / (b - a));
  return <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: 960, overflow: "hidden", transform: `translateX(${(1 - p) * 103}%)`, borderLeft: `8px solid ${C.washi}`, boxShadow: "-12px 0 40px rgba(0,0,0,.4)" }}>
    {esVideo(f) ? <OffthreadVideo src={src(f)} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z})` }} /> : <Img src={src(f)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z})` }} />}
  </div>;
};

// (10) CTA suave junto al avatar: la pregunta + la fila de tarjetas chiquitas
export const Cta: React.FC<OP> = ({ t, a, b, txt }) => {
  const p = eo(t, a, 0.5) * sale(t, b);
  return <AbsoluteFill style={{ opacity: p }}>
    <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(16,12,8,.75) 0%, rgba(16,12,8,0) 42%)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 224, textAlign: "center" }}>
      <div style={{ ...cap, fontSize: 22, color: "#f1d9a8", textShadow: sombra }}>tell me below</div>
      <Palabras t={t} at={a + 0.3} txt={txt} gap={0.08} style={{ fontFamily: SERIF, fontSize: 60, color: "#fbf8f1", textShadow: sombra, justifyContent: "center", marginTop: 10 }} />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 52, display: "flex", justifyContent: "center", gap: 14 }}>
      {D.items.map((it, i) => { const q = cl(spr(t, a + 0.4 + i * 0.09, 1.2)); return <div key={i} style={{ width: 130, height: 130, borderRadius: 4, overflow: "hidden", border: `3px solid ${C.washi}`, position: "relative", opacity: q, transform: `translateY(${(1 - q) * 80}px)`, boxShadow: "0 8px 18px rgba(0,0,0,.45)" }}>
        <Img src={src(it.f)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", left: 7, top: 4, fontFamily: SANS, fontWeight: 500, fontSize: 22, color: "#fbf8f1", textShadow: sombra }}>{String(it.n).padStart(2, "0")}</div>
      </div>; })}
    </div>
  </AbsoluteFill>;
};

export const Fin: React.FC<OP> = ({ t, a, sub }) => (
  <AbsoluteFill style={{ background: C.washi, opacity: e(t, a, a + 0.8), alignItems: "center", justifyContent: "center" }}>
    <Washi />
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: SERIF, fontSize: 96, color: C.sumi, opacity: e(t, a + 0.5, a + 1.1) }}>Setsuko&rsquo;s Kyoto Wardrobe</div>
      <div style={{ ...cap, fontSize: 26, color: C.hanko, marginTop: 26, opacity: e(t, a + 0.8, a + 1.3) }}>{sub}</div>
    </AbsoluteFill>
  </AbsoluteFill>
);
