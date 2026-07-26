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
import { FocusCardsV8 } from "./FocusCards_v8v252t741it";
import { LoopLockV8 } from "./LoopLock_v8v252t741it";
import { FedWhiteboard } from "../../FedWhiteboard";
import { SCENE_V8, WB_START, WB_DUR } from "./wb_v8v252t741it";
import { F_INTER } from "./kit/premium/theme";
import { FEDZ_BEATS } from "./federer_v8v252t741it_beats";
import { FEDZ_BROLL } from "./federer_v8v252t741it_broll";
import { TALKSZ } from "./federer_v8v252t741it_hooks";
import { renderFederer2Comp, COMP2_KINDS } from "./FedererComponents2";

// ── CANAL "Federer Archivos" · LO QUE MILLONES HACEN CADA MAÑANA DESPUÉS DE LOS 60 ──────────────
// Avatar en DOS tandas de HeyGen unidas (la 2ª arranca en 1325.09s). 34.6 min.
// Avatar: FULL · HIDDEN (visual full). ⛔ CERO halfR / recuadro / PiP (feedback creador). Teal clínico.
const TEAL = "#12B3AE";
const BG = "#0E1D23";
const AVA = "v8v252t741it_opt.mp4";
const AVATAR_END = 2074.05;   // duración real del mp4: nunca pasarse (si no, último frame congelado)

const NEWFULL = new Set(["avatarpizarra", "avatarkeyword", "mitoverdad", "errorstinger", "guardaesto", "freezezoom", "focuscards", "looplock"]);
const OVERLAY = new Set(["lowerthird", "frasecinetica"]);
const NOCAP = new Set(["avatarpizarra", "avatarkeyword", "focuscards"]);
const isComp = (k: string) => COMP2_KINDS.has(k) || NEWFULL.has(k) || OVERLAY.has(k);

const HERO_CAP = 3.6;
const capOf = (k: string): number =>
  k === "diagram" ? 9 : k === "board" ? 12 : k === "quote" ? 8 : k === "rule" ? 5
  : k === "errorstinger" ? 2 : k === "guardaesto" ? 8 : k === "mitoverdad" ? 6 : k === "freezezoom" ? 4.5
  : k === "lowerthird" ? 6 : k === "frasecinetica" ? 5 : k === "process" || k === "checklist" ? 9 : 6;

