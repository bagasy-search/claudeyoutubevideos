// Constantes y helpers del DIRECTOR — rama del canal CLAUDIO EL MECÁNICO (row 311): vestuario FIJO (camisa azul marino de mecánico
// arremangada + trapo rojo), el taller de Claudio + la cochera de Doña Elena y su sedán plateado 2012 (serie "El auto de Doña Elena"), luz de día.
// Cada toma: S(p, frase, kind, name, opts)
//   kind: av (avatar RunPod) · vl (agnes 2.5-flash Claudio HABLANDO con su voz, opts.a = escena del ancla, opts.act = acción)
//         kf (agnes 2.5-flash detalle keyframe del minuto 1: opts.a ancla inicial, opts.b ancla final, d1, d2, sound)
//         cl (foto gpt-image /edits con la cara de Claudio) · bi (foto gpt-image /generations; stock real si opts.q;
//         opts.anim = movimiento agnes v2.0 2 s→4 s) · c (componente Cl*, opts.props) · opts.ov = overlay {c, props}
export const WHO = "Claudio, a 58-year-old Latin American auto mechanic with curly black hair streaked with gray and a short gray-black beard, brown eyes, weathered tanned skin, wearing a navy-blue mechanic's work shirt with the sleeves rolled up to the elbows, a red shop rag in his back pocket, a little grease on his fingers, and dark work trousers";
export const SHOP = "Claudio's small independent auto repair workshop in a Latin American town: a bare gray cement floor with old oil stains, red metal tool chests with drawers, a two-post car lift, a pegboard wall of hanging wrenches, fluorescent tube lights and a wide open roll-up door letting in daylight from the street";
export const DRIVE = "the cement driveway and open carport of Doña Elena's modest one-story Latin American house: a low white wall with potted geraniums, a green metal gate, a clothesline in the back";
export const BATH = SHOP;
export const HOUSE = SHOP;
export const ELENA = "Doña Elena, a 72-year-old Latin American widow with gray hair pulled back in a low bun, reading glasses hanging from a beaded chain around her neck, a beige knit cardigan over a pale blouse";
export const MARTA = ELENA;
export const CAR = "a silver 2012 four-door compact sedan, clean but with small scratches and faded headlights, an ordinary non-luxury model with no visible badges or logos";
export const CABIN = "the inside of an ordinary 2012 compact sedan: gray cloth seats, a plain black plastic dashboard with analog gauges, a small rosary hanging from the rear-view mirror";
export const LIGHT = "This is one ordinary frame pulled from a normal handheld video shot by a coworker with a consumer camera at eye level, simply recording what happens, not composing a photo. The framing is casual and a little off: something is cut by the edge of the frame. Almost everything in the frame is in focus, nothing blurred out: the room behind stays fully readable. The only light is what the place really has, and each person and object gets light according to where it stands; correctly exposed, daylight from the window and a warm ceiling bulb. Colours of an ordinary video with automatic white balance and almost no correction: moderate contrast, soft highlights, mild sensor noise and light compression, faint motion blur on anything moving. Skin with pores and uneven tone; hair with stray curls; the navy work shirt with real creases. People are caught mid-action, unposed.";
export const LOOK = "Ordinary handheld video filmed by a coworker with a consumer camera at eye level, small natural shakes and casual slightly imperfect framing, everything in the room in focus, only the light the place really has, correctly exposed, automatic white balance, mild sensor noise; real skin and natural rough hands; he moves naturally and unposed, nothing staged; no music.";
export const S = (p, at, kind, name, o = {}) => ({ ...o, prompt: o.p, p, at, kind, name });
const TAIL = " One ordinary frame from a normal video shot at eye level with a consumer camera, casual slightly imperfect framing, something cut by the edge of the frame. Almost everything in focus, nothing blurred out: the background stays readable with ordinary everyday objects. Only the light the place really has, correctly exposed, automatic white balance, moderate contrast, mild sensor noise, true-to-life colors. Real materials with wear and use. No text, no letters, no logos.";
export const BI = (scene) => scene + TAIL;
export const CLP = (scene) => `${WHO}. ${scene} His face is the face of the reference image: same face, same age, same curly black-and-gray hair and gray-black beard, not younger, not thinner, always in the navy-blue mechanic's work shirt with rolled-up sleeves.` + TAIL;
export const H = "a mechanic's weathered tanned hands with a little grease in the knuckles, the rolled-up sleeve of a navy-blue work shirt at the edge of the frame";
export const EH = "an old woman's thin hands with a simple gold wedding ring";
