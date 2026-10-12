// suprecio · tramo 400 s → final (962 s), R2b. Tiempos absolutos (segundos del corte de voz).
// Capa de avatar en todas las ventanas AV (AvatarWins). Fotos en los huecos (sin avatar), frase por frase.
// Cuentas (PerKilo): en la mitad derecha (40 %), con Claudio visible a la izquierda (≥60 %).
import React from "react";
import { AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame } from "remotion";
import { fr, Grade, Grain } from "../ckeggs/Base";
import { Cuenta, CuentaProps } from "./Cuenta";
import { AvatarWins } from "./Avatar";

const CUENTAS: CuentaProps[] = [
 {
  "liquid": false,
  "mode": "full",
  "from_": 426.5,
  "dur": 5.69,
  "left": {
   "img": "n_cafe_oferta_500g",
   "name": "Café 500 g (oferta)",
   "price": 250,
   "grams": 500
  },
  "right": {
   "img": "n_cafe_1kg",
   "name": "Café 1 kg",
   "price": 540,
   "grams": 1000
  },
  "tA": 427.5,
  "tB": 429,
  "tCalc": 432.5,
  "tWin": 436.5,
  "from": 426.5
 },
 {
  "liquid": false,
  "mode": "side",
  "from_": 432.19,
  "dur": 12.01,
  "left": {
   "img": "n_cafe_oferta_500g",
   "name": "Café 500 g (oferta)",
   "price": 250,
   "grams": 500
  },
  "right": {
   "img": "n_cafe_1kg",
   "name": "Café 1 kg",
   "price": 540,
   "grams": 1000
  },
  "tA": 427.5,
  "tB": 429,
  "tCalc": 432.5,
  "tWin": 436.5,
  "from": 432.19
 },
 {
  "liquid": true,
  "mode": "full",
  "from_": 500.4,
  "dur": 5.87,
  "left": {
   "img": "n_aceite_900ml",
   "name": "Aceite 900 ml",
   "price": 1350,
   "grams": 900
  },
  "right": {
   "img": "n_aceite_5l",
   "name": "Aceite 5 l",
   "price": 6500,
   "grams": 5000
  },
  "tA": 501.5,
  "tB": 504,
  "tCalc": 506.5,
  "tWin": 513,
  "from": 500.4
 },
 {
  "liquid": true,
  "mode": "side",
  "from_": 506.27,
  "dur": 9.73,
  "left": {
   "img": "n_aceite_900ml",
   "name": "Aceite 900 ml",
   "price": 1350,
   "grams": 900
  },
  "right": {
   "img": "n_aceite_5l",
   "name": "Aceite 5 l",
   "price": 6500,
   "grams": 5000
  },
  "tA": 501.5,
  "tB": 504,
  "tCalc": 506.5,
  "tWin": 513,
  "from": 506.27
 },
 {
  "liquid": false,
  "mode": "full",
  "from_": 595.32,
  "dur": 17.68,
  "left": {
   "img": "n_queso_sobre40",
   "name": "Queso 40 g",
   "price": 260,
   "grams": 40
  },
  "right": {
   "img": "n_queso_bolsa150",
   "name": "Queso 150 g",
   "price": 1100,
   "grams": 150
  },
  "tA": 597,
  "tB": 599,
  "tCalc": 606,
  "tWin": 612.5,
  "from": 595.32
 },
 {
  "liquid": true,
  "mode": "full",
  "from_": 645.4,
  "dur": 19.0,
  "left": {
   "img": "n_gaseosa_botella",
   "name": "Gaseosa 2,25 l",
   "price": 900,
   "grams": 2250
  },
  "right": {
   "img": "n_gaseosa_pack6",
   "name": "Pack 6 latas", "blur": true,
   "price": 1050,
   "grams": 2130
  },
  "tA": 646,
  "tB": 650.5,
  "tCalc": 666.5,
  "tWin": 681.5,
  "from": 645.4
 },
 {
  "liquid": true,
  "mode": "side",
  "from_": 664.4,
  "dur": 11.2,
  "left": {
   "img": "n_gaseosa_botella",
   "name": "Gaseosa 2,25 l",
   "price": 900,
   "grams": 2250
  },
  "right": {
   "img": "n_gaseosa_pack6",
   "name": "Pack 6 latas", "blur": true,
   "price": 1050,
   "grams": 2130
  },
  "tA": 646,
  "tB": 650.5,
  "tCalc": 666.5,
  "tWin": 681.5,
  "from": 664.4
 },
 {
  "liquid": true,
  "mode": "full",
  "from_": 675.6,
  "dur": 11.5,
  "left": {
   "img": "n_gaseosa_botella",
   "name": "Gaseosa 2,25 l",
   "price": 900,
   "grams": 2250
  },
  "right": {
   "img": "n_gaseosa_pack6",
   "name": "Pack 6 latas", "blur": true,
   "price": 1050,
   "grams": 2130
  },
  "tA": 646,
  "tB": 650.5,
  "tCalc": 666.5,
  "tWin": 681.5,
  "from": 675.6
 },
 {
  "liquid": false,
  "mode": "side",
  "from_": 707.0,
  "dur": 8.21,
  "left": {
   "img": "n_tag_100g_vs_kilo",
   "name": "Por 100 g",
   "price": 38,
   "grams": 100,
   "tagText": "$38 / 100 g"
  },
  "right": {
   "img": "n_tag_100g_vs_kilo",
   "name": "Por kilo",
   "price": 400,
   "grams": 1000,
   "tagText": "$400 / kg"
  },
  "tA": 715,
  "tB": 720,
  "tCalc": 739,
  "tWin": 751,
  "from": 707.0
 },
 {
  "liquid": false,
  "mode": "full",
  "from_": 715.21,
  "dur": 24.48,
  "left": {
   "img": "n_tag_100g_vs_kilo",
   "name": "Por 100 g",
   "price": 38,
   "grams": 100,
   "tagText": "$38 / 100 g"
  },
  "right": {
   "img": "n_tag_100g_vs_kilo",
   "name": "Por kilo",
   "price": 400,
   "grams": 1000,
   "tagText": "$400 / kg"
  },
  "tA": 715,
  "tB": 720,
  "tCalc": 739,
  "tWin": 751,
  "from": 715.21
 },
 {
  "liquid": false,
  "mode": "side",
  "from_": 739.69,
  "dur": 11.64,
  "left": {
   "img": "n_tag_100g_vs_kilo",
   "name": "Por 100 g",
   "price": 38,
   "grams": 100,
   "tagText": "$38 / 100 g"
  },
  "right": {
   "img": "n_tag_100g_vs_kilo",
   "name": "Por kilo",
   "price": 400,
   "grams": 1000,
   "tagText": "$400 / kg"
  },
  "tA": 715,
  "tB": 720,
  "tCalc": 739,
  "tWin": 751,
  "from": 739.69
 },
 {
  "liquid": false,
  "mode": "full",
  "from_": 751.33,
  "dur": 2.67,
  "left": {
   "img": "n_tag_100g_vs_kilo",
   "name": "Por 100 g",
   "price": 38,
   "grams": 100,
   "tagText": "$38 / 100 g"
  },
  "right": {
   "img": "n_tag_100g_vs_kilo",
   "name": "Por kilo",
   "price": 400,
   "grams": 1000,
   "tagText": "$400 / kg"
  },
  "tA": 715,
  "tB": 720,
  "tCalc": 739,
  "tWin": 751,
  "from": 751.33
 }
];


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

