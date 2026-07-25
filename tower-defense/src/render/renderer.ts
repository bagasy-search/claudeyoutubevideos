// Registra las extensiones del entorno browser de forma estatica. Junto con
// `skipExtensionImports` en init(), evita que Pixi las cargue con import()
// dinamico — necesario para poder empaquetar todo en un solo archivo.
import 'pixi.js/browser'
import { Container, Graphics, Sprite, Ticker, WebGLRenderer } from 'pixi.js'
import { Rng } from '../core/rng'
import type { Game } from '../sim/game'
import { FIELD_H, FIELD_W } from '../sim/game'
import { MAX_ENEMIES, MAX_PROJECTILES } from '../sim/world'
import { FxLayer } from './fx'
import { GROUND, SEMANTIC, darken, ink, lighten, mix } from './palette'
import { TOWER_R, WALK_FRAMES, buildAtlas, type Atlas } from './sprites'

/**
 * Capa de render. Solo LEE el estado de la simulacion — no lo modifica nunca.
 *
 * Todo se dibuja interpolando entre el tic anterior y el actual con `alpha`,
 * asi la sim puede correr a 60Hz fijos mientras la pantalla va a 144Hz (o a 30)
 * sin que se vea a saltos.
 */

/** Sprites por enemigo. Se crean al vuelo: la mayoria de las runs no llena el pool. */
interface EnemyView {
  shadow: Sprite
  body: Sprite
  aura: Sprite
  hpBg: Sprite
  hpFg: Sprite
}

export class Renderer {
  /**
   * Se instancia WebGLRenderer a mano en vez de usar Application. La
   * autodeteccion de Pixi carga los renderers con import() dinamico, y al
   * aplanar todo en un unico archivo esos modulos quedan en orden incorrecto y
   * revientan con un TDZ ("Cannot access X before initialization").
   */
  renderer = new WebGLRenderer()
  readonly stage = new Container()
  readonly ticker = new Ticker()
  canvas!: HTMLCanvasElement
  fx!: FxLayer
  atlas!: Atlas

  private world = new Container()
  private bg = new Container()
  private rangeLayer = new Container()
  private shadowLayer = new Container()
  private enemyLayer = new Container()
  private towerLayer = new Container()
  private projLayer = new Container()
  private overlay = new Container()

  private views: (EnemyView | null)[] = new Array(MAX_ENEMIES).fill(null)
  private projs: Sprite[] = []
  private towerViews = new Map<number, { base: Sprite; turret: Sprite }>()

  private ghost = new Graphics()
  private rangePreview = new Graphics()
  private time = 0

  async init(game: Game, parent: HTMLElement): Promise<void> {
    await this.renderer.init({
      width: FIELD_W,
      height: FIELD_H,
      background: GROUND.deep,
      antialias: true,
      resolution: Math.min(2, window.devicePixelRatio || 1),
      autoDensity: true,
      skipExtensionImports: true,
    })
    this.canvas = this.renderer.canvas
    parent.appendChild(this.canvas)

    this.atlas = buildAtlas(this.renderer)
    this.fx = new FxLayer(this.atlas.soft, this.atlas.ring)

    this.world.addChild(
      this.bg,
      this.rangeLayer,
      this.fx.backContainer,
      this.shadowLayer,
      this.enemyLayer,
      this.towerLayer,
      this.projLayer,
      this.fx.container,
      this.overlay,
    )
    this.overlay.addChild(this.rangePreview, this.ghost)
    this.stage.addChild(this.world)

    this.drawBackground(game)
    this.allocProjectiles()
    this.wireEvents(game)

    // Prioridad baja: el dibujado corre despues de que la logica del frame
    // actualizo posiciones e interpolacion.
    this.ticker.add(() => this.renderer.render(this.stage), null, -100)
    this.ticker.start()
  }

  // ------------------------------------------------------------- escenario

