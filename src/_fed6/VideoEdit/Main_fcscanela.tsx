import { AbsoluteFill, Sequence } from "remotion";
import { sec } from "./theme";
import { AvatarLayer, AvatarWindow } from "./scenes/AvatarLayer";
import { AvatarScrimText } from "./scenes/AvatarScrimText";
import { RawShot } from "./scenes/RawShot";
import { Endcard } from "./scenes/Endcard";
import { AvatarPizarra } from "./scenes/AvatarPizarra";
import { AvatarKeyword } from "./scenes/AvatarKeyword";
import { LowerThird } from "./scenes/LowerThird";
import { MitoVerdad } from "./scenes/MitoVerdad";
import { FraseCinetica } from "./scenes/FraseCinetica";
import { ErrorStinger } from "./scenes/ErrorStinger";
import { GuardaEsto } from "./scenes/GuardaEsto";
import { FreezeZoom } from "./scenes/FreezeZoom";
import { F_INTER } from "./kit/premium/theme";
import { FCSCANELA_BEATS } from "./fcscanela_beats";
import { FCSCANELA_BROLL } from "./fcscanela_beats";
import { FCSCANELA_COVER } from "./fcscanela_beats";
import { renderFederer2Comp, COMP2_KINDS } from "./FedererComponents2";

// ── CANAL "Federer Archivos" · LA FRUTA QUE LIMPIA LOS COÁGULOS DE LAS PIERNAS (piña/bromelina) ──
// Clon EXACTO del Main de fcsromero/fcsmanchas/federer6. Avatar en 3 modos, CERO recuadro: FULL
// (habla / talk) · HIDDEN (b-roll/foto/componente a pantalla completa) · SPLIT halfR (avatar
// mitad derecha + imagen mitad izquierda, al ras). Páginas/cocina/guía = full-screen.
const TEAL = "#12B3AE";
const BG = "#0E1D23";

const NEWFULL = new Set(["avatarpizarra", "avatarkeyword", "mitoverdad", "errorstinger", "guardaesto", "freezezoom"]);
const OVERLAY = new Set(["lowerthird", "frasecinetica"]);
const NOCAP = new Set(["avatarpizarra", "avatarkeyword"]);
const isComp = (k: string) => COMP2_KINDS.has(k) || NEWFULL.has(k) || OVERLAY.has(k);

const HERO_CAP = 3.6;
const capOf = (k: string): number =>
  k === "diagram" ? 10 : k === "board" ? 13 : k === "quote" ? 8 : k === "rule" ? 5
  : k === "errorstinger" ? 2 : k === "guardaesto" ? 8 : k === "mitoverdad" ? 6 : k === "freezezoom" ? 4.5
  : k === "lowerthird" ? 6 : k === "frasecinetica" ? 5 : k === "process" || k === "checklist" ? 9 : 6;

