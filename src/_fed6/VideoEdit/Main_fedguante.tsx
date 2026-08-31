import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { sec } from "./theme";
import { AvatarWindow } from "./scenes/AvatarLayer";
import { AvatarLayerLoopFcs } from "./scenes/AvatarLayerLoopFcs";
import { AvatarScrimText } from "./scenes/AvatarScrimText";
import { RawShot } from "./scenes/RawShot";
import { Endcard } from "./scenes/Endcard";
import { LowerThird } from "./scenes/LowerThird";
import { FraseCinetica } from "./scenes/FraseCinetica";
import { ErrorStinger } from "./scenes/ErrorStinger";
import { PizarraExplica } from "./scenes/PizarraExplica";
import { HourDial } from "./scenes/HourDial";
import { Carrusel3D } from "./scenes/Carrusel3D";
import { ColadorEscala } from "./scenes/ColadorEscala";
import { LineaTiempoPiel } from "./scenes/LineaTiempoPiel";
import { PruebaPliegue } from "./scenes/PruebaPliegue";
import { DatoImpacto } from "./scenes/DatoImpacto";
import { ComparaProfundidad } from "./scenes/ComparaProfundidad";
import { ListaFlotante } from "./scenes/ListaFlotante";
import { MitoRevelado } from "./scenes/MitoRevelado";
import { GuiaCTA3D } from "./scenes/GuiaCTA3D";
import { F_INTER } from "./kit/premium/theme";
import { FEDGUANTE_BEATS, FEDGUANTE_BROLL, FEDGUANTE_COVER, AVATAR_END, VIDEO_END as VEND } from "./fedguante_beats";
import { renderFederer2Comp, COMP2_KINDS } from "./FedererComponents2";

// ── CANAL "Federer Archivos" · TRUCO DEL GUANTE DE ROMERO ────────────────────
// ⛔ AVATAR PARCIAL: el mp4 del creador dura 1129.47s sobre un master de 3342.48s.
//    · va EN BUCLE y MUTEADO (AvatarLayerLoopFcs) + <Audio> del master aparte;
//    · después de AVATAR_END los labios NO sincronizan → el avatar nunca queda a la vista:
//      el generador dejó esa zona cubierta al 100% con clip + su foto de respaldo.
// ⛔ CERO SPLIT (halfR): el creador confirmó (memoria del canal, 22-jul-2026) que en split
//    Federer queda MAL ENCUADRADO. `buildWindows` emite sólo full / hidden.
// ⛔ El avatar viene NATIVO a 30/1 fps y 1920x1080: no se conformó con minterpolate, así que
//    no existe acá el desfase de labios creciente que ese paso mete en cada empalme.
const TEAL = "#12B3AE";
const BG = "#0E1D23";
const CLIP_VOL = 0.35;   // el sonido ambiente del clip, debajo de la voz
const AVATAR_FRAMES = Math.round(1129.472 * 30); // largo REAL del mp4 → el <Loop> lo repite

const NEWFULL = new Set(["mitoverdad", "errorstinger", "guardaesto", "hourdial", "pizarraexplica",
  "guidecta", "carrusel", "colador", "lineatiempo", "pliegue"]);
// OVERLAY = flota SOBRE la toma real y NO oculta al avatar. Si se lo trata como full, cuando
// abajo no hay b-roll salen segundos de NEGRO (medido en `estoalos70`).
const OVERLAY = new Set(["lowerthird", "frasecinetica", "callout"]);
const isComp = (k: string) => COMP2_KINDS.has(k) || NEWFULL.has(k) || OVERLAY.has(k);

const HERO_CAP = 4.5;
const capOf = (k: string): number =>
  k === "errorstinger" ? 2.4 : k === "guardaesto" ? 10 : k === "mitoverdad" ? 8.5
  : k === "lowerthird" ? 6 : k === "frasecinetica" ? 5.5 : k === "callout" ? 6
  : k === "hourdial" ? 6 : k === "pizarraexplica" ? 8.5 : k === "stat" ? 7
  : k === "carrusel" ? 13 : k === "colador" ? 10 : k === "lineatiempo" ? 11
  : k === "pliegue" ? 9 : k === "checklist" ? 10 : k === "bars" ? 8
  : k === "guidecta" ? 11 : k === "process" || k === "splitlist" ? 9 : 6;

