// hdctomate · LOS 7 PASOS + CIERRE (133,9-946 s). Mismo hilo que el minuto 1: el patio 3D es el mapa (la planta, el banco
// con el frasco y el molcajete, el termómetro de la pared, la maceta en corte) y la cámara vuela de un lugar a otro sin cortar;
// las tomas LTX de Claudio haciendo cada cosa y las fotos de cada frase entran con barridos, el avatar por portales.
// Todo clavado a la voz. Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { World as WorldRaw, PT, BASE, makeCam, type Key, type WorldState } from "./huerto3d";
import { Avatar, Desc, Fan, MIN1_END, Page, Shot, Stamp, StepRow, Stopwatch, Subscribe, Swipe, WIN, at } from "./Min1";
import { BigNum, COL, FONT, Portal, Tag, Thermo, e, ei, extrude, spr } from "./lib";

export const END = 946.0;
const a = (ph: string, after = 133) => at(ph, after);

// ---------------- ventanas del avatar de esta parte (las pagó el /run) ----------------
const RW = WIN.filter((w) => w.ms >= MIN1_END - 0.2).map((w) => [w.ms, w.me] as [number, number]);
const winAt = (t: number) => RW.findIndex(([s0, e0]) => t >= s0 && t < e0);

// ---------------- poses de cámara por lugar del patio ----------------
type Pose = { p: [number, number, number]; l: [number, number, number]; fov: number };
const POSE: Record<string, Pose> = {
  wide: { p: [0.0, 1.9, 4.6], l: [0.3, 1.2, -0.6], fov: 45 },
  plant: { p: [0.25, 1.65, 2.5], l: [0.0, 1.55, 0.0], fov: 42 },
  flowers: { p: [0.5, 2.05, 1.05], l: [0.05, 1.9, 0.05], fov: 36 },
  topTruss: { p: [-0.25, 2.5, 0.95], l: [-0.05, 2.3, 0.1], fov: 34 },
  rot: { p: [-0.2, 2.32, 0.55], l: [-0.06, 2.24, 0.12], fov: 30 },
  botTruss: { p: [0.95, 1.25, 1.75], l: [0.08, 1.0, 0.08], fov: 32 },
  soilTop: { p: [0.55, 1.45, 1.05], l: [0.0, 0.72, -0.05], fov: 38 },
  section: { p: [0.0, 0.55, 1.45], l: [0.0, 0.42, 0.0], fov: 36 },
  bench: { p: [1.6, 1.35, 0.6], l: [1.8, 0.85, -1.3], fov: 36 },
  molca: { p: [2.05, 1.25, -0.7], l: [2.15, 0.88, -1.35], fov: 30 },
  thermo: { p: [-0.7, 1.9, -1.4], l: [-0.9, 1.9, -2.54], fov: 40 },
  compost: { p: [-1.3, 1.2, -0.4], l: [-2.1, 0.5, -1.6], fov: 40 },
  sucker: { p: [0.35, 1.55, 0.6], l: [0.07, 1.47, 0.05], fov: 30 },
  cane: { p: [0.6, 1.45, 1.4], l: [0.05, 1.3, 0.0], fov: 40 },
  patioL: { p: [-1.6, 1.4, 1.6], l: [-2.3, 0.6, -1.4], fov: 44 },
};
const push = (q: Pose, k = 0.12): Pose => ({ p: q.p.map((v, i) => v + (q.l[i] - v) * k) as Pose["p"], l: q.l, fov: q.fov - 2 });

// ---------------- el guion visual: cada frase con SU toma, SU foto o SU lugar del patio ----------------
// v = "img:<clave>" (toma LTX si está, si no su cuadro clave / foto) · "w:<pose>" (el patio) · "wd:<pose>" (patio oscurecido, para piezas)
const B: { a: number; v: string; from?: number }[] = [
  { a: MIN1_END, v: "w:flowers" },
  { a: 140.2, v: "img:r_polen" },
  { a: 148.5, v: "w:wide" },
  { a: 152.7, v: "img:r_balcon" },
  { a: 155.5, v: "img:r_flores_palma" },
  { a: 157.3, v: "img:r_flores_tierra" },
  { a: 164.3, v: "img:c_sacude" },
  { a: 180.5, v: "w:flowers" },
  { a: 184.9, v: "wd:wide" },
  { a: 188.9, v: "w:thermo" },
  { a: 198.2, v: "img:r_pared_sol" },
  { a: 204.2, v: "w:wide" },
  { a: 207.7, v: "w:soilTop" },
  { a: 215.4, v: "wd:plant" },
  { a: 221.1, v: "w:botTruss" },
  { a: 230.3, v: "w:bench" },
  { a: 234.5, v: "w:flowers" },
  { a: 240.1, v: "w:botTruss" },
  { a: 247.3, v: "img:r_cascaras_maceta" },
  { a: 254.8, v: "w:bench" },
  { a: 262.5, v: "img:c_frasco", from: 1 },
  { a: 266.0, v: "img:c_vierte", from: 0.5 },
  { a: 278.1, v: "w:bench" },
  { a: 282.3, v: "img:c_tela", from: 0.5 },
  { a: 294.2, v: "img:c_revuelve", from: 0.5 },
  { a: 296.2, v: "img:r_frasco_bien" },
  { a: 301.1, v: "img:r_frasco_moho" },
  { a: 310.9, v: "img:c_cuela", from: 0.5 },
  { a: 315.7, v: "img:c_balde", from: 0.5 },
  { a: 320.9, v: "img:c_riega", from: 0.5 },
  { a: 329.5, v: "wd:bench" },
  { a: 335.3, v: "w:molca" },
  { a: 346.7, v: "img:r_cascarones_enteros" },
  { a: 353.7, v: "w:molca" },
  { a: 360.7, v: "img:c_cascaron", from: 0.5 },
  { a: 364.0, v: "img:r_cascarones_secando" },
  { a: 368.2, v: "img:c_molcajete", from: 0.5 },
  { a: 377.3, v: "img:r_polvo_frasco" },
  { a: 386.6, v: "w:soilTop" },
  { a: 393.7, v: "img:c_entierra", from: 0.5 },
  { a: 397.9, v: "wd:soilTop" },
  { a: 403.9, v: "img:r_punta_negra" },
  { a: 411.6, v: "img:r_calcio_tienda" },
  { a: 417.9, v: "w:section" },
  { a: 429.9, v: "w:plant" },
  { a: 443.0, v: "w:plant" },
  { a: 446.9, v: "img:r_borra" },
  { a: 449.2, v: "img:r_agua_arroz" },
  { a: 451.6, v: "img:r_estiercol" },
  { a: 455.4, v: "w:wide" },
  { a: 463.1, v: "w:topTruss" },
  { a: 477.9, v: "img:c_trasplante", from: 0.5 },
  { a: 495.1, v: "wd:plant" },
  { a: 499.4, v: "w:flowers" },
  { a: 503.6, v: "w:compost" },
  { a: 515.3, v: "w:flowers" },
  { a: 518.8, v: "img:c_borra", from: 0.5 },
  { a: 523.6, v: "w:patioL" },
  { a: 532.5, v: "img:r_hojas_quemadas" },
  { a: 534.6, v: "img:r_costra" },
  { a: 537.8, v: "img:r_lavar_maceta" },
  { a: 549.6, v: "wd:section" },
  { a: 554.8, v: "w:section" },
  { a: 557.5, v: "img:r_maceta_chica" },
  { a: 567.3, v: "w:section" },
  { a: 569.9, v: "img:r_dos_baldes" },
  { a: 576.2, v: "img:r_agujeros" },
  { a: 584.1, v: "img:r_platito" },
  { a: 587.3, v: "w:wide" },
  { a: 591.8, v: "img:r_vasito" },
  { a: 597.2, v: "w:section" },
  { a: 603.3, v: "img:r_pelitos" },
  { a: 611.6, v: "w:section" },
  { a: 621.2, v: "img:r_zanja" },
  { a: 636.9, v: "w:section" },
  { a: 644.1, v: "img:r_tierra_seca" },
  { a: 651.7, v: "img:r_balde_entero" },
  { a: 655.5, v: "img:r_rajado" },
  { a: 657.6, v: "w:rot" },
  { a: 665.8, v: "img:c_dedo", from: 0.5 },
  { a: 668.6, v: "img:c_riegohondo", from: 0.5 },
  { a: 683.6, v: "img:c_mantillo", from: 0.5 },
  { a: 690.0, v: "img:r_paja" },
  { a: 693.3, v: "wd:soilTop" },
  { a: 702.5, v: "img:r_hongo" },
  { a: 703.9, v: "w:soilTop" },
  { a: 719.4, v: "img:r_racimos_todo" },
  { a: 723.4, v: "w:cane" },
  { a: 728.5, v: "img:c_atar", from: 0.5 },
  { a: 737.3, v: "w:plant" },
  { a: 742.8, v: "w:sucker" },
  { a: 746.3, v: "img:r_axila" },
  { a: 753.0, v: "img:r_chupon_grande" },
  { a: 766.6, v: "img:c_chupon", from: 0.5 },
  { a: 772.0, v: "img:r_hojas_amarillas" },
  { a: 774.6, v: "img:c_hojas", from: 0.5 },
  { a: 782.4, v: "w:botTruss" },
  { a: 785.5, v: "img:c_cosecha", from: 0.5 },
  { a: 798.5, v: "img:r_pintones" },
  { a: 800.6, v: "w:topTruss" },
  { a: 804.6, v: "w:flowers" },
  { a: 814.9, v: "w:thermo" },
  { a: 831.6, v: "img:r_tirar" },
  { a: 840.7, v: "w:botTruss" },
  { a: 848.0, v: "w:botTruss" },
  { a: 849.8, v: "w:bench" },
  { a: 855.1, v: "w:molca" },
  { a: 864.1, v: "img:r_vivero" },
  { a: 870.5, v: "wd:wide" },
  { a: 879.4, v: "w:bench" },
  { a: 884.0, v: "img:p_burbujas", from: 0.5 },
  { a: 895.2, v: "wd:plant" },
  { a: 912.9, v: "wd:plant" },
  { a: 915.3, v: "wd:flowers" },
  { a: 930.8, v: "img:r_chiles" },
  { a: 938.3, v: "img:p_racimo", from: 0.5 },
].sort((x, y) => x.a - y.a);
const beatAt = (t: number) => { let i = 0; while (i < B.length - 1 && B[i + 1].a <= t) i++; return i; };

