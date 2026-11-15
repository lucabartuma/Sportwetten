/** Selbsttest: Fragen, Antwortoptionen und Auswertung. Nichts wird gespeichert. */
export const antwortOptionen = [
  { label: 'Nie', punkte: 0 },
  { label: 'Manchmal', punkte: 1 },
  { label: 'Oft', punkte: 2 },
  { label: 'Fast immer', punkte: 3 },
]

export const fragen: string[] = [
  'Wettest Du mit mehr Geld, als Du Dir leisten kannst zu verlieren?',
  'Versuchst Du, verlorenes Geld mit weiteren Wetten zurückzuholen?',
  'Hast Du Dir schon Geld geliehen, um zu wetten?',
  'Hast Du Familie oder Freunde angelogen, wie viel Du wettest?',
  'Denkst Du auch während Schule, Arbeit oder mit Freunden ans Wetten?',
  'Schaust Du Spiele nur noch wegen Deiner Wetten?',
  'Hast Du schon versucht, weniger zu wetten, und es nicht geschafft?',
  'Fühlst Du Dich gestresst, gereizt oder schuldig wegen des Wettens?',
  'Hat Dich schon jemand auf Dein Wettverhalten angesprochen?',
]

export type Stufe = 'gruen' | 'gelb' | 'rot'

export interface StufenInfo {
  stufe: Stufe
  icon: string
  label: string
  text: string
  tipps: string[]
  hilfeProminent: boolean
}

/**
 * Schwellen (Summe 0–27):
 *   0–3   → grün
 *   4–9   → gelb
 *   10+   → rot
 * Zusätzlich: Wer bei Frage 2 (Loss Chasing) oder 3 (Geld leihen) «Oft» oder
 * «Fast immer» antwortet, landet mindestens auf Gelb.
 */
export const schwellen = { gelbAb: 4, rotAb: 10 }
export const kritischeFragen = [1, 2] // Index: Frage 2 und 3

export const stufen: Record<Stufe, StufenInfo> = {
  gruen: {
    stufe: 'gruen',
    icon: '✓',
    label: 'Grün',
    text: 'Aktuell kein auffälliges Muster. Bleib aufmerksam.',
    tipps: [
      'Leg Dir vorher ein festes Budget fest – und hör auf, wenn es weg ist.',
      'Wette nie, um Verluste zurückzuholen.',
    ],
    hilfeProminent: false,
  },
  gelb: {
    stufe: 'gelb',
    icon: '!',
    label: 'Gelb',
    text: 'Einige Warnsignale. Es lohnt sich, genauer hinzuschauen.',
    tipps: [
      'Begrenze Deinen Zugang zu Geld – z. B. Bankkarte einer Vertrauensperson geben.',
      'Gönn Dir eine Handypause: Wett-Apps löschen, Push-Nachrichten aus.',
      'Sprich mit jemandem, dem Du vertraust.',
      'Mach den ausführlichen Selbsttest auf spielen-ohne-sucht.ch.',
    ],
    hilfeProminent: false,
  },
  rot: {
    stufe: 'rot',
    icon: '!!',
    label: 'Rot',
    text: 'Mehrere deutliche Warnsignale. Hol Dir Unterstützung, das ist kein Zeichen von Schwäche.',
    tipps: [
      'Melde Dich bei einer Beratungsstelle – anonym und kostenlos.',
      'Gib Deine Bankkarte vorübergehend einer Vertrauensperson.',
      'Lass Dich bei Anbietern sperren und lösche Wett-Apps.',
      'Sprich mit jemandem, dem Du vertraust.',
    ],
    hilfeProminent: true,
  },
}

export function auswerten(antworten: number[]): StufenInfo {
  const summe = antworten.reduce((a, b) => a + b, 0)
  let stufe: Stufe = summe >= schwellen.rotAb ? 'rot' : summe >= schwellen.gelbAb ? 'gelb' : 'gruen'
  if (stufe === 'gruen' && kritischeFragen.some((i) => (antworten[i] ?? 0) >= 2)) stufe = 'gelb'
  return stufen[stufe]
}

export const selbsttestTexte = {
  titel: 'Selbsttest',
  intro: '9 kurze Fragen zu Deinem Wettverhalten in den letzten 12 Monaten.',
  datenschutz: 'Deine Antworten werden nicht gespeichert und nicht übermittelt. Sie bleiben nur in diesem Browserfenster.',
  start: 'Test starten',
  zurueck: 'Zurück',
  frage: (i: number, n: number) => `Frage ${i} von ${n}`,
  ergebnisTitel: 'Dein Ergebnis',
  tippsTitel: 'Was Du jetzt tun kannst',
  disclaimer:
    'Dieser Kurztest ist keine Diagnose. Einen fundierten Selbsttest und Beratung findest Du bei spielen-ohne-sucht.ch.',
  disclaimerUrl: 'https://www.spielen-ohne-sucht.ch',
  nochmals: 'Test wiederholen',
  hilfe: 'Zu den Hilfsangeboten',
}
