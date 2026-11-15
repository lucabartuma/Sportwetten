<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import LineChart from '../components/LineChart.vue'
import { simulationConfig as cfg } from '../config/simulation'
import { simulatorTexte as T, vergleiche } from '../config/texts'
import { ligaName, teams } from '../data/teams'
import { demoAktiv } from '../composables/demo'
import { chf, quote } from '../composables/format'
import { scrolleZu } from '../composables/navigation'
import { AUSGAENGE, type Ausgang } from '../logic/odds'
import { type Rng, createRng, defaultRng } from '../logic/random'
import { type Partie, type SaisonErgebnis, erzeugeSpieltag, round2, simuliereSaison, spieleSpieltag } from '../logic/simulate'

type Phase = 'tipp' | 'ergebnis' | 'saison' | 'fertig'

const einsatz = cfg.zeitraffer.standardEinsatz
const anzahlSaison = cfg.zeitraffer.anzahlWetten
const labels: Record<Ausgang, string> = { '1': 'Heimsieg', X: 'Unentschieden', '2': 'Auswärtssieg' }
const kurz: Record<Ausgang, string> = { '1': 'Heim', X: 'Remis', '2': 'Auswärts' }

let rng: Rng = defaultRng
let runde = 0
const phase = ref<Phase>('tipp')
const partie = ref<Partie>(neuePartie())
const tipp = ref<Ausgang | null>(null)
const saison = ref<SaisonErgebnis | null>(null)
const idx = ref(0)
let raf = 0

function neuePartie(): Partie {
  if (runde === 0 && demoAktiv.value) rng = createRng(cfg.demoSeed)
  return erzeugeSpieltag(rng, teams, 1, cfg.marge)[0]
}

const auszahlung = computed(() => {
  const p = partie.value
  if (!tipp.value || !p.ergebnis) return 0
  return p.ergebnis === tipp.value ? round2(einsatz * p.quoten[tipp.value]) : 0
})
const richtig = computed(() => auszahlung.value > 0)
const guthabenNachTipp = computed(() => round2(cfg.startguthaben - einsatz + auszahlung.value))
/** Rappen, die der Anbieter pro Franken im Schnitt behält (1 − Quote/fair) */
const rappen = computed(() => {
  if (!tipp.value) return '0'
  const a = tipp.value
  return ((1 - partie.value.quoten[a] / partie.value.fair[a]) * 100).toFixed(1)
})

/** «X von 100»: wahre Wahrscheinlichkeit des Tipps */
const vonHundert = computed(() => (tipp.value ? Math.round(partie.value.wahr[tipp.value] * 100) : 0))

/** Verlust in Alltagsbeträgen (nur ganze Stück, ab 1) */
const vergleichListe = computed(() => {
  const v = total.value ? -total.value.netto : 0
  if (v <= 0) return []
  return vergleiche
    .map((x) => ({ n: Math.floor(v / x.preis), x }))
    .filter((e) => e.n >= 1)
    .map((e) => `${e.n} ${e.n === 1 ? e.x.einzahl : e.x.mehrzahl}`)
})

const teilenStatus = ref('')
async function herausfordern() {
  const text = T.herausfordernText(chf(Math.max(0, -(total.value?.netto ?? 0)), 0))
  try {
    await navigator.clipboard.writeText(text)
    teilenStatus.value = T.kopiert
  } catch {
    teilenStatus.value = text
  }
}

function tippAbgeben() {
  if (!tipp.value) return
  // Demo-Modus: der allererste Tipp gewinnt (Dramaturgie), danach ehrlich.
  const erzwungen = demoAktiv.value && runde === 0 ? { [partie.value.id]: tipp.value } : {}
  partie.value = spieleSpieltag(rng, [partie.value], erzwungen)[0]
  runde++
  phase.value = 'ergebnis'
}

