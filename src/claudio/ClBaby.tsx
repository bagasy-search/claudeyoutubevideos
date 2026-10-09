// Kit del ACEITE DE BEBÉ (Claudio Old Mechanic ep. 4 "ombaby"), dentro del mundo (foto real + luz):
//   ClOilDrop  la foto de la moldura gris (img): cae UNA gota sobre el plástico, el negro se abre en círculo desde donde cayó
//              (la MISMA foto, oscurecida y con contraste: no es un dibujo), después pasa el trapo y queda el rótulo `label`
//              (mode "drop" = sólo la gota y el círculo · "buff" = gota + trapo + rótulo)
//   ClYesNo    la libreta de Frank con las dos columnas de Doris (YES / NO): los ítems ya contados aparecen escritos a mano, el de
//              ahora (`now`, con `nowSide`) se escribe al último con su tilde o su cruz y un sello · title arriba
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CL, LABEL, SERIF, HAND, clamp01, ease, hexA } from "./ClTheme";
import { Bed, RoomLight, lin, pop, useOut } from "./ClParts";

const src = (s?: string) => (s ? (/^https?:/.test(s) ? s : staticFile(s.replace(/#\d+$/, ""))) : undefined);

export const ClOilDrop: React.FC<{ img: string; x?: number; y?: number; mode?: "drop" | "buff"; label?: string; bed?: string }> = ({ img, x = 0.5, y = 0.55, mode = "buff", label = "THIN · BUFF IT DRY" }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, width: W, height: H } = useVideoConfig(); const out = useOut(6);
  const cx = x * W, cy = y * H;
  const fall = clamp01((f - 6) / 14);                       // la gota cae
  const hit = 20;
  const grow = ease(clamp01((f - hit) / (T * 0.38)));      // el negro se abre
  const R = 40 + grow * (Math.hypot(W, H) * 0.55);
  const buffAt = hit + T * 0.42;
  const wipe = mode === "buff" ? ease(clamp01((f - buffAt) / (T * 0.22))) : 0;
  const shine = mode === "buff" ? 1 - wipe * 0.75 : 1;      // el brillo húmedo se va con el trapo (queda negro mate)
  const lab = mode === "buff" ? clamp01((f - buffAt - T * 0.2) / 8) : 0;
  const zoom = 1.04 + 0.05 * (f / T);
  const splash = clamp01((f - hit) / 6) * (1 - clamp01((f - hit - 6) / 10));
  return (
    <AbsoluteFill style={{ opacity: out, background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: `${x * 100}% ${y * 100}%` }}>
        <Img src={src(img)!} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        {/* la misma foto, "aceitada": más oscura, más contraste, un poco de brillo húmedo */}
        <AbsoluteFill style={{ clipPath: `circle(${R}px at ${cx}px ${cy}px)` }}>
          <Img src={src(img)!} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `brightness(0.52) contrast(1.45) saturate(1.15)` }} />
          <AbsoluteFill style={{ background: `radial-gradient(ellipse at ${x * 100 - 8}% ${y * 100 - 12}%, rgba(255,255,255,${0.16 * shine}), rgba(255,255,255,0) 45%)`, mixBlendMode: "screen" }} />
        </AbsoluteFill>
        {/* borde mojado del círculo mientras se abre */}
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          <circle cx={cx} cy={cy} r={R} fill="none" stroke={`rgba(255,255,255,${0.18 * (1 - grow) * (f > hit ? 1 : 0)})`} strokeWidth={6} />
          <circle cx={cx} cy={cy} r={30 + splash * 70} fill="none" stroke={`rgba(255,240,200,${0.5 * splash})`} strokeWidth={4} />
        </svg>
      </AbsoluteFill>
      {/* la gota */}
      {f < hit + 2 ? (
        <div style={{ position: "absolute", left: cx - 18, top: cy - 420 + 420 * fall * fall - 40, width: 36, height: 50, borderRadius: "50% 50% 50% 50% / 62% 62% 38% 38%", background: "radial-gradient(circle at 35% 30%, #FFF8E0, #F3D98A 45%, #C99A3A)", boxShadow: "0 6px 14px rgba(0,0,0,0.35)", opacity: lin(f, 4, 8) }} />
      ) : null}
      {/* el trapo de microfibra que barre de izquierda a derecha */}
      {mode === "buff" && wipe > 0 && wipe < 1 ? (
        <div style={{ position: "absolute", top: cy - 170, left: -420 + wipe * (W + 600), width: 420, height: 340, borderRadius: 60, background: "repeating-linear-gradient(135deg, #3E7FC1 0 6px, #3874B2 6px 12px)", boxShadow: "0 30px 50px rgba(0,0,0,0.45)", transform: "rotate(-8deg)" }} />
      ) : null}
      {lab > 0 ? (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 120, display: "flex", justifyContent: "center" }}>
          <div style={{ transform: `rotate(-3deg) scale(${1.5 - 0.5 * lab})`, opacity: lab, border: `8px solid ${CL.nitrile}`, color: CL.nitrile, background: "rgba(255,255,255,0.92)", fontFamily: LABEL, fontWeight: 800, fontSize: 62, letterSpacing: 6, padding: "8px 34px", borderRadius: 14 }}>{label}</div>
        </div>
      ) : null}
      <RoomLight k={0.2} />
    </AbsoluteFill>
  );
};

