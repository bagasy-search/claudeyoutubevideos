// Kit Rhonda · LAVARROPAS (rhwasher): gráficos DENTRO del mundo (foto real del lavadero, toallas en el piso, linterna, sombra).
//   RhPumpFilter      la tapita de abajo del lavarropas se abre: el agua cae a la fuente (sube el nivel) y el filtro sale con lo que
//                     junta (media, monedas, colitas de pelo, pelusa), cada cosa en una polaroid que "cae" sobre las toallas
//   RhCycleThermo     termómetro de vidrio junto a la perilla del lavarropas: frío (60 °F) no mata nada / caliente (140 °F+) + 1 taza
//   RhDoorCrack       dos lavarropas lado a lado: puerta cerrada (gotas, nube) vs entreabierta unos centímetros (aire, seco)
//   RhDrawerFlashlight el hueco del cajón de jabón a oscuras: un haz de linterna barre y revela el techo negro (máscara sobre la foto)
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { RH, SERIF, LABEL, HAND, hexA, rnd } from "./RhTheme";
import { Card, lin, pop, useOut } from "./RhParts";

export const RhPumpFilter: React.FC<{ img: string; finds: { img: string; label: string }[] }> = ({ img, finds }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(6);
  const pour = lin(f, 10, T * 0.45), pull = lin(f, T * 0.4, T * 0.55);
  const z = interpolate(f, [0, T], [1.03, 1.08]);
  return (
    <AbsoluteFill style={{ opacity: out, overflow: "hidden" }}>
      <Img src={staticFile(img)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", scale: String(z) }} />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(251,248,242,0) 40%, rgba(251,248,242,0.75) 70%)" }} />
      {/* fuente con agua que sube */}
      <div style={{ position: "absolute", left: 520, bottom: 30, width: 560, height: 110, borderRadius: "10px 10px 30px 30px", background: "linear-gradient(180deg,#C9CED2,#9AA3AA)", boxShadow: "0 18px 30px rgba(0,0,0,0.3)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 10, right: 10, bottom: 10, height: 90 * pour, borderRadius: 18, background: "rgba(140,150,130,0.9)" }} />
      </div>
      {/* lo que sale del filtro */}
      <div style={{ position: "absolute", right: 110, top: 110, width: 820, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30 }}>
        {finds.map((d, i) => { const p = pop(f, fps, T * 0.45 + i * 7, 13);
          return (
            <div key={i} style={{ background: "#fff", padding: "12px 12px 60px", rotate: `${(rnd(i * 7) - 0.5) * 8}deg`, translate: `0 ${(1 - p) * -200}px`, opacity: Math.min(1, p * 1.5) * (pull > 0 ? 1 : 0), boxShadow: `0 20px 40px ${RH.shadow}`, position: "relative" }}>
              <Img src={staticFile(d.img)} style={{ width: "100%", aspectRatio: "4 / 3", objectFit: "cover" }} />
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 10, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 46, color: RH.ink }}>{d.label}</div>
            </div>
          ); })}
      </div>
      <div style={{ position: "absolute", left: 120, top: 80, opacity: lin(f, 8, 18), background: RH.blueDeep, color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: 52, padding: "8px 28px", borderRadius: 12, letterSpacing: 2 }}>THE LITTLE DOOR AT THE BOTTOM</div>
    </AbsoluteFill>
  );
};

