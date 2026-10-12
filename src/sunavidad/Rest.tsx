// sunavidad · 65-949 s (R6). Plan generado (plan2.json): planos ≤8 s, máx 2 usos por clip, nunca seguidos, footage ~55 % en 400-949.
// Overlays: contador N/10 al inicio de cada número, recap con la lista de 10, pregunta de cierre. Sin billetes de dólar.
import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame } from "remotion";
import { fr, Grade, Grain } from "./Base";
import { Push, Min1 } from "./Min1";
import { AvatarWins } from "./Avatar";
import { Ticket, PerKilo, Cta, ClockDeal, Clipboard } from "../repkit/Kit";

const IMG = (n: string) => `img/sunavidad/${n}.png`;
const VID = (n: string) => `broll/sunavidad/${n}.mp4`;
const Still: React.FC<{ a: number; b: number; name: string }> = ({ a, b, name }) => (
  <Sequence from={fr(a)} durationInFrames={fr(b) - fr(a)}>
    <AbsoluteFill><Push dur={b - a} src={staticFile(IMG(name))} /></AbsoluteFill><Grade /><Grain />
  </Sequence>
);
const Clip: React.FC<{ a: number; b: number; name: string }> = ({ a, b, name }) => (
  <Sequence from={fr(a)} durationInFrames={fr(b) - fr(a)}>
    <AbsoluteFill><Push dur={b - a} src={staticFile(VID(name))} vid /></AbsoluteFill><Grade /><Grain />
  </Sequence>
);
// contador "N/10 · título" arriba a la izquierda, por encima del avatar
const NumChip: React.FC<{ from: number; dur: number; txt: string }> = ({ from, dur, txt }) => {
  const [n, title] = txt.split(" · ");
  return (
    <Sequence from={fr(from)} durationInFrames={fr(dur)}>
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <div style={{ position: "absolute", left: 60, bottom: 60, background: "#C0392B", color: "#fff", fontFamily: "sans-serif", padding: "18px 34px", borderRadius: 12, boxShadow: "0 10px 30px rgba(0,0,0,0.5)", minHeight: 378, width: 1000, boxSizing: "border-box" }}>
          <div style={{ fontSize: 150, fontWeight: 900, lineHeight: 1 }}>{n}</div>
          <div style={{ fontSize: 58, fontWeight: 800, marginTop: 14 }}>{title}</div>
        </div>
      </AbsoluteFill>
    </Sequence>
  );
};
// recap 893-913: la lista de los 10 se marca a medida que se nombran
const RECAP_ITEMS = ["Góndolas en noviembre", "Packs de regalo", "Pan dulce por kilo", "Frutas secas a granel", "Sidra y el frío", "La carne de la cena", "Precios de la quincena", "Ofertas del 24", "Lo que baja el 26", "El calendario"];
const Recap: React.FC = () => {
  const f = useCurrentFrame() / 30; // segundos locales desde 893
  return (
  <Sequence from={fr(893)} durationInFrames={fr(20)}>
    <AbsoluteFill style={{ background: "rgba(0,0,0,0.55)" }}>
      <div style={{ position: "absolute", left: 120, top: 120, fontFamily: "sans-serif", color: "#fff", fontSize: 40 }}>
        {RECAP_ITEMS.map((t, i) => {
          const on = f >= i * 1.8;
          return (
            <div key={i} style={{ marginBottom: 8, fontWeight: 800, opacity: on ? 1 : 0.35 }}>
              <span style={{ color: on ? "#F4C542" : "#888" }}>{10 - i}</span> · {t}{on ? " ✓" : ""}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  </Sequence>
  );
};
// pregunta de cierre 930-936 (tarjeta de texto sobre el avatar)
const Question: React.FC = () => (
  <Sequence from={fr(930)} durationInFrames={fr(6)}>
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 160, right: 160, bottom: 110, background: "rgba(0,0,0,0.7)", color: "#fff", fontFamily: "sans-serif", fontWeight: 800, fontSize: 50, textAlign: "center", padding: "22px 30px", borderRadius: 12 }}>¿Qué no puede faltar en tu mesa de Nochebuena?</div>
    </AbsoluteFill>
  </Sequence>
);

export const Rest400: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Sequence from={0} durationInFrames={fr(65)}><Min1 /></Sequence>

    <ClockDeal from={151} dur={10} bg={IMG("n_cajas_pan_dulce")} hourFrom={11} hourTo={12} tSpin={151} tArrive={156} label="NOV → DIC · góndolas de Navidad" />
    <Ticket from={228} dur={12} bg={IMG("n_canasta_items")} head="CUENTA" lines={[
      { txt: "Sidra (ejemplo)", amt: "$ 200", t: 230 }, { txt: "Galletas (ejemplo)", amt: "$ 120", t: 232 },
      { txt: "Turrón (ejemplo)", amt: "$ 150", t: 234 }, { txt: "Nueces (ejemplo)", amt: "$ 280", t: 236 },
      { txt: "Suma", amt: "$ 750", t: 238 }, { txt: "Canasta", amt: "$ 700", t: 240 }]}
      hl={{ idx: 5, t: 242, note: "ahorraste 50" }} />
    <Cta from={300} dur={9} t={301} title="Las 40 trampas del súper" cover={IMG("n_pan_300_900")} bg={IMG("n_canasta_items")} />
    <PerKilo from={322} dur={22} tA={324} tB={326} tCalc={330} tWin={336}
      left={{ img: IMG("n_pan_300_900"), name: "pan 300 g", price: 150, grams: 300 }}
      right={{ img: IMG("n_pan_300_900"), name: "pan 900 g", price: 360, grams: 900 }}
      bg={IMG("n_pan_300_900")} />
    <Clipboard from={632} dur={12} title="PRECIOS · 2ª quincena" bg={IMG("n_planilla_precios")} lines={[
      { txt: "Arroz 1 kg", t: 634, tick: 636 }, { txt: "Aceite 1 L", t: 638, tick: 640 }, { txt: "Harina 1 kg", t: 642, tick: 644 }]} />
    <ClockDeal from={765} dur={10} bg={IMG("n_planilla_precios")} hourFrom={17} hourTo={17} tSpin={766} tArrive={770} label="17:00 · 24 DIC" />
    <Cta from={913} dur={9} t={914} title="Las 40 trampas del súper" cover={IMG("n_pan_300_900")} bg={IMG("n_cajas_pan_dulce")} />

    <Clip a={65.0} b={71.23} name="wow_camara" />
    <Clip a={87.87} b={88.03} name="xmas_cookies" />
    <Clip a={95.71} b={102.85} name="wow_muelle" />
    <Still a={102.85} b={109.98} name="l_nueces_granel_v3" />
    <Still a={109.98} b={117.11} name="s_4_precios_quincena" />
    <Clip a={126.11} b={131.42} name="sis_06" />
    <Still a={131.42} b={136.73} name="s_9_canasta" />
    <Clip a={161.0} b={166.35} name="sis_10" />
    <Clip a={177.52} b={184.89} name="wow_quesos" />
    <Still a={184.89} b={192.26} name="s_10_gondola_navidad" />
    <Still a={192.26} b={199.63} name="s_3_ofertas_24" />
    <Clip a={199.63} b={207.0} name="wow_cinta" />
    <Still a={207.0} b={214.38} name="s_8_pan_kilo" />
    <Still a={214.38} b={221.75} name="n_pan_300_900" />
    <Clip a={240.0} b={247.14} name="wow_dc" />
    <Still a={247.14} b={254.29} name="n_cajas_pan_dulce" />
    <Still a={254.29} b={261.43} name="s_5_carne_cena" />
    <Clip a={261.43} b={268.57} name="sis_04" />
    <Still a={268.57} b={275.71} name="n_granel_nueces" />
    <Clip a={287.63} b={293.13} name="f_ticket" />
    <Clip a={316.01} b={322.0} name="sis_12" />
    <Clip a={344.0} b={351.49} name="f_sierra" />
    <Still a={351.49} b={358.99} name="n_puerta_deposito" />
    <Still a={358.99} b={366.48} name="l_carniceria_v3b" />
    <Clip a={382.98} b={390.54} name="sis_11" />
    <Still a={390.54} b={398.1} name="n_planilla_precios" />
    <Still a={398.1} b={405.65} name="s_2_baja_26" />
    <Still a={405.65} b={413.21} name="n_canasta_items" />
    <Clip a={413.21} b={420.77} name="f_unload" />
    <Still a={420.77} b={428.33} name="s_7_frutas_secas" />
    <Clip a={443.45} b={450.81} name="f_conveyor" />
    <Still a={450.81} b={458.17} name="s_6_sidra_frio" />
    <Clip a={458.17} b={465.52} name="f_produce" />
    <Still a={465.52} b={472.88} name="l_pan_dia24_v3" />
    <Clip a={472.88} b={480.24} name="sis_03" />
    <Still a={480.24} b={487.59} name="s_1_calendario" />
    <Clip a={502.31} b={510.0} name="sis_08" />
    <Still a={510.0} b={517.7} name="l_planilla_v4" />
    <Clip a={517.7} b={525.4} name="sis_09" />
    <Still a={525.4} b={533.09} name="l_pan_precio_v3" />
    <Clip a={533.09} b={540.79} name="sis_01" />
    <Still a={540.79} b={548.49} name="l_calendario_v3" />
    <Clip a={557.5} b={558.15} name="sis_02" />
    <Clip a={565.93} b={571.17} name="sis_05" />
    <Still a={571.17} b={576.41} name="s_4_precios_quincena" />
    <Clip a={583.09} b={589.6} name="sis_07" />
    <Still a={589.6} b={596.11} name="s_7_frutas_secas" />
    <Clip a={596.11} b={602.63} name="f_produce2" />
    <Clip a={645.71} b={653.21} name="sis_04" />
    <Still a={653.21} b={660.72} name="s_5_carne_cena" />
    <Clip a={660.72} b={668.22} name="sis_10" />
    <Still a={668.22} b={675.72} name="l_pan_precio_v3" />
    <Clip a={675.72} b={683.22} name="f_produce2" />
    <Still a={683.22} b={690.72} name="l_planilla_v4" />
    <Clip a={706.88} b={711.97} name="f_conveyor" />
    <Clip a={718.41} b={724.89} name="f_sierra" />
    <Still a={724.89} b={731.37} name="s_8_pan_kilo" />
    <Clip a={731.37} b={737.85} name="sis_06" />
    <Still a={737.85} b={744.33} name="l_calendario_v3" />
    <Clip a={744.33} b={750.81} name="sis_12" />
    <Clip a={775.0} b={782.17} name="wow_quesos" />
    <Still a={782.17} b={789.35} name="s_1_calendario" />
    <Clip a={789.35} b={796.52} name="sis_07" />
    <Still a={796.52} b={803.7} name="n_planilla_precios" />
    <Clip a={803.7} b={810.87} name="sis_02" />
    <Clip a={822.78} b={830.58} name="sis_01" />
    <Still a={830.58} b={838.38} name="s_2_baja_26" />
    <Clip a={838.38} b={846.19} name="f_produce" />
    <Still a={846.19} b={853.99} name="l_pan_dia24_v3" />
    <Clip a={853.99} b={861.79} name="f_ticket" />
    <Still a={861.79} b={869.59} name="l_carniceria_v3b" />
    <Clip a={869.59} b={877.4} name="sis_05" />
    <Still a={877.4} b={885.2} name="n_cajas_pan_dulce" />
    <Clip a={885.2} b={893.0} name="sis_03" />
    <Clip a={922.0} b={925.81} name="f_unload" />

    <AvatarWins />
    <NumChip from={136.8} dur={4} txt="10/10 · Góndolas en noviembre" />
    <NumChip from={221.9} dur={4} txt="9/10 · Packs de regalo" />
    <NumChip from={302.75} dur={4} txt="8/10 · Pan dulce por kilo" />
    <NumChip from={366.6} dur={4} txt="7/10 · Frutas secas a granel" />
    <NumChip from={428.45} dur={4} txt="6/10 · Sidra y el frío" />
    <NumChip from={487.7} dur={4} txt="5/10 · La carne de la cena" />
    <NumChip from={618.7} dur={4} txt="4/10 · Precios de la quincena" />
    <NumChip from={690.8} dur={4} txt="3/10 · Ofertas del 24" />
    <NumChip from={750.9} dur={4} txt="2/10 · Lo que baja el 26" />
    <NumChip from={811.0} dur={4} txt="1/10 · El calendario de compras" />
    <Recap />
    <Question />
    <Grade /><Grain />
  </AbsoluteFill>
);
