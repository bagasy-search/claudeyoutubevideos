// clyde4 · componentes PROPIOS del video de los collards (Cg*). PURO CSS (pedido del creador 16-oct): cero imágenes.
// Mundo visual: olla de enlozado blanco, pot likker dorado-verde, hojas de collard verde azulado, hierro negro, papel kraft,
// pino del ahumadero, pizarra de tiza, vinagre de ají rojo. Capas: textura dibujada con gradientes + luz/sombra + objeto + datos + acento.
// 2 familias: Alfa Slab One (cartel de almacén) + Caveat (mano). Sin blur grande, sin backdrop-filter, sin feTurbulence.
import React from "react";
import { AbsoluteFill } from "remotion";
import { loadFont as loadSlab } from "@remotion/google-fonts/AlfaSlabOne";
import { loadFont as loadHand } from "@remotion/google-fonts/Caveat";
import { sp, useT, type P } from "../lkit/core";

const SLAB = loadSlab("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;
const HAND = loadHand("normal", { weights: ["600", "700"], subsets: ["latin"] }).fontFamily;
const K = { leaf: "#2F5A3A", leafD: "#1C3A26", leafL: "#5E8F5A", vein: "#B9CFA0", likker: "#9C7A2A", likkerL: "#C9A24A", enamel: "#F2EEE4", rim: "#1F2A33",
  iron: "#1B1A18", kraft: "#C29A64", kraftD: "#8E6A3E", pine: "#A8723F", pineD: "#6E4626", cream: "#F4ECDA", ink: "#2A2119", red: "#B3311F", redL: "#E0563C",
  chalk: "#EDEBE3", board: "#26302B", hock: "#6B3A1F", meat: "#D98C82", bone: "#EFE6D2", marrow: "#C2574A", gold: "#E3B448", blue: "#3E5C76" };
const cl = (x: number) => Math.max(0, Math.min(1, x));
const ez = (x: number) => { const t = cl(x); return t * t * (3 - 2 * t); };
const v = (f: number, at: number, dur = 14) => ez((f - at) / dur);

// ═══ TEXTURAS DIBUJADAS ═══
const pineBg = `repeating-linear-gradient(90deg, rgba(0,0,0,0.22) 0 3px, transparent 3px 168px),
  repeating-linear-gradient(90deg, rgba(255,230,190,0.05) 0 30px, rgba(80,40,10,0.06) 30px 61px, transparent 61px 97px),
  repeating-linear-gradient(2deg, rgba(90,50,20,0.10) 0 2px, transparent 2px 13px),
  radial-gradient(ellipse 40px 18px at 22% 31%, rgba(70,35,12,0.55), transparent 70%),
  radial-gradient(ellipse 34px 16px at 71% 64%, rgba(70,35,12,0.5), transparent 70%),
  radial-gradient(ellipse 30px 14px at 46% 82%, rgba(70,35,12,0.45), transparent 70%),
  linear-gradient(180deg, #B07A45, #8F5C30)`;
const kraftBg = `repeating-linear-gradient(17deg, rgba(255,255,255,0.05) 0 2px, transparent 2px 7px),
  repeating-linear-gradient(-63deg, rgba(90,60,25,0.07) 0 1px, transparent 1px 5px),
  radial-gradient(circle at 30% 20%, rgba(255,240,210,0.25), transparent 55%),
  radial-gradient(circle at 80% 85%, rgba(90,60,25,0.25), transparent 50%), ${K.kraft}`;
const paperBg = `repeating-linear-gradient(0deg, rgba(120,100,70,0.05) 0 1px, transparent 1px 4px),
  radial-gradient(circle at 25% 30%, #FFFDF6, transparent 60%), radial-gradient(circle at 80% 80%, rgba(200,180,140,0.35), transparent 55%), #F6EEDB`;
const chalkBg = `radial-gradient(ellipse at 30% 25%, rgba(255,255,255,0.10), transparent 55%),
  radial-gradient(ellipse at 75% 70%, rgba(255,255,255,0.07), transparent 50%),
  repeating-linear-gradient(8deg, rgba(255,255,255,0.025) 0 2px, transparent 2px 9px),
  repeating-linear-gradient(-30deg, rgba(255,255,255,0.02) 0 40px, transparent 40px 120px), ${K.board}`;
const leafBg = `repeating-linear-gradient(35deg, rgba(185,207,160,0.10) 0 3px, transparent 3px 46px),
  repeating-linear-gradient(-35deg, rgba(185,207,160,0.08) 0 2px, transparent 2px 46px),
  radial-gradient(ellipse at 50% 40%, ${K.leafL}, ${K.leaf} 55%, ${K.leafD})`;
const steelBg = `conic-gradient(from 200deg at 50% 50%, #8C9297, #C9CED2, #7D8388, #B9BEC2, #8C9297),
  repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 3px)`;
const ginghamBg = `repeating-linear-gradient(0deg, rgba(179,49,31,0.55) 0 38px, transparent 38px 76px),
  repeating-linear-gradient(90deg, rgba(179,49,31,0.55) 0 38px, transparent 38px 76px), #F3E9D8`;
const SH = "0 2px 3px rgba(0,0,0,0.35), 0 14px 28px rgba(0,0,0,0.35), 0 40px 80px rgba(0,0,0,0.30)";

const Bg: React.FC<{ bg: string; children?: React.ReactNode }> = ({ bg, children }) => <AbsoluteFill style={{ background: bg, overflow: "hidden" }}>{children}</AbsoluteFill>;
// luz de ventana desde arriba a la izquierda (sin viñeta)
const Light: React.FC = () => <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 60% at 25% 10%, rgba(255,245,220,0.18), transparent 70%)", pointerEvents: "none" }} />;
// mostrador de madera abajo
const Counter: React.FC<{ h?: number }> = ({ h = 230 }) => (
  <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: h, background: `repeating-linear-gradient(0deg, rgba(60,30,10,0.12) 0 2px, transparent 2px 11px), linear-gradient(180deg, #9A6434, #6F4322)`,
    boxShadow: "0 -6px 0 #C08A52, 0 -10px 30px rgba(0,0,0,0.35)" }} />
);
const Slab: React.FC<{ s: number; c?: string; st?: React.CSSProperties; children: React.ReactNode }> = ({ s, c = K.cream, st, children }) => (
  <div style={{ fontFamily: SLAB, fontSize: s, color: c, lineHeight: 1.0, letterSpacing: 1, ...st }}>{children}</div>
);
const Hand: React.FC<{ s: number; c?: string; st?: React.CSSProperties; children: React.ReactNode }> = ({ s, c = K.ink, st, children }) => (
  <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: s, color: c, lineHeight: 1.05, ...st }}>{children}</div>
);
// texto que se escribe (barrido izquierda→derecha)
const Write: React.FC<{ f: number; at: number; dur?: number; children: React.ReactNode; st?: React.CSSProperties }> = ({ f, at, dur = 18, children, st }) => {
  const p = v(f, at, dur);
  return <div style={{ clipPath: `inset(-30% ${100 - p * 102}% -30% -3%)`, opacity: p > 0 ? 1 : 0, ...st }}>{children}</div>;
};
const Pop: React.FC<{ f: number; at: number; children: React.ReactNode; st?: React.CSSProperties; dy?: number; dx?: number; sc?: number }> = ({ f, at, children, st, dy = 30, dx = 0, sc = 0 }) => {
  const s = sp(f, at, 14, 150);
  return <div style={{ opacity: cl(s * 1.5), transform: `translate(${(1 - s) * dx}px, ${(1 - s) * dy}px) scale(${1 - sc * (1 - s)})`, ...st }}>{children}</div>;
};
// tiza: texto con halo polvoriento
const chalkTxt = "0 0 2px rgba(255,255,255,0.6), 0 0 8px rgba(255,255,255,0.18), 1px 1px 0 rgba(255,255,255,0.15)";
// sello rojo de goma
const Stamp: React.FC<{ f: number; at: number; txt: string; s?: number; rot?: number; st?: React.CSSProperties; c?: string }> = ({ f, at, txt, s = 70, rot = -8, st, c = K.red }) => {
  const k = sp(f, at, 11, 220);
  return (
    <div style={{ position: "absolute", opacity: cl(k * 2), transform: `rotate(${rot}deg) scale(${1.7 - 0.7 * k})`, fontFamily: SLAB, fontSize: s, color: c, border: `${Math.round(s / 11)}px solid ${c}`, borderRadius: 12,
      padding: `${s * 0.08}px ${s * 0.3}px`, letterSpacing: 3, whiteSpace: "nowrap", mixBlendMode: "multiply",
      background: `repeating-linear-gradient(80deg, transparent 0 7px, rgba(255,255,255,0.18) 7px 9px)`, ...st }}>{txt}</div>
  );
};
// vapor: manchas radiales que suben (sin filter)
const Steam: React.FC<{ f: number; x: number; y: number; w?: number; n?: number; op?: number }> = ({ f, x, y, w = 260, n = 7, op = 0.5 }) => (
  <>
    {Array.from({ length: n }).map((_, i) => {
      const per = 70 + (i % 3) * 14, ph = ((f + i * 23) % per) / per;
      const sz = 60 + ph * 120 + (i % 2) * 30;
      return <div key={i} style={{ position: "absolute", left: x + ((i * 53) % w) - sz / 2 + 24 * Math.sin((f + i * 30) / 18), top: y - ph * 300 - sz / 2, width: sz, height: sz * 0.8, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,255,255,0.55), rgba(255,255,255,0) 68%)", opacity: op * Math.sin(Math.PI * ph) }} />;
    })}
  </>
);
// burbujas de hervor dentro de un rectángulo de líquido
const Bubbles: React.FC<{ f: number; w: number; h: number; n: number; speed: number; big: number; c?: string }> = ({ f, w, h, n, speed, big, c = "rgba(255,255,255,0.55)" }) => (
  <>
    {Array.from({ length: n }).map((_, i) => {
      const per = Math.round(60 / speed) + (i % 5) * 6, ph = ((f * 1 + i * 37) % per) / per, sz = big * (0.4 + ((i * 7) % 10) / 14);
      return <div key={i} style={{ position: "absolute", left: ((i * 97) % (w - sz)), top: h - ph * h - sz, width: sz, height: sz, borderRadius: "50%", border: `2px solid ${c}`,
        background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.45), transparent 60%)", opacity: Math.sin(Math.PI * ph) }} />;
    })}
  </>
);

