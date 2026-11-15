# Gegen die Quote – Prototyp

Prototyp einer Webseite, die für Sportwetten und Spielsucht sensibilisiert (Institut IDEE, OST · Projekt 5.2400.049.02).
Die Seite ist ein **Einseiter**: Alles steht auf einer Seite und wird von oben nach unten gelesen.
Technik: Vue 3, Vite und TypeScript, ohne Backend. Es gibt keine Cookies und es werden keine Daten gespeichert.
Den ursprünglichen Auftrag beschreibt [`Prototyp_Sportwetten_Claude-Code-Brief.md`](Prototyp_Sportwetten_Claude-Code-Brief.md).

## Start und Build

```bash
npm install
npm run dev        # lokal entwickeln → http://localhost:5173
npm test           # Unit-Tests (Vitest) für die Simulationslogik
npm run calibrate  # Kalibrierung «100 Fans» ausgeben
npm run build      # erzeugt dist/index.html (eine einzige Datei, läuft offline)
```

Der aktuelle Build liegt im Repo unter `dist/index.html`. Die Datei lässt sich per Doppelklick
oder per Link aus PowerPoint öffnen und braucht weder Internet noch Server. Einzig das Video
auf der Hilfe-Seite wird von YouTube geladen, und zwar erst nach einem Klick.

## Aufbau der Seite

| Abschnitt | Anker | Inhalt |
|---|---|---|
| Start | `#start` | Hook, kurze Einleitung, «Die Rechnung» (CHF 100 → CHF 93.46) |
| Simulator | `#simulator` | Ein Tipp, dann eine ganze Saison (300 Wetten) im Zeitraffer, danach die Auflösung |
| 100 Fans | `#100-fans` | 100 Figuren spielen eine Saison, dazu ein Regler (50 / 300 / 1500 Wetten) und die UCSD-Studie |
| Hintergrund | `#hintergrund` | Artikel «Warum wir über Sportwetten reden müssen» und die Anbieter-Tricks zum Aufdecken |
| Fakten | `#fakten` | Fakten-Karten mit Quellen, Mythen vs. Fakten, Skala «Wo hört der Spass auf?» |
| Selbsttest | `#selbsttest` | 9 Fragen mit Auswertung als Ampel. Nichts wird gespeichert |
| Hilfe | `#hilfe` | Hilfsangebote, Spielsperre, Videos, Boxen für Eltern sowie für Trainer:innen und Lehrpersonen, Medien |

Eine fixe Navigation zeigt, wo man gerade ist, und ein Fortschrittsbalken zeigt, wie weit man gescrollt hat.
Der Knopf «Hilfe» ist immer sichtbar.

## Wo werden Texte, Zahlen und Parameter geändert?

Alle Inhalte stehen in `src/data/` und `src/config/`, nie direkt in den Komponenten:

| Datei | Inhalt |
|---|---|
| `src/config/simulation.ts` | Marge, Startguthaben, Einsatz, Anzahl Wetten pro Saison, 100-Fans-Parameter, Demo-Seed |
| `src/config/texts.ts` | Titel (inkl. Alternativen), Banner, Footer, Abschnitte und Navigation, Texte von Hero, Simulator und 100 Fans |
| `src/data/article.ts` | Hintergrund-Artikel (Absätze, Zitat, Verweise auf Quellen) |
| `src/data/facts.ts` | Fakten-Karten (Wert, Text, Quelle, URL, Stand), Kernkennzahl «4 von 100», Mythen, Warnsignale |
| `src/data/tricks.ts` | Anbieter-Tricks und was dahinter steckt |
| `src/data/selftest.ts` | Fragen, Antwortoptionen, Schwellen, Texte und Tipps je Ampelstufe |
| `src/data/help.ts` | Hilfsangebote, Clip (YouTube-ID), Medienlinks, Tipps für Angehörige |
| `src/data/teams.ts` | Fiktive Teams und Liganame |
| `src/style.css` | Theme: alle Farben als Variablen oben in der Datei |

Nach einer Änderung `npm run build` ausführen.

## Mathematik (ehrlich, nicht manipuliert)

