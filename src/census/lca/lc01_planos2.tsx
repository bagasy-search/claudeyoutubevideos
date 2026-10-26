// lc01 · planos 30-57 (173,9 → 433,9 s): el encuentro en el lobby, POPULATION 2, la comida y el agua, lo que mata,
// las reglas de June, la casa de ladrillo, la primera nevada, −30 °F, el día 41 en el puente y el apagón.
// Vuelta 2 (ojo del director): cuerpo entero actuando con IK (PjX), componentes que llevan cada idea (lc01_planos2_comp).
import React from "react";
import { AbsoluteFill, interpolate, Sequence } from "remotion";
import { mira, useF } from "../../anikit/camara";
import { Escena } from "../../anikit/escena";
import { Globo, GranNumero, EtiquetaFlotante, Pildora, RelojDia, Temporizador, TextoMano, F_HUD, F_MANO } from "../../anikit/pantalla";
import { Halo } from "../../anikit/luz";
import { Carrito, Lata } from "../../anikit/props";
import { posRuta, Paso } from "../../anikit/actor";
import { Supermercado, SUPER_PISO } from "../../anikit/sets/super";
import { AMBAR, BORDE_CALIDO, BORDE_FRIO, JUNE, JUNE_INV, PAL, ROJO_CENSO, THEO, THEO_CASA, THEO_INV } from "../elenco";
import { FRIO, F_MONO } from "../hud";
import { Panorama } from "../mundo/panorama";
import { Superior, SUP_PISO, SUP_PUNTOS } from "../mundo/superior";
import { Puente, PUENTE_PISO } from "../mundo/puente";
import { Barrio, BARRIO_PISO, Living } from "../mundo/casa";
import { Lobby, LOBBY_DESCANSO, LOBBY_PISO, LOBBY_PUNTOS } from "../mundo/hospital";
import { Lakewood } from "../lcb/lakewood";
import { CuadernoGrande, CuadernoMano, DatoGrande, kDe, Matafuego, Vela } from "./base";
import {
  anchoLin, Barras, Casilleros, DisplaySurtidor, Ecuacion, Escalera, Escarcha, FrioEnero, HeladeraJune, HumoVisible, Icono, ikClaves, ikEscribir,
  io, lerp, Lin, Lineas, LX, listaY, ManoLapiz, MapaLago, Marcador, NaftaVieja, Olla, Pan, Pin, Pistola, PjX, RedCae, regla, REGLAS_HECHAS, tw, Vaso2, Vineta,
} from "./lc01_planos2_comp";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
// estado del living en otoño (sin nieve afuera, sin mantas, sin la nota gigante del set)
const LIV_OTONO = { hora: "dia", luces: 0, fuego: 0.6, lena: 0.15, latas: 0.6, mantas: false, plastico: false, reglas: 0, nieveAfuera: 0 };
const LIV_INV = { hora: "invierno", luces: 0, fuego: 1, lena: 0.5, latas: 1, mantas: true, plastico: true, reglas: 0, nieveAfuera: 1 };
const P = 900;
const Svg: React.FC<{ children?: React.ReactNode }> = ({ children }) => <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, overflow: "visible" }}>{children}</svg>;
const Panel: React.FC<{ x: number; y: number; w: number; h: number; o?: number }> = ({ x, y, w, h, o = 1 }) => <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 20, background: "rgba(18,15,24,0.74)", opacity: o }} />;

// ---- trazos de mano (insertos): tramos que se dibujan y la punta que viaja entre ellos ----
type Pt = [number, number];
const trazo = (pts: Pt[], u: number) => {
  const seg = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  const L = seg.reduce((a, b) => a + b, 0);
  let r = Math.max(0, Math.min(1, u)) * L;
  const out: Pt[] = [pts[0]];
  for (let i = 0; i < seg.length; i++) {
    if (r >= seg[i]) { out.push(pts[i + 1]); r -= seg[i]; continue; }
    const t = r / seg[i];
    out.push([lerp(pts[i][0], pts[i + 1][0], t), lerp(pts[i][1], pts[i + 1][1], t)]);
    break;
  }
  return { d: "M" + out.map((p) => p.join(",")).join(" L"), tip: out[out.length - 1] };
};
type Tramo = { a: number; b: number; tip: (u: number) => Pt };
const tramoLin = (l: Lin): Tramo => ({ a: l.desde, b: l.hasta, tip: (u) => [l.x + anchoLin(l) * u, l.y - l.tam * 0.3] });
const tramoPts = (pts: Pt[], a: number, b: number): Tramo => ({ a, b, tip: (u) => trazo(pts, u).tip });
// punta de la mano: dentro de un tramo sigue la línea (con temblor de escritura); entre tramos viaja levantada
const puntaMano = (ts: Tramo[], f: number, entra: Pt, sale: Pt): Pt => {
  const ent = ts[0], ult = ts[ts.length - 1];
  if (f < ent.a) { const t = io(Math.max(0, Math.min(1, (f - (ent.a - 24)) / 24))); const p = ent.tip(0); return [lerp(entra[0], p[0], t), lerp(entra[1], p[1], t)]; }
  for (let i = 0; i < ts.length; i++) {
    const s = ts[i];
    if (f <= s.b) {
      if (f >= s.a) { const p = s.tip((f - s.a) / Math.max(1, s.b - s.a)); return [p[0], p[1] + Math.sin(f * 2.1) * 3]; }
      const pr = ts[i - 1];
      const t = io((f - pr.b) / Math.max(1, s.a - pr.b));
      const p0 = pr.tip(1), p1 = s.tip(0);
      return [lerp(p0[0], p1[0], t), lerp(p0[1], p1[1], t) - Math.sin(Math.PI * t) * 30];
    }
  }
  const t = io(Math.max(0, Math.min(1, (f - ult.b) / 20)));
  const p = ult.tip(1);
  return [lerp(p[0], sale[0], t), lerp(p[1], sale[1], t)];
};

// el cuaderno del censo: el 1 tachado y el 2 dibujado a mano (P33 y P56)
const TACHA_1: Pt[] = [[1236, 612], [1356, 500]];
const DOS: Pt[] = [[1400, 524], [1414, 500], [1442, 486], [1472, 494], [1490, 520], [1480, 552], [1452, 580], [1400, 628], [1500, 628]];
const PaginaCenso: React.FC<{ uT: number; uD: number }> = ({ uT, uD }) => (
  <g>
    {uT > 0 && <path d={trazo(TACHA_1, uT).d} stroke="#d8382c" strokeWidth={13} strokeLinecap="round" fill="none" />}
    {uD > 0 && <path d={trazo(DOS, uD).d} stroke="#1d2a4a" strokeWidth={15} strokeLinecap="round" strokeLinejoin="round" fill="none" />}
  </g>
);

// aliento: bocanadas de vapor desde la boca (mundo)
const Aliento: React.FC<{ x: number; y: number; dir?: number; cada?: number; o?: number }> = ({ x, y, dir = 1, cada = 50, o = 1 }) => {
  const f = useF();
  if (o <= 0) return null;
  return (
    <g opacity={o}>
      {[0, 1].map((i) => {
        const t = ((f + i * cada * 0.5) % cada) / cada;
        if (t > 0.7) return null;
        const u = t / 0.7;
        return <circle key={i} cx={x + dir * (8 + u * 60)} cy={y - u * 26} r={6 + u * 20} fill="#eef4ff" opacity={(1 - u) * 0.55} />;
      })}
    </g>
  );
};

// ======================================================================================================
// 30 · Theo entra al lobby; June arriba de la escalera con el matafuego en las dos manos
export const P30Lobby: React.FC = () => {
  const k = kDe(173.93);
  const D = LOBBY_DESCANSO;
  const JX = D.x + 40;
  const pecho = ikClaves([{ f: 0, x: JX - 46, y: D.y - 196 }, { f: k(177.5), x: JX - 46, y: D.y - 196 }, { f: k(177.9), x: JX - 64, y: D.y - 236 }]);
  const pecho2 = ikClaves([{ f: 0, x: JX - 30, y: D.y - 176 }, { f: k(177.5), x: JX - 30, y: D.y - 176 }, { f: k(177.9), x: JX - 48, y: D.y - 214 }]);
  return (
    <Escena Set={Lobby} pal={PAL} seed={30} setProps={{ luces: 1, afuera: "noche" }}
      claves={[mira(0, 1080, 620, 0.9), mira(k(176.5), 1120, 610, 0.9), mira(k(178.2), D.x - 90, D.y - 170, 1.7, { curva: "inout" })]}
      medio={<>
        <PjX look={THEO} ruta={[{ f: 0, x: 160, y: LOBBY_PISO }, { f: k(176.0), x: 840 }]} caras={[{ f: 0, v: "duda" }, { f: k(176.0), v: "sorpresa" }, { f: k(177.7), v: "miedo" }]}
          miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(176.0), v: { x: 1, y: -0.8 } }]} brz={[{ f: k(177.7), v: { hD: 150, cD: 30, hI: 140, cI: 35 }, d: 8 }]} />
        <PjX look={JUNE} ruta={[{ f: 0, x: JX, y: D.y }]} dir={[{ f: 0, v: -1 }]} ikD={pecho} ikI={pecho2} objD={{ el: <Matafuego />, rot: 0 }}
          caras={[{ f: 0, v: "miedo" }, { f: k(177.6), v: "enojo" }]} miradas={[{ f: 0, v: { x: 1, y: 0.6 } }]} brz={[{ f: k(177.6), v: { tronco: -6 } }]} seed={2} />
      </>} />
  );
};

// 31 · la pizarra junto a la puerta: DON'T COME CLOSER. / ARE YOU SICK? (ya escrita; se subraya al decirla)
export const P31Pizarra: React.FC = () => {
  const f = useF();
  const k = kDe(178.85);
  const s1 = tw(f, k(181.6), k(182.0), 0, 1), s2 = tw(f, k(182.9), k(183.3), 0, 1);
  const B = LOBBY_PUNTOS.pizarra;
  return (
    <Escena Set={Lobby} pal={PAL} seed={31} setProps={{ luces: 1, afuera: "noche", pizarra: "DON'T COME CLOSER.\nARE YOU SICK?", trazo: 1 }}
      claves={[mira(0, 780, 590, 1.3), mira(k(180.6), 760, 590, 1.3), mira(k(181.5), 650, 500, 2.0, { curva: "inout" }), mira(k(182.8), 650, 500, 2.0), mira(k(183.9), 760, 600, 1.45, { curva: "inout" })]}
      medio={<>
        <PjX look={THEO} ruta={[{ f: 0, x: 930, y: LOBBY_PISO }, { f: k(181.7), x: 930 }, { f: k(182.2), x: 1000 }]} dir={[{ f: 0, v: -1 }]}
          caras={[{ f: 0, v: "duda" }, { f: k(181.7), v: "miedo" }, { f: k(183.0), v: "triste" }]} miradas={[{ f: 0, v: { x: 1, y: -0.5 } }, { f: k(183.1), v: { x: 1, y: 0.2 } }]}
          brz={[{ f: k(181.7), v: { hD: 120, cD: 40, hI: 110, cI: 40 }, d: 6 }, { f: k(183.0), v: { hD: 40, cD: 110, hI: 0, cI: 10 }, d: 8 }]}
          giros={[{ f: k(183.2), v: 0 }, { f: k(183.4), v: -0.5 }, { f: k(183.6), v: 0.5 }, { f: k(183.8), v: -0.4 }, { f: k(184.0), v: 0 }]} />
        {s1 > 0 && <path d={`M${B - 128},468 L${B - 128 + 262 * s1},464`} stroke="#d8382c" strokeWidth={7} strokeLinecap="round" />}
        {s2 > 0 && <path d={`M${B - 106},532 Q${B + 10},540 ${B - 106 + 218 * s2},526`} stroke="#d8382c" strokeWidth={7} strokeLinecap="round" fill="none" />}
      </>} />
  );
};