// ═══ OLLA DE ENLOZADO EN CORTE (objeto principal reutilizable dentro de este video) ═══
const Pot: React.FC<{ f: number; x: number; y: number; w: number; h: number; level: number; liq: string; greens?: number; gcol?: string; boil?: number; steam?: boolean; bubbleBig?: number }> =
  ({ f, x, y, w, h, level, liq, greens = 0, gcol = K.leaf, boil = 0.4, steam = true, bubbleBig = 22 }) => {
    const lh = (h - 40) * level;
    return (
      <div style={{ position: "absolute", left: x, top: y, width: w, height: h }}>
        {steam ? <Steam f={f} x={w * 0.18} y={0} w={w * 0.64} op={0.45} /> : null}
        {/* asas */}
        <div style={{ position: "absolute", left: -46, top: 60, width: 70, height: 34, borderRadius: 18, border: `12px solid ${K.rim}`, borderRight: "none" }} />
        <div style={{ position: "absolute", right: -46, top: 60, width: 70, height: 34, borderRadius: 18, border: `12px solid ${K.rim}`, borderLeft: "none" }} />
        {/* cuerpo enlozado */}
        <div style={{ position: "absolute", inset: 0, borderRadius: "14px 14px 60px 60px", background: `linear-gradient(90deg, #CFC9BC, ${K.enamel} 22%, #FFFFFF 40%, ${K.enamel} 70%, #BDB7AA)`,
          boxShadow: `${SH}, inset 0 -18px 30px rgba(0,0,0,0.12)`, overflow: "hidden" }}>
          {/* ventana de corte */}
          <div style={{ position: "absolute", left: 26, right: 26, top: 26, bottom: 22, borderRadius: "8px 8px 48px 48px", background: "linear-gradient(180deg, #6B665E, #47433D 60%, #34312C)", boxShadow: "inset 0 8px 20px rgba(0,0,0,0.6)", overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: lh, background: liq, transition: "none" }}>
              <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 10, background: "linear-gradient(180deg, rgba(255,255,255,0.35), transparent)" }} />
              {Array.from({ length: Math.round(greens * 9) }).map((_, i) => (
                <div key={i} style={{ position: "absolute", left: `${(i * 37) % 86}%`, bottom: `${8 + ((i * 23) % 60)}%`, width: 150 + (i % 3) * 30, height: 22, borderRadius: 14,
                  background: `linear-gradient(90deg, ${gcol}, ${K.leafD})`, transform: `rotate(${((i * 41) % 50) - 25 + 6 * Math.sin((f + i * 20) / 22)}deg)`, boxShadow: "0 3px 6px rgba(0,0,0,0.35)" }} />
              ))}
              <Bubbles f={f} w={w - 52} h={lh} n={Math.round(4 + boil * 18)} speed={0.6 + boil * 2.4} big={bubbleBig * (0.6 + boil)} />
              <div style={{ position: "absolute", inset: 0, background: `linear-gradient(100deg, transparent ${30 + (f % 120) / 2}%, rgba(255,240,200,0.18) ${36 + (f % 120) / 2}%, transparent ${44 + (f % 120) / 2}%)` }} />
            </div>
          </div>
        </div>
        {/* borde azul oscuro del enlozado */}
        <div style={{ position: "absolute", left: -6, right: -6, top: -8, height: 22, borderRadius: 12, background: `linear-gradient(180deg, #3A4A57, ${K.rim})`, boxShadow: "0 6px 10px rgba(0,0,0,0.4)" }} />
      </div>
    );
  };
// corte de un hock ahumado (anillos: piel caoba, carne rosada, hueso, médula)
const HockX: React.FC<{ size: number; glow?: number; st?: React.CSSProperties }> = ({ size, glow = 0, st }) => (
  <div style={{ position: "absolute", width: size, height: size, borderRadius: "50%", ...st,
    background: `radial-gradient(circle, ${K.marrow} 0 13%, ${K.bone} 13.5% 22%, #F2DCD0 22.5% 24%, ${K.meat} 24.5% 52%, #C7766C 53% 60%, #8A4A2A 61% 66%, ${K.hock} 67% 100%)`,
    boxShadow: `${SH}, inset 0 0 ${30 + 40 * glow}px rgba(255,170,90,${0.25 + 0.5 * glow}), 0 0 ${60 * glow}px rgba(230,120,60,${0.6 * glow})` }}>
    <div style={{ position: "absolute", inset: "8%", borderRadius: "50%", background: "repeating-conic-gradient(rgba(255,255,255,0.06) 0 4deg, transparent 4deg 11deg)" }} />
  </div>
);
const Check: React.FC<{ f: number; at: number; bad?: boolean; s?: number }> = ({ f, at, bad, s = 64 }) => {
  const k = sp(f, at, 10, 220);
  return <div style={{ width: s, height: s, borderRadius: 12, background: bad ? K.red : K.leaf, color: "#fff", fontFamily: SLAB, fontSize: s * 0.7, display: "flex", alignItems: "center", justifyContent: "center",
    transform: `scale(${k})`, boxShadow: "0 6px 12px rgba(0,0,0,0.35)" }}>{bad ? "✕" : "✓"}</div>;
};

