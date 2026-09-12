import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { sec } from "./theme";
import { AvatarLayer, AvatarWindow } from "./scenes/AvatarLayer";
import { AvatarScrimText } from "./scenes/AvatarScrimText";
import { RawShot } from "./scenes/RawShot";
import { Endcard } from "./scenes/Endcard";
import { AvatarKeyword } from "./scenes/AvatarKeyword";
import { LowerThird } from "./scenes/LowerThird";
import { MitoVerdad } from "./scenes/MitoVerdad";
import { FraseCinetica } from "./scenes/FraseCinetica";
import { ErrorStinger } from "./scenes/ErrorStinger";
import { GuardaEsto } from "./scenes/GuardaEsto";
import { F_INTER } from "./kit/premium/theme";
import { FEDZ_BEATS } from "./federer_vr4b7bsn4mcv_beats";
import { FEDZ_BROLL } from "./federer_vr4b7bsn4mcv_broll";
import { TALKSZ } from "./federer_vr4b7bsn4mcv_hooks";
import { renderFederer2Comp, COMP2_KINDS } from "./FedererComponents2";
import { FedWhiteboard, SCENE_ROMERO } from "../../FedWhiteboard";

// ── CANAL "Federer Consejos Salud" · TRUCO NOCTURNO DEL ROMERO ────────────────
// Avatar en 3 modos, CERO recuadro: FULL · HIDDEN (visual full) · SPLIT halfR.
const TEAL = "#12B3AE";
const BG = "#0E1D23";
const AVA = "vr4b7bsn4mcv_opt.mp4";

const NEWFULL = new Set(["avatarkeyword", "mitoverdad", "errorstinger", "guardaesto", "freezezoom"]);
const OVERLAY = new Set(["lowerthird", "frasecinetica"]);
const NOCAP = new Set(["avatarkeyword"]);
const isComp = (k: string) => COMP2_KINDS.has(k) || NEWFULL.has(k) || OVERLAY.has(k);

const HERO_CAP = 3.6;
const capOf = (k: string): number =>
  k === "diagram" ? 10 : k === "board" ? 13 : k === "quote" ? 8 : k === "rule" ? 5
  : k === "errorstinger" ? 2 : k === "guardaesto" ? 8 : k === "mitoverdad" ? 6 : k === "freezezoom" ? 4.5
  : k === "lowerthird" ? 6 : k === "frasecinetica" ? 5 : k === "process" || k === "checklist" ? 9 : 6;

