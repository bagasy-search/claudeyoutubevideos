// Registra las extensiones del entorno browser de forma estatica. Junto con
// `skipExtensionImports` en init(), evita que Pixi las cargue con import()
// dinamico — necesario para poder empaquetar todo en un solo archivo.
import 'pixi.js/browser'
import { Container, Graphics, Sprite, Texture, Ticker, WebGLRenderer } from 'pixi.js'
import { Rng } from '../core/rng'
import type { Game } from '../sim/game'
import { BUILD_SLOTS, FIELD_H, FIELD_W } from '../sim/game'
import { MAX_ENEMIES, MAX_PROJECTILES } from '../sim/world'
import { INLINE_ART } from '../generated/inlineArt'
import { applyExternalArt, applyManifest } from './externalArt'
import { FxLayer } from './fx'
import { GROUND, SEMANTIC, ink, jitterHue, lighten, mix, shade } from './palette'
import { IDLE_FRAMES, SLOT_ART_R, TOWER_R, buildAtlas, type Atlas } from './sprites'

/**
 * Capa de render. Solo LEE el estado de la simulacion — no lo modifica nunca.
 *
 * Todo se dibuja interpolando entre el tic anterior y el actual con `alpha`,
 * asi la sim puede correr a 60Hz fijos mientras la pantalla va a 144Hz (o a 30)
 * sin que se vea a saltos.
 */

/** Sprites por enemigo. Se crean al vuelo: la mayoria de las runs no llena el pool. */
interface EnemyView {
  /** Agrupa lo que se ordena en profundidad junto. */
  group: Container
  shadow: Sprite
  body: Sprite
  /**
   * Copia del cuerpo en modo aditivo. El tinte de Pixi es MULTIPLICATIVO: solo
   * puede oscurecer. Un "flash de impacto" hecho con tinte oscurece el sprite,
   * que es lo contrario de lo que se busca. Iluminar de verdad necesita sumar.
   */
  flash: Sprite
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
  /** Plataformas de construccion. Van sobre el suelo y debajo de todo lo vivo. */
  private slotLayer = new Container()
  private slotSprites: Sprite[] = []
  private shadowLayer = new Container()
  private enemyLayer = new Container()
  private towerLayer = new Container()
  private projLayer = new Container()
  /** Las barras de vida van sobre todo: nunca deben quedar tapadas. */
  private hpLayer = new Container()
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

    // Arte externo opcional. Se activa poniendo VITE_ART_MANIFEST (por ejemplo
    // "art/manifest.json"); sin esa variable ni se intenta el fetch, asi el
    // build por defecto no deja un 404 en la consola.
    // INLINE_ART tiene prioridad: es el arte empotrado en el bundle, que es la
    // unica via que funciona en el build de un solo archivo (no puede hacer
    // requests). Si no hay, se intenta el manifiesto por URL.
    const manifestUrl = import.meta.env.VITE_ART_MANIFEST
    const art = INLINE_ART
      ? await applyManifest(this.atlas, INLINE_ART)
      : manifestUrl
        ? await applyExternalArt(this.atlas, manifestUrl)
        : null
    if (art) {
      if (art.replaced.length > 0) console.info('[arte] reemplazado:', art.replaced.join(', '))
      if (art.missing.length > 0) console.warn('[arte] faltan:', art.missing.join(', '))
    }

    this.fx = new FxLayer(this.atlas.soft)

    this.world.addChild(
      this.bg,
      this.slotLayer,
      this.rangeLayer,
      this.fx.backContainer,
      this.shadowLayer,
      this.enemyLayer,
      this.towerLayer,
      this.projLayer,
      this.fx.container,
      this.fx.addContainer,
      this.hpLayer,
      this.overlay,
    )
    // Con camara frontal, quien esta mas abajo esta mas cerca y va delante.
    // Sin esto los sprites se dibujan en orden de pool y la profundidad se rompe.
    this.enemyLayer.sortableChildren = true
    this.overlay.addChild(this.rangePreview, this.ghost)
    this.stage.addChild(this.world)

