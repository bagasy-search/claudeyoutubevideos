import React from "react";
import { AbsoluteFill, Img, Sequence, staticFile, interpolate, useCurrentFrame } from "remotion";
import { THEME_ALARM, THEME_AMISH, THEME_EARTH, THEME_MEDICO, THEME_NATURE, type Theme } from "./theme";
import { PremiumOverlay } from "../../scenes/PremiumOverlay";
import { CtaCard, MythTruth, StampBadge } from "./frame";
import { HighlightSweep, PullQuote } from "./text";
import { FlowSteps } from "./diagrams";
import { BeforeAfter, VsDuel } from "./compare";
import { ChecklistReveal, NumberedSteps } from "./lists";
import { BigStatReveal } from "./stats";
import {
  BigNumber,
  ChecklistCard,
  CornerLabel,
  PaperChart,
  ParchmentCard,
  QuoteCard,
  SectionDiagram,
} from "../../amish/AmishKit";
import {
  PremiumAuthorityQuote,
  PremiumChapter,
  PremiumLowerThird,
  PremiumProtocol,
  PremiumStatRing,
} from "../federer_premium";
import {
  AlertaCorner,
  AntesDespues,
  CalloutFlecha,
  DatoClaveBadge,
  LowerThirdFederer,
  MitoVsRealidad,
  TickerAlerta,
} from "../federer_broadcast";

// ═══════════════════════════════════════════════════════════════════════════
// StageProof — BANCO DE PRUEBAS de los componentes EN USO REAL.
// La Gallery los muestra sobre fondo liso a 0.49 → miente. Acá cada página es
// UN componente a 1920x1080 con un plate de b-roll detrás y el mismo wrapper
// que usa el video (PremiumOverlay), que es como el espectador los ve.
// Stills de verificación: frame = página*PAGE + 62.
// ═══════════════════════════════════════════════════════════════════════════

export const PAGE = 180;

const PLATE = "img/shou_s_010.png";
const P1 = "img/ace_s_001.png";
const P2 = "img/ace_s_002.png";
const P3 = "img/ace_s_003.png";

type Case = { name: string; zone: "topLeft" | "left" | "top" | "full"; el: (d: number) => React.ReactNode };

