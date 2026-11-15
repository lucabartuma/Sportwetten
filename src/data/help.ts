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
  clipTitel: 'Videos',
  clipIntro: 'Kurz erklärt: warum der Zufall entscheidet und nicht das Wissen.',
  clipHinweis: 'Das Video wird erst nach Klick von YouTube (ohne Cookies) geladen.',
  clipLaden: 'Video laden',
  clipExtern: 'Video auf YouTube ansehen',
  clipRechte: 'Nutzungsrechte vor einer Veröffentlichung klären.',
  medienTitel: 'Mehr dazu in den Medien',
  angehoerigeTitel: 'Für Eltern und Angehörige',
  angehoerigeIntro: 'Viele Eltern haben Sportwetten nicht auf dem Radar – sie laufen digital und unter Kollegen.',
  multiplikatorenTitel: 'Für Trainer:innen, Lehrpersonen und Betreuende',
  multiplikatorenIntro:
    'Jugendliche hören eher auf Personen aus ihrem Alltag. Diese Seite eignet sich für 15 Minuten im Training, im Unterricht oder in der Gruppe.',
  sperreTitel: 'Spielsperre',
  sperreText:
    'Du kannst Dich selbst sperren lassen – bei einem Schweizer Casino oder bei Swisslos / Loterie Romande. Die Sperre gilt dann bei allen bewilligten Casinos und Online-Geldspielen in der Schweiz. Eine Beratungsstelle hilft Dir dabei.',
  sperreLink: { label: 'Mehr zur Spielsperre bei spielen-ohne-sucht.ch', url: 'https://www.spielen-ohne-sucht.ch' },
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

export interface Clip {
  youtubeId: string
  titel: string
  quelle: string
  format: '9:16' | '16:9'
  /** true = YouTube-Short (externer Link auf /shorts/) */
  short?: boolean
}

/** Videos – Klick-zum-Laden über youtube-nocookie.com */
export const clips: Clip[] = [
  {
    youtubeId: 'l3vhNEvflQ8',
    titel: 'Sportwetten: Fanbegeisterung vs. Suchtgefahr',
    quelle: 'Spielen ohne Sucht',
    format: '16:9',
  },
  {
    youtubeId: 'H3p9ANQ9xg4',
    titel: 'Mit Sportwetten Geld verdienen?',
    quelle: 'Spielen ohne Sucht',
    format: '16:9',
  },
  {
    youtubeId: 'CkTk0ZCu8GU',
    titel: 'Kurzclip zu Sportwetten',
    quelle: 'YouTube-Short (Nutzungsrechte klären)',
    format: '9:16',
    short: true,
  },
]

export function clipEmbedUrl(c: Clip) {
  return `https://www.youtube-nocookie.com/embed/${c.youtubeId}?autoplay=1`
}
export function clipExternUrl(c: Clip) {
  return c.short ? `https://www.youtube.com/shorts/${c.youtubeId}` : `https://www.youtube.com/watch?v=${c.youtubeId}`
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
  'Frag interessiert statt anklagend: «Wettet bei Dir in der Klasse oder im Team auch jemand?»',
  'Spielt den Simulator auf dieser Seite gemeinsam – das öffnet oft das Gespräch.',
  'Achte auf Geldsorgen, Lügen über Geld oder Spiele, die nur noch wegen Wetten geschaut werden.',
  'Lass Dich beraten – Beratungsstellen sind auch für Angehörige da, anonym und kostenlos.',
]

export const angehoerigeLinks: Angebot[] = [
  {
    name: 'check-dein-spiel.de – für Angehörige',
    url: 'https://www.check-dein-spiel.de',
    text: 'Kurzvideos und Infos des deutschen Bundesinstituts für öffentliche Gesundheit.',
  },
]

export const multiplikatorenTipps: string[] = [
  'Einstieg: Alle geben im Simulator einen Tipp ab und vergleichen danach das Ergebnis nach einer Saison.',
  'Fragen zum Gespräch: Wer kennt jemanden, der wettet? Wo begegnet Euch Wettwerbung – TikTok, Kiosk, Stadion?',
  'Thema «Spass oder schon Problem?»: die Skala im Abschnitt Fakten gemeinsam durchgehen.',
  'Für Vereine: Spielsucht und Schulden machen Spieler:innen anfällig für Spielmanipulation – ein Thema für jedes Team.',
]

export const multiplikatorenLinks: Angebot[] = [
  {
    name: 'SFV: Integrity in Football',
    url: 'https://www.football.ch/sfv/spirit-of-football/Good-Goverance/SPIELMANIPULATION.aspx',
    text: 'E-Learning des Schweizerischen Fussballverbands zu Spielmanipulation und Spielsucht.',
  },
  {
    name: 'Suchtprävention Aargau: «Das Glück steht auf dem Spiel»',
    url: 'https://suchtpraevention-aargau.ch/portfolio/das-glueck-steht-auf-dem-spiel/',
    text: 'Online-Workshop zu Geldspiel für Fachpersonen.',
  },
]