// ---------------- la cámara: vuela de lugar en lugar (si viene de otra toma del patio) y empuja despacio ----------------
const KEYS: Key[] = [];
{
  let prev: Pose | null = null;
  B.forEach((b, i) => {
    const end = i < B.length - 1 ? B[i + 1].a : END;
    if (!b.v.startsWith("w")) { prev = null; return; }
    const q = POSE[b.v.split(":")[1]];
    const fly = prev && end - b.a > 2.2 ? 1.1 : 0;
    if (prev) KEYS.push({ t: b.a, ...prev });
    KEYS.push({ t: b.a + fly, ...q, arc: 0.03 });
    prev = push(q, 0.1 + Math.min(0.12, (end - b.a) * 0.01));
    KEYS.push({ t: end - 0.01, ...prev });
  });
}
const CAM = makeCam(KEYS);
const { screenOf } = CAM;

// ---------------- estado del patio segundo a segundo ----------------
const on = (t: number, x: number, y = 1e9, f = 0.4) => e(t, x, x + f) * (1 - e(t, y, y + f));
const S = { p2: a("paso numero 2"), p3: a("paso numero 3"), p4: a("paso numero 4"), p5: a("paso numero 5"), p6: a("paso numero 6"), p7: a("paso numero 7") };
const stAt = (t: number): WorldState => {
  const fill = (x: number, y: number) => [0, 1, 2, 3].map((i) => e(t, x + i * 0.8, y + i * 0.8));
  let fruit = [0, 0, 0, 0], ripe = [0, 0, 0, 0], flw = [1, 1, 1, 1], drop = [0, 0, 0, 0], rot = 0, bushy = 0;
  if (t >= 221 && t < 230.3) fruit = [e(t, 221.3, 223), e(t, 222, 223.6), 0, 0];
  if (t >= 240 && t < 244) fruit = fill(240.2, 242.5);
  if (t >= 429 && t < 475) { bushy = t < 443 ? e(t, 431, 437) : t < 455.4 ? 0 : 1; fruit = t >= 463 ? [0, 0, 0, 0.8] : [0, 0, 0, 0]; flw = t >= 463 ? [0.3, 0.4, 1, 0] : flw; drop = t >= 463 ? [e(t, 469, 471.5), e(t, 469.4, 472), 0, 0] : drop; }
  if (t >= 657 && t < 662.5) { fruit = [0, 0, 0, 1]; ripe = [0, 0, 0, 0.4]; rot = e(t, 658.2, 659.2); flw = [1, 1, 1, 0]; }
  if (t >= 719 && t < 760) { fruit = [1, 1, 1, 1]; ripe = [0.2, 0.3, 0.5, 0.6]; flw = [0, 0, 0, 0]; }
  if (t >= 782 && t < 786) { fruit = fill(782.4, 784); ripe = [0.7, 0.5, 0.4, 0.3]; flw = [0, 0, 0, 0]; }
  if (t >= 800 && t < 804.7) { fruit = [1, 1, 1, 1]; ripe = [1, 1, 1, 1]; flw = [0, 0, 0, 0]; }
  if (t >= 840 && t < 850) { fruit = fill(848.2, 849.4); flw = [1, 1, 1, 1]; }
  const heat = on(t, 188.9, 198.2, 0.8) + on(t, 814.9, 826.9, 0.8);
  return {
    ...BASE,
    jarFill: 0.85, peels: 1, ferment: 0.75, cloth: on(t, 0, 278.1, 0.2) + on(t, 282.3, 1e9, 0.2), lid: on(t, 278.3, 282.3, 0.3), bucket: 0.75, powder: 1, shells: 0.6,
    fruit, ripe, flw, drop, rot, bushy,
    pollen: on(t, MIN1_END + 2, 144, 0.6) + on(t, 180.5, 184.9, 0.4),
    shake: on(t, 148.5, 150.6, 0.3) + on(t, 180.5, 183.5, 0.3) + on(t, 737.4, 739.5, 0.3) * 0.6,
    flowerGlow: on(t, MIN1_END + 0.5, 140, 0.3) * 0.6,
    heat, temp: 26 + 8 * ei(t, 189.4, 191.5) * (1 - e(t, 198, 199)) + 8 * ei(t, 815.4, 817.5),
    sun: t >= 204 && t < 208 ? 0.8 - 1.4 * ei(t, 204.6, 206.4) : -0.4, shade: t >= 204 && t < 208 ? e(t, 205.6, 206.6) : 0,
    dry: on(t, 207.7, 209.9, 0.3) + on(t, 417.9, 420.6, 0.3) + on(t, 422.6, 424.6, 0.3),
    wet: t >= 636.9 && t < 644.1 ? 0.6 : t >= 420.6 && t < 422.6 ? 0.9 : 0.2,
    feed: on(t, 234.6, 240, 0.4) + on(t, 499.6, 503.6, 0.4), feedCol: t > 499 && t < 504 ? "#ffcf4a" : "#ffb84a", glow: on(t, 240.2, 243.8, 0.4) * 0.6,
    cupGlow: on(t, 230.4, 234.5, 0.3) + on(t, 849.9, 855.1, 0.3), bucketGlow: on(t, 879.5, 884, 0.3),
    powderGlow: on(t, 335.4, 339.4, 0.3) + on(t, 353.8, 356.5, 0.3) + on(t, 855.2, 860.5, 0.3),
    shell: on(t, 386.8, 393.7, 0.4),
    roots: t >= 597 && t < 616 ? 0.25 + 0.75 * e(t, 611.8, 614.2) : 0.2,
    mulch: on(t, 703.9, 1e9, 0.5),
    ties: 1, sucker: t >= 742 && t < 747 ? 1 : 0, suckerHi: on(t, 743.4, 746.3, 0.3),
    prune: t >= 782 && t < 786 ? 1 : 0, yellow: 0,
  };
};