export const ClYesNo: React.FC<{ yes?: string[]; no?: string[]; now?: string; nowSide?: "yes" | "no"; title?: string; bed?: string }> = ({ yes = [], no = [], now, nowSide = "no", title = "Marlene's list", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 0, 14);
  const Y = [...yes], N = [...no];
  const nowAt = Math.round(T * 0.42);
  const row = (txt: string, i: number, side: "yes" | "no", isNow: boolean) => {
    const at = isNow ? nowAt : 8 + i * 3;
    const k = clamp01((f - at) / (isNow ? 14 : 6));
    const mark = clamp01((f - at - (isNow ? 14 : 4)) / 6);
    const c = side === "yes" ? "#2E7D32" : CL.red;
    return (
      <div key={side + txt} style={{ display: "flex", alignItems: "center", gap: 18, height: 74, opacity: clamp01(k * 1.4) }}>
        <div style={{ width: 54, fontFamily: SERIF, fontWeight: 900, fontSize: 60, color: c, transform: `scale(${0.4 + 0.6 * mark})`, opacity: mark }}>{side === "yes" ? "✓" : "✗"}</div>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: isNow ? 62 : 54, color: isNow ? CL.ink : hexA(CL.ink, 0.82), clipPath: `inset(0 ${100 - k * 100}% 0 0)`, whiteSpace: "nowrap", background: isNow ? hexA(CL.yellow, 0.45 * mark) : "transparent", padding: "0 10px", borderRadius: 8 }}>{txt}</div>
      </div>
    );
  };
  const nowStamp = now ? clamp01((f - nowAt - 26) / 7) : 0;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={907} dim={0.6} />
      <div style={{ position: "absolute", left: 230, top: 90, width: 1460, height: 900, opacity: clamp01(p * 1.3), transform: `translateY(${(1 - p) * 50}px) rotate(-1.2deg)` }}>
        {/* hoja de libreta rayada con espiral */}
        <div style={{ position: "absolute", inset: 0, background: "#FBF7EC", borderRadius: 18, boxShadow: "0 40px 80px rgba(0,0,0,0.5)", backgroundImage: `repeating-linear-gradient(180deg, transparent 0 73px, ${hexA("#5B8FD6", 0.35)} 73px 75px)`, backgroundPositionY: 168 }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: -26, display: "flex", justifyContent: "space-around", padding: "0 40px" }}>
          {Array.from({ length: 18 }, (_, i) => <div key={i} style={{ width: 26, height: 56, borderRadius: 13, border: "6px solid #8C8F96", background: "transparent" }} />)}
        </div>
        <div style={{ position: "absolute", left: 732, top: 150, bottom: 40, width: 4, background: hexA(CL.red, 0.35) }} />
        <div style={{ position: "absolute", left: 60, top: 54, fontFamily: SERIF, fontWeight: 900, fontSize: 58, color: CL.ink }}>{title}</div>
        <div style={{ position: "absolute", left: 80, top: 150, fontFamily: LABEL, fontWeight: 700, fontSize: 52, letterSpacing: 8, color: "#2E7D32" }}>YES</div>
        <div style={{ position: "absolute", left: 770, top: 150, fontFamily: LABEL, fontWeight: 700, fontSize: 52, letterSpacing: 8, color: CL.red }}>NO</div>
        <div style={{ position: "absolute", left: 70, top: 226, width: 640 }}>
          {Y.map((t, i) => row(t, i, "yes", false))}
          {now && nowSide === "yes" ? row(now, Y.length, "yes", true) : null}
        </div>
        <div style={{ position: "absolute", left: 760, top: 226, width: 660 }}>
          {N.map((t, i) => row(t, i, "no", false))}
          {now && nowSide === "no" ? row(now, N.length, "no", true) : null}
        </div>
        <div style={{ position: "absolute", right: 60, top: 40, fontFamily: LABEL, fontWeight: 800, fontSize: 46, color: CL.inkSoft, opacity: lin(f, 6, 14) }}>
          {`${Y.length + (now && nowSide === "yes" ? 1 : 0)} – ${N.length + (now && nowSide === "no" ? 1 : 0)}`}
        </div>
      </div>
      {nowStamp > 0 ? (
        <div style={{ position: "absolute", right: 170, bottom: 120, transform: `rotate(-7deg) scale(${1.6 - 0.6 * nowStamp})`, opacity: nowStamp, border: `9px solid ${nowSide === "yes" ? "#2E7D32" : CL.red}`, color: nowSide === "yes" ? "#2E7D32" : CL.red, background: "rgba(255,255,255,0.92)", fontFamily: LABEL, fontWeight: 800, fontSize: 70, letterSpacing: 6, padding: "6px 30px", borderRadius: 14 }}>{nowSide === "yes" ? "YES" : "NO"}</div>
      ) : null}
      <RoomLight k={0.25} />
    </AbsoluteFill>
  );
};
