// GENERADO por build_cmepanel30.mjs — no editar a mano.
import React from "react";
import { Clip, Foto } from "./Piezas";
import { MovS1Trailer } from "./MovS1Trailer";
import { MovS2Micro } from "./MovS2Micro";
import { MovS3Ernesto } from "./MovS3Ernesto";
import { MovS4Pinza } from "./MovS4Pinza";
import { MovS4Espina } from "./MovS4Espina";
import { MovS6Cobra } from "./MovS6Cobra";
import { MovS7Oeste } from "./MovS7Oeste";
import { MovS7Sur } from "./MovS7Sur";
import { MovS11Numeros } from "./MovS11Numeros";
import { MovS12Cierre } from "./MovS12Cierre";

export type Cue = { key: string; start: number; dur: number; kind: string; src: string; seed: number };
export const CUES: Cue[] = [
  { key: "e0", start: 2611, dur: 150, kind: "clip", src: "broll/cmepanel30/cmep30_s10_clip_claudio_cierre.mp4", seed: 11 },
  { key: "e1", start: 3317, dur: 151, kind: "clip", src: "broll/cmepanel30/cmep30_s2_clip_claudio_levanta_pinza.mp4", seed: 48 },
  { key: "e2", start: 3468, dur: 135, kind: "foto", src: "img/cmepanel30/cmep30_s2_clip_claudio_levanta_pinza.png", seed: 85 },
  { key: "e3", start: 3965, dur: 180, kind: "foto", src: "img/cmepanel30/cmep30_s2_factura_buzon.png", seed: 122 },
  { key: "e4", start: 4758, dur: 151, kind: "clip", src: "broll/cmepanel30/cmep30_s2_clip_saca_soportes.mp4", seed: 159 },
  { key: "e5", start: 4909, dur: 135, kind: "foto", src: "img/cmepanel30/cmep30_s2_clip_saca_soportes.png", seed: 196 },
  { key: "e6", start: 5377, dur: 151, kind: "clip", src: "broll/cmepanel30/cmep30_s2_clip_gira_cajita_mano.mp4", seed: 233 },
  { key: "e7", start: 5528, dur: 135, kind: "foto", src: "img/cmepanel30/cmep30_s2_clip_gira_cajita_mano.png", seed: 270 },
  { key: "e8", start: 7490, dur: 151, kind: "clip", src: "broll/cmepanel30/cmep30_s2_clip_claudio_niega_cable_suicida.mp4", seed: 307 },
  { key: "e9", start: 7641, dur: 135, kind: "foto", src: "img/cmepanel30/cmep30_s2_clip_claudio_niega_cable_suicida.png", seed: 344 },
  { key: "e10", start: 8141, dur: 180, kind: "foto", src: "img/cmepanel30/cmep30_s3_conectores_union.png", seed: 381 },
  { key: "e11", start: 10333, dur: 235, kind: "foto", src: "img/cmepanel30/cmep30_s4_claudio_agachado_cable.png", seed: 418 },
  { key: "e12", start: 14080, dur: 180, kind: "foto", src: "img/cmepanel30/cmep30_s5_casa_quieta_claudio.png", seed: 455 },
  { key: "e13", start: 14767, dur: 150, kind: "clip", src: "broll/cmepanel30/cmep30_s9_clip_transformador.mp4", seed: 492 },
  { key: "e14", start: 14917, dur: 135, kind: "foto", src: "img/cmepanel30/cmep30_s9_clip_transformador.png", seed: 529 },
  { key: "e15", start: 15626, dur: 180, kind: "foto", src: "img/cmepanel30/cmep30_s5_telefono_contra_medidor.png", seed: 566 },
  { key: "e16", start: 16324, dur: 180, kind: "foto", src: "img/cmepanel30/cmep30_s5_cta_hoja_60aparatos.png", seed: 603 },
  { key: "e17", start: 17024, dur: 151, kind: "clip", src: "broll/cmepanel30/cmep30_s6_clip_claudio_sonrie_disco.mp4", seed: 640 },
  { key: "e18", start: 17175, dur: 135, kind: "foto", src: "img/cmepanel30/cmep30_s6_clip_claudio_sonrie_disco.png", seed: 677 },
  { key: "e19", start: 17650, dur: 150, kind: "clip", src: "broll/cmepanel30/cmep30_s6_clip_disco_frena_invierte.mp4", seed: 714 },
  { key: "e20", start: 18278, dur: 180, kind: "foto", src: "img/cmepanel30/cmep30_s6_trinquete_pieza_trapo.png", seed: 751 },
  { key: "e21", start: 21308, dur: 240, kind: "clip", src: "broll/cmepanel30/cmep30_s7_clip_claudio_mira_cielo.mp4", seed: 788 },
  { key: "e22", start: 21548, dur: 111, kind: "foto", src: "img/cmepanel30/cmep30_s7_clip_claudio_mira_cielo.png", seed: 825 },
  { key: "e23", start: 21659, dur: 300, kind: "foto", src: "img/cmepanel30/cmep30_s7_pinza_numero_bajo_nublado.png", seed: 862 },
  { key: "e24", start: 22177, dur: 240, kind: "clip", src: "broll/cmepanel30/cmep30_s5_clip_claudio_recorre.mp4", seed: 899 },
  { key: "e25", start: 25816, dur: 240, kind: "clip", src: "broll/cmepanel30/cmep30_s5_clip_cta_hojea_cuaderno.mp4", seed: 936 },
  { key: "e26", start: 26056, dur: 199, kind: "foto", src: "img/cmepanel30/cmep30_s5_clip_cta_hojea_cuaderno.png", seed: 973 },
  { key: "e27", start: 26255, dur: 240, kind: "clip", src: "broll/cmepanel30/cmep30_s8_clip_claudio_bateria_taladro.mp4", seed: 1010 },
  { key: "e28", start: 26495, dur: 219, kind: "foto", src: "img/cmepanel30/cmep30_s8_clip_claudio_bateria_taladro.png", seed: 1047 },
  { key: "e29", start: 26714, dur: 240, kind: "clip", src: "broll/cmepanel30/cmep30_s8_clip_claudio_gira_temporizador.mp4", seed: 1084 },
  { key: "e30", start: 26954, dur: 267, kind: "foto", src: "img/cmepanel30/cmep30_s8_clip_claudio_gira_temporizador.png", seed: 1121 },
  { key: "e31", start: 27221, dur: 300, kind: "foto", src: "img/cmepanel30/cmep30_s2_panel_nublado.png", seed: 1158 },
  { key: "e32", start: 27547, dur: 300, kind: "foto", src: "img/cmepanel30/cmep30_s8_claudio_garaje_noche_lampara.png", seed: 1195 },
  { key: "e33", start: 27982, dur: 300, kind: "foto", src: "img/cmepanel30/cmep30_s8_dos_casas_anochecer.png", seed: 1232 },
  { key: "e34", start: 28345, dur: 240, kind: "clip", src: "broll/cmepanel30/cmep30_s1_clip_claudio_niega_cabeza.mp4", seed: 1269 },
  { key: "e35", start: 28585, dur: 109, kind: "foto", src: "img/cmepanel30/cmep30_s1_clip_claudio_niega_cabeza.png", seed: 1306 },
  { key: "e36", start: 28694, dur: 300, kind: "foto", src: "img/cmepanel30/cmep30_s8_claudio_garaje_noche_lampara.png", seed: 1343 },
  { key: "e37", start: 29083, dur: 240, kind: "clip", src: "broll/cmepanel30/cmep30_s9_clip_claudio_cocina.mp4", seed: 1380 },
  { key: "e38", start: 29323, dur: 133, kind: "foto", src: "img/cmepanel30/cmep30_s9_clip_claudio_cocina.png", seed: 1417 },
  { key: "e39", start: 29456, dur: 240, kind: "clip", src: "broll/cmepanel30/cmep30_s9_clip_baja_interruptor.mp4", seed: 1454 },
  { key: "e40", start: 29696, dur: 176, kind: "foto", src: "img/cmepanel30/cmep30_s9_clip_baja_interruptor.png", seed: 1491 },
  { key: "e41", start: 29872, dur: 300, kind: "foto", src: "img/cmepanel30/cmep30_s11_cocina_apagon_linterna.png", seed: 1528 },
  { key: "e42", start: 30210, dur: 300, kind: "foto", src: "img/cmepanel30/cmep30_s9_claudio_farol.png", seed: 1565 },
  { key: "e43", start: 30563, dur: 300, kind: "foto", src: "img/cmepanel30/cmep30_s9_cable_suicida_banco.png", seed: 1602 },
  { key: "e44", start: 30979, dur: 300, kind: "foto", src: "img/cmepanel30/cmep30_s9_patas_macho.png", seed: 1639 },
  { key: "e45", start: 31360, dur: 240, kind: "clip", src: "broll/cmepanel30/cmep30_s9_clip_operario_poste.mp4", seed: 1676 },
  { key: "e46", start: 31600, dur: 229, kind: "foto", src: "img/cmepanel30/cmep30_s9_clip_operario_poste.png", seed: 1713 },
  { key: "e47", start: 31829, dur: 300, kind: "foto", src: "img/cmepanel30/cmep30_s9_cta_cuaderno.png", seed: 1750 },
  { key: "e48", start: 32260, dur: 240, kind: "clip", src: "broll/cmepanel30/cmep30_s9_clip_cta_cuaderno.mp4", seed: 1787 },
  { key: "e49", start: 32500, dur: 210, kind: "foto", src: "img/cmepanel30/cmep30_s9_clip_cta_cuaderno.png", seed: 1824 },
  { key: "e50", start: 32710, dur: 240, kind: "clip", src: "broll/cmepanel30/cmep30_s10_clip_factura_macro.mp4", seed: 1861 },
  { key: "e51", start: 32950, dur: 96, kind: "foto", src: "img/cmepanel30/cmep30_s10_clip_factura_macro.png", seed: 1898 },
  { key: "e52", start: 33046, dur: 300, kind: "foto", src: "img/cmepanel30/cmep30_s11_pregunta_escrito.png", seed: 1935 },
  { key: "e53", start: 33440, dur: 240, kind: "clip", src: "broll/cmepanel30/cmep30_s10_clip_claudio_anota.mp4", seed: 1972 },
  { key: "e54", start: 33680, dur: 65, kind: "foto", src: "img/cmepanel30/cmep30_s10_clip_claudio_anota.png", seed: 2009 },
  { key: "e55", start: 33745, dur: 240, kind: "clip", src: "broll/cmepanel30/cmep30_s10_clip_panel_nube.mp4", seed: 2046 },
  { key: "e56", start: 33985, dur: 67, kind: "foto", src: "img/cmepanel30/cmep30_s10_clip_panel_nube.png", seed: 2083 },
  { key: "e57", start: 34052, dur: 300, kind: "foto", src: "img/cmepanel30/cmep30_s10_micro_repuesto.png", seed: 2120 },
  { key: "e58", start: 34508, dur: 240, kind: "clip", src: "broll/cmepanel30/cmep30_s12_clip_recorre_fila.mp4", seed: 2157 },
  { key: "e59", start: 34748, dur: 101, kind: "foto", src: "img/cmepanel30/cmep30_s12_clip_recorre_fila.png", seed: 2194 },
  { key: "e60", start: 34849, dur: 240, kind: "clip", src: "broll/cmepanel30/cmep30_s10_clip_techo_instaladores.mp4", seed: 2231 },
  { key: "e61", start: 35089, dur: 186, kind: "foto", src: "img/cmepanel30/cmep30_s10_clip_techo_instaladores.png", seed: 2268 },
  { key: "e62", start: 35275, dur: 240, kind: "clip", src: "broll/cmepanel30/cmep30_s5_clip_pinza_digitos.mp4", seed: 2305 },
  { key: "e63", start: 35515, dur: 247, kind: "foto", src: "img/cmepanel30/cmep30_s5_clip_pinza_digitos.png", seed: 2342 },
  { key: "e64", start: 35762, dur: 240, kind: "clip", src: "broll/cmepanel30/cmep30_s11_clip_mira_aire.mp4", seed: 2379 },
  { key: "e65", start: 36002, dur: 63, kind: "foto", src: "img/cmepanel30/cmep30_s11_clip_mira_aire.png", seed: 2416 },
  { key: "e66", start: 36065, dur: 300, kind: "foto", src: "img/cmepanel30/cmep30_s11_carta_compania.png", seed: 2453 },
  { key: "e67", start: 36412, dur: 240, kind: "clip", src: "broll/cmepanel30/cmep30_s12_clip_camina_al_medidor.mp4", seed: 2490 },
  { key: "e68", start: 36652, dur: 270, kind: "foto", src: "img/cmepanel30/cmep30_s12_clip_camina_al_medidor.png", seed: 2527 },
  { key: "e69", start: 40608, dur: 300, kind: "foto", src: "img/cmepanel30/cmep30_s12_lam_cenital_hoja.png", seed: 2564 },
  { key: "e70", start: 41125, dur: 300, kind: "foto", src: "img/cmepanel30/cmep30_s12_lam_mano_al_costado.png", seed: 2601 },
  { key: "e71", start: 41495, dur: 240, kind: "clip", src: "broll/cmepanel30/cmep30_s2_clip_pinza_sube_numero.mp4", seed: 2638 },
  { key: "e72", start: 41735, dur: 270, kind: "foto", src: "img/cmepanel30/cmep30_s2_clip_pinza_sube_numero.png", seed: 2675 },
  { key: "e73", start: 42038, dur: 300, kind: "foto", src: "img/cmepanel30/cmep30_s6_claudio_su_medidor.png", seed: 2712 },
  { key: "e74", start: 42545, dur: 300, kind: "foto", src: "img/cmepanel30/cmep30_s10_dos_facturas.png", seed: 2749 },
  { key: "e75", start: 42936, dur: 240, kind: "clip", src: "broll/cmepanel30/cmep30_s11_clip_parpadeo_medidor.mp4", seed: 2786 },
  { key: "e76", start: 43176, dur: 270, kind: "foto", src: "img/cmepanel30/cmep30_s11_clip_parpadeo_medidor.png", seed: 2823 },
  { key: "e77", start: 43457, dur: 240, kind: "foto", src: "img/cmepanel30/cmep30_s12_senala_fila_dedo.png", seed: 2860 },
];

