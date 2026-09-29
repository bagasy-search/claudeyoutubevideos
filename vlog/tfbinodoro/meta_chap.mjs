// agrega los capítulos (de vlog/tfbinodoro/timeline.json) a public/tfbinodoro_meta.json. uso: node vlog/tfbinodoro/meta_chap.mjs
import fs from "node:fs";
const R = "D:/Proyectos/video2-wt/tfbinodoro/";
const T = JSON.parse(fs.readFileSync(R + "vlog/tfbinodoro/timeline.json", "utf8")), M = JSON.parse(fs.readFileSync(R + "public/tfbinodoro_meta.json", "utf8"));
const N = { S2: "El método completo, paso a paso", S3: "Lo que me preguntaron (muriático, bicarbonato, gaseosa)", S4: "Qué muestra el corte por dentro",
  S6: "El error que arruina todo", "La ficha completa": "La ficha con los 5 pasos", SC: "Cómo lo corté (y por qué no hace falta)", S5: "Por qué funciona el vinagre: la prueba",
  S8: "La raya que baja del borde: la mochila", S7: "Los detalles que hacen la diferencia", S7b: "Tres cuidados mientras trabajas", S9: "Que no vuelva + lo que encontré en la curva" };
const mm = f => `${Math.floor(f / 30 / 60)}:${String(Math.floor(f / 30 % 60)).padStart(2, "0")}`;
const ch = [["0:00", "Lo que encontré adentro del inodoro"]];
for (const [n, f] of T.chap) if (N[n] && !ch.some(c => c[1] === N[n])) ch.push([mm(f), N[n]]);
const body = M.description.replace(/\n\nCAPÍTULOS:[\s\S]*$/, "");
M.description = body + "\n\nCAPÍTULOS:\n" + ch.map(c => c.join(" ")).join("\n");
fs.writeFileSync(R + "public/tfbinodoro_meta.json", JSON.stringify(M, null, 1)); console.log(ch.map(c => c.join(" ")).join("\n"));
