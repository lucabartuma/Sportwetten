<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import LineChart from '../components/LineChart.vue'
import QuelleLink from '../components/QuelleLink.vue'
import TrickModal from '../components/TrickModal.vue'
import { simulationConfig as cfg } from '../config/simulation'
import { aufloesungTexte as A, simulatorTexte as T } from '../config/texts'
import { faktById, kernkennzahl } from '../data/facts'
import { ligaName } from '../data/teams'
import { tricks } from '../data/tricks'
import { chf, prozent, quote } from '../composables/format'
import {
  abschliessen,
  anpfiff,
  durchschnittsEinsatz,
  einsatzProWette,
  ensureSimulator,
  gesamtEinsatz,
  gewaehlteTipps,
  kannAnpfeifen,
  moeglicheAuszahlung,
  naechsterSpieltag,
  resetSimulator,
  sim,
  tippe,
  weiterspielen,
  zeitraffer,
  zeitrafferAbschliessen,
  zurAufloesung,
} from '../composables/useSimulator'
import { AUSGAENGE, type Ausgang, kombiQuote } from '../logic/odds'

ensureSimulator()

const studie = faktById(kernkennzahl.faktId)
const labels: Record<Ausgang, string> = { '1': 'Heimsieg', X: 'Unentschieden', '2': 'Auswärtssieg' }

const tipps = computed(() => gewaehlteTipps())
const animMs = computed(() => (sim.demo ? cfg.animationMsDemo : cfg.animationMs))
const netto = computed(() => round(sim.guthaben - sim.eingezahlt))
const einzahlungenNach = computed(() => Math.round((sim.eingezahlt - cfg.startguthaben) / cfg.zeitraffer.nachzahlung))
function round(x: number) {
  return Math.round(x * 100) / 100
}

/* ---------- Live-Animation ---------- */
const minute = ref(0)
const torMinuten = ref<Record<string, { heim: number[]; gast: number[] }>>({})
let raf = 0
let start = 0

function zufallsMinuten(n: number) {
  return Array.from({ length: n }, () => 1 + Math.floor(Math.random() * 90)).sort((a, b) => a - b)
}

function starteLive() {
  const m: Record<string, { heim: number[]; gast: number[] }> = {}
  for (const p of sim.partien) {
    m[p.id] = { heim: zufallsMinuten(p.tore?.[0] ?? 0), gast: zufallsMinuten(p.tore?.[1] ?? 0) }
  }
  torMinuten.value = m
  minute.value = 0
  start = performance.now()
  const step = (t: number) => {
    const progress = Math.min(1, (t - start) / animMs.value)
    minute.value = Math.floor(progress * 90)
    if (progress < 1) raf = requestAnimationFrame(step)
    else abschliessen()
  }
  raf = requestAnimationFrame(step)
}

function ueberspringen() {
  cancelAnimationFrame(raf)
  minute.value = 90
  abschliessen()
}

function liveStand(id: string): [number, number] {
  const m = torMinuten.value[id]
  if (!m) return [0, 0]
  return [m.heim.filter((x) => x <= minute.value).length, m.gast.filter((x) => x <= minute.value).length]
}

function onAnpfiff() {
  anpfiff()
  if (sim.phase === 'live') starteLive()
}

/* ---------- Zeitraffer-Animation ---------- */
const zeitrafferIndex = ref(0)
function onZeitraffer() {
  if (sim.phase === 'live') ueberspringen()
  zeitraffer()
  if (sim.phase !== 'zeitraffer' || !sim.saison) return
  const total = sim.saison.verlauf.length
  const dauer = sim.demo ? 2000 : 3500
  start = performance.now()
  const step = (t: number) => {
    const progress = Math.min(1, (t - start) / dauer)
    zeitrafferIndex.value = Math.max(1, Math.floor(progress * total))
    if (progress < 1) raf = requestAnimationFrame(step)
    else zeitrafferAbschliessen()
  }
  raf = requestAnimationFrame(step)
}
function zeitrafferSkip() {
  cancelAnimationFrame(raf)
  zeitrafferAbschliessen()
}

