// Tarjetas del kit Rhonda (todas sobre una CAMA real del baño: los gráficos viven en el mundo, nunca sobre negro).
//   RhChapter   separador de capítulo: franja celeste de la casaca + insignia amarilla de guante (mistake/alert)
//   RhCheck     lista pegada con cinta al espejo; cada renglón se tilda con resaltador amarillo
//   RhBookPage  la página REAL del libro cae sobre la mesada + sello "PAGE FROM RHONDA'S BOOK"
//   RhQRCard    tarjeta con el QR (nítido, decodificable) + "point your phone camera here" + la tapa del libro (sin link ni precio)
//   RhDoDont    dos polaroids en la pared: lo que SÍ (tilde celeste) y lo que NO (cruz roja)
//   RhPins      pines numerados que caen sobre una foto real (dónde mirar)
//   RhColorCode muestrario de colores tipo "parte del tiempo": cuál es cuál y qué hacer
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RH, SERIF, LABEL, HAND, hexA } from "./RhTheme";
import { Bed, Card, Stamp, Tape, lin, pop, useOut } from "./RhParts";

export const RhChapter: React.FC<{ n?: number; title: string; sub?: string; bed?: string; mistake?: boolean; alert?: boolean }> = ({ n, title, sub, bed, mistake, alert }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut(6);
  const band = lin(f, 0, 10), p = pop(f, fps, 6), w = lin(f, 14, 30);
  const accent = alert ? RH.red : RH.yellow;
  return (
    <AbsoluteFill>
      <Bed src={bed} seed={(n || 1) * 7} dim={0.2} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 380, height: 320, background: hexA(RH.blue, 0.94), clipPath: `inset(0 ${100 - band * 100}% 0 0)`, opacity: out, boxShadow: `0 20px 50px ${RH.shadow}` }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0 2px, transparent 2px 22px)` }} />
      </div>
      <div style={{ position: "absolute", left: 150, top: 540, translate: "0 -50%", display: "flex", alignItems: "center", gap: 46, opacity: out }}>
        {n != null ? (
          <div style={{ width: 210, height: 210, borderRadius: "50%", background: accent, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", scale: String(0.4 + 0.6 * p), rotate: `${(1 - p) * -40}deg`, boxShadow: `0 16px 34px ${RH.shadow}`, border: `8px solid ${RH.white}` }}>
            {mistake ? <div style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 30, color: alert ? "#fff" : RH.ink, letterSpacing: 3 }}>MISTAKE</div> : null}
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: mistake ? 100 : 120, color: alert ? "#fff" : RH.ink, lineHeight: 1 }}>{n}</div>
          </div>
        ) : null}
        <div>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 96, color: "#fff", lineHeight: 1.02, maxWidth: 1350, translate: `${(1 - p) * 60}px 0`, opacity: p }}>{title}</div>
          {sub ? <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 60, color: RH.yellowSoft, marginTop: 8, clipPath: `inset(0 ${100 - w * 100}% 0 0)` }}>{sub}</div> : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const RhCheck: React.FC<{ title: string; items: string[]; bed?: string; fast?: boolean }> = ({ title, items, bed, fast }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 2);
  const step = fast ? Math.max(8, (durationInFrames - 30) / items.length) : Math.max(14, Math.min(40, (durationInFrames - 30) / items.length));
  return (
    <AbsoluteFill>
      <Bed src={bed} seed={11} dim={0.2} />
      <div style={{ position: "absolute", right: 150, top: 120, width: 900, opacity: out, translate: `0 ${(1 - p) * 80}px`, rotate: "1.4deg" }}>
        <Card style={{ padding: "50px 60px 46px", backgroundImage: `linear-gradient(${RH.white} 0 0)`, borderTop: `16px solid ${RH.blue}` }}>
          <Tape x={360} y={-34} rot={-3} w={180} />
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: RH.ink, marginBottom: 26 }}>{title}</div>
          {items.map((it, i) => {
            const t0 = 16 + i * step, k = lin(f, t0, t0 + 8), hk = lin(f, t0 + 4, t0 + 16);
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 26, marginBottom: 20, opacity: 0.25 + 0.75 * k }}>
                <div style={{ width: 54, height: 54, flex: "0 0 54px", borderRadius: 10, border: `5px solid ${RH.blueDeep}`, position: "relative", background: RH.white }}>
                  <svg width={70} height={60} style={{ position: "absolute", left: -2, top: -14 }}><path d="M8 32 L26 50 L64 6" fill="none" stroke={RH.blueDeep} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={90} strokeDashoffset={90 * (1 - k)} /></svg>
                </div>
                <div style={{ position: "relative", fontFamily: LABEL, fontWeight: 500, fontSize: 46, color: RH.ink, lineHeight: 1.15 }}>
                  <span style={{ position: "absolute", left: -6, right: -6, bottom: 2, height: 22, background: hexA(RH.yellow, 0.55), transformOrigin: "left", scale: `${hk} 1` }} />
                  <span style={{ position: "relative" }}>{it}</span>
                </div>
              </div>
            );
          })}
        </Card>
      </div>
    </AbsoluteFill>
  );
};

export const RhBookPage: React.FC<{ page: string; stamp?: string; bed?: string }> = ({ page, stamp = "Page from Rhonda's book", bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 2, 18);
  const y = interpolate(p, [0, 1], [-900, 0]), r = interpolate(p, [0, 1], [-14, -3.5]);
  const push = lin(f, 20, 120, 1, 1.05);
  return (
    <AbsoluteFill>
      <Bed src={bed} seed={21} dim={0.28} />
      <div style={{ position: "absolute", left: "50%", top: 70, translate: `-50% ${y}px`, rotate: `${r}deg`, scale: String(push), opacity: out, transformOrigin: "50% 30%" }}>
        <div style={{ background: "#fff", padding: 14, boxShadow: `0 40px 70px ${RH.shadow}, 0 6px 14px rgba(0,0,0,0.12)` }}>
          <Img src={staticFile(page)} style={{ width: 700, display: "block" }} />
        </div>
        <Tape x={290} y={-18} rot={4} w={150} />
      </div>
      <Stamp text={stamp} at={22} color={RH.blueDeep} x="73%" y="78%" rot={-8} size={50} />
    </AbsoluteFill>
  );
};

export const RhQRCard: React.FC<{ qr: string; cover?: string; text?: string; bed?: string }> = ({ qr, cover, text = "point your phone camera here", bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 2), pc = pop(f, fps, 10), w = lin(f, 18, 36);
  return (
    <AbsoluteFill>
      <Bed src={bed} seed={31} dim={0.3} />
      {cover ? (
        <div style={{ position: "absolute", left: 230, top: 170, rotate: `${-7 + (1 - pc) * -20}deg`, scale: String(0.6 + 0.4 * pc), opacity: Math.min(out, pc), boxShadow: `0 34px 60px ${RH.shadow}` }}>
          <Img src={staticFile(cover)} style={{ width: 520, display: "block", borderRadius: 6 }} />
        </div>
      ) : null}
      <div style={{ position: "absolute", right: 210, top: 150, opacity: out, translate: `0 ${(1 - p) * 90}px`, rotate: "2deg" }}>
        <Card style={{ padding: "40px 46px 30px", width: 560, textAlign: "center", borderTop: `16px solid ${RH.yellow}` }}>
          <div style={{ background: "#fff", padding: 16, borderRadius: 12, border: `3px solid ${RH.grout}` }}>
            <Img src={staticFile(qr)} style={{ width: 440, height: 440, display: "block", margin: "0 auto", imageRendering: "pixelated" }} />
          </div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 56, color: RH.blueDeep, marginTop: 18, clipPath: `inset(0 ${100 - w * 100}% 0 0)`, whiteSpace: "nowrap" }}>{text}</div>
        </Card>
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: lin(f, 26, 36) * out }}>
        <path d="M 1150 900 C 1080 960, 980 950, 930 880" fill="none" stroke={RH.ink} strokeWidth={6} strokeLinecap="round" strokeDasharray={320} strokeDashoffset={320 * (1 - lin(f, 26, 44))} />
      </svg>
    </AbsoluteFill>
  );
};

type Side = { label: string; img?: string };
export const RhDoDont: React.FC<{ yes: Side; no: Side; bed?: string }> = ({ yes, no, bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut(6);
  const pa = pop(f, fps, 2), pb = pop(f, fps, 12);
  const Pol: React.FC<{ s: Side; ok: boolean; p: number; x: number; rot: number }> = ({ s, ok, p, x, rot }) => (
    <div style={{ position: "absolute", left: x, top: 150, rotate: `${rot + (1 - p) * (ok ? -12 : 12)}deg`, scale: String(0.7 + 0.3 * p), opacity: Math.min(out, p) }}>
      <div style={{ background: "#fff", padding: "22px 22px 90px", boxShadow: `0 30px 60px ${RH.shadow}`, width: 640 }}>
        <div style={{ width: 640, height: 400, background: RH.tile, overflow: "hidden" }}>{s.img ? <Img src={staticFile(s.img)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : null}</div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 18, textAlign: "center", fontFamily: LABEL, fontWeight: 600, fontSize: 46, color: RH.ink }}>{s.label}</div>
      </div>
      <div style={{ position: "absolute", right: -30, top: -34, width: 120, height: 120, borderRadius: "50%", background: ok ? RH.blue : RH.red, border: `7px solid #fff`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 12px 24px ${RH.shadow}` }}>
        <svg width={70} height={70}>{ok ? <path d="M10 38 L28 56 L62 14" fill="none" stroke="#fff" strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" /> : <path d="M14 14 L56 56 M56 14 L14 56" stroke="#fff" strokeWidth={11} strokeLinecap="round" />}</svg>
      </div>
    </div>
  );
  return (
    <AbsoluteFill>
      <Bed src={bed} seed={41} dim={0.22} />
      <Pol s={yes} ok p={pa} x={200} rot={-4} />
      <Pol s={no} ok={false} p={pb} x={1060} rot={3} />
    </AbsoluteFill>
  );
};

