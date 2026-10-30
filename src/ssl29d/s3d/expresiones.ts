// Expresiones paramétricas: todas las caras salen de los MISMOS parámetros continuos (interpolables).
// Ojo: lazo cerrado (párpado de arriba/abajo) que con ojoAbierto = 0 colapsa en un arco (^ feliz / ‿ dormido).
export type ParamOjo = {
  abierto: number; // 0 = cerrado (arco) … 1 = círculo abierto con pupila
  curva: number; // forma del arco/base: -1 = ^ feliz · 0 = recto · +1 = ‿ (triste/dormido)
  tam: number; // tamaño del ojo abierto
  pupila: number; // tamaño de la pupila (0 = sin pupila)
  parpado: number; // párpado de arriba que tapa (0–1)
  parpadoAng: number; // inclinación del párpado (+ = lado de adentro más alto: tristeza; − = enojo)
  anillos: number; // 0/1: ojos de círculos concéntricos (aturdido / espanto)
  apretado: number; // 0/1: ojo apretado «> <» (carcajada, dolor)
  corazon: number; // 0–1: ojos de corazón
  cejaAlt: number; // −1 baja … +1 alta
  cejaAng: number; // grados, + = punta de adentro abajo (enojo) / − = arriba (tristeza, preocupación)
  cejaCurva: number; // + = arco ∩
  cejaVis: number; // 0 = sin ceja (como la ref) … 1
};
export type Expresion = {
  I: ParamOjo; D: ParamOjo; // I = su izquierda (derecha de pantalla)
  miradaX: number; miradaY: number; // −1…1
  bocaCurva: number; // + sonrisa ∪ · − puchero ∩
  bocaAbierta: number; // 0–1
  bocaArriba: number; // 0 = toda la apertura hacia abajo (D de carcajada) · 0.5 = «o»
  bocaAncho: number; // 1 = la de la ref
  bocaAsim: number; // sonrisa de costado: + sube la comisura de su izquierda
  bocaOnda: number; // boca ondulada (nervios / confusión)
  bocaX: number; bocaY: number;
  lengua: number; // 0–1
  dientes: number; // 0–1: franja de dientes arriba (mueca)
  rubor: number; lagrimas: number; llanto: number; sudor: number; vena: number; zzz: number;
  anticipa: number; // al entrar a esta expresión, entrecierra antes (sorpresa)
};

const ojo = (o: Partial<ParamOjo> = {}): ParamOjo => ({
  abierto: 1, curva: 0, tam: 1, pupila: 1, parpado: 0, parpadoAng: 0, anillos: 0, apretado: 0, corazon: 0,
  cejaAlt: 0, cejaAng: 0, cejaCurva: 0.2, cejaVis: 1, ...o,
});
const expr = (o: Partial<Omit<Expresion, "I" | "D">> & { ojos?: Partial<ParamOjo>; I?: Partial<ParamOjo>; D?: Partial<ParamOjo> } = {}): Expresion => {
  const { ojos, I, D, ...resto } = o;
  return {
    I: ojo({ ...ojos, ...I }), D: ojo({ ...ojos, ...D }),
    miradaX: 0, miradaY: 0,
    bocaCurva: 0.3, bocaAbierta: 0, bocaArriba: 0.15, bocaAncho: 1, bocaAsim: 0, bocaOnda: 0, bocaX: 0, bocaY: 0,
    lengua: 0, dientes: 0, rubor: 0, lagrimas: 0, llanto: 0, sudor: 0, vena: 0, zzz: 0, anticipa: 0,
    ...resto,
  };
};

