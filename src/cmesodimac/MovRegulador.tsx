// MovRegulador.tsx — S4 (la prueba) · 62 s = 1860 frames @30 · EL ACTO MAS IMPORTANTE DEL VIDEO
// Espina: la corriente entra y sale IGUAL (4,1 A de los dos lados). Lo que se desploma es el
// voltaje (17,4 → 12,9). Dieciocho vatios convertidos en calor adentro de una cajita de tres dolares.
//
// ⭐ LA IDEA SE VE, NO SE EXPLICA: hay UN SOLO panel de instrumentos montado del acto 1 al acto 4.
// La fila de CORRIENTE nunca cambia de valor ni de largo de barra — ni un pixel. La fila de VOLTAJE
// cuenta 17,4 → 12,9 y su barra se derrumba al 74 %. Esa asimetria ES el argumento del video.
//
// ── TABLA DE HANDOFF ─────────────────────────────────────────────────────────────────────────
// acto | frames      | ENTRA (cam / luz / materia)                  | SALE (cam / luz / materia)
//  1   |    0 →  340 | z=+30 · amber caliente · COBRE: el cable de  | z≈+5 · amber · el cable
//      |             | MovCalor llega estirado a lo ancho y se      | sigue en pantalla mientras
//      |             | contrae hasta ser el eje de la cajita        | el mundo se va a la izq.
//  2   |  340 →  760 | z≈+5 · mundo montado a -1500 px ya alineado  | z≈-40 · amber→volt
//      |             | materia: el mismo cable, ahora del lado panel| PANTALLITA AZUL encendida
//  3   |  760 → 1160 | z≈-40 saliendo del ZOOM-THROUGH del display  | z≈-90 · volt · COBRE
//      |             | materia: el azul del display = el macro      | el cobre entra a cruzar
//  4   | 1160 → 1520 | z≈-90 tras la OCLUSION de cobre · volt       | z≈-120 · volt · las cuatro
//      |             | materia: la carcasa negra tibia (GOMA)       | perdidas sueltas en el aire
//  5   | 1520 → 1860 | z≈-120 · volt pleno · las cuatro fichas se   | z=-140 · volt · GOMA NEGRA
//      |             | ordenan en columna (MATCH-SHAPE)             | la goma cruza hacia MovDia
//
// HANDOFF DE SALIDA → MovDia: z=-140, panX -300 acumulado, luz volt, materia GOMA NEGRA (V.ink2).
// La OCLUSION arranca en f=1852 y se completa DENTRO de MovDia (que abre con at=-8): la goma
// tapa el corte y por eso la frontera entre archivos no es un fade.
//
// ── COSTURAS (5 fronteras, 4 mecanicas · NINGUNA repetida en seguidilla, NINGUNA es un fade) ──
//  1→2  f=340  MATCH-MOVE    rail de 1500 px: la camara viaja POR EL CABLE de un lado al otro.
//                            El cable vive en el plano plano, asi que no se mueve: el mundo si.
//  2→3  f=760  ZOOM-THROUGH  entramos por la pantallita azul del regulador (fx 55 / fy 45).
//  3→4  f=1160 OCLUSION      V.copper — el cable de cobre cruza el cuadro.
//  4→5  f=1520 MATCH-SHAPE   las cuatro fichas de perdida (las MISMAS instancias) dejan de flotar
//                            alrededor de la cajita y se ordenan en columna.
//  fin  f=1860 OCLUSION      V.ink2 (la goma negra del cable) — se completa en MovDia.
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, Audio, Img, staticFile } from "remotion";
import {
  V, F_DISPLAY, clamp01, lerp, eio, rgba, gcam, light,
  VoltAtmos, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Readout, SeamOcclude, zoomThrough,
  Kick, Head, Body, Num, Bed,
} from "./VoltStage";

const END = 1860;
const S12 = 340;
const S23 = 760;
const S34 = 1160;
const S45 = 1520;

const RAIL = 1500;                                // el acto 1 vive montado a -1500 px
const PCT = (px: number) => (px / 1920) * 100;

const LN = (g: number, a: number, b: number) => clamp01((g - a) / Math.max(1, b - a));
const ES = (g: number, a: number, b: number) => eio(0, 1, LN(g, a, b));
const WIN = (g: number, a: number, b: number) => Math.min(ES(g, a, a + 15), 1 - ES(g, b - 15, b));
const coma = (x: number) => x.toFixed(1).replace(".", ",");

