/** Ausgang einer Partie: 1 = Heimsieg, X = Unentschieden, 2 = Auswärtssieg */
export type Ausgang = '1' | 'X' | '2'
export const AUSGAENGE: Ausgang[] = ['1', 'X', '2']

export type Wahrscheinlichkeiten = Record<Ausgang, number>
export type Quoten = Record<Ausgang, number>

/** Abrunden auf 2 Nachkommastellen (robust gegen Gleitkomma-Fehler). */
export function floor2(x: number): number {
  return Math.floor(x * 100 + 1e-9) / 100
}

/** Faire Quote ohne Marge: 1 / p */
export function faireQuote(p: number): number {
  return 1 / p
}

/** Angebotene Quote: 1 / (p × (1 + marge)), auf 2 Stellen abgerundet. */
export function angeboteneQuote(p: number, marge: number): number {
  return floor2(1 / (p * (1 + marge)))
}

export function quotenFuer(w: Wahrscheinlichkeiten, marge: number): Quoten {
  return {
    '1': angeboteneQuote(w['1'], marge),
    X: angeboteneQuote(w.X, marge),
    '2': angeboteneQuote(w['2'], marge),
  }
}

export function faireQuotenFuer(w: Wahrscheinlichkeiten): Quoten {
  return { '1': faireQuote(w['1']), X: faireQuote(w.X), '2': faireQuote(w['2']) }
}

/** Summe der Kehrwerte der Quoten («Buchmacher-Summe»), z. B. 1.07 = 7 % Marge */
export function overround(q: Quoten): number {
  return 1 / q['1'] + 1 / q.X + 1 / q['2']
}

/** Kombi-Quote: Produkt der Einzelquoten, auf 2 Stellen abgerundet. */
export function kombiQuote(quoten: number[]): number {
  return floor2(quoten.reduce((a, b) => a * b, 1))
}

/** Erwartete Auszahlung pro Franken bei einer Kombi mit n Tipps (ohne Rundung). */
export function erwarteteRueckzahlung(marge: number, anzahlTipps: number): number {
  return Math.pow(1 / (1 + marge), anzahlTipps)
}
