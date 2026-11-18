// Piezas propias de La Pinza de Claudio (pin15a · la pinza pelacables). Todo CSS/DOM con material del oficio: acero de la
// mordaza, cobre pelado, mango rojo, cinta aisladora, riel DIN y térmicas. Sin SVG sobre las fotos.
// Registro: D:/rtmp/pin14_COMPONENTES.md (no repetir en pin15b/pin15c).
//  · MordazaUso   — contador "uso n de 12": la mordaza de acero con 12 agujeros numerados entra de costado; el agujero n se llena
//                   de cobre que brilla y debajo se pega una tira de cinta aisladora con el nombre del uso.
//  · CintaCTA     — suscripción: un rollo de cinta aisladora roja rueda por abajo y deja la cinta pegada con SUSCRIBITE.
//  · EtiquetaCable— pregunta de comentarios: un cable gris cruza y una etiqueta de marcar cables se enrolla con la pregunta.
//  · TableroRecap — repaso: riel DIN con 12 térmicas; cada una sube a ON en su palabra y se enciende su rótulo.
//  · TresCobres   — la prueba de los tres agujeros (16 · 14 · 12): tres puntas de cable: mordida, justa y con plástico.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { SERIF, LABEL, HAND } from "./ClTheme";

const K = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const PZ = {
  copper: "#C8743A", copperHi: "#F2B279", copperDeep: "#7A3E17",
  red: "#C9302C", redDeep: "#7E1513", tape: "#16171A", tapeHi: "#3A3C42",
  cream: "#F5EFE4", ink: "#15181D", yellow: "#F2C230", green: "#2F8A4C",
};
const steel = "linear-gradient(180deg, #F2F4F6 0%, #C5CAD0 20%, #8E959D 52%, #D5D9DE 74%, #7F868E 100%)";
const steelV = "linear-gradient(90deg, #7F868E 0%, #D5D9DE 16%, #F1F3F5 36%, #A9AFB6 62%, #E0E3E6 84%, #7F868E 100%)";
const copperG = `radial-gradient(circle at 35% 30%, ${PZ.copperHi} 0%, ${PZ.copper} 45%, ${PZ.copperDeep} 100%)`;
const sp = (f: number, d = 14, m = 1) => spring({ frame: f, fps: 30, config: { damping: d, mass: m } });
// salida: baja y sale (nunca fundido encima de la cara)
const outY = (f: number, dur: number, n = 12) => interpolate(f, [dur - n, dur], [0, 520], { ...K, easing: Easing.in(Easing.cubic) });

const AWG = [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32];

// 1) MORDAZA "USO n DE 12": abajo a la izquierda, sobre el material (nunca encima del avatar).
export const MordazaUso: React.FC<{ n: number; title: string; dur: number }> = ({ n, title, dur }) => {
  const f = useCurrentFrame();
  const inX = interpolate(sp(f, 15, 1.1), [0, 1], [-1100, 0]);
  const fill = sp(f - 12, 12);
  const tape = interpolate(f, [20, 34], [0, 1], { ...K, easing: Easing.out(Easing.cubic) });
  const glow = 0.55 + 0.45 * Math.sin(f / 6);
  const y = outY(f, dur);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 70, bottom: 92, transform: `translate(${inX}px, ${y}px)` }}>
        {/* mordaza de acero */}
        <div style={{ position: "relative", width: 900, height: 132, borderRadius: "18px 70px 70px 18px", background: steel,
          boxShadow: "0 22px 40px rgba(0,0,0,0.45), inset 0 2px 0 rgba(255,255,255,0.8), inset 0 -3px 0 rgba(0,0,0,0.25)" }}>
          {/* mango rojo que asoma */}
          <div style={{ position: "absolute", left: -150, top: 30, width: 170, height: 72, borderRadius: 36,
            background: `linear-gradient(180deg, #E8564F 0%, ${PZ.red} 45%, ${PZ.redDeep} 100%)`, boxShadow: "inset 0 3px 0 rgba(255,255,255,0.35)" }} />
          {AWG.map((g, i) => {
            const on = i === n - 1;
            const r = 30 - i * 1.3;
            return (
              <div key={i} style={{ position: "absolute", left: 60 + i * 68, top: 22 }}>
                <div style={{ width: r * 2, height: r, marginLeft: (60 - r * 2) / 2, marginTop: 18, borderRadius: `0 0 ${r}px ${r}px`,
                  background: on ? copperG : "linear-gradient(180deg,#2B2F35,#4A5058)", transform: on ? `scale(${0.6 + 0.4 * fill})` : undefined,
                  boxShadow: on ? `0 0 ${24 * glow}px ${PZ.copperHi}, inset 0 2px 4px rgba(0,0,0,0.4)` : "inset 0 3px 6px rgba(0,0,0,0.7)" }} />
                <div style={{ width: 60, textAlign: "center", marginTop: 10, fontFamily: LABEL, fontWeight: 600, fontSize: 26,
                  color: on ? PZ.copperDeep : "#3F454C", textShadow: "0 1px 0 rgba(255,255,255,0.7)" }}>{g}</div>
              </div>
            );
          })}
        </div>
        {/* cinta aisladora con el uso */}
        <div style={{ marginTop: 18, marginLeft: 24, display: "inline-flex", alignItems: "center", gap: 22, padding: "14px 34px 16px",
          background: `linear-gradient(180deg, ${PZ.tapeHi} 0%, ${PZ.tape} 30%, ${PZ.tape} 80%, #2A2C31 100%)`,
          clipPath: `inset(0 ${100 - tape * 100}% 0 0)`, transform: "rotate(-1.2deg)", boxShadow: "0 10px 22px rgba(0,0,0,0.4)" }}>
          <span style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 40, color: PZ.yellow, letterSpacing: 2 }}>USO {n}/12</span>
          <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 50, color: PZ.cream }}>{title}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 2) CINTA CTA: el rollo rojo rueda de izquierda a derecha y deja la cinta con SUSCRIBITE.
