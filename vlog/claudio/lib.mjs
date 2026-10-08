// Constantes y helpers del DIRECTOR — rama del canal CLAUDIO EL FUMIGADOR (row 305): vestuario FIJO (camisa caqui de dos bolsillos +
// anteojos de seguridad en la frente), la casa de los Ramírez (la misma en toda la serie "La casa de los Ramírez"), luz de día.
// Cada toma: S(p, frase, kind, name, opts)
//   kind: av (avatar RunPod) · vl (agnes 2.5-flash Claudio HABLANDO con su voz, opts.a = escena del ancla, opts.act = acción)
//         kf (agnes 2.5-flash detalle keyframe del minuto 1: opts.a ancla inicial, opts.b ancla final, d1, d2, sound)
//         cl (foto gpt-image /edits con la cara de Claudio) · bi (foto gpt-image /generations; stock real si opts.q;
//         opts.anim = movimiento agnes v2.0 2 s→4 s) · c (componente Cl*, opts.props) · opts.ov = overlay {c, props}
export const WHO = "Claudio, a 58-year-old Latin American pest-control technician with curly black hair streaked with gray and a short gray-black beard, brown eyes, weathered tanned skin, wearing a light khaki short-sleeve work shirt with two buttoned chest pockets, clear safety glasses pushed up on his forehead and dark work trousers";
export const BATH = "the kitchen of a modest one-story Latin American family house: white wall tiles with a blue-and-white patterned tile strip, a speckled gray granite counter, wooden kitchen cabinets, an older white refrigerator with children's crayon drawings held by magnets, a stainless double sink under a window with white iron bars, a dog's steel food bowl on the floor";
export const HOUSE = BATH;
export const MARTA = "Lucía Ramírez, a 38-year-old Latin American mother with long dark wavy hair in a low ponytail, a gray t-shirt and jeans";
export const LUCIA = MARTA;
export const JORGE = "Jorge Ramírez, a stocky 40-year-old Latin American father with short black hair and a trimmed mustache, in a navy polo shirt";
export const KIDS = "Sofía, a 9-year-old Latin American girl with two braids, and Mateo, a 6-year-old Latin American boy with short messy hair";
export const DOG = "Bruno, a medium-sized short-haired caramel-colored mixed-breed dog with floppy ears";
export const LIGHT = "This is one ordinary frame pulled from a normal handheld video shot by a coworker with a consumer camera at eye level, simply recording what happens, not composing a photo. The framing is casual and a little off: something is cut by the edge of the frame. Almost everything in the frame is in focus, nothing blurred out: the room behind stays fully readable. The only light is what the place really has, and each person and object gets light according to where it stands; correctly exposed, daylight from the window and a warm ceiling bulb. Colours of an ordinary video with automatic white balance and almost no correction: moderate contrast, soft highlights, mild sensor noise and light compression, faint motion blur on anything moving. Skin with pores and uneven tone; hair with stray curls; the khaki work shirt with real creases. People are caught mid-action, unposed.";
export const LOOK = "Ordinary handheld video filmed by a coworker with a consumer camera at eye level, small natural shakes and casual slightly imperfect framing, everything in the room in focus, only the light the place really has, correctly exposed, automatic white balance, mild sensor noise; real skin and natural rough hands; he moves naturally and unposed, nothing staged; no music.";
export const S = (p, at, kind, name, o = {}) => ({ ...o, prompt: o.p, p, at, kind, name });
const TAIL = " One ordinary frame from a normal video shot at eye level with a consumer camera, casual slightly imperfect framing, something cut by the edge of the frame. Almost everything in focus, nothing blurred out: the background stays readable with ordinary everyday objects. Only the light the place really has, correctly exposed, automatic white balance, moderate contrast, mild sensor noise, true-to-life colors. Real materials with wear and use. No text, no letters, no logos.";
export const BI = (scene) => scene + TAIL;
export const CLP = (scene) => `${WHO}. ${scene} His face is the face of the reference image: same face, same age, same curly black-and-gray hair and gray-black beard, not younger, not thinner, always in the light khaki two-pocket work shirt with the clear safety glasses on his forehead.` + TAIL;
export const BOTTLE = "a brown plastic bottle of 3% hydrogen peroxide with a plain blank white label";
export const RIM = "the underside of the rim of an ordinary white toilet, a row of small round flush holes along it";
