// Constantes y helpers del DIRECTOR — rama del canal CLAUDIO OLD MECHANIC (EN, row 312): camisa azul marino + trapo rojo, el auto de Doris (serie "Miss Doris's Car"). Antes: CLAUDIO EL FUMIGADOR (row 305): vestuario FIJO (camisa caqui de dos bolsillos +
// anteojos de seguridad en la frente), la casa de los Ramírez (la misma en toda la serie "La casa de los Ramírez"), luz de día.
// Cada toma: S(p, frase, kind, name, opts)
//   kind: av (avatar RunPod) · vl (agnes 2.5-flash Claudio HABLANDO con su voz, opts.a = escena del ancla, opts.act = acción)
//         kf (agnes 2.5-flash detalle keyframe del minuto 1: opts.a ancla inicial, opts.b ancla final, d1, d2, sound)
//         cl (foto gpt-image /edits con la cara de Claudio) · bi (foto gpt-image /generations; stock real si opts.q;
//         opts.anim = movimiento agnes v2.0 2 s→4 s) · c (componente Cl*, opts.props) · opts.ov = overlay {c, props}
export const WHO = "Claudio, a 58-year-old Latin American auto mechanic with curly black hair streaked with gray and a short gray-black beard, brown eyes, weathered tanned skin, wearing a navy blue mechanic's work shirt with the sleeves rolled up to the elbows, a red shop rag hanging from his back pocket, a little black grease on his fingers and dark work trousers";
export const SHOP = "a bright, clean, independent auto repair shop: the big roll-up door open to daylight, a concrete floor with old oil stains, red rolling tool chests, a two-post lift with a car raised on it, a steel workbench with a vise, a pegboard of wrenches";
export const DRIVE = "the concrete driveway and open two-car garage of a modest one-story American suburban house: a pegboard with old hand tools on the garage wall, a chest freezer, a coiled garden hose, a basketball hoop above the garage door, a neat lawn";
export const BATH = DRIVE;
export const HOUSE = DRIVE;
export const DORIS = "Doris, a 72-year-old white American widow with short silver-white hair, reading glasses hanging on a beaded chain, a beige cardigan over a floral blouse";
export const MARTA = DORIS;
export const LUCIA = DORIS;
export const CAR = "a clean silver 2012 mid-size four-door sedan with no badges or brand marks, small scratches on the rear bumper, a faded parking sticker on the windshield";
export const JORGE = "Doris's late husband Frank, seen only in an old framed photo: a smiling 70-year-old white American man with a gray mustache and a ball cap";
export const KIDS = "Doris's two grown-up grandkids";
export const DOG = "Daisy, Doris's small old white terrier mix";
export const LIGHT = "This is one ordinary frame pulled from a normal handheld video shot by a coworker with a consumer camera at eye level, simply recording what happens, not composing a photo. The framing is casual and a little off: something is cut by the edge of the frame. Almost everything in the frame is in focus, nothing blurred out: the room behind stays fully readable. The only light is what the place really has, and each person and object gets light according to where it stands; correctly exposed, daylight from the window and a warm ceiling bulb. Colours of an ordinary video with automatic white balance and almost no correction: moderate contrast, soft highlights, mild sensor noise and light compression, faint motion blur on anything moving. Skin with pores and uneven tone; hair with stray curls; the navy work shirt with real creases. People are caught mid-action, unposed.";
export const LOOK = "Ordinary handheld video filmed by a coworker with a consumer camera at eye level, small natural shakes and casual slightly imperfect framing, everything in the room in focus, only the light the place really has, correctly exposed, automatic white balance, mild sensor noise; real skin and natural rough hands; he moves naturally and unposed, nothing staged; no music.";
export const S = (p, at, kind, name, o = {}) => ({ ...o, prompt: o.p, p, at, kind, name });
const TAIL = " One ordinary frame from a normal video shot at eye level with a consumer camera, casual slightly imperfect framing, something cut by the edge of the frame. Almost everything in focus, nothing blurred out: the background stays readable with ordinary everyday objects. Only the light the place really has, correctly exposed, automatic white balance, moderate contrast, mild sensor noise, true-to-life colors. Real materials with wear and use. No text, no letters, no logos.";
export const BI = (scene) => scene + TAIL;
export const CLP = (scene) => `${WHO}. ${scene} His face is the face of the reference image: same face, same age, same curly black-and-gray hair and gray-black beard, not younger, not thinner, always in the navy blue mechanic's work shirt with the sleeves rolled up and the red shop rag.` + TAIL;
export const BOTTLE = "a brown plastic bottle of 3% hydrogen peroxide with a plain blank white label";
export const RIM = "the underside of the rim of an ordinary white toilet, a row of small round flush holes along it";
