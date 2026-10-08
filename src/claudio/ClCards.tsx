// Tarjetas del kit Claudio — todas sobre una CAMA real del baño del hotel (los gráficos viven en el mundo, nunca sobre negro):
//   ClChapter     separador: cae el LLAVERO del hotel con el número de capítulo como habitación + título en la franja marino
//   ClCheck       "hoja de servicio" del hotel en una tablilla con clip; cada renglón se tilda y se resalta en amarillo guante
//   ClBookPage    la página REAL del libro (pág. N) cae sobre la mesada + el QR al costado + sello "GRATIS EN LA PÁGINA"
//   ClQRCard      tarjeta de habitación con el QR (decodificable) + "apunte la cámara acá" + la tapa del libro
//   ClDoDont      dos polaroids pegadas al espejo: SÍ (tilde marino) y NO (cruz roja)
//   ClPins        pines numerados que caen sobre una foto real (dónde mirar)
//   ClColorCode   muestrario de colores tipo pinturería: cuál es cuál y qué hacer
//   ClBeforeAfter cortina que barre de ANTES a DESPUÉS sobre dos fotos reales del mismo lugar, con su rótulo
//   ClSplit       pantalla partida de la misma foto: CLORO = sólo color (arriba blanco, abajo sigue) | AGUA OXIGENADA = raíz
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { CL, SERIF, LABEL, HAND, hexA } from "./ClTheme";
import { Bed, Card, KeyTag, RoomLight, Stamp, Tape, lin, pop, useOut } from "./ClParts";

export const ClChapter: React.FC<{ n?: number; title: string; sub?: string; bed?: string; alert?: boolean; label?: string }> = ({ n, title, sub, bed, alert, label = "CAPÍTULO" }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut(6);
  const band = lin(f, 4, 14), p = pop(f, fps, 0, 11), w = lin(f, 16, 32);
  const swing = Math.sin(f * 0.18) * 9 * Math.exp(-f / 25);
  return (
    <AbsoluteFill>
      <Bed src={bed} seed={(n || 1) * 7} dim={0.16} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 420, height: 270, background: hexA(alert ? CL.red : CL.navy, 0.93), clipPath: `inset(0 0 0 ${100 - band * 100}%)`, opacity: out, boxShadow: `0 20px 50px ${CL.shadow}` }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 10, background: alert ? "#8E1F17" : CL.nitrile }} />
      </div>
      {n != null ? (
        <div style={{ position: "absolute", left: 150, top: 120 + (1 - p) * -500, rotate: `${swing}deg`, transformOrigin: "50% 8%", opacity: out, filter: `drop-shadow(0 24px 30px ${CL.shadow})` }}>
          <KeyTag num={n} label={label} w={250} color={alert ? CL.red : CL.nitrile} />
        </div>
      ) : null}
      <div style={{ position: "absolute", left: n != null ? 480 : 150, top: 555, translate: "0 -50%", opacity: out }}>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 98, color: "#fff", lineHeight: 1.02, maxWidth: 1300, translate: `${(1 - band) * 80}px 0`, opacity: band }}>{title}</div>
        {sub ? <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 62, color: CL.yellowSoft, marginTop: 6, clipPath: `inset(0 ${100 - w * 100}% 0 0)`, whiteSpace: "nowrap" }}>{sub}</div> : null}
      </div>
      <RoomLight k={0.5} />
    </AbsoluteFill>
  );
};

