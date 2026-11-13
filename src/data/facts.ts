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
    id: 'ucsd',
    wert: '96 %',
    text: 'von über 700’000 Online-Spielenden verloren über fünf Jahre Geld – nur 4 % machten Gewinn.',
    quelle:
      'UC San Diego, Rady School of Management, 2025 (USA; Sportwetten, Online-Casino und Fantasy Sports zusammen)',
    url: 'https://gamblingharm.org/most-online-gamblers-lose-study/',
    stand: '2025 (Daten 2019–2023)',
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
]

/**
 * Kernkennzahl «nur X von 100 gewinnen» – bewusst nicht hart codiert.
 * Falls eine andere Quelle bevorzugt wird (z. B. «jeder Hundertste»), hier ändern.
 */
export const kernkennzahl = {
  gewinnerVon100: 4,
  kurz: 'Nur rund 4 von 100 machen langfristig Gewinn.',
  studie:
    'In einer Studie der University of California San Diego mit über 700’000 Online-Spielenden verloren 96 % Geld, nur 4 % machten Gewinn (2019–2023).',
  faktId: 'ucsd',
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
