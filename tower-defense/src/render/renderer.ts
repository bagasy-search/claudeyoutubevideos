import { Application, Container, Graphics, Sprite, Texture } from 'pixi.js'
import type { Game } from '../sim/game'
import { FIELD_H, FIELD_W } from '../sim/game'
import { MAX_ENEMIES, MAX_PROJECTILES } from '../sim/world'
import { FxLayer } from './fx'

/**
 * Capa de render. Solo LEE el estado de la simulacion — no lo modifica nunca.
 *
 * Todo se dibuja interpolando entre el tic anterior y el actual con `alpha`,
 * asi la sim puede correr a 60Hz fijos mientras la pantalla va a 144Hz (o a 30)
 * sin que se vea a saltos.
 */
export class Renderer {
  app = new Application()
  fx!: FxLayer

  private world = new Container()
  private bg = new Container()
  private rangeLayer = new Container()
  private enemyLayer = new Container()
  private towerLayer = new Container()
  private projLayer = new Container()

  private dotTex!: Texture
  private ringTex!: Texture
  private barTex!: Texture

  private bodies: Sprite[] = []
  private heads: Sprite[] = []
  private hpBg: Sprite[] = []
  private hpFg: Sprite[] = []
  private projs: Sprite[] = []
  private towerViews = new Map<number, { base: Sprite; barrel: Sprite }>()

  private ghost = new Graphics()
  private rangePreview = new Graphics()
  private time = 0

  async init(game: Game, parent: HTMLElement): Promise<void> {
    await this.app.init({
      width: FIELD_W,
      height: FIELD_H,
      background: 0x11151c,
      antialias: true,
      resolution: Math.min(2, window.devicePixelRatio || 1),
      autoDensity: true,
    })
    parent.appendChild(this.app.canvas)

    this.buildTextures()
    this.fx = new FxLayer(this.dotTex, this.ringTex)

    this.world.addChild(this.bg, this.rangeLayer, this.enemyLayer, this.towerLayer, this.projLayer, this.fx.container)
    this.world.addChild(this.rangePreview, this.ghost)
    this.app.stage.addChild(this.world)

    this.drawBackground(game)
    this.allocPools()
    this.wireEvents(game)
  }

  private buildTextures(): void {
    const r = this.app.renderer

    const dot = new Graphics().circle(0, 0, 16).fill(0xffffff)
    this.dotTex = r.generateTexture({ target: dot, resolution: 2 })

    const ring = new Graphics().circle(0, 0, 64).stroke({ width: 6, color: 0xffffff, alignment: 0.5 })
    this.ringTex = r.generateTexture({ target: ring, resolution: 2 })

    const bar = new Graphics().rect(0, 0, 16, 4).fill(0xffffff)
    this.barTex = r.generateTexture({ target: bar, resolution: 2 })
  }

  private drawBackground(game: Game): void {
    const g = new Graphics()
    g.rect(0, 0, FIELD_W, FIELD_H).fill(0x141a23)

    for (let x = 0; x <= FIELD_W; x += 40) g.moveTo(x, 0).lineTo(x, FIELD_H)
    for (let y = 0; y <= FIELD_H; y += 40) g.moveTo(0, y).lineTo(FIELD_W, y)
    g.stroke({ width: 1, color: 0x1d2634 })

    const p = game.world.path
    g.moveTo(p.xs[0], p.ys[0])
    for (let i = 1; i < p.xs.length; i++) g.lineTo(p.xs[i], p.ys[i])
    g.stroke({ width: 54, color: 0x1b2330, cap: 'round', join: 'round' })

    g.moveTo(p.xs[0], p.ys[0])
    for (let i = 1; i < p.xs.length; i++) g.lineTo(p.xs[i], p.ys[i])
    g.stroke({ width: 2, color: 0x2b3a4f })

    this.bg.addChild(g)
  }

