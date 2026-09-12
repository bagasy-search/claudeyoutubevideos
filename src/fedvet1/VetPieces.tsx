// VetPieces.tsx — kit visual de "Federer Veterinario".
//
// LOOK: fondo oscuro cinematográfico (el avatar y el b-roll mandan) + TARJETAS CLARAS de papel
// clínico con tinta oscura. El público es +60: tinta oscura sobre claro da ~14:1 de contraste
// contra 7-8:1 del oscuro, y eso no es cosmético, es legibilidad real.
//
// ⛔ SOLO OffthreadVideo, nunca <Video> — es la causa #1 del "se ve lageado" en el render.
// ⛔ NINGÚN componente tiene texto por defecto. Todo el copy entra por prop OBLIGATORIA. Así es
//    imposible que se cuele el texto de otro video/canal (el bug del componente que se ve LLENO
//    y está mal, que pasa todas las compuertas porque hay algo escrito en pantalla).
// ⛔ Todo componente full-screen lleva CAMA DE FOTO debajo: sin eso se ve el fondo plano en el
//    marco de ~60px que dejan los componentes.
import {
  AbsoluteFill, Img, OffthreadVideo, staticFile,
  useCurrentFrame, interpolate, Easing, spring, useVideoConfig,
} from "remotion";

// ── paleta ───────────────────────────────────────────────────────────────────
const NEGRO = "#0A0F10";
const PAPEL = "#FBF8F2";
const TINTA = "#0B2B2E";
const TINTA2 = "#4A5C5E";
const TEAL = "#0F4A42";
const AMBAR = "#C77A28";
const SANS = "Inter, Segoe UI, system-ui, sans-serif";

const ease = { extrapolateRight: "clamp" as const, easing: Easing.out(Easing.cubic) };
const sombra = "0 26px 70px rgba(0,0,0,0.55)";

// cama de foto: va DEBAJO de todo componente full-screen
const Cama: React.FC<{ img?: string }> = ({ img }) => (
  <AbsoluteFill style={{ backgroundColor: NEGRO }}>
    {img ? (
      <Img
        src={staticFile(img.replace(/\.(png|jpe?g)$/i, "_blur.jpg"))}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.55 }}
      />
    ) : null}
    <AbsoluteFill style={{ background: "radial-gradient(120% 90% at 50% 45%, rgba(0,0,0,0.25), rgba(0,0,0,0.85))" }} />
  </AbsoluteFill>
);

