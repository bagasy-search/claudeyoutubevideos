import { AbsoluteFill, Sequence } from "remotion";
import { sec } from "./theme";
import { AvatarLayer, AvatarWindow } from "./scenes/AvatarLayer";
import { RawShot } from "./scenes/RawShot";
import { PriceWar } from "./scenes/PriceWar";
import { ReprintScan } from "./scenes/ReprintScan";
import { HourDial } from "./scenes/HourDial";
import { Endcard } from "./scenes/Endcard";
import { AvatarPizarra } from "./scenes/AvatarPizarra";
import { AvatarKeyword } from "./scenes/AvatarKeyword";
import { LowerThird } from "./scenes/LowerThird";
import { MitoVerdad } from "./scenes/MitoVerdad";
import { FraseCinetica } from "./scenes/FraseCinetica";
import { ErrorStinger } from "./scenes/ErrorStinger";
import { GuardaEsto } from "./scenes/GuardaEsto";
import { FreezeZoom } from "./scenes/FreezeZoom";
import { HANDS_BEATS } from "./handsage_beats";
import { HS_BROLL } from "./handsage_broll";
import { TALKSR } from "./handsage_hooks";
import { renderFederer2Comp, COMP2_KINDS } from "./FedererComponents2";

// ── CANAL "Dr. Federer | Holistic Health" · THE OVERNIGHT SPOT PROTOCOL (licorice / age spots) ──
// Avatar en 3 modos, CERO recuadro: FULL · HIDDEN (imagen/componente a pantalla completa) ·
// SPLIT halfR (avatar mitad derecha + imagen mitad izquierda). Fotos del presentador = hidden.
const TEAL = "#12B3AE";
const BG = "#0E1D23";

const NEWFULL = new Set(["avatarpizarra", "avatarkeyword", "mitoverdad", "errorstinger", "guardaesto", "freezezoom", "pricewar", "reprintscan", "hourdial"]);
const OVERLAY = new Set(["lowerthird", "frasecinetica"]);
const NOCAP = new Set(["avatarpizarra", "avatarkeyword"]);
const isComp = (k: string) => COMP2_KINDS.has(k) || NEWFULL.has(k) || OVERLAY.has(k);

const HERO_CAP = 3.6;
const capOf = (k: string): number =>
  k === "diagram" ? 10 : k === "board" ? 13 : k === "quote" ? 8 : k === "rule" ? 5
  : k === "errorstinger" ? 2 : k === "guardaesto" ? 8 : k === "mitoverdad" ? 6 : k === "freezezoom" ? 4.5
  : k === "reprintscan" ? 5.5 : k === "hourdial" ? 5
  : k === "lowerthird" ? 6 : k === "frasecinetica" ? 5 : k === "pricewar" ? 9 : k === "process" || k === "checklist" ? 9 : 6;

