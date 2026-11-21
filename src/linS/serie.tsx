// serie Linda (lin16) · escenas y piezas de la lista. Todo es función pura de t (segundos).
// Look: pase de abordar crema + latón de las alas + sello rojo del control + tapizado azul de cabina entre capítulos.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, staticFile } from "remotion";
import { C, D, Flap, HAND, Hanko, P, Palabras, Pincel, SANS, SERIF, Tablero, Washi, cl, e, eo, h, lerp, sm, spr, swing, tela } from "./lib";

type SP = { t: number; a: number; b: number; arg?: string };
type OP = { t: number; a: number; b: number } & Record<string, any>;
const cap: React.CSSProperties = { fontFamily: SANS, fontWeight: 400, letterSpacing: "0.3em", textTransform: "uppercase" };
const sombra = "0 4px 30px rgba(0,0,0,.65), 0 1px 2px rgba(0,0,0,.6)";
const papel: React.CSSProperties = { background: "linear-gradient(180deg,#FFFCF5,#F1E8D6)", boxShadow: "0 18px 40px rgba(15,10,0,.35)", outline: "1px solid rgba(169,132,63,.55)", outlineOffset: -7 };
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
      <div style={{ position: "absolute", left: w * 0.035, top: w * 0.035, width: w * 0.17, height: w * 0.17, borderRadius: "50%", background: C.hanko, border: `${Math.max(2, w * 0.008)}px solid #f1d9a8`,
        color: "#FFFCF5", fontFamily: SERIF, fontWeight: 500, fontSize: w * 0.092, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,.4)" }}>{it.n}</div>
    </div>
    <div style={{ display: "flex", alignItems: "baseline", gap: w * 0.035, marginTop: w * 0.04, minHeight: w * 0.2 }}>
      <span style={{ fontFamily: SANS, fontWeight: 500, fontSize: w * 0.05, color: C.hanko, letterSpacing: 2 }}>{String(it.n).padStart(2, "0")}</span>
      <span style={{ fontFamily: SERIF, fontWeight: 500, fontSize: w * 0.082, color: C.sumi, lineHeight: 1.08, opacity: 1 - dim * 0.5 }}>{it.t}</span>
    </div>
    {check > 0 && <div style={{ position: "absolute", right: -w * 0.06, top: -w * 0.06, opacity: cl(check * 2) }}>
      <div style={{ width: w * 0.24, height: w * 0.24, borderRadius: "50%", border: `${w * 0.012}px solid ${C.hanko}`, color: C.hanko, background: "rgba(255,252,245,.92)", display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: SERIF, fontSize: w * 0.15, lineHeight: 1, transform: `scale(${lerp(2, 1, check)}) rotate(${lerp(-30, -8, check)}deg)` }}>✓</div>
    </div>}
  </div>;
};

