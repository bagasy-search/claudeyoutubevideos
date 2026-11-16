// Piezas propias de Claudio el Conserje (cons15a). Todo CSS/DOM, sin SVG sobre las fotos.
// Identidad: llavero de habitación de latón, cartel de "no molestar" de puerta, tarjeta de comentarios del huésped,
// hoja de servicio de lavandería. Registro: D:/rtmp/cons14_COMPONENTES.md
// v2 (EVALUADOR v1, nota 5,4): llave dentada de verdad + contador mecánico + salida en persiana; cartel colgado de un
// picaporte real; tarjeta del huésped chica en el tercio inferior con lápiz de verdad; hoja con miniaturas y sellos en orden.
import React from "react";
import { AbsoluteFill, Img, Easing, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { CL, SERIF, LABEL, HAND } from "./ClTheme";

const K = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const brass = `linear-gradient(135deg, ${CL.brassLight} 0%, ${CL.brass} 45%, #8E6A30 70%, ${CL.brassLight} 100%)`;
const out = (f: number, dur: number, n = 12) => interpolate(f, [dur - n, dur], [1, 0], K);

// 1) LLAVERO DE PASO: llave de habitación (argolla + llave dentada + placa de latón) que cae y oscila como péndulo
// amortiguado que nunca se queda quieto; un destello recorre el latón y el número gira como contador mecánico del paso
// anterior al actual. 9 puntos de latón marcan el avance. Salida: la tarjeta entera sube como persiana (sin fundido
// sobre la cara del presentador).
export const StepKey: React.FC<{ n: number; total: number; title: string; src: string; dur: number }> = ({ n, total, title, src, dur }) => {
  const f = useCurrentFrame();
  const up = interpolate(f, [dur - 11, dur], [0, -1120], { ...K, easing: Easing.in(Easing.cubic) });
  const tOut = interpolate(f, [dur - 16, dur - 9], [1, 0], K);
  const drop = spring({ frame: f - 3, fps: 30, config: { damping: 9, mass: 0.9, stiffness: 120 } });
  const swing = Math.sin((f - 3) / 6) * (2.2 + 13 * Math.exp(-Math.max(0, f - 3) / 24));
  const tIn = spring({ frame: f - 14, fps: 30, config: { damping: 18 } });
  const roll = interpolate(f, [12, 26], [0, 1], { ...K, easing: Easing.out(Easing.back(1.6)) });
  const glint = interpolate(f, [30, 52], [-60, 160], K);
  const z = interpolate(f, [0, dur], [1.04, 1.14]);
  const px = interpolate(f, [0, dur], [0, -30]);
  const NUM = 190;
  return (
    <AbsoluteFill style={{ background: CL.navyDeep, transform: `translateY(${up}px)`, boxShadow: "0 30px 60px rgba(0,0,0,0.6)" }}>
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `translateX(${px}px) scale(${z})`, transformOrigin: "70% 50%" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(13,20,38,0.94) 0%, rgba(13,20,38,0.82) 40%, rgba(13,20,38,0.35) 62%, rgba(13,20,38,0) 78%)" }} />
      <div style={{ position: "absolute", left: 120, top: -40, width: 340, height: 700, transformOrigin: "170px 50px",
        transform: `translateY(${(drop - 1) * 560}px) rotate(${swing}deg)` }}>
        <div style={{ position: "absolute", left: 128, top: 14, width: 84, height: 84, borderRadius: 42, border: `10px solid ${CL.brassLight}`, boxShadow: "0 6px 14px rgba(0,0,0,0.45), inset 0 2px 3px rgba(0,0,0,0.4)" }} />
        {/* llave: cabeza redonda + caña + dientes, colgando detrás de la placa, asomando a la derecha */}
        <div style={{ position: "absolute", left: 196, top: 70, width: 40, height: 330, transformOrigin: "20px 10px", transform: `rotate(${-24 + swing * 0.6}deg)` }}>
          <div style={{ position: "absolute", left: -14, top: 0, width: 68, height: 68, borderRadius: 34, background: brass, boxShadow: "0 8px 16px rgba(0,0,0,0.45), inset 0 2px 0 rgba(255,255,255,0.5)" }}>
            <div style={{ position: "absolute", left: 22, top: 22, width: 24, height: 24, borderRadius: 12, background: CL.navyDeep, boxShadow: "inset 0 2px 4px rgba(0,0,0,0.7)" }} />
          </div>
          <div style={{ position: "absolute", left: 10, top: 62, width: 20, height: 250, borderRadius: 4, background: brass, boxShadow: "0 8px 14px rgba(0,0,0,0.4)" }} />
          {[0, 1, 2, 3].map((k) => <div key={k} style={{ position: "absolute", left: 28, top: 230 + k * 20, width: [22, 14, 26, 16][k], height: 14, background: brass, borderRadius: 2, boxShadow: "0 3px 6px rgba(0,0,0,0.35)" }} />)}
        </div>
        <div style={{ position: "absolute", left: 40, top: 100, width: 250, height: 460, borderRadius: "125px 125px 36px 36px", background: brass, overflow: "hidden",
          boxShadow: "0 30px 56px rgba(0,0,0,0.55), inset 0 3px 0 rgba(255,255,255,0.45), inset 0 -8px 14px rgba(0,0,0,0.28)",
          display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 44 }}>
          <div style={{ width: 36, height: 36, borderRadius: 18, background: CL.navyDeep, boxShadow: "inset 0 3px 6px rgba(0,0,0,0.6)" }} />
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 40, letterSpacing: 8, color: "#3E2C10", marginTop: 26, textShadow: "0 1px 0 rgba(255,255,255,0.4)" }}>PASO</div>
          <div style={{ height: NUM, overflow: "hidden", marginTop: 2 }}>
            <div style={{ transform: `translateY(${-roll * NUM}px)` }}>
              {[n - 1, n].map((v, k) => <div key={k} style={{ height: NUM, fontFamily: SERIF, fontWeight: 900, fontSize: 200, lineHeight: `${NUM}px`, textAlign: "center", color: "#3E2C10", textShadow: "0 2px 0 rgba(255,255,255,0.35), 0 -1px 0 rgba(0,0,0,0.3)" }}>{v > 0 ? v : ""}</div>)}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            {Array.from({ length: total }).map((_, k) => <div key={k} style={{ width: 14, height: 14, borderRadius: 7, background: k < n ? "#3E2C10" : "rgba(62,44,16,0.22)", boxShadow: k === n - 1 ? "0 0 0 3px rgba(255,255,255,0.55)" : "none" }} />)}
          </div>
          <div style={{ position: "absolute", top: -80, left: `${glint}%`, width: 70, height: 700, transform: "rotate(22deg)", background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,250,225,0.75) 50%, rgba(255,255,255,0) 100%)" }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 520, top: 360, maxWidth: 820, opacity: tIn * tOut, transform: `translateX(${(1 - tIn) * -40}px)` }}>
        <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 46, letterSpacing: 8, color: CL.yellow, textShadow: "0 3px 10px rgba(0,0,0,0.6)" }}>PASO {n}</div>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: title.length > 24 ? 96 : 112, lineHeight: 1.02, color: CL.white, textShadow: "0 4px 22px rgba(0,0,0,0.85), 0 2px 4px rgba(0,0,0,0.6)", marginTop: 10, textWrap: "balance" as any }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