const WorldR: React.FC<{ t: number; dim?: number }> = ({ t, dim = 0 }) => <AbsoluteFill style={{ filter: dim > 0 ? `brightness(${1 - dim})` : undefined }}><WorldRaw t={t} camAt={CAM.camAt} st={stAt(t)} /></AbsoluteFill>;

// una toma del guion (toma/foto con empuje o el patio), dibujada en el segundo t
const Visual: React.FC<{ i: number; t: number }> = ({ i, t }) => {
  const b = B[i], end = i < B.length - 1 ? B[i + 1].a : END, [kind, k] = b.v.split(":");
  if (kind === "img") {
    const zin = i % 2 === 0;
    return <Shot k={k} t={t} a={b.a} dur={end - b.a + 0.6} z={zin ? [1.03, 1.12] : [1.12, 1.03]} ox={(i % 3 - 1) * 24} oy={zin ? -10 : 10} from={b.from ?? 0} />;
  }
  return <WorldR t={t} dim={kind === "wd" ? 0.5 : 0} />;
};

// ---------------- piezas de esta parte ----------------
const StepTitle: React.FC<{ t: number; at: number; out: number; n: number; name: string }> = ({ t, at: a0, out, n, name }) => {
  const k = Math.min(1.12, spr(t, a0, 0.85)), o = e(t, a0, a0 + 0.12) * (1 - e(t, out, out + 0.35));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 90, top: 100, opacity: o, fontFamily: FONT, perspective: 1200 }}>
      <div style={{ transform: `rotateY(${(1 - Math.min(1, k)) * -70}deg)`, transformOrigin: "0 50%" }}>
        <div style={{ fontWeight: 900, fontSize: 40, color: COL.ink, letterSpacing: 10, textShadow: "0 3px 12px #000" }}>PASO</div>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div style={{ fontWeight: 900, fontSize: 210, lineHeight: 0.95, color: "#b9f08a", textShadow: extrude(10, "#14350f") }}>{n}</div>
          <div style={{ fontWeight: 900, fontSize: 62, lineHeight: 1.05, color: "#fff", maxWidth: 760, letterSpacing: 2, textShadow: extrude(6, "rgba(0,0,0,.7)"), clipPath: `inset(0 ${100 - 100 * e(t, a0 + 0.25, a0 + 0.7)}% 0 0)` }}>{name}</div>
        </div>
      </div>
    </div>
  );
};

// pastilla arriba: ✗ LO QUE HACE TODO EL MUNDO / ✓ LO QUE YO HAGO
const Chip: React.FC<{ t: number; at: number; out: number; good?: boolean; text?: string }> = ({ t, at: a0, out, good, text }) => {
  const k = Math.min(1.1, spr(t, a0)), o = e(t, a0, a0 + 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 70, display: "flex", justifyContent: "center", opacity: o }}>
      <div style={{ transform: `translateY(${(1 - Math.min(1, k)) * -90}px)`, display: "flex", alignItems: "center", gap: 18, padding: "14px 36px", borderRadius: 50, fontFamily: FONT, fontWeight: 900, fontSize: 40, letterSpacing: 2, color: "#fff",
        background: good ? "linear-gradient(180deg,#1f7a4d,#13452c)" : "linear-gradient(180deg,#a3221b,#5e0f0b)", boxShadow: `0 24px 50px rgba(0,0,0,.55), 0 0 30px ${good ? "rgba(63,224,138,.45)" : "rgba(255,60,40,.45)"}` }}>
        <span style={{ fontSize: 46 }}>{good ? "✓" : "✗"}</span>{text ?? (good ? "LO QUE YO HAGO" : "LO QUE HACE TODO EL MUNDO")}
      </div>
    </div>
  );
};

// filas ✓ / ✗ que entran con su frase
const Rows: React.FC<{ t: number; out: number; y?: number; size?: number; items: { at: number; tx: string; ok: boolean }[] }> = ({ t, out, y = 300, size = 60, items }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", flexDirection: "column", alignItems: "center", gap: 24, fontFamily: FONT }}>
    {items.map((it, i) => {
      const k = Math.min(1.1, spr(t, it.at, 0.9)), o = e(t, it.at, it.at + 0.12) * (1 - e(t, out, out + 0.3));
      return (
        <div key={i} style={{ opacity: o, transform: `translateX(${(1 - Math.min(1, k)) * (i % 2 ? 300 : -300)}px)`, display: "flex", alignItems: "center", gap: 26, padding: "14px 44px", borderRadius: 22,
          background: "rgba(12,18,10,.86)", boxShadow: `0 0 0 4px ${it.ok ? "#3fe08a" : COL.red}, 0 30px 60px rgba(0,0,0,.55)` }}>
          <span style={{ fontWeight: 900, fontSize: size * 1.15, color: it.ok ? "#7dffb4" : "#ff6b5e" }}>{it.ok ? "✓" : "✗"}</span>
          <span style={{ fontWeight: 900, fontSize: size, color: "#fff", letterSpacing: 2 }}>{it.tx}</span>
        </div>
      );
    })}
  </div>
);

// la medida: tarjetas que nacen con su palabra, unidas por flechas
const Measure: React.FC<{ t: number; out: number; y?: number; items: { at: number; big: string; sub: string; ic: string }[] }> = ({ t, out, y = 760, items }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", alignItems: "center", gap: 18, perspective: 1300, fontFamily: FONT }}>
    {items.map((it, i) => {
      const k = Math.min(1.1, spr(t, it.at, 0.9)), o = e(t, it.at, it.at + 0.12) * (1 - e(t, out, out + 0.3));
      return (
        <React.Fragment key={i}>
          {i > 0 && <span style={{ opacity: o, fontWeight: 900, fontSize: 64, color: "#ffd84a", textShadow: extrude(4, "#000") }}>➜</span>}
          <div style={{ opacity: o, transform: `rotateX(${(1 - Math.min(1, k)) * 80}deg) translateY(${Math.sin(t * 1.5 + i) * 4}px)`, transformOrigin: "50% 100%", minWidth: 290, padding: "14px 22px 14px", borderRadius: 22, textAlign: "center",
            background: "linear-gradient(180deg,rgba(250,246,236,.97),rgba(226,218,200,.97))", boxShadow: "0 30px 60px rgba(0,0,0,.6), 0 0 0 3px rgba(255,216,74,.7)" }}>
            <div style={{ fontSize: 60, lineHeight: 1.1 }}>{it.ic}</div>
            <div style={{ fontWeight: 900, fontSize: 58, color: "#2a3a14", lineHeight: 1 }}>{it.big}</div>
            <div style={{ fontWeight: 800, fontSize: 22, color: "#5a4a2a", letterSpacing: 2, marginTop: 6 }}>{it.sub}</div>
          </div>
        </React.Fragment>
      );
    })}
  </div>
);

// frase grande, palabra por palabra
const Quote: React.FC<{ t: number; at: number; out: number; text: string; col?: string; y?: number; size?: number }> = ({ t, at: a0, out, text, col = "#fff", y = 400, size = 96 }) => {
  const w = text.split(" "), o = 1 - e(t, out, out + 0.3);
  if (t < a0 || o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 120, right: 120, top: y, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: size, lineHeight: 1.12, color: col, letterSpacing: 2, opacity: o }}>
      {w.map((x, i) => { const ai = a0 + i * 0.12, k = Math.min(1.1, spr(t, ai)); return <span key={i} style={{ display: "inline-block", margin: "0 14px", opacity: e(t, ai, ai + 0.08), transform: `translateY(${(1 - Math.min(1, k)) * 60}px)`, textShadow: extrude(7, "rgba(0,0,0,.65)") }}>{x}</span>; })}
    </div>
  );
};