export const CASES: Case[] = [
  {
    name: "StampBadge",
    zone: "topLeft",
    el: (d) => <StampBadge durationInFrames={d} theme={THEME_EARTH} text="OMS 2009" sub="Guía de aire interior" />,
  },
  {
    name: "PullQuote",
    zone: "top",
    el: (d) => (
      <PullQuote
        durationInFrames={d}
        theme={THEME_EARTH}
        quote="No se recomienda el uso rutinario de biocidas contra el moho"
        author="EPA"
        role="Agencia ambiental de Estados Unidos"
        image={P1}
      />
    ),
  },
  {
    name: "FlowSteps",
    zone: "top",
    el: (d) => (
      <FlowSteps
        durationInFrames={d}
        theme={THEME_EARTH}
        title="Por qué hace espuma"
        nodes={[
          { label: "Catalasa", sub: "Enzima de la célula viva", image: P1 },
          { label: "Parte el peróxido", image: P2 },
          { label: "Libera oxígeno", sub: "Eso es la espuma", image: P3 },
        ]}
      />
    ),
  },
  {
    name: "BeforeAfter",
    zone: "top",
    el: (d) => (
      <BeforeAfter
        durationInFrames={d}
        theme={THEME_EARTH}
        eyebrow="Diluirla la mata"
        beforeLabel="3% de fábrica"
        afterLabel="1,5% aguado"
        beforeImage={P1}
        afterImage={P2}
        caption="Ya viene diluida: no la cortes"
      />
    ),
  },
  {
    name: "ChecklistReveal",
    zone: "topLeft",
    el: (d) => (
      <ChecklistReveal
        durationInFrames={d}
        theme={THEME_EARTH}
        title="Encima o adentro: así lo sabés"
        items={[
          "Comprobá el tiempo completo",
          "Aclaró y se siente firme: era de encima",
          "No cambió o volvió en tres semanas: está adentro",
        ]}
        stamp="Sin adivinar"
      />
    ),
  },
  // ── el resto del set que USA este canal (cues_shou/aceite): no se
  //    reescribieron uno por uno, pero heredan el motor de capas vía Panel.
  //    Están acá para que el banco confirme que ninguno quedó roto.
  {
    name: "BigStatReveal",
    zone: "topLeft",
    el: (d) => (
      <BigStatReveal
        durationInFrames={d}
        theme={THEME_EARTH}
        eyebrow="Lo que casi nadie mide"
        value={3}
        suffix="%"
        support="La concentración que viene de fábrica — y la única que sirve"
        source=""
      />
    ),
  },
  {
    name: "VsDuel",
    zone: "left",
    el: (d) => (
      <VsDuel
        durationInFrames={d}
        theme={THEME_EARTH}
        eyebrow="Frente a frente"
        title="Lavandina vs. agua oxigenada"
        left={{ label: "Lavandina", sub: "mata en la superficie, vuelve en semanas", image: P1, good: false }}
        right={{ label: "Agua oxigenada", sub: "penetra el poro y no deja residuo", image: P2, good: true }}
      />
    ),
  },
  {
    name: "MythTruth",
    zone: "topLeft",
    el: (d) => (
      <MythTruth
        durationInFrames={d}
        theme={THEME_EARTH}
        myth="Si hace espuma, está matando el moho"
        truth="La espuma es oxígeno de la célula viva: avisa, no cura"
      />
    ),
  },
  {
    name: "HighlightSweep",
    zone: "top",
    el: (d) => (
      <HighlightSweep
        durationInFrames={d}
        theme={THEME_EARTH}
        pre="El frasco marrón no es estética:"
        highlight="la luz la descompone"
        post=" en agua común."
        note="por eso nunca viene en botella transparente"
      />
    ),
  },
  {
    name: "NumberedSteps",
    zone: "left",
    el: (d) => (
      <NumberedSteps
        durationInFrames={d}
        theme={THEME_EARTH}
        eyebrow="Paso a paso"
        title="Cómo se aplica, sin vueltas"
        steps={[
          { title: "Ventilá el ambiente", sub: "y ponete guantes" },
          { title: "Rociá sin diluir", sub: "directo del frasco" },
          { title: "Esperá diez minutos", sub: "sin frotar" },
          { title: "Pasá un trapo seco", sub: "y dejá secar al aire" },
        ]}
      />
    ),
  },
  {
    name: "CtaCard",
    zone: "full",
    el: (d) => (
      <CtaCard
        durationInFrames={d}
        theme={THEME_EARTH}
        eyebrow="El manual completo"
        title="Manual de Reparaciones Caseras"
        bullet="84 arreglos probados, con medidas exactas"
        price={0}
        cta="Link en la descripción"
        image={P3}
      />
    ),
  },
];