// Huecos sin avatar: [inicio, duración, foto]
const STILLS: [number, number, string][] = [
  [426.5, 5.69, "n_cafe_oferta_500g"],
  [500.4, 5.87, "n_aceite_900ml"],
  [595.32, 17.68, "n_queso_sobre40"],
  [645.4, 19.0, "n_gaseosa_botella"],
  [675.6, 11.5, "n_gaseosa_botella"],
  [447.9, 0.4, "n_tag_kilo"],
  [541.1, 0.8, "n_cookies_pack"],
  [573.2, 0.5, "n_bidon"],
  [613.0, 9.8, "n_labeler"],
  [637.5, 7.9, "n_two_packs"],
  [703.5, 0.49, "n_tag_kilo"],
  [792.7, 2.2, "n_clipboard"],
  [877.3, 0.4, "n_cash_receipt"],
  [888.7, 0.8, "n_tag_liter"],
  [919.4, 0.4, "n_arroz_500g"],
  [930.0, 0.42, "n_aceite_5l"],
  [406.3, 4.1, "n_cafe_oferta_500g"], [410.4, 4.6, "n_cafe_oferta_500g"], [415.0, 5.2, "n_cafe_1kg"], [420.2, 6.2, "n_tag_liter"],
  [444.2, 3.7, "n_cafe_oferta_500g"], [448.3, 7.6, "n_tag_liter"], [455.8, 10.4, "n_tag_kilo"], [466.2, 2.3, "n_cookies_pack"],
  [478.9, 12.0, "n_aceite_5l"], [490.9, 7.7, "n_aceite_5l"], [498.6, 1.7, "n_aceite_900ml"],
  [518.0, 6.7, "n_tag_liter"], [524.6, 8.1, "n_bidon"], [532.7, 8.4, "n_cash_receipt"], [541.9, 1.3, "n_queso_bolsa150"],
  [554.6, 6.6, "n_bidon"], [561.5, 3.5, "n_aceite_900ml"], [565.1, 8.1, "n_cash_receipt"], [573.7, 3.9, "n_gaseosa_botella"], [577.9, 3.6, "n_queso_sobre40"],
  [622.8, 4.6, "n_two_packs"], [627.7, 7.5, "n_queso_sobre40"], [635.2, 2.3, "n_queso_bolsa150"],
  [686.3, 12.5, "n_gaseosa_pack6"], [698.8, 4.7, "n_gaseosa_botella"],
  [715.2, 24.5, "n_tag_100g_vs_kilo"],
  [751.3, 24.1, "n_tag_100g_vs_kilo"],
  [786.8, 5.9, "n_tag_100g_vs_kilo"], [794.9, 3.6, "n_cash_receipt"], [798.8, 16.7, "L4_dos_etiquetas"],
  [827.7, 9.6, "n_tag_liter"], [837.6, 7.3, "n_tag_kilo"], [845.0, 8.8, "n_clipboard"],
  [867.4, 2.6, "n_clipboard"], [870.0, 7.3, "n_tag_kilo"], [877.7, 11.0, "n_clipboard"], [889.5, 3.2, "n_cash_receipt"],
  [892.7, 12.8, "n_tag_liter"], [905.6, 13.8, "n_cookies_pack"], [919.8, 10.2, "n_tag_kilo"],
  [941.0, 4.9, "n_back_room"],
];

export const Rest2: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "transparent" }}>
    <AvatarWins from={400} to={962} shrink={CUENTAS.filter((c) => c.mode === "side").map((c) => [c.from, c.from + c.dur] as [number, number])} />
    {STILLS.map(([f, d, n], i) => (
      <Sequence key={`s${i}`} from={fr(f)} durationInFrames={fr(d)}><StillInner dur={d} name={n} /></Sequence>
    ))}
    {CUENTAS.map((c, i) => <Cuenta key={`c${i}`} {...c} />)}
    <Grade />
    <Grain />
  </AbsoluteFill>
);
