// Kit «Blanquito»: stickman 3D blanco de arcilla/vinilo, 100 % por código (Remotion + @remotion/three).
//   import { Stickman, StickmanEnFondo, Estudio, EXPRESIONES, ACCIONES, POSES } from "../stickman3d";
export { Stickman, StickmanCuerpo } from "./Stickman";
export type { StickmanProps } from "./Stickman";
export { StickmanEnFondo } from "./EnFondo";
export type { StickmanEnFondoProps, PersonajeEnFondo } from "./EnFondo";
export { Estudio, CAM_REF, StickmanDemo, GUION_DEMO } from "./composiciones";
export { Camara3D, Luces, FondoEstudio } from "./iluminacion";
export type { Camara, LuzEscena } from "./iluminacion";
export { EXPRESIONES, LISTA_EXPRESIONES } from "./expresiones";
export type { Expresion, NombreExpresion, ParamOjo } from "./expresiones";
export { ACCIONES, POSES, pose, evaluarGuion } from "./acciones";
export type { Accion, NombreAccion, NombrePose, PasoGuion } from "./acciones";
export { PROPORCIONES } from "./proporciones";
export type { NombreAccesorio } from "./accesorios";
export { RootStickman } from "./Root";
