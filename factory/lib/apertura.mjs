// apertura.mjs — APERTURA CON LA MINIATURA (regla del creador, 20-sep-2026).
//
// El primer fotograma del video ES la miniatura del canal, animada apenas (agnes i2v), y al segundo
// un corte GLITCH del que sale el presentador hablando. El que hace clic aterriza en la MISMA imagen
// que clickeó: confirma que está en el lugar correcto antes de decidir si se queda.
//
// Cómo está resuelto y por qué así:
//  · Todo lo demás se corre `holdF` cuadros a la derecha — cues, ventanas de avatar y el AUDIO — en
//    vez de tapar el arranque del avatar con la miniatura. Tapar habría dejado ~1 s de lipsync PAGADO
//    debajo del b-roll, que es exactamente el defecto que mide `avatarTapadoSec` (tcbriquetas: 92 s).
//  · La miniatura se mantiene medio glitch DE MÁS (`holdF + glitchF/2`) para que el corte ocurra
//    DENTRO del glitch y no se vea un cuadro de nadie entre las dos capas.
//  · El cuadro 0 tiene que ser la miniatura EXACTA: la pieza `AperturaMiniatura` arranca en
//    `scale(1)` (⛔ `Clip` usa Ken-Burns desde 1,045 y rompería el calce) y el clip de agnes tiene que
//    salir de esa misma imagen. Lo garantiza la pieza (la miniatura va encima y se funde en 6 cuadros)
//    y lo mide `scripts/apertura_miniatura.mjs` antes de aceptar el clip.
//  · Si agnes REDIBUJA la miniatura (pasa: medido 14,5 dB en tdccadena contra 20 dB de una sana), la
//    apertura va con la miniatura QUIETA y su push — el calce vale más que el movimiento.
export function conApertura({ cues, ventanas, total, fps = 30, ap }) {
  const holdF = Math.max(1, Math.round((ap.holdS ?? 1.0) * fps));
  const glitchF = Math.max(2, Math.round(ap.glitchF ?? 12));
  if (!ap.src && !ap.foto) throw new Error("conApertura: falta la miniatura (ni clip ni foto)");
  const cues2 = cues.map((c) => ({ ...c, start: c.start + holdF }));
  cues2.unshift({
    key: "apertura", start: 0, dur: holdF + Math.round(glitchF / 2), capa: "base",
    kind: "apertura", src: ap.src || null, foto: ap.foto || null, frames: ap.frames || 0,
  });
  cues2.push({ key: "glitchcut", start: holdF, dur: glitchF, capa: "over", kind: "glitch" });
  return {
    cues: cues2,
    ventanas: ventanas.map((w) => ({ ...w, from: w.from + holdF })),
    total: total + holdF,
    audioDesdeF: holdF,
    // ⛔ NO se llama `aperturaSec`: ese nombre YA lo usa el medido de vlogplan para otra cosa — el
    //    tramo inicial que tiene que ser avatar hablando sin b-roll encima (`max(aperturaMinS, fin del
    //    primer momento)`). Dos cosas distintas con el mismo nombre en la misma tabla es cómo se leen
    //    mal los números de una entrega.
    medido: { holdF, glitchF, miniaturaSec: +(holdF / fps).toFixed(2) },
  };
}
