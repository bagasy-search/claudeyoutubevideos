// repkit · DEMO de todo el kit (Claude, 12-oct-2026): 14 componentes en orden, ~2 min.
// Cada bloque usa un offset `o` (segundo donde arranca) y tiempos RELATIVOS que se suman a o.
// Los video agents copian este archivo: el bloque de cada componente es su ejemplo de uso en un edl.
import React from "react";
import { AbsoluteFill } from "remotion";
import { SealDoor, ShelfTag, PerKilo, Ticket, Scanner, Lupa, ShelfHeights, OfferPoster, ClockDeal, Clipboard, CountCard, BeforeAfter, CommentQ, Cta } from "./Kit";

export const DEMO_TOTAL_S = 120;
const P = "img/repkit/";
export const Demo: React.FC = () => {
  const o = {
    seal: 0, shelf: 7, perkilo: 17, ticket: 29, scanner: 39, lupa: 47, heights: 56,
    offer: 65, clock: 75, clip: 82, count: 92, ba: 98, comment: 105, cta: 111,
  };
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <SealDoor from={o.seal} dur={7} bg={P + "door.png"} tStamp={o.seal + 1.6} tPush={o.seal + 4.2} />

      <ShelfTag from={o.shelf} dur={10} bg={P + "gondola_full.png"} at={[960, 566]} product="Arroz 500 g" price={1240}
        unitLine="$ 2.480 el kg" tPrint={o.shelf + 1} tCircle={o.shelf + 2.4} tLupa={o.shelf + 3.6} ejemplo />

      <PerKilo from={o.perkilo} dur={12}
        left={{ img: P + "rice_500g.png", name: "Arroz 500 g", price: 1240, grams: 500 }}
        right={{ img: P + "rice_1kg.png", name: "Arroz 1 kg", price: 2190, grams: 1000 }}
        tA={o.perkilo + 0.8} tB={o.perkilo + 1.6} tCalc={o.perkilo + 2.8} tWin={o.perkilo + 6.5} />

      <Ticket from={o.ticket} dur={10} bg={P + "checkout.png"} head="TICKET" slot={[285, 200]}
        lines={[
          { txt: "Arroz 1 kg", amt: "$ 2.190", t: o.ticket + 1 },
          { txt: "Galletas", amt: "$ 890", t: o.ticket + 2.5 },
          { txt: "Leche 1 L", amt: "$ 1.150", t: o.ticket + 4 },
          { txt: "Aceite 900 ml", amt: "$ 3.400", t: o.ticket + 5.5 },
          { txt: "Total", amt: "$ 7.630", t: o.ticket + 7 },
        ]}
        hl={{ idx: 3, t: o.ticket + 8.2, note: "¿lo viste?" }} />

      <Scanner from={o.scanner} dur={8} img={P + "scanner_pack.png"} win={[1000, 730]} price={3400} tBeep={o.scanner + 3.5}
        display={{ price: 3290, t: o.scanner + 5.5 }} />

      <Lupa from={o.lupa} dur={9} bg={P + "package_label.png"} zoom={2.4}
        label={{ box: [600, 380, 470, 230], keyIdx: 0, lines: [{ txt: "Contenido neto 450 g", size: 44, bold: true }, { txt: "Arroz blanco de grano largo", size: 26 }, { txt: "Conservar en lugar fresco y seco", size: 24 }] }}
        path={[{ x: 720, y: 436, t: o.lupa + 0.5 }, { x: 800, y: 452, t: o.lupa + 3 }, { x: 790, y: 470, t: o.lupa + 5.5 }]}
        underline={o.lupa + 6} />

      <ShelfHeights from={o.heights} dur={9} bg={P + "gondola_full.png"}
        bands={[
          { label: "OJOS", y0: 260, y1: 420, chip: "LO CARO", t: o.heights + 1 },
          { label: "PIES", y0: 760, y1: 920, chip: "LO BARATO", t: o.heights + 4 },
        ]}
        camPath={[{ t: o.heights, x: 960, y: 340, s: 1.1 }, { t: o.heights + 2.5, x: 960, y: 340, s: 1.1 }, { t: o.heights + 5.5, x: 960, y: 840, s: 1.1 }]} />

      <OfferPoster from={o.offer} dur={10} bg={P + "offer_shelf.png"} big="2x1" small="OFERTA" tIn={o.offer + 0.6} tPeel={o.offer + 4}
        under={[
          { txt: "Llevas 2: $ 2.480", t: o.offer + 4.8 },
          { txt: "Pagas 1: $ 1.240", t: o.offer + 6.2 },
          { txt: "Cada uno sale $ 620", t: o.offer + 7.6, hl: true },
        ]} />

      <ClockDeal from={o.clock} dur={7} bg={P + "counter_clock.png"} hourFrom={17.5} hourTo={19.5} tSpin={o.clock + 1} label="19:30 · REBAJAS" />

      <Clipboard from={o.clip} dur={10} title="Planilla del encargado" bg={P + "corkboard.png"}
        lines={[
          { txt: "Yogur: bajar a $ 890", t: o.clip + 1, tick: o.clip + 2 },
          { txt: "Queso: rebaja 19:30", t: o.clip + 3.2, tick: o.clip + 4 },
          { txt: "Carne: marcar roja", t: o.clip + 5.4 },
        ]} />

      <CountCard from={o.count} dur={6} n={7} of={17} word="TRAMPA" title="Los precios a la altura de los ojos" bg={P + "aisle.png"} t={o.count + 0.6} />

      <BeforeAfter from={o.ba} dur={7} a={P + "gondola_empty.png"} b={P + "gondola_full.png"} tWipe={o.ba + 3.2} />

      <CommentQ from={o.comment} dur={6} q="¿Y en la carnicería también pasa? Yo compro ahí todas las semanas." t={o.comment + 0.5} bg={P + "aisle.png"} name="Marta G." initial="M" when="hace 2 días" />

      <Cta from={o.cta} dur={9} t={o.cta + 2} bg={P + "storeroom.png"} />
    </AbsoluteFill>
  );
};
