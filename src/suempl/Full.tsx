// suempl · EDL 0-400 s (R5). Generado desde edl_0_400.json. Avatar abajo (AvatarWins), tomas encima.
// Clips CFR (-bf 0). Cada asset aparece una sola vez. SealDoor sin envoltorio (su tiempo es absoluto).
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { fr, Grade, Grain } from "../repkit/Rk";
import { SealDoor, ClockDeal } from "../repkit/Kit";
import { SealDoorS } from "./SealDoorS";
import { AvatarWins } from "./Avatar";
import { Audio } from "remotion";

const FILL: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover" };

// Toma fija (empuje lento 1,00 -> 1,06). Usa tiempo ABSOLUTO a y b (segundos del video).
const Shot: React.FC<{ a: number; b: number; vid?: string; img?: string }> = ({ a, b, vid, img }) => {
  const dur = b - a;
  return (
    <Sequence from={fr(a)} durationInFrames={fr(dur)}>
      <Push dur={dur} src={(vid || img) as string} vid={!!vid} />
    </Sequence>
  );
};

const Push: React.FC<{ dur: number; src: string; vid: boolean }> = ({ dur, src, vid }) => {
  const f = useCurrentFrame();
  const t = Math.max(0, Math.min(1, f / Math.max(1, fr(dur))));
  const s = 1 + 0.06 * t;
  const inner = vid
    ? <OffthreadVideo src={src} muted style={FILL} />
    : <Img src={src} style={FILL} />;
  return <AbsoluteFill style={{ overflow: "hidden" }}><div style={{ width: "100%", height: "100%", transform: `scale(${s})`, transformOrigin: "50% 50%" }}>{inner}</div></AbsoluteFill>;
};

const HeroYears: React.FC<{ from: number; steps: { t: number; txt: string }[] }> = ({ from, steps }) => {
  const f = useCurrentFrame();
  const now = from + f / 30;
  const cur = [...steps].reverse().find((s) => s.t <= now) ?? steps[0];
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.38)" }}>
      <div style={{ color: "#fff", fontFamily: "Arial Black, Arial, sans-serif", fontSize: 150, letterSpacing: 2, textShadow: "0 6px 24px rgba(0,0,0,0.7)" }}>{cur.txt}</div>
    </AbsoluteFill>
  );
};

