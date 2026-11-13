# Projekt-Brief für Claude Code: Prototyp «Gegen die Quote»

> Sensibilisierungsplattform zu Sportwetten und Spielsucht
> Institut IDEE, OST – Ostschweizer Fachhochschule · Projekt 5.2400.049.02 «Schlüsselpersonenbefragung IKS Geldspiel»
> Verantwortlich: Luca Bartuma · Präsentation: Montag, 16.11.2026, 09:00 · Aufwand: ca. 4 Stunden

---

## 1. Ziel und Kontext

Baue einen **klickbaren Web-Prototyp**, der junge Menschen (Kernzielgruppe: junge Männer 15–25 Jahre in der Schweiz) für die Risiken von Sportwetten sensibilisiert. Der Prototyp wird in einem Meeting **aus einer PowerPoint heraus** vorgestellt (Link auf der Folie → Browser öffnet den Prototyp).

Die Kernidee: **Selber erleben statt belehrt werden.**
Wer den Simulator spielt, verliert fast immer, und zwar nicht, weil der Simulator manipuliert ist, sondern weil die Quoten mathematisch zugunsten des Anbieters berechnet sind. Danach folgt die Auflösung: «Nicht Pech, sondern Mathematik. Nur rund 4 von 100 machen langfristig Gewinn.»

Ergänzend gibt es kurze Fakten, einen Selbsttest und Links zu bestehenden Hilfsangeboten.

### Hintergrund (für Tonalität und Inhalt)
- Sportwetten gelten laut Präventionsfachleuten in der Ostschweiz aktuell als grösste Herausforderung in der Spielsuchtprävention.
- Werbung zielt gezielt auf junge Männer (Social Media, während Spielen) und suggeriert, dass Fussballwissen zu Gewinnen führt.
- In der Schweiz sind Sportwetten legal nur bei Sporttip (Swisslos) und Jouez Sport (Loterie Romande) ab 18 Jahren erlaubt. Ausländische Anbieter sind per VPN leicht erreichbar, haben aber meist keinen Spielerschutz.

---

## 2. Technische Vorgaben

| Thema | Vorgabe |
|---|---|
| Framework | **Vue 3** (Composition API, `<script setup>`) + **Vite** + **TypeScript** |
| Styling | Tailwind CSS (oder schlankes eigenes CSS, wenn schneller) |
| Routing | Vue Router mit **Hash-Modus** (`/#/simulator`), damit jede Seite einen direkten Link hat und der Build ohne Server funktioniert |
| Charts | Leichte Lösung, z. B. Chart.js über `vue-chartjs` oder ein eigenes SVG-Liniendiagramm |
| Build | Zusätzlich `vite-plugin-singlefile`, damit `npm run build` eine **einzelne `index.html`** erzeugt, die offline per Doppelklick bzw. per Link aus PowerPoint läuft (wichtig: kein WLAN-Risiko bei der Präsentation) |
| Backend | **Keines.** Alles läuft im Browser, keine Datenspeicherung, keine Cookies, kein Tracking |
| Responsiveness | **Mobile-first** (Zielgruppe nutzt das Handy), muss aber auch auf Beamer/Desktop in 1920×1080 gut aussehen |
| Sprache | Deutsch (Schweizer Rechtschreibung: «ss» statt «ß»), Du-Form, jugendgerecht, **nicht moralisierend** |
| Barrierefreiheit | Gute Kontraste, Tastaturbedienung, sinnvolle `aria`-Labels, Farbe nie als einzige Information (rot/grün immer mit Text oder Icon) |

### Projektstruktur (Vorschlag)
```
src/
  config/simulation.ts      ← alle Parameter (Marge, Startguthaben, Anzahl Wetten …)
  data/facts.ts             ← alle Zahlen mit Quelle + URL (einfach änderbar)
  data/teams.ts             ← fiktive Teams
  data/selftest.ts          ← Fragen + Auswertungslogik
  data/help.ts              ← Hilfsangebote + Links
  logic/odds.ts             ← Quotenberechnung mit Marge
  logic/simulate.ts         ← Spielausgänge, Saison-Simulation, 100-Fans-Simulation
  views/ StartView, SimulatorView, HundertFansView, SelbsttestView, FaktenView, HilfeView
  components/ …
```
Die Simulationslogik muss **getrennt von der UI** und mit **Unit-Tests (Vitest)** abgesichert sein (siehe Abschnitt 8).

