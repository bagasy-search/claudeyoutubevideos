// Kit del video hazelsinger (máquinas de coser Singer). Tres piezas con profundidad (cama + plano medio + capa de
// luz/polvo al frente), en el idioma del cartel de remate de Hazel:
//   HzSerialPlate  — la cama de metal de la máquina: una linterna barre y aparece el número estampado; después se
//                    separa en "letras → fábrica" y "números → año".
//   HzMachineShelf — estante de remate con siluetas de modelos; cada una recibe su etiqueta de precio vendido.
//   HzDecalWipe    — un trapo pasa sobre las calcomanías doradas y se las lleva; el precio cae.
// Textos SIEMPRE por props.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { HZ, LABEL, SERIF, TYPE, hexA, rnd } from "./HzTheme";
import { HzBed, Stamp, Tag, ease } from "./HzParts";

const Dust: React.FC<{ n: number; seed: number; color?: string }> = ({ n, seed, color = "rgba(255,240,200,0.55)" }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: n }).map((_, i) => {
        const r = (o: number) => rnd(seed * 61 + i * 7 + o);
        const s = 3 + r(1) * 7; const x = (r(2) * 1920 + f * (0.3 + r(3)) * 0.8) % 1920; const y = (r(4) * 1080 + Math.sin(f / 30 + i) * 18 + f * 0.2) % 1080;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: s, height: s, borderRadius: "50%", background: color, filter: "blur(1px)", opacity: 0.4 + 0.6 * r(5) }} />;
      })}
    </AbsoluteFill>
  );
};

export const HzSerialPlate: React.FC<{ serial?: string; letters?: string; lettersMean?: string; numbers?: string; numbersMean?: string; title?: string; bed?: string }> = ({ serial = "EV 512843", letters = "letters", lettersMean = "which factory", numbers = "numbers", numbersMean = "what year", title = "the number on the bed", bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const beam = interpolate(f, [6, 70], [-300, 1500], ease);
  const reveal = interpolate(f, [20, 70], [0, 1], ease);
  const split = spring({ frame: f - 90, fps, config: { damping: 14 } });
  const [L, N] = [serial.split(" ")[0], serial.split(" ").slice(1).join(" ")];
  return (
    <AbsoluteFill>
      <HzBed src={bed} seed={5} dim={0.7} blur={4} />
      <div style={{ position: "absolute", top: 60, width: "100%", textAlign: "center", fontFamily: SERIF, fontSize: 70, color: HZ.white, textShadow: "0 4px 16px rgba(0,0,0,0.6)" }}>{title}</div>
      {/* placa de metal negra con brillo */}
      <div style={{ position: "absolute", left: 210, top: 240, width: 1500, height: 420, borderRadius: 26, background: "linear-gradient(160deg, #2a2724, #0f0e0d 60%, #24211e)", boxShadow: "0 40px 90px rgba(0,0,0,0.6), inset 0 2px 0 rgba(255,255,255,0.12)", overflow: "hidden", transform: `perspective(1600px) rotateX(${14 - split * 8}deg)` }}>
        {Array.from({ length: 30 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 0, right: 0, top: i * 14, height: 1, background: "rgba(255,255,255,0.025)" }} />)}
        <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontFamily: TYPE, fontSize: 130, letterSpacing: 18, color: `rgba(210,200,180,${0.15 + 0.75 * reveal})`, textShadow: "0 -2px 0 rgba(0,0,0,0.9), 0 2px 0 rgba(255,255,255,0.18)" }}>{serial}</div>
        <div style={{ position: "absolute", top: 0, bottom: 0, left: beam, width: 420, background: "radial-gradient(ellipse at center, rgba(255,240,200,0.42), transparent 70%)", mixBlendMode: "screen" }} />
      </div>
      {[[L, letters, lettersMean, 330], [N, numbers, numbersMean, 1060]].map(([v, a, b, x], i) => (
        <div key={i} style={{ position: "absolute", left: x as number, top: 720, transform: `translateY(${(1 - split) * 120}px) rotate(${i ? 2 : -2}deg)`, opacity: split }}>
          <Tag w={540} h={250}>
            <div style={{ fontFamily: TYPE, fontSize: 64, color: HZ.ink }}>{v}</div>
            <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 30, color: HZ.inkSoft, textTransform: "uppercase", letterSpacing: 2 }}>{a} → <span style={{ color: HZ.red }}>{b}</span></div>
          </Tag>
        </div>
      ))}
      <Dust n={40} seed={3} />
    </AbsoluteFill>
  );
};

