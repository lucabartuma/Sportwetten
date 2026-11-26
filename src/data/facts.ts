/**
 * Alle Zahlen mit Quelle. Felder: wert, text, quelle, url, stand.
 * Hier ändern – die Seiten lesen ausschliesslich aus dieser Datei.
 */
export interface Fakt {
  id: string
  wert: string
  text: string
  quelle: string
  url: string
  stand: string
}

export const fakten: Fakt[] = [
  {
    id: 'junge-maenner',
    wert: '~10 %',
    text: 'der Männer zwischen 15 und 24 Jahren in der Schweiz zeigen ein problematisches Spielverhalten – rund 40’000 Personen.',
    quelle: 'Schweizerische Gesundheitsbefragung 2022, zitiert in SRF (Kampagne «Game Changer»)',
    url: 'https://www.srf.ch/news/dialog/hockey-und-fussball-game-changer-kampagne-warnt-vor-risiken-von-sportwetten',
    stand: '2022',
  },
  {
    id: 'online-wachstum',
    wert: '+40 %',
    text: 'mehr Online-Wettende in der Schweiz innerhalb von zehn Jahren.',
    quelle: 'SRF, Kampagne «Game Changer»',
    url: 'https://www.srf.ch/news/dialog/hockey-und-fussball-game-changer-kampagne-warnt-vor-risiken-von-sportwetten',
    stand: '2026',
  },
  {
    id: 'bevoelkerung',
    wert: '4,3 %',
    text: 'der Bevölkerung ab 15 Jahren in der Schweiz zeigen ein problematisches Geldspielverhalten.',
    quelle: 'stgallen24 / Keystone-SDA, 9.7.2026',
    url: 'https://stgallen24.ch/articles/392815-wenn-fussball-zur-falle-wird',
    stand: '9.7.2026',
  },
  {
    id: 'swisslos',
    wert: '169 Mio.',
    text: 'Franken haben Wettende 2025 allein bei den Sportwetten von Swisslos mehr eingesetzt, als sie zurückbekommen haben (Bruttospielertrag).',
    quelle: 'Swisslos, Geschäftsbericht 2025 (Deutschschweiz und Tessin, nur legales Angebot)',
    url: 'https://static.swisslos.ch/media/swisslos/publikationen/pdf/gesch%C3%A4ftsbericht-2025.pdf',
    stand: '13.2.2026',
  },
  {
    id: 'egames',
    wert: '18,8 %',
    text: 'der 18- bis 29-jährigen Online-Geldspielenden in der Schweiz zeigen ein mässiges oder problematisches Risikoprofil.',
    quelle: 'Sucht Schweiz / GREA, Studie eGames 2021/22',
    url: 'https://www.sos-spielsucht.ch/media/files/2023/02/Factsheet_eGames_Problematisch_20230214_D.pdf',
    stand: '2023',
  },
  {
    id: 'marge',
    wert: '~6 %',
    text: 'Marge steckt typischerweise in einer Fussballwette – die Quoten ergeben zusammen ca. 106 %.',
    quelle: 'Branchenbeispiel Altenar',
    url: 'https://altenar.com/de/blog/house-edge-in-sports-betting-how-the-best-sportsbooks-manage-their-edge/',
    stand: '2025',
  },
  {
    id: 'junge-wettende',
    wert: '14,8 %',
    text: 'der jungen Männer zwischen 15 und 29 Jahren haben in den letzten 12 Monaten auf Sport gewettet (alle Befragten: 8,9 %).',
    quelle: 'Sucht Schweiz, Factsheet «Sportwetten bei jungen Menschen» (2’028 Befragte, 15–29 Jahre)',
    url: 'https://www.suchtschweiz.ch/publication/sportwetten-bei-jungen-menschen-exposition-und-kenntnisse/',
    stand: 'Mai 2026',
  },
  {
    id: 'werbung',
    wert: '~50 %',
    text: 'der 15- bis 29-Jährigen sehen häufig oder sehr häufig Werbung für Sportwetten – vor allem auf Social Media und in Apps.',
    quelle: 'Sucht Schweiz, Factsheet «Sportwetten bei jungen Menschen»',
    url: 'https://www.suchtschweiz.ch/publication/sportwetten-bei-jungen-menschen-exposition-und-kenntnisse/',
    stand: 'Mai 2026',
  },
  {
    id: 'risiken',
    wert: '>40 %',
    text: 'der 15- bis 29-Jährigen wurden nach eigenen Angaben nie über die Risiken von Sportwetten informiert.',
    quelle: 'Sucht Schweiz, Factsheet «Sportwetten bei jungen Menschen»',
    url: 'https://www.suchtschweiz.ch/publication/sportwetten-bei-jungen-menschen-exposition-und-kenntnisse/',
    stand: 'Mai 2026',
  },
]

/**
 * Kernkennzahl (Startseite und «100 Fans»): bewusst eine Schweizer Zahl.
 * Hier ändern, falls eine andere Quelle bevorzugt wird.
 */
