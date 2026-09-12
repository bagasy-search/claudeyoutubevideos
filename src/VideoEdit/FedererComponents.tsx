import React from "react";
import { staticFile } from "remotion";
import {
  THEME_MEDICO,
  HookCaption,
  BigStatReveal,
  PullQuote,
  BulletCascade,
  ChecklistReveal,
  NumberedSteps,
  FlowSteps,
  LayerStack,
  CutawayCallouts,
  SplitPanel,
  ChapterTitle,
} from "./kit/premium";
import { BlurExplainer } from "./scenes/BlurExplainer";
import { DocNameCard } from "./scenes/DocNameCard";
import { BenefitLockReveal } from "./scenes/BenefitLockReveal";
import { Pizarra } from "./scenes/Pizarra";
import { StudyMagazine, NewspaperStudy, HighlightData, CitationCard } from "./scenes/RecalRich";
import { ScrollDoc } from "./scenes/ScrollDoc";
import { LowerThirdFederer, AlertaCorner, TickerAlerta, AntesDespues, MitoVsRealidad, DatoClaveBadge, CalloutFlecha } from "./kit/federer_broadcast";
import { PremiumLowerThird, PremiumStatRing, PremiumAuthorityQuote, PremiumChapter, PremiumProtocol, AvatarExplain } from "./kit/federer_premium";

const STUDY_RE = /carcinogenesis|harvard|efsa|lancet|toxicology|iarc|oms|journal|revista|estudio|an[aá]lisis|food chemistry|nutrition/i;

const BENEFIT_IDX: Record<string, number> = { arrugas: 0, varices: 1, dolores: 2 };

const T = THEME_MEDICO;
const strip = (s?: string) => (s || "").replace(/\*/g, "");
// el kit premium (ImgOr) usa <Img src> SIN staticFile → hay que pasar la URL resuelta
const sf = (p?: string) => (p ? staticFile(p) : undefined);

// diagramas conceptuales → vectores del kit premium (sin imágenes IA)
function diagramFor(beat: any, d: number): React.ReactNode {
  switch (beat.key) {
    case "oxidacion":
      return <FlowSteps durationInFrames={d} theme={T} title="Envejecer, en el fondo" nodes={[{ label: "Inflamación", sub: "células irritadas" }, { label: "Oxidación", sub: "como una manzana" }]} />;
    case "compuestos":
      return <BulletCascade durationInFrames={d} theme={T} eyebrow="Un ejército de escudos" bullets={[{ key: "Ácido carnósico" }, { key: "Ácido rosmarínico" }, { pre: "Frenan la ", key: "oxidación", post: " que te envejece" }]} />;
    case "arrugas_mec":
      return <LayerStack durationInFrames={d} theme={T} title="La piel, por dentro" layers={[{ label: "Piel + colágeno" }, { label: "Más circulación de sangre" }, { label: "Células nutridas" }]} />;
    case "varices_porque":
      return <FlowSteps durationInFrames={d} theme={T} title="Por qué aparecen las várices" nodes={[{ label: "La sangre sube" }, { label: "Válvula débil" }, { label: "Se estanca" }]} />;
    case "dolores_infl":
      return <BulletCascade durationInFrames={d} theme={T} eyebrow="El apellido del dolor" bullets={[{ key: "Inflamación" }, { pre: "El romero es ", key: "antiinflamatorio" }]} />;
    default: {
      const eb = beat.slides?.[0]?.eyebrow || beat.eyebrow || "";
      return <HookCaption durationInFrames={d} theme={T} words={eb.split(" ").map((w: string) => ({ text: w }))} />;
    }
  }
}