export type Mov = { key: string; from: number; dur: number; comp: string };
export const MOVS: Mov[] = [
  { key: "m0", from: 0, dur: 2452, comp: "MovS1Trailer" },
  { key: "m1", from: 5885, dur: 1605, comp: "MovS2Micro" },
  { key: "m2", from: 8666, dur: 1667, comp: "MovS3Ernesto" },
  { key: "m3", from: 10429, dur: 1684, comp: "MovS4Pinza" },
  { key: "m4", from: 12113, dur: 1817, comp: "MovS4Espina" },
  { key: "m5", from: 18695, dur: 2340, comp: "MovS6Cobra" },
  { key: "m6", from: 22376, dur: 1910, comp: "MovS7Oeste" },
  { key: "m7", from: 24286, dur: 1530, comp: "MovS7Sur" },
  { key: "m8", from: 36760, dur: 1775, comp: "MovS11Numeros" },
  { key: "m9", from: 38535, dur: 1875, comp: "MovS12Cierre" },
];

export const renderCue = (c: Cue) =>
  c.kind === "clip" ? <Clip src={c.src} /> : <Foto src={c.src} seed={c.seed} />;

export const renderMov = (m: Mov) => {
  switch (m.comp) {
    case "MovS1Trailer": return <MovS1Trailer />;
    case "MovS2Micro": return <MovS2Micro />;
    case "MovS3Ernesto": return <MovS3Ernesto />;
    case "MovS4Pinza": return <MovS4Pinza />;
    case "MovS4Espina": return <MovS4Espina />;
    case "MovS6Cobra": return <MovS6Cobra />;
    case "MovS7Oeste": return <MovS7Oeste />;
    case "MovS7Sur": return <MovS7Sur />;
    case "MovS11Numeros": return <MovS11Numeros />;
    case "MovS12Cierre": return <MovS12Cierre />;
    default: return null;
  }
};
