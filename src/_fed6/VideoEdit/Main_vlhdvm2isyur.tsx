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
import { FocusCardsVlh } from "./FocusCards_vlhdvm2isyur";
import { LoopLockVlh } from "./LoopLock_vlhdvm2isyur";
import { F_INTER } from "./kit/premium/theme";
import { FEDZ_BEATS } from "./federer_vlhdvm2isyur_beats";
import { FEDZ_BROLL } from "./federer_vlhdvm2isyur_broll";
import { TALKSZ } from "./federer_vlhdvm2isyur_hooks";
import { renderFederer2Comp, COMP2_KINDS } from "./FedererComponents2";




/* COMPONENT_MANIFEST — usos REALES que monta renderComp() desde FEDZ_BEATS (build data-driven).
  7.56s <LowerThird />
  16.32s <FraseCinetica />
  26.92s <HookCaption />
  31.92s <MitoVerdad />
  40.46s <CutawayCallouts />
  50.3s <BigStatReveal />
  60.18s <BigStatReveal />
  75s <LowerThird />
  84.22s <FraseCinetica />
  90.28s <RawShot />
  97.46s <NumberedSteps />
  103.66s <AvatarKeyword />
  111.3s <HookCaption />
  114.02s <MitoVerdad />
  128.36s <SplitPanel />
  140.66s <LowerThird />
  145.7s <BigStatReveal />
  153.48s <BoardCard />
  160.78s <ChecklistReveal />
  166.68s <HookCaption />
  174.76s <DiagramBoard />
  180.26s <AvatarKeyword />
  190.72s <BarCompare />
  197.76s <FraseCinetica />
  202.34s <SplitPanel />
  208.4s <LowerThird />
  222.7s <CutawayCallouts />
  233.78s <HookCaption />
  240.4s <ErrorStinger />
  249s <AvatarKeyword />
  252.6s <BigStatReveal />
  256.34s <LoopLockVlh />
  262.04s <FraseCinetica />
  269.26s <LowerThird />
  273.52s <BoardCard />
  287.18s <HookCaption />
  292.76s <HookCaption />
  295.1s <NumberedSteps />
  311.52s <AvatarKeyword />
  326.1s <PullQuote />
  334.86s <SplitPanel />
  348.06s <FraseCinetica />
  358.14s <CutawayCallouts />
  366.64s <SplitPanel />
  378.72s <MitoVerdad />
  387.52s <BigStatReveal />
  392.94s <CutawayCallouts />
  400.7s <BoardCard />
  410.1s <FraseCinetica />
  427.42s <LowerThird />
  433.62s <HookCaption />
  438.76s <RawShot />
  448.12s <AvatarKeyword />
  450.58s <FraseCinetica />
  453.48s <CutawayCallouts />
  460.26s <NumberedSteps />
  469.14s <LowerThird />
  488.28s <DiagramBoard />
  492.88s <HookCaption />
  501.56s <BigStatReveal />
  517.1s <AvatarKeyword />
  522.46s <FraseCinetica />
  526.24s <AvatarKeyword />
  532.02s <NumberedSteps />
  540.82s <DiagramBoard />
  544.88s <CutawayCallouts />
  552.48s <SplitPanel />
  561.12s <FraseCinetica />
  571.5s <BoardCard />
  581.88s <LowerThird />
  588.2s <FraseCinetica />
  593.84s <ErrorStinger />
  599.84s <CutawayCallouts />
  607.92s <AvatarKeyword />
  618.14s <MitoVerdad />
  628.12s <PullQuote />
  633.74s <LowerThird />
  637.16s <HookCaption />
  641.58s <RawShot />
  644.08s <LowerThird />
  647.84s <BigStatReveal />
  656.84s <CutawayCallouts />
  667.52s <FraseCinetica />
  670.34s <DiagramBoard />
  673.54s <BigStatReveal />
  682.26s <RawShot />
  685.5s <LowerThird />
  696.06s <BigStatReveal />
  702.08s <CutawayCallouts />
  712.86s <NumberedSteps />
  716.9s <HookCaption />
  725.5s <LowerThird />
  728.98s <BoardCard />
  735.28s <AvatarKeyword />
  738.3s <FraseCinetica />
  740.92s <HookCaption />
  747.76s <SplitPanel />
  750.74s <LowerThird />
  754.8s <GuardaEsto />
  757.2s <RawShot />
  761.52s <MitoVerdad />
  767.24s <DiagramBoard />
  771s <FraseCinetica />
  773.46s <HookCaption />
  778.68s <BigStatReveal />
  793.9s <BoardCard />
  799.22s <FraseCinetica />
  805.48s <CutawayCallouts />
  812.16s <AvatarKeyword />
  818.54s <BigStatReveal />
  827.32s <AvatarKeyword />
  838.26s <BigStatReveal />
  841.78s <HookCaption />
  846.78s <AvatarKeyword />
  852.38s <DiagramBoard />
  858.76s <MitoVerdad />
  866.06s <FraseCinetica />
  868.22s <HookCaption />
  873.8s <BoardCard />
  876.72s <DiagramBoard />
  882.52s <BoardCard />
  890.16s <AvatarKeyword />
  894.28s <CutawayCallouts />
  903.4s <HookCaption />
  907.62s <FraseCinetica />
  910.6s <BigStatReveal />
  917.1s <BigStatReveal />
  924.72s <AvatarKeyword />
  928.5s <LowerThird />
  932.7s <ErrorStinger />
  946.1s <ChecklistReveal />
  951.74s <CutawayCallouts />
  960.26s <AvatarKeyword />
  962.52s <ErrorStinger />
  970.6s <HookCaption />
  977.48s <MitoVerdad />
  982.82s <FraseCinetica />
  988.52s <SplitPanel />
  997.82s <AvatarKeyword />
  1003.9s <BoardCard />
  1015.52s <FraseCinetica />
  1022.52s <AvatarKeyword />
  1028.58s <RawShot />
  1033.98s <ChecklistReveal />
  1042.92s <FraseCinetica />
  1046.62s <DiagramBoard />
  1053.86s <RawShot />
  1059.82s <BigStatReveal />
  1063.8s <MitoVerdad />
  1077.34s <FraseCinetica />
  1091s <BoardCard />
  1100.7s <FraseCinetica />
  1105.84s <SplitPanel />
  1116.52s <ChecklistReveal />
  1123.2s <LowerThird />
  1133.2s <NumberedSteps />
  1144.32s <AvatarKeyword />
  1150.12s <MitoVerdad />
  1158.78s <LowerThird />
  1167.28s <LowerThird />
  1179.32s <PullQuote />
  1186.5s <FraseCinetica />
  1193.72s <FocusCardsVlh />
  1193.72s <FocusCardsVlh />
  1203.36s <FraseCinetica />
  1211.1s <LowerThird />
  1222.86s <LowerThird />
  1232.5s <FraseCinetica />
  1247.14s <FraseCinetica />
  1252.1s <ChecklistReveal />
  1259.1s <LowerThird />
  1264.36s <RawShot />
  1269s <HookCaption />
  1276.98s <SplitPanel />
  1292.7s <LowerThird />
  1300.5s <BoardCard />
  1314.7s <MitoVerdad />
  1324.74s <FraseCinetica />
  1335.02s <DocNameCard />
*/