// silueta simple de máquina de coser (brazo + cama), escala por `w`
const Machine: React.FC<{ w: number; color: string; small?: boolean; freearm?: boolean }> = ({ w, color, small, freearm }) => (
  <svg width={w} height={w * 0.62} viewBox="0 0 300 186">
    <path d="M30 150 L270 150 L270 172 L30 172 Z" fill={color} />
    {freearm ? <path d="M150 150 L270 150 L270 140 L150 140 Z" fill={hexA("#000000", 0.25)} /> : null}
    <path d={small ? "M60 150 L60 70 Q60 40 95 40 L235 40 Q258 40 258 62 L258 92 L232 92 L232 70 L95 70 L95 150 Z" : "M50 150 L50 60 Q50 26 92 26 L240 26 Q266 26 266 54 L266 100 L236 100 L236 62 L92 62 L92 150 Z"} fill={color} />
    <rect x={238} y={92} width={10} height={36} fill={color} />
    <circle cx={74} cy={86} r={small ? 20 : 26} fill="none" stroke={hexA("#ffffff", 0.35)} strokeWidth={6} />
    <path d="M120 44 Q150 34 180 44" stroke={HZ.goldSoft} strokeWidth={4} fill="none" opacity={0.8} />
  </svg>
);

export const HzMachineShelf: React.FC<{ items: { name: string; price: string; color?: string; small?: boolean; freearm?: boolean; hi?: boolean }[]; title?: string; every?: number; bed?: string }> = ({ items, title = "what they really sell for", every = 26, bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const n = items.length; const slot = 1680 / n;
  return (
    <AbsoluteFill>
      <HzBed src={bed} seed={9} dim={0.62} blur={5} />
      <div style={{ position: "absolute", top: 60, width: "100%", textAlign: "center", fontFamily: SERIF, fontSize: 68, color: HZ.white, textShadow: "0 4px 16px rgba(0,0,0,0.6)" }}>{title}</div>
      {/* estante de madera */}
      <div style={{ position: "absolute", left: 80, right: 80, top: 640, height: 40, background: "linear-gradient(#8a6038, #5e3f22)", borderRadius: 6, boxShadow: "0 24px 40px rgba(0,0,0,0.5)" }} />
      {items.map((it, i) => {
        const at = 8 + i * every; const s = spring({ frame: f - at, fps, config: { damping: 13, stiffness: 120 } });
        const tagIn = spring({ frame: f - at - 10, fps, config: { damping: 12 } });
        const w = it.small ? slot * 0.8 : slot * 1.0; const x = 120 + i * slot + (slot - w) / 2;
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: x, top: 640 - w * 0.62, transform: `translateY(${(1 - s) * -260}px)`, opacity: s, filter: "drop-shadow(0 18px 18px rgba(0,0,0,0.45))" }}>
              <Machine w={w} color={it.color || "#16130f"} small={it.small} freearm={it.freearm} />
            </div>
            <div style={{ position: "absolute", left: 120 + i * slot + slot / 2 - 140, top: 720, transform: `rotate(${(i % 2 ? 3 : -3) * tagIn}deg) scale(${tagIn})`, transformOrigin: "50% 0%" }}>
              <Tag w={280} h={200} color={it.hi ? "#F6E7B8" : undefined}>
                <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 26, color: HZ.inkSoft, textTransform: "uppercase", lineHeight: 1.1 }}>{it.name}</div>
                <div style={{ fontFamily: SERIF, fontSize: 42, color: it.hi ? HZ.red : HZ.ink, marginTop: 8, whiteSpace: "nowrap" }}>{it.price}</div>
              </Tag>
            </div>
          </React.Fragment>
        );
      })}
      <Dust n={24} seed={11} />
    </AbsoluteFill>
  );
};

