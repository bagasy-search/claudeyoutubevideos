// RoweFiles.tsx — piezas de EXPEDIENTE de "THE ROWE FILES" (rfsoap): carpeta manila, ficha clipada,
// sello de goma, fichas índice. Mismo lenguaje de profundidad que RoweDepth (Atmosphere/Finish/useCam).
// ⛔ Todo asset por props (sin defaults de archivo → nada 404ea). ⛔ Sin Math.random. ⛔ Sin backdrop-filter.
import React from "react";
import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba, CL, ramp, spr, src, Atmosphere, Finish, Plane, GlassPhoto, useCam, KickerRule } from "./RoweDepth";

export const P = {
  manila: "#E6CF9C", manilaDark: "#C9AD72", paper: "#F6F0E2", ink: "#23201B", inkSoft: "#5A5246",
  stamp: "#C23A2E", tab: "#D9BF86",
};
const TYPE = "'Courier New', Courier, monospace";

/** Sello de goma que golpea (escala 2.2→1 con rebote) y queda torcido. */
export const RubberStamp: React.FC<{ text: string; u: number; rot?: number; size?: number; color?: string }> = ({ text, u, rot = -8, size = 58, color = P.stamp }) => {
  const s = 2.3 - 1.3 * Math.min(1, u) + (u > 1 ? 0 : 0);
  return (
    <div style={{
      opacity: Math.min(1, u * 1.6), transform: `rotate(${rot}deg) scale(${s.toFixed(3)})`,
      border: `6px solid ${rgba(color, 0.9)}`, borderRadius: 10, padding: "8px 26px",
      fontFamily: F_DISPLAY, fontWeight: 800, fontSize: size, letterSpacing: 3, textTransform: "uppercase",
      color: rgba(color, 0.92), boxShadow: `inset 0 0 0 3px ${rgba(color, 0.25)}`, whiteSpace: "nowrap",
      maskImage: "repeating-linear-gradient(35deg, #000 0 7px, rgba(0,0,0,0.78) 7px 9px)",
    }}>{text}</div>
  );
};

const PaperClip: React.FC<{ h?: number }> = ({ h = 120 }) => (
  <svg width={h * 0.36} height={h} viewBox="0 0 36 100" style={{ overflow: "visible", filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.45))" }}>
    <path d="M10 88 V18 a8 8 0 0 1 16 0 V78 a13 13 0 0 1 -26 0 V26" fill="none" stroke="#B9C2CC" strokeWidth="4.2" strokeLinecap="round" />
    <path d="M10 88 V18 a8 8 0 0 1 16 0" fill="none" stroke="#EEF2F6" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
  </svg>
);

/** CASE FILE — la carpeta manila entra, se abre y muestra la ficha de la paciente con su foto clipada;
 *  los renglones se tipean a sus tiempos (atP) y el sello golpea en stampAt. */
