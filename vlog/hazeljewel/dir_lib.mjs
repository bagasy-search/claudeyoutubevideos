// DIRECTOR de hazeljewel — helpers. Cada toma: S(p, frase, kind, name, opts)
//   p = índice de párrafo (_v3/hazeljewel_paras.json) · frase = palabras donde ARRANCA la toma dentro del párrafo ("" = inicio)
//   kind: av (avatar InfiniteTalk) · vl (clip agnes 2.5 hablado, minuto 1) · kf (detalle agnes 2.5 keyframe, minuto 1)
//         hz (foto gpt CON Hazel, /edits; Ken-Burns, nunca v2.0 con su cara) · bi (foto gpt sin Hazel → clip agnes v2.0 `anim`)
//         st (stock Pexels real, public/broll/hazeljewel_st/<name>.mp4) · c (componente Hz*)
//   opts: { p: prompt, anim: movimiento agnes v2.0, props, ov: overlay {c, props} }
export const S = (p, at, kind, name, o = {}) => ({ ...o, prompt: o.p, p, at, kind, name });

export const WHO = "Hazel, a 69-year-old woman with grey hair loosely pulled back with a few stray strands, thin wire-rimmed reading glasses, small silver drop earrings, a faded blue denim button-up shirt with the sleeves rolled up to the forearms, natural older skin with lines and age spots";
export const SHOP = "her appraisal workroom: white painted board walls, a tall window on the left, a dark wood china cabinet and an old dresser, open shelves with silver teapots and old jewelry boxes behind her, a white magnifier lamp on a swing arm, a pair of white cotton gloves on the worn wooden worktable";
export const HOUSE = "an older Midwestern family house on the morning of an estate sale: flowered wallpaper, wall-to-wall carpet, a dark wood china cabinet, folding tables covered with household things, little white price stickers and masking-tape price labels everywhere";

const TAIL = " One ordinary frame pulled from a normal handheld video shot at eye level with a consumer camera, simply recording what happens, casual slightly imperfect framing with something cut by the edge of the frame. Almost everything is in focus, nothing blurred out: the background stays readable with ordinary everyday objects. Only the light the place really has, correctly exposed, automatic white balance, moderate contrast, mild sensor noise, true-to-life colors. Real materials with wear and use. People, if any, are caught mid-action, unposed.";
export const BI = (scene) => scene + TAIL;
export const HZP = (scene, where = SHOP) => `${WHO}, in ${where}. ${scene} Her face is the face of the reference image: same face, same age, same glasses, same grey hair, not younger, not prettier. She wears the same faded blue denim shirt with rolled-up sleeves.` + TAIL;
export const GARAGE = "an open two-car garage of a modest Ohio house on a garage sale morning: folding card tables covered with household things, a crock pot, a box of Christmas lights, old dishes, little white price stickers, a clothes rack, the driveway and lawn outside";
export const VELVET = "a piece of black velvet cloth on a table by a window";