---

## 3. Design und Look

- **Look & Feel einer Wett-App**: dunkler Hintergrund, kräftige Akzentfarbe (z. B. Neongrün), Quoten-Buttons, Live-Gefühl. So erkennt die Zielgruppe die Situation wieder.
- **Aber eindeutig als Prävention erkennbar**: Ein permanentes Banner/Badge «Spielgeld – Präventionsprojekt der OST» oben auf jeder Seite.
- **Keine echten Marken**: keine echten Wettanbieter-Logos, Vereinsnamen, Ligen-Logos oder Spielernamen. Alle Teams und die Liga sind **frei erfunden** und klar als Fantasienamen erkennbar (z. B. «FC Nebelstadt», «Atlético Bergtal», «Dynamo Schoggi», «Sporting Rösti», «Racing Föhntal», «Olympique Murmeli»; vor Verwendung kurz prüfen, dass es keine echten Clubs sind).
- Ein Arbeitstitel ist gesetzt: **«Gegen die Quote»**. Alternativen in der Config hinterlegen: «Volle Quote, leere Taschen», «Nachspielzeit».
- Footer auf jeder Seite: «Prototyp · Institut IDEE, OST · Projekt 5.2400.049.02 · Kein echtes Geld, keine Datenspeicherung.»

---

## 4. Seiten und Funktionen

### 4.1 Startseite (`/#/`)
- Hook-Headline, z. B.: **«Du kennst Dich im Fussball aus? Dann schlag den Wettanbieter.»**
- Subline: «Mit 100 Spiel-Franken. Ohne Risiko. Wir sind gespannt.»
- Grosser CTA-Button «Jetzt wetten» → Simulator.
- Darunter drei Kacheln: «100 Fans – wer gewinnt?», «Selbsttest», «Fakten & Hilfe».
- Bewusst **nicht** sofort aufklären. Die Auflösung kommt erst nach dem Spielen (Überraschungseffekt).

### 4.2 Wett-Simulator (`/#/simulator`) – **Kernstück**

**Ablauf:**
1. Start mit **100 Spiel-Franken** (CHF, konfigurierbar).
2. Pro Runde wird ein **Spieltag mit 5 fiktiven Partien** angezeigt, mit Quoten für **1 / X / 2**.
3. Nutzer:in wählt Tipps und Einsatz (Schnellwahl 5 / 10 / 20 / «All-in»).
   - **Einzelwette** oder **Kombiwette** (mehrere Tipps verknüpft, Quoten werden multipliziert).
4. Button «Anpfiff!» → kurze Spannungs-Animation (Ticker, Minutenanzeige, ca. 2–3 Sekunden, überspringbar) → Ergebnis.
5. Guthaben wird aktualisiert, ein **Liniendiagramm** zeigt den Guthabenverlauf.
6. Nächster Spieltag. Weiter bis Guthaben = 0 oder bis die Person auf «Auflösung» klickt.

**Mathematik (ehrlich, nicht manipuliert – wichtig!):**
- Jede Partie hat **«wahre» Wahrscheinlichkeiten** (zufällig, aber plausibel generiert, z. B. Heimsieg 30–60 %, Unentschieden 20–30 %, Rest Auswärtssieg).
- Die angezeigte Quote enthält eine **Marge** (Default **7 %**, konfigurierbar):
  `quote = 1 / (wahreWahrscheinlichkeit × (1 + marge))`, auf 2 Nachkommastellen abgerundet.
- Das Ergebnis wird mit den **wahren** Wahrscheinlichkeiten ausgelost (`Math.random()` bzw. seedbarer PRNG für Tests).
- Bei Kombiwetten wirkt die Marge pro Tipp, sie **multipliziert sich** also (3er-Kombi ≈ 20 % Nachteil). Das ist ein wichtiger Lerneffekt, weil Kombis bei Jungen beliebt sind.
- Kurzfristig kann man also gewinnen (das macht es spannend und realistisch), langfristig verliert man fast sicher.

