// jprefri · héroes en capas: 1) cama = foto borrosa y oscura; 2) material real = impresión con borde blanco y sombra; 3) marca roja dibujada;
// 4) texto corto. Ningún objeto dibujado con CSS: todo es foto real.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate } from "remotion";

type HeroDef = { bed: string; print: string; chip: string; note?: string; mark?: boolean };
export const HEROES: Record<string, HeroDef> = {
  PageSixteen: { bed: "img/jprefri/n_hook_tidy_fridge.png", print: "img/jprefri/page16.png", chip: "REGLA 8 · PÁGINA 16", mark: true },
  SeventyFull: { bed: "img/jprefri/n_u1_full_fridge_top.png", print: "img/jprefri/n_u1_air_gap.png", chip: "70 %", note: "el aire tiene que pasar", mark: true },
  DoorWarm: { bed: "img/jprefri/n_u3_door_warm.png", print: "img/jprefri/l_u3_milk_out.png", chip: "LA PUERTA = LO QUE AGUANTA", mark: true },
  PaperLeaves: { bed: "img/jprefri/n_u5_bag_wilted.png", print: "img/jprefri/n_u5_damp_paper_box.png", chip: "7 DÍAS", note: "papel apenas húmedo", mark: true },
  StandUp: { bed: "img/jprefri/n_mom_drawer_full.png", print: "img/jprefri/n_u6_leeks_standing.png", chip: "COMO EN LA HUERTA", mark: false },
  DateFront: { bed: "img/jprefri/n_u7_dated_containers.png", print: "img/jprefri/n_u7_old_container_front.png", chip: "LO VIEJO ADELANTE", mark: true },
  OneShelf: { bed: "img/jprefri/n_u11_one_shelf_clean.png", print: "img/jprefri/l_u11_wipe_shelf.png", chip: "UN ESTANTE POR DÍA", mark: true },
  QR: { bed: "img/jprefri/n_cta_qr_card.png", print: "img/jprefri/qr.png", chip: "11 arreglos · menos que una visita", mark: false },
};

export const Hero: React.FC<{ name: string; d: number }> = ({ name, d }) => {
  const H = HEROES[name];
  const f = useCurrentFrame();
  if (!H) return null;
  const pin = interpolate(f, [0, 12], [0.9, 1], { extrapolateRight: "clamp" });
  const drift = interpolate(f, [0, d], [1.0, 1.06], { extrapolateRight: "clamp" });
  const ring = interpolate(f, [10, 40], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const op = interpolate(f, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#111" }}>
      {/* cama */}
      <AbsoluteFill style={{ transform: `scale(${1.1 * drift})`, filter: "blur(16px) brightness(0.55)" }}>
        <Img src={staticFile(H.bed)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      {/* impresión con borde blanco y sombra */}
      <div style={{ position: "absolute", left: 360, top: 120, width: 1200, height: 700, transform: `scale(${pin * drift})`,
        opacity: op, background: "#fff", padding: 14, boxShadow: "0 18px 50px rgba(0,0,0,.6)" }}>
        <Img src={staticFile(H.print)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      {/* marca roja dibujada */}
      {H.mark ? (
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
          <ellipse cx={960} cy={470} rx={330} ry={210} fill="none" stroke="#C8102E" strokeWidth={14}
            strokeLinecap="round" strokeDasharray={1400} strokeDashoffset={1400 * ring} transform="rotate(-4 960 470)" />
        </svg>
      ) : null}
      {H.note ? (
        <div style={{ position: "absolute", right: 120, top: 150, background: "#fff7e6", color: "#222", fontFamily: "Comic Sans MS, Arial, sans-serif",
          fontSize: 44, padding: "18px 26px", transform: "rotate(-3deg)", boxShadow: "0 8px 20px rgba(0,0,0,.35)", opacity: op }}>{H.note}</div>
      ) : null}
      <div style={{ position: "absolute", left: 70, bottom: 80, background: "#C8102E", color: "#fff", fontFamily: "Arial Black, Arial, sans-serif",
        fontWeight: 900, fontSize: 52, padding: "14px 26px", borderRadius: 8, opacity: op, boxShadow: "0 6px 18px rgba(0,0,0,.45)" }}>{H.chip}</div>
    </AbsoluteFill>
  );
};