// (1) CARRUSEL: las N tarjetas giran en un aro 3D sobre material desenfocado y terminan en abanico
export const Carrusel: React.FC<SP> = ({ t, a, b }) => {
  const n = N(), dur = b - a, k = t - a, fan = sm((k - dur * 0.6) / 1.2), rot = -k * 16.5;
  const R = n > 10 ? 980 : 760, PR = n > 10 ? 1500 : 1250, w = n > 10 ? 290 : 340;
  return <AbsoluteFill>
    <Desenfoque f={D.bg} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, rgba(20,14,8,0) 30%, rgba(20,14,8,.55) 100%)" }} />
    <div style={{ position: "absolute", top: 58, width: "100%", textAlign: "center", opacity: eo(t, a, 0.6), transform: `translateY(${(1 - eo(t, a, 0.6)) * -30}px)` }}>
      <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 34, color: "#f1d9a8", textShadow: sombra }}>{D.lista_sub || "35 years in the aisle."}</div>
      <div style={{ fontFamily: SERIF, fontSize: 92, color: "#FFFCF5", textShadow: sombra, lineHeight: 1.05, marginTop: 8 }}>{D.lista_titulo}</div>
    </div>
    <AbsoluteFill style={{ perspective: 2200, perspectiveOrigin: "50% 42%" }}>
      {D.items.map((_, i) => {
        const ap = cl(spr(t, a + 0.15 + i * 0.16, 1.2));
        const th = ((((i * 360) / n + rot) % 360) + 540) % 360 - 180, rad = (th * Math.PI) / 180;
        const rx = R * Math.sin(rad), rz = R * (Math.cos(rad) - 1);
        const phi = -(n > 10 ? 34 : 40) + (i * (n > 10 ? 68 : 80)) / Math.max(1, n - 1), pr = (phi * Math.PI) / 180;
        const x = lerp(rx, PR * Math.sin(pr), fan), y = lerp(60, PR * (1 - Math.cos(pr)) + 40, fan), z = lerp(rz, i * 2, fan);
        const vis = lerp(cl(0.25 + 0.75 * Math.cos(rad), 0.12, 1), 1, fan);
        return <div key={i} style={{ position: "absolute", left: 960 - w / 2, top: 360, zIndex: Math.round(3000 + z), opacity: vis * ap,
          transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${lerp(th, 0, fan)}deg) rotateZ(${lerp(0, phi, fan)}deg) scale(${lerp(1, 0.84, fan) * ap})` }}><Ficha i={i} w={w} /></div>;
      })}
    </AbsoluteFill>
  </AbsoluteFill>;
};

// (10) REPASO: libreta de Linda a la izquierda (renglones a mano, cada ítem se tacha con un tilde rojo dibujado) y la polaroid grande del ítem actual a la derecha
export const Repaso: React.FC<SP> = ({ t, a }) => {
  const n = N(), marcas: number[] = (D as any).repaso || [], at = (i: number) => marcas[i] ?? a + 1 + i * 0.6;
  let cur = -1; for (let i = 0; i < n; i++) if (t >= at(i)) cur = i;
  const lh = 132, fs = 80, en = cl(spr(t, a, 0.9)), scr = Math.max(0, Math.min(n - 5, (cur < 0 ? 0 : cur) - 2 + (cur >= 0 ? eo(t, at(Math.max(0, cur)), 0.4) - 1 : 0)));
  return <AbsoluteFill>
    <Desenfoque f={D.bg} dark={0.55} />
    <div style={{ position: "absolute", left: 110, top: 80, width: 980, height: 870, transform: `translateX(${(1 - en) * -700}px) rotate(-1.5deg)`, background: "#FFFDF4", borderRadius: 8, boxShadow: "0 30px 80px rgba(0,0,0,.6)",
      backgroundImage: `linear-gradient(90deg, transparent 96px, rgba(179,38,30,.55) 96px 99px, transparent 99px), repeating-linear-gradient(180deg, transparent 0 ${lh - 2}px, rgba(30,58,95,.22) ${lh - 2}px ${lh}px)`, backgroundPosition: `0 0, 0 ${170 - lh * 0.15}px`, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 8, display: "flex", justifyContent: "space-around", padding: "0 40px" }}>{Array.from({ length: 12 }).map((_, k) => <div key={k} style={{ width: 22, height: 44, borderRadius: 11, border: "4px solid #8d939b" }} />)}</div>
      <div style={{ position: "absolute", left: 120, top: 62, fontFamily: HAND, fontWeight: 700, fontSize: 78, color: C.ai, zIndex: 2, background: "#FFFDF4", right: 20 }}>{D.repaso_titulo || D.lista_titulo}</div>
      {D.items.map((it, i) => { const p = eo(t, a + 0.3 + i * 0.07, 0.35), hecho = t >= at(i), ck = eo(t, at(i), 0.3), act = i === cur;
        return <div key={i} style={{ position: "absolute", left: 120, top: 170 + (i - scr) * lh, height: lh, right: 30, display: "flex", alignItems: "center", gap: 18, opacity: p, fontFamily: HAND, fontWeight: 700, fontSize: fs, color: hecho ? C.sumi : "rgba(20,33,61,.72)" }}>
          <span style={{ width: fs * 1.2, color: C.hanko }}>{it.n}.</span>
          <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 640, background: act ? "rgba(246,210,120,.45)" : "transparent", padding: "0 8px", borderRadius: 4 }}>{it.t}</span>
          {hecho && <svg width={fs * 1.3} height={fs * 1.1} viewBox="0 0 40 34" style={{ overflow: "visible" }}><path d="M3 18 L15 30 L38 3" fill="none" stroke={C.hanko} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={60} strokeDashoffset={60 * (1 - ck)} /></svg>}
        </div>; })}
    </div>
    {D.items.map((it, i) => { if (cur < 0 || i > cur || i < cur - 1) return null; const p = cl(spr(t, at(i), 1)), fuera = i < cur ? e(t, at(cur), at(cur) + 0.4) : 0;
      return <div key={i} style={{ position: "absolute", left: 1180, top: 170, width: 640, background: "#FFFDF8", padding: "26px 26px 110px", boxShadow: "0 30px 70px rgba(0,0,0,.6)",
        transform: `translate(${(1 - p) * 700 + fuera * 900}px, ${fuera * -200}px) rotate(${lerp(14, ((h(i, 9) * 6) | 0) - 3, p) + fuera * 25}deg)`, opacity: 1 - fuera }}>
        <Img src={src(it.f)} style={{ width: "100%", height: 520, objectFit: "cover", display: "block" }} />
        <div style={{ position: "absolute", left: 30, right: 30, bottom: 10, fontFamily: HAND, fontWeight: 700, fontSize: 70, color: C.sumi, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.n}. {it.t}</div>
      </div>; })}
  </AbsoluteFill>;
};

// respaldo de asiento de cabina que barre la pantalla entre capítulos: tapizado azul acolchado en canales, funda blanca de cabecera y ribete
export const Tela: React.FC<OP> = () => null; // retirado tras EVALUADOR v2: el cambio de capítulo va por corte limpio

// (3) APERTURA de cada ítem: un mecanismo de cabina distinto por número (compartimiento de arriba, ventanilla con cortina, pase de abordar que se corta, sello del control)
export const Apertura: React.FC<SP> = ({ t, a, b, arg }) => {
  const i = Number(arg) - 1, it = D.items[i], k = t - a, dur = b - a, modo = i % 4, der = i % 2 === 1;
  const zoom = 1.06 + 0.07 * cl(k / (dur + 0.4)), foto = <Img src={src(it.f)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(1.18) saturate(1.05)", transform: `scale(${zoom})`, transformOrigin: `${der ? 35 : 65}% 45%` }} />;
  const lado: React.CSSProperties = der ? { right: 130, alignItems: "flex-end", textAlign: "right" } : { left: 130, alignItems: "flex-start" };
  const titulo = <div style={{ position: "absolute", top: modo === 3 ? 470 : 330, width: 900, display: "flex", flexDirection: "column", ...lado }}>
    <div style={{ ...cap, fontSize: 46, color: "#f1d9a8", textShadow: sombra, opacity: eo(t, a + 0.3, 0.4) }}>{D.item_rotulo || "carry-on"}</div>
    <Palabras t={t} at={a + 0.9} txt={it.t} gap={0.14} style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 104, color: "#FFFCF5", textShadow: sombra, lineHeight: 1.04, justifyContent: der ? "flex-end" : "flex-start", maxWidth: 900 }} />
    {it.sub && <div style={{ fontFamily: HAND, fontWeight: 700, whiteSpace: "nowrap", fontSize: Math.min(84, 980 / (String(it.sub).length * 0.44)), color: "#f1d9a8", textShadow: sombra, marginTop: 12, opacity: eo(t, a + 1.6, 0.5) }}>{it.sub}</div>}
    <div style={{ height: 4, background: C.hanko, marginTop: 16, width: 260 * eo(t, a + 1.4, 0.5) }} />
  </div>;
  const velo = <AbsoluteFill style={{ background: `linear-gradient(${der ? 270 : 90}deg, rgba(10,16,30,.9) 0%, rgba(10,16,30,.62) 46%, rgba(10,16,30,0) 72%)` }} />;
  const plastico = "linear-gradient(180deg,#F4F1EA 0%,#E2DDD2 55%,#CFC9BC 100%)";
  if (modo === 0) { // cartel iluminado de fila (panel de arriba de la cabina) que baja colgando sobre la foto y se balancea
    const p = cl(spr(t, a + 0.1, 0.9)), sw = swing(t, a + 0.45, 5, 2.2, 6), luz = eo(t, a + 0.55, 0.25);
    const pos: React.CSSProperties = der ? { left: 170 } : { right: 170 };
    return <AbsoluteFill style={{ background: C.sumi }}>{foto}{velo}{titulo}
      <div style={{ position: "absolute", ...pos, top: lerp(-480, 90, p), width: 600, transformOrigin: "50% -110px", transform: `rotate(${sw}deg)` }}>
        <div style={{ position: "absolute", left: 90, top: -110, width: 6, height: 110, background: "#555" }} /><div style={{ position: "absolute", right: 90, top: -110, width: 6, height: 110, background: "#555" }} />
        <div style={{ height: 340, borderRadius: 24, background: "linear-gradient(180deg,#e9e5dc,#c9c3b6)", boxShadow: "0 30px 70px rgba(0,0,0,.6), inset 0 2px 0 rgba(255,255,255,.7)", padding: 26, display: "flex", gap: 22 }}>
          <div style={{ flex: 1, borderRadius: 14, background: "#101418", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "inset 0 4px 12px rgba(0,0,0,.8)" }}>
            <div style={{ ...cap, fontSize: 38, color: `rgba(246,210,120,${0.35 + 0.65 * luz})` }}>row</div>
            <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 200, lineHeight: 1, color: `rgba(255,236,190,${0.25 + 0.75 * luz})`, textShadow: `0 0 ${30 * luz}px rgba(246,200,110,.9)` }}>{String(it.n).padStart(2, "0")}</div>
          </div>
          <div style={{ width: 170, display: "flex", flexDirection: "column", gap: 24, justifyContent: "center" }}>{["A", "B", "C"].map((l, k) => <div key={k} style={{ height: 100, borderRadius: 12, background: "#101418", color: `rgba(255,236,190,${0.3 + 0.7 * eo(t, a + 0.7 + k * 0.12, 0.2)})`, fontFamily: SANS, fontWeight: 500, fontSize: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>{l}</div>)}</div>
        </div>
      </div>
    </AbsoluteFill>;
  }
  if (modo === 1) { // la ventanilla del avión: la cortina sube, y la ventana crece hasta llenar la pantalla
    const sube = eo(t, a - 0.05, 0.3), crece = eo(t, a + 0.35, 0.75), W = lerp(760, 2400, crece), H = lerp(860, 2200, crece), R = lerp(190, 0, crece);
    return <AbsoluteFill style={{ background: plastico, overflow: "hidden" }}>
      <AbsoluteFill style={{ clipPath: `inset(${540 - H / 2}px ${960 - W / 2}px ${540 - H / 2}px ${960 - W / 2}px round ${R}px)` }}>{foto}{velo}</AbsoluteFill>
      {crece < 1 && <div style={{ position: "absolute", left: 960 - W / 2, top: 540 - H / 2, width: W, height: H, borderRadius: R, overflow: "hidden", boxShadow: `inset 0 0 0 ${lerp(26, 0, crece)}px #DCD6C9, inset 0 0 40px rgba(0,0,0,.35)` }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: `${(1 - sube) * 100}%`, background: "linear-gradient(180deg,#EDE8DD,#D6D0C3)", borderBottom: "10px solid #BEB7A8", boxShadow: "0 6px 14px rgba(0,0,0,.3)" }} />
      </div>}
      {crece > 0.5 && titulo}
    </AbsoluteFill>;
  }
  if (modo === 2) { // el pase de abordar: la tira se corta por el troquel y la foto aparece detrás
    const corta = eo(t, a + 0.35, 0.6), cae = e(t, a + 0.8, a + 1.4);
    const pase: React.CSSProperties = { position: "absolute", top: 300, height: 480, background: "linear-gradient(180deg,#FFFCF5,#EFE7D3)", boxShadow: "0 24px 60px rgba(0,0,0,.45)" };
    return <AbsoluteFill style={{ background: C.sumi }}>
      <AbsoluteFill>{foto}{velo}</AbsoluteFill>
      {cae < 1 && <>
        <div style={{ ...pase, left: 260, width: 1000, transform: `translate(${-cae * 300}px, ${-cae * 1100}px) rotate(${-cae * 8}deg)`, borderTop: `40px solid ${C.ai}` }}>
          <div style={{ ...cap, position: "absolute", left: 50, top: 30, fontSize: 24, color: C.nezumi }}>boarding pass · item</div>
          <div style={{ position: "absolute", left: 50, top: 70, fontFamily: SERIF, fontSize: 250, color: C.sumi, lineHeight: 1 }}>{String(it.n).padStart(2, "0")}</div>
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, borderRight: `4px dashed ${C.nezumi}` }} />
        </div>
        <div style={{ ...pase, left: 1260, width: 400, transform: `translate(${corta * 30 + cae * 300}px, ${cae * 1300}px) rotate(${corta * 4 + cae * 18}deg)`, borderTop: `40px solid ${C.hanko}` }}>
          <div style={{ ...cap, position: "absolute", left: 40, top: 30, fontSize: 22, color: C.nezumi }}>seat</div>
          <div style={{ position: "absolute", left: 40, top: 70, fontFamily: SERIF, fontSize: 140, color: C.hanko }}>{it.n}A</div>
        </div>
      </>}
      {cae > 0.85 && titulo}
    </AbsoluteFill>;
  }
  // modo 3: la foto ya está; el sello rojo del control cae del lado libre, aplasta y deja el número
  return <AbsoluteFill style={{ background: C.sumi }}>{foto}{velo}{titulo}
    <Hanko t={t} at={a + 0.3} x={der ? 1600 : 320} y={300} size={330} txt={String(it.n)} bl={false} rot={der ? 8 : -8} />
  </AbsoluteFill>;
};