**Button «Zeitraffer: Spiel eine ganze Saison»:**
- Simuliert automatisch z. B. **300 Wetten** mit dem durchschnittlichen Einsatz der Person (bzw. CHF 10, wenn noch nicht gespielt), mit Nachladen von Guthaben, falls 0 erreicht wird («Du hast nochmals 100 Franken eingezahlt» → Zähler «Einzahlungen total»).
- Das Diagramm animiert den Verlauf. Am Ende steht: Total eingesetzt, total ausbezahlt, Nettoverlust.

**Typische Tricks der Anbieter (Pop-ups, um sie zu entlarven):**
Diese Elemente tauchen im Simulator auf und werden **danach jeweils in einer Infobox aufgelöst** («Was ist hier gerade passiert?»):
- **Willkommensbonus**: «100 % Bonus auf Deine erste Einzahlung!» → Auflösung: Umsatzbedingungen, Bonus muss x-fach umgesetzt werden, bevor man ihn auszahlen kann.
- **Nach einem Verlust**: «Hol's Dir zurück! Quoten-Boost nur für die nächsten 10 Minuten» → Auflösung: Das nennt man *Verlusten hinterherjagen* (Loss Chasing), eines der wichtigsten Warnsignale.
- **Knapp daneben**: Wenn eine Kombi nur an einem Tipp scheitert: «So knapp! Nur ein Tipp hat gefehlt!» → Auflösung: *Beinahe-Gewinne* fühlen sich wie Erfolg an und motivieren zum Weiterspielen, obwohl sie Verluste sind.
- Pop-ups sind wegklickbar und nicht zu häufig (max. 1 pro 3 Runden).

**Auflösungs-Screen** (bei Guthaben 0, nach dem Zeitraffer oder per Button):
- Grosse Zahl: «Du hast **CHF X** verloren.» (bzw. «Du bist CHF X im Plus – noch.» falls zufällig im Gewinn, mit Hinweis «Spiel den Zeitraffer und schau, was nach einer Saison übrig bleibt.»)
- Kernbotschaft: **«Das war kein Pech. Das war Mathematik.»**
- Kurze Erklärung der Marge mit Beispiel aus dem eigenen Spiel: «Bei Partie FC Nebelstadt – Atlético Bergtal lag die faire Quote bei 2.10, angeboten wurden 1.95.»
- Visual: **«Von 100 Wettenden machen langfristig nur rund 4 Gewinn.»** → Button «Sieh's Dir an» → 100-Fans-Seite.
- Buttons: «Nochmals spielen», «Selbsttest machen», «Hilfe & Infos».

### 4.3 «100 Fans» (`/#/100-fans`) – Visualisierung «Nur jeder 25. gewinnt»
- Raster mit **100 Figuren-Icons** (10×10), alle grau.
- Button «Saison starten» → Für jede Figur wird mit der gleichen Logik wie im Zeitraffer eine Saison simuliert (gleiche Marge, zufällige Tipps, z. B. 300 Wetten à CHF 10).
- Figuren färben sich nacheinander animiert: **rot mit Minus-Icon = Verlust**, **grün mit Plus-Icon = Gewinn**.
- Zähler: «**X von 100** haben Geld verloren.»
- Darunter die Studien-Einordnung: «In einer Studie der University of California San Diego mit über 700'000 Online-Spielenden verloren 96 % Geld, **nur 4 % machten Gewinn** (2019–2023).»
- Die Parameter (Anzahl Wetten, Marge) sind in `config/simulation.ts` so voreingestellt, dass das Resultat **realistisch in der Grössenordnung der Studie** liegt (bei 7 % Marge und ca. 500–600 Einzelwetten pro Person verlieren rechnerisch etwa 95 %). Bitte per Test/Simulation kalibrieren und den Default dokumentieren.
- Optional (Nice-to-have): Schieberegler «Anzahl Wetten pro Saison» (50 / 300 / 1000), um zu zeigen: **Je länger man spielt, desto sicherer verliert man.**

> Hinweis: Im Meeting fiel die Formulierung «Jeder Hundertste gewinnt». Die Kennzahl ist deshalb **nicht hart codiert**, sondern kommt aus `data/facts.ts` und lässt sich leicht anpassen, falls Alessio/Corinne eine andere Quelle bevorzugen.

