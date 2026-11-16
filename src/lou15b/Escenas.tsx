// Escenas lou15b · The St. Louis Slinger — cinco escenas hechas con las fotos del video, cada una con un truco distinto (y distinto de lou15a)
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const S = (n: string) => staticFile(`lou15b/g/${n}.png`);
const FULL: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "cover" };
const EASE = Easing.bezier(0.45, 0, 0.2, 1);
const tag = (o: number, y: number, t: string, bg: string): React.ReactNode => (
  <div style={{ position: "absolute", right: 70, top: y, opacity: o, transform: `translateX(${(1 - o) * 30}px)`, background: bg, color: "#fff", fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 44, letterSpacing: 2, padding: "12px 26px", borderRadius: 6, boxShadow: "0 6px 20px rgba(0,0,0,.45)" }}>{t}</div>
);

// 1 · El agua se enturbia: la foto lechosa baja desde arriba con borde blando, como el almidón que se suelta (en «cloudy»)
export const Cloud: React.FC<{ dur: number; fCloud: number }> = ({ dur, fCloud }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [fCloud - 10, fCloud + 36], [-30, 130], { ...CL, easing: EASE });
  const z = interpolate(f, [0, dur], [1.0, 1.07], CL);
  const m = `linear-gradient(180deg, #000 ${p - 30}%, transparent ${p}%)`;
  return (
    <AbsoluteFill style={{ background: "#111", overflow: "hidden" }}>
      <div style={{ ...FULL, transform: `scale(${z})` }}><Img src={S("e_cloud_clear")} style={FULL} /></div>
      <div style={{ ...FULL, WebkitMaskImage: m, maskImage: m }}>
        <div style={{ ...FULL, transform: `scale(${z})` }}><Img src={S("e_cloud_milky")} style={FULL} /></div>
      </div>
      {tag(interpolate(f, [fCloud + 30, fCloud + 42], [0, 1], CL), 80, "THAT'S THE STARCH", "#7A4A1E")}
    </AbsoluteFill>
  );
};

// 2 · Escurrir: la cámara gira con la toalla retorcida y, al deshacer el giro, aterriza en la taza de agua (en «half»)
export const Wring: React.FC<{ dur: number; fCup: number }> = ({ dur, fCup }) => {
  const f = useCurrentFrame();
  const rot = interpolate(f, [0, fCup - 8], [0, 9], { ...CL, easing: Easing.in(Easing.quad) });
  const back = interpolate(f, [fCup - 8, fCup + 16], [-9, 0], { ...CL, easing: Easing.out(Easing.cubic) });
  const after = f >= fCup - 8;
  const z = after ? interpolate(f, [fCup - 8, dur], [1.22, 1.05], CL) : interpolate(f, [0, fCup - 8], [1.05, 1.22], CL);
  return (
    <AbsoluteFill style={{ background: "#0e0c0a", overflow: "hidden" }}>
      <div style={{ ...FULL, transform: `rotate(${after ? back : rot}deg) scale(${z})` }}>
        <Img src={S(after ? "e_wring_cup" : "e_wring_twist")} style={FULL} />
      </div>
      {tag(after ? interpolate(f, [fCup + 10, fCup + 22], [0, 1], CL) : 0, 80, "½ CUP OF WATER", "#2F5D7A")}
    </AbsoluteFill>
  );
};

// 3 · Aplastar: la bola se aplana — el cuadro se achata contra la plancha, golpe de luz y la foto plana rebota (en «smash»)
export const Smash: React.FC<{ dur: number; fSmash: number }> = ({ dur, fSmash }) => {
  const f = useCurrentFrame();
  const after = f >= fSmash;
  const sy = after ? interpolate(f, [fSmash, fSmash + 4, fSmash + 12], [0.9, 1.02, 1], CL) : interpolate(f, [fSmash - 6, fSmash], [1, 0.94], CL);
  const sx = 2 - sy;
  const z = interpolate(f, [0, dur], [1.04, 1.12], CL);
  const flash = interpolate(f, [fSmash, fSmash + 2, fSmash + 9], [0, 0.55, 0], CL);
  return (
    <AbsoluteFill style={{ background: "#0d0b09", overflow: "hidden" }}>
      <div style={{ ...FULL, transformOrigin: "960px 760px", transform: `scale(${z * sx}, ${z * sy})` }}>
        <Img src={S(after ? "e_smash_flat" : "e_smash_ball")} style={FULL} />
      </div>
      <AbsoluteFill style={{ background: "#fff6e0", opacity: flash }} />
      {tag(after ? interpolate(f, [fSmash + 14, fSmash + 26], [0, 1], CL) : 0, 80, "⅓ INCH THICK", "#9B2C1F")}
    </AbsoluteFill>
  );
};