// mapea un beat de COMPONENTE → componente premium Fable 5 (themeado MEDICO)
export function renderFedererComp(beat: any, d: number): React.ReactNode {
  switch (beat.kind) {
    case "headline":
      return <HookCaption durationInFrames={d} theme={T} words={(beat.tokens || []).map((t: any) => ({ text: t.t, boxed: !!t.hl }))} sub={beat.eyebrow} />;
    case "stat":
      return <BigStatReveal durationInFrames={d} theme={T} eyebrow={beat.eyebrow} value={beat.value} prefix={beat.prefix} suffix={beat.suffix} support={beat.label} />;
    case "quote":
      return <PullQuote durationInFrames={d} theme={T} quote={strip(beat.text)} image={sf(beat.image)} />;
    case "chips":
      return <SplitPanel durationInFrames={d} theme={T} title={beat.title} image={sf(beat.image)} bullets={beat.chips || []} />;
    case "splitlist":
      return <BulletCascade durationInFrames={d} theme={T} eyebrow={beat.title} bullets={(beat.items || []).map((i: string) => ({ key: i }))} />;
    case "checklist":
      return <ChecklistReveal durationInFrames={d} theme={T} title={beat.title} items={(beat.items || []).map((i: any) => (typeof i === "string" ? i : i.text))} />;
    case "process":
      return <NumberedSteps durationInFrames={d} theme={T} eyebrow={beat.eyebrow} title={beat.title} steps={(beat.steps || []).map((s: any) => ({ title: s.title, sub: s.desc, image: sf(s.image) }))} />;
    case "ingredients":
      return <FlowSteps durationInFrames={d} theme={T} title={beat.title} nodes={(beat.items || []).map((i: any) => ({ label: i.name, sub: i.amount, image: sf(i.image) }))} />;
    case "annotated":
      return <CutawayCallouts durationInFrames={d} theme={T} eyebrow={beat.eyebrow} title={beat.caption} image={sf(beat.image)} callouts={(beat.annotations || []).map((a: any) => ({ text: a.label, tx: a.x / 100, ty: a.y / 100 }))} />;
    case "diagram":
      return diagramFor(beat, d);
    case "rule":
      if (beat.key in BENEFIT_IDX)
        return <BenefitLockReveal durationInFrames={d} index={BENEFIT_IDX[beat.key]} />;
      return <ChapterTitle durationInFrames={d} theme={T} number={beat.number} title={beat.title} />;
    case "nametag":
      return <DocNameCard durationInFrames={d} name={beat.name} role={beat.role} />;
    case "blurexplainer":
      return <BlurExplainer durationInFrames={d} clip={beat.clip} image={beat.image} eyebrow={beat.eyebrow} title={beat.title} body={beat.body} side={beat.side} />;
    case "pizarra":
      return <Pizarra durationInFrames={d} title={beat.title} slides={(beat.slides || []).map((s: any) => ({ ...s, image: s.image }))} />;
    default:
      return null;
  }
}

// kinds que son COMPONENTES (no b-roll ni talk)
export const COMP_KINDS = new Set(["headline", "stat", "quote", "chips", "splitlist", "checklist", "process", "ingredients", "annotated", "diagram", "rule", "nametag", "blurexplainer", "pizarra", "scrolldoc",
  // broadcast
  "lowerthird", "alerta", "ticker", "antesdespues", "mito", "dato", "callout",
  // premium
  "plt", "pstat", "pquote", "pchapter", "pprotocol", "avexplain"]);

// KIT canónico del nicho Federer (para el gate ≥90% de variedad por video)
export const FEDERER_KIT_KINDS = ["headline", "stat", "quote", "chips", "splitlist", "checklist", "process", "ingredients", "annotated", "diagram", "pizarra", "scrolldoc",
  "lowerthird", "alerta", "ticker", "antesdespues", "mito", "dato", "callout",
  "plt", "pstat", "pquote", "pchapter", "pprotocol", "avexplain", "avblur", "avsplit"];

// OVERLAYS = se dibujan ENCIMA del avatar/b-roll (no lo tapan). El resto son takeover pantalla completa.
export const OVERLAY_KINDS = new Set(["lowerthird", "plt", "alerta", "ticker", "dato", "callout"]);