const compBeats = FCSCANELA_BEATS.filter((b: any) => isComp(b.kind));
const rawTop = FCSCANELA_BEATS.filter((b: any) => b.kind === "raw" && /^(img|vid)\//.test(b.src || ""));
const VIDEO_END = Math.max(...FCSCANELA_BEATS.map((b: any) => b.start + b.dur), FCSCANELA_BROLL.length ? FCSCANELA_BROLL[FCSCANELA_BROLL.length - 1].start + FCSCANELA_BROLL[FCSCANELA_BROLL.length - 1].dur : 0) + 1.2;
export const TOTAL_FRAMES_FCSCANELA = Math.round(VIDEO_END * 30);

const compDur = (b: any): number => {
  if (NOCAP.has(b.kind)) return Math.max(2, b.dur);
  const next = compBeats.filter((x: any) => x.start > b.start && !OVERLAY.has(x.kind)).sort((a: any, c: any) => a.start - c.start)[0];
  const room = next ? next.start - b.start - 0.1 : b.dur;
  return Math.max(2, Math.min(b.dur, capOf(b.kind), room));
};

// ⛔ FIX DEFINITIVO ANTI-HUECO (aplica a TODO video del canal): el avatar es el FONDO garantizado.
// Cada contenido (clip/foto/componente) cubre SOLO su cobertura real (`cov`); apenas termina y hasta
// que empieza el próximo contenido, el avatar vuelve a FULL. Así NUNCA se ve el fondo #0E1D23 ni la
// "mitad azul" del split. Antes: el avatar quedaba hidden por todo el slot y el clip (10s) < slot (20s)
// dejaba fondo muerto. Medido: 25 huecos / 129s en este video. Ahora: 0.
function buildWindows(): AvatarWindow[] {
  type Pt = { start: number; mode: AvatarWindow["mode"]; pr: number };
  const pts: Pt[] = [{ start: 0, mode: "full", pr: 0 }];
  let flip = false;
  // COVER unificado (video+foto) con su cobertura real. Video alterna hidden/halfR; foto/libro = hidden.
  for (const c of FCSCANELA_COVER) {
    const forceHidden = c.kind === "photo" || /libro|cocina|pagina|guia/.test(c.src || "");
    const mode: AvatarWindow["mode"] = forceHidden ? "hidden" : (flip ? "halfR" : "hidden");
    if (c.kind === "video" && !forceHidden) flip = !flip;
    pts.push({ start: c.start, mode, pr: 3 });                                   // contenido cubre
    pts.push({ start: +(c.start + c.cov).toFixed(2), mode: "full", pr: 1 });     // hueco → avatar FULL
  }
  for (const b of compBeats) {
    const d = compDur(b);
    pts.push({ start: b.start, mode: "hidden", pr: 4 });                         // componente full-screen → avatar hidden
    pts.push({ start: +(b.start + d).toFixed(2), mode: "full", pr: 1 });         // termina → avatar FULL
  }
  // el avatar full lo dan los huecos; el modo activo = último punto en el tiempo. En un MISMO ms,
  // el de MAYOR pr debe aplicarse ÚLTIMO para ganar (colapso "last wins") → ordená pr ASCENDENTE.
  // ⛔ Si se ordena pr DESC, el "full" (pr1) del fin de un clip pisa el "hidden" (pr3) del próximo
  // contenido cuando el borde coincide (clip que llena todo su slot) → avatar tapa el 80% del b-roll.
  pts.sort((a, b) => a.start - b.start || a.pr - b.pr);
  const coll: AvatarWindow[] = [];
  let last = "";
  for (const p of pts) { if (p.mode !== last) { coll.push({ start: p.start, mode: p.mode }); last = p.mode; } }

  // HOOK: avatar full ~1.4s y después HIDDEN durante el hook (texto sobre el clip)
  const HOOK_END = 7.0;
  const post = coll.filter((wnd) => wnd.start < 1.4 || wnd.start >= HOOK_END);
  post.push({ start: 0, mode: "full" }, { start: 1.4, mode: "hidden" });
  const resume = coll.filter((wnd) => wnd.start < HOOK_END).pop();
  post.push({ start: HOOK_END, mode: resume && resume.start >= 1.4 ? "hidden" : (resume?.mode ?? "full") });
  post.sort((a, b) => a.start - b.start);
  const out: AvatarWindow[] = [];
  for (const x of post) { if (!out.length || out[out.length - 1].mode !== x.mode) out.push(x); }
  return out;
}
const AVATAR_WINDOWS = buildWindows();

// ── SPLIT halfR: imagen CENTRADA en la mitad IZQUIERDA (marco 960px) ───────────
const HALFR: [number, number][] = [];
for (let i = 0; i < AVATAR_WINDOWS.length; i++) {
  if (AVATAR_WINDOWS[i].mode === "halfR") {
    const s = AVATAR_WINDOWS[i].start;
    const e = i + 1 < AVATAR_WINDOWS.length ? AVATAR_WINDOWS[i + 1].start : VIDEO_END;
    HALFR.push([s, e]);
  }
}
const inHalfR = (t: number) => HALFR.some(([s, e]) => t >= s - 0.05 && t < e - 0.1);
const HalfLeft: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: 960, height: 1080, overflow: "hidden", background: "#0E1D23" }}>{children}</div>
);

const ctaBeat = [...compBeats].reverse().find((b: any) => b.kind === "nametag");
const CTA_AT = ctaBeat ? ctaBeat.start : VIDEO_END - 12;

