// alpintura · escenas héroe (Claude, 13-oct-2026). Cada escena: a = segundo de entrada, d = duración en segundos.
// Todos los tiempos de las props son segundos ABSOLUTOS de la voz (words.json). Nunca sobre la cara de Claudio:
// las escenas caen en huecos sin ventana AV; los textos van abajo o a un costado.
import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { SERIF, LABEL, HAND, fr, cl, ez, lin, img, C, Grade, Grain, Mark, Print, Chip, Bed, Stage, sp } from "./Base";

const useT = (a: number) => { const f = useCurrentFrame(); return { f, at: (t: number) => fr(t) - fr(a) }; };
const note: React.CSSProperties = { position: "absolute", background: "#FFF9E8", color: C.ink, fontFamily: HAND, fontSize: 64, padding: "10px 28px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.35)", transform: "rotate(-2deg)" };
const shade: React.CSSProperties = { position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.0) 60%, rgba(0,0,0,0.55) 100%)" };

// 1) SheetPeel (hueco 88,6-116,5 s): fachada borrosa, la lámina en la mano, círculo sobre el polvo, nota "1 AÑO"
export const SheetPeel: React.FC<{ a: number; d: number }> = ({ a, d }) => {
  const { f, at } = useT(a);
  return (
    <AbsoluteFill>
      <Bed k="n_facade_full" f={f} T={fr(d)} dim={0.5} />
      <Stage f={f} T={fr(d)} push={[0.55, 0.42, 1.18]}>
        <div style={{ position: "absolute", left: 980, top: 300, transform: `scale(${lin(f, 0, fr(d), 0.9, 1.0)})` }}>
          <Print k="n_facade_peel" w={620} h={420} f={f}>
            <Mark kind="circle" x={0.52} y={0.66} w={0.36} h={0.3} f={f} at={at(96.5)} color="#D23B2E" sw={9} />
          </Print>
        </div>
      </Stage>
      <div style={{ ...note, left: 1180, top: 760, opacity: sp(f, at(100)) }}>1 AÑO</div>
      <div style={{ ...shade }} />
    </AbsoluteFill>
  );
};

// 2) TapeTest (hueco 160,4-171,7 s): cinta pegada, marca "pegada", chip "NO SE PINTA ENCIMA"
export const TapeTest: React.FC<{ a: number; d: number }> = ({ a, d }) => {
  const { f, at } = useT(a);
  return (
    <AbsoluteFill>
      <Bed k="n_tape_wall" f={f} T={fr(d)} dim={0.45} />
      <div style={{ position: "absolute", left: 760, top: 240, opacity: ez(at(160.8) / 6) }}>
        <Print k="l_cinta_pega" w={760} h={470} f={f}>
          <Mark kind="strike" x={0.1} y={0.5} w={0.8} h={0.08} f={f} at={at(165.4)} color="#D23B2E" sw={11} />
        </Print>
      </div>
      <div style={{ position: "absolute", left: 800, top: 760, background: C.red, color: "#fff", fontFamily: LABEL, fontSize: 58,
        padding: "12px 30px", opacity: sp(f, at(166)) }}>NO SE PINTA ENCIMA</div>
    </AbsoluteFill>
  );
};

// 3) AlcoholTest (hueco 226,5-247,5 s): dos trapos lado a lado; el manchado = LÁTEX, el limpio = ESMALTE
export const AlcoholTest: React.FC<{ a: number; d: number }> = ({ a, d }) => {
  const { f, at } = useT(a);
  return (
    <AbsoluteFill>
      <Bed k="l_alcohol_mira" f={f} T={fr(d)} dim={0.55} />
      <div style={{ position: "absolute", left: 300, top: 260 }}><Print k="n_rag_stain" w={520} h={360} f={f} /></div>
      <div style={{ position: "absolute", left: 1100, top: 260 }}><Print k="n_shiny_wall" w={520} h={360} f={f} /></div>
      <div style={{ position: "absolute", left: 300, top: 680, background: C.cream, color: C.ink, fontFamily: LABEL, fontSize: 56, padding: "10px 26px", opacity: sp(f, at(242.9)) }}>LÁTEX</div>
      <div style={{ position: "absolute", left: 1100, top: 680, background: C.red, color: "#fff", fontFamily: LABEL, fontSize: 56, padding: "10px 26px", opacity: sp(f, at(246.2)) }}>ESMALTE → LIJAR</div>
    </AbsoluteFill>
  );
};

// 4) FiveCauses (hueco 424-441 s): cama de fachada borrosa; causas llegan con su palabra (cal 426, 435)
export const FiveCauses: React.FC<{ a: number; d: number }> = ({ a, d }) => {
  const { f, at } = useT(a);
  return (
    <AbsoluteFill>
      <Bed k="n_facade_full" f={f} T={fr(d)} dim={0.6} />
      <div style={{ position: "absolute", left: 420, top: 240 }}><Print k="n_cal_wall" w={560} h={380} f={f} /></div>
      <div style={{ position: "absolute", left: 1040, top: 240, opacity: sp(f, at(435)) }}><Print k="n_dust_wall" w={560} h={380} f={f} /></div>
      <div style={{ ...note, left: 460, top: 680, opacity: sp(f, at(426)) }}>CAL VIEJA</div>
      <div style={{ ...note, left: 1080, top: 680, opacity: sp(f, at(435.5)) }}>POLVO QUE SE DESARMA</div>
    </AbsoluteFill>
  );
};

