import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { Media } from "../components/Media";
import { SfxCue, SFX } from "../components/Sfx";

// ── FdSplitCompare — LA COMPARACIÓN CINEMÁTICA A DOS PANELES ─────────────────
// No es una tabla: son DOS FOTOS REALES ENFRENTADAS. Los paneles entran desde
// afuera con perspectiva (cover-flow) y se acomodan; un DIVISOR LUMINOSO se
// dibuja de arriba a abajo y suelta un nodo "VS"; en cada lado aparece un CHIP
// con la etiqueta y un VALOR grande que CUENTA desde 0. Al final cae el
// VEREDICTO: el ganador se realza con glow teal y el perdedor se atenúa y
// desatura, con su valor en coral.
//
// Uso (beat kind "splitcompare"):
//   { kind:"splitcompare", eyebrow, title,
//     left:{image, label, value, note}, right:{...},
//     winner:"left"|"right"|"none", unit:" mmHg" }
//
// Todo tiene default: sin `image` hay placeholder elegante (nunca hueco negro),
// sin `value` no se dibuja el número, sin `note` no hay renglón. 100% determinista
// (nada de Math.random / Date.now) porque el render sale en 60 chunks.

const INTER = loadInter().fontFamily;
const FONT = INTER + ", 'Segoe UI', 'Helvetica Neue', Arial, sans-serif";

const C = {
  paper: "#F4F7F9",
  ink: "#14232B",
  teal: "#109C99",
  tealBright: "#12B3AE",
  coral: "#E0523E",
  cream: "#F2F8F9",
};

export type Side = { image?: string; label: string; value?: string | number; note?: string };

export type FdSplitCompareProps = {
  durationInFrames: number;
  left: Side;
  right: Side;
  eyebrow?: string;
  title?: string;
  winner?: "left" | "right" | "none";
  unit?: string;
};

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// decimales del valor objetivo (para que el count-up no muestre 128.4732)
const decimalsOf = (n: number) => {
  const s = String(n);
  const i = s.indexOf(".");
  return i < 0 ? 0 : clamp(s.length - i - 1, 0, 2);
};

type SideState = "neutral" | "win" | "lose";