export const CaseFile: React.FC<{
  caseNo?: string; name?: string; age?: string; img?: string; bed?: string;
  rows?: { k: string; v: string; at?: number }[]; stamp?: string; stampAt?: number; durationInFrames?: number;
}> = ({ caseNo = "", name = "", age = "", img, bed, rows = [], stamp = "", stampAt = 99999, durationInFrames = 300 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cam = useCam(frame, fps, [stampAt], 0.05, durationInFrames);
  const slide = spr(frame, fps, 0, 140);
  const open = ramp(frame, 10, 34);
  const out = interpolate(frame, [durationInFrames - 9, durationInFrames], [1, 0], CL);
  const st = ramp(frame, stampAt, stampAt + 7);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Atmosphere frame={frame} img={bed} dim={0.6} camX={cam.camX} />
      <AbsoluteFill style={{ transform: `scale(${cam.scale.toFixed(4)})` }}>
        <Plane depth={0.6} camX={cam.camX}>
          <div style={{ position: "absolute", left: "50%", top: "53%", width: 1500, height: 820, transform: `translate(-50%,-50%) translateY(${((1 - slide) * 700).toFixed(1)}px) rotate(-1.2deg)` }}>
            {/* lomo trasero de la carpeta */}
            <div style={{ position: "absolute", inset: 0, borderRadius: 18, background: `linear-gradient(170deg, ${P.manila}, ${P.manilaDark})`, boxShadow: "0 40px 90px rgba(0,0,0,0.7)" }} />
            <div style={{ position: "absolute", left: 60, top: -46, width: 360, height: 60, borderRadius: "14px 14px 0 0", background: P.tab, display: "flex", alignItems: "center", paddingLeft: 24, fontFamily: TYPE, fontWeight: 700, fontSize: 26, color: P.ink, letterSpacing: 2 }}>THE ROWE FILES</div>
            {/* hoja con la ficha */}
            <div style={{ position: "absolute", left: 50, top: 40, right: 50, bottom: 36, background: P.paper, borderRadius: 6, boxShadow: "0 6px 20px rgba(0,0,0,0.25)", padding: "44px 60px", display: "flex", gap: 56 }}>
              <div style={{ position: "relative", flex: "0 0 470px" }}>
                <div style={{ position: "absolute", left: 30, top: -26, zIndex: 3 }}><PaperClip h={130} /></div>
                <div style={{ transform: `rotate(${(2.5 - open * 1).toFixed(2)}deg)`, background: "#fff", padding: 14, paddingBottom: 54, boxShadow: "0 12px 30px rgba(0,0,0,0.35)" }}>
                  {img ? <Img src={src(img)} style={{ width: 442, height: 520, objectFit: "cover", display: "block" }} /> : <div style={{ width: 442, height: 520, background: "#ddd" }} />}
                  <div style={{ fontFamily: TYPE, fontSize: 26, color: P.inkSoft, marginTop: 10, textAlign: "center" }}>{name}{age ? `, ${age}` : ""}</div>
                </div>
              </div>
              <div style={{ flex: 1, position: "relative" }}>
                <div style={{ fontFamily: TYPE, fontWeight: 700, fontSize: 30, color: P.inkSoft, letterSpacing: 4 }}>CASE FILE {caseNo}</div>
                <div style={{ fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 96, color: P.ink, lineHeight: 1, marginTop: 10, opacity: open }}>{name}</div>
                <div style={{ height: 3, background: rgba(P.ink, 0.5), margin: "18px 0 22px", width: `${(open * 100).toFixed(0)}%` }} />
                {rows.map((r, i) => {
                  const at = r.at ?? 30 + i * 18;
                  const n = Math.max(0, Math.floor((frame - at) * 1.6));
                  const txt = r.v.slice(0, n);
                  return (
                    <div key={i} style={{ display: "flex", gap: 20, fontFamily: TYPE, fontSize: 36, color: P.ink, marginBottom: 20, opacity: frame >= at ? 1 : 0 }}>
                      <div style={{ flex: "0 0 250px", color: P.inkSoft, fontSize: 28, paddingTop: 6, letterSpacing: 1 }}>{r.k.toUpperCase()}</div>
                      <div style={{ fontWeight: 700, borderBottom: `2px dotted ${rgba(P.ink, 0.35)}`, flex: 1, minHeight: 46 }}>{txt}</div>
                    </div>
                  );
                })}
                {stamp ? <div style={{ position: "absolute", right: 0, bottom: 10 }}><RubberStamp text={stamp} u={st} /></div> : null}
              </div>
            </div>
          </div>
        </Plane>
      </AbsoluteFill>
      <Finish frame={frame} camX={cam.camX} />
    </AbsoluteFill>
  );
};

