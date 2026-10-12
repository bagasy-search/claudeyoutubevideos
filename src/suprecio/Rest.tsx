// suprecio · resto del video, 60-400 s, para R5. Tiempos absolutos (segundos del corte de voz, 962 s).
// Regla: los componentes y fotos sólo van en los huecos SIN avatar (av_windows_final.json); cada foto cae en la
// frase que se dice en ese segundo. Ventanas AV = Sequence vacía (la capa de avatar la pone el montaje final).
import React from "react";
import { AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame } from "remotion";
import { fr, Grade, Grain } from "../ckeggs/Base";
import { ShelfTag, Lupa } from "../repkit/Kit";
import { Cuenta } from "./Cuenta";
import { AvatarWins } from "./Avatar";

const IMG = (n: string) => staticFile(`img/suprecio/${n}.png`);

const StillInner: React.FC<{ dur: number; name: string }> = ({ dur, name }) => {
  const f = useCurrentFrame();
  const t = Math.max(0, Math.min(1, f / Math.max(1, fr(dur))));
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div style={{ width: "100%", height: "100%", transform: `scale(${1 + 0.06 * t})`, transformOrigin: "50% 50%" }}>
        <Img src={IMG(name)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    </AbsoluteFill>
  );
};
// Foto/plano en un tiempo absoluto
const Still: React.FC<{ from: number; dur: number; name: string }> = ({ from, dur, name }) => (
  <Sequence from={fr(from)} durationInFrames={fr(dur)}><StillInner dur={dur} name={name} /></Sequence>
);
// Ventana AV: vacía (el avatar entra en el montaje final)
const AV: React.FC<{ from: number; dur: number }> = ({ from, dur }) => <Sequence from={fr(from)} durationInFrames={fr(dur)} />;

export const Rest: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "transparent" }}>
    {/* capa del avatar: todas las ventanas AV (offsets verificados por xcorr de audio, ±0,1 s) */}
    <AvatarWins from={0} to={400} />
    {/* 55-79 hueco: ShelfTag sobre la etiqueta de precio por kilo + lupa sobre la línea chica */}
    <ShelfTag from={60.8} dur={9.5} bg="img/suprecio/n_tag_kilo.png" at={[960, 470]} product="Arroz blanco" price={1240}
        unitLine="$ 1.240 el kg" tPrint={62} tLupa={65} tCircle={68.5} ejemplo />
    <Lupa from={70.3} dur={8.7} bg="img/suprecio/n_tag_kilo.png" zoom={2.4}
        path={[{ x: 700, y: 520, t: 71 }, { x: 1100, y: 600, t: 74 }, { x: 1100, y: 640, t: 78 }]} underline={75.5} />
    <AV from={79.05} dur={10.72} />

    {/* 89,8-114,8 hueco: paquetes de medio kilo y de un kilo, la etiqueta, la historia de la clienta (L1 al empezar) */}
    <Still from={89.8} dur={9.7} name="n_arroz_500g" />
    <Still from={99.5} dur={2.6} name="n_tag_kilo" />
    <Still from={102.1} dur={7.8} name="L1_rosa_aisle" />
    <Still from={109.9} dur={4.9} name="n_arroz_1kg" />
    <AV from={114.76} dur={11.72} />

    {/* 126,5-153,8 hueco: los dos números, la pila de latas de 1960, la planilla */}
    <Still from={126.5} dur={5.8} name="n_two_packs" />
    <Still from={132.3} dur={5.1} name="n_cash_receipt" />
    <Still from={137.4} dur={10.1} name="n_latas_60s" />
    <Still from={147.5} dur={6.3} name="n_clipboard" />
    <AV from={153.76} dur={13.71} />

    {/* 167,5-195,1 hueco: la etiqueta (tres partes), la balanza, el paquete, la trastienda */}
    <Still from={167.5} dur={9.9} name="n_etiqueta_3partes" />
    <Still from={177.6} dur={5.7} name="n_scale_deli" />
    <Still from={183.3} dur={7.2} name="n_bidon" />
    <Still from={190.9} dur={4.2} name="n_back_room" />
    <AV from={195.07} dur={11.47} />

    {/* 206,5-232,2 hueco: PRUEBA 1 arroz (PerKilo, cuenta en pantalla) */}
    <Cuenta mode="full" from={206.5} dur={25.7} left={{ img: "img/suprecio/n_arroz_500g.png", name: "Arroz 500 g", price: 50, grams: 500 }}
        right={{ img: "img/suprecio/n_arroz_1kg.png", name: "Arroz 1 kg", price: 80, grams: 1000 }}
        tA={207.5} tB={209} tCalc={216} tWin={224} />
    <AV from={232.19} dur={12.55} />

    {/* 244,7-270 hueco: PRUEBA 2 detergente (PerKilo) */}
    <Cuenta mode="full" liquid from={244.8} dur={25.1} left={{ img: "img/suprecio/n_detergente_800ml.png", name: "Detergente 800 ml", price: 80, grams: 800 }}
        right={{ img: "img/suprecio/n_detergente_3l.png", name: "Detergente 3 l", price: 330, grams: 3000 }}
        tA={251} tB={256} tCalc={262} tWin={268} />
    <AV from={269.96} dur={14.93} />

    {/* 284,9-311,4 hueco: la sorpresa explicada: el envase grande, el tamaño engaña */}
    <Still from={284.9} dur={5} name="n_labeler" />
    <Still from={290.3} dur={6.2} name="n_cookies_pack" />
    <Still from={296.8} dur={14.6} name="n_bidon" />
    <AV from={311.36} dur={14.17} />

    {/* 325,5-329,5 hueco corto */}
    <Still from={325.5} dur={4} name="n_scale_deli" />
    <AV from={329.49} dur={8.9} />

    {/* 338,4-353,3 hueco: PRUEBA 3 galletas (paquete de tres) */}
    <Still from={338.4} dur={14.9} name="n_cookies_pack" />
    <AV from={353.29} dur={10.95} />

    {/* 364,2-393,4 hueco: PRUEBA 3 la cuenta (PerKilo) y el cierre de la prueba */}
    <Cuenta mode="full" from={364.3} dur={19} left={{ img: "img/suprecio/n_galletas_paquete3.png", name: "Paquete de 3 (300 g)", price: 420, grams: 300 }}
        right={{ img: "img/suprecio/n_galletas_sueltas.png", name: "3 sueltas (300 g)", price: 480, grams: 300 }}
        tA={365} tB={368} tCalc={372} tWin={379} />
    <Still from={383.3} dur={10.1} name="n_two_packs" />
    <AV from={393.44} dur={12.85} />

    {/* 406-400: fin del tramo (400 s) */}
    <Grade />
    <Grain />
  </AbsoluteFill>
);
