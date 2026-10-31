// KIT de los componentes únicos (1 por minuto, pedido del creador 28-oct: «que se sienta adictivo, que no se repitan»).
// Escenario común: entra con una transición distinta por pieza (iris, barrido, persianas, partido, caída) con resorte,
// cámara viva en curvas y salida hacia atrás fundida. Cada componente sólo dibuja su objeto adentro.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { loadFont as loadHand } from "@remotion/google-fonts/Caveat";
import { loadFont as loadMark } from "@remotion/google-fonts/PermanentMarker";
import { COL, FONT, P } from "./lib";
import { Accent, Ac } from "./acentos";
import ACJ from "./ac.json";
const AC = ACJ as unknown as Record<string, Ac & { rot?: number; side?: number }>;

export const { fontFamily: HAND } = loadHand("normal", { weights: ["600", "700"], subsets: ["latin"] });
export const { fontFamily: MARK } = loadMark("normal", { weights: ["400"], subsets: ["latin"] });
export { FONT, COL };

export const phys = (t: number, a: number, w = 7, z = 0.42) => {
  const x = t - a; if (x <= 0) return 0;
  const wd = w * Math.sqrt(1 - z * z);
  return 1 - Math.exp(-z * w * x) * (Math.cos(wd * x) + (z * w / wd) * Math.sin(wd * x));
};
export const cl = (x: number) => Math.max(0, Math.min(1, x));
export const eIn = (t: number, a: number, b: number) => { const c = cl((t - a) / (b - a)); return c * c * c; };
export const eio = (t: number, a: number, b: number) => { const c = cl((t - a) / (b - a)); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
export const img = (id: string) => staticFile("img/" + P + id + ".jpg");
export const TX = "#f7f4ee", DIM = "rgba(247,244,238,.58)", AMB = COL.amber, RED = "#ff5a4a", ICE = COL.ice, GRN = "#6fe39a";

export type H = { k: string; at: number; out: number; img?: string; imgs?: (string | undefined)[]; [x: string]: any };
export type Mode = "iris" | "wipe" | "blinds" | "split" | "drop";

const maskOf = (m: Mode, p: number): string => {
  if (m === "iris") return `radial-gradient(circle at 50% 52%, #000 ${p * 1500}px, transparent ${p * 1500 + 480}px)`;
  if (m === "wipe") return `linear-gradient(105deg, #000 ${p * 150 - 30}%, transparent ${p * 150}%)`;
  if (m === "split") { const a = 50 - p * 62, b = 50 + p * 62; return `linear-gradient(90deg, transparent ${a}%, #000 ${a + 10}%, #000 ${b - 10}%, transparent ${b}%)`; }
  // persianas → ELEVACIÓN (29-oct, evaluador: las rendijas negras parecían un glitch y cortaban el título): la pieza sube desde abajo con un borde suave
  if (m === "blinds") return `linear-gradient(0deg, #000 ${p * 160 - 40}%, transparent ${p * 160}%)`;
  return `linear-gradient(180deg, #000 ${p * 150 - 30}%, transparent ${p * 150}%)`;
};

// escenario: fondo + máscara de entrada/salida + cámara curva. children recibe tt (segundos desde at).
export const Stage: React.FC<{ t: number; h: H; mode: Mode; bg?: string; cam?: number; children: (tt: number) => React.ReactNode }> = ({ t, h, mode, bg, cam = 1, children }) => {
  const { at, out } = h;
  if (t < at - 0.05 || t > out + 0.85) return null;
  const inn = phys(t, at, 3.8, 0.72), xo = eIn(t, out - 0.25, out + 0.75), p = cl(inn) * (1 - xo);
  if (p <= 0.004) return null;
  const tt = (t - at) * (h.sp ?? 1), A0 = AC[h.k], mk = h.ph && A0 ? "none" : maskOf(h.ph ? "iris" : mode, p); // v4: con foto, fundido de cuadro entero (sin círculo)
  return <AbsoluteFill style={{ WebkitMaskImage: mk, maskImage: mk, fontFamily: FONT, color: TX, ...(mk === "none" ? { opacity: cl(p * 2.6), transform: `scale(${1.04 - 0.04 * cl(inn)})` } : {}) } as React.CSSProperties}>
    <AbsoluteFill style={{ background: bg ?? "radial-gradient(ellipse 75% 65% at 50% 46%, #1d1a16, #070708 72%)" }} />
    {h.ph && <PhotoHero tt={tt} id={h.ph} dur={(out - at) * (h.sp ?? 1)} said={((h.said ?? at) - at) * (h.sp ?? 1)} solo={!!h.solo} ac={h.solo ? AC[h.k] : undefined} />}
    {h.solo && h.kw && !(AC[h.k] as any)?.noword && <HeroWord tt={tt} kw={h.kw} kw2={undefined} said={((h.said ?? at) - at) * (h.sp ?? 1)} v={AC[h.k] ? (AC[h.k].side ?? (AC[h.k].x < 50 ? 1 : 0)) : [...h.k].reduce((a: number, c: string) => a + c.charCodeAt(0), 0) % 3} />}
    {/* la foto del momento, desenfocada y oscura, con paralaje lento: el componente vive DENTRO de la escena, no sobre un fondo vacío */}
    {h.bg && !bg && !h.ph && <AbsoluteFill style={{ opacity: 0.38 }}><Img src={img(h.bg)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(26px) saturate(.8) brightness(.55)", transform: `scale(${1.18 + 0.03 * Math.sin(tt * 0.2)}) translateX(${-14 * tt / Math.max(4, out - at)}px)` }} /></AbsoluteFill>}
    {/* piso: charco de luz cálida y reflejo, para que los objetos apoyen en algo */}
    <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 62%, rgba(255,190,120,.05) 74%, rgba(0,0,0,.35) 100%)" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 42% 14% at 50% 86%, rgba(255,196,130,.13), transparent 70%)" }} />
    {/* haz de luz de arriba que respira muy lento */}
    <AbsoluteFill style={{ background: `conic-gradient(from 168deg at 50% -12%, transparent 0deg, rgba(255,226,180,${0.05 + 0.015 * Math.sin(tt * 0.5)}) 12deg, transparent 24deg)`, mixBlendMode: "screen" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 120% 90% at 50% 50%, transparent 55%, rgba(0,0,0,.55))" }} />
    <AbsoluteFill style={{ perspective: 2200, opacity: cl(inn * 1.6) * (1 - xo * 0.7) }}>
      <AbsoluteFill style={{ transformStyle: "flat", perspective: 2200, transform: `translateZ(${(-300 * (1 - inn) - 650 * xo + 18 * Math.sin(tt * 0.35)) * cam}px) rotateY(${(7 * (1 - inn) + 1.8 * Math.sin(tt * 0.22 + 0.5) - 6 * xo) * cam}deg) rotateX(${(1.2 * Math.sin(tt * 0.18) + 6 * xo) * cam}deg)` }}>
        {h.solo ? null : h.ph ? <AbsoluteFill style={{ transformOrigin: "96% 50%", transform: "scale(.74)", filter: "drop-shadow(0 18px 30px rgba(0,0,0,.6))" }}>{children(tt)}</AbsoluteFill> : children(tt)}
      </AbsoluteFill>
    </AbsoluteFill>
    {/* polvo en primer plano, desenfocado, por delante de la cámara: da profundidad real */}
    <AbsoluteFill style={{ pointerEvents: "none" }}>{Array.from({ length: 14 }, (_, i) => {
      const s = 6 + (i * 37) % 22, x = ((i * 271 + tt * (8 + i % 5) * 4) % 2100) - 90, y = 80 + (i * 163) % 920 + 30 * Math.sin(tt * 0.4 + i);
      return <div key={i} style={{ position: "absolute", left: x, top: y, width: s, height: s, borderRadius: "50%", background: "rgba(255,230,190,.5)", filter: `blur(${s / 3}px)`, opacity: 0.25 + 0.2 * Math.sin(tt * 0.7 + i * 1.3) }} />;
    })}</AbsoluteFill>
  </AbsoluteFill>;
};


// foto héroe (29-oct, evaluador e2: «foto chica al costado + ícono plano = plantilla»): la foto REAL del momento llena el cuadro,
// cámara curva lenta, foco que se abre y luz que barre justo en la palabra dicha; a la derecha se oscurece para que el gráfico apoye.
export const PhotoHero: React.FC<{ tt: number; id: string; dur: number; said: number; solo?: boolean; ac?: Ac & { rot?: number } }> = ({ tt, id, dur, said, solo, ac }) => {
  const k = cl(tt / Math.max(3, dur)), e = k * k * (3 - 2 * k);
  // 30-oct (evaluador walt29d v1: «el medio = la salida», «el cartel tapa el sujeto»): con acento, la cámara empuja TODO el plano hacia el sujeto
  // (1,03 → 1,24, sin parar hasta la salida) y el objeto dibujado vive pegado a la foto.
  if (ac) {
    const f = cl(phys(tt, Math.max(0.1, said - 0.3), 5, 0.8)), z = 1.02 + 0.05 * e + 0.03 * eio(tt, dur * 0.55, dur + 0.4), dx = -2.2 * eio(tt, dur * 0.45, dur + 0.4); // v5: al final la cámara se desliza de costado (no corta el cambio) // 2º tiempo: la cámara se mete en el sujeto hasta la salida
    return <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transformOrigin: `${ac.x}% ${ac.y}%`, transform: `scale(${z}) translate(calc(${dx}% + ${4 * Math.sin(tt * 0.3)}px), ${5 * Math.sin(tt * 0.22 + 0.7)}px) rotate(${0.4 * Math.sin(tt * 0.17)}deg)` }}>
        <TwoState tt={tt} id={id} ac={ac as any} said={said} f={f} />
        <AbsoluteFill style={{ background: `radial-gradient(ellipse ${60 - 22 * eio(tt, dur * 0.5, dur)}% ${60 - 22 * eio(tt, dur * 0.5, dur)}% at ${ac.x}% ${ac.y}%, transparent 40%, rgba(0,0,0,${0.12 * f + 0.1 * eio(tt, dur * 0.5, dur)}))` }} />
        <AbsoluteFill style={ac.rot ? { transformOrigin: `${ac.x}% ${ac.y}%`, transform: `rotate(${ac.rot}deg)` } : undefined}>
          {ac.m !== "none" && <Accent tt={tt} a0={(ac as any).a0 ?? Math.min(1.1, Math.max(0.45, said - 0.1))} dur={dur} ac={ac} ph={img((ac as any).ph2 ?? id)} />}
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>;
  }
  const f = cl(phys(tt, Math.min(0.9, Math.max(0.1, said - 0.1)), 5, 0.8));          // foco: de 9 px a nítido en la palabra
  const sw = cl((tt - said + 0.1) / 1.1);                              // barrido de luz en la palabra
  return <AbsoluteFill>
    <Img src={img(id)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: solo ? "50% 50%" : "38% 50%", filter: `blur(${9 * (1 - f)}px) brightness(${0.62 + 0.3 * f}) saturate(${0.85 + 0.2 * f})`,
      transform: `scale(${1.05 + 0.07 * e}) translate(${-18 * e + 6 * Math.sin(tt * 0.3)}px, ${10 * Math.sin(tt * 0.22 + 0.7) - 8 * e}px) rotate(${0.6 * Math.sin(tt * 0.17)}deg)` }} />
    {sw > 0 && sw < 1 && <AbsoluteFill style={{ background: `linear-gradient(110deg, transparent ${sw * 140 - 40}%, rgba(255,236,200,.28) ${sw * 140 - 22}%, transparent ${sw * 140 - 4}%)`, mixBlendMode: "screen" }} />}
    {!solo && <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(5,4,3,.05) 0%, rgba(5,4,3,.12) 36%, rgba(5,4,3,.72) 62%, rgba(5,4,3,.86) 100%)" }} />}
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 110% 90% at 40% 50%, transparent 55%, rgba(0,0,0,.5))" }} />
  </AbsoluteFill>;
};


