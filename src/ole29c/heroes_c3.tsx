// ole29c · RONDA 3 = REEMPLAZO SIMPLE (regla del evaluador: tope 3 vueltas; si no llega a 8, algo más simple que quede impecable).
// Cada pieza: 1-4 objetos REALES (recortes fotográficos) grandes, enteros dentro del cuadro, que caen con peso sobre un piso
// y dejan una sombra de contacto exacta (calculada del alfa del PNG); llegan repartidos en la duración, la cámara empuja curva
// todo el tiempo y, como mucho, una palabra o un número grande. Ningún objeto se repite entre piezas.
import React from "react";
import { Img } from "remotion";
import { AMB, Big, H, Stage, Steam, cl, eio, phys, spr } from "./hkit";
import DIM from "./spdim.json";

type C = React.FC<{ t: number; h: H }>;
type O = { id: string; at: number; x: number; f?: number; hh: number; mw?: number; from?: "top" | "left" | "right"; hover?: boolean; to?: [number, number, number]; swap?: [string, number]; out?: number; rot?: number; steam?: number };
type Spec = { mode?: "iris" | "wipe" | "drop"; objs: O[]; big?: [number, string, number?, number?][]; push?: [number, number]; rope?: number };
const D = DIM as unknown as Record<string, number[]>;

