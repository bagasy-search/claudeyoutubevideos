import React from "react";
import { Audio, Sequence, interpolate, staticFile } from "remotion";
import { Typed } from "./typewriter";
import { SPR, Theme, useTheme } from "./theme";
import {
  Card,
  ContactShadow,
  Display,
  Eyebrow,
  ImgOr,
  Motas,
  Panel,
  Stage,
  Support,
  Tick,
  kick,
  spread,
  useBeat,
  wob,
} from "./core";

// ═══════════════════════════════════════════════════════════════════════════
// FAMILIA: MEDIA — FramedPhoto · FloatingCutout · PhotoCarousel · SplitPanel
// ═══════════════════════════════════════════════════════════════════════════

// ── FramedPhoto — UNA foto protagonista con marco profundo, ken-burns y placa ─
export const FramedPhoto: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  image?: string;
  caption?: string;
  sub?: string;
  kenburns?: boolean;
  /** La placa se ESCRIBE letra por letra, con sonido de teclado suave (opt-in). */
  typewriter?: boolean;
  typeCps?: number;
  /** REVELADO POR PARTES: segundo (relativo al plano) en que aparece la placa de
   *  texto. La foto entra sola al principio y el texto llega cuando la voz lo dice.
   *  Default 0.73s = el comportamiento viejo (todo junto). */
  captionAt?: number;
  /** Intensidad del zoom de cámara. 0 = quieto · 1 = el de antes · 0.45 = ultra suave. */
  push?: number;
}> = ({ durationInFrames, theme, image, caption = "La primera cosecha, 1962", sub = "archivo familiar", kenburns = true, typewriter = false, typeCps = 26, captionAt, push = 1 }) => {
  const t = useTheme(theme);
  const { frame, fps, op } = useBeat(durationInFrames);
  const enterS = kick(frame, fps, 4, SPR.settle);
  const plateFrame = captionAt != null ? Math.round(captionAt * fps) : 22;
  const plateS = kick(frame, fps, plateFrame, SPR.snappy);
  const kb = kenburns ? interpolate(frame, [0, durationInFrames], [1.06, 1.06 + 0.08 * push], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
  const kbx = kenburns ? interpolate(frame, [0, durationInFrames], [0, -26 * push], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  return (
    <Stage theme={t} style={{ opacity: op }}>
      <Panel theme={t} style={{ position: "absolute", inset: 60 }} raysX={72}>
        <Motas theme={t} count={10} opacity={0.35} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "relative", opacity: enterS, transform: `scale(${0.94 + enterS * 0.06}) rotate(${(1 - enterS) * -1.5}deg)` }}>
            {/* triple marco: passe-partout + borde + foto */}
            <div
              style={{
                padding: 26,
                background: t.color.surfaceStrong,
                borderRadius: t.radius * 0.7,
                border: `2px solid ${t.color.line}`,
                boxShadow: `0 50px 90px ${t.color.shadow}, 0 12px 30px ${t.color.shadow}, inset 0 1px 0 rgba(255,255,255,0.4)`,
              }}
            >
              <div style={{ width: 1150, height: 640, overflow: "hidden", borderRadius: 6, border: `1.5px solid ${t.color.line}`, position: "relative" }}>
                <div style={{ position: "absolute", inset: 0, transform: `scale(${kb}) translateX(${kbx}px)` }}>
                  <ImgOr src={image} seed={8} theme={t} />
                </div>
                {/* luz de vitrina */}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 38%)" }} />
                <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 80px rgba(0,0,0,0.32)" }} />
              </div>
            </div>
            {/* placa museo */}
            <div style={{ position: "absolute", bottom: -34, left: 60, opacity: plateS, transform: `translateY(${(1 - plateS) * 16}px)` }}>
              <Card theme={t} strong accent={t.color.gold} style={{ padding: "16px 36px" }}>
                <Display theme={t} size={38}>
                  {typewriter ? <Typed text={caption} startFrame={plateFrame + 2} cps={typeCps} /> : caption}
                </Display>
                {sub && (
                  <Support theme={t} size={23}>
                    {typewriter ? <Typed text={sub} startFrame={plateFrame + 2 + Math.ceil((caption.length / typeCps) * fps) + 8} cps={typeCps} caret={false} /> : sub}
                  </Support>
                )}
              </Card>
            </div>
          </div>
        </div>
      </Panel>
    </Stage>
  );
};