// la pregunta para comentar (tarjeta tipo comentario, se escribe sola)
const Comment: React.FC<{ t: number; at: number; out: number; reply: number }> = ({ t, at: a0, out, reply }) => {
  const k = Math.min(1.1, spr(t, a0, 0.8)), o = e(t, a0, a0 + 0.15) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const q = "¿A tu planta se le caen las flores o le sale la punta negra? ¿En qué ciudad estás?", n = Math.round(q.length * e(t, a0 + 0.3, a0 + 3.0));
  const rs = [{ f: "🇲🇽", tx: "Monterrey · se me caen todas 🥵" }, { f: "🇨🇴", tx: "Cali · la punta negra" }, { f: "🇦🇷", tx: "Mendoza · las dos 😅" }];
  return (
    <div style={{ position: "absolute", left: 360, top: 150, width: 1200, opacity: o, transform: `translateY(${(1 - Math.min(1, k)) * 120}px)`, fontFamily: FONT }}>
      <div style={{ padding: "34px 44px", borderRadius: 28, background: "rgba(250,248,242,.97)", boxShadow: "0 40px 80px rgba(0,0,0,.6)" }}>
        <div style={{ fontWeight: 900, fontSize: 30, color: "#2f8a4f", letterSpacing: 3 }}>💬 CUÉNTAME EN LOS COMENTARIOS</div>
        <div style={{ fontWeight: 800, fontSize: 50, color: "#1d2733", marginTop: 14, lineHeight: 1.2, minHeight: 190 }}>{q.slice(0, n)}<span style={{ opacity: Math.sin(t * 9) > 0 ? 1 : 0 }}>|</span></div>
      </div>
      {rs.map((r, i) => {
        const ai = reply + i * 0.6, kk = Math.min(1.1, spr(t, ai)), oo = e(t, ai, ai + 0.12);
        return <div key={i} style={{ opacity: oo, transform: `translateX(${(1 - Math.min(1, kk)) * 200}px)`, marginTop: 22, marginLeft: 80 + i * 30, display: "inline-flex", alignItems: "center", gap: 18, padding: "14px 30px", borderRadius: 40, background: "rgba(10,14,22,.9)", boxShadow: "0 20px 40px rgba(0,0,0,.5)", fontWeight: 800, fontSize: 36, color: "#fff", marginRight: 1000 }}>
          <span style={{ fontSize: 44 }}>{r.f}</span>{r.tx}</div>;
      })}
    </div>
  );
};