const compBeats = FEDZ_BEATS.filter((b: any) => isComp(b.kind));
const rawTop = FEDZ_BEATS.filter((b: any) => b.kind === "raw" && /^(img|vid)\//.test(b.src || ""));
const VIDEO_END = Math.max(...FEDZ_BEATS.map((b: any) => b.start + b.dur), FEDZ_BROLL.length ? FEDZ_BROLL[FEDZ_BROLL.length - 1].start + FEDZ_BROLL[FEDZ_BROLL.length - 1].dur : 0) + 1.2;
export const TOTAL_FRAMES_VR = Math.round(VIDEO_END * 30);

// PIZARRA (mecanismo del colágeno) — beat del beneficio 3, PiP con MI avatar (muted)
const WB_START = 552.0;
const WB_DUR = 44.0;
const WB_SCENE = { ...SCENE_ROMERO, avatarSrc: staticFile(`avatar_clips/vr4b7bsn4mcv/wb.mp4`), muted: true };

const compDur = (b: any): number => {
  if (NOCAP.has(b.kind)) return Math.max(2, b.dur);
  const next = compBeats.filter((x: any) => x.start > b.start && !OVERLAY.has(x.kind)).sort((a: any, c: any) => a.start - c.start)[0];
  const room = next ? next.start - b.start - 0.1 : b.dur;
  return Math.max(2, Math.min(b.dur, capOf(b.kind), room));
};

// FULL breve del avatar: arranque de cada sección clave + cierre
const FULL_AT: number[] = [];
FEDZ_BEATS.filter((b: any) => /^(hook|egipto|meca_intro|ben_intro|ben1|ben2|ben3|ben5|error|receta_intro|honesto|recap|close)$/.test(b.key) && (b.id.endsWith("_0")))
  .forEach((b: any) => FULL_AT.push(b.start));

function buildWindows(): AvatarWindow[] {
  type Pt = { start: number; mode: AvatarWindow["mode"]; pr: number };
  const pts: Pt[] = [];
  let flip = false;
  const content = [...FEDZ_BROLL.map((b: any) => ({ start: b.start, src: b.src })), ...rawTop.map((b: any) => ({ start: b.start, src: b.src }))].sort((a, b) => a.start - b.start);
  for (const b of content) {
    const forceHidden = /libro|cocina|guia|federer|pareja|dorso/.test(b.src || "");
    const mode: AvatarWindow["mode"] = forceHidden ? "hidden" : (flip ? "halfR" : "hidden");
    if (!forceHidden) flip = !flip;
    pts.push({ start: b.start, mode, pr: 0 });
  }
  for (const b of compBeats) {
    const d = compDur(b);
    pts.push({ start: b.start, mode: "hidden", pr: 3 });
    pts.push({ start: b.start + d, mode: "hidden", pr: 1 });
  }
  // durante la pizarra el avatar global va HIDDEN (la pizarra la cubre + su propio PiP)
  pts.push({ start: WB_START, mode: "hidden", pr: 4 });
  pts.push({ start: WB_START + WB_DUR, mode: "hidden", pr: 2 });
  for (const s of FULL_AT) { pts.push({ start: s, mode: "full", pr: 4 }); pts.push({ start: +(s + 2.6).toFixed(2), mode: "hidden", pr: 2 }); }
  pts.sort((a, b) => a.start - b.start || b.pr - a.pr);

  const w: AvatarWindow[] = [{ start: 0, mode: "full" }];
  let last = "full";
  const talkAt = (s: number) => TALKSZ.some((t) => s >= t.start - 0.05 && s < t.start + t.dur);
  for (const p of pts) {
    const mode: AvatarWindow["mode"] = p.pr < 3 && talkAt(p.start) ? "full" : p.mode;
    if (mode !== last) { w.push({ start: p.start, mode }); last = mode; }
  }
  for (const t of TALKSZ) {
    if (t.start >= WB_START - 0.2 && t.start < WB_START + WB_DUR) continue;
    w.push({ start: t.start, mode: "full" }); w.push({ start: +(t.start + t.dur).toFixed(2), mode: "hidden" });
  }
  w.sort((a, b) => a.start - b.start);
  const coll: AvatarWindow[] = [];
  for (const x of w) { if (!coll.length || coll[coll.length - 1].mode !== x.mode) coll.push(x); }

  // HOOK: avatar FULL 2.2s (frames 0-66) y después HIDDEN durante el scrim
  const HOOK_FULL = 2.2;
  const HOOK_END = 7.4;
  const post = coll.filter((wnd) => wnd.start < HOOK_FULL || wnd.start >= HOOK_END);
  post.push({ start: 0, mode: "full" }, { start: HOOK_FULL, mode: "hidden" });
  const resume = coll.filter((wnd) => wnd.start < HOOK_END).pop();
  post.push({ start: HOOK_END, mode: resume && resume.start >= HOOK_FULL ? "hidden" : (resume?.mode ?? "hidden") });
  post.sort((a, b) => a.start - b.start);
  const out: AvatarWindow[] = [];
  for (const x of post) { if (!out.length || out[out.length - 1].mode !== x.mode) out.push(x); }
  return out;
}
const AVATAR_WINDOWS = buildWindows();

const HALFR: [number, number][] = [];
for (let i = 0; i < AVATAR_WINDOWS.length; i++) {
  if (AVATAR_WINDOWS[i].mode === "halfR") {
    const s = AVATAR_WINDOWS[i].start;
    const e = i + 1 < AVATAR_WINDOWS.length ? AVATAR_WINDOWS[i + 1].start : VIDEO_END;
    HALFR.push([s, e]);
  }
}
const spanHalfR = (start: number, dur: number) => HALFR.some(([s, e]) => start >= s - 0.05 && start + dur <= e + 0.05);
const HalfLeft: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: 960, height: 1080, overflow: "hidden", background: "#0E1D23" }}>
    {children}
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", boxShadow: "inset -40px 0 80px rgba(0,0,0,0.45)" }} />
    <div style={{ position: "absolute", right: 0, top: 0, width: 3, height: "100%", background: "linear-gradient(180deg, transparent, rgba(18,179,174,0.4), transparent)" }} />
  </div>
);