export const HzDecalWipe: React.FC<{ from?: string; to?: string; label?: string; title?: string; bed?: string }> = ({ from = "$600", to = "$250", label = "scrubbed with kitchen cleaner", title = "the costly mistake", bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const wipe = interpolate(f, [24, 120], [0, 1], ease);
  const clothX = interpolate(f, [24, 120], [300, 1500], ease) + Math.sin(f / 4) * 40;
  const price = interpolate(f, [60, 130], [0, 1], ease);
  const pIn = spring({ frame: f - 8, fps, config: { damping: 14 } });
  return (
    <AbsoluteFill>
      <HzBed src={bed} seed={13} dim={0.66} blur={4} />
      <div style={{ position: "absolute", top: 60, width: "100%", textAlign: "center", fontFamily: SERIF, fontSize: 70, color: HZ.white, textShadow: "0 4px 16px rgba(0,0,0,0.6)" }}>{title}</div>
      <div style={{ position: "absolute", left: 220, top: 230, width: 1480, height: 470, borderRadius: 40, background: "linear-gradient(170deg, #1d1a17, #0b0a09)", boxShadow: "0 40px 90px rgba(0,0,0,0.6)", overflow: "hidden" }}>
        {/* calcomanías doradas: se borran de izquierda a derecha detrás del trapo */}
        <svg width={1480} height={470} style={{ position: "absolute" }}>
          <defs>
            <linearGradient id="gold" x1="0" x2="1"><stop offset="0" stopColor="#f3d88a" /><stop offset="0.5" stopColor="#b8892b" /><stop offset="1" stopColor="#f0d07a" /></linearGradient>
            <linearGradient id="wipe" x1="0" x2="1"><stop offset={Math.max(0, wipe - 0.05)} stopColor="#000" /><stop offset={Math.min(1, wipe + 0.02)} stopColor="#fff" /></linearGradient>
            <mask id="m"><rect width={1480} height={470} fill="url(#wipe)" /></mask>
          </defs>
          <g mask="url(#m)">
            {Array.from({ length: 7 }).map((_, i) => <path key={i} d={`M${120 + i * 190} 330 C ${160 + i * 190} 150, ${260 + i * 190} 150, ${300 + i * 190} 330 C ${250 + i * 190} 250, ${170 + i * 190} 250, ${120 + i * 190} 330 Z`} fill="url(#gold)" opacity={0.95} />)}
            <path d="M100 120 Q740 40 1380 120" stroke="url(#gold)" strokeWidth={10} fill="none" />
            <path d="M100 380 Q740 450 1380 380" stroke="url(#gold)" strokeWidth={10} fill="none" />
          </g>
          {/* restos opacos donde ya pasó el trapo */}
          <rect width={1480 * wipe} height={470} fill="rgba(90,80,60,0.12)" />
        </svg>
      </div>
      {/* trapo */}
      <div style={{ position: "absolute", left: clothX - 180, top: 300, width: 360, height: 300, borderRadius: "40% 60% 50% 45%", background: "radial-gradient(circle at 40% 35%, #f4f1ea, #cfc8b8)", boxShadow: "0 30px 50px rgba(0,0,0,0.5)", transform: `rotate(${Math.sin(f / 6) * 8}deg)`, opacity: interpolate(f, [18, 26, 120, 132], [0, 1, 1, 0], ease) }} />
      <div style={{ position: "absolute", left: 640, top: 760, transform: `scale(${pIn})` }}>
        <Tag w={640} h={230}>
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 28, color: HZ.inkSoft, textTransform: "uppercase", letterSpacing: 2 }}>{label}</div>
          <div style={{ display: "flex", gap: 30, alignItems: "baseline", marginTop: 10 }}>
            <span style={{ fontFamily: SERIF, fontSize: 80, color: HZ.ink, textDecoration: price > 0.3 ? "line-through" : "none", opacity: 1 - price * 0.5 }}>{from}</span>
            <span style={{ fontFamily: SERIF, fontSize: 92, color: HZ.red, opacity: price }}>{to}</span>
          </div>
        </Tag>
      </div>
      <div style={{ position: "absolute", right: 200, top: 700 }}><Stamp text="gone for good" at={130} size={52} rot={-7} /></div>
      <Dust n={30} seed={17} />
    </AbsoluteFill>
  );
};