// palabra héroe (29-oct, vuelta 3 del evaluador: «simple y perfecto»): UNA palabra o cifra grande que cae letra por letra con peso
// justo cuando se dice, apoyada en el tercio inferior de la foto, con su sombra de contacto; el renglón chico entra después.
export const HeroWord: React.FC<{ tt: number; kw: string; kw2?: string; said: number; v?: number }> = ({ tt, kw, kw2, said, v = 0 }) => {
  const a0 = Math.max(0.15, said - 0.05);
  const sz = kw.length > 12 ? 100 : kw.length > 8 ? 118 : 140;
  const s2 = phys(tt, a0 + 0.3, 6, 0.6);
  const glow = cl(phys(tt, a0, 4, 0.9));
  return <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill style={{ background: v === 3 ? "linear-gradient(200deg, rgba(4,3,2,.55) 0%, transparent 34%)" : v === 1 ? "linear-gradient(240deg, transparent 50%, rgba(4,3,2,.35) 66%), linear-gradient(0deg, rgba(4,3,2,.6) 0%, transparent 34%)" : v === 0 ? "linear-gradient(120deg, transparent 50%, rgba(4,3,2,.35) 66%), linear-gradient(0deg, rgba(4,3,2,.6) 0%, transparent 34%)" : "linear-gradient(0deg, rgba(4,3,2,.7) 0%, rgba(4,3,2,.4) 24%, transparent 44%)" }} />
    <div style={{ position: "absolute", ...(v === 1 || v === 3 ? { right: 120 } : v === 2 ? { left: 0, right: 0, justifyContent: "center" } : { left: 120 }), ...(v === 3 ? { top: 90 } : { bottom: 90 + (kw2 ? 76 : 0) }), display: "flex", perspective: 900 }}>
      <div style={{ position: "absolute", left: -60, right: -60, top: "20%", bottom: "-10%", background: `radial-gradient(ellipse at 30% 60%, rgba(255,200,130,${0.22 * glow}), transparent 70%)`, filter: "blur(30px)" }} />
      {(() => { const s = phys(tt, a0, 7.5, 0.55);
        return <span style={{ display: "inline-block", whiteSpace: "pre", fontWeight: 900, fontSize: sz, lineHeight: 1, letterSpacing: -1, color: "#fff7ea",
          opacity: cl(s * 2.2), filter: `blur(${(1 - cl(s)) * 12}px)`, transform: `translateY(${(1 - s) * (v === 3 ? -40 : 40)}px) scale(${1 + (1 - s) * 0.18})`, transformOrigin: v === 1 || v === 3 ? "100% 50%" : v === 2 ? "50% 50%" : "0 50%", textShadow: "0 10px 0 rgba(0,0,0,.25), 0 22px 44px rgba(0,0,0,.65)" }}>{kw}</span>; })()}
    </div>
    {kw2 ? <div style={{ position: "absolute", ...(v === 1 || v === 3 ? { right: 126, textAlign: "right" } : v === 2 ? { left: 0, right: 0, textAlign: "center" } : { left: 126 }), ...(v === 3 ? { top: 90 + Math.round(sz * 1.02) } : { bottom: 90 }), fontWeight: 800, fontSize: 64, color: "#ffd796", letterSpacing: 1,
      opacity: cl(s2 * 2), transform: `translateX(${(1 - s2) * (v === 1 ? 50 : v === 2 ? 0 : -50)}px)`, textShadow: "0 2px 4px rgba(0,0,0,.95), 0 0 14px rgba(0,0,0,.85), 0 6px 28px rgba(0,0,0,.8)" } as React.CSSProperties}>{kw2}</div> : null}
  </AbsoluteFill>;
};