// 32 · «He's not.» Theo niega; June baja el matafuego y suelta el aire
export const P32Baja: React.FC = () => {
  const k = kDe(183.97);
  const D = LOBBY_DESCANSO;
  const JX = D.x + 40;
  const c = k(185.0);
  return (
    <Escena Set={Lobby} pal={PAL} seed={32} setProps={{ luces: 1, afuera: "noche" }}
      claves={[mira(0, 1040, 680, 2.1), mira(c, 1040, 680, 2.1), mira(c + 1, JX - 70, D.y - 150, 2.0, { curva: "inout" }), mira(k(186.7), JX - 70, D.y - 140, 2.1)]}
      medio={<>
        <PjX look={THEO} ruta={[{ f: 0, x: 1000, y: LOBBY_PISO }]} caras={[{ f: 0, v: "miedo" }, { f: k(184.5), v: "triste" }]} miradas={[{ f: 0, v: { x: 1, y: -0.7 } }]}
          brz={[{ f: 0, v: { hD: 120, cD: 40, hI: 110, cI: 40 } }, { f: k(184.3), v: { hD: 20, cD: 20, hI: 10, cI: 10 }, d: 10 }]}
          giros={[{ f: 0, v: 0 }, { f: 5, v: 0.5 }, { f: 11, v: -0.5 }, { f: 17, v: 0.45 }, { f: 23, v: -0.3 }, { f: 29, v: 0 }]} />
        <PjX look={JUNE} ruta={[{ f: 0, x: JX, y: D.y }]} dir={[{ f: 0, v: -1 }]} objD={{ el: <Matafuego />, rot: 0 }}
          ikD={ikClaves([{ f: 0, x: JX - 64, y: D.y - 236 }, { f: k(185.1), x: JX - 64, y: D.y - 236 }, { f: k(185.6), x: JX - 30, y: D.y - 112 }])}
          ikI={ikClaves([{ f: 0, x: JX - 48, y: D.y - 214 }, { f: k(185.1), x: JX - 48, y: D.y - 214 }, { f: k(185.5), x: JX - 20, y: D.y - 130, w: 0 }])}
          caras={[{ f: 0, v: "enojo" }, { f: k(185.3), v: "cansado" }, { f: k(186.2), v: "triste" }]} miradas={[{ f: 0, v: { x: 1, y: 0.7 } }, { f: k(185.6), v: { x: 1, y: 0.9 } }]}
          brz={[{ f: k(185.5), v: { tronco: 10, cabeza: 14 }, d: 14 }]} seed={2} />
      </>} />
  );
};

// 33 · el cuaderno: la mano de Theo tacha el 1 y escribe el 2; después los dos en el lobby
export const P33Dos: React.FC = () => {
  const f = useF();
  const k = kDe(186.77);
  const S = k(190.0);
  const uT = tw(f, k(187.97), k(188.25), 0, 1, (t) => t), uD = tw(f, k(189.2), k(189.85), 0, 1, (t) => t);
  const tip = puntaMano([tramoPts(TACHA_1, k(187.97), k(188.25)), tramoPts(DOS, k(189.2), k(189.85))], f, [1780, 1020], [1640, 620]);
  const g = Math.max(0, 1 - Math.abs(f - k(189.6)) / 6);
  const ks = (t: number) => k(t) - S;
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={S}>
        <CuadernoGrande renglones={[{ t: "CENSUS", desde: -999, tam: 92, x: 1130, y: 300 }, { t: "1", desde: -999, tam: 150, x: 1260, y: 470, color: "#9aa4bc" }]} zoom={[0, 1, 1]} />
        <Svg><g transform="rotate(-3 960 540)">
          <PaginaCenso uT={uT} uD={uD} />
          {g > 0 && <circle cx={1448} cy={556} r={90 + 60 * (1 - g)} fill="none" stroke={AMBAR} strokeWidth={8} opacity={g} />}
          <ManoLapiz x={tip[0]} y={tip[1]} manga="#c8582b" />
        </g></Svg>
      </Sequence>
      <Sequence from={S}>
        <Escena Set={Lobby} pal={PAL} seed={33} setProps={{ luces: 1, afuera: "noche" }} claves={[mira(0, 1160, 640, 1.35)]}
          medio={<>
            <PjX look={THEO} ruta={[{ f: 0, x: 880, y: LOBBY_PISO }]} objD={{ el: <CuadernoMano abierto />, rot: 0 }} ikD={() => ({ x: 940, y: 690 })}
              caras={[{ f: 0, v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }]} />
            <PjX look={JUNE} ruta={[{ f: 0, x: 1440, y: LOBBY_PISO }]} dir={[{ f: 0, v: -1 }]} objD={{ el: <Matafuego />, rot: 0 }} ikD={() => ({ x: 1418, y: 790 })}
              caras={[{ f: 0, v: "neutral" }, { f: ks(190.7), v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: 0.2 } }]} brz={[{ f: ks(190.6), v: { cabeza: -8 } }]} seed={2} />
          </>} />
      </Sequence>
    </AbsoluteFill>
  );
};

// 34 · las cuentas: comida primero. Entran al súper; Theo agarra el carrito y lo empuja (IK)
export const P34Super: React.FC = () => {
  const f = useF();
  const k = kDe(191.73);
  const PS = SUPER_PISO;
  const rT: Paso[] = [{ f: 0, x: -80, y: PS }, { f: k(193.6), x: 330 }, { f: k(197.0), x: 880 }];
  const tx = posRuta(rT, f).x;
  const agarra = f >= k(193.8);
  const cx = agarra ? Math.max(560, tx + 246) : 560;
  const manija = { x: cx - 186, y: PS - 222 };
  const ik = (dy: number) => (ff: number) => (ff < k(193.5) ? null : { x: manija.x, y: manija.y + dy, w: tw(ff, k(193.5), k(193.8), 0, 1) });
  return (
    <AbsoluteFill>
      <Escena Set={Supermercado} pal={PAL} seed={34} setProps={{}}
        claves={[mira(0, 380, 650, 1.2), mira(k(193.6), 460, 650, 1.2), mira(k(197.0), 1040, 650, 1.2, { curva: "inout" }), mira(k(198.2), 1040, 650, 1.2), mira(k(200.0), 1180, 620, 0.95, { curva: "inout" })]}
        medio={<>
          <Carrito x={cx} y={PS} dir={1} lleno={0} rueda={cx * 1.2} />
          <PjX look={THEO} ruta={rT} ikD={ik(0)} ikI={ik(4)} caras={[{ f: 0, v: "duda" }, { f: k(193.9), v: "determinado" }, { f: k(196.9), v: "sorpresa" }, { f: k(198.5), v: "feliz" }]}
            miradas={[{ f: 0, v: { x: 1, y: -0.3 } }, { f: k(197.2), v: { x: 1, y: -0.6 } }]} />
          <PjX look={JUNE} ruta={[{ f: 0, x: -360, y: PS }, { f: k(196.0), x: 1330 }]} dir={[{ f: 0, v: 1 }, { f: k(196.8), v: -1 }, { f: k(198.3), v: 1 }]}
            poses={[{ f: 0, v: "parado" }, { f: k(196.9), v: "celebrar" }, { f: k(198.3), v: "señalar" }]} caras={[{ f: 0, v: "neutral" }, { f: k(196.8), v: "risa" }, { f: k(198.4), v: "feliz" }]}
            miradas={[{ f: 0, v: { x: 1, y: -0.4 } }, { f: k(198.3), v: { x: 1, y: -0.5 } }]} seed={2} />
        </>} />
      <Vineta x={1560} y={300} icono="comida" rotulo="FOOD FIRST" desde={k(193.9)} hasta={k(198.2)} />
      <Vineta x={1560} y={300} icono="comida" rotulo="NOT THE PROBLEM" desde={k(198.45)} check={k(199.0)} acento="#3aa86a" />
    </AbsoluteFill>
  );
};

// 35 · la góndola: Theo carga latas (IK estante → carrito), June lee etiquetas; cada producto cae con su ícono
export const P35Gondola: React.FC = () => {
  const f = useF();
  const k = kDe(201.37);
  const PS = SUPER_PISO;
  const TX = 1050, CX = 1250;
  const drops = [202.9, 204.4, 205.9, 206.9, 207.6, 208.3, 209.1, 210.3, 211.7];
  const cl: { f: number; x: number; y: number }[] = [];
  drops.forEach((t, i) => { cl.push({ f: k(t) - 14, x: TX + 12, y: PS - 272 - (i % 2) * 96 }); cl.push({ f: k(t), x: CX - 100, y: PS - 190 }); });
  const lleva = (ff: number) => drops.some((t) => ff > k(t) - 13 && ff < k(t) - 1);
  const cargadas = drops.filter((t) => f >= k(t)).length;
  const items: [string, string, number][] = [["arroz", "RICE", 206.9], ["porotos", "BEANS", 207.6], ["pasta", "PASTA", 208.3], ["mani", "PEANUT BUTTER", 209.1], ["carne", "CANNED MEAT", 210.3]];
  const colores = ["#c0352c", "#e0a23a", "#5aa0d8", "#7fc46a", "#c8884a"];
  return (
    <AbsoluteFill>
      <Escena Set={Supermercado} pal={PAL} seed={35} setProps={{}}
        claves={[mira(0, 1200, 650, 1.25), mira(k(204.5), 1260, 640, 1.42, { curva: "inout" }), mira(k(211.9), 1260, 640, 1.42), mira(k(213.4), 1300, 630, 1.25, { curva: "inout" })]}
        medio={<>
          <Carrito x={CX} y={PS} dir={-1} lleno={Math.min(1, cargadas / 9)} />
          <PjX look={THEO} ruta={[{ f: 0, x: TX, y: PS }]} ikD={ikClaves([{ f: k(202.3), x: TX + 12, y: PS - 272 }, ...cl])} objD={(ff) => (lleva(ff) ? { el: <Lata color={colores[Math.floor(ff / 7) % 5]} />, rot: 0 } : undefined)}
            brz={drops.reduce<any[]>((acc, t) => acc.concat([{ f: k(t) - 7, v: { tronco: 16 }, d: 6 }, { f: k(t) + 2, v: { tronco: 0 }, d: 8 }]), [])}
            caras={[{ f: 0, v: "determinado" }, { f: k(212.4), v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: -0.2 } }, { f: k(212.4), v: { x: 1, y: 0.1 } }]} />
          <PjX look={JUNE} ruta={[{ f: 0, x: 1580, y: PS }]} dir={[{ f: 0, v: -1 }]} ikD={() => ({ x: 1540, y: PS - 262 })} objD={{ el: <Lata color="#c0352c" />, rot: 0 }}
            caras={[{ f: 0, v: "duda" }, { f: k(206.9), v: "feliz" }, { f: k(209.1), v: "risa" }, { f: k(210.4), v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: 0.3 } }, { f: k(212.4), v: { x: -1, y: 0 } }]}
            giros={[{ f: k(212.3), v: 0 }, { f: k(212.7), v: 0.6 }]} seed={2} />
        </>} />
      {items.map(([ic, rot, t], i) => <Vineta key={ic} x={560 + i * 220} y={300} icono={ic} rotulo={rot} desde={k(t)} hasta={k(212.15)} tam={112} rot={i % 2 ? 4 : -4} />)}
      <Panel x={640} y={180} w={640} h={190} o={tw(f, k(212.2), k(212.5), 0, 1)} />
      <GranNumero rotulo="CANS & DRY GOODS · SAFE FOR" claves={[{ f: k(212.3), v: 0 }, { f: k(212.4), v: 1 }, { f: k(213.8), v: 5, d: 30 }]} sufijo="+ YEARS" y={196} tam={84} desde={k(212.3)} color={AMBAR} />
    </AbsoluteFill>
  );
};

// 36 · 2 × 2,000 × 365 = 1,5 millones: la ecuación sobre los dos comiendo en la mesa
export const P36Calorias: React.FC = () => {
  const f = useF();
  const k = kDe(215.13);
  const para = k(219.5);
  const comer = (x0: number, plato: Pt, boca: Pt, fase: number) => {
    const cl: { f: number; x: number; y: number }[] = [];
    for (let t = fase; t < 230; t += 44) { cl.push({ f: t, x: plato[0], y: plato[1] }); cl.push({ f: t + 22, x: boca[0], y: boca[1] }); }
    const base = ikClaves(cl);
    return (ff: number) => (ff > para ? { x: boca[0] - 30 * Math.sign(x0 - plato[0]), y: boca[1] + 40 } : base(ff));
  };
  const latas = Math.min(6, 2 + Math.floor(f / 40));
  return (
    <AbsoluteFill>
      <Escena Set={Living} pal={PAL} seed={36} setProps={LIV_OTONO} claves={[mira(0, 2510, 575, 1.4), mira(k(219.3), 2510, 575, 1.4), mira(k(220.6), 2510, 600, 1.55, { curva: "inout" })]}
        medio={<>
          {Array.from({ length: latas }).map((_, i) => <Lata key={i} x={2440 + (i % 4) * 26} y={P - 170 - (i > 3 ? 40 : 0)} color="#9aa4ac" s={0.7} />)}
          <PjX look={THEO_CASA} ruta={[{ f: 0, x: 2290, y: P }]} ikD={comer(2290, [2400, P - 180], [2320, P - 252], 0)} caras={[{ f: 0, v: "feliz" }, { f: para, v: "sorpresa" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0.2 } }, { f: para, v: { x: 1, y: -0.5 } }]} />
          <PjX look={JUNE} ruta={[{ f: 0, x: 2730, y: P }]} dir={[{ f: 0, v: -1 }]} ikD={comer(2730, [2620, P - 180], [2700, P - 252], 20)} caras={[{ f: 0, v: "neutral" }, { f: para + 6, v: "risa" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0.2 } }, { f: para + 6, v: { x: 1, y: 0 } }]} seed={2} />
        </>} />
      <Ecuacion y={268} t={[k(215.3), k(216.1), k(217.7), k(219.0), k(219.2)]} />
    </AbsoluteFill>
  );
};