// ═══ 1 · Pot likker (HOOK) ═══
export const CgLikker: P<{ t: number; t2: number }> = ({ a, t, t2 }) => {
  const { f, at } = useT(a);
  const lv = 0.15 + 0.5 * v(f, at(t) - 6, 40);
  return (
    <Bg bg={pineBg}><Light /><Counter h={250} />
      <Pot f={f} x={250} y={300} w={640} h={560} level={lv} liq={`linear-gradient(180deg, ${K.likkerL}, ${K.likker} 50%, #5E4A1A)`} greens={0.9} boil={0.25} />
      {/* etiqueta colgante con hilo */}
      <div style={{ position: "absolute", left: 980, top: 150, transformOrigin: "50% 0", transform: `rotate(${-6 + 5 * Math.sin(f / 26) * (1 - v(f, at(t), 40) * 0.6)}deg)` }}>
        <div style={{ position: "absolute", left: 210, top: -150, width: 3, height: 170, background: "#E9E2D0" }} />
        <Pop f={f} at={at(t)} dy={-60}>
          <div style={{ width: 760, padding: "56px 50px 46px", background: kraftBg, borderRadius: 18, clipPath: "polygon(10% 0, 90% 0, 100% 16%, 100% 100%, 0 100%, 0 16%)", boxShadow: SH }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", margin: "-20px auto 18px", background: "#3B2A18", boxShadow: "inset 0 3px 6px rgba(0,0,0,0.6)" }} />
            <Hand s={52} c={K.kraftD} st={{ textAlign: "center" }}>this juice right here is called</Hand>
            <Write f={f} at={at(t) + 6} dur={16}><Slab s={124} c={K.ink} st={{ textAlign: "center", marginTop: 8 }}>POT LIKKER</Slab></Write>
          </div>
        </Pop>
      </div>
      <Pop f={f} at={at(t2)} dy={40} st={{ position: "absolute", left: 960, top: 690 }}>
        <div style={{ background: K.leaf, padding: "22px 40px", borderRadius: 10, boxShadow: SH, transform: "rotate(-2deg)", borderLeft: `14px solid ${K.gold}` }}>
          <Slab s={58}>WORTH MORE THAN THE GREENS</Slab>
        </div>
      </Pop>
    </Bg>
  );
};

// ═══ 2 · Etiqueta de precio $2 (HOOK) ═══
export const CgTag: P<{ price: string; name: string; sub: string; t: number }> = ({ a, price, name, sub, t }) => {
  const { f, at } = useT(a);
  const sw = sp(f, 0, 7, 60);
  return (
    <Bg bg={paperBg}>
      <AbsoluteFill style={{ background: `repeating-linear-gradient(90deg, rgba(150,120,80,0.10) 0 2px, transparent 2px 120px)` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 120, background: pineBg, boxShadow: "0 10px 30px rgba(0,0,0,0.4)" }} />
      <div style={{ position: "absolute", left: 960 - 430, top: 70, width: 860, transformOrigin: "50% -40px", transform: `perspective(1400px) rotateZ(${(1 - sw) * 14}deg) rotateY(${(1 - sw) * -24}deg)` }}>
        <div style={{ position: "absolute", left: 428, top: -60, width: 4, height: 100, background: "#D8CFB8" }} />
        <div style={{ height: 880, background: kraftBg, borderRadius: 26, clipPath: "polygon(16% 0, 84% 0, 100% 12%, 100% 100%, 0 100%, 0 12%)", boxShadow: SH, position: "relative" }}>
          <div style={{ position: "absolute", left: 400, top: 40, width: 60, height: 60, borderRadius: "50%", background: "#2D1F12", boxShadow: "inset 0 4px 8px rgba(0,0,0,0.6), 0 0 0 10px #D9C29A" }} />
          <div style={{ position: "absolute", left: 70, right: 70, top: 150, borderTop: `4px dashed ${K.kraftD}` }} />
          <Slab s={60} c={K.ink} st={{ position: "absolute", top: 190, width: "100%", textAlign: "center" }}>{name}</Slab>
          <div style={{ position: "absolute", top: 300, width: "100%", display: "flex", justifyContent: "center" }}>
            <Stamp f={f} at={at(t)} txt={price} s={300} rot={-6} st={{ position: "relative", padding: "0 60px" }} />
          </div>
          <Write f={f} at={at(t) + 14} dur={18} st={{ position: "absolute", top: 720, width: "100%" }}><Hand s={72} c={K.kraftD} st={{ textAlign: "center" }}>{sub}</Hand></Write>
        </div>
      </div>
    </Bg>
  );
};

// ═══ 3 · Pizarra: siete piezas (PROMISE) ═══
export const CgBoard: P<{ head: string; items: { txt: string; n: number; t: number; hot?: boolean }[] }> = ({ a, head, items }) => {
  const { f, at } = useT(a);
  const fr_ = sp(f, 0, 14, 90);
  return (
    <Bg bg={pineBg}><Light />
      <div style={{ position: "absolute", left: 210, top: 80, width: 1500, height: 900, transform: `perspective(1600px) rotateX(${(1 - fr_) * 16}deg) translateY(${(1 - fr_) * 80}px)`, opacity: cl(fr_ * 1.4) }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 14, background: `repeating-linear-gradient(90deg, rgba(0,0,0,0.15) 0 2px, transparent 2px 40px), linear-gradient(180deg, #7A4B26, #5A3418)`, boxShadow: SH }} />
        <div style={{ position: "absolute", inset: 34, borderRadius: 6, background: chalkBg, boxShadow: "inset 0 6px 24px rgba(0,0,0,0.6)", padding: "50px 80px" }}>
          <Write f={f} at={6} dur={18}><Slab s={92} c={K.chalk} st={{ textShadow: chalkTxt, letterSpacing: 6 }}>{head}</Slab></Write>
          <div style={{ height: 6, width: 560, background: K.chalk, opacity: 0.6, margin: "14px 0 40px", clipPath: `inset(0 ${100 - v(f, 18, 14) * 100}% 0 0)`, borderRadius: 3 }} />
          {items.map((it, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 34, marginBottom: 30 }}>
              <Pop f={f} at={at(it.t)} sc={0.4} dy={0}>
                <div style={{ width: 96, height: 96, borderRadius: "50%", border: `5px solid ${it.hot ? K.redL : K.chalk}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 10px rgba(255,255,255,0.15)" }}>
                  <Slab s={58} c={it.hot ? K.redL : K.chalk} st={{ textShadow: chalkTxt }}>{it.n}</Slab>
                </div>
              </Pop>
              <Write f={f} at={at(it.t) + 3} dur={16}><Hand s={84} c={it.hot ? "#FFD7C9" : K.chalk} st={{ textShadow: chalkTxt }}>{it.txt}</Hand></Write>
              {it.hot ? <div style={{ width: 300, height: 10, marginLeft: -20, background: K.redL, borderRadius: 6, transform: "rotate(-2deg)", clipPath: `inset(0 ${100 - v(f, at(it.t) + 18, 12) * 100}% 0 0)` }} /> : null}
            </div>
          ))}
        </div>
      </div>
    </Bg>
  );
};

// ═══ 4 · 55 años: cartel de pino quemado a fuego (INTRO) ═══
export const CgYears: P<{ num: number; txt: string; sub: string; t: number }> = ({ a, num, txt, sub, t }) => {
  const { f, at } = useT(a);
  const hot = cl(1 - (f - at(t)) / 40), k = sp(f, at(t), 12, 140);
  const n = Math.round(num * ez((f - at(t)) / 22));
  return (
    <Bg bg={`linear-gradient(180deg, #2A1D14, #120C08)`}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 60% 50% at 50% 45%, rgba(255,190,120,0.16), transparent 70%)" }} />
      <div style={{ position: "absolute", left: 260, top: 230, width: 1400, height: 600, borderRadius: 20, background: pineBg, boxShadow: `${SH}, inset 0 0 0 14px rgba(70,40,15,0.6)`,
        transform: `perspective(1500px) rotateY(${(1 - k) * -18}deg) rotateX(4deg)`, display: "flex", alignItems: "center", padding: "0 90px", gap: 60 }}>
        {[60, 1340].map((x) => <div key={x} style={{ position: "absolute", left: x, top: 40, width: 26, height: 26, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #CFC6B2, #5A5246)", boxShadow: "0 3px 5px rgba(0,0,0,0.5)" }} />)}
        <div style={{ fontFamily: SLAB, fontSize: 380, lineHeight: 1, color: hot > 0.02 ? `rgb(255,${Math.round(120 + 90 * hot)},${Math.round(40 + 60 * hot)})` : "#2B1608",
          textShadow: `0 0 ${30 * hot}px rgba(255,140,40,${hot}), 0 3px 0 rgba(255,220,170,0.25), 0 -2px 0 rgba(0,0,0,0.6)` }}>{n}</div>
        <div>
          <Slab s={92} c="#2B1608" st={{ textShadow: "0 2px 0 rgba(255,220,170,0.3)" }}>{txt.toUpperCase()}</Slab>
          <Write f={f} at={at(t) + 18} dur={14}><Hand s={70} c="#3A220F" st={{ marginTop: 14 }}>{sub.toLowerCase()} · this smokehouse</Hand></Write>
        </div>
      </div>
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        {Array.from({ length: 10 }).map((_, i) => {
          const y = 900 - ((f * (1.2 + (i % 4) * 0.4) + i * 140) % 900);
          return <div key={i} style={{ position: "absolute", left: 300 + ((i * 181) % 1300), top: y, width: 6, height: 6, borderRadius: 3, background: "#FFB15A", opacity: 0.6 * hot + 0.15, boxShadow: "0 0 10px #FF8A2A" }} />;
        })}
      </AbsoluteFill>
    </Bg>
  );
};

// ═══ 5 · Tarjeta de receta 1958 (STORY) ═══
export const CgCard1958: P<{ title: string; date: string; lines: string[]; t: number }> = ({ a, title, date, lines, t }) => {
  const { f, at } = useT(a);
  const k = sp(f, 0, 13, 100);
  return (
    <Bg bg={ginghamBg}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(255,250,235,0.35), transparent 70%)" }} />
      <div style={{ position: "absolute", left: 360, top: 120, width: 1200, height: 800, transform: `perspective(1600px) rotateX(${12 - 8 * k}deg) rotateZ(${-3 + 2 * k}deg) translateY(${(1 - k) * 200}px)` }}>
        <div style={{ position: "absolute", inset: 0, background: `repeating-linear-gradient(180deg, transparent 0 79px, rgba(70,110,170,0.45) 79px 82px), linear-gradient(180deg, transparent 0 150px, rgba(200,60,50,0.6) 150px 154px, transparent 154px), radial-gradient(circle at 80% 75%, transparent 60px, rgba(140,90,40,0.25) 62px 74px, transparent 76px), linear-gradient(180deg, #F7EED6, #EADBB6)`,
          borderRadius: 10, boxShadow: SH, padding: "40px 70px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <Write f={f} at={at(t)} dur={18}><Hand s={86} c="#2B3550">{title}</Hand></Write>
            <Pop f={f} at={at(t) + 10}><Stamp f={f} at={at(t) + 10} txt={date.toUpperCase()} s={44} rot={6} st={{ position: "relative" }} c="#8E2A1E" /></Pop>
          </div>
          <div style={{ marginTop: 60 }}>
            {lines.map((l, i) => (
              <Write key={i} f={f} at={at(t) + 22 + i * 16} dur={16} st={{ height: 82, display: "flex", alignItems: "flex-end" }}>
                <Hand s={66} c={i === 2 ? "#9A2A1A" : "#2B3550"}>{i === 2 ? <span style={{ borderBottom: "5px solid #9A2A1A" }}>{l}</span> : l}</Hand>
              </Write>
            ))}
          </div>
        </div>
        {/* cinta adhesiva */}
        <div style={{ position: "absolute", left: 520, top: -26, width: 180, height: 56, background: "rgba(240,225,180,0.75)", transform: "rotate(-4deg)", boxShadow: "0 2px 4px rgba(0,0,0,0.15)" }} />
      </div>
    </Bg>
  );
};

// ═══ 6 · Pieza numerada: cartel de enlozado sobre hoja (ONE…SEVEN) ═══
export const CgPiece: P<{ n: number; name: string; sub: string; t: number; hot?: boolean }> = ({ a, n, name, sub, t, hot }) => {
  const { f, at } = useT(a);
  const k = sp(f, at(t) - 4, 13, 120);
  const ac = hot ? K.red : K.leaf;
  return (
    <Bg bg={leafBg}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 18% 70% at 50% 50%, rgba(220,235,200,0.25), transparent 70%)` }} />
      <div style={{ position: "absolute", left: 958, top: -40, width: 8, height: 1200, background: `linear-gradient(90deg, #A9C28C, ${K.vein}, #8DAA72)`, opacity: 0.5 }} />
      <div style={{ position: "absolute", left: 260, top: 200, width: 1400, height: 680, transform: `perspective(1800px) rotateY(${(1 - k) * 70}deg) translateZ(${(1 - k) * -300}px)`, transformOrigin: "0 50%", opacity: cl(k * 2) }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 34, background: `linear-gradient(160deg, #FFFFFF, ${K.enamel} 40%, #E2DCCD)`, boxShadow: `${SH}, inset 0 0 0 18px ${ac}, inset 0 0 0 26px ${K.enamel}, inset 0 0 0 30px ${ac}` }} />
        {[[40, 40], [1340, 40], [40, 620], [1340, 620]].map(([x, y], i) => <div key={i} style={{ position: "absolute", left: x, top: y, width: 22, height: 22, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #EEE, #555)" }} />)}
        <div style={{ position: "absolute", left: 120, top: 120, width: 420, height: 440, borderRadius: 26, background: ac, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "inset 0 -10px 20px rgba(0,0,0,0.25)" }}>
          <Slab s={360} c={K.enamel} st={{ textShadow: "0 8px 0 rgba(0,0,0,0.25)" }}>{n}</Slab>
        </div>
        <div style={{ position: "absolute", left: 610, top: 170, right: 90 }}>
          <Hand s={64} c={ac}>piece number {n}</Hand>
          <Slab s={name.length > 14 ? 92 : 118} c={K.ink} st={{ marginTop: 10 }}>{name}</Slab>
          <Write f={f} at={at(t) + 12} dur={18}><Hand s={64} c="#5A5145" st={{ marginTop: 26 }}>{sub}</Hand></Write>
        </div>
        <div style={{ position: "absolute", inset: 0, borderRadius: 34, background: `linear-gradient(110deg, transparent ${-30 + v(f, at(t) + 6, 30) * 160}%, rgba(255,255,255,0.55) ${-22 + v(f, at(t) + 6, 30) * 160}%, transparent ${-14 + v(f, at(t) + 6, 30) * 160}%)`, mixBlendMode: "screen" }} />
      </div>
    </Bg>
  );
};

// ═══ 7 · Tres piletas: la arena se queda abajo (TWO) ═══
export const CgSinks: P<{ t: number; t2: number }> = ({ a, t, t2 }) => {
  const { f, at } = useT(a);
  const step = (at(t2) - at(t)) / 2.4;
  return (
    <Bg bg={`repeating-linear-gradient(0deg, rgba(0,0,0,0.05) 0 2px, transparent 2px 64px), repeating-linear-gradient(90deg, rgba(0,0,0,0.05) 0 2px, transparent 2px 64px), #E9EEE9`}>
      <Light />
      <Slab s={70} c={K.ink} st={{ position: "absolute", top: 80, width: "100%", textAlign: "center" }}>LIFT THE GREENS OUT · THE SAND STAYS</Slab>
      {[0, 1, 2].map((i) => {
        const s0 = Math.round(at(t) - 10 + i * step), k = sp(f, s0, 13, 130), grit = [1, 0.45, 0][i];
        const lift = v(f, s0 + 14, 18);
        return (
          <div key={i} style={{ position: "absolute", left: 150 + i * 560, top: 280, width: 500, height: 560, opacity: cl(k * 1.5), transform: `translateY(${(1 - k) * 80}px)` }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: "18px 18px 70px 70px", background: `linear-gradient(90deg, #D6D3CC, #FFFFFF 30%, #F2F0EA 70%, #CBC7BE)`, boxShadow: SH }} />
            <div style={{ position: "absolute", left: 28, right: 28, top: 28, bottom: 28, borderRadius: "10px 10px 56px 56px", overflow: "hidden", background: "linear-gradient(180deg, #CFE0E3, #A9C4CB)", boxShadow: "inset 0 10px 24px rgba(0,0,0,0.25)" }}>
              <div style={{ position: "absolute", left: 0, right: 0, top: 70, height: 6, background: "rgba(255,255,255,0.7)" }} />
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} style={{ position: "absolute", left: 30 + j * 90, top: 48 - lift * 140 + 4 * Math.sin((f + j * 20) / 14), width: 130, height: 46, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
                  background: `linear-gradient(180deg, ${K.leafL}, ${K.leaf})`, transform: `rotate(${(j % 2 ? 12 : -10)}deg)`, boxShadow: "0 4px 6px rgba(0,0,0,0.25)" }} />
              ))}
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 70 * grit + 4, background: `radial-gradient(circle, #6E5A3E 0 2px, transparent 3px) 0 0/14px 12px, radial-gradient(circle, #8C7350 0 2px, transparent 3px) 7px 6px/14px 12px, linear-gradient(180deg, transparent, rgba(110,90,60,0.5))`, opacity: grit > 0 ? 1 : 0 }} />
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 590, display: "flex", justifyContent: "center", gap: 20, alignItems: "center" }}>
              <Slab s={90} c={K.ink}>{i + 1}</Slab>
              {i === 2 ? <Pop f={f} at={s0 + 24}><div style={{ background: K.leaf, padding: "10px 24px", borderRadius: 10 }}><Slab s={46}>CLEAN AS A GLASS</Slab></div></Pop> : <Hand s={58} c="#6E5A3E">{i === 0 ? "the grit" : "less grit"}</Hand>}
            </div>
          </div>
        );
      })}
    </Bg>
  );
};

// ═══ 8 · El tallo: la hoja se dobla y el tallo se va (THREE) ═══
export const CgStem: P<{ n: number; t: number; t2: number }> = ({ a, t, t2 }) => {
  const { f, at } = useT(a);
  const fold = v(f, at(t), 22), zip = v(f, at(t2) - 4, 18);
  const half = (side: number): React.CSSProperties => ({ position: "absolute", top: 0, width: 520, height: 820, [side < 0 ? "right" : "left"]: 0,
    borderRadius: side < 0 ? "100% 0 0 100% / 60% 0 0 40%" : "0 100% 100% 0 / 0 60% 40% 0",
    background: `repeating-linear-gradient(${side < 0 ? 35 : -35}deg, rgba(185,207,160,0.35) 0 3px, transparent 3px 70px), radial-gradient(ellipse at ${side < 0 ? "70%" : "30%"} 50%, ${K.leafL}, ${K.leaf} 70%)`,
    boxShadow: "inset 0 0 40px rgba(0,0,0,0.25)" });
  return (
    <Bg bg={`repeating-linear-gradient(0deg, rgba(60,30,10,0.10) 0 2px, transparent 2px 15px), linear-gradient(180deg, #C9A06A, #A97C48)`}>
      <Light />
      <div style={{ position: "absolute", left: 960 - 520, top: 130, width: 1040, height: 820, transform: "perspective(2000px) rotateX(18deg)" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 520, height: 820 }}><div style={half(-1)} /></div>
        <div style={{ position: "absolute", left: 520, top: 0, width: 520, height: 820, transformOrigin: "0 50%", transform: `rotateY(${-170 * fold}deg)`, filter: undefined }}>
          <div style={{ ...half(1), background: fold > 0.5 ? `linear-gradient(90deg, #4E7A4C, #3D6440)` : (half(1).background as string) }} />
        </div>
        {/* tallo */}
        <div style={{ position: "absolute", left: 505, top: -40, width: 30, height: 900, borderRadius: 16, background: "linear-gradient(90deg, #DCE6C8, #F4F7E8, #C9D6B0)", boxShadow: "0 6px 10px rgba(0,0,0,0.3)",
          transform: `translate(${zip * 460}px, ${zip * 120}px) rotate(${zip * 18}deg)`, opacity: 1 - v(f, at(t2) + 30, 14) }} />
      </div>
      <div style={{ position: "absolute", left: 120, top: 140 }}>
        <Pop f={f} at={at(t) - 6}><Slab s={78} c={K.ink}>FOLD IT IN HALF</Slab></Pop>
        <Pop f={f} at={at(t2)}><Slab s={78} c={K.red} st={{ marginTop: 24 }}>PULL · IT ZIPS OFF</Slab></Pop>
      </div>
      <Pop f={f} at={at(t2) + 22} st={{ position: "absolute", right: 120, bottom: 120 }}>
        <div style={{ background: kraftBg, padding: "20px 34px", borderRadius: 12, boxShadow: SH, transform: "rotate(3deg)" }}>
          <Hand s={64}>stem cooks 3× longer than the leaf</Hand>
        </div>
      </Pop>
    </Bg>
  );
};

// ═══ 9 · Inspección del hock (FOUR_2) ═══
export const CgHockCheck: P<{ items: { txt: string; t: number; bad?: boolean }[] }> = ({ a, items }) => {
  const { f, at } = useT(a);
  const k = sp(f, 0, 14, 110);
  return (
    <Bg bg={steelBg}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(0,0,0,0.18))" }} />
      <div style={{ position: "absolute", left: 140, top: 210, width: 640, height: 640, transform: `scale(${0.7 + 0.3 * k}) rotate(${(1 - k) * -40}deg)` }}>
        <HockX size={640} glow={0.15} />
        <Pop f={f} at={at(items[0].t) + 4} st={{ position: "absolute", left: 420, top: -40 }}>
          <div style={{ background: K.cream, padding: "8px 20px", borderRadius: 8, boxShadow: SH, transform: "rotate(6deg)" }}><Hand s={48} c={K.red}>pink meat ↓</Hand></div>
        </Pop>
      </div>
      <div style={{ position: "absolute", left: 880, top: 170, width: 900, padding: "50px 56px", background: kraftBg, borderRadius: 16, boxShadow: SH, transform: "rotate(1.5deg)" }}>
        <Slab s={66} c={K.ink}>A GOOD SMOKED HOCK</Slab>
        <div style={{ height: 4, background: K.kraftD, margin: "18px 0 30px" }} />
        {items.map((it, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 28, marginBottom: 34 }}>
            <Check f={f} at={at(it.t) + 8} bad={it.bad} s={74} />
            <Write f={f} at={at(it.t)} dur={14}><Hand s={70} c={it.bad ? K.red : K.ink}>{it.txt}</Hand></Write>
          </div>
        ))}
      </div>
    </Bg>
  );
};