export const CintaCTA: React.FC<{ text?: string; dur: number }> = ({ text = "SUSCRIBITE", dur }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [2, 26], [0, 1], { ...K, easing: Easing.out(Easing.cubic) });
  const x = 120 + p * 1500;
  const y = outY(f, dur);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 110, height: 150, transform: `translateY(${y}px)` }}>
        <div style={{ position: "absolute", left: 120, top: 30, height: 96, width: p * 1500, overflow: "hidden", transform: "rotate(-1.5deg)",
          background: `linear-gradient(180deg, #E5534D 0%, ${PZ.red} 35%, #A82320 85%, ${PZ.redDeep} 100%)`, boxShadow: "0 14px 26px rgba(0,0,0,0.4)" }}>
          <div style={{ position: "absolute", left: 60, top: 6, fontFamily: LABEL, fontWeight: 700, fontSize: 76, color: "#FFF8EE", letterSpacing: 10, whiteSpace: "nowrap" }}>
            {text}
          </div>
        </div>
        {/* el rollo */}
        <div style={{ position: "absolute", left: x - 80, top: 0, width: 160, height: 160, borderRadius: "50%", transform: `rotate(${p * 900}deg)`,
          background: `radial-gradient(circle, #EDE6DA 0 30%, #B9AE9E 31% 36%, ${PZ.red} 37% 86%, ${PZ.redDeep} 87% 100%)`,
          boxShadow: "0 16px 30px rgba(0,0,0,0.45)", opacity: p < 0.98 ? 1 : interpolate(f, [26, 32], [1, 0], K) }} />
      </div>
    </AbsoluteFill>
  );
};

// 3) ETIQUETA DE CABLE: un cable gris cruza arriba; una banderita blanca de marcar cables se enrolla y muestra la pregunta.
export const EtiquetaCable: React.FC<{ text: string; dur: number }> = ({ text, dur }) => {
  const f = useCurrentFrame();
  const cab = interpolate(f, [0, 14], [-2000, 0], { ...K, easing: Easing.out(Easing.cubic) });
  const flag = sp(f - 12, 11);
  const swing = Math.sin(f / 9) * 2 * (1 - Math.min(1, f / 90));
  const y = outY(f, dur);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 80, transform: `translateY(${y}px)` }}>
        <div style={{ position: "absolute", left: cab, bottom: 300, width: 2200, height: 34, borderRadius: 17,
          background: "linear-gradient(180deg,#D3D6DA 0%,#9DA3AA 55%,#6E747B 100%)", boxShadow: "0 10px 20px rgba(0,0,0,0.35)" }}>
          <div style={{ position: "absolute", right: -26, top: 6, width: 60, height: 22, borderRadius: 4, background: copperG }} />
        </div>
        <div style={{ position: "absolute", left: 220, bottom: 40, transformOrigin: "50% 0%", transform: `rotate(${swing}deg) scaleY(${flag})` }}>
          <div style={{ width: 70, height: 60, marginLeft: 40, background: "linear-gradient(90deg,#E9E4D8,#FFFFFF,#D9D3C6)", borderRadius: 10 }} />
          <div style={{ width: 1180, minHeight: 190, padding: "26px 44px", background: "#FFFDF7", borderRadius: 10,
            boxShadow: "0 18px 36px rgba(0,0,0,0.4)", borderLeft: `18px solid ${PZ.yellow}` }}>
            <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 70, lineHeight: 1.1, color: PZ.ink }}>{text}</div>
            <div style={{ marginTop: 8, fontFamily: LABEL, fontSize: 30, color: "#6B6F76", letterSpacing: 3 }}>↓ CONTAME EN LOS COMENTARIOS</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 4) TABLERO RECAP: fondo foto desenfocada levemente, riel DIN con 12 térmicas que suben a ON en su marca.