// 37 · desde el mirador: pines en cada súper y depósito, el contador de tiendas y la barra «no se la comen en una vida»
export const P37Ciudad: React.FC = () => {
  const f = useF();
  const k = kDe(221.69);
  const pins: [number, number, string][] = [[1080, 560, "GROCERY"], [1360, 640, "WAREHOUSE"], [1620, 560, "GROCERY"], [1880, 740, "FOOD DEPOT"], [2120, 640, "GROCERY"], [2380, 560, "SUPERMARKET"], [2640, 740, "WAREHOUSE"], [2880, 640, "GROCERY"], [3120, 560, "CASH & CARRY"]];
  const tiendas = Math.round(interpolate(f, [k(222.3), k(225.6)], [0, 34], CL));
  return (
    <AbsoluteFill>
      <Escena Set={Panorama} pal={PAL} seed={37} setProps={{ hora: "dia", luces: 0, nieve: 0, vapor: 0, ventana: 0 }}
        claves={[mira(0, 1400, 560, 0.95), mira(k(225.4), 1440, 560, 0.95, { curva: "inout" }), mira(k(226.8), 1560, 600, 0.8, { curva: "inout" })]}
        medio={<>
          {pins.map(([x, y, t], i) => <Pin key={i} x={x} y={y} txt={t} desde={k(222.3) + i * 11} s={1.6} />)}
          <PjX look={JUNE} ruta={[{ f: 0, x: 620, y: P }]} caras={[{ f: 0, v: "sorpresa" }, { f: k(226.2), v: "risa" }]} miradas={[{ f: 0, v: { x: 1, y: -0.3 } }, { f: k(226.4), v: { x: 1, y: 0 } }]}
            poses={[{ f: 0, v: "parado" }, { f: k(226.2), v: "manosCintura" }]} seed={2} />
          <PjX look={THEO} ruta={[{ f: 0, x: 820, y: P }]} poses={[{ f: 0, v: "parado" }, { f: k(222.3), v: "señalar" }, { f: k(226.0), v: "parado" }]}
            dir={[{ f: 0, v: 1 }, { f: k(226.4), v: -1 }]} caras={[{ f: 0, v: "duda" }, { f: k(222.3), v: "sorpresa" }, { f: k(226.4), v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: -0.4 } }]} />
        </>} />
      {f >= k(222.3) && <EtiquetaFlotante x={1560} y={200} rotulo="FOOD STORES IN DULUTH" claves={tiendas} color={AMBAR} tam={70} />}
      <Panel x={700} y={760} w={1120} h={210} o={tw(f, k(225.6), k(226.0), 0, 1)} />
      <Barras x={740} y={780} w={700} items={[
        { rot: "IN THE CITY", v: 1, color: AMBAR, desde: k(225.7), fin: "" },
        { rot: "2 PEOPLE", v: 0.07, color: "#8fd3ff", desde: k(227.3), fin: "ONE LIFETIME" },
      ]} />
    </AbsoluteFill>
  );
};

// 38 · lo fresco es una cuenta regresiva: pan, leche, el freezer cuando se corta la luz (carteles anclados al estante)
const PanRack: React.FC<{ x: number; moho: number; falta: boolean }> = ({ x, moho, falta }) => (
  <g>
    <rect x={x} y={P - 380} width={300} height={380} fill="#6a4a32" />
    {[P - 330, P - 230, P - 130, P - 30].map((y) => <rect key={y} x={x - 6} y={y} width={312} height={12} fill="#4a3222" />)}
    {[P - 330, P - 230, P - 130].map((y, r) => Array.from({ length: 4 }).map((_, i) => (falta && r === 1 && i === 1 ? null :
      <g key={`${r}${i}`} transform={`translate(${x + 40 + i * 72},${y})`}><path d="M-30,0 Q-32,-34 0,-36 Q32,-34 30,0 Z" fill="#d89a4a" />
        {moho > 0 && <g fill="#6a8a3a" opacity={moho}><circle cx={-12} cy={-14} r={6} /><circle cx={10} cy={-22} r={5} /><circle cx={16} cy={-8} r={4} /></g>}</g>)))}
    <rect x={x + 60} y={P - 420} width={180} height={34} rx={6} fill="#f2ece0" /><text x={x + 150} y={P - 396} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={22} fill="#6a4a32">BAKERY</text>
  </g>
);
const Lechera: React.FC<{ x: number; luz: number }> = ({ x, luz }) => (
  <g>
    <rect x={x} y={P - 440} width={250} height={440} rx={10} fill="#cfd8de" />
    <rect x={x + 16} y={P - 420} width={218} height={380} fill={luz > 0.5 ? "#dff2ff" : "#5a6470"} />
    {[P - 300, P - 180].map((y) => <rect key={y} x={x + 16} y={y} width={218} height={8} fill="#9aa4ac" />)}
    {[P - 300, P - 180, P - 48].map((y) => Array.from({ length: 4 }).map((_, i) => <g key={`${y}${i}`} transform={`translate(${x + 46 + i * 52},${y}) scale(0.55)`}><Icono n="leche" f={0} /></g>))}
    <rect x={x + 16} y={P - 420} width={218} height={380} fill="#bfe4ff" opacity={0.18} />
    <rect x={x + 222} y={P - 320} width={8} height={120} rx={4} fill="#8a949a" />
  </g>
);
const Freezer: React.FC<{ x: number; tapa: number; apestoso: number }> = ({ x, tapa, apestoso }) => {
  const f = useF();
  const hx = x + 230, hy = P - 170;
  return (
    <g>
      <rect x={x} y={hy} width={230} height={170} rx={10} fill="#e6eaee" />
      {tapa > 0.05 && <rect x={x + 10} y={hy + 6} width={210} height={30} fill="#2a3440" />}
      {tapa > 0.05 && <g transform={`translate(${x + 110},${hy + 14}) scale(0.5)`}><Icono n="carne" f={0} /></g>}
      {apestoso > 0 && [0, 1, 2].map((i) => <path key={i} d={`M${x + 70 + i * 45},${hy - 10} q-14,-20 0,-40 q14,-20 0,-40`} stroke="#8aa63a" strokeWidth={5} fill="none" opacity={apestoso * (0.5 + 0.5 * Math.sin(f / 5 + i))} transform={`translate(0,${-((f + i * 10) % 30)})`} />)}
      <rect x={x + 20} y={hy + 60} width={80} height={30} rx={4} fill="#5ab0ff" /><text x={x + 60} y={hy + 82} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={18} fill="#fff">FROZEN</text>
      <g transform={`rotate(${tapa * 100} ${hx} ${hy})`}><rect x={x - 6} y={hy - 16} width={242} height={22} rx={6} fill="#cfd6dc" /><rect x={x - 6} y={hy - 10} width={14} height={20} rx={4} fill="#8a949a" /></g>
    </g>
  );
};
const tapaBorde = (x: number, tapa: number) => { const a = (tapa * 100 * Math.PI) / 180; return { x: x + 230 - 236 * Math.cos(a), y: P - 170 - 236 * Math.sin(a) }; };
const Cartel: React.FC<{ x: number; y: number; rot: string; desde: number; hasta?: number; valor: string; color: string; sub?: string }> = ({ x, y, rot, desde, hasta = 1e9, valor, color, sub }) => {
  const f = useF();
  if (f < desde || f > hasta) return null;
  const s = tw(f, desde, desde + 10, 0, 1);
  return (
    <g transform={`translate(${x},${y}) scale(${0.6 + 0.4 * s})`} opacity={s}>
      <rect x={-118} y={-60} width={236} height={sub ? 124 : 110} rx={14} fill="#120f18" stroke={color} strokeWidth={5} />
      <text x={0} y={-24} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={24} letterSpacing={3} fill="#f6ecd2">{rot}</text>
      <text x={0} y={26} textAnchor="middle" fontFamily={F_MONO} fontWeight={800} fontSize={42} fill={color}>{valor}</text>
      {sub && <text x={0} y={54} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={18} fill="#c8bfae">{sub}</text>}
    </g>
  );
};
export const P38Fresco: React.FC = () => {
  const f = useF();
  const k = kDe(229.01);
  const PS = SUPER_PISO;
  const dP = Math.ceil(interpolate(f, [k(231.4), k(233.3)], [7, 0], CL)), dL = Math.ceil(interpolate(f, [k(233.7), k(235.4)], [14, 0], CL));
  const off = f >= k(235.7);
  const temp = Math.round(interpolate(f, [k(235.9), k(237.4)], [0, 40], CL));
  const tapa = tw(f, k(237.3), k(237.9), 0, 1);
  const tb = tapaBorde(2900, tapa);
  return (
    <AbsoluteFill>
      <Escena Set={Supermercado} pal={PAL} seed={38} setProps={{}}
        claves={[mira(0, 2380, 560 + PS - P, 0.92), mira(k(231.0), 2380, 560 + PS - P, 0.92), mira(k(231.8), 1880, 600 + PS - P, 1.45, { curva: "inout" }), mira(k(233.4), 1880, 600 + PS - P, 1.45), mira(k(234.1), 2520, 590 + PS - P, 1.45, { curva: "inout" }), mira(k(235.5), 2520, 590 + PS - P, 1.45), mira(k(236.3), 2960, 620 + PS - P, 1.55, { curva: "inout" })]}
        medio={<g transform={`translate(0,${PS - P})`}>
          <PanRack x={1740} moho={tw(f, k(232.6), k(233.3), 0, 1)} falta={f > k(231.9)} />
          <Lechera x={2400} luz={off ? 0 : 1} />
          <Freezer x={2900} tapa={tapa} apestoso={tw(f, k(237.9), k(238.4), 0, 1)} />
          <Cartel x={1890} y={P - 490} rot="BREAD" desde={k(231.2)} hasta={k(234.0)} valor={dP > 0 ? `${dP} DAYS` : "MOLD"} color={dP > 0 ? "#e0a23a" : "#8aa63a"} />
          <Cartel x={2525} y={P - 520} rot="MILK" desde={k(233.6)} hasta={k(235.8)} valor={dL > 0 ? `${dL} DAYS` : "SOUR"} color={dL > 0 ? "#f6ecd2" : "#8aa63a"} />
          <Cartel x={3015} y={P - 330} rot="FREEZER" desde={k(235.6)} valor={off ? `${temp}°F` : "0°F"} color={off ? ROJO_CENSO : "#8fd3ff"} sub={off ? "POWER OFF" : "POWER ON"} />
          <PjX look={THEO} ruta={[{ f: 0, x: 2110, y: P }]} dir={[{ f: 0, v: -1 }]} ikD={ikClaves([{ f: k(231.4), x: 2026, y: P - 240 }, { f: k(231.9), x: 2026, y: P - 240 }, { f: k(232.4), x: 2072, y: P - 262 }])}
            objD={(ff) => (ff > k(231.9) ? { el: <Pan />, rot: 0 } : undefined)} caras={[{ f: 0, v: "neutral" }, { f: k(232.3), v: "duda" }, { f: k(233.2), v: "asco" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(232.3), v: { x: 1, y: 0.5 } }]} brz={[{ f: k(233.3), v: { tronco: -12, cabeza: -10 }, d: 6 }]} />
          <PjX look={JUNE} ruta={[{ f: 0, x: 2820, y: P }, { f: k(238.3), x: 2820 }, { f: k(238.9), x: 2740 }]} dir={[{ f: 0, v: 1 }]}
            ikD={(ff) => (ff < k(236.9) ? null : ff < k(238.4) ? { x: tb.x + 4, y: tb.y - 6, w: tw(ff, k(236.9), k(237.3), 0, 1) } : null)}
            ikI={(ff) => (ff < k(238.4) ? null : { x: 2830, y: P - 255, w: tw(ff, k(238.4), k(238.7), 0, 1) })}
            caras={[{ f: 0, v: "duda" }, { f: k(236.0), v: "miedo" }, { f: k(238.2), v: "asco" }]} miradas={[{ f: 0, v: { x: 1, y: 0.3 } }]}
            brz={[{ f: k(237.0), v: { tronco: 18 }, d: 8 }, { f: k(238.3), v: { tronco: -14, cabeza: -12 }, d: 6 }]} seed={2} />
        </g>} />
    </AbsoluteFill>
  );
};

// 39 · June escribe la regla 1 en la nota de la heladera (marcador con IK, nota a escala del mundo)
export const P39Regla1: React.FC = () => {
  const k = kDe(240.61);
  const ls = [regla(0, k(242.95), k(244.25)), regla(1, k(245.0), k(245.85))];
  const JX = 3128;
  return (
    <AbsoluteFill>
      <Escena Set={Living} pal={PAL} seed={39} setProps={LIV_OTONO}
        claves={[mira(0, 3120, 600, 1.35), mira(k(241.9), 3120, 600, 1.35), mira(k(242.85), 3260, 640, 2.4, { curva: "inout" })]}
        medio={<>
          <HeladeraJune ls={ls} />
          <PjX look={JUNE} ruta={[{ f: 0, x: 2940, y: P }, { f: k(242.4), x: JX }]} ikD={ikEscribir(ls)} objD={{ el: <Marcador />, rot: -90 }}
            brz={[{ f: k(242.6), v: { tronco: 14, cabeza: 4 }, d: 10 }]} caras={[{ f: 0, v: "neutral" }, { f: k(241.9), v: "determinado" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(242.7), v: { x: 1, y: 0.3 } }]} seed={2} />
        </>} />
      <Vineta x={1640} y={360} icono="pan" rotulo="FRESH FIRST" desde={k(243.1)} rot={-4} />
      <Vineta x={1640} y={660} icono="lata" rotulo="CANS LATER" desde={k(245.1)} rot={4} />
    </AbsoluteFill>
  );
};