// ── FloatingCutout — recorte PNG que FLOTA con rim light y sombra de contacto ─
export const FloatingCutout: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  image?: string;
  label?: string;
  sub?: string;
}> = ({ durationInFrames, theme, image, label = "Sulfato de cobre", sub = "el ingrediente que nadie nombra" }) => {
  const t = useTheme(theme);
  const { frame, fps, op } = useBeat(durationInFrames);
  const enterS = kick(frame, fps, 6, SPR.settle);
  const float = wob(3, frame, 0.8) * 10;
  const labS = kick(frame, fps, 20, SPR.snappy);
  return (
    <Stage theme={t} style={{ opacity: op }}>
      <Panel theme={t} style={{ position: "absolute", inset: 60 }} raysX={30}>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 120 }}>
          <div style={{ position: "relative", width: 520, textAlign: "center" }}>
            {/* halo de rim light detrás */}
            <div style={{ position: "absolute", left: "50%", top: "42%", transform: "translate(-50%,-50%)", width: 480, height: 480, borderRadius: "50%", background: `radial-gradient(circle, ${t.color.glow} 0%, rgba(0,0,0,0) 65%)`, opacity: 0.8 * enterS }} />
            <div
              style={{
                position: "relative",
                width: 440,
                height: 500,
                margin: "0 auto",
                opacity: enterS,
                transform: `translateY(${(1 - enterS) * 60 + float}px) rotate(${wob(7, frame, 0.6) * 1.2}deg)`,
                filter: `drop-shadow(0 40px 44px ${t.color.shadow}) drop-shadow(0 0 26px ${t.color.glow})`,
              }}
            >
              {/* silueta recortada: octógono orgánico con la imagen adentro */}
              <div style={{ width: "100%", height: "100%", clipPath: "polygon(30% 2%, 72% 6%, 96% 30%, 98% 66%, 78% 94%, 36% 98%, 6% 76%, 2% 34%)", overflow: "hidden", border: "none" }}>
                <ImgOr src={image} seed={17} theme={t} />
              </div>
              <svg viewBox="0 0 440 500" width={440} height={500} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                <polygon
                  points="132,10 317,30 422,150 431,330 343,470 158,490 26,380 9,170"
                  fill="none"
                  stroke={t.color.ink}
                  strokeWidth={6}
                  strokeLinejoin="round"
                  opacity={0.9}
                />
              </svg>
            </div>
            <ContactShadow theme={t} width={360} opacity={0.55 - Math.abs(float) * 0.012} style={{ margin: "18px auto 0", transform: `scaleX(${1 - Math.abs(float) * 0.004})` }} />
          </div>
          <div style={{ maxWidth: 640, opacity: labS, transform: `translateX(${(1 - labS) * 30}px)` }}>
            <Eyebrow theme={t} size={28}>La pieza clave</Eyebrow>
            <Display theme={t} size={76} style={{ marginTop: 14 }}>{label}</Display>
            {sub && <Support theme={t} size={36} style={{ marginTop: 16 }}>{sub}</Support>}
          </div>
        </div>
      </Panel>
    </Stage>
  );
};

