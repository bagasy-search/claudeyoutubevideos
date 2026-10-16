// Expediente "Canadá vs Argentina" (tiempos = guion viejo, igual que el resto de Main.tsx)
import type { DeskScene } from "./desk";

export const DESK_T0 = 44.55, DESK_T1 = 60.45;

export const deskScene: DeskScene = {
  items: [
    // ── Canadá ──
    { id: "poster", kind: "photo", src: "desk/lastbestwest.jpg", x: 420, y: 380, w: 620, h: 852, rot: -4, t0: 44.6 },
    { id: "lblCA", kind: "label", caption: "CANADA", x: 1180, y: 300, w: 520, rot: 3, t0: 44.95 },
    { id: "dla", kind: "photo", src: "desk/dla_map.jpg", x: 1150, y: 520, w: 1050, h: 716, rot: 2, t0: 45.6 },
    { id: "n160", kind: "note", caption: "160 ACRES", x: 1520, y: 1380, w: 380, rot: -6, t0: 47.85 },
    { id: "doc", kind: "doc", title: "Dominion Lands Act · 1872", lines: ["Quarter section: 160 acres", "Office fee: $10", "Live on it 3 years", "Farm it. It's yours."], x: 420, y: 1350, w: 640, rot: -3, t0: 48.4 },
    { id: "nfree", kind: "note", caption: "FREE!", x: 1980, y: 1290, w: 300, rot: 7, t0: 49.4, color: "#a6e57f" },
    { id: "home", kind: "polaroid", src: "desk/homestead.jpg", caption: "Saskatchewan homestead", x: 1080, y: 1820, w: 560, rot: 4, t0: 50.2 },
    { id: "plow", kind: "polaroid", src: "desk/plow.jpg", caption: "a family farm", x: 1760, y: 1760, w: 520, rot: -5, t0: 50.75 },
    // ── Argentina ──
    { id: "lblAR", kind: "label", caption: "ARGENTINA", x: 3020, y: 300, w: 640, rot: -3, t0: 52.2 },
    { id: "estancia", kind: "polaroid", src: "desk/estancia_pampa.jpg", caption: "An estancia, La Pampa, 1905", x: 2780, y: 560, w: 900, h: 484, rot: -2, t0: 52.5 },
    { id: "gauchos", kind: "polaroid", src: "desk/gauchos2.jpg", caption: "The Pampas, 1900s", x: 3820, y: 480, w: 700, rot: 5, t0: 53.4 },
    { id: "gauchos1", kind: "photo", src: "desk/gauchos1.jpg", x: 3760, y: 1350, w: 820, h: 528, rot: -3, t0: 54.5 },
    { id: "notes", kind: "doc", title: "Case notes · The Pampas", lines: ["Split up decades earlier", "Into giant estates", "Owned by a few hundred families", "Same land as the Prairies"], x: 2860, y: 1640, w: 660, rot: 3, t0: 55.5 },
    { id: "elite", kind: "polaroid", src: "desk/ba_elite.jpg", caption: "Buenos Aires, 1920s", x: 3640, y: 2080, w: 580, rot: -4, t0: 57.7 },
    { id: "nfam", kind: "note", caption: "A FEW HUNDRED FAMILIES", x: 4300, y: 2120, w: 420, rot: 6, t0: 58.7, color: "#f4a6b8" },
  ],
  marks: [
    { item: "dla", t0: 47.0, rx: 330, ry: 220, dx: -60, dy: 10 },
    { item: "n160", t0: 48.0, rx: 190, ry: 80, dy: -95 },
    { item: "estancia", t0: 57.2, rx: 500, ry: 330 },
    { item: "elite", t0: 58.75, rx: 300, ry: 260, dy: -40 },
  ],
  strings: [
    { a: "lblCA", b: "lblAR", t0: 52.25 },
    { a: "home", b: "elite", t0: 59.2 },
    { a: "n160", b: "nfree", t0: 49.6 },
  ],
  // [t, x, y, zoom, tilt, rotZ]
  cam: [
    [44.4, 730, 820, 1.25, 30, -4],
    [45.5, 1150, 700, 1.0, 28, -2],
    [46.8, 1650, 900, 1.15, 25, 0],
    [47.9, 1700, 1450, 1.3, 30, 3],
    [48.8, 780, 1620, 1.2, 32, 2],
    [49.6, 1950, 1430, 1.4, 28, 0],
    [50.6, 1500, 2050, 1.1, 30, -3],
    [51.7, 1560, 1980, 1.15, 30, -3],
    [52.4, 3300, 650, 1.05, 30, 3],
    [53.5, 3330, 1000, 1.0, 28, 2],
    [54.5, 4180, 860, 1.1, 30, 0],
    [55.5, 4170, 1600, 1.15, 32, -2],
    [56.5, 3200, 1950, 1.2, 30, 2],
    [57.3, 3280, 1050, 1.0, 28, 0],
    [58.3, 3950, 2300, 1.15, 30, -2],
    [59.2, 3950, 2250, 1.05, 28, -1],
    [60.45, 2600, 1550, 0.36, 18, 0],
  ],
};
