import { simulationConfig } from '../config/simulation'
import {
  AUSGAENGE,
  type Ausgang,
  type Quoten,
  type Wahrscheinlichkeiten,
  faireQuotenFuer,
  kombiQuote,
  quotenFuer,
} from './odds'
import { type Rng, pickIndex, randomBetween } from './random'

export interface Partie {
  id: string
  heim: string
  gast: string
  wahr: Wahrscheinlichkeiten
  fair: Quoten
  quoten: Quoten
  ergebnis?: Ausgang
  tore?: [number, number]
}

export interface Tipp {
  partieId: string
  ausgang: Ausgang
  quote: number
}

export type WettTyp = 'einzel' | 'kombi'

export interface Wette {
  typ: WettTyp
  tipps: Tipp[]
  /** Einsatz pro Wette (bei Einzelwetten: pro Tipp) */
  einsatz: number
}

export interface WettAuswertung {
  typ: WettTyp
  eingesetzt: number
  ausbezahlt: number
  /** Anzahl richtiger Tipps */
  treffer: number
  anzahlTipps: number
  /** Kombi verloren, aber nur ein Tipp falsch */
  knappDaneben: boolean
}

/** Zufällige, plausible «wahre» Wahrscheinlichkeiten. */
export function zufallsWahrscheinlichkeiten(
  rng: Rng,
  bereich = simulationConfig.wahrscheinlichkeiten,
): Wahrscheinlichkeiten {
  const heim = randomBetween(rng, bereich.heimMin, bereich.heimMax)
  const remis = randomBetween(rng, bereich.remisMin, bereich.remisMax)
  return { '1': heim, X: remis, '2': 1 - heim - remis }
}

/** Ziehung eines Ausgangs gemäss den wahren Wahrscheinlichkeiten. */
export function zieheAusgang(rng: Rng, w: Wahrscheinlichkeiten): Ausgang {
  const r = rng()
  if (r < w['1']) return '1'
  if (r < w['1'] + w.X) return 'X'
  return '2'
}

/** Passendes Resultat (Tore) zum Ausgang – nur für die Anzeige. */
export function zieheTore(rng: Rng, ausgang: Ausgang): [number, number] {
  if (ausgang === 'X') {
    const t = pickIndex(rng, 4)
    return [t, t]
  }
  const verlierer = pickIndex(rng, 3)
  const sieger = verlierer + 1 + pickIndex(rng, 3)
  return ausgang === '1' ? [sieger, verlierer] : [verlierer, sieger]
}

let partieZaehler = 0

