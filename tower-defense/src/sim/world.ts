import { ENEMIES } from './balance/enemies'
import type { Path } from './path'
import type { Stats } from './stats'

/**
 * ECS ligero con arrays paralelos (struct-of-arrays).
 *
 * No hace falta una libreria: arrays tipados + una free-list alcanzan y sobran
 * para miles de entidades, y el layout de memoria hace que los sistemas iteren
 * rapido. Las torres son pocas (decenas) asi que van como objetos normales.
 *
 * Handles: (index, gen). La generacion se incrementa al liberar, asi un
 * proyectil que apuntaba a un enemigo muerto no le pega al que reuso su slot.
 */

export const MAX_ENEMIES = 1024
export const MAX_PROJECTILES = 4096

export class EnemyPool {
  readonly alive = new Uint8Array(MAX_ENEMIES)
  readonly gen = new Uint16Array(MAX_ENEMIES)
  readonly defIdx = new Int16Array(MAX_ENEMIES)
  readonly dist = new Float32Array(MAX_ENEMIES)
  readonly prevDist = new Float32Array(MAX_ENEMIES)
  readonly x = new Float32Array(MAX_ENEMIES)
  readonly y = new Float32Array(MAX_ENEMIES)
  readonly prevX = new Float32Array(MAX_ENEMIES)
  readonly prevY = new Float32Array(MAX_ENEMIES)
  readonly hp = new Float32Array(MAX_ENEMIES)
  readonly maxHp = new Float32Array(MAX_ENEMIES)
  readonly speed = new Float32Array(MAX_ENEMIES)
  readonly armor = new Float32Array(MAX_ENEMIES)
  readonly radius = new Float32Array(MAX_ENEMIES)
  readonly bounty = new Float32Array(MAX_ENEMIES)
  readonly slowT = new Float32Array(MAX_ENEMIES)
  readonly slowP = new Float32Array(MAX_ENEMIES)
  readonly burnT = new Float32Array(MAX_ENEMIES)
  readonly burnDps = new Float32Array(MAX_ENEMIES)
  readonly elite = new Uint8Array(MAX_ENEMIES)
  /** 0..1, para el flash blanco al recibir dano (solo render). */
  readonly flash = new Float32Array(MAX_ENEMIES)
  /**
   * Semilla estable por instancia, en 0..1. La usa SOLO el render para variar
   * tono, tamaño y fase de animacion entre individuos del mismo tipo. Sin esto
   * una oleada es un ejercito de clones sincronizados, que es la marca mas
   * obvia de arte generado a maquina.
   *
   * Vive en la sim y no en el render porque tiene que sobrevivir a que el
   * sprite se recicle, y porque sale del RNG semillado: dos runs con la misma
   * seed tienen que verse identicas.
   */
  readonly variant = new Float32Array(MAX_ENEMIES)

  private free: number[] = []
  private cursor = 0
  count = 0

  spawn(defIdx: number, hpMul: number, isElite: boolean, variant = 0): number {
    let i: number
    if (this.free.length > 0) i = this.free.pop()!
    else if (this.cursor < MAX_ENEMIES) i = this.cursor++
    else return -1

    const def = ENEMIES[defIdx]
    this.alive[i] = 1
    this.defIdx[i] = defIdx
    this.dist[i] = 0
    this.prevDist[i] = 0
    this.hp[i] = def.hp * hpMul
    this.maxHp[i] = this.hp[i]
    this.speed[i] = def.speed
    this.armor[i] = def.armor
    this.radius[i] = def.radius * (isElite ? 1.35 : 1)
    this.bounty[i] = def.bounty * (isElite ? 3 : 1)
    this.slowT[i] = 0
    this.slowP[i] = 0
    this.burnT[i] = 0
    this.burnDps[i] = 0
    this.elite[i] = isElite ? 1 : 0
    this.flash[i] = 0
    this.variant[i] = variant
    this.count++
    return i
  }

  kill(i: number): void {
    if (!this.alive[i]) return
    this.alive[i] = 0
    this.gen[i] = (this.gen[i] + 1) & 0xffff
    this.free.push(i)
    this.count--
  }

  clear(): void {
    this.alive.fill(0)
    this.free.length = 0
    this.cursor = 0
    this.count = 0
  }

  get capacityUsed(): number {
    return this.cursor
  }
}