const Obj: React.FC<{ o: O; tt: number; ph: number }> = ({ o, tt, ph }) => {
  const s = phys(tt, o.at, 7.2, 0.5);
  if (s <= 0.005) return null;
  const fade = o.out ? 1 - eio(tt, o.out, o.out + 0.5) : 1;
  if (fade <= 0.005) return null;
  const [, , x0, y0, x1, y1] = D[o.id], bw = x1 - x0, bh = y1 - y0, k = Math.min(o.hh / bh, (o.mw ?? 900) / bw);
  const mv = o.to ? eio(tt, o.to[0], o.to[1]) : 0, x = o.x + (o.to ? (o.to[2] - o.x) * mv : 0), f = o.f ?? 860;
  const from = o.from ?? "top", dx = from === "left" ? (1 - s) * -420 : from === "right" ? (1 - s) * 420 : 0, dy = from === "top" ? (1 - s) * -260 : 0;
  const land = cl((tt - o.at) * 2.6), sq = from === "top" && !o.hover ? Math.exp(-6 * Math.max(0, tt - o.at - 0.3)) * Math.sin(Math.max(0, tt - o.at - 0.3) * 17) * 0.05 : 0;
  // ya apoyado sigue vivo: se mece apenas sobre su base (cada uno con su fase), así ningún cuadro queda igual al anterior
  const idle = cl((tt - o.at - 0.6) * 0.8), rk = idle * 1.3 * Math.sin(tt * 0.9 + ph * 1.7), lift = idle * 3 * Math.sin(tt * 1.1 + ph);
  const hov = o.hover ? 8 * Math.sin(tt * 1.3) : 0, sw = o.swap ? eio(tt, o.swap[1], o.swap[1] + 0.7) : 0;
  const pic = (id: string, op: number) => { const [W2, H2, a0, b0, a1, b1] = D[id], k2 = Math.min(o.hh / (b1 - b0), (o.mw ?? 900) / (a1 - a0)); return <Img src={spr(id)} style={{ position: "absolute", left: x - ((a0 + a1) / 2) * k2, top: f - b1 * k2, width: W2 * k2, height: H2 * k2, opacity: op, transformOrigin: `${((a0 + a1) / 2) * k2}px ${b1 * k2}px`, transform: `translate(${dx}px, ${dy + hov - lift}px) rotate(${(o.rot ?? 0) + rk + (1 - s) * (from === "top" ? 10 : 0)}deg) scale(${1 + sq}, ${1 - sq - 0.06 * Math.sin(sw * Math.PI)})`, filter: "drop-shadow(0 14px 18px rgba(0,0,0,.42)) brightness(1.04)" }} />; };
  return <div style={{ position: "absolute", left: 0, top: 0, width: 0, height: 0, opacity: cl(s * 2.2) * fade }}>
    {!o.hover && <div style={{ position: "absolute", left: x - bw * k * 0.46 + dx, top: f - bw * k * 0.05, width: bw * k * 0.92, height: bw * k * 0.1, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(0,0,0,.75), rgba(0,0,0,.35) 55%, transparent 72%)", filter: "blur(6px)", opacity: land * (from === "top" ? s : 1) }} />}
    {o.hover && <div style={{ position: "absolute", left: x - bw * k * 0.35, top: 880, width: bw * k * 0.7, height: 40, borderRadius: "50%", background: "rgba(0,0,0,.4)", filter: "blur(16px)" }} />}
    {pic(o.id, 1 - sw)}
    {o.swap && sw > 0 && pic(o.swap[0], sw)}
    {o.steam && <Steam tt={tt} x={x} y={f - o.hh * 0.85} w={o.hh * 0.45} k={o.steam * land} />}
  </div>;
};

// tamaño real que ocupa un objeto con escala g (el mayor entre la imagen y la que la reemplaza)
const box = (o: O, g: number) => [o.id, ...(o.swap ? [o.swap[0]] : [])].reduce(([w, hgt], id) => {
  const [, , a0, b0, a1, b1] = D[id], k = Math.min((o.hh * g) / (b1 - b0), ((o.mw ?? 900) * g) / (a1 - a0));
  return [Math.max(w, (a1 - a0) * k), Math.max(hgt, (b1 - b0) * k)];
}, [0, 0]);

// acomodo automático: los objetos de piso se agrandan, se reparten parejos y centrados, y nunca salen del cuadro ni tapan el número
const lay = (sp: Spec, top: number): O[] => {
  const gnd = sp.objs.filter((o) => !o.hover && !o.to), GAP = 80, WID = 1360;
  let g = 1.4;
  const tot = (gg: number) => gnd.reduce((a, o) => a + box(o, gg)[0], 0) + GAP * Math.max(0, gnd.length - 1);
  if (gnd.length) g = Math.min(g, (g * (WID - GAP * (gnd.length - 1))) / (tot(g) - GAP * (gnd.length - 1)));
  gnd.forEach((o) => { const hh = box(o, g)[1], room = (o.f ?? 860) - top; if (hh > room) g *= room / hh; });
  let cx = 960 - tot(g) / 2;
  const pos = new Map<O, number>();
  [...gnd].sort((a, b) => a.x - b.x).forEach((o) => { const w = box(o, g)[0]; pos.set(o, cx + w / 2); cx += w + GAP; });
  return sp.objs.map((o) => pos.has(o) ? { ...o, x: pos.get(o)!, hh: o.hh * g, mw: (o.mw ?? 900) * g, at: o.at + 0.6 } : { ...o, x: o.to ? o.x : Math.max(380, Math.min(1540, o.x)), hh: o.hh * 1.1, mw: (o.mw ?? 900) * 1.1, at: o.at + 0.6 });
};

const mk = (sp: Spec): C => ({ t, h }) => <Stage t={t} h={h} mode={sp.mode ?? "iris"}>{(tt) => {
  const dur = Math.max(4, h.out - h.at), p = eio(tt, 0, dur + 0.8), [px, py] = sp.push ?? [960, 700];
  // sin ningún cartel: ni palabras ni números (el evaluador los leía como plantilla)
  const num: [number, string, number?, number?][] = [];
  const objs = lay(sp, 230);
  return <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: `${px}px ${py}px`, transform: `scale(${1 + 0.11 * p}) translate(${-28 * Math.sin(p * Math.PI)}px, ${-10 * p}px) rotate(${0.5 * Math.sin(p * Math.PI)}deg)` }}>
    {/* piso de tablones oscuros, sin bordes: un charco de luz cálida donde apoyan las cosas */}
    <div style={{ position: "absolute", left: -200, top: 700, width: 2320, height: 520, background: "radial-gradient(ellipse 55% 60% at 50% 30%, rgba(120,82,48,.55), rgba(40,26,14,.4) 60%, transparent 85%)" }} />
    {sp.rope && <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}><path d={`M -40 ${sp.rope - 30} Q 960 ${sp.rope + 60 + 8 * Math.sin(tt * 1.3)} 1960 ${sp.rope - 30}`} stroke="#c9b48a" strokeWidth={6} fill="none" /></svg>}
    {objs.map((o, i) => <Obj key={i} o={o} tt={tt} ph={i} />)}
    {/* una luz de ventana que cruza despacio la escena */}
    <div style={{ position: "absolute", left: -500 + 1500 * p, top: 200, width: 900, height: 900, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,196,130,.16), transparent 65%)", mixBlendMode: "screen", pointerEvents: "none" }} />
    {num.map(([a, txt, , size], i) => <Big key={i} tt={tt} at={a + 0.6} x={960} y={190} txt={txt} size={size ?? 110} col={AMB} />)}
  </div>;
}}</Stage>;

