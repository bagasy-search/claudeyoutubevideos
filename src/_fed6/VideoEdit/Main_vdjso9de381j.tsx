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
import { FocusCardsVdj } from "./FocusCards_vdjso9de381j";
import { HeadlineVdj } from "./Headline_vdjso9de381j";
import { CalloutVdj } from "./Callout_vdjso9de381j";
import { BoardVdj } from "./Board_vdjso9de381j";
import { F_INTER } from "./kit/premium/theme";
import { FEDZ_BEATS } from "./federer_vdjso9de381j_beats";
import { FEDZ_BROLL } from "./federer_vdjso9de381j_broll";
import { TALKSZ } from "./federer_vdjso9de381j_hooks";
import { renderFederer2Comp, COMP2_KINDS } from "./FedererComponents2";

// ── CANAL "Federer Archivos" · EL OTRO BÓTOX VERDE (centella asiática / óvalo facial) ─────────
// Avatar: FULL · HIDDEN (visual full). ⛔ CERO halfR / recuadro / PiP (feedback creador). Look CLÍNICO teal.
const TEAL = "#12B3AE";
const BG = "#0E1D23";
const AVA = "vdjso9de381j_opt.mp4";

const NEWFULL = new Set(["avatarpizarra", "avatarkeyword", "mitoverdad", "errorstinger", "guardaesto", "freezezoom", "focuscards"]);
const OVERLAY = new Set(["lowerthird", "frasecinetica"]);
const NOCAP = new Set(["avatarpizarra", "avatarkeyword", "focuscards"]);
const isComp = (k: string) => COMP2_KINDS.has(k) || NEWFULL.has(k) || OVERLAY.has(k);

const HERO_CAP = 3.6;
const capOf = (k: string): number =>
  k === "diagram" ? 10 : k === "board" ? 13 : k === "quote" ? 8 : k === "rule" ? 5
  : k === "errorstinger" ? 2.4 : k === "guardaesto" ? 8 : k === "mitoverdad" ? 6 : k === "freezezoom" ? 4.5
  : k === "lowerthird" ? 6 : k === "frasecinetica" ? 5 : k === "process" || k === "checklist" ? 9 : 6;