// ---------------- composición ----------------
export const Rest: React.FC = () => {
  const t = useCurrentFrame() / 30;
  const L: React.ReactNode[] = [];
  const wi = winAt(t), bi = beatAt(t);

  // ===== capa base: avatar / tomas / patio, con portales y barridos =====
  if (wi >= 0) {
    L.push(<Avatar key="av" t={t} />);
  } else {
    const prevW = RW.find(([, e0]) => t >= e0 && t < e0 + 0.38);
    const b = B[bi], startedInWin = winAt(b.a) >= 0 || RW.some(([, e0]) => Math.abs(e0 - b.a) < 0.4);
    if (prevW) L.push(<Swipe key="sx" t={t} a={prevW[1]} b={prevW[1] + 0.38} dir={bi % 2 ? 1 : -1} vert={bi % 3 === 0} from={<Avatar t={t} />} to={<Visual i={bi} t={t} />} />);
    else if (bi > 0 && t < b.a + 0.38 && !startedInWin && !(B[bi - 1].v.startsWith("w") && b.v.startsWith("w")))
      L.push(<Swipe key={"sb" + bi} t={t} a={b.a} b={b.a + 0.38} dir={bi % 2 ? 1 : -1} vert={bi % 4 === 1} from={<Visual i={bi - 1} t={t} />} to={<Visual i={bi} t={t} />} />);
    else L.push(<Visual key={"v" + bi} i={bi} t={t} />);
    const nextW = RW.find(([s0]) => t >= s0 - 0.35 && t < s0);
    if (nextW) L.push(<Portal key="pw" x={960} y={540} r={ei(t, nextW[0] - 0.35, nextW[0])}><Avatar t={t} /></Portal>);
  }

  // ===== PASO 1 · por qué se caen las flores =====
  L.push(<StepTitle key="t1" t={t} at={MIN1_END + 0.1} out={138.8} n={1} name="¿POR QUÉ SE CAEN LAS FLORES?" />);
  if (t > 136 && t < 140.4) { const f = screenOf(t, PT.tr2); L.push(<Tag key="so" t={t} at={a("se poliniza sola") + 0.1} x={f.x} y={f.y} dx={-330} dy={150} text="SE POLINIZA SOLA" sub="NO NECESITA ABEJAS" col="#ffd84a" out={140.0} size={50} />); }
  L.push(<Tag key="sac" t={t} at={a("algo la sacuda") + 0.1} x={980} y={520} dx={330} dy={-200} text="PERO ALGUIEN LA TIENE QUE SACUDIR" col="#fff" out={143.9} size={44} />);
  if (t > 148.4 && t < 152.8) { const f = screenOf(t, PT.tr1); L.push(<Tag key="vi" t={t} at={a("lo hace el viento") + 0.1} x={f.x} y={f.y} dx={330} dy={-160} text="EN EL CAMPO: EL VIENTO" col="#8fd6ff" out={152.5} size={48} />); }
  L.push(<Stamp key="sa" t={t} at={a("balcon sin aire") + 0.2} text="SIN AIRE" x={1450} y={250} out={155.3} rot={-8} size={96} />);
  L.push(<Tag key="nm" t={t} at={a("nadie la mueve") + 0.1} x={960} y={560} dx={330} dy={-220} text="NADIE LA MUEVE" sub="NO SE POLINIZA" col="#fff" out={157.2} size={52} />);
  L.push(<Tag key="su" t={t} at={a("la planta la suelta") + 0.1} x={960} y={600} dx={-330} dy={-240} text="Y LA PLANTA LA SUELTA" col={COL.red} out={160.7} size={52} />);
  L.push(<Chip key="b1" t={t} at={164.4} out={174.8} good />);
  L.push(<Tag key="mm" t={t} at={a("a media manana") + 0.1} x={960} y={520} dx={-330} dy={-200} text="A MEDIA MAÑANA" sub="YA SECO EL ROCÍO" col="#ffd84a" out={a("le doy unos golpecitos") - 0.1} size={52} />);
  L.push(<Tag key="gp" t={t} at={a("le doy unos golpecitos") + 0.2} x={1200} y={500} dx={330} dy={-200} text="GOLPECITOS AL TALLO" sub="O SACUDES LA VARA" col="#fff" out={174.8} size={50} />);
  L.push(<Stopwatch key="sw10" t={t} at={a("10 segundos") - 0.1} out={180.2} x={1420} y={330} n={10} unit="SEG" label="POR PLANTA" />);
  if (t > 180.4 && t < 185) { const f = screenOf(t, PT.tr2); L.push(<Tag key="pl" t={t} at={a("es el polen") + 0.1} x={f.x} y={f.y} dx={-330} dy={-170} text="EL POLEN" col="#ffd84a" out={a("un dia si y un dia no") - 0.1} size={60} />); }
  L.push(<BigNum key="dsn" t={t} at={a("un dia si y un dia no")} text="UN DÍA SÍ, UN DÍA NO" sub="MIENTRAS HAYA FLORES" size={84} x={1300} y={230} out={184.7} col="#b9f08a" edge="#14350f" />);
  L.push(<BigNum key="2c" t={t} at={a("y hay otras dos cosas")} text="+2 COSAS" sub="Y NINGUNA ES UNA PLAGA" size={140} y={360} out={188.6} col="#ffd84a" edge="#5a4500" />);
  L.push(<Thermo key="th1" t={t} at={189.2} x={1500} y={520} from={26} to={32} dur={2.0} out={193.5} hotAt={30} max={45} />);
  L.push(<Tag key="32" t={t} at={a("pasa los 32 grados") + 0.2} x={1380} y={520} dx={-360} dy={-160} text="DÍA: +32 °C" sub="NOCHE: +24 °C" col={COL.red} out={193.5} size={60} />);
  L.push(<Stamp key="ar" t={t} at={a("se arruina")} text="POLEN ARRUINADO" x={1350} y={280} out={198.0} rot={-7} size={74} />);
  L.push(<Tag key="ps" t={t} at={a("contra una pared") + 0.1} x={960} y={520} dx={330} dy={-220} text="PARED CON SOL DE TARDE" col={COL.red} out={204.0} size={50} />);
  L.push(<Rows key="r1s" t={t} out={207.5} y={300} items={[{ at: a("sol de manana") + 0.1, tx: "SOL DE MAÑANA", ok: true }, { at: a("sombra a la tarde") + 0.1, tx: "SOMBRA A LA TARDE", ok: true }]} />);
  L.push(<Tag key="rd" t={t} at={a("el riego desparejo") + 0.1} x={960} y={600} dx={-330} dy={-260} text="EL RIEGO DESPAREJO" sub="LO VES EN EL PASO 6" col="#8fd6ff" out={209.8} size={52} />);
  L.push(<Rows key="r3c" t={t} out={221.0} y={260} items={[{ at: a("sacudir") + 0.05, tx: "SACUDIR", ok: true }, { at: a("sombra en la tarde") + 0.1, tx: "SOMBRA EN LA TARDE", ok: true }, { at: a("y riego parejo") + 0.1, tx: "RIEGO PAREJO", ok: true }]} />);
  if (t > 221 && t < 224.4) { const f = screenOf(t, PT.tr0); L.push(<Tag key="tt" t={t} at={a("ver tomatitos") + 0.1} x={f.x} y={f.y} dx={330} dy={-170} text="TOMATITOS" col="#b9f08a" out={224.2} size={60} />); }

  // ===== PASO 2 · el fermentado de cáscara de plátano =====
  L.push(<StepTitle key="t2" t={t} at={230.4} out={234.3} n={2} name="EL FERMENTADO DE CÁSCARA DE PLÁTANO" />);
  if (t > 234.4 && t < 240.2) { const f = screenOf(t, PT.tr2); L.push(<Tag key="k" t={t} at={a("a pedir potasio") + 0.1} x={f.x} y={f.y} dx={-330} dy={-170} text="POTASIO" sub="LLENA LA FLOR Y LA FRUTA" col="#ffb84a" out={240.0} size={66} />); }
  L.push(<Stamp key="ns" t={t} at={a("no sirve") - 0.1} text="ENTERA NO SIRVE" x={1380} y={250} out={a("tarda meses") + 2.5} rot={-7} size={80} />);
  L.push(<Tag key="tm" t={t} at={a("tarda meses") + 0.1} x={960} y={560} dx={-330} dy={-200} text="TARDA MESES" sub="Y ATRAE MOSQUITAS" col="#fff" out={254.6} size={52} />);
  L.push(<Chip key="b2" t={t} at={a("lo que yo hago es sacarle")} out={257.3} good text="LE SACO EL POTASIO AL AGUA" />);
  L.push(<Tag key="fr" t={t} at={262.8} x={960} y={520} dx={330} dy={-220} text="4 CÁSCARAS · 3 CM" sub="FRASCO DE VIDRIO DE 1 LITRO" col="#ffd84a" out={265.9} size={52} />);
  L.push(<Tag key="ag" t={t} at={a("un litro de agua sin cloro") + 0.1} x={960} y={520} dx={-330} dy={-220} text="1 LITRO DE AGUA SIN CLORO" col="#8fd6ff" out={a("o de azucar") + 0.2} size={50} />);
  L.push(<Tag key="pi" t={t} at={a("piloncillo") + 0.1} x={1000} y={600} dx={330} dy={-240} text="+ 1 CUCHARADA DE PILONCILLO" col="#ffb84a" out={273.5} size={48} />);
  L.push(<Stamp key="nc" t={t} at={a("el frasco no se") + 0.3} text="NO SE CIERRA" x={1350} y={260} out={282.2} rot={-8} size={96} />);
  if (t > 278 && t < 282.4) { const j = screenOf(t, PT.jar); L.push(<Tag key="tp" t={t} at={279.0} x={j.x} y={j.y} dx={-330} dy={-170} text="✗ CON TAPA" col={COL.red} out={282.2} size={56} />); }
  L.push(<Tag key="te" t={t} at={a("se tapa con un pedazo") + 0.2} x={980} y={520} dx={330} dy={-220} text="TELA O GASA + UNA LIGA" sub="EL GAS TIENE QUE SALIR" col="#7dffb4" out={288.9} size={50} />);
  L.push(<Stopwatch key="sw7" t={t} at={a("siete dias en un lugar") - 0.1} out={293.9} x={1420} y={330} n={7} unit="DÍAS" label="FRESCO Y OSCURO" />);
  L.push(<Tag key="rv" t={t} at={294.4} x={980} y={560} dx={-330} dy={-230} text="SE REVUELVE 1 VEZ AL DÍA" col="#fff" out={296.0} size={48} />);
  L.push(<Rows key="r2o" t={t} out={305.3} y={250} size={52} items={[{ at: a("oler dulce y agrio") + 0.1, tx: "DULCE Y AGRIO · COMO VINAGRE SUAVE", ok: true }, { at: a("si huele a huevo podrido") + 0.1, tx: "HUEVO PODRIDO · PESCADO · MOHO", ok: false }]} />);
  L.push(<Stamp key="st" t={t} at={a("se tira y se empieza") - 0.1} text="SE TIRA" x={1450} y={680} out={305.3} rot={-8} size={90} />);
  L.push(<Tag key="cl" t={t} at={311.1} x={960} y={520} dx={330} dy={-220} text="EL LÍQUIDO ES TU ABONO" col="#ffd84a" out={315.5} size={52} />);
  L.push(<Measure key="ms" t={t} out={324.0} y={780} items={[{ at: a("una taza del fermentado"), big: "1 TAZA", sub: "DEL FERMENTADO", ic: "☕" }, { at: a("en 10 litros de agua"), big: "10 L", sub: "DE AGUA · UN BALDE", ic: "🪣" }, { at: a("litros por planta") - 0.4, big: "2 L", sub: "POR PLANTA", ic: "🍅" }, { at: a("cada dos semanas", 318), big: "C/ 2 SEM.", sub: "DESDE LA 1ª FLOR", ic: "📅" }]} />);
  L.push(<Page key="p59" t={t} at={329.6} out={335.0} n={59} hl="EL FERMENTADO DE PLÁTANO" />);
  L.push(<Tag key="dd" t={t} at={a("te dura dos semanas") + 0.1} x={960} y={600} dx={330} dy={-200} text="DURA 2 SEMANAS" sub="TAPADO Y FRESCO" col="#7dffb4" out={335.0} size={44} />);

  // ===== PASO 3 · el polvo blanco (cascarón) =====
  L.push(<StepTitle key="t3" t={t} at={335.4} out={339.2} n={3} name="EL POLVO BLANCO, UNA VEZ AL MES" />);
  L.push(<Chip key="m3" t={t} at={a("no como la usa todo el mundo")} out={346.5} text="ENTEROS O APLASTADOS CON LA MANO" />);
  L.push(<Stamp key="sa3" t={t} at={a("al ano siguiente") + 0.2} text="UN AÑO DESPUÉS, IGUAL" x={1250} y={270} out={353.5} rot={-6} size={70} />);
  L.push(<BigNum key="ca" t={t} at={a("tiene calcio")} text="CALCIO" sub="SÓLO SI ESTÁ MOLIDO COMO ARENA" size={130} x={1300} y={230} out={356.3} col="#fff" edge="#555" />);
  L.push(<Chip key="b3" t={t} at={360.8} out={377.2} good />);
  L.push(<Tag key="10h" t={t} at={360.9} x={960} y={540} dx={330} dy={-220} text="10 HUEVOS · SE ENJUAGAN" col="#fff" out={363.9} size={50} />);
  L.push(<Tag key="sec" t={t} at={364.2} x={960} y={520} dx={-330} dy={-220} text="2 DÍAS AL SOL" sub="O 10 MIN EN EL HORNO APAGADO" col="#ffd84a" out={368.0} size={52} />);
  L.push(<Tag key="mo" t={t} at={a("los muelo en el molcajete") + 0.2} x={960} y={560} dx={330} dy={-220} text="MOLCAJETE O MOLINILLO" sub="HASTA QUE QUEDA COMO ARENA" col="#fff" out={373.3} size={50} />);
  L.push(<Tag key="fn" t={t} at={377.5} x={960} y={520} dx={-330} dy={-220} text="MÁS FINO = MÁS RÁPIDO" col="#7dffb4" out={a("lo guardo en un frasco") - 0.1} size={52} />);
  L.push(<Tag key="nu" t={t} at={a("lo guardo en un frasco") + 0.1} x={960} y={540} dx={330} dy={-220} text="NO SE ECHA A PERDER NUNCA" col="#fff" out={386.4} size={48} />);
  if (t > 386.5 && t < 388) { const r = screenOf(t, PT.ring5); L.push(<Tag key="pu" t={t} at={386.8} x={r.x} y={r.y} dx={330} dy={-200} text="1 PUÑITO · 1 VEZ AL MES" col="#fff" out={387.7} size={48} />); }
  L.push(<BigNum key="5cm" t={t} at={393.9} text="A 5 CM DEL TALLO" sub="MEZCLADO CON COMPOSTA" size={84} x={1300} y={220} out={397.7} col="#fff" edge="#555" />);
  L.push(<Page key="p70b" t={t} at={398.0} out={403.7} n={70} hl="LA FICHA DEL TOMATE" band={[64, 120]} />);
  L.push(<Stamp key="nf" t={t} at={a("no es falta de calcio") + 0.1} text="NO ES FALTA DE CALCIO" x={1100} y={250} out={a("casi siempre es el riego") - 0.1} rot={-6} size={72} col="#ffd84a" />);
  if (t > 417.9 && t < 424.7) { const s0 = screenOf(t, PT.soil); L.push(<Tag key="rd2" t={t} at={a("casi siempre es el riego") + 0.1} x={s0.x} y={s0.y} dx={330} dy={-200} text="EL RIEGO DESPAREJO" sub="EL CALCIO NO SUBE A LA FRUTA" col="#8fd6ff" out={424.4} size={52} />); }
  L.push(<Quote key="q3" t={t} at={a("lo que la quita es regar parejo") - 0.3} out={429.9} text="LO QUE LA QUITA ES REGAR PAREJO" col="#bfffd9" y={300} size={90} />);

  // ===== PASO 4 · el error: nitrógeno de más =====
  L.push(<StepTitle key="t4" t={t} at={S.p4 + 0.1} out={437.5} n={4} name="EL ERROR QUE DEJA PURO FOLLAJE" />);
  L.push(<BigNum key="n" t={t} at={a("es el nitrogeno de mas") + 0.3} text="NITRÓGENO DE MÁS" sub="HOJAS VERDES Y TALLOS LARGOS" size={100} x={1180} y={240} out={438.8} col="#b9f08a" edge="#14350f" />);
  L.push(<Tag key="fl" t={t} at={443.2} x={1100} y={500} dx={330} dy={-200} text="¿FLAQUITA?" sub="¿QUÉ LE ECHAMOS TODOS?" col="#fff" out={446.7} size={56} />);
  L.push(<Rows key="r4" t={t} out={455.2} y={220} size={50} items={[{ at: 447.0, tx: "LA BORRA DEL CAFÉ", ok: false }, { at: 449.3, tx: "EL AGUA DEL ARROZ", ok: false }, { at: 451.7, tx: "ESTIÉRCOL FRESCO", ok: false }, { at: 453.6, tx: "EL ABONO AZUL DEL PASTO", ok: false }]} />);
  L.push(<Tag key="hm" t={t} at={455.6} x={960} y={420} dx={330} dy={-160} text="HERMOSA… Y SIN FRUTA" col="#b9f08a" out={457.0} size={56} />);
  if (t > 463 && t < 474.4) { const tp = screenOf(t, PT.tr3), b0 = screenOf(t, PT.tr0); L.push(<Tag key="fa" t={t} at={a("gasta toda la fuerza arriba") + 0.1} x={tp.x} y={tp.y} dx={-330} dy={-120} text="TODA LA FUERZA ARRIBA" col="#ffd84a" out={474.2} size={50} />); L.push(<Tag key="fc" t={t} at={a("flores de abajo se caen") - 0.2} x={b0.x} y={b0.y} dx={330} dy={150} text="LAS DE ABAJO SE CAEN" col={COL.red} out={474.2} size={50} />); }
  L.push(<Chip key="b4" t={t} at={477.9} out={489.3} good text="LA COMIDA POR ETAPAS" />);
  L.push(<Tag key="et1" t={t} at={a("al trasplantar") + 0.1} x={960} y={600} dx={330} dy={-260} text="AL TRASPLANTAR" sub="1 PUÑO DE COMPOSTA O BOKASHI AL FONDO" col="#ffd84a" out={489.2} size={52} />);
  L.push(<Measure key="tc" t={t} out={499.2} y={760} items={[{ at: 495.2, big: "1 TAZA", sub: "TÉ DE COMPOSTA", ic: "🫖" }, { at: 495.6, big: "10 L", sub: "DE AGUA", ic: "🪣" }, { at: 496.0, big: "2 L", sub: "POR MACETA · C/ 2 SEM.", ic: "🌱" }]} />);
  L.push(<BigNum key="tcx" t={t} at={495.2} text="MIENTRAS HACE HOJAS" sub="PÁGINA 57 · EL MÁS SEGURO QUE HAY" size={80} y={230} out={499.2} col="#b9f08a" edge="#14350f" />);
  if (t > 499.4 && t < 503.7) { const f = screenOf(t, PT.tr2); L.push(<Tag key="pf" t={t} at={a("el dia que ves la primera flor") + 0.1} x={f.x} y={f.y} dx={-330} dy={-170} text="1ª FLOR: SE ACABA EL TÉ" sub="EMPIEZA EL FERMENTADO" col="#ffd84a" out={503.5} size={50} />); }
  if (t > 503.6 && t < 509.4) { const c = screenOf(t, PT.compost); L.push(<Tag key="bo" t={t} at={a("y la borra del cafe") + 0.1} x={c.x} y={c.y} dx={330} dy={-200} text="LA BORRA NO VA A LA MACETA" sub="VA A LA COMPOSTA" col="#ffd84a" out={509.2} size={46} />); }
  L.push(<Tag key="jl" t={t} at={515.5} x={960} y={500} dx={330} dy={-200} text="HOJAS = LO QUE NO QUIERES EN FLOR" col={COL.red} out={518.6} size={44} />);
  L.push(<BigNum key="13" t={t} at={a("una taza de cafe seco") - 0.1} text="1 CAFÉ : 3 COMPOSTA" size={90} x={1300} y={220} out={523.4} col="#ffd84a" edge="#5a4500" />);
  L.push(<Tag key="lc" t={t} at={a("la lechuga") + 0.1} x={960} y={560} dx={330} dy={-220} text="PARA LECHUGA Y CILANTRO" col="#b9f08a" out={526.0} size={50} />);
  L.push(<Tag key="pq" t={t} at={532.7} x={960} y={520} dx={-330} dy={-220} text="PUNTAS SECAS, QUEMADAS" col={COL.red} out={534.4} size={52} />);
  L.push(<Tag key="cs" t={t} at={534.8} x={960} y={420} dx={330} dy={-180} text="COSTRITA BLANCA" col="#fff" out={536.6} size={56} />);
  L.push(<Stamp key="ex" t={t} at={a("exceso de abono")} text="EXCESO DE ABONO" x={960} y={260} out={a("riega la despacito") - 0.1} rot={-6} size={90} />);
  L.push(<BigNum key="3x" t={t} at={a("tres veces con 10 minutos") - 0.2} text="3 VECES · 10 MIN" sub="HASTA QUE SALGA POR ABAJO" size={92} x={1300} y={230} out={545.4} col="#8fd6ff" edge="#0b2a40" />);
  L.push(<Page key="p14" t={t} at={549.7} out={554.6} n={14} hl="CUANDO TE PASASTE DE ABONO" />);
  L.push(<BigNum key="6s" t={t} at={549.8} text="6 SEMANAS SIN ABONO" size={60} x={1340} y={160} out={554.6} col="#fff" edge="#333" />);

  // ===== PASO 5 · la maceta y cómo se planta =====
  L.push(<StepTitle key="t5" t={t} at={S.p5 + 0.1} out={557.3} n={5} name="LA MACETA Y CÓMO SE PLANTA" />);
  L.push(<Tag key="vs" t={t} at={557.7} x={960} y={520} dx={330} dy={-220} text="MACETA CHICA = VIVE CON SED" col={COL.red} out={562.5} size={48} />);
  L.push(<BigNum key="50" t={t} at={a("una maceta de 50 litros") + 0.1} text="50 LITROS" sub="≈ 2 BALDES DE PINTURA GRANDES" size={150} x={1250} y={230} out={576.0} col="#ffd84a" edge="#5a4500" />);
  L.push(<Tag key="30" t={t} at={a("para los tomatitos cherry") + 0.1} x={960} y={500} dx={-330} dy={-200} text="CHERRY: 30 LITROS" sub="VARIOS AGUJEROS, NO UNO" col="#fff" out={579.0} size={50} />);
  L.push(<Tag key="pv" t={t} at={584.3} x={960} y={600} dx={330} dy={-240} text="EL PLATITO, VACÍO EN 1 HORA" sub="EL AGUA QUIETA PUDRE LA RAÍZ" col="#8fd6ff" out={587.1} size={46} />);
  L.push(<Quote key="qp" t={t} at={587.5} out={591.6} text="UN TRUCO DE MI PAPÁ QUE PARECE UN ERROR" col="#fff" y={330} size={80} />);
  L.push(<Stamp key="ho" t={t} at={a("se planta hondo") + 0.1} text="SE PLANTA HONDO" x={1350} y={250} out={597.0} rot={-7} size={92} col="#7dffb4" />);
  if (t > 597.2 && t < 598.6) { const s0 = screenOf(t, PT.buried); L.push(<Tag key="en" t={t} at={597.3} x={s0.x} y={s0.y} dx={330} dy={-180} text="EL TALLO, ENTERRADO" col="#ffd84a" out={598.3} size={50} />); }
  L.push(<Tag key="pe" t={t} at={a("tiene esos pelitos") + 0.1} x={960} y={540} dx={330} dy={-220} text="CADA PELITO = UNA RAÍZ" col="#ffd84a" out={611.4} size={56} />);
  if (t > 611.6 && t < 615.1) { const s0 = screenOf(t, PT.buried); L.push(<Tag key="2r" t={t} at={a("el doble de raices") + 0.1} x={s0.x} y={s0.y} dx={330} dy={-200} text="EL DOBLE DE RAÍCES" col="#7dffb4" out={614.9} size={56} />); }
  L.push(<Tag key="zj" t={t} at={a("lo acuestas") + 0.1} x={960} y={540} dx={-330} dy={-220} text="¿POCO HONDA? LO ACUESTAS" sub="EN UNA ZANJITA" col="#ffd84a" out={a("se endereza") + 1.5} size={50} />);

  // ===== PASO 6 · el riego parejo =====
  L.push(<StepTitle key="t6" t={t} at={636.9 + 0.1} out={641.5} n={6} name="EL RIEGO PAREJO" />);
  L.push(<Rows key="r6" t={t} out={644.0} y={480} size={52} items={[{ at: a("como una esponja escurrida"), tx: "COMO UNA ESPONJA ESCURRIDA", ok: true }, { at: a("ni encharcada") + 0.1, tx: "NI ENCHARCADA NI SECA", ok: false }]} />);
  L.push(<Tag key="sp" t={t} at={644.3} x={960} y={500} dx={330} dy={-200} text="SECA HASTA LAS PIEDRAS" col={COL.red} out={647.6} size={52} />);
  L.push(<Tag key="be" t={t} at={651.9} x={960} y={500} dx={-330} dy={-200} text="Y AL OTRO DÍA, UN BALDE ENTERO" col="#8fd6ff" out={655.3} size={46} />);
  L.push(<Tag key="rj" t={t} at={655.6} x={960} y={460} dx={330} dy={-200} text="LA FRUTA SE RAJA" col={COL.red} out={657.4} size={52} />);
  if (t > 657.6 && t < 662.1) { const tp = screenOf(t, PT.tr3); L.push(<Tag key="pn6" t={t} at={a("que salga la punta negra") + 0.3} x={tp.x} y={tp.y + 60} dx={-340} dy={140} text="LA PUNTA NEGRA" col={COL.red} out={661.9} size={58} />); }
  L.push(<Rows key="r6d" t={t} out={677.3} y={250} size={52} items={[{ at: 666.0, tx: "2 DEDOS SECOS → RIEGO HONDO", ok: true }, { at: a("si estan humedos") + 0.1, tx: "HÚMEDOS → NO RIEGO", ok: false }]} />);
  L.push(<Tag key="tp6" t={t} at={a("siempre a la misma hora") + 0.1} x={960} y={600} dx={330} dy={-230} text="SIEMPRE A LA MISMA HORA" sub="TEMPRANO" col="#fff" out={678.0} size={46} />);
  L.push(<BigNum key="3a5" t={t} at={683.8} text="3 A 5 CM" sub="DE HOJAS SECAS O PAJA" size={130} x={1350} y={230} out={689.8} col="#ffd84a" edge="#5a4500" />);
  L.push(<Tag key="mt" t={t} at={a("acolchado o mantillo") + 0.1} x={960} y={540} dx={-330} dy={-220} text="ACOLCHADO O MANTILLO" col="#fff" out={693.1} size={52} />);
  L.push(<Page key="p41" t={t} at={693.4} out={696.2} n={41} hl="EL MANTILLO" />);
  L.push(<Tag key="hg" t={t} at={702.6} x={960} y={500} dx={330} dy={-200} text="POR AHÍ ENTRAN LOS HONGOS" col={COL.red} out={703.8} size={50} />);
  if (t > 703.9 && t < 713.5) { const r = screenOf(t, PT.ring5); L.push(<Tag key="lb" t={t} at={a("dejale libres") + 0.3} x={r.x} y={r.y} dx={330} dy={-220} text="5 CM LIBRES DEL TALLO" col="#7dffb4" out={713.2} size={52} />); }
  L.push(<Stamp key="15" t={t} at={a("de 15 centimetros") - 0.1} text="✗ 15 CM" x={560} y={260} out={713.2} rot={-8} size={110} />);

  // ===== PASO 7 · atar, limpiar y cosechar =====
  L.push(<StepTitle key="t7" t={t} at={719.5} out={723.2} n={7} name="ATAR, LIMPIAR Y COSECHAR" />);
  if (t > 723.4 && t < 728.6) { const c = screenOf(t, PT.cane); L.push(<Tag key="va" t={t} at={a("primero la vara") + 0.2} x={c.x} y={c.y} dx={330} dy={-160} text="LA VARA, DESDE EL DÍA 1" col="#ffd84a" out={728.4} size={52} />); }
  L.push(<Rows key="r7" t={t} out={731.8} y={250} size={52} items={[{ at: 728.7, tx: "TRAPO SUAVE O MEDIA VIEJA", ok: true }, { at: a("nunca con alambre"), tx: "ALAMBRE", ok: false }]} />);
  L.push(<Tag key="qb" t={t} at={737.5} x={1000} y={520} dx={330} dy={-200} text="SE QUIEBRA CUANDO MÁS CARGA" col={COL.red} out={742.6} size={46} />);
  if (t > 742.8 && t < 746.4) { const s0 = screenOf(t, PT.sucker); L.push(<Tag key="ch" t={t} at={a("los chupones") + 0.1} x={s0.x} y={s0.y} dx={330} dy={-180} text="EL CHUPÓN" sub="EN LA AXILA" col="#ffd84a" out={746.2} size={60} />); }
  L.push(<Tag key="ot" t={t} at={753.2} x={960} y={500} dx={330} dy={-200} text="OTRA PLANTA ENCIMA DE TU PLANTA" col={COL.red} out={a("se come la fuerza") + 2.0} size={44} />);
  L.push(<BigNum key="dd" t={t} at={766.8} text="DEL TAMAÑO DE UN DEDO" sub="1 VEZ POR SEMANA · SIN TIJERA" size={84} x={1250} y={220} out={771.8} col="#7dffb4" edge="#0b3a22" />);
  L.push(<Tag key="ha" t={t} at={772.2} x={960} y={540} dx={-330} dy={-220} text="LAS HOJAS DE ABAJO, AFUERA" col="#ffd84a" out={778.8} size={48} />);
  if (t > 782.4 && t < 785.6) { const b0 = screenOf(t, PT.tr0); L.push(<Tag key="ab" t={t} at={782.6} x={b0.x} y={b0.y} dx={330} dy={-170} text="EL DE ABAJO SE LLENA" col="#b9f08a" out={785.4} size={52} />); }
  L.push(<Tag key="ro" t={t} at={a("ese rosado") + 0.1} x={960} y={500} dx={330} dy={-200} text="SE CORTAN CON EL 1er ROSADO" col="#ff9ab0" out={793.3} size={48} />);
  L.push(<Tag key="me" t={t} at={798.7} x={960} y={540} dx={-330} dy={-220} text="MADURAN EN LA MESA, SIN SOL" col="#fff" out={800.4} size={46} />);
  if (t > 800.6 && t < 804.7) { const tp = screenOf(t, PT.tr3); L.push(<Tag key="af" t={t} at={801.0} x={tp.x} y={tp.y} dx={-330} dy={140} text="TODO ROJO = LA PLANTA AFLOJA" col={COL.red} out={804.5} size={48} />); }
  L.push(<Quote key="q7" t={t} at={a("mientras mas cortas") - 0.1} out={810.4} text="MIENTRAS MÁS CORTAS, MÁS FLORECE" col="#bfffd9" y={260} size={86} />);

  // ===== si no sale a la primera =====
  L.push(<Thermo key="th2" t={t} at={815.6} x={1500} y={520} from={26} to={34} dur={2.0} out={826.6} hotAt={30} max={45} />);
  L.push(<Tag key="32b" t={t} at={a("con dias de mas de 32") + 0.1} x={1380} y={520} dx={-360} dy={-160} text="+32 °C: NINGUNA FLOR CUAJA" col={COL.red} out={826.6} size={50} />);
  L.push(<Stamp key="nc8" t={t} at={a("y no es tu", 820) + 0.4} text="NO ES TU CULPA" x={700} y={300} out={826.8} rot={-7} size={96} col="#7dffb4" />);
  L.push(<Tag key="tl" t={t} at={a("se tira a la tierra lejos") + 0.1} x={960} y={540} dx={330} dy={-220} text="LEJOS DE LAS MACETAS" sub="Y SE HACE OTRO FRASCO" col="#fff" out={840.5} size={50} />);
  L.push(<BigNum key="sem" t={t} at={a("tardan semanas") - 0.2} text="TARDA SEMANAS" sub="LO VES EN LOS RACIMOS QUE VIENEN" size={90} y={230} out={842.4} col="#ffd84a" edge="#5a4500" />);

  // ===== la cuenta =====
  if (t > 849.8 && t < 855.2) { const j = screenOf(t, PT.jar); L.push(<Tag key="$1" t={t} at={a("te cuesta las cascaras") + 0.1} x={j.x} y={j.y} dx={-330} dy={-200} text="$0" sub="CÁSCARAS + UN FRASCO QUE YA TIENES" col="#7dffb4" out={855.0} size={80} />); }
  if (t > 855.1 && t < 860.6) { const m = screenOf(t, PT.molca); L.push(<Tag key="$2" t={t} at={a("los huevos del desayuno") + 0.1} x={m.x} y={m.y} dx={-330} dy={-200} text="$0" sub="LOS HUEVOS DEL DESAYUNO" col="#7dffb4" out={860.4} size={80} />); }
  L.push(<Rows key="rv" t={t} out={870.3} y={230} size={46} items={[{ at: 864.2, tx: "ABONO PARA FLORACIÓN", ok: false }, { at: a("con calcio para la") + 0.1, tx: "FERTILIZANTE CON CALCIO", ok: false }, { at: a("una bolsa de corteza") + 0.1, tx: "BOLSA DE CORTEZA", ok: false }]} />);
  L.push(<BigNum key="gr" t={t} at={a("esto es lo mismo") - 0.1} text="LO MISMO · GRATIS" sub="CON LA MEDIDA JUSTA" size={110} y={330} out={876.0} col="#7dffb4" edge="#0b3a22" />);
  L.push(<Quote key="qc" t={t} at={a("en esta casa no hay magia") - 0.1} out={876.0} text="NO HAY MAGIA, HAY CUENTAS" col="#fff" y={620} size={70} />);

  // ===== la tarea + cierre =====
  L.push(<BigNum key="ta" t={t} at={879.6} text="TU TAREA DE ESTA SEMANA" sub="UNA SOLA" size={80} y={230} out={883.8} col="#ffd84a" edge="#5a4500" />);
  L.push(<Stopwatch key="sw7b" t={t} at={a("en siete dias tienes") - 0.1} out={889.5} x={1420} y={330} n={7} unit="DÍAS" label="TU PRIMER BALDE" />);
  L.push(<Tag key="tf" t={t} at={884.3} x={960} y={560} dx={-330} dy={-240} text="4 CÁSCARAS + FRASCO CON TELA" col="#ffd84a" out={a("en siete dias tienes") - 0.2} size={48} />);
  if (t > 895 && t < 906.2) L.push(<StepRow key="sr" t={t} ats={[895.4, 895.7, 896.0, 896.3, 896.6, 896.9, 897.2]} out={905.7} y={760} />);
  L.push(<Desc key="dsc1" t={t} at={a("te los deje escritos") - 0.2} out={905.7} second={a("te los deje escritos") + 0.6} />);
  L.push(<Fan key="fan" t={t} at={a("y la ficha completa del tomate") - 0.1} out={907.8} lift={a("y la ficha completa del tomate") + 0.6} />);
  L.push(<Desc key="dsc2" t={t} at={912.95} out={915.1} />);
  L.push(<Comment key="cm" t={t} at={915.4} out={924.3} reply={920.6} />);
  L.push(<Subscribe key="sub" t={t} at={a("suscribete", 900)} out={930.4} />);
  L.push(<Tag key="ch2" t={t} at={931.0} x={960} y={540} dx={330} dy={-220} text="LA PRÓXIMA SEMANA" sub="LOS CHILES EN MACETA" col="#ff7a5a" out={938.1} size={56} />);
  L.push(<Quote key="qf" t={t} at={a("se cuida con constancia") - 0.4} out={END} text="EL TOMATE SE CUIDA CON CONSTANCIA" col="#fff" y={330} size={92} />);
  const fade = e(t, END - 0.7, END);
  if (fade > 0) L.push(<AbsoluteFill key="fd" style={{ background: "#000", opacity: fade }} />);

  // sobre la cara del avatar no queda ninguna cola de texto: sólo las piezas del cierre que van con él
  const SOBRE_AV = new Set(["av", "sr", "dsc1", "fan", "dsc2", "cm", "sub", "ch2", "qf", "fd"]);
  const LL = wi >= 0 ? L.filter((n) => React.isValidElement(n) && SOBRE_AV.has(String(n.key))) : L;
  return <AbsoluteFill style={{ background: "#0b0d08" }}>{LL}</AbsoluteFill>;
};
