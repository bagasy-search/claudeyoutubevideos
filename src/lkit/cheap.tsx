// lkit · kit "TheCheapFix" v3 (15-oct-2026), copiado a 10 fps de youtu.be/SUqzcj5udsk (ver tools/CHEAPFIX_ANALISIS_10FPS.md).
// Lo que hace el original y copiamos acá:
//  - El texto son las PALABRAS DICHAS en ese momento, cada ~6-8 s, siempre sobre un CLIP que sigue corriendo; sobrevive a los cortes.
//  - Al entrar el texto, el clip de abajo se desenfoca y oscurece en 3-4 cuadros y flotan motas de polvo blancas.
//  - BigLine: MAYÚSCULAS blancas, entran PALABRA POR PALABRA (desenfocada y grande → nítida) y salen achicándose.
//  - PricePill: plata en píldora rosa que entra y sale con un barrido de línea roja de izquierda a derecha.
//  - Typer: itálica blanca chica que se escribe LETRA POR LETRA al ritmo de la voz.
//  - LeakGlitch: en casi todos los cortes, 3 cuadros de sobreexposición naranja con bloques glitch.
//  - ItemQ (ItemCard look="q"): seda violeta con "?"; la caja de borde rojo ABRE desde una línea y cierra a línea.
//  - Card (plano): el clip se achica en 5 cuadros a tarjeta redondeada sobre su propia versión desenfocada.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, useCurrentFrame } from "remotion";
import { loadFont as loadMont } from "@remotion/google-fonts/Montserrat";
import { clip, cl, eo, ez, fit, img, useT, type P } from "./core";

const fMo = loadMont("normal", { weights: ["600", "700", "800"], subsets: ["latin", "latin-ext"] });
const fMoI = loadMont("italic", { weights: ["700"], subsets: ["latin", "latin-ext"] });
export const SANS = fMo.fontFamily;
export const SANS_I = fMoI.fontFamily;
export const PINK = "#E9506A";
export const RED = "#D9414A";

// rampa del desenfoque: el original entra y sale en 2-3 cuadros
const ramp = (f: number, d: number, fin = 4, fout = 4) => ez(f / fin) * (1 - ez((f - (d - fout)) / fout));

// el clip de abajo se desenfoca + oscurece + motas de polvo (lo comparten las superposiciones de texto)
const Under: React.FC<{ f: number; u: number; dim?: number; blur?: number }> = ({ f, u, dim = 0.45, blur = 9 }) => (
  <>
    <AbsoluteFill style={{ backdropFilter: `blur(${blur * u}px) brightness(${1 - dim * u})`, WebkitBackdropFilter: `blur(${blur * u}px) brightness(${1 - dim * u})` } as React.CSSProperties} />
    <AbsoluteFill style={{ opacity: u, pointerEvents: "none" }}>
      {Array.from({ length: 28 }, (_, i) => {
        const r = (n: number) => { const x = Math.sin(i * 53.1 + n * 17.7) * 43758.5; return x - Math.floor(x); };
        const x = r(1) * 1920 + Math.sin(f / (40 + 30 * r(2)) + r(3) * 6) * 30, y = (r(4) * 1080 - f * (0.3 + 0.7 * r(5)) + 2160) % 1080;
        const s = 2 + 4 * r(6);
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: s, height: s, borderRadius: 9, background: "#fff", opacity: 0.25 + 0.5 * r(7), filter: r(8) > 0.6 ? "blur(1.5px)" : undefined }} />;
      })}
    </AbsoluteFill>
  </>
);

