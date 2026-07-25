/** Bus de eventos minimo. La sim emite, el render y la UI escuchan. */
export type Listener<T> = (payload: T) => void

export class Emitter<Events extends Record<keyof Events, unknown>> {
  private map = new Map<keyof Events, Set<Listener<never>>>()

  on<K extends keyof Events>(key: K, fn: Listener<Events[K]>): () => void {
    let set = this.map.get(key)
    if (!set) {
      set = new Set()
      this.map.set(key, set)
    }
    set.add(fn as Listener<never>)
    return () => set!.delete(fn as Listener<never>)
  }

  emit<K extends keyof Events>(key: K, payload: Events[K]): void {
    const set = this.map.get(key)
    if (!set) return
    for (const fn of set) (fn as Listener<Events[K]>)(payload)
  }

  clear(): void {
    this.map.clear()
  }
}
