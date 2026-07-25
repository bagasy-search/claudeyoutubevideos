import type { EnemyDef } from '../types'

/**
 * Catalogo de enemigos. La oleada se arma comprando de aca con un presupuesto,
 * no con listas fijas hardcodeadas por oleada.
 */
export const ENEMIES: readonly EnemyDef[] = [
  {
    id: 'grunt',
    name: 'Peón',
    cost: 1,
    hp: 30,
    speed: 46,
    armor: 0,
    radius: 9,
    bounty: 4,
    color: 0xc8442f,
    tags: ['ground'],
    leak: 1,
  },
  {
    id: 'runner',
    name: 'Corredor',
    cost: 1.4,
    hp: 18,
    speed: 92,
    armor: 0,
    radius: 7,
    bounty: 5,
    color: 0xe07a1f,
    tags: ['ground', 'fast'],
    leak: 1,
  },
  {
    id: 'swarm',
    name: 'Enjambre',
    cost: 0.7,
    hp: 12,
    speed: 58,
    armor: 0,
    radius: 6,
    bounty: 2,
    color: 0xb8232f,
    tags: ['ground', 'swarm'],
    leak: 1,
  },
  {
    id: 'brute',
    name: 'Bruto',
    cost: 4,
    hp: 190,
    speed: 32,
    armor: 6,
    radius: 14,
    bounty: 16,
    color: 0x8a4a22,
    tags: ['ground', 'armored'],
    leak: 2,
  },
  {
    id: 'juggernaut',
    name: 'Coloso',
    cost: 14,
    hp: 900,
    speed: 26,
    armor: 12,
    radius: 20,
    bounty: 60,
    color: 0x93332e,
    tags: ['ground', 'armored', 'boss'],
    leak: 5,
  },
]

export const ENEMY_BY_ID = new Map(ENEMIES.map((e) => [e.id, e]))

/** A partir de que oleada aparece cada tipo. */
export const UNLOCK_WAVE: Record<string, number> = {
  grunt: 1,
  runner: 3,
  swarm: 5,
  brute: 8,
  juggernaut: 10,
}
