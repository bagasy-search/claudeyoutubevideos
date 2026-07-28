import { AbsoluteFill, Sequence } from "remotion";
import { sec } from "./theme";
import { AvatarLayer, AvatarWindow } from "./scenes/AvatarLayer";
import { RawShot } from "./scenes/RawShot";
import { AvatarPizarra } from "./scenes/AvatarPizarra";
import { AvatarKeyword } from "./scenes/AvatarKeyword";
import { LowerThird } from "./scenes/LowerThird";
import { MitoVerdad } from "./scenes/MitoVerdad";
import { FraseCinetica } from "./scenes/FraseCinetica";
import { ErrorStinger } from "./scenes/ErrorStinger";
import { GuardaEsto } from "./scenes/GuardaEsto";
import { FreezeZoom } from "./scenes/FreezeZoom";
import { FocusCardsV2pd } from "./FocusCards_v2pd88ko0ud8";
import { FED_BEATS } from "./v2pd88ko0ud8_beats";
import { FED_BROLL } from "./v2pd88ko0ud8_broll";
import { TALKS } from "./v2pd88ko0ud8_hooks";
import { renderFederer2Comp, COMP2_KINDS } from "./FedererComponents2";

// ── CANAL "Federer Archivos" · v2pd88ko0ud8 · ROMERO DE NOCHE / MELASMA ───────
// Avatar SOLO full / hidden (cero recuadro, cero split — regla del canal).
// 4 capas: (1) b-roll continuo · (2) fotos IA topeadas · (3) AvatarLayer · (4) comps.
const TEAL = "#12B3AE";
const BG = "#0E1D23";
const AVATAR_SRC = "avatar_v2pd88ko0ud8.mp4";

const NEWFULL = new Set(["avatarpizarra", "avatarkeyword", "mitoverdad", "errorstinger", "guardaesto", "freezezoom", "focuscards"]);
// OVERLAY = componentes SIN fondo propio: si la capa del avatar se esconde debajo,
// el texto queda flotando sobre el BG teal pelado y en el MP4 se lee como NEGRO.
// (Lo cazó la cuadrícula: el stat "pico de renovación" y una frase cinética salieron
// sobre negro.) Al marcarlos overlay, buildWindows los deja como hueco → avatar FULL
// detrás y el texto se apoya sobre la cara, que es como tiene que verse.
const OVERLAY = new Set(["lowerthird", "frasecinetica", "stat", "quote", "callout", "chips", "rule", "headline", "splitlist"]);
// estos traen su PROPIO avatar montado → no hay que esconder la capa por debajo
const OWNAVATAR = new Set(["avatarpizarra", "avatarkeyword"]);
const isComp = (k: string) => COMP2_KINDS.has(k) || NEWFULL.has(k) || OVERLAY.has(k);

const HERO_CAP = 5.2;
const capOf = (k: string): number =>
  k === "diagram" ? 10 : k === "board" ? 13 : k === "quote" ? 8 : k === "rule" ? 5
  : k === "errorstinger" ? 3.2 : k === "guardaesto" ? 9 : k === "mitoverdad" ? 6.5 : k === "freezezoom" ? 4.5
  : k === "focuscards" ? 60 : k === "lowerthird" ? 6 : k === "frasecinetica" ? 5.5 : k === "process" || k === "checklist" ? 9.5 : 6.5;