const verlauf = computed(() => {
  if (!saison.value) return [cfg.startguthaben, guthabenNachTipp.value]
  return [cfg.startguthaben, ...saison.value.verlauf]
})
const sichtbar = computed(() => verlauf.value.slice(0, Math.max(2, idx.value)))
// verlauf = [Start, ...saison.verlauf] → Index in saison.verlauf + 1
const nachzahlungenBisher = computed(
  () => saison.value?.nachzahlungBei.filter((i) => i + 1 < sichtbar.value.length).length ?? 0,
)
const eingezahlt = computed(() => cfg.startguthaben + nachzahlungenBisher.value * cfg.zeitraffer.nachzahlung)

const total = computed(() => {
  const s = saison.value
  if (!s) return null
  const eingesetzt = einsatz + s.eingesetzt
  const ausbezahlt = auszahlung.value + s.ausbezahlt
  return { eingesetzt, ausbezahlt, netto: round2(ausbezahlt - eingesetzt), einzahlungen: s.einzahlungen }
})

function saisonStarten() {
  saison.value = simuliereSaison({
    rng,
    anzahlWetten: anzahlSaison,
    einsatz,
    marge: cfg.marge,
    startguthaben: guthabenNachTipp.value,
    nachzahlung: cfg.zeitraffer.nachzahlung,
  })
  phase.value = 'saison'
  const n = verlauf.value.length
  const dauer = demoAktiv.value ? 2200 : 3600
  const start = performance.now()
  const step = (t: number) => {
    const p = Math.min(1, (t - start) / dauer)
    const eased = 1 - Math.pow(1 - p, 2)
    idx.value = Math.max(2, Math.round(eased * n))
    if (p < 1) raf = requestAnimationFrame(step)
    else fertig()
  }
  raf = requestAnimationFrame(step)
}
function fertig() {
  phase.value = 'fertig'
  // Auflösung sanft ins Bild holen (v. a. mobil liegt sie unterhalb)
  setTimeout(() => {
    const el = document.querySelector<HTMLElement>('#simulator .aufloesung')
    if (!el) return
    const r = el.getBoundingClientRect()
    if (r.bottom > window.innerHeight) {
      const reduziert = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
      el.scrollIntoView({ behavior: reduziert ? 'auto' : 'smooth', block: 'center' })
    }
  }, 120)
}
function saisonUeberspringen() {
  cancelAnimationFrame(raf)
  idx.value = verlauf.value.length
  fertig()
}

function neuerTipp() {
  cancelAnimationFrame(raf)
  saison.value = null
  idx.value = 0
  tipp.value = null
  teilenStatus.value = ''
  partie.value = neuePartie()
  phase.value = 'tipp'
}
onBeforeUnmount(() => cancelAnimationFrame(raf))
</script>