// ── CANAL "Federer Archivos" · ACEITE DE ROMERO PARA LAS ENTRADAS ──────────────
// Avatar: FULL · HIDDEN (visual full). ⛔ CERO halfR / recuadro (feedback creador). Look CLÍNICO teal.
const TEAL = "#12B3AE";
const BG = "#0E1D23";
const AVA = "vlhdvm2isyur_opt.mp4";

const NEWFULL = new Set(["avatarpizarra", "avatarkeyword", "mitoverdad", "errorstinger", "guardaesto", "freezezoom", "focuscards", "looplock"]);
const OVERLAY = new Set(["lowerthird", "frasecinetica"]);
const NOCAP = new Set(["avatarpizarra", "avatarkeyword", "focuscards"]);
const isComp = (k: string) => COMP2_KINDS.has(k) || NEWFULL.has(k) || OVERLAY.has(k);

const HERO_CAP = 3.6;
const capOf = (k: string): number =>
  k === "diagram" ? 10 : k === "board" ? 13 : k === "quote" ? 8 : k === "rule" ? 5
  : k === "errorstinger" ? 2 : k === "guardaesto" ? 8 : k === "mitoverdad" ? 6 : k === "freezezoom" ? 4.5
  : k === "lowerthird" ? 6 : k === "frasecinetica" ? 5 : k === "process" || k === "checklist" ? 9 : 6;