const Titular: React.FC<{
  g: number; inF: number; outF: number; kick: string; head: string; sub?: string;
  size?: number; kickColor?: string;
}> = ({ g, inF, outF, kick, head, sub, size = 64, kickColor = V.volt }) => {
  const a = WIN(g, inF, outF);
  if (a <= 0.004) return null;
  const dy = (1 - ES(g, inF, inF + 24)) * 26;
  return (
    <div style={{
      position: "absolute", left: 78, bottom: 100, width: 820, opacity: a,
      transform: "translateY(" + dy.toFixed(1) + "px)",
    }}>
      <Bed pad={24}>
        <Kick color={kickColor}>{kick}</Kick>
        <div style={{ marginTop: 8 }}><Head size={size}>{head}</Head></div>
        {sub && <div style={{ marginTop: 10 }}><Body size={30}>{sub}</Body></div>}
      </Bed>
    </div>
  );
};

// ── ⭐ EL CABLE — UNA SOLA INSTANCIA. Llega estirado desde MovCalor (MATCH-SHAPE que cruza el
// archivo) y se contrae hasta ser el eje de la cajita. Vive en el plano plano: durante el
// MATCH-MOVE del acto 1→2 el mundo se va y EL CABLE SE QUEDA — por eso la camara "viaja por el".
const CableEje: React.FC<{ g: number }> = ({ g }) => {
  const t_a = ES(g, 0, 74);                     // llega estirado (1780 px) y se contrae
  const t_b = ES(g, S23 - 30, S23 + 40);        // se afina y se apaga al entrar en el display
  const t_c = ES(g, S34 - 20, S34 + 60);        // vuelve, ahora caliente, del lado de la bateria
  const w = lerp(lerp(1780, 980, t_a), lerp(620, 1180, t_c), t_b);
  const h = lerp(lerp(34, 20, t_a), lerp(9, 24, t_c), t_b);
  const y = lerp(lerp(548, 566, t_a), lerp(596, 560, t_c), t_b);
  const op = lerp(1, lerp(0.4, 0.95, t_c), t_b);
  const col = V.copper;
  return (
    <div style={{
      position: "absolute", left: 960 - w / 2, top: y - h / 2, width: w, height: h,
      borderRadius: h / 2, opacity: op,
      background: "linear-gradient(180deg, " + rgba(V.white, 0.3) + " 0%, " + rgba(col, 0.98)
        + " 32%, " + rgba(col, 0.55) + " 100%)",
      boxShadow: "0 0 30px " + rgba(col, 0.4) + ", 0 10px 26px rgba(0,0,0,0.7)",
      pointerEvents: "none",
    }} />
  );
};