// 40 · el agua: el grifo de June → Lakewood (Theo sigue el caño); sin luz se paran las bombas y cae la presión
const Pileta: React.FC<{ x: number; chorro: number }> = ({ x, chorro }) => {
  const f = useF();
  const top = P - 150;
  return (
    <g>
      <rect x={x - 130} y={top} width={260} height={150} fill="#6a5a4a" /><rect x={x - 140} y={top - 14} width={280} height={18} rx={4} fill="#c8bca8" />
      {[x - 110, x + 10].map((xx) => <rect key={xx} x={xx} y={top + 24} width={100} height={110} rx={4} fill="#5a4a3e" />)}
      <path d={`M${x + 50},${top - 14} V${top - 70} Q${x + 50},${top - 92} ${x + 26},${top - 92} H${x - 6}`} stroke="#9aa4ac" strokeWidth={12} fill="none" strokeLinecap="round" />
      <rect x={x + 36} y={top - 44} width={30} height={10} rx={4} fill="#c0352c" />
      {chorro > 0.02 && <rect x={x - 10} y={top - 88} width={8 * chorro} height={78} rx={4} fill="#8fd3ff" opacity={0.85} />}
      {chorro > 0.02 && [0, 1, 2, 3].map((i) => <rect key={i} x={x - 9} y={top - 80 + ((f * 9 + i * 20) % 70)} width={5 * chorro} height={10} fill="#e6f6ff" opacity={0.8} />)}
    </g>
  );
};
const Manometro: React.FC<{ x: number; y: number; v: number; desde: number }> = ({ x, y, v, desde }) => {
  const f = useF();
  if (f < desde) return null;
  const s = tw(f, desde, desde + 10, 0, 1);
  const a = -120 + 240 * v;
  return (
    <svg style={{ position: "absolute", left: x - 130, top: y - 130, width: 260, height: 300, overflow: "visible", opacity: s }} viewBox="-130 -130 260 300">
      <circle r={118} fill="#120f18" opacity={0.8} /><circle r={100} fill="#ece6dc" stroke="#5a646c" strokeWidth={10} />
      <path d="M-70.7,70.7 A100,100 0 0 1 -86.6,-50" stroke={ROJO_CENSO} strokeWidth={14} fill="none" transform="scale(0.86)" />
      {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={-3} y={-92} width={6} height={18} fill="#3a3440" transform={`rotate(${-120 + i * 30})`} />)}
      <g transform={`rotate(${a})`}><path d="M-6,10 L0,-82 L6,10 Z" fill={ROJO_CENSO} /></g><circle r={12} fill="#2a2228" />
      <text x={0} y={150} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={26} letterSpacing={3} fill="#f6ecd2">PRESSURE</text>
    </svg>
  );
};
export const P40Agua: React.FC = () => {
  const f = useF();
  const k = kDe(246.37);
  const S = k(250.0);
  const ks = (t: number) => k(t) - S;
  const chorro = tw(f, k(247.6), k(247.9), 0, 1);
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={S}>
        <Escena Set={Living} pal={PAL} seed={40} setProps={LIV_OTONO} claves={[mira(0, 1290, 640, 1.9), mira(k(249.9), 1300, 650, 2.05)]}
          medio={<>
            <Pileta x={1300} chorro={chorro} />
            <PjX look={JUNE} ruta={[{ f: 0, x: 1236, y: P }]} ikD={ikClaves([{ f: k(247.2), x: 1352, y: P - 190 }, { f: k(247.8), x: 1350, y: P - 192 }, { f: k(248.2), x: 1300, y: P - 245, w: 0 }])}
              ikI={() => ({ x: 1296, y: P - 196 })} objI={{ el: <Vaso2 lleno={tw(f, k(247.9), k(249.6), 0.05, 0.95)} />, rot: 0 }}
              brz={[{ f: k(247.0), v: { tronco: 16 }, d: 8 }]} caras={[{ f: 0, v: "neutral" }, { f: k(248.6), v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: 0.6 } }]} seed={2} />
          </>} />
      </Sequence>
      <Sequence from={S}>
        <SeqLakewood ks={ks} />
      </Sequence>
    </AbsoluteFill>
  );
};
const SeqLakewood: React.FC<{ ks: (t: number) => number }> = ({ ks }) => {
  const f = useF();
  const fl = f < ks(256.3) ? 1 : tw(f, ks(256.3), ks(257.3), 1, 0);
  const ag = f < ks(256.3) ? 0.72 : tw(f, ks(256.4), ks(257.6), 0.72, 0);
  return (
    <AbsoluteFill>
      <Escena Set={Lakewood} pal={PAL} seed={140} setProps={{ hora: "dia", corte: 1, flujo: fl, aguja: ag, nieve: 0 }}
        claves={[mira(0, 1500, 560, 0.72), mira(ks(252.9), 1700, 560, 0.72, { curva: "inout" }), mira(ks(254.0), 2250, 620, 1.2, { curva: "inout" })]}
        medio={<PjX look={THEO} ruta={[{ f: 0, x: 1100, y: P }, { f: ks(253.3), x: 2640 }]} dir={[{ f: 0, v: 1 }, { f: ks(253.5), v: -1 }]}
          poses={[{ f: 0, v: "parado" }, { f: ks(253.7), v: "señalar" }, { f: ks(256.3), v: "encogerse" }]} caras={[{ f: 0, v: "neutral" }, { f: ks(253.7), v: "determinado" }, { f: ks(256.4), v: "miedo" }]}
          miradas={[{ f: 0, v: { x: 1, y: 0.4 } }, { f: ks(253.7), v: { x: 1, y: 0 } }, { f: ks(256.4), v: { x: 1, y: -0.3 } }]} />} />
      <Pildora texto="LAKEWOOD PUMPING STATION" x={960} y={130} desde={ks(250.3)} hasta={ks(253.6)} color={AMBAR} tam={38} />
      <Vineta x={1460} y={330} icono="rayo" rotulo="PUMPS NEED POWER" desde={ks(253.8)} apagar={ks(256.3)} />
      <Manometro x={1720} y={600} v={(ag / 0.72) * 0.75} desde={ks(254.6)} />
    </AbsoluteFill>
  );
};

// 41 · el lago de agua dulce más grande (mapa que se dibuja) → «hervila»: la olla en el anafe → agua para siempre
export const P41Lago: React.FC = () => {
  const k = kDe(258.49);
  const S = k(262.75);
  const ks = (t: number) => k(t) - S;
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={S}>
        <Escena Set={Panorama} pal={PAL} seed={41} setProps={{ hora: "dia", luces: 0, nieve: 0, vapor: 0, ventana: 0 }} claves={[mira(0, 1000, 600, 1.1), mira(S, 1040, 600, 1.15)]}
          medio={<PjX look={THEO} ruta={[{ f: 0, x: 560, y: P }, { f: k(259.6), x: 700 }]} poses={[{ f: 0, v: "parado" }, { f: k(259.9), v: "señalar" }, { f: k(261.6), v: "manosCintura" }]}
            caras={[{ f: 0, v: "neutral" }, { f: k(259.9), v: "sorpresa" }, { f: k(261.5), v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: 0.1 } }]} />} />
        <MapaLago x={1000} y={150} w={740} desde={k(259.7)} />
      </Sequence>
      <Sequence from={S}>
        <SeqHervir ks={ks} />
      </Sequence>
    </AbsoluteFill>
  );
};
const SeqHervir: React.FC<{ ks: (t: number) => number }> = ({ ks }) => {
  const f = useF();
  const hv = tw(f, ks(263.0), ks(263.5), 0, 1);
  return (
    <AbsoluteFill>
      <Escena Set={Living} pal={PAL} seed={141} setProps={LIV_OTONO} claves={[mira(0, 2380, 640, 1.85), mira(ks(265.1), 2370, 640, 1.95)]}
        medio={<>
          <g transform={`translate(2392,${P - 170})`}><rect x={-34} y={-14} width={68} height={14} rx={3} fill="#3a3440" />{hv > 0 && [-16, 0, 16].map((x) => <path key={x} d={`M${x - 5},-14 q5,-${10 + 4 * Math.sin(f / 3 + x)} 10,0 Z`} fill="#5ab0ff" />)}</g>
          <g transform={`translate(2392,${P - 184})`}><Olla f={f} hierve={hv} /></g>
          <PjX look={THEO_CASA} ruta={[{ f: 0, x: 2296, y: P }]} ikD={ikClaves([{ f: 0, x: 2346, y: P - 214 }, { f: ks(263.6), x: 2346, y: P - 214 }, { f: ks(263.9), x: 2352, y: P - 238 }])}
            objD={(ff) => (ff > ks(263.8) ? { el: <Vaso2 lleno={0.8} />, rot: 0 } : undefined)} caras={[{ f: 0, v: "determinado" }, { f: ks(263.8), v: "feliz" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0.5 } }, { f: ks(263.8), v: { x: 1, y: -0.2 } }]} />
        </>} />
      <Vineta x={1500} y={330} icono="agua" rotulo="BOIL IT" desde={ks(262.9)} check={ks(263.9)} acento="#5ab0ff" />
      <TextoMano texto="water, forever" x={1340} y={560} desde={ks(263.85)} color="#8fd3ff" tam={70} />
    </AbsoluteFill>
  );
};

// 42 · ¿qué mata de verdad a dos personas? plano y contraplano + los 4 casilleros vacíos
export const P42Mata: React.FC = () => {
  const k = kDe(265.17);
  const JX = 1260, TX = 1590;
  return (
    <AbsoluteFill>
      <Escena Set={Living} pal={PAL} seed={42} setProps={{ ...LIV_OTONO, hora: "ocaso", fuego: 0.9 }}
        claves={[mira(0, 1425, 630, 1.25), mira(k(269.4), 1425, 630, 1.25), mira(k(269.5), JX + 40, 600, 2.1, { curva: "inout" }), mira(k(273.3), JX + 40, 600, 2.1),
          mira(k(273.4), TX - 40, 600, 2.1, { curva: "inout" }), mira(k(274.8), TX - 40, 600, 2.15), mira(k(274.9), JX + 40, 600, 2.1, { curva: "inout" })]}
        medio={<>
          <PjX look={JUNE} ruta={[{ f: 0, x: JX, y: P }]} poses={[{ f: 0, v: "brazosCruzados" }, { f: k(269.5), v: "hablar" }, { f: k(272.3), v: "señalar" }, { f: k(273.5), v: "hablar" }]}
            caras={[{ f: 0, v: "neutral" }, { f: k(267.4), v: "duda" }, { f: k(269.5), v: "determinado" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }]} luz={BORDE_CALIDO} seed={2} />
          <PjX look={THEO_CASA} ruta={[{ f: 0, x: TX, y: P }]} dir={[{ f: 0, v: -1 }]} caras={[{ f: 0, v: "feliz" }, { f: k(267.5), v: "duda" }, { f: k(273.4), v: "miedo" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(273.6), v: { x: 1, y: 0.5 } }]} brz={[{ f: k(273.5), v: { cabeza: 12, hD: 30, cD: 120 }, d: 10 }]} luz={BORDE_CALIDO} />
        </>} />
      <Casilleros x={540} y={140} tam={150} desde={k(267.5)} llenos={[]} hasta={k(269.3)} />
      <Vineta x={1500} y={240} icono="cruz" rotulo="ER NURSE" desde={k(270.0)} hasta={k(273.2)} acento="#e2483a" />
      <Vineta x={1400} y={330} icono="comida" rotulo="NOT STARVATION" desde={k(273.45)} tachar={k(273.9)} hasta={k(274.8)} />
    </AbsoluteFill>
  );
};

