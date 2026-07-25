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

/**
 * Una entrada puede ser la ruta pelada o llevar `pixelRatio` cuando el PNG se
 * exportó a mayor densidad. Un PNG de 336 px con pixelRatio 2 mide 168 px de
 * juego y se ve nítido en pantallas densas.
 */
export type ArtEntry = string | { path: string; pixelRatio?: number }

export interface ArtManifest {
  /**
   * Frames del ciclo de caminata por enemigo, en orden.
   * La cantidad puede ser distinta de WALK_FRAMES: el render cicla sobre lo que haya.
   */
  enemies?: Record<string, ArtEntry[]>
  /** Una entrada o una lista, si la torre se anima. */
  towerBase?: Record<string, ArtEntry | ArtEntry[]>
  towerTurret?: Record<string, ArtEntry>
  projectiles?: ArtEntry[]
  portal?: ArtEntry
  core?: ArtEntry
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
  let manifest: ArtManifest
  try {
    const res = await fetch(manifestUrl)
    if (!res.ok) return { replaced: [], missing: [] }
    manifest = (await res.json()) as ArtManifest
  } catch {
    return { replaced: [], missing: [] }
  }
  const base = new URL(manifestUrl, location.href)
  return applyManifest(atlas, manifest, (p) => new URL(p, base).href)
}

/**
 * Aplica un manifiesto ya cargado. Se usa tambien con el arte embebido en el
 * bundle, donde las rutas son data: URIs y no hay nada que resolver: el build de
 * un solo archivo no puede hacer requests, asi que los PNG viajan adentro.
 */
export async function applyManifest(
  atlas: Atlas,
  manifest: ArtManifest,
  resolve: (path: string) => string = (p) => p,
): Promise<LoadReport> {
  const report: LoadReport = { replaced: [], missing: [] }

  const load = async (entry: ArtEntry): Promise<Texture | null> => {
    const path = typeof entry === 'string' ? entry : entry.path
    const pixelRatio = typeof entry === 'string' ? 1 : (entry.pixelRatio ?? 1)
    try {
      /*
       * La resolucion va como opcion de CARGA, no asignada despues. Mutar
       * `source.resolution` sobre una textura ya creada deja el frame calculado
       * con el tamaño viejo: la textura queda descuadrada y el sprite no dibuja
       * nada. Pasandola al loader, el frame se calcula bien de entrada.
       */
      const tex = await Assets.load<Texture>({
        src: resolve(path),
        data: { resolution: pixelRatio },
      })
      return tex
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

  if (manifest.towerBase) {
    for (const [id, entry] of Object.entries(manifest.towerBase)) {
      const list = Array.isArray(entry) ? entry : [entry]
      const frames = (await Promise.all(list.map(load))).filter((t): t is Texture => t !== null)
      if (frames.length > 0) {
        atlas.towerBase.set(id, frames)
        report.replaced.push(`towerBase:${id} (${frames.length} frames)`)
      }
    }
  }

  if (manifest.towerTurret) {
    for (const [id, entry] of Object.entries(manifest.towerTurret)) {
      const tex = await load(entry)
      if (tex) {
        atlas.towerTurret.set(id, tex)
        report.replaced.push(`towerTurret:${id}`)
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
