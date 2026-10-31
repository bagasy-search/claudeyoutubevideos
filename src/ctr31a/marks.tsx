// ctr31a · marcas globales del video (anclas a la voz que comparten el mundo y varias piezas)
import { at, END_VOZ } from "./base";
import { ei } from "./lib";

export const END = Math.round((END_VOZ + 1.4) * 30) / 30;
// los 5 tapones rojos (cocina · lavamanos · bañera · ducha · inodoro): se encienden en el gancho, se apagan con el golpe de agua
export const PLUGON = [at("Ningún caño se tapa") + 1.2, at("Ningún caño se tapa") + 1.6, at("Ningún caño se tapa") + 2.0, at("Ningún caño se tapa") + 2.4, at("Ningún caño se tapa") + 2.8];
export const PLUGOFF = [at("sacas el tapón de golpe") + 0.6, at("El lavamanos. Lo tapas") + 4.5, at("La bañera. la llenas") + 2.5, at("lo echas de golpe sobre la rejilla") + 0.8, at("la media taza de la botella marrón por el tubo de rebalse") + 1.0];
export const plugsOn = (t: number, i: number) => ei(t, PLUGON[i], PLUGON[i] + 0.6) * (1 - ei(t, PLUGOFF[i], PLUGOFF[i] + 0.8));
// a qué cuarto de la casa vuela la cámara en cada tramo (cuando no hay clip ni pieza)
export const SECROOM: [number, string][] = [
  [0, "shower"], [at("Son 20 cosas en orden"), "wide"], [at("Número 1. El agua te avisa"), "kitchen"], [at("Ahora, antes de seguir, te propongo"), "wide"],
  [at("Número 2. La grasa"), "kitchen"], [at("Número 4. El último enjuague"), "cabinet"], [at("Número 6. El olor"), "kitchen"],
  [at("Ahora nos vamos al baño"), "basin"], [at("Número 9. La rejilla"), "shower"], [at("La bañera que tarda"), "tub"],
  [at("El desagüe que nadie usa"), "shower"], [at("Número 12. El sifón"), "cabinet"], [at("Número 13. La sopapa"), "kitchen"],
  [at("Número 14. El inodoro tapado"), "toilet"], [at("lo que el viejo nunca hacía"), "wide"], [at("Número 15. El inodoro"), "toilet"],
  [at("Número 16. La lavadora"), "laundry"], [at("Número 17. El departamento"), "stack"], [at("Número 18. Lo que nunca"), "cabinet"],
  [at("Número 19. Cuando nada funciona"), "street"], [at("Antes del truco del viejo"), "wide"], [at("Número 20. El truco"), "kitchen"],
  [at("Te dejo la rutina"), "wideHi"],
];