// encabezado del sistema (filete + kicker + título que se descubre); arriba a la izquierda
export const Head: React.FC<{ tt: number; kick: string; title: string; col?: string; d?: number }> = ({ tt, kick, title, col = AMB, d = 0.3 }) => {
  if (true) return null; // 29-oct: sin rótulos arriba a la izquierda (regla del creador)
  const s = cl(phys(tt, d, 6, 0.7));
  return <div style={{ position: "absolute", left: 110, top: 80, opacity: s, transform: `translateX(${(1 - s) * -40}px)` }}>
    <div style={{ display: "flex", alignItems: "center", gap: 14, fontWeight: 800, fontSize: 24, letterSpacing: 5, color: DIM }}><div style={{ width: 34 * s, height: 3, borderRadius: 2, background: col }} />{kick}</div>
    <div style={{ fontWeight: 900, fontSize: 60, marginTop: 6, whiteSpace: "nowrap", opacity: cl(s * 1.4), transform: `translateY(${(1 - s) * 26}px)`, filter: `blur(${(1 - cl(s * 1.3)) * 8}px)` }}>{title}</div>
  </div>;
};

// rótulo que cae con peso
export const Tag: React.FC<{ tt: number; at: number; x: number; y: number; txt: string; col?: string; size?: number; anchor?: "c" | "l" }> = ({ tt, at, x, y, txt, col = TX, size = 34, anchor = "c" }) => {
  const s = phys(tt, at, 7, 0.45);
  if (s <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(${anchor === "c" ? "-50%" : "0"}, -50%) translateY(${(1 - s) * -40}px) scale(${0.8 + 0.2 * s})`, opacity: cl(s * 2), fontWeight: 900, fontSize: size * 1.35, letterSpacing: 2, color: col, whiteSpace: "nowrap", textShadow: "0 6px 24px rgba(0,0,0,.6)" }}>{txt}</div>;
};

// foto con marco (tarjeta) reutilizable
export const Photo: React.FC<{ id?: string; w: number; h: number; r?: number; z?: number; style?: React.CSSProperties; dim?: number }> = ({ id, w, h, r = 18, z = 1.08, style, dim = 0 }) => (
  <div style={{ width: w, height: h, borderRadius: r, overflow: "hidden", background: "#1a1a1d", boxShadow: "0 40px 90px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.1)", position: "relative", ...style }}>
    {id && <Img src={img(id)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z})` }} />}
    {dim > 0 && <div style={{ position: "absolute", inset: 0, background: "#000", opacity: dim }} />}
  </div>
);