// ═══ 10 · Aserrar el hock: la médula (FOUR_3) ═══
export const CgMarrow: P<{ t: number; t2: number; t3: number }> = ({ a, t, t2, t3 }) => {
  const { f, at } = useT(a);
  const saw = v(f, at(t) - 14, 16), glow = v(f, at(t) + 2, 20) * (0.7 + 0.3 * Math.sin(f / 9));
  return (
    <Bg bg={`linear-gradient(180deg, #2B2522, #171310)`}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 45% 55% at 30% 50%, rgba(255,200,150,0.14), transparent 70%)" }} />
      <div style={{ position: "absolute", left: 160, top: 190, width: 700, height: 700 }}>
        <HockX size={700} glow={glow} />
        <div style={{ position: "absolute", left: -60, top: 340, width: 820 * saw, height: 8, background: "repeating-linear-gradient(90deg, #E8E8E8 0 14px, #9A9A9A 14px 20px)", boxShadow: "0 0 12px rgba(255,255,255,0.6)", opacity: 1 - v(f, at(t) + 10, 10) }} />
        <Pop f={f} at={at(t) + 6} st={{ position: "absolute", left: 250, top: 300 }}><Hand s={60} c="#FFE4C8" st={{ textShadow: "0 3px 8px #000" }}>marrow</Hand></Pop>
      </div>
      <div style={{ position: "absolute", left: 960, top: 260, width: 820 }}>
        <Pop f={f} at={at(t2)} dx={60} dy={0}>
          <div style={{ display: "flex", gap: 26, alignItems: "center", background: "rgba(255,255,255,0.06)", padding: "30px 36px", borderRadius: 16, border: "2px solid rgba(255,255,255,0.12)" }}>
            <div style={{ width: 110, height: 110, borderRadius: "50%", background: `radial-gradient(circle, ${K.hock} 60%, #3B1E0E)` }} />
            <div><Hand s={58} c="#D8CFC0">a whole hock</Hand><Slab s={74} c={K.cream}>= SMOKE</Slab></div>
          </div>
        </Pop>
        <Pop f={f} at={at(t3)} dx={60} dy={0} st={{ marginTop: 40 }}>
          <div style={{ display: "flex", gap: 26, alignItems: "center", background: "rgba(227,180,72,0.14)", padding: "30px 36px", borderRadius: 16, border: `3px solid ${K.gold}` }}>
            <HockX size={110} glow={0.6} st={{ position: "relative" }} />
            <div><Hand s={58} c="#F2D9A0">a sawed hock</Hand><Slab s={74} c={K.gold}>= SMOKE + RICHNESS</Slab></div>
          </div>
        </Pop>
        <Pop f={f} at={at(t3) + 20} st={{ marginTop: 36 }}><Hand s={64} c="#D8CFC0">same two dollars</Hand></Pop>
      </div>
    </Bg>
  );
};