const chartWerte = computed(() => {
  if (sim.phase === 'zeitraffer' && sim.saison) {
    return [...sim.verlauf, ...sim.saison.verlauf.slice(1, zeitrafferIndex.value)]
  }
  return sim.verlauf
})
const zeitrafferNachzahlungen = computed(() => {
  if (sim.phase !== 'zeitraffer' || !sim.saison) return 0
  const v = sim.saison.verlauf.slice(0, zeitrafferIndex.value)
  let n = 0
  for (let i = 1; i < v.length; i++) if (v[i] > v[i - 1] + cfg.zeitraffer.nachzahlung / 2) n++
  return n
})
const chartReferenz = computed(() => sim.eingezahlt + zeitrafferNachzahlungen.value * cfg.zeitraffer.nachzahlung)

/* ---------- Sonstiges ---------- */
function reset() {
  cancelAnimationFrame(raf)
  resetSimulator()
}
function aufloesung() {
  cancelAnimationFrame(raf)
  zurAufloesung()
}

const teilenStatus = ref('')
async function teilen() {
  const verlust = Math.max(0, -netto.value)
  const text = A.teilenText(chf(verlust, 0))
  try {
    if (navigator.share) await navigator.share({ text })
    else {
      await navigator.clipboard.writeText(text)
      teilenStatus.value = 'Text kopiert – füg ihn ein, wo Du willst.'
    }
  } catch {
    teilenStatus.value = text
  }
}

function onKey(e: KeyboardEvent) {
  if (!sim.demo || sim.popup) return
  const el = e.target as HTMLElement
  if (el && ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName)) return
  if (e.key === 'ArrowRight') {
    if (sim.phase === 'wetten' && kannAnpfeifen()) onAnpfiff()
    else if (sim.phase === 'live') ueberspringen()
    else if (sim.phase === 'ergebnis') naechsterSpieltag()
    else if (sim.phase === 'zeitraffer') zeitrafferSkip()
  } else if (e.key === 'z' || e.key === 'Z') onZeitraffer()
  else if (e.key === 'r' || e.key === 'R') reset()
}

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  cancelAnimationFrame(raf)
  if (sim.phase === 'live') abschliessen()
  if (sim.phase === 'zeitraffer') zeitrafferAbschliessen()
})

// Ergebnis-Ansage für Screenreader
const ansage = ref('')
watch(
  () => sim.phase,
  (p) => {
    if (p === 'ergebnis' && sim.auswertung) {
      const a = sim.auswertung
      ansage.value =
        a.ausbezahlt > 0
          ? `Gewonnen: CHF ${chf(a.ausbezahlt)} ausbezahlt. Neues Guthaben CHF ${chf(sim.guthaben)}.`
          : `Verloren: CHF ${chf(a.eingesetzt)} Einsatz weg. Neues Guthaben CHF ${chf(sim.guthaben)}.`
    }
  },
)
</script>