// 2) CARTEL DE PUERTA: entra el canto de una puerta de madera, el cartel cuelga de su picaporte de latón (el agujero lo
// rodea), oscila desde ahí, se da vuelta de "NO MOLESTAR" a "SUSCRÍBASE" y al presionarlo pasa a "SUSCRITO ✓".
// Salida: el cartel se levanta del picaporte.
export const DoorHanger: React.FC<{ text: string; dur: number }> = ({ text, dur }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [dur - 10, dur], [1, 0], K);
  const lift = interpolate(f, [dur - 14, dur], [0, -1100], { ...K, easing: Easing.in(Easing.cubic) });
  const door = spring({ frame: f, fps: 30, config: { damping: 20 } });
  const inn = spring({ frame: f - 6, fps: 30, config: { damping: 11, mass: 0.9 } });
  const flip = interpolate(f, [30, 48], [0, 180], { ...K, easing: Easing.inOut(Easing.cubic) });
  const on = f >= 92;
  const press = interpolate(f, [86, 92, 100], [1, 0.92, 1], K);
  const sw = Math.sin(f / 8) * (1.2 + 6 * Math.exp(-f / 30));
  const band = spring({ frame: f - 54, fps: 30, config: { damping: 16 } });
  const dx = (1 - door) * 780;
  const HX = 1350, HY = 96, W = 420; // agujero del cartel: centro a (210, 105) del cartel
  const hole = "radial-gradient(circle 72px at 210px 105px, transparent 97%, #000 100%)";
  const face = (child: React.ReactNode, bg: string, rot: number) => (
    <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: `rotateY(${rot}deg)`, background: bg, borderRadius: 30,
      display: "flex", flexDirection: "column", alignItems: "center", WebkitMaskImage: hole, maskImage: hole }}>
      {child}
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <AbsoluteFill style={{ background: "linear-gradient(270deg, rgba(19,29,53,0.75) 0%, rgba(19,29,53,0) 55%)" }} />
      <div style={{ position: "absolute", left: 1180 + dx, top: 0, width: 760, height: 1080,
        background: "repeating-linear-gradient(90deg, rgba(0,0,0,0.06) 0 3px, transparent 3px 22px), linear-gradient(90deg, #5A3B22 0%, #7A5232 6%, #8C6040 30%, #7A5232 70%, #6A472A 100%)",
        boxShadow: "-24px 0 40px rgba(0,0,0,0.45)" }}>
        <div style={{ position: "absolute", left: HX - 1180 + W / 2 - 40, top: HY + 105 - 70, width: 80, height: 140, borderRadius: 40, background: "linear-gradient(180deg,#C9A060,#8E6A30)", boxShadow: "0 6px 12px rgba(0,0,0,0.4)" }} />
      </div>
      <div style={{ position: "absolute", left: HX + dx, top: HY, width: W, height: 760, perspective: 1600, filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.45))",
        transform: `translateY(${(1 - inn) * -700 + lift}px) rotate(${sw}deg) scale(${press})`, transformOrigin: "210px 105px" }}>
        <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `rotateY(${flip}deg)` }}>
          {face(<>
            <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 66, letterSpacing: 4, color: CL.white, marginTop: 250, textAlign: "center", lineHeight: 1.05 }}>NO<br />MOLESTAR</div>
            <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 48, color: CL.yellowSoft, marginTop: 40 }}>habitación 412</div>
          </>, CL.red, 0)}
          {face(<>
            <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: on ? 72 : 58, letterSpacing: on ? 3 : 1, color: on ? CL.navy : CL.white, marginTop: 250, textAlign: "center", lineHeight: 1.05, whiteSpace: "nowrap" }}>{on ? <>SUSCRITO<br />✓</> : "SUSCRÍBASE"}</div>
            <div style={{ fontFamily: SERIF, fontWeight: 600, fontStyle: "italic", fontSize: 42, color: on ? CL.navy : CL.navySoft, marginTop: 40, textAlign: "center", padding: "0 30px", lineHeight: 1.15 }}>un arreglo de la casa cada semana</div>
          </>, on ? CL.yellow : CL.navy, 180)}
        </div>
        {on && <div style={{ position: "absolute", left: 120, top: 15, width: 180, height: 180, borderRadius: 90, border: `8px solid ${CL.yellow}`,
          transform: `scale(${1 + (f - 92) / 30})`, opacity: Math.max(0, 1 - (f - 92) / 24) }} />}
      </div>
      {/* pomo del picaporte (encima del cartel: el agujero lo rodea) */}
      <div style={{ position: "absolute", left: HX + dx + W / 2 - 50, top: HY + 105 - 50, width: 100, height: 100, borderRadius: 50,
        background: "radial-gradient(circle at 35% 30%, #F6E2B0 0%, #D9B26A 35%, #9A7436 75%, #6E5226 100%)", boxShadow: "0 14px 24px rgba(0,0,0,0.5), inset 0 -4px 8px rgba(0,0,0,0.3)" }} />
      <div style={{ position: "absolute", left: 120, bottom: 110, maxWidth: 1000, opacity: band, transform: `translateY(${(1 - band) * 30}px)` }}>
        <div style={{ background: CL.white, borderLeft: `14px solid ${CL.yellow}`, borderRadius: 14, padding: "22px 36px", fontFamily: SERIF, fontWeight: 700,
          fontSize: text.length > 48 ? 54 : 62, lineHeight: 1.12, color: CL.ink, boxShadow: `0 18px 40px ${CL.shadow}` }}>{text}</div>
      </div>
    </AbsoluteFill>
  );
};