// ═══ 11 · Ticket de balanza: receta del pot likker (FIVE) ═══
export const CgRecipe: P<{ head: string; items: { txt: string; t: number }[] }> = ({ a, head, items }) => {
  const { f, at } = useT(a);
  const shown = items.filter((it) => f >= at(it.t)).length;
  const len = 230 + shown * 112 + (shown ? v(f, at(items[shown - 1].t), 10) * 0 : 0);
  return (
    <Bg bg={pineBg}><Light />
      {/* balanza / impresora de acero */}
      <div style={{ position: "absolute", left: 560, top: 60, width: 800, height: 170, borderRadius: 24, background: steelBg, boxShadow: SH }}>
        <div style={{ position: "absolute", left: 40, top: 34, width: 260, height: 90, borderRadius: 10, background: "#0E1A12", boxShadow: "inset 0 4px 10px #000" }}>
          <div style={{ fontFamily: SLAB, fontSize: 52, color: "#7CFF9A", textAlign: "center", lineHeight: "90px", textShadow: "0 0 10px rgba(124,255,154,0.7)" }}>{shown}/{items.length}</div>
        </div>
        <div style={{ position: "absolute", left: 340, right: 40, top: 128, height: 16, borderRadius: 8, background: "#222", boxShadow: "inset 0 3px 6px #000" }} />
      </div>
      <div style={{ position: "absolute", left: 640, top: 210, width: 640, height: Math.min(820, len), overflow: "hidden", background: paperBg, boxShadow: SH,
        clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 14px), 95% 100%, 90% calc(100% - 14px), 85% 100%, 80% calc(100% - 14px), 75% 100%, 70% calc(100% - 14px), 65% 100%, 60% calc(100% - 14px), 55% 100%, 50% calc(100% - 14px), 45% 100%, 40% calc(100% - 14px), 35% 100%, 30% calc(100% - 14px), 25% 100%, 20% calc(100% - 14px), 15% 100%, 10% calc(100% - 14px), 5% 100%, 0 calc(100% - 14px))" }}>
        <div style={{ padding: "40px 46px" }}>
          <Slab s={46} c={K.ink} st={{ textAlign: "center" }}>CLYDE'S SMOKEHOUSE</Slab>
          <div style={{ fontFamily: SLAB, fontSize: 40, color: K.red, textAlign: "center", margin: "12px 0 22px" }}>{head}</div>
          <div style={{ borderTop: "4px dashed #9A8F7A", marginBottom: 20 }} />
          {items.map((it, i) => f >= at(it.t) ? (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, height: 112, borderBottom: "2px dotted #C9BFA8" }}>
              <div style={{ width: 54, height: 54, borderRadius: 8, background: K.leaf, color: "#fff", fontFamily: SLAB, fontSize: 34, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
              <Write f={f} at={at(it.t)} dur={10}><Hand s={60} c={K.ink}>{it.txt}</Hand></Write>
            </div>
          ) : null)}
        </div>
      </div>
      <Pop f={f} at={at(items[0].t) + 8} st={{ position: "absolute", left: 120, top: 640 }}>
        <div style={{ transform: "rotate(-5deg)", background: K.red, padding: "18px 30px", borderRadius: 10, boxShadow: SH }}><Slab s={52}>NOT PLAIN WATER</Slab></div>
      </Pop>
    </Bg>
  );
};