export const kernkennzahl = {
  /** Wert für die Box «Die Rechnung» auf der Startseite */
  wert: '169 Mio.',
  wertText: 'Franken verloren Wettende 2025 allein bei Swisslos-Sportwetten',
  /** Text unter «Und in der Realität?» (100 Fans) */
  studie:
    'Allein bei den legalen Sportwetten von Swisslos haben Wettende 2025 rund CHF 169 Millionen mehr eingesetzt, als sie zurückbekommen haben. Genau diese Differenz ist der Ertrag des Anbieters – und der Verlust der Wettenden.',
  faktId: 'swisslos',
}

export function faktById(id: string): Fakt | undefined {
  return fakten.find((f) => f.id === id)
}

export interface Mythos {
  mythos: string
  fakt: string
}

export const mythen: Mythos[] = [
  {
    mythos: '«Wer viel über Fussball weiss, gewinnt.»',
    fakt: 'Die Marge steckt in jeder Quote. Wissen ändert daran nichts. Anbieter haben mehr Daten als jeder Fan.',
  },
  {
    mythos: '«Ich hole mir das Verlorene zurück.»',
    fakt: 'Verlusten hinterherjagen ist eines der wichtigsten Warnsignale für Spielsucht.',
  },
  {
    mythos: '«Kombiwetten bringen mehr.»',
    fakt: 'Die Marge multipliziert sich mit jedem Tipp – der Nachteil wird grösser.',
  },
  {
    mythos: '«Bonus = Gratisgeld.»',
    fakt: 'Boni sind an Umsatzbedingungen geknüpft und sollen Dich länger spielen lassen.',
  },
  {
    mythos: '«Ausländische Apps haben bessere Quoten.»',
    fakt: 'Sie sind in der Schweiz nicht bewilligt, haben meist keinen Spielerschutz und keine Beschwerdestelle. Gewinne können gefährdet sein.',
  },
]

export const warnsignale: string[] = [
  'Das Gefühl, zu viel zu spielen',
  'Grosse Verluste',
  'Familie oder Freunde anlügen',
  'Geld leihen, um zu wetten',
]

export const faktenTexte = {
  titel: 'Fakten',
  intro: 'Kurz und ehrlich: was Zahlen und Studien über Sportwetten sagen.',
  mythenTitel: 'Mythen vs. Fakten',
  mythenHinweis: 'Tippe auf eine Karte, um sie umzudrehen.',
  warnsignaleTitel: 'Warnsignale',
  rechtlichTitel: 'Was ist in der Schweiz erlaubt?',
  rechtlich:
    'Sportwetten sind in der Schweiz legal nur bei Sporttip (Swisslos) und Jouez Sport (Loterie Romande) und erst ab 18 Jahren. Ausländische Anbieter sind per VPN zwar leicht erreichbar, haben aber meist keinen Spielerschutz.',
  rechtlichQuelle: { label: 'Quelle: spielen-ohne-sucht.ch', url: 'https://www.spielen-ohne-sucht.ch' },
}

/**
 * Skala «Wo hört der Spass auf?» – Anregung aus dem Experteninterview:
 * Schwierig ist zu merken, ab wann es kein harmloser Spass mehr ist.
 */
export interface SkalaStufe {
  id: string
  titel: string
  kurz: string
  zeichen: string[]
  ton: 'gruen' | 'gelb' | 'orange' | 'rot'
}

export const skala = {
  titel: 'Wo hört der Spass auf?',
  intro:
    'Der Übergang ist fliessend – und von innen schwer zu sehen. Wähle eine Stufe und schau, woran man sie erkennt.',
  stufen: [
    {
      id: 'spass',
      titel: 'Spass',
      kurz: 'Ab und zu, kleiner Betrag',
      ton: 'gruen',
      zeichen: [
        'Du setzt nur Geld, dessen Verlust Dir egal ist.',
        'Du hast vorher ein Limit und hältst es ein.',
        'Das Spiel ist auch ohne Wette spannend.',
      ],
    },
    {
      id: 'gewohnheit',
      titel: 'Gewohnheit',
      kurz: 'Fast jedes Wochenende',
      ton: 'gelb',
      zeichen: [
        'Wetten gehört zu jedem Spiel dazu.',
        'Die Einsätze werden langsam grösser.',
        'Du checkst Quoten und Push-Nachrichten öfter als nötig.',
      ],
    },
    {
      id: 'risiko',
      titel: 'Risiko',
      kurz: 'Verluste zurückholen',
      ton: 'orange',
      zeichen: [
        'Nach einem Verlust willst Du es sofort zurückholen.',
        'Du setzt mehr, als Du Dir vorgenommen hast.',
        'Du erzählst lieber nicht, wie viel Du wettest.',
      ],
    },
    {
      id: 'problem',
      titel: 'Problem',
      kurz: 'Es kontrolliert Dich',
      ton: 'rot',
      zeichen: [
        'Du leihst Dir Geld oder hast Schulden wegen Wetten.',
        'Schule, Arbeit oder Freundschaften leiden.',
        'Du hast versucht aufzuhören – und es nicht geschafft.',
      ],
    },
  ] as SkalaStufe[],
  hinweis: 'Ab «Risiko» lohnt es sich, mit jemandem zu reden. Der Selbsttest hilft beim Einordnen.',
}
