<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { angebote } from '../data/help'
import { antwortOptionen, auswerten, fragen, selbsttestTexte as T } from '../data/selftest'
import { scrolleZu } from '../composables/navigation'

// Antworten nur im Speicher dieser Seite – kein Speichern, kein Senden.
const schritt = ref(-1) // -1 = Intro, fragen.length = Ergebnis
const antworten = ref<number[]>([])
const fokusZiel = ref<HTMLElement | null>(null)

const ergebnis = computed(() => auswerten(antworten.value))
const fortschritt = computed(() => Math.max(0, Math.min(schritt.value, fragen.length)) / fragen.length)

function fokus() {
  nextTick(() => fokusZiel.value?.focus({ preventScroll: true }))
}
function starten() {
  antworten.value = []
  schritt.value = 0
  fokus()
}
function antworte(punkte: number) {
  antworten.value[schritt.value] = punkte
  schritt.value++
  fokus()
}
function zurueck() {
  if (schritt.value > 0) schritt.value--
  fokus()
}
</script>

<template>
  <section id="selbsttest" class="section" aria-labelledby="test-titel">
    <div class="wrap test-grid">
      <header class="section-head">
        <p class="kicker" v-reveal>Check</p>
        <h2 id="test-titel" v-reveal="60">{{ T.titel }}</h2>
        <p v-reveal="120">{{ T.intro }}</p>
        <p class="datenschutz small" v-reveal="160"><span aria-hidden="true">🔒</span> {{ T.datenschutz }}</p>
      </header>

      <div class="card test" v-reveal="120">
        <div v-if="schritt >= 0" class="progress" role="progressbar" aria-label="Fortschritt" :aria-valuenow="Math.round(fortschritt * 100)" aria-valuemin="0" aria-valuemax="100">
          <span :style="{ transform: `scaleX(${fortschritt})` }"></span>
        </div>

        <Transition name="fade" mode="out-in">
          <div v-if="schritt < 0" key="intro" class="intro">
            <p class="gross">9 Fragen · 1 Minute</p>
            <p class="muted">Ehrlich antworten lohnt sich – niemand ausser Dir sieht das Ergebnis.</p>
            <button class="btn btn-primary btn-lg" @click="starten">{{ T.start }} <span class="arrow" aria-hidden="true">→</span></button>
          </div>

          <div v-else-if="schritt < fragen.length" :key="'f' + schritt" class="frage">
            <p class="small muted">{{ T.frage(schritt + 1, fragen.length) }}</p>
            <h3 ref="fokusZiel" tabindex="-1">{{ fragen[schritt] }}</h3>
            <div class="optionen" role="group" :aria-label="fragen[schritt]">
              <button
                v-for="o in antwortOptionen"
                :key="o.label"
                class="option"
                :class="{ aktiv: antworten[schritt] === o.punkte }"
                :aria-pressed="antworten[schritt] === o.punkte"
                @click="antworte(o.punkte)"
              >{{ o.label }}</button>
            </div>
            <button v-if="schritt > 0" class="btn btn-ghost" @click="zurueck">← {{ T.zurueck }}</button>
          </div>

          <div v-else key="ergebnis" class="ergebnis">
            <h3 ref="fokusZiel" tabindex="-1">{{ T.ergebnisTitel }}</h3>
            <div class="ampel" :class="ergebnis.stufe">
              <span class="ampel-icon" aria-hidden="true">{{ ergebnis.icon }}</span>
              <div>
                <strong class="ampel-label">Stufe {{ ergebnis.label }}</strong>
                <p>{{ ergebnis.text }}</p>
              </div>
            </div>

            <div v-if="ergebnis.hilfeProminent" class="hilfe-prominent">
              <p class="label">Direkt Hilfe finden</p>
              <ul class="plain-list links">
                <li v-for="a in angebote.slice(0, 3)" :key="a.url">
                  <a :href="a.url" target="_blank" rel="noopener noreferrer" class="btn btn-primary">{{ a.name }}<span class="sr-only"> (öffnet in neuem Tab)</span></a>
                </li>
              </ul>
            </div>

            <p class="label">{{ T.tippsTitel }}</p>
            <ul class="tipps">
              <li v-for="t in ergebnis.tipps" :key="t">{{ t }}</li>
            </ul>
            <div class="btn-row">
              <a href="#hilfe" class="btn btn-primary" @click.prevent="scrolleZu('hilfe')">{{ T.hilfe }} <span class="arrow" aria-hidden="true">→</span></a>
              <button class="btn btn-ghost" @click="starten">↺ {{ T.nochmals }}</button>
            </div>
          </div>
        </Transition>

        <p class="disclaimer small">
          <span aria-hidden="true">ⓘ</span> Dieser Kurztest ist keine Diagnose.
          <a :href="T.disclaimerUrl" target="_blank" rel="noopener noreferrer">{{ T.disclaimer.replace('Dieser Kurztest ist keine Diagnose. ', '') }}<span class="sr-only"> (öffnet in neuem Tab)</span></a>
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.test-grid { display: grid; gap: 24px; align-items: start; }
@media (min-width: 960px) { .test-grid { grid-template-columns: 0.9fr 1.3fr; } }
.datenschutz { padding: 12px 14px; border-radius: var(--radius-sm); background: rgba(62, 230, 176, 0.07); border: 1px solid rgba(62, 230, 176, 0.25); color: #cfe9df !important; }
.test { position: relative; overflow: hidden; min-height: 380px; display: flex; flex-direction: column; }
.progress { position: absolute; top: 0; left: 0; right: 0; height: 4px; background: rgba(255, 255, 255, 0.06); }
.progress span { display: block; height: 100%; background: linear-gradient(90deg, var(--accent), var(--accent-2)); transform-origin: left; transition: transform 0.6s var(--ease); }
.gross { font-size: clamp(1.6rem, 3.4vw, 2.2rem); font-weight: 800; letter-spacing: -0.03em; margin-bottom: 8px; }
.intro { padding-top: 10px; }
.frage h3 { font-size: clamp(1.35rem, 3vw, 1.9rem); min-height: 2.6em; outline: none; letter-spacing: -0.025em; line-height: 1.25; margin-top: 6px; }
.optionen { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 18px 0; }
@media (min-width: 640px) { .optionen { grid-template-columns: repeat(4, 1fr); } }
.option { background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-strong); color: var(--text); font: inherit; font-weight: 700; padding: 16px 12px; border-radius: var(--radius-sm); cursor: pointer; min-height: 56px; transition: border-color 0.3s var(--ease), background 0.3s var(--ease), transform 0.3s var(--ease); }
.option:hover { border-color: var(--accent); transform: translateY(-2px); }
.option.aktiv { border-color: var(--accent); background: rgba(62, 230, 176, 0.12); }
.ergebnis h3 { outline: none; font-size: 1.5rem; }
.ampel { display: flex; gap: 16px; align-items: center; border-radius: var(--radius-sm); padding: 16px; border: 1px solid; margin-bottom: 18px; }
.ampel p { margin: 0; font-size: 1.08rem; }
.ampel-label { display: block; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.1em; }
.ampel-icon { flex: none; display: grid; place-items: center; width: 52px; height: 52px; border-radius: 50%; font-weight: 900; font-size: 1.3rem; color: #0b0b0b; }
.ampel.gruen { border-color: var(--win); background: rgba(62, 230, 176, 0.08); }
.ampel.gruen .ampel-icon { background: var(--win); }
.ampel.gelb { border-color: var(--warn); background: rgba(255, 201, 92, 0.08); }
.ampel.gelb .ampel-icon { background: var(--warn); }
.ampel.rot { border-color: var(--loss); background: rgba(255, 125, 140, 0.1); }
.ampel.rot .ampel-icon { background: var(--loss); }
.label { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--accent-2); margin: 0 0 10px; }
.hilfe-prominent { padding: 16px; border-radius: var(--radius-sm); background: rgba(255, 201, 92, 0.07); border: 1px solid rgba(255, 201, 92, 0.3); margin-bottom: 18px; }
.links { display: flex; flex-wrap: wrap; gap: 8px; }
.tipps { padding-left: 20px; color: #cfd6e2; }
.tipps li { margin-bottom: 6px; }
.disclaimer { margin: auto 0 0; padding-top: 18px; border-top: 1px solid var(--border); color: var(--muted); }
</style>
