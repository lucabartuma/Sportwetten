/** Zufallsquelle: liefert Zahlen in [0, 1). */
export type Rng = () => number

/** Seedbarer PRNG (mulberry32) – reproduzierbar für Tests und Demo-Modus. */
export function createRng(seed: number): Rng {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const defaultRng: Rng = Math.random

export function randomBetween(rng: Rng, min: number, max: number): number {
  return min + rng() * (max - min)
}

export function pickIndex(rng: Rng, n: number): number {
  return Math.floor(rng() * n)
}