// ── ⭐ EL PANEL DE INSTRUMENTOS — el corazon: la corriente NO se mueve, el voltaje se derrumba ──
const Instrumentos: React.FC<{ g: number }> = ({ g }) => {
  const a = WIN(g, S12 - 30, S45 - 10);
  if (a <= 0.004) return null;
  const cae = ES(g, S23 + 10, S23 + 130);
  const volt = lerp(17.4, 12.9, cae);
  const BAR = 420;
  const fila = (
    tag: string, val: string, unidad: string, frac: number, color: string, nota?: string,
  ) => (
    <div style={{ marginTop: 14 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <span style={{
          fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 23, letterSpacing: 3.2,
          color: rgba(V.white, 0.62), textTransform: "uppercase",
        }}>{tag}</span>
        <span style={{
          fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 76, lineHeight: 0.94, color,
          textShadow: "0 0 28px " + rgba(color, 0.36) + ", 0 5px 22px rgba(0,0,0,0.9)",
        }}>
          {val}<span style={{ fontSize: 30, marginLeft: 8, color: rgba(color, 0.8) }}>{unidad}</span>
        </span>
      </div>
      <div style={{
        marginTop: 8, width: BAR, height: 12, borderRadius: 6,
        background: rgba(V.ink2, 0.9), boxShadow: "inset 0 0 0 1px " + rgba(color, 0.28),
      }}>
        <div style={{
          width: Math.round(BAR * frac), height: 12, borderRadius: 6,
          background: "linear-gradient(90deg, " + rgba(color, 0.55) + ", " + rgba(color, 0.98) + ")",
          boxShadow: "0 0 20px " + rgba(color, 0.45),
        }} />
      </div>
      {nota && (
        <div style={{
          marginTop: 7, fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 21, letterSpacing: 2.6,
          color: rgba(V.volt, 0.9), textTransform: "uppercase",
        }}>{nota}</div>
      )}
    </div>
  );
  return (
    <div style={{ position: "absolute", right: 78, top: 92, width: 470, opacity: a }}>
      <Bed pad={24} w={470}>
        <Kick>LA MISMA MEDICION, LOS DOS LADOS</Kick>
        {/* la corriente: FROZEN. Ni el numero ni la barra se mueven en 50 segundos. */}
        {fila("Corriente", "4,1", "A", 1, V.volt, g > S23 + 60 ? "no se movio" : undefined)}
        {/* el voltaje: se derrumba */}
        {fila("Voltaje", coma(volt), "V", volt / 17.4, V.volt,
          g > S23 + 90 ? "se cayo 4,5 V" : undefined)}
      </Bed>
    </div>
  );
};

// ── ⭐ LAS CUATRO PERDIDAS — las MISMAS instancias: flotan sueltas (acto 4) y se ordenan (acto 5)
const PERD = [
  { ic: "img/cmesodimac/cmes_ic_regla.png", tag: "EL ANGULO", n: "14", x0: 1330, y0: 200 },
  { ic: "img/cmesodimac/cmes_ic_termometro.png", tag: "EL CALOR", n: "13", x0: 1626, y0: 430 },
  { ic: "img/cmesodimac/cmes_ic_medidor.png", tag: "EL REGULADOR", n: "18", x0: 1352, y0: 662 },
  { ic: "img/cmesodimac/cmes_ic_aire.png", tag: "CABLE Y POLVO", n: "5", x0: 1640, y0: 884 },
];

const Perdidas: React.FC<{ g: number }> = ({ g }) => {
  const a = WIN(g, S34 + 60, END + 60);
  if (a <= 0.004) return null;
  const ord = ES(g, S45 - 60, S45 + 90);      // MATCH-SHAPE: de sueltas a columna
  return (
    <div style={{ position: "absolute", inset: 0, opacity: a, pointerEvents: "none" }}>
      {PERD.map((p, i) => {
        const x = lerp(p.x0, 1180, ord);
        const y = lerp(p.y0, 214 + i * 128, ord);
        const flot = Math.sin((g + i * 37) / 34) * 6 * (1 - ord);
        return (
          <div key={p.tag} style={{
            position: "absolute", left: x - 190, top: y - 44 + flot, width: 380,
            display: "flex", alignItems: "center", gap: 16,
            padding: "12px 18px", borderRadius: 14,
            background: "linear-gradient(180deg, rgba(8,9,6,0.92), rgba(8,9,6,0.72))",
            boxShadow: "0 16px 44px rgba(0,0,0,0.6), inset 0 0 0 1px " + rgba(V.amber, 0.22),
          }}>
            <Img src={staticFile(p.ic)} style={{ width: 54, height: "auto", opacity: 0.92 }} />
            <span style={{
              fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 24, letterSpacing: 2.4,
              color: rgba(V.white, 0.74), textTransform: "uppercase", flex: 1,
            }}>{p.tag}</span>
            <span style={{
              fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 62, lineHeight: 0.9, color: V.amber,
              textShadow: "0 4px 20px rgba(0,0,0,0.9)",
            }}>{p.n}</span>
          </div>
        );
      })}
    </div>
  );
};

const Escena: React.FC<{ g: number }> = ({ g }) => {
  const cam = gcam(g, { z0: 30, z1: -140, panX: -300, panY: -26, ry: -5, rx: -2, dur: END });
  // MATCH-MOVE: el acto 1 vive a -1500 px; el rail lo trae a cuadro y despues lo suelta.
  const rail = RAIL * (1 - ES(g, S12 - 80, S12 + 30));
  const world = cam.transform + " translate3d(" + rail.toFixed(1) + "px,0,0)";

  // ZOOM-THROUGH por la pantallita azul (el rail ya vale 0 aca: coordenadas de pantalla limpias)
  const zt = zoomThrough(g, S23 - 20, 20, 55, 45);

  const key = light(ES(g, 40, END - 120), "amber", "volt");
  const keyFrom = 0.36 + 0.14 * ES(g, 0, END);
  const floor = 0.55 + 0.05 * ES(g, S34, END);

  const A1 = g < S12 + 4;
  const A2 = g >= S12 - 4 && g < S23 + 4;
  const A3 = g >= S23 - 4 && g < S34 + 6;
  const A4 = g >= S34 + 6 && g < S45 + 8;
  const A5 = g >= S45 - 8;

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
      <VoltAtmos tint={V.amber} tint2={V.volt} keyFrom={keyFrom} intensity={1} floor={floor} />

      {/* LA CAMA: el tablon con el cable de cobre, todo el movimiento */}
      <Layers cam={cam.transform}>
        <Plane z={-520}>
          <PhotoPlane src="img/cmesodimac/cmes_mv_regu5.jpg" dim={0.58} tint={V.copper} scale={1.22} />
        </Plane>
      </Layers>

      <Layers cam={world}>
        {/* ── ACTO 1 · dos pinzas, una a cada lado. El mismo numero (vive a -1500 px) ── */}
        {A1 && (
          <Plane z={-40} style={{ opacity: WIN(g, -20, S12 + 4) }}>
            <MediaCard src="broll/cmesodimac/cmes_mv_regu1.mp4" kind="video"
              w={1120} h={620} x={50 - PCT(RAIL)} y={47} z={0} ry={-5} rx={2}
              lit={0.96} litColor={key} sheenAt={50} label="UNA PINZA DE CADA LADO DE LA CAJITA" />
            <IconPng src="img/cmesodimac/cmes_ic_pinza.png"
              x={16 - PCT(RAIL)} y={70} size={132} z={140} opacity={0.92} rot={-7} />
          </Plane>
        )}

        {/* ── ACTO 2 · el tester del lado del panel: diecisiete coma cuatro ── */}
        {A2 && (
          <Plane z={-30} style={{
            opacity: WIN(g, S12 - 4, S23 + 4) * zt.opacity,
            transform: "translateZ(-30px) " + zt.out,
          }}>
            <MediaCard src="broll/cmesodimac/cmes_mv_regu2.mp4" kind="video"
              w={1060} h={600} x={55} y={45} z={0} ry={6} rx={-2}
              lit={0.96} litColor={key} sheenAt={S12 + 40} label="EL TESTER · LADO PANEL" />
            <IconPng src="img/cmesodimac/cmes_ic_tester.png" x={17} y={30} size={126} z={150} opacity={0.9} rot={8} />
          </Plane>
        )}

        {/* ── ACTO 3 · el macro del display, del lado de la bateria: doce coma nueve ── */}
        {A3 && (
          <Plane z={-40} style={{ opacity: WIN(g, S23 - 4, S34 + 6) }}>
            <MediaCard src="img/cmesodimac/cmes_mv_regu3.jpg" kind="photo"
              w={1180} h={660} x={46} y={46} z={0} ry={-7} rx={2.4}
              lit={1} litColor={key} sheenAt={S23 + 44} label="LA PANTALLITA · LADO BATERIA" />
          </Plane>
        )}

        {/* ── ACTO 4 · la carcasa tibia: dieciocho vatios adentro de tres dolares ── */}
        {A4 && (
          <Plane z={-30} style={{ opacity: WIN(g, S34 + 6, S45 + 8) }}>
            <MediaCard src="broll/cmesodimac/cmes_mv_regu4.mp4" kind="video"
              w={900} h={520} x={31} y={44} z={0} ry={8} rx={-2.2}
              lit={0.9} litColor={key} sheenAt={S34 + 44} label="LA CAJITA, TIBIA AL TACTO" />
            <IconPng src="img/cmesodimac/cmes_ic_humo.png" x={31} y={16} size={104} z={160} opacity={0.55} rot={-6} glow={V.amber} />
          </Plane>
        )}

        {/* ── ACTO 5 · la suma: cien menos cuarenta y siete ── */}
        {A5 && (
          <Plane z={-40} style={{ opacity: WIN(g, S45 - 8, END + 60) }}>
            <MediaCard src="img/cmesodimac/cmes_mv_regu5.jpg" kind="photo"
              w={760} h={440} x={26} y={72} z={0} ry={9} rx={-2.6}
              lit={0.8} litColor={key} sheenAt={S45 + 40} label="LOS CUATRO ESTAN EN LA FISICA" />
          </Plane>
        )}
      </Layers>

      {/* ── COSTURAS ── */}
      <SeamOcclude at={S34 - 8} dur={16} color={V.copper} angle={8} />
      {/* la goma negra arranca aca y TERMINA de cruzar dentro de MovDia (que abre con at=-8) */}
      <SeamOcclude at={END - 8} dur={16} color={V.ink2} angle={11} />

      {/* ── PLANO PLANO: el cable, los instrumentos, las cifras y el texto (safe area 60 px) ── */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <CableEje g={g} />

        {/* acto 1 — la unica idea: 4,1 A de los dos lados. El MISMO numero, dos veces. */}
        {g >= 74 && g < S12 - 34 && (
          <div style={{ opacity: WIN(g, 74, S12 - 34) }}>
            <Readout value="4,1" unit="A" label="entra" at={92} x={23} y={24} size={128} color={V.volt} />
            <Readout value="4,1" unit="A" label="sale" at={128} x={77} y={24} size={128} color={V.volt} />
          </div>
        )}
        <Titular g={g} inF={30} outF={S12 - 8} kick="DE LOS DOS LADOS"
          head="CUATRO COMA UNO. IGUAL." sub="La corriente entro y salio identica. No se pierde ahi." />

        {/* ⭐ el panel de instrumentos: vive del acto 1 al 4 y NO se remonta */}
        <Instrumentos g={g} />

        {/* acto 2 — lo que entra */}
        <Titular g={g} inF={S12 + 26} outF={S23 - 12} kick="ENTRA, DEL LADO DEL PANEL"
          head="DIECISIETE COMA CUATRO" sub="El punto bueno del panel. Ahi da lo que puede dar." />

        {/* acto 3 — lo que sale: el voltaje es lo unico que se movio */}
        <Titular g={g} inF={S23 + 24} outF={S34 - 12} kick="SALE, DEL LADO DE LA BATERIA"
          head="DOCE COMA NUEVE" size={62}
          sub="Arrastra al panel hasta el voltaje que la bateria tenga en ese momento." />

        {/* acto 4 — LA CIFRA: 18 vatios en calor */}
        {g >= S34 + 24 && g < S45 + 10 && (
          <div style={{
            position: "absolute", left: 92, top: 168, opacity: WIN(g, S34 + 24, S45 + 10),
            transform: "translateY(" + lerp(-40, 0, ES(g, S34 + 30, S34 + 110)).toFixed(1) + "px)",
          }}>
            <Bed pad={26} w={600}>
              <Kick color={V.amber}>DENTRO DE UNA CAJITA DE TRES DOLARES</Kick>
              <div style={{ marginTop: 10, display: "flex", alignItems: "baseline", gap: 16 }}>
                <Num size={200} color={V.amber}>18</Num>
                <Head size={44} color={V.amber}>vatios</Head>
              </div>
              <div style={{ marginTop: 8 }}><Body size={29}>Ese regulador no transforma nada: abre y cierra un interruptor.</Body></div>
            </Bed>
          </div>
        )}

        {/* ⭐ las cuatro perdidas: sueltas en el acto 4, en columna en el acto 5 */}
        <Perdidas g={g} />

        {/* acto 5 — LA SUMA: el 100 en amber, el 53 en volt. Nunca del mismo color. */}
        {g >= S45 + 20 && (
          <div style={{ position: "absolute", left: 86, top: 150, width: 640, opacity: WIN(g, S45 + 20, END + 60) }}>
            <Bed pad={28} w={640}>
              <Kick color={V.amber}>LO QUE DICE LA TAPA</Kick>
              <Num size={128} color={V.amber}>100</Num>
              <div style={{ marginTop: 14, height: 2, background: rgba(V.white, 0.22) }} />
              <div style={{ marginTop: 12 }}>
                <Head size={46} color={V.bone}>menos 47 medidos</Head>
              </div>
              <div style={{ marginTop: 16 }}>
                <Kick>LO QUE DA LA PINZA</Kick>
                <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
                  <Num size={196} color={V.volt}>53</Num>
                  <Head size={44} color={V.volt}>vatios</Head>
                </div>
              </div>
            </Bed>
          </div>
        )}
        <Titular g={g} inF={S45 + 40} outF={END - 6} kick="NINGUNO ES UNA ESTAFA"
          head="ESTAN EN LA FISICA. NO EN LA TAPA." size={52}
          sub="Los cuatro figuran en el manual de ocho paginas. La tapa tiene la foto de la casa." />
      </AbsoluteFill>

      {/* ── SFX (4: es el movimiento largo) ── */}
      <Sequence from={90} durationInFrames={40} layout="none">
        <Audio src={staticFile("sfx/digit_tick.mp3")} volume={0.42} />
      </Sequence>
      <Sequence from={S12 - 76} durationInFrames={60} layout="none">
        <Audio src={staticFile("sfx/sfx_whoosh_soft.mp3")} volume={0.34} />
      </Sequence>
      <Sequence from={S23 - 22} durationInFrames={48} layout="none">
        <Audio src={staticFile("sfx/cam_zoom_punch.mp3")} volume={0.38} />
      </Sequence>
      <Sequence from={S45 + 24} durationInFrames={90} layout="none">
        <Audio src={staticFile("sfx/counter_up.mp3")} volume={0.3} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const MovRegulador: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  void acto;
  const localF = useCurrentFrame();
  const off = Math.round(localF - gFrame);
  const g = Math.max(0, Math.min(END, gFrame));
  return (
    <Sequence from={off} layout="none">
      <Escena g={g} />
    </Sequence>
  );
};