// 4 · La yema corre: la foto con la yema rota se derrama hacia abajo con un borde ondulado, como la yema sobre el chili (en «runs»)
export const Yolk: React.FC<{ dur: number; fRun: number }> = ({ dur, fRun }) => {
  const f = useCurrentFrame();
  const lvl = interpolate(f, [fRun - 6, fRun + 50], [-80, 1180], { ...CL, easing: Easing.inOut(Easing.quad) });
  const z = interpolate(f, [0, dur], [1.02, 1.1], CL);
  const pts: string[] = [];
  for (let i = 0; i <= 24; i++) { const x = i * 80; pts.push(`${x}px ${Math.max(0, lvl + Math.sin(i * 0.9 + f * 0.12) * 46 + (i % 3) * 22)}px`); }
  const clip = `polygon(0px 0px, 1920px 0px, ${pts.reverse().join(", ")})`;
  return (
    <AbsoluteFill style={{ background: "#120f0b", overflow: "hidden" }}>
      <div style={{ ...FULL, transform: `scale(${z})` }}><Img src={S("e_yolk_whole")} style={FULL} /></div>
      <div style={{ ...FULL, clipPath: clip }}>
        <div style={{ ...FULL, transform: `scale(${z})` }}><Img src={S("e_yolk_run")} style={FULL} /></div>
      </div>
    </AbsoluteFill>
  );
};

// 5 · La campana: tablillas verticales que giran una tras otra como persianas y destapan el queso derretido (en «steam»)
export const Dome: React.FC<{ dur: number; fOff: number }> = ({ dur, fOff }) => {
  const f = useCurrentFrame();
  const N = 8, w = 1920 / N;
  const z = interpolate(f, [0, dur], [1.0, 1.08], CL);
  const steam = interpolate(f, [fOff, fOff + 20, dur], [0, 0.32, 0.12], CL);
  return (
    <AbsoluteFill style={{ background: "#0f0d0b", overflow: "hidden", perspective: 2400 }}>
      <div style={{ ...FULL, transform: `scale(${z})` }}><Img src={S("e_dome_off")} style={FULL} /></div>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 35%, rgba(255,255,255,.9), transparent 55%)", opacity: steam }} />
      {Array.from({ length: N }).map((_, i) => {
        const a = interpolate(f, [fOff - 4 + i * 3, fOff + 14 + i * 3], [0, 90], { ...CL, easing: Easing.inOut(Easing.cubic) });
        if (a >= 89.5) return null;
        return (
          <div key={i} style={{ position: "absolute", left: i * w, top: 0, width: w + 1, height: 1080, overflow: "hidden", transformOrigin: `${w / 2}px 540px`, transform: `rotateY(${a}deg)`, filter: `brightness(${1 - a / 180})` }}>
            <div style={{ position: "absolute", left: -i * w, top: 0, width: 1920, height: 1080, transform: `scale(${z})`, transformOrigin: "960px 540px" }}>
              <Img src={S("e_dome_on")} style={FULL} />
            </div>
          </div>
        );
      })}
      {tag(interpolate(f, [fOff + 30, fOff + 42], [0, 1], CL), 80, "30 SECONDS", "#7A4A1E")}
    </AbsoluteFill>
  );
};

export const ESC_LOU15B: Record<string, React.FC<any>> = { cloudy: Cloud, wring: Wring, smash: Smash, yolk: Yolk, dome: Dome };
