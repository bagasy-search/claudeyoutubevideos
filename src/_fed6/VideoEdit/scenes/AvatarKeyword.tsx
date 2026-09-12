import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, staticFile, OffthreadVideo } from "remotion";
import { Media } from "../components/Media";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

// ── AvatarKeyword (COMPONENTE NUEVO #2) ──────────────────────────────────────
// Avatar a pantalla completa; cuando dice una palabra/idea clave, el encuadre hace
// un ZOOM LEVE y se corre un poco (abre espacio a la derecha) y ahí aparece la
// PALABRA (o una imagen chica) — reforzando lo que dice. Cada ítem clavado a su `at`
// (ms exacto del avatar). Entre ítems: corte limpio (sin fusión).

const INTER = loadInter().fontFamily;
const C = { teal: "#12B3AE", cream: "#F5F9FA", ink: "#0E1B22" };

export type KwItem = { at: number; word: string; sub?: string; image?: string; tone?: "teal" | "warn" };

export const AvatarKeyword: React.FC<{
  durationInFrames: number;
  items: KwItem[];
  avatar: string;
  avatarFrom?: number;
}> = ({ durationInFrames, items, avatar, avatarFrom = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = Math.max(1, items.length);
  const starts = items.map((it) => it.at);
  // ¿hay un keyword activo? (dura ~2.6s cada uno o hasta el próximo)
  const HOLD = 78;
  let active = -1;
  for (let i = 0; i < n; i++) if (frame >= starts[i] && frame < (i + 1 < n ? starts[i + 1] : starts[i] + HOLD)) active = i;
  const it = active >= 0 ? items[active] : null;
  const local = active >= 0 ? frame - starts[active] : 0;

  // presencia del keyword (entra y sale) → el avatar reacciona con el zoom
  const HOLDLEN = active >= 0 ? Math.min(HOLD, (active + 1 < n ? starts[active + 1] : starts[active] + HOLD) - starts[active]) : 0;
  const inK = interpolate(local, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const outK = interpolate(local, [HOLDLEN - 12, HOLDLEN], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pres = it ? Math.min(inK, outK) : 0;
  const sp = spring({ frame: local, fps, config: { damping: 16, mass: 0.6, stiffness: 130 } });

  // ZOOM LEVE del avatar hacia la izquierda (abre espacio a la derecha)
  const scale = 1 + 0.06 * pres;
  const shiftX = -70 * pres;
  const tone = it?.tone === "warn" ? "#E4141B" : C.teal;

  return (
    <AbsoluteFill style={{ fontFamily: INTER, backgroundColor: C.ink }}>
      {/* AVATAR full-screen con push-in leve cuando hay keyword */}
      <AbsoluteFill style={{ transform: `translateX(${shiftX}px) scale(${scale})`, transformOrigin: "35% 50%" }}>
        <OffthreadVideo src={staticFile(avatar)} trimBefore={avatarFrom} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>

      {/* scrim suave a la derecha para que resalte la palabra */}
      <AbsoluteFill style={{ background: "linear-gradient(90deg, transparent 45%, rgba(14,27,34,0.0) 52%, rgba(14,27,34,0.72) 100%)", opacity: pres }} />

      {/* KEYWORD (palabra + opcional sub + opcional imagen) en el espacio derecho */}
      {it && (
        <div style={{ position: "absolute", right: 90, top: "50%", width: 700, transform: `translateY(-50%) translateX(${(1 - sp) * 40}px)`, opacity: pres, textAlign: "right" }}>
          {it.image && (
            <div style={{ width: 360, height: 240, marginLeft: "auto", marginBottom: 26, borderRadius: 22, overflow: "hidden", border: `3px solid ${tone}`, boxShadow: "0 20px 60px rgba(0,0,0,0.55)" }}>
              <Media src={it.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}
          <div style={{ fontSize: 96, fontWeight: 900, color: C.cream, lineHeight: 1.0, letterSpacing: -1.5, textShadow: "0 4px 26px rgba(0,0,0,0.6)" }}>{it.word}</div>
          {/* subrayado que se traza */}
          <div style={{ marginLeft: "auto", marginTop: 20, height: 8, borderRadius: 4, width: interpolate(sp, [0, 1], [0, 300]), background: `linear-gradient(90deg, rgba(18,179,174,0), ${tone})` }} />
          {it.sub && <div style={{ fontSize: 38, fontWeight: 600, color: "rgba(245,249,250,0.85)", marginTop: 18, lineHeight: 1.2 }}>{it.sub}</div>}
        </div>
      )}
    </AbsoluteFill>
  );
};
