<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { RouterLink } from 'vue-router'
import QuelleLink from '../components/QuelleLink.vue'
import { simulationConfig as cfg } from '../config/simulation'
import { hundertFansTexte as T } from '../config/texts'
import { faktById, kernkennzahl } from '../data/facts'
import { demoAktiv } from '../composables/demo'
import { chf, prozent } from '../composables/format'
import { createRng, defaultRng } from '../logic/random'
import { simuliereFans } from '../logic/simulate'

const n = cfg.hundertFans.anzahlFans
const optionen = cfg.hundertFans.wettenOptionen
const wettenIndex = ref(optionen.indexOf(cfg.hundertFans.standardWetten as (typeof optionen)[number]))
const anzahlWetten = computed(() => optionen[wettenIndex.value])
const ergebnisse = ref<number[]>([])
const sichtbar = ref(0)
const laeuft = ref(false)
let timer = 0
let durchlauf = 0

const studie = faktById(kernkennzahl.faktId)

function starten() {
  clearInterval(timer)
  const rng = demoAktiv.value ? createRng(cfg.demoSeed + 16 + durchlauf) : defaultRng
  durchlauf++
  ergebnisse.value = simuliereFans(rng, n, anzahlWetten.value, cfg.hundertFans.einsatz, cfg.marge)
  sichtbar.value = 0
  laeuft.value = true
  const dauer = demoAktiv.value ? 1800 : 3000
  timer = window.setInterval(() => {
    sichtbar.value = Math.min(n, sichtbar.value + 2)
    if (sichtbar.value >= n) {
      clearInterval(timer)
      laeuft.value = false
    }
  }, dauer / (n / 2))
}
onBeforeUnmount(() => clearInterval(timer))

function status(i: number): 'offen' | 'verlust' | 'gewinn' {
  if (i >= sichtbar.value || !ergebnisse.value.length) return 'offen'
  return ergebnisse.value[i] < 0 ? 'verlust' : 'gewinn'
}

const verlierer = computed(() => ergebnisse.value.slice(0, sichtbar.value).filter((x) => x < 0).length)
const fertig = computed(() => ergebnisse.value.length > 0 && sichtbar.value >= n)
const schnitt = computed(() => ergebnisse.value.reduce((a, b) => a + b, 0) / Math.max(1, ergebnisse.value.length))
const eingesetzt = computed(() => anzahlWetten.value * cfg.hundertFans.einsatz)

function figurLabel(i: number) {
  const s = status(i)
  if (s === 'offen') return `Fan ${i + 1}: noch offen`
  const v = ergebnisse.value[i]
  return `Fan ${i + 1}: ${s === 'verlust' ? 'Verlust' : 'Gewinn'} CHF ${chf(Math.abs(v), 0)}`
}
</script>

