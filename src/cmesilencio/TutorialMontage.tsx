// TutorialMontage — reemplaza los movimientos 3D por una secuencia de planos reales.
// La intención es la de un tutorial casero de YouTube: material, manos, medición y resultado.
// Cada clip Agnes entra como un plano corto; cada foto tiene un movimiento de cámara mínimo.
import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { F_BODY, F_DISPLAY, V, rgba } from "./VoltStage";

type Media = {
  src: string;
  kind: "photo" | "clip";
  dir?: -1 | 1;
};

const P = (src: string, dir: -1 | 1 = 1): Media => ({ src, kind: "photo", dir });
const C = (src: string, dir: -1 | 1 = 1): Media => ({ src, kind: "clip", dir });

// Los cuatro tramos que antes eran gráficos de gabinete. Cada pool mezcla fotos del rodaje
// con clips Agnes del mismo momento, para que la explicación siempre vuelva al objeto real.
const MONTAGES = {
  MovTercios: [
    P("img/cmesilencio_v3/v3_29_motor_aluminio.jpg", -1),
    C("broll/cmesilencio/cms_s2_gira_caja_banco.mp4"),
    P("img/cmesilencio_v3/v3_13_codo_escape.jpg"),
    C("broll/cmesilencio/cms_s2_dos_bocas_diagonal.mp4", -1),
    C("broll/cmesilencio/cms_s2_nudillo_golpea_tapa.mp4"),
    P("img/cmesilencio_v3/v3_30_rejilla_fan.jpg", -1),
    C("broll/cmesilencio/cms_s2_fibra_lana_corriente.mp4"),
    P("img/cmesilencio_v3/v3_06_sonometro_madera.jpg"),
    P("img/cmesilencio_v4/v4_01_claudio_mide_caja.jpg", -1),
  ],
  MovNumeros: [
    P("img/cmesilencio_v3/v3_29_motor_aluminio.jpg"),
    C("broll/cmesilencio/cms_s4_rejilla_tapada_hojas.mp4", -1),
    P("img/cmesilencio_v3/v3_30_rejilla_fan.jpg", -1),
    C("broll/cmesilencio/cms_s4_tapa_boca_panel.mp4"),
    C("broll/cmesilencio/cms_s4_sonda_termometro_lana.mp4", -1),
  ],
  MovAgujero: [
    P("img/cmesilencio_v3/v3_35_masa_bloque.jpg", -1),
    C("broll/cmesilencio/cms_s5_bote_madera_gruesa.mp4"),
    P("img/cmesilencio_v3/v3_09_lana_mineral.jpg"),
    C("broll/cmesilencio/cms_s5_mano_hoja_cruda.mp4", -1),
    P("img/cmesilencio_v3/v3_12_interior_caja_abierta.jpg", -1),
    C("broll/cmesilencio/cms_s5_bote_se_hunde.mp4"),
    P("img/cmesilencio_v3/v3_15_regla_hueco.jpg"),
    C("broll/cmesilencio/cms_s5_dedo_rendija_junta.mp4", -1),
    P("img/cmesilencio_v4/v4_02_taladra_agujero.jpg", -1),
    C("broll/cmesilencio/cms_s5_luz_por_rendija.mp4"),
  ],
  MovDieciocho: [
    P("img/cmesilencio_v3/v3_42_pared_linea.jpg", -1),
    C("broll/cmesilencio/cms_s14_fondo_terreno_mira.mp4"),
    P("img/cmesilencio_v3/v3_54_comparacion_distancia.jpg"),
    C("broll/cmesilencio/cms_s14_desenrolla_cable_naranja.mp4", -1),
    P("img/cmesilencio_v3/v3_55_claudio_ajusta.jpg", -1),
    C("broll/cmesilencio/cms_s14_manos_marco_pesa.mp4"),
    P("img/cmesilencio_v3/v3_20_generador_pared.jpg"),
    C("broll/cmesilencio/cms_s14_cable_fino_recalentado.mp4", -1),
    P("img/cmesilencio_v3/v3_56_pared_ventana_noche.jpg", -1),
    C("broll/cmesilencio/cms_s14_sala_hablan_tranquilos.mp4"),
  ],
} as const;

export type TutorialMontageKind = keyof typeof MONTAGES;

const MotionFrame: React.FC<{ item: Media; frames: number; index: number }> = ({ item, frames, index }) => {
  const frame = useCurrentFrame();
  const D = Math.max(2, frames);
  const enter = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad),
  });
  const exit = interpolate(frame, [Math.max(11, D - 12), D], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad),
  });
  const opacity = Math.min(enter, exit);
  const t = interpolate(frame, [0, D], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.22, 0.61, 0.28, 1),
  });
  const dir = item.dir ?? 1;
  const scale = item.kind === "photo" ? 1.025 + t * 0.045 : 1.012 + t * 0.018;
  const x = dir * (-0.55 + t * 1.1) + Math.sin((frame + index * 19) / 83) * 0.16;
  const y = Math.cos((frame + index * 13) / 91) * 0.12;
  const mediaStyle: React.CSSProperties = {
    width: "100%", height: "100%", objectFit: "cover", display: "block", opacity,
    transform: `scale(${scale.toFixed(4)}) translate(${x.toFixed(3)}%, ${y.toFixed(3)}%)`,
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "#151711", overflow: "hidden", opacity }}>
      {item.kind === "clip" ? (
        <OffthreadVideo src={staticFile(item.src)} muted style={mediaStyle} />
      ) : (
        <Img src={staticFile(item.src)} style={mediaStyle} />
      )}
      <AbsoluteFill style={{
        background: "linear-gradient(180deg, rgba(0,0,0,0.02) 52%, rgba(0,0,0,0.34) 100%)",
        pointerEvents: "none",
      }} />
    </AbsoluteFill>
  );
};

/**
 * Un tramo real, sin diagramas, tarjetas ni fondos 3D.
 * `duration` coincide con la duración de la Sequence que lo contiene y se pasa desde el build
 * para que el corte de cada plano sea determinista en todos los chunks del FARM.
 */
export const TutorialMontage: React.FC<{ kind: TutorialMontageKind; duration: number }> = ({ kind, duration }) => {
  const items = MONTAGES[kind];
  const slot = Math.max(2, Math.ceil(duration / items.length));
  const overlap = 12;

  return (
    <AbsoluteFill style={{ backgroundColor: "#151711", overflow: "hidden" }}>
      {items.map((item, i) => {
        const from = i * slot;
        if (from >= duration) return null;
        const frames = Math.max(2, Math.min(slot + overlap, duration - from));
        return (
          <Sequence key={`${kind}-${i}`} from={from} durationInFrames={frames} layout="none">
            <MotionFrame item={item} frames={frames} index={i} />
          </Sequence>
        );
      })}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <div style={{
          position: "absolute", left: "4.8%", bottom: "5.2%", display: "flex", alignItems: "center", gap: 12,
          opacity: 0.92, color: V.white,
        }}>
          <div style={{ width: 9, height: 9, borderRadius: "50%", background: V.volt }} />
          <div style={{ fontFamily: F_DISPLAY, fontSize: 24, letterSpacing: "0.05em" }}>CLAUDIO MENDOZA</div>
          <div style={{ width: 1, height: 22, background: rgba(V.white, 0.5) }} />
          <div style={{ fontFamily: F_BODY, fontSize: 18, letterSpacing: "0.08em", opacity: 0.78 }}>CONSTRUCTOR</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