// ── mapeador para el video RECALENTADOS (datos del plan de los agentes Haiku) ──
function recalDiagram(concept: string, title: string, d: number): React.ReactNode {
  const c = (concept || "generic").toLowerCase();
  if (c.includes("nitros"))
    return <FlowSteps durationInFrames={d} theme={T} title={title || "Formación de nitrosaminas"} nodes={[{ label: "Nitratos", sub: "en la verdura" }, { label: "Nitritos", sub: "en la heladera" }, { label: "Nitrosaminas", sub: "al recalentar" }]} />;
  if (c.includes("oxid"))
    return <FlowSteps durationInFrames={d} theme={T} title={title || "Oxidación"} nodes={[{ label: "Grasa/proteína", sub: "expuesta al O₂" }, { label: "Se desestabiliza", sub: "en la heladera" }, { label: "Peróxidos", sub: "dañan el ADN" }]} />;
  if (c.includes("mail"))
    return <FlowSteps durationInFrames={d} theme={T} title={title || "Reacción de Maillard"} nodes={[{ label: "Proteína + azúcar" }, { label: "Calor repetido" }, { label: "AGEs", sub: "inflamación" }]} />;
  if (c.includes("dna") || c.includes("adn"))
    return <CutawayCallouts durationInFrames={d} theme={T} title={title || "Daño al ADN"} callouts={[{ text: "Compuesto reactivo", tx: 0.3, ty: 0.35 }, { text: "Se une al ADN", tx: 0.6, ty: 0.6 }, { text: "Mutación", tx: 0.5, ty: 0.8 }]} />;
  return <BulletCascade durationInFrames={d} theme={T} eyebrow={title || "Mecanismo"} bullets={[{ key: "Reacción química" }, { pre: "Riesgo de ", key: "cáncer" }]} />;
}