// ── Cobertura de THEMES y del camino STANDALONE ─────────────────────────────
// El banco corría sólo THEME_EARTH y sólo con PremiumOverlay. Los otros nichos
// (fauna, Amish, finanzas, Federer) usan el MISMO kit con otro theme, y la copia
// `_fed6` lo monta SIN overlay. Esos dos ejes son donde se esconden los errores
// de contraste: un theme oscuro invierte qué tinta se lee, y sin overlay nadie
// declara la superficie.
// ── KIT AMISH (modo faceless) — se monta SIN PremiumOverlay: cada componente
//    trae su propio FilmWear y su pergamino, que es la firma del canal.
const AMISH_CASES: { name: string; el: (d: number) => React.ReactNode }[] = [
  {
    name: "ParchmentCard",
    el: (d) => (
      <ParchmentCard
        durationInFrames={d}
        title="La bodega de raíces"
        body="Cuatro metros bajo tierra la temperatura no se mueve: 12 grados todo el año, sin electricidad y sin una sola pieza móvil."
        image={P1}
      />
    ),
  },
  { name: "BigNumber", el: (d) => <BigNumber durationInFrames={d} label="Temperatura del suelo" value="12°" sub="constante los doce meses, a cuatro metros de profundidad" /> },
  {
    name: "PaperChart",
    el: (d) => (
      <PaperChart
        durationInFrames={d}
        title="Cuánto dura cada cosa allá abajo"
        unit=" meses"
        rows={[
          { label: "Papa", value: 8 },
          { label: "Manzana", value: 6 },
          { label: "Zanahoria", value: 5 },
          { label: "Repollo", value: 3 },
        ]}
      />
    ),
  },
  {
    name: "SectionDiagram",
    el: (d) => (
      <SectionDiagram
        durationInFrames={d}
        title="El corte, capa por capa"
        image={P2}
        steps={[
          { text: "Tierra vegetal, 40 cm", tx: 0.24, ty: 0.22 },
          { text: "Piedra suelta para drenar", tx: 0.74, ty: 0.44 },
          { text: "Piso de tierra apisonada", tx: 0.3, ty: 0.78 },
        ]}
      />
    ),
  },
  {
    name: "ChecklistCard",
    el: (d) => (
      <ChecklistCard
        durationInFrames={d}
        title="Antes de cavar"
        items={["Buscá la napa: si está a menos de 3 m, cambiá de lugar", "Orientá la puerta al norte", "Dejá un respiradero arriba y otro abajo"]}
      />
    ),
  },
  { name: "CornerLabel", el: (d) => <CornerLabel durationInFrames={d} text="12 °C" sub="temperatura del suelo" corner="bl" /> },
  { name: "QuoteCard", el: (d) => <QuoteCard durationInFrames={d} quote="Nadie construía una bodega para un invierno. Se construía para el invierno de los nietos." source="Manual de granja, 1904" /> },
];

// ── KIT PROPIO DEL DR. FEDERER (dark cinematic). No pasa por PremiumOverlay:
//    cada takeover trae su propio PremiumBackdrop.
const FED_CASES: { name: string; el: () => React.ReactNode }[] = [
  { name: "PremiumLowerThird", el: () => <PremiumLowerThird title="Por qué la piel madura pierde firmeza" /> },
  { name: "PremiumStatRing", el: () => <PremiumStatRing value={78} suffix="%" eyebrow="Dato clave" support="de la firmeza depende del colágeno que todavía conserva" pct={78} /> },
  { name: "PremiumAuthorityQuote", el: () => <PremiumAuthorityQuote quote="La piel no envejece por el paso del tiempo: envejece por la oxidación que nadie frena." /> },
  { name: "PremiumChapter", el: () => <PremiumChapter index={2} kicker="El método" title="El aceite que sí penetra" /> },
  { name: "LowerThirdFederer", el: () => <LowerThirdFederer kicker="DR. FEDERER" title="El aceite que sí penetra la piel" subtitle="Medicina · Salud natural" /> },
  { name: "AlertaCorner", el: () => <AlertaCorner tag="Atención" headline="No todos los aceites llegan a la dermis" desc="el tamaño de la molécula decide si entra o se queda arriba" /> },
  { name: "TickerAlerta", el: () => <TickerAlerta tag="Salud" items={["El colágeno cae 1% por año desde los 25", "La oxidación acelera con el sol", "Romero: ácido carnósico y rosmarínico"]} /> },
  { name: "AntesDespues", el: () => <AntesDespues before={P1} after={P2} labelA="Antes" labelB="A las 8 semanas" /> },
  { name: "MitoVsRealidad", el: () => <MitoVsRealidad myth="Cuanto más caro el frasco, mejor penetra" fact="Lo que decide es el tamaño de la molécula, no el precio" /> },
  { name: "DatoClaveBadge", el: () => <DatoClaveBadge value={78} suffix="%" label="de la firmeza depende del colágeno" corner="tr" /> },
  { name: "CalloutFlecha", el: () => <CalloutFlecha text="Acá se abre el poro" tx={0.62} ty={0.44} from="bl" /> },
  { name: "PremiumProtocol", el: () => <PremiumProtocol title="Protocolo nocturno" steps={[{ title: "Limpiar", sub: "agua tibia, sin jabón" }, { title: "Aplicar", sub: "tres gotas, en círculos" }, { title: "Esperar", sub: "diez minutos" }]} /> },
];

