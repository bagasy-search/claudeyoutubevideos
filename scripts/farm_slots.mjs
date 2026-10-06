// farm_slots.mjs — cuántos jobs de GitHub Actions podemos correr A LA VEZ y cuántos chunks le tocan a cada video.
//
// Techo del PLAN, no del farm: Team eran 60; la org pasó a Enterprise (15-sep-2026) y el panel
// github.com/enterprises/bagasy/settings/actions/hosted-runners ("All jobs usage") mostró 180 y al día
// siguiente 360 — GitHub lo sube por escalones. Cuando cambie, FARM_SLOTS=<n> (o editá el default).
//
// Por video el techo útil sigue siendo 60: cada chunk hace su checkout + install + baja el tarball de
// assets, y arriba de 60 ese arranque pesa más que el render. Con más slots NO se parte más cada video:
// entran más videos a la vez con sus 60.
export const FARM_SLOTS = Number(process.env.FARM_SLOTS || 360);
export const CHUNKS_POR_VIDEO = 60;

// otros = videos que ya están rendeando. Reparte los slots entre todos (este incluido) sin pasar de 60
// por video ni bajar del piso (menos chunks arriesga el timeout de 90' por chunk en un video largo).
export function chunksPorVideo(otros, { piso = 12, slots = FARM_SLOTS, techo = CHUNKS_POR_VIDEO } = {}) {
  return Math.max(piso, Math.min(techo, Math.floor(slots / (otros + 1))));
}