// 43 · las cosas chicas: los casilleros se llenan (corte, tobillo, frío, muela) y Theo actúa cada una
export const P43Chicas: React.FC = () => {
  const f = useF();
  const k = kDe(275.91);
  const JX = 1260, TX = 1590;
  return (
    <AbsoluteFill>
      <Escena Set={Living} pal={PAL} seed={43} setProps={{ ...LIV_OTONO, hora: "noche", fuego: 0.9 }} claves={[mira(0, 1425, 610, 1.45), mira(k(282.1), 1440, 615, 1.55)]}
        medio={<>
          <PjX look={JUNE} ruta={[{ f: 0, x: JX, y: P }]} poses={[{ f: 0, v: "hablar" }]} caras={[{ f: 0, v: "determinado" }, { f: k(280.7), v: "triste" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }]} luz={BORDE_CALIDO} seed={2} />
          <PjX look={THEO_CASA} ruta={[{ f: 0, x: TX, y: P }, { f: k(277.6), x: TX }, { f: k(278.0), x: TX + 20 }]} dir={[{ f: 0, v: -1 }]}
            ikD={ikClaves([{ f: k(276.0), x: TX - 60, y: P - 230 }, { f: k(277.4), x: TX - 60, y: P - 230, w: 1 }, { f: k(277.6), x: TX - 30, y: P - 120, w: 0 }, { f: k(280.6), x: TX - 20, y: P - 120, w: 0 }, { f: k(280.8), x: TX - 22, y: P - 250, w: 1 }])}
            ikI={ikClaves([{ f: k(276.1), x: TX - 50, y: P - 225 }, { f: k(277.4), x: TX - 50, y: P - 225, w: 1 }, { f: k(277.6), x: TX - 20, y: P - 120, w: 0 }])}
            poses={[{ f: 0, v: "parado" }, { f: k(278.9), v: "encogerse" }, { f: k(280.5), v: "parado" }]}
            brz={[{ f: k(277.7), v: { pD: 50, rD: 70, tronco: 10 }, d: 6 }, { f: k(278.6), v: null, d: 8 }]}
            caras={[{ f: 0, v: "miedo" }, { f: k(277.7), v: "enojo" }, { f: k(278.9), v: "cansado" }, { f: k(280.7), v: "asco" }]} miradas={[{ f: 0, v: { x: 1, y: 0.5 } }, { f: k(277.7), v: { x: 1, y: 0.9 } }, { f: k(278.9), v: { x: 1, y: 0 } }]}
            luz={BORDE_CALIDO} />
          <Aliento x={TX - 20} y={P - 252} dir={-1} cada={36} o={f >= k(278.9) && f < k(280.6) ? 1 : 0} />
        </>} />
      <Casilleros x={540} y={140} tam={150} desde={-30} llenos={[{ f: k(276.0), icono: "corte", rot: "INFECTED CUT" }, { f: k(277.7), icono: "tobillo", rot: "BROKEN ANKLE" }, { f: k(278.9), icono: "frio", rot: "COLD NIGHT" }, { f: k(280.7), icono: "muela", rot: "BAD TOOTH" }]} />
    </AbsoluteFill>
  );
};

// 44 · una muela infectada puede matar · ninguno es dentista (Superior de día, carteles apagados)
export const P44Dentista: React.FC = () => {
  const k = kDe(282.21);
  const D = SUP_PUNTOS.dentista;
  return (
    <AbsoluteFill>
      <Escena Set={Superior} pal={PAL} seed={44} setProps={{ hora: "dia", luces: 0, rotulos: false }} claves={[mira(0, D - 150, 620, 1.45), mira(k(285.3), D - 150, 620, 1.45), mira(k(286.4), D - 250, 640, 1.8, { curva: "inout" })]}
        medio={<>
          <PjX look={THEO} ruta={[{ f: 0, x: D - 180, y: SUP_PISO }]} dir={[{ f: 0, v: 1 }, { f: k(285.6), v: -1 }]} ikD={ikClaves([{ f: k(282.4), x: D - 158, y: SUP_PISO - 246 }, { f: k(285.4), x: D - 158, y: SUP_PISO - 246 }, { f: k(285.7), x: D - 170, y: SUP_PISO - 120, w: 0 }])}
            caras={[{ f: 0, v: "miedo" }, { f: k(283.0), v: "asco" }, { f: k(285.6), v: "triste" }]} miradas={[{ f: 0, v: { x: 1, y: -0.4 } }, { f: k(285.6), v: { x: 1, y: 0 } }]} brz={[{ f: k(282.5), v: { cabeza: 10 }, d: 8 }]} />
          <PjX look={JUNE} ruta={[{ f: 0, x: D - 430, y: SUP_PISO }]} caras={[{ f: 0, v: "duda" }, { f: k(285.6), v: "triste" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }]}
            giros={[{ f: k(286.2), v: 0 }, { f: k(286.5), v: -0.6 }, { f: k(286.8), v: 0.6 }, { f: k(287.1), v: -0.5 }, { f: k(287.4), v: 0.4 }, { f: k(287.7), v: 0 }]} poses={[{ f: 0, v: "parado" }, { f: k(286.0), v: "brazosCruzados" }]} seed={2} />
        </>} />
      <Vineta x={1380} y={330} icono="muela" rotulo="INFECTED TOOTH" desde={k(282.6)} hasta={k(285.3)} />
      <Vineta x={1660} y={330} icono="cruz" rotulo="SEPSIS" desde={k(283.9)} hasta={k(285.3)} acento="#e2483a" />
      <GranNumero rotulo="DENTISTS LEFT · TWO PEOPLE" claves={[{ f: 0, v: 2 }, { f: k(287.6), v: 0, d: 18 }]} y={150} tam={110} desde={k(285.6)} color="#e2483a" />
    </AbsoluteFill>
  );
};

// 45 · la regla 2: nada peligroso a solas (escribe con IK; viñetas tachadas; el gag de la escalera)
export const P45Regla2: React.FC = () => {
  const f = useF();
  const k = kDe(289.61);
  const ls = [regla(0), regla(1), regla(2, k(289.75), k(290.95)), regla(3, k(291.2), k(291.85)), regla(4, k(292.15), k(292.9)), regla(5, k(293.3), k(294.15))];
  const JX = 3128;
  const baja = k(296.7);
  const rT: Paso[] = [{ f: 0, x: 2350, y: P }, { f: k(294.6), x: 2350 }, { f: k(295.8), x: 2760 }];
  return (
    <AbsoluteFill>
      <Escena Set={Living} pal={PAL} seed={45} setProps={LIV_OTONO}
        claves={[mira(0, 3260, 640, 2.4), mira(k(294.5), 3260, 640, 2.4), mira(k(295.4), 2980, 610, 1.3, { curva: "inout" }), mira(k(297.2), 2980, 610, 1.3), mira(k(297.9), JX + 130, 590, 2.2, { curva: "inout" })]}
        medio={<>
          <HeladeraJune ls={ls} />
          {f >= baja && <g transform={`translate(2800,${P})`}><Escalera /></g>}
          <PjX look={THEO_CASA} ruta={rT} objD={(ff) => (ff < baja ? { el: <Escalera />, rot: 0 } : undefined)}
            ikD={(ff) => (ff < baja - 6 ? { x: posRuta(rT, ff).x + 40, y: P - 150 } : null)}
            poses={[{ f: 0, v: "parado" }, { f: k(296.0), v: "encogerse" }]} caras={[{ f: 0, v: "feliz" }, { f: k(295.7), v: "sorpresa" }, { f: k(296.1), v: "duda" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }]} />
          <PjX look={JUNE} ruta={[{ f: 0, x: JX, y: P }]} ikD={ikEscribir(ls)} objD={{ el: <Marcador />, rot: -90 }} dir={[{ f: 0, v: 1 }, { f: k(295.2), v: -1 }]}
            poses={[{ f: 0, v: "parado" }, { f: k(295.3), v: "señalar" }, { f: k(297.3), v: "brazosCruzados" }]} brz={[{ f: 0, v: { tronco: 14, cabeza: 4 } }, { f: k(294.4), v: null, d: 10 }]}
            caras={[{ f: 0, v: "determinado" }, { f: k(295.3), v: "enojo" }, { f: k(297.4), v: "determinado" }, { f: k(298.6), v: "triste" }]} miradas={[{ f: 0, v: { x: 1, y: 0.3 } }, { f: k(295.2), v: { x: 1, y: 0 } }]} seed={2} />
        </>} />
      <Vineta x={1640} y={300} icono="escalera" rotulo="NO LADDERS" desde={k(291.3)} tachar={k(291.8)} hasta={k(294.8)} tam={130} />
      <Vineta x={1640} y={530} icono="motosierra" rotulo="NO CHAINSAWS" desde={k(292.2)} tachar={k(292.7)} hasta={k(294.8)} tam={130} />
      <Vineta x={1640} y={760} icono="hielo" rotulo="NO ICE" desde={k(293.4)} tachar={k(294.0)} hasta={k(294.8)} tam={130} />
    </AbsoluteFill>
  );
};

// 46 · «…termina con la mitad de la humanidad» → días 10-30: la mudanza a la casa de ladrillo (colchón entre los dos)
const MitadHumanidad: React.FC<{ g: number; t: number }> = ({ g, t }) => {
  const persona = (x: number, c: string, gris: number) => {
    const ch = (i: number, o: number) => Math.round(lerp(parseInt(c.slice(i, i + 2), 16), o, gris));
    const col = `rgb(${ch(1, 70)},${ch(3, 66)},${ch(5, 80)})`;
    return <g transform={`translate(${x},560)`}><circle cy={-210} r={70} fill={col} /><path d="M-90,120 Q-100,-110 0,-120 Q100,-110 90,120 Z" fill={col} /></g>;
  };
  return (
    <AbsoluteFill style={{ background: "#120f18" }}>
      <Svg>
        {persona(760, "#2f7f86", 0)}
        {persona(1160, "#c8582b", g)}
        <text x={960} y={830} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={60} letterSpacing={4} fill="#f6ecd2" opacity={t}>ONE INJURY = <tspan fill="#e2483a">HALF OF HUMANITY</tspan></text>
      </Svg>
    </AbsoluteFill>
  );
};
export const P46Casa: React.FC = () => {
  const f = useF();
  const k = kDe(299.43);
  const S = k(301.05);
  const ks = (t: number) => k(t) - S;
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={S}>
        <MitadHumanidad g={tw(f, k(299.75), k(300.2), 0, 1)} t={tw(f, k(299.9), k(300.3), 0, 1)} />
      </Sequence>
      <Sequence from={S}>
        <SeqMudanza ks={ks} />
      </Sequence>
    </AbsoluteFill>
  );
};
const SeqMudanza: React.FC<{ ks: (t: number) => number }> = ({ ks }) => {
  const f = useF();
  const rT: Paso[] = [{ f: 0, x: 3000, y: BARRIO_PISO }, { f: ks(305.0), x: 2380 }, { f: ks(308.5), x: 2380 }, { f: ks(310.4), x: 3000 }];
  const rJ: Paso[] = [{ f: 0, x: 3330, y: BARRIO_PISO }, { f: ks(305.0), x: 2710 }];
  const tx = posRuta(rT, f).x, jx = posRuta(rJ, f).x;
  const suelta = ks(305.4);
  const baja = tw(f, suelta, suelta + 12, 0, 1);
  const cy = lerp(BARRIO_PISO - 186, BARRIO_PISO - 30, baja);
  const mx0 = f < suelta ? tx + 50 : 2430, mx1 = f < suelta ? jx - 50 : 2660;
  return (
    <AbsoluteFill>
      <Escena Set={Barrio} pal={PAL} seed={46} setProps={{ hora: "dia", luces: 0, nieve: 0, humo: 0 }}
        claves={[mira(0, 2850, 560, 1.05), mira(ks(305.0), 2560, 540, 1.0, { curva: "inout" }), mira(ks(306.8), 2440, 520, 0.95, { curva: "inout" })]}
        medio={<>
          <HumoVisible x={2090} y={150} o={tw(f, ks(306.9), ks(307.6), 0, 1)} color="#6e6a7a" />
          <rect x={mx0} y={cy - 40} width={mx1 - mx0} height={80} rx={18} fill="#c9b8d8" stroke="#8a7a9a" strokeWidth={4} />
          <PjX look={THEO} ruta={rT} ikI={(ff) => (ff < suelta ? { x: posRuta(rT, ff).x + 46, y: cy } : null)}
            dir={[{ f: 0, v: -1 }, { f: ks(308.5), v: 1 }]} caras={[{ f: 0, v: "determinado" }, { f: ks(305.6), v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: ks(305.6), v: { x: 1, y: -0.6 } }]} />
          <PjX look={JUNE} ruta={rJ} ikD={(ff) => (ff < suelta ? { x: posRuta(rJ, ff).x - 46, y: cy } : null)} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "parado" }, { f: ks(305.8), v: "manosCintura" }, { f: ks(308.6), v: "saludar" }]}
            caras={[{ f: 0, v: "neutral" }, { f: ks(305.6), v: "feliz" }, { f: ks(306.9), v: "risa" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: ks(305.6), v: { x: 1, y: -0.7 } }]} seed={2} />
        </>} />
      <Vineta x={1150} y={300} icono="casa" rotulo="BRICK HOUSE" desde={ks(303.9)} check={ks(304.6)} tam={110} acento="#3aa86a" />
      <Vineta x={1345} y={300} icono="techo" rotulo="WOOD STOVE" desde={ks(307.0)} check={ks(307.5)} tam={110} acento="#3aa86a" />
      <Vineta x={1540} y={300} icono="agua" rotulo="LAKE VIEW" desde={ks(307.85)} check={ks(308.3)} tam={110} acento="#3aa86a" />
      <Vineta x={1735} y={300} icono="herramientas" rotulo="TOOLS" desde={ks(308.6)} check={ks(309.6)} tam={110} acento="#3aa86a" />
      <Pildora texto="7TH AVENUE EAST" x={960} y={140} desde={ks(304.2)} hasta={ks(306.8)} color={AMBAR} tam={34} />
    </AbsoluteFill>
  );
};

