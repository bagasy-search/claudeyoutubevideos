// _v3/rkremote_vara.mjs — LA VARA "fotograma accidental de un video común" (brief rkremote §4, 27-sep).
// Cada prompt describe la SITUACIÓN FÍSICA y la CÁMARA, no adjetivos de calidad.
// ⚠️ La cláusula negativa del brief se escribe con PARÁFRASIS de los tokens que los gates
//    (gptimg.mjs / rksafe_gate_prompts.mjs) prohíben ("cinematic", "bokeh"): mismo sentido, sin
//    disparar el gate que busca esos tokens como afirmación.
export const BASE = 'A completely ordinary frame captured from a handheld consumer video camera held at eye level, ' +
  'roughly a 28 millimetre field of view, the framing a little imperfect with something cut off by the edge of the frame, ' +
  'moderate depth of field with almost everything in focus and nothing blurred out, the focus very slightly off in places, ' +
  'slight motion smear on hands and objects that are moving. The camera operator is simply recording what is happening, ' +
  'not composing a photograph. ';
export const COLOR = ' Normal digital video color: automatic white balance, minimal correction, slight sensor noise and ' +
  'compression, moderate contrast, soft highlights.';
export const NOTXT = ' No readable text, no letters, no logos, no signs.';
export const AVOID = ' Avoid fashion photography, advertising photography, movie-style lighting, studio lighting, perfect ' +
  'posing, perfect symmetry, heavy background defocus, hyper-sharp skin, plastic skin, HDR, dramatic color grading, ' +
  'artificial rim lighting, perfectly arranged objects, exaggerated expressions and AI-generated-looking details. ' +
  'Every hand has exactly five fingers, every person has exactly two arms, and all hardware is mechanically correct.';
// luces mundanas por lugar (obedecen la geometría del lugar)
export const LUZ = {
  garage: ' Light comes from the small window in the side wall and from a weak fluorescent tube on the ceiling; the area next to the window is a little blown out and the far corners are darker.',
  garageopen: ' Cool daylight pours in through the open garage door and mixes with a weak warm bulb on the ceiling; the concrete near the door is bright and the back wall is dimmer.',
  kitchen: ' Window light from one side plus a weak warm ceiling light; the counter by the window is a little blown out and the corners are darker.',
  hall: ' Light from a window at the end of the hall and a dim warm ceiling fixture; the far end is brighter, the near corners darker.',
  driveway: ' Flat overcast daylight outside, cooler in color, with a warmer glow from inside the open garage.',
  car: ' Daylight through the windshield, the cabin darker than the street outside, a little blown out through the glass.',
  night: ' Evening, a single warm porch light and the blue light of dusk; the corners are dark and the sky still has some color.',
  table: ' Window light from the left and a weak warm lamp; the side near the window is brighter.',
};
export const RAY = 'the man from the reference photo, a sixty-eight year old retired locksmith with white hair combed back and a little messy, ' +
  'reading glasses pushed up on his head, a short white beard, wearing a creased navy blue work shirt with a small oval name patch on the chest';
export const LLAVERO = ', a ring of worn brass keys clipped to his belt';
export const P = (escena, luz) => BASE + escena + (LUZ[luz] || LUZ.garage) + COLOR + NOTXT + AVOID;
