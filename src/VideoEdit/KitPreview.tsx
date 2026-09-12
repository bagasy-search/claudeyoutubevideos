import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { COLORS } from "./theme";

// ── Los 30 componentes GENÉRICOS del kit ────────────────────────────────────
import { TitleCardKit } from "./kit/TitleCardKit";
import { LowerThirdKit } from "./kit/LowerThirdKit";
import { ChapterMarkerKit } from "./kit/ChapterMarkerKit";
import { BigStatKit } from "./kit/BigStatKit";
import { StatGridKit } from "./kit/StatGridKit";
import { BulletListKit } from "./kit/BulletListKit";
import { ChecklistKit } from "./kit/ChecklistKit";
import { NumberedStepsKit } from "./kit/NumberedStepsKit";
import { TimelineKit } from "./kit/TimelineKit";
import { CompareTwoKit } from "./kit/CompareTwoKit";
import { BarChartKit } from "./kit/BarChartKit";
import { RankingBarsKit } from "./kit/RankingBarsKit";
import { DonutStatKit } from "./kit/DonutStatKit";
import { PartsDiagramKit } from "./kit/PartsDiagramKit";
import { CrossSectionKit } from "./kit/CrossSectionKit";
import { FlowArrowsKit } from "./kit/FlowArrowsKit";
import { CycleDiagramKit } from "./kit/CycleDiagramKit";
import { MapPinKit } from "./kit/MapPinKit";
import { AnnotatedPhotoKit } from "./kit/AnnotatedPhotoKit";
import { PolaroidStackKit } from "./kit/PolaroidStackKit";
import { QuoteCardKit } from "./kit/QuoteCardKit";
import { EquationKit } from "./kit/EquationKit";
import { IngredientsCardKit } from "./kit/IngredientsCardKit";
import { CostTallyKit } from "./kit/CostTallyKit";
import { GaugeMeterKit } from "./kit/GaugeMeterKit";
import { StampRevealKit } from "./kit/StampRevealKit";
import { LabelCalloutKit } from "./kit/LabelCalloutKit";
import { SplitPanelKit } from "./kit/SplitPanelKit";
import { ProcessGridKit } from "./kit/ProcessGridKit";
import { ClosingCardKit } from "./kit/ClosingCardKit";

// Cada componente ocupa exactamente PER frames. TOTAL_FRAMES_KIT = 30 * PER.
export const PER = 90;
export const TOTAL_FRAMES_KIT = 30 * PER;