<template>
  <section id="simulator" class="section" aria-labelledby="sim-titel">
    <div class="wrap">
      <header class="section-head">
        <p class="kicker" v-reveal>{{ T.kicker }}</p>
        <h2 id="sim-titel" v-reveal="60">{{ T.titel }}</h2>
        <p v-reveal="120">{{ T.intro.replace('{einsatz}', String(einsatz)) }}</p>
      </header>

      <div class="sim-grid" v-reveal="160">
        <!-- Links: Partie und Tipp -->
        <div class="card match">
          <div class="match-top">
            <span class="pill">{{ ligaName }}</span>
            <span class="pill">Spielgeld · CHF {{ einsatz }}</span>
          </div>
          <div class="teams">
            <span class="team">{{ partie.heim }}</span>
            <span class="score" aria-live="polite">
              <Transition name="pop" mode="out-in">
                <span v-if="partie.tore" :key="'s' + partie.id" class="score-final">{{ partie.tore[0] }}<i>:</i>{{ partie.tore[1] }}</span>
                <span v-else key="vs" class="vs">vs</span>
              </Transition>
            </span>
            <span class="team gast">{{ partie.gast }}</span>
          </div>

          <p class="schritt">{{ T.schritt1 }}</p>
          <div class="odds" role="group" :aria-label="`Tipp für ${partie.heim} gegen ${partie.gast}`">
            <button
              v-for="a in AUSGAENGE"
              :key="a"
              class="odd"
              :class="{ gewaehlt: tipp === a, ausgang: partie.ergebnis === a }"
              :aria-pressed="tipp === a"
              :disabled="phase !== 'tipp'"
              @click="tipp = a"
            >
              <span class="odd-label">{{ a }}<span class="sr-only"> {{ labels[a] }}, Quote</span></span>
              <span class="odd-quote">{{ ' ' }}{{ quote(partie.quoten[a]) }}</span>
              <span class="odd-sub" aria-hidden="true">{{ kurz[a] }}</span>
            </button>
          </div>

          <Transition name="fade" mode="out-in">
            <div v-if="phase === 'tipp'" key="t" class="aktion">
              <button class="btn btn-primary btn-lg full" :disabled="!tipp" @click="tippAbgeben">
                {{ T.tippAbgeben }} <span class="arrow" aria-hidden="true">→</span>
              </button>
              <p v-if="!tipp" class="small muted hint">{{ T.keinTipp }}</p>
            </div>
            <div v-else key="e" class="aktion">
              <p class="resultat" :class="richtig ? 'win' : 'loss'" role="status">
                <span class="icon" aria-hidden="true">{{ richtig ? '✓' : '✗' }}</span>
                <span>
                  <strong>{{ richtig ? T.richtig : T.falsch }}</strong>
                  <span class="betrag">{{ richtig ? `+CHF ${chf(auszahlung - einsatz)}` : `−CHF ${chf(einsatz)}` }}</span>
                </span>
              </p>
              <div class="margen-box">
                <p class="label">{{ T.quoteTitel }}</p>
                <p class="small"><strong>{{ T.wahrscheinlichkeit(vonHundert) }}</strong></p>
                <div class="hundert" role="img" :aria-label="`${vonHundert} von 100`">
                  <span v-for="i in 100" :key="i" :class="{ an: i <= vonHundert }"></span>
                </div>
                <p class="small">{{ T.quoteText(quote(partie.fair[tipp!]), quote(partie.quoten[tipp!]), rappen) }}</p>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Rechts: Saison -->
        <div class="card saison" :class="{ aktiv: phase !== 'tipp' }">
          <Transition name="fade" mode="out-in">
            <div v-if="phase === 'tipp' || phase === 'ergebnis'" key="vor" class="vorher">
              <p class="label">Schritt 2</p>
              <h3>{{ T.saisonTitel(anzahlSaison, einsatz) }}</h3>
              <p class="muted small">Eine Saison mit ca. 6 Wetten pro Woche. Ist das Guthaben weg, wird automatisch CHF {{ cfg.zeitraffer.nachzahlung }} nachgeladen – wie es viele tun.</p>
              <LineChart :werte="verlauf" :referenz="cfg.startguthaben" :label="T.verlaufLabel" :anzahl-gesamt="anzahlSaison + 2" :hoehe="200" />
              <button class="btn btn-primary full mt" :disabled="phase !== 'ergebnis'" @click="saisonStarten">
                {{ T.saisonButton }} <span class="arrow" aria-hidden="true">→</span>
              </button>
            </div>
            <div v-else key="nach">
              <div class="saison-head">
                <p class="label">{{ phase === 'saison' ? T.saisonLaeuft : T.saisonTitel(anzahlSaison, einsatz) }}</p>
                <span v-if="nachzahlungenBisher" class="pill warn">{{ T.nachgeladen(nachzahlungenBisher, cfg.zeitraffer.nachzahlung) }}</span>
              </div>
              <LineChart :werte="sichtbar" :referenz="eingezahlt" :label="T.verlaufLabel" :anzahl-gesamt="verlauf.length" :hoehe="200" />
              <button v-if="phase === 'saison'" class="btn btn-ghost full mt" @click="saisonUeberspringen">Überspringen</button>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Auflösung -->
      <Transition name="fade">
        <div v-if="phase === 'fertig' && total" class="card aufloesung">
          <div class="aufl-zahl">
            <p class="label">{{ total.netto < 0 ? T.ergebnisVerlust : T.ergebnisGewinn }} nach {{ anzahlSaison + 1 }} Wetten</p>
            <p class="gross" :class="total.netto < 0 ? 'loss' : 'win'">{{ total.netto < 0 ? '−' : '+' }}CHF {{ chf(Math.abs(total.netto), 0) }}</p>
            <dl class="zahlen">
              <div><dt>{{ T.eingesetzt }}</dt><dd>CHF {{ chf(total.eingesetzt, 0) }}</dd></div>
              <div><dt>{{ T.ausbezahlt }}</dt><dd>CHF {{ chf(total.ausbezahlt, 0) }}</dd></div>
              <div><dt>Nachgeladen</dt><dd>{{ total.einzahlungen }}×</dd></div>
            </dl>
          </div>
          <div class="aufl-text">
            <h3 class="kern">{{ total.netto < 0 ? T.kernbotschaft : 'Glück gehabt – diesmal.' }}</h3>
            <p class="muted">{{ total.netto < 0 ? T.kernText : T.gewinnHinweis }}</p>
            <p v-if="vergleichListe.length" class="vergleich">
              {{ T.vergleichIntro }} <strong>{{ vergleichListe.join(' oder ') }}</strong>.
              <span class="small muted">{{ T.vergleichHinweis }}</span>
            </p>
            <div class="btn-row">
              <a href="#100-fans" class="btn btn-primary" @click.prevent="scrolleZu('100-fans')">{{ T.zuFans }} <span class="arrow" aria-hidden="true">→</span></a>
              <button class="btn btn-ghost" @click="neuerTipp">↺ {{ T.nochmals }}</button>
              <button v-if="total.netto < 0" class="btn btn-ghost" @click="herausfordern">↗ {{ T.herausfordern }}</button>
            </div>
            <p v-if="teilenStatus" class="small muted status" role="status">{{ teilenStatus }}</p>
          </div>
        </div>
      </Transition>
    </div>
  </section>
