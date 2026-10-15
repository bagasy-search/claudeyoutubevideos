// lkit · kit de texto "TheCheapFix" v2 (15-oct-2026), copiado cuadro a cuadro de youtu.be/SUqzcj5udsk (1080p, 2 fps).
// Lo que hace el original y copiamos acá:
//  - El texto son las PALABRAS DICHAS en ese momento, cada ~6-8 s, 1,5-3 s en pantalla, siempre sobre un CLIP que sigue corriendo.
//  - Al entrar el texto, el clip de abajo se desenfoca y oscurece DE A POCO (~0,5 s) y flotan motas de polvo blancas.
//  - BigLine: MAYÚSCULAS blancas, sans gruesa, centrada, 1-3 renglones.
//  - PricePill: plata / rangos ("$59 to $150") en píldora rosa, mismo desenfoque abajo.
//  - Typer: itálica blanca chica que se escribe PALABRA POR PALABRA ("12 uses / Number 7 is the one nobody knows about").
//  - Leak: quemado de película naranja con formas grandes oscuras (~0,5 s); el texto sigue encima.
//  - ItemQ (ItemCard look="q"): "#N" + lo dicho en minúscula, caja fina de borde rojo sobre seda negra-violeta tipo mármol líquido con "?".
//  - Card (plano): la foto/clip se achica a tarjeta de esquinas redondeadas con sombra sobre su propia versión desenfocada.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, useCurrentFrame } from "remotion";
import { loadFont as loadMont } from "@remotion/google-fonts/Montserrat";
import { clip, cl, eo, ez, fit, img, lin, sp, useT, type P } from "./core";

const fMo = loadMont("normal", { weights: ["600", "700", "800"], subsets: ["latin", "latin-ext"] });
const fMoI = loadMont("italic", { weights: ["700"], subsets: ["latin", "latin-ext"] });
export const SANS = fMo.fontFamily;
export const SANS_I = fMoI.fontFamily;
export const PINK = "#E9506A";
export const RED = "#D9414A";

// rampa del desenfoque: entra en ~0,5 s, sale en ~0,25 s
const ramp = (f: number, d: number, fin = 14, fout = 7) => ez(f / fin) * (1 - ez((f - (d - fout)) / fout));

// el clip de abajo se desenfoca + oscurece + motas de polvo (lo comparten las 3 superposiciones de texto)
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

export const BigLine: React.FC<{ txt: string; d: number }> = ({ txt, d }) => {
  const f = useCurrentFrame(), u = ramp(f, d);
  const T = String(txt).toUpperCase().replace(/\s+/g, " ").trim();
  const lines = T.length > 44 ? 3 : T.length > 18 ? 2 : 1;
  const sz = Math.min(64, fit(T, 1100, 64, "label", lines, 1, 36));
  const tu = eo(cl((f - 3) / 10));
  return (
    <AbsoluteFill>
      <Under f={f} u={u} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ maxWidth: 1150, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: sz, lineHeight: 1.18, letterSpacing: 0.5,
          color: "#fff", opacity: tu * (1 - cl((f - (d - 6)) / 6)), filter: `blur(${(1 - tu) * 6}px)`, textShadow: "0 3px 14px rgba(0,0,0,0.45)" }}>{T}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const PricePill: React.FC<{ txt: string; d: number }> = ({ txt, d }) => {
  const f = useCurrentFrame(), u = ramp(f, d);
  const k = sp(f, 3, 14, 200), o = 1 - cl((f - (d - 6)) / 6);
  const sz = Math.min(46, fit(txt, 800, 46, "label", 1, 0, 28));
  return (
    <AbsoluteFill>
      <Under f={f} u={u} dim={0.35} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: sz, color: "#fff", background: PINK, borderRadius: sz, padding: `${sz * 0.1}px ${sz * 0.45}px`,
          whiteSpace: "nowrap", opacity: cl(k * 2) * o, transform: `scale(${0.85 + 0.15 * k})`, boxShadow: "0 6px 20px rgba(0,0,0,0.25)" }}>{txt}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// words = [["12", t], ["uses", t], ["\n", 0], ["Number", t] ...]: cada palabra aparece en SU segundo absoluto (a = inicio de la superposición)
export const Typer: React.FC<{ words: [string, number][]; a: number; d: number }> = ({ words, a, d }) => {
  const f = useCurrentFrame(), u = ramp(f, d);
  const at = (t: number) => Math.round((t - a) * 30);
  const L: [string, number][][] = [[]];
  words.forEach((w) => (w[0] === "\n" ? L.push([]) : L[L.length - 1].push(w)));
  const o = 1 - cl((f - (d - 6)) / 6);
  return (
    <AbsoluteFill>
      <Under f={f} u={u} dim={0.4} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", fontFamily: SANS_I, fontStyle: "italic", fontWeight: 700, fontSize: 40, lineHeight: 1.3, color: "#fff", opacity: o, textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
          {L.map((ln, i) => <div key={i}>{ln.map(([w, t], j) => <span key={j} style={{ opacity: f >= at(t) ? 1 : 0 }}>{w}{j < ln.length - 1 ? " " : ""}</span>)}</div>)}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// quemado de película: el cuadro se sobreexpone naranja y pasan formas grandes oscuras
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

// tarjeta de ítem: "#N" y lo DICHO en minúscula (con su coma si la hay), caja fina
export const ItemQ: React.FC<{ a: number; d: number; n: number; name: string; said?: string; t?: number; instead?: string }> = ({ a, d, n, name, said }) => {
  const { f } = useT(a);
  const u = sp(f, 4, 16, 140), out = lin(f, d - 6, d, 0, 1);
  const txt = said || name;
  const sz = Math.min(34, fit(txt, 980, 34, "label", 1, 0, 22));
  return (
    <AbsoluteFill>
      <Silk f={f} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ opacity: cl(u * 2) * (1 - out), transform: `scale(${0.94 + 0.06 * u})`, textAlign: "center",
          border: `2px solid ${RED}`, borderRadius: 14, background: "rgba(30,6,12,0.62)", padding: "18px 46px 20px",
          boxShadow: "0 0 26px rgba(217,65,74,0.35), inset 0 0 18px rgba(217,65,74,0.12)" }}>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: sz, color: "#fff", lineHeight: 1.25 }}>#{n}</div>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: sz, color: "#fff", lineHeight: 1.25, whiteSpace: "nowrap" }}>{txt}</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// tarjeta flotante: la foto/clip se achica a una tarjeta redondeada con sombra sobre su versión desenfocada
export const Card: P<{ k: string; vid?: boolean; ofs?: number; w?: number }> = ({ a, d, k, vid, ofs = 0, w = 1040 }) => {
  const { f } = useT(a);
  const u = eo(cl(f / 12)), sc = 1 + (1920 / w - 1) * (1 - u);
  const h = Math.round(w * 9 / 16);
  const media = (st: React.CSSProperties) => vid
    ? <OffthreadVideo src={clip(k)} startFrom={Math.round(ofs * 30)} muted style={{ width: "100%", height: "100%", objectFit: "cover", ...st }} />
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

export const CHEAP_OVERLAYS: Record<string, React.FC<any>> = { BigLine, PricePill, Typer, Leak };
export const CHEAP_SHOTS: Record<string, React.FC<any>> = { Card };