/** SOAP ANATOMY — objeto héroe en 2.5D (la barra) con etiquetas que llegan con línea a sus tiempos. */
export const SoapAnatomy: React.FC<{
  kicker?: string; title?: string; img?: string; bed?: string;
  tags?: { text: string; at?: number; ok?: boolean }[]; durationInFrames?: number;
}> = ({ kicker = "", title = "", img, bed, tags = [], durationInFrames = 300 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hits = tags.map((t) => t.at ?? 0);
  const cam = useCam(frame, fps, hits, 0.04, durationInFrames);
  const a = spr(frame, fps, 0, 130);
  const out = interpolate(frame, [durationInFrames - 9, durationInFrames], [1, 0], CL);
  const tilt = Math.sin(frame / 70) * 4;
  const POS = [[-560, -210], [560, -210], [-560, 190], [560, 190], [0, 330]];
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Atmosphere frame={frame} img={bed} dim={0.62} camX={cam.camX} />
      <div style={{ position: "absolute", top: 70, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: a }}>
        <div style={{ textAlign: "center" }}>
          <KickerRule text={kicker} a={a} center />
          <div style={{ fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 70, color: V.white, textShadow: "0 6px 30px rgba(0,0,0,0.9)", marginTop: 6 }}>{title}</div>
        </div>
      </div>
      <AbsoluteFill style={{ transform: `scale(${cam.scale.toFixed(4)})` }}>
        <Plane depth={1} camX={cam.camX}>
          <div style={{ position: "absolute", left: "50%", top: "56%", transform: `translate(-50%,-50%) perspective(1400px) rotateY(${tilt.toFixed(2)}deg) rotateX(${(6 - a * 6).toFixed(2)}deg) scale(${(0.8 + a * 0.2).toFixed(3)})` }}>
            <GlassPhoto img={img} w={720} h={470} radius={30} push={frame * 0.0004} />
          </div>
        </Plane>
        {tags.map((t, i) => {
          const at = t.at ?? 20 + i * 20;
          const u = spr(frame, fps, at, 120);
          const [x, y] = POS[i % POS.length];
          const col = t.ok === false ? V.danger : V.ok;
          return (
            <Plane key={i} depth={1.25} camX={cam.camX}>
              <svg style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", overflow: "visible" }}>
                <line x1={960} y1={600} x2={960 + x * u} y2={600 + y * u} stroke={rgba(V.white, 0.55)} strokeWidth={3} strokeDasharray="8 8" />
              </svg>
              <div style={{ position: "absolute", left: 960 + x, top: 600 + y, transform: `translate(-50%,-50%) scale(${(0.6 + 0.4 * u).toFixed(3)})`, opacity: Math.min(1, u * 1.5),
                background: P.paper, borderRadius: 8, padding: "14px 26px", boxShadow: "0 16px 40px rgba(0,0,0,0.6)", display: "flex", alignItems: "center", gap: 14, borderLeft: `10px solid ${col}` }}>
                <div style={{ fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 40, color: col }}>{t.ok === false ? "✕" : "✓"}</div>
                <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 44, color: P.ink, textTransform: "uppercase", whiteSpace: "nowrap" }}>{t.text}</div>
              </div>
            </Plane>
          );
        })}
      </AbsoluteFill>
      <Finish frame={frame} camX={cam.camX} />
    </AbsoluteFill>
  );
};