const compBeats = HANDS_BEATS.filter((b: any) => isComp(b.kind));
const rawTop = HANDS_BEATS.filter((b: any) => b.kind === "raw" && /^(img|vid)\//.test(b.src || ""));
const VIDEO_END = Math.max(...HANDS_BEATS.map((b: any) => b.start + b.dur), HS_BROLL.length ? HS_BROLL[HS_BROLL.length - 1].start + HS_BROLL[HS_BROLL.length - 1].dur : 0) + 1.2;
export const TOTAL_FRAMES_HANDS = Math.round(VIDEO_END * 30);

const compDur = (b: any): number => {
  if (NOCAP.has(b.kind)) return Math.max(2, b.dur);
  const next = compBeats.filter((x: any) => x.start > b.start && !OVERLAY.has(x.kind)).sort((a: any, c: any) => a.start - c.start)[0];
  const room = next ? next.start - b.start - 0.1 : b.dur;
  if (b.kind === "freezezoom") {
    // CONVERSIÓN: la lámina y el reveal (portada+QR) NO ceden al avatar — tilean continuo hasta el próximo
    // componente (tope 60s), así la lámina se sostiene mientras se explica y el QR queda leíble/escaneable.
    if (/lamina_board|reveal/.test(b.image || "")) return Math.max(2, Math.min(room, 60));
    const contig = next && next.kind === "freezezoom" && (next.start - b.start) < 15;
    return contig ? Math.max(2, Math.min((b.dur || 4.5) + 6, room, 13)) : Math.max(2, Math.min(4.5, room));
  }
  return Math.max(2, Math.min(b.dur, capOf(b.kind), room));
};

// FULL breve del avatar: arranque de cada sección que abre con talk
const FULL_AT: number[] = [];
HANDS_BEATS.filter((b: any) => /^(honesty|lookhand|handsfirst|whatspot|everybody|patient|reveal|notstop|whynight|whynobody|mistakes|how|reserved|safety)$/.test(b.key) && (b.id.endsWith("_0")))
  .forEach((b: any) => FULL_AT.push(b.start));

function buildWindows(): AvatarWindow[] {
  type Pt = { start: number; mode: AvatarWindow["mode"]; pr: number };
  const pts: Pt[] = [];
  let flip = false;
  const content = [...HS_BROLL.map((b: any) => ({ start: b.start, src: b.src })), ...rawTop.map((b: any) => ({ start: b.start, src: b.src }))].sort((a, b) => a.start - b.start);
  for (const b of content) {
    const forceHidden = /hs_federer|hs_hook|hs_diag|federer_kitchen|recipe_book|pagina|guia|lamina|reveal/.test(b.src || "");
    const mode: AvatarWindow["mode"] = forceHidden ? "hidden" : (flip ? "halfR" : "hidden");
    if (!forceHidden) flip = !flip;
    pts.push({ start: b.start, mode, pr: 0 });
  }
  for (let i = 0; i < content.length; i++) {
    const nextStart = i + 1 < content.length ? content[i + 1].start : VIDEO_END;
    const gap = nextStart - content[i].start;
    const thr = content[i].start > 130 ? 4 : 7.5;
    if (gap > thr) pts.push({ start: +(content[i].start + Math.min(6.8, gap - 1.5)).toFixed(2), mode: "full", pr: 2 });
  }
  for (const b of compBeats) {
    if (OVERLAY.has(b.kind)) continue;
    const d = compDur(b);
    pts.push({ start: b.start, mode: "hidden", pr: 3 });
    pts.push({ start: +(b.start + d).toFixed(2), mode: b.start > 130 ? "full" : "hidden", pr: 1 });
  }
  for (const s of FULL_AT) { pts.push({ start: s, mode: "full", pr: 4 }); pts.push({ start: +(s + 2.6).toFixed(2), mode: "hidden", pr: 2 }); }
  pts.sort((a, b) => a.start - b.start || b.pr - a.pr);

  const w: AvatarWindow[] = [{ start: 0, mode: "hidden" }];
  let last = "hidden";
  const talkAt = (s: number) => TALKSR.some((t) => s >= t.start - 0.05 && s < t.start + t.dur);
  for (const p of pts) {
    const mode: AvatarWindow["mode"] = p.pr < 3 && talkAt(p.start) ? "full" : p.mode;
    if (mode !== last) { w.push({ start: p.start, mode }); last = mode; }
  }
  for (const t of TALKSR) { w.push({ start: t.start, mode: "full" }); w.push({ start: +(t.start + t.dur).toFixed(2), mode: "hidden" }); }
  for (const b of compBeats) {
    if (!OVERLAY.has(b.kind) || b.start <= 130) continue;
    w.push({ start: b.start, mode: "full" });
    w.push({ start: +(b.start + Math.max(2, b.dur)).toFixed(2), mode: "hidden" });
  }
  w.sort((a, b) => a.start - b.start);
  const coll: AvatarWindow[] = [];
  for (const x of w) { if (!coll.length || coll[coll.length - 1].mode !== x.mode) coll.push(x); }
  const out: AvatarWindow[] = [];
  for (const x of coll) { if (!out.length || out[out.length - 1].mode !== x.mode) out.push(x); }
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
const inHalfR = (t: number) => HALFR.some(([s, e]) => t >= s - 0.05 && t < e - 0.1);
const HalfLeft: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: 960, height: 1080, overflow: "hidden", background: "#0E1D23" }}>{children}</div>
);

const ctaBeat = [...compBeats].reverse().find((b: any) => b.kind === "nametag");
const CTA_AT = ctaBeat ? ctaBeat.start : VIDEO_END - 12;