### 4.4 Selbsttest (`/#/selbsttest`)
- **8–10 kurze Fragen**, eine pro Screen, mit Fortschrittsbalken. Antwortoptionen: «Nie» / «Manchmal» / «Oft» / «Fast immer» (0–3 Punkte).
- Eigene, einfach formulierte Fragen auf Basis bekannter Warnsignale (keinen standardisierten Fragebogen 1:1 übernehmen), z. B.:
  1. Wettest Du mit mehr Geld, als Du Dir leisten kannst zu verlieren?
  2. Versuchst Du, verlorenes Geld mit weiteren Wetten zurückzuholen?
  3. Hast Du Dir schon Geld geliehen, um zu wetten?
  4. Hast Du Familie oder Freunde angelogen, wie viel Du wettest?
  5. Denkst Du auch während Schule, Arbeit oder mit Freunden ans Wetten?
  6. Schaust Du Spiele nur noch wegen Deiner Wetten?
  7. Hast Du schon versucht weniger zu wetten und es nicht geschafft?
  8. Fühlst Du Dich gestresst, gereizt oder schuldig wegen des Wettens?
  9. Hat Dich schon jemand auf Dein Wettverhalten angesprochen?
- **Auswertung in drei Stufen** (Ampel, immer mit Text und Icon):
  - **Grün** – «Aktuell kein auffälliges Muster. Bleib aufmerksam.»
  - **Gelb** – «Einige Warnsignale. Es lohnt sich, genauer hinzuschauen.» + Tipps
  - **Rot** – «Mehrere deutliche Warnsignale. Hol Dir Unterstützung, das ist kein Zeichen von Schwäche.» + direkte Hilfe-Links prominent
- Sofort-Tipps je nach Stufe (aus dem Interview-Kontext): Zugang zu Geld begrenzen (z. B. Bankkarte einer Vertrauensperson geben), Handypause, mit jemandem sprechen, offiziellen Selbsttest machen.
- **Pflicht-Hinweis**: «Dieser Kurztest ist keine Diagnose. Einen fundierten Selbsttest und Beratung findest Du bei spielen-ohne-sucht.ch.»
- Antworten werden **nicht gespeichert und nicht übermittelt** (auch so kommunizieren).

### 4.5 Fakten (`/#/fakten`)
Kurze, visuelle **Fakten-Karten** (grosse Zahl + ein Satz + Quelle als Link), danach ein Block «Mythen vs. Fakten».

**Fakten-Karten** (Inhalte in `data/facts.ts`; jede Karte mit `wert`, `text`, `quelle`, `url`, `stand`):

| Zahl | Aussage | Quelle |
|---|---|---|
| ~10 % | der Männer zwischen 15 und 24 Jahren in der Schweiz zeigen ein problematisches Spielverhalten, rund 40'000 Personen | Schweizerische Gesundheitsbefragung 2022, zitiert in SRF (Kampagne «Game Changer») – https://www.srf.ch/news/dialog/hockey-und-fussball-game-changer-kampagne-warnt-vor-risiken-von-sportwetten |
| +40 % | mehr Online-Wettende in der Schweiz innerhalb von zehn Jahren | SRF, ebd. |
| 4,3 % | der Bevölkerung ab 15 Jahren in der Schweiz zeigen ein problematisches Geldspielverhalten | stgallen24 / Keystone-SDA, 9.7.2026 – https://stgallen24.ch/articles/392815-wenn-fussball-zur-falle-wird |
| 96 % | von über 700'000 Online-Spielenden verloren über fünf Jahre Geld, nur 4 % machten Gewinn | UC San Diego, Rady School of Management, 2025 (USA; Sportwetten, Online-Casino und Fantasy Sports zusammen) – https://gamblingharm.org/most-online-gamblers-lose-study/ |
| 18,8 % | der 18- bis 29-jährigen Online-Geldspielenden in der Schweiz zeigen ein mässiges oder problematisches Risikoprofil | Sucht Schweiz / GREA, Studie eGames 2021/22 – https://www.sos-spielsucht.ch/media/files/2023/02/Factsheet_eGames_Problematisch_20230214_D.pdf |
| ~6 % | Marge steckt typischerweise in einer Fussballwette (Quoten ergeben zusammen ca. 106 %) | Branchenbeispiel Altenar – https://altenar.com/de/blog/house-edge-in-sports-betting-how-the-best-sportsbooks-manage-their-edge/ |