const ctaBeat = [...compBeats].reverse().find((b: any) => b.kind === "nametag");
const CTA_AT = ctaBeat ? ctaBeat.start : VIDEO_END - 12;

const renderComp = (b: any, d: number) =>
  b.kind === "avatarkeyword" ? <AvatarKeyword durationInFrames={d} items={b.items} avatar={b.clip || AVA} avatarFrom={b.clip ? 0 : Math.round(b.start * 30)} />
  : b.kind === "lowerthird" ? <LowerThird durationInFrames={d} title={b.title} desc={b.desc} kicker={b.kicker} tag={b.tag} tone={b.tone} />
  : b.kind === "mitoverdad" ? <MitoVerdad durationInFrames={d} myth={b.myth} truth={b.truth} flipAt={b.flipAt} />
  : b.kind === "frasecinetica" ? <FraseCinetica durationInFrames={d} words={b.words} ats={b.ats} perWord={b.perWord} tone={b.tone} />
  : b.kind === "errorstinger" ? <ErrorStinger durationInFrames={d} number={b.number} title={b.title} tone={b.tone} />
  : b.kind === "guardaesto" ? <GuardaEsto durationInFrames={d} title={b.title} items={b.items} tag={b.tag} />
  : renderFederer2Comp(b, d, { medico: true });

export const MainVR: React.FC = () => {
  const hookStart = 2.2;
  const hookDur = 5.0;
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* CAPA 1 — B-ROLL DENSO continuo */}
      {FEDZ_BROLL.map((b) => {
        const dd = Math.max(1, sec(b.dur) + 3);
        const half = spanHalfR(b.start, b.dur);
        const shot = <RawShot durationInFrames={dd} src={b.src} hue="cold" />;
        return (
          <Sequence key={b.name} from={sec(b.start)} durationInFrames={dd} premountFor={30}>
            {half ? <HalfLeft>{shot}</HalfLeft> : shot}
          </Sequence>
        );
      })}

      {/* CAPA 2 — FOTOS TOPEADAS (~3.6s) */}
      {rawTop.map((b: any) => {
        const d = Math.max(1, sec(Math.min(b.dur, HERO_CAP)));
        const half = spanHalfR(b.start, Math.min(b.dur, HERO_CAP));
        const shot = <RawShot durationInFrames={d} src={b.src} hue="cold" kicker={b.kicker} />;
        return (
          <Sequence key={b.id} from={sec(b.start)} durationInFrames={d} premountFor={20}>
            {half ? <HalfLeft>{shot}</HalfLeft> : shot}
          </Sequence>
        );
      })}

      {/* CAPA 3 — AVATAR (full / hidden / split halfR, cero recuadro) */}
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

      {/* CAPA 5 — PIZARRA del MECANISMO (colágeno): el romero → colágeno → piel más firme,
          dibujada a mano. Cubre full (opaca); el audio lo da el AvatarLayer global. */}
      <Sequence from={sec(WB_START)} durationInFrames={sec(WB_DUR)} layout="none">
        <FedWhiteboard scene={WB_SCENE} theme="white" />
      </Sequence>

      {/* HOOK — texto sobre el avatar oscurecido (arranca al segundo 2.2) */}
      <Sequence from={sec(hookStart)} durationInFrames={sec(hookDur)} layout="none">
        <AvatarScrimText durationInFrames={sec(hookDur)} setup="Una hojita que borra manchas mientras duermes…" impact="EL TRUCO NOCTURNO DEL ROMERO" accentColor="#12B3AE" font={F_INTER} fontSize={120} />
      </Sequence>

      {/* ENDCARD */}
      <Sequence from={sec(CTA_AT)} durationInFrames={sec(Math.max(2, VIDEO_END - CTA_AT))} layout="none">
        <Endcard durationInFrames={sec(Math.max(2, VIDEO_END - CTA_AT))} />
      </Sequence>
    </AbsoluteFill>
  );
};
