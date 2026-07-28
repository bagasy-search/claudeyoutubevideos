// Board_vdjso9de381j.tsx — componente PROPIO del slug (aislado, no toca el kit compartido).
//
// Por qué existe: el kind `board` del kit despacha a `PizarraExplica`, que está pensada para
// convivir con el avatar a un costado (media pantalla). En ESTE canal el split está prohibido, así
// que la tarjeta quedaba encajonada en la mitad izquierda con TRES problemas visibles en el
// minuto 4:12 (los marcó el creador):
//   1. el badge numerado se dibuja ENCIMA del título del ítem y lo tapa,
//   2. los ítems se apilan arriba y queda 2/3 de tarjeta vacía,
//   3. el avatar aparece cortado a la derecha.
//
// Esta variante ocupa la pantalla entera, pone el número FUERA del texto y reparte los ítems en
// el alto disponible. Los ítems entran escalonados y quedan todos legibles hasta el final.
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

const TEAL = "#12B3AE";
const TINTA = "#0E2226";
const GRIS = "#5C7276";
const F = "Inter, system-ui, sans-serif";

type Item = { title?: string; sub?: string };

export const BoardVdj: React.FC<{
  durationInFrames: number;
  title?: string;
  eyebrow?: string;
  items?: Item[];
}> = ({ durationInFrames, title, eyebrow, items }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const list = (items || []).filter((x) => x && (x.title || x.sub));
  if (!list.length && !title) return null;

  const inOp = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const outOp = interpolate(frame, [durationInFrames - 7, durationInFrames], [1, 0], { extrapolateLeft: "clamp" });
  const op = Math.min(inOp, outOp);
  const card = spring({ frame, fps, config: { damping: 200, mass: 0.7 } });

  // todos los ítems adentro al 55% de la escena (nunca se queda uno sin entrar)
  const hold = Math.max(10, Math.floor(durationInFrames * 0.55));
  const step = list.length > 1 ? hold / list.length : 0;

  const n = list.length;
  const tSize = n <= 3 ? 62 : n <= 4 ? 54 : 46;
  const sSize = n <= 3 ? 38 : n <= 4 ? 34 : 30;
  const rowGap = n <= 3 ? 54 : n <= 4 ? 40 : 30;

  return (
    <AbsoluteFill style={{ opacity: op }}>
      <AbsoluteFill style={{ background: "linear-gradient(150deg, #0F2429 0%, #0B1A1E 60%, #12262B 100%)" }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "70px 130px" }}>
        <div
          style={{
            width: "100%",
            maxWidth: 1560,
            background: "#FBFAF6",
            borderRadius: 34,
            boxShadow: "0 40px 110px rgba(0,0,0,0.55)",
            borderTop: `10px solid ${TEAL}`,
            padding: "62px 78px 66px",
            transform: `translateY(${(1 - card) * 26}px) scale(${0.985 + card * 0.015})`,
          }}
        >
          {eyebrow ? (
            <div style={{ fontFamily: F, fontSize: 24, letterSpacing: 6, textTransform: "uppercase", color: TEAL, marginBottom: 14 }}>
              {eyebrow}
            </div>
          ) : null}
          {title ? (
            <>
              <div style={{ fontFamily: F, fontWeight: 800, fontSize: 74, lineHeight: 1.06, color: TINTA, letterSpacing: -1.5 }}>
                {title}
              </div>
              <div
                style={{
                  marginTop: 20,
                  height: 6,
                  borderRadius: 3,
                  width: interpolate(frame, [4, 20], [0, 260], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                  background: TEAL,
                }}
              />
            </>
          ) : null}

          <div style={{ marginTop: title ? 52 : 8, display: "flex", flexDirection: "column", gap: rowGap }}>
            {list.map((it, i) => {
              const s = spring({ frame: frame - Math.round(i * step), fps, config: { damping: 200, mass: 0.6 } });
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 32,
                    opacity: s,
                    transform: `translateX(${(1 - s) * 26}px)`,
                  }}
                >
                  {/* el número va FUERA del texto, en su propia columna: nunca lo tapa */}
                  <div
                    style={{
                      flex: "0 0 auto",
                      width: 62,
                      height: 62,
                      borderRadius: 31,
                      background: TEAL,
                      color: "#08211F",
                      fontFamily: F,
                      fontWeight: 900,
                      fontSize: 32,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 10px 24px rgba(18,179,174,0.35)",
                    }}
                  >
                    {i + 1}
                  </div>
                  <div style={{ flex: 1, paddingTop: 4 }}>
                    {it.title ? (
                      <div style={{ fontFamily: F, fontWeight: 800, fontSize: tSize, lineHeight: 1.12, color: TINTA }}>{it.title}</div>
                    ) : null}
                    {it.sub ? (
                      <div style={{ marginTop: 8, fontFamily: F, fontWeight: 500, fontSize: sSize, lineHeight: 1.32, color: GRIS }}>{it.sub}</div>
                    ) : null}
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