// 47 · bolsas de dormir para −30 → Theo llena dos camionetas (manguera con IK, surtidor que rueda) → la nafta se pone vieja
const Pickup: React.FC<{ x: number; color: string }> = ({ x, color }) => (
  <g>
    <ellipse cx={x + 190} cy={SUP_PISO + 4} rx={200} ry={12} fill="#000" opacity={0.3} />
    <rect x={x} y={SUP_PISO - 160} width={180} height={90} rx={6} fill={color} />
    <path d={`M${x + 176},${SUP_PISO - 70} V${SUP_PISO - 220} H${x + 290} L${x + 330},${SUP_PISO - 150} H${x + 386} V${SUP_PISO - 70} Z`} fill={color} />
    <path d={`M${x + 190},${SUP_PISO - 206} H${x + 282} L${x + 314},${SUP_PISO - 152} H${x + 190} Z`} fill="#bfe4ff" opacity={0.85} />
    <rect x={x} y={SUP_PISO - 90} width={386} height={14} fill="#2a2228" opacity={0.6} />
    <circle cx={x + 24} cy={SUP_PISO - 132} r={9} fill="#2a2228" />
    {[x + 70, x + 310].map((cx) => <g key={cx}><circle cx={cx} cy={SUP_PISO - 34} r={36} fill="#26262a" /><circle cx={cx} cy={SUP_PISO - 34} r={15} fill="#8a949a" /></g>)}
  </g>
);
export const P47Nafta: React.FC = () => {
  const k = kDe(310.5);
  const S = k(313.95);
  const ks = (t: number) => k(t) - S;
  const DF = SUP_PUNTOS.ferreteria;
  const bolsa = <g transform="translate(0,-10) scale(0.75)"><Icono n="bolsa" f={0} /></g>;
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={S}>
        <Escena Set={Superior} pal={PAL} seed={47} setProps={{ hora: "dia", luces: 0, rotulos: false }} claves={[mira(0, DF + 160, 630, 1.35), mira(S, DF + 120, 630, 1.4)]}
          medio={<PjX look={JUNE} ruta={[{ f: 0, x: DF + 300, y: SUP_PISO }, { f: k(313.4), x: DF + 90 }]} dir={[{ f: 0, v: -1 }]}
            objD={{ el: bolsa, rot: -90 }} objI={{ el: bolsa, rot: -90 }}
            brz={[{ f: 0, v: { hD: 20, cD: 70, hI: 15, cI: 75 } }]} caras={[{ f: 0, v: "determinado" }, { f: k(312.2), v: "feliz" }]} seed={2} />} />
        <Vineta x={1500} y={330} icono="bolsa" rotulo="RATED −30°F" desde={k(311.1)} acento={FRIO} />
      </Sequence>
      <Sequence from={S}>
        <SeqSurtidor ks={ks} />
      </Sequence>
    </AbsoluteFill>
  );
};
const SeqSurtidor: React.FC<{ ks: (t: number) => number }> = ({ ks }) => {
  const f = useF();
  const PS = SUP_PISO;
  const TX = 420, CAP = { x: 504, y: PS - 132 };
  const enCarga = f < ks(324.5);
  const mano = enCarga ? { x: CAP.x - 14, y: CAP.y - 4 } : { x: 330, y: PS - 200 };
  const gal = interpolate(f, [ks(314.3), ks(317.3)], [0, 26.4], CL);
  return (
    <AbsoluteFill>
      <Escena Set={Superior} pal={PAL} seed={147} setProps={{ hora: "dia", luces: 0, rotulos: true }}
        claves={[mira(0, 600, 650, 1.6), mira(ks(317.8), 600, 650, 1.6), mira(ks(318.7), 820, 600, 1.0, { curva: "inout" }), mira(ks(324.4), 820, 600, 1.0), mira(ks(325.4), 480, 650, 1.85, { curva: "inout" })]}
        medio={<>
          <Pickup x={480} color="#3a5a8a" />
          <Pickup x={1260} color="#7a2a2a" />
          <path d={`M300,${PS - 52} Q${(300 + mano.x) / 2},${PS + 10} ${mano.x},${mano.y + 10}`} stroke="#1a1a1e" strokeWidth={8} fill="none" />
          <PjX look={THEO} ruta={[{ f: 0, x: TX, y: PS }]} ikD={ikClaves([{ f: 0, x: CAP.x - 14, y: CAP.y - 4 }, { f: ks(324.5), x: CAP.x - 14, y: CAP.y - 4 }, { f: ks(325.0), x: 330, y: PS - 200 }])}
            objD={{ el: <Pistola />, rot: -90 }} caras={[{ f: 0, v: "determinado" }, { f: ks(318.4), v: "duda" }, { f: ks(321.4), v: "triste" }, { f: ks(324.7), v: "determinado" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0.3 } }, { f: ks(318.4), v: { x: 1, y: -0.4 } }, { f: ks(324.7), v: { x: 1, y: 0 } }]} brz={[{ f: 0, v: { tronco: 8 } }]} />
        </>} />
      <DisplaySurtidor x={1250} y={300} gal={gal} desde={ks(314.2)} hasta={ks(318.1)} />
      <NaftaVieja x={560} y={200} w={760} desde={ks(318.35)} t3={ks(320.3)} t12={ks(322.9)} hasta={ks(324.4)} />
      <Pildora texto="EVERY DRIVE IS A DECISION" x={1300} y={300} desde={ks(324.7)} color="#e2483a" tam={40} />
    </AbsoluteFill>
  );
};

// 48 · la lista de la heladera: lo que sólo hacían los humanos (June la escribe; cada renglón se tacha y su viñeta se apaga)
export const P48Lista: React.FC = () => {
  const k = kDe(326.52);
  const t = (s: string, i: number, a: number, b: number, tach?: number): Lin => ({ t: s, x: LX, y: listaY(i), tam: i === 0 ? 13 : 14.5, desde: k(a), hasta: k(b), color: i === 0 ? ROJO_CENSO : "#1d3a8a", tachado: tach === undefined ? undefined : k(tach), ancho: Math.min(104, s.length * (i === 0 ? 13 : 14.5) * 0.46) });
  const ls2 = [t("ONLY HUMANS DID:", 0, 329.45, 330.7), t("fix the pumps", 1, 331.5, 332.35, 336.0), t("clear the roads", 2, 332.76, 333.7, 337.0), t("treat the water", 3, 333.9, 334.85, 338.0)];
  const JX = 3262;
  return (
    <AbsoluteFill>
      <Escena Set={Living} pal={PAL} seed={48} setProps={LIV_OTONO}
        claves={[mira(0, 3080, 620, 1.3), mira(k(328.6), 3080, 620, 1.3), mira(k(329.4), 3330, 650, 2.35, { curva: "inout" }), mira(k(335.0), 3330, 650, 2.35), mira(k(335.9), 3110, 630, 1.55, { curva: "inout" })]}
        medio={<>
          <HeladeraJune ls={REGLAS_HECHAS(6)} lista ls2={ls2} />
          <PjX look={THEO_CASA} ruta={[{ f: 0, x: 2860, y: P }]} ikI={ikClaves([{ f: k(335.6), x: 2876, y: P - 232 }, { f: k(338.6), x: 2876, y: P - 232 }, { f: k(339.0), x: 2860, y: P - 120, w: 0 }])}
            caras={[{ f: 0, v: "neutral" }, { f: k(331.6), v: "duda" }, { f: k(336.0), v: "triste" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }]}
            giros={[{ f: k(335.7), v: 0 }, { f: k(336.1), v: -0.3 }, { f: k(336.6), v: 0.2 }, { f: k(337.1), v: 0 }]} />
          <PjX look={JUNE} ruta={[{ f: 0, x: 3150, y: P }, { f: k(328.0), x: 3150 }, { f: k(329.2), x: JX }, { f: k(335.5), x: JX }, { f: k(336.4), x: 3050 }]} ikD={ikEscribir(ls2)} objD={{ el: <Marcador />, rot: -90 }}
            brz={[{ f: k(329.0), v: { tronco: 14, cabeza: 4 }, d: 10 }, { f: k(335.4), v: null, d: 12 }]} dir={[{ f: 0, v: 1 }, { f: k(335.6), v: -1 }]}
            caras={[{ f: 0, v: "neutral" }, { f: k(329.4), v: "determinado" }, { f: k(336.0), v: "triste" }]} miradas={[{ f: 0, v: { x: 1, y: 0.3 } }, { f: k(335.6), v: { x: 1, y: 0 } }]} seed={2} />
        </>} />
      <Vineta x={1680} y={260} icono="bomba" rotulo="PUMPS" desde={k(331.6)} apagar={k(336.0)} tachar={k(336.3)} tam={120} />
      <Vineta x={1680} y={490} icono="quitanieve" rotulo="PLOWS" desde={k(332.85)} apagar={k(337.0)} tachar={k(337.3)} tam={120} />
      <Vineta x={1680} y={720} icono="planta" rotulo="WATER PLANT" desde={k(334.0)} apagar={k(338.0)} tachar={k(338.3)} tam={120} />
    </AbsoluteFill>
  );
};

// 49 · día 33: la primera nevada (June ataja un copo; Theo se cierra la campera; humo de la chimenea)
export const P49Nieve: React.FC = () => {
  const f = useF();
  const k = kDe(339.96);
  const JX = 1500, TX = 1120;
  const nevando = f >= k(341.1);
  const copoY = interpolate(f, [k(341.2), k(342.2)], [380, BARRIO_PISO - 214], CL);
  return (
    <AbsoluteFill>
      <Escena Set={Barrio} pal={PAL} seed={49} setProps={{ hora: "invierno", luces: 0, nieve: tw(f, k(341.1), k(347), 0, 0.25), cae: nevando, humo: 0, ventanaCasa: 1 }}
        claves={[mira(0, 1600, 560, 0.95), mira(k(344.9), 1600, 560, 0.95), mira(k(345.8), JX + 170, 590, 2.1, { curva: "inout" })]}
        medio={<>
          <HumoVisible x={2090} y={150} color="#7a7686" />
          {f >= k(341.2) && <g transform={`translate(${JX + 52 + Math.sin(f / 6) * 8 * (1 - tw(f, k(341.9), k(342.2), 0, 1))},${copoY})`} opacity={1 - tw(f, k(344.0), k(345.0), 0, 1)}>{[0, 60, 120].map((r) => <rect key={r} x={-1.5} y={-9} width={3} height={18} fill="#fff" transform={`rotate(${r})`} />)}</g>}
          <PjX look={JUNE_INV} ruta={[{ f: 0, x: JX, y: BARRIO_PISO }]} ikD={(ff) => (ff < k(340.9) ? null : { x: JX + 52, y: BARRIO_PISO - 205, w: tw(ff, k(340.9), k(341.3), 0, 1) })}
            caras={[{ f: 0, v: "neutral" }, { f: k(341.2), v: "sorpresa" }, { f: k(342.3), v: "feliz" }, { f: k(345.6), v: "determinado" }]} miradas={[{ f: 0, v: { x: 1, y: -0.2 } }, { f: k(341.2), v: { x: 0.4, y: -1 } }, { f: k(342.2), v: { x: 1, y: 0.8 } }, { f: k(345.6), v: { x: -1, y: -0.2 } }]} seed={2} />
          <PjX look={THEO_INV} ruta={[{ f: 0, x: TX, y: BARRIO_PISO }]} ikD={ikClaves([{ f: k(342.6), x: TX + 16, y: BARRIO_PISO - 130 }, { f: k(343.4), x: TX + 16, y: BARRIO_PISO - 236 }, { f: k(343.8), x: TX + 10, y: BARRIO_PISO - 120, w: 0 }])}
            poses={[{ f: 0, v: "parado" }, { f: k(343.7), v: "encogerse" }]} caras={[{ f: 0, v: "neutral" }, { f: k(341.3), v: "sorpresa" }, { f: k(343.6), v: "cansado" }]} miradas={[{ f: 0, v: { x: 0.3, y: -1 } }, { f: k(343.6), v: { x: 1, y: 0 } }]} />
          <Aliento x={TX + 22} y={BARRIO_PISO - 252} cada={60} o={nevando ? tw(f, k(343.6), k(344), 0, 1) : 0} />
        </>} />
      {f >= k(341.3) && <EtiquetaFlotante x={1620} y={250} rotulo="OUTSIDE · OCTOBER" claves={[{ f: k(341.3), v: 38 }, { f: k(343.4), v: 27, d: 40 }]} sufijo="°F" color={FRIO} tam={64} />}
    </AbsoluteFill>
  );
};

