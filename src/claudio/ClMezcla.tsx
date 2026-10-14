// Kit del video 7 (clmezcla): set-pieces DENTRO del mundo del hotel (cama real, perspectiva, sombra, luz de techo), ≤12 palabras.
//   ClStoreLabel  la tabla "NUNCA JUNTOS" impresa como etiqueta del depósito de limpieza, pegada con cinta en la puerta de madera de un
//                 mueble que se abre en perspectiva; las filas entran de a una y `hi` marca la que se nombra (0-4)
//   ClMixLight    semáforo de mezclas atornillado a la pared de azulejo: rojo = nunca · verde = sí, en el momento
//   ClProtocol    cartel de emergencia del hotel (placa esmaltada) con un reloj de pared que corre: 1 SALGA · 2 ABRA DESDE AFUERA · 3 LLAME
//   ClLabelLens   lupa que barre la etiqueta de ATRÁS de un bidón real y prende las palabras que importan (cloro, hipoclorito, amoníaco)
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CL, LABEL, SERIF, HAND, hexA, rnd } from "./ClTheme";
import { Bed, Contact, RoomLight, Stamp, Tape, lin, pop, useOut } from "./ClParts";

const ROWS: [string, string][] = [["Cloro", "vinagre"], ["Cloro", "amoníaco"], ["Cloro", "oxigenada"], ["Oxigenada", "vinagre"], ["Cloro", "alcohol"]];
const wood = (base = "#9B6B3F"): React.CSSProperties => ({
  backgroundColor: base,
  backgroundImage: `repeating-linear-gradient(92deg, rgba(60,30,10,0.18) 0px, rgba(60,30,10,0) 7px, rgba(255,230,190,0.07) 13px, rgba(60,30,10,0.12) 21px), linear-gradient(180deg, rgba(255,240,210,0.18), rgba(0,0,0,0.18))`,
});

export const ClStoreLabel: React.FC<{ hi?: number; rows?: number; bed?: string; title?: string }> = ({ hi = -1, rows = 5, bed, title = "Nunca juntos" }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const open = interpolate(f, [0, 22], [-62, -24], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const drift = interpolate(f, [0, T], [0, -6]);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed src={bed} seed={71} dim={0.18} />
      {/* interior oscuro del mueble, con los estantes */}
      <div style={{ position: "absolute", left: 560, top: 70, width: 1160, height: 960, background: "linear-gradient(180deg, #3B2C1F, #22180F)", boxShadow: "inset 0 0 80px rgba(0,0,0,0.6)", opacity: out }}>
        {[300, 620].map((y) => <div key={y} style={{ position: "absolute", left: 0, right: 0, top: y, height: 22, ...wood("#B58654"), boxShadow: "0 10px 18px rgba(0,0,0,0.5)" }} />)}
      </div>
      {/* puerta abierta en perspectiva, bisagra a la izquierda */}
      <div style={{ position: "absolute", left: 560, top: 70, width: 900, height: 960, transformOrigin: "0% 50%", transform: `perspective(1800px) rotateY(${open + drift}deg)`, ...wood(), borderRadius: 6, boxShadow: `30px 30px 60px ${CL.shadow}, inset 0 0 0 10px rgba(80,45,15,0.35)`, opacity: out }}>
        {/* la etiqueta impresa */}
        <div style={{ position: "absolute", left: 120, top: 110, width: 660, background: "#FFFDF6", padding: "34px 40px 28px", boxShadow: "0 12px 24px rgba(0,0,0,0.3)", rotate: "-1.2deg", borderTop: `16px solid ${CL.red}` }}>
          <Tape x={250} y={-40} rot={3} w={160} />
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 30, letterSpacing: 6, color: CL.inkSoft }}>DEPÓSITO DE LIMPIEZA</div>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 78, color: CL.red, lineHeight: 1.05, margin: "6px 0 14px" }}>{title}</div>
          {ROWS.slice(0, rows).map((r, i) => {
            const k = lin(f, 12 + i * 9, 22 + i * 9), on = hi === i;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, padding: "11px 12px", borderTop: `3px dashed ${CL.grout}`, opacity: k * (hi >= 0 && !on ? 0.45 : 1), translate: `${(1 - k) * 40}px 0`, background: on ? hexA(CL.yellow, 0.45) : "transparent", borderRadius: 6 }}>
                <svg width={46} height={46}><path d="M9 9 L37 37 M37 9 L9 37" stroke={CL.red} strokeWidth={8} strokeLinecap="round" /></svg>
                <div style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 48, color: CL.ink }}>{r[0]} + {r[1]}</div>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", right: 46, top: 440, width: 26, height: 120, borderRadius: 13, background: `linear-gradient(90deg, ${CL.brassLight}, ${CL.brass})`, boxShadow: "0 6px 10px rgba(0,0,0,0.4)" }} />
      </div>
      <RoomLight k={0.8} />
    </AbsoluteFill>
  );
};

