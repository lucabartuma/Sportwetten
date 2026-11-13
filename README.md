# Gegen die Quote – Prototyp

Klickbarer Web-Prototyp zur Sensibilisierung für Sportwetten und Spielsucht
(Institut IDEE, OST · Projekt 5.2400.049.02). Vue 3 + Vite + TypeScript, ohne Backend,
keine Cookies, keine Datenspeicherung. Den Auftrag beschreibt
[`Prototyp_Sportwetten_Claude-Code-Brief.md`](Prototyp_Sportwetten_Claude-Code-Brief.md).

## Start und Build

```bash
npm install
npm run dev        # lokal entwickeln → http://localhost:5173
npm test           # Unit-Tests (Vitest) für die Simulationslogik
npm run calibrate  # Kalibrierung «100 Fans» ausgeben
npm run build      # erzeugt dist/index.html (eine einzige Datei, läuft offline)
```

Der aktuelle Build liegt bereits im Repo unter `dist/index.html`. Er kann per Doppelklick bzw. per Link aus PowerPoint geöffnet werden.
Es braucht weder Internet noch Server. Nur das Video auf der Hilfe-Seite lädt erst
nach einem Klick von YouTube.

## Wo werden Texte, Zahlen und Parameter geändert?

Alle Inhalte stehen in `src/data/` und `src/config/`, nie in den Templates:

| Datei | Inhalt |
|---|---|
| `src/config/simulation.ts` | Marge, Startguthaben, Einsätze, Zeitraffer, 100-Fans-Parameter, Demo-Seed |
| `src/config/texts.ts` | Titel (inkl. Alternativen), Banner, Footer, Navigation, Texte von Start, Simulator, Auflösung und 100 Fans |
| `src/data/facts.ts` | Fakten-Karten (Wert, Text, Quelle, URL, Stand), Kernkennzahl «4 von 100», Mythen, Warnsignale |
| `src/data/selftest.ts` | Fragen, Antwortoptionen, Schwellen, Texte und Tipps je Ampelstufe |
| `src/data/help.ts` | Hilfsangebote, Clip (YouTube-ID), Medienlinks, Tipps für Angehörige |
| `src/data/tricks.ts` | Pop-ups zu Anbieter-Tricks und ihre Auflösung |
| `src/data/teams.ts` | Fiktive Teams und Liganame |

Nach einer Änderung `npm run build` ausführen.

## Mathematik (ehrlich, nicht manipuliert)

- Jede Partie hat «wahre» Wahrscheinlichkeiten (Heim 30–60 %, Remis 20–30 %, Rest Auswärts).
- Angebotene Quote = `1 / (p × (1 + Marge))`, auf 2 Stellen abgerundet (Default-Marge 7 %).
- Ausgelost wird mit den **wahren** Wahrscheinlichkeiten. Bei Kombis multipliziert sich die Marge.
- Die Logik in `src/logic/` ist von der UI getrennt und mit Tests abgesichert (`src/logic/logic.test.ts`).

### Kalibrierung «100 Fans»

Jede Figur spielt Einzelwetten à CHF 10 mit zufälligen Tipps. Gemessen wurde das Mittel über 40 × 100 Fans:

| Wetten pro Person | Verlierer von 100 |
|---|---|
| 50 | ≈ 63 |
| 300 | ≈ 80 |
| 600 | ≈ 87 |
| 1000 | ≈ 92 |
| **1500 (Default)** | **≈ 96** |
| 2000 | ≈ 98 |

Zufällige Tipps erzielen im Schnitt hohe Quoten und streuen deshalb stark. Darum braucht es
mehr Wetten als die im Brief geschätzten 500–600, um die Grössenordnung der UCSD-Studie
(96 % verlieren) zu erreichen. 1500 Wetten entsprechen etwa 30 Wetten pro Woche während eines
Jahres. Auf der Seite lässt sich die Anzahl per Schieberegler zwischen 50, 300 und 1500 umstellen.

## Demo-Modus für die Präsentation

`?demo=1` an die URL hängen, z. B. `index.html#/simulator?demo=1`.

- Fester Zufalls-Seed: Der Ablauf ist reproduzierbar, sofern dieselben Tipps gewählt werden.
- **Am 1. Spieltag gewinnen die gewählten Tipps immer** (Dramaturgie). Ab Spieltag 2 wird ehrlich gelost.
- Die Spannungs-Animation ist kürzer.
- Die 100-Fans-Seite verwendet ebenfalls einen festen Seed (1. Durchlauf: 96 von 100 verlieren).
- Tastatur im Simulator: `→` weiter (Anpfiff / überspringen / nächster Spieltag), `Z` Zeitraffer, `R` Reset.
- Der Demo-Modus bleibt aktiv, bis die Seite neu geladen wird. Mit `?demo=0` wird er ausgeschaltet.

## Links für die PowerPoint-Folien

Pfad zur Datei anpassen, z. B. `file:///C:/Praesentation/index.html`. Wird der Prototyp
später gehostet, wird `index.html` durch die Hosting-URL ersetzt.

| Folie | Link |
|---|---|
| Titel / Start | `index.html#/` |
| Live-Demo Simulator | `index.html#/simulator?demo=1` |
| 100 Fans | `index.html#/100-fans?demo=1` |
| Selbsttest | `index.html#/selbsttest` |
| Fakten | `index.html#/fakten` |
| Hilfe & Clip | `index.html#/hilfe` |

## Qualität

- 11 Unit-Tests (Marge in Quoten, Verlust pro Franken ≈ Marge bei 100'000 Wetten,
  93–97 Verlierer bei den Default-Werten, Reproduzierbarkeit mit Seed, Wettauswertung).
- Lighthouse Accessibility: 100 auf allen sechs Seiten (geprüft am 13.11.2026).
- Getestet auf 375 px Breite und 1920×1080, offline über `file://` ohne Konsolenfehler.

## Offene Punkte

- **Links prüfen**: Für `game-changer.ch` habe ich `https://www.game-changer.ch` angenommen.
  Der Link zur heute-show (ZDF, 21.8.2026) zeigt vorerst nur auf die Sendungsseite, weil die
  genaue Beitrags-URL fehlt. Beides in `src/data/help.ts` anpassen.
- **Kurzclip**: Die Nutzungsrechte für das YouTube-Short müssen vor einer Veröffentlichung geklärt werden.
- **Kernkennzahl**: «4 von 100» (UCSD) statt «jeder Hundertste». Bei Bedarf in `src/data/facts.ts` anpassen.
- **Unterlagen von Alessio** (Excel mit ähnlichen Angeboten, Interview-Notizen) sind noch nicht
  eingearbeitet. Sie betreffen vor allem die Selbsttest-Fragen, die Tipps und die Hilfe-Seite.
- **Selbsttest-Schwellen** (Grün 0–3, Gelb 4–9, Rot ab 10; Loss Chasing oder Geld leihen
  ergeben mindestens Gelb) sind eine eigene Setzung und sollten von Fachpersonen geprüft werden.
- **Teamnamen**: bewusst als Fantasienamen gewählt. Vor einer Veröffentlichung kurz prüfen,
  dass keine Amateurclubs gleich heissen.
- Nicht umgesetzt (Nice-to-have): Sound-Effekte.