// FOTO-OBJETO (29-oct, evaluador: «falta foto real adentro»): la foto del momento como copia física en 3D (canto, brillo que barre,
// sombra de contacto que se aprieta al apoyarse). Llega volando desde la profundidad con resorte y se endereza.
export const PhotoObj: React.FC<{ tt: number; id?: string; x: number; y: number; w: number; h: number; at?: number; rot?: number; tilt?: number; children?: React.ReactNode }> = ({ tt, id, x, y, w, h, at = 0.15, rot = -3, tilt = 10, children }) => {
  const s = phys(tt, at, 5.2, 0.5);
  if (!id || s <= 0.002) return null;
  const gl = ((tt - at) * 0.35) % 2.4;
  return <div style={{ position: "absolute", left: x, top: y, width: w, height: h, perspective: 1600 }}>
    <div style={{ position: "absolute", left: "6%", right: "6%", bottom: -34, height: 40, borderRadius: "50%", background: "rgba(0,0,0,.55)", filter: `blur(${22 - 10 * cl(s)}px)`, opacity: cl(s) }} />
    <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `translateY(${(1 - s) * 140}px) translateZ(${(1 - s) * -500}px) rotateX(${(1 - s) * 24 + 2 * Math.sin(tt * 0.4)}deg) rotateY(${tilt * (1 - s) + 2.5 * Math.sin(tt * 0.3 + 1)}deg) rotate(${rot * (2 - s)}deg)`, opacity: cl(s * 2) }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 10, overflow: "hidden", background: "#f3eee4", padding: 12, boxShadow: "0 30px 70px rgba(0,0,0,.55), 0 6px 0 #cfc6b4" }}>
        <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 4, overflow: "hidden" }}>
          <Img src={img(id)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.06 + 0.03 * Math.sin(tt * 0.25)})` }} />
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(115deg, transparent ${gl * 50 - 20}%, rgba(255,255,255,.22) ${gl * 50 - 8}%, transparent ${gl * 50}%)` }} />
          {children}
        </div>
      </div>
    </div>
  </div>;
};