const compBeats = FEDGUANTE_BEATS.filter((b: any) => isComp(b.kind));
const rawTop = FEDGUANTE_BEATS.filter((b: any) => b.kind === "raw" && /^img\//.test(b.src || ""));
export const TOTAL_FRAMES_FEDGUANTE = Math.round(VEND * 30);

const compDur = (b: any): number => {
  const next = compBeats.filter((x: any) => x.start > b.start && !OVERLAY.has(x.kind)).sort((a: any, c: any) => a.start - c.start)[0];
  const room = next ? next.start - b.start - 0.1 : b.dur;
  return Math.max(2, Math.min(b.dur, capOf(b.kind), room));
};

// ⛔ ANTI-HUECO: el avatar es el FONDO garantizado en la ZONA AVATAR. Cada contenido cubre
// SÓLO su cobertura real; apenas termina, el avatar vuelve a full. En la ZONA FISH nunca
// vuelve a full visible porque el generador dejó esa zona cubierta.
function buildWindows(): AvatarWindow[] {
  type Pt = { start: number; mode: AvatarWindow["mode"]; pr: number };
  const pts: Pt[] = [{ start: 0, mode: "full", pr: 0 }];
  for (const c of FEDGUANTE_COVER) {
    pts.push({ start: c.start, mode: "hidden", pr: 3 });
    pts.push({ start: +(c.start + c.cov).toFixed(2), mode: "full", pr: 1 });
  }
  for (const b of compBeats) {
    if (OVERLAY.has(b.kind)) continue;   // los overlay van ENCIMA: no ocultan al avatar
    const d = compDur(b);
    pts.push({ start: b.start, mode: "hidden", pr: 4 });
    pts.push({ start: +(b.start + d).toFixed(2), mode: "full", pr: 1 });
  }
  pts.sort((a, b) => a.start - b.start || a.pr - b.pr);
  const coll: AvatarWindow[] = [];
  let last = "";
  for (const p of pts) { if (p.mode !== last) { coll.push({ start: p.start, mode: p.mode }); last = p.mode; } }

  // el HOOK: avatar full 1,4 s (regla del canal: abre él) y después el scrim
  const HOOK_END = 7.0;
  const post = coll.filter((w) => w.start < 1.4 || w.start >= HOOK_END);
  post.push({ start: 0, mode: "full" }, { start: 1.4, mode: "hidden" });
  const resume = coll.filter((w) => w.start < HOOK_END).pop();
  post.push({ start: HOOK_END, mode: resume && resume.start >= 1.4 ? "hidden" : (resume?.mode ?? "full") });
  post.sort((a, b) => a.start - b.start);
  const out: AvatarWindow[] = [];
  for (const x of post) { if (!out.length || out[out.length - 1].mode !== x.mode) out.push(x); }
  return out;
}
const AVATAR_WINDOWS = buildWindows();

const CTA_AT = VEND - 11;

// ⛔ Cada rama pasa las props que el componente REALMENTE lee (se verificó la firma de cada
//    uno): una prop con otro nombre no crashea — renderiza el DEFAULT y se ve llena.
const renderComp = (b: any, d: number) =>
  b.kind === "lowerthird" ? <LowerThird durationInFrames={d} title={b.title} desc={b.desc} kicker={b.kicker} tag={b.tag ?? "DR. FEDERER"} tone={b.tone} />
  : b.kind === "frasecinetica" ? <FraseCinetica durationInFrames={d} words={b.words} ats={b.ats} perWord={b.perWord} tone={b.tone} />
  : b.kind === "errorstinger" ? <ErrorStinger durationInFrames={d} number={b.number} title={b.title} tone={b.tone} eyebrow={b.eyebrow} />
  : b.kind === "guardaesto" ? <ListaFlotante durationInFrames={d} title={b.title} image={b.image} prompt={b.prompt} tone="warn"
      items={(b.items || []).map((x: any) => (typeof x === "string" ? { text: x } : x))} />
  : b.kind === "pizarraexplica" ? <PizarraExplica durationInFrames={d} eyebrow={b.eyebrow} title={b.title} items={b.items} />
  : b.kind === "hourdial" ? <HourDial durationInFrames={d} hour={b.hour} big={b.big} unit={b.unit} label={b.label} tone={b.tone} />
  : b.kind === "stat" ? <DatoImpacto durationInFrames={d} figure={String(b.value)} unit={b.unit} eyebrow={b.eyebrow} caption={b.label} image={b.image} tone={b.tone} />
  : b.kind === "bars" ? <ComparaProfundidad durationInFrames={d} title={b.title} unit={b.unit} image={b.image} bars={b.bars} />
  : b.kind === "checklist" ? <ListaFlotante durationInFrames={d} title={b.title} image={b.image} items={b.items} tone={b.tone} />
  : b.kind === "mitoverdad" ? <MitoRevelado durationInFrames={d} myth={b.myth} truth={b.truth} image={b.image} flipAt={b.flipAt} />
  : b.kind === "guidecta" ? <GuiaCTA3D durationInFrames={d} cover={b.cover} qr={b.qr} domain={b.domain} kicker={b.kicker} title={b.title} desc={b.desc} scanTitle={b.scanTitle} scanSub={b.scanSub} />
  : b.kind === "carrusel" ? <Carrusel3D durationInFrames={d} title={b.title} items={b.items} focus={b.focus} tone={b.tone} />
  : b.kind === "colador" ? <ColadorEscala durationInFrames={d} smallLabel={b.smallLabel} bigLabel={b.bigLabel} note={b.note} tone={b.tone} />
  : b.kind === "lineatiempo" ? <LineaTiempoPiel durationInFrames={d} title={b.title} marks={b.marks} tone={b.tone} />
  : b.kind === "pliegue" ? <PruebaPliegue durationInFrames={d} leftImage={b.leftImage} rightImage={b.rightImage} leftLabel={b.leftLabel} rightLabel={b.rightLabel} leftSeconds={b.leftSeconds} rightSeconds={b.rightSeconds} verdict={b.verdict} />
  : renderFederer2Comp(b, d, { medico: true });

export const MainFedguante: React.FC = () => {
  const hookDur = 5.4;
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* AUDIO MASTER — avatar real (0..18:49) + cola de Fish. El avatar va MUTEADO. */}
      <Audio src={staticFile("fedguante.m4a")} />

      {/* CAPA 1 — CLIPS (agnes, animación leve de su propia foto) */}
      {FEDGUANTE_BROLL.map((b) => {
        const dd = Math.max(1, sec(((b as any).cov ?? Math.min(b.dur, 10)) + 0.6));
        return (
          <Sequence key={b.name} from={sec(b.start)} durationInFrames={dd} premountFor={30}>
            <RawShot durationInFrames={dd} src={b.src} hue="cold" />
          </Sequence>
        );
      })}

      {/* CAPA 1.bis — el SONIDO NATIVO de los clips, bajito debajo de la locución.
          ⛔ Va como pista aparte porque `OffthreadVideo` (que es lo que usa el kit para
          que el render no tiemble) NO reproduce audio: si no se agrega acá, el sonido
          del clip se pierde entero. Volumen bajo para que no pelee con la voz. */}
      {FEDGUANTE_BROLL.map((b) => {
        const dd = Math.max(1, sec(((b as any).cov ?? Math.min(b.dur, 10))));
        return (
          <Sequence key={`snd_${b.name}`} from={sec(b.start)} durationInFrames={dd}>
            <Audio src={staticFile(b.src)} volume={CLIP_VOL} />
          </Sequence>
        );
      })}

      {/* CAPA 2 — FOTOS (agnes + hero gpt-image con la cara real del Dr. Federer) */}
      {rawTop.map((b: any) => {
        // ⛔ el cov lo decide el GEN (y es lo que simula la compuerta anti-hueco).
        // Recalcularlo acá con otra fórmula deja fondo plano entre foto y foto.
        const cap = b.start >= AVATAR_END ? 9 : HERO_CAP;
        const cov = b.cov ?? Math.min(b.dur, cap);
        const d = Math.max(1, sec(cov + 0.6));
        return (
          <Sequence key={b.id} from={sec(b.start)} durationInFrames={d} premountFor={20}>
            <RawShot durationInFrames={d} src={b.src} hue="cold" kicker={b.kicker} />
          </Sequence>
        );
      })}

      {/* CAPA 3 — AVATAR en BUCLE y MUTEADO (full / hidden, cero split, cero recuadro) */}
      <AvatarLayerLoopFcs src="fedguante_opt.mp4" windows={AVATAR_WINDOWS} accent={TEAL}
        avatarFocus={{ x: 0.5, y: 0.32, splitZoom: 1 }} avatarFrames={AVATAR_FRAMES} />

      {/* CAPA 4 — COMPONENTES */}
      {compBeats.map((b: any) => {
        const d = Math.max(1, sec(compDur(b)));
        return (
          <Sequence key={`comp_${b.id}`} from={sec(b.start)} durationInFrames={d} layout="none">
            {renderComp(b, d)}
          </Sequence>
        );
      })}

      {/* HOOK — ⚠ ESCRITO PARA ESTE VIDEO (al clonar un Main, esta Sequence se trae el texto
          del otro: `grcoffee` se entregó con el hook de otro video en los primeros 4 s). */}
      <Sequence from={sec(1.4)} durationInFrames={sec(hookDur)} layout="none">
        <AvatarScrimText durationInFrames={sec(hookDur)}
          setup="Pellizcá la piel del dorso de tu mano, contá hasta tres y soltala. Lo que tarde en volver no dice tu edad: dice otra cosa."
          impact="EL TRUCO DEL GUANTE DE ROMERO"
          accentColor={TEAL} font={F_INTER} fontSize={92} />
      </Sequence>

      {/* ENDCARD — ⚠ con props propias: los defaults de <Endcard/> son de OTRO canal
          ("…salud y vitalidad real para después de los 40") y ya se entregaron así. */}
      <Sequence from={sec(CTA_AT)} durationInFrames={sec(Math.max(2, VEND - CTA_AT))} layout="none">
        <Endcard durationInFrames={sec(Math.max(2, VEND - CTA_AT))}
          kicker="Dr. Federer · Federer Archivos" title="Suscribite"
          subtitle="Cada semana, salud explicada de verdad para después de los 60" cta="SUSCRIBIRME" />
      </Sequence>
    </AbsoluteFill>
  );
};
