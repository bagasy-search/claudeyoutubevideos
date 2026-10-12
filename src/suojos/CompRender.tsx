// Render de componentes para suojos (kit privado KitBig = repkit con ticket 44 px).
// Todos los componentes van dentro de Sequence con from=0 (tiempo local). Héroes propios: Maquina, Mirar.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate } from "remotion";
import { ShelfTag, Ticket, ShelfHeights, ClockDeal, Clipboard, CountCard, BeforeAfter, Cta, Stamp, PerKilo, Scanner, Lupa, OfferPoster, CommentQ } from "./KitBig";

const CTA_TITLE = "El Manual del Repositor";
const CTA_COVER = "img/cta_combo.png";

// "La máquina": plano blanco grueso sobre foto real con tinte azul; rótulos grandes en cada paso.
export const Maquina: React.FC<{ bg: string; dur: number; dot: boolean }> = ({ bg, dur, dot }) => {
  const f = useCurrentFrame();
  const S = (s: number) => s * 30;
  const draw = (t0: number, t1: number) => interpolate(f, [S(t0), S(t1)], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const show = (t0: number) => interpolate(f, [S(t0), S(t0) + 9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lines = [
    "M260 960 L260 160 L1660 160 L1660 960 Z", "M260 360 L1660 360", "M260 560 L1660 560", "M260 760 L1660 760",
    "M740 160 L740 960", "M1100 160 L1100 960", "M1420 160 L1420 960",
  ];
  const labels = [
    { x: 300, y: 130, txt: "ENTRADA", t: 0.6 }, { x: 760, y: 130, txt: "FRUTA", t: 3.0 },
    { x: 300, y: 340, txt: "PAN", t: 5.4 }, { x: 1120, y: 340, txt: "LECHE AL FONDO", t: 7.8 },
    { x: 1440, y: 740, txt: "CAJAS", t: 10.2 },
  ];
  const pulse = 1 + 0.12 * Math.sin(f / 6);
  const k = dot ? interpolate(f, [0, S(dur)], [0, 1], { extrapolateRight: "clamp" }) : 0;
  const dx = 300 + k * (1140 - 300), dy = 930 + k * (560 - 930);
  return (
    <AbsoluteFill style={{ background: "#06223f" }}>
      <Img src={staticFile(bg)} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.55, filter: "contrast(1.25) brightness(0.8) saturate(0.6)" }} />
      <AbsoluteFill style={{ background: "rgba(8,40,80,0.55)" }} />
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        {lines.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="#ffffff" strokeWidth={14} strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray={3000} strokeDashoffset={draw(i * 0.7, i * 0.7 + 1.4) * 3000} />
        ))}
        {labels.map((l, i) => (
          <text key={i} x={l.x} y={l.y} fill="#ffffff" fontSize={60} fontWeight={800} fontFamily="Arial, sans-serif" opacity={show(l.t)}>{l.txt}</text>
        ))}
        {dot ? <circle cx={dx} cy={dy} r={28 * pulse} fill="#ff3b30" stroke="#ffffff" strokeWidth={6} /> : null}
      </svg>
    </AbsoluteFill>
  );
};