// 5) FijadorWhole (hueco 441-459 s): pared entera; al decir "toda la pared" un velo recorre el muro
export const FijadorWhole: React.FC<{ a: number; d: number }> = ({ a, d }) => {
  const { f, at } = useT(a);
  const sweep = cl((f - at(445.3)) / 60);
  return (
    <AbsoluteFill>
      <Bed k="n_facade_after" f={f} T={fr(d)} dim={0.35} />
      <div style={{ position: "absolute", left: 380, top: 170, width: 1160, height: 640, overflow: "hidden" }}>
        <Print k="n_facade_after" w={1160} h={640} f={f} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(242,194,48,0) 0%, rgba(242,194,48,0.45) 50%, rgba(242,194,48,0) 100%)",
          transform: `translateX(${-120 + 240 * sweep}%)` }} />
      </div>
      <div style={{ position: "absolute", left: 420, top: 860, background: C.cream, color: C.ink, fontFamily: LABEL, fontSize: 56, padding: "10px 26px", opacity: sp(f, at(448)) }}>
        TAMBIÉN DONDE ESTABA BIEN</div>
    </AbsoluteFill>
  );
};

// 6) LowSign (hueco 333-357 s): pared con descascarado sólo abajo; banda roja 0-60 cm; "ES AGUA, NO PINTURA"; chip ARREGLO 3
export const LowSign: React.FC<{ a: number; d: number }> = ({ a, d }) => {
  const { f, at } = useT(a);
  return (
    <AbsoluteFill>
      <Bed k="n_salitre_base" f={f} T={fr(d)} dim={0.4} />
      <div style={{ position: "absolute", left: 480, top: 150 }}>
        <Print k="n_salitre_base" w={960} h={600} f={f}>
          <Mark kind="under" x={0.05} y={0.78} w={0.9} h={0.12} f={f} at={at(335.5)} color="#D23B2E" sw={12} />
        </Print>
      </div>
      <div style={{ ...note, left: 1180, top: 620, opacity: sp(f, at(340)) }}>ES AGUA, NO PINTURA</div>
      <div style={{ position: "absolute", left: 480, top: 820, background: C.red, color: "#fff", fontFamily: LABEL, fontSize: 60, padding: "10px 28px", opacity: sp(f, at(352)) }}>ARREGLO 3</div>
    </AbsoluteFill>
  );
};

// 7) PageFifteen (hueco 778-794 s, previo al CTA2): página 15 real sobre la mesa; chip PÁGINA 15 abajo a la izquierda
export const PageFifteen: React.FC<{ a: number; d: number }> = ({ a, d }) => {
  const { f, at } = useT(a);
  return (
    <AbsoluteFill>
      <Bed k="l_mano_seca" f={f} T={fr(d)} dim={0.6} />
      <div style={{ position: "absolute", left: 1000, top: 110 }}><Print k="page15_guia" w={560} h={780} f={f} /></div>
      <div style={{ position: "absolute", left: 70, top: 880, background: C.cream, color: C.ink, fontFamily: LABEL, fontSize: 64, padding: "10px 28px", opacity: sp(f, at(782)) }}>PÁGINA 15</div>
    </AbsoluteFill>
  );
};

// 8) CounterList (hueco 630-670 s): lista escrita a mano y el mostrador; los ítems se tildan con sus palabras
export const CounterList: React.FC<{ a: number; d: number }> = ({ a, d }) => {
  const { f, at } = useT(a);
  const items = [["fijador sellador", 650], ["lija del 120", 653], ["espátula ancha", 656], ["enduido interior", 659]] as const;
  return (
    <AbsoluteFill>
      <Bed k="n_counter_empty" f={f} T={fr(d)} dim={0.5} />
      <div style={{ position: "absolute", left: 300, top: 180 }}><Print k="n_list_counter" w={1000} h={600} f={f} /></div>
      <div style={{ position: "absolute", left: 1380, top: 220, width: 440, fontFamily: HAND, fontSize: 52, color: C.ink, background: "#FFF9E8", padding: "24px 30px", boxShadow: "0 10px 30px rgba(0,0,0,0.35)" }}>
        {items.map(([txt, t]) => (
          <div key={txt} style={{ margin: "10px 0", opacity: sp(f, at(t)) }}>{`☐ ${txt}`}</div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 1380, top: 680, background: C.red, color: "#fff", fontFamily: LABEL, fontSize: 52, padding: "10px 26px", opacity: sp(f, at(655)) }}>LA LISTA</div>
    </AbsoluteFill>
  );
};

export const HERO_SCENES = [
  { name: "SheetPeel", a: 88.6, d: 27.9, C: SheetPeel },
  { name: "TapeTest", a: 160.4, d: 11.3, C: TapeTest },
  { name: "AlcoholTest", a: 226.5, d: 21.0, C: AlcoholTest },
  { name: "FiveCauses", a: 424.0, d: 17.0, C: FiveCauses },
  { name: "FijadorWhole", a: 441.0, d: 18.0, C: FijadorWhole },
  { name: "LowSign", a: 333.0, d: 24.0, C: LowSign },
  { name: "PageFifteen", a: 778.0, d: 16.5, C: PageFifteen },
  { name: "CounterList", a: 630.0, d: 41.0, C: CounterList },
];
export { Grade, Grain };
