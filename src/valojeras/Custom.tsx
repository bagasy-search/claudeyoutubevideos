// Custom.tsx — set-pieces propios de valojeras en la marca Valeria (papel crema · tinta espresso · latón).
//   RecipePanel (overlay lateral con la receta que se llena por frase) · Lamina (EL MOMENTO, zoom punto por punto)
//   QrCta (página real del recetario + QR REAL, las dos vías) · Timeline (qué esperar, con honestidad) · TalkOverlay
// ⛔ Todo texto e imagen llega por props (nada quemado). Tiempos internos en cuadros relativos al componente.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { VAL, FONT_DISPLAY, FONT_SERIF, FONT_SANS, FONT_HAND, FONT_SERIF_FINE } from "../valeria/theme";
import { rgba, ramp, spr, Atmosphere, Finish, Plane, GlassPhoto, useCam, KickerRule } from "./ValDepth";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const src = (p?: string) => (p ? (p.startsWith("http") ? p : staticFile(p)) : undefined);
const outK = (f: number, d: number) => ramp(f, d - 9, d);

// ── RECETA: tarjeta de papel a la derecha, los ítems caen cuando la doctora los dice ─────────────
export const RecipePanel: React.FC<{ kicker?: string; title?: string; img?: string; items?: { text: string; at: number }[]; durationInFrames?: number }> = ({ kicker = "", title = "", img, items = [], durationInFrames = 300 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inK = spr(f, fps, 0, 120, 0.9);
  const out = outK(f, durationInFrames);
  const x = interpolate(inK, [0, 1], [640, 0]) + out * 700;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: `linear-gradient(90deg, transparent 38%, ${rgba(VAL.paper, 0.55 * (1 - out) * inK)} 62%, ${rgba(VAL.paper, 0.8 * (1 - out) * inK)} 100%)` }} />
      <div style={{ position: "absolute", right: 70, top: 90, width: 760, transform: `translateX(${x.toFixed(1)}px) rotate(${(0.8 - inK * 0.8 + Math.sin(f / 70) * 0.25).toFixed(2)}deg)`, opacity: 1 - out }}>
        <div style={{ background: VAL.card, borderRadius: 18, padding: "38px 46px 40px", border: `1px solid ${VAL.cardEdge}`, boxShadow: `0 30px 70px ${rgba(VAL.ink, 0.28)}, 0 0 0 10px ${rgba(VAL.card, 0.55)}` }}>
          <div style={{ position: "absolute", inset: 14, border: `1.5px solid ${rgba(VAL.gold, 0.55)}`, borderRadius: 12, pointerEvents: "none" }} />
          <div style={{ display: "flex", gap: 26, alignItems: "center" }}>
            {img ? <div style={{ width: 170, height: 170, borderRadius: "50%", overflow: "hidden", flex: "0 0 170px", border: `5px solid ${VAL.paper}`, boxShadow: `0 10px 26px ${rgba(VAL.ink, 0.25)}` }}>
              <Img src={src(img) as string} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${(1.1 + f * 0.0005).toFixed(4)})` }} />
            </div> : null}
            <div>
              <div style={{ fontFamily: FONT_SANS, fontWeight: 700, fontSize: 24, letterSpacing: 4, color: VAL.gold, textTransform: "uppercase", opacity: ramp(f, 6, 18) }}>{kicker}</div>
              <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 60, lineHeight: 1.02, color: VAL.ink, marginTop: 8, opacity: ramp(f, 10, 24), transform: `translateY(${((1 - ramp(f, 10, 24)) * 14).toFixed(1)}px)` }}>{title}</div>
            </div>
          </div>
          <div style={{ height: 2, background: `linear-gradient(90deg, ${VAL.gold}, transparent)`, margin: "26px 0 18px", width: `${(ramp(f, 14, 34) * 100).toFixed(0)}%` }} />
          {items.map((it, i) => {
            const k = spr(f, fps, it.at, 110, 0.8);
            const active = f >= it.at && (i === items.length - 1 || f < items[i + 1].at);
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, padding: "14px 16px", marginTop: 6, borderRadius: 12, opacity: k, transform: `translateX(${((1 - k) * 60).toFixed(1)}px)`, background: active ? rgba(VAL.gold, 0.13) : "transparent" }}>
                <div style={{ width: 58, height: 58, flex: "0 0 58px", borderRadius: "50%", background: active ? VAL.gold : VAL.paperWarm, border: `2px solid ${VAL.gold}`, color: active ? VAL.onAccent : VAL.goldDark, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 30, transform: `scale(${(0.6 + 0.4 * k).toFixed(3)})` }}>{i + 1}</div>
                <div style={{ fontFamily: FONT_SERIF, fontWeight: 600, fontSize: 40, lineHeight: 1.12, color: VAL.ink }}>{it.text}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── LÁMINA: pantalla completa, la página del recetario, zoom punto por punto ───────────────────
export const Lamina: React.FC<{ img: string; zooms?: { at: number; x: number; y: number; z: number }[]; durationInFrames?: number }> = ({ img, zooms = [], durationInFrames = 900 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inK = spr(f, fps, 0, 110, 0.9);
  const out = outK(f, durationInFrames);
  // cámara: interpola entre paradas con easing, entrando cada parada en 22 cuadros
  let cx = 0.5, cy = 0.5, cz = 1;
  const stops = [{ at: 0, x: 0.5, y: 0.5, z: 1 }, ...zooms];
  for (let i = 1; i < stops.length; i++) {
    const a = stops[i - 1], b = stops[i];
    const k = interpolate(f, [b.at, b.at + 22], [0, 1], { ...CL, easing: Easing.bezier(0.45, 0, 0.2, 1) });
    if (f >= b.at) { cx = a.x + (b.x - a.x) * k; cy = a.y + (b.y - a.y) * k; cz = a.z + (b.z - a.z) * k; }
  }
  const W = 1640, H = W * 608 / 1088;
  const drift = Math.sin(f / 60) * 0.004;
  const tx = (0.5 - cx) * W * cz, ty = (0.5 - cy) * H * cz;
  return (
    <AbsoluteFill style={{ backgroundColor: VAL.paperDeep, opacity: 1 - out * 0.9 }}>
      <Atmosphere frame={f} img={img} blur={26} dim={0.4} bokeh={8} seed={17} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: W, height: H, transform: `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) scale(${(cz * (0.92 + 0.08 * inK) + drift).toFixed(4)})`, transformOrigin: "50% 50%", opacity: inK, boxShadow: `0 40px 90px ${rgba(VAL.ink, 0.35)}`, borderRadius: 6, overflow: "hidden", background: VAL.card }}>
          <Img src={src(img) as string} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      </AbsoluteFill>
      <Finish frame={f} seed={19} motes={12} />
    </AbsoluteFill>
  );
};

// ── QR CTA: página REAL del recetario + QR REAL (fondo blanco, grande, sin tapar) + las dos vías ──
export const QrCta: React.FC<{ kicker?: string; title?: string; sub?: string; page?: string; cover?: string; qr?: string; tvAt?: number; phoneAt?: number; durationInFrames?: number }> = ({ kicker = "", title = "", sub = "", page, cover, qr, tvAt = 60, phoneAt = 120, durationInFrames = 300 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cam = useCam(f, fps, [], 0.03, durationInFrames);
  const inK = spr(f, fps, 0, 120, 0.9);
  const qrK = spr(f, fps, 8, 120, 0.8);
  const out = outK(f, durationInFrames);
  const tvK = spr(f, fps, tvAt, 110, 0.8), phK = spr(f, fps, phoneAt, 110, 0.8);
  return (
    <AbsoluteFill style={{ opacity: 1 - out * 0.9 }}>
      <Atmosphere frame={f} img={page} blur={22} dim={0.55} bokeh={9} seed={23} camX={cam.camX} />
      <Plane depth={0.5} camX={cam.camX} camY={cam.camY} z={1}>
        <div style={{ position: "absolute", left: 150, top: 170, transform: `translateY(${((1 - inK) * 80).toFixed(1)}px) perspective(1600px) rotateY(14deg) rotateZ(-5deg)`, opacity: inK }}>
          <GlassPhoto img={page} w={520} h={720} radius={8} />
        </div>
        <div style={{ position: "absolute", left: 470, top: 230, transform: `translateY(${((1 - inK) * 110).toFixed(1)}px) perspective(1600px) rotateY(8deg) rotateZ(3deg)`, opacity: inK }}>
          <GlassPhoto img={cover} w={500} h={700} radius={8} push={f * 0.0002} />
        </div>
      </Plane>
      <Plane depth={0.9} camX={cam.camX} camY={cam.camY} z={3}>
        <div style={{ position: "absolute", left: 1060, top: 110, width: 740 }}>
          <KickerRule text={kicker} a={ramp(f, 4, 16)} color={VAL.gold} />
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 66, lineHeight: 1.04, color: VAL.ink, marginTop: 10, opacity: ramp(f, 8, 22) }}>{title}</div>
          <div style={{ display: "flex", gap: 34, alignItems: "center", marginTop: 34 }}>
            <div style={{ background: "#FFFFFF", padding: 22, borderRadius: 14, boxShadow: `0 24px 50px ${rgba(VAL.ink, 0.3)}`, border: `3px solid ${VAL.gold}`, transform: `scale(${(0.85 + 0.15 * qrK).toFixed(3)})`, opacity: qrK }}>
              {qr ? <Img src={src(qr) as string} style={{ width: 400, height: 400, display: "block", imageRendering: "pixelated" }} /> : null}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
              <div style={{ opacity: tvK, transform: `translateX(${((1 - tvK) * 40).toFixed(1)}px)` }}>
                <div style={{ fontFamily: FONT_SANS, fontWeight: 700, fontSize: 22, letterSpacing: 3, color: VAL.goldDark, textTransform: "uppercase" }}>En el televisor</div>
                <div style={{ fontFamily: FONT_SERIF, fontWeight: 700, fontSize: 40, lineHeight: 1.05, color: VAL.ink }}>escanee el código</div>
              </div>
              <div style={{ opacity: phK, transform: `translateX(${((1 - phK) * 40).toFixed(1)}px)` }}>
                <div style={{ fontFamily: FONT_SANS, fontWeight: 700, fontSize: 22, letterSpacing: 3, color: VAL.goldDark, textTransform: "uppercase" }}>En el teléfono</div>
                <div style={{ fontFamily: FONT_SERIF, fontWeight: 700, fontSize: 40, lineHeight: 1.05, color: VAL.ink }}>enlace abajo, en la descripción</div>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 30, display: "inline-block", padding: "12px 26px", borderRadius: 999, background: VAL.card, border: `1.5px solid ${VAL.gold}`, fontFamily: FONT_SERIF, fontWeight: 700, fontSize: 38, color: VAL.ink, opacity: ramp(f, 16, 30) }}>{sub}</div>
        </div>
      </Plane>
      <Finish frame={f} seed={29} motes={10} />
    </AbsoluteFill>
  );
};

// ── TIMELINE: qué esperar, tres paradas que se dibujan cuando la doctora las dice ──────────────
export const Timeline: React.FC<{ kicker?: string; title?: string; marks?: { label: string; text: string; at: number; img?: string }[]; durationInFrames?: number }> = ({ kicker = "", title = "", marks = [], durationInFrames = 600 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cam = useCam(f, fps, marks.map((m) => m.at), 0.04, durationInFrames);
  const out = outK(f, durationInFrames);
  const n = Math.max(1, marks.length);
  const X0 = 220, X1 = 1700, Y = 640;
  const last = marks.filter((m) => f >= m.at).length;
  const lineK = interpolate(f, [marks[0]?.at ?? 0, (marks[n - 1]?.at ?? 0) + 20], [0.02, 1], CL);
  return (
    <AbsoluteFill style={{ opacity: 1 - out * 0.9 }}>
      <Atmosphere frame={f} img={marks[Math.max(0, last - 1)]?.img} blur={24} dim={0.62} bokeh={9} seed={37} camX={cam.camX} />
      <AbsoluteFill style={{ transform: `scale(${cam.scale.toFixed(4)})` }}>
        <Plane depth={0.4} camX={cam.camX} camY={cam.camY} z={1}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 80, textAlign: "center" }}>
            <KickerRule text={kicker} a={ramp(f, 2, 14)} color={VAL.gold} center />
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 68, color: VAL.ink, marginTop: 8, opacity: ramp(f, 6, 20) }}>{title}</div>
          </div>
          <div style={{ position: "absolute", left: X0, top: Y, width: (X1 - X0) * lineK, height: 5, borderRadius: 3, background: `linear-gradient(90deg, ${VAL.goldDark}, ${VAL.goldLite})` }} />
        </Plane>
        <Plane depth={0.85} camX={cam.camX} camY={cam.camY} z={3}>
          {marks.map((m, i) => {
            const k = spr(f, fps, m.at, 110, 0.8);
            const x = X0 + ((X1 - X0) * (i + 0.5)) / n;
            const active = i === last - 1;
            return (
              <div key={i} style={{ position: "absolute", left: x, top: Y, transform: "translate(-50%, 0)", width: 470, textAlign: "center", opacity: k }}>
                <div style={{ position: "absolute", left: "50%", top: -370, transform: `translate(-50%, ${((1 - k) * 40).toFixed(1)}px) rotate(${(i - 1) * 2}deg)` }}>
                  <GlassPhoto img={m.img} w={400} h={300} glow={active ? VAL.gold : undefined} glowK={active ? 0.8 : 0} dim={active ? 0 : 0.2} />
                </div>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: active ? VAL.gold : VAL.card, border: `4px solid ${VAL.gold}`, margin: "-15px auto 0", transform: `scale(${(0.5 + 0.5 * k).toFixed(3)})` }} />
                <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 46, color: active ? VAL.goldDark : VAL.ink, marginTop: 22 }}>{m.label}</div>
                <div style={{ fontFamily: FONT_SERIF, fontWeight: 600, fontSize: 34, lineHeight: 1.15, color: VAL.ink2, marginTop: 10 }}>{m.text}</div>
              </div>
            );
          })}
        </Plane>
      </AbsoluteFill>
      <Finish frame={f} seed={39} motes={12} />
    </AbsoluteFill>
  );
};

// ── TALK: frase cinética sobre el avatar (o el plano), sin tapar la cara ─────────────────────
export const TalkOverlay: React.FC<{ kicker?: string; title?: string; hot?: string[]; durationInFrames?: number }> = ({ kicker = "", title = "", hot = [], durationInFrames = 150 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const out = ramp(f, durationInFrames - 12, durationInFrames);
  const k = spr(f, fps, 6, 120, 0.8);
  const words = title.split(/\s+/).filter(Boolean);
  const hotSet = new Set(hot.flatMap((h) => h.toLowerCase().split(/\s+/)));
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ opacity: k * (1 - out), background: `linear-gradient(to top, ${rgba(VAL.paper, 0.9)} 0%, ${rgba(VAL.paper, 0.35)} 26%, transparent 48%)` }} />
      <div style={{ position: "absolute", left: 110, bottom: 96, width: 1100, opacity: 1 - out, transform: `translateY(${(out * 24).toFixed(1)}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, opacity: ramp(f, 4, 16) }}>
          <div style={{ width: 54 * ramp(f, 4, 16), height: 3, background: VAL.gold }} />
          <div style={{ fontFamily: FONT_SANS, fontWeight: 700, fontSize: 26, letterSpacing: 5, color: VAL.goldDark, textTransform: "uppercase" }}>{kicker}</div>
        </div>
        <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: "0 18px" }}>
          {words.map((w, i) => {
            const wk = spr(f, fps, 12 + i * 4, 120, 0.7);
            const isHot = hotSet.has(w.toLowerCase().replace(/[¿?¡!.,:]/g, ""));
            return <span key={i} style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 76, lineHeight: 1.08, color: isHot ? VAL.goldDark : VAL.ink, fontStyle: isHot ? "italic" : "normal", opacity: wk, display: "inline-block", transform: `translateY(${((1 - wk) * 26).toFixed(1)}px)`, textShadow: `0 2px 18px ${rgba(VAL.paper, 0.9)}` }}>{w}</span>;
          })}
        </div>
        <div style={{ fontFamily: FONT_HAND, fontSize: 1, opacity: 0 }}>.</div>
      </div>
    </AbsoluteFill>
  );
};
export const _unused = FONT_SERIF_FINE;