// DOS ESTADOS (30-oct): la escena CAMBIA en la palabra dicha. ac.ph2 = la foto del después; ac.t2 = el mecanismo; ac.d2 = demora desde la palabra.
const blob = (x: number, y: number, r: number) => `radial-gradient(circle at ${x}% ${y}%, #000 ${r}px, transparent ${r + 120}px)`;
export const TwoState: React.FC<{ tt: number; id: string; said: number; f: number; ac: { x: number; y: number; ph2?: string; t2?: string; d2?: number } }> = ({ tt, id, said, f, ac }) => {
  const flt = `brightness(${0.78 + 0.18 * f}) saturate(${0.95 + 0.1 * f})`;
  const A = (st?: React.CSSProperties) => <Img src={img(id)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: flt, ...st }} />;
  if (!ac.ph2) return A();
  const t2 = Math.max(0.7, said + (ac.d2 ?? 0.45)), q = cl(phys(tt, t2, 3.6, 0.9)), m = ac.t2 ?? "iris";
  const B = (st?: React.CSSProperties) => <Img src={img(ac.ph2!)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: flt, ...st }} />;
  if (q <= 0.002) return A();
  if (m === "flip") { // el objeto se da vuelta sobre su eje, con peso
    const ang = 180 * q;
    return <AbsoluteFill style={{ perspective: 2600 }}><AbsoluteFill style={{ transformStyle: "preserve-3d", transform: `rotateY(${ang}deg) scale(${1 - 0.12 * Math.sin(Math.PI * q)})` }}>
      <AbsoluteFill style={{ backfaceVisibility: "hidden" }}>{A()}</AbsoluteFill>
      <AbsoluteFill style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>{B()}</AbsoluteFill>
    </AbsoluteFill><AbsoluteFill style={{ background: `rgba(0,0,0,${0.45 * Math.sin(Math.PI * q)})` }} /></AbsoluteFill>;
  }
  if (m === "slide") { // el después entra empujando al antes, con canto y sombra
    return <AbsoluteFill style={{ overflow: "hidden" }}>{A({ transform: `translateX(${-28 * q}%) scale(${1 - 0.06 * q})`, filter: `${flt} brightness(${1 - 0.5 * q})` })}
      <AbsoluteFill style={{ transform: `translateX(${100 * (1 - q)}%)`, boxShadow: "-40px 0 60px rgba(0,0,0,.7)" }}>{B()}</AbsoluteFill></AbsoluteFill>;
  }
  if (m === "split") { // A y B frente a frente: el después se abre desde la costura del medio y se queda en la mitad derecha
    const w = 50 * q;
    return <AbsoluteFill>{A({ transform: `translateX(${-25 * q}%)` })}
      <AbsoluteFill style={{ clipPath: `inset(0 0 0 ${100 - w}%)` }}>{B({ transform: `translateX(${25 * (1 - q) + 25 * q}%)` })}</AbsoluteFill>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${100 - w}%`, width: 10, marginLeft: -5, background: "linear-gradient(90deg, rgba(0,0,0,.6), #f4e9d6, rgba(0,0,0,.6))", boxShadow: "0 0 30px rgba(0,0,0,.8)", opacity: cl(q * 4) }} /></AbsoluteFill>;
  }
  let mk: string;
  if (m === "tide") mk = `linear-gradient(0deg, #000 ${q * 130 - 6}%, transparent ${q * 130}%)`;
  else if (m === "fall") mk = `linear-gradient(180deg, #000 ${q * 130 - 6}%, transparent ${q * 130}%)`;
  else if (m === "melt") { // se deshace en manchas que crecen desde el sujeto, de a una
    const R = (i: number) => Math.max(0, cl(phys(tt, t2 + i * 0.42, 1.9, 0.9)) * (560 + 300 * (i % 3)));
    const pts = [[0, 0], [-14, 8], [12, -10], [-6, -16], [18, 12], [-20, -6], [4, 20]];
    mk = pts.map(([dx, dy], i) => blob(ac.x + dx, ac.y + dy, R(i))).join(", ");
  } else mk = `radial-gradient(circle at ${ac.x}% ${ac.y}%, #000 ${q * 2200}px, transparent ${q * 2200 + 30}px)`;
  const gz = 1 + 0.075 * Math.min(1, Math.max(0, (tt - t2) / 7)); // v6: el después sigue acercándose al sujeto
  return <AbsoluteFill>{A()}<AbsoluteFill style={{ WebkitMaskImage: mk, maskImage: mk } as React.CSSProperties}>{B({ transform: `scale(${gz})`, transformOrigin: `${ac.x}% ${ac.y}%` })}</AbsoluteFill></AbsoluteFill>;
};