// ═══ 12 · Timer de cocina: una hora entera (FIVE_2) ═══
export const CgTimer: P<{ mins: number; txt: string; sub: string; t: number }> = ({ a, mins, txt, sub, t }) => {
  const { f, at } = useT(a);
  const k = sp(f, 0, 13, 110), run = v(f, at(t) + 4, 70);
  const deg = 360 * (1 - run);
  return (
    <Bg bg={`linear-gradient(180deg, #DCE7DF, #B8CCBF)`}>
      <AbsoluteFill style={{ background: `repeating-linear-gradient(0deg, rgba(255,255,255,0.35) 0 2px, transparent 2px 90px), repeating-linear-gradient(90deg, rgba(255,255,255,0.35) 0 2px, transparent 2px 90px)` }} />
      <div style={{ position: "absolute", left: 220, top: 170, width: 740, height: 740, transform: `scale(${0.6 + 0.4 * k})` }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #FFFFFF, #E9E3D6 60%, #BDB5A4)`, boxShadow: `${SH}, inset 0 -20px 40px rgba(0,0,0,0.15)` }} />
        <div style={{ position: "absolute", inset: 60, borderRadius: "50%", background: `conic-gradient(${K.red} 0deg ${deg}deg, #F7F3EA ${deg}deg 360deg)`, boxShadow: "inset 0 6px 16px rgba(0,0,0,0.25)" }} />
        <div style={{ position: "absolute", inset: 60, borderRadius: "50%", background: "repeating-conic-gradient(rgba(30,30,30,0.85) 0 0.8deg, transparent 0.8deg 6deg)", WebkitMaskImage: "radial-gradient(circle, transparent 0 78%, #000 79%)", maskImage: "radial-gradient(circle, transparent 0 78%, #000 79%)" }} />
        <div style={{ position: "absolute", left: 370 - 12, top: 110, width: 24, height: 270, borderRadius: 12, background: K.iron, transformOrigin: "50% 260px", transform: `rotate(${deg}deg)`, boxShadow: "0 4px 8px rgba(0,0,0,0.4)" }} />
        <div style={{ position: "absolute", left: 320, top: 320, width: 100, height: 100, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #555, #111)" }} />
        <Slab s={64} c={K.ink} st={{ position: "absolute", top: 160, width: "100%", textAlign: "center" }}>{Math.round(mins * (1 - run))}</Slab>
      </div>
      <div style={{ position: "absolute", left: 1040, top: 330, width: 760 }}>
        <Pop f={f} at={at(t)}><Slab s={110} c={K.leafD}>{txt}</Slab></Pop>
        <Write f={f} at={at(t) + 12} dur={16}><Hand s={72} c="#3C4A40" st={{ marginTop: 20 }}>{sub}</Hand></Write>
        <Pop f={f} at={at(t) + 26} st={{ marginTop: 40 }}><div style={{ display: "inline-block", background: K.likker, padding: "14px 28px", borderRadius: 10, boxShadow: SH }}><Slab s={46}>THEN THE GREENS</Slab></div></Pop>
      </div>
    </Bg>
  );
};

// ═══ 13 · Agua sola vs pot likker (FIVE_3) ═══
export const CgVersus: P<{ t: number; t2: number; t3: number }> = ({ a, t, t2, t3 }) => {
  const { f, at } = useT(a);
  const L = sp(f, at(t) - 6, 14, 120), R = sp(f, at(t2) - 6, 14, 120);
  return (
    <Bg bg={`linear-gradient(90deg, #7D8086 0 50%, ${K.leafD} 50% 100%)`}>
      <AbsoluteFill style={{ background: `linear-gradient(90deg, transparent 49.6%, ${K.cream} 49.6% 50.4%, transparent 50.4%)` }} />
      <div style={{ opacity: cl(L * 1.5), transform: `translateY(${(1 - L) * 60}px)` }}>
        <Slab s={66} c="#E7E7E7" st={{ position: "absolute", left: 0, width: 960, top: 70, textAlign: "center" }}>PLAIN WATER · 1 HOUR</Slab>
        <Pot f={f} x={190} y={240} w={580} h={500} level={0.62} liq="linear-gradient(180deg, #B9BDB4, #8F938A)" greens={0.8} gcol="#7A8461" boil={0.9} steam={false} />
        <Slab s={60} c="#E7E7E7" st={{ position: "absolute", left: 0, width: 960, top: 830, textAlign: "center" }}>GRAY · BITTER</Slab>
      </div>
      <div style={{ opacity: cl(R * 1.5), transform: `translateY(${(1 - R) * 60}px)` }}>
        <Slab s={66} c={K.gold} st={{ position: "absolute", left: 960, width: 960, top: 70, textAlign: "center" }}>POT LIKKER · 1 HOUR</Slab>
        <Pot f={f} x={1150} y={240} w={580} h={500} level={0.62} liq={`linear-gradient(180deg, ${K.likkerL}, ${K.likker} 50%, #5E4A1A)`} greens={0.9} boil={0.2} />
        <Slab s={60} c={K.cream} st={{ position: "absolute", left: 960, width: 960, top: 830, textAlign: "center" }}>DARK · SILKY</Slab>
      </div>
      <Pop f={f} at={at(t3)} sc={0.3} dy={0} st={{ position: "absolute", left: 960 - 520, top: 440, width: 1040 }}>
        <div style={{ background: K.cream, padding: "24px 30px", borderRadius: 14, boxShadow: SH, textAlign: "center", transform: "rotate(-2deg)" }}>
          <Slab s={66} c={K.ink}>SAME GREENS. DIFFERENT WORLD.</Slab>
        </div>
      </Pop>
    </Bg>
  );
};

// ═══ 14 · Hervor fuerte vs fuego suave (SIX_3) ═══
export const CgBoil: P<{ t: number; t2: number }> = ({ a, t, t2 }) => {
  const { f, at } = useT(a);
  const flame = (big: boolean) => (
    <div style={{ position: "absolute", left: 140, top: 560, width: 300, height: 70, display: "flex", justifyContent: "space-around", alignItems: "flex-end" }}>
      {Array.from({ length: 9 }).map((_, i) => <div key={i} style={{ width: 22, height: (big ? 64 : 22) + 10 * Math.sin((f + i * 13) / (big ? 3 : 6)), borderRadius: "50% 50% 40% 40%",
        background: "linear-gradient(0deg, #2F6BFF, #8FC0FF 60%, rgba(255,255,255,0.7))", opacity: 0.9 }} />)}
    </div>
  );
  return (
    <Bg bg={`linear-gradient(180deg, #F1EFE8, #D9D3C6)`}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 360, background: `linear-gradient(180deg, ${K.enamel}, #CFC8B8)`, boxShadow: "0 -4px 0 #B9B1A0" }} />
      {[0, 1].map((side) => {
        const at0 = at(side ? t2 : t) - 6, k = sp(f, at0, 14, 120);
        return (
          <div key={side} style={{ position: "absolute", left: 160 + side * 880, top: 120, width: 640, height: 760, opacity: cl(k * 1.5), transform: `translateY(${(1 - k) * 50}px)` }}>
            <Pot f={f} x={60} y={60} w={460} h={460} level={0.7} liq={side ? `linear-gradient(180deg, ${K.likkerL}, ${K.likker})` : "linear-gradient(180deg, #A5A895, #7C8070)"} greens={0.8} gcol={side ? K.leaf : "#7A8461"} boil={side ? 0.12 : 1.0} bubbleBig={side ? 14 : 34} />
            {flame(!side)}
            <div style={{ position: "absolute", left: 0, right: 0, top: 660, display: "flex", alignItems: "center", gap: 20, justifyContent: "center" }}>
              <Check f={f} at={at0 + 14} bad={!side} s={80} />
              <div><Slab s={52} c={side ? K.leafD : K.red}>{side ? "GENTLE SIMMER" : "ROLLING BOIL"}</Slab><Hand s={50} c="#4A4238">{side ? "dark green & silky" : "gray & bitter"}</Hand></div>
            </div>
          </div>
        );
      })}
    </Bg>
  );
};

// ═══ 15 · Una noche en el porche (SEVEN_2) ═══
export const CgNight: P<{ t: number; t2: number }> = ({ a, t, t2, d }) => {
  const { f, at } = useT(a);
  const dawn = v(f, at(t) + 40, Math.max(30, d * 0.45));
  return (
    <Bg bg={`linear-gradient(180deg, #0D1530, #24345E 60%, #3B4A6E)`}>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, #F5C98A, #F3A66B 50%, #C98A6A)`, opacity: dawn }} />
      {Array.from({ length: 40 }).map((_, i) => <div key={i} style={{ position: "absolute", left: (i * 211) % 1920, top: (i * 97) % 520, width: 3 + (i % 3), height: 3 + (i % 3), borderRadius: "50%", background: "#fff", opacity: (1 - dawn) * (0.4 + 0.5 * Math.abs(Math.sin((f + i * 11) / 20))) }} />)}
      <div style={{ position: "absolute", left: 1500 - dawn * 900, top: 120 + dawn * 500, width: 150, height: 150, borderRadius: "50%", background: "radial-gradient(circle at 40% 40%, #FFFBEA, #E8E1C4)", boxShadow: "0 0 60px rgba(255,250,220,0.6)", opacity: 1 - dawn }} />
      <div style={{ position: "absolute", left: 240, top: 820 - dawn * 260, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, #FFE08A, #F6A93B)", boxShadow: "0 0 90px rgba(255,190,80,0.8)", opacity: dawn }} />
      {/* porche: tablas y la olla */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 300, background: `repeating-linear-gradient(90deg, rgba(0,0,0,0.25) 0 4px, transparent 4px 150px), linear-gradient(180deg, #6D4A2C, #3F2916)` }} />
      <div style={{ position: "absolute", left: 1300, top: 640, width: 320, height: 240, borderRadius: "14px 14px 60px 60px", background: `linear-gradient(90deg, #111, #2E2E2E 40%, #151515)`, boxShadow: SH }}>
        <div style={{ position: "absolute", left: -10, right: -10, top: -18, height: 26, borderRadius: 14, background: "#222" }} />
        <Steam f={f} x={60} y={-10} w={200} n={4} op={0.25 * dawn} />
      </div>
      <div style={{ position: "absolute", left: 160, top: 160 }}>
        <Pop f={f} at={at(t) - 4}><Slab s={84} c={K.cream}>{dawn < 0.5 ? "DAY 1 · NIGHT" : "DAY 2"}</Slab></Pop>
        <Pop f={f} at={at(t) + 10}><Hand s={68} c="#F1E6CF" st={{ marginTop: 16 }}>greens resting in their likker</Hand></Pop>
        <Pop f={f} at={at(t2)} st={{ marginTop: 40 }}>
          <div style={{ width: 620, background: "rgba(0,0,0,0.35)", borderRadius: 14, padding: "20px 26px" }}>
            <Slab s={44} c={K.cream}>BITTERNESS</Slab>
            <div style={{ marginTop: 14, height: 34, borderRadius: 17, background: "rgba(255,255,255,0.2)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${100 - 92 * v(f, at(t2), 30)}%`, background: `linear-gradient(90deg, ${K.red}, ${K.redL})`, borderRadius: 17 }} />
            </div>
          </div>
        </Pop>
      </div>
    </Bg>
  );
};

// ═══ 16 · Frasco de vinagre de ají (SEVEN_4) ═══
export const CgJar: P<{ t: number; t2: number; t3: number }> = ({ a, t, t2, t3 }) => {
  const { f, at } = useT(a);
  const fill = v(f, at(t2), 40);
  const peppers = Array.from({ length: 12 });
  return (
    <Bg bg={`linear-gradient(180deg, #F0E8D8, #D8CBB1)`}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 300, background: ginghamBg, boxShadow: "0 -8px 20px rgba(0,0,0,0.15)" }} />
      <div style={{ position: "absolute", left: 300, top: 120, width: 520, height: 800 }}>
        {/* tapa rosca */}
        <div style={{ position: "absolute", left: 50, top: 0, width: 420, height: 90, borderRadius: 14, background: `repeating-linear-gradient(0deg, rgba(0,0,0,0.25) 0 4px, transparent 4px 14px), linear-gradient(90deg, #8C8C86, #E6E6DE 40%, #9C9C94)`, boxShadow: SH, transform: `translateY(${-60 * (1 - v(f, at(t3), 16))}px)`, opacity: v(f, at(t3) - 2, 6) }} />
        <div style={{ position: "absolute", left: 0, top: 80, width: 520, height: 720, borderRadius: "60px 60px 80px 80px", background: "linear-gradient(90deg, rgba(255,255,255,0.35), rgba(255,255,255,0.08) 30%, rgba(255,255,255,0.05) 70%, rgba(255,255,255,0.3))",
          border: "6px solid rgba(255,255,255,0.65)", boxShadow: "0 30px 60px rgba(0,0,0,0.25), inset 0 0 30px rgba(255,255,255,0.4)", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${fill * 88}%`, background: "linear-gradient(180deg, rgba(240,210,130,0.55), rgba(220,180,90,0.65))" }} />
          {peppers.map((_, i) => {
            const drop = v(f, at(t) + i * 4, 12), row = Math.floor(i / 3), col = i % 3;
            return <div key={i} style={{ position: "absolute", left: 50 + col * 140 + (row % 2) * 40, top: -200 + drop * (560 - row * 130), width: 90, height: 190, borderRadius: "45px 45px 50px 50px / 40px 40px 140px 140px",
              background: i % 3 === 1 ? "linear-gradient(90deg, #3E7A2C, #6FB04F 40%, #2F5E21)" : "linear-gradient(90deg, #9E1F14, #E2452E 40%, #8A1A10)", transform: `rotate(${((i * 37) % 40) - 20}deg)`, boxShadow: "inset -8px 0 14px rgba(0,0,0,0.25)", opacity: drop > 0 ? 1 : 0 }}>
              <div style={{ position: "absolute", left: 34, top: -22, width: 18, height: 34, borderRadius: 8, background: "#4F6B2A" }} />
            </div>;
          })}
          <div style={{ position: "absolute", left: 60, top: 40, width: 50, height: 600, borderRadius: 25, background: "linear-gradient(90deg, rgba(255,255,255,0.6), transparent)" }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 960, top: 220, width: 820 }}>
        <Slab s={88} c={K.red}>PEPPER VINEGAR</Slab>
        {[["slit the small hot peppers", t], ["hot vinegar · just steaming", t2], ["one night · keeps for months", t3]].map(([s, tt], i) => (
          <Pop key={i} f={f} at={at(tt as number)} st={{ display: "flex", gap: 22, alignItems: "center", marginTop: 40 }}>
            <div style={{ width: 70, height: 70, borderRadius: "50%", background: K.red, color: "#fff", fontFamily: SLAB, fontSize: 40, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: SH }}>{i + 1}</div>
            <Hand s={68} c={K.ink}>{s as string}</Hand>
          </Pop>
        ))}
      </div>
    </Bg>
  );
};

// ═══ 17 · Mito que hay que dejar (MYTH / MYTH_2) ═══
export const CgMyth: P<{ n: number; txt: string; why: string; t: number; t2: number }> = ({ a, n, txt, why, t, t2 }) => {
  const { f, at } = useT(a);
  const k = sp(f, 0, 13, 120), strike = v(f, at(t2), 12);
  return (
    <Bg bg={chalkBg}>
      <div style={{ position: "absolute", left: 160, top: 120 }}>
        <Write f={f} at={4} dur={16}><Hand s={80} c={K.chalk} st={{ textShadow: chalkTxt }}>old trick #{n} to stop doing</Hand></Write>
      </div>
      <div style={{ position: "absolute", left: 300, top: 300, width: 1320, height: 440, background: kraftBg, borderRadius: 18, boxShadow: SH, transform: `perspective(1500px) rotateX(${(1 - k) * 30}deg) rotate(-1.5deg)`, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <div style={{ position: "relative" }}>
          <Slab s={txt.length > 12 ? 92 : 150} c={K.ink} st={{ whiteSpace: "nowrap" }}>{txt}</Slab>
          <div style={{ position: "absolute", left: -30, right: -30, top: "48%", height: 18, background: K.red, borderRadius: 9, transform: "rotate(-3deg)", clipPath: `inset(0 ${100 - strike * 100}% 0 0)` }} />
        </div>
        <Write f={f} at={at(t2) + 8} dur={14}><Hand s={72} c={K.red} st={{ marginTop: 26 }}>{why}</Hand></Write>
      </div>
      <Stamp f={f} at={at(t) + 6} txt="MYTH" s={110} rot={10} st={{ left: 1380, top: 210 }} c={K.redL} />
    </Bg>
  );
};

// ═══ 18 · Recibo que se imprime: la olla entera (MONEY) ═══
export const CgReceipt: P<{ items: { txt: string; p: string; t: number }[]; total: string; t2: number }> = ({ a, items, total, t2 }) => {
  const { f, at } = useT(a);
  const shown = items.filter((it) => f >= at(it.t) - 2).length + (f >= at(t2) - 2 ? 1 : 0);
  return (
    <Bg bg={`repeating-linear-gradient(0deg, rgba(60,30,10,0.10) 0 2px, transparent 2px 15px), linear-gradient(180deg, #A9773F, #7E522A)`}>
      <Light />
      <div style={{ position: "absolute", left: 220, top: 0, width: 640, height: 260 + shown * 120, maxHeight: 1000, background: paperBg, boxShadow: SH, overflow: "hidden", transform: "rotate(-2deg)" }}>
        <div style={{ padding: "50px 50px" }}>
          <Slab s={44} c={K.ink} st={{ textAlign: "center" }}>THE WHOLE POT</Slab>
          <div style={{ fontFamily: HAND, fontSize: 40, color: "#7A6F5C", textAlign: "center" }}>ten bowls · at home</div>
          <div style={{ borderTop: "4px dashed #9A8F7A", margin: "20px 0" }} />
          {items.map((it, i) => f >= at(it.t) - 2 ? (
            <div key={i} style={{ display: "flex", alignItems: "baseline", height: 120 }}>
              <Slab s={40} c={K.ink}>{it.txt}</Slab>
              <div style={{ flex: 1, borderBottom: "4px dotted #B5AA92", margin: "0 12px" }} />
              <Slab s={48} c={K.ink}>${it.p}</Slab>
            </div>
          ) : null)}
          {f >= at(t2) - 2 ? <div style={{ display: "flex", alignItems: "baseline", borderTop: `5px solid ${K.ink}`, paddingTop: 20 }}><Slab s={60} c={K.ink}>TOTAL</Slab><div style={{ flex: 1 }} /><Slab s={84} c={K.leaf}>${total}</Slab></div> : null}
        </div>
      </div>
      <div style={{ position: "absolute", left: 1060, top: 230, width: 700 }}>
        <Pop f={f} at={6}>
          <div style={{ background: K.cream, borderRadius: 16, padding: "30px 40px", boxShadow: SH, transform: "rotate(2deg)", position: "relative" }}>
            <Hand s={56} c="#6A6052">one little side cup, restaurant</Hand>
            <Slab s={150} c={K.ink}>$6.99</Slab>
            <div style={{ position: "absolute", left: 20, right: 20, top: 160, height: 16, background: K.red, borderRadius: 8, transform: "rotate(-8deg)", clipPath: `inset(0 ${100 - v(f, at(t2), 12) * 100}% 0 0)` }} />
          </div>
        </Pop>
        <Stamp f={f} at={at(t2) + 6} txt={`WHOLE POT $${total.replace(".00", "")}`} s={74} rot={-7} st={{ left: 40, top: 380 }} c={K.leaf} />
      </div>
    </Bg>
  );
};

// ═══ 19 · Diez platos: 60 centavos el plato (MONEY_2) ═══
export const CgPerBowl: P<{ t: number; t2: number }> = ({ a, t, t2 }) => {
  const { f, at } = useT(a);
  return (
    <Bg bg={`repeating-linear-gradient(90deg, rgba(0,0,0,0.12) 0 3px, transparent 3px 160px), linear-gradient(180deg, #8C5A2E, #5E3B1C)`}>
      <Light />
      <div style={{ position: "absolute", left: 110, top: 500, width: 1700, display: "flex", flexWrap: "wrap", gap: "40px 30px" }}>
        {Array.from({ length: 10 }).map((_, i) => {
          const k = sp(f, at(t) + i * 3, 12, 170);
          return <div key={i} style={{ width: 310, height: 150, position: "relative", transform: `scale(${k})`, opacity: cl(k * 2) }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 30, height: 120, borderRadius: "0 0 155px 155px / 0 0 120px 120px", background: `linear-gradient(90deg, #D9D2C2, #FFFFFF 40%, #CFC7B6)`, boxShadow: "0 16px 24px rgba(0,0,0,0.4)" }} />
            <div style={{ position: "absolute", left: 6, right: 6, top: 18, height: 34, borderRadius: "50%", background: `radial-gradient(ellipse, ${K.leafL}, ${K.leaf} 60%, ${K.likker})`, boxShadow: "inset 0 4px 8px rgba(0,0,0,0.4)" }} />
            <Steam f={f + i * 9} x={60} y={10} w={180} n={2} op={0.35} />
          </div>;
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 90, textAlign: "center" }}>
        <Pop f={f} at={at(t) + 4}><Hand s={70} c={K.cream}>six dollars ÷ ten good bowls</Hand></Pop>
        <Pop f={f} at={at(t2)} sc={0.4}><Slab s={210} c={K.gold} st={{ textShadow: "0 10px 0 rgba(0,0,0,0.3)" }}>60¢ A BOWL</Slab></Pop>
      </div>
    </Bg>
  );
};

// ═══ 20 · Preguntas que siempre me hacen (ASK) ═══
export const CgAsk: P<{ items: { q: string; a: string; t: number }[] }> = ({ a, items }) => {
  const { f, at } = useT(a);
  return (
    <Bg bg={pineBg}><Light />
      <Slab s={70} c={K.cream} st={{ position: "absolute", top: 70, width: "100%", textAlign: "center", textShadow: "0 4px 10px rgba(0,0,0,0.5)" }}>FOLKS ALWAYS ASK ME</Slab>
      {items.map((it, i) => {
        const k = sp(f, at(it.t) - 4, 13, 120);
        return <div key={i} style={{ position: "absolute", left: 120 + i * 580, top: 250, width: 520, height: 640, opacity: cl(k * 1.6), transform: `translateY(${(1 - k) * -120}px) rotate(${[-3, 1.5, -1][i]}deg)` }}>
          <div style={{ position: "absolute", inset: 0, background: `repeating-linear-gradient(180deg, transparent 0 63px, rgba(70,110,170,0.35) 63px 66px), linear-gradient(180deg, transparent 0 120px, rgba(200,60,50,0.5) 120px 123px, transparent 123px), #FBF6E8`, boxShadow: SH, borderRadius: 6, padding: "40px 40px" }}>
            <Slab s={60} c={K.ink}>{it.q}</Slab>
            <Write f={f} at={at(it.t) + 10} dur={18}><Hand s={60} c="#2B3550" st={{ marginTop: 70 }}>{it.a}</Hand></Write>
          </div>
          <div style={{ position: "absolute", left: 240, top: -18, width: 40, height: 40, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #FF8A70, #A3220F)", boxShadow: "0 6px 8px rgba(0,0,0,0.4)" }} />
        </div>;
      })}
    </Bg>
  );
};

// ═══ 21 · Repaso: cartel de menú enlozado (RECAP) ═══
export const CgRecap: P<{ items: string[]; ts: number[] }> = ({ a, items, ts }) => {
  const { f, at } = useT(a);
  return (
    <Bg bg={leafBg}>
      <div style={{ position: "absolute", left: 300, top: 70, width: 1320, height: 940, borderRadius: 26, background: `linear-gradient(160deg, #FFFFFF, ${K.enamel} 40%, #E0D9C9)`, boxShadow: `${SH}, inset 0 0 0 16px ${K.leaf}`, padding: "50px 80px" }}>
        <Slab s={74} c={K.leafD} st={{ textAlign: "center" }}>ONE MORE TIME</Slab>
        <div style={{ height: 6, background: K.leaf, margin: "20px 160px 30px", borderRadius: 3 }} />
        {items.map((it, i) => {
          const on = f >= at(ts[i]);
          return <div key={i} style={{ display: "flex", alignItems: "center", gap: 30, height: 130, opacity: on ? 1 : 0.22 }}>
            <div style={{ width: 84, height: 84, borderRadius: 14, border: `6px solid ${K.leaf}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {on ? <div style={{ fontFamily: SLAB, fontSize: 60, color: K.red, transform: `scale(${sp(f, at(ts[i]), 10, 220)})` }}>✓</div> : null}
            </div>
            <Hand s={76} c={K.ink}>{it}</Hand>
          </div>;
        })}
      </div>
    </Bg>
  );
};

// ═══ 22 · Comentario: ¿qué le ponés a tus greens? (COMMENT) ═══
export const CgComment: P<{ q: string; opts: string[]; t: number; t2: number }> = ({ a, q, opts, t, t2 }) => {
  const { f, at } = useT(a);
  const k = sp(f, at(t) - 6, 14, 120);
  const pct = [46, 38, 16];
  return (
    <Bg bg={kraftBg}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 60% 50% at 50% 45%, rgba(255,245,220,0.35), transparent 70%)" }} />
      <div style={{ position: "absolute", left: 360, top: 140, width: 1200, padding: "50px 60px", background: "#FFFFFF", borderRadius: 30, boxShadow: SH, transform: `translateY(${(1 - k) * 80}px)`, opacity: cl(k * 1.5) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
          <div style={{ width: 100, height: 100, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #A8723F, #5A3418)`, color: K.cream, fontFamily: SLAB, fontSize: 56, display: "flex", alignItems: "center", justifyContent: "center" }}>C</div>
          <div><Slab s={44} c={K.ink}>Clyde's Smokehouse</Slab><Hand s={42} c="#777">tell me in the comments</Hand></div>
        </div>
        <Slab s={76} c={K.ink} st={{ margin: "40px 0 30px" }}>{q}</Slab>
        {opts.map((o, i) => {
          const g = v(f, at(t) + 12 + i * 8, 24);
          return <div key={i} style={{ position: "relative", height: 100, marginBottom: 22, borderRadius: 50, background: "#EFEAE0", overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${pct[i] * g}%`, background: [K.red, "#D9622B", K.gold][i], borderRadius: 50 }} />
            <Slab s={46} c={K.ink} st={{ position: "absolute", left: 40, top: 26 }}>{o}</Slab>
          </div>;
        })}
        <Pop f={f} at={at(t2)}><Hand s={58} c={K.leaf} st={{ marginTop: 16 }}>…and what state are you cooking in?</Hand></Pop>
      </div>
    </Bg>
  );
};