export const EXPRESIONES = {
  neutral: expr({ ojos: { abierto: 0.85, tam: 0.82, pupila: 1.25, cejaVis: 0 }, bocaCurva: 0.15, bocaAncho: 0.75 }),
  // la de la referencia: ojos ^ ^ y sonrisa en U, sin cejas
  feliz: expr({ ojos: { abierto: 0, curva: -1, cejaVis: 0 }, bocaCurva: 1, bocaAncho: 1 }),
  risa_apretada: expr({ ojos: { abierto: 0, apretado: 1, cejaVis: 0 }, bocaCurva: 0.6, bocaAbierta: 1.5, bocaArriba: 0.05, bocaAncho: 2.1, lengua: 1 }),
  carcajada: expr({ ojos: { abierto: 0, curva: -1.1, cejaVis: 0 }, bocaCurva: 0.6, bocaAbierta: 1.5, bocaArriba: 0.05, bocaAncho: 2.3, lengua: 1 }),
  sonrisa_picara: expr({ D: { abierto: 0.95, tam: 0.9, pupila: 1.15, parpado: 0.3, cejaAlt: 0.9, cejaAng: -16, cejaVis: 1.2, cejaCurva: 0.35 }, I: { abierto: 0, curva: -0.7, cejaAlt: -0.3, cejaAng: 10, cejaVis: 1.2 }, miradaX: -0.45, bocaCurva: 0.8, bocaAsim: 1, bocaAncho: 0.9 }),
  triste: expr({ ojos: { abierto: 0.62, tam: 0.88, parpado: 0.45, parpadoAng: 24, pupila: 1.15, curva: 0.15, cejaAlt: 0.5, cejaAng: -42, cejaVis: 1.25, cejaCurva: 0.3 }, miradaY: -0.55, bocaCurva: -1.25, bocaAncho: 1.15, bocaY: -0.01 }),
  llorando: expr({ ojos: { abierto: 0, curva: 0.9, cejaAlt: 0.35, cejaAng: -26, cejaVis: 1 }, bocaCurva: -0.7, bocaAbierta: 0.75, bocaArriba: 0.35, bocaAncho: 1, bocaOnda: 0.35, llanto: 1, lagrimas: 1 }),
  enojado: expr({ ojos: { abierto: 0.8, tam: 0.82, parpado: 0.4, parpadoAng: -20, pupila: 1.25, cejaAlt: -0.6, cejaAng: 36, cejaVis: 1.7, cejaCurva: -0.05 }, bocaCurva: -0.95, bocaAncho: 0.78 }),
  furioso: expr({ ojos: { abierto: 0.85, tam: 0.8, parpado: 0.42, parpadoAng: -22, pupila: 1.0, cejaAlt: -0.7, cejaAng: 34, cejaVis: 1.25, cejaCurva: -0.1 }, bocaCurva: -0.6, bocaAbierta: 0.55, bocaArriba: 0.45, bocaAncho: 1.05, dientes: 1, vena: 1 }),
  sorprendido: expr({ ojos: { abierto: 1, tam: 1.1, pupila: 0.85, cejaAlt: 1, cejaAng: -6, cejaCurva: 0.5, cejaVis: 1 }, bocaCurva: 0, bocaAbierta: 0.75, bocaArriba: 0.5, bocaAncho: 0.42, anticipa: 1 }),
  asustado: expr({ ojos: { abierto: 1, tam: 1.32, pupila: 0.55, anillos: 1, cejaAlt: 0.9, cejaAng: -24, cejaVis: 1, cejaCurva: 0 }, bocaCurva: -0.3, bocaAbierta: 0.32, bocaArriba: 0.5, bocaAncho: 1.45, bocaOnda: 1, dientes: 1, sudor: 1 }),
  pensativo: expr({ I: { abierto: 0.9, tam: 0.82, cejaAlt: 1.0, cejaAng: -14, cejaVis: 1.2, cejaCurva: 0.4 }, D: { abierto: 0.8, tam: 0.8, parpado: 0.18, parpadoAng: -6, cejaAlt: -0.3, cejaAng: 8, cejaVis: 1.2 }, miradaX: 0.6, miradaY: 0.6, bocaCurva: -0.05, bocaAbierta: 0.12, bocaArriba: 0.5, bocaAncho: 0.3, bocaX: 0.07 }),
  confundido: expr({ I: { abierto: 0.85, tam: 0.85, cejaAlt: 1.0, cejaAng: -24, cejaVis: 1.2, cejaCurva: 0.4 }, D: { abierto: 0.85, tam: 0.82, cejaAlt: -0.45, cejaAng: 16, cejaVis: 1.2 }, miradaX: -0.5, miradaY: 0.6, bocaCurva: -0.2, bocaOnda: 1.7, bocaAncho: 0.95 }),
  aburrido: expr({ ojos: { abierto: 0.8, tam: 0.85, parpado: 0.62, parpadoAng: 0, pupila: 1.1, cejaAlt: -0.25, cejaAng: 0, cejaVis: 1 }, miradaX: 0.3, bocaCurva: -0.2, bocaAbierta: 0.42, bocaArriba: 0.5, bocaAncho: 0.5 }),
  dormido: expr({ ojos: { abierto: 0, curva: 0.75, cejaVis: 0 }, bocaCurva: 0.05, bocaAbierta: 0.22, bocaArriba: 0.5, bocaAncho: 0.3, zzz: 1 }),
  enamorado: expr({ ojos: { abierto: 0, curva: -1, corazon: 1, cejaVis: 0 }, bocaCurva: 1, bocaAncho: 0.95, rubor: 1 }),
  asqueado: expr({ I: { abierto: 0.6, tam: 0.8, parpado: 0.55, curva: 0.2, cejaAlt: -0.5, cejaAng: 20, cejaVis: 1 }, D: { abierto: 0.4, tam: 0.8, parpado: 0.6, curva: 0.3, cejaAlt: -0.6, cejaAng: 18, cejaVis: 1 }, miradaX: -0.4, bocaCurva: -0.8, bocaAbierta: 0.3, bocaArriba: 0.45, bocaAsim: -0.7, bocaOnda: 0.6, bocaAncho: 0.85, lengua: 0.9 }),
  decidido: expr({ ojos: { abierto: 0.8, tam: 0.82, parpado: 0.3, parpadoAng: -10, pupila: 1.2, cejaAlt: -0.3, cejaAng: 16, cejaVis: 1 }, bocaCurva: 0.25, bocaAsim: 0.35, bocaAncho: 0.8 }),
  nervioso: expr({ ojos: { abierto: 1, tam: 0.95, pupila: 0.75, cejaAlt: 0.6, cejaAng: -16, cejaVis: 1 }, miradaX: -0.5, bocaCurva: 0.35, bocaAbierta: 0.28, bocaArriba: 0.5, bocaAncho: 1.15, dientes: 1, bocaOnda: 0.2, sudor: 1 }),
  avergonzado: expr({ ojos: { abierto: 0, curva: -0.7, cejaAlt: 0.4, cejaAng: -16, cejaVis: 1 }, miradaY: -0.5, bocaCurva: 0.45, bocaOnda: 0.5, bocaAncho: 0.7, rubor: 1, sudor: 0.8 }),
  guino: expr({ I: { abierto: 0, curva: -1, cejaAlt: -0.15, cejaAng: 6, cejaVis: 1 }, D: { abierto: 0.9, tam: 0.74, pupila: 1.7, cejaAlt: 0.5, cejaAng: -4, cejaVis: 1 }, bocaCurva: 0.9, bocaAsim: 0.35, bocaAncho: 0.9 }),
  // extras de la hoja de la referencia
  espantado: expr({ ojos: { abierto: 1, tam: 1.36, pupila: 0.55, anillos: 1, cejaVis: 0 }, bocaCurva: 0, bocaAbierta: 0.5, bocaArriba: 0.5, bocaAncho: 0.36, anticipa: 1 }),
  bostezo: expr({ I: { abierto: 0.7, tam: 0.82, parpado: 0.6, pupila: 1.1, cejaAlt: 0.15, cejaAng: -8, cejaVis: 1 }, D: { abierto: 0.7, tam: 0.82, parpado: 0.66, pupila: 1.1, cejaAlt: 0.05, cejaAng: -4, cejaVis: 1 }, miradaX: -0.3, bocaCurva: -0.1, bocaAbierta: 1.15, bocaArriba: 0.45, bocaAncho: 0.72, lengua: 0.5 }),
  hablando: expr({ ojos: { abierto: 0.85, tam: 0.82, pupila: 1.25, cejaAlt: 0.2, cejaVis: 1 }, bocaCurva: 0.5, bocaAbierta: 0.35, bocaArriba: 0.3, bocaAncho: 0.85, lengua: 0.6 }),
} satisfies Record<string, Expresion>;

export type NombreExpresion = keyof typeof EXPRESIONES;
export const LISTA_EXPRESIONES = Object.keys(EXPRESIONES) as NombreExpresion[];
