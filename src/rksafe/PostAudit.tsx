// PostAudit.tsx — LA FOTO PUBLICADA, AUDITADA (rkkeyphoto, oct-2026).
//
// La foto real del momento (`bg`) aparece como una publicación genérica de red social (sin marca) que
// sube sobre la misma escena desenfocada; los corazones suben, y después un escáner ámbar recorre la
// foto y enciende anillos sobre lo que la foto delata (`spots`: [{at:[x,y] en % DE LA FOTO, label}]).
// Al final cae el sello (`stamp`, p. ej. DELETE) y la foto se recorta/tapa si `fix` = 'crop' | 'hide'.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { V, F_DISPLAY, F_BODY, clamp01, rgba } from "./RayStage";
import { WorldBed, Stamp, Tag } from "./WorldBed";

const ease = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const, easing: Easing.out(Easing.cubic) };

export const PostAudit: React.FC<{
  bg?: string;
  kicker?: string;
  caption?: string;
  likes?: number;
  spots?: { at: [number, number]; label: string }[];
  stamp?: string;
  color?: "danger" | "ok" | "brass";
  durationInFrames?: number;
}> = ({ bg, kicker = "", caption = "", likes = 214, spots = [], stamp = "", color = "danger", durationInFrames }) => {
  const frame = useCurrentFrame();
  const { durationInFrames: seq } = useVideoConfig();
  const D = Math.max(30, durationInFrames ?? seq);
  const t = frame / D;
  const col = color === "danger" ? V.dangerSoft : color === "ok" ? V.ok : V.brassSoft;
  const up = interpolate(t, [0, 0.12], [0, 1], ease);
  const nLikes = Math.round(likes * interpolate(t, [0.05, 0.3], [0.05, 1], ease));
  const scan = interpolate(t, [0.22, 0.46], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const st = clamp01((t - 0.74) / 0.1);
  // tarjeta 16:9 centrada: 1180 x 664 de foto
  const W = 1180, H = 664, X = (1920 - W) / 2, Y = 150 + (1 - up) * 80;
  return (
    <AbsoluteFill>
      <WorldBed src={bg} push={0.06} dim={0.55} durationInFrames={D} />
      <AbsoluteFill style={{ backdropFilter: "blur(18px)" }} />
      <div style={{ position: "absolute", left: X - 24, top: Y - 92, width: W + 48, height: H + 200, borderRadius: 26, background: "#FBFAF7", opacity: up, boxShadow: "0 30px 90px rgba(0,0,0,.6)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px 28px" }}>
          <div style={{ width: 52, height: 52, borderRadius: 26, background: "linear-gradient(135deg,#c9b8a0,#8f7f6a)" }} />
          <div style={{ width: 260, height: 18, borderRadius: 9, background: "#d9d4cb" }} />
          <div style={{ marginLeft: "auto", fontFamily: F_BODY, fontSize: 26, color: "#9a948a" }}>· · ·</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: X, top: Y, width: W, height: H, overflow: "hidden", opacity: up, borderRadius: 6 }}>
        {bg ? <Img src={staticFile(bg)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : null}
        {/* escáner */}
        {scan > 0 && scan < 1 ? <div style={{ position: "absolute", top: 0, bottom: 0, left: `${scan * 100}%`, width: 6, background: V.brassSoft, boxShadow: `0 0 40px 12px ${rgba(V.brass, 0.6)}` }} /> : null}
        <AbsoluteFill style={{ background: `rgba(10,10,12,${0.25 * clamp01((t - 0.3) / 0.2)})` }} />
        {spots.map((s, i) => {
          const a = clamp01((t - 0.3 - i * 0.09) / 0.07);
          const q = (frame / 30 + i * 0.3) % 1;
          return (
            <React.Fragment key={i}>
              <div style={{ position: "absolute", left: `${s.at[0]}%`, top: `${s.at[1]}%`, width: 130 + q * 60, height: 130 + q * 60, transform: "translate(-50%,-50%)", borderRadius: "50%", border: `5px solid ${rgba(col, a * (1 - q * 0.7))}` }} />
              <div style={{ position: "absolute", left: `${s.at[0]}%`, top: `calc(${s.at[1]}% + 80px)`, transform: `translate(-50%,0) scale(${0.8 + 0.2 * a})`, opacity: a, padding: "8px 18px", borderRadius: 10, background: col, color: "#fff", fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 30, letterSpacing: 1.5, whiteSpace: "nowrap", boxShadow: "0 6px 20px rgba(0,0,0,.5)" }}>{s.label}</div>
            </React.Fragment>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: X, top: Y + H + 18, width: W, opacity: up, display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ fontSize: 38, color: "#E0245E" }}>♥</div>
        <div style={{ fontFamily: F_BODY, fontWeight: 700, fontSize: 30, color: "#222" }}>{nLikes}</div>
        <div style={{ fontFamily: F_BODY, fontSize: 30, color: "#333", marginLeft: 18, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{caption}</div>
      </div>
      <Tag kicker={kicker} a={interpolate(t, [0, 0.08], [0, 1], ease)} />
      {stamp ? <Stamp text={stamp} color={col} p={st} x={50} y={46} size={120} rot={-9} /> : null}
    </AbsoluteFill>
  );
};
