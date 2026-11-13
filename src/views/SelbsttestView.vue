<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { angebote } from '../data/help'
import { antwortOptionen, auswerten, fragen, selbsttestTexte as T } from '../data/selftest'

// Antworten nur im Speicher dieser Seite – kein Speichern, kein Senden.
const schritt = ref(-1) // -1 = Intro, fragen.length = Ergebnis
const antworten = ref<number[]>([])
const fokusZiel = ref<HTMLElement | null>(null)

const ergebnis = computed(() => auswerten(antworten.value))
const fortschritt = computed(() => Math.max(0, Math.min(schritt.value, fragen.length)) / fragen.length)

function fokus() {
  nextTick(() => fokusZiel.value?.focus())
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
  <header class="page-head">
    <h1>{{ T.titel }}</h1>
    <p>{{ T.intro }}</p>
  </header>

  <div class="card test">
    <div
      v-if="schritt >= 0"
      class="progress"
      role="progressbar"
      aria-label="Fortschritt"
      :aria-valuenow="Math.round(fortschritt * 100)"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <span :style="{ width: fortschritt * 100 + '%' }"></span>
    </div>

    <!-- Intro -->
    <div v-if="schritt < 0">
      <p class="datenschutz">🔒 {{ T.datenschutz }}</p>
      <button class="btn btn-primary btn-lg" @click="starten">{{ T.start }}</button>
    </div>

    <!-- Frage -->
    <div v-else-if="schritt < fragen.length" :key="schritt" class="frage">
      <p class="small muted">{{ T.frage(schritt + 1, fragen.length) }}</p>
      <h2 ref="fokusZiel" tabindex="-1">{{ fragen[schritt] }}</h2>
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

    <!-- Ergebnis -->
    <div v-else class="ergebnis">
      <h2 ref="fokusZiel" tabindex="-1">{{ T.ergebnisTitel }}</h2>
      <div class="ampel" :class="ergebnis.stufe">
        <span class="ampel-icon" aria-hidden="true">{{ ergebnis.icon }}</span>
        <div>
          <strong class="ampel-label">Stufe {{ ergebnis.label }}</strong>
          <p>{{ ergebnis.text }}</p>
        </div>
      </div>

      <section v-if="ergebnis.hilfeProminent" class="hilfe-prominent" aria-labelledby="sofort-hilfe">
        <h3 id="sofort-hilfe">Direkt Hilfe finden</h3>
        <ul>
          <li v-for="a in angebote.slice(0, 3)" :key="a.url">
            <a :href="a.url" target="_blank" rel="noopener noreferrer" class="btn btn-warn">{{ a.name }}<span class="sr-only"> (öffnet in neuem Tab)</span></a>
          </li>
        </ul>
      </section>

      <h3>{{ T.tippsTitel }}</h3>
      <ul class="tipps">
        <li v-for="t in ergebnis.tipps" :key="t">{{ t }}</li>
      </ul>

      <div class="btn-row">
        <RouterLink to="/hilfe" class="btn btn-primary">{{ T.hilfe }}</RouterLink>
        <button class="btn btn-ghost" @click="starten">↺ {{ T.nochmals }}</button>
      </div>
    </div>

    <p class="disclaimer small">
      ⓘ Dieser Kurztest ist keine Diagnose.
      <a :href="T.disclaimerUrl" target="_blank" rel="noopener noreferrer">{{ T.disclaimer.replace('Dieser Kurztest ist keine Diagnose. ', '') }}<span class="sr-only"> (öffnet in neuem Tab)</span></a>
    </p>
  </div>
</template>

<style scoped>
.test { max-width: 720px; margin: 0 auto; }
.progress { height: 8px; background: var(--bg-2); border-radius: 999px; overflow: hidden; margin-bottom: 18px; }
.progress span { display: block; height: 100%; background: var(--accent); transition: width .25s; }
.datenschutz { background: var(--bg-2); border-radius: 10px; padding: 12px; }
.frage h2 { font-size: clamp(1.3rem, 3.5vw, 1.8rem); min-height: 3em; outline: none; }
.optionen { display: grid; gap: 10px; margin: 16px 0; }
@media (min-width: 640px) { .optionen { grid-template-columns: repeat(4, 1fr); } }
.option { background: var(--card-2); border: 2px solid var(--line); color: var(--text); font: inherit; font-weight: 700; padding: 14px; border-radius: 12px; cursor: pointer; min-height: 52px; }
.option:hover { border-color: var(--accent); }
.option.aktiv { border-color: var(--accent); background: rgba(61,255,143,.15); }
.ergebnis h2 { outline: none; }
.ampel { display: flex; gap: 16px; align-items: center; border-radius: 14px; padding: 16px; border: 2px solid; margin-bottom: 16px; }
.ampel p { margin: 0; font-size: 1.1rem; }
.ampel-label { display: block; font-size: 0.85rem; text-transform: uppercase; letter-spacing: .05em; }
.ampel-icon { flex: none; display: grid; place-items: center; width: 52px; height: 52px; border-radius: 50%; font-weight: 900; font-size: 1.4rem; color: #000; }
.ampel.gruen { border-color: var(--win); background: rgba(61,255,143,.1); }
.ampel.gruen .ampel-icon { background: var(--win); }
.ampel.gelb { border-color: var(--warn); background: rgba(255,211,77,.1); }
.ampel.gelb .ampel-icon { background: var(--warn); }
.ampel.rot { border-color: var(--loss); background: rgba(255,107,122,.12); }
.ampel.rot .ampel-icon { background: var(--loss); }
.hilfe-prominent { background: #2a2614; border-radius: 12px; padding: 14px; margin-bottom: 16px; }
.hilfe-prominent ul { list-style: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap; gap: 8px; }
.tipps { padding-left: 20px; }
.tipps li { margin-bottom: 6px; }
.disclaimer { margin: 20px 0 0; padding-top: 14px; border-top: 1px solid var(--line); color: var(--muted); }
</style>