export const ClCheck: React.FC<{ title: string; items: string[]; bed?: string; fast?: boolean }> = ({ title, items, bed, fast }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 2);
  const step = fast ? Math.max(8, (durationInFrames - 30) / items.length) : Math.max(14, Math.min(40, (durationInFrames - 30) / items.length));
  return (
    <AbsoluteFill>
      <Bed src={bed} seed={11} dim={0.18} />
      <div style={{ position: "absolute", right: 170, top: 70, width: 900, opacity: out, translate: `0 ${(1 - p) * 90}px`, rotate: "1.6deg", transform: "perspective(1600px) rotateY(-6deg)" }}>
        {/* tablilla de madera con clip de metal */}
        <div style={{ background: "linear-gradient(135deg, #A87B4F, #8A5F38)", borderRadius: 22, padding: "70px 26px 26px", boxShadow: `0 34px 70px ${CL.shadow}` }}>
          <div style={{ position: "absolute", left: "50%", top: -18, translate: "-50% 0", width: 260, height: 74, borderRadius: 14, background: "linear-gradient(#E6E6E2, #A9A9A4)", boxShadow: "0 6px 12px rgba(0,0,0,0.35)" }} />
          <Card style={{ padding: "34px 50px 30px", borderRadius: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: `4px solid ${CL.navy}`, paddingBottom: 10, marginBottom: 22 }}>
              <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 60, color: CL.ink }}>{title}</div>
              <div style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 26, color: CL.inkSoft, letterSpacing: 3 }}>ORDEN DE TRABAJO</div>
            </div>
            {items.map((it, i) => {
              const t0 = 16 + i * step, k = lin(f, t0, t0 + 8), hk = lin(f, t0 + 4, t0 + 16);
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 18, opacity: 0.3 + 0.7 * k }}>
                  <div style={{ width: 52, height: 52, flex: "0 0 52px", borderRadius: 8, border: `5px solid ${CL.navy}`, position: "relative", background: CL.white }}>
                    <svg width={70} height={60} style={{ position: "absolute", left: -2, top: -14 }}><path d="M8 32 L26 50 L64 6" fill="none" stroke={CL.nitrile} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={90} strokeDashoffset={90 * (1 - k)} /></svg>
                  </div>
                  <div style={{ position: "relative", fontFamily: LABEL, fontWeight: 500, fontSize: 46, color: CL.ink, lineHeight: 1.15 }}>
                    <span style={{ position: "absolute", left: -6, right: -6, bottom: 2, height: 22, background: hexA(CL.yellow, 0.6), transformOrigin: "left", scale: `${hk} 1` }} />
                    <span style={{ position: "relative" }}>{it}</span>
                  </div>
                </div>
              );
            })}
          </Card>
        </div>
      </div>
      <RoomLight k={0.5} />
    </AbsoluteFill>
  );
};

export const ClBookPage: React.FC<{ page: string; qr?: string; stamp?: string; pageNo?: number; bed?: string }> = ({ page, qr, stamp = "Gratis en la página", pageNo = 9, bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 2, 18), pq = pop(f, fps, 16);
  const y = interpolate(p, [0, 1], [-1000, 0]), r = interpolate(p, [0, 1], [-14, -3]);
  const push = lin(f, 20, 150, 1, 1.05);
  return (
    <AbsoluteFill>
      <Bed src={bed} seed={21} dim={0.22} />
      <div style={{ position: "absolute", left: qr ? "38%" : "50%", top: 40, translate: `-50% ${y}px`, rotate: `${r}deg`, scale: String(push), opacity: out, transformOrigin: "50% 30%" }}>
        <div style={{ background: "#fff", padding: 12, boxShadow: `0 44px 80px ${CL.shadow}, 0 6px 14px rgba(0,0,0,0.14)`, transform: "perspective(1800px) rotateX(8deg)" }}>
          <Img src={staticFile(page)} style={{ width: 760, display: "block" }} />
        </div>
        <Tape x={300} y={-18} rot={4} w={160} />
        <div style={{ position: "absolute", right: -40, bottom: 40, background: CL.navy, color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: 40, padding: "6px 22px", borderRadius: 10, rotate: "4deg", boxShadow: `0 10px 20px ${CL.shadow}` }}>PÁG. {pageNo}</div>
      </div>
      {qr ? (
        <div style={{ position: "absolute", right: 150, top: 230, opacity: Math.min(out, pq), translate: `${(1 - pq) * 120}px 0`, rotate: "3deg" }}>
          <Card style={{ padding: 26, borderTop: `14px solid ${CL.yellow}`, textAlign: "center" }}>
            <Img src={staticFile(qr)} style={{ width: 420, height: 420, display: "block", imageRendering: "pixelated" }} />
            <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 52, color: CL.navy, marginTop: 8 }}>apunte la cámara acá</div>
          </Card>
        </div>
      ) : null}
      <Stamp text={stamp} at={28} color={CL.red} x={qr ? "38%" : "70%"} y="83%" rot={-7} size={62} />
      <RoomLight k={0.4} />
    </AbsoluteFill>
  );
};

