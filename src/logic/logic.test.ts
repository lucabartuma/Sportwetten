import { describe, expect, it } from 'vitest'
import { simulationConfig } from '../config/simulation'
import { teams } from '../data/teams'
import {
  angeboteneQuote,
  erwarteteRueckzahlung,
  kombiQuote,
  overround,
  quotenFuer,
} from './odds'
import { createRng } from './random'
import {
  erzeugeSpieltag,
  simuliereFans,
  simuliereSaison,
  spieleSpieltag,
  werteWetteAus,
  zufaelligeEinzelwette,
  zufallsWahrscheinlichkeiten,
  zieheAusgang,
} from './simulate'

const marge = simulationConfig.marge

describe('Quoten', () => {
  it('enthalten die konfigurierte Marge (Summe der Kehrwerte ≈ 1 + Marge)', () => {
    const rng = createRng(1)
    for (let i = 0; i < 1000; i++) {
      const q = quotenFuer(zufallsWahrscheinlichkeiten(rng), marge)
      const s = overround(q)
      // Abrunden auf 2 Stellen macht die Summe minimal grösser, nie kleiner
      expect(s).toBeGreaterThanOrEqual(1 + marge - 1e-9)
      expect(s).toBeLessThan(1 + marge + 0.02)
    }
  })

  it('werden auf 2 Nachkommastellen abgerundet', () => {
    expect(angeboteneQuote(0.5, 0.07)).toBe(1.86) // 1/0.535 = 1.869…
    expect(angeboteneQuote(0.25, 0)).toBe(4)
  })

  it('Kombi-Quote multipliziert, Marge multipliziert sich mit', () => {
    expect(kombiQuote([2, 1.5, 3])).toBe(9)
    expect(erwarteteRueckzahlung(0.07, 3)).toBeCloseTo(0.816, 3) // ≈ 18–20 % Nachteil
  })

  it('wahre Wahrscheinlichkeiten liegen im plausiblen Bereich und summieren zu 1', () => {
    const rng = createRng(2)
    for (let i = 0; i < 1000; i++) {
      const w = zufallsWahrscheinlichkeiten(rng)
      expect(w['1'] + w.X + w['2']).toBeCloseTo(1, 10)
      expect(w['1']).toBeGreaterThanOrEqual(0.3)
      expect(w['1']).toBeLessThanOrEqual(0.6)
      expect(w.X).toBeGreaterThanOrEqual(0.2)
      expect(w['2']).toBeGreaterThan(0.09)
    }
  })
})

describe('Ziehung ist ehrlich', () => {
  it('Ausgänge folgen den wahren Wahrscheinlichkeiten', () => {
    const rng = createRng(3)
    const w = { '1': 0.5, X: 0.25, '2': 0.25 } as const
    const n = 100_000
    const c = { '1': 0, X: 0, '2': 0 }
    for (let i = 0; i < n; i++) c[zieheAusgang(rng, w)]++
    expect(c['1'] / n).toBeCloseTo(0.5, 2)
    expect(c.X / n).toBeCloseTo(0.25, 2)
  })

  it('bei 100 000 Einzelwetten liegt der Verlust pro Franken nahe an der Marge', () => {
    const rng = createRng(4)
    let ein = 0
    let aus = 0
    for (let i = 0; i < 100_000; i++) {
      const w = zufaelligeEinzelwette(rng, 1, marge)
      ein += w.eingesetzt
      aus += w.ausbezahlt
    }
    const verlustProFranken = 1 - aus / ein
    const theoretisch = 1 - 1 / (1 + marge) // ≈ 6.5 %
    expect(verlustProFranken).toBeGreaterThan(theoretisch - 0.02)
    expect(verlustProFranken).toBeLessThan(theoretisch + 0.025)
  })
})

describe('Wetten auswerten', () => {
  const partien = spieleSpieltag(createRng(5), erzeugeSpieltag(createRng(6), teams, 5, marge))

  it('Einzelwetten zahlen pro richtigem Tipp', () => {
    const p = partien[0]
    const res = werteWetteAus(
      { typ: 'einzel', einsatz: 10, tipps: [{ partieId: p.id, ausgang: p.ergebnis!, quote: 2 }] },
      partien,
    )
    expect(res.ausbezahlt).toBe(20)
    expect(res.eingesetzt).toBe(10)
  })

  it('Kombi verliert bei einem falschen Tipp und meldet «knapp daneben»', () => {
    const falsch = partien[1].ergebnis === '1' ? '2' : '1'
    const res = werteWetteAus(
      {
        typ: 'kombi',
        einsatz: 10,
        tipps: [
          { partieId: partien[0].id, ausgang: partien[0].ergebnis!, quote: 2 },
          { partieId: partien[1].id, ausgang: falsch, quote: 2 },
        ],
      },
      partien,
    )
    expect(res.ausbezahlt).toBe(0)
    expect(res.knappDaneben).toBe(true)
  })
})

describe('Saison und 100 Fans', () => {
  it('Saison: eingesetzt − ausbezahlt ergibt Netto, Nachzahlungen werden gezählt', () => {
    const r = simuliereSaison({ rng: createRng(7), anzahlWetten: 300, einsatz: 10 })
    expect(r.netto).toBeCloseTo(r.ausbezahlt - r.eingesetzt, 2)
    expect(r.eingesetzt).toBe(3000)
    expect(r.endguthaben).toBeCloseTo(100 + r.einzahlungen * 100 + r.netto, 2)
    expect(r.verlauf.length).toBe(301)
  })

  it('mit den Default-Werten verlieren im Mittel ca. 93–97 von 100 Fans', () => {
    let total = 0
    const runs = 20
    for (let r = 0; r < runs; r++) {
      total += simuliereFans(createRng(500 + r)).filter((x) => x < 0).length
    }
    const mittel = total / runs
    expect(mittel).toBeGreaterThanOrEqual(93)
    expect(mittel).toBeLessThanOrEqual(97.5)
  })

  it('gleicher Seed → gleiche Ergebnisse', () => {
    expect(simuliereFans(createRng(42), 10, 100)).toEqual(simuliereFans(createRng(42), 10, 100))
    const a = simuliereSaison({ rng: createRng(9), anzahlWetten: 50, einsatz: 10 })
    const b = simuliereSaison({ rng: createRng(9), anzahlWetten: 50, einsatz: 10 })
    expect(a).toEqual(b)
  })
})
