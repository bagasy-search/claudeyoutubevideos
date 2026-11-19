// tdp16 · escenas propias (S) v2 (19-nov, tras el EVALUADOR): cada escena NACE de la foto real a pantalla llena
// y la convierte en objeto físico (pasaporte, contador mecánico, billete perforado). Texto grande para celular.
// Cámara siempre viva (deriva curva + sacudón al golpe del sello): nunca un cuadro quieto.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, D, P, SANS, SERIF, cap, cl, e, eo, h, lerp, paginaBg, sm, spr, tapaBg } from "./lib";

type SP = { t: number; a: number; b: number } & Record<string, any>;
const src = (f: string) => staticFile(P + f);
const TINTAS = [C.red, "#1f4e8c", "#2f6b3a", "#6b2f6b"];
const tinta = (n: number) => TINTAS[n % TINTAS.length];

// sacudón amortiguado después de un golpe (px)
export const sacudon = (t: number, at: number, amp = 10) => { const k = t - at; return k < 0 || k > 0.6 ? 0 : amp * Math.exp(-k * 9) * Math.sin(k * 55); };
// deriva curva de cámara (nunca lineal)
const deriva = (t: number, a: number, seed: number) => {
  const k = t - a;
  return { x: 18 * Math.sin(k * 0.42 + seed * 6), y: 10 * Math.sin(k * 0.31 + seed * 4) - 4 * k, r: 0.5 * Math.sin(k * 0.27 + seed * 3) };
};
// foto de fondo desenfocada y oscurecida (la escena sigue «en el lugar»)
export const FondoFoto: React.FC<{ f?: string; t: number; a: number; o?: number }> = ({ f, t, a, o = 1 }) => !f ? null : (
  <AbsoluteFill style={{ overflow: "hidden", opacity: o }}>
    <Img src={src(f)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(22px) brightness(.42) saturate(.85)", transform: `scale(${1.18 + 0.01 * (t - a)})` }} />
    <AbsoluteFill style={{ background: "radial-gradient(70% 70% at 50% 45%, transparent, rgba(5,9,18,.55))" }} />
  </AbsoluteFill>
);
// foto de la parada vigente en el momento a (para cifras y rutas)
export const fotoDeParada = (a: number): string | undefined => {
  let n = 1;
  for (const q of D.shots) if (q.k === "S" && q.sc === "parada" && q.s <= a + 0.01) n = q.n || n;
  return D.paradas[n - 1]?.f || D.paradas[0]?.f;
};

// sello de visado: doble filete, tinta despareja, golpe con resorte + salpicadura de tinta
export const Sello: React.FC<{ t: number; at: number; top: string; big: string; bottom: string; rot?: number; scale?: number; col?: string }> = ({ t, at, top, big, bottom, rot = -8, scale = 1, col = C.red }) => {
  const p = cl(spr(t, at, 1.6)), o = t < at ? 0 : 1, gotas = t >= at ? cl(1 - (t - at) / 0.9) : 0;
  return <div style={{ position: "relative", opacity: o * 0.92, transform: `rotate(${rot}deg) scale(${scale * lerp(1.7, 1, p)})` }}>
    {gotas > 0 && [0, 1, 2, 3, 4, 5].map((i) => { const ang = h(i, 31) * Math.PI * 2, r = 150 + 90 * h(i, 32);
      return <div key={i} style={{ position: "absolute", left: "50%", top: "50%", width: 10 + 10 * h(i, 33), height: 10 + 10 * h(i, 33), borderRadius: "50%", background: col, opacity: gotas * 0.7,
        transform: `translate(${Math.cos(ang) * r * (1.15 - gotas * 0.15)}px, ${Math.sin(ang) * r * 0.6}px)` }} />; })}
    <div style={{ border: `6px solid ${col}`, borderRadius: 16, padding: 7, maskImage: "repeating-linear-gradient(17deg, #000 0 7px, rgba(0,0,0,.7) 7px 9px)", WebkitMaskImage: "repeating-linear-gradient(17deg, #000 0 7px, rgba(0,0,0,.7) 7px 9px)" }}>
      <div style={{ border: `2px solid ${col}`, borderRadius: 10, padding: "16px 34px 14px", textAlign: "center", color: col }}>
        <div style={{ ...cap, fontSize: 24, letterSpacing: "0.3em" }}>{top}</div>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 72, lineHeight: 1.04, letterSpacing: "0.03em", textTransform: "uppercase", margin: "6px 0", whiteSpace: "nowrap" }}>{big}</div>
        <div style={{ ...cap, fontSize: 20 }}>{bottom}</div>
      </div>
    </div>
  </div>;
};