  private drawBackground(game: Game): void {
    const g = new Graphics()
    const p = game.world.path

    g.rect(0, 0, FIELD_W, FIELD_H).fill(GROUND.base)

    // Manchas de terreno iluminado: rompen la planicie sin competir con nada.
    const rng = new Rng(0xa11ce)
    for (let i = 0; i < 26; i++) {
      const x = rng.range(0, FIELD_W)
      const y = rng.range(0, FIELD_H)
      g.ellipse(x, y, rng.range(50, 140), rng.range(40, 100)).fill({ color: GROUND.lit, alpha: 0.35 })
    }

    for (let x = 0; x <= FIELD_W; x += 40) g.moveTo(x, 0).lineTo(x, FIELD_H)
    for (let y = 0; y <= FIELD_H; y += 40) g.moveTo(0, y).lineTo(FIELD_W, y)
    g.stroke({ width: 1, color: GROUND.grid, alpha: 0.55 })

    // El camino: borde, calzada y una guía central tenue.
    const trace = () => {
      g.moveTo(p.xs[0], p.ys[0])
      for (let i = 1; i < p.xs.length; i++) g.lineTo(p.xs[i], p.ys[i])
    }
    trace()
    g.stroke({ width: 60, color: GROUND.pathEdge, cap: 'round', join: 'round' })
    trace()
    g.stroke({ width: 50, color: GROUND.path, cap: 'round', join: 'round' })
    trace()
    g.stroke({ width: 2, color: GROUND.pathInner, alpha: 0.6, cap: 'round', join: 'round' })

    // Piedras al borde del camino, cada tantos samples.
    for (let i = 6; i < p.xs.length - 6; i += 9) {
      const ang = Math.atan2(p.ys[i + 1] - p.ys[i], p.xs[i + 1] - p.xs[i]) + Math.PI / 2
      for (const side of [-1, 1]) {
        const d = 27 + rng.range(0, 4)
        const x = p.xs[i] + Math.cos(ang) * d * side
        const y = p.ys[i] + Math.sin(ang) * d * side
        g.ellipse(x, y, rng.range(2.5, 5), rng.range(2, 4)).fill({ color: GROUND.pathEdge, alpha: 0.9 })
      }
    }

    // Props sueltos, lejos del camino para no ensuciar la lectura del combate.
    for (let i = 0; i < 60; i++) {
      const x = rng.range(20, FIELD_W - 20)
      const y = rng.range(20, FIELD_H - 20)
      if (p.distanceToPoint(x, y) < 46) continue
      const r = rng.range(2, 6)
      g.ellipse(x, y, r, r * 0.75).fill({ color: GROUND.prop, alpha: 0.85 })
      g.ellipse(x - r * 0.25, y - r * 0.25, r * 0.5, r * 0.35).fill({ color: lighten(GROUND.prop, 0.14), alpha: 0.7 })
    }

    // Viñeta: empuja la mirada al centro del campo.
    for (let i = 0; i < 5; i++) {
      const inset = i * 8
      g.rect(inset, inset, FIELD_W - inset * 2, FIELD_H - inset * 2).stroke({
        width: 9,
        color: GROUND.deep,
        alpha: 0.07,
      })
    }

    this.bg.addChild(g)

    // Portal de entrada y núcleo: sin esto los enemigos nacen y mueren en la nada.
    const portal = new Sprite(this.atlas.portal)
    portal.anchor.set(0.5)
    portal.position.set(p.xs[0], p.ys[0])
    const core = new Sprite(this.atlas.core)
    core.anchor.set(0.5)
    core.position.set(p.xs[p.xs.length - 1], p.ys[p.ys.length - 1])
    this.bg.addChild(portal, core)
    this.portalSprite = portal
    this.coreSprite = core
  }

  private portalSprite!: Sprite
  private coreSprite!: Sprite

  private allocProjectiles(): void {
    for (let i = 0; i < MAX_PROJECTILES; i++) {
      const s = new Sprite(this.atlas.projectile[0])
      s.anchor.set(0.5)
      s.visible = false
      this.projLayer.addChild(s)
      this.projs.push(s)
    }
  }

