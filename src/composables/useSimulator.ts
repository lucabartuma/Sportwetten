import { reactive } from 'vue'
import { simulationConfig as cfg } from '../config/simulation'
import { teams } from '../data/teams'
import type { TrickId } from '../data/tricks'
import { type Ausgang, kombiQuote } from '../logic/odds'
import { type Rng, createRng, defaultRng } from '../logic/random'
import {
  type Partie,
  type SaisonErgebnis,
  type Tipp,
  type WettAuswertung,
  type WettTyp,
  erzeugeSpieltag,
  round2,
  simuliereSaison,
  spieleSpieltag,
  werteWetteAus,
} from '../logic/simulate'
import { demoAktiv } from './demo'

export type Phase = 'wetten' | 'live' | 'ergebnis' | 'zeitraffer' | 'aufloesung'

export interface Beispiel {
  partie: string
  fair: number
  angeboten: number
}

/** Zustand des Simulators – bleibt beim Seitenwechsel erhalten. */
export const sim = reactive({
  phase: 'wetten' as Phase,
  guthaben: cfg.startguthaben as number,
  /** Total eingezahlt (Start + Nachzahlungen) */
  eingezahlt: cfg.startguthaben as number,
  verlauf: [cfg.startguthaben] as number[],
  spieltagNr: 1,
  partien: [] as Partie[],
  tipps: {} as Record<string, Ausgang>,
  typ: 'einzel' as WettTyp,
  einsatzWahl: 10 as number | 'allin',
  auswertung: null as WettAuswertung | null,
  totalEingesetzt: 0,
  totalAusbezahlt: 0,
  anzahlWetten: 0,
  rundenSeitPopup: 0,
  popup: null as TrickId | null,
  gezeigteTricks: [] as TrickId[],
  beispiel: null as Beispiel | null,
  saison: null as SaisonErgebnis | null,
  demo: false,
})

let rng: Rng = defaultRng

export function resetSimulator() {
  sim.demo = demoAktiv.value
  rng = sim.demo ? createRng(cfg.demoSeed) : defaultRng
  Object.assign(sim, {
    phase: 'wetten',
    guthaben: cfg.startguthaben,
    eingezahlt: cfg.startguthaben,
    verlauf: [cfg.startguthaben],
    spieltagNr: 1,
    partien: erzeugeSpieltag(rng, teams, cfg.partienProSpieltag, cfg.marge),
    tipps: {},
    typ: 'einzel',
    einsatzWahl: 10,
    auswertung: null,
    totalEingesetzt: 0,
    totalAusbezahlt: 0,
    anzahlWetten: 0,
    rundenSeitPopup: 0,
    popup: 'bonus',
    gezeigteTricks: ['bonus'],
    beispiel: null,
    saison: null,
  })
}

/** Initialisiert beim ersten Aufruf bzw. wenn der Demo-Modus wechselt. */
export function ensureSimulator() {
  if (!sim.partien.length || sim.demo !== demoAktiv.value) resetSimulator()
}

export function tippe(partieId: string, a: Ausgang) {
  if (sim.phase !== 'wetten') return
  if (sim.tipps[partieId] === a) delete sim.tipps[partieId]
  else sim.tipps[partieId] = a
}

export function gewaehlteTipps(): Tipp[] {
  return sim.partien
    .filter((p) => sim.tipps[p.id])
    .map((p) => ({ partieId: p.id, ausgang: sim.tipps[p.id], quote: p.quoten[sim.tipps[p.id]] }))
}

/** Einsatz pro Wette (bei Einzelwetten pro Tipp). */
export function einsatzProWette(): number {
  const n = Math.max(1, gewaehlteTipps().length)
  if (sim.einsatzWahl === 'allin') {
    return sim.typ === 'kombi' ? sim.guthaben : Math.floor((sim.guthaben / n) * 100) / 100
  }
  return sim.einsatzWahl
}

export function gesamtEinsatz(): number {
  const n = gewaehlteTipps().length
  const e = einsatzProWette()
  return round2(sim.typ === 'kombi' ? (n ? e : 0) : e * n)
}

export function moeglicheAuszahlung(): number {
  const t = gewaehlteTipps()
  if (!t.length) return 0
  const e = einsatzProWette()
  if (sim.typ === 'kombi') return round2(e * kombiQuote(t.map((x) => x.quote)))
  return round2(t.reduce((s, x) => s + e * x.quote, 0))
}

export function kannAnpfeifen(): boolean {
  const t = gewaehlteTipps()
  const g = gesamtEinsatz()
  return sim.phase === 'wetten' && t.length > 0 && g > 0 && g <= sim.guthaben + 1e-9 && !(sim.typ === 'kombi' && t.length < 2)
}

