import { AbsoluteFill, Sequence } from "remotion";
import { BreakingReveal } from "./scenes/BreakingReveal";
import { PresenterTag } from "./scenes/PresenterTag";
import { NewsTicker } from "./scenes/NewsTicker";
import { VerifiedStamp } from "./scenes/VerifiedStamp";
import { StepTracker } from "./scenes/StepTracker";
import { StatSlam } from "./scenes/StatSlam";
import { AlertWipe } from "./scenes/AlertWipe";

// Demo LIMPIA de los componentes premium/noticiero. Cada uno ~3s.
const D = 90;
const clips: { c: React.ReactNode; d: number; tag: string }[] = [
  { tag: "1 · BreakingReveal (reveal)", d: D, c: <BreakingReveal durationInFrames={D} accent="danger" label="AL DESCUBIERTO" badge="AHORA" headline="Estás matando tu planta con agua" ticker="El error que comete 9 de cada 10 personas" /> },
  { tag: "2 · BreakingReveal (Secreto Nº)", d: D, c: <BreakingReveal durationInFrames={D} accent="amber" number="4" badge="DATO" headline="Sembrar con la luna" ticker="El truco del abuelo que nadie te contó" /> },
  { tag: "3 · PresenterTag", d: D, c: <PresenterTag durationInFrames={D} name="LEVI LAPP" subtitle="Huerta a la vieja usanza · 3ª generación" accent="amber" /> },
  { tag: "4 · NewsTicker", d: D, c: <NewsTicker durationInFrames={D} label="DATO" accent="danger" items={["Agua oxigenada al 3% — cuesta monedas", "Dura hasta 6 meses en botella oscura", "1½ cucharada por litro para el rescate", "Nunca al sol fuerte del mediodía"]} /> },
  { tag: "5 · VerifiedStamp", d: D, c: <VerifiedStamp durationInFrames={D} text="PROBADO" accent="good" /> },
  { tag: "6 · StepTracker", d: D, c: <StepTracker durationInFrames={D} step={2} total={3} label="PASO" accent="amber" /> },
  { tag: "7 · StatSlam", d: D, c: <StatSlam durationInFrames={D} eyebrow="El dato que nadie te dice" figure="9 de cada 10" caption="mueren ahogadas, no de sed" accent="danger" /> },
  { tag: "8 · AlertWipe", d: 34, c: <AlertWipe durationInFrames={34} text="ATENCIÓN" accent="danger" /> },
];
export const TOTAL_FRAMES_PREMIUMKIT = clips.reduce((a, c) => a + c.d, 0);

export const PremiumKitDemo: React.FC = () => {
  let t = 0;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(120% 120% at 50% 20%, #46592f 0%, #2c3a1e 60%, #1b2413 100%)" }}>
      {clips.map((cl, i) => {
        const from = t; t += cl.d;
        return (
          <Sequence key={i} from={from} durationInFrames={cl.d}>
            <AbsoluteFill>
              <div style={{ position: "absolute", top: 40, left: 72, color: "rgba(255,255,255,0.5)", fontSize: 22, fontFamily: "system-ui, sans-serif", letterSpacing: 1 }}>{cl.tag}</div>
              {cl.c}
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
