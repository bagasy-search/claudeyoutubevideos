// suprecio · cuenta PerKilo legible en celular.
// mode "side": Claudio a la izquierda; panel derecho ~55 % (x 840→1920), tarjetas lado a lado, números 120 px.
// mode "full": sin Claudio; pantalla completa sobre la foto del producto con velo 35 %.
// Tiempos absolutos (segundos del video). El componente calcula su estado con el tiempo absoluto.
import React from "react";
import { AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame } from "remotion";
import { fr } from "../ckeggs/Base";

export type Item = { img: string; name: string; price: number; grams: number; tagText?: string; blur?: boolean };
export type CuentaProps = { mode: "side" | "full"; liquid?: boolean; from: number; dur: number; left: Item; right: Item; tA: number; tB: number; tCalc: number; tWin: number };

const fmt = (n: number) => "$ " + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const IMG = (n: string) => staticFile(n.includes("/") ? n : `img/suprecio/${n}.png`);
const RED = "#D7262B", GREEN = "#2E9E4F";

const Card: React.FC<{ it: Item; x: number; w: number; top: number; abs: number; tag: number; tCalc: number; tWin: number; win: boolean; lose: boolean; big: number; liquid?: boolean }> =
  ({ it, x, w, top, abs, tag, tCalc, tWin, win, lose, big, liquid }) => {
  const U = liquid ? "ml" : "g", UN = liquid ? "el litro" : "el kilo";
  const perK = Math.round((it.price / it.grams) * 1000);
  const on = (t: number, d = 0.4) => Math.max(0, Math.min(1, (abs - t) / d));
  const ready = abs >= tWin;
  const dim = ready && lose ? 0.45 : 1;
  const imgW = w - 36, imgH = Math.round(imgW * 0.62);
  return (
    <div style={{ position: "absolute", left: x, top, width: w, opacity: on(tag) * dim, fontFamily: "Arial, Helvetica, sans-serif" }}>
      <div style={{ background: "#FFFDF8", padding: 18, borderRadius: 10, boxShadow: "0 12px 30px rgba(0,0,0,0.5)" }}>
        <div style={{ position: "relative", width: imgW, height: imgH, overflow: "hidden", background: "#bbb" }}>
          <Img src={IMG(it.img)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: it.blur ? "blur(3px)" : undefined }} />
          <div style={{ position: "absolute", right: 14, top: 14, background: "#FFD43B", color: RED, fontWeight: 900, fontSize: 46, padding: "6px 16px", borderRadius: 6 }}>{it.tagText ?? fmt(it.price)}</div>
          {ready && win ? <div style={{ position: "absolute", left: 14, top: 14, width: 96, height: 96, borderRadius: "50%", background: GREEN, color: "#fff", fontWeight: 900, fontSize: 64, display: "flex", alignItems: "center", justifyContent: "center" }}>✓</div> : null}
        </div>
        <div style={{ marginTop: 10, fontWeight: 900, fontSize: 40, color: "#1B1B1B", textTransform: "uppercase" }}>{it.name}</div>
      </div>
      {abs >= tCalc - 4 ? (
        <div style={{ marginTop: 18, textAlign: "center", color: "#fff", textShadow: "0 4px 14px rgba(0,0,0,0.7)" }}>
          <div style={{ fontSize: 40, fontWeight: 700, opacity: 0.95 }}>{fmt(it.price)} ÷ {it.grams} {U} × 1000</div>
          <div style={{ fontSize: big, fontWeight: 900, lineHeight: 1.05, color: ready && win ? "#9BF0B4" : "#fff" }}>{fmt(perK)}</div>
          <div style={{ fontSize: 46, fontWeight: 800 }}>{UN}</div>
          {ready && win ? <div style={{ marginTop: 6, fontSize: 52, fontWeight: 900, color: "#9BF0B4" }}>CONVIENE</div> : null}
        </div>
      ) : null}
    </div>
  );
};

const Body: React.FC<{ p: CuentaProps }> = ({ p }) => {
  const f = useCurrentFrame();
  const abs = p.from + f / 30;
  const pl = p.left.price / p.left.grams, pr = p.right.price / p.right.grams;
  const lw = pl < pr, rw = pr < pl;
  if (p.mode === "side") {
    // panel derecho: x 840→1920 (55 %); dos tarjetas de 500 px con 40 px entre ellas
    return (
      <AbsoluteFill style={{ background: "transparent" }}>
        <div style={{ position: "absolute", left: 840, top: 0, width: 1080, height: 1080, background: "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%)" }} />
        <Card it={p.left} x={860} w={480} top={250} abs={abs} tag={p.tA} tCalc={p.tCalc} tWin={p.tWin} win={lw} lose={rw} big={102} liquid={p.liquid} />
        <Card it={p.right} x={1400} w={480} top={250} abs={abs} tag={p.tB} tCalc={p.tCalc + 0.35} tWin={p.tWin} win={rw} lose={lw} big={102} liquid={p.liquid} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill><Img src={IMG(p.left.img)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
      <AbsoluteFill style={{ background: "rgba(0,0,0,0.35)" }} />
      <Card it={p.left} x={230} w={680} top={200} abs={abs} tag={p.tA} tCalc={p.tCalc} tWin={p.tWin} win={lw} lose={rw} big={150} liquid={p.liquid} />
      <Card it={p.right} x={1010} w={680} top={200} abs={abs} tag={p.tB} tCalc={p.tCalc + 0.35} tWin={p.tWin} win={rw} lose={lw} big={150} liquid={p.liquid} />
    </AbsoluteFill>
  );
};

export const Cuenta: React.FC<CuentaProps> = (p) => (
  <Sequence from={fr(p.from)} durationInFrames={fr(p.dur)}>
    <Body p={{ ...p }} />
  </Sequence>
);