  private allocPools(): void {
    for (let i = 0; i < MAX_ENEMIES; i++) {
      const body = new Sprite(this.dotTex)
      body.anchor.set(0.5)
      body.visible = false
      const head = new Sprite(this.dotTex)
      head.anchor.set(0.5)
      head.visible = false
      const bg = new Sprite(this.barTex)
      bg.anchor.set(0.5)
      bg.tint = 0x000000
      bg.alpha = 0.6
      bg.visible = false
      const fg = new Sprite(this.barTex)
      fg.anchor.set(0, 0.5)
      fg.visible = false
      this.enemyLayer.addChild(body, head, bg, fg)
      this.bodies.push(body)
      this.heads.push(head)
      this.hpBg.push(bg)
      this.hpFg.push(fg)
    }
    for (let i = 0; i < MAX_PROJECTILES; i++) {
      const s = new Sprite(this.dotTex)
      s.anchor.set(0.5)
      s.visible = false
      this.projLayer.addChild(s)
      this.projs.push(s)
    }
  }

  private wireEvents(game: Game): void {
    game.events.on('hit', ({ x, y, damage, crit }) => {
      this.fx.number(x, y, damage, crit)
      if (crit) {
        this.fx.burst(x, y, 0xffd166, 6, 130)
        this.fx.shake(2)
      }
    })
    game.events.on('kill', ({ x, y, elite }) => {
      this.fx.burst(x, y, elite ? 0xffd166 : 0xff6b6b, elite ? 22 : 10, elite ? 200 : 120)
      if (elite) this.fx.shake(5)
    })
    game.events.on('splash', ({ x, y, radius, color }) => {
      this.fx.ringAt(x, y, radius, color)
      this.fx.shake(1.5)
    })
    game.events.on('leak', ({ x, y }) => {
      this.fx.burst(x, y, 0xff3b3b, 18, 170)
      this.fx.shake(8)
    })
    game.events.on('fire', ({ tower }) => {
      this.fx.burst(tower.x + Math.cos(tower.angle) * 16, tower.y + Math.sin(tower.angle) * 16, tower.color, 2, 60)
    })
  }

  /** @param alpha interpolacion [0,1) entre el tic anterior y el actual */
  draw(game: Game, alpha: number, dtMs: number): void {
    const dt = dtMs / 1000
    this.time += dt
    this.fx.update(dt)

    const e = game.world.enemies
    for (let i = 0; i < MAX_ENEMIES; i++) {
      const body = this.bodies[i]
      if (!e.alive[i]) {
        if (body.visible) {
          body.visible = false
          this.heads[i].visible = false
          this.hpBg[i].visible = false
          this.hpFg[i].visible = false
        }
        continue
      }

      const x = e.prevX[i] + (e.x[i] - e.prevX[i]) * alpha
      const y = e.prevY[i] + (e.y[i] - e.prevY[i]) * alpha
      const r = e.radius[i]
      const def = game.enemyDefs[e.defIdx[i]]

      // Animacion procedural barata: bob + squash sincronizado con la velocidad.
      // Con arte real esto se reemplaza por una state machine de Rive/Spine.
      const phase = i * 0.7 + this.time * (4 + e.speed[i] * 0.05)
      const bob = Math.sin(phase)
      const squash = 1 + bob * 0.08

      body.visible = true
      body.position.set(x, y + bob * 1.5)
      body.scale.set((r / 16) * (1 / squash), (r / 16) * squash)
      body.tint = e.flash[i] > 0 ? mix(def.color, 0xffffff, e.flash[i]) : def.color

      const angle = game.world.path.angleAt(e.dist[i])
      const head = this.heads[i]
      head.visible = true
      head.position.set(x + Math.cos(angle) * r * 0.55, y + Math.sin(angle) * r * 0.55 + bob * 2)
      head.scale.set((r * 0.45) / 16)
      head.tint = e.slowT[i] > 0 ? 0x9fe6ff : lighten(def.color, 0.35)

      const hpRatio = Math.max(0, e.hp[i] / e.maxHp[i])
      const showHp = hpRatio < 0.999
      const bg = this.hpBg[i]
      const fg = this.hpFg[i]
      bg.visible = showHp
      fg.visible = showHp
      if (showHp) {
        const w = Math.max(16, r * 2.2)
        bg.position.set(x, y - r - 7)
        bg.scale.set(w / 16, 1.4)
        fg.position.set(x - w / 2, y - r - 7)
        fg.scale.set((w * hpRatio) / 16, 1)
        fg.tint = hpRatio > 0.5 ? 0x6ee7a0 : hpRatio > 0.22 ? 0xffd166 : 0xff5a5a
      }
    }

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
      s.position.set(x, y)
      s.tint = p.crit[i] ? 0xffd166 : p.color[i]
      const size = p.kind[i] === 1 ? 5.5 : p.kind[i] === 2 ? 3.5 : 4
      // Estirar el sprite en la direccion de la velocidad: motion blur del pobre.
      s.rotation = Math.atan2(p.vy[i], p.vx[i])
      s.scale.set((size * 1.9) / 16, size / 16)
    }