// 50 · el número que importa acá arriba: −30 → las mínimas de enero → una casa sin calor
export const P50Menos30: React.FC = () => {
  const f = useF();
  const k = kDe(347.48);
  const TX = 1650;
  return (
    <AbsoluteFill>
      <Escena Set={Puente} pal={PAL} seed={50} setProps={{ hora: "noche", luces: 1, nieve: 1, vapor: 1, cae: true, hielo: 0.6 }}
        claves={[mira(0, TX, 470, 0.8), mira(k(350.2), TX, 470, 0.8), mira(k(351.3), TX - 220, 640, 2.0, { curva: "inout" })]}
        medio={<>
          <PjX look={THEO_INV} ruta={[{ f: 0, x: TX, y: PUENTE_PISO }]} poses={[{ f: 0, v: "parado" }, { f: k(350.4), v: "encogerse" }]} caras={[{ f: 0, v: "neutral" }, { f: k(348.6), v: "miedo" }, { f: k(357.5), v: "cansado" }]}
            miradas={[{ f: 0, v: { x: 0.4, y: -1 } }, { f: k(350.4), v: { x: 1, y: 0.2 } }]} luz={BORDE_FRIO}
            ikD={(ff) => (ff < k(355.0) ? null : { x: TX + 22, y: PUENTE_PISO - 250, w: tw(ff, k(355.0), k(355.4), 0, 1) })} ikI={(ff) => (ff < k(355.0) ? null : { x: TX + 16, y: PUENTE_PISO - 244, w: tw(ff, k(355.0), k(355.4), 0, 1) })} />
          <g opacity={tw(f, k(350.4), k(352.0), 0, 1)}>{[[-26, -300], [-8, -318], [14, -312], [28, -296], [0, -330]].map(([dx, dy], i) => <circle key={i} cx={TX + dx} cy={PUENTE_PISO + dy} r={4} fill="#ffffff" />)}</g>
          <Aliento x={TX + 24} y={PUENTE_PISO - 252} cada={44} o={tw(f, k(350.4), k(351), 0, 1)} />
        </>} />
      <DatoGrande claves={[{ f: 0, v: 32 }, { f: k(348.5), v: -30, d: 40 }]} sufijo="°F" color={FRIO} rotulo="THE NUMBER THAT MATTERS UP HERE" y={150} tam={180} hasta={k(350.3)} />
      <FrioEnero x={400} y={330} desde={k(353.4)} marca={k(354.8)} hasta={k(357.3)} />
      {f >= k(357.5) && <>
        <Vineta x={560} y={480} icono="casa" rotulo="NO HEAT" desde={k(357.5)} acento={FRIO} tam={150} />
        <EtiquetaFlotante x={940} y={420} rotulo="INSIDE THE HOUSE" claves={[{ f: k(357.6), v: 65 }, { f: k(360.4), v: 12, d: 80 }]} sufijo="°F" color={FRIO} tam={80} />
      </>}
    </AbsoluteFill>
  );
};

// 51 · congelamiento en 10 minutos: el living sin estufa, la escarcha avanza por el vidrio, Theo se sopla las manos
export const P51Helada: React.FC = () => {
  const f = useF();
  const k = kDe(360.54);
  const seg = Math.max(0, 600 - Math.floor(Math.max(0, f - k(362.0)) * 3.2));
  const TX = 1300;
  const boca = { x: TX + 24, y: P - 250 };
  const sopla = (ff: number) => (ff < k(364.0) ? { x: boca.x, y: boca.y + 6 } : { x: TX + 60, y: P - 280 });
  return (
    <AbsoluteFill>
      <Escena Set={Living} pal={PAL} seed={51} setProps={{ ...LIV_INV, hora: "noche", fuego: 0, cae: true }} claves={[mira(0, 1300, 520, 1.45), mira(k(365.9), 1310, 540, 1.6)]}
        medio={<>
          <Escarcha x={1072} y={242} w={456} h={396} u={tw(f, 0, k(365.9), 0.15, 1, (t) => t)} />
          <PjX look={THEO_CASA} ruta={[{ f: 0, x: TX, y: P }]} ikD={sopla} ikI={(ff) => { const s = sopla(ff); return { x: s.x - 8, y: s.y + 8 }; }}
            poses={[{ f: 0, v: "encogerse" }]} caras={[{ f: 0, v: "miedo" }, { f: k(364.0), v: "asco" }]} miradas={[{ f: 0, v: { x: 1, y: 0.3 } }, { f: k(364.0), v: { x: 1, y: -0.2 } }]} luz={BORDE_FRIO} />
          <Aliento x={boca.x + 6} y={boca.y} cada={30} o={f < k(364.0) ? 1 : 0} />
        </>} />
      <Pildora texto="FROSTBITE AT −30°F" x={960} y={130} desde={k(361.2)} color={FRIO} tam={40} />
      <Temporizador seg={seg} x={1480} y={200} desde={k(362.0)} color={FRIO} tam={64} />
    </AbsoluteFill>
  );
};

// 52 · donde caen las cuentas: Theo le pasa el cuaderno → el gráfico a mano → los tres riesgos se juntan en una estación
export const P52Cuentas: React.FC = () => {
  const k = kDe(365.98);
  const A = k(368.1), B = k(376.1);
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={A}><SeqEntrega k={k} /></Sequence>
      <Sequence from={A} durationInFrames={B - A}><SeqGrafico k={(t) => k(t) - A} /></Sequence>
      <Sequence from={B}><SeqRiesgos k={(t) => k(t) - B} /></Sequence>
    </AbsoluteFill>
  );
};
const SENTADO = { TX: 1430, JX: 1770 };
const SeqEntrega: React.FC<{ k: (t: number) => number }> = ({ k }) => {
  const { TX, JX } = SENTADO;
  const pasa = k(367.3);
  return (
    <Escena Set={Living} pal={PAL} seed={52} setProps={{ ...LIV_INV, hora: "noche", fuego: 1 }} claves={[mira(0, 1600, 640, 1.6), mira(k(368.0), 1600, 650, 1.7)]}
      medio={<>
        <PjX look={THEO_CASA} ruta={[{ f: 0, x: TX, y: P }]} poses={[{ f: 0, v: "sentadoSuelo" }]} asiento={[{ f: 0, v: 8 }]}
          ikD={ikClaves([{ f: k(366.2), x: TX + 70, y: P - 70 }, { f: k(367.0), x: 1590, y: P - 100 }, { f: pasa, x: 1590, y: P - 100 }, { f: k(367.7), x: TX + 50, y: P - 60, w: 0 }])}
          objD={(ff) => (ff < pasa ? { el: <CuadernoMano />, rot: 0 } : undefined)} caras={[{ f: 0, v: "determinado" }]} miradas={[{ f: 0, v: { x: 1, y: 0.2 } }]} luz={BORDE_CALIDO} />
        <PjX look={JUNE} ruta={[{ f: 0, x: JX, y: P }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "sentadoSuelo" }]} asiento={[{ f: 0, v: 8 }]}
          ikD={ikClaves([{ f: k(366.9), x: 1612, y: P - 100 }, { f: pasa, x: 1612, y: P - 100 }, { f: k(367.8), x: JX - 70, y: P - 80 }])} objD={(ff) => (ff >= pasa ? { el: <CuadernoMano abierto />, rot: 0 } : undefined)}
          caras={[{ f: 0, v: "neutral" }, { f: pasa, v: "duda" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: pasa, v: { x: 1, y: 0.6 } }]} luz={BORDE_CALIDO} seed={2} />
      </>} />
  );
};
const SeqGrafico: React.FC<{ k: (t: number) => number }> = ({ k }) => {
  const f = useF();
  const titulo: Lin = { t: "2 careful people + 1 city", x: 400, y: 380, tam: 50, desde: k(368.3), hasta: k(370.0), color: "#1d2a4a", ancho: 540 };
  const anos: Lin = { t: "= YEARS", x: 480, y: 520, tam: 96, desde: k(370.4), hasta: k(371.4), color: ROJO_CENSO, ancho: 380 };
  const filas: [string, number, number, string][] = [["food", 372.52, 290, "years"], ["water", 373.28, 380, "∞"], ["shelter", 373.9, 250, "✓"], ["tools", 374.46, 230, "✓"]];
  const tr: Tramo[] = [tramoLin(titulo), tramoLin(anos)];
  const barras = filas.map(([n, t, w, fin], i) => {
    const y = 360 + i * 100;
    const lab: Lin = { t: n, x: 1000, y, tam: 44, desde: k(t) - 9, hasta: k(t), color: "#1d2a4a", ancho: n.length * 20 };
    const a = k(t) + 1, b = k(t) + 14;
    tr.push(tramoLin(lab)); tr.push({ a, b, tip: (u) => [1150 + w * u, y - 14] });
    return { lab, y, w, a, b, fin, i };
  });
  const tip = puntaMano(tr, f, [1760, 1040], [1720, 980]);
  return (
    <AbsoluteFill>
      <CuadernoGrande renglones={[]} zoom={[0, 1, 1]} />
      <Svg><g transform="rotate(-3 960 540)">
        <Lineas ls={[titulo, anos, ...barras.map((b) => b.lab)]} />
        {barras.map((b) => {
          const u = tw(f, b.a, b.b, 0, 1, (t) => t);
          if (u <= 0) return null;
          const c = b.i === 0 ? AMBAR : b.i === 1 ? "#5ab0ff" : "#3aa86a";
          return <g key={b.i}>
            <rect x={1150} y={b.y - 36} width={b.w * u} height={44} rx={6} fill={c} opacity={0.85} />
            <rect x={1150} y={b.y - 36} width={b.w * u} height={44} rx={6} fill="none" stroke="#1d2a4a" strokeWidth={3} />
            {u >= 1 && <text x={1150 + b.w + 16} y={b.y} fontFamily={F_MANO} fontWeight={700} fontSize={44} fill="#1d2a4a">{b.fin}</text>}
          </g>;
        })}
        <ManoLapiz x={tip[0]} y={tip[1]} manga="#2f7f86" />
      </g></Svg>
    </AbsoluteFill>
  );
};
const SeqRiesgos: React.FC<{ k: (t: number) => number }> = ({ k }) => {
  const f = useF();
  const { TX, JX } = SENTADO;
  const junta = tw(f, k(380.3), k(381.1), 0, 1);
  const xs = [700, 960, 1220].map((x) => lerp(x, 960 + (x - 960) * 0.62, junta));
  return (
    <AbsoluteFill>
      <Escena Set={Living} pal={PAL} seed={152} setProps={{ ...LIV_INV, hora: "noche", fuego: 1 }} claves={[mira(0, 1590, 600, 1.5), mira(k(383.2), 1590, 610, 1.6)]}
        medio={<>
          <PjX look={THEO_CASA} ruta={[{ f: 0, x: TX, y: P }]} poses={[{ f: 0, v: "sentadoSuelo" }]} asiento={[{ f: 0, v: 8 }]} caras={[{ f: 0, v: "neutral" }, { f: k(380.4), v: "triste" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0.4 } }, { f: k(380.4), v: { x: 1, y: 0 } }]} luz={BORDE_CALIDO} />
          <PjX look={JUNE} ruta={[{ f: 0, x: JX, y: P }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: "sentadoSuelo" }]} asiento={[{ f: 0, v: 8 }]} ikD={() => ({ x: JX - 70, y: P - 80 })}
            objD={{ el: <CuadernoMano abierto />, rot: 0 }} caras={[{ f: 0, v: "duda" }, { f: k(378.0), v: "determinado" }, { f: k(381.2), v: "triste" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0.6 } }, { f: k(381.0), v: { x: 1, y: 0 } }]} luz={BORDE_CALIDO} seed={2} />
        </>} />
      <Vineta x={xs[0]} y={300} icono="tobillo" rotulo="INJURY" desde={k(378.0)} acento="#e2483a" tam={130} />
      <Vineta x={xs[1]} y={300} icono="corte" rotulo="INFECTION" desde={k(378.84)} acento="#e2483a" tam={130} />
      <Vineta x={xs[2]} y={300} icono="frio" rotulo="COLD" desde={k(379.66)} acento={FRIO} tam={130} />
      {junta > 0 && <Svg><path d={`M${xs[0] - 90},420 Q${xs[0] - 90},450 ${xs[0] - 60},450 H${xs[2] + 60} Q${xs[2] + 90},450 ${xs[2] + 90},420`} stroke={FRIO} strokeWidth={6} fill="none" opacity={junta} /></Svg>}
      <TextoMano texto="one season: WINTER" x={760} y={500} desde={k(381.1)} color={FRIO} tam={64} />
    </AbsoluteFill>
  );
};

// 53 · invierno, día 41, 9:14 de la noche: Theo cruza el puente (lejos de las farolas) y mira el lago humear
export const P53Puente: React.FC = () => {
  const f = useF();
  const k = kDe(383.32);
  const TX = 1650;
  return (
    <AbsoluteFill>
      <Escena Set={Puente} pal={PAL} seed={53} setProps={{ hora: "noche", luces: 1, nieve: 1, vapor: 1, hielo: 0.3, cae: true }}
        claves={[mira(0, 1640, 500, 0.95), mira(k(387.2), 1640, 500, 0.95), mira(k(389.2), TX + 40, 620, 1.75, { curva: "inout" })]}
        medio={<>
          <PjX look={THEO_INV} ruta={[{ f: 0, x: 1420, y: PUENTE_PISO }, { f: k(386.6), x: TX }]} caras={[{ f: 0, v: "neutral" }, { f: k(390.3), v: "duda" }, { f: k(392.3), v: "sorpresa" }]}
            miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(387.4), v: { x: 1, y: 0.4 } }, { f: k(390.3), v: { x: -1, y: -0.1 } }]} dir={[{ f: 0, v: 1 }]}
            brz={[{ f: k(386.8), v: { hD: 40, cD: 60, hI: 35, cI: 65 }, d: 12 }]} luz={BORDE_FRIO} />
          <Aliento x={TX + 24} y={PUENTE_PISO - 252} cada={56} o={tw(f, k(386.8), k(387.4), 0, 1)} />
        </>} />
      <RelojDia min={21 * 60 + 14} x={1340} y={200} desde={k(384.6)} />
    </AbsoluteFill>
  );
};

