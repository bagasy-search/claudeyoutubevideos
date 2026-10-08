// Constantes y helpers del DIRECTOR — rama del canal CLAUDIO EN JAPÓN (row 307): polo rojo liso, casas luminosas de madera clara, recuerdos del hotel de Tokio. (Antes: CLAUDIO EL ALBAÑIL (row 306)): vestuario FIJO (remera naranja + cinta métrica),
// la casa de Doña Marta (la misma en toda la serie "La casa de Doña Marta"), luz de día.
// Cada toma: S(p, frase, kind, name, opts)
//   kind: av (avatar RunPod) · vl (agnes 2.5-flash Claudio HABLANDO con su voz, opts.a = escena del ancla, opts.act = acción)
//         kf (agnes 2.5-flash detalle keyframe del minuto 1: opts.a ancla inicial, opts.b ancla final, d1, d2, sound)
//         cl (foto gpt-image /edits con la cara de Claudio) · bi (foto gpt-image /generations; stock real si opts.q;
//         opts.anim = movimiento agnes v2.0 2 s→4 s) · c (componente Cl*, opts.props) · opts.ov = overlay {c, props}
export const WHO = "Claudio, a 58-year-old Latin American man with curly black hair streaked with gray and a short gray-black beard, brown eyes, tanned skin, wearing a plain red polo shirt with no logo and dark trousers";
// la casa de hoy (Latinoamérica, luminosa y ordenada, madera clara) y el hotel de Tokio de sus 15 años (recuerdos, sin su cara)
export const HOUSE = "a bright, tidy Latin American home with smooth white walls, light natural-wood shelves and floors, a few green plants, thin white curtains and daylight, nothing cluttered";
export const BATH = "a bright, clean small Latin American bathroom with white tiles, a light-wood shelf, a window letting in daylight, a few neatly placed things";
export const HOTEL = "a quiet, spotless Tokyo business hotel";
export const SATO = "Sato-san, a slim Japanese woman in her early fifties with black hair pulled back in a neat low bun, thin metal glasses, a dark navy hotel housekeeping supervisor uniform with a white collar and a small name badge with no readable text";
export const MARTA = SATO;
export const LIGHT = "This is one ordinary frame pulled from a normal handheld video shot by a coworker with a consumer camera at eye level, simply recording what happens, not composing a photo. The framing is casual and a little off: something is cut by the edge of the frame. Almost everything in the frame is in focus, nothing blurred out: the room behind stays fully readable. The only light is what the place really has, and each person and object gets light according to where it stands; correctly exposed, daylight from the window and a warm ceiling bulb. Colours of an ordinary video with automatic white balance and almost no correction: moderate contrast, soft highlights, mild sensor noise and light compression, faint motion blur on anything moving. Skin with pores and uneven tone; hair with stray curls; the red polo with real creases. People are caught mid-action, unposed.";
export const LOOK = "Ordinary handheld video filmed by a coworker with a consumer camera at eye level, small natural shakes and casual slightly imperfect framing, everything in the room in focus, only the light the place really has, correctly exposed, automatic white balance, mild sensor noise; real skin and natural rough hands; he moves naturally and unposed, nothing staged; no music.";
export const S = (p, at, kind, name, o = {}) => ({ ...o, prompt: o.p, p, at, kind, name });
const TAIL = " One ordinary frame from a normal video shot at eye level with a consumer camera, casual slightly imperfect framing, something cut by the edge of the frame. Almost everything in focus, nothing blurred out: the background stays readable with ordinary everyday objects. Only the light the place really has, correctly exposed, automatic white balance, moderate contrast, mild sensor noise, true-to-life colors. Real materials with wear and use. No text, no letters, no logos.";
export const BI = (scene) => scene + TAIL;
export const CLP = (scene) => `${WHO}. ${scene} His face is the face of the reference image: same face, same age, same curly black-and-gray hair and gray-black beard, not younger, not thinner, always in the plain red polo shirt.` + TAIL;
export const BOTTLE = "a brown plastic bottle of 3% hydrogen peroxide with a plain blank white label";
export const RIM = "the underside of the rim of an ordinary white toilet, a row of small round flush holes along it";
