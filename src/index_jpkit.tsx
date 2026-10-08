// Banco de stills del kit Claudio en Japón. npx remotion still src/index_jpkit.tsx <Id> out/kit/<Id>.png --frame=N
import React from "react";
import { registerRoot, Composition } from "remotion";
import { ClGridHook, ClRule, ClSato, ClNumbers, ClDryBars, ClBodyMap, ClDays, ClAges } from "./claudio/ClJapon";
import { ClCheck, ClBookPage, ClQRCard } from "./claudio/ClCards";
const I = "img/jpviejo/";
const B = I + "x_t1.jpg";
const L: [string, React.FC<any>, any][] = [
  ["Ages", ClAges, { bed: I + "x_t3.jpg" }],
  ["Grid", ClGridHook, { bed: I + "x_thumbbg.jpg", tiles: [1, 2, 3, 4, 5, 6].map((k) => I + `x_t${k}.jpg`), words: ["por esto hueles a", "viejo"], every: 8 }],
  ["Rule", ClRule, { n: 7, title: "Entre los dedos", sub: "y los zapatos", star: true, bed: B }],
  ["Sato", ClSato, { img: I + "x_t2.jpg", quote: "Claudio-san, tu toalla huele a pies.", bed: B }],
  ["Numbers", ClNumbers, { rows: [["La toalla", "extendida, cambio cada 3 usos"], ["Cara y cuerpo", "una toalla para cada uno"], ["El baño", "puerta abierta al salir"]], page: 9, bed: B }],
  ["Dry", ClDryBars, { title: "Cuánto tarda en secarse", rows: [{ label: "Doblada en el gancho", h: 12, note: "nunca llega a secarse" }, { label: "Extendida y abierta", h: 2, good: true }], bed: B }],
  ["Body", ClBodyMap, { bed: B }],
  ["Days", ClDays, { label: "el ajo del domingo sigue en tu piel el martes", bed: B }],
  ["Check", ClCheck, { title: "Lo único que hay que comprar", label: "MÉTODO · PÁG. 9", items: ["Toalla de mano extra por persona", "Raspador de lengua (o una cuchara)", "Jabón neutro en barra", "Cepillo suave para la espalda"], bed: B }],
  ["Book", ClBookPage, { page: I + "x_page9.jpg", pageNo: 9, stamp: "La rutina completa", bed: B }],
  ["QR", ClQRCard, { qr: I + "qr.png", cover: I + "x_gift.jpg", kicker: "EL TEST · GRATIS", text: "apunta la cámara aquí", bed: B }],
];
const Root = () => <>{L.map(([id, C, p]) => <Composition key={id} id={id} component={() => <C {...p} />} durationInFrames={180} fps={30} width={1920} height={1080} />)}</>;
registerRoot(Root);