const compBeats = FEDZ_BEATS.filter((b: any) => isComp(b.kind));
const rawTop = FEDZ_BEATS.filter((b: any) => b.kind === "raw" && /^(img|vid)\//.test(b.src || ""));
const VIDEO_END = Math.max(...FEDZ_BEATS.map((b: any) => b.start + b.dur), FEDZ_BROLL.length ? FEDZ_BROLL[FEDZ_BROLL.length - 1].start + FEDZ_BROLL[FEDZ_BROLL.length - 1].dur : 0) + 1.2;
export const TOTAL_FRAMES_VLH = Math.round(VIDEO_END * 30);

const compDur = (b: any): number => {
  if (NOCAP.has(b.kind)) return Math.max(2, b.dur);
  const next = compBeats.filter((x: any) => x.start > b.start && !OVERLAY.has(x.kind)).sort((a: any, c: any) => a.start - c.start)[0];
  const room = next ? next.start - b.start - 0.1 : b.dur;
  return Math.max(2, Math.min(b.dur, capOf(b.kind), room));
};

// FULL breve del avatar: arranque de cada sección grande
const FULL_AT: number[] = [];
FEDZ_BEATS.filter((b: any) => /^(hook|sujeto|story|enemigo|principio|porque|seguridad|rutina|masaje|senal|error|honesto|recap|cierre)$/.test(b.key) && (b.id.endsWith("_0")))
  .forEach((b: any) => FULL_AT.push(b.start));

function buildWindows(): AvatarWindow[] {
  type Pt = { start: number; mode: AvatarWindow["mode"]; pr: number };
  const pts: Pt[] = [];
  const content = [...FEDZ_BROLL.map((b: any) => ({ start: b.start, src: b.src })), ...rawTop.map((b: any) => ({ start: b.start, src: b.src }))].sort((a, b) => a.start - b.start);
  for (const b of content) {
    // ⛔ CERO halfR en este canal (feedback creador): Federer queda MAL encuadrado en split.
    // Todas las ventanas de contenido = HIDDEN (visual a pantalla completa). Solo full/hidden.
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

  // HOOK: avatar FULL 2.2s (frames 0-66) y después HIDDEN durante el scrim
  const HOOK_FULL = 2.2;
  const HOOK_END = 7.6;
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
  // OVERLAY (lowerthird/frasecinetica) son TRANSPARENTES: no cuentan como cobertura.
  for (const b of compBeats as any[]) if (!OVERLAY.has(b.kind)) cov.push([b.start, b.start + compDur(b) + 0.2]);
  cov.sort((a, c) => a[0] - c[0]);
  const merged: [number, number][] = [];
  for (const [s, e] of cov) { const l = merged[merged.length - 1]; if (l && s <= l[1] + 0.2) l[1] = Math.max(l[1], e); else merged.push([s, e]); }
  const gaps: [number, number][] = [];
  let prev = 0;
  for (const [s, e] of merged) { if (s - prev > 0.6) gaps.push([prev, s]); prev = Math.max(prev, e); }
  if (VIDEO_END - prev > 0.6) gaps.push([prev, VIDEO_END]);
  const modeAt = (t: number): AvatarWindow["mode"] => { let m = out[0].mode; for (const w of out) { if (w.start <= t + 1e-6) m = w.mode; else break; } return m; };
  const inGap = (t: number) => t >= 7.6 && gaps.some(([s, e]) => t >= Math.max(s, 7.6) - 1e-6 && t < e - 1e-6);
  const bounds = new Set<number>(out.map((w) => w.start));
  for (const [s, e] of gaps) { if (e <= 7.6) continue; bounds.add(+Math.max(s, 7.6).toFixed(2)); bounds.add(+e.toFixed(2)); }
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
  : b.kind === "focuscards" ? <FocusCardsVlh durationInFrames={d} items={b.items} title={b.title} />
  : b.kind === "looplock" ? <LoopLockVlh durationInFrames={d} title={b.title} sub={b.sub} />
  : renderFederer2Comp(b, d, { medico: true });

export const MainVlh: React.FC = () => {
  const hookStart = 2.2;
  const hookDur = 5.2;
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* CAPA 1 — B-ROLL DENSO continuo */}
      {FEDZ_BROLL.map((b) => {
        const dd = Math.max(1, sec(b.dur) + 3);
        return (
          <Sequence key={b.name} from={sec(b.start)} durationInFrames={dd} premountFor={30}>
            <RawShot durationInFrames={dd} src={b.src} hue="cold" />
          </Sequence>
        );
      })}

      {/* CAPA 2 — FOTOS/DIAGRAMAS TOPEADOS (~3.6s) */}
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

      {/* HOOK — texto sobre el avatar oscurecido (arranca al segundo 2.2) */}
      <Sequence from={sec(hookStart)} durationInFrames={sec(hookDur)} layout="none">
        <AvatarScrimText durationInFrames={sec(hookDur)} setup="Le empató al minoxidil en un ensayo de seis meses…" impact="Y ESTÁ EN TU COCINA" accentColor="#12B3AE" font={F_INTER} fontSize={110} />
      </Sequence>

      {/* ENDCARD */}
      <Sequence from={sec(CTA_AT)} durationInFrames={sec(Math.max(2, VIDEO_END - CTA_AT))} layout="none">
        <Endcard durationInFrames={sec(Math.max(2, VIDEO_END - CTA_AT))} />
      </Sequence>
    </AbsoluteFill>
  );
};
