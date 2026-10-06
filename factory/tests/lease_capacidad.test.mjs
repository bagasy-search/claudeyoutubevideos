// CONTROL POSITIVO del lease: el latido NO puede resucitar un lease ya reclamado.
// Medido en producción (16-sep-2026, los 5 videos de Claudio Mendoza): agnes quedó en 28/14 con
// cmealter×14 y cmecaja×14, los dos PIDs vivos y los dos corriendo agnes a la vez. `tryAcquire`
// estaba bien (mutex + chequeo de capacidad); el que se salteaba el chequeo era el heartbeat de
// makeHandle, que reescribía su archivo sin mirar si se lo habían llevado.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { tryAcquire, usage } from "../lib/lease.mjs";

const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), "factory-lease-"));
const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

test("el latido no resucita un lease reclamado (no se pasa de capacidad)", async () => {
  const dir = tmp();
  // OJO: el latido tiene piso de 1 s (Math.max(1000, ttlMs/3)). Con TTL 900 ms el lease vence a los
  // 900 y el latido recién corre a los 1000: esa es EXACTAMENTE la ventana del bug.
  const o = { dir, capacidad: 14, ttlMs: 900 };

  const a = await tryAcquire("agnes", "cmealter", 14, o);
  assert.ok(a, "el primero tiene que conseguirlo");

  await dormir(950);                                  // A vence: vivos() lo va a barrer

  const b = await tryAcquire("agnes", "cmecaja", 14, o);
  assert.ok(b, "al vencer el primero, el segundo lo toma legítimamente");

  await dormir(400);                                  // acá ya corrió el latido de A (t≈1000 ms)

  const u = usage("agnes", { dir });
  assert.equal(u.usado, 14, `capacidad excedida: ${u.usado}/14 con ${u.holders.join(" + ")}`);
  assert.equal(u.holders.length, 1, "tiene que quedar UN solo tenedor");
  assert.equal(a.perdido, true, "el que perdió su lease tiene que enterarse");

  a.release(); b.release();
  fs.rmSync(dir, { recursive: true, force: true });
});

test("el tenedor sano renueva su lease y lo conserva", async () => {
  const dir = tmp();
  const a = await tryAcquire("agnes", "cmeodian", 14, { dir, capacidad: 14, ttlMs: 3000 });
  await dormir(3500);                                 // más que el TTL, pero con latido sano (cada 1 s)
  const u = usage("agnes", { dir });
  assert.equal(u.usado, 14, "un tenedor vivo no se vence solo");
  assert.equal(a.perdido, false, "no lo reclamó nadie");
  a.release();
  fs.rmSync(dir, { recursive: true, force: true });
});