/** ZONE BOARD — tres fichas índice clavadas en el corcho: cada zona entra a su tiempo con su foto. */
export const ZoneBoard: React.FC<{
  kicker?: string; bed?: string; zones?: { n: string; title: string; sub: string; img?: string; at?: number; tone?: "ok" | "amber" | "danger" }[]; durationInFrames?: number;
}> = ({ kicker = "", bed, zones = [], durationInFrames = 300 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cam = useCam(frame, fps, zones.map((z) => z.at ?? 0), 0.04, durationInFrames);
  const a = ramp(frame, 0, 12);
  const out = interpolate(frame, [durationInFrames - 9, durationInFrames], [1, 0], CL);
  const COL = { ok: V.ok, amber: V.amber, danger: V.danger };
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Atmosphere frame={frame} img={bed} dim={0.66} camX={cam.camX} />
      <div style={{ position: "absolute", top: 64, left: 0, right: 0, display: "flex", justifyContent: "center" }}><KickerRule text={kicker} a={a} center /></div>
      <AbsoluteFill style={{ transform: `scale(${cam.scale.toFixed(4)})` }}>
        <Plane depth={1} camX={cam.camX}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 150, display: "flex", justifyContent: "center", gap: 44 }}>
            {zones.map((z, i) => {
              const at = z.at ?? 10 + i * 30;
              const u = spr(frame, fps, at, 110);
              const on = frame >= at;
              const rot = [-3, 1.5, -1.2][i % 3];
              const col = COL[z.tone || "ok"];
              return (
                <div key={i} style={{ width: 520, opacity: on ? Math.min(1, u * 1.4) : 0.0, transform: `translateY(${((1 - u) * 120).toFixed(1)}px) rotate(${rot}deg)`, background: P.paper, borderRadius: 6, padding: 18, boxShadow: "0 28px 60px rgba(0,0,0,0.6)", position: "relative" }}>
                  <div style={{ position: "absolute", left: "50%", top: -14, width: 30, height: 30, borderRadius: "50%", background: `radial-gradient(circle at 35% 35%, #ff8a7a, ${P.stamp})`, transform: "translateX(-50%)", boxShadow: "0 4px 8px rgba(0,0,0,0.5)" }} />
                  {z.img ? <Img src={src(z.img)} style={{ width: "100%", height: 330, objectFit: "cover", display: "block", borderRadius: 3 }} /> : null}
                  <div style={{ fontFamily: TYPE, fontWeight: 700, fontSize: 28, color: col, marginTop: 16, letterSpacing: 3 }}>{z.n}</div>
                  <div style={{ fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 52, color: P.ink, lineHeight: 1.02, marginTop: 4, textTransform: "uppercase" }}>{z.title}</div>
                  <div style={{ height: 6, width: 90, background: col, margin: "12px 0" }} />
                  <div style={{ fontFamily: F_BODY, fontWeight: 600, fontSize: 30, color: P.inkSoft, lineHeight: 1.25 }}>{z.sub}</div>
                </div>
              );
            })}
          </div>
        </Plane>
      </AbsoluteFill>
      <Finish frame={frame} camX={cam.camX} />
    </AbsoluteFill>
  );
};

/** FILE CTA — la carpeta de las guías: portadas en abanico + páginas que pasan + QR REAL grande sobre
 *  blanco con el dominio legible. El QR entra a los ~0,5 s y queda quieto (sin escala) hasta el final. */