export const RhPins: React.FC<{ img: string; pins: { x: number; y: number; label: string }[] }> = ({ img, pins }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut(6);
  return (
    <AbsoluteFill>
      <Bed src={img} seed={51} dim={0} />
      {pins.map((pn, i) => {
        const at = 10 + i * 18, p = pop(f, fps, at, 11); if (f < at) return null;
        const left = pn.x * 1920, top = pn.y * 1080;
        return (
          <div key={i} style={{ position: "absolute", left, top, opacity: out }}>
            <div style={{ position: "absolute", left: -28, top: -28 - (1 - p) * 120, width: 56, height: 56, borderRadius: "50%", background: RH.yellow, border: `6px solid ${RH.ink}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 30, color: RH.ink, boxShadow: `0 10px 20px ${RH.shadow}` }}>{i + 1}</div>
            <div style={{ position: "absolute", left: 46, top: -30, opacity: lin(f, at + 6, at + 14), whiteSpace: "nowrap", background: RH.blueDeep, color: "#fff", fontFamily: LABEL, fontWeight: 600, fontSize: 42, padding: "4px 20px", borderRadius: 10, boxShadow: `0 10px 22px ${RH.shadow}` }}>{pn.label}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const CHIPS = [
  { c: "#1B1A16", name: "Black & slimy", what: "The living stuff", fix: "Brown bottle" },
  { c: "#E9A0AE", name: "Pink & slick", what: "Bacteria too", fix: "Brown bottle" },
  { c: "#B5652B", name: "Rusty orange", what: "Iron stain", fix: "Peroxide won't fix it" },
  { c: "#D8D3C6", name: "White-gray crust", what: "Minerals", fix: "Vinegar, another day" },
];
export const RhColorCode: React.FC<{ pick: number; items?: typeof CHIPS; bed?: string }> = ({ pick, items = CHIPS, bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 4);
  return (
    <AbsoluteFill>
      <Bed src={bed} seed={61 + pick} dim={0.22} />
      {items.map((it, i) => {
        const sel = i === pick, k = sel ? p : 0;
        const x = 210 + i * 230 + (sel ? 0 : 0), rot = (i - 1.5) * 4 + (sel ? -2 : 0);
        return (
          <div key={i} style={{ position: "absolute", left: x, top: 270 - k * 70, rotate: `${rot}deg`, zIndex: sel ? 5 : i, opacity: out * (sel ? 1 : 0.55), scale: String(1 + 0.12 * k) }}>
            <div style={{ width: 300, height: 470, background: "#fff", padding: 16, borderRadius: 10, boxShadow: `0 ${18 + k * 20}px ${40 + k * 20}px ${RH.shadow}` }}>
              <div style={{ width: 268, height: 300, borderRadius: 6, background: it.c, backgroundImage: i === 3 ? "radial-gradient(circle at 30% 40%, rgba(255,255,255,0.6) 2px, transparent 3px), radial-gradient(circle at 70% 60%, rgba(120,110,90,0.4) 3px, transparent 4px)" : i === 0 ? "radial-gradient(ellipse at 40% 30%, rgba(255,255,255,0.18), transparent 40%)" : undefined, backgroundSize: i === 3 ? "22px 22px, 31px 31px" : undefined }} />
              <div style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 32, color: RH.ink, marginTop: 14, lineHeight: 1.05 }}>{it.name}</div>
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", right: 150, top: 300, width: 600, opacity: out * lin(f, 12, 22), translate: `${(1 - lin(f, 12, 22)) * 60}px 0` }}>
        <Card style={{ padding: "40px 46px", borderLeft: `16px solid ${pick === 2 ? RH.red : RH.blue}` }}>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 52, color: RH.inkSoft }}>that's</div>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 74, color: RH.ink, lineHeight: 1.05 }}>{items[pick].what}</div>
          <div style={{ marginTop: 24, display: "inline-block", background: pick === 2 ? RH.red : RH.yellow, color: pick === 2 ? "#fff" : RH.ink, fontFamily: LABEL, fontWeight: 700, fontSize: 40, padding: "6px 22px", borderRadius: 10 }}>{items[pick].fix}</div>
        </Card>
      </div>
    </AbsoluteFill>
  );
};