export const ClMixLight: React.FC<{ state?: "red" | "green"; text?: string; sub?: string; bed?: string }> = ({ state = "red", text = "Cloro + ácido", sub = "nunca", bed }) => {
  const f = useCurrentFrame(); const { fps, width, height } = useVideoConfig(); const out = useOut(8);
  const p = pop(f, fps, 0, 16), on = lin(f, 14, 20);
  const flick = state === "red" ? 0.85 + 0.15 * Math.sin(f * 0.9) : 1;
  const lamp = (c: string, lit: boolean) => (
    <div style={{ width: 170, height: 170, borderRadius: "50%", margin: "18px auto", background: lit ? `radial-gradient(circle at 40% 35%, #fff, ${c} 45%, ${hexA(c, 0.9)} 70%)` : `radial-gradient(circle at 40% 35%, #4b4b4b, #1c1c1c 70%)`, boxShadow: lit ? `0 0 ${60 * on * flick}px ${hexA(c, 0.9)}, inset 0 -8px 16px rgba(0,0,0,0.3)` : "inset 0 6px 14px rgba(0,0,0,0.7)", opacity: lit ? 0.25 + 0.75 * on * flick : 1 }} />
  );
  const col = state === "red" ? "#E5432F" : "#3DBE5A";
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed src={bed} seed={83} dim={0.2} />
      <div style={{ position: "absolute", left: width * 0.32 - 130, top: 60, width: 260, padding: "14px 0", borderRadius: 40, background: "linear-gradient(90deg, #2A2F3A, #3A4150 50%, #232731)", boxShadow: `24px 30px 50px ${CL.shadow}, inset 0 2px 0 rgba(255,255,255,0.15)`, translate: `0 ${(1 - p) * -500}px`, opacity: out }}>
        {lamp("#E5432F", state === "red")}
        {lamp("#F2C230", false)}
        {lamp("#3DBE5A", state === "green")}
      </div>
      <div style={{ position: "absolute", left: width * 0.47, top: 330, opacity: on * out, translate: `${(1 - on) * 60}px 0` }}>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 104, color: CL.ink, lineHeight: 1, textShadow: "0 3px 0 rgba(255,255,255,0.8)", maxWidth: 900 }}>{text}</div>
        <div style={{ display: "inline-block", marginTop: 26, background: col, color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: 64, letterSpacing: 3, padding: "8px 34px", borderRadius: 12, boxShadow: `0 14px 28px ${CL.shadow}` }}>{sub.toUpperCase()}</div>
      </div>
      <RoomLight k={0.7} />
    </AbsoluteFill>
  );
};