// (1) PARADA n: la foto del lugar a pantalla llena se achica y queda pegada en un pasaporte grande; el sello del visado golpea
//     la otra página (que ya trae los sellos de las paradas anteriores: es UN pasaporte que viaja). Lado, tinta y ángulo varían.
export const Parada: React.FC<SP> = ({ t, a, b, n }) => {
  const it = D.paradas[n - 1] || D.paradas[0], NP = D.paradas.length, k = t - a, dur = b - a;
  const izq = n % 2 === 1, at = a + 1.35, col = tinta(n);
  const p1 = e(t, a + 0.3, a + 1.1), pp = e(t, a + 0.4, a + 1.0), sal = e(t, b - 0.4, b + 0.3);
  const W = 1660, H = 880, X0 = 130, Y0 = 100, half = W / 2;
  const slot = { x: X0 + (izq ? 70 : half + 70), y: Y0 + 80, w: half - 140, h: 520 };
  const rot = (izq ? -2.2 : 2.2) * (0.6 + 0.6 * h(n, 7));
  const dv = deriva(t, a, h(n, 8)), sx = sacudon(t, at, 9), sy = sacudon(t, at + 0.02, 6);
  const cam = `translate(${dv.x * p1 + sx}px, ${dv.y * p1 + sy}px) scale(${1 + 0.035 * sm(k / (dur + 0.4)) + 0.06 * sal}) rotate(${dv.r * p1}deg)`;
  const tilt = `perspective(2600px) rotateX(${lerp(0, 7 - 3 * sm(k / dur), p1)}deg) rotateY(${(izq ? 1 : -1) * lerp(0, 3, p1)}deg)`;
  const pagSello = izq ? X0 + half : X0, prev = D.paradas.slice(0, Math.max(0, n - 1));
  return <AbsoluteFill style={{ ...tapaBg, overflow: "hidden" }}>
    <FondoFoto f={it.f} t={t} a={a} o={pp} />
    <AbsoluteFill style={{ transform: cam }}>
      <AbsoluteFill style={{ transform: tilt }}>
        {/* pasaporte abierto: dos páginas, lomo con costura, sombra de contacto */}
        <div style={{ position: "absolute", left: X0, top: Y0, width: W, height: H, opacity: pp, transform: `scale(${lerp(1.1, 1, pp)})`, boxShadow: `0 ${50 * pp}px ${110 * pp}px rgba(0,0,0,.6)`, borderRadius: 10, overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, ...paginaBg }} />
          <div style={{ position: "absolute", left: half - 70, width: 140, top: 0, bottom: 0, background: "linear-gradient(90deg, transparent, rgba(0,0,0,.2) 45%, rgba(0,0,0,.32) 50%, rgba(0,0,0,.2) 55%, transparent)" }} />
          <div style={{ position: "absolute", left: half - 1, width: 2, top: 30, bottom: 30, backgroundImage: "repeating-linear-gradient(180deg, rgba(120,30,30,.55) 0 14px, transparent 14px 26px)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(0,0,0,.14), transparent 8%, transparent 92%, rgba(0,0,0,.14))" }} />
        </div>
        {/* página del sello: número de parada, sellos anteriores, sello nuevo, título */}
        <div style={{ position: "absolute", left: pagSello, top: Y0, width: half, height: H, opacity: pp }}>
          <div style={{ position: "absolute", right: 70, top: 46, ...cap, fontSize: 28, color: "rgba(29,26,22,.62)" }}>stop {n} of {NP}</div>
          {prev.map((q, i) => (
            <div key={i} style={{ position: "absolute", left: 470 + (i % 2) * 150 + 20 * h(i, 41), top: 110 + Math.floor(i / 2) * 92 + 14 * h(i, 42), opacity: 0.4, transform: "scale(.34)", transformOrigin: "0 0" }}>
              <Sello t={1e9} at={0} top={`stop ${String(q.n).padStart(2, "0")}`} big={String(q.sello || q.city || "")} bottom="" rot={-14 + 26 * h(i, 43)} col={tinta(q.n)} />
            </div>))}
          <div style={{ position: "absolute", left: 70, top: 110 }}>
            <Sello t={t} at={at} top={`stop ${String(n).padStart(2, "0")}`} big={String(it.sello || it.city || "")} bottom={String(it.fecha || "entry")} rot={-9 + 7 * h(n, 3)} col={col} scale={1.12} />
          </div>
          <div style={{ position: "absolute", left: 70, right: 60, bottom: 74 }}>
            <div style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 82, lineHeight: 1.04, color: C.ink, opacity: eo(t, a + 1.7, 0.5), transform: `translateY(${(1 - eo(t, a + 1.7, 0.5)) * 24}px)` }}>{it.t}</div>
            {it.sub && <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 300, fontSize: 46, color: "rgba(29,26,22,.72)", marginTop: 14, opacity: eo(t, a + 2.1, 0.5) }}>{it.sub}</div>}
          </div>
        </div>
        {/* página de la foto: rótulo del lugar bajo la foto */}
        <div style={{ position: "absolute", left: slot.x, top: slot.y + slot.h + 46, ...cap, fontSize: 28, color: "rgba(29,26,22,.66)", opacity: eo(t, a + 1.2, 0.5) }}>{it.city || ""}</div>
        {/* la foto: arranca a pantalla llena y se pega en su lugar (borde blanco y esquineros crecen al llegar) */}
        <div style={{ position: "absolute", left: lerp(-20, slot.x, p1), top: lerp(-20, slot.y, p1), width: lerp(1960, slot.w, p1), height: lerp(1120, slot.h, p1),
          padding: 14 * p1, background: "#fbf8f1", transform: `rotate(${rot * p1}deg)`, boxShadow: `0 ${16 * p1}px ${34 * p1}px rgba(20,14,6,${0.45 * p1})` }}>
          <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
            <Img src={src(it.f)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.11 + 0.05 * cl(k / dur)})`, transformOrigin: "0% 50%" }} />
          </div>
          {p1 > 0.6 && [0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", width: 40, height: 40, opacity: e(p1, 0.6, 1), ...(i < 2 ? { top: -5 } : { bottom: -5 }), ...(i % 2 ? { right: -5 } : { left: -5 }),
            background: "rgba(20,18,15,.85)", clipPath: i === 0 ? "polygon(0 0,100% 0,0 100%)" : i === 1 ? "polygon(0 0,100% 0,100% 100%)" : i === 2 ? "polygon(0 0,0 100%,100% 100%)" : "polygon(100% 0,100% 100%,0 100%)" }} />)}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  </AbsoluteFill>;
};

// tambor de odómetro: columna 0-9 repetida que gira hasta su dígito (vueltas extra según la posición)
const CW = 132, CH = 214;
const Tambor: React.FC<{ d: number; p: number; vueltas: number }> = ({ d, p, vueltas }) => {
  const pos = (d + 10 * vueltas) * p, tiras = vueltas + 2;
  return <div style={{ width: CW, height: CH, overflow: "hidden", position: "relative", borderRadius: 8, margin: "0 4px",
    background: "linear-gradient(180deg, #b9ad95, #f3ecdc 22%, #fbf6ea 50%, #f3ecdc 78%, #b9ad95)", boxShadow: "inset 0 0 0 2px rgba(0,0,0,.35), inset 0 10px 18px rgba(0,0,0,.25), inset 0 -10px 18px rgba(0,0,0,.25)" }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, transform: `translateY(${-pos * CH}px)` }}>
      {Array.from({ length: 10 * tiras }, (_, i) => <div key={i} style={{ height: CH, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 400, fontSize: 176, color: C.ink, lineHeight: 1 }}>{i % 10}</div>)}
    </div>
  </div>;
};

// (2) CIFRA: la foto del lugar se apaga detrás y cae un CONTADOR MECÁNICO de bronce; los tambores giran hasta la cifra.
//     «N in M» = M fotos del lugar que caen en fila y sólo N se encienden (la forma ES la proporción).
export const Cifra: React.FC<SP> = ({ t, a, b, big, lab, fuente }) => {
  const k = t - a, f = fotoDeParada(a), txt = String(big), pr = txt.match(/^(\d+) in (\d+)$/);
  const bgO = e(t, a, a + 0.6), dv = deriva(t, a, h(Math.round(a), 9)), cam = `translate(${dv.x}px, ${dv.y}px) scale(${1 + 0.012 * k})`;
  const sharpO = 1 - e(t, a + 0.05, a + 0.65);
  const pie = <>
    <div style={{ position: "absolute", top: 120, width: "100%", textAlign: "center", ...cap, fontSize: 40, letterSpacing: "0.16em", color: C.cream, textShadow: "0 3px 16px rgba(0,0,0,.7)", opacity: eo(t, a + 0.35, 0.5) }}>{lab}</div>
    <div style={{ position: "absolute", bottom: 86, width: "100%", textAlign: "center", fontFamily: SERIF, fontStyle: "italic", fontWeight: 300, fontSize: 32, color: "rgba(246,240,228,.85)", opacity: eo(t, a + 1.6, 0.5) }}>Source: {fuente}</div>
  </>;
  if (pr) {
    const N = +pr[1], M = +pr[2], tw = 150, gap = 22, x0 = 960 - (M * tw + (M - 1) * gap) / 2;
    return <AbsoluteFill style={{ ...tapaBg, overflow: "hidden" }}>
      <FondoFoto f={f} t={t} a={a} o={bgO} />
      {f && <AbsoluteFill style={{ opacity: sharpO }}><Img src={src(f)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>}
      <AbsoluteFill style={{ transform: cam }}>
        {pie}
        <div style={{ position: "absolute", top: 250, width: "100%", textAlign: "center", fontFamily: SERIF, fontWeight: 400, fontSize: 190, color: C.cream, textShadow: "0 8px 30px rgba(0,0,0,.6)", opacity: eo(t, a + 2.1, 0.4), transform: `scale(${lerp(1.25, 1, cl(spr(t, a + 2.1, 1.3)))})` }}>{N} <span style={{ fontStyle: "italic", fontWeight: 300, fontSize: 120 }}>in</span> {M}</div>
        {Array.from({ length: M }, (_, i) => { const at = a + 0.45 + i * 0.09, p = cl(spr(t, at, 1.3)), on = i < N, lit = e(t, a + 1.3 + i * 0.07, a + 1.5 + i * 0.07);
          return <div key={i} style={{ position: "absolute", left: x0 + i * (tw + gap), top: 560, width: tw, opacity: t < at ? 0 : 1, transform: `translateY(${(1 - p) * -420}px) rotate(${(h(i, 51) - 0.5) * 6}deg)` }}>
            <div style={{ background: "#fbf8f1", padding: 8, paddingBottom: 30, boxShadow: on && lit > 0.5 ? `0 0 0 5px ${C.amber}, 0 14px 30px rgba(0,0,0,.5)` : "0 14px 30px rgba(0,0,0,.5)" }}>
              <div style={{ width: "100%", height: tw * 1.15, overflow: "hidden" }}>
                <Img src={src(f || "")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: `${(i / Math.max(1, M - 1)) * 100}% 50%`, filter: on ? `grayscale(${1 - lit}) brightness(${lerp(0.55, 1, lit)})` : `grayscale(${lit}) brightness(${lerp(0.55, 0.3, lit)})` }} />
              </div>
            </div>
          </div>; })}
      </AbsoluteFill>
    </AbsoluteFill>;
  }
  // odómetro: prefijo (NOK, ~) + tambores (dígitos; , y . fijos) + sufijo (trillion, M)
  const m = txt.match(/^([^0-9]*)([0-9][0-9.,]*)(.*)$/) || ["", "", txt, ""];
  const pre = m[1].trim(), num = m[2], suf = m[3].trim(), digs = num.split("");
  const nd = digs.filter((c) => /\d/.test(c)).length; let di = 0;
  const land = cl(spr(t, a + 0.25, 1.15)), roll = (i: number) => e(t, a + 0.7 + 0.08 * i, a + 1.9 + 0.12 * i);
  return <AbsoluteFill style={{ ...tapaBg, overflow: "hidden" }}>
    <FondoFoto f={f} t={t} a={a} o={bgO} />
    {f && <AbsoluteFill style={{ opacity: sharpO }}><Img src={src(f)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>}
    <AbsoluteFill style={{ transform: cam }}>
      {pie}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ transform: `translateY(${(1 - land) * -700 + sacudon(t, a + 0.42, 8)}px) rotate(${(1 - land) * -4}deg)`, display: "flex", alignItems: "center", gap: 26, padding: "34px 46px", borderRadius: 30,
          background: "linear-gradient(180deg, #6b5532, #a88a52 18%, #5c4524 52%, #8a6d3d 85%, #4a3519)", boxShadow: `0 ${40 * land}px 90px rgba(0,0,0,.65), inset 0 2px 0 rgba(255,235,190,.6), inset 0 -3px 0 rgba(0,0,0,.4)` }}>
          {pre && <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 78, color: "#f7e9c8", letterSpacing: "0.04em", textShadow: "0 2px 0 rgba(0,0,0,.45)" }}>{pre}</div>}
          <div style={{ display: "flex", alignItems: "center", padding: 14, borderRadius: 14, background: "#151515", boxShadow: "inset 0 6px 16px rgba(0,0,0,.8)" }}>
            {digs.map((c, i) => /\d/.test(c)
              ? (() => { const j = di++; return <Tambor key={i} d={+c} p={roll(j)} vueltas={1 + (nd - 1 - j)} />; })()
              : <div key={i} style={{ width: 46, textAlign: "center", fontFamily: SERIF, fontSize: 150, color: "#f7e9c8", alignSelf: "flex-end", lineHeight: 1.1 }}>{c}</div>)}
          </div>
          {suf && <div style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 96, color: "#f7e9c8", textShadow: "0 2px 0 rgba(0,0,0,.45)" }}>{suf}</div>}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  </AbsoluteFill>;
};

// (3) RUTA: billete de tren grande que entra deslizándose sobre la foto del lugar; 3 estaciones (anterior · hoy · siguiente),
//     el tren ámbar viaja y al llegar la perforadora le hace el agujero al billete
export const Ruta: React.FC<SP> = ({ t, a, b, hasta = 1, titulo }) => {
  const k = t - a, i0 = Math.max(0, hasta - 1), st = [i0 - 1, i0, i0 + 1].filter((i) => i >= 0 && i < D.paradas.length);
  const xs = st.length === 3 ? [330, 820, 1310] : st[0] === i0 ? [520, 1160] : [520, 1160];
  const X = (i: number) => xs[st.indexOf(i)] ?? 0, from = st[0] === i0 ? X(i0) - 240 : X(st[0]), to = X(i0);
  const go = e(t, a + 0.9, a + 2.5), arrive = a + 2.5, land = cl(spr(t, a + 0.1, 1.05));
  const dv = deriva(t, a, h(Math.round(a), 12)), f = D.paradas[i0]?.f;
  return <AbsoluteFill style={{ ...tapaBg, overflow: "hidden" }}>
    <FondoFoto f={f} t={t} a={a} o={e(t, a, a + 0.5)} />
    {f && <AbsoluteFill style={{ opacity: 1 - e(t, a + 0.05, a + 0.6) }}><Img src={src(f)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>}
    <AbsoluteFill style={{ transform: `translate(${dv.x}px, ${dv.y}px) scale(${1 + 0.012 * k})` }}>
      <div style={{ position: "absolute", left: 140, top: 250, width: 1640, height: 580, ...paginaBg, borderRadius: 20, boxShadow: "0 40px 90px rgba(0,0,0,.6)",
        transform: `translateX(${(1 - land) * 1900}px) rotate(${(1 - land) * 6 - 1.2}deg) translateY(${sacudon(t, arrive, 6)}px)` }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 104, background: C.red, borderRadius: "20px 20px 0 0", display: "flex", alignItems: "center", padding: "0 60px", justifyContent: "space-between" }}>
          <span style={{ ...cap, color: C.cream, fontSize: 38, letterSpacing: "0.18em" }}>{titulo || "the route"}</span>
          <span style={{ ...cap, color: C.cream, fontSize: 26, opacity: 0.85 }}>single · one passenger</span>
        </div>
        <div style={{ position: "absolute", left: 1440, top: 104, bottom: 0, width: 4, backgroundImage: "repeating-linear-gradient(180deg, rgba(29,26,22,.5) 0 12px, transparent 12px 22px)" }} />
        <div style={{ position: "absolute", left: 1470, top: 150, width: 150, ...cap, fontSize: 22, color: "rgba(29,26,22,.6)", lineHeight: 1.6 }}>valid<br />one way<br />no return</div>
        <div style={{ position: "absolute", top: 330, left: xs[0] - 260, width: 1290 * e(t, a + 0.3, a + 1.0), height: 8, background: C.ink, borderRadius: 4 }} />
        {st.map((i) => { const it = D.paradas[i], hoy = i === i0, x = X(i), ap = eo(t, a + 0.45 + 0.12 * st.indexOf(i), 0.4);
          return <div key={i} style={{ position: "absolute", left: x - 30, top: 304, opacity: ap }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: C.page, border: `9px solid ${C.ink}` }} />
            <div style={{ position: "absolute", top: -170, left: -150, width: 360, textAlign: "center" }}>
              <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 36, color: C.red }}>{String(it.n).padStart(2, "0")}</div>
              <div style={{ fontFamily: SERIF, fontSize: hoy ? 60 : 46, color: C.ink, lineHeight: 1.05, opacity: hoy ? 1 : 0.55 }}>{it.city || it.corto}</div>
            </div>
          </div>; })}
        {/* agujero de la perforadora sobre la estación de hoy + el papelito que cae */}
        {t >= arrive && <div style={{ position: "absolute", left: to - 22, top: 312, width: 44, height: 44, borderRadius: "50%", background: "#0b1424", boxShadow: "inset 0 4px 8px rgba(0,0,0,.8)" }} />}
        {t >= arrive && t < arrive + 1.2 && <div style={{ position: "absolute", left: to - 20, top: 314 + 900 * Math.pow(t - arrive, 2), width: 40, height: 40, borderRadius: "50%", ...paginaBg, transform: `rotate(${(t - arrive) * 400}deg)`, boxShadow: "0 4px 8px rgba(0,0,0,.4)" }} />}
        <div style={{ position: "absolute", top: 302, left: lerp(from, to, go) - 32, width: 64, height: 64, borderRadius: "50%", background: C.amber, boxShadow: "0 0 0 12px rgba(255,178,87,.35), 0 6px 14px rgba(0,0,0,.4)", opacity: e(t, a + 0.7, a + 1.0) * (t >= arrive + 0.15 ? 0 : 1) }} />
      </div>
    </AbsoluteFill>
  </AbsoluteFill>;
};

// (4) REPASO: las fotos de todas las paradas caen en dos filas grandes; el sello VISITED golpea cada una por turno (la foto se enciende)
export const Repaso: React.FC<SP> = ({ t, a, b, marcas = [], titulo, lista = false }) => {
  const n = D.paradas.length, cols = Math.ceil(n / 2), gap = 34, w = Math.min(410, (1760 - (cols - 1) * gap) / cols), hh = w * 0.62;
  const x0 = 960 - (cols * w + (cols - 1) * gap) / 2, k = t - a, dv = deriva(t, a, 0.37);
  const at = (i: number) => marcas[i] ?? a + 1.1 + i * ((b - a - 2.4) / Math.max(1, n - 1));
  let sh = 0; if (!lista) for (let i = 0; i < n; i++) sh += sacudon(t, at(i), 5);
  return <AbsoluteFill style={{ ...tapaBg, overflow: "hidden" }}>
    <FondoFoto f={D.paradas[n - 1]?.f} t={t} a={a} o={0.8} />
    <AbsoluteFill style={{ transform: `translate(${dv.x}px, ${dv.y + sh}px) scale(${1 + 0.014 * k})` }}>
      <div style={{ position: "absolute", top: 60, width: "100%", textAlign: "center", fontFamily: SERIF, fontWeight: 300, fontSize: 80, color: C.cream, textShadow: "0 4px 20px rgba(0,0,0,.6)", opacity: eo(t, a, 0.5) }}>{titulo}</div>
      {D.paradas.map((it, i) => {
        const c = i % cols, r = Math.floor(i / cols), en = cl(spr(t, a + 0.1 + i * 0.07, 1.1)), lit = e(t, at(i), at(i) + 0.15), pop = Math.exp(-Math.max(0, t - at(i)) * 4) * (t >= at(i) ? 1 : 0);
        return <div key={i} style={{ position: "absolute", left: x0 + c * (w + gap), top: 210 + r * (hh + 150), opacity: en, zIndex: t >= at(i) ? 2 : 1,
          transform: `translateY(${(1 - en) * 80}px) rotate(${(h(i, 4) - 0.5) * 4}deg) scale(${1 + 0.07 * pop})` }}>
          <div style={{ width: w, background: "#fbf8f1", padding: 10, paddingBottom: 16, boxShadow: "0 16px 34px rgba(0,0,0,.5)" }}>
            <div style={{ width: "100%", height: hh, overflow: "hidden" }}><Img src={src(it.f)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.11)", transformOrigin: "0% 50%", filter: `grayscale(${1 - lit}) brightness(${lerp(0.6, 1, lit)})` }} /></div>
            <div style={{ fontFamily: SERIF, fontSize: 36, color: C.ink, marginTop: 10, lineHeight: 1.05, whiteSpace: "nowrap", overflow: "hidden" }}><b style={{ fontFamily: SANS, color: C.red, marginRight: 12 }}>{String(it.n).padStart(2, "0")}</b>{it.corto || it.t}</div>
          </div>
          {!lista && t >= at(i) && <div style={{ position: "absolute", left: w * 0.3, top: hh * 0.12 }}><Sello t={t} at={at(i)} top="stop" big="visited" bottom={String(it.n).padStart(2, "0")} rot={-14 + 10 * h(i, 5)} scale={0.62} col={tinta(i + 1)} /></div>}
        </div>;
      })}
    </AbsoluteFill>
  </AbsoluteFill>;
};

// (5) LISTA (intro): las mismas fotos caen y se encienden de a una, sin sello (todavía no se visitaron)
export const Lista: React.FC<SP> = (p) => <Repaso {...p} lista />;

export const ESCENAS: Record<string, React.FC<any>> = { parada: Parada, lista: Lista, ruta: Ruta, cifra: Cifra, repaso: Repaso };
