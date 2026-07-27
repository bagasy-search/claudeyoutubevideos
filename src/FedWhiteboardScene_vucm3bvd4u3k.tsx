/**
 * ============================================================================
 * SCENE_HORMIGUEO — pizarra explicativa (estilo Vox) del MECANISMO central:
 * por qué el hormigueo aparece justo de noche.
 * ----------------------------------------------------------------------------
 * Ancla en el video: la escena arranca en el segundo 280.2 y dura 47.7 s.
 * TODOS los `start` y los `time` de cámara están en segundos RELATIVOS al
 * arranque de la escena (= absoluto − 280.2).
 *
 * Mapa de la narración (relativo → absoluto):
 *    0.0 (280.2) "De día vos caminás. Cada vez que apoyás el pie…"
 *    4.3 (284.5) "…el músculo de la pantorrilla aprieta las venas de adentro."
 *    9.1 (289.3) "Eso es una bomba."
 *   12.2 (292.4) "Los libros viejos la llamaban el segundo corazón…"
 *   18.8 (299.0) "De día estás distraído: la tele, la radio, el nieto."
 *   27.4 (307.6) "Después te acostás."
 *   29.0 (309.2) "Se terminó la bomba."
 *   31.4 (311.6) "La casa quedó en silencio."
 *   35.0 (315.2) "Y ahí, recién ahí, escuchás el ruido de todo el día."
 *   37.9 (318.1) "Por eso el hormigueo es nocturno…"
 *
 * DISEÑO: diagrama COMPARADO en dos mitades — columna izquierda DE DÍA
 * (bomba encendida + ruido tapado) · columna derecha DE NOCHE (bomba apagada
 * + silencio + el mismo ruidito, ahora audible). Una flecha larga cruza el eje
 * y une "ruido tapado" con "recién ahí lo escuchás": es el MISMO ruido.
 * Abajo queda escrita la conclusión, que se lee en el hold final de ~4 s.
 *
 * SIN IMÁGENES A PROPÓSITO: este proyecto no tiene public/med/ ni fotos en
 * public/img/, y una ruta inexistente es un 404 que mata el chunk del render.
 * Todo se resuelve con tinta: title / note / arrow / lasso.
 *
 * El avatar va FULL por debajo (lo pone el Main) → acá NO se define avatarSrc.
 * ============================================================================
 */

import type {Scene} from './FedWhiteboard_vucm3bvd4u3k';

export const SCENE_HORMIGUEO: Scene = {
  // ── CÁMARA: construye el diagrama de izquierda a derecha, siempre llegando
  //    a la zona ANTES de que se escriba el elemento, y abre al final. ──────
  cameras: [
    {time: 0.0, fx: 24, fy: 12, z: 1.16}, // título + rótulo "DE DÍA"
    {time: 3.9, fx: 24, fy: 37, z: 1.44}, // la pantorrilla aprieta las venas
    {time: 8.5, fx: 33, fy: 44, z: 1.3}, // la BOMBA, el segundo corazón, la sangre que sube
    {time: 18.7, fx: 25, fy: 72, z: 1.44}, // el ruido del día que tapa al nervio
    {time: 26.9, fx: 74, fy: 26, z: 1.38}, // cruza a la noche: la bomba se apaga
    {time: 32.6, fx: 74, fy: 50, z: 1.4}, // el silencio y el ruidito audible
    {time: 39.2, fx: 52, fy: 76, z: 1.26}, // la flecha que cruza + la conclusión
    {time: 43.8, fx: 50, fy: 52, z: 1.0}, // plano general: hold ~4 s con todo escrito
  ],

  elements: [
    // ─────────────────────────── ENCABEZADO ────────────────────────────────
    {t: 'title', x: 4, y: 3, text: '¿Por qué el hormigueo llega de noche?', start: 0.3},

    // ══════════════════════ MITAD IZQUIERDA · DE DÍA ═══════════════════════
    {t: 'note', x: 24, y: 18, w: 24, text: 'DE DÍA', start: 0.7, size: 4.4, highlight: true, align: 'center'},

    // el paso → el músculo → la vena apretada
    {t: 'note', x: 24, y: 28, w: 26, text: 'Cada paso que das', start: 1.1, size: 3.4, bullet: true},
    {t: 'note', x: 24, y: 37, w: 30, text: 'La pantorrilla aprieta\nlas venas de adentro', start: 4.6, size: 3.4, bullet: true},

    // …y eso, dicho fuerte: es una bomba
    {t: 'note', x: 24, y: 46, w: 26, text: 'ES UNA BOMBA', start: 9.3, size: 3.7, fill: true, align: 'center'},
    {t: 'note', x: 24, y: 56, w: 27, text: 'El segundo corazón', start: 12.6, size: 3.4, highlight: true, align: 'center'},

    // la bomba y su apodo, encerradas a mano en un solo concepto
    {t: 'lasso', x: 24, y: 52, w: 34, h: 20, start: 14.6, rot: -2},

    // …de ese lazo sale la sangre para arriba
    {t: 'arrow', from: [43, 60], to: [43, 26], start: 12.7, curve: 0.3},
    {t: 'note', x: 47, y: 20, w: 14, text: 'La sangre\nsube', start: 13.4, size: 2.9, accent: true, align: 'center'},

    // el ruido del día que tapa al nervio
    {t: 'note', x: 24, y: 68, w: 28, text: 'Tele, radio, el nieto', start: 19.3, size: 3.2, box: true, align: 'center'},
    {t: 'note', x: 24, y: 78, w: 30, text: 'El ruidito del nervio\nqueda tapado abajo', start: 22.7, size: 3.1},

    // ═══════════════════════ MITAD DERECHA · DE NOCHE ══════════════════════
    {t: 'note', x: 74, y: 18, w: 26, text: 'DE NOCHE', start: 27.5, size: 4.4, accent: true, box: true, align: 'center'},

    {t: 'note', x: 74, y: 32, w: 28, text: 'SE APAGÓ LA BOMBA', start: 29.2, size: 3.5, fill: true, align: 'center'},
    {t: 'note', x: 74, y: 45, w: 30, text: 'La casa quedó\nen silencio', start: 31.7, size: 3.4, highlight: true, align: 'center'},
    {t: 'note', x: 74, y: 58, w: 30, text: 'Recién ahí lo escuchás', start: 35.2, size: 3.4, bullet: true},
    {t: 'lasso', x: 74, y: 58, w: 34, h: 14, start: 35.9, rot: 2},

    // ── El puente: es el MISMO ruido de todo el día ────────────────────────
    {t: 'arrow', from: [41, 78], to: [59, 62], start: 37.4, curve: -0.3},

    // ─────────────── CONCLUSIÓN (queda escrita para el hold) ───────────────
    {
      t: 'note',
      x: 50,
      y: 90,
      w: 48,
      text: 'El nervio hizo ruido todo el día.\nDe noche, por fin lo oís.',
      start: 38.9,
      size: 3.2,
      highlight: true,
      align: 'center',
    },
  ],
};