export const ClProtocol: React.FC<{ step?: number; bed?: string }> = ({ step = 3, bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(8);
  const p = pop(f, fps, 0, 15);
  const sec = interpolate(f, [0, T], [0, T / fps * 6]); // el segundero corre (6° por segundo)
  const steps = ["Salga", "Abra desde afuera", "Llame"];
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed src={bed} seed={97} dim={0.2} />
      {/* reloj de pared del pasillo del hotel */}
      <div style={{ position: "absolute", left: 210, top: 250, width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle at 45% 40%, #FFFFFF, #ECE8E0 70%)", border: "18px solid #2B2F38", boxShadow: `22px 28px 50px ${CL.shadow}, inset 0 4px 12px rgba(0,0,0,0.2)`, opacity: out, scale: String(0.85 + 0.15 * p) }}>
        {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: "absolute", left: "50%", top: "50%", width: 8, height: 30, background: CL.ink, transformOrigin: "50% 0", transform: `rotate(${i * 30}deg) translate(-50%, -175px)` }} />)}
        <div style={{ position: "absolute", left: "50%", top: "50%", width: 12, height: 120, background: CL.ink, borderRadius: 6, transformOrigin: "50% 100%", transform: `translate(-50%, -100%) rotate(${300 + sec / 60}deg)` }} />
        <div style={{ position: "absolute", left: "50%", top: "50%", width: 4, height: 160, background: CL.red, transformOrigin: "50% 100%", transform: `translate(-50%, -100%) rotate(${sec}deg)` }} />
        <div style={{ position: "absolute", left: "50%", top: "50%", width: 24, height: 24, borderRadius: "50%", background: CL.red, translate: "-50% -50%" }} />
      </div>
      {/* placa esmaltada de emergencia */}
      <div style={{ position: "absolute", left: 760, top: 170, width: 960, padding: "40px 54px 34px", borderRadius: 18, background: "linear-gradient(160deg, #FFFFFF, #F1EEE7)", border: `10px solid ${CL.red}`, boxShadow: `26px 32px 60px ${CL.shadow}, inset 0 2px 0 #fff`, rotate: "0.8deg", opacity: out, translate: `${(1 - p) * 120}px 0` }}>
        {[[16, 16], [16, -1], [-1, 16], [-1, -1]].map(([l, t], i) => <div key={i} style={{ position: "absolute", left: l >= 0 ? 16 : undefined, right: l < 0 ? 16 : undefined, top: t >= 0 ? 16 : undefined, bottom: t < 0 ? 16 : undefined, width: 16, height: 16, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #fff, #8a8a8a)" }} />)}
        <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 52, letterSpacing: 5, color: CL.red }}>SI YA LO MEZCLÓ</div>
        {steps.map((s, i) => {
          const k = lin(f, 10 + i * 14, 20 + i * 14) * (i < step ? 1 : 0.0);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 28, marginTop: 26, opacity: 0.15 + 0.85 * k, translate: `${(1 - k) * 30}px 0` }}>
              <div style={{ width: 96, height: 96, borderRadius: "50%", background: CL.red, color: "#fff", fontFamily: SERIF, fontWeight: 900, fontSize: 64, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 8px 16px ${CL.shadow}` }}>{i + 1}</div>
              <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 82, color: CL.ink }}>{s}</div>
            </div>
          );
        })}
      </div>
      <RoomLight k={0.75} />
    </AbsoluteFill>
  );
};

export const ClLabelLens: React.FC<{ words?: string[]; bed?: string; note?: string }> = ({ words = ["cloro", "hipoclorito", "amoníaco"], bed, note = "la etiqueta de atrás" }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T, width, height } = useVideoConfig(); const out = useOut(8);
  const p = pop(f, fps, 0, 15);
  // renglones grises "de letra chiquita" (bloques sin texto) + las palabras clave intercaladas
  const lines = Array.from({ length: 11 }, (_, i) => i);
  const kw = (i: number) => (i === 2 ? 0 : i === 5 ? 1 : i === 8 ? 2 : -1);
  const ly = (i: number) => 150 + i * 62;
  const sweep = interpolate(f, [12, T * 0.8], [ly(1), ly(9)], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.sin) });
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed src={bed} seed={113} dim={0.22} />
      <Contact x={width / 2} y={height * 0.97} w={760} o={0.3} />
      {/* el dorso del bidón blanco, curvado */}
      <div style={{ position: "absolute", left: width / 2 - 380, top: 40, width: 760, height: 1000, borderRadius: "60px 60px 40px 40px", background: "linear-gradient(90deg, #CFCFCA 0%, #F7F7F3 22%, #FFFFFF 45%, #EDEDE8 75%, #BEBEB8 100%)", boxShadow: `30px 30px 60px ${CL.shadow}`, opacity: out, translate: `0 ${(1 - p) * 200}px` }}>
        <div style={{ position: "absolute", left: 70, right: 70, top: 110, bottom: 90, background: "#FFFFFF", borderRadius: 10, boxShadow: "inset 0 0 0 3px #E4E1DA" }}>
          {lines.map((i) => {
            const k = kw(i);
            if (k >= 0 && k < words.length) {
              const near = Math.abs(sweep - ly(i)) < 70 || sweep > ly(i);
              return <div key={i} style={{ position: "absolute", left: 40, top: ly(i) - 150 + 30, fontFamily: LABEL, fontWeight: 600, fontSize: 40, color: near ? CL.red : "#9A9A94", background: near ? hexA(CL.yellow, 0.55) : "transparent", padding: "0 10px", borderRadius: 4 }}>{words[k].toUpperCase()}</div>;
            }
            return <div key={i} style={{ position: "absolute", left: 40, right: 40 + rnd(i) * 160, top: ly(i) - 150 + 44, height: 14, borderRadius: 7, background: "#D5D3CD" }} />;
          })}
        </div>
      </div>
      {/* la lupa */}
      <div style={{ position: "absolute", left: width / 2 - 40, top: sweep - 40 + 30, width: 300, height: 300, borderRadius: "50%", border: "22px solid #2B2F38", background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.55), rgba(255,255,255,0.05) 60%)", boxShadow: `18px 24px 40px ${CL.shadow}, inset 0 0 30px rgba(255,255,255,0.4)`, opacity: out * lin(f, 6, 14) }}>
        <div style={{ position: "absolute", left: 230, top: 230, width: 50, height: 210, borderRadius: 20, background: "linear-gradient(90deg, #1C1F27, #3B4150)", rotate: "-45deg", transformOrigin: "50% 0%" }} />
      </div>
      <div style={{ position: "absolute", left: 120, top: 120, fontFamily: HAND, fontWeight: 700, fontSize: 76, color: CL.navy, rotate: "-4deg", opacity: out * lin(f, 8, 18) }}>{note}</div>
      <RoomLight k={0.7} />
    </AbsoluteFill>
  );
};
