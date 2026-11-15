<script setup lang="ts">
import { computed } from 'vue'
import { chf } from '../composables/format'

/**
 * Schlankes SVG-Liniendiagramm für den Guthabenverlauf.
 * `referenz` zeichnet eine gestrichelte Linie (eingezahltes Geld).
 */
const props = withDefaults(
  defineProps<{ werte: number[]; referenz?: number; label: string; hoehe?: number; anzahlGesamt?: number }>(),
  { hoehe: 240 },
)

const B = 640
const pad = { l: 44, r: 14, t: 14, b: 22 }
const uid = Math.random().toString(36).slice(2, 8)

const bereich = computed(() => {
  const all = props.werte.length ? [...props.werte] : [0]
  if (props.referenz !== undefined) all.push(props.referenz)
  const min = Math.min(0, ...all)
  let max = Math.max(...all) * 1.08
  if (max - min < 10) max = min + 10
  return { min, max }
})

/** x-Achse: fixe Länge (anzahlGesamt), damit die Linie beim Animieren «wächst». */
function x(i: number) {
  const n = Math.max(1, (props.anzahlGesamt ?? props.werte.length) - 1)
  return pad.l + (i / n) * (B - pad.l - pad.r)
}
function y(v: number) {
  const { min, max } = bereich.value
  return pad.t + (1 - (v - min) / (max - min)) * (props.hoehe - pad.t - pad.b)
}

const pfad = computed(() =>
  props.werte.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' '),
)
const flaeche = computed(() => {
  if (props.werte.length < 2) return ''
  const unten = y(bereich.value.min)
  return `${pfad.value} L${x(props.werte.length - 1).toFixed(1)},${unten} L${x(0)},${unten} Z`
})
const ticks = computed(() => {
  const { min, max } = bereich.value
  return [min, (min + max) / 2, max].map((v) => Math.round(v))
})
const letzter = computed(() => props.werte[props.werte.length - 1] ?? 0)
const trend = computed(() =>
  props.referenz !== undefined && letzter.value < props.referenz ? 'loss' : 'win',
)
const beschreibung = computed(() => {
  const w = props.werte
  if (!w.length) return `${props.label}: noch keine Daten.`
  return `${props.label}: Start CHF ${chf(w[0])}, aktuell CHF ${chf(letzter.value)}, Tiefstwert CHF ${chf(Math.min(...w))}, Höchstwert CHF ${chf(Math.max(...w))}.`
})
</script>

<template>
  <figure class="chart">
    <svg :viewBox="`0 0 ${B} ${hoehe}`" role="img" :aria-label="beschreibung" preserveAspectRatio="none">
      <defs>
        <linearGradient :id="`g-win-${uid}`" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stop-color="#3ee6b0" stop-opacity=".35" />
          <stop offset="1" stop-color="#3ee6b0" stop-opacity="0" />
        </linearGradient>
        <linearGradient :id="`g-loss-${uid}`" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stop-color="#ff7d8c" stop-opacity=".32" />
          <stop offset="1" stop-color="#ff7d8c" stop-opacity="0" />
        </linearGradient>
      </defs>
      <g class="grid-lines">
        <g v-for="t in ticks" :key="t">
          <line :x1="pad.l" :x2="B - pad.r" :y1="y(t)" :y2="y(t)" />
          <text :x="pad.l - 8" :y="y(t) + 4" text-anchor="end">{{ t }}</text>
        </g>
      </g>
      <line v-if="referenz !== undefined" class="ref" :x1="pad.l" :x2="B - pad.r" :y1="y(referenz)" :y2="y(referenz)" />
      <path v-if="flaeche" :d="flaeche" :fill="`url(#g-${trend}-${uid})`" />
      <path :d="pfad" :class="['line', trend]" />
      <circle v-if="werte.length" :cx="x(werte.length - 1)" :cy="y(letzter)" r="5" :class="['dot', trend]" />
    </svg>
    <figcaption class="small muted">
      <span class="legend-line" :class="trend" aria-hidden="true"></span> {{ label }}
      <template v-if="referenz !== undefined">
        <span class="sep">·</span><span class="legend-ref" aria-hidden="true"></span> Eingezahlt: CHF {{ chf(referenz, 0) }}
      </template>
    </figcaption>
  </figure>
</template>

<style scoped>
.chart { margin: 0; }
svg { width: 100%; height: auto; display: block; overflow: visible; }
.grid-lines line { stroke: rgba(255, 255, 255, 0.07); stroke-width: 1; vector-effect: non-scaling-stroke; }
.grid-lines text { fill: var(--faint); font-size: 12px; }
.ref { stroke: var(--warn); stroke-dasharray: 6 6; stroke-width: 1.5; vector-effect: non-scaling-stroke; opacity: 0.8; }
.line { fill: none; stroke-width: 2.5; stroke-linejoin: round; stroke-linecap: round; vector-effect: non-scaling-stroke; transition: stroke 0.4s; }
.line.win { stroke: var(--win); }
.line.loss { stroke: var(--loss); }
.dot { stroke: var(--bg); stroke-width: 3; vector-effect: non-scaling-stroke; }
.dot.win { fill: var(--win); }
.dot.loss { fill: var(--loss); }
figcaption { margin-top: 8px; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.sep { margin: 0 4px; }
.legend-line { display: inline-block; width: 18px; height: 3px; border-radius: 2px; background: var(--win); }
.legend-line.loss { background: var(--loss); }
.legend-ref { display: inline-block; width: 18px; border-top: 2px dashed var(--warn); }
</style>