export const ClQRCard: React.FC<{ qr: string; cover?: string; text?: string; kicker?: string; bed?: string }> = ({ qr, cover, text = "apunte la cámara del celular acá", kicker = "ARREGLO COMPLETO · GRATIS", bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 2), pc = pop(f, fps, 10), w = lin(f, 18, 36);
  return (
    <AbsoluteFill>
      <Bed src={bed} seed={31} dim={0.26} />
      {cover ? (
        <div style={{ position: "absolute", left: 230, top: 150, rotate: `${-7 + (1 - pc) * -20}deg`, scale: String(0.6 + 0.4 * pc), opacity: Math.min(out, pc), boxShadow: `0 34px 60px ${CL.shadow}` }}>
          <Img src={staticFile(cover)} style={{ width: 560, display: "block", borderRadius: 6 }} />
        </div>
      ) : null}
      <div style={{ position: "absolute", right: 200, top: 140, opacity: out, translate: `0 ${(1 - p) * 90}px`, rotate: "2deg" }}>
        <Card style={{ padding: "40px 46px 30px", width: 580, textAlign: "center", borderTop: `16px solid ${CL.navy}` }}>
          <div style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 30, letterSpacing: 4, color: CL.brass, marginBottom: 14 }}>{kicker}</div>
          <div style={{ background: "#fff", padding: 16, borderRadius: 12, border: `3px solid ${CL.grout}` }}>
            <Img src={staticFile(qr)} style={{ width: 440, height: 440, display: "block", margin: "0 auto", imageRendering: "pixelated" }} />
          </div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 52, color: CL.navy, marginTop: 16, clipPath: `inset(0 ${100 - w * 100}% 0 0)`, whiteSpace: "nowrap" }}>{text}</div>
        </Card>
      </div>
      <RoomLight k={0.4} />
    </AbsoluteFill>
  );
};