// "La mirada": mapa de calor sobre la góndola real, a la altura de los ojos; etiqueta "así lo pensamos".
export const Mirar: React.FC<{ bg: string; dur: number }> = ({ bg, dur }) => {
  const f = useCurrentFrame();
  const a = interpolate(f, [0, 30, dur * 30 - 30, dur * 30], [0, 1, 1, 0.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Img src={staticFile(bg)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <AbsoluteFill style={{ opacity: a, background: "radial-gradient(ellipse 360px 220px at 50% 42%, rgba(255,80,0,0.85), rgba(255,200,0,0.45) 45%, rgba(0,0,0,0) 75%)", mixBlendMode: "screen" }} />
      <div style={{ position: "absolute", left: 80, bottom: 90, background: "#FFFDF4", color: "#111", fontSize: 52, fontWeight: 800, padding: "14px 30px", borderRadius: 10, opacity: a, fontFamily: "Arial, sans-serif" }}>
        ASÍ LO PENSAMOS · NO ES UN ESTUDIO
      </div>
    </AbsoluteFill>
  );
};

const StampPlate: React.FC<{ bg: string; label: string }> = ({ bg, label }) => (
  <AbsoluteFill>
    <Img src={staticFile(bg)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    <AbsoluteFill style={{ background: "rgba(0,0,0,0.45)" }} />
    <div style={{ position: "absolute", left: "50%", top: "55%", transform: "translate(-50%,-50%) rotate(-3deg)",
      background: "#FFF8E8", color: "#111", fontFamily: "Arial, sans-serif", fontWeight: 900, fontSize: 88, lineHeight: 1.1,
      padding: "22px 40px", borderRadius: 14, boxShadow: "0 10px 30px rgba(0,0,0,0.5)", textAlign: "center", maxWidth: 1500 }}>
      {label}
    </div>
  </AbsoluteFill>
);

export const CompView: React.FC<{ name: string; dur: number; p: any }> = ({ name, dur, p }) => {
  switch (name) {
    case "MAQUINA": return <Maquina bg={p.bg} dur={dur} dot={!!p.dot} />;
    case "MIRAR": return <Mirar bg={p.bg} dur={dur} />;
    case "CLIPBOARD": return <Clipboard from={0} dur={dur} bg={p.bg} title={p.title ?? "Planograma"}
      lines={p.lines ?? [{ txt: "Pasillo 4 · milímetros", t: 1.5 }, { txt: "Leche: al fondo", t: 3.5 }, { txt: "Aceite: a la altura de los ojos", t: 5.5 }]} />;
    case "BEFORE": return <BeforeAfter from={0} dur={dur} a={p.a} b={p.b} tWipe={3.5} labels={p.labels ?? ["ANTES", "DESPUÉS"]} />;
    case "COUNT": return <CountCard from={0} dur={dur} n={p.n} of={p.of} bg={p.bg} title={p.title} t={1.5} />;
    case "SHELFTAG": return <ShelfTag from={0} dur={dur} bg={p.bg} at={[960, 600]} product={p.product ?? "Arroz blanco"} price={p.price ?? 1240}
      unitLine={p.unitLine ?? "$ 2.480 el kg"} tPrint={1} tLupa={4} tCircle={7} ejemplo />;
    case "CLOCK": return <ClockDeal from={0} dur={dur} bg={p.bg} hourFrom={p.hf ?? 6} hourTo={p.ht ?? 7} tSpin={1} label={p.label ?? "HORA"} />;
    case "TICKET": return <Ticket from={0} dur={dur} bg={p.bg} head="TICKET"
      lines={[{ txt: "Pan francés", amt: "$ 450", t: 1 }, { txt: "Galletas", amt: "$ 890", t: 2.5 }, { txt: "Total", amt: "$ 1.340", t: 4 }]}
      hl={{ idx: 0, t: 5, note: "¿lo viste?" }} />;
    case "CTA": return (
      <AbsoluteFill>
        <Cta from={0} dur={dur} t={1} title={CTA_TITLE} cover={CTA_COVER} bg={p.bg} />
        <div style={{ position: "absolute", right: 120, bottom: 110, width: 300, height: 300, background: "#FFF8E8", borderRadius: 12, padding: 10, boxSizing: "border-box", boxShadow: "0 8px 24px rgba(0,0,0,0.35)", textAlign: "center" }}>
          <Img src={staticFile("img/qr_repositor.png")} style={{ width: 250, height: 250, display: "block", margin: "0 auto" }} />
          <div style={{ fontSize: 24, color: "#222", fontFamily: "Arial, sans-serif", marginTop: 4 }}>Escanea con tu celular</div>
        </div>
      </AbsoluteFill>
    );
    case "STAMP": return <StampPlate bg={p.bg} label={p.label} />;
    case "HEIGHTS": return <ShelfHeights from={0} dur={dur} bg={p.bg} bands={[
      { label: "OJOS", y0: 20, y1: 40, chip: "LO CARO", t: 1 }, { label: "MANOS", y0: 40, y1: 60, chip: "LO DE SIEMPRE", t: 3 },
      { label: "PIES", y0: 60, y1: 80, chip: "LO BARATO", t: 5 }, { label: "ARRIBA", y0: 80, y1: 100, chip: "LO RARO", t: 7 }]} />;
    case "PERKILO": return <PerKilo from={0} dur={dur} bg={p.bg}
      left={{ img: p.left.img, name: p.left.name, price: p.left.price, grams: p.left.grams }}
      right={{ img: p.right.img, name: p.right.name, price: p.right.price, grams: p.right.grams }}
      tA={1} tB={2} tCalc={3.5} tWin={7} />;
    case "SCANNER": return <Scanner from={0} dur={dur} img={p.img} price={p.price} tBeep={3.5} display={{ price: p.price - 100, t: 5 }} />;
    case "LUPA": return <Lupa from={0} dur={dur} bg={p.bg} zoom={2.4}
      path={[{ x: 700, y: 500, t: 0.5 }, { x: 900, y: 420, t: 3 }]}
      label={{ box: [600, 380, 470, 230], keyIdx: 0, lines: [{ txt: p.label ?? "Contenido neto 450 g", size: 44, bold: true }] }} />;
    case "OFFER": return <OfferPoster from={0} dur={dur} bg={p.bg} big={p.big ?? "2x1"} small={p.small ?? "OFERTA"} tIn={1} tPeel={4}
      under={[{ txt: " ", t: 6 }, { txt: "$ 1.240 por 500 g", t: 6 }, { txt: "= $ 2.480 el kilo", t: 8, hl: true }]} />;
    case "COMMENT": return <CommentQ from={0} dur={dur} q={p.q} t={1} bg={p.bg} />;
    default: return null;
  }
};