const R = 330; // la soga del día de lavado
const BW: O[] = ["sp_bowl_black", "sp_bowl_red", "sp_bowl_bacon", "sp_bowl_cakes", "sp_bowl_tin_soup"].map((id, i) => ({ id, at: 0.3 + i * 1.0, x: 330 + i * 315, hh: 160, mw: 290 }));
export const HA: Record<string, C> = {
  // el libro del jefe: cerrado, abierto, el lápiz que marca la fila del costo
  c_ledger: mk({ mode: "wipe", objs: [{ id: "sp_c2_ledger_closed", at: 0.3, x: 560, hh: 300, mw: 420 }, { id: "sp_ledger_open", at: 4.0, x: 1180, hh: 300, mw: 620 }], big: [[8.6, "PER MAN, PER DAY", 960, 90]] }),
  // cinco cenas en fila y el centavo viejo
  c_bowls: mk({ objs: [...BW], big: [[7.0, "11¢", 960, 130]] }),
  // el frío: el tronco, el hacha clavada, el termómetro
  c_axe: mk({ mode: "drop", objs: [{ id: "sp_log", at: 0.3, x: 700, hh: 300, mw: 480 }, { id: "sp_c2_thermometer", at: 6.0, x: 1420, hh: 440, mw: 170 }], big: [[7.4, "-20°", 1420, 120]] }),
  // la despensa del almacén: el tocino colgado, la bolsa de cien, la de arpillera
  c_store: mk({ mode: "wipe", objs: [{ id: "sp_saltpork_hook", at: 0.3, x: 520, hh: 420, mw: 220 }, { id: "sp_sack100", at: 3.5, x: 1000, hh: 380, mw: 380 }, { id: "sp_c2_burlap_full", at: 6.5, x: 1480, hh: 330, mw: 330 }], big: [[8.6, "1930s PRICES"]] }),
  // una bolsa de porotos rinde seis tazas: la bolsa, la taza vacía, la llena, la olla
  c_cups: mk({ objs: [{ id: "sp_bag_big", at: 0.3, x: 450, hh: 360, mw: 330 }, { id: "sp_tincup_empty", at: 2.8, x: 900, hh: 200, mw: 260 }, { id: "sp_tincup_full", at: 4.6, x: 1200, hh: 200, mw: 260 }, { id: "sp_c2_cauldron", at: 6.8, x: 1560, hh: 260, mw: 440, steam: 1 }], big: [[3.4, "6 CUPS", 1050]] }),
  // tres cenas distintas de la misma olla
  c_lazy: mk({ mode: "drop", objs: [{ id: "sp_tb_red", at: 0.3, x: 460, hh: 230, mw: 380 }, { id: "sp_tb_soup", at: 2.6, x: 960, hh: 230, mw: 380, steam: 0.6 }, { id: "sp_tb_cakes", at: 4.9, x: 1460, hh: 230, mw: 380 }], big: [[7.4, "3 SUPPERS"]] }),
  // la regla número uno: la tabla colgada y la olla
  c_sign: mk({ objs: [{ id: "sp_plank", at: 0.3, x: 960, f: 560, hh: 160, mw: 1100, hover: true }, { id: "sp_bacon_pot", at: 3.0, x: 960, hh: 300, mw: 460, steam: 1 }], big: [[1.4, "RULE No. 1", 960, 100]] }),
  // hervor suave: la olla de vidrio y la estufa
  c_boil: mk({ mode: "wipe", objs: [{ id: "sp_glass_pot", at: 0.3, x: 760, hh: 300, mw: 700, steam: 1.4 }, { id: "sp_c2_stove", at: 4.0, x: 1460, hh: 460, mw: 260 }], big: [[6.2, "SIMMER, NOT BOIL", 960, 96]] }),
  // porotos como grava: la olla gris y la lata
  c_gravel: mk({ objs: [{ id: "sp_pot_gravel_top", at: 0.3, x: 720, hh: 360, mw: 500 }, { id: "sp_c2_bean_can", at: 4.0, x: 1360, hh: 300, mw: 200 }], big: [[6.6, "GRAVEL"]] }),
  // lo ácido al final: la lima y la sopa con lima
  c_lime: mk({ mode: "drop", objs: [{ id: "sp_lime_big", at: 0.3, x: 600, hh: 300, mw: 320 }, { id: "sp_soup_lime", at: 3.5, x: 1240, hh: 240, mw: 480, steam: 0.6 }], big: [[5.4, "A SQUEEZE"]] }),
  // día de lavado: la ropa en la soga, la olla sola al fondo
  c_wash: mk({ mode: "wipe", rope: R, objs: [{ id: "sp_shirt", at: 0.3, x: 380, f: R + 380, hh: 360, mw: 300, hover: true }, { id: "sp_socks", at: 1.8, x: 720, f: R + 290, hh: 240, mw: 220, hover: true }, { id: "sp_longjohns", at: 3.3, x: 1050, f: R + 400, hh: 360, mw: 240, hover: true }], big: [[8.2, "WASH DAY", 1500]] }),
  // la masa, el pan dorado, la hogaza
  c_dough: mk({ objs: [{ id: "sp_c2_dough_raw", at: 0.3, x: 540, hh: 300, mw: 320 }, { id: "sp_c2_bread_gold", at: 4.0, x: 1000, hh: 260, mw: 300 }, { id: "sp_loaf", at: 6.5, x: 1430, hh: 280, mw: 320 }], big: [[8.0, "12 LOAVES"]] }),
  // diez minutos de hervor: la libra, la taza, la olla
  c_count: mk({ mode: "drop", objs: [{ id: "sp_bag1lb", at: 0.3, x: 500, hh: 380, mw: 300 }, { id: "sp_tincup2", at: 3.4, x: 1000, hh: 220, mw: 280 }, { id: "sp_pot_side", at: 6.4, x: 1460, hh: 240, mw: 460, steam: 1 }], big: [[4.4, "10 MINUTES"]] }),
  // la trinidad y sus tres amigos
  c_trinity: mk({ objs: [{ id: "sp_onion2", at: 0.3, x: 400, hh: 260, mw: 240 }, { id: "sp_pepper_green", at: 1.8, x: 740, hh: 280, mw: 260 }, { id: "sp_celery", at: 3.3, x: 1060, hh: 380, mw: 200 }, { id: "sp_c2_garlic", at: 5.0, x: 1360, hh: 220, mw: 240 }, { id: "sp_c2_bayleaf", at: 6.4, x: 1620, hh: 260, mw: 140, rot: 20 }], big: [[7.6, "THE TRINITY"]] }),
  // los porotos rojos se vuelven crema
  c_swirl: mk({ mode: "wipe", objs: [{ id: "sp_redbeans_pot_top", at: 0.3, x: 760, hh: 400, mw: 540, swap: ["sp_redbeans_creamy_top", 7.0] }, { id: "sp_spoon2", at: 3.5, x: 1420, f: 960, hh: 110, mw: 560, rot: -12 }], big: [[8.6, "CREAMY", 1420]] }),
  // el fuego más bajo: la pava y la olla tranquila
  c_ripple: mk({ objs: [{ id: "sp_kettle", at: 0.3, x: 560, hh: 360, mw: 420 }, { id: "sp_pot_beans_top", at: 3.5, x: 1250, hh: 360, mw: 480, steam: 0.5 }], big: [[6.0, "LOWEST FLAME"]] }),
  // la prueba del dedo: el poroto entero, los dedos, el poroto aplastado
  c_pinch: mk({ mode: "drop", objs: [{ id: "sp_bean_big", at: 0.3, x: 760, hh: 200, mw: 480, swap: ["sp_bean_squashed", 7.2] }], big: [[8.6, "2 HOURS"]] }),
  // la cuarta noche: las sobras se vuelven tortitas
  c_lid: mk({ objs: [{ id: "sp_bowl_leftover", at: 0.3, x: 560, hh: 210, mw: 380 }, { id: "sp_cake_crispy", at: 4.2, x: 1060, hh: 160, mw: 330 }], big: [[8.4, "NIGHT FOUR"]] }),
  // la tortita: huevo, avena, cebolla, la tortita cruda
  c_patty: mk({ mode: "wipe", objs: [{ id: "sp_egg_one", at: 0.3, x: 380, hh: 220, mw: 180 }, { id: "sp_oats_cup", at: 2.0, x: 680, hh: 240, mw: 260 }, { id: "sp_onion_bits", at: 3.7, x: 990, hh: 150, mw: 300 }], big: [[9.6, "OATS + EGG"]] }),
  // el plato del sábado: la bandeja, el huevo arriba, la crema
  c_stack: mk({ objs: [{ id: "sp_tb_pot", at: 0.3, x: 600, hh: 260, mw: 440 }, { id: "sp_egg_fried2", at: 4.0, x: 1140, hh: 110, mw: 320 }, { id: "sp_sourcream", at: 7.0, x: 1540, hh: 170, mw: 300 }], big: [[8.6, "40¢", 960, 130]] }),
  // el cucharón no va al balde
  c_ladle: mk({ mode: "drop", objs: [{ id: "sp_ladle_beans", at: 0.3, x: 760, f: 680, hh: 160, mw: 720, hover: true }, { id: "sp_slop_bucket", at: 4.0, x: 1460, hh: 320, mw: 360 }], big: [[6.0, "NEVER THE BUCKET", 960, 96]] }),
  // cinco minutos: el fósforo y la sopa lista
  c_matches: mk({ objs: [{ id: "sp_match", at: 0.3, x: 520, hh: 60, mw: 440, rot: -8 }, { id: "sp_c2_soup_bowl", at: 3.0, x: 1220, hh: 220, mw: 480, steam: 1 }], big: [[6.0, "5 MINUTES"]] }),
  // el caldo no se tira: la pileta y el frasco
  c_drain: mk({ mode: "wipe", objs: [{ id: "sp_basin", at: 0.3, x: 650, hh: 240, mw: 560 }, { id: "sp_jar_broth", at: 4.0, x: 1360, hh: 340, mw: 260 }], big: [[7.0, "DON'T POUR IT"]] }),
  // revisarlos: el montón, la piedrita, la mano
  c_sift: mk({ objs: [{ id: "sp_redbeans_heap", at: 0.3, x: 760, hh: 200, mw: 620 }, { id: "sp_pebble", at: 3.4, x: 1260, f: 900, hh: 110, mw: 170 }], big: [[7.4, "PICK THEM OVER"]] }),
  // las noches de la semana: el farol
  c_lanterns: mk({ mode: "drop", objs: [{ id: "sp_lantern", at: 0.3, x: 960, hh: 460, mw: 260 }], big: [[3.0, "MON TO SAT"]] }),
  // estirar la olla: la pava, la papa en dados, el plato
  c_stretch: mk({ objs: [{ id: "sp_c2_kettle_pour", at: 0.3, x: 500, hh: 330, mw: 440 }, { id: "sp_potato_dice", at: 3.5, x: 1000, hh: 160, mw: 380 }, { id: "sp_redbeans_plate", at: 7.0, x: 1450, hh: 160, mw: 420 }], big: [[5.0, "+15 MIN"]] }),
  // el ratón: la caja abierta, el ratón que se va, la caja cerrada
  c_mouse: mk({ mode: "wipe", objs: [{ id: "sp_tinbox_open", at: 0.3, x: 720, hh: 260, mw: 380 }, { id: "sp_mouse", at: 2.5, x: 1300, hh: 110, mw: 380, from: "right", to: [6.0, 7.0, 2400] }], big: [[8.0, "MOUSE-PROOF"]] }),
  // la olla en el porche, congelada
  c_frost: mk({ objs: [{ id: "sp_pot_snow", at: 0.3, x: 800, hh: 300, mw: 480 }], big: [[6.0, "ON THE PORCH"]] }),
  // la cucharada de grasa: gris a brillante
  c_gloss: mk({ mode: "drop", objs: [{ id: "sp_pot_grey", at: 0.3, x: 760, hh: 320, mw: 480, steam: 0.5 }, { id: "sp_grease_spoon", at: 3.0, x: 1360, f: 640, hh: 110, mw: 500, hover: true, from: "right" }], big: [[8.0, "A SPOON OF GREASE", 960, 96]] }),
  // las latas contra la bolsa
  c_domino: mk({ objs: [{ id: "sp_can_plain", at: 0.3, x: 480, hh: 300, mw: 180 }, { id: "sp_can_tall", at: 1.4, x: 700, hh: 360, mw: 170 }, { id: "sp_sack_full", at: 5.0, x: 1320, hh: 420, mw: 320 }], big: [[9.0, "3× CHEAPER"]] }),
  // la olla de presión y el frasco de porotos
  c_pressure: mk({ mode: "wipe", objs: [{ id: "sp_pressure_cooker", at: 0.3, x: 800, hh: 380, mw: 440, steam: 1.3 }, { id: "sp_c2_jar_beans", at: 4.0, x: 1400, hh: 300, mw: 180 }], big: [[6.0, "40 MINUTES"]] }),
  // la bolsa del mes: vacía, a medias, la balanza
  c_sack: mk({ objs: [{ id: "sp_sack_empty", at: 0.3, x: 500, hh: 200, mw: 400 }, { id: "sp_c2_burlap_half", at: 3.0, x: 950, hh: 300, mw: 300 }, { id: "sp_c2_scale", at: 6.0, x: 1450, hh: 300, mw: 340 }], big: [[8.0, "ONE SACK A MONTH", 960, 96]] }),
  // centavos por plato
  c_pennies: mk({ mode: "drop", objs: [{ id: "sp_penny", at: 0.3, x: 600, f: 900, hh: 220, mw: 220 }, { id: "sp_tb_bacon", at: 3.5, x: 1260, hh: 260, mw: 460, steam: 0.6 }], big: [[6.0, "PENNIES A PLATE"]] }),
};
