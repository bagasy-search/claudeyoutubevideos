// CaseFile.tsx — THE ROWE FILES: la carpeta clínica de la paciente que se ABRE (set-piece de expediente).
// Carpeta manila en 2.5D sobre la foto real desenfocada → la tapa gira sobre su bisagra → adentro, la
// foto de la paciente sujeta con un clip + la ficha mecanografiada cuyas líneas aparecen EN la frase
// (`fields[].at`, frames relativos) → sello rojo que golpea (`stampAt`).
// ⛔ Todo texto/imagen por props (sin defaults de otro video). ⛔ Sin Math.random.
import React from "react";
import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba, CL, ramp, spr, src, Atmosphere, Finish, Plane, useCam } from "./RoweDepth";

const PAPER = "#EFE6CF";
const MANILA = "#D9BE83";
const INK = "#2A2620";
const MONO = "'Courier New', Courier, monospace";

export const CaseFile: React.FC<{
  caseNo?: string;
  img?: string;
  bed?: string;
  fields?: { label: string; value: string; at?: number }[];
  stamp?: string;
  stampAt?: number;
  durationInFrames?: number;
}> = ({ caseNo = "", img, bed, fields = [], stamp = "", stampAt = 9999, durationInFrames = 240 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = durationInFrames;
  const cam = useCam(frame, fps, [stampAt], 0.05, dur);
  const folderIn = spr(frame, fps, 0, 130, 0.9);
  const open = ramp(frame, 12, 34);
  const photoIn = spr(frame, fps, 26, 120, 0.8);
  const stampK = ramp(frame, stampAt, stampAt + 6);
  const out = ramp(frame, dur - 9, dur);

  return (
    <AbsoluteFill style={{ opacity: 1 - out * 0.9, filter: out > 0.01 ? `blur(${(out * 10).toFixed(1)}px)` : undefined }}>
      <Atmosphere frame={frame} img={bed ?? img} blur={20} dim={0.64} bokeh={8} seed={41} camX={cam.camX} tint={V.amber} />
      <AbsoluteFill style={{ transform: `scale(${cam.scale.toFixed(4)})`, transformOrigin: "50% 55%" }}>
        <Plane depth={0.7} camX={cam.camX} camY={cam.camY} z={2}>
          <div style={{
            position: "absolute", left: 210, top: 120, width: 1500, height: 860, perspective: 2400,
            opacity: folderIn, transform: `translateY(${((1 - folderIn) * 180).toFixed(1)}px) rotateX(${((1 - folderIn) * 12 + 6).toFixed(2)}deg)`,
          }}>
            {/* pestaña */}
            <div style={{ position: "absolute", left: 60, top: -58, width: 520, height: 70, background: MANILA, borderRadius: "16px 16px 0 0", boxShadow: "0 -4px 12px rgba(0,0,0,0.25)", display: "flex", alignItems: "center", paddingLeft: 26 }}>
              <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 30, letterSpacing: 4, color: INK }}>THE ROWE FILES</div>
              <div style={{ marginLeft: 16, fontFamily: MONO, fontWeight: 700, fontSize: 24, color: "#7A2E22" }}>{caseNo}</div>
            </div>
            {/* interior (hoja) */}
            <div style={{ position: "absolute", inset: 0, background: MANILA, borderRadius: 14, boxShadow: "0 60px 120px rgba(0,0,0,0.6)" }}>
              <div style={{ position: "absolute", left: 40, top: 36, right: 40, bottom: 36, background: PAPER, borderRadius: 6, boxShadow: "inset 0 0 60px rgba(120,90,40,0.18)" }}>
                {/* líneas del papel */}
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} style={{ position: "absolute", left: 620, right: 50, top: 150 + i * 44, height: 1, background: rgba("#6F8FB0", 0.25) }} />
                ))}
                <div style={{ position: "absolute", left: 620, top: 50, fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 40, letterSpacing: 6, color: INK, opacity: ramp(frame, 22, 34) }}>PATIENT FILE</div>
                {/* foto con clip */}
                <div style={{
                  position: "absolute", left: 70, top: 70, width: 480, height: 600, background: "#fff", padding: 16, paddingBottom: 70,
                  boxShadow: "0 22px 40px rgba(0,0,0,0.35)", transform: `rotate(${(-3 + (1 - photoIn) * -8).toFixed(2)}deg) translateY(${((1 - photoIn) * -60).toFixed(1)}px)`, opacity: photoIn,
                }}>
                  {img ? <Img src={src(img)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : null}
                  <div style={{ position: "absolute", left: 60, top: -30, width: 44, height: 110, borderRadius: 22, border: `7px solid ${rgba("#9AA6B2", 0.95)}`, boxShadow: "0 4px 8px rgba(0,0,0,0.3)" }} />
                </div>
                {/* campos mecanografiados */}
                <div style={{ position: "absolute", left: 630, top: 138, right: 60 }}>
                  {fields.map((f, i) => {
                    const at = f.at ?? 30 + i * 12;
                    const k = ramp(frame, at, at + 8);
                    const chars = Math.floor(interpolate(frame, [at, at + 14], [0, f.value.length], CL));
                    return (
                      <div key={i} style={{ display: "flex", gap: 18, alignItems: "baseline", height: 88, opacity: k, transform: `translateX(${((1 - k) * 20).toFixed(1)}px)` }}>
                        <div style={{ fontFamily: F_BODY, fontWeight: 700, fontSize: 24, letterSpacing: 3, color: "#7A6A4A", width: 210, textTransform: "uppercase" }}>{f.label}</div>
                        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 44, color: INK, whiteSpace: "nowrap" }}>{f.value.slice(0, chars)}</div>
                      </div>
                    );
                  })}
                </div>
                {/* sello */}
                {stamp ? (
                  <div style={{
                    position: "absolute", right: 70, bottom: 60, padding: "14px 34px", border: "8px solid #B0322A", borderRadius: 12,
                    fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 64, letterSpacing: 6, color: "#B0322A",
                    opacity: stampK * 0.9, transform: `rotate(-9deg) scale(${interpolate(stampK, [0, 1], [2.2, 1]).toFixed(3)})`,
                    mixBlendMode: "multiply",
                  }}>{stamp}</div>
                ) : null}
              </div>
            </div>
            {/* tapa que gira sobre la bisagra izquierda */}
            <div style={{
              position: "absolute", inset: 0, background: `linear-gradient(160deg, #E3C98E, ${MANILA})`, borderRadius: 14,
              transformOrigin: "0% 50%", transform: `rotateY(${(-open * 175).toFixed(2)}deg)`, backfaceVisibility: "hidden",
              boxShadow: "0 30px 60px rgba(0,0,0,0.4)", display: open > 0.55 ? "none" : "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 96, letterSpacing: 10, color: rgba(INK, 0.82) }}>THE ROWE FILES</div>
            </div>
          </div>
        </Plane>
      </AbsoluteFill>
      <Finish frame={frame} camX={cam.camX} seed={43} />
    </AbsoluteFill>
  );
};