**Mythen vs. Fakten** (Klappkarten, Vorderseite Mythos → Rückseite Fakt):
- «Wer viel über Fussball weiss, gewinnt.» → Die Marge steckt in jeder Quote. Wissen ändert daran nichts. Anbieter haben mehr Daten als jeder Fan.
- «Ich hole mir das Verlorene zurück.» → Verlusten hinterherjagen ist eines der wichtigsten Warnsignale für Spielsucht.
- «Kombiwetten bringen mehr.» → Die Marge multipliziert sich mit jedem Tipp, der Nachteil wird grösser.
- «Bonus = Gratisgeld.» → Boni sind an Umsatzbedingungen geknüpft und sollen Dich länger spielen lassen.
- «Ausländische Apps haben bessere Quoten.» → Sie sind in der Schweiz nicht bewilligt, haben meist keinen Spielerschutz und keine Beschwerdestelle, Gewinne können gefährdet sein.

**Abschnitt «Warnsignale»**: das Gefühl, zu viel zu spielen; grosse Verluste; Familie oder Freunde anlügen; Geld leihen, um zu wetten.

### 4.6 Hilfe & Kurzclip (`/#/hilfe`)
- Einstiegssatz: **«Spielsucht ist eine anerkannte Krankheit und lässt sich behandeln.»**
- Karten zu bestehenden Angeboten (Inhalte in `data/help.ts`, alle Links in neuem Tab):
  - **spielen-ohne-sucht.ch** – Beratungsstellen in der Ostschweiz, Selbsttests, Hotlines, Online-Beratung; auch für Angehörige und Eltern
  - **game-changer.ch** – Kampagne der Kantone zu Sportwetten
  - **sos-spielsucht.ch** – Informationen und Beratung
  - **buendnis-gegen-sportwettenwerbung.de/infomaterialien** – Infomaterial zu Sportwettenwerbung (Deutschland)
- **Kurzclip-Bereich**: Platzhalter-Komponente `VideoEmbed` (16:9 bzw. 9:16 für Shorts). Vorerst einbinden: YouTube-Short https://www.youtube.com/shorts/CkTk0ZCu8GU via `youtube-nocookie.com/embed/CkTk0ZCu8GU` mit **Klick-zum-Laden** (erst nach Klick wird das Video geladen, wegen Datenschutz und Offline-Präsentation). Wenn offline: Fallback-Bild mit Text «Video ansehen» + Link. *(Nutzungsrechte vor einer Veröffentlichung klären.)*
- Zusätzlich ein Link-Hinweis auf den Beitrag der heute-show vom 21.8.2026 (ZDF) und den Artikel von stgallen24.
- Tipps für Angehörige und Eltern: sich beraten lassen, im Gespräch bleiben, sich informieren.

---

## 5. Präsentationsmodus (für die PowerPoint)

- Jede Seite hat eine **direkte URL** (Hash-Route), damit auf jeder Folie ein passender Link hinterlegt werden kann.
- **Query-Parameter `?demo=1`**: aktiviert einen Demo-Modus mit **festem Zufalls-Seed**, sodass der Ablauf bei der Präsentation reproduzierbar ist (z. B. erste Wette gewinnt, danach verliert man → dramaturgisch ideal) und die Spannungs-Animation kürzer ist.
- Tastaturkürzel im Demo-Modus: `→` nächster Spieltag, `Z` Zeitraffer, `R` Reset.
- Ein **Reset-Button** ist immer erreichbar.
- Single-File-Build (`dist/index.html`) muss offline aus dem Dateisystem funktionieren (ohne CDN-Abhängigkeiten, Fonts lokal einbinden oder System-Fonts nutzen).

---

## 6. Prioritäten (Zeitbudget ca. 4 Stunden)

**Muss (MVP für Montag):**
1. Startseite
2. Simulator inkl. ehrlicher Quotenlogik, Guthabenverlauf, Auflösungs-Screen
3. 100-Fans-Visualisierung
4. Selbsttest
5. Hilfe-Seite mit Links und Clip-Platzhalter
6. Single-File-Build + Demo-Modus

**Soll:**
7. Fakten-Seite mit Mythen vs. Fakten
8. Pop-ups zu den Anbieter-Tricks (Bonus, Loss Chasing, Beinahe-Gewinn)
9. Zeitraffer «ganze Saison»