// ── VetPhoto — foto full-screen con Ken-Burns subpíxel ───────────────────────
export const VetPhoto: React.FC<{ durationInFrames: number; img: string; i?: number }> = ({
  durationInFrames, img, i = 0,
}) => {
  const f = useCurrentFrame();
  const blur = img.replace(/\.(png|jpe?g)$/i, "_blur.jpg");
  const p = interpolate(f, [0, durationInFrames], [0, 1], { extrapolateRight: "clamp" });
  const zoom = i % 2 === 0 ? 1.02 + 0.065 * p : 1.085 - 0.065 * p;
  const panX = (i % 3 === 0 ? 1 : -1) * 1.3 * p;
  const panY = (i % 2 === 0 ? -1 : 1) * 0.9 * p;
  return (
    <AbsoluteFill style={{ backgroundColor: NEGRO, overflow: "hidden" }}>
      <Img src={staticFile(blur)} style={{ position: "absolute", inset: -40, width: "calc(100% + 80px)", height: "calc(100% + 80px)", objectFit: "cover", transform: "scale(1.15)", opacity: 0.9 }} />
      <Img src={staticFile(img)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom.toFixed(4)}) translate(${panX.toFixed(2)}%, ${panY.toFixed(2)}%)`, transformOrigin: "center center" }} />
    </AbsoluteFill>
  );
};

// ── VetClip — clip full-screen, muteado ──────────────────────────────────────
export const VetClip: React.FC<{ durationInFrames: number; src: string }> = ({ src }) => (
  <AbsoluteFill style={{ backgroundColor: NEGRO, overflow: "hidden" }}>
    <OffthreadVideo src={staticFile(src)} muted style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
  </AbsoluteFill>
);

// ── VetFrase — remate cinético, palabra por palabra, en OVERLAY ──────────────
export const VetFrase: React.FC<{ durationInFrames: number; palabras: string[]; resalta?: number }> = ({
  durationInFrames, palabras, resalta = -1,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const out = interpolate(f, [durationInFrames - 10, durationInFrames], [1, 0], { extrapolateLeft: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 120, pointerEvents: "none" }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 18px", maxWidth: 1500, opacity: out }}>
        {palabras.map((w, i) => {
          const s = spring({ frame: f - i * 3, fps, config: { damping: 200 }, durationInFrames: 14 });
          const on = i === resalta;
          return (
            <span key={i} style={{
              fontFamily: SANS, fontWeight: 900, fontSize: 78, lineHeight: 1.12,
              color: on ? AMBAR : PAPEL,
              textShadow: "0 6px 30px rgba(0,0,0,0.9), 0 2px 6px rgba(0,0,0,0.9)",
              opacity: s, transform: `translateY(${(1 - s) * 26}px)`,
            }}>{w}</span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ── VetZonas — el anillo de tarjetas de las 5 zonas del cuerpo ───────────────
// La tarjeta del índice `foco` ATERRIZA al frente, grande y con su rótulo; las otras quedan
// atrás, en perspectiva y desaturadas. Es el componente-ESCENA del tramo del mapa.
export const VetZonas: React.FC<{
  durationInFrames: number; cards: { titulo: string; img: string }[]; foco: number;
  intro?: boolean; rotulo: string; cama?: string;
}> = ({ durationInFrames, cards, foco, intro = false, rotulo, cama }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const llegada = spring({ frame: f, fps, config: { damping: 26, mass: 0.9 }, durationInFrames: intro ? 34 : 22 });
  const p = interpolate(f, [0, durationInFrames], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Cama img={cama} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", perspective: 1600 }}>
        {cards.map((c, i) => {
          const d = i - foco;
          const t = llegada;
          const x = d * interpolate(t, [0, 1], [520, 430]);
          const z = -Math.abs(d) * 260;
          const rot = d * -11;
          const esFoco = i === foco;
          const scale = (esFoco ? 1 : 0.78) * interpolate(t, [0, 1], [0.9, 1]);
          return (
            <div key={i} style={{
              position: "absolute",
              transform: `translateX(${x.toFixed(1)}px) translateZ(${z}px) rotateY(${rot}deg) scale(${scale.toFixed(3)}) translateY(${(esFoco ? -8 : 0) + Math.sin((p * 2 + i) * Math.PI) * 5}px)`,
              opacity: esFoco ? 1 : 0.42,
              filter: esFoco ? "none" : "saturate(0.5) blur(1.5px)",
              borderRadius: 24, overflow: "hidden", background: PAPEL,
              boxShadow: esFoco ? "0 34px 90px rgba(0,0,0,0.7)" : "0 16px 40px rgba(0,0,0,0.5)",
              border: esFoco ? `4px solid ${AMBAR}` : `3px solid rgba(251,248,242,0.35)`,
              width: 520, padding: 14,
            }}>
              <Img src={staticFile(c.img)} style={{ width: "100%", height: 300, objectFit: "cover", borderRadius: 14, display: "block" }} />
              <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: esFoco ? 34 : 28, color: TINTA, padding: "14px 6px 6px", textAlign: "center", lineHeight: 1.15 }}>
                {c.titulo}
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 88, textAlign: "center",
        fontFamily: SANS, fontWeight: 900, fontSize: 56, color: PAPEL,
        textShadow: "0 6px 30px rgba(0,0,0,0.95)", opacity: llegada,
      }}>{rotulo}</div>
    </AbsoluteFill>
  );
};

// ── VetPizarra — el MECANISMO, construido elemento por elemento ──────────────
// Se usa SOLO en los beats de "por qué funciona" (2-3 por video). Si se repite, pierde impacto.
export const VetPizarra: React.FC<{
  durationInFrames: number; titulo: string; pasos: { texto: string; img?: string }[]; cama?: string;
}> = ({ durationInFrames, titulo, pasos, cama }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tIn = spring({ frame: f, fps, config: { damping: 200 }, durationInFrames: 16 });
  return (
    <AbsoluteFill>
      <Cama img={cama} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{
          width: 1620, background: PAPEL, borderRadius: 28, padding: "44px 56px 52px",
          boxShadow: sombra, border: `4px solid ${TEAL}`, opacity: tIn,
          transform: `translateY(${(1 - tIn) * 22}px)`,
        }}>
          <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 52, color: TINTA, marginBottom: 34, letterSpacing: -0.5 }}>
            {titulo}
          </div>
          <div style={{ display: "flex", gap: 26, alignItems: "stretch" }}>
            {pasos.map((s, i) => {
              const a = spring({ frame: f - 14 - i * 12, fps, config: { damping: 200 }, durationInFrames: 16 });
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14, opacity: a, transform: `translateY(${(1 - a) * 18}px)` }}>
                  {s.img ? (
                    <Img src={staticFile(s.img)} style={{ width: "100%", height: 232, objectFit: "cover", borderRadius: 16, border: `3px solid ${TEAL}22` }} />
                  ) : null}
                  <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{
                      minWidth: 46, height: 46, borderRadius: 23, background: TEAL, color: PAPEL,
                      fontFamily: SANS, fontWeight: 900, fontSize: 26,
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>{i + 1}</div>
                    <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 30, color: TINTA, lineHeight: 1.28 }}>
                      {s.texto}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── VetReloj — la línea del día con el cabezal sobre el momento que se nombra ─
export const VetReloj: React.FC<{
  durationInFrames: number; marcas: { hora: string; que: string }[]; foco: number; cama?: string;
}> = ({ durationInFrames, marcas, foco, cama }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: f, fps, config: { damping: 30 }, durationInFrames: 26 });
  const n = marcas.length;
  const px = (i: number) => 200 + (1520 * i) / Math.max(1, n - 1);
  const cabezal = interpolate(t, [0, 1], [px(Math.max(0, foco - 1)), px(foco)]);
  return (
    <AbsoluteFill>
      <Cama img={cama} />
      <AbsoluteFill style={{ justifyContent: "center" }}>
        <div style={{ position: "relative", height: 420 }}>
          <div style={{ position: "absolute", left: 200, right: 200, top: 210, height: 6, background: "rgba(251,248,242,0.30)", borderRadius: 3 }} />
          <div style={{ position: "absolute", left: 200, top: 210, height: 6, width: Math.max(0, cabezal - 200), background: AMBAR, borderRadius: 3 }} />
          {marcas.map((m, i) => {
            const on = i === foco;
            const pasado = i < foco;
            return (
              <div key={i} style={{ position: "absolute", left: px(i), top: 0, transform: "translateX(-50%)", width: 300, textAlign: "center" }}>
                <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: on ? 40 : 30, color: on ? PAPEL : "rgba(251,248,242,0.55)", textShadow: "0 4px 20px rgba(0,0,0,0.9)", marginBottom: 18 }}>
                  {m.hora}
                </div>
                <div style={{
                  width: on ? 34 : 20, height: on ? 34 : 20, borderRadius: 20, margin: "0 auto",
                  background: on ? AMBAR : pasado ? AMBAR : "rgba(251,248,242,0.45)",
                  boxShadow: on ? `0 0 0 10px ${AMBAR}33` : "none",
                  transform: `translateY(${on ? 195 - 17 : 200 - 10}px)`, position: "absolute", left: "50%", marginLeft: on ? -17 : -10, top: 0,
                }} />
                <div style={{
                  marginTop: 250, fontFamily: SANS, fontWeight: on ? 800 : 600, fontSize: on ? 32 : 24,
                  color: on ? TINTA : TINTA2, background: on ? PAPEL : "rgba(251,248,242,0.72)",
                  borderRadius: 14, padding: "12px 14px", lineHeight: 1.22,
                  boxShadow: on ? sombra : "0 10px 30px rgba(0,0,0,0.35)",
                  opacity: on ? 1 : 0.85,
                }}>{m.que}</div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── VetSenal — tarjeta flotante de señal numerada, con su foto ───────────────
export const VetSenal: React.FC<{
  durationInFrames: number; numero: number; titulo: string; sub: string; img: string; cama?: string;
}> = ({ durationInFrames, numero, titulo, sub, img, cama }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: f, fps, config: { damping: 26 }, durationInFrames: 22 });
  const p = interpolate(f, [0, durationInFrames], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Cama img={cama} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{
          display: "flex", gap: 0, width: 1500, borderRadius: 26, overflow: "hidden",
          background: PAPEL, boxShadow: sombra, opacity: t,
          transform: `translateY(${(1 - t) * 30}px) scale(${(0.97 + 0.03 * t).toFixed(3)})`,
        }}>
          <div style={{ width: 660, overflow: "hidden", flexShrink: 0 }}>
            <Img src={staticFile(img)} style={{ width: "100%", height: 470, objectFit: "cover", display: "block", transform: `scale(${(1.03 + 0.05 * p).toFixed(4)})` }} />
          </div>
          <div style={{ flex: 1, padding: "44px 46px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 62, height: 62, borderRadius: 31, background: AMBAR, color: PAPEL, fontFamily: SANS, fontWeight: 900, fontSize: 34, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {numero}
              </div>
              <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 22, letterSpacing: 2.4, color: TEAL, textTransform: "uppercase" }}>
                Señal
              </div>
            </div>
            <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 50, color: TINTA, lineHeight: 1.12 }}>{titulo}</div>
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 31, color: TINTA2, lineHeight: 1.3 }}>{sub}</div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── VetMito — lo que la gente cree ✕ contra lo que pasa ✓ ────────────────────
// ⛔ El lado tachado NO se atenúa con opacidad: sobre papel claro queda gris ilegible. La jerarquía
//    se hace con TAMAÑO y COLOR de tinta — hay que poder LEER lo que se está descartando.
export const VetMito: React.FC<{
  durationInFrames: number; mito: string; verdad: string; etiquetaMito: string; etiquetaVerdad: string;
  imgMito?: string; imgVerdad?: string; cama?: string;
}> = ({ durationInFrames, mito, verdad, etiquetaMito, etiquetaVerdad, imgMito, imgVerdad, cama }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = spring({ frame: f, fps, config: { damping: 200 }, durationInFrames: 16 });
  const b = spring({ frame: f - 18, fps, config: { damping: 24 }, durationInFrames: 22 });
  const panel = (
    lado: "mito" | "verdad", etiqueta: string, texto: string, img: string | undefined, op: number, dx: number,
  ) => {
    const esMito = lado === "mito";
    const col = esMito ? "#A23B2C" : TEAL;
    return (
      <div style={{
        flex: 1, background: PAPEL, borderRadius: 24, overflow: "hidden", boxShadow: sombra,
        opacity: op, transform: `translateX(${dx}px)`, border: `4px solid ${col}`,
        display: "flex", flexDirection: "column",
      }}>
        {img ? <Img src={staticFile(img)} style={{ width: "100%", height: 250, objectFit: "cover", display: "block", filter: esMito ? "saturate(0.55)" : "none" }} /> : null}
        <div style={{ padding: "26px 32px 34px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 46, height: 46, borderRadius: 23, background: col, color: PAPEL, fontFamily: SANS, fontWeight: 900, fontSize: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {esMito ? "✕" : "✓"}
            </div>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 21, letterSpacing: 2.2, color: col, textTransform: "uppercase" }}>{etiqueta}</div>
          </div>
          <div style={{
            fontFamily: SANS, fontWeight: esMito ? 600 : 900, fontSize: esMito ? 34 : 42,
            color: esMito ? TINTA2 : TINTA, lineHeight: 1.2,
          }}>{texto}</div>
        </div>
      </div>
    );
  };
  return (
    <AbsoluteFill>
      <Cama img={cama} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 40, width: 1560 }}>
          {panel("mito", etiquetaMito, mito, imgMito, a, (1 - a) * -40)}
          {panel("verdad", etiquetaVerdad, verdad, imgVerdad, b, (1 - b) * 40)}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── VetPasos — las acciones numeradas, entrando de a una ─────────────────────
export const VetPasos: React.FC<{
  durationInFrames: number; titulo: string; pasos: string[]; foco: number; cama?: string;
}> = ({ durationInFrames, titulo, pasos, foco, cama }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: f, fps, config: { damping: 200 }, durationInFrames: 16 });
  return (
    <AbsoluteFill>
      <Cama img={cama} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ width: 1420, background: PAPEL, borderRadius: 28, padding: "42px 52px 46px", boxShadow: sombra, border: `4px solid ${TEAL}`, opacity: t, transform: `translateY(${(1 - t) * 20}px)` }}>
          <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 46, color: TINTA, marginBottom: 28 }}>{titulo}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {pasos.map((s, i) => {
              const on = i === foco;
              const a = spring({ frame: f - 10 - i * 7, fps, config: { damping: 200 }, durationInFrames: 14 });
              return (
                <div key={i} style={{
                  display: "flex", gap: 20, alignItems: "center", opacity: a,
                  transform: `translateX(${(1 - a) * 22}px)`,
                  background: on ? `${AMBAR}1A` : "transparent", borderRadius: 14, padding: "10px 14px",
                  borderLeft: on ? `7px solid ${AMBAR}` : "7px solid transparent",
                }}>
                  <div style={{ minWidth: 52, height: 52, borderRadius: 26, background: on ? AMBAR : TEAL, color: PAPEL, fontFamily: SANS, fontWeight: 900, fontSize: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
                  <div style={{ fontFamily: SANS, fontWeight: on ? 800 : 600, fontSize: on ? 36 : 32, color: on ? TINTA : TINTA2, lineHeight: 1.24 }}>{s}</div>
                </div>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── VetQr — CTA en OVERLAY. ⛔ NUNCA hardcodeado dentro de un componente de escena ──
export const VetQr: React.FC<{ durationInFrames: number; qr: string; dominio: string; pie: string }> = ({
  durationInFrames, qr, dominio, pie,
}) => {
  const f = useCurrentFrame();
  const inP = interpolate(f, [0, 14], [0, 1], ease);
  const outP = interpolate(f, [durationInFrames - 14, durationInFrames], [1, 0], { extrapolateLeft: "clamp" });
  const op = Math.min(inP, outP);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{
        position: "absolute", right: 64, bottom: 64, opacity: op,
        transform: `translateY(${(1 - inP) * 26}px)`,
        background: PAPEL, borderRadius: 22, padding: 20, boxShadow: sombra,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
        border: `4px solid ${TEAL}`,
      }}>
        <Img src={staticFile(qr)} style={{ width: 210, height: 210, borderRadius: 8 }} />
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 25, color: TEAL, letterSpacing: 0.3 }}>{dominio}</div>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 17, color: AMBAR }}>{pie}</div>
      </div>
    </AbsoluteFill>
  );
};