export const Full: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <AvatarWins from={0} to={965} />
    <Sequence from={0} durationInFrames={fr(0.6)}><Img src={staticFile("img/suempl/thumb.png")} style={FILL} /></Sequence>
    <Shot a={0.6} b={3.8} vid={staticFile("broll/suempl/cfr/pallet_boxes.mp4")} />
    <Shot a={10} b={14.6} vid={staticFile("broll/suempl/cfr/wow_dc2.mp4")} />
    <Shot a={14.6} b={18.8} vid={staticFile("broll/suempl/cfr/wow2_cheese.mp4")} />
    <Shot a={21.92} b={25.56} vid={staticFile("broll/suempl/cfr/cash_register.mp4")} />
    <Shot a={32.9} b={37.5} vid={staticFile("broll/suempl/cfr/arc_register1972.mp4")} />
    <Shot a={37.5} b={41.6} vid={staticFile("broll/suempl/cfr/wow_conveyor.mp4")} />
    <Shot a={58} b={60} vid={staticFile("broll/suempl/cfr/wow_coldroom.mp4")} />
    <Shot a={60} b={68} vid={staticFile("broll/suempl/cfr/deli_counter.mp4")} />
    <Sequence from={fr(47.08)} durationInFrames={fr(6.18)}><SealDoorS from={47.08} dur={6.18} bg="img/suempl/door_clean.png" tPush={47.5} tStamp={48.9} /></Sequence>
    <Sequence from={fr(32.9)} durationInFrames={fr(8.7)}><HeroYears from={32.9} steps={[{ t: 32.9, txt: "AÑO 1" }, { t: 35.78, txt: "AÑO 15" }, { t: 37.5, txt: "AÑO 25" }, { t: 41.74, txt: "AÑO 30" }]} /></Sequence>
    <Shot a={82.68} b={91.7} vid={staticFile("broll/suempl/cfr/cart_aisle.mp4")} />
    <Shot a={109.28} b={120.06} img={staticFile("img/suempl/aisle.png")} />
    <ClockDeal from={138.06} dur={8.5} bg="img/suempl/counter_clock.png" hourFrom={22.0} hourTo={23.5} tSpin={138.56} label="22:00 · CIERRE" />
    <Shot a={146.56} b={155.06} img={staticFile("img/suempl/checkout_lane.png")} />
    <Shot a={155.06} b={163.56} img={staticFile("img/suempl/gondola_price.png")} />
    <Shot a={163.56} b={173.0} img={staticFile("img/suempl/shelf_cans.png")} />
    <ClockDeal from={191.0} dur={8.5} bg="img/suempl/counter_clock.png" hourFrom={2.0} hourTo={5.5} tSpin={191.5} label="02:00 · RECARGA" />
    <Shot a={199.5} b={208.0} vid={staticFile("broll/suempl/cfr/meat_case.mp4")} />
    <Shot a={208.0} b={216.5} vid={staticFile("broll/suempl/cfr/cheese_counter.mp4")} />
    <Shot a={216.5} b={225.0} img={staticFile("img/suempl/cart_night.png")} />
    <Shot a={225.0} b={233.5} img={staticFile("img/suempl/checkout.png")} />
    <Shot a={233.5} b={238.72} img={staticFile("img/suempl/checkout_belt.png")} />
    <Shot a={255.82} b={264.32} vid={staticFile("broll/suempl/cfr/wow2_unload.mp4")} />
    <Shot a={264.32} b={272.82} img={staticFile("img/suempl/corkboard.png")} />
    <Shot a={272.82} b={281.32} img={staticFile("img/suempl/gondola_empty.png")} />
    <Shot a={281.32} b={289.82} img={staticFile("img/suempl/checkout_till.png")} />
    <Shot a={289.82} b={298.32} img={staticFile("img/suempl/gondola_full.png")} />
    <Shot a={298.32} b={306.82} img={staticFile("img/suempl/keys_desk.png")} />
    <Shot a={306.82} b={314.16} img={staticFile("img/suempl/offer_shelf.png")} />
    <Shot a={327.53} b={336.03} img={staticFile("img/suempl/package_label.png")} />
    <Shot a={336.03} b={344.53} img={staticFile("img/suempl/pizza_pallet.png")} />
    <Shot a={344.53} b={353.03} img={staticFile("img/suempl/rice_big.png")} />
    <Shot a={353.03} b={361.53} img={staticFile("img/suempl/rice_small.png")} />
    <Shot a={361.53} b={370.03} img={staticFile("img/suempl/scanner_pack.png")} />
    <Shot a={370.03} b={378.53} img={staticFile("img/suempl/storeroom.png")} />
    <Shot a={378.53} b={389.0} img={staticFile("img/suempl/tally_sheet.png")} />
    <Shot a={389.0} b={400.46} img={staticFile("img/suempl/pallet_yard.png")} />
    <Shot a={345.2} b={350.2} img={staticFile("img/suempl/l_frio2.png")} />
    <Shot a={369.1} b={374.5} img={staticFile("img/suempl/l_frio1.png")} />
    <Shot a={412.2} b={419.2} img={staticFile("img/suempl/n4_store_h.png")} />
    <Shot a={437.4} b={445.3} vid={staticFile("broll/suempl/cfr/b1_emptyshelf.mp4")} />
    <Shot a={445.3} b={453.2} img={staticFile("img/suempl/n4_store_a.png")} />
    <Shot a={453.2} b={461.1} img={staticFile("img/suempl/n8_a.png")} />
    <Shot a={461.1} b={469.0} img={staticFile("img/suempl/n4_store_b.png")} />
    <Shot a={469.0} b={476.9} vid={staticFile("broll/suempl/cfr/b1_cajas.mp4")} />
    <Shot a={476.9} b={485.0} img={staticFile("img/suempl/n4_store_c.png")} />
    <Shot a={495.3} b={502.7} vid={staticFile("broll/suempl/cfr/b1_cold.mp4")} />
    <Shot a={502.7} b={510.1} img={staticFile("img/suempl/n4_store_i.png")} />
    <Shot a={510.1} b={517.5} img={staticFile("img/suempl/n4_store_j.png")} />
    <Shot a={517.5} b={524.9} img={staticFile("img/suempl/n4_store_e.png")} />
    <Shot a={524.9} b={532.3} img={staticFile("img/suempl/n4_store_f.png")} />
    <Shot a={532.3} b={541.0} img={staticFile("img/suempl/n4_store_g.png")} />
    <Shot a={456.0} b={461.0} img={staticFile("img/suempl/l_ticket.png")} />
    <Shot a={499.2} b={504.0} img={staticFile("img/suempl/l_cafe.png")} />
    <Shot a={518.0} b={523.0} img={staticFile("img/suempl/l_cajon.png")} />
    <Shot a={541.0} b={546.0} img={staticFile("img/suempl/l_planilla2.png")} />
    <Shot a={546.0} b={552.4} img={staticFile("img/suempl/n5_a.png")} />
    <Shot a={552.4} b={558.8} vid={staticFile("broll/suempl/cfr/b2_apples.mp4")} />
    <Shot a={558.8} b={565.2} img={staticFile("img/suempl/n5_b.png")} />
    <Shot a={565.2} b={571.8} vid={staticFile("broll/suempl/cfr/b2_olives.mp4")} />
    <Shot a={589.5} b={596.2} vid={staticFile("broll/suempl/cfr/b2_camara.mp4")} />
    <Shot a={596.2} b={602.9} img={staticFile("img/suempl/n5_d.png")} />
    <Shot a={602.9} b={609.6} img={staticFile("img/suempl/n5_e.png")} />
    <Shot a={609.6} b={616.3} vid={staticFile("broll/suempl/cfr/b2_cinta.mp4")} />
    <Shot a={616.3} b={623.0} img={staticFile("img/suempl/n5_g.png")} />
    <Shot a={623.0} b={629.8} img={staticFile("img/suempl/n5_h.png")} />
    <Shot a={639.6} b={645.7} img={staticFile("img/suempl/n4_store_k.png")} />
    <Shot a={657.6} b={664.9} img={staticFile("img/suempl/n5_i.png")} />
    <Shot a={679.6} b={684.0} vid={staticFile("broll/suempl/cfr/b3_ticket.mp4")} />
    <Shot a={684.0} b={691.6} img={staticFile("img/suempl/n6_a.png")} />
    <Shot a={691.6} b={694.0} img={staticFile("img/suempl/n6_b.png")} />
    <Shot a={694.0} b={699.0} img={staticFile("img/suempl/l_b2a.png")} />
    <Shot a={699.0} b={706.0} img={staticFile("img/suempl/n6_c.png")} />
    <Shot a={706.0} b={712.8} vid={staticFile("broll/suempl/cfr/b3_centro.mp4")} />
    <Shot a={712.8} b={716.0} img={staticFile("img/suempl/n6_d.png")} />
    <Shot a={716.0} b={721.0} img={staticFile("img/suempl/l_b2b.png")} />
    <Shot a={721.0} b={729.0} img={staticFile("img/suempl/n6_e.png")} />
    <Shot a={729.0} b={733.5} img={staticFile("img/suempl/n6_f.png")} />
    <Shot a={733.5} b={738.0} img={staticFile("img/suempl/n6_g.png")} />
    <Shot a={738.0} b={743.0} img={staticFile("img/suempl/l_b2c.png")} />
    <Shot a={743.0} b={750.6} img={staticFile("img/suempl/n6_h.png")} />
    <Shot a={750.6} b={757.9} img={staticFile("img/suempl/n6_i.png")} />
    <Shot a={757.9} b={761.3} img={staticFile("img/suempl/n6_j.png")} />
    <Shot a={777.5} b={784.5} img={staticFile("img/suempl/n6_k.png")} />
    <Shot a={784.5} b={791.5} img={staticFile("img/suempl/n6_l.png")} />
    <Shot a={791.5} b={798.5} img={staticFile("img/suempl/n6_m.png")} />
    <Shot a={798.5} b={805.5} img={staticFile("img/suempl/n6_n.png")} />
    <Shot a={805.5} b={812.5} img={staticFile("img/suempl/n6_o.png")} />
    <Shot a={812.5} b={815.3} vid={staticFile("broll/suempl/cfr/b3_ticket.mp4")} />
    <Shot a={827.5} b={834.4} vid={staticFile("broll/suempl/cfr/b1_produce.mp4")} />
    <Shot a={834.4} b={841.3} img={staticFile("img/suempl/n7_a.png")} />
    <Shot a={841.3} b={848.2} vid={staticFile("broll/suempl/cfr/b1_warehouse.mp4")} />
    <Shot a={848.2} b={855.1} img={staticFile("img/suempl/n7_b.png")} />
    <Shot a={855.1} b={862.0} vid={staticFile("broll/suempl/cfr/b2_apples.mp4")} />
    <Shot a={880.0} b={886.9} img={staticFile("img/suempl/n7_c.png")} />
    <Shot a={886.9} b={893.8} vid={staticFile("broll/suempl/cfr/b2_olives.mp4")} />
    <Shot a={893.8} b={900.6} img={staticFile("img/suempl/n7_d.png")} />
    <Shot a={913.4} b={919.9} vid={staticFile("broll/suempl/cfr/b1_cold.mp4")} />
    <Shot a={919.9} b={926.4} img={staticFile("img/suempl/n7_e.png")} />
    <Shot a={926.4} b={932.9} vid={staticFile("broll/suempl/cfr/b2_camara.mp4")} />
    <Shot a={932.9} b={939.5} img={staticFile("img/suempl/n7_f.png")} />
    <Shot a={945.0} b={948.4} img={staticFile("img/suempl/n7_g.png")} />
    <Shot a={959.5} b={965.0} img={staticFile("img/suempl/n8_b.png")} />
    <Audio src={staticFile("audio/suempl_voz.wav")} />
    <Grade />
    <Grain />
  </AbsoluteFill>
);