// Un shim por componente: fija durationInFrames = PER y pasa props de un nicho
// VARIADO (huerta / reparación / amish-homestead) para probar genericidad.
// El índice determina el frame central para sacar stills: center = i*PER + PER/2.
const SHOTS: { name: string; el: React.ReactNode }[] = [
  // 1 · huerta
  {
    name: "TitleCardKit",
    el: (
      <TitleCardKit
        durationInFrames={PER}
        eyebrow="ALMANAQUE DE LA HUERTA"
        title="El bancal que nunca se seca"
        subtitle="Riego enterrado, tierra viva"
      />
    ),
  },
  // 2 · reparación
  {
    name: "LowerThirdKit",
    el: (
      <LowerThirdKit
        durationInFrames={PER}
        name="Don Ernesto"
        role="Maestro plomero · 40 años de oficio"
        side="left"
      />
    ),
  },
  // 3 · amish
  {
    name: "ChapterMarkerKit",
    el: (
      <ChapterMarkerKit
        durationInFrames={PER}
        index={2}
        label="El granero de piedra"
        subtitle="Cómo levantaban un techo sin clavos"
        roman
      />
    ),
  },
  // 4 · huerta
  {
    name: "BigStatKit",
    el: (
      <BigStatKit
        durationInFrames={PER}
        title="AHORRO DE AGUA"
        value={70}
        unit="%"
        caption="menos riego con ollas de barro"
        subtitle="medido en verano, suelo arcilloso"
      />
    ),
  },
  // 5 · reparación
  {
    name: "StatGridKit",
    el: (
      <StatGridKit
        durationInFrames={PER}
        title="LA GOTERA EN NÚMEROS"
        stats={[
          { value: 4, unit: "L/h", label: "agua perdida" },
          { value: 90, unit: "$", label: "en la factura" },
          { value: 15, unit: "min", label: "en repararla" },
          { value: 1, unit: "", label: "arandela nueva" },
        ]}
      />
    ),
  },
  // 6 · amish
  {
    name: "BulletListKit",
    el: (
      <BulletListKit
        durationInFrames={PER}
        heading="Por qué la madera de antes duraba"
        items={[
          "Se cortaba en luna menguante",
          "Se secaba dos años bajo techo",
          "Se trataba con aceite de lino",
          "Se ensamblaba a caja y espiga",
        ]}
      />
    ),
  },
  // 7 · huerta
  {
    name: "ChecklistKit",
    el: (
      <ChecklistKit
        durationInFrames={PER}
        title="ANTES DE SEMBRAR EL TOMATE"
        items={[
          { text: "Tierra suelta y aireada", done: true },
          { text: "Compost bien maduro", done: true },
          { text: "Tutor clavado", done: false },
          { text: "Riego por goteo listo", done: false },
        ]}
      />
    ),
  },
  // 8 · reparación
  {
    name: "NumberedStepsKit",
    el: (
      <NumberedStepsKit
        durationInFrames={PER}
        title="CAMBIAR UN CUERITO"
        steps={[
          { title: "Cerrá la llave de paso", note: "corta el agua general" },
          { title: "Desarmá la canilla", note: "guardá las piezas en orden" },
          { title: "Colocá el cuerito nuevo", note: "goma del mismo calibre" },
        ]}
      />
    ),
  },
  // 9 · amish
  {
    name: "TimelineKit",
    el: (
      <TimelineKit
        durationInFrames={PER}
        title="EL MOLINO DE LA FAMILIA"
        milestones={[
          { year: 1904, label: "Se levanta la torre" },
          { year: 1938, label: "Primera reparación" },
          { year: 1971, label: "Cambian las aspas" },
          { year: 2024, label: "Sigue bombeando" },
        ]}
      />
    ),
  },
  // 10 · huerta
  {
    name: "CompareTwoKit",
    el: (
      <CompareTwoKit
        durationInFrames={PER}
        title="RIEGO A MANGUERA vs. GOTEO"
        left={{ title: "A manguera", points: ["Encharca", "Gasta el doble", "Hongos"] }}
        right={{ title: "Por goteo", points: ["Raíz profunda", "Mitad de agua", "Hoja seca"] }}
        verdict="right"
      />
    ),
  },
  // 11 · reparación
  {
    name: "BarChartKit",
    el: (
      <BarChartKit
        durationInFrames={PER}
        title="COSTO DE ARREGLARLO UNO MISMO"
        unit="$"
        bars={[
          { label: "Plomero", value: 120 },
          { label: "Ferretería", value: 18 },
          { label: "Cuerito", value: 2 },
          { label: "Teflón", value: 3 },
        ]}
      />
    ),
  },
  // 12 · huerta
  {
    name: "RankingBarsKit",
    el: (
      <RankingBarsKit
        durationInFrames={PER}
        title="LO QUE MÁS ALIMENTA EL COMPOST"
        unit="pts"
        items={[
          { label: "Estiércol", value: 95 },
          { label: "Restos verdes", value: 72 },
          { label: "Cáscaras", value: 55 },
          { label: "Hojas secas", value: 40 },
        ]}
      />
    ),
  },
  // 13 · amish
  {
    name: "DonutStatKit",
    el: (
      <DonutStatKit
        durationInFrames={PER}
        title="CALOR DE UNA SOLA HORNADA"
        percent={82}
        label="del muro sigue tibio a la mañana"
        centerText="82%"
      />
    ),
  },
  // 14 · huerta
  {
    name: "PartsDiagramKit",
    el: (
      <PartsDiagramKit
        durationInFrames={PER}
        title="ANATOMÍA DEL TOMATE"
        figure="plant"
        labels={[
          { text: "Hoja", x: 24, y: 30 },
          { text: "Tallo", x: 50, y: 55 },
          { text: "Raíz", x: 50, y: 86 },
        ]}
      />
    ),
  },
  // 15 · reparación
  {
    name: "CrossSectionKit",
    el: (
      <CrossSectionKit
        durationInFrames={PER}
        title="LA HUMEDAD QUE SUBE POR EL MURO"
        layers={[
          { label: "Revoque", thickness: 1 },
          { label: "Ladrillo", thickness: 2 },
          { label: "Cimiento húmedo", thickness: 1.4 },
          { label: "Napa freática", thickness: 1 },
        ]}
      />
    ),
  },
  // 16 · huerta
  {
    name: "FlowArrowsKit",
    el: (
      <FlowArrowsKit
        durationInFrames={PER}
        title="DEL RESTO DE COCINA AL ABONO"
        direction="row"
        steps={[
          { label: "Cáscaras", icon: "🥔" },
          { label: "Pila con hojas", icon: "🍂" },
          { label: "Se voltea", icon: "🔁" },
          { label: "Tierra negra", icon: "🌱" },
        ]}
      />
    ),
  },
  // 17 · huerta
  {
    name: "CycleDiagramKit",
    el: (
      <CycleDiagramKit
        durationInFrames={PER}
        title="EL CICLO DEL COMPOST"
        centerLabel="Compost"
        phases={[
          { label: "Verdes" },
          { label: "Secos" },
          { label: "Humedad" },
          { label: "Volteo" },
        ]}
      />
    ),
  },
  // 18 · amish
  {
    name: "MapPinKit",
    el: (
      <MapPinKit
        durationInFrames={PER}
        title="LAS GRANJAS DEL VALLE"
        route
        pins={[
          { x: 28, y: 40, label: "Molino viejo" },
          { x: 62, y: 55, label: "Granero de piedra" },
          { x: 80, y: 30, label: "Pozo comunal" },
        ]}
      />
    ),
  },
  // 19 · reparación
  {
    name: "AnnotatedPhotoKit",
    el: (
      <AnnotatedPhotoKit
        durationInFrames={PER}
        title="DÓNDE EMPIEZA EL ÓXIDO"
        annotations={[
          { x: 34, y: 40, text: "Pintura saltada", kind: "circle" },
          { x: 68, y: 62, text: "Agua estancada", kind: "arrow" },
        ]}
      />
    ),
  },
  // 20 · amish
  {
    name: "PolaroidStackKit",
    el: (
      <PolaroidStackKit
        durationInFrames={PER}
        title="EL OFICIO, DE PADRE A HIJO"
        photos={[
          { caption: "La fragua, 1952" },
          { caption: "El primer arado" },
          { caption: "La cosecha en familia" },
        ]}
      />
    ),
  },
  // 21 · huerta
  {
    name: "QuoteCardKit",
    el: (
      <QuoteCardKit
        durationInFrames={PER}
        quote="La tierra no se hereda de los padres, se toma prestada de los hijos."
        author="Dicho de la huerta"
        seal
      />
    ),
  },
  // 22 · reparación
  {
    name: "EquationKit",
    el: (
      <EquationKit
        durationInFrames={PER}
        title="LA MEZCLA QUE SELLA LA GOTERA"
        terms={[{ label: "Cemento" }, { label: "Agua" }]}
        result={{ label: "Tapa el poro" }}
      />
    ),
  },
  // 23 · huerta
  {
    name: "IngredientsCardKit",
    el: (
      <IngredientsCardKit
        durationInFrames={PER}
        heading="Para la tierra del almácigo"
        ingredients={[
          { name: "Compost tamizado", amount: "2 partes" },
          { name: "Turba / fibra de coco", amount: "1 parte" },
          { name: "Perlita", amount: "1 parte" },
          { name: "Ceniza de madera", amount: "1 puñado" },
        ]}
      />
    ),
  },
  // 24 · reparación
  {
    name: "CostTallyKit",
    el: (
      <CostTallyKit
        durationInFrames={PER}
        title="ARREGLAR LA CANILLA"
        currency="$"
        totalLabel="Total"
        lines={[
          { label: "Cuerito", amount: 2 },
          { label: "Cinta de teflón", amount: 3 },
          { label: "Grasa siliconada", amount: 4 },
        ]}
      />
    ),
  },
  // 25 · huerta
  {
    name: "GaugeMeterKit",
    el: (
      <GaugeMeterKit
        durationInFrames={PER}
        title="HUMEDAD DEL SUELO"
        value={62}
        min={0}
        max={100}
        unit="%"
        zones={[
          { to: 30, color: COLORS.danger },
          { to: 70, color: COLORS.good },
          { to: 100, color: COLORS.amber },
        ]}
      />
    ),
  },
  // 26 · amish
  {
    name: "StampRevealKit",
    el: (
      <StampRevealKit
        durationInFrames={PER}
        claim="Un molino de viento puede bombear agua 80 años sin electricidad."
        verdict="COMPROBADO"
        positive
      />
    ),
  },
  // 27 · reparación
  {
    name: "LabelCalloutKit",
    el: (
      <LabelCalloutKit
        durationInFrames={PER}
        text="Acá se filtra el agua"
        x={58}
        y={44}
        from="bottom"
      />
    ),
  },
  // 28 · amish
  {
    name: "SplitPanelKit",
    el: (
      <SplitPanelKit
        durationInFrames={PER}
        heading="El zeer: heladera sin electricidad"
        imageSide="left"
        points={[
          "Dos ollas de barro, una dentro de otra",
          "Arena mojada entre ambas",
          "El agua se evapora y enfría",
        ]}
      />
    ),
  },
  // 29 · huerta
  {
    name: "ProcessGridKit",
    el: (
      <ProcessGridKit
        durationInFrames={PER}
        title="LAS 4 ESTACIONES DE LA HUERTA"
        cards={[
          { icon: "🌱", title: "Primavera", note: "Sembrar y trasplantar" },
          { icon: "☀️", title: "Verano", note: "Regar al alba" },
          { icon: "🍂", title: "Otoño", note: "Abonar y cubrir" },
          { icon: "❄️", title: "Invierno", note: "Descansar la tierra" },
        ]}
      />
    ),
  },
  // 30 · reparación
  {
    name: "ClosingCardKit",
    el: (
      <ClosingCardKit
        durationInFrames={PER}
        heading="Guardá este truco para la próxima gotera"
        cta="Suscribite al canal"
        seal
      />
    ),
  },
];

// name -> frame central (para sacar stills): i*PER + PER/2
export const KIT_CENTERS: Record<string, number> = Object.fromEntries(
  SHOTS.map((s, i) => [s.name, i * PER + Math.floor(PER / 2)]),
);

export const MainKitPreview: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      {SHOTS.map((s, i) => (
        <Sequence key={s.name} from={i * PER} durationInFrames={PER} name={`${i + 1}·${s.name}`}>
          <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>{s.el}</AbsoluteFill>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