type Side = { label: string; img?: string };
export const ClDoDont: React.FC<{ yes: Side; no: Side; bed?: string }> = ({ yes, no, bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut(6);
  const pa = pop(f, fps, 2), pb = pop(f, fps, 14);
  const Pol: React.FC<{ s: Side; ok: boolean; p: number; x: number; rot: number }> = ({ s, ok, p, x, rot }) => (
    <div style={{ position: "absolute", left: x, top: 150, rotate: `${rot + (1 - p) * (ok ? -12 : 12)}deg`, scale: String(0.7 + 0.3 * p), opacity: Math.min(out, p) }}>
      <div style={{ background: "#fff", padding: "22px 22px 92px", boxShadow: `0 30px 60px ${CL.shadow}`, width: 640 }}>
        <div style={{ width: 640, height: 400, background: CL.tile, overflow: "hidden" }}>{s.img ? <Img src={staticFile(s.img)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : null}</div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 20, textAlign: "center", fontFamily: LABEL, fontWeight: 600, fontSize: 48, color: CL.ink }}>{s.label}</div>
      </div>
      <Tape x={250} y={-16} rot={ok ? -5 : 6} w={150} />
      <div style={{ position: "absolute", right: -30, top: -34, width: 124, height: 124, borderRadius: "50%", background: ok ? CL.navy : CL.red, border: `7px solid #fff`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 12px 24px ${CL.shadow}` }}>
        <svg width={70} height={70}>{ok ? <path d="M10 38 L28 56 L62 14" fill="none" stroke="#fff" strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" /> : <path d="M14 14 L56 56 M56 14 L14 56" stroke="#fff" strokeWidth={11} strokeLinecap="round" />}</svg>
      </div>
    </div>
  );
  return (
    <AbsoluteFill>
      <Bed src={bed} seed={41} dim={0.2} />
      <Pol s={yes} ok p={pa} x={200} rot={-4} />
      <Pol s={no} ok={false} p={pb} x={1060} rot={3} />
      <RoomLight k={0.4} />
    </AbsoluteFill>
  );
};

export const ClPins: React.FC<{ img: string; pins: { x: number; y: number; label: string }[] }> = ({ img, pins }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut(6);
  return (
    <AbsoluteFill>
      <Bed src={img} seed={51} dim={0} warm={0.3} />
      {pins.map((pn, i) => {
        const at = 10 + i * 20, p = pop(f, fps, at, 11); if (f < at) return null;
        const left = pn.x * 1920, top = pn.y * 1080, right = pn.x > 0.62;
        return (
          <div key={i} style={{ position: "absolute", left, top, opacity: out }}>
            <div style={{ position: "absolute", left: -40, top: -6, width: 80, height: 20, borderRadius: "50%", background: "rgba(0,0,0,0.25)", scale: String(p), filter: "blur(3px)" }} />
            <div style={{ position: "absolute", left: -32, top: -32 - (1 - p) * 140, width: 64, height: 64, borderRadius: "50%", background: CL.yellow, border: `6px solid ${CL.ink}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 34, color: CL.ink, boxShadow: `0 10px 20px ${CL.shadow}` }}>{i + 1}</div>
            <div style={{ position: "absolute", left: right ? undefined : 50, right: right ? 50 : undefined, top: -32, opacity: lin(f, at + 6, at + 14), whiteSpace: "nowrap", background: CL.navy, color: "#fff", fontFamily: LABEL, fontWeight: 600, fontSize: 44, padding: "4px 22px", borderRadius: 10, boxShadow: `0 10px 22px ${CL.shadow}`, borderBottom: `4px solid ${CL.yellow}` }}>{pn.label}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const CHIPS = [
  { c: "#1B1A16", name: "Negro y baboso", what: "Lo vivo", fix: "Botella marrón" },
  { c: "#E9A0AE", name: "Rosado", what: "También bacteria", fix: "Botella marrón" },
  { c: "#B5652B", name: "Color óxido", what: "Hierro: mancha", fix: "No se arregla así" },
  { c: "#D8D3C6", name: "Costra blanca", what: "Mineral", fix: "Vinagre, otro día" },
];
export const ClColorCode: React.FC<{ pick: number; items?: typeof CHIPS; bed?: string }> = ({ pick, items = CHIPS, bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 4);
  return (
    <AbsoluteFill>
      <Bed src={bed} seed={61 + pick} dim={0.2} />
      {items.map((it, i) => {
        const sel = i === pick, k = sel ? p : 0;
        const x = 190 + i * 235, rot = (i - 1.5) * 4 + (sel ? -2 : 0);
        return (
          <div key={i} style={{ position: "absolute", left: x, top: 270 - k * 70, rotate: `${rot}deg`, zIndex: sel ? 5 : i, opacity: out * (sel ? 1 : 0.55), scale: String(1 + 0.12 * k) }}>
            <div style={{ width: 300, height: 480, background: "#fff", padding: 16, borderRadius: 10, boxShadow: `0 ${18 + k * 20}px ${40 + k * 20}px ${CL.shadow}` }}>
              <div style={{ width: 268, height: 300, borderRadius: 6, background: it.c, backgroundImage: i === 3 ? "radial-gradient(circle at 30% 40%, rgba(255,255,255,0.6) 2px, transparent 3px), radial-gradient(circle at 70% 60%, rgba(120,110,90,0.4) 3px, transparent 4px)" : i === 0 ? "radial-gradient(ellipse at 40% 30%, rgba(255,255,255,0.18), transparent 40%)" : undefined, backgroundSize: i === 3 ? "22px 22px, 31px 31px" : undefined }} />
              <div style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 34, color: CL.ink, marginTop: 14, lineHeight: 1.05 }}>{it.name}</div>
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", right: 140, top: 300, width: 600, opacity: out * lin(f, 12, 22), translate: `${(1 - lin(f, 12, 22)) * 60}px 0` }}>
        <Card style={{ padding: "40px 46px", borderLeft: `16px solid ${pick === 2 ? CL.red : CL.navy}` }}>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 54, color: CL.inkSoft }}>eso es</div>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 76, color: CL.ink, lineHeight: 1.05 }}>{items[pick].what}</div>
          <div style={{ marginTop: 24, display: "inline-block", background: pick === 2 ? CL.red : CL.yellow, color: pick === 2 ? "#fff" : CL.ink, fontFamily: LABEL, fontWeight: 700, fontSize: 42, padding: "6px 22px", borderRadius: 10 }}>{items[pick].fix}</div>
        </Card>
      </div>
      <RoomLight k={0.4} />
    </AbsoluteFill>
  );
};

