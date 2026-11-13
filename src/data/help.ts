/** Hilfsangebote, Clip und weiterführende Links. */
export interface Angebot {
  name: string
  url: string
  text: string
}

export const hilfeTexte = {
  titel: 'Hilfe & Infos',
  einstieg: 'Spielsucht ist eine anerkannte Krankheit und lässt sich behandeln.',
  angeboteTitel: 'Hier findest Du Unterstützung',
  clipTitel: 'Kurzclip',
  clipHinweis: 'Das Video wird erst nach Klick von YouTube (ohne Cookies) geladen.',
  clipLaden: 'Video laden',
  clipExtern: 'Video auf YouTube ansehen',
  clipRechte: 'Nutzungsrechte vor einer Veröffentlichung klären.',
  medienTitel: 'Mehr dazu in den Medien',
  angehoerigeTitel: 'Für Angehörige und Eltern',
}

export const angebote: Angebot[] = [
  {
    name: 'spielen-ohne-sucht.ch',
    url: 'https://www.spielen-ohne-sucht.ch',
    text: 'Beratungsstellen in der Ostschweiz, Selbsttests, Hotlines und Online-Beratung – auch für Angehörige und Eltern.',
  },
  {
    name: 'game-changer.ch',
    url: 'https://www.game-changer.ch',
    text: 'Kampagne der Kantone zu den Risiken von Sportwetten.',
  },
  {
    name: 'sos-spielsucht.ch',
    url: 'https://www.sos-spielsucht.ch',
    text: 'Informationen und Beratung rund um Spielsucht.',
  },
  {
    name: 'buendnis-gegen-sportwettenwerbung.de',
    url: 'https://buendnis-gegen-sportwettenwerbung.de/infomaterialien',
    text: 'Infomaterial zu Sportwettenwerbung (Deutschland).',
  },
]

export const clip = {
  youtubeId: 'CkTk0ZCu8GU',
  embedUrl: 'https://www.youtube-nocookie.com/embed/CkTk0ZCu8GU?autoplay=1',
  externUrl: 'https://www.youtube.com/shorts/CkTk0ZCu8GU',
  format: '9:16' as '9:16' | '16:9',
  titel: 'Kurzclip zu Sportwetten',
}

export const medien: Angebot[] = [
  {
    name: 'heute-show (ZDF), 21.8.2026',
    url: 'https://www.zdf.de/comedy/heute-show',
    text: 'Satirischer Beitrag zu Sportwetten und Werbung.',
  },
  {
    name: 'stgallen24: «Wenn Fussball zur Falle wird»',
    url: 'https://stgallen24.ch/articles/392815-wenn-fussball-zur-falle-wird',
    text: 'Artikel vom 9.7.2026 zu Sportwetten in der Ostschweiz.',
  },
]

export const angehoerigeTipps: string[] = [
  'Lass Dich beraten – Beratungsstellen sind auch für Angehörige da.',
  'Bleib im Gespräch, ohne Vorwürfe.',
  'Informier Dich über Sportwetten und Warnsignale.',
]