export function erzeugeSpieltag(
  rng: Rng,
  teams: string[],
  anzahl: number = simulationConfig.partienProSpieltag,
  marge: number = simulationConfig.marge,
): Partie[] {
  const pool = [...teams]
  // Fisher-Yates
  for (let i = pool.length - 1; i > 0; i--) {
    const j = pickIndex(rng, i + 1)
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  const partien: Partie[] = []
  for (let i = 0; i < anzahl && 2 * i + 1 < pool.length; i++) {
    const wahr = zufallsWahrscheinlichkeiten(rng)
    partien.push({
      id: `p${++partieZaehler}`,
      heim: pool[2 * i],
      gast: pool[2 * i + 1],
      wahr,
      fair: faireQuotenFuer(wahr),
      quoten: quotenFuer(wahr, marge),
    })
  }
  return partien
}

/** Spielt alle Partien eines Spieltags aus (mutiert nicht, gibt Kopie zurück). */
export function spieleSpieltag(
  rng: Rng,
  partien: Partie[],
  erzwungen: Record<string, Ausgang> = {},
): Partie[] {
  return partien.map((p) => {
    const ergebnis = erzwungen[p.id] ?? zieheAusgang(rng, p.wahr)
    return { ...p, ergebnis, tore: zieheTore(rng, ergebnis) }
  })
}

/** Wertet eine Wette gegen gespielte Partien aus. */
export function werteWetteAus(wette: Wette, partien: Partie[]): WettAuswertung {
  const ergebnisVon = new Map(partien.map((p) => [p.id, p.ergebnis]))
  const richtig = wette.tipps.map((t) => ergebnisVon.get(t.partieId) === t.ausgang)
  const treffer = richtig.filter(Boolean).length
  const n = wette.tipps.length

  if (wette.typ === 'einzel') {
    const ausbezahlt = wette.tipps.reduce(
      (sum, t, i) => sum + (richtig[i] ? round2(wette.einsatz * t.quote) : 0),
      0,
    )
    return {
      typ: 'einzel',
      eingesetzt: wette.einsatz * n,
      ausbezahlt: round2(ausbezahlt),
      treffer,
      anzahlTipps: n,
      knappDaneben: false,
    }
  }

  const gewonnen = treffer === n
  const quote = kombiQuote(wette.tipps.map((t) => t.quote))
  return {
    typ: 'kombi',
    eingesetzt: wette.einsatz,
    ausbezahlt: gewonnen ? round2(wette.einsatz * quote) : 0,
    treffer,
    anzahlTipps: n,
    knappDaneben: !gewonnen && n >= 2 && treffer === n - 1,
  }
}

export function round2(x: number): number {
  return Math.round(x * 100) / 100
}

/** Eine einzelne Einzelwette mit zufälligem Tipp auf eine frische Partie. */
export function zufaelligeEinzelwette(
  rng: Rng,
  einsatz: number,
  marge: number,
): { eingesetzt: number; ausbezahlt: number } {
  const wahr = zufallsWahrscheinlichkeiten(rng)
  const quoten = quotenFuer(wahr, marge)
  const tipp = AUSGAENGE[pickIndex(rng, 3)]
  const ergebnis = zieheAusgang(rng, wahr)
  return { eingesetzt: einsatz, ausbezahlt: ergebnis === tipp ? round2(einsatz * quoten[tipp]) : 0 }
}

export interface SaisonOptionen {
  rng: Rng
  anzahlWetten: number
  einsatz: number
  marge?: number
  startguthaben?: number
  nachzahlung?: number
  /** Nur jeden n-ten Punkt im Verlauf speichern (Performance) */
  verlaufSchritt?: number
}

export interface SaisonErgebnis {
  eingesetzt: number
  ausbezahlt: number
  /** ausbezahlt − eingesetzt (negativ = Verlust) */
  netto: number
  /** Anzahl Nachzahlungen (nach Guthaben 0) */
  einzahlungen: number
  endguthaben: number
  /** Guthabenverlauf (inkl. Nachzahlungen) */
  verlauf: number[]
}

/**
 * Simuliert eine Saison mit Einzelwetten. Fällt das Guthaben unter den
 * Einsatz, wird nachgeladen («Du hast nochmals 100 Franken eingezahlt»).
 */
export function simuliereSaison(o: SaisonOptionen): SaisonErgebnis {
  const marge = o.marge ?? simulationConfig.marge
  const nachzahlung = o.nachzahlung ?? simulationConfig.zeitraffer.nachzahlung
  const schritt = o.verlaufSchritt ?? 1
  let guthaben = o.startguthaben ?? simulationConfig.startguthaben
  let eingesetzt = 0
  let ausbezahlt = 0
  let einzahlungen = 0
  const verlauf: number[] = [guthaben]

  for (let i = 0; i < o.anzahlWetten; i++) {
    if (guthaben < o.einsatz) {
      guthaben += nachzahlung
      einzahlungen++
    }
    const w = zufaelligeEinzelwette(o.rng, o.einsatz, marge)
    eingesetzt += w.eingesetzt
    ausbezahlt += w.ausbezahlt
    guthaben = round2(guthaben - w.eingesetzt + w.ausbezahlt)
    if ((i + 1) % schritt === 0 || i === o.anzahlWetten - 1) verlauf.push(guthaben)
  }
  return {
    eingesetzt: round2(eingesetzt),
    ausbezahlt: round2(ausbezahlt),
    netto: round2(ausbezahlt - eingesetzt),
    einzahlungen,
    endguthaben: guthaben,
    verlauf,
  }
}

/** «100 Fans»: Jede Person spielt eine Saison. Liefert Netto pro Person. */
export function simuliereFans(
  rng: Rng,
  anzahlFans: number = simulationConfig.hundertFans.anzahlFans,
  anzahlWetten: number = simulationConfig.hundertFans.standardWetten,
  einsatz: number = simulationConfig.hundertFans.einsatz,
  marge: number = simulationConfig.marge,
): number[] {
  const res: number[] = []
  for (let i = 0; i < anzahlFans; i++) {
    let netto = 0
    for (let k = 0; k < anzahlWetten; k++) {
      const w = zufaelligeEinzelwette(rng, einsatz, marge)
      netto += w.ausbezahlt - w.eingesetzt
    }
    res.push(round2(netto))
  }
  return res
}