// ANTES → DESPUÉS: la misma toma, una cortina con borde de luz barre de izquierda a derecha; rótulos en las esquinas
export const ClBeforeAfter: React.FC<{ before: string; after: string; a?: string; b?: string; note?: string }> = ({ before, after, a = "ANTES", b = "DESPUÉS", note }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(5);
  const x = interpolate(f, [T * 0.18, T * 0.62], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const z = lin(f, 0, T, 1.02, 1.08);
  const st: React.CSSProperties = { position: "absolute", width: "100%", height: "100%", objectFit: "cover", scale: String(z) };
  const pn = pop(f, fps, Math.round(T * 0.64), 10);
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out }}>
      <Img src={staticFile(before)} style={st} />
      <AbsoluteFill style={{ clipPath: `inset(0 ${100 - x}% 0 0)` }}><Img src={staticFile(after)} style={st} /></AbsoluteFill>
      {x > 0 && x < 100 ? <div style={{ position: "absolute", top: 0, bottom: 0, left: `${x}%`, width: 10, translate: "-50% 0", background: "linear-gradient(90deg, rgba(255,255,255,0), #fff, rgba(255,255,255,0))", boxShadow: "0 0 40px rgba(255,255,255,0.9)" }} /> : null}
      <div style={{ position: "absolute", left: 60, top: 60, background: CL.red, color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: 48, padding: "6px 24px", borderRadius: 10, opacity: 1 - lin(f, T * 0.5, T * 0.6) }}>{a}</div>
      <div style={{ position: "absolute", right: 60, top: 60, background: CL.navy, color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: 48, padding: "6px 24px", borderRadius: 10, opacity: lin(f, T * 0.45, T * 0.55), borderBottom: `5px solid ${CL.yellow}` }}>{b}</div>
      {note ? <div style={{ position: "absolute", left: "50%", bottom: 90, translate: "-50% 0", scale: String(pn), opacity: Math.min(1, pn * 1.4), background: CL.yellow, color: CL.ink, fontFamily: SERIF, fontWeight: 900, fontSize: 72, padding: "8px 40px", borderRadius: 14, whiteSpace: "nowrap", boxShadow: `0 18px 40px ${CL.shadow}` }}>{note}</div> : null}
    </AbsoluteFill>
  );
};