export function renderRecalComp(b: any, d: number, idx = 0): React.ReactNode {
  switch (b.kind) {
    case "scrolldoc":
      return <ScrollDoc durationInFrames={d} panels={b.panels || []} />;
    case "stat": {
      // rotación UNIFORME por índice → los componentes ricos aparecen seguido:
      // 0,1 resaltador amarillo · 2 cita con check · 3 stat grande (1 de cada 4).
      const pick = idx % 4;
      const val = Number(b.value) || 0, pre = b.prefix || "", suf = b.suffix || "", lab = b.label || b.support || "";
      if (pick === 3)
        return <BigStatReveal durationInFrames={d} theme={T} eyebrow={b.eyebrow} value={val} prefix={pre} suffix={suf} support={lab} />;
      if (pick === 2)
        return <CitationCard durationInFrames={d} journal="Literatura científica revisada por pares" finding={b.eyebrow || lab} stat={val} statPrefix={pre} statSuffix={suf} statLabel={lab} />;
      return <HighlightData durationInFrames={d} pre={pre} highlight={`${val}${suf}`} post={lab} source="Dato documentado" />;
    }
    case "headline": {
      const toks: string[] = Array.isArray(b.tokens) ? b.tokens : String(b.text || "").split(" ");
      const txt = toks.join(" ");
      // estudios/revistas → tapa de revista o recorte de diario (alterna)
      if (STUDY_RE.test(txt)) {
        if (idx % 2 === 0)
          return <NewspaperStudy durationInFrames={d} source={toks[0]} headline={toks.slice(1).join(" ") || txt} body="Estudio revisado por pares publicado en la literatura científica que documenta el riesgo asociado." highlight="riesgo asociado" />;
        return <StudyMagazine durationInFrames={d} journal={txt} title="Riesgo documentado y revisado por pares" stat="" />;
      }
      // no-estudio: mayoría resaltador amarillo, 1 de cada 3 caption cinético
      const key = b.key && toks.includes(b.key) ? b.key : toks[toks.length - 1];
      if (idx % 3 !== 0)
        return <HighlightData durationInFrames={d} pre={toks.slice(0, -1).join(" ")} highlight={toks[toks.length - 1]} post="" source={b.eyebrow} />;
      return <HookCaption durationInFrames={d} theme={T} words={toks.map((w: string) => ({ text: w, boxed: w === key }))} sub={b.eyebrow} />;
    }
    case "checklist":
      return <ChecklistReveal durationInFrames={d} theme={T} title={b.title} items={(b.items || []).map((i: any) => (typeof i === "string" ? i : i.text))} />;
    case "diagram":
      return recalDiagram(b.concept, b.title, d);
    case "pizarra": {
      const slides = (b.slides || []).map((s: any) => {
        const k = s.kind || (s.items ? "bullets" : "phrase");
        if (k === "phrase") return { kind: "phrase", eyebrow: b.title, heading: s.heading || s.text || s.title || "" };
        if (k === "steps") return { kind: "steps", eyebrow: b.title, steps: (s.steps || s.items || []).map((x: any) => (typeof x === "string" ? { title: x } : x)) };
        if (k === "imgtext") return { kind: "imgtext", eyebrow: b.title, body: s.body || s.text || "" };
        return { kind: "bullets", eyebrow: b.title, items: (s.items || []).map((x: any) => (typeof x === "string" ? x : x.text || x.title)) };
      });
      return <Pizarra durationInFrames={d} title={b.title} slides={slides.length ? slides : [{ kind: "phrase", eyebrow: b.title, heading: b.title || "" }]} />;
    }
    // ── base premium que faltaban en el ruteo ──
    case "quote":
      return <PullQuote durationInFrames={d} theme={T} quote={strip(b.text)} image={sf(b.image)} />;
    case "splitlist":
      return <BulletCascade durationInFrames={d} theme={T} eyebrow={b.title} bullets={(b.items || []).map((i: string) => ({ key: i }))} />;
    case "ingredients":
      return <FlowSteps durationInFrames={d} theme={T} title={b.title} nodes={(b.items || []).map((i: any) => ({ label: i.name, sub: i.amount, image: sf(i.image) }))} />;
    case "process":
      return <NumberedSteps durationInFrames={d} theme={T} eyebrow={b.eyebrow} title={b.title} steps={(b.steps || []).map((s: any) => ({ title: s.title, sub: s.desc, image: sf(s.image) }))} />;
    case "chips":
      return <SplitPanel durationInFrames={d} theme={T} title={b.title} image={sf(b.image)} bullets={b.chips || []} />;
    case "annotated":
      return <CutawayCallouts durationInFrames={d} theme={T} eyebrow={b.eyebrow} title={b.caption} image={sf(b.image)} callouts={(b.annotations || []).map((a: any) => ({ text: a.label, tx: a.x / 100, ty: a.y / 100 }))} />;
    // ── KIT BROADCAST Federer ──
    case "lowerthird":
      return <LowerThirdFederer title={b.title} subtitle={b.subtitle} kicker={b.kicker} />;
    case "alerta":
      return <AlertaCorner tag={b.tag} headline={b.headline || b.title} desc={b.desc || b.body} />;
    case "ticker":
      return <TickerAlerta tag={b.tag} items={b.items || []} />;
    case "antesdespues":
      return <AntesDespues before={b.before} after={b.after} labelA={b.labelA} labelB={b.labelB} />;
    case "mito":
      return <MitoVsRealidad myth={b.myth} fact={b.fact} />;
    case "dato":
      return <DatoClaveBadge value={Number(b.value) || 0} suffix={b.suffix} label={b.label} corner={b.corner} />;
    case "callout":
      return <CalloutFlecha text={b.text || b.title} tx={b.tx} ty={b.ty} from={b.from} />;
    // ── KIT PREMIUM Federer ──
    case "plt":
      return <PremiumLowerThird name={b.name} credential={b.credential} title={b.title} />;
    case "pstat":
      return <PremiumStatRing value={Number(b.value) || 0} suffix={b.suffix} eyebrow={b.eyebrow} support={b.support || b.label} pct={b.pct} />;
    case "pquote":
      return <PremiumAuthorityQuote quote={strip(b.quote || b.text)} by={b.by} role={b.role} />;
    case "pchapter":
      return <PremiumChapter index={b.index} kicker={b.kicker} title={b.title} />;
    case "pprotocol":
      return <PremiumProtocol title={b.title} steps={(b.steps || []).map((s: any) => ({ title: s.title, sub: s.desc || s.sub }))} zoom={b.zoom} />;
    case "avexplain":
      return <AvatarExplain avatarSrc={b.avatarSrc || "romnoc_opt.mp4"} image={b.image} kicker={b.kicker} title={b.title} body={b.body} side={b.side} mode={b.mode} startFrom={Math.round((b.start || 0) * 30)} appearAt={b.appearAt} />;
    case "avblur": // Federer se DESENFOCA + imagen con texto al lado
      return <AvatarExplain avatarSrc={b.avatarSrc || "romnoc_opt.mp4"} image={b.image} kicker={b.kicker} title={b.title} body={b.body} side={b.side || "left"} mode="imgtext" blur startFrom={Math.round((b.start || 0) * 30)} appearAt={b.appearAt} />;
    case "avsplit": // PIZARRA un lado + Federer (vivo) el otro
      return <AvatarExplain avatarSrc={b.avatarSrc || "romnoc_opt.mp4"} kicker={b.kicker} title={b.title} bullets={b.bullets} side={b.side || "right"} mode="split" startFrom={Math.round((b.start || 0) * 30)} appearAt={b.appearAt} />;
    default:
      return null;
  }
}
