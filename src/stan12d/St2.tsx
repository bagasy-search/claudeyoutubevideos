// Piezas rediseñadas tras la vuelta 1 del evaluador: foto real adentro, objetos con peso, nada de panel de texto sobre fondo liso. PURO CSS/DOM.
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, Easing } from "remotion";
import { F, K, Tile, hash } from "./St";

const { SLAB, COND, MARK } = F;
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const eio = (t: number) => Easing.inOut(Easing.cubic)(cl(t));
const eout = (t: number) => Easing.out(Easing.cubic)(cl(t));
const sp = (f: number, d = 0, damping = 16, mass = 0.7) => spring({ frame: f - d, fps: 30, config: { damping, mass } });
const shadow = "0 2px 16px rgba(0,0,0,0.6), 0 1px 3px rgba(0,0,0,0.7)";
const kraft = `repeating-linear-gradient(92deg, rgba(90,60,25,0.07) 0 2px, transparent 2px 7px), linear-gradient(170deg, ${K.kraft} 0%, ${K.kraft2} 100%)`;
const paper = `repeating-linear-gradient(90deg, rgba(120,90,60,0.035) 0 1px, transparent 1px 5px), linear-gradient(175deg, ${K.paper} 0%, ${K.paper2} 100%)`;
const steel = "linear-gradient(180deg, #7E858A 0%, #EEF1F2 32%, #A9B0B4 62%, #5E6468 100%)";

// sello rojo que golpea (nota del ranking, SUBSCRIBE)
const Slam: React.FC<{ f: number; at: number; children: React.ReactNode; rot?: number; style?: React.CSSProperties }> = ({ f, at, children, rot = -9, style }) => {
  const h = sp(f, at, 8, 0.5);
  return <div style={{ transform: `scale(${lerp(3, 1, h)}) rotate(${lerp(rot - 20, rot, h)}deg)`, opacity: cl(h * 3), ...style }}>{children}</div>;
};

