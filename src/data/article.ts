/**
 * Hintergrund-Artikel auf der Startseite.
 * `quellen` verweist auf Einträge in facts.ts (id) – die Quelle wird
 * automatisch mit Link unter dem Absatz angezeigt.
 */
export interface Absatz {
  titel: string
  text: string[]
  quellen?: string[]
  /** zusätzlicher Quellenlink ohne Zahl in facts.ts */
  link?: { label: string; url: string }
  /** optionale Hervorhebung (Zitat/Kernaussage) */
  zitat?: string
}

export const artikel = {
  kicker: 'Hintergrund',
  titel: 'Warum wir über Sportwetten reden müssen',
  lede:
    'Wetten gehört für viele inzwischen zum Fussball wie der Schal. Die Werbung ist überall – auf Social Media, in der Halbzeitpause, auf dem Trikot. Was sie nicht erzählt: wie das Geschäft dahinter funktioniert.',
  lesezeit: '3 Minuten Lesezeit',
  absaetze: [
    {
      titel: 'Ein Trend, der vor allem junge Männer trifft',
      text: [
        'In der Schweiz wetten heute deutlich mehr Menschen online als noch vor zehn Jahren. Besonders betroffen sind junge Männer: Rund jeder zehnte Mann zwischen 15 und 24 Jahren zeigt ein problematisches Spielverhalten.',
        'Fachleute aus der Suchtprävention in der Ostschweiz bezeichnen Sportwetten deshalb als eine der grössten aktuellen Herausforderungen.',
      ],
      quellen: ['junge-maenner', 'online-wachstum'],
    },
    {
      titel: 'Die Werbung verkauft ein Gefühl von Kontrolle',
      text: [
        'Anders als beim Lotto suggeriert die Werbung bei Sportwetten: Wer sich auskennt, gewinnt. Statistiken, Formkurven, «Expertentipps» – alles soll zeigen, dass Wissen den Unterschied macht.',
        'Dazu kommen Lockangebote wie Willkommensboni oder «Quoten-Boosts». Sie fühlen sich wie Geschenke an, sind aber so gebaut, dass Du länger und mehr spielst.',
      ],
    },
    {
      titel: 'Das eigentliche Produkt: die Marge',
      text: [
        'Ein Wettanbieter muss nicht wissen, wer gewinnt. Er berechnet für jede Partie die Wahrscheinlichkeiten – und zahlt dann etwas weniger aus, als fair wäre. Zusammengerechnet ergeben die Quoten eines Spiels nicht 100 %, sondern etwa 106 %. Diese Differenz ist sein Gewinn.',
        'Bei einer einzelnen Wette fällt das kaum auf. Über hunderte Wetten wird daraus ein fast sicherer Verlust. Und bei Kombiwetten multipliziert sich die Marge mit jedem Tipp.',
      ],
      zitat: 'Der Anbieter wettet nicht gegen Dich. Er verdient an jeder Wette – egal, wie sie ausgeht.',
      quellen: ['marge', 'ucsd'],
    },
    {
      titel: 'Legal, illegal – und warum das wichtig ist',
      text: [
        'In der Schweiz sind Sportwetten nur bei Sporttip (Swisslos) und Jouez Sport (Loterie Romande) erlaubt – und erst ab 18 Jahren. Ausländische Apps sind per VPN zwar leicht erreichbar, haben aber meist keinen Spielerschutz, keine Beschwerdestelle und keine Limiten.',
      ],
      link: { label: 'spielen-ohne-sucht.ch – Geldspiel in der Schweiz', url: 'https://www.spielen-ohne-sucht.ch' },
    },
    {
      titel: 'Warum es hier keine Moralpredigt gibt',
      text: [
        'Diese Seite will Dir nichts verbieten. Sie will zeigen, wie das System gebaut ist – damit Du selbst entscheiden kannst. Und falls Du merkst, dass Wetten Dir mehr nimmt als gibt: Unterstützung ist anonym, kostenlos und kein Zeichen von Schwäche.',
      ],
    },
  ] as Absatz[],
}