// (7) MAPA: imagen del recorrido con coordenadas en %; la ruta se traza entre los puntos
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
      <Img src={src((D as any).mapa || "g/mapldn.png")} style={{ width: "100%", height: "100%", objectFit: "fill", filter: "sepia(.15)" }} />
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <path d={d} fill="none" stroke={C.hanko} strokeWidth={7 / z} strokeLinecap="round" pathLength={1000} strokeDasharray={1000} strokeDashoffset={1000 * (1 - line)} opacity={0.92} />
        {P2.map(([x, y], j) => { const on = cl(spr(t, a + 0.5 + (j / Math.max(1, P2.length - 1)) * Math.max(1, dur * 0.55), 1.3)); return <g key={j}><circle cx={x} cy={y} r={(13 / z) * on} fill={j === 0 ? C.hanko : C.ai} /><circle cx={x} cy={y} r={(30 / z) * on} fill="none" stroke={C.hanko} strokeWidth={3 / z} opacity={0.45} /></g>; })}
      </svg>
      {pts.map((p, j) => { const on = eo(t, a + 0.6 + (j / Math.max(1, pts.length - 1)) * Math.max(1, dur * 0.55), 0.4); return <div key={j} style={{ position: "absolute", left: P2[j][0], top: P2[j][1], opacity: on, transform: `scale(${1 / z}) translate(30px, -115%)`, transformOrigin: "0 0", whiteSpace: "nowrap", ...papel, padding: "4px 18px", borderRadius: 3, display: "flex", gap: 14, alignItems: "baseline" }}>
        <span style={{ fontFamily: SERIF, fontSize: 52, color: C.sumi }}>{p.en}</span>{p.jp && <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 34, color: C.hanko }}>{p.jp}</span>}
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
        {leyenda && <div style={{ position: "absolute", bottom: 16, left: 44, fontFamily: HAND, fontSize: 58, color: C.sumi, opacity: eo(t, a + 1.2, 0.5) }}>{leyenda}</div>}
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

// (2) progreso de la lista: fila de ventanillas de avión, las ya vistas encendidas, la actual brilla; "03 / 11" grande arriba
export const Prog: React.FC<OP> = () => null; // retirado tras EVALUADOR v2: el número del ítem ya vive en la apertura

// la regla de Linda: tarjeta de cartulina colgada de un hilo rojo; baja con peso, se balancea y al final el hilo la sube
export const Prueba: React.FC<OP> = ({ t, a, b, txt, lab }) => {
  const izq = true, p = spr(t, a, 1.1), r = swing(t, a + 0.15, 9, 1.2, 5) - 2, sube = e(t, b - 0.35, b);
  return <div style={{ position: "absolute", [izq ? "left" : "right"]: 70, top: 0, transformOrigin: "50% 0", transform: `rotate(${r}deg) translateY(${(cl(p) - 1) * 900 - sube * 1000}px)` } as React.CSSProperties}>
    <div style={{ width: 5, height: 120, background: `linear-gradient(90deg, #7d1a15, ${C.hanko}, #7d1a15)`, margin: "0 auto", boxShadow: "2px 0 3px rgba(0,0,0,.4)" }} />
    <div style={{ ...papel, width: 640, padding: "40px 46px 48px", borderTop: `10px solid ${C.hanko}`, boxShadow: `${-r * 3}px 50px 70px rgba(0,0,0,.6), 0 8px 16px rgba(0,0,0,.35)`, position: "relative" }}>
      <div style={{ position: "absolute", left: 301, top: -18, width: 32, height: 32, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #f3dc9c, #8a6a2c)", boxShadow: "0 3px 6px rgba(0,0,0,.45)" }} />
      <div style={{ ...cap, fontSize: 32, color: C.hanko, fontWeight: 500 }}>{lab || "linda's rule"}</div>
      <Palabras t={t} at={a + 0.4} txt={txt} gap={0.07} style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 66, color: C.sumi, marginTop: 16, lineHeight: 1.1 }} />
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

// número o regla explicada: tablero de partidas que se arma letra por letra (cifra) + la ruta en la fila de abajo
export const Palabra: React.FC<OP> = ({ t, a, b, kan, rom, sig, lado }) => {
  const der = lado !== "izq", ent = eo(t, a + 0.05, 0.25), L = String(kan).length, out = b - 0.45, fuera = e(t, b - 0.12, b);
  const av = (D.shots || []).some((s: any) => s.k === "A" && s.s < b && s.e > a), W = av ? 560 : 1150, R2 = String(rom || "").length;
  const H1 = Math.min(av ? 150 : 200, W / Math.max(3, L) / 0.71), H2 = Math.min(av ? 60 : 80, W / Math.max(8, R2) / 0.71);
  return <div style={{ position: "absolute", top: 70, [der && !av ? "right" : "left"]: av ? 50 : 70, display: "flex", flexDirection: "column", alignItems: der && !av ? "flex-end" : "flex-start", opacity: 1 - fuera,
    transform: `translateY(${(1 - ent) * -60}px)` } as React.CSSProperties}>
    <Tablero style={{ opacity: ent, padding: "26px 30px" }}>
      <Flap t={t} at={a + 0.12} txt={kan} H={H1} fl={0.03} out={out} />
      {rom && <div style={{ marginTop: 16 }}><Flap t={t} at={a + 0.25} txt={rom} H={H2} gap={0.015} fl={0.025} col="#E9C46A" out={out} /></div>}
      {sig && <div style={{ ...cap, fontSize: 36, color: "#FFFCF5", marginTop: 18, opacity: eo(t, a + 0.9, 0.3) * (1 - e(t, out, out + 0.15)), maxWidth: av ? 560 : 1400 }}>{sig}</div>}
    </Tablero>
  </div>;
};

// (4) polaroid que cae al lado del avatar cuando recuerda algo
export const Polaroid: React.FC<OP> = ({ t, a, b, f, txt, izq }) => {
  const p = spr(t, a, 0.9), r = (h(Math.round(a * 7), 2) < 0.5 ? -1 : 1) * (4 + 4 * h(Math.round(a * 7), 3));
  return <div style={{ position: "absolute", ...(izq ? { left: 120 } : { right: 120 }), top: 150, width: 540, opacity: sale(t, b), transform: `translateY(${(cl(p) - 1) * 1000}px) rotate(${r + (1 - cl(p)) * 25}deg)` }}>
    <div style={{ background: "#FFFCF5", padding: "24px 24px 100px", boxShadow: "0 30px 60px rgba(0,0,0,.5)", position: "relative" }}>
      <div style={{ width: 492, height: 420, overflow: "hidden" }}><Img src={src(f)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "sepia(.25) contrast(.97)" }} /></div>
      <div style={{ position: "absolute", bottom: 26, left: 0, right: 0, textAlign: "center", fontFamily: HAND, fontSize: 50, color: C.sumi }}>{txt}</div>
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

// (10) CTA: un comentario de verdad (globo blanco con la inicial de Linda, la pregunta y responder/me gusta) que sube con resorte
export const Cta: React.FC<OP> = ({ t, a, b, txt }) => {
  const p = spr(t, a, 0.9), sal = e(t, b - 0.4, b), bot = cl((t - a - 1.4) / 0.4), lleno = eo(t, a + 2.0, 0.3);
  return <AbsoluteFill>
    <AbsoluteFill style={{ background: `linear-gradient(0deg, rgba(16,12,8,${0.6 * eo(t, a, 0.4) * (1 - sal)}) 0%, rgba(16,12,8,0) 45%)` }} />
    <div style={{ position: "absolute", left: 170, right: 170, bottom: 80, transform: `translateY(${(1 - cl(p)) * 420 - sal * 1100}px) scale(${lerp(0.9, 1, cl(p))}) rotate(${sal * -4}deg)`, transformOrigin: "50% 100%" }}>
      <div style={{ background: "#FFFFFF", borderRadius: 30, padding: "34px 46px 30px", display: "flex", gap: 30, boxShadow: "0 30px 70px rgba(0,0,0,.55)", position: "relative" }}>
        <div style={{ flex: "0 0 auto", width: 96, height: 96, borderRadius: "50%", background: `linear-gradient(160deg, ${C.hanko}, #7d1a15)`, color: "#FFFCF5", fontFamily: SERIF, fontWeight: 600, fontSize: 54, display: "flex", alignItems: "center", justifyContent: "center" }}>L</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 34, color: "#333" }}>Linda <span style={{ fontWeight: 400, color: "#888" }}>· tell me below</span></div>
          <Palabras t={t} at={a + 0.35} txt={String(txt).replace(/ (\S+)$/, " $1")} gap={0.08} style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 72, color: C.sumi, lineHeight: 1.1, marginTop: 8 }} />
          <div style={{ display: "flex", gap: 40, marginTop: 18, fontFamily: SANS, fontWeight: 500, fontSize: 40, color: "#555", opacity: bot }}>
            <span style={{ display: "flex", alignItems: "center", gap: 10 }}><svg width="48" height="44" viewBox="0 0 30 28" style={{ transform: `scale(${1 + 0.35 * Math.exp(-8 * Math.max(0, t - a - 2.0)) * (t > a + 2 ? 1 : 0)})` }}><path d="M15 26 C4 18 1 12 2 8 C3 3 9 1 15 7 C21 1 27 3 28 8 C29 12 26 18 15 26 Z" fill={`rgba(179,38,30,${lleno})`} stroke={C.hanko} strokeWidth={2} /></svg><span style={{ fontVariantNumeric: "tabular-nums" }}>{t < a + 2.0 ? 247 : 248}</span></span>
            <span style={{ padding: "6px 22px", borderRadius: 24, background: "#f0f0f0", color: "#222", transform: `scale(${1 + 0.06 * Math.sin(Math.max(0, t - a - 2) * 4)})` }}>Reply</span>
            <span style={{ padding: "6px 26px", borderRadius: 24, background: "#CC0000", color: "#fff", fontWeight: 600, opacity: eo(t, a + 1.7, 0.3) }}>Subscribe</span>
          </div>
        </div>
        <div style={{ position: "absolute", left: 120, bottom: -26, width: 0, height: 0, borderLeft: "26px solid transparent", borderRight: "26px solid transparent", borderTop: "28px solid #FFFFFF" }} />
      </div>
    </div>
  </AbsoluteFill>;
};

