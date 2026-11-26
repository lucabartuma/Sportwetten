/**
 * Alle Parameter der Simulation an einem Ort.
 * Änderungen hier wirken sich auf Simulator, Zeitraffer und «100 Fans» aus.
 */
export const simulationConfig = {
  /** Startguthaben in Spiel-Franken */
  startguthaben: 100,
  /** Marge des Anbieters pro Tipp (0.07 = 7 %) */
  marge: 0.07,
  /** Anzahl Partien pro Spieltag */
  partienProSpieltag: 5,
  /** Bereich der «wahren» Wahrscheinlichkeiten */
  wahrscheinlichkeiten: {
    heimMin: 0.3,
    heimMax: 0.6,
    remisMin: 0.2,
    remisMax: 0.3,
  },
  /** Simulator: ein Tipp, danach Saison mit so vielen Einzelwetten */
  zeitraffer: {
    anzahlWetten: 300,
    /** Einsatz pro Wette (Spiel-Franken) */
    standardEinsatz: 10,
    /** Betrag pro Nachzahlung, wenn das Guthaben auf 0 fällt */
    nachzahlung: 100,
  },
  /**
   * «100 Fans»: Jede Figur spielt eine Saison mit Einzelwetten à CHF 10
   * und zufälligen Tipps (1/X/2).
   *
   * KALIBRIERUNG (siehe src/logic/calibrate.test.ts, `npm run calibrate`):
   * Bei 7 % Marge und zufälligen Tipps verlieren mit
   *   50 Wetten   ≈ 63 von 100
   *   300 Wetten  ≈ 80 von 100
   *   600 Wetten  ≈ 87 von 100
   *   1000 Wetten ≈ 92 von 100
   *   1500 Wetten ≈ 96 von 100   ← Default
   *   2000 Wetten ≈ 98 von 100
   * (Mittel über 40 × 100 Fans, gemessen am 13.11.2026)
   * Zufällige Tipps haben hohe Quoten und damit viel Streuung; deshalb braucht
   * es mehr Wetten als die im Brief geschätzten 500–600, damit langfristig fast
   * alle verlieren. 1500 Wetten ≈ 30 pro Woche über ein Jahr – für regelmässig
   * Wettende realistisch.
   */
  hundertFans: {
    anzahlFans: 100,
    einsatz: 10,
    standardWetten: 1500,
    /** Optionen für den Schieberegler */
    wettenOptionen: [50, 300, 1500],
  },
  /** Fester Seed für den Demo-Modus (?demo=1) */
  demoSeed: 20261116,
} as const

export type SimulationConfig = typeof simulationConfig