// 54 · el apagón: Superior Street se apaga de golpe → farolas, carteles, el hospital, la ciudad → algo se rompió río arriba
const prendeHasta = (f: number, a: number) => (f < a ? 1 : f < a + 2 ? 0.3 : f < a + 4 ? 0.9 : 0);
const PlanoLuz: React.FC<{ tipo: "sup" | "farola" | "cartel" | "hosp" | "ciudad"; apaga: number }> = ({ tipo, apaga }) => {
  const f = useF();
  const l = prendeHasta(f, apaga);
  if (tipo === "sup") return <Escena Set={Superior} pal={PAL} seed={154} setProps={{ hora: "noche", luces: l, rotulos: l > 0.5 }} claves={[mira(0, 2100, 560, 0.75), mira(90, 2150, 560, 0.78)]} />;
  if (tipo === "farola") return <Escena Set={Puente} pal={PAL} seed={155} setProps={{ hora: "noche", luces: l, nieve: 1, vapor: 0.6, cae: true }} claves={[mira(0, 2100, 520, 1.9)]} />;
  if (tipo === "cartel") return <Escena Set={Superior} pal={PAL} seed={156} setProps={{ hora: "noche", luces: l, rotulos: l > 0.5 }} claves={[mira(0, SUP_PUNTOS.norshor, 420, 1.7)]} />;
  if (tipo === "hosp") return <Escena Set={Panorama} pal={PAL} seed={157} setProps={{ hora: "noche", luces: l, nieve: 1, vapor: 0.6, ventana: 0 }} claves={[mira(0, 2480, 560, 1.7)]} />;
  return <Escena Set={Panorama} pal={PAL} seed={158} setProps={{ hora: "noche", luces: l, nieve: 1, vapor: 0.6, ventana: 0 }} claves={[mira(0, 2300, 600, 0.62), mira(60, 2300, 600, 0.66)]} />;
};
export const P54Apagon: React.FC = () => {
  const k = kDe(392.68);
  const c = [0, k(395.8), k(396.8), k(397.6), k(398.7), k(400.55)];
  return (
    <AbsoluteFill>
      <Sequence from={c[0]} durationInFrames={c[1] - c[0]}><PlanoLuz tipo="sup" apaga={k(394.05)} /></Sequence>
      <Sequence from={c[1]} durationInFrames={c[2] - c[1]}><PlanoLuz tipo="farola" apaga={9} /></Sequence>
      <Sequence from={c[2]} durationInFrames={c[3] - c[2]}><PlanoLuz tipo="cartel" apaga={8} /></Sequence>
      <Sequence from={c[3]} durationInFrames={c[4] - c[3]}><PlanoLuz tipo="hosp" apaga={10} /></Sequence>
      <Sequence from={c[4]} durationInFrames={c[5] - c[4]}><PlanoLuz tipo="ciudad" apaga={k(399.75) - c[4]} /></Sequence>
      <Sequence from={c[5]}><SeqRio k={(t) => k(t) - c[5]} /></Sequence>
      <Sequence from={c[1]} durationInFrames={c[5] - c[1]}><Pildora texto="STREETLIGHTS · SIGNS · HOSPITAL · THE WHOLE CITY" x={960} y={950} desde={0} color="#f6ecd2" tam={30} /></Sequence>
    </AbsoluteFill>
  );
};
const SeqRio: React.FC<{ k: (t: number) => number }> = ({ k }) => {
  const TX = 1650;
  return (
    <AbsoluteFill>
      <Escena Set={Puente} pal={PAL} seed={159} setProps={{ hora: "noche", luces: 0, nieve: 1, vapor: 1, cae: true, hielo: 0.3 }} claves={[mira(0, TX, 520, 1.1), mira(k(405.6), TX - 60, 540, 1.15)]}
        medio={<PjX look={THEO_INV} ruta={[{ f: 0, x: TX, y: PUENTE_PISO }, { f: k(404.9), x: TX }, { f: k(406.2), x: TX - 300 }]}
          dir={[{ f: 0, v: 1 }, { f: k(403.1), v: -1 }]} caras={[{ f: 0, v: "miedo" }, { f: k(403.1), v: "sorpresa" }, { f: k(404.5), v: "determinado" }]}
          miradas={[{ f: 0, v: { x: 1, y: -0.2 } }, { f: k(403.1), v: { x: 1, y: -0.3 } }]} luz={BORDE_FRIO} />} />
      <RedCae x={520} y={90} desde={k(401.05)} rotura={k(403.0)} />
    </AbsoluteFill>
  );
};

// 55 · corre a casa: June ya está en la ventana con la vela (halo cálido); se abrazan
export const P55Vela: React.FC = () => {
  const f = useF();
  const k = kDe(406.26);
  const JX = 1300, TX = 1400;
  const ab = k(409.2);
  const rT: Paso[] = [{ f: 0, x: 1790, y: P }, { f: k(408.4), x: TX }];
  const w = (ff: number) => tw(ff, ab - 4, ab + 4, 0, 1);
  return (
    <AbsoluteFill>
      <Escena Set={Living} pal={PAL} seed={55} setProps={{ ...LIV_INV, hora: "noche", fuego: 0.25, cae: true }}
        claves={[mira(0, 1480, 610, 1.45), mira(k(408.2), 1380, 610, 1.6, { curva: "inout" }), mira(k(410.1), 1350, 600, 1.85, { curva: "inout" })]}
        medio={<>
          <Halo x={JX - 40} y={P - 270} r={360} color="#ffcf6e" fuerza={0.55} />
          <PjX look={THEO_INV} ruta={rT} dir={[{ f: 0, v: -1 }]} ikD={(ff) => (ff < ab - 4 ? null : { x: JX + 6, y: P - 205, w: w(ff) })} ikI={(ff) => (ff < ab - 4 ? null : { x: JX + 20, y: P - 190, w: w(ff) })}
            caras={[{ f: 0, v: "miedo" }, { f: k(408.5), v: "triste" }, { f: ab, v: "cansado" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }]} luz={BORDE_CALIDO} />
          <PjX look={JUNE_INV} ruta={[{ f: 0, x: JX, y: P }]} dir={[{ f: 0, v: -1 }, { f: k(407.4), v: 1 }]} objI={{ el: <Vela f={f} />, rot: 0 }}
            ikI={(ff) => (ff < k(407.4) ? { x: JX - 44, y: P - 236 } : { x: JX - 40, y: P - 170 })} ikD={(ff) => (ff < ab - 4 ? null : { x: TX - 10, y: P - 205, w: w(ff) })}
            caras={[{ f: 0, v: "triste" }, { f: k(407.4), v: "sorpresa" }, { f: ab, v: "triste" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }]} luz={BORDE_CALIDO} seed={2} />
        </>} />
    </AbsoluteFill>
  );
};

// 56 · no dice nada: toma el cuaderno y, bajo el 2, escribe una línea más (su mano, la vela)
export const P56Linea: React.FC = () => {
  const k = kDe(410.22);
  const S = k(412.0);
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={S}><SeqJuneVentana k={k} /></Sequence>
      <Sequence from={S}><SeqLinea k={(t) => k(t) - S} /></Sequence>
    </AbsoluteFill>
  );
};
const SeqJuneVentana: React.FC<{ k: (t: number) => number }> = ({ k }) => {
  const f = useF();
  const JX = 1300;
  return (
    <Escena Set={Living} pal={PAL} seed={56} setProps={{ ...LIV_INV, hora: "noche", fuego: 0.2, cae: true }} claves={[mira(0, JX + 20, 610, 2.3), mira(k(411.9), JX + 40, 640, 2.4)]}
      medio={<>
        <Halo x={JX + 30} y={P - 250} r={300} color="#ffcf6e" fuerza={0.55} />
        <PjX look={JUNE_INV} ruta={[{ f: 0, x: JX, y: P }]} objI={{ el: <Vela f={f} />, rot: 0 }} ikI={() => ({ x: JX + 34, y: P - 226 })}
          ikD={(ff) => (ff < k(411.4) ? null : { x: JX + 90, y: P - 150, w: tw(ff, k(411.4), k(411.9), 0, 1) })}
          caras={[{ f: 0, v: "triste" }, { f: k(411.3), v: "determinado" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(411.2), v: { x: 1, y: 0.8 } }]} brz={[{ f: k(411.4), v: { tronco: 12 }, d: 10 }]} luz={BORDE_CALIDO} seed={2} />
      </>} />
  );
};
const SeqLinea: React.FC<{ k: (t: number) => number }> = ({ k }) => {
  const f = useF();
  const l1: Lin = { t: "90 days of winter.", x: 1060, y: 730, tam: 56, desde: k(413.6), hasta: k(416.9), color: "#1d2a4a", ancho: 430 };
  const l2: Lin = { t: "No power. Two people.", x: 1060, y: 810, tam: 56, desde: k(417.3), hasta: k(419.0), color: "#1d2a4a", ancho: 500 };
  const sub = tw(f, k(419.5), k(420.3), 0, 1);
  const tip = puntaMano([tramoLin(l1), tramoLin(l2), { a: k(419.5), b: k(420.3), tip: (u) => [1060 + 500 * u, 836] }], f, [1780, 1060], [1800, 1080]);
  return (
    <AbsoluteFill>
      <CuadernoGrande renglones={[{ t: "CENSUS", desde: -999, tam: 92, x: 1130, y: 300 }, { t: "1", desde: -999, tam: 150, x: 1260, y: 470, color: "#9aa4bc" }]} zoom={[0, 1, 1]} />
      <Svg><g transform="rotate(-3 960 540)">
        <PaginaCenso uT={1} uD={1} />
        <Lineas ls={[l1, l2]} />
        {sub > 0 && <path d={`M1060,838 L${1060 + 500 * sub},834`} stroke={ROJO_CENSO} strokeWidth={6} strokeLinecap="round" />}
        <ManoLapiz x={tip[0]} y={tip[1]} manga="#2f7f86" tiembla={1} />
      </g></Svg>
    </AbsoluteFill>
  );
};

// 57 · ¿qué agarrarías primero? la casa a oscuras con la vela; Theo levanta el cuaderno; nieva fuerte; fundido lento
export const P57Cta: React.FC = () => {
  const f = useF();
  const k = kDe(421.8);
  const TX = 1690, JX = 2090;
  return (
    <AbsoluteFill>
      <Escena Set={Barrio} pal={PAL} seed={57} setProps={{ hora: "noche", luces: 0, nieve: 1, cae: true, humo: 0, ventanaCasa: 1 }}
        claves={[mira(0, 1900, 520, 0.9), mira(k(425.4), 1900, 520, 0.9), mira(k(427.6), 1900, 600, 1.12, { curva: "inout" })]}
        medio={<>
          <HumoVisible x={2090} y={150} color="#8a8698" o={0.8} />
          <Halo x={JX - 40} y={BARRIO_PISO - 180} r={300} color="#ffcf6e" fuerza={0.5} />
          <PjX look={THEO_INV} ruta={[{ f: 0, x: TX, y: BARRIO_PISO }]} objD={{ el: <CuadernoMano />, rot: 0 }}
            ikD={ikClaves([{ f: 0, x: TX + 40, y: BARRIO_PISO - 160 }, { f: k(425.5), x: TX + 40, y: BARRIO_PISO - 160 }, { f: k(426.0), x: TX + 34, y: BARRIO_PISO - 330 }])}
            caras={[{ f: 0, v: "neutral" }, { f: k(425.6), v: "determinado" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }, { f: k(425.6), v: { x: 1, y: -0.5 } }]} luz={BORDE_CALIDO} />
          <PjX look={JUNE_INV} ruta={[{ f: 0, x: JX, y: BARRIO_PISO }]} dir={[{ f: 0, v: -1 }]} objD={{ el: <Vela f={f} />, rot: 0 }} ikD={() => ({ x: JX - 40, y: BARRIO_PISO - 180 })}
            caras={[{ f: 0, v: "triste" }, { f: k(422.4), v: "duda" }, { f: k(426.0), v: "feliz" }]} miradas={[{ f: 0, v: { x: 1, y: 0 } }]} luz={BORDE_CALIDO} seed={2} />
        </>} />
      <Globo texto="WHAT WOULD YOU GRAB FIRST?" x={1150} y={440} desde={k(422.0)} hasta={k(425.5)} tam={44} cola="abajo" />
      <Pildora texto="TELL ME IN THE COMMENTS" x={960} y={140} desde={k(425.7)} hasta={k(429.9)} color={AMBAR} tam={34} />
      <Pildora texto="NEXT · CAN TWO PEOPLE SURVIVE THE FIRST WINTER?" x={960} y={140} desde={k(430.2)} color="#f6ecd2" tam={34} />
      <AbsoluteFill style={{ background: "#000", opacity: tw(f, k(432.4), k(433.95), 0, 1, (t) => t) }} />
    </AbsoluteFill>
  );
};