const compBeats = FED_BEATS.filter((b: any) => isComp(b.kind));
const rawTop = FED_BEATS.filter((b: any) => b.kind === "raw" && /^(img|broll|vid)\//.test(b.src || ""));
const VIDEO_END = Math.max(
  ...FED_BEATS.map((b: any) => b.start + b.dur),
  FED_BROLL.length ? FED_BROLL[FED_BROLL.length - 1].start + FED_BROLL[FED_BROLL.length - 1].dur : 0,
  1492.7
) + 0.6;
export const TOTAL_FRAMES_V2PD = Math.round(VIDEO_END * 30);

// El componente ocupa SU tramo, pero si al siguiente le falta <1.2s se ESTIRA en vez
// de abrir un agujero (micro-hueco = fondo pelado = negro en el MP4).
const compDur = (b: any): number => {
  const next = compBeats
    .filter((x: any) => x.start > b.start + 0.05 && !OVERLAY.has(x.kind))
    .sort((a: any, c: any) => a.start - c.start)[0];
  const room = next ? next.start - b.start : b.dur;
  const want = Math.min(b.dur, capOf(b.kind));
  if (room - want < 1.2 && room > 0) return Math.max(2, Math.min(room, b.dur + 1.4));
  return Math.max(2, Math.min(want, room > 0 ? room : want));
};

// ── VENTANAS DEL AVATAR ───────────────────────────────────────────────────────
// hidden por defecto · TALKS = tramos donde la cara ES el contenido (full) ·
// GAP-FILL: donde no hay NADA en pantalla, avatar full (nunca fondo pelado).
function buildWindows(): AvatarWindow[] {
  const cover: [number, number][] = [];
  for (const b of FED_BROLL) cover.push([b.start, b.start + b.dur]);
  for (const b of rawTop) cover.push([b.start, b.start + Math.min(b.dur, HERO_CAP)]);
  for (const b of compBeats) if (!OVERLAY.has(b.kind)) cover.push([b.start, b.start + compDur(b)]);
  cover.sort((a, b) => a[0] - b[0]);

  // huecos > 0.2s sin contenido → avatar full
  const gaps: [number, number][] = [];
  let cur = 0;
  for (const [s, e] of cover) {
    if (s - cur > 0.2) gaps.push([cur, s]);
    cur = Math.max(cur, e);
  }
  if (VIDEO_END - cur > 0.2) gaps.push([cur, VIDEO_END]);

  const fulls: [number, number][] = [
    [0, 2.6], // regla dura: abre con la cara, mínimo 2s
    ...TALKS.map((t: any) => [t.start, t.start + t.dur] as [number, number]),
    ...gaps,
  ].sort((a, b) => a[0] - b[0]);

  // fusionar solapes
  const merged: [number, number][] = [];
  for (const f of fulls) {
    const last = merged[merged.length - 1];
    if (last && f[0] <= last[1] + 0.15) last[1] = Math.max(last[1], f[1]);
    else merged.push([f[0], f[1]]);
  }

  const w: AvatarWindow[] = [{ start: 0, mode: "full" }];
  for (const [s, e] of merged) {
    if (s > 0) w.push({ start: +s.toFixed(2), mode: "full" });
    w.push({ start: +e.toFixed(2), mode: "hidden" });
  }
  w.sort((a, b) => a.start - b.start);
  const out: AvatarWindow[] = [];
  for (const x of w) { if (!out.length || out[out.length - 1].mode !== x.mode) out.push(x); }
  return out;
}
const AVATAR_WINDOWS = buildWindows();

// los comps con avatar propio arrancan el mp4 en SU frame → labios sincronizados
const renderComp = (b: any, d: number) =>
  b.kind === "focuscards" ? <FocusCardsV2pd durationInFrames={d} items={b.items} title={b.title} />
  : b.kind === "avatarpizarra" ? <AvatarPizarra durationInFrames={d} items={b.items} avatar={AVATAR_SRC} avatarFrom={Math.round(b.start * 30)} />
  : b.kind === "avatarkeyword" ? <AvatarKeyword durationInFrames={d} items={b.items} avatar={AVATAR_SRC} avatarFrom={Math.round(b.start * 30)} />
  : b.kind === "lowerthird" ? <LowerThird durationInFrames={d} title={b.title} desc={b.desc} kicker={b.kicker} tag={b.tag} tone={b.tone} avatarSrc={null} />
  : b.kind === "mitoverdad" ? <MitoVerdad durationInFrames={d} myth={b.myth} truth={b.truth} flipAt={b.flipAt} />
  : b.kind === "frasecinetica" ? <FraseCinetica durationInFrames={d} words={b.words} ats={b.ats} perWord={b.perWord} tone={b.tone} />
  : b.kind === "errorstinger" ? <ErrorStinger durationInFrames={d} number={b.number} title={b.title} tone={b.tone} />
  : b.kind === "guardaesto" ? <GuardaEsto durationInFrames={d} title={b.title} items={b.items} tag={b.tag} />
  : b.kind === "freezezoom" ? <FreezeZoom durationInFrames={d} image={b.image} x={b.x} y={b.y} label={b.label} zoom={b.zoom} tone={b.tone} />
  : renderFederer2Comp(b, d, { medico: true });

export const MainV2pd88ko0ud8: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* CAPA 1 — B-ROLL continuo (+3f de solape para que no se vea el corte) */}
      {FED_BROLL.map((b: any) => {
        const dd = Math.max(1, sec(b.dur) + 3);
        return (
          <Sequence key={b.name} from={sec(b.start)} durationInFrames={dd} premountFor={30}>
            <RawShot durationInFrames={dd} src={b.src} hue="cold" clipDur={b.clipDur} />
          </Sequence>
        );
      })}

      {/* CAPA 2 — FOTOS IA topeadas */}
      {rawTop.map((b: any) => {
        const d = Math.max(1, sec(Math.min(b.dur, HERO_CAP)) + 3);
        return (
          <Sequence key={b.id} from={sec(b.start)} durationInFrames={d} premountFor={20}>
            <RawShot durationInFrames={d} src={b.src} hue="cold" kicker={b.kicker} focus={b.focus} />
          </Sequence>
        );
      })}

      {/* CAPA 3 — AVATAR (full / hidden, cero recuadro) */}
      <AvatarLayer src={AVATAR_SRC} windows={AVATAR_WINDOWS} accent={TEAL} />

      {/* CAPA 4 — COMPONENTES del kit */}
      {compBeats.map((b: any) => {
        const d = Math.max(1, sec(compDur(b)));
        const cut = !!b.cut; // corte SECO: el shell entra ya asentado
        return (
          <Sequence key={`comp_${b.id}`} from={sec(b.start)} durationInFrames={d} layout="none">
            {cut ? (
              <Sequence from={-12} durationInFrames={d + 24} layout="none">{renderComp(b, d + 24)}</Sequence>
            ) : (
              renderComp(b, d)
            )}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
