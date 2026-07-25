import type { TowerDef } from '../types'
import { emptyStats } from '../stats'

function stats(over: Partial<ReturnType<typeof emptyStats>>) {
  return { ...emptyStats(), ...over }
}

/**
 * Tres arquetipos que cubren los tres roles clasicos: DPS de un blanco,
 * limpieza de grupos, y control. Todo esto es data — se toca cientos de veces.
 */
export const TOWERS: readonly TowerDef[] = [
  {
    id: 'arrow',
    name: 'Ballesta',
    cost: 50,
    tags: ['physical', 'single', 'fast'],
    color: 0x6fbf73,
    shot: 'bolt',
    desc: 'Rápida y barata. Un blanco por disparo.',
    base: stats({
      damage: 9,
      fireRate: 2.2,
      range: 130,
      projectileSpeed: 520,
      critChance: 0.05,
      critMult: 2,
    }),
  },
  {
    id: 'cannon',
    name: 'Mortero',
    cost: 110,
    tags: ['physical', 'splash', 'slow'],
    color: 0x4f7fa8,
    shot: 'shell',
    desc: 'Lento, pega en área. Rompe grupos.',
    base: stats({
      damage: 26,
      fireRate: 0.6,
      range: 165,
      projectileSpeed: 300,
      splashRadius: 46,
      armorPen: 4,
    }),
  },
  {
    id: 'frost',
    name: 'Prisma',
    cost: 80,
    tags: ['elemental', 'frost', 'control'],
    color: 0x7fd4e8,
    shot: 'shard',
    desc: 'Poco daño, ralentiza al que toca.',
    base: stats({
      damage: 5,
      fireRate: 1.4,
      range: 145,
      projectileSpeed: 420,
      slowPower: 0.3,
      slowDuration: 1.6,
    }),
  },
]

export const TOWER_BY_ID = new Map(TOWERS.map((t) => [t.id, t]))