  private viewFor(i: number): EnemyView {
    let v = this.views[i]
    if (v) return v
    const shadow = new Sprite(this.atlas.shadow)
    shadow.anchor.set(0.5)
    shadow.alpha = 0.55
    const aura = new Sprite(this.atlas.aura)
    aura.anchor.set(0.5)
    aura.visible = false
    const body = new Sprite(this.atlas.enemy[0][0])
    body.anchor.set(0.5)
    const hpBg = new Sprite(this.atlas.bar)
    hpBg.anchor.set(0.5)
    hpBg.tint = SEMANTIC.ink
    hpBg.alpha = 0.75
    const hpFg = new Sprite(this.atlas.bar)
    hpFg.anchor.set(0, 0.5)
    this.shadowLayer.addChild(shadow)
    this.enemyLayer.addChild(aura, body, hpBg, hpFg)
    v = { shadow, body, aura, hpBg, hpFg }
    this.views[i] = v
    return v
  }

  private wireEvents(game: Game): void {
    game.events.on('hit', ({ x, y, damage, crit }) => {
      this.fx.number(x, y, damage, crit)
      if (crit) {
        this.fx.burst(x, y, SEMANTIC.crit, 7, 150)
        this.fx.shake(2)
      }
    })

    game.events.on('kill', ({ x, y, elite }) => {
      const def = this.lastKilled
      if (def) {
        this.fx.corpse(def.texture, x, y, def.rotation, def.scale, darken(def.tint, 0.35))
      }
      this.fx.burst(x, y, elite ? SEMANTIC.crit : 0xc8442f, elite ? 24 : 9, elite ? 210 : 120)
      this.fx.smoke(x, y, GROUND.prop, elite ? 8 : 3)
      if (elite) this.fx.shake(5)
    })

    game.events.on('splash', ({ x, y, radius, color }) => {
      this.fx.ringAt(x, y, radius, color)
      this.fx.smoke(x, y, lighten(color, 0.3), 6)
      this.fx.shake(1.5)
    })

    game.events.on('leak', ({ x, y }) => {
      this.fx.burst(x, y, SEMANTIC.leak, 22, 190, 1.6)
      this.fx.ringAt(x, y, 70, SEMANTIC.leak)
      this.fx.shake(9)
      this.coreFlash = 1
    })

    game.events.on('fire', ({ tower }) => {
      const mx = tower.x + Math.cos(tower.angle) * 17
      const my = tower.y + Math.sin(tower.angle) * 17
      this.fx.burst(mx, my, lighten(tower.color, 0.45), 3, 70, 0.8)
    })
  }

  /** Datos del último enemigo dibujado, para poder dejar un cadáver al morir. */
  private lastKilled: { texture: import('pixi.js').Texture; rotation: number; scale: number; tint: number } | null = null
  private coreFlash = 0

  // ---------------------------------------------------------------- dibujo

  /** @param alpha interpolacion [0,1) entre el tic anterior y el actual */
  draw(game: Game, alpha: number, dtMs: number): void {
    const dt = dtMs / 1000
    this.time += dt
    this.fx.update(dt)

    this.drawEnemies(game, alpha)
    this.drawProjectiles(game, alpha)
    this.drawTowers(game, alpha)

    // El portal late; el núcleo destella cuando algo se filtra.
    this.portalSprite.rotation += dt * 0.35
    this.portalSprite.scale.set(1 + Math.sin(this.time * 2.2) * 0.04)
    if (this.coreFlash > 0) {
      this.coreFlash = Math.max(0, this.coreFlash - dt * 2.5)
      this.coreSprite.tint = mix(0xffffff, SEMANTIC.leak, 1 - this.coreFlash)
      this.coreSprite.scale.set(1 + this.coreFlash * 0.18)
    } else {
      this.coreSprite.tint = 0xffffff
      this.coreSprite.scale.set(1 + Math.sin(this.time * 1.6) * 0.02)
    }

    this.world.position.set(this.fx.shakeX, this.fx.shakeY)
  }

