// HzWorthNothing — la foto del objeto "que todos creen que vale" montada como foto de inventario (borde blanco,
// cinta) sobre papel manila; el precio real tipeado al pie y el sello rojo cae encima. Props: bed (fondo), img (la foto
// del objeto), title, price, note, stamp.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { HZ, LABEL, SERIF, TYPE, manilaBg } from "./HzTheme";
import { HzBed, Stamp, ease, useIn } from "./HzParts";

export const HzWorthNothing: React.FC<{ bed?: string; img?: string; title: string; price: string; note?: string; stamp?: string; stampAt?: number; seed?: number }> = ({ bed, img, title, price, note = "", stamp = "not worth it", stampAt = 30, seed = 51 }) => {
  const f = useCurrentFrame();
  const inn = useIn(0, 13, 110);
  const r = interpolate(inn, [0, 1], [-14, -3]);
  return (
    <AbsoluteFill>
      {bed ? <HzBed src={bed} seed={seed} dim={0.3} blur={3} /> : <AbsoluteFill style={manilaBg(HZ.manila2)} />}
      <div style={{ position: "absolute", left: 230, top: 110, transform: `rotate(${r}deg) scale(${interpolate(inn, [0, 1], [0.8, 1])})`, background: HZ.white, padding: 26, paddingBottom: 120, boxShadow: `0 30px 60px ${HZ.shadow}` }}>
        <div style={{ width: 900, height: 506, overflow: "hidden", background: "#ccc" }}>{img ? <Img src={staticFile(img)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : null}</div>
        <div style={{ position: "absolute", left: 40, bottom: 26, fontFamily: TYPE, fontSize: 46, color: HZ.ink }}>{title}</div>
        <div style={{ position: "absolute", left: -40, top: -26, width: 200, height: 56, background: "rgba(233,212,160,0.85)", transform: "rotate(-30deg)" }} />
      </div>
      <div style={{ position: "absolute", right: 120, top: 220, width: 560, textAlign: "left", opacity: interpolate(f, [12, 22], [0, 1], ease) }}>
        <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 34, letterSpacing: 6, color: HZ.goldSoft, textTransform: "uppercase", textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}>sold listings</div>
        <div style={{ fontFamily: SERIF, fontSize: 120, color: HZ.white, lineHeight: 1, textShadow: "0 4px 14px rgba(0,0,0,0.6)" }}>{price}</div>
        {note ? <div style={{ fontFamily: TYPE, fontSize: 36, color: HZ.white, textShadow: "0 2px 8px rgba(0,0,0,0.7)", marginTop: 10 }}>{note}</div> : null}
      </div>
      <div style={{ position: "absolute", left: 440, top: 380 }}><Stamp text={stamp} at={stampAt} size={110} rot={-11} /></div>
    </AbsoluteFill>
  );
};