const compBeats = FEDZ_BEATS.filter((b: any) => isComp(b.kind));
const rawTop = FEDZ_BEATS.filter((b: any) => b.kind === "raw" && /^(img|vid|broll)\//.test(b.src || ""));
const VIDEO_END = Math.max(
  ...FEDZ_BEATS.map((b: any) => b.start + b.dur),
  FEDZ_BROLL.length ? FEDZ_BROLL[FEDZ_BROLL.length - 1].start + FEDZ_BROLL[FEDZ_BROLL.length - 1].dur : 0
) + 1.2;
export const TOTAL_FRAMES_VDJ = Math.round(VIDEO_END * 30);

const compDur = (b: any): number => {
  if (NOCAP.has(b.kind)) return Math.max(2, b.dur);
  const next = compBeats.filter((x: any) => x.start > b.start && !OVERLAY.has(x.kind)).sort((a: any, c: any) => a.start - c.start)[0];
  const room = next ? next.start - b.start - 0.1 : b.dur;
  const want = Math.max(2, Math.min(b.dur, capOf(b.kind), room));
  // si al componente le falta <1.2s para llegar al siguiente, se ESTIRA en vez de abrir un agujero
  return next && next.start - (b.start + want) < 1.2 ? Math.max(want, next.start - b.start - 0.1) : want;
};

function buildWindows(): AvatarWindow[] {
  type Pt = { start: number; mode: AvatarWindow["mode"]; pr: number };
  const pts: Pt[] = [];
  const content = [
    ...FEDZ_BROLL.map((b: any) => ({ start: b.start })),
    ...rawTop.map((b: any) => ({ start: b.start })),
  ].sort((a, b) => a.start - b.start);
  // ⛔ CERO halfR en este canal: Federer queda MAL encuadrado en split. Solo full / hidden.
  for (const b of content) pts.push({ start: b.start, mode: "hidden", pr: 0 });
  for (const b of compBeats) {
    const d = compDur(b);
    pts.push({ start: b.start, mode: "hidden", pr: 3 });
    pts.push({ start: b.start + d, mode: "hidden", pr: 1 });
  }
  pts.sort((a, b) => a.start - b.start || b.pr - a.pr);

  const w: AvatarWindow[] = [{ start: 0, mode: "full" }];
  let last = "full";
  const talkAt = (s: number) => TALKSZ.some((t) => s >= t.start - 0.05 && s < t.start + t.dur);
  for (const p of pts) {
    const mode: AvatarWindow["mode"] = p.pr < 3 && talkAt(p.start) ? "full" : p.mode;
    if (mode !== last) { w.push({ start: p.start, mode }); last = mode; }
  }
  // los tramos `talk` mandan: avatar FULL de punta a punta del tramo
  for (const t of TALKSZ) { w.push({ start: t.start, mode: "full" }); w.push({ start: +(t.start + t.dur).toFixed(2), mode: "hidden" }); }
  w.sort((a, b) => a.start - b.start);
  const coll: AvatarWindow[] = [];
  for (const x of w) { if (!coll.length || coll[coll.length - 1].mode !== x.mode) coll.push(x); }

  // HOOK: avatar FULL 2.4s (frames 0-72) y después HIDDEN durante el scrim
  const HOOK_FULL = 2.4;
  const HOOK_END = 8.0;
  const post = coll.filter((wnd) => wnd.start < HOOK_FULL || wnd.start >= HOOK_END);
  post.push({ start: 0, mode: "full" }, { start: HOOK_FULL, mode: "hidden" });
  const resume = coll.filter((wnd) => wnd.start < HOOK_END).pop();
  post.push({ start: HOOK_END, mode: resume && resume.start >= HOOK_FULL ? "hidden" : (resume?.mode ?? "hidden") });
  post.sort((a, b) => a.start - b.start);
  const out: AvatarWindow[] = [];
  for (const x of post) { if (!out.length || out[out.length - 1].mode !== x.mode) out.push(x); }

  // ── GAP-FILL anti-negro: donde NO hay contenido el avatar va FULL, nunca fondo teal pelado
  // (el fondo pelado sale como NEGRO en el MP4 y lo caza blackdetect). Umbral 0.2s: los
  // micro-huecos de 0.3s que deja compDur también cuentan.
  const cov: [number, number][] = [];
  for (const b of FEDZ_BROLL as any[]) cov.push([b.start, b.start + b.dur + 0.2]);
  for (const b of rawTop as any[]) cov.push([b.start, b.start + Math.min(b.dur, HERO_CAP) + 0.2]);
  // OVERLAY (lowerthird/frasecinetica) son TRANSPARENTES → NO cuentan como cobertura.
  for (const b of compBeats as any[]) if (!OVERLAY.has(b.kind)) cov.push([b.start, b.start + compDur(b) + 0.2]);
  cov.sort((a, c) => a[0] - c[0]);
  const merged: [number, number][] = [];
  for (const [s, e] of cov) { const l = merged[merged.length - 1]; if (l && s <= l[1] + 1.3) l[1] = Math.max(l[1], e); else merged.push([s, e]); }
  const gaps: [number, number][] = [];
  let prev = 0;
  for (const [s, e] of merged) { if (s - prev > 1.3) gaps.push([prev, s]); prev = Math.max(prev, e); }
  if (VIDEO_END - prev > 1.3) gaps.push([prev, VIDEO_END]);
  const modeAt = (t: number): AvatarWindow["mode"] => { let m = out[0].mode; for (const wd of out) { if (wd.start <= t + 1e-6) m = wd.mode; else break; } return m; };
  const inGap = (t: number) => t >= HOOK_END && gaps.some(([s, e]) => t >= Math.max(s, HOOK_END) - 1e-6 && t < e - 1e-6);
  const bounds = new Set<number>(out.map((wd) => wd.start));
  for (const [s, e] of gaps) { if (e <= HOOK_END) continue; bounds.add(+Math.max(s, HOOK_END).toFixed(2)); bounds.add(+e.toFixed(2)); }
  const sb = [...bounds].sort((a, b) => a - b);
  const out2: AvatarWindow[] = [];
  for (const t of sb) { const mode: AvatarWindow["mode"] = inGap(t) ? "full" : modeAt(t); if (!out2.length || out2[out2.length - 1].mode !== mode) out2.push({ start: t, mode }); }
  // ── PRESENCIA: un regreso a la cara de 2s es un corte más, no presencia. Los tramos FULL cortos
  // se estiran hasta 4.4s, pero SOLO comiéndose el hueco siguiente (nunca encadenando pases: eso
  // se tragaba el video entero y dejaba 69% de bata).
  const MINFULL = 4.4;
  const finOf = (arr: AvatarWindow[], i: number) => (i + 1 < arr.length ? arr[i + 1].start : VIDEO_END);
  const ext: AvatarWindow[] = [];
  for (let i = 0; i < out2.length; i++) {
    const wnd = out2[i];
    ext.push(wnd);
    if (wnd.mode !== "full") continue;
    const d = finOf(out2, i) - wnd.start;
    if (d >= MINFULL || i + 1 >= out2.length) continue;
    const nextEnd = finOf(out2, i + 1);
    const target = Math.min(wnd.start + MINFULL, nextEnd - 0.6);
    if (target > out2[i + 1].start + 0.2) { ext.push({ start: +target.toFixed(2), mode: out2[i + 1].mode }); i++; }
  }
  const fin2: AvatarWindow[] = [];
  for (const x of ext) { if (!fin2.length || fin2[fin2.length - 1].mode !== x.mode) fin2.push(x); }
  return fin2;
}
const AVATAR_WINDOWS = buildWindows();

const ctaBeat = [...compBeats].reverse().find((b: any) => b.kind === "nametag");
const CTA_AT = ctaBeat ? ctaBeat.start : VIDEO_END - 12;

const renderComp = (b: any, d: number) =>
  b.kind === "avatarpizarra" ? <AvatarPizarra durationInFrames={d} items={b.items} avatar={b.clip || AVA} avatarFrom={b.clip ? 0 : Math.round(b.start * 30)} />
  : b.kind === "avatarkeyword" ? <AvatarKeyword durationInFrames={d} items={b.items} avatar={b.clip || AVA} avatarFrom={b.clip ? 0 : Math.round(b.start * 30)} />
  : b.kind === "lowerthird" ? <LowerThird durationInFrames={d} title={b.title} desc={b.desc} kicker={b.kicker} tag={b.tag} tone={b.tone} />
  : b.kind === "mitoverdad" ? <MitoVerdad durationInFrames={d} myth={b.myth} truth={b.truth} flipAt={b.flipAt} />
  : b.kind === "frasecinetica" ? <FraseCinetica durationInFrames={d} words={b.words} ats={b.ats} perWord={b.perWord} tone={b.tone} />
  : b.kind === "errorstinger" ? <ErrorStinger durationInFrames={d} number={b.number} title={b.title} tone={b.tone} />
  : b.kind === "guardaesto" ? <GuardaEsto durationInFrames={d} title={b.title} items={b.items} tag={b.tag} />
  : b.kind === "freezezoom" ? <FreezeZoom durationInFrames={d} image={b.image} x={b.x} y={b.y} label={b.label} zoom={b.zoom} tone={b.tone} />
  : b.kind === "focuscards" ? <FocusCardsVdj durationInFrames={d} items={b.items} title={b.title} />
  // el `headline` del kit pinta las palabras no resaltadas con la tinta OSCURA del tema sobre un
  // panel oscuro → ilegibles (lo cazó la cuadrícula). Variante propia con contraste garantizado.
  : b.kind === "headline" ? <HeadlineVdj durationInFrames={d} tokens={b.tokens} eyebrow={b.eyebrow} />
  // `callout` del kit = CalloutMark, que espera {figure, caption, image}. Los directores mandan
  // {title, text} → tarjeta VACÍA (el creador la vio en 0:34). Variante propia con título+cuerpo.
  : b.kind === "callout" ? <CalloutVdj durationInFrames={d} title={b.title} text={b.text} eyebrow={b.eyebrow} />
  // `board` del kit = PizarraExplica, pensada para convivir con el avatar al costado: acá quedaba
  // encajonada, con el número TAPANDO el título y 2/3 de tarjeta vacía (el creador la vio en 4:12).
  : b.kind === "board" ? <BoardVdj durationInFrames={d} title={b.title} eyebrow={b.eyebrow} items={b.items} />
  // `splitlist` (BulletCascade) NO trae panel: el texto teal cae directo sobre el b-roll y sobre una
  // toma clara queda ILEGIBLE. `chips` (SplitPanel) sin imagen queda media pantalla vacía. Las dos
  // listas van a la misma tarjeta propia — el kind NO cambia, así que las duraciones no se mueven.
  : b.kind === "splitlist" || b.kind === "chips"
    ? <BoardVdj durationInFrames={d} title={b.title} eyebrow={b.eyebrow}
        items={(b.items || b.chips || []).map((it: any) => (typeof it === "string" ? { title: it } : { title: it.text ?? it.title, sub: it.sub }))} />
  : renderFederer2Comp(b, d, { medico: true });

export const MainVdj: React.FC = () => {
  const hookStart = 2.4;
  const hookDur = 5.4;
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* CAPA 1 — B-ROLL DENSO continuo (+3f de solape) */}
      {FEDZ_BROLL.map((b) => {
        const dd = Math.max(1, sec(b.dur) + 3);
        return (
          <Sequence key={b.name} from={sec(b.start)} durationInFrames={dd} premountFor={30}>
            <RawShot durationInFrames={dd} src={b.src} hue="cold" />
          </Sequence>
        );
      })}

      {/* CAPA 2 — FOTOS TOPEADAS (~3.6s) */}
      {rawTop.map((b: any) => {
        const d = Math.max(1, sec(Math.min(b.dur, HERO_CAP)));
        return (
          <Sequence key={b.id} from={sec(b.start)} durationInFrames={d} premountFor={20}>
            <RawShot durationInFrames={d} src={b.src} hue="cold" kicker={b.kicker} />
          </Sequence>
        );
      })}

      {/* CAPA 3 — AVATAR (full / hidden, cero recuadro/split) */}
      <AvatarLayer src={AVA} windows={AVATAR_WINDOWS} accent={TEAL} />

      {/* CAPA 4 — COMPONENTES / diagramas, TOPEADOS */}
      {compBeats.map((b: any) => {
        const d = Math.max(1, sec(compDur(b)));
        return (
          <Sequence key={`comp_${b.id}`} from={sec(b.start)} durationInFrames={d} layout="none">
            {renderComp(b, d)}
          </Sequence>
        );
      })}

      {/* HOOK — texto sobre el avatar oscurecido (arranca al segundo 2.4) */}
      <Sequence from={sec(hookStart)} durationInFrames={sec(hookDur)} layout="none">
        <AvatarScrimText durationInFrames={sec(hookDur)} setup="Una hoja que crece al borde de un charco…" impact="LEVANTA EL ÓVALO SIN AGUJAS" accentColor="#12B3AE" font={F_INTER} fontSize={104} />
      </Sequence>

      {/* ENDCARD */}
      <Sequence from={sec(CTA_AT)} durationInFrames={sec(Math.max(2, VIDEO_END - CTA_AT))} layout="none">
        <Endcard durationInFrames={sec(Math.max(2, VIDEO_END - CTA_AT))} />
      </Sequence>
    </AbsoluteFill>
  );
};
