<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
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
  <section id="100-fans" class="section" aria-labelledby="fans-titel">
    <div class="wrap">
      <header class="section-head">
        <p class="kicker" v-reveal>{{ T.kicker }}</p>
        <h2 id="fans-titel" v-reveal="60">{{ T.titel }}</h2>
        <p v-reveal="120">{{ T.intro }}</p>
      </header>

      <div class="layout">
        <div class="card" v-reveal>
          <ul class="raster plain-list" :aria-busy="laeuft">
            <li v-for="i in n" :key="i" class="fan" :class="status(i - 1)" :style="{ transitionDelay: `${(i % 10) * 12}ms` }">
              <svg viewBox="0 0 24 24" aria-hidden="true" class="figur">
                <circle cx="12" cy="7.2" r="4" />
                <path d="M4.5 21.5c0-4.6 3.4-7.6 7.5-7.6s7.5 3 7.5 7.6z" />
              </svg>
              <span class="badge" aria-hidden="true">{{ status(i - 1) === 'verlust' ? '−' : status(i - 1) === 'gewinn' ? '+' : '' }}</span>
              <span class="sr-only">{{ figurLabel(i - 1) }}</span>
            </li>
          </ul>
          <p class="legende small">
            <span><span class="leg verlust" aria-hidden="true">−</span> {{ T.verloren }}</span>
            <span><span class="leg gewinn" aria-hidden="true">+</span> {{ T.gewonnen }}</span>
            <span><span class="leg offen" aria-hidden="true"></span> noch offen</span>
          </p>
        </div>

        <div class="seite">
          <div class="card" v-reveal="80">
            <label for="wetten" class="regler-label">{{ T.regler }} <strong>{{ anzahlWetten }}</strong></label>
            <input
              id="wetten"
              v-model.number="wettenIndex"
              type="range"
              min="0"
              :max="optionen.length - 1"
              step="1"
              :disabled="laeuft"
              :aria-valuetext="`${anzahlWetten} Wetten`"
              :style="{ '--p': `${(wettenIndex / (optionen.length - 1)) * 100}%` }"
            />
            <div class="ticks small" aria-hidden="true">
              <span v-for="o in optionen" :key="o">{{ o }}</span>
            </div>
            <p class="small muted">{{ T.reglerHinweis }} CHF {{ cfg.hundertFans.einsatz }} pro Wette · Marge {{ prozent(cfg.marge) }} · CHF {{ chf(eingesetzt, 0) }} Einsatz pro Person.</p>
            <button class="btn btn-primary btn-lg full" :disabled="laeuft" @click="starten">
              {{ ergebnisse.length ? T.nochmals : T.start }} <span class="arrow" aria-hidden="true">→</span>
            </button>
          </div>

          <div class="card zaehler" aria-live="polite" v-reveal="140">
            <template v-if="ergebnisse.length">
              <p class="gross"><span class="loss">{{ verlierer }}</span><span class="von"> / {{ sichtbar }}</span></p>
              <p class="unter">haben Geld verloren</p>
              <Transition name="fade">
                <div v-if="fertig">
                  <p><strong>{{ T.ergebnis(verlierer, n) }}</strong></p>
                  <p class="small muted">Im Schnitt {{ schnitt < 0 ? 'Verlust' : 'Gewinn' }} von CHF {{ chf(Math.abs(schnitt), 0) }} pro Person (Simulation).</p>
                </div>
              </Transition>
            </template>
            <p v-else class="muted tipp">Tipp zuerst: Wie viele von 100 sind am Ende im Plus?</p>
          </div>
        </div>
      </div>

      <div class="card realitaet" v-reveal>
        <p class="kicker">{{ T.realitaetTitel }}</p>
        <p class="zitat">{{ kernkennzahl.studie }}</p>
        <QuelleLink v-if="studie" :quelle="studie.quelle" :url="studie.url" :stand="studie.stand" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.layout { display: grid; gap: 18px; }
@media (min-width: 960px) { .layout { grid-template-columns: minmax(0, 1.35fr) minmax(300px, 1fr); align-items: start; } }
.raster { display: grid; grid-template-columns: repeat(10, 1fr); gap: clamp(3px, 0.9vw, 8px); }
.fan { position: relative; aspect-ratio: 1; display: grid; place-items: center; border-radius: 10px; background: rgba(255, 255, 255, 0.035); transition: background 0.5s var(--ease), transform 0.5s var(--ease); }
.figur { width: 70%; height: 70%; fill: #4b5568; transition: fill 0.5s var(--ease), transform 0.5s var(--ease); }
.fan.verlust { background: rgba(255, 125, 140, 0.14); }
.fan.verlust .figur { fill: var(--loss); }
.fan.gewinn { background: rgba(62, 230, 176, 0.2); transform: scale(1.06); }
.fan.gewinn .figur { fill: var(--win); }
.badge { position: absolute; right: 3px; top: 1px; font-weight: 900; font-size: clamp(0.7rem, 1.4vw, 0.95rem); line-height: 1; }
.fan.verlust .badge { color: var(--loss); }
.fan.gewinn .badge { color: var(--win); }
.legende { display: flex; gap: 16px; flex-wrap: wrap; margin: 16px 0 0; color: var(--muted); }
.legende > span { display: inline-flex; align-items: center; gap: 6px; }
.leg { display: inline-grid; place-items: center; width: 18px; height: 18px; border-radius: 5px; font-weight: 900; color: #000; font-size: 0.8rem; }
.leg.verlust { background: var(--loss); }
.leg.gewinn { background: var(--win); }
.leg.offen { background: #4b5568; }
.seite { display: grid; gap: 18px; }
.regler-label { display: flex; justify-content: space-between; font-weight: 700; margin-bottom: 12px; }
input[type='range'] { -webkit-appearance: none; appearance: none; width: 100%; height: 6px; border-radius: 999px; background: linear-gradient(90deg, var(--accent) var(--p), rgba(255, 255, 255, 0.12) var(--p)); outline-offset: 6px; }
input[type='range']::-webkit-slider-thumb { -webkit-appearance: none; width: 22px; height: 22px; border-radius: 50%; background: #fff; border: 4px solid var(--accent); cursor: pointer; transition: transform 0.2s var(--ease); }
input[type='range']::-webkit-slider-thumb:hover { transform: scale(1.15); }
input[type='range']::-moz-range-thumb { width: 16px; height: 16px; border-radius: 50%; background: #fff; border: 4px solid var(--accent); cursor: pointer; }
.ticks { display: flex; justify-content: space-between; margin: 10px 0 14px; color: var(--faint); }
.full { width: 100%; }
.gross { font-size: clamp(3rem, 8vw, 4.6rem); font-weight: 800; letter-spacing: -0.05em; line-height: 1; margin: 0; font-variant-numeric: tabular-nums; }
.von { color: var(--faint); font-size: 0.55em; letter-spacing: -0.02em; }
.unter { color: var(--muted); margin-bottom: 14px; }
.tipp { font-size: 1.1rem; margin: 0; }
.realitaet { margin-top: 18px; background: linear-gradient(135deg, rgba(143, 128, 255, 0.12), rgba(62, 230, 176, 0.05)); }
.zitat { font-size: clamp(1.2rem, 2.6vw, 1.6rem); font-weight: 700; letter-spacing: -0.02em; line-height: 1.35; max-width: 50ch; }
</style>