<template>
  <div class="sim">
    <!-- Statusleiste -->
    <div class="statusbar" role="region" aria-label="Spielstand">
      <div class="stat">
        <span class="stat-label">{{ T.guthaben }}</span>
        <span class="stat-value" :class="sim.guthaben < sim.eingezahlt ? 'loss' : 'win'">CHF {{ chf(sim.guthaben) }}</span>
      </div>
      <div class="stat hide-sm">
        <span class="stat-label">Eingezahlt</span>
        <span class="stat-value">CHF {{ chf(sim.eingezahlt, 0) }}</span>
      </div>
      <div class="stat hide-sm">
        <span class="stat-label">{{ T.titel }}</span>
        <span class="stat-value">{{ sim.spieltagNr }}</span>
      </div>
      <div class="status-actions">
        <button v-if="sim.phase !== 'aufloesung'" class="btn btn-ghost btn-sm" @click="aufloesung">{{ T.aufloesung }}</button>
        <button class="btn btn-ghost btn-sm" @click="reset" :aria-label="T.reset">↺ <span class="hide-sm">{{ T.reset }}</span></button>
      </div>
    </div>
    <p class="sr-only" aria-live="polite">{{ ansage }}</p>

    <!-- ================= AUFLÖSUNG ================= -->
    <section v-if="sim.phase === 'aufloesung'" class="aufloesung" aria-labelledby="aufl-titel">
      <div class="card big">
        <h1 id="aufl-titel" :class="netto < 0 ? 'loss' : 'win'">
          <template v-if="netto < 0">{{ A.verloren(chf(-netto)) }}</template>
          <template v-else>{{ A.imPlus(chf(netto)) }}</template>
        </h1>
        <p v-if="netto >= 0" class="muted">{{ A.imPlusHinweis }}</p>
        <button v-if="netto >= 0 && !sim.saison" class="btn btn-warn" @click="onZeitraffer">⏩ {{ T.zeitraffer }}</button>

        <p class="kern">{{ A.kernbotschaft }}</p>

        <dl class="zahlen">
          <div><dt>Eingezahlt</dt><dd>CHF {{ chf(sim.eingezahlt, 0) }}</dd></div>
          <div><dt>Total eingesetzt</dt><dd>CHF {{ chf(sim.totalEingesetzt) }}</dd></div>
          <div><dt>Total ausbezahlt</dt><dd>CHF {{ chf(sim.totalAusbezahlt) }}</dd></div>
          <div><dt>Wetten</dt><dd>{{ sim.anzahlWetten }}</dd></div>
          <div v-if="einzahlungenNach > 0"><dt>Nachzahlungen</dt><dd>{{ einzahlungenNach }} × CHF {{ cfg.zeitraffer.nachzahlung }}</dd></div>
        </dl>

        <div v-if="sim.saison" class="infobox">
          <strong>Zeitraffer:</strong> {{ cfg.zeitraffer.anzahlWetten }} Wetten à CHF {{ Math.round(sim.saison.eingesetzt / cfg.zeitraffer.anzahlWetten) }} ·
          eingesetzt CHF {{ chf(sim.saison.eingesetzt, 0) }} · ausbezahlt CHF {{ chf(sim.saison.ausbezahlt, 0) }} ·
          <span :class="sim.saison.netto < 0 ? 'loss' : 'win'">{{ sim.saison.netto < 0 ? 'Nettoverlust' : 'Nettogewinn' }} CHF {{ chf(Math.abs(sim.saison.netto), 0) }}</span>
          <template v-if="sim.saison.einzahlungen > 0"> · {{ sim.saison.einzahlungen }}× nachgeladen</template>
        </div>
      </div>

      <div class="grid grid-2 section-sm">
        <div class="card">
          <h2>Wie die Marge funktioniert</h2>
          <p>{{ A.margeErklaerung(prozent(cfg.marge)) }}</p>
          <p v-if="sim.beispiel" class="beispiel">
            {{ A.beispiel(sim.beispiel.partie, quote(sim.beispiel.fair), quote(sim.beispiel.angeboten)) }}
          </p>
          <p class="muted small">{{ A.kombiHinweis }}</p>
        </div>
        <div class="card">
          <h2>{{ T.verlaufTitel }}</h2>
          <LineChart :werte="sim.verlauf" :referenz="sim.eingezahlt" label="Guthaben (Simulation)" />
        </div>
      </div>

      <div class="card section-sm fans-teaser">
        <div class="mini-fans" aria-hidden="true">
          <span v-for="i in 100" :key="i" :class="i <= kernkennzahl.gewinnerVon100 ? 'g' : 'r'"></span>
        </div>
        <div>
          <p class="teaser-text">{{ kernkennzahl.kurz }}</p>
          <QuelleLink v-if="studie" :quelle="studie.quelle" :url="studie.url" :stand="studie.stand" />
          <RouterLink to="/100-fans" class="btn btn-primary">{{ A.fansButton }} →</RouterLink>
        </div>
      </div>

      <div class="btn-row section-sm">
        <button class="btn btn-primary" @click="reset">↺ {{ A.nochmals }}</button>
        <button v-if="sim.guthaben >= 0.01" class="btn btn-ghost" @click="weiterspielen">Weiterspielen</button>
        <RouterLink to="/selbsttest" class="btn btn-ghost">{{ A.selbsttest }}</RouterLink>
        <RouterLink to="/hilfe" class="btn btn-ghost">{{ A.hilfe }}</RouterLink>
        <button class="btn btn-ghost" @click="teilen">↗ {{ A.teilen }}</button>
      </div>
      <p v-if="teilenStatus" class="small muted" role="status">{{ teilenStatus }}</p>
    </section>

    <!-- ================= SPIEL ================= -->
    <div v-else class="layout">
      <section class="spiele" aria-labelledby="spieltag-titel">
        <header class="spiele-head">
          <h1 id="spieltag-titel">{{ ligaName }} · {{ T.titel }} {{ sim.spieltagNr }}</h1>
          <span v-if="sim.phase === 'live'" class="live" aria-live="off"><span class="live-dot" aria-hidden="true"></span>LIVE {{ minute }}’</span>
        </header>

        <ul class="partien">
          <li v-for="p in sim.partien" :key="p.id" class="partie card">
            <div class="teams">
              <span class="team">{{ p.heim }}</span>
              <span class="score" :class="{ final: sim.phase === 'ergebnis' }">
                <template v-if="sim.phase === 'live'">{{ liveStand(p.id)[0] }} : {{ liveStand(p.id)[1] }}</template>
                <template v-else-if="sim.phase === 'ergebnis' && p.tore">{{ p.tore[0] }} : {{ p.tore[1] }}</template>
                <template v-else>vs</template>
              </span>
              <span class="team gast">{{ p.gast }}</span>
            </div>
            <div class="odds" role="group" :aria-label="`Tipps für ${p.heim} gegen ${p.gast}`">
              <button
                v-for="a in AUSGAENGE"
                :key="a"
                class="odd"
                :class="{
                  gewaehlt: sim.tipps[p.id] === a,
                  richtig: sim.phase === 'ergebnis' && p.ergebnis === a,
                }"
                :aria-pressed="sim.tipps[p.id] === a"
                :disabled="sim.phase !== 'wetten'"
                @click="tippe(p.id, a)"
              >
                <span class="odd-label">{{ a }}<span class="sr-only"> {{ labels[a] }}, Quote</span></span>
                <span class="odd-quote">{{ ' ' }}{{ quote(p.quoten[a]) }}</span>
              </button>
            </div>
            <p v-if="sim.phase === 'ergebnis' && sim.tipps[p.id]" class="tipp-result" :class="p.ergebnis === sim.tipps[p.id] ? 'win' : 'loss'">
              <template v-if="p.ergebnis === sim.tipps[p.id]">✓ Dein Tipp {{ sim.tipps[p.id] }} war richtig</template>
              <template v-else>✗ Dein Tipp {{ sim.tipps[p.id] }} war falsch (Ergebnis: {{ p.ergebnis }})</template>
            </p>
          </li>
        </ul>
      </section>

      <aside class="seite">
        <!-- Wettschein -->
        <section class="card schein" aria-labelledby="schein-titel">
          <h2 id="schein-titel">Wettschein</h2>

          <template v-if="sim.phase === 'wetten'">
            <div class="typ" role="radiogroup" aria-label="Wett-Typ">
              <button
                v-for="t in (['einzel', 'kombi'] as const)"
                :key="t"
                role="radio"
                :aria-checked="sim.typ === t"
                class="seg"
                :class="{ aktiv: sim.typ === t }"
                @click="sim.typ = t"
              >{{ t === 'einzel' ? T.einzel : T.kombi }}</button>
            </div>
            <p class="small muted">{{ sim.typ === 'einzel' ? T.einzelHilfe : T.kombiHilfe }}</p>

            <fieldset class="einsatz">
              <legend>{{ T.einsatz }} {{ sim.typ === 'einzel' ? 'pro Tipp' : '' }}</legend>
              <div class="chips">
                <button
                  v-for="e in cfg.einsatzSchnellwahl"
                  :key="e"
                  class="chip"
                  :class="{ aktiv: sim.einsatzWahl === e }"
                  :aria-pressed="sim.einsatzWahl === e"
                  :disabled="e > sim.guthaben"
                  @click="sim.einsatzWahl = e"
                >CHF {{ e }}</button>
                <button class="chip allin" :class="{ aktiv: sim.einsatzWahl === 'allin' }" :aria-pressed="sim.einsatzWahl === 'allin'" @click="sim.einsatzWahl = 'allin'">{{ T.allIn }}</button>
              </div>
            </fieldset>

            <div v-if="tipps.length" class="summary">
              <div><span>Tipps</span><strong>{{ tipps.length }}</strong></div>
              <div v-if="sim.typ === 'kombi' && tipps.length > 1"><span>Kombi-Quote</span><strong>{{ quote(kombiQuote(tipps.map((t) => t.quote))) }}</strong></div>
              <div><span>Einsatz total</span><strong>CHF {{ chf(gesamtEinsatz()) }}</strong></div>
              <div><span>Möglicher Gewinn</span><strong class="win">CHF {{ chf(moeglicheAuszahlung()) }}</strong></div>
            </div>
            <p v-else class="small muted">{{ T.keineTipps }}</p>
            <p v-if="sim.typ === 'kombi' && tipps.length === 1" class="small warn-text">Für eine Kombi brauchst Du mindestens 2 Tipps.</p>
            <p v-if="tipps.length && gesamtEinsatz() > sim.guthaben + 1e-9" class="small warn-text">{{ T.zuWenigGuthaben }}</p>

            <button class="btn btn-primary btn-lg full" :disabled="!kannAnpfeifen()" @click="onAnpfiff">⚽ {{ T.anpfiff }}</button>
          </template>

          <template v-else-if="sim.phase === 'live'">
            <p class="live-text">Die Spiele laufen …</p>
            <div class="progress" role="progressbar" aria-label="Spielminute" :aria-valuenow="minute" aria-valuemin="0" aria-valuemax="90">
              <span :style="{ width: (minute / 90) * 100 + '%' }"></span>
            </div>
            <button class="btn btn-ghost full" @click="ueberspringen">{{ T.ueberspringen }} ⏭</button>
          </template>

          <template v-else-if="sim.phase === 'ergebnis' && sim.auswertung">
            <div class="ergebnis" :class="sim.auswertung.ausbezahlt > 0 ? 'win' : 'loss'">
              <span class="ergebnis-icon" aria-hidden="true">{{ sim.auswertung.ausbezahlt > 0 ? '🎉' : '✗' }}</span>
              <strong v-if="sim.auswertung.ausbezahlt > 0">Gewonnen! +CHF {{ chf(sim.auswertung.ausbezahlt) }}</strong>
              <strong v-else>Verloren: −CHF {{ chf(sim.auswertung.eingesetzt) }}</strong>
              <span class="small">{{ sim.auswertung.treffer }} von {{ sim.auswertung.anzahlTipps }} Tipps richtig · Einsatz CHF {{ chf(sim.auswertung.eingesetzt) }}</span>
            </div>
            <template v-if="sim.guthaben >= 0.01">
              <button class="btn btn-primary btn-lg full" @click="naechsterSpieltag">{{ T.naechsterSpieltag }} →</button>
            </template>
            <template v-else>
              <p class="loss"><strong>Dein Guthaben ist weg.</strong></p>
              <button class="btn btn-primary btn-lg full" @click="aufloesung">{{ T.aufloesung }} →</button>
            </template>
          </template>

          <template v-else-if="sim.phase === 'zeitraffer'">
            <p class="live-text">⏩ Zeitraffer läuft: {{ Math.max(0, zeitrafferIndex - 1) }} / {{ cfg.zeitraffer.anzahlWetten }} Wetten</p>
            <p v-if="zeitrafferNachzahlungen > 0" class="warn-text small" aria-live="polite">
              💸 Du hast nochmals {{ cfg.zeitraffer.nachzahlung }} Franken eingezahlt · Einzahlungen total: {{ zeitrafferNachzahlungen }}
            </p>
            <button class="btn btn-ghost full" @click="zeitrafferSkip">{{ T.ueberspringen }} ⏭</button>
          </template>
        </section>

        <!-- Verlauf -->
        <section class="card" aria-labelledby="verlauf-titel">
          <h2 id="verlauf-titel">{{ T.verlaufTitel }}</h2>
          <LineChart :werte="chartWerte" :referenz="chartReferenz" label="Guthaben" :hoehe="180" />
          <button
            class="btn btn-warn full mt"
            :disabled="sim.phase === 'live' || sim.phase === 'zeitraffer'"
            @click="onZeitraffer"
          >⏩ {{ T.zeitraffer }}</button>
          <p class="small muted mt-s">{{ cfg.zeitraffer.anzahlWetten }} Einzelwetten à CHF {{ durchschnittsEinsatz() }} (Dein Ø-Einsatz). Ist das Guthaben weg, wird automatisch CHF {{ cfg.zeitraffer.nachzahlung }} nachgeladen.</p>
        </section>

        <p v-if="sim.demo" class="small muted demo-hint">Demo: <kbd>→</kbd> weiter · <kbd>Z</kbd> Zeitraffer · <kbd>R</kbd> Reset</p>
      </aside>
    </div>

    <TrickModal v-if="sim.popup" :key="sim.popup" :trick="tricks[sim.popup]" @close="sim.popup = null" />
  </div>