export const FileCta: React.FC<{
  eyebrow?: string; title?: string; lines?: string[]; covers?: string[]; pages?: string[]; qr?: string; domain?: string; bed?: string; durationInFrames?: number;
}> = ({ eyebrow = "", title = "", lines = [], covers = [], pages = [], qr, domain = "", bed, durationInFrames = 300 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = spr(frame, fps, 0, 130);
  const out = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], CL);
  const qa = ramp(frame, 8, 20);
  const per = Math.max(40, Math.floor((durationInFrames - 30) / Math.max(1, pages.length)));
  const camX = Math.sin(frame / 90) * 10;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Atmosphere frame={frame} img={bed} dim={0.66} camX={camX} />
      {/* izquierda: portadas en abanico + página que pasa */}
      <Plane depth={0.8} camX={camX}>
        <div style={{ position: "absolute", left: 110, top: 200, width: 900, height: 760 }}>
          {pages.map((p, i) => {
            const t0 = 20 + i * per;
            const u = ramp(frame, t0, t0 + 16);
            const gone = ramp(frame, t0 + per - 6, t0 + per + 10);
            if (frame < t0 - 2 || gone >= 1) return null;
            return <Img key={`p${i}`} src={src(p)} style={{ position: "absolute", left: 470, top: 40, width: 420, height: 544, objectFit: "cover", borderRadius: 4, boxShadow: "0 20px 50px rgba(0,0,0,0.6)", opacity: u * (1 - gone), transform: `rotate(${(4 - u * 2).toFixed(2)}deg) translateX(${((1 - u) * 80 - gone * 60).toFixed(1)}px)` }} />;
          })}
          {covers.map((c, i) => {
            const u = spr(frame, fps, 4 + i * 5, 120);
            const rot = (-14 + i * 12) * u;
            return <Img key={`c${i}`} src={src(c)} style={{ position: "absolute", left: 40 + i * 130, top: 110 + Math.abs(i - 1) * 24, width: 360, height: 540, objectFit: "cover", borderRadius: 6, boxShadow: "0 30px 70px rgba(0,0,0,0.7)", opacity: Math.min(1, u * 1.4), transform: `rotate(${rot.toFixed(2)}deg) translateY(${((1 - u) * 200).toFixed(1)}px)` }} />;
          })}
        </div>
      </Plane>
      {/* derecha: texto + QR (plano fijo, sin parallax para que el código quede nítido) */}
      <div style={{ position: "absolute", right: 110, top: 90, width: 700, opacity: a }}>
        <div style={{ fontFamily: TYPE, fontWeight: 700, fontSize: 28, color: P.manila, letterSpacing: 4 }}>{eyebrow}</div>
        <div style={{ fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 78, color: V.white, lineHeight: 1, marginTop: 8, textShadow: "0 6px 30px rgba(0,0,0,0.9)" }}>{title}</div>
        {lines.map((l, i) => (
          <div key={i} style={{ fontFamily: F_BODY, fontWeight: 600, fontSize: 30, color: V.bone, marginTop: 10, opacity: ramp(frame, 12 + i * 8, 24 + i * 8) }}>• {l}</div>
        ))}
        <div style={{ marginTop: 26, display: "flex", alignItems: "center", gap: 28, opacity: qa }}>
          <div style={{ background: "#FFFFFF", padding: 20, borderRadius: 14, boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}>
            {qr ? <Img src={src(qr)} style={{ width: 380, height: 380, display: "block", imageRendering: "pixelated" }} /> : null}
          </div>
          <div style={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 30, color: P.manila, lineHeight: 1.2 }}>SCAN<br />THE CODE</div>
        </div>
        <div style={{ marginTop: 18, fontFamily: F_BODY, fontWeight: 800, fontSize: 36, color: V.white, background: rgba("#000", 0.55), padding: "10px 18px", borderRadius: 8, display: "inline-block", opacity: qa }}>{domain}</div>
      </div>
      <Finish frame={frame} camX={camX} />
    </AbsoluteFill>
  );
};

/** FILE TAG — overlay (no tapa): pestaña de expediente abajo a la izquierda con un rótulo corto. */
export const FileTag: React.FC<{ label?: string; text?: string; durationInFrames?: number }> = ({ label = "THE ROWE FILES", text = "", durationInFrames = 150 }) => {
  const frame = useCurrentFrame();
  const a = ramp(frame, 0, 10);
  const out = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], CL);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: out }}>
      <div style={{ position: "absolute", left: 90, bottom: 90, transform: `translateX(${((1 - a) * -60).toFixed(1)}px)`, opacity: a }}>
        <div style={{ display: "inline-block", background: P.tab, padding: "8px 22px", borderRadius: "10px 10px 0 0", fontFamily: TYPE, fontWeight: 700, fontSize: 24, color: P.ink, letterSpacing: 3 }}>{label}</div>
        <div style={{ background: P.paper, padding: "16px 30px", borderRadius: "0 10px 10px 10px", boxShadow: "0 18px 40px rgba(0,0,0,0.6)", fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 54, color: P.ink, textTransform: "uppercase", whiteSpace: "nowrap" }}>{text}</div>
      </div>
    </AbsoluteFill>
  );
};