- Jede Partie hat «wahre» Wahrscheinlichkeiten: Heimsieg 30–60 %, Unentschieden 20–30 %, der Rest Auswärtssieg.
- Angebotene Quote = `1 / (p × (1 + Marge))`, auf 2 Stellen abgerundet. Die Default-Marge ist 7 %.
- Ausgelost wird mit den **wahren** Wahrscheinlichkeiten.
- Die Logik in `src/logic/` ist von der Oberfläche getrennt und mit Tests abgesichert (`src/logic/logic.test.ts`).

### Kalibrierung «100 Fans»

Jede Figur spielt Einzelwetten à CHF 10 mit zufälligen Tipps. Die Werte sind Mittel über 40 Durchläufe mit je 100 Fans:

| Wetten pro Person | Verlierer von 100 |
|---|---|
| 50 | ≈ 63 |
| 300 | ≈ 80 |
| 600 | ≈ 87 |
| 1000 | ≈ 92 |
| **1500 (Default)** | **≈ 96** |
| 2000 | ≈ 98 |

Zufällige Tipps haben im Schnitt hohe Quoten und streuen deshalb stark. Um auf die Grössenordnung
der UCSD-Studie (96 % verlieren) zu kommen, braucht es darum 1500 Wetten pro Person. Das sind
etwa 30 Wetten pro Woche während eines Jahres.

## Design-Entscheide (Überarbeitung vom 15.11.2026)

### 1. Kleiner Simulator statt Wett-Spiel