// words = [[palabra, segundo absoluto]]: cada palabra entra desenfocada y más grande en SU segundo; al final sale achicándose.
// Frase larga (>40 letras) → más chica y en el tercio superior, como el original (230 s).
export const BigLine: React.FC<{ txt: string; d: number; a?: number; words?: [string, number][] }> = ({ txt, d, a = 0, words }) => {
  const f = useCurrentFrame(), u = ramp(f, d);
  const W: [string, number][] = words && words.length ? words.map(([w, t]) => [String(w).toUpperCase(), t]) : String(txt).toUpperCase().split(/\s+/).map((w) => [w, a]);
  const T = W.map((w) => w[0]).join(" ");
  const long = T.length > 40;
  const lines = T.length > 60 ? 3 : T.length > 18 ? 2 : 1;
  const sz = long ? Math.min(42, fit(T, 1300, 42, "label", lines, 1, 26)) : Math.min(64, fit(T, 1100, 64, "label", lines, 1, 36));
  const at = (t: number) => Math.max(0, Math.round((t - a) * 30));
  const out = cl((f - (d - 5)) / 5);
  return (
    <AbsoluteFill>
      <Under f={f} u={u} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: long ? "flex-start" : "center", paddingTop: long ? 300 : 0 }}>
        <div style={{ maxWidth: long ? 1400 : 1150, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: sz, lineHeight: 1.18, letterSpacing: 0.5,
          color: "#fff", opacity: 1 - out, transform: `scale(${1 - 0.18 * out})`, filter: out ? `blur(${out * 7}px)` : undefined, textShadow: "0 3px 14px rgba(0,0,0,0.45)" }}>
          {W.map(([w, t], i) => {
            const k = eo(cl((f - at(t)) / 4));
            return <span key={i} style={{ display: "inline-block", whiteSpace: "pre", opacity: k, filter: k < 1 ? `blur(${(1 - k) * 8}px)` : undefined, transform: `scale(${1 + 0.25 * (1 - k)})` }}>{w}{i < W.length - 1 ? " " : ""}</span>;
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// píldora rosa: entra con una línea roja que barre de izquierda a derecha y se va igual
export const PricePill: React.FC<{ txt: string; d: number }> = ({ txt, d }) => {
  const f = useCurrentFrame(), u = ramp(f, d);
  const sin = eo(cl((f - 1) / 4)), sout = ez(cl((f - (d - 5)) / 4));
  const sz = Math.min(46, fit(txt, 800, 46, "label", 1, 0, 28));
  const edge = sout > 0 ? sout : sin;
  return (
    <AbsoluteFill>
      <Under f={f} u={u} dim={0.35} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative" }}>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: sz, color: "#fff", background: PINK, borderRadius: sz, padding: `${sz * 0.1}px ${sz * 0.45}px`,
            whiteSpace: "nowrap", boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
            clipPath: sout > 0 ? `inset(0 0 0 ${sout * 100}%)` : `inset(0 ${(1 - sin) * 100}% 0 0)` }}>{txt}</div>
          {edge > 0.02 && edge < 0.98 ? <div style={{ position: "absolute", top: "50%", left: `${edge * 100}%`, width: 160, height: 3, translate: "-100% -50%",
            background: `linear-gradient(90deg, rgba(233,80,106,0), ${PINK})`, boxShadow: `0 0 10px ${PINK}` }} /> : null}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// words = [["12", t], ["uses", t], ["\n", 0], ["Number", t] ...]: se escribe LETRA POR LETRA; cada palabra se tipea entre su segundo y el de la siguiente.
export const Typer: React.FC<{ words: [string, number][]; a: number; d: number }> = ({ words, a, d }) => {
  const f = useCurrentFrame(), u = ramp(f, d);
  const at = (t: number) => (t - a) * 30;
  const real = words.filter((w) => w[0] !== "\n");
  const L: { w: string; t0: number; t1: number }[][] = [[]];
  let ri = 0;
  words.forEach((w) => {
    if (w[0] === "\n") { L.push([]); return; }
    const nx = real[ri + 1]; ri++;
    const t0 = at(w[1]), t1 = nx ? Math.min(at(nx[1]), t0 + 12) : t0 + 8;
    L[L.length - 1].push({ w: w[0], t0, t1: Math.max(t0 + 2, t1) });
  });
  const o = 1 - cl((f - (d - 5)) / 5);
  return (
    <AbsoluteFill>
      <Under f={f} u={u} dim={0.4} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", fontFamily: SANS_I, fontStyle: "italic", fontWeight: 700, fontSize: 40, lineHeight: 1.3, color: "#fff", opacity: o, textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
          {L.map((ln, i) => <div key={i} style={{ minHeight: 52 }}>{ln.map(({ w, t0, t1 }, j) => {
            const n = Math.round(w.length * cl((f - t0) / (t1 - t0)));
            return n > 0 ? <span key={j}>{w.slice(0, n)}{n === w.length && j < ln.length - 1 ? " " : ""}</span> : null;
          })}</div>)}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// quemado de película largo (sobre la tarjeta de ítem): sobreexposición naranja + formas oscuras grandes
export const Leak: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame();
  const u = f / Math.max(1, d), o = Math.sin(Math.PI * cl(u));
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <AbsoluteFill style={{ mixBlendMode: "screen", opacity: 0.95 * o, background: `radial-gradient(ellipse 80% 90% at ${30 + 40 * u}% 50%, rgba(255,140,60,1), rgba(255,90,30,0.85) 45%, rgba(200,40,10,0.6) 80%)` }} />
      <AbsoluteFill style={{ mixBlendMode: "multiply", opacity: 0.85 * o }}>
        {[[18, 20, 22, 46, -8], [44, 8, 14, 70, 4], [62, 48, 30, 18, -3]].map(([x, y, w, h, r], i) => (
          <div key={i} style={{ position: "absolute", left: `${x - 30 * u * (i % 2 ? -1 : 1)}%`, top: `${y}%`, width: `${w}%`, height: `${h}%`, borderRadius: 18,
            background: "rgba(70,20,30,0.9)", transform: `rotate(${r}deg)`, filter: "blur(6px)" }} />
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// LeakGlitch: la firma de los cortes del original (2-3 cuadros): sobreexposición naranja/roja + bloques rectangulares
// claros/oscuros que saltan de lugar en cada cuadro. Va centrada en el corte (a = corte - 1 cuadro, d = 3-4 cuadros).
export const LeakGlitch: React.FC<{ d: number; seed?: number }> = ({ d, seed = 1 }) => {
  const f = useCurrentFrame();
  const o = Math.sin(Math.PI * cl((f + 0.5) / Math.max(1, d)));
  const r = (n: number) => { const x = Math.sin((seed * 31.7 + f * 13.3 + n) * 12.9898) * 43758.5453; return x - Math.floor(x); };
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <AbsoluteFill style={{ mixBlendMode: "screen", opacity: o, background: `radial-gradient(ellipse 90% 100% at ${20 + 60 * r(1)}% ${40 + 20 * r(2)}%, rgba(255,170,90,1), rgba(255,95,35,0.95) 45%, rgba(190,30,20,0.75) 85%)` }} />
      {Array.from({ length: 9 }, (_, i) => {
        const w = 6 + 22 * r(10 + i), h = 6 + 26 * r(20 + i), x = r(30 + i) * (100 - w), y = r(40 + i) * (100 - h);
        const dark = r(50 + i) > 0.5;
        return <div key={i} style={{ position: "absolute", left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%`, opacity: o,
          mixBlendMode: dark ? "multiply" : "screen", background: dark ? "rgba(60,15,25,0.85)" : "rgba(255,235,200,0.75)" }} />;
      })}
    </AbsoluteFill>
  );
};

// seda negra-violeta tipo mármol líquido (ruido SVG que se desplaza) + "?" que flotan
const Silk: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ backgroundColor: "#0a0810", overflow: "hidden" }}>
    <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
      <filter id="silk" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.0016 0.0042" numOctaves={2} seed={7} result="n" />
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.16  0 0 0 0 0.12  0 0 0 0 0.24  0 0 0 9 -4.2" />
      </filter>
      <g transform={`translate(${-120 + 60 * Math.sin(f / 80)} ${-60 + 40 * Math.cos(f / 95)}) rotate(${-14 + 3 * Math.sin(f / 120)} 960 540) scale(1.25)`}>
        <rect width="1920" height="1080" filter="url(#silk)" />
      </g>
    </svg>
    {[0, 1, 2].map((i) => (
      <div key={i} style={{ position: "absolute", left: "-20%", top: `${8 + i * 30}%`, width: "140%", height: "22%", borderRadius: "50%",
        transform: `rotate(${-20 + i * 9 + 4 * Math.sin(f / 60 + i)}deg) translateX(${50 * Math.sin(f / 70 + i * 2)}px)`,
        background: "linear-gradient(180deg, rgba(0,0,0,0), rgba(150,135,175,0.18) 50%, rgba(0,0,0,0))", filter: "blur(14px)" }} />
    ))}
    {Array.from({ length: 16 }, (_, i) => {
      const r = (n: number) => { const x = Math.sin(i * 77.3 + n * 19.1) * 43758.5; return x - Math.floor(x); };
      const big = r(4) > 0.8;
      return <div key={"q" + i} style={{ position: "absolute", left: `${4 + r(1) * 92}%`, top: `${(r(2) * 100 - f * (0.04 + 0.05 * r(3)) + 200) % 106 - 4}%`,
        fontFamily: SANS, fontWeight: 800, fontSize: big ? 70 + 40 * r(5) : 22 + 22 * r(5), color: `rgba(225,220,235,${big ? 0.45 : 0.3})`,
        filter: `blur(${r(6) > 0.65 ? 2.5 : 0}px)`, transform: `rotate(${-12 + 24 * r(7)}deg)` }}>?</div>;
    })}
  </AbsoluteFill>
);

// tarjeta de ítem: "#N" y lo DICHO en minúscula; la caja abre desde una línea roja (ancho en 3 cuadros, alto en 4) y cierra igual
export const ItemQ: React.FC<{ a: number; d: number; n: number; name: string; said?: string; t?: number; instead?: string }> = ({ a, d, n, name, said }) => {
  const { f } = useT(a);
  const ox = eo(cl((f - 2) / 3)), oy = eo(cl((f - 5) / 4));
  const cy = ez(cl((f - (d - 8)) / 4)), cx = ez(cl((f - (d - 4)) / 3));
  const sx = ox * (1 - cx), sy = Math.max(0.03, oy * (1 - cy));
  const txt = said || name;
  const sz = Math.min(50, fit(txt, 1500, 50, "label", 1, 0, 26));
  const tOp = cl((sy - 0.6) / 0.4);
  return (
    <AbsoluteFill>
      <Silk f={f} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ opacity: sx > 0.01 ? 1 : 0, transform: `scale(${sx}, ${sy})`, textAlign: "center",
          border: `2px solid ${RED}`, borderRadius: 14, background: "rgba(30,6,12,0.62)", padding: "18px 46px 20px",
          boxShadow: "0 0 26px rgba(217,65,74,0.35), inset 0 0 18px rgba(217,65,74,0.12)" }}>
          <div style={{ opacity: tOp, fontFamily: SANS, fontWeight: 600, fontSize: sz, color: "#fff", lineHeight: 1.25 }}>#{n}</div>
          <div style={{ opacity: tOp, fontFamily: SANS, fontWeight: 600, fontSize: sz, color: "#fff", lineHeight: 1.25, whiteSpace: "nowrap" }}>{txt}</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// tarjeta flotante: el clip se achica (5 cuadros) a una tarjeta redondeada con sombra sobre su versión desenfocada
export const Card: P<{ k: string; vid?: boolean; ofs?: number; w?: number; rate?: number }> = ({ a, d, k, vid, ofs = 0, w = 1040, rate = 1 }) => {
  const { f } = useT(a);
  const u = eo(cl(f / 5)), sc = 1 + (1920 / w - 1) * (1 - u);
  const h = Math.round(w * 9 / 16);
  const media = (st: React.CSSProperties) => vid
    ? <OffthreadVideo src={clip(k)} startFrom={Math.round(ofs * 30)} playbackRate={rate} muted style={{ width: "100%", height: "100%", objectFit: "cover", ...st }} />
    : <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover", ...st }} />;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ filter: `blur(${18 * u}px) brightness(${1 - 0.45 * u})`, transform: "scale(1.1)" }}>{media({})}</AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: w, height: h, borderRadius: 22 * u, overflow: "hidden", transform: `scale(${sc * (1 + 0.025 * f / Math.max(1, d))})`,
          boxShadow: `0 30px 70px rgba(0,0,0,${0.55 * u})` }}>{media({})}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const CHEAP_OVERLAYS: Record<string, React.FC<any>> = { BigLine, PricePill, Typer, Leak, LeakGlitch };
export const CHEAP_SHOTS: Record<string, React.FC<any>> = { Card };
