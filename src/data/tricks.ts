/**
 * Typische Anbieter-Tricks: erscheinen als Pop-up im Simulator und werden
 * danach in einer Infobox aufgelöst.
 */
export type TrickId = 'bonus' | 'lossChasing' | 'knapp'

export interface Trick {
  id: TrickId
  popupTitel: string
  popupText: string
  popupButton: string
  aufloesungTitel: string
  aufloesung: string
}

export const tricks: Record<TrickId, Trick> = {
  bonus: {
    id: 'bonus',
    popupTitel: '🎁 100 % Bonus!',
    popupText: 'Auf Deine erste Einzahlung. Verdopple jetzt Dein Guthaben!',
    popupButton: 'Bonus sichern',
    aufloesungTitel: 'Was ist hier gerade passiert?',
    aufloesung:
      'Willkommensboni sind an Umsatzbedingungen geknüpft: Du musst den Bonus oft 5- bis 10-fach verwetten, bevor Du ihn auszahlen kannst. Ziel ist, dass Du länger spielst – und dabei die Marge mehrfach bezahlst.',
  },
  lossChasing: {
    id: 'lossChasing',
    popupTitel: '🔥 Hol’s Dir zurück!',
    popupText: 'Quoten-Boost nur für die nächsten 10 Minuten. Jetzt nicht aufgeben!',
    popupButton: 'Boost aktivieren',
    aufloesungTitel: 'Was ist hier gerade passiert?',
    aufloesung:
      'Das nennt man «Verlusten hinterherjagen» (Loss Chasing). Wer versucht, Verluste mit weiteren Wetten zurückzuholen, verliert meist noch mehr. Es ist eines der wichtigsten Warnsignale für Spielsucht.',
  },
  knapp: {
    id: 'knapp',
    popupTitel: '😱 So knapp!',
    popupText: 'Nur ein Tipp hat gefehlt! Beim nächsten Mal klappt’s bestimmt.',
    popupButton: 'Nochmals versuchen',
    aufloesungTitel: 'Was ist hier gerade passiert?',
    aufloesung:
      'Beinahe-Gewinne fühlen sich wie Erfolg an und motivieren zum Weiterspielen – obwohl sie ganz normale Verluste sind. Bei einer Kombi ist «knapp daneben» übrigens der häufigste Fall.',
  },
}
