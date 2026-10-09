// Banco de prueba del kit Ole* (grupo B). Cada ítem = [duración en cuadros, elemento].
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { OleHeatCurve } from "./OleHeatCurve";
import { OleBeanSwell } from "./OleBeanSwell";
import { OleMythTrick } from "./OleMythTrick";
import { OleSaltAcidTimeline } from "./OleSaltAcidTimeline";
import { OleRuleCard, OleRecapCard } from "./OleRuleCard";

// los overlays se prueban sobre un cuadro de metraje (simula el video vivo)
const Over: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill>
    <Img src={staticFile("ref_olbeans_src.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    {children}
  </AbsoluteFill>
);

export const ITEMS_B: [number, React.ReactNode][] = [
  // 1 · curva de calor (bien / mal)
  [360, <OleHeatCurve key="hc1" beats={[0.8, 4.2, 8.5]} />],
  [300, <OleHeatCurve key="hc2" mode="wrong" bed="ref_olbeans_src.jpg" beats={[0.6, 3.4, 7]} />],
  // 2 · el poroto que se hincha (lado a lado / un solo lado)
  [420, <OleBeanSwell key="bs1" beats={[0.8, 4.5, 9.5, 10.3]} />],
  [240, <OleBeanSwell key="bs2" mode="hot" bed="ref_olbeans_src.jpg" hot={{ tag: "CAMP WAY", title: "Hot pot", sub: "boil 2 min, rest", time: "about 1 hr" }} />],
  // 3 · mito vs truco (varios usos)
  [210, <OleMythTrick key="mt1" flipAt={3.2} />],
  [210, <OleMythTrick key="mt2" bed="ref_olbeans_src.jpg" front={{ text: "Salt makes beans tough" }} back={{ text: "Salt at the start", note: "softer skins, seasoned through" }} flipAt={3} seed={8} />],
  // 4 · sal/ácido en el tiempo (bien / mal)
  [420, <OleSaltAcidTimeline key="st1" progressAt={[0.5, 7.5, 12]} />],
  [360, <OleSaltAcidTimeline key="st2" mode="wrong" bed="ref_olbeans_src.jpg" progressAt={[0.5, 6.5, 10.5]} />],
  // 5 · reglas (3 ubicaciones) + tarjeta resumen
  [120, <Over key="r1"><OleRuleCard n={4} title="Salt from the start" line="A tablespoon, before the heat" placement="corner" /></Over>],
  [120, <Over key="r2"><OleRuleCard n={2} title="Hard boil, then a whisper" line="Ten minutes hot, then barely moving" placement="lower" /></Over>],
  [120, <Over key="r3"><OleRuleCard n={7} title="Acid & sweet go last" line="Molasses early keeps beans hard" placement="center" /></Over>],
  [360, <OleRecapCard key="rc1" />],
  [300, <OleRecapCard key="rc2" bed="ref_olbeans_src.jpg" steps={["Skip the overnight soak", "Salt at the start", "Hard boil 10 minutes", "Then a whisper", "Acid & sweet last", "Old beans? Pinch of soda", "Save the pot liquor"]} />],
];