const renderComp = (b: any, d: number) =>
  b.kind === "avatarpizarra" ? <AvatarPizarra durationInFrames={d} items={b.items} avatar={b.clip || "fcscanela_opt.mp4"} avatarFrom={b.clip ? 0 : Math.round(b.start * 30)} objectPos="10% 45%" />
  : b.kind === "avatarkeyword" ? <AvatarKeyword durationInFrames={d} items={b.items} avatar={b.clip || "fcscanela_opt.mp4"} avatarFrom={b.clip ? 0 : Math.round(b.start * 30)} />
  : b.kind === "lowerthird" ? <LowerThird durationInFrames={d} title={b.title} desc={b.desc} kicker={b.kicker} tag={b.tag} tone={b.tone} />
  : b.kind === "mitoverdad" ? <MitoVerdad durationInFrames={d} myth={b.myth} truth={b.truth} flipAt={b.flipAt} />
  : b.kind === "frasecinetica" ? <FraseCinetica durationInFrames={d} words={b.words} ats={b.ats} perWord={b.perWord} tone={b.tone} />
  : b.kind === "errorstinger" ? <ErrorStinger durationInFrames={d} number={b.number} title={b.title} tone={b.tone} />
  : b.kind === "guardaesto" ? <GuardaEsto durationInFrames={d} title={b.title} items={b.items} tag={b.tag} />
  : b.kind === "freezezoom" ? <FreezeZoom durationInFrames={d} image={b.image} x={b.x} y={b.y} label={b.label} zoom={b.zoom} tone={b.tone} />
  : renderFederer2Comp(b, d, { medico: true });

export const MainFcscanela: React.FC = () => {
  const hookDur = 5.4;
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* CAPA 1 — B-ROLL DENSO continuo (stock .mp4) */}
      {FCSCANELA_BROLL.map((b) => {
        const dd = Math.max(1, sec(((b as any).cov ?? Math.min(b.dur, 10)) + 0.6));  // +0.6 cola: cubre sub-huecos de redondeo (queda bajo el avatar/próximo clip)
        const half = inHalfR(b.start);
        const shot = <RawShot durationInFrames={dd} src={b.src} hue="cold" />;
        return (
          <Sequence key={b.name} from={sec(b.start)} durationInFrames={dd} premountFor={30}>
            {half ? <HalfLeft>{shot}</HalfLeft> : shot}
          </Sequence>
        );
      })}

      {/* CAPA 2 — FOTOS fcscanela_*.png TOPEADAS (~3.6s) */}
      {rawTop.map((b: any) => {
        const d = Math.max(1, sec(Math.min(b.dur, HERO_CAP) + 0.6));  // +0.6 cola anti sub-hueco (la foto es estática, extenderla no cuesta)
        const half = inHalfR(b.start);
        const shot = <RawShot durationInFrames={d} src={b.src} hue="cold" kicker={b.kicker} />;
        return (
          <Sequence key={b.id} from={sec(b.start)} durationInFrames={d} premountFor={20}>
            {half ? <HalfLeft>{shot}</HalfLeft> : shot}
          </Sequence>
        );
      })}

      {/* CAPA 3 — AVATAR (full / hidden / split halfR, cero recuadro) */}
      <AvatarLayer src="fcscanela_opt.mp4" windows={AVATAR_WINDOWS} accent={TEAL} avatarFocus={{ x: 0.29, y: 0.3, splitZoom: 1.12 }} />

      {/* CAPA 4 — COMPONENTES / diagramas, TOPEADOS */}
      {compBeats.map((b: any) => {
        const d = Math.max(1, sec(compDur(b)));
        return (
          <Sequence key={`comp_${b.id}`} from={sec(b.start)} durationInFrames={d} layout="none">
            {renderComp(b, d)}
          </Sequence>
        );
      })}

      {/* HOOK — texto sobre la foto piña + pierna con venas marcadas */}
      <Sequence from={sec(1.4)} durationInFrames={sec(hookDur)} layout="none">
        <AvatarScrimText durationInFrames={sec(hookDur)} setup="¿Azúcar alta al despertar? ¿Duermes mal, pies fríos? Un médico lo explica…" impact="1 TAZA DE CANELA ANTES DE DORMIR" accentColor="#12B3AE" font={F_INTER} fontSize={104} />
      </Sequence>

      {/* ENDCARD */}
      <Sequence from={sec(CTA_AT)} durationInFrames={sec(Math.max(2, VIDEO_END - CTA_AT))} layout="none">
        <Endcard durationInFrames={sec(Math.max(2, VIDEO_END - CTA_AT))} />
      </Sequence>
    </AbsoluteFill>
  );
};
