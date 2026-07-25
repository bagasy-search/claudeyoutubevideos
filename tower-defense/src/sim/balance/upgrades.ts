import type { Rarity, UpgradeDef } from '../types'

/**
 * Pool de mejoras. Todo esto es data pura y sin logica de sorteo: quien decide
 * que sale es /draft/draft.ts.
 *
 * Guia de rarezas:
 *  - common:    'inc' chicos, sin requisitos. Relleno que siempre sirve.
 *  - rare:      'inc' grandes o 'flat' con scope.
 *  - epic:      cambian como jugas (proyectiles extra, pierce, quemadura).
 *  - legendary: 'more' o efectos unicos. Rompen el juego a proposito.
 */
export const UPGRADES: readonly UpgradeDef[] = [
  // ---------- COMMON ----------
  {
    id: 'sharp_tips',
    name: 'Puntas afiladas',
    desc: '+20% de daño a todas las torres.',
    rarity: 'common',
    maxStacks: 8,
    weight: 10,
    synergyTags: ['damage'],
    modifiers: [{ stat: 'damage', op: 'inc', value: 0.2 }],
  },
  {
    id: 'oiled_gears',
    name: 'Engranajes aceitados',
    desc: '+15% de cadencia a todas las torres.',
    rarity: 'common',
    maxStacks: 8,
    weight: 10,
    synergyTags: ['firerate'],
    modifiers: [{ stat: 'fireRate', op: 'inc', value: 0.15 }],
  },
  {
    id: 'spyglass',
    name: 'Catalejo',
    desc: '+18% de alcance a todas las torres.',
    rarity: 'common',
    maxStacks: 5,
    weight: 8,
    synergyTags: ['range'],
    modifiers: [{ stat: 'range', op: 'inc', value: 0.18 }],
  },
  {
    id: 'fletching',
    name: 'Emplumado',
    desc: 'Ballestas: +6 de daño plano.',
    rarity: 'common',
    maxStacks: 6,
    weight: 9,
    synergyTags: ['arrow', 'damage'],
    requires: (c) => (c.towerCounts.arrow ?? 0) >= 1,
    modifiers: [{ stat: 'damage', op: 'flat', value: 6, scope: { tower: 'arrow' } }],
  },
  {
    id: 'bigger_shells',
    name: 'Proyectiles gruesos',
    desc: 'Morteros: +25% de radio de explosión.',
    rarity: 'common',
    maxStacks: 5,
    weight: 9,
    synergyTags: ['cannon', 'splash'],
    requires: (c) => (c.towerCounts.cannon ?? 0) >= 1,
    modifiers: [{ stat: 'splashRadius', op: 'inc', value: 0.25, scope: { tower: 'cannon' } }],
  },
  {
    id: 'cold_snap',
    name: 'Helada',
    desc: 'Prismas: +0.08 de poder de ralentización.',
    rarity: 'common',
    maxStacks: 5,
    weight: 9,
    synergyTags: ['frost', 'control'],
    requires: (c) => (c.towerCounts.frost ?? 0) >= 1,
    modifiers: [{ stat: 'slowPower', op: 'flat', value: 0.08, scope: { tower: 'frost' } }],
  },
  {
    id: 'war_chest',
    name: 'Cofre de guerra',
    desc: '+120 de oro ahora.',
    rarity: 'common',
    maxStacks: Infinity,
    weight: 6,
    synergyTags: ['economy'],
    effect: { gold: 120 },
  },

  // ---------- RARE ----------
  {
    id: 'ballistics',
    name: 'Balística',
    desc: '+35% de daño y +20% de velocidad de proyectil a las físicas.',
    rarity: 'rare',
    maxStacks: 4,
    weight: 10,
    synergyTags: ['physical', 'damage'],
    requires: (c) => (c.tagCounts.physical ?? 0) >= 2,
    modifiers: [
      { stat: 'damage', op: 'inc', value: 0.35, scope: { tag: 'physical' } },
      { stat: 'projectileSpeed', op: 'inc', value: 0.2, scope: { tag: 'physical' } },
    ],
  },
  {
    id: 'keen_eye',
    name: 'Ojo agudo',
    desc: '+12% de crítico y +0.4 al multiplicador de crítico.',
    rarity: 'rare',
    maxStacks: 4,
    weight: 10,
    synergyTags: ['crit'],
    modifiers: [
      { stat: 'critChance', op: 'flat', value: 0.12 },
      { stat: 'critMult', op: 'flat', value: 0.4 },
    ],
  },
  {
    id: 'armor_breaker',
    name: 'Rompearmaduras',
    desc: '+8 de penetración de armadura a todas las torres.',
    rarity: 'rare',
    maxStacks: 3,
    weight: 8,
    synergyTags: ['damage'],
    requires: (c) => c.wave >= 6,
    modifiers: [{ stat: 'armorPen', op: 'flat', value: 8 }],
  },
  {
    id: 'deep_freeze',
    name: 'Congelación profunda',
    desc: 'Frost: +60% de duración de ralentización y +25% de alcance.',
    rarity: 'rare',
    maxStacks: 3,
    weight: 9,
    synergyTags: ['frost', 'control'],
    requires: (c) => (c.tagCounts.frost ?? 0) >= 1,
    modifiers: [
      { stat: 'slowDuration', op: 'inc', value: 0.6, scope: { tag: 'frost' } },
      { stat: 'range', op: 'inc', value: 0.25, scope: { tag: 'frost' } },
    ],
  },
  {
    id: 'interest',
    name: 'Usura',
    desc: '+5% de interés sobre el oro al final de cada oleada.',
    rarity: 'rare',
    maxStacks: 4,
    weight: 7,
    synergyTags: ['economy'],
    effect: { interest: 0.05 },
  },
  {
    id: 'salvage',
    name: 'Chatarreo',
    desc: '+25% de oro por cada enemigo eliminado.',
    rarity: 'rare',
    maxStacks: 4,
    weight: 8,
    synergyTags: ['economy'],
    effect: { goldMult: 0.25 },
  },

  // ---------- EPIC ----------
  {
    id: 'twin_shot',
    name: 'Disparo gemelo',
    desc: '+1 proyectil por disparo en las torres rápidas.',
    rarity: 'epic',
    maxStacks: 3,
    weight: 10,
    synergyTags: ['arrow', 'fast'],
    requires: (c) => (c.tagCounts.fast ?? 0) >= 1,
    excludes: ['scattershot'],
    modifiers: [{ stat: 'projectiles', op: 'flat', value: 1, scope: { tag: 'fast' } }],
  },
  {
    id: 'scattershot',
    name: 'Perdigonada',
    desc: '+2 proyectiles pero -30% de daño en todo.',
    rarity: 'epic',
    maxStacks: 2,
    weight: 8,
    synergyTags: ['damage'],
    excludes: ['twin_shot'],
    modifiers: [
      { stat: 'projectiles', op: 'flat', value: 2 },
      { stat: 'damage', op: 'inc', value: -0.3 },
    ],
  },
  {
    id: 'piercing_rounds',
    name: 'Munición perforante',
    desc: 'Los proyectiles atraviesan a 2 enemigos más.',
    rarity: 'epic',
    maxStacks: 3,
    weight: 9,
    synergyTags: ['physical'],
    modifiers: [{ stat: 'pierce', op: 'flat', value: 2 }],
  },
  {
    id: 'incendiary',
    name: 'Incendiario',
    desc: 'Los impactos queman: 14 de daño por segundo durante 3s.',
    rarity: 'epic',
    maxStacks: 4,
    weight: 9,
    synergyTags: ['burn', 'elemental'],
    modifiers: [
      { stat: 'burnDps', op: 'flat', value: 14 },
      { stat: 'burnDuration', op: 'flat', value: 3 },
    ],
  },
  {
    id: 'shatter',
    name: 'Fractura',
    desc: 'Frost: +80% de daño; el hielo ahora duele.',
    rarity: 'epic',
    maxStacks: 3,
    weight: 8,
    synergyTags: ['frost'],
    requires: (c) => (c.tagCounts.frost ?? 0) >= 2,
    modifiers: [{ stat: 'damage', op: 'inc', value: 0.8, scope: { tag: 'frost' } }],
  },

  // ---------- LEGENDARY ----------
  {
    id: 'overclock',
    name: 'Sobremarcha',
    desc: '×1.6 de cadencia (multiplicativo) en todas las torres.',
    rarity: 'legendary',
    maxStacks: 2,
    weight: 10,
    synergyTags: ['firerate'],
    requires: (c) => c.wave >= 5,
    modifiers: [{ stat: 'fireRate', op: 'more', value: 0.6 }],
  },
  {
    id: 'siege_doctrine',
    name: 'Doctrina de asedio',
    desc: 'Morteros: ×2 de daño y +40% de radio. Cadencia -20%.',
    rarity: 'legendary',
    maxStacks: 2,
    weight: 9,
    synergyTags: ['cannon', 'splash'],
    requires: (c) => (c.towerCounts.cannon ?? 0) >= 2,
    modifiers: [
      { stat: 'damage', op: 'more', value: 1.0, scope: { tower: 'cannon' } },
      { stat: 'splashRadius', op: 'inc', value: 0.4, scope: { tower: 'cannon' } },
      { stat: 'fireRate', op: 'inc', value: -0.2, scope: { tower: 'cannon' } },
    ],
  },
  {
    id: 'executioner',
    name: 'Verdugo',
    desc: 'Crítico +25% y multiplicador de crítico ×2.',
    rarity: 'legendary',
    maxStacks: 1,
    weight: 9,
    synergyTags: ['crit'],
    requires: (c) => (c.picks.keen_eye ?? 0) >= 1,
    modifiers: [
      { stat: 'critChance', op: 'flat', value: 0.25 },
      { stat: 'critMult', op: 'more', value: 1.0 },
    ],
  },
  {
    id: 'absolute_zero',
    name: 'Cero absoluto',
    desc: 'Todas las torres ralentizan un 20%. El control se vuelve global.',
    rarity: 'legendary',
    maxStacks: 1,
    weight: 8,
    synergyTags: ['frost', 'control'],
    requires: (c) => c.wave >= 8,
    modifiers: [
      { stat: 'slowPower', op: 'flat', value: 0.2 },
      { stat: 'slowDuration', op: 'flat', value: 1.2 },
    ],
  },
  {
    id: 'gold_rush',
    name: 'Fiebre del oro',
    desc: '+250 de oro y +60 por oleada de acá en adelante.',
    rarity: 'legendary',
    maxStacks: 2,
    weight: 7,
    synergyTags: ['economy'],
    effect: { gold: 250, goldPerWave: 60 },
  },
]

export const UPGRADE_BY_ID = new Map(UPGRADES.map((u) => [u.id, u]))

/**
 * Tabla de rarezas por oleada. Se sortea la RAREZA primero y recien despues la
 * carta dentro de esa rareza. Si sorteas todo junto por peso, las legendarias
 * aparecen apiladas al principio o directamente nunca.
 */
export function rarityWeights(wave: number): Record<Rarity, number> {
  const t = Math.min(1, Math.max(0, (wave - 1) / 24))
  return {
    common: lerp(78, 24, t),
    rare: lerp(20, 38, t),
    epic: lerp(2, 26, t),
    legendary: lerp(0, 12, t),
  }
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

export const RARITY_ORDER: readonly Rarity[] = ['common', 'rare', 'epic', 'legendary']

export const RARITY_COLOR: Record<Rarity, string> = {
  common: '#a8a093',
  rare: '#4a86c8',
  epic: '#8b5fd6',
  legendary: '#d4a017',
}