// cierre: pase de abordar de Linda que sube sobre el living desenfocado; el sello "ARRIVED" cae en el talón
export const Fin: React.FC<OP> = ({ t, a, sub }) => {
  const f = eo(t, a - 0.15, 0.3), p = spr(t, a + 0.3, 0.9);
  return <AbsoluteFill style={{ opacity: f }}>
    <Desenfoque f={D.bg} dark={0.3} />
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", transform: `translateY(${(1 - cl(p)) * 500}px) rotate(${(1 - cl(p)) * 6 - 1.5}deg)`, boxShadow: "0 40px 90px rgba(0,0,0,.6)" }}>
        <div style={{ ...papel, boxShadow: "none", width: 1060, height: 460, borderTop: `46px solid ${C.ai}`, padding: "40px 60px", position: "relative" }}>
          <div style={{ ...cap, fontSize: 34, color: C.nezumi }}>boarding pass · final call</div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 118, color: C.sumi, lineHeight: 1.05, marginTop: 24 }}><Palabras t={t} at={a + 0.7} txt={String(sub || "fly safe, my friends")} gap={0.12} /></div>
          <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 58, color: C.sumi, marginTop: 26, opacity: eo(t, a + 1.2, 0.4) }}>Linda · retired flight attendant</div>
        </div>
        <div style={{ ...papel, boxShadow: "none", width: 330, height: 460, borderTop: `46px solid ${C.hanko}`, borderLeft: `4px dashed ${C.nezumi}`, padding: "40px 36px", position: "relative" }}>
          <div style={{ ...cap, fontSize: 22, color: C.nezumi }}>years</div>
          <div style={{ fontFamily: SERIF, fontSize: 130, color: C.hanko, lineHeight: 1 }}>35</div>
          <Hanko t={t} at={a + 1.3} x={165} y={345} size={150} txt="✓" />
        </div>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>;
};