const renderComp = (b: any, d: number) =>
  b.kind === "avatarpizarra" ? <AvatarPizarra durationInFrames={d} items={b.items} avatar={b.clip || "handsage_opt.mp4"} avatarFrom={b.clip ? 0 : Math.round(b.start * 30)} />
  : b.kind === "avatarkeyword" ? <AvatarKeyword durationInFrames={d} items={b.items} avatar={b.clip || "handsage_opt.mp4"} avatarFrom={b.clip ? 0 : Math.round(b.start * 30)} />
  : b.kind === "lowerthird" ? <LowerThird durationInFrames={d} title={b.title} desc={b.desc} kicker={b.kicker} tag={b.tag} tone={b.tone} />
  : b.kind === "mitoverdad" ? <MitoVerdad durationInFrames={d} myth={b.myth} truth={b.truth} flipAt={b.flipAt} mythLabel="MYTH" truthLabel="THE TRUTH" />
  : b.kind === "frasecinetica" ? <FraseCinetica durationInFrames={d} words={b.words} ats={b.ats} perWord={b.perWord} tone={b.tone} />
  : b.kind === "errorstinger" ? <ErrorStinger durationInFrames={d} number={b.number} title={b.title} tone={b.tone} eyebrow={b.eyebrow} />
  : b.kind === "guardaesto" ? <GuardaEsto durationInFrames={d} title={b.title} items={b.items} tag={b.tag} prompt="SAVE THIS" />
  : b.kind === "freezezoom" ? <FreezeZoom durationInFrames={d} image={b.image} x={b.x} y={b.y} label={b.label} zoom={b.zoom} tone={b.tone} />
  : b.kind === "reprintscan" ? <ReprintScan durationInFrames={d} image={b.image} spot={b.spot} passes={b.passes} label={b.label} tone={b.tone} />
  : b.kind === "hourdial" ? <HourDial durationInFrames={d} hour={b.hour} big={b.big} unit={b.unit} label={b.label} tone={b.tone} />
  : b.kind === "pricewar" ? <PriceWar durationInFrames={d} leftImage={b.leftImage} rightImage={b.rightImage} leftPrice={b.leftPrice} rightPrice={b.rightPrice} leftLabel={b.leftLabel} rightLabel={b.rightLabel} strike={b.strike} subtitle={b.subtitle} />
  : renderFederer2Comp(b, d, { medico: true });

export const MainHandsAge: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* CAPA 1 — B-ROLL DENSO continuo (Pexels) */}
      {HS_BROLL.map((b) => {
        const dd = Math.max(1, Math.min(sec(b.dur) + 3, sec(7.5)));
        const half = inHalfR(b.start);
        const shot = <RawShot durationInFrames={dd} src={b.src} hue="cold" />;
        return (
          <Sequence key={b.name} from={sec(b.start)} durationInFrames={dd} premountFor={30}>
            {half ? <HalfLeft>{shot}</HalfLeft> : shot}
          </Sequence>
        );
      })}

      {/* CAPA 2 — FOTOS del presentador hs_federer_*.png TOPEADAS (~3.6s) */}
      {rawTop.map((b: any) => {
        const d = Math.max(1, sec(Math.min(b.dur, HERO_CAP)));
        const half = inHalfR(b.start);
        const shot = <RawShot durationInFrames={d} src={b.src} hue="cold" kicker={b.kicker} />;
        return (
          <Sequence key={b.id} from={sec(b.start)} durationInFrames={d} premountFor={20}>
            {half ? <HalfLeft>{shot}</HalfLeft> : shot}
          </Sequence>
        );
      })}

      {/* CAPA 3 — AVATAR (full / hidden / split halfR, cero recuadro) */}
      <AvatarLayer src="handsage_opt.mp4" windows={AVATAR_WINDOWS} accent={TEAL} avatarFocus={{ x: 0.5, y: 0.32, splitZoom: 1.02 }} />

      {/* CAPA 4 — COMPONENTES / diagramas, TOPEADOS */}
      {compBeats.map((b: any) => {
        const d = Math.max(1, sec(compDur(b)));
        return (
          <Sequence key={`comp_${b.id}`} from={sec(b.start)} durationInFrames={d} layout="none">
            {renderComp(b, d)}
          </Sequence>
        );
      })}

      {/* ENDCARD */}
      <Sequence from={sec(CTA_AT)} durationInFrames={sec(Math.max(2, VIDEO_END - CTA_AT))} layout="none">
        <Endcard durationInFrames={sec(Math.max(2, VIDEO_END - CTA_AT))} kicker="Dr. Federer" title="Subscribe" subtitle="Every week — real, natural skin science for your face and mature skin" cta="SUBSCRIBE" />
      </Sequence>
    </AbsoluteFill>
  );
};