<template>
  <header class="page-head">
    <h1>{{ T.titel }}</h1>
    <p>{{ T.intro }}</p>
  </header>

  <div class="layout">
    <section class="card" aria-labelledby="raster-titel">
      <h2 id="raster-titel" class="sr-only">100 Fans</h2>
      <ul class="raster" :aria-busy="laeuft">
        <li v-for="i in n" :key="i" class="fan" :class="status(i - 1)" :title="figurLabel(i - 1)">
          <svg viewBox="0 0 24 24" aria-hidden="true" class="figur">
            <circle cx="12" cy="7" r="4.2" />
            <path d="M4 22c0-5 3.6-8.2 8-8.2s8 3.2 8 8.2z" />
          </svg>
          <span class="badge" aria-hidden="true">{{ status(i - 1) === 'verlust' ? '−' : status(i - 1) === 'gewinn' ? '+' : '' }}</span>
          <span class="sr-only">{{ figurLabel(i - 1) }}</span>
        </li>
      </ul>
      <p class="legende small">
        <span class="leg verlust" aria-hidden="true">−</span> {{ T.verloren }}
        <span class="leg gewinn" aria-hidden="true">+</span> {{ T.gewonnen }}
        <span class="leg offen" aria-hidden="true"></span> noch offen
      </p>
    </section>

    <section class="seite">
      <div class="card">
        <label for="wetten" class="regler-label">{{ T.regler }}: <strong>{{ anzahlWetten }}</strong></label>
        <input
          id="wetten"
          v-model.number="wettenIndex"
          type="range"
          min="0"
          :max="optionen.length - 1"
          step="1"
          :disabled="laeuft"
          :aria-valuetext="`${anzahlWetten} Wetten`"
        />
        <div class="ticks small muted" aria-hidden="true">
          <span v-for="o in optionen" :key="o">{{ o }}</span>
        </div>
        <p class="small muted">{{ T.reglerHinweis }} Einsatz pro Wette CHF {{ cfg.hundertFans.einsatz }} · Marge {{ prozent(cfg.marge) }} · total eingesetzt pro Person CHF {{ chf(eingesetzt, 0) }}.</p>
        <button class="btn btn-primary btn-lg full" :disabled="laeuft" @click="starten">
          ▶ {{ ergebnisse.length ? T.nochmals : T.start }}
        </button>
      </div>

      <div class="card zaehler" aria-live="polite">
        <template v-if="ergebnisse.length">
          <p class="gross"><span class="loss">{{ verlierer }}</span> von {{ sichtbar }}</p>
          <p v-if="fertig"><strong>{{ T.ergebnis(verlierer, n) }}</strong></p>
          <p v-if="fertig" class="small muted">Im Schnitt: {{ schnitt < 0 ? 'Verlust' : 'Gewinn' }} von CHF {{ chf(Math.abs(schnitt), 0) }} pro Person (Simulation).</p>
        </template>
        <p v-else class="muted">Tipp zuerst: Wie viele von 100 sind am Ende im Plus?</p>
      </div>
    </section>
  </div>

  <section class="card studie section">
    <h2>Und in der Realität?</h2>
    <p class="gross-text">{{ kernkennzahl.studie }}</p>
    <QuelleLink v-if="studie" :quelle="studie.quelle" :url="studie.url" :stand="studie.stand" />
    <div class="btn-row">
      <RouterLink to="/simulator" class="btn btn-ghost">Selbst wetten</RouterLink>
      <RouterLink to="/selbsttest" class="btn btn-ghost">Selbsttest</RouterLink>
      <RouterLink to="/hilfe" class="btn btn-ghost">Hilfe & Infos</RouterLink>
    </div>
  </section>
</template>

<style scoped>
.layout { display: grid; gap: 18px; }
@media (min-width: 960px) { .layout { grid-template-columns: minmax(0, 1.3fr) minmax(300px, 1fr); align-items: start; } }
.raster { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(10, 1fr); gap: clamp(2px, 1vw, 8px); }
.fan { position: relative; aspect-ratio: 1; display: grid; place-items: center; border-radius: 8px; background: var(--bg-2); transition: background .25s; }
.figur { width: 72%; height: 72%; fill: #5b6878; transition: fill .25s, transform .25s; }
.fan.verlust { background: rgba(255,107,122,.18); }
.fan.verlust .figur { fill: var(--loss); }
.fan.gewinn { background: rgba(61,255,143,.2); }
.fan.gewinn .figur { fill: var(--win); transform: scale(1.1); }
.badge { position: absolute; right: 2px; top: 0; font-weight: 900; font-size: clamp(.7rem, 1.6vw, 1rem); line-height: 1; }
.fan.verlust .badge { color: var(--loss); }
.fan.gewinn .badge { color: var(--win); }
.legende { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin: 12px 0 0; }
.leg { display: inline-grid; place-items: center; width: 18px; height: 18px; border-radius: 4px; font-weight: 900; color: #000; }
.leg.verlust { background: var(--loss); }
.leg.gewinn { background: var(--win); }
.leg.offen { background: #5b6878; }
.seite { display: grid; gap: 14px; }
.regler-label { display: block; font-weight: 700; margin-bottom: 6px; }
input[type=range] { width: 100%; accent-color: var(--accent); min-height: 32px; }
.ticks { display: flex; justify-content: space-between; margin-bottom: 8px; }
.full { width: 100%; }
.zaehler .gross { font-size: clamp(2.2rem, 6vw, 3.5rem); font-weight: 900; margin: 0; font-variant-numeric: tabular-nums; }
.gross-text { font-size: 1.15rem; }
</style>