    /*
     * Pase de color global. Va en el `stage` y NO en el `world` a proposito: si
     * colgara del mundo se moveria con el temblor de camara y en cada sacudida
     * asomaria un borde sin viñetear. Lo que se mueve es la escena; la lente,
     * no.
     */
    const vignette = new Sprite(this.atlas.vignette)
    vignette.anchor.set(0.5)
    vignette.position.set(FIELD_W / 2, FIELD_H / 2)
    // Se estira mas alla del campo para que las esquinas queden cubiertas aun
    // con el desplazamiento maximo del temblor.
    vignette.width = FIELD_W * 1.06
    vignette.height = FIELD_H * 1.06
    vignette.blendMode = 'multiply'
    vignette.eventMode = 'none'
    this.stage.addChild(vignette)

    this.drawBackground(game)
    this.drawSlots()
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

    /*
     * Mancha de sol, arriba a la izquierda.
     *
     * Es la misma direccion de luz que usan los sprites (`LIGHT` en sprites.ts)
     * y la misma que asume `shade()`. Un suelo de valor plano bajo personajes
     * iluminados desde un lado los delata como calcomanias: la luz tiene que
     * caer sobre TODO o sobre nada. Va horneado en el fondo, asi que no cuesta
     * nada en ejecucion.
     */
    // Muchas capas con muy poco alfa: con dos docenas se ven los escalones y el
    // suelo queda con anillos concentricos, que es peor que no tener la luz.
    for (let i = 60; i >= 1; i--) {
      const k = i / 60
      g.ellipse(FIELD_W * 0.28, FIELD_H * 0.18, FIELD_W * 1.05 * k, FIELD_H * 0.72 * k)
        .fill({ color: GROUND.lit, alpha: 0.009 })
    }

    /*
     * Manchas de terreno. Con la paleta vieja eran invisibles; con la nueva se
     * pasaban al otro extremo y el suelo quedaba a lunares. Van en dos capas
     * suaves y con poco alfa: la idea es romper la planicie, no dibujar nubes.
     */
    const rng = new Rng(0xa11ce)
    for (let i = 0; i < 34; i++) {
      const x = rng.range(0, FIELD_W)
      const y = rng.range(0, FIELD_H)
      const rx = rng.range(55, 140)
      const warm = rng.chance(0.6)
      g.ellipse(x, y, rx, rx * rng.range(0.55, 0.8)).fill({
        color: warm ? GROUND.lit : shade(GROUND.base, 0.25),
        alpha: 0.13,
      })
    }

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
    g.stroke({ width: 3, color: GROUND.pathInner, alpha: 0.85, cap: 'round', join: 'round' })

    // Piedras al borde del camino, cada tantos samples.
    for (let i = 6; i < p.xs.length - 6; i += 9) {
      const ang = Math.atan2(p.ys[i + 1] - p.ys[i], p.xs[i + 1] - p.xs[i]) + Math.PI / 2
      for (const side of [-1, 1]) {
        const d = 27 + rng.range(0, 4)
        const x = p.xs[i] + Math.cos(ang) * d * side
        const y = p.ys[i] + Math.sin(ang) * d * side
        // Piedra clara con su propia sombra. Antes eran del mismo color que el
        // borde sobre el que se apoyaban: contraste cero.
        const rx = rng.range(3, 6)
        g.ellipse(x, y + rx * 0.35, rx, rx * 0.6).fill({ color: shade(GROUND.pathEdge, 0.5), alpha: 0.7 })
        g.ellipse(x, y, rx, rx * 0.7).fill({ color: lighten(GROUND.pathEdge, 0.3) })
      }
    }

    // Props sueltos, lejos del camino para no ensuciar la lectura del combate.
    for (let i = 0; i < 60; i++) {
      const x = rng.range(20, FIELD_W - 20)
      const y = rng.range(20, FIELD_H - 20)
      if (p.distanceToPoint(x, y) < 46) continue
      // Tampoco encima de una plataforma: ahi va a haber una torre y el prop
      // asomando por debajo se lee como basura.
      if (BUILD_SLOTS.some((s) => Math.hypot(s.x - x, s.y - y) < SLOT_ART_R + 10)) continue
      const r = rng.range(2, 6)
      g.ellipse(x, y, r, r * 0.75).fill({ color: GROUND.prop, alpha: 0.85 })
      g.ellipse(x - r * 0.25, y - r * 0.25, r * 0.5, r * 0.35).fill({ color: lighten(GROUND.prop, 0.14), alpha: 0.7 })
    }

