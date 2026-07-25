/**
 * Camino como polilinea muestreada desde un spline Catmull-Rom.
 *
 * Los enemigos NO usan A*: avanzan un escalar `dist` sobre este camino. Es
 * barato, se ve suave, y ordenar por `dist` te da gratis el targeting
 * "first / last". Solo hace falta pathfinding real si el jugador puede
 * bloquear el paso (ahi va flow field, no A*).
 */
export interface PathPoint {
  x: number
  y: number
}

export class Path {
  readonly xs: Float32Array
  readonly ys: Float32Array
  readonly cum: Float32Array
  readonly length: number

  constructor(control: readonly PathPoint[], samplesPerSegment = 16) {
    const pts: PathPoint[] = []
    const n = control.length
    for (let i = 0; i < n - 1; i++) {
      const p0 = control[Math.max(0, i - 1)]
      const p1 = control[i]
      const p2 = control[i + 1]
      const p3 = control[Math.min(n - 1, i + 2)]
      for (let s = 0; s < samplesPerSegment; s++) {
        const t = s / samplesPerSegment
        pts.push(catmullRom(p0, p1, p2, p3, t))
      }
    }
    pts.push(control[n - 1])

    this.xs = new Float32Array(pts.length)
    this.ys = new Float32Array(pts.length)
    this.cum = new Float32Array(pts.length)
    for (let i = 0; i < pts.length; i++) {
      this.xs[i] = pts[i].x
      this.ys[i] = pts[i].y
      if (i > 0) {
        const dx = this.xs[i] - this.xs[i - 1]
        const dy = this.ys[i] - this.ys[i - 1]
        this.cum[i] = this.cum[i - 1] + Math.hypot(dx, dy)
      }
    }
    this.length = this.cum[this.cum.length - 1]
  }

  /** Indice del sample cuyo cum <= d (busqueda binaria). */
  private indexAt(d: number): number {
    let lo = 0
    let hi = this.cum.length - 1
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1
      if (this.cum[mid] <= d) lo = mid
      else hi = mid - 1
    }
    return lo
  }

  posAt(d: number, out: { x: number; y: number }): void {
    const dist = Math.min(Math.max(d, 0), this.length)
    const i = this.indexAt(dist)
    const j = Math.min(i + 1, this.xs.length - 1)
    const segLen = this.cum[j] - this.cum[i]
    const t = segLen > 0 ? (dist - this.cum[i]) / segLen : 0
    out.x = this.xs[i] + (this.xs[j] - this.xs[i]) * t
    out.y = this.ys[i] + (this.ys[j] - this.ys[i]) * t
  }

  angleAt(d: number): number {
    const i = this.indexAt(Math.min(Math.max(d, 0), this.length))
    const j = Math.min(i + 1, this.xs.length - 1)
    return Math.atan2(this.ys[j] - this.ys[i], this.xs[j] - this.xs[i])
  }

  /** Distancia minima de un punto al camino. Se usa para prohibir construir encima. */
  distanceToPoint(px: number, py: number): number {
    let best = Infinity
    for (let i = 0; i < this.xs.length - 1; i++) {
      const ax = this.xs[i]
      const ay = this.ys[i]
      const bx = this.xs[i + 1]
      const by = this.ys[i + 1]
      const dx = bx - ax
      const dy = by - ay
      const len2 = dx * dx + dy * dy
      let t = len2 > 0 ? ((px - ax) * dx + (py - ay) * dy) / len2 : 0
      t = Math.min(1, Math.max(0, t))
      const d = Math.hypot(px - (ax + dx * t), py - (ay + dy * t))
      if (d < best) best = d
    }
    return best
  }
}

function catmullRom(
  p0: PathPoint,
  p1: PathPoint,
  p2: PathPoint,
  p3: PathPoint,
  t: number,
): PathPoint {
  const t2 = t * t
  const t3 = t2 * t
  return {
    x:
      0.5 *
      (2 * p1.x +
        (-p0.x + p2.x) * t +
        (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
        (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
    y:
      0.5 *
      (2 * p1.y +
        (-p0.y + p2.y) * t +
        (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
        (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
  }
}
