import { describe, it } from 'vitest'
import { createRng } from './random'
import { simuliereFans } from './simulate'
import { simulationConfig } from '../config/simulation'

// Kalibrierung: `npm run calibrate` – gibt die mittlere Anzahl Verlierer aus.
describe('Kalibrierung 100 Fans', () => {
  it.skipIf(!process.env.CALIBRATE)('druckt Verlierer pro Anzahl Wetten', () => {
    for (const n of [50, 300, 500, 600, 1000, 1500, 2000]) {
      let total = 0
      const runs = 40
      for (let r = 0; r < runs; r++) {
        const res = simuliereFans(createRng(1000 + r), 100, n, 10, simulationConfig.marge)
        total += res.filter((x) => x < 0).length
      }
      console.log(`${n} Wetten → Ø ${(total / runs).toFixed(1)} von 100 verlieren`)
    }
  })
})