export const FdSplitCompare: React.FC<FdSplitCompareProps> = ({
  durationInFrames,
  left,
  right,
  eyebrow,
  title,
  winner = "none",
  unit = "",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const D = Math.max(24, Math.round(durationInFrames || 150));
  // si el beat es cortito, la coreografía entera se comprime (nunca se corta)
  const t = (f: number) => Math.round(f * Math.min(1, D / 110));

  const L: Side = left ?? { label: "" };
  const R: Side = right ?? { label: "" };

  // ── coreografía ───────────────────────────────────────────────────────────
  const headAt = t(2);
  const inL = t(4);
  const inR = t(9);
  const divAt = t(12);
  const divDur = Math.max(8, t(18));
  const vsAt = divAt + divDur - t(5);
  const chipLAt = t(22);
  const chipRAt = t(27);
  const cStart = t(32);
  const cDur = clamp(Math.round(D * 0.22), 18, 40);
  const cEnd = cStart + cDur;
  const verdictAt =
    winner === "left" || winner === "right"
      ? clamp(Math.round(D * 0.62), cEnd + 12, Math.max(cEnd + 13, D - 24))
      : D + 999; // sin veredicto: nunca dispara
  const outStart = Math.max(t(44), D - 11);

  // header
  const headP = spring({ frame: frame - headAt, fps, config: { damping: 18, stiffness: 120 } });

  // divisor: se dibuja de arriba a abajo
  const draw = interpolate(frame, [divAt, divAt + divDur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const vsP = spring({ frame: frame - vsAt, fps, config: { damping: 12, mass: 0.5, stiffness: 170 } });

  // veredicto
  const vP = spring({ frame: frame - verdictAt, fps, config: { damping: 16, mass: 0.8, stiffness: 120 } });
  const stateOf = (s: "left" | "right"): SideState =>
    winner === "none" ? "neutral" : winner === s ? "win" : "lose";

  // salida
  const out = interpolate(frame, [outStart, D - 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // geometría
  const hasHead = Boolean(eyebrow || title);
  const panelTop = hasHead ? 226 : 84;
  const panelH = 1080 - panelTop - 64;
  const panelW = 848;
  const leftX = 72;
  const rightX = 1920 - panelW - 72;
  const midX = 960;

  const divTop = panelTop - 14;
  const divH = panelH + 28;

  // brillo que viaja por el divisor (loop determinista: nada queda quieto)
  const travelT = Math.abs((frame - divAt) % 96) / 96;
  const travelY = interpolate(travelT, [0, 1], [-160, divH + 40]);
  const travelOp = draw >= 1 ? interpolate(travelT, [0, 0.12, 0.85, 1], [0, 0.55, 0.55, 0]) : 0;

  return (
    <AbsoluteFill style={{ fontFamily: FONT, backgroundColor: C.paper, opacity: out }}>
      {/* fondo clínico: papel + grilla finísima + viñeta */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(16,156,153,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(16,156,153,0.05) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          opacity: 0.75,
        }}
      />
      <AbsoluteFill
        style={{
          background: "radial-gradient(120% 85% at 50% 42%, rgba(255,255,255,0.9), rgba(20,35,43,0.10))",
        }}
      />

      {/* ── HEADER ───────────────────────────────────────────────────────── */}
      {hasHead && (
        <div
          style={{
            position: "absolute",
            top: 66,
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: clamp(headP, 0, 1),
            transform: "translateY(" + interpolate(headP, [0, 1], [22, 0]) + "px)",
          }}
        >
          {eyebrow && (
            <div
              style={{
                fontSize: 27,
                fontWeight: 800,
                letterSpacing: 5,
                textTransform: "uppercase",
                color: C.teal,
                marginBottom: 12,
              }}
            >
              {eyebrow}
            </div>
          )}
          {title && (
            <div
              style={{
                fontSize: 62,
                fontWeight: 900,
                lineHeight: 1.04,
                color: C.ink,
                letterSpacing: -0.8,
                padding: "0 140px",
              }}
            >
              {title}
            </div>
          )}
          <div
            style={{
              margin: "20px auto 0",
              height: 6,
              borderRadius: 4,
              width: interpolate(headP, [0, 1], [0, 300]),
              background: "linear-gradient(90deg, " + C.teal + ", " + C.tealBright + ")",
            }}
          />
        </div>
      )}

      {/* ── PANELES (en perspectiva) ─────────────────────────────────────── */}
      <AbsoluteFill style={{ perspective: 1900 }}>
        <ComparePanel
          data={L}
          side="left"
          x={leftX}
          y={panelTop}
          w={panelW}
          h={panelH}
          appearAt={inL}
          chipAt={chipLAt}
          countStart={cStart}
          countDur={cDur}
          unit={unit}
          state={stateOf("left")}
          verdictAt={verdictAt}
          verdictP={vP}
          totalFrames={D}
        />
        <ComparePanel
          data={R}
          side="right"
          x={rightX}
          y={panelTop}
          w={panelW}
          h={panelH}
          appearAt={inR}
          chipAt={chipRAt}
          countStart={cStart}
          countDur={cDur}
          unit={unit}
          state={stateOf("right")}
          verdictAt={verdictAt}
          verdictP={vP}
          totalFrames={D}
        />
      </AbsoluteFill>

      {/* ── DIVISOR LUMINOSO ─────────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          left: midX - 3,
          top: divTop,
          width: 6,
          height: divH * draw,
          borderRadius: 6,
          background:
            "linear-gradient(180deg, rgba(18,179,174,0.15), " +
            C.tealBright +
            " 22%, " +
            C.teal +
            " 78%, rgba(16,156,153,0.15))",
          boxShadow: "0 0 30px rgba(18,179,174,0.65), 0 0 90px rgba(18,179,174,0.28)",
        }}
      />
      {/* punta que va abriendo la línea */}
      {draw > 0 && draw < 1 && (
        <div
          style={{
            position: "absolute",
            left: midX - 9,
            top: divTop + divH * draw - 9,
            width: 18,
            height: 18,
            borderRadius: 12,
            background: "#FFFFFF",
            boxShadow: "0 0 26px " + C.tealBright + ", 0 0 60px rgba(18,179,174,0.7)",
          }}
        />
      )}
      {/* destello que recorre el divisor ya dibujado */}
      <div
        style={{
          position: "absolute",
          left: midX - 12,
          top: divTop + travelY,
          width: 24,
          height: 150,
          borderRadius: 14,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0), rgba(255,255,255,0.85), rgba(255,255,255,0))",
          opacity: travelOp,
          filter: "blur(7px)",
        }}
      />

      {/* nodo VS */}
      <div
        style={{
          position: "absolute",
          left: midX - 52,
          top: divTop + divH / 2 - 52,
          width: 104,
          height: 104,
          opacity: clamp(vsP, 0, 1),
          transform: "scale(" + interpolate(vsP, [0, 1], [0.3, 1]) + ")",
        }}
      >
        {/* anillo que respira */}
        <div
          style={{
            position: "absolute",
            inset: -14,
            borderRadius: 34,
            border: "2px solid rgba(18,179,174," + (0.16 + 0.16 * Math.sin(frame / 15)) + ")",
            transform: "rotate(45deg) scale(" + (1 + 0.035 * Math.sin(frame / 15)) + ")",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 28,
            transform: "rotate(45deg)",
            background: "linear-gradient(140deg, " + C.tealBright + ", " + C.teal + ")",
            boxShadow: "0 18px 46px rgba(16,156,153,0.42), inset 0 2px 0 rgba(255,255,255,0.45)",
            border: "3px solid rgba(255,255,255,0.92)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FFFFFF",
            fontSize: 34,
            fontWeight: 900,
            letterSpacing: 2,
          }}
        >
          VS
        </div>
      </div>

      {/* ── SFX ──────────────────────────────────────────────────────────── */}
      <SfxCue at={inL} src={SFX.whoosh} volume={0.24} />
      <SfxCue at={inR} src={SFX.whoosh} volume={0.2} />
      <SfxCue at={divAt} src={SFX.lineDraw} volume={0.22} />
      <SfxCue at={vsAt} src={SFX.chipPop3d} volume={0.26} />
      <SfxCue at={chipLAt} src={SFX.kickerType} volume={0.2} />
      <SfxCue at={chipRAt} src={SFX.kickerType} volume={0.2} />
      {(L.value !== undefined || R.value !== undefined) && (
        <SfxCue at={cEnd} src={SFX.numberSlam} volume={0.24} />
      )}
      {winner !== "none" && verdictAt < D && (
        <SfxCue at={verdictAt} src={SFX.winnerChime} volume={0.3} />
      )}
    </AbsoluteFill>
  );
};

// ── UN PANEL ────────────────────────────────────────────────────────────────
const ComparePanel: React.FC<{
  data: Side;
  side: "left" | "right";
  x: number;
  y: number;
  w: number;
  h: number;
  appearAt: number;
  chipAt: number;
  countStart: number;
  countDur: number;
  unit: string;
  state: SideState;
  verdictAt: number;
  verdictP: number;
  totalFrames: number;
}> = ({
  data,
  side,
  x,
  y,
  w,
  h,
  appearAt,
  chipAt,
  countStart,
  countDur,
  unit,
  state,
  verdictAt,
  verdictP,
  totalFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dir = side === "left" ? -1 : 1;

  // entrada desde afuera + acomodo con perspectiva
  const p = spring({ frame: frame - appearAt, fps, config: { damping: 19, mass: 0.9, stiffness: 105 } });
  const dx = interpolate(p, [0, 1], [dir * 560, 0]);
  const restRot = -dir * 5.5; // el panel "mira" hacia el centro
  const rot = interpolate(p, [0, 1], [-dir * 26, restRot]) + Math.sin(frame / 68) * 0.7 * dir;
  const enterScale = interpolate(p, [0, 1], [0.86, 1]);

  // veredicto
  const win = state === "win";
  const lose = state === "lose";
  const vp = clamp(verdictP, 0, 1);
  const breathe = frame > verdictAt ? 0.5 + 0.5 * Math.sin((frame - verdictAt) / 16) : 0;
  const glow = win ? vp * (0.55 + 0.45 * breathe) : 0;
  const stateScale = win ? 1 + 0.032 * vp : lose ? 1 - 0.035 * vp : 1;
  const grayscale = lose ? 0.55 * vp : 0;
  const dimOp = lose ? 1 - 0.34 * vp : 1;

  // ken-burns continuo: el panel nunca queda congelado
  const kbEnd = Math.max(2, totalFrames);
  const kb = interpolate(frame, [0, kbEnd], side === "left" ? [1.07, 1.15] : [1.15, 1.07], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const kbY = interpolate(frame, [0, kbEnd], side === "left" ? [-10, 12] : [12, -10], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const chipP = spring({ frame: frame - chipAt, fps, config: { damping: 15, mass: 0.6, stiffness: 150 } });

  // ── VALOR: número → count-up · texto → fade + scale ──────────────────────
  const rawValue = data.value;
  const isNum = typeof rawValue === "number" && isFinite(rawValue);
  const cp = interpolate(frame, [countStart, countStart + countDur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const slam = spring({
    frame: frame - (countStart + countDur),
    fps,
    config: { damping: 9, mass: 0.4, stiffness: 220 },
  });
  const slamScale = 1 + 0.07 * Math.max(0, 1 - Math.abs(slam - 1) * 2.4) * (frame >= countStart + countDur ? 1 : 0);

  let valueText = "";
  if (isNum) {
    const target = rawValue as number;
    valueText = (target * cp).toFixed(decimalsOf(target));
  } else if (rawValue !== undefined && rawValue !== null && String(rawValue).length > 0) {
    valueText = String(rawValue);
  }
  const strP = clamp(
    spring({ frame: frame - countStart, fps, config: { damping: 16, mass: 0.7, stiffness: 140 } }),
    0,
    1
  );
  const valueOp = valueText === "" ? 0 : isNum ? (frame >= countStart ? 1 : 0) : strP;
  const valueScale = isNum ? slamScale : interpolate(strP, [0, 1], [0.78, 1]);

  const full = valueText + (valueText !== "" ? unit : "");
  const valueSize = full.length > 12 ? 68 : full.length > 8 ? 84 : 106;
  const valueColor = win ? C.tealBright : lose ? C.coral : C.cream;
  const barColor = win ? C.tealBright : lose ? C.coral : C.teal;
  const barTail = win ? "rgba(18,179,174,0.10)" : lose ? "rgba(224,82,62,0.10)" : "rgba(16,156,153,0.10)";

  const label = data.label ?? "";
  const noteOp = interpolate(frame, [countStart + 8, countStart + 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        opacity: clamp(p, 0, 1) * dimOp,
        transformStyle: "preserve-3d",
        transformOrigin: side === "left" ? "right center" : "left center",
        transform:
          "translateX(" + dx + "px) rotateY(" + rot + "deg) scale(" + enterScale * stateScale + ")",
      }}
    >
      {/* marco / glow del ganador */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 30,
          overflow: "hidden",
          background: "#0E1B22",
          border: win
            ? "4px solid rgba(18,179,174," + (0.55 + 0.45 * vp) + ")"
            : "4px solid rgba(255,255,255,0.9)",
          boxShadow: win
            ? "0 26px 70px rgba(20,35,43,0.28), 0 0 " +
              (28 + 44 * glow) +
              "px rgba(18,179,174," +
              (0.35 + 0.45 * glow) +
              ")"
            : "0 26px 70px rgba(20,35,43,0.24)",
          filter: grayscale > 0 ? "grayscale(" + grayscale + ") brightness(" + (1 - 0.12 * vp) + ")" : undefined,
        }}
      >
        {/* FOTO REAL (o placeholder elegante) */}
        {data.image ? (
          <Media
            src={data.image}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: "scale(" + kb + ") translateY(" + kbY + "px)",
            }}
          />
        ) : (
          <Placeholder label={label} />
        )}

        {/* scrim: legibilidad para público mayor, siempre */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "62%",
            background:
              "linear-gradient(180deg, rgba(10,20,26,0) 0%, rgba(10,20,26,0.55) 42%, rgba(10,20,26,0.90) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: "26%",
            background: "linear-gradient(180deg, rgba(10,20,26,0.55), rgba(10,20,26,0))",
          }}
        />

        {/* CHIP de etiqueta */}
        <div
          style={{
            position: "absolute",
            top: 30,
            left: 30,
            right: 30,
            display: "flex",
            justifyContent: side === "left" ? "flex-start" : "flex-end",
            opacity: clamp(chipP, 0, 1),
            transform: "translateY(" + interpolate(clamp(chipP, 0, 1), [0, 1], [-22, 0]) + "px)",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 16,
              padding: "14px 28px",
              borderRadius: 999,
              background: win
                ? "linear-gradient(120deg, " + C.tealBright + ", " + C.teal + ")"
                : "rgba(255,255,255,0.95)",
              boxShadow: "0 12px 28px rgba(10,20,26,0.32)",
              maxWidth: w - 80,
            }}
          >
            <div
              style={{
                flex: "0 0 auto",
                width: 18,
                height: 18,
                borderRadius: 10,
                background: win ? "#FFFFFF" : lose ? C.coral : C.teal,
              }}
            />
            <div
              style={{
                fontSize: 32,
                fontWeight: 900,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                color: win ? "#FFFFFF" : C.ink,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {label}
            </div>
          </div>
        </div>

        {/* SELLO del ganador */}
        {win && vp > 0.02 && (
          <div
            style={{
              position: "absolute",
              top: 112,
              left: side === "left" ? 30 : undefined,
              right: side === "right" ? 30 : undefined,
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 22px",
              borderRadius: 14,
              background: "rgba(18,179,174,0.92)",
              border: "2px solid rgba(255,255,255,0.85)",
              boxShadow: "0 0 " + (18 + 26 * glow) + "px rgba(18,179,174,0.75)",
              opacity: vp,
              transform: "scale(" + interpolate(vp, [0, 1], [0.6, 1]) + ")",
            }}
          >
            <div style={{ fontSize: 28, fontWeight: 900, color: "#FFFFFF" }}>✓</div>
            <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: 3, color: "#FFFFFF" }}>MEJOR</div>
          </div>
        )}

        {/* VALOR + NOTA */}
        <div style={{ position: "absolute", left: 40, right: 40, bottom: 38 }}>
          {valueText !== "" && (
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 6,
                opacity: valueOp,
                transform: "scale(" + valueScale + ")",
                transformOrigin: "left bottom",
              }}
            >
              <div
                style={{
                  fontSize: valueSize,
                  fontWeight: 900,
                  lineHeight: 1,
                  letterSpacing: -2,
                  color: valueColor,
                  textShadow: "0 6px 26px rgba(0,0,0,0.6)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {valueText}
              </div>
              {unit !== "" && (
                <div
                  style={{
                    fontSize: Math.round(valueSize * 0.42),
                    fontWeight: 800,
                    color: valueColor,
                    opacity: 0.9,
                    textShadow: "0 4px 18px rgba(0,0,0,0.6)",
                  }}
                >
                  {unit}
                </div>
              )}
            </div>
          )}
          {/* subrayado que barre bajo el valor */}
          {valueText !== "" && (
            <div
              style={{
                marginTop: 14,
                height: 6,
                borderRadius: 4,
                width: interpolate(isNum ? cp : strP, [0.15, 1], [0, w - 200], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
                background: "linear-gradient(90deg, " + barColor + ", " + barTail + ")",
              }}
            />
          )}
          {data.note && (
            <div
              style={{
                marginTop: valueText !== "" ? 18 : 0,
                fontSize: 33,
                fontWeight: 600,
                lineHeight: 1.24,
                color: "rgba(242,248,249,0.94)",
                textShadow: "0 3px 16px rgba(0,0,0,0.75)",
                opacity: noteOp,
                transform: "translateY(" + (1 - noteOp) * 14 + "px)",
              }}
            >
              {data.note}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── PLACEHOLDER — si falta la foto, jamás un hueco negro ────────────────────
const Placeholder: React.FC<{ label: string }> = ({ label }) => {
  const initial = ((label || "?").trim().charAt(0) || "?").toUpperCase();
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(155deg, #EAF2F4 0%, #CFDEE3 55%, #B7CBD2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(20,35,43,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(20,35,43,0.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div
        style={{
          width: 260,
          height: 260,
          borderRadius: 180,
          background: "rgba(255,255,255,0.55)",
          border: "4px solid rgba(16,156,153,0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(20,35,43,0.42)",
          fontSize: 130,
          fontWeight: 900,
          boxShadow: "0 18px 50px rgba(20,35,43,0.16)",
        }}
      >
        {initial}
      </div>
    </div>
  );
};