// ── PhotoCarousel — tira de fotos; la activa se ADELANTA, el resto atrás ─────
export type CarouselItem = { image?: string; label?: string };
export const PhotoCarousel: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  title?: string;
  items?: CarouselItem[];
  /** Dispara un obturador de cámara suave cuando aterriza cada instantánea (opt-in). */
  shutter?: boolean;
}> = ({
  durationInFrames,
  theme,
  shutter = false,
  title = "Los cuatro que probamos",
  items = [{ label: "Cal viva" }, { label: "Bórax" }, { label: "Vinagre" }, { label: "Ceniza" }],
}) => {
  const t = useTheme(theme);
  const { frame, fps, op } = useBeat(durationInFrames);
  const n = items.length;
  const per = Math.max(20, Math.floor((durationInFrames - 30) / n));
  const activeIdx = Math.min(n - 1, Math.floor(Math.max(0, frame - 14) / per));
  return (
    <Stage theme={t} style={{ opacity: op }}>
      {/* El obturador suena cuando cada instantánea SE ADELANTA (el momento en que la
          mirás), no cuando entran todas juntas al principio: si no, se amontonan tres
          disparos en medio segundo y después el carrusel avanza mudo. */}
      {shutter &&
        items.map((_, i) => (
          <Sequence key={`sh${i}`} from={Math.max(0, 14 + i * per - 3)} durationInFrames={26} layout="none">
            <Audio src={staticFile("sfx/universfield-camera-shutter-199580.mp3")} volume={0.2} />
          </Sequence>
        ))}
      <Panel theme={t} style={{ position: "absolute", inset: 60 }} raysX={52}>
        <div style={{ position: "absolute", top: 58, left: 0, right: 0, textAlign: "center" }}>
          <Display theme={t} size={56}>{title}</Display>
        </div>
        <div style={{ position: "absolute", top: 210, left: 0, right: 0, bottom: 90, display: "flex", alignItems: "center", justifyContent: "center", gap: 44 }}>
          {items.map((it, i) => {
            const enter = kick(frame, fps, 8 + i * 7, SPR.settle);
            const isActive = i === activeIdx;
            const lift = kick(frame, fps, 14 + i * per, SPR.settle);
            const active = isActive ? lift : 0;
            const scale = 0.86 + active * 0.22;
            const y = (1 - enter) * 60 - active * 34;
            return (
              <div key={i} style={{ position: "relative", opacity: enter, transform: `translateY(${y}px) scale(${scale}) rotate(${(i - (n - 1) / 2) * (isActive ? 0 : 1.6)}deg)`, zIndex: isActive ? 2 : 1, transformOrigin: "bottom center" }}>
                <div
                  style={{
                    width: 330,
                    height: 420,
                    background: t.color.surfaceStrong,
                    padding: "16px 16px 0",
                    borderRadius: 10,
                    border: `1.5px solid ${t.color.line}`,
                    boxShadow: isActive ? `0 46px 80px ${t.color.shadow}, 0 0 50px ${t.color.glow}` : `0 22px 44px ${t.color.shadow}`,
                  }}
                >
                  <div style={{ width: "100%", height: 300, overflow: "hidden", borderRadius: 6, position: "relative" }}>
                    <ImgOr src={it.image} seed={60 + i} theme={t} />
                    {!isActive && <div style={{ position: "absolute", inset: 0, background: t.mode === "dark" ? "rgba(0,0,0,0.45)" : "rgba(239,231,211,0.4)" }} />}
                  </div>
                  <div style={{ height: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Display theme={t} size={34} color={isActive ? t.color.text : t.color.textDim}>{it.label}</Display>
                  </div>
                </div>
                {isActive && (
                  <div style={{ position: "absolute", top: -24, right: -24, transform: `scale(${lift})` }}>
                    <div style={{ width: 64, height: 64, borderRadius: "50%", background: t.color.gold, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 12px 26px ${t.color.shadow}`, fontSize: 32, color: t.mode === "dark" ? "#141B12" : "#fff", fontWeight: 900, fontFamily: t.fontLabel }}>
                      {i + 1}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Panel>
    </Stage>
  );
};

// ── SplitPanel — media a la izquierda + resumen con bullets a la derecha ─────
export const SplitPanel: React.FC<{
  durationInFrames: number;
  theme?: Theme;
  eyebrow?: string;
  title?: string;
  image?: string;
  bullets?: string[];
}> = ({
  durationInFrames,
  theme,
  eyebrow = "En resumen",
  title = "Lo que aprendimos",
  image,
  bullets = ["El drenaje manda sobre el riego", "La mezcla se hace de una vez", "Nunca en día de lluvia"],
}) => {
  const t = useTheme(theme);
  const { frame, fps, op } = useBeat(durationInFrames);
  const imgS = kick(frame, fps, 4, SPR.settle);
  return (
    <Stage theme={t} style={{ opacity: op }}>
      <Panel theme={t} style={{ position: "absolute", inset: 60 }} raysX={86}>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "stretch" }}>
          {/* mitad media con recorte diagonal */}
          <div style={{ position: "relative", flex: "0 0 46%", opacity: imgS, transform: `translateX(${(1 - imgS) * -50}px)` }}>
            <div style={{ position: "absolute", inset: 0, clipPath: "polygon(0 0, 100% 0, 86% 100%, 0 100%)", overflow: "hidden" }}>
              <ImgOr src={image} seed={29} theme={t} />
              <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, rgba(0,0,0,0) 55%, ${t.color.bg0}55 100%)` }} />
            </div>
            {/* filo dorado del corte */}
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" width="100%" height="100%" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
              <line x1={100} y1={0} x2={86} y2={100} stroke={t.color.gold} strokeWidth={1.2} opacity={0.9} />
            </svg>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingLeft: 40, paddingRight: 90 }}>
            <div style={{ opacity: kick(frame, fps, 10, SPR.settle) }}>
              <Eyebrow theme={t} size={27}>{eyebrow}</Eyebrow>
              <Display theme={t} size={62} style={{ marginTop: 14, marginBottom: 38 }}>{title}</Display>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
              {bullets.map((b, i) => {
                const at = spread(durationInFrames, bullets.length, i);
                const s = kick(frame, fps, at, SPR.snappy);
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, opacity: s, transform: `translateX(${(1 - s) * 34}px)` }}>
                    <Tick at={at + 5} color={t.color.accent} size={54} />
                    <Support theme={t} size={36}>{b}</Support>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Panel>
    </Stage>
  );
};