Der erste Prototyp war ein Spiel wie eine echte Wett-App: viele Spieltage, Kombiwetten, «All-in»,
ein Live-Ticker und Jubel bei einem Gewinn. Das birgt ein Risiko. In einem Experiment setzten Personen,
die zuerst in einem Übungsmodus mit erhöhten Gewinnen gespielt hatten, danach mit echtem Geld riskanter
([Frahn et al. 2015](https://read.qxmd.com/read/25023183/exposure-to-free-play-modes-in-simulated-online-gaming-increases-risk-taking-in-monetary-gambling)).
Bei Jugendlichen hängt simuliertes Glücksspiel mit späterem Glücksspiel um Geld zusammen
([Grosemans et al. 2024](https://cdspress.ca/wp-content/uploads/2024/07/Grosemans-et-al.pdf),
[MDPI 2022](https://www.mdpi.com/1660-4601/19/17/10652)). Ob das eine das andere verursacht, ist allerdings noch offen.
Programme dagegen, die Wahrscheinlichkeiten und Denkfehler beim Spielen erklären, verringern solche
Denkfehler bei Jugendlichen nachweislich
([Donati et al. 2014](https://springerlink.bibliotecabuap.elogim.com/doi/10.1007/s10899-013-9398-1),
[Primi & Donati 2021](https://pmc.ncbi.nlm.nih.gov/articles/PMC7214490)).

Der Simulator ist deshalb jetzt ein **Experiment**:

- Man gibt einen einzigen Tipp mit festem Einsatz ab. Das Ergebnis wird nüchtern angezeigt.
- Danach sieht man sofort, wie viel Marge in der Quote steckte.
- Anschliessend läuft die ganze Saison im Zeitraffer.
- Es gibt keine Gewinnschleife, keine «All-in»-Wetten, keine Kombiwetten und keine Pop-ups.

Die Anbieter-Tricks (Bonus, Verluste zurückholen, Beinahe-Gewinn) sind neu Karten zum Aufdecken im Abschnitt «Hintergrund».

### 2. Einseiter statt Tabs

Nutzerinnen und Nutzer scrollen, wenn sie unten weitere nützliche Inhalte erwarten.
Die Aufmerksamkeit liegt aber oben: 57 % der Betrachtungszeit entfallen auf den sichtbaren Bereich
ohne Scrollen und 74 % auf die ersten zwei Bildschirmhöhen
([NN/g, Scrolling and Attention](https://www.nngroup.com/articles/scrolling-and-attention/)).
Versteckte Navigation wird deutlich seltener genutzt als sichtbare
([NN/g, Hamburger Menus](https://www.nngroup.com/articles/hamburger-menus/)).

Daraus folgt für die Seite:

- Es gibt eine einzige Geschichte von oben nach unten.
- Das Wichtigste kommt zuerst: Hook und Simulator.
- Die Navigation ist sichtbar und markiert den aktuellen Abschnitt.
- Der Knopf «Hilfe» ist immer da, weil der Hilfe-Abschnitt ganz unten am wenigsten gesehen wird.

### 3. Theme «Nachtspiel»

Das Theme ist dunkel und ruhig gestaltet, im Stil eines Magazins statt einer Wett-App, damit die Seite
keine Lust aufs Wetten macht. Dazu gehören:

- Flächen mit Glas-Effekt und weich treibende Farbverläufe im Hintergrund
- sanftes Scrollen und Inhalte, die beim Hineinscrollen weich erscheinen
- eine Diagrammlinie, die mit der Saison wächst

Wer «Bewegung reduzieren» im System eingestellt hat, bekommt alle Animationen abgeschaltet.
Die Farben stehen als Variablen oben in `src/style.css`.

## Umsetzung von Experteninterview und Vorrecherche

Grundlage sind das Interview mit einer Fachperson aus der Betreuung jugendlicher Asylsuchender
(Kanton AR) und die Excel-Liste mit Best-Practice-Beispielen.

| Hinweis aus Interview / Recherche | Umsetzung im Prototyp |
|---|---|
| In einer sicheren Umgebung testen, Verlust in den Fokus, Zahlen greifbar machen | Der Simulator zeigt neu «Dein Tipp trifft in rund X von 100 Spielen ein», dazu ein Punkteraster |
| Motiv «Sackgeld aufbessern» | Der Verlust wird umgerechnet, z. B. «7 Kinoeintritte oder 10 Döner» (Richtwerte in `src/config/texts.ts`) |
| Motiv «Challenge untereinander» | Knopf «Kollegen herausfordern» kopiert einen Text, der zum Simulator einlädt und nicht zum Wetten |
| Schwer zu merken, wann es kein harmloser Spass mehr ist | Neue Skala «Wo hört der Spass auf?» mit 4 Stufen im Abschnitt Fakten (`src/data/facts.ts`) |
| Wettwerbung begegnet ihnen über TikTok, Kioske (Bargeld) und Kollegen | Ergänzt im Artikel |
| Gutes Beispiel: Sperrlisten für Casinos | Karte «Spielsperre» im Abschnitt Hilfe |
| Selbsttest und Links zu Hilfsangeboten sind sinnvoll | War schon vorhanden und bleibt so |
| Video als digitale Form | Zwei Videos von Spielen ohne Sucht («Fanbegeisterung vs. Suchtgefahr», «Mit Sportwetten Geld verdienen?») plus der Kurzclip, alle laden erst nach Klick |
| Eltern haben das Thema nicht auf dem Radar | Box für Eltern mit Gesprächseinstiegen und dem Link check-dein-spiel.de |
| Über Trainer:innen und Vereine gehen | Box für Trainer:innen, Lehrpersonen und Betreuende mit 15-Minuten-Ablauf und Links (SFV, Suchtprävention Aargau) |
| SFV: Spielsucht und Schulden machen anfällig für Spielmanipulation | Artikel-Absatz «Wenn Du selber im Verein spielst» |

**Nicht im Prototyp umsetzbar, aber als Empfehlung fürs Projekt:**

- **Absender:** Ein bekannter Fussballer, am besten aus der Liga, oder die Trainerin bzw. der Trainer des
  eigenen Vereins. Idee: ein kurzes Video mit einer solchen Person in den Video-Bereich setzen
  (`src/data/help.ts`, Liste `clips`).
- **Kanäle:** TikTok, Berufsschulen, Stadion und Kioske.
- **Paradoxe Interventionen vor Ort**, etwa ein Plakat «Schlag den Wettanbieter» mit QR-Code auf den
  Simulator. Dafür braucht es zuerst eine gehostete URL.
- **Vereine** sollen das Thema selbst aufgreifen. Anknüpfen lässt sich an das SFV-E-Learning
  «Integrity in Football» und an die E-Learnings von Swiss Olympic (Cool and Clean).
- **Webinar oder Workshop** für Fachpersonen als Einstieg, angelehnt an Suchtprävention Aargau.
  Die Seite dient dabei als Material.
- Das Thema in **Kampagnen zur Medienkompetenz** einbauen.
- Die Fachperson ist bereit, einen Entwurf zu testen, und kann ein Gespräch mit einem Jugendlichen vermitteln.

## Demo-Modus für die Präsentation

Den Demo-Modus schaltet man auf eine dieser Arten ein:

- `index.html?demo=1#simulator`
- `index.html#demo`. Das funktioniert auch im Claude-Artifact.
- `index.html#/simulator?demo=1`, der alte Link aus dem ersten Prototyp.

Im Demo-Modus gilt:

- Der Zufalls-Seed ist fest, damit der Ablauf reproduzierbar ist.
- **Der erste Tipp gewinnt immer** (Dramaturgie). Die Saison danach wird ehrlich ausgelost. Mit dem ersten Tipp «1» gibt es +CHF 13, danach −CHF 142 nach 301 Wetten.
- «100 Fans» ergibt im ersten Durchlauf 96 von 100 Verlierern.
- Die Animationen sind kürzer.

## Links für die PowerPoint-Folien

Pfad zur Datei anpassen, z. B. `file:///C:/Praesentation/index.html`. Die alten Links mit `#/…` funktionieren weiterhin.

| Folie | Link |
|---|---|
| Titel / Start | `index.html` |
| Live-Demo Simulator | `index.html?demo=1#simulator` |
| 100 Fans | `index.html?demo=1#100-fans` |
| Hintergrund | `index.html#hintergrund` |
| Fakten | `index.html#fakten` |
| Selbsttest | `index.html#selbsttest` |
| Hilfe & Clip | `index.html#hilfe` |

## Qualität

- 11 Unit-Tests für die Rechenlogik. Sie prüfen:
  - dass die Marge in den Quoten steckt
  - dass der Verlust bei 100'000 Wetten pro Franken etwa der Marge entspricht
  - dass mit den Default-Werten 93–97 von 100 Fans verlieren
  - dass mit gleichem Seed das gleiche Ergebnis herauskommt
- Lighthouse: Accessibility 100 und Best Practices 100 (geprüft am 15.11.2026).
- Getestet auf 375 px Breite und auf 1920×1080, offline über `file://`, ohne Fehler in der Browser-Konsole.

## Offene Punkte

- **Quelle Fachleute:** Der Satz im Artikel, dass Fachleute aus der Ostschweiz Sportwetten als eine
  der grössten Herausforderungen sehen, stammt aus dem Brief. Hier eine zitierbare Quelle ergänzen,
  z. B. die Schlüsselpersonenbefragung (`src/data/article.ts`).
- **Links prüfen:** Für `game-changer.ch` habe ich `https://www.game-changer.ch` angenommen.
  Der Link zur heute-show (ZDF, 21.8.2026) zeigt nur auf die Sendungsseite, weil die genaue
  Beitrags-URL fehlt (`src/data/help.ts`).
- **Videos:** Die Nutzungsrechte vor einer Veröffentlichung klären. Das betrifft vor allem den Kurzclip;
  die zwei Videos stammen von Spielen ohne Sucht.
- **Spielsperre:** Den Text (die Sperre gilt bei allen bewilligten Casinos und Online-Geldspielen)
  und den Link fachlich prüfen lassen (`src/data/help.ts`).
- **Skala «Wo hört der Spass auf?»** und die Gesprächstipps für Eltern und Trainer:innen sind eigene
  Formulierungen. Bitte fachlich gegenlesen.
- **Kernkennzahl:** «4 von 100» (UCSD) statt «jeder Hundertste». Bei Bedarf in `src/data/facts.ts` ändern.
- **Selbsttest-Schwellen** (Grün 0–3, Gelb 4–9, Rot ab 10) von Fachpersonen prüfen lassen.
- **Teamnamen** vor einer Veröffentlichung kurz prüfen, ob gleichnamige Amateurclubs existieren.
- **Mit der Zielgruppe testen:** ob der Einseiter durchgescrollt wird und ob der Simulator Lust aufs Wetten macht.