// ── riel de ganchos del local: cada método cuelga como una foto con su nota; el de ahora cae al gancho y se balancea
export type RCard = { title: string; src: string; rank: number; score: number };
export const RankRail: React.FC<{ cards: RCard[]; now: number; final?: boolean; dur: number }> = ({ cards, now, final, dur }) => {
  const f = useCurrentFrame(); const o = interpolate(f, [0, 6, dur - 8, dur], [0, 1, 1, 0], CL);
  const order = [...cards].sort((a, b) => b.rank - a.rank); // de izquierda (Nº 8) a derecha (Nº 1)
  const cam = lerp(1.0, 1.05, f / Math.max(1, dur)); const W = 214; const cxNow = 70 + order.findIndex((c) => c.rank === now) * 228 + W / 2;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Tile dur={dur} dark={0.34} />
      <AbsoluteFill style={final ? { transform: `scale(${cam})`, transformOrigin: "50% 40%" } : { transform: `translate(${960 - cxNow - 60}px, 150px) scale(${lerp(2.9, 2.7, f / Math.max(1, dur))})`, transformOrigin: `${cxNow}px 290px` }}>
        <div style={{ position: "absolute", left: -1400, right: -1400, top: 150, height: 26, background: steel, boxShadow: "0 14px 22px rgba(0,0,0,0.45)" }} />
        {[300, 960, 1620].map((x) => <div key={x} style={{ position: "absolute", left: x - 14, top: 96, width: 28, height: 66, background: steel, borderRadius: 6 }} />)}
        {order.map((c, i) => {
          const x = 70 + i * 228; const done = c.rank > now, cur = c.rank === now; const show = done || cur || final;
          const drop = cur && !final ? sp(f, 8, 7, 1.0) : 1; const sway = Math.sin((f + i * 19) / 23) * (cur ? 1.2 : 0.7);
          const lift = final && c.rank === 1 ? eio((f - 10) / 24) : 0; const big = cur && !final ? 1.12 : 1 + 0.5 * lift;
          return (
            <div key={c.rank} style={{ position: "absolute", left: x, top: 164, width: W, transformOrigin: "50% 0", zIndex: cur || lift ? 5 : 1, transform: `translateY(${(1 - cl(drop * 1.6)) * -700}px) rotate(${lerp(cur ? -26 : 0, sway, cl(drop))}deg) scale(${big})` }}>
              <div style={{ width: 26, height: 54, margin: "0 auto", border: "7px solid #9AA1A5", borderBottom: "none", borderRadius: "16px 16px 0 0", boxSizing: "border-box" }} />
              {show ? (
                <div style={{ background: paper, padding: 10, paddingBottom: 12, boxShadow: `0 ${18 + 22 * lift}px ${34 + 30 * lift}px rgba(0,0,0,0.55)`, position: "relative" }}>
                  <div style={{ width: "100%", height: 150, overflow: "hidden" }}><Img src={staticFile(c.src)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: done && !final ? "saturate(0.75) brightness(0.9)" : undefined }} /></div>
                  <div style={{ fontFamily: MARK, fontSize: c.title.length > 12 ? 24 : 30, color: K.ink, textAlign: "center", marginTop: 8, lineHeight: 1.05, height: 50 }}>{c.title}</div>
                  <div style={{ position: "absolute", left: -12, top: -10, background: K.ink, color: "#E9C46A", fontFamily: SLAB, fontWeight: 800, fontSize: 30, padding: "0 10px", transform: "rotate(-5deg)" }}><span style={{ fontFamily: COND, fontWeight: 500, fontSize: 16, marginRight: 3 }}>Nº</span>{c.rank}</div>
                  <Slam f={f} at={cur && !final ? 30 : final ? 6 + i * 2 : -99} rot={8} style={{ position: "absolute", right: -18, top: 84 }}>
                    <div style={{ border: `5px solid ${c.rank === 1 ? "#B8860B" : K.red}`, color: c.rank === 1 ? "#B8860B" : K.red, background: "rgba(255,250,240,0.93)", borderRadius: 10, fontFamily: SLAB, fontWeight: 800, fontSize: 52, lineHeight: 1, padding: "2px 10px 6px" }}>{c.score}<span style={{ fontSize: 22 }}>/10</span></div>
                  </Slam>
                </div>
              ) : <div style={{ height: 40 }} />}
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── tira de papel blanco de carnicero pegada con cinta: "n de 5" + renglón; un trazo de lápiz graso lo subraya (overlay sobre la foto del momento)
export const Strip: React.FC<{ n: number; total: number; text: string; dur: number }> = ({ n, total, text, dur }) => {
  const f = useCurrentFrame(); const p = sp(f, 0, 12, 0.7); const o = interpolate(f, [dur - 9, dur], [1, 0], CL); const u = eout((f - 10) / 16);
  return (
    <div style={{ position: "absolute", left: 100, bottom: 110, opacity: o, transform: `translateX(${(1 - p) * -900}px) rotate(${lerp(-6, -1.5, p)}deg)` }}>
      <div style={{ position: "absolute", left: -34, top: -16, width: 120, height: 40, background: "rgba(236,226,204,0.88)", transform: "rotate(-24deg)", boxShadow: "0 2px 6px rgba(0,0,0,0.2)", zIndex: 2 }} />
      <div style={{ background: paper, padding: "20px 44px 26px 40px", boxShadow: "0 18px 40px rgba(0,0,0,0.5)", clipPath: "polygon(0 0, 100% 0, 98% 22%, 100% 46%, 98.5% 70%, 100% 100%, 0 100%)" }}>
        <div style={{ fontFamily: COND, fontWeight: 600, fontSize: 36, letterSpacing: 6, color: K.red }}>READ THE PACK · {n} OF {total}</div>
        <div style={{ fontFamily: MARK, fontSize: 66, color: K.ink, lineHeight: 1.1, whiteSpace: "nowrap" }}>{text.split(" ").slice(0, -1).join(" ")}{" "}
          <span style={{ position: "relative", display: "inline-block", fontSize: 78, color: K.red }}>{text.split(" ").slice(-1)[0]}
            <span style={{ position: "absolute", left: 0, bottom: -2, height: 9, width: `${u * 100}%`, background: K.red, borderRadius: 5, transform: "rotate(-1deg)", opacity: 0.9 }} />
          </span>
        </div>
      </div>
    </div>
  );
};

// ── "lo que hace falta": la foto real de todo sobre el tajo; a cada cosa le cae su etiqueta de precio en su palabra
export const NeedPhoto: React.FC<{ src: string; tags: { x: number; y: number; t: string; f: number; side?: number }[]; dur: number }> = ({ src, tags, dur }) => {
  const f = useCurrentFrame(); const z = lerp(1.0, 1.07, eio(f / Math.max(1, dur)));
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: K.ink }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "52% 50%" }}>
        <Img src={staticFile(src)} style={{ width: 1920, height: 1080, objectFit: "fill" }} />
        {tags.map((t, i) => {
          const p = sp(f, t.f, 8, 0.8); const s = t.side ?? 1;
          return (
            <div key={i} style={{ position: "absolute", left: t.x, top: t.y, opacity: cl((f - t.f) / 3), transformOrigin: "0 0", transform: `translateY(${(1 - cl(p * 1.5)) * -260}px) rotate(${lerp(s * 30, s * -3, p)}deg)` }}>
              <div style={{ width: 3, height: 34, background: "#E9E0C8", marginLeft: 20 }} />
              <div style={{ background: kraft, borderRadius: "28px 8px 8px 8px", padding: "10px 22px 12px 44px", boxShadow: "0 12px 26px rgba(0,0,0,0.55)", position: "relative", whiteSpace: "nowrap" }}>
                <div style={{ position: "absolute", left: 14, top: 12, width: 18, height: 18, borderRadius: "50%", background: "rgba(30,20,10,0.8)" }} />
                <span style={{ fontFamily: SLAB, fontWeight: 800, fontSize: 60, color: K.red, marginRight: 12 }}>{t.t.split("|")[0]}</span>
                <span style={{ fontFamily: MARK, fontSize: 46, color: K.ink }}>{t.t.split("|")[1]}</span>
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── los siete del Chicago: siete fotos reales colgadas con broches de una cuerda de atar; cada una cae y se balancea en su palabra
export const SevenPhotos: React.FC<{ items: { t: string; f: number; src: string }[]; dur: number }> = ({ items, dur }) => {
  const f = useCurrentFrame(); const o = interpolate(f, [0, 6, dur - 8, dur], [0, 1, 1, 0], CL);
  let cx = 44 + 122; for (let i = 1; i < items.length; i++) cx = lerp(cx, 44 + i * 264 + 122, eio((f - (items[i].f - 10)) / 14));
  const fin = eio((f - (items[items.length - 1].f + 22)) / 22); const z = lerp(1.75, 1.0, fin); const px = cl(lerp(cx, 960, fin), 960 / z, 1920 - 960 / z);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Tile dur={dur} dark={0.34} />
      <AbsoluteFill style={{ transformOrigin: "0 0", transform: `translate(${960 - px * z}px, ${540 - 560 * z}px) scale(${z})` }}>
      <div style={{ position: "absolute", left: -30, right: -30, top: 326, height: 10, background: "repeating-linear-gradient(60deg, #EDE3CC 0 7px, #B9A983 7px 12px)", boxShadow: "0 6px 10px rgba(0,0,0,0.4)", transform: "rotate(-0.5deg)" }} />
      {items.map((it, i) => {
        const p = sp(f, it.f, 7, 1.0); const x = 44 + i * 264; const sway = Math.sin((f + i * 17) / 20) * 1.8;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: 310 - i * 2.3, width: 244, transformOrigin: "50% 0", opacity: cl((f - it.f) / 3), transform: `translateY(${(1 - cl(p * 1.7)) * -620}px) rotate(${lerp(i % 2 ? 34 : -34, sway, cl(p))}deg)` }}>
            <div style={{ width: 22, height: 58, margin: "0 auto -18px", background: "linear-gradient(90deg, #B98A4E, #E3BE86, #9C7038)", borderRadius: 4, position: "relative", zIndex: 2, boxShadow: "0 3px 6px rgba(0,0,0,0.4)" }} />
            <div style={{ background: "#F6F1E6", padding: "12px 12px 16px", boxShadow: "0 22px 40px rgba(0,0,0,0.55)" }}>
              <div style={{ width: 220, height: 260, overflow: "hidden" }}><Img src={staticFile(it.src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.5)" }} /></div>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 10, marginTop: 10, height: 96 }}>
                <span style={{ fontFamily: SLAB, fontWeight: 800, fontSize: 54, color: K.red, lineHeight: 1 }}>{i + 1}</span>
                <span style={{ fontFamily: MARK, fontSize: it.t.length > 8 ? 30 : 42, color: K.ink, lineHeight: 1.0, whiteSpace: "nowrap" }}>{it.t}</span>
              </div>
            </div>
          </div>
        );
      })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── capítulo: el papel se desenrolla de verdad desde el rodillo (el rollo se achica) y trae una foto pegada con cinta; el título se pinta
export const Chapter2: React.FC<{ kicker: string; title: string; img?: string; dur: number }> = ({ kicker, title, img, dur }) => {
  const f = useCurrentFrame(); const roll = eout(f / 24); const o = interpolate(f, [0, 4, dur - 8, dur], [0, 1, 1, 0], CL);
  const H = 800 * roll; const R = lerp(64, 40, roll); const wr = eio((f - 16) / 18); const ph = sp(f, 20, 9, 0.8);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Tile dur={dur} dark={0.34} />
      <div style={{ position: "absolute", left: 250, right: 250, top: 26 + R, height: H, background: kraft, boxShadow: "18px 30px 60px rgba(0,0,0,0.5)", overflow: "hidden", transform: `skewX(${Math.sin(f / 9) * 0.25 * (1 - roll)}deg)` }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(180deg, rgba(0,0,0,0.05) 0 2px, rgba(255,255,255,0.05) 2px 4px, transparent 4px 190px)" }} />
        <div style={{ position: "absolute", left: 70, top: H - 600, width: img ? 700 : 1280 }}>
          <div style={{ fontFamily: COND, fontWeight: 600, fontSize: 40, letterSpacing: 10, color: K.red, opacity: wr }}>{kicker}</div>
          <div style={{ fontFamily: MARK, fontSize: img ? Math.min(170, Math.round(1180 / Math.max(6, Math.max(...title.split(" ").map((w) => w.length)) + 1))) : (title.length > 16 ? 120 : 170), color: K.ink, lineHeight: 1.0, marginTop: 16, transform: "rotate(-3deg)", transformOrigin: "0 50%", clipPath: `inset(-10% ${100 - wr * 104}% -10% 0)` }}>{title}</div>
        </div>
        {img && (
          <div style={{ position: "absolute", right: 56, top: H - 640, width: 490, padding: 16, paddingBottom: 20, background: "#F6F1E6", transform: `rotate(${lerp(18, 4, ph)}deg) scale(${lerp(1.3, 1, ph)})`, opacity: cl(ph * 2), boxShadow: "0 24px 50px rgba(0,0,0,0.5)" }}>
            <Img src={staticFile(img)} style={{ width: "100%", height: 420, objectFit: "cover" }} />
            <div style={{ position: "absolute", left: 190, top: -20, width: 140, height: 42, background: "rgba(236,226,204,0.88)", transform: "rotate(-4deg)" }} />
          </div>
        )}
      </div>
      <div style={{ position: "absolute", left: 200, right: 200, top: 26, height: R * 2, background: steel, borderRadius: R, boxShadow: "0 16px 30px rgba(0,0,0,0.5)" }} />
      <div style={{ position: "absolute", left: 250, right: 250, top: 30, height: R * 2 - 8, background: `linear-gradient(180deg, ${K.kraft2} 0%, #E2C592 40%, ${K.kraft2} 100%)`, borderRadius: R }} />
    </AbsoluteFill>
  );
};

// ── pedido de suscripción: foto real del pinche de pedidos con el papel en blanco; la pregunta se escribe en el papel y el sello de goma golpea
export const SpikeCTA: React.FC<{ src: string; lines: string[]; box: [number, number, number, number]; dur: number }> = ({ src, lines, box, dur }) => {
  const f = useCurrentFrame(); const z = lerp(1.0, 1.1, eio(f / Math.max(1, dur))); const hit = sp(f, 52, 7, 0.5);
  const bump = f >= 52 ? Math.max(0, 1 - (f - 52) / 8) * 6 : 0; const [bx, by, bw, bh] = box;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: K.ink }}>
      <AbsoluteFill style={{ transform: `scale(${z}) translateY(${bump}px)`, transformOrigin: `${bx + bw / 2}px ${by + bh / 2}px` }}>
        <Img src={staticFile(src)} style={{ width: 1920, height: 1080, objectFit: "fill" }} />
        <div style={{ position: "absolute", left: bx, top: by, width: bw, height: bh, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", transform: "rotate(-1deg)" }}>
          {lines.map((l, i) => { const w = eio((f - 10 - i * 16) / 16); return <div key={i} style={{ fontFamily: MARK, fontSize: bw / 11.5, color: "#2A1B12", lineHeight: 1.12, whiteSpace: "nowrap", clipPath: `inset(-10% ${100 - w * 104}% -10% 0)` }}>{l}</div>; })}
        </div>
        <div style={{ position: "absolute", left: bx + bw - 400, top: by + bh - 86, transform: `scale(${lerp(3.2, 1, hit)}) rotate(${lerp(-30, -8, hit)}deg)`, opacity: cl(hit * 3) }}>
          <div style={{ border: `9px solid ${K.red}`, outline: `3px solid ${K.red}`, outlineOffset: 6, borderRadius: 14, padding: "4px 28px", color: K.red, fontFamily: COND, fontWeight: 600, fontSize: 84, letterSpacing: 6, background: "rgba(255,250,240,0.35)", boxShadow: `0 0 0 ${interpolate(f, [52, 70], [0, 26], CL)}px rgba(179,38,30,${interpolate(f, [52, 70], [0.35, 0], CL)})` }}>SUBSCRIBE</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── mapa de papel real: la cámara viaja de alfiler en alfiler; cada alfiler cae, se clava con rebote y deja sombra; cuelga su banderita
export const MapDolly: React.FC<{ src: string; pins: { x: number; y: number; t: string; f: number }[]; dur: number }> = ({ src, pins, dur }) => {
  const f = useCurrentFrame();
  let cx = pins[0].x, cy = pins[0].y;
  for (let i = 1; i < pins.length; i++) { const t = eio((f - (pins[i].f - 16)) / 22); cx = lerp(cx, pins[i].x, t); cy = lerp(cy, pins[i].y, t); }
  const out = eio((f - (dur - 34)) / 26); const z = lerp(1.9, 1.5, out);
  const mx = pins.reduce((a, p) => a + p.x, 0) / pins.length, my = pins.reduce((a, p) => a + p.y, 0) / pins.length; const tx = cl(lerp(cx, mx, out), 960 / z, 1920 - 960 / z), ty = cl(lerp(cy - 30, my - 20, out), 540 / z, 1080 - 540 / z);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: K.ink, opacity: interpolate(f, [0, 5, dur - 8, dur], [0, 1, 1, 0], CL) }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "0 0", transform: `translate(${960 - tx * z}px, ${540 - ty * z}px) scale(${z})` }}>
        <Img src={staticFile(src)} style={{ width: 1920, height: 1080, objectFit: "fill" }} />
        {pins.map((p, i) => {
          const s = sp(f, p.f, 7, 0.7); const fall = cl(s * 1.4); const up = i % 2 === 0; const izq = p.x > 1200;
          return (
            <div key={i} style={{ position: "absolute", left: p.x, top: p.y, opacity: cl((f - p.f) / 2) }}>
              <div style={{ position: "absolute", left: 4, top: -4, width: 46 * fall, height: 12, borderRadius: "50%", background: "rgba(0,0,0,0.38)", transform: "skewX(-40deg)" }} />
              <div style={{ position: "absolute", left: -2, top: -46 - (1 - fall) * 260, width: 4, height: 48, background: "linear-gradient(90deg, #7d8286, #f2f4f5, #6c7175)" }} />
              <div style={{ position: "absolute", left: -17, top: -78 - (1 - fall) * 260, width: 34, height: 34, borderRadius: "50%", background: `radial-gradient(circle at 34% 28%, #FF9A8F 0%, #D7362B 34%, ${K.red} 62%, #5E0F0A 100%)`, boxShadow: "4px 8px 10px rgba(0,0,0,0.4)" }} />
              <div style={{ position: "absolute", ...(izq ? { right: 18 } : { left: 18 }), top: up ? -124 : -34, transformOrigin: izq ? "100% 50%" : "0 50%", transform: `scale(${s}) rotate(${(izq ? -1 : 1) * (up ? -5 : 4)}deg)`, background: paper, padding: "5px 20px 8px 18px", boxShadow: "0 8px 16px rgba(0,0,0,0.4)", whiteSpace: "nowrap", fontFamily: MARK, fontSize: 40, color: K.ink }}>{p.t}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ── apertura de método: barrido de papel madera → foto del plato a pantalla completa con cámara que empuja; el puesto cuelga como etiqueta de precio
export const MethodScene2: React.FC<{ n: number; rank: number; total: number; title: string; src: string; dur: number }> = ({ n, rank, total, title, src, dur }) => {
  const f = useCurrentFrame(); const v = n - 1, right = v % 2 === 1; const o = interpolate(f, [dur - 10, dur], [1, 0], CL);
  const k = cl((f - 8) / (dur - 8)); const z = lerp(1.22, 1.06, eout(k)); const t = f / 22; const pos = lerp(-1.25, 1.25, Easing.inOut(Easing.quad)(cl(t)));
  const sw = sp(f, 16, 7, 1.0); const words = title.split(" ");
  return (
    <AbsoluteFill>
      {f >= 9 && (
        <AbsoluteFill style={{ opacity: o }}>
          <AbsoluteFill style={{ overflow: "hidden", background: K.ink }}><Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z})`, transformOrigin: right ? "30% 60%" : "70% 60%" }} /></AbsoluteFill>
          <div style={{ position: "absolute", top: 0, ...(right ? { right: 50 } : { left: 50 }), transformOrigin: "50% 0", transform: `rotate(${lerp(right ? -40 : 40, Math.sin(f / 21) * 1.4, cl(sw))}deg) translateY(${(1 - cl(sw * 1.6)) * -600}px)` }}>
            <div style={{ width: 4, height: 150, background: "#E9E0C8", margin: "0 auto" }} />
            <div style={{ background: kraft, borderRadius: "90px 90px 14px 14px", padding: "74px 36px 30px", minWidth: 390, textAlign: "center", boxShadow: "0 30px 60px rgba(0,0,0,0.6)", position: "relative" }}>
              <div style={{ position: "absolute", left: "50%", top: 22, marginLeft: -15, width: 30, height: 30, borderRadius: "50%", background: "rgba(30,20,10,0.82)", boxShadow: "inset 0 0 0 5px rgba(255,235,200,0.5)" }} />
              <div style={{ fontFamily: COND, fontWeight: 600, fontSize: 40, letterSpacing: 6, color: K.red }}>METHOD {rank} OF {total}</div>
              <div style={{ fontFamily: SLAB, fontWeight: 800, fontSize: 250, lineHeight: 0.92, color: K.ink }}><span style={{ fontFamily: COND, fontWeight: 500, fontSize: 70, verticalAlign: "top", marginRight: 8, color: K.red }}>Nº</span>{rank}</div>
              <div style={{ display: "flex", flexWrap: "wrap", columnGap: 16, justifyContent: "center", maxWidth: 520 }}>
                {words.map((w, i) => { const p = sp(f, 30 + i * 5, 14, 0.6); return <span key={i} style={{ fontFamily: MARK, fontSize: 70, color: K.ink, opacity: p, transform: `translateY(${(1 - p) * 24}px)`, display: "inline-block" }}>{w}</span>; })}
              </div>
            </div>
          </div>
        </AbsoluteFill>
      )}
      {t <= 1 && (
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <div style={{ position: "absolute", left: `${(right ? -1 : 1) * pos * 100 - 15}%`, top: "-15%", width: "130%", height: "130%", background: kraft, transform: "rotate(-3deg)", boxShadow: "0 0 90px rgba(0,0,0,0.65)" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(90deg, rgba(0,0,0,0.10) 0 2px, rgba(255,255,255,0.07) 2px 4px, transparent 4px 240px)" }} />
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
export const seedOf = (n: number) => hash(n);

// ── índice del video: la cámara recorre el riel de ganchos del Nº 8 al Nº 1; las siete primeras fotos cuelgan y la Nº 1 va envuelta en papel madera
export const RailIndex: React.FC<{ cards: RCard[]; dur: number }> = ({ cards, dur }) => {
  const f = useCurrentFrame(); const o = interpolate(f, [0, 6, dur - 10, dur], [0, 1, 1, 0], CL);
  const order = [...cards].sort((a, b) => b.rank - a.rank); const W = 214;
  const t = eio((f - 6) / (dur - 40)); const cx = lerp(70 + W / 2 + 130, 70 + 7 * 228 + W / 2 - 40, t); const z = lerp(2.3, 2.6, t);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Tile dur={dur} dark={0.34} />
      <AbsoluteFill style={{ transform: `translate(${960 - cx}px, 130px) scale(${z})`, transformOrigin: `${cx}px 290px` }}>
        <div style={{ position: "absolute", left: -1400, right: -1400, top: 150, height: 26, background: steel, boxShadow: "0 14px 22px rgba(0,0,0,0.45)" }} />
        {order.map((c, i) => {
          const x = 70 + i * 228; const drop = sp(f, 4 + i * 5, 8, 1.0); const sway = Math.sin((f + i * 19) / 21) * 1.5; const tapada = c.rank === 1;
          return (
            <div key={c.rank} style={{ position: "absolute", left: x, top: 164, width: W, transformOrigin: "50% 0", transform: `translateY(${(1 - cl(drop * 1.6)) * -700}px) rotate(${lerp(i % 2 ? 22 : -22, sway, cl(drop))}deg)` }}>
              <div style={{ width: 26, height: 54, margin: "0 auto", border: "7px solid #9AA1A5", borderBottom: "none", borderRadius: "16px 16px 0 0", boxSizing: "border-box" }} />
              <div style={{ background: tapada ? kraft : paper, padding: 10, paddingBottom: 12, boxShadow: "0 18px 34px rgba(0,0,0,0.55)", position: "relative" }}>
                <div style={{ width: "100%", height: 150, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {tapada ? <span style={{ fontFamily: SLAB, fontWeight: 800, fontSize: 80, color: K.red }}>1961</span> : <Img src={staticFile(c.src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                </div>
                <div style={{ fontFamily: MARK, fontSize: c.title.length > 12 ? 24 : 30, color: K.ink, textAlign: "center", marginTop: 8, lineHeight: 1.05, height: 50 }}>{tapada ? "My father\u2019s" : c.title}</div>
                <div style={{ position: "absolute", left: -12, top: -10, background: K.ink, color: "#E9C46A", fontFamily: SLAB, fontWeight: 800, fontSize: 30, padding: "0 10px", transform: "rotate(-5deg)" }}><span style={{ fontFamily: COND, fontWeight: 500, fontSize: 16, marginRight: 3 }}>Nº</span>{c.rank}</div>
                {tapada && <div style={{ position: "absolute", left: 0, right: 0, top: 96, height: 6, background: "repeating-linear-gradient(60deg, #EDE3CC 0 6px, #B9A983 6px 10px)" }} />}
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