**Kann (Nice-to-have):**
10. Schieberegler auf der 100-Fans-Seite
11. Kleine Sound-Effekte (standardmässig aus)
12. Teilen-Funktion für das Ergebnis («Ich habe in einer Saison CHF 340 verloren – schaffst Du's besser?»)

---

## 7. Inhalte, die noch ergänzt werden

Folgende Unterlagen von Alessio sind noch nicht eingearbeitet und sollen später einfliessen:
- **Excel mit Beispielen ähnlicher Angebote** → ggf. Ideen für zusätzliche Elemente oder Links auf der Hilfe-Seite.
- **Word mit Interview-Notizen (Fachperson Jugendbetreuung)** → Tonalität, Fragen im Selbsttest und Tipps anpassen.

Deshalb gilt: **Alle Texte, Zahlen, Links und Fragen ausschliesslich in den Dateien unter `src/data/` und `src/config/` pflegen**, nie hart im Template, damit sie ohne Code-Kenntnisse angepasst werden können.

---

## 8. Qualität und Abnahmekriterien

- [ ] `npm run dev` startet lokal ohne Fehler, `npm run build` erzeugt eine lauffähige Single-File-`index.html`, die offline per Doppelklick funktioniert.
- [ ] **Vitest-Tests** für `logic/`:
  - Quoten enthalten die konfigurierte Marge (Summe der Kehrwerte ≈ 1 + Marge).
  - Bei 100'000 simulierten Einzelwetten liegt der durchschnittliche Verlust pro Franken nahe an der theoretischen Marge.
  - Die 100-Fans-Simulation ergibt mit den Default-Werten im Mittel ca. 93–97 Verlierer (Kalibrierung dokumentieren).
  - Mit gleichem Seed sind Ergebnisse reproduzierbar.
- [ ] Keine echten Marken, Vereine, Logos oder Personen.
- [ ] Banner «Spielgeld – Präventionsprojekt» auf jeder Seite sichtbar.
- [ ] Jede Zahl auf der Plattform hat eine sichtbare Quelle mit Link.
- [ ] Selbsttest zeigt den Hinweis «keine Diagnose» und speichert nichts.
- [ ] Läuft sauber auf Handy-Breite (375 px) und auf 1920×1080.
- [ ] Lighthouse Accessibility ≥ 90.
- [ ] Kurzes `README.md` mit: Start, Build, wo Texte/Zahlen/Parameter geändert werden, Demo-Modus, Links für die PowerPoint-Folien.

---

## 9. Vorgehen für Claude Code

1. Projekt mit Vite (Vue + TS) aufsetzen, Tailwind, Router (Hash), Vitest, `vite-plugin-singlefile` einrichten.
2. Zuerst `logic/` + Tests schreiben und die Default-Parameter kalibrieren (Abschnitt 4.3).
3. Danach die Seiten in der Reihenfolge der Prioritäten (Abschnitt 6) umsetzen.
4. Nach jedem grösseren Schritt kurz `npm run build` prüfen.
5. Zum Schluss README schreiben und eine Liste der direkten Links für die PowerPoint ausgeben.

Bei Unklarheiten: lieber eine einfache, funktionierende Lösung bauen und die offene Frage im README unter «Offene Punkte» notieren, statt zu blockieren.

---

## Anhang: Vorschlag für die PowerPoint (5–7 Folien)

1. **Titel**: «Gegen die Quote» – Prototyp Sensibilisierung Sportwetten · Projekt 5.2400.049.02
2. **Ausgangslage**: Zahlen (10 % der jungen Männer, +40 % Online-Wettende), Zielgruppe, Werbung
3. **Idee**: «Selber erleben statt belehrt werden» – Simulator → Auflösung → Hilfe
4. **Live-Demo**: Link auf `/#/simulator?demo=1`
5. **100 Fans**: Link auf `/#/100-fans` – «Nur rund 4 von 100 gewinnen»
6. **Selbsttest & Hilfe**: Screenshots + Links zu bestehenden Angeboten
7. **Nächste Schritte / offene Fragen**: Einbezug Interview-Erkenntnisse, Kurzclip, Testing mit der Zielgruppe, Hosting
