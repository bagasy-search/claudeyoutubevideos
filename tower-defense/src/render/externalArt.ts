import { Assets, Texture } from 'pixi.js'
import { ENEMIES } from '../sim/balance/enemies'
import type { Atlas } from './sprites'

/**
 * Reemplazo del arte procedural por PNGs externos.
 *
 * Es la costura entre "arte generado por codigo" y "arte de verdad": venga de
 * una IA, de un pack CC0 o de un ilustrador, entra por aca. El atlas procedural
 * sigue siendo el default y esto solo pisa lo que encuentra, asi que se puede
 * reemplazar una criatura sola y el resto sigue andando.
 *
 * Nada de esto toca la simulacion. Cambia de donde salen las texturas y ya.
 */

export interface ArtManifest {
  /**
   * Frames del ciclo de caminata por enemigo, en orden.
   * La cantidad puede ser distinta de WALK_FRAMES: el render cicla sobre lo que haya.
   */
  enemies?: Record<string, string[]>
  towerBase?: Record<string, string>
  towerTurret?: Record<string, string>
  projectiles?: string[]
  portal?: string
  core?: string
}

export interface LoadReport {
  replaced: string[]
  missing: string[]
}

/**
 * Carga `manifestUrl` y pisa en el atlas lo que declare. Si el manifiesto no
 * existe (que es el caso normal), no hace nada y el juego arranca con el arte
 * procedural — asi el build de un solo archivo sigue funcionando sin assets.
 */
export async function applyExternalArt(atlas: Atlas, manifestUrl: string): Promise<LoadReport> {
  const report: LoadReport = { replaced: [], missing: [] }

  let manifest: ArtManifest
  try {
    const res = await fetch(manifestUrl)
    if (!res.ok) return report
    manifest = (await res.json()) as ArtManifest
  } catch {
    return report
  }

  const base = new URL(manifestUrl, location.href)
  const resolve = (p: string) => new URL(p, base).href

  const load = async (path: string): Promise<Texture | null> => {
    try {
      return await Assets.load<Texture>(resolve(path))
    } catch {
      report.missing.push(path)
      return null
    }
  }

  if (manifest.enemies) {
    for (const [id, paths] of Object.entries(manifest.enemies)) {
      const idx = ENEMIES.findIndex((e) => e.id === id)
      if (idx < 0) {
        report.missing.push(`enemigo desconocido: ${id}`)
        continue
      }
      const frames = (await Promise.all(paths.map(load))).filter((t): t is Texture => t !== null)
      if (frames.length > 0) {
        atlas.enemy[idx] = frames
        report.replaced.push(`enemy:${id} (${frames.length} frames)`)
      }
    }
  }

  for (const [key, map] of [
    ['towerBase', manifest.towerBase],
    ['towerTurret', manifest.towerTurret],
  ] as const) {
    if (!map) continue
    for (const [id, path] of Object.entries(map)) {
      const tex = await load(path)
      if (tex) {
        atlas[key].set(id, tex)
        report.replaced.push(`${key}:${id}`)
      }
    }
  }

  if (manifest.projectiles) {
    const texes = await Promise.all(manifest.projectiles.map(load))
    texes.forEach((t, i) => {
      if (t) {
        atlas.projectile[i] = t
        report.replaced.push(`projectile:${i}`)
      }
    })
  }

  for (const key of ['portal', 'core'] as const) {
    const path = manifest[key]
    if (!path) continue
    const tex = await load(path)
    if (tex) {
      atlas[key] = tex
      report.replaced.push(key)
    }
  }

  return report
}