</template>

<style scoped>
.sim-grid { display: grid; gap: 18px; align-items: stretch; }
@media (min-width: 960px) { .sim-grid { grid-template-columns: 1fr 1fr; } }
.match-top { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 22px; }
.teams { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 12px; margin-bottom: 26px; }
.team { font-weight: 800; font-size: clamp(1.05rem, 2.2vw, 1.35rem); letter-spacing: -0.02em; line-height: 1.2; }
.team.gast { text-align: right; }
.score { min-width: 84px; text-align: center; }
.vs { color: var(--faint); font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.85rem; }
.score-final { font-size: 2rem; font-weight: 800; font-variant-numeric: tabular-nums; letter-spacing: -0.03em; }
.score-final i { font-style: normal; color: var(--faint); margin: 0 6px; }
.schritt { font-size: 0.78rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); margin-bottom: 10px; }
.odds { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.odd {
  display: grid; grid-template-columns: auto 1fr; grid-template-rows: auto auto; align-items: baseline; column-gap: 8px; text-align: left;
  padding: 14px 16px; border-radius: var(--radius-sm); border: 1px solid var(--border-strong); background: rgba(255, 255, 255, 0.03);
  color: var(--text); font: inherit; cursor: pointer; min-height: 64px;
  transition: border-color 0.3s var(--ease), background 0.3s var(--ease), transform 0.3s var(--ease);
}
.odd:hover:not(:disabled) { border-color: var(--accent); transform: translateY(-2px); }
.odd:disabled { cursor: default; }
.odd-label { font-weight: 800; color: var(--muted); }
.odd-quote { font-weight: 800; font-size: 1.25rem; text-align: right; font-variant-numeric: tabular-nums; }
.odd-sub { grid-column: 1 / -1; font-size: 0.72rem; color: var(--faint); }
.odd.gewaehlt { border-color: var(--accent); background: rgba(62, 230, 176, 0.12); box-shadow: 0 0 0 1px var(--accent) inset; }
.odd.gewaehlt .odd-label { color: var(--accent); }
.odd.ausgang { position: relative; }
.odd.ausgang::after { content: 'Ergebnis'; position: absolute; top: -9px; right: 10px; font-size: 0.65rem; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; padding: 1px 7px; border-radius: 999px; background: var(--warn); color: #241800; }
@media (max-width: 420px) { .odd { padding: 12px 10px; } .odd-quote { font-size: 1.05rem; } }
.aktion { margin-top: 20px; position: relative; }
.full { width: 100%; }
.mt { margin-top: 16px; }
.hint { text-align: center; margin: 10px 0 0; }
.resultat { display: flex; align-items: center; gap: 14px; padding: 14px 16px; border-radius: var(--radius-sm); border: 1px solid currentColor; margin-bottom: 14px; background: rgba(255, 255, 255, 0.02); }
.resultat strong { display: block; color: var(--text); }
.resultat .betrag { font-weight: 800; font-size: 1.15rem; }
.icon { display: grid; place-items: center; width: 40px; height: 40px; border-radius: 50%; border: 2px solid currentColor; font-weight: 900; flex: none; }
.margen-box { padding: 14px 16px; border-radius: var(--radius-sm); background: rgba(143, 128, 255, 0.1); border: 1px solid rgba(143, 128, 255, 0.3); }
.margen-box p:last-child { margin: 0; }
.hundert { display: grid; grid-template-columns: repeat(20, 1fr); gap: 3px; margin: 2px 0 12px; max-width: 360px; }
.hundert span { aspect-ratio: 1; border-radius: 50%; background: rgba(255, 255, 255, 0.12); transition: background 0.4s var(--ease); }
.hundert span.an { background: var(--accent-2); }
.vergleich { padding: 12px 14px; border-radius: var(--radius-sm); background: rgba(255, 255, 255, 0.04); border: 1px solid var(--border); }
.vergleich .small { display: block; margin-top: 2px; }
.status { margin: 12px 0 0; }
.label { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--accent-2); margin: 0 0 8px; }
.saison { position: relative; display: flex; flex-direction: column; justify-content: center; transition: border-color 0.5s var(--ease); }
.saison.aktiv { border-color: rgba(143, 128, 255, 0.35); }
.saison h3 { font-size: 1.4rem; }
.saison-head { display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 10px; }
.saison-head .label { margin: 0; }
.pill.warn { color: var(--warn); border-color: rgba(255, 201, 92, 0.35); background: rgba(255, 201, 92, 0.08); }
.aufloesung { margin-top: 18px; display: grid; gap: 28px; align-items: center; border-color: rgba(255, 125, 140, 0.3); background: linear-gradient(135deg, rgba(255, 125, 140, 0.08), rgba(143, 128, 255, 0.06)); }
@media (min-width: 900px) { .aufloesung { grid-template-columns: 1fr 1.2fr; } }
.gross { font-size: clamp(2.8rem, 7vw, 4.4rem); font-weight: 800; letter-spacing: -0.045em; line-height: 1; margin: 0 0 18px; font-variant-numeric: tabular-nums; }
.zahlen { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 0; }
.zahlen div { padding: 10px 12px; border-radius: 12px; background: rgba(0, 0, 0, 0.2); border: 1px solid var(--border); }
.zahlen dt { font-size: 0.75rem; color: var(--muted); }
.zahlen dd { margin: 0; font-weight: 800; font-variant-numeric: tabular-nums; white-space: nowrap; }
@media (max-width: 480px) { .zahlen div { padding: 8px 9px; } .zahlen dd { font-size: 0.9rem; } }
.kern { font-size: clamp(1.5rem, 3.2vw, 2.2rem); letter-spacing: -0.03em; }
.pop-enter-active, .pop-leave-active { transition: opacity 0.4s var(--ease), transform 0.5s var(--ease); }
.pop-enter-from { opacity: 0; transform: scale(0.6); }
.pop-leave-to { opacity: 0; }
</style>