export class ProjectilePool {
  readonly alive = new Uint8Array(MAX_PROJECTILES)
  readonly x = new Float32Array(MAX_PROJECTILES)
  readonly y = new Float32Array(MAX_PROJECTILES)
  readonly prevX = new Float32Array(MAX_PROJECTILES)
  readonly prevY = new Float32Array(MAX_PROJECTILES)
  readonly vx = new Float32Array(MAX_PROJECTILES)
  readonly vy = new Float32Array(MAX_PROJECTILES)
  readonly speed = new Float32Array(MAX_PROJECTILES)
  readonly damage = new Float32Array(MAX_PROJECTILES)
  readonly splash = new Float32Array(MAX_PROJECTILES)
  readonly pierce = new Int16Array(MAX_PROJECTILES)
  readonly slowP = new Float32Array(MAX_PROJECTILES)
  readonly slowT = new Float32Array(MAX_PROJECTILES)
  readonly burnDps = new Float32Array(MAX_PROJECTILES)
  readonly burnT = new Float32Array(MAX_PROJECTILES)
  readonly armorPen = new Float32Array(MAX_PROJECTILES)
  readonly crit = new Uint8Array(MAX_PROJECTILES)
  readonly targetIdx = new Int16Array(MAX_PROJECTILES)
  readonly targetGen = new Uint16Array(MAX_PROJECTILES)
  readonly life = new Float32Array(MAX_PROJECTILES)
  readonly color = new Uint32Array(MAX_PROJECTILES)
  readonly kind = new Uint8Array(MAX_PROJECTILES)
  /** Enemigos ya golpeados por este proyectil (para pierce). */
  readonly hitList: number[][] = Array.from({ length: MAX_PROJECTILES }, () => [])

  private free: number[] = []
  private cursor = 0
  count = 0

  alloc(): number {
    let i: number
    if (this.free.length > 0) i = this.free.pop()!
    else if (this.cursor < MAX_PROJECTILES) i = this.cursor++
    else return -1
    this.alive[i] = 1
    this.hitList[i].length = 0
    this.count++
    return i
  }

  release(i: number): void {
    if (!this.alive[i]) return
    this.alive[i] = 0
    this.free.push(i)
    this.count--
  }

  clear(): void {
    this.alive.fill(0)
    this.free.length = 0
    this.cursor = 0
    this.count = 0
  }

  get capacityUsed(): number {
    return this.cursor
  }
}

export interface Tower {
  id: number
  type: string
  tags: readonly string[]
  x: number
  y: number
  cooldown: number
  /** Angulo del canon, se interpola en render. */
  angle: number
  prevAngle: number
  /** Stats derivados; se recalculan solo cuando cambia la lista de mods. */
  stats: Stats
  color: number
  shot: 'bolt' | 'shell' | 'shard'
  kills: number
  damageDealt: number
  /** Efecto visual de retroceso al disparar (0..1). */
  recoil: number
}

/**
 * Grid espacial uniforme. Con 500 enemigos y 40 torres, hacer las queries de
 * rango a fuerza bruta es O(n·m) y se nota. El grid se reconstruye entero cada
 * tick — es mas barato que mantenerlo incremental a esta escala.
 */
export class SpatialGrid {
  private cells: number[][] = []
  private cols = 0
  private rows = 0

  constructor(
    readonly width: number,
    readonly height: number,
    readonly cellSize = 64,
  ) {
    this.cols = Math.ceil(width / cellSize) + 1
    this.rows = Math.ceil(height / cellSize) + 1
    this.cells = Array.from({ length: this.cols * this.rows }, () => [])
  }

  rebuild(pool: EnemyPool): void {
    for (const c of this.cells) c.length = 0
    const n = pool.capacityUsed
    for (let i = 0; i < n; i++) {
      if (!pool.alive[i]) continue
      const cx = Math.min(this.cols - 1, Math.max(0, (pool.x[i] / this.cellSize) | 0))
      const cy = Math.min(this.rows - 1, Math.max(0, (pool.y[i] / this.cellSize) | 0))
      this.cells[cy * this.cols + cx].push(i)
    }
  }

  /** Llama a `fn` con cada indice de enemigo candidato dentro del radio. */
  query(x: number, y: number, radius: number, fn: (i: number) => void): void {
    const minX = Math.max(0, ((x - radius) / this.cellSize) | 0)
    const maxX = Math.min(this.cols - 1, ((x + radius) / this.cellSize) | 0)
    const minY = Math.max(0, ((y - radius) / this.cellSize) | 0)
    const maxY = Math.min(this.rows - 1, ((y + radius) / this.cellSize) | 0)
    for (let cy = minY; cy <= maxY; cy++) {
      for (let cx = minX; cx <= maxX; cx++) {
        const cell = this.cells[cy * this.cols + cx]
        for (let k = 0; k < cell.length; k++) fn(cell[k])
      }
    }
  }
}

export interface World {
  path: Path
  enemies: EnemyPool
  projectiles: ProjectilePool
  towers: Tower[]
  grid: SpatialGrid
  width: number
  height: number
}
