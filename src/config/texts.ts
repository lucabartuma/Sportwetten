/** Projekt- und Rahmentexte (Titel, Banner, Footer, Navigation, Hero, Simulator, 100 Fans). */
export const projekt = {
  titel: 'Gegen die Quote',
  /** Alternative Arbeitstitel – bei Bedarf oben bei `titel` eintragen */
  titelAlternativen: ['Volle Quote, leere Taschen', 'Nachspielzeit'],
  banner: 'Spielgeld – Präventionsprojekt der OST',
  footer:
    'Prototyp · Institut IDEE, OST · Projekt 5.2400.049.02 · Kein echtes Geld, keine Datenspeicherung.',
  hilfeButton: 'Hilfe',
}

/** Abschnitte des Einseiters: id = Anker (#simulator), label = Navigation */
export const abschnitte = [
  { id: 'start', label: 'Start' },
  { id: 'simulator', label: 'Simulator' },
  { id: '100-fans', label: '100 Fans' },
  { id: 'hintergrund', label: 'Hintergrund' },
  { id: 'fakten', label: 'Fakten' },
  { id: 'selbsttest', label: 'Selbsttest' },
  { id: 'hilfe', label: 'Hilfe' },
] as const

export type AbschnittId = (typeof abschnitte)[number]['id']

export const hero = {
  kicker: 'Sportwetten · Prävention',
  headline: 'Du kennst Dich im Fussball aus?',
  headlineAkzent: 'Dann schlag den Wettanbieter.',
  lede:
    'Sportwetten-Werbung verspricht: Wer Ahnung hat, gewinnt. Wir haben nachgerechnet. Gib einen Tipp ab – mit Spielgeld, ohne Risiko – und schau, was nach einer ganzen Saison übrig bleibt.',
  cta: 'Tipp abgeben',
  ctaSekundaer: 'Erst lesen, worum es geht',
  scrollHinweis: 'Scrollen',
}

export const simulatorTexte = {
  kicker: 'Simulator',
  titel: 'Ein Tipp. Eine Saison.',
  intro:
    'Die Quoten sind so berechnet wie bei echten Anbietern: ehrlich ausgelost, aber mit einer eingebauten Marge. Dein Einsatz: CHF {einsatz} Spielgeld.',
  schritt1: 'Wähle Deinen Tipp',
  tippAbgeben: 'Tipp abgeben',
  keinTipp: 'Wähle 1, X oder 2.',
  richtig: 'Dein Tipp war richtig.',
  falsch: 'Dein Tipp war falsch.',
  quoteTitel: 'Was in Deiner Quote steckte',
  quoteText: (fair: string, angeboten: string, rappen: string) =>
    `Faire Quote: ${fair} · angeboten: ${angeboten}. Pro Franken Einsatz behält der Anbieter bei diesem Tipp im Schnitt ${rappen} Rappen – egal, ob Du gewinnst oder verlierst.`,
  saisonButton: 'Und wenn Du die ganze Saison so weiterwettest?',
  saisonTitel: (n: number, einsatz: number) => `${n} Wetten à CHF ${einsatz}`,
  saisonLaeuft: 'Saison läuft …',
  nachgeladen: (n: number, betrag: number) => `${n}× CHF ${betrag} nachgeladen`,
  eingesetzt: 'Eingesetzt',
  ausbezahlt: 'Ausbezahlt',
  ergebnisVerlust: 'Verlust',
  ergebnisGewinn: 'Gewinn – noch',
  kernbotschaft: 'Das war kein Pech. Das war Mathematik.',
  kernText:
    'Einzelne Wetten kannst Du gewinnen. Aber in jeder Quote steckt die Marge – und je länger Du spielst, desto sicherer holt sich der Anbieter seinen Anteil.',
  gewinnHinweis:
    'Glück gehabt – diesmal. Spiel die Saison nochmals oder schau Dir an, wie es 100 Fans ergeht.',
  nochmals: 'Neuer Tipp',
  zuFans: 'Wie geht’s 100 Fans?',
  verlaufLabel: 'Guthaben im Verlauf der Saison',
}

export const hundertFansTexte = {
  kicker: 'Experiment',
  titel: '100 Fans – wer gewinnt?',
  intro:
    '100 Fans wetten eine Saison lang: jede Wette CHF 10, Tipps nach Bauchgefühl, gleiche Quoten wie im Simulator. Was meinst Du – wie viele sind am Ende im Plus?',
  start: 'Saison starten',
  nochmals: 'Nochmals simulieren',
  regler: 'Wetten pro Person',
  reglerHinweis: 'Je länger man spielt, desto sicherer verliert man.',
  verloren: 'Verlust',
  gewonnen: 'Gewinn',
  ergebnis: (verlierer: number, n: number) => `${verlierer} von ${n} haben Geld verloren.`,
  realitaetTitel: 'Und in der Realität?',
}
