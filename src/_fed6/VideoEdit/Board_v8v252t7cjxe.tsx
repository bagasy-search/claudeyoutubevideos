// Board_v8v252t7cjxe.tsx — PIZARRA del beat "por qué funciona" (Federer Archivos).
// Tema: por qué la MAÑANA es el momento más exigente para el corazón después de los 60.
// Se dibujan TRES CAPAS que se apilan en la misma media hora (columna 1 → 2 → 3),
// se encierran con un lazo y el remate marca el PICO MATUTINO con el dato de las 6 a 12.
//
// Componente propio del slug: NO toca src/FedWhiteboard.tsx (solo lo consume).
// El tipo `Scene` no se exporta del archivo original → se deriva de FedWhiteboardProps.
// Avatar PiP MUTED: el audio maestro sale de la capa de avatar del Main; si sonara acá
// se duplicaría la voz.
import React from 'react';
import {staticFile} from 'remotion';
import {FedWhiteboard, type FedWhiteboardProps} from '../../FedWhiteboard';

type Scene = NonNullable<FedWhiteboardProps['scene']>;

const DG = (n: string) => staticFile(`img/dg_v8v252t7cjxe_${n}.png`);

// Duración objetivo de la escena (30 fps) → 25 s. El último texto termina de
// escribirse ~24.6 s y queda un hold corto con el diagrama completo.
export const BOARD_V8_FRAMES = 750;

export const SCENE_V8: Scene = {
  avatarSrc: staticFile('v8v252t7cjxe_opt.mp4'),
  muted: true,
  cameras: [
    {time: 0.0, fx: 26, fy: 10, z: 1.15}, // título
    {time: 1.4, fx: 15, fy: 30, z: 1.45}, // capa 1 (arriba)
    {time: 4.6, fx: 15, fy: 58, z: 1.35}, // capa 1 (el número)
    {time: 7.7, fx: 44, fy: 38, z: 1.45}, // capa 2
    {time: 12.7, fx: 74, fy: 32, z: 1.4}, // capa 3 (arriba)
    {time: 16.0, fx: 74, fy: 60, z: 1.35}, // capa 3 (el +50%)
    {time: 19.2, fx: 44, fy: 44, z: 1.0}, // zoom-out: las tres apiladas + lazo
    {time: 21.0, fx: 40, fy: 70, z: 1.15}, // remate
    {time: 23.6, fx: 46, fy: 56, z: 1.0}, // hold final
  ],
  elements: [
    {t: 'title', x: 4, y: 4, text: 'La media hora más exigente', start: 0.3},

    /* ─────────────── CAPA 1 · sangre más espesa (columna izquierda) ─────────── */
    {t: 'note', x: 14, y: 19, w: 10, text: '1', start: 1.6, size: 8, align: 'center'},
    {t: 'note', x: 14, y: 28, w: 26, text: 'Sangre más espesa', start: 2.0, size: 3.4, align: 'center'},
    {t: 'image', x: 14, y: 44, w: 26, src: DG('sangre_espesa'), start: 3.0, cutout: true, caption: 'noche vs. mañana'},
    {t: 'note', x: 14, y: 61, w: 24, text: '300 a 500 ml', start: 5.0, size: 3.8, highlight: true, align: 'center'},
    {t: 'note', x: 14, y: 68, w: 26, text: 'se van durmiendo', start: 6.2, size: 2.2, align: 'center'},
    {t: 'note', x: 14, y: 73, w: 26, text: 'nadie los repone', start: 6.9, size: 2.2, align: 'center'},

    {t: 'arrow', from: [27, 34], to: [34, 34], start: 7.4, curve: -0.28},

    /* ─────────────── CAPA 2 · plaquetas pegajosas (columna centro) ──────────── */
    {t: 'note', x: 44, y: 19, w: 10, text: '2', start: 7.9, size: 8, align: 'center'},
    {t: 'note', x: 44, y: 28, w: 26, text: 'Plaquetas pegajosas', start: 8.3, size: 3.4, align: 'center'},
    {t: 'note', x: 44, y: 42, w: 24, text: 'Se agrupan más\nal amanecer', start: 9.6, size: 2.8, box: true, align: 'center'},
    {t: 'note', x: 44, y: 60, w: 26, text: 'la sangre coagula\nmás fácil', start: 11.2, size: 2.2, align: 'center'},

    {t: 'arrow', from: [57, 34], to: [64, 34], start: 12.4, curve: -0.28},

    /* ─────────────── CAPA 3 · cortisol y adrenalina (columna derecha) ───────── */
    {t: 'note', x: 74, y: 19, w: 10, text: '3', start: 12.9, size: 8, align: 'center'},
    {t: 'note', x: 74, y: 28, w: 26, text: 'Cortisol y adrenalina', start: 13.3, size: 3.4, align: 'center'},
    {t: 'image', x: 74, y: 44, w: 26, src: DG('cortisol_curva'), start: 14.4, cutout: true, caption: 'pico al despertar'},
    {t: 'note', x: 74, y: 61, w: 22, text: '+50%', start: 16.2, size: 4.6, highlight: true, align: 'center'},
    {t: 'note', x: 74, y: 68, w: 26, text: 'en 30 a 45 minutos', start: 17.1, size: 2.2, align: 'center'},
    {t: 'note', x: 74, y: 73, w: 24, text: 'sube presión, acelera el pulso', start: 17.9, size: 2.2, align: 'center'},

    /* ─────────────────────────── REMATE: las tres juntas ────────────────────── */
    {t: 'lasso', x: 44, y: 44, w: 86, h: 62, start: 19.4, rot: -2},
    {t: 'arrow', from: [30, 77], to: [25, 82], start: 20.9, curve: -0.3},
    {t: 'note', x: 24, y: 87, w: 24, text: 'El pico matutino', start: 21.3, size: 3.4, fill: true, align: 'center'},
    {t: 'note', x: 58, y: 86, w: 30, text: 'De 6 a 12: casi el triple\nde infartos que a las 11 de la noche', start: 22.4, size: 2.7, highlight: true, align: 'center'},
  ],
};

export const BoardV8: React.FC<{durationInFrames: number}> = () => (
  <FedWhiteboard scene={SCENE_V8} theme="white" />
);

export default BoardV8;