</template>

<style scoped>
.statusbar { position: sticky; top: calc(var(--header-h, 90px) + 6px); z-index: 10; display: flex; align-items: center; gap: 18px; background: var(--bg-2); border: 1px solid var(--line); border-radius: var(--radius); padding: 8px 14px; margin-bottom: 18px; box-shadow: var(--shadow); }
@media (max-width: 640px) { .statusbar { top: 4px; gap: 10px; padding: 6px 10px; } .statusbar .hide-sm { display: none; } .stat-value { font-size: 1rem; } .status-actions .btn-sm { padding: 4px 8px; } }
.stat { display: flex; flex-direction: column; }
.stat-label { font-size: 0.72rem; text-transform: uppercase; letter-spacing: .05em; color: var(--muted); }
.stat-value { white-space: nowrap; font-weight: 800; font-size: 1.15rem; font-variant-numeric: tabular-nums; }
.status-actions { margin-left: auto; display: flex; gap: 6px; }
.btn-sm { min-height: 36px; padding: 6px 10px; font-size: 0.85rem; }

.layout { display: grid; grid-template-columns: 1fr; gap: 18px; }
@media (min-width: 960px) { .layout { grid-template-columns: minmax(0, 1.5fr) minmax(320px, 1fr); align-items: start; } .seite { position: sticky; top: calc(var(--header-h, 90px) + 84px); } }
.spiele-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
.spiele-head h1 { font-size: clamp(1.2rem, 3vw, 1.6rem); margin: 0 0 12px; }
.live { display: inline-flex; align-items: center; gap: 6px; background: var(--loss); color: #2a0006; font-weight: 800; padding: 2px 10px; border-radius: 999px; font-variant-numeric: tabular-nums; }
.live-dot { width: 8px; height: 8px; border-radius: 50%; background: #2a0006; animation: blink 1s infinite; }
@keyframes blink { 50% { opacity: .2 } }

.partien { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
.partie { padding: 12px 14px; }
.teams { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 8px; margin-bottom: 10px; font-weight: 700; }
.team.gast { text-align: right; }
.score { min-width: 64px; text-align: center; font-variant-numeric: tabular-nums; color: var(--muted); font-weight: 800; }
.score.final { color: var(--text); font-size: 1.1rem; }
.odds { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.odd { display: flex; justify-content: space-between; align-items: center; background: var(--card-2); border: 2px solid var(--line); color: var(--text); border-radius: 10px; padding: 8px 12px; font: inherit; cursor: pointer; min-height: 44px; }
.odd:hover:not(:disabled) { border-color: var(--accent); }
.odd:disabled { cursor: default; }
.odd-label { color: var(--muted); font-weight: 700; }
.odd-quote { font-weight: 800; color: var(--accent); font-variant-numeric: tabular-nums; }
.odd.gewaehlt { background: var(--accent); border-color: var(--accent); }
.odd.gewaehlt .odd-label, .odd.gewaehlt .odd-quote { color: var(--accent-ink); }
.odd.richtig { box-shadow: inset 0 0 0 2px var(--warn); }
.odd.richtig::after { content: '★'; color: var(--warn); margin-left: 4px; }
.odd.gewaehlt.richtig::after { color: var(--accent-ink); }
.tipp-result { margin: 8px 0 0; font-weight: 700; font-size: 0.9rem; }

.schein h2, .seite h2 { font-size: 1.1rem; }
.typ { display: grid; grid-template-columns: 1fr 1fr; background: var(--bg-2); border-radius: 10px; padding: 4px; gap: 4px; margin-bottom: 8px; }
.seg { background: transparent; border: 0; color: var(--muted); font: inherit; font-weight: 700; padding: 8px; border-radius: 8px; cursor: pointer; min-height: 40px; }
.seg.aktiv { background: var(--card-2); color: var(--text); box-shadow: inset 0 0 0 2px var(--accent); }
.einsatz { border: 0; padding: 0; margin: 0 0 12px; }
.einsatz legend { font-weight: 700; margin-bottom: 6px; font-size: 0.9rem; }
.chips { display: flex; flex-wrap: wrap; gap: 6px; }
.chip { background: var(--card-2); border: 2px solid var(--line); color: var(--text); border-radius: 999px; padding: 6px 14px; font: inherit; font-weight: 700; cursor: pointer; min-height: 40px; }
.chip.aktiv { border-color: var(--accent); background: rgba(61,255,143,.15); }
.chip.allin { border-style: dashed; }
.chip:disabled { opacity: .4; }
.summary { display: grid; gap: 4px; margin: 10px 0 12px; padding: 10px; background: var(--bg-2); border-radius: 10px; }
.summary div { display: flex; justify-content: space-between; font-variant-numeric: tabular-nums; }
.summary span { color: var(--muted); }
.full { width: 100%; }
.mt { margin-top: 12px; }
.mt-s { margin-top: 8px; margin-bottom: 0; }
.warn-text { color: var(--warn); }
.live-text { font-weight: 700; }
.progress { height: 8px; background: var(--bg-2); border-radius: 999px; overflow: hidden; margin-bottom: 12px; }
.progress span { display: block; height: 100%; background: var(--loss); transition: width .1s linear; }
.ergebnis { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 4px; padding: 14px; border-radius: 12px; margin-bottom: 12px; border: 2px solid currentColor; }
.ergebnis strong { font-size: 1.3rem; }
.ergebnis .small { color: var(--muted); }
.ergebnis-icon { font-size: 2rem; }
.seite { display: grid; gap: 14px; }
.demo-hint kbd { background: var(--card-2); border: 1px solid var(--line); border-radius: 4px; padding: 0 5px; }

.aufloesung .big { text-align: center; padding: 32px 20px; }
.aufloesung h1 { font-size: clamp(2rem, 6vw, 3.6rem); }
.kern { font-size: clamp(1.3rem, 3.5vw, 2rem); font-weight: 800; margin: 20px 0; }
.zahlen { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px; margin: 0 0 16px; }
.zahlen div { background: var(--bg-2); border-radius: 10px; padding: 10px; }
.zahlen dt { font-size: 0.78rem; color: var(--muted); }
.zahlen dd { margin: 0; font-weight: 800; font-variant-numeric: tabular-nums; }
.beispiel { background: var(--bg-2); border-left: 4px solid var(--accent); padding: 10px 12px; border-radius: 8px; }
.section-sm { margin-top: 16px; }
.fans-teaser { display: grid; grid-template-columns: auto 1fr; gap: 20px; align-items: center; }
@media (max-width: 560px) { .fans-teaser { grid-template-columns: 1fr; } }
.teaser-text { font-size: 1.3rem; font-weight: 800; }
.mini-fans { display: grid; grid-template-columns: repeat(10, 12px); gap: 3px; }
.mini-fans span { width: 12px; height: 12px; border-radius: 50%; background: var(--loss); }
.mini-fans span.g { background: var(--win); }
</style>