// 3) TARJETA DEL HUÉSPED: tarjeta en el tercio inferior (no tapa la cara) que cae girando sobre una pila de tarjetas de
// otros huéspedes; la pregunta se escribe a mano con el lápiz del hotel (goma, virola, cuerpo hexagonal, punta).
export const GuestCard: React.FC<{ text: string; dur: number }> = ({ text, dur }) => {
  const f = useCurrentFrame(); const o = out(f, dur, 12);
  const inn = spring({ frame: f - 4, fps: 30, config: { damping: 18, mass: 1.3 } });
  const T0 = 30, T1 = T0 + Math.round(text.length * 1.5);
  const shown = Math.floor(interpolate(f, [T0, T1], [0, text.length], K));
  const p = shown / Math.max(1, text.length);
  const L = 300, T = 610, Wd = 1320, H = 400;
  const fs = text.length > 34 ? 60 : 72;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(19,29,53,0.6) 0%, rgba(19,29,53,0) 50%)" }} />
      {[2, 1].map((k) => (
        <div key={k} style={{ position: "absolute", left: L + k * 18, top: T + k * 12, width: Wd, height: H, background: "#EFE8DA", borderRadius: 8, boxShadow: "0 18px 30px rgba(0,0,0,0.35)",
          transform: `translateY(${(1 - spring({ frame: f - k * 3, fps: 30, config: { damping: 20 } })) * 500}px) rotate(${k * 2.2 - 1}deg)` }} />
      ))}
      <div style={{ position: "absolute", left: L, top: T, width: Wd, height: H, background: CL.white, borderRadius: 8,
        boxShadow: "0 30px 60px rgba(0,0,0,0.5)", transform: `translateY(${(1 - inn) * 600}px) rotate(${(1 - inn) * 9 - 0.8}deg)`, transformOrigin: "20% 100%",
        backgroundImage: `repeating-linear-gradient(0deg, transparent 0 86px, ${CL.grout} 86px 88px)`, backgroundPosition: "0 130px", padding: "28px 60px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `4px double ${CL.brass}`, paddingBottom: 12, background: CL.white }}>
          <div style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 36, letterSpacing: 8, color: CL.navy }}>COMENTARIOS DEL HUÉSPED</div>
          <div style={{ fontFamily: SERIF, fontWeight: 700, fontStyle: "italic", fontSize: 34, color: CL.brass }}>habitación 412</div>
        </div>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: fs, lineHeight: "88px", color: CL.navy, marginTop: 22 }}>
          {text.slice(0, shown)}
          <span style={{ display: "inline-block", position: "relative", width: 0, height: 0, opacity: p < 1 ? 1 : 0 }}>
            <span style={{ position: "absolute", left: 0, top: -150, width: 26, height: 190, transformOrigin: "13px 190px", transform: `rotate(${28 + Math.sin(f / 2.2) * 3}deg)` }}>
              <span style={{ position: "absolute", left: 0, top: 0, width: 26, height: 22, background: "#E8909A", borderRadius: "6px 6px 0 0" }} />
              <span style={{ position: "absolute", left: 0, top: 22, width: 26, height: 16, background: "linear-gradient(90deg,#9A9A9A,#E6E6E6,#9A9A9A)" }} />
              <span style={{ position: "absolute", left: 0, top: 38, width: 26, height: 118, background: "linear-gradient(90deg,#D9A21E 0%,#F6CD45 40%,#E2AE26 70%,#B98915 100%)" }} />
              <span style={{ position: "absolute", left: 0, top: 156, width: 0, height: 0, borderLeft: "13px solid transparent", borderRight: "13px solid transparent", borderTop: "30px solid #E9C9A0" }} />
              <span style={{ position: "absolute", left: 9, top: 178, width: 0, height: 0, borderLeft: "4px solid transparent", borderRight: "4px solid transparent", borderTop: "12px solid #333" }} />
            </span>
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 4) HOJA DE SERVICIO: tablilla grande que entra deslizándose y girando desde la derecha; cada renglón lleva la
// miniatura de su paso y el sello de goma BAJA (sombra que se achica) y deja tinta EN ORDEN, en su propia columna.
export const ServiceSheet: React.FC<{ items: string[]; marks: number[]; srcs?: string[]; dur: number }> = ({ items, marks, srcs, dur }) => {
  const f = useCurrentFrame(); const o = out(f, dur, 14);
  const inn = spring({ frame: f - 2, fps: 30, config: { damping: 20, mass: 1.2 } });
  const ms: number[] = [];
  [...marks].sort((a, b) => a - b).forEach((m, i) => ms.push(i ? Math.max(m, ms[i - 1] + 8) : Math.max(m, 14)));
  return (
    <AbsoluteFill style={{ opacity: o, background: CL.tile, backgroundImage: `linear-gradient(${CL.grout} 2px, transparent 2px), linear-gradient(90deg, ${CL.grout} 2px, transparent 2px)`, backgroundSize: "160px 160px" }}>
      <div style={{ position: "absolute", left: 230, top: 30, width: 1460, height: 1030, background: "#8B6A45", borderRadius: 26, boxShadow: `0 40px 70px ${CL.shadow}`,
        transform: `translateX(${(1 - inn) * 1500}px) rotate(${(1 - inn) * 8}deg)` }}>
        <div style={{ position: "absolute", left: 610, top: -14, width: 240, height: 70, borderRadius: 14, background: brass, boxShadow: "0 6px 12px rgba(0,0,0,0.4)" }} />
        <div style={{ position: "absolute", left: 40, top: 70, right: 40, bottom: 30, background: CL.white, padding: "16px 44px" }}>
          <div style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 38, letterSpacing: 6, color: CL.navy, borderBottom: `3px solid ${CL.navy}`, paddingBottom: 8 }}>HOJA DE SERVICIO · LAVADORA</div>
          {items.map((t, i) => {
            const m = ms[i];
            const st = interpolate(f, [m - 6, m], [0, 1], { ...K, easing: Easing.in(Easing.quad) });
            const lit = f >= m;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", height: 92, borderBottom: `2px solid ${CL.grout}`, position: "relative" }}>
                <div style={{ width: 64, fontFamily: SERIF, fontWeight: 900, fontSize: 50, color: lit ? CL.brass : CL.grout }}>{i + 1}</div>
                {srcs?.[i] ? <Img src={staticFile(srcs[i])} style={{ width: 128, height: 72, objectFit: "cover", borderRadius: 6, marginRight: 26, opacity: lit ? 1 : 0.35, filter: lit ? "none" : "grayscale(1)" }} /> : null}
                <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 50, color: lit ? CL.ink : CL.inkSoft, opacity: lit ? 1 : 0.5, whiteSpace: "nowrap" }}>{t}</div>
                {f >= m - 6 && <div style={{ position: "absolute", right: 6, fontFamily: LABEL, fontWeight: 700, fontSize: 34, letterSpacing: 3, color: CL.nitrile,
                  border: `5px solid ${CL.nitrile}`, borderRadius: 8, padding: "2px 16px", transform: `rotate(-8deg) scale(${interpolate(st, [0, 1], [1.9, 1])})`,
                  opacity: lit ? 0.92 : st * 0.5, boxShadow: `0 ${(1 - st) * 30}px ${(1 - st) * 30}px rgba(0,0,0,${0.25 * (1 - st)})` }}>HECHO</div>}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