    // La viñeta ya no se dibuja aca: era un marco de rectangulos concentricos
    // que solo apagaba el fondo y dejaba a los personajes del borde iluminados
    // igual que a los del centro. Ahora es un pase sobre TODA la escena, en
    // `multiply`, montado al final de init().

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

  /**
   * Plataformas de construccion. Son estaticas, asi que se crean una vez; lo
   * unico que cambia por frame es la opacidad, que late cuando el jugador tiene
   * una torre elegida y esta buscando donde ponerla.
   */
  private drawSlots(): void {
    for (const s of BUILD_SLOTS) {
      const sp = new Sprite(this.atlas.slot)
      sp.anchor.set(0.5)
      sp.position.set(s.x, s.y)
      this.slotLayer.addChild(sp)
      this.slotSprites.push(sp)
    }
  }

  /**
   * @param armed el jugador tiene una torre seleccionada
   * @param hovered plataforma bajo el dedo, o -1
   */
  private updateSlots(game: Game, armed: boolean, hovered: number): void {
    for (let i = 0; i < this.slotSprites.length; i++) {
      const sp = this.slotSprites[i]
      // Ocupada: la torre la tapa entera, no hace falta dibujarla.
      if (game.towerOnSlot(i)) {
        sp.visible = false
        continue
      }
      sp.visible = true
      // En reposo la plataforma esta ahi pero callada; con una torre en la mano
      // late. Es la diferencia entre "hay huecos" y "poné algo acá".
      const pulse = armed ? 0.72 + Math.sin(this.time * 4.5 + i * 0.7) * 0.2 : 0.4
      sp.alpha = i === hovered ? 1 : pulse
      sp.scale.set(i === hovered ? 1.1 : 1)
    }
  }

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
    const flash = new Sprite(this.atlas.enemy[0][0])
    flash.anchor.set(0.5)
    flash.blendMode = 'add'
    flash.visible = false
    const group = new Container()
    group.addChild(aura, body, flash)
    const hpBg = new Sprite(this.atlas.bar)
    hpBg.anchor.set(0.5)
    hpBg.tint = SEMANTIC.ink
    hpBg.alpha = 0.8
    const hpFg = new Sprite(this.atlas.bar)
    hpFg.anchor.set(0, 0.5)
    this.shadowLayer.addChild(shadow)
    this.enemyLayer.addChild(group)
    this.hpLayer.addChild(hpBg, hpFg)
    v = { group, shadow, body, flash, aura, hpBg, hpFg }
    this.views[i] = v
    return v
  }

  private wireEvents(game: Game): void {
    /*
     * Un impacto normal NO sacude la camara. En un tower defense con treinta
     * disparos por segundo, sacudir en cada uno deja un temblor constante que
     * se lee como un fallo, no como fuerza. El golpe chico se comunica con
     * destello, particulas y sonido; la camara se guarda para lo que importa.
     */
    game.events.on('hit', ({ enemyIdx, x, y, damage, crit }) => {
      this.fx.damage(enemyIdx, x, y, damage, crit)
      if (crit) this.fx.burst(x, y, SEMANTIC.crit, 7, 150)
    })

    game.events.on('kill', ({ enemyIdx, x, y, elite, color }) => {
      // Lo acumulado sale ya: el enemigo no va a estar para mostrarlo despues.
      this.fx.flushDamage(enemyIdx)
      const pose = this.poses[enemyIdx]
      if (pose) {
        // Sin rotacion: el vivo se dibuja siempre derecho, asi que un cadaver
        // inclinado contradice la camara. Se cae aplastandose, no girando.
        this.fx.corpse(pose.texture, x, y, pose.scale)
        this.poses[enemyIdx] = null
      }
      this.fx.burst(x, y, shade(color, 0.15), elite ? 24 : 10, elite ? 210 : 130)
      this.fx.smoke(x, y, GROUND.prop, elite ? 8 : 3)
      if (elite) this.fx.shake(3.5)
    })

    game.events.on('splash', ({ x, y, radius, color }) => {
      this.fx.ringAt(x, y, radius, color)
      this.fx.smoke(x, y, lighten(color, 0.3), 6)
    })

    game.events.on('leak', ({ x, y }) => {
      this.fx.burst(x, y, SEMANTIC.leak, 22, 190, 1.6)
      this.fx.ringAt(x, y, 70, SEMANTIC.leak)
      // Desde el nucleo hacia afuera: la camara dice de donde vino el golpe.
      this.fx.shakeFrom(x - FIELD_W / 2, y - FIELD_H / 2, 6)
      this.coreFlash = 1
    })

    game.events.on('fire', ({ tower }) => {
      const mx = tower.x + Math.cos(tower.angle) * 17
      const my = tower.y + Math.sin(tower.angle) * 17
      // Cono estrecho hacia adelante, no una explosion radial: un fogonazo sale
      // por la boca del arma.
      this.fx.cone(mx, my, tower.angle, 0.5, lighten(tower.color, 0.5), 4, 120, 0.7)
      this.fx.flashAt(mx, my, lighten(tower.color, 0.6), 14)
    })
  }

  /**
   * Pose dibujada de cada enemigo, indexada por su slot del pool. El evento de
   * muerte llega sin saber como se estaba dibujando el bicho, asi que se guarda
   * aca para dejar el cadaver en la pose correcta.
   */
  private poses: ({ texture: Texture; scale: number } | null)[] = new Array(MAX_ENEMIES).fill(null)
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
        if (existing && existing.group.visible) {
          existing.group.visible = false
          existing.flash.visible = false
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
      // La fase arranca desplazada por instancia. Sin esto, dos peones que
      // salen juntos comparten `dist` y por lo tanto el frame: caminan en
      // lockstep para siempre, que es el delator mas fuerte de un ejercito de
      // clones.
      const phaseOffset = e.variant[i] * stride
      const dist = e.prevDist[i] + (e.dist[i] - e.prevDist[i]) * alpha + phaseOffset
      // Se cicla sobre los frames que HAYA, no sobre WALK_FRAMES: el arte
      // externo puede traer otra cantidad, y pedir un indice inexistente deja
      // la textura en undefined y el sprite no dibuja nada.
      const count = frames.length
      const frame = Math.floor((dist / stride) * count) % count
      const angle = path.angleAt(e.dist[i])
      // Variacion de tamaño por instancia, sutil pero suficiente para romper
      // la sensacion de tropa fotocopiada.
      const jitter = 0.93 + e.variant[i] * 0.14
      const scale = (e.elite[i] ? 1.35 : 1) * jitter

      v.group.visible = true
      v.group.position.set(x, y)
      // Quien esta mas abajo va delante.
      v.group.zIndex = y
      v.body.texture = frames[(frame + count) % count]
      v.body.position.set(0, 0)
      // Vista frontal: el sprite NO rota con el camino. Solo se inclina hacia
      // donde va, que es suficiente para comunicar direccion sin acostar al
      // personaje cuando el camino baja.
      v.body.rotation = Math.cos(angle) * 0.07
      v.body.scale.set(scale)

      // Quemadura y frio SI funcionan como tinte, porque son oscurecimientos
      // con color. El golpe no: tiene que aclarar, y para eso esta la capa
      // aditiva de arriba.
      // Variacion de tono por instancia: la investigacion de multitudes dice
      // que el clon de APARIENCIA se detecta mucho antes que el de movimiento.
      let bodyTint = jitterHue(0xffffff, e.variant[i], 7)
      if (e.burnT[i] > 0) bodyTint = mix(0xffffff, SEMANTIC.burn, 0.42 + Math.sin(this.time * 14 + e.variant[i] * 6) * 0.14)
      else if (e.slowT[i] > 0) bodyTint = mix(0xffffff, SEMANTIC.slow, 0.45)
      v.body.tint = bodyTint

      const hit = e.flash[i]
      v.flash.visible = hit > 0.01
      if (v.flash.visible) {
        v.flash.texture = v.body.texture
        v.flash.position.set(0, 0)
        v.flash.rotation = v.body.rotation
        v.flash.scale.set(scale)
        v.flash.tint = SEMANTIC.crit
        v.flash.alpha = hit * 0.85
      }

      v.shadow.visible = true
      v.shadow.position.set(x, y + r * 0.98)
      v.shadow.scale.set((r * 1.25 * jitter) / 16, (r * 0.9 * jitter) / 16)
      // Cuanto mas grande el bicho, mas dura la sombra: masa se lee por peso.
      v.shadow.alpha = 0.42 + Math.min(0.22, r / 200)

      if (e.elite[i]) {
        v.aura.visible = true
        v.aura.position.set(0, 0)
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
      // Guardar la pose de ESTE enemigo, indexada por su slot. Antes habia un
      // solo campo compartido que pisaba cualquier enemigo herido del bucle, y
      // el cadaver terminaba siendo el de otro bicho.
      this.poses[i] = { texture: v.body.texture, scale }
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
      const def = game.towerDefs.find((d) => d.id === t.type)
      const frames = this.atlas.towerBase.get(t.type) ?? []
      const hasTurret = def?.turret !== false

      let view = this.towerViews.get(t.id)
      if (!view) {
        const base = new Sprite(frames[0])
        base.anchor.set(0.5)
        const turret = new Sprite(this.atlas.towerTurret.get(t.type))
        // El pivote del cañón no es su centro: está cerca de la base.
        turret.anchor.set(0.5, 0.5)
        turret.visible = hasTurret
        this.towerLayer.addChild(base, turret)
        view = { base, turret }
        this.towerViews.set(t.id, view)
      }

      const recoil = t.recoil * t.recoil

      // Las torres-personaje se animan solas; las clasicas tienen un solo frame.
      if (frames.length > 1) {
        const fps = def?.fps ?? IDLE_FRAMES
        const frame = Math.floor(this.time * fps + t.id) % frames.length
        view.base.texture = frames[frame]
      }
      view.base.position.set(t.x, t.y)
      view.base.scale.set(1 - recoil * 0.05)

      if (!hasTurret) {
        view.turret.visible = false
        continue
      }

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

  /**
   * Fantasma de construccion.
   *
   * Se PEGA a la plataforma mas cercana en vez de seguir al dedo. Ese enganche
   * es la mitad de por que el sistema de plataformas se siente bien en un
   * telefono: el dedo tapa el punto exacto donde toca, asi que apuntar con
   * precision es imposible; el juego tiene que adivinar la intencion.
   */
  showGhost(game: Game, x: number, y: number, type: string | null): void {
    this.ghost.clear()
    this.rangePreview.clear()
    if (!type) {
      this.updateSlots(game, false, -1)
      return
    }
    const def = game.towerDefs.find((d) => d.id === type)
    if (!def) return

    const slot = game.slotAt(x, y)
    this.updateSlots(game, true, slot)
    if (slot < 0) return

    const at = BUILD_SLOTS[slot]
    const check = game.canPlace(at.x, at.y, type)
    const color = check.ok ? def.color : SEMANTIC.leak

    this.rangePreview.circle(at.x, at.y, def.base.range).fill({ color, alpha: 0.06 })
    this.rangePreview.circle(at.x, at.y, def.base.range).stroke({ width: 1.5, color, alpha: 0.45 })
    this.ghost
      .circle(at.x, at.y, SLOT_ART_R * 0.9)
      .stroke({ width: 3, color, alpha: 0.85 })
    this.ghost
      .circle(at.x, at.y - TOWER_R * 0.3, TOWER_R * 0.8)
      .fill({ color, alpha: 0.35 })
      .stroke({ width: 2, color: ink(color, 0.3), alpha: 0.7 })
  }

  hoverRange(game: Game, x: number, y: number, radius: number, color: number): void {
    this.rangePreview.clear()
    this.rangePreview.circle(x, y, radius).fill({ color, alpha: 0.05 })
    this.rangePreview.circle(x, y, radius).stroke({ width: 1.5, color, alpha: 0.4 })
    this.updateSlots(game, false, -1)
  }

  clearOverlays(game: Game): void {
    this.ghost.clear()
    this.rangePreview.clear()
    this.updateSlots(game, false, -1)
  }
}