    this.syncTowers(game, alpha)

    this.world.position.set(this.fx.shakeX, this.fx.shakeY)
  }

  private syncTowers(game: Game, alpha: number): void {
    const seen = new Set<number>()
    for (const t of game.world.towers) {
      seen.add(t.id)
      let view = this.towerViews.get(t.id)
      if (!view) {
        const base = new Sprite(this.dotTex)
        base.anchor.set(0.5)
        const barrel = new Sprite(this.barTex)
        barrel.anchor.set(0.1, 0.5)
        this.towerLayer.addChild(base, barrel)
        view = { base, barrel }
        this.towerViews.set(t.id, view)
      }
      const recoil = t.recoil * t.recoil
      view.base.position.set(t.x, t.y)
      view.base.scale.set(15 / 16 - recoil * 0.06)
      view.base.tint = t.color

      let diff = ((t.angle - t.prevAngle + Math.PI * 3) % (Math.PI * 2)) - Math.PI
      const angle = t.prevAngle + diff * alpha
      view.barrel.position.set(t.x, t.y)
      view.barrel.rotation = angle
      view.barrel.scale.set((20 - recoil * 6) / 16, 1.6)
      view.barrel.tint = lighten(t.color, 0.5)
    }
    for (const [id, view] of this.towerViews) {
      if (seen.has(id)) continue
      view.base.destroy()
      view.barrel.destroy()
      this.towerViews.delete(id)
    }
  }

  /** Fantasma de construccion: torre translucida + circulo de alcance. */
  showGhost(game: Game, x: number, y: number, type: string | null): void {
    this.ghost.clear()
    this.rangePreview.clear()
    if (!type) return
    const def = game.towerDefs.find((d) => d.id === type)
    if (!def) return
    const check = game.canPlace(x, y, type)
    const color = check.ok ? def.color : 0xff4d4d

    this.rangePreview.circle(x, y, def.base.range).fill({ color, alpha: 0.07 })
    this.rangePreview.circle(x, y, def.base.range).stroke({ width: 1.5, color, alpha: 0.5 })
    this.ghost.circle(x, y, 15).fill({ color, alpha: 0.45 })
  }

  hoverRange(x: number, y: number, radius: number, color: number): void {
    this.rangePreview.clear()
    this.rangePreview.circle(x, y, radius).fill({ color, alpha: 0.06 })
    this.rangePreview.circle(x, y, radius).stroke({ width: 1.5, color, alpha: 0.45 })
  }

  clearOverlays(): void {
    this.ghost.clear()
    this.rangePreview.clear()
  }
}

function mix(a: number, b: number, t: number): number {
  const ar = (a >> 16) & 0xff
  const ag = (a >> 8) & 0xff
  const ab = a & 0xff
  const br = (b >> 16) & 0xff
  const bg = (b >> 8) & 0xff
  const bb = b & 0xff
  return (
    (Math.round(ar + (br - ar) * t) << 16) |
    (Math.round(ag + (bg - ag) * t) << 8) |
    Math.round(ab + (bb - ab) * t)
  )
}

function lighten(c: number, t: number): number {
  return mix(c, 0xffffff, t)
}