const THEME_CASES: { name: string; theme: Theme; zone: Case["zone"]; standalone?: boolean }[] = [
  { name: "NATURE (fauna)", theme: THEME_NATURE, zone: "topLeft" },
  { name: "AMISH", theme: THEME_AMISH, zone: "top" },
  { name: "ALARM (finanzas)", theme: THEME_ALARM, zone: "left" },
  { name: "MEDICO · SIN overlay", theme: THEME_MEDICO, zone: "topLeft", standalone: true },
];

export const PROOF_FRAMES = (CASES.length + THEME_CASES.length + AMISH_CASES.length + FED_CASES.length) * PAGE;

/** plate de b-roll con un push lento, como el beat real de video */
const Plate: React.FC<{ src: string }> = ({ src }) => {
  const frame = useCurrentFrame();
  const k = interpolate(frame % PAGE, [0, PAGE], [1, 1.06]);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#151310" }}>
      <Img
        src={staticFile(src)}
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${k})` }}
      />
    </AbsoluteFill>
  );
};

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      position: "absolute",
      left: 16,
      bottom: 14,
      background: "rgba(0,0,0,0.8)",
      color: "#fff",
      fontFamily: "Arial, sans-serif",
      fontWeight: 700,
      fontSize: 22,
      padding: "6px 16px",
      borderRadius: 7,
    }}
  >
    {children}
  </div>
);

/** el mismo componente en los 4 themes, para comparar contraste de una pasada */
const ThemeCase: React.FC<{ tc: (typeof THEME_CASES)[number] }> = ({ tc }) => {
  const el = (
    <ChecklistReveal
      durationInFrames={PAGE}
      theme={tc.theme}
      title="Encima o adentro: así lo sabés"
      items={["Comprobá el tiempo completo", "Aclaró y se siente firme", "No cambió: está adentro"]}
      stamp="Sin adivinar"
    />
  );
  return (
    <>
      <Plate src={PLATE} />
      {tc.standalone ? (
        // SIN PremiumOverlay: es como lo monta la copia _fed6 (canal Federer).
        // Acá nadie declara la superficie ni trata el fondo → lo tiene que
        // resolver el propio Panel.
        el
      ) : (
        <PremiumOverlay durationInFrames={PAGE} zone={tc.zone} theme={tc.theme}>
          {el}
        </PremiumOverlay>
      )}
      <Label>{tc.name}</Label>
    </>
  );
};

export const StageProof: React.FC = () => {
  const frame = useCurrentFrame();
  const total = CASES.length + THEME_CASES.length + AMISH_CASES.length + FED_CASES.length;
  const page = Math.min(total - 1, Math.floor(frame / PAGE));
  const isTheme = page >= CASES.length && page < CASES.length + THEME_CASES.length;
  const amishStart = CASES.length + THEME_CASES.length;
  const fedStart = amishStart + AMISH_CASES.length;
  const isAmish = page >= amishStart && page < fedStart;
  const isFed = page >= fedStart;
  const c = CASES[Math.min(page, CASES.length - 1)];
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Sequence key={page} from={page * PAGE} durationInFrames={PAGE}>
        {isFed ? (
          <>
            <Plate src={PLATE} />
            {FED_CASES[page - fedStart].el()}
            <Label>FEDERER · {FED_CASES[page - fedStart].name}</Label>
          </>
        ) : isAmish ? (
          <>
            <Plate src={PLATE} />
            {AMISH_CASES[page - amishStart].el(PAGE)}
            <Label>AMISH · {AMISH_CASES[page - amishStart].name}</Label>
          </>
        ) : isTheme ? (
          <ThemeCase tc={THEME_CASES[page - CASES.length]} />
        ) : (
          <>
            <Plate src={PLATE} />
            <PremiumOverlay durationInFrames={PAGE} zone={c.zone} theme={THEME_EARTH}>
              {c.el(PAGE)}
            </PremiumOverlay>
            <Label>
              {c.name} · zone={c.zone}
            </Label>
          </>
        )}
      </Sequence>
    </AbsoluteFill>
  );
};
