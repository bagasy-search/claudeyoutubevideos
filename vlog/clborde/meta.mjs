// public/clborde_meta.json {title, description, pinned_comment}: descripción de la tarjeta (row 303) con los capítulos REALES. node vlog/clborde/meta.mjs
import fs from "node:fs";
import { get } from "./sb.mjs";
const R = "D:/Proyectos/video2-wt/clborde/", P = JSON.parse(fs.readFileSync(R + "_v3/clborde_paras.json", "utf8"));
const CH = [[0, "Eso negro está vivo"], [7, "El arreglo entero, de principio a fin"], [16, "Por qué vuelve siempre: el agujero escondido"], [25, "El mito del cloro"], [32, "La pastilla azul"], [36, "Lea el color en el espejito"], [41, "¿Sigue oscuro? Es mineral"], [46, "5 errores que lo arruinan"], [52, "3 lugares que nadie limpia"], [60, "Lo que siempre me preguntan"], [67, "El repaso semanal de 2 segundos"], [70, "Resumen + la mezcla que nunca"]];
const ts = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const chapters = CH.map(([p, t]) => `${ts(p === 0 ? 0 : P[p].s - 2.2)} ${t}`).join("\n");
const card = (await get("tracked_channels?select=plan&id=eq.303"))[0].plan.find((c) => c.id === "plan-own-1791284273106-0");
if (!card.description.includes("[[CHAPTERS]]")) throw new Error("la descripción de la tarjeta no tiene [[CHAPTERS]]");
const meta = {
  title: card.title,
  description: card.description.replace("[[CHAPTERS]]", chapters),
  pinned_comment: "¿Qué es lo que vuelve siempre en SU casa, haga lo que haga? Cuéntemelo acá abajo. Leo todos, y seguro que ya lo limpié en el hotel. Puede ser mi próximo video. — Claudio",
};
fs.writeFileSync(R + "public/clborde_meta.json", JSON.stringify(meta, null, 1));
console.log(meta.title + "\n\n" + meta.description + "\n\nFIJADO: " + meta.pinned_comment);