/** Spielt den Spieltag aus. Das Guthaben wird erst mit `abschliessen()` verbucht. */
export function anpfiff() {
  if (!kannAnpfeifen()) return
  const tipps = gewaehlteTipps()
  // Demo-Modus: Nur am ersten Spieltag gewinnen die gewählten Tipps (Dramaturgie).
  const erzwungen: Record<string, Ausgang> =
    sim.demo && sim.spieltagNr === 1 ? Object.fromEntries(tipps.map((t) => [t.partieId, t.ausgang])) : {}
  sim.partien = spieleSpieltag(rng, sim.partien, erzwungen)
  sim.auswertung = werteWetteAus({ typ: sim.typ, tipps, einsatz: einsatzProWette() }, sim.partien)

  // Beispiel für die Auflösung: Tipp mit der grössten Differenz fair ↔ angeboten
  let best: Beispiel | null = null
  for (const t of tipps) {
    const p = sim.partien.find((x) => x.id === t.partieId)!
    const fair = p.fair[t.ausgang]
    if (!best || fair - t.quote > best.fair - best.angeboten) {
      best = { partie: `${p.heim} – ${p.gast}`, fair, angeboten: t.quote }
    }
  }
  sim.beispiel = best
  sim.phase = 'live'
}

/** Nach der Live-Animation: Guthaben verbuchen, ggf. Pop-up auslösen. */
export function abschliessen() {
  const a = sim.auswertung
  if (!a || sim.phase !== 'live') return
  sim.guthaben = round2(sim.guthaben - a.eingesetzt + a.ausbezahlt)
  sim.totalEingesetzt = round2(sim.totalEingesetzt + a.eingesetzt)
  sim.totalAusbezahlt = round2(sim.totalAusbezahlt + a.ausbezahlt)
  sim.anzahlWetten += a.typ === 'einzel' ? a.anzahlTipps : 1
  sim.verlauf.push(sim.guthaben)
  sim.phase = 'ergebnis'

  sim.rundenSeitPopup++
  if (sim.rundenSeitPopup >= cfg.popupMinAbstandRunden && sim.guthaben > 0) {
    let trick: TrickId | null = null
    if (a.knappDaneben && !sim.gezeigteTricks.includes('knapp')) trick = 'knapp'
    else if (
      a.ausbezahlt < a.eingesetzt &&
      sim.guthaben < sim.eingezahlt &&
      !sim.gezeigteTricks.includes('lossChasing')
    )
      trick = 'lossChasing'
    if (trick) {
      sim.popup = trick
      sim.gezeigteTricks.push(trick)
      sim.rundenSeitPopup = 0
    }
  }
}

export function naechsterSpieltag() {
  if (sim.phase !== 'ergebnis') return
  if (sim.guthaben < 0.01) {
    sim.phase = 'aufloesung'
    return
  }
  sim.spieltagNr++
  sim.partien = erzeugeSpieltag(rng, teams, cfg.partienProSpieltag, cfg.marge)
  sim.tipps = {}
  sim.auswertung = null
  if (sim.einsatzWahl !== 'allin' && sim.einsatzWahl > sim.guthaben) sim.einsatzWahl = 'allin'
  sim.phase = 'wetten'
}

export function durchschnittsEinsatz(): number {
  if (!sim.anzahlWetten) return cfg.zeitraffer.standardEinsatz
  return Math.max(1, Math.round(sim.totalEingesetzt / sim.anzahlWetten))
}

/** Zeitraffer: ganze Saison mit Einzelwetten simulieren. */
export function zeitraffer() {
  if (sim.phase === 'live' || sim.phase === 'zeitraffer') return
  const s = simuliereSaison({
    rng,
    anzahlWetten: cfg.zeitraffer.anzahlWetten,
    einsatz: durchschnittsEinsatz(),
    marge: cfg.marge,
    startguthaben: sim.guthaben,
    nachzahlung: cfg.zeitraffer.nachzahlung,
  })
  sim.saison = s
  sim.phase = 'zeitraffer'
}

/** Nach der Zeitraffer-Animation: Werte übernehmen und Auflösung zeigen. */
export function zeitrafferAbschliessen() {
  const s = sim.saison
  if (!s || sim.phase !== 'zeitraffer') return
  sim.verlauf.push(...s.verlauf.slice(1))
  sim.guthaben = s.endguthaben
  sim.eingezahlt += s.einzahlungen * cfg.zeitraffer.nachzahlung
  sim.totalEingesetzt = round2(sim.totalEingesetzt + s.eingesetzt)
  sim.totalAusbezahlt = round2(sim.totalAusbezahlt + s.ausbezahlt)
  sim.anzahlWetten += cfg.zeitraffer.anzahlWetten
  sim.phase = 'aufloesung'
}

export function zurAufloesung() {
  if (sim.phase === 'live') abschliessen()
  if (sim.phase === 'zeitraffer') zeitrafferAbschliessen()
  sim.popup = null
  sim.phase = 'aufloesung'
}

/** Von der Auflösung zurück ins Spiel (falls noch Guthaben da ist). */
export function weiterspielen() {
  if (sim.guthaben < 0.01) return
  if (sim.partien.some((p) => p.ergebnis)) {
    sim.phase = 'ergebnis'
    naechsterSpieltag()
  } else {
    sim.phase = 'wetten'
  }
}