  private drawEnemies(game: Game, alpha: number): void {
    const e = game.world.enemies
    const path = game.world.path

    for (let i = 0; i < MAX_ENEMIES; i++) {
      const existing = this.views[i]
      if (!e.alive[i]) {
        if (existing && existing.body.visible) {
          existing.body.visible = false
          existing.shadow.visible = false
          existing.aura.visible = false
          existing.hpBg.visible = false
          existing.hpFg.visible = false
        }
        continue
      }

      const v = this.viewFor(i)
      const x = e.prevX[i] + (e.x[i] - e.prevX[i]) * alpha
      const y = e.prevY[i] + (e.y[i] - e.prevY[i]) * alpha
      const r = e.radius[i]
      const defIdx = e.defIdx[i]
      const def = game.enemyDefs[defIdx]
      const frames = this.atlas.enemy[defIdx]

      // El frame se elige por distancia recorrida, no por tiempo: asi los pasos
      // van al ritmo del suelo y un enemigo ralentizado camina mas lento gratis.
      const stride = Math.max(10, def.radius * 1.6)
      const dist = e.prevDist[i] + (e.dist[i] - e.prevDist[i]) * alpha
      const frame = Math.floor((dist / stride) * WALK_FRAMES) % WALK_FRAMES
      const angle = path.angleAt(e.dist[i])
      const scale = e.elite[i] ? 1.35 : 1

      v.body.visible = true
      v.body.texture = frames[(frame + WALK_FRAMES) % WALK_FRAMES]
      v.body.position.set(x, y)
      // Vista frontal: el sprite NO rota con el camino. Solo se inclina hacia
      // donde va, que es suficiente para comunicar direccion sin acostar al
      // personaje cuando el camino baja.
      v.body.rotation = Math.cos(angle) * 0.07
      v.body.scale.set(scale)

      // Estados, por orden de prioridad de lectura: golpe > quemadura > frío.
      let tint = 0xffffff
      if (e.flash[i] > 0) tint = mix(0xffffff, SEMANTIC.crit, e.flash[i] * 0.9)
      else if (e.burnT[i] > 0) tint = mix(0xffffff, SEMANTIC.burn, 0.4 + Math.sin(this.time * 14) * 0.14)
      else if (e.slowT[i] > 0) tint = mix(0xffffff, SEMANTIC.slow, 0.45)
      v.body.tint = tint

      v.shadow.visible = true
      v.shadow.position.set(x, y + r * 0.98)
      v.shadow.scale.set((r * 1.25) / 16, (r * 0.9) / 16)

      if (e.elite[i]) {
        v.aura.visible = true
        v.aura.position.set(x, y)
        v.aura.tint = SEMANTIC.crit
        v.aura.alpha = 0.3 + Math.sin(this.time * 3.4) * 0.1
        v.aura.scale.set((r * 2.1) / 30)
      } else if (v.aura.visible) {
        v.aura.visible = false
      }

      if (e.burnT[i] > 0 && Math.random() < 0.09) {
        this.fx.burst(x, y, SEMANTIC.burn, 1, 26, 0.5)
      }

      const hpRatio = Math.max(0, e.hp[i] / e.maxHp[i])
      const showHp = hpRatio < 0.999
      v.hpBg.visible = showHp
      v.hpFg.visible = showHp
      if (showHp) {
        const w = Math.max(18, r * 1.5)
        const by = y - (r * 1.32 + 8) * scale
        v.hpBg.position.set(x, by)
        v.hpBg.scale.set(w / 16 + 0.15, 1.5)
        v.hpFg.position.set(x - w / 2, by)
        v.hpFg.scale.set((w * hpRatio) / 16, 1)
        v.hpFg.tint = hpRatio > 0.5 ? SEMANTIC.hpFull : hpRatio > 0.22 ? SEMANTIC.hpMid : SEMANTIC.hpLow
      }

      // El evento de muerte llega sin saber como se estaba dibujando el bicho:
      // se guarda acá para poder dejar el cadáver en la pose correcta.
      if (hpRatio < 0.35 || e.hp[i] <= 0) {
        this.lastKilled = { texture: v.body.texture, rotation: angle, scale, tint: def.color }
      }
    }
  }

