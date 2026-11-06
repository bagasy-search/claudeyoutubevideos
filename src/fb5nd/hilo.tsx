// fb5nd · el HILO: EL CUARTO DEL FONDO a lo largo del relato — el mismo cuarto con su ventana, y el piso que va cambiando
// con la voz: contrapiso pelado con piedritas → limpio y humedecido → puente → fajas → carpeta mojada → mate → espolvoreado
// → llana de acero y reflejo → nylon y ladrillos 7 días → sellador. Sirve de RELLENO cuando no hay plano. + el CTA con QR.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, FONT, BODY, P, cl, e, spr, hash } from "./lib";
import { glass } from "./kit";
import { quad } from "./piso";
import { Cuarto, Piso } from "./cem";
import FXJ from "./fx.json";

const AT = Object.fromEntries((FXJ as unknown as { fx: { id: string; a: number; b: number }[] }).fx.map((f) => [f.id, f.a]));
const at = (k: string) => AT[k] ?? 1e9;

const estado = (t: number) => ({
  limpio: e(t, at("talco"), at("esponja")),
  moj: e(t, at("esponja") + 15, at("esponja") + 25) * (1 - e(t, at("puente"), at("puente") + 10)),
  puente: e(t, at("puente") + 20, at("puente") + 40),
  fajas: e(t, at("fajas"), at("mang") + 20),
  carp: e(t, at("regla"), at("fratas") + 10),
  mate: e(t, at("color"), at("color") + 15),
  polvo: e(t, at("colador"), at("colador") + 30) * (1 - e(t, at("acero"), at("acero") + 20)),
  brillo: e(t, at("acero"), at("reflejo") + 20),
  nylon: e(t, at("semana") + 9, at("semana") + 14) * (1 - e(t, at("sell") - 4, at("sell"))),
  sell: e(t, at("dosselladores"), at("dosselladores") + 30),
});

export const Hilo: React.FC<{ t: number; a: number; b: number; m: Record<string, number>; mode: string }> = ({ t, a }) => {
  const s = estado(t), u = t - a;
  const rug = 1 - s.carp;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(85% 70% at 50% 40%, #3a2c1d 0%, ${C.night} 74%)` }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible", transformOrigin: "50% 60%", transform: `translate(${20 * Math.sin(u * 0.15) + 10 * Math.sin(u * 0.08 + 2)}px,${10 * Math.sin(u * 0.12 + 1)}px) scale(${1.03 + 0.03 * Math.sin(u * 0.1 + 0.5)})` }}>
        <Cuarto luz={0.5 + 0.5 * s.brillo} />
        <Piso cx={960} y={440} w={1600} d={560} rug={rug} moj={Math.max(s.moj, s.carp * (1 - s.mate))} brillo={s.brillo * (1 - s.nylon) * (0.8 + 0.2 * s.sell)} t={t}>
          {(f) => <>
            {rug > 0.5 && Array.from({ length: 40 }, (_, i) => { const [x, y] = f(hash(i, 31), hash(i, 32)); return <circle key={i} cx={x} cy={y} r={3} fill="#e6dccb" opacity={(1 - s.limpio) * 0.8} />; })}
            {s.puente > 0.02 && rug > 0.5 && <polygon points={quad(f, 0, 0, s.puente, 1)} fill="#7f786c" opacity={0.7} />}
            {s.fajas > 0.02 && rug > 0.3 && [0.2, 0.4, 0.6, 0.8].map((uu, i) => <polygon key={i} points={quad(f, uu - 0.02, 0, uu + 0.02, cl(s.fajas * 4 - i))} fill="#9d958a" />)}
            {s.carp > 0.02 && s.carp < 0.99 && <polygon points={quad(f, 0, 0, s.carp, 1)} fill="#8a8378" />}
            {s.polvo > 0.02 && Array.from({ length: 120 }, (_, i) => { const [x, y] = f(hash(i, 41), hash(i, 42)); return hash(i, 43) < s.polvo && <circle key={i} cx={x} cy={y} r={2.4} fill="#e7e2d8" />; })}
            {s.nylon > 0.02 && <g opacity={s.nylon}><polygon points={quad(f, -0.02, -0.02, 1.02, 1.02)} fill="rgba(28,32,36,.78)" />
              {[0.08, 0.5, 0.92].map((uu) => [0.03, 0.97].map((vv) => { const [x, y] = f(uu, vv); return <rect key={uu + "" + vv} x={x - 40} y={y - 18} width={80} height={32} rx={4} fill="#b4552f" />; }))}</g>}
          </>}
        </Piso>
      </svg>
    </AbsoluteFill>
  );
};

// CTA: tarjeta con QR a la derecha; entra con resorte, el QR late
export const Cta: React.FC<{ t: number; a: number; b: number; m: Record<string, number> }> = ({ t, a, b, m }) => {
  const p = spr(t, a + 0.1, 0.8), out = e(t, b - 0.5, b), beat = 1 + 0.06 * Math.sin(cl((t - (m.qr ?? a + 1)) / 0.6) * Math.PI);
  const items = ["Las 4 pruebas del contrapiso", "Mezcla, fajas y puente", "La prueba de la pisada", "Curado, juntas y sellador"];
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", right: 70, top: 90, width: 640, height: 920, ...glass(1.2), background: "rgba(30,20,10,.88)", opacity: cl(p * 1.5) * (1 - out), transform: `translateX(${(1 - p) * 300}px)`, display: "flex", flexDirection: "column", alignItems: "center", padding: "36px 40px" }}>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, letterSpacing: 4, color: C.honey, textTransform: "uppercase" }}>la guía</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 64, color: C.ink, textTransform: "uppercase", lineHeight: 1 }}>El Constructor Libre</div>
        <div style={{ marginTop: 26, background: "white", borderRadius: 22, padding: 18, transform: `scale(${beat})` }}><Img src={staticFile(P + "qr.png")} style={{ width: 300, height: 300, display: "block" }} /></div>
        <div style={{ marginTop: 18, fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.ok, textTransform: "uppercase", textAlign: "center" }}>escaneá con la cámara</div>
        <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 34, color: C.cream }}>constructorlibre.com</div>
        <div style={{ marginTop: 22, alignSelf: "stretch" }}>{items.map((w, i) => <div key={w} style={{ fontFamily: BODY, fontWeight: 700, fontSize: 30, color: C.cream, opacity: e(t, a + 0.8 + i * 0.25, a + 1.1 + i * 0.25), padding: "4px 0" }}>✓ {w}</div>)}</div>
      </div>
    </AbsoluteFill>
  );
};