export const RhCycleThermo: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(6);
  const k = Easing.inOut(Easing.cubic)(lin(f, 8, T * 0.6));
  const deg = Math.round(60 + 85 * k), knob = -120 + 240 * k, hot = deg >= 140;
  const cup = pop(f, fps, T * 0.62, 12);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      {bed ? <Img src={staticFile(bed)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", filter: "blur(4px) brightness(1.05)" }} /> : null}
      <AbsoluteFill style={{ background: "rgba(246,243,236,0.72)" }} />
      {/* panel del lavarropas con la perilla */}
      <div style={{ position: "absolute", left: 140, top: 200, width: 760, height: 360, borderRadius: 30, background: "linear-gradient(180deg,#FFFFFF,#E8E8E5)", boxShadow: `0 30px 60px ${RH.shadow}` }}>
        <div style={{ position: "absolute", left: 260, top: 60, width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #FFFFFF, #CFD3D6)", boxShadow: "0 10px 20px rgba(0,0,0,0.25)", rotate: `${knob}deg` }}>
          <div style={{ position: "absolute", left: "50%", top: 14, width: 16, height: 70, borderRadius: 8, background: hot ? RH.red : RH.blue, translate: "-50% 0" }} />
        </div>
        {[["COLD", -120, RH.blue], ["WARM", 0, RH.inkSoft], ["HOT · SANITIZE", 120, RH.red]].map(([t, a, c], i) => { const r = 170, x = 380 + r * Math.sin(((a as number) * Math.PI) / 180), y = 180 - r * Math.cos(((a as number) * Math.PI) / 180);
          return <div key={i} style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", fontFamily: LABEL, fontWeight: 700, fontSize: 30, color: c as string, whiteSpace: "nowrap" }}>{t as string}</div>; })}
      </div>
      {/* termómetro de vidrio */}
      <div style={{ position: "absolute", right: 520, top: 110, width: 90, height: 760 }}>
        <div style={{ position: "absolute", left: 25, top: 0, width: 40, height: 660, borderRadius: 20, background: "rgba(255,255,255,0.85)", border: "4px solid #C9D3D9", boxShadow: "0 16px 30px rgba(0,0,0,0.18)" }} />
        <div style={{ position: "absolute", left: 35, bottom: 100, width: 20, height: 560 * (0.15 + 0.85 * k), borderRadius: 10, background: hot ? RH.red : RH.blue }} />
        <div style={{ position: "absolute", left: 5, bottom: 30, width: 80, height: 80, borderRadius: "50%", background: hot ? RH.red : RH.blue, border: "4px solid #C9D3D9" }} />
      </div>
      <div style={{ position: "absolute", right: 140, top: 180, width: 380 }}>
        <Card style={{ padding: "26px 34px", borderTop: `14px solid ${hot ? RH.red : RH.blue}` }}>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 110, color: hot ? RH.red : RH.blueDeep, lineHeight: 1 }}>{deg}°F</div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 50, color: RH.ink, marginTop: 6 }}>{hot ? "hot enough" : "cold kills nothing"}</div>
        </Card>
        <div style={{ marginTop: 30, opacity: Math.min(1, cup * 1.4), scale: String(0.8 + 0.2 * cup), background: RH.yellow, padding: "14px 24px", borderRadius: 14, fontFamily: SERIF, fontWeight: 900, fontSize: 52, color: RH.ink, boxShadow: `0 14px 30px ${RH.shadow}` }}>+ 1 cup peroxide, empty drum</div>
      </div>
    </AbsoluteFill>
  );
};

const Washer: React.FC<{ x: number; open: number; wet: number; f: number; title: string; good: boolean }> = ({ x, open, wet, f, title, good }) => (
  <div style={{ position: "absolute", left: x, top: 150, width: 640, height: 780 }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: 26, background: "linear-gradient(180deg,#FFFFFF,#E6E6E2)", boxShadow: `0 30px 60px ${RH.shadow}` }} />
    <div style={{ position: "absolute", left: 40, top: 30, width: 560, height: 70, borderRadius: 12, background: "#EDEDEA" }} />
    {/* boca + goma */}
    <div style={{ position: "absolute", left: 100, top: 180, width: 440, height: 440, borderRadius: "50%", background: "radial-gradient(circle, #6F7880 0%, #3B4249 70%)", border: "26px solid #8F9499" }}>
      {Array.from({ length: Math.round(18 * wet) }, (_, i) => { const ph = ((f * 0.02 + rnd(i * 3)) % 1); return <div key={i} style={{ position: "absolute", left: 60 + rnd(i * 7) * 280, top: 40 + ph * 300, width: 12, height: 18, borderRadius: "50%", background: "rgba(200,225,240,0.8)" }} />; })}
      {wet > 0.4 ? <div style={{ position: "absolute", left: 40, right: 40, top: 60, height: 200, borderRadius: "50%", background: `rgba(220,230,235,${0.35 * wet})`, filter: "blur(18px)" }} /> : null}
    </div>
    {/* la puerta (bisagra a la izquierda) */}
    <div style={{ position: "absolute", left: 80, top: 160, width: 480, height: 480, borderRadius: "50%", border: "22px solid #F1F1EE", background: "rgba(215,230,238,0.55)", transformOrigin: "0% 50%", transform: `perspective(1200px) rotateY(${-open * 38}deg)`, boxShadow: "0 12px 26px rgba(0,0,0,0.2)" }} />
    {!good ? null : [0, 1, 2].map((i) => { const ph = ((f * 0.025 + i / 3) % 1); return <div key={i} style={{ position: "absolute", left: 560 - ph * 260, top: 260 + i * 90, width: 120, height: 10, borderRadius: 6, background: RH.blue, opacity: 0.8 * (1 - ph) }} />; })}
    <div style={{ position: "absolute", left: 0, right: 0, bottom: -90, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 56, color: good ? RH.blueDeep : RH.red }}>{title}</div>
  </div>
);
export const RhDoorCrack: React.FC<{}> = () => {
  const f = useCurrentFrame(); const { durationInFrames: T } = useVideoConfig(); const out = useOut(6);
  const k = lin(f, 6, T * 0.6);
  return (
    <AbsoluteFill style={{ opacity: out, background: "linear-gradient(180deg,#EFECE6,#E2DED6)" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 15% 20%, rgba(255,249,232,0.9), rgba(255,255,255,0) 55%)" }} />
      <Washer x={170} open={0} wet={0.3 + 0.7 * k} f={f} title="Shut tight: wet all night" good={false} />
      <Washer x={1110} open={0.35} wet={1 - k} f={f} title="Open a crack: dry by morning" good />
    </AbsoluteFill>
  );
};

export const RhDrawerFlashlight: React.FC<{ img: string }> = ({ img }) => {
  const f = useCurrentFrame(); const { durationInFrames: T } = useVideoConfig(); const out = useOut(6);
  const x = interpolate(f, [6, T * 0.6], [20, 62], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  const y = interpolate(f, [6, T * 0.6], [70, 30], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  const lab = lin(f, T * 0.6, T * 0.72);
  return (
    <AbsoluteFill style={{ opacity: out, background: "#0B0D10", overflow: "hidden" }}>
      <Img src={staticFile(img)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.18)" }} />
      <Img src={staticFile(img)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", WebkitMaskImage: `radial-gradient(circle at ${x}% ${y}%, black 0, black 14%, transparent 26%)`, maskImage: `radial-gradient(circle at ${x}% ${y}%, black 0, black 14%, transparent 26%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${x}% ${y}%, rgba(255,240,200,0.18), rgba(0,0,0,0) 26%)` }} />
      <div style={{ position: "absolute", left: `${x}%`, top: `${y}%`, translate: "-50% 160px", opacity: lab, background: RH.red, color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: 50, padding: "8px 26px", borderRadius: 12, letterSpacing: 2, whiteSpace: "nowrap" }}>THE CEILING NOBODY SEES</div>
      <div style={{ position: "absolute", left: 90, bottom: 80, opacity: lin(f, 4, 14), fontFamily: HAND, fontWeight: 700, fontSize: 64, color: hexA("#FFFFFF", 0.9) }}>flashlight, up inside the drawer hole</div>
    </AbsoluteFill>
  );
};