  private drawProjectiles(game: Game, alpha: number): void {
    const p = game.world.projectiles
    for (let i = 0; i < MAX_PROJECTILES; i++) {
      const s = this.projs[i]
      if (!p.alive[i]) {
        if (s.visible) s.visible = false
        continue
      }
      const x = p.prevX[i] + (p.x[i] - p.prevX[i]) * alpha
      const y = p.prevY[i] + (p.y[i] - p.prevY[i]) * alpha
      s.visible = true
      s.texture = this.atlas.projectile[p.kind[i]] ?? this.atlas.projectile[0]
      s.position.set(x, y)
      s.tint = p.crit[i] ? SEMANTIC.crit : lighten(p.color[i], 0.25)
      s.rotation = Math.atan2(p.vy[i], p.vx[i])
      s.scale.set(p.crit[i] ? 1.3 : 1)
    }
  }

  private drawTowers(game: Game, alpha: number): void {
    const seen = new Set<number>()
    for (const t of game.world.towers) {
      seen.add(t.id)
      let view = this.towerViews.get(t.id)
      if (!view) {
        const base = new Sprite(this.atlas.towerBase.get(t.type))
        base.anchor.set(0.5)
        const turret = new Sprite(this.atlas.towerTurret.get(t.type))
        // El pivote del cañón no es su centro: está cerca de la base.
        turret.anchor.set(0.5, 0.5)
        this.towerLayer.addChild(base, turret)
        view = { base, turret }
        this.towerViews.set(t.id, view)
      }

      const recoil = t.recoil * t.recoil
      view.base.position.set(t.x, t.y)
      view.base.scale.set(1 - recoil * 0.05)

      let diff = ((t.angle - t.prevAngle + Math.PI * 3) % (Math.PI * 2)) - Math.PI
      view.turret.position.set(t.x, t.y - TOWER_R * 0.62)
      view.turret.rotation = t.prevAngle + diff * alpha
      // El retroceso empuja el cañón hacia atrás, no lo encoge.
      view.turret.scale.set(1 - recoil * 0.12, 1)
    }
    for (const [id, view] of this.towerViews) {
      if (seen.has(id)) continue
      view.base.destroy()
      view.turret.destroy()
      this.towerViews.delete(id)
    }
  }

  // -------------------------------------------------------------- overlays

  /** Fantasma de construccion: torre translucida + circulo de alcance. */
  showGhost(game: Game, x: number, y: number, type: string | null): void {
    this.ghost.clear()
    this.rangePreview.clear()
    if (!type) return
    const def = game.towerDefs.find((d) => d.id === type)
    if (!def) return
    const check = game.canPlace(x, y, type)
    const color = check.ok ? def.color : SEMANTIC.leak

    this.rangePreview.circle(x, y, def.base.range).fill({ color, alpha: 0.06 })
    this.rangePreview.circle(x, y, def.base.range).stroke({ width: 1.5, color, alpha: 0.45 })
    this.ghost.circle(x, y, TOWER_R * 0.8).fill({ color, alpha: 0.35 }).stroke({ width: 2, color: ink(color, 0.3), alpha: 0.7 })
  }

  hoverRange(x: number, y: number, radius: number, color: number): void {
    this.rangePreview.clear()
    this.rangePreview.circle(x, y, radius).fill({ color, alpha: 0.05 })
    this.rangePreview.circle(x, y, radius).stroke({ width: 1.5, color, alpha: 0.4 })
  }

  clearOverlays(): void {
    this.ghost.clear()
    this.rangePreview.clear()
  }
}