const compBeats = FEDZ_BEATS.filter((b: any) => isComp(b.kind));
const rawTop = FEDZ_BEATS.filter((b: any) => b.kind === "raw" && /^(img|vid)\//.test(b.src || ""));
const VIDEO_END = Math.min(
  Math.max(...FEDZ_BEATS.map((b: any) => b.start + b.dur), FEDZ_BROLL.length ? FEDZ_BROLL[FEDZ_BROLL.length - 1].start + FEDZ_BROLL[FEDZ_BROLL.length - 1].dur : 0) + 1.2,
  AVATAR_END
);
export const TOTAL_FRAMES_V8 = Math.round(VIDEO_END * 30);

const compDur = (b: any): number => {
  if (NOCAP.has(b.kind)) return Math.max(2, b.dur);
  const next = compBeats.filter((x: any) => x.start > b.start && !OVERLAY.has(x.kind)).sort((a: any, c: any) => a.start - c.start)[0];
  const room = next ? next.start - b.start - 0.1 : b.dur;
  return Math.max(2, Math.min(b.dur, capOf(b.kind), room));
};

// FULL breve del avatar: arranque de cada sección grande
const SECKEY = /^(hook|story|principio|mecanismo|orto|caidas|presenta|manana|paso1|paso2|paso3|paso4|pastilla|piernas|remedio|guia|honesto|medir|senales|error|enemigo|recap|cierre|teaser|close)$/;
const FULL_AT: number[] = [];
FEDZ_BEATS.filter((b: any) => SECKEY.test(b.key) && b.id.endsWith("_0")).forEach((b: any) => FULL_AT.push(b.start));

function buildWindows(): AvatarWindow[] {
  type Pt = { start: number; mode: AvatarWindow["mode"]; pr: number };
  const pts: Pt[] = [];
  const content = [...FEDZ_BROLL.map((b: any) => ({ start: b.start, src: b.src })), ...rawTop.map((b: any) => ({ start: b.start, src: b.src }))].sort((a, b) => a.start - b.start);
  for (const b of content) {
    // ⛔ CERO halfR en este canal (feedback creador): Federer queda MAL encuadrado en split.
    pts.push({ start: b.start, mode: "hidden", pr: 0 });
  }
  for (const b of compBeats) {
    const d = compDur(b);
    pts.push({ start: b.start, mode: "hidden", pr: 3 });
    pts.push({ start: b.start + d, mode: "hidden", pr: 1 });
  }
  for (const s of FULL_AT) { pts.push({ start: s, mode: "full", pr: 4 }); pts.push({ start: +(s + 2.6).toFixed(2), mode: "hidden", pr: 2 }); }
  pts.sort((a, b) => a.start - b.start || b.pr - a.pr);

  const w: AvatarWindow[] = [{ start: 0, mode: "full" }];
  let last = "full";
  const talkAt = (s: number) => TALKSZ.some((t) => s >= t.start - 0.05 && s < t.start + t.dur);
  for (const p of pts) {
    const mode: AvatarWindow["mode"] = p.pr < 3 && talkAt(p.start) ? "full" : p.mode;
    if (mode !== last) { w.push({ start: p.start, mode }); last = mode; }
  }
  for (const t of TALKSZ) { w.push({ start: t.start, mode: "full" }); w.push({ start: +(t.start + t.dur).toFixed(2), mode: "hidden" }); }
  w.sort((a, b) => a.start - b.start);
  const coll: AvatarWindow[] = [];
  for (const x of w) { if (!coll.length || coll[coll.length - 1].mode !== x.mode) coll.push(x); }

  // HOOK: avatar FULL 2.4s (frames 0-72) y después HIDDEN durante el scrim
  const HOOK_FULL = 2.4;
  const HOOK_END = 8.2;
  const post = coll.filter((wnd) => wnd.start < HOOK_FULL || wnd.start >= HOOK_END);
  post.push({ start: 0, mode: "full" }, { start: HOOK_FULL, mode: "hidden" });
  const resume = coll.filter((wnd) => wnd.start < HOOK_END).pop();
  post.push({ start: HOOK_END, mode: resume && resume.start >= HOOK_FULL ? "hidden" : (resume?.mode ?? "hidden") });
  post.sort((a, b) => a.start - b.start);
  const out: AvatarWindow[] = [];
  for (const x of post) { if (!out.length || out[out.length - 1].mode !== x.mode) out.push(x); }

  // ── GAP-FILL anti-negro: donde NO hay contenido, el avatar va FULL, nunca fondo pelado.
  const cov: [number, number][] = [];
  for (const b of FEDZ_BROLL as any[]) cov.push([b.start, b.start + b.dur + 0.2]);
  for (const b of rawTop as any[]) cov.push([b.start, b.start + Math.min(b.dur, HERO_CAP) + 0.2]);
  // OVERLAY son TRANSPARENTES: no cuentan como cobertura (el avatar va FULL detrás del cartel).
  for (const b of compBeats as any[]) if (!OVERLAY.has(b.kind)) cov.push([b.start, b.start + compDur(b) + 0.2]);
  cov.push([WB_START, WB_START + WB_DUR]);   // la pizarra tapa la pantalla entera
  cov.sort((a, c) => a[0] - c[0]);
  const merged: [number, number][] = [];
  for (const [s, e] of cov) { const l = merged[merged.length - 1]; if (l && s <= l[1] + 0.2) l[1] = Math.max(l[1], e); else merged.push([s, e]); }
  const gaps: [number, number][] = [];
  let prev = 0;
  for (const [s, e] of merged) { if (s - prev > 0.6) gaps.push([prev, s]); prev = Math.max(prev, e); }
  if (VIDEO_END - prev > 0.6) gaps.push([prev, VIDEO_END]);
  const modeAt = (t: number): AvatarWindow["mode"] => { let m = out[0].mode; for (const w of out) { if (w.start <= t + 1e-6) m = w.mode; else break; } return m; };
  const inGap = (t: number) => t >= HOOK_END && gaps.some(([s, e]) => t >= Math.max(s, HOOK_END) - 1e-6 && t < e - 1e-6);
  const bounds = new Set<number>(out.map((w) => w.start));
  for (const [s, e] of gaps) { if (e <= HOOK_END) continue; bounds.add(+Math.max(s, HOOK_END).toFixed(2)); bounds.add(+e.toFixed(2)); }
  const sb = [...bounds].sort((a, b) => a - b);
  const out2: AvatarWindow[] = [];
  for (const t of sb) { const mode: AvatarWindow["mode"] = inGap(t) ? "full" : modeAt(t); if (!out2.length || out2[out2.length - 1].mode !== mode) out2.push({ start: t, mode }); }
  return out2;
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
  : b.kind === "focuscards" ? <FocusCardsV8 durationInFrames={d} items={b.items} title={b.title} />
  : b.kind === "looplock" ? <LoopLockV8 durationInFrames={d} title={b.title} sub={b.sub} />
  : renderFederer2Comp(b, d, { medico: true });

export const MainV8: React.FC = () => {
  const hookStart = 2.4;
  const hookDur = 5.6;
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* CAPA 1 — B-ROLL DENSO continuo (aislado en broll/v8v252t741it/) */}
      {FEDZ_BROLL.map((b) => {
        const dd = Math.max(1, sec(b.dur) + 3);
        return (
          <Sequence key={b.name} from={sec(b.start)} durationInFrames={dd} premountFor={30}>
            <RawShot durationInFrames={dd} src={b.src} hue="cold" />
          </Sequence>
        );
      })}

      {/* CAPA 2 — FOTOS gpt-image-2 TOPEADAS (~3.6s) */}
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

      {/* PIZARRA VOX — el "por qué funciona" de la remolacha (escena diseñada, pantalla completa) */}
      <Sequence from={sec(WB_START)} durationInFrames={sec(WB_DUR)} layout="none">
        <FedWhiteboard scene={SCENE_V8} theme="white" />
      </Sequence>

      {/* HOOK — texto sobre el avatar oscurecido (arranca al segundo 2.4) */}
      <Sequence from={sec(hookStart)} durationInFrames={sec(hookDur)} layout="none">
        <AvatarScrimText durationInFrames={sec(hookDur)} setup="El movimiento más peligroso del día, después de los 60…" impact="ES PARARTE DE LA CAMA" accentColor="#12B3AE" font={F_INTER} fontSize={110} />
      </Sequence>

      {/* ENDCARD */}
      <Sequence from={sec(CTA_AT)} durationInFrames={sec(Math.max(2, VIDEO_END - CTA_AT))} layout="none">
        <Endcard durationInFrames={sec(Math.max(2, VIDEO_END - CTA_AT))} />
      </Sequence>
    </AbsoluteFill>
  );
};