export const TableroRecap: React.FC<{ items: string[]; marks: number[]; bg: string; dur: number }> = ({ items, marks, bg, dur }) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, dur], [1.04, 1.14]);
  const inn = sp(f, 16);
  const cur = marks.reduce((a, m, i) => (f >= m ? i : a), -1);
  return (
    <AbsoluteFill style={{ background: "#202328", overflow: "hidden" }}>
      <Img src={staticFile(bg)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z})`, filter: "brightness(0.45)" }} />
      <div style={{ position: "absolute", left: 110, right: 110, top: 120, bottom: 120, borderRadius: 26, transform: `translateY(${(1 - inn) * 900}px)`,
        background: "linear-gradient(180deg,#F4F2EE,#DCD8D0)", boxShadow: "0 40px 80px rgba(0,0,0,0.55), inset 0 0 0 10px #CFCAC0" }}>
        {[0, 1].map((row) => (
          <div key={row} style={{ position: "absolute", left: 50, right: 50, top: 60 + row * 400, height: 360 }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 120, height: 60, background: steelV, borderRadius: 6 }} />
            {items.slice(row * 6, row * 6 + 6).map((t, j) => {
              const i = row * 6 + j;
              const on = f >= marks[i];
              const k = on ? sp(f - marks[i], 9) : 0;
              const hi = i === cur;
              return (
                <div key={i} style={{ position: "absolute", left: j * 280, top: 0, width: 250 }}>
                  <div style={{ width: 120, height: 220, margin: "0 auto", borderRadius: 12, background: "linear-gradient(90deg,#E9E9E6,#FFFFFF,#D6D6D2)",
                    boxShadow: hi ? `0 0 0 6px ${PZ.yellow}, 0 14px 24px rgba(0,0,0,0.3)` : "0 10px 20px rgba(0,0,0,0.25)", position: "relative" }}>
                    <div style={{ position: "absolute", left: 30, top: 24, fontFamily: LABEL, fontWeight: 700, fontSize: 34, color: PZ.ink, width: 60, textAlign: "center" }}>{i + 1}</div>
                    <div style={{ position: "absolute", left: 35, top: 80 + (1 - k) * 60, width: 50, height: 70, borderRadius: 8,
                      background: on ? `linear-gradient(180deg,#3FB765,${PZ.green})` : "linear-gradient(180deg,#5B6068,#2E3237)", boxShadow: "inset 0 2px 0 rgba(255,255,255,0.4)" }} />
                  </div>
                  <div style={{ marginTop: 14, textAlign: "center", fontFamily: SERIF, fontWeight: 700, fontSize: 30, lineHeight: 1.12,
                    color: on ? PZ.ink : "rgba(21,24,29,0.25)", transform: `translateY(${(1 - (on ? sp(f - marks[i], 12) : 0)) * 20}px)` }}>{t}</div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// 5) TRES COBRES: tres puntas de cable lado a lado (16 mordido · 14 justo · 12 con plástico), aparecen en sus marcas.
export const TresCobres: React.FC<{ marks: number[]; dur: number }> = ({ marks, dur }) => {
  const f = useCurrentFrame();
  const y = outY(f, dur);
  const L = [
    { g: "16", t: "muerde el cobre", c: PZ.red, nick: true, plast: false },
    { g: "14", t: "el justo", c: PZ.green, nick: false, plast: false },
    { g: "12", t: "deja plástico", c: "#C98A1B", nick: false, plast: true },
  ];
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", right: 70, top: 120, width: 620, transform: `translateY(${y}px)` }}>
        {L.map((o, i) => {
          const k = sp(f - marks[i], 12);
          return (
            <div key={i} style={{ position: "relative", height: 210, marginBottom: 24, transform: `translateX(${(1 - k) * 800}px)`,
              background: "rgba(245,239,228,0.96)", borderRadius: 16, boxShadow: "0 16px 30px rgba(0,0,0,0.4)", borderLeft: `14px solid ${o.c}` }}>
              <div style={{ position: "absolute", left: 30, top: 18, fontFamily: LABEL, fontWeight: 700, fontSize: 44, color: o.c }}>AGUJERO {o.g}</div>
              <div style={{ position: "absolute", left: 30, top: 74, fontFamily: SERIF, fontWeight: 700, fontSize: 36, color: PZ.ink }}>{o.t}</div>
              {/* el cable */}
              <div style={{ position: "absolute", left: 30, top: 136, width: 300, height: 44, borderRadius: "22px 0 0 22px", background: "linear-gradient(180deg,#5A86C9,#2B4F8A)" }} />
              {o.plast && <div style={{ position: "absolute", left: 326, top: 136, width: 40, height: 44, background: "linear-gradient(180deg,#5A86C9,#2B4F8A)", opacity: 0.85, clipPath: "polygon(0 0,100% 18%,80% 50%,100% 82%,0 100%)" }} />}
              <div style={{ position: "absolute", left: o.plast ? 362 : 330, top: 146, width: o.plast ? 190 : 220, height: 24, borderRadius: "0 12px 12px 0", background: `linear-gradient(180deg, ${PZ.copperHi}, ${PZ.copper} 55%, ${PZ.copperDeep})` }}>
                {o.nick && <div style={{ position: "absolute", left: 4, top: -2, width: 16, height: 14, background: "rgba(30,20,10,0.85)", clipPath: "polygon(0 0,100% 0,50% 100%)" }} />}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
