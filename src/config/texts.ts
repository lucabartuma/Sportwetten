/** Projekt- und Rahmentexte (Titel, Banner, Footer, Startseite). */
export const projekt = {
  titel: 'Gegen die Quote',
  /** Alternative Arbeitstitel – bei Bedarf oben bei `titel` eintragen */
  titelAlternativen: ['Volle Quote, leere Taschen', 'Nachspielzeit'],
  banner: 'Spielgeld – Präventionsprojekt der OST',
  bannerKurz: 'Spielgeld · Prävention',
  footer:
    'Prototyp · Institut IDEE, OST · Projekt 5.2400.049.02 · Kein echtes Geld, keine Datenspeicherung.',
}

export const navigation = [
  { to: '/', label: 'Start' },
  { to: '/simulator', label: 'Wetten' },
  { to: '/100-fans', label: '100 Fans' },
  { to: '/selbsttest', label: 'Selbsttest' },
  { to: '/fakten', label: 'Fakten' },
  { to: '/hilfe', label: 'Hilfe' },
]

export const startseite = {
  headline: 'Du kennst Dich im Fussball aus? Dann schlag den Wettanbieter.',
  subline: 'Mit 100 Spiel-Franken. Ohne Risiko. Wir sind gespannt.',
  cta: 'Jetzt wetten',
  kacheln: [
    { to: '/100-fans', titel: '100 Fans – wer gewinnt?', text: '100 Leute, eine Saison. Rate mal, wie viele am Ende im Plus sind.', icon: '👥' },
    { to: '/selbsttest', titel: 'Selbsttest', text: '9 kurze Fragen. Anonym, nichts wird gespeichert.', icon: '✅' },
    { to: '/fakten', titel: 'Fakten & Hilfe', text: 'Zahlen, Mythen und wo Du Unterstützung findest.', icon: '💡' },
  ],
}

export const simulatorTexte = {
  titel: 'Spieltag',
  guthaben: 'Guthaben',
  einsatz: 'Einsatz',
  allIn: 'All-in',
  einzel: 'Einzelwette',
  kombi: 'Kombiwette',
  einzelHilfe: 'Jeder Tipp ist eine eigene Wette mit dem gewählten Einsatz.',
  kombiHilfe: 'Alle Tipps müssen stimmen. Die Quoten werden multipliziert.',
  anpfiff: 'Anpfiff!',
  ueberspringen: 'Überspringen',
  naechsterSpieltag: 'Nächster Spieltag',
  zeitraffer: 'Zeitraffer: Spiel eine ganze Saison',
  aufloesung: 'Auflösung',
  reset: 'Neu starten',
  keineTipps: 'Wähle mindestens einen Tipp (1, X oder 2).',
  zuWenigGuthaben: 'Nicht genug Guthaben für diesen Einsatz.',
  verlaufTitel: 'Dein Guthabenverlauf',
}

export const aufloesungTexte = {
  verloren: (betrag: string) => `Du hast CHF ${betrag} verloren.`,
  imPlus: (betrag: string) => `Du bist CHF ${betrag} im Plus – noch.`,
  imPlusHinweis: 'Spiel den Zeitraffer und schau, was nach einer Saison übrig bleibt.',
  kernbotschaft: 'Das war kein Pech. Das war Mathematik.',
  margeErklaerung: (marge: string) =>
    `In jeder Quote steckt eine Marge von rund ${marge}. Die angebotene Quote ist immer etwas tiefer als die faire. Einzelne Wetten kannst Du gewinnen – aber je länger Du spielst, desto sicherer holt sich der Anbieter seinen Anteil.`,
  beispiel: (partie: string, fair: string, angeboten: string) =>
    `Bei der Partie ${partie} lag die faire Quote bei ${fair}, angeboten wurden ${angeboten}.`,
  kombiHinweis: 'Bei Kombiwetten multipliziert sich die Marge: Eine 3er-Kombi kostet Dich im Schnitt fast 20 % Deines Einsatzes.',
  fansTeaser: 'Von 100 Wettenden machen langfristig nur rund 4 Gewinn.',
  fansButton: 'Sieh’s Dir an',
  nochmals: 'Nochmals spielen',
  selbsttest: 'Selbsttest machen',
  hilfe: 'Hilfe & Infos',
  teilen: 'Ergebnis teilen',
  teilenText: (betrag: string) =>
    `Ich habe bei «Gegen die Quote» CHF ${betrag} Spielgeld verloren – schaffst Du’s besser?`,
}

export const hundertFansTexte = {
  titel: '100 Fans – wer gewinnt?',
  intro:
    '100 Fans wetten eine Saison lang auf die erfundene Liga: jede Wette CHF 10, Tipps nach Bauchgefühl, gleiche Quoten wie im Simulator. Was meinst Du – wie viele sind am Ende im Plus?',
  start: 'Saison starten',
  nochmals: 'Nochmals simulieren',
  regler: 'Wetten pro Person',
  reglerHinweis: 'Je länger man spielt, desto sicherer verliert man.',
  verloren: 'Verlust',
  gewonnen: 'Gewinn',
  ergebnis: (verlierer: number, n: number) => `${verlierer} von ${n} haben Geld verloren.`,
}