// pantalla partida sobre la MISMA foto real del borde: izquierda cloro (se aclara arriba, debajo siguen las raíces que laten),
// derecha agua oxigenada (espuma que levanta y se va). Rótulos cortos.
export const ClSplit: React.FC<{ img: string; left?: [string, string]; right?: [string, string] }> = ({ img, left = ["CLORO", "sólo le saca el color"], right = ["AGUA OXIGENADA", "lo saca de raíz"] }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const open = lin(f, 0, 10), bl = lin(f, 10, T * 0.5), fz = lin(f, T * 0.3, T * 0.85);
  const pl = pop(f, fps, 6), pr = pop(f, fps, Math.round(T * 0.3));
  const st: React.CSSProperties = { position: "absolute", width: 1920, height: 1080, objectFit: "cover", left: 0 };
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: out, backgroundColor: CL.white }}>
      {/* izquierda: cloro */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 960, height: 1080, overflow: "hidden" }}>
        <Img src={staticFile(img)} style={{ ...st, left: -480 * (1 - open) - 200, filter: `grayscale(${bl}) brightness(${1 + 0.55 * bl}) contrast(${1 - 0.35 * bl})` }} />
        {/* debajo, lo que sigue vivo: raíces que laten (corte en la parte de abajo) */}
        <svg width={960} height={1080} style={{ position: "absolute", inset: 0 }}>
          <rect x={0} y={760} width={960} height={320} fill={hexA("#2A2620", 0.78 * bl)} />
          {Array.from({ length: 12 }, (_, i) => { const x0 = 40 + i * 78, d = 120 + ((i * 53) % 130), w = 1 + 0.25 * Math.sin(f * 0.25 + i); return <path key={i} d={`M ${x0} 760 C ${x0 - 18} ${760 + d * 0.4}, ${x0 + 24} ${760 + d * 0.7}, ${x0 + 4} ${760 + d}`} stroke="#9DB86A" strokeWidth={10 * w} fill="none" strokeLinecap="round" opacity={bl} />; })}
          <line x1={0} y1={760} x2={960} y2={760} stroke="#fff" strokeWidth={4} strokeDasharray="14 10" opacity={bl} />
        </svg>
        <div style={{ position: "absolute", left: 60, top: 70, scale: String(pl), transformOrigin: "0 0" }}>
          <div style={{ background: "#fff", color: CL.ink, fontFamily: LABEL, fontWeight: 700, fontSize: 64, padding: "6px 26px", borderRadius: 10, display: "inline-block", boxShadow: `0 12px 26px ${CL.shadow}` }}>{left[0]}</div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 62, color: "#fff", textShadow: "0 3px 10px rgba(0,0,0,0.6)", marginTop: 8 }}>{left[1]}</div>
        </div>
        <div style={{ position: "absolute", left: 60, top: 790, fontFamily: LABEL, fontWeight: 600, fontSize: 42, color: "#E9F2D6", opacity: lin(f, T * 0.4, T * 0.5), letterSpacing: 2 }}>ABAJO SIGUE VIVO</div>
      </div>
      {/* derecha: agua oxigenada */}
      <div style={{ position: "absolute", left: 960, top: 0, width: 960, height: 1080, overflow: "hidden" }}>
        <Img src={staticFile(img)} style={{ ...st, left: -760 + 480 * (1 - open), filter: `brightness(${1 + 0.25 * fz}) saturate(${1 - 0.5 * fz})` }} />
        <svg width={960} height={1080} style={{ position: "absolute", inset: 0 }}>
          {Array.from({ length: 70 }, (_, i) => { const k = Math.max(0, fz * 1.6 - ((i * 37) % 100) / 160); const x = (i * 131) % 960, y0 = 400 + ((i * 71) % 600), y = y0 - k * 220, r = (8 + ((i * 17) % 18)) * Math.min(1, k * 2) * (1 - 0.7 * Math.max(0, fz - 0.8) * 5); return r > 0.5 ? <circle key={i} cx={x} cy={y} r={r} fill="rgba(255,255,255,0.92)" stroke="rgba(150,180,200,0.7)" strokeWidth={2} /> : null; })}
        </svg>
        <div style={{ position: "absolute", right: 60, top: 70, scale: String(pr), transformOrigin: "100% 0", textAlign: "right" }}>
          <div style={{ background: CL.navy, color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: 64, padding: "6px 26px", borderRadius: 10, display: "inline-block", borderBottom: `6px solid ${CL.yellow}`, boxShadow: `0 12px 26px ${CL.shadow}` }}>{right[0]}</div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 62, color: "#fff", textShadow: "0 3px 10px rgba(0,0,0,0.6)", marginTop: 8 }}>{right[1]}</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 957, top: 0, width: 6, height: 1080 * open, background: "#fff", boxShadow: "0 0 24px rgba(0,0,0,0.35)" }} />
    </AbsoluteFill>
  );
};
