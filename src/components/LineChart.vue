<script setup lang="ts">
import { computed } from 'vue'
import { chf } from '../composables/format'

/**
 * Schlankes SVG-Liniendiagramm für den Guthabenverlauf.
 * `referenz` zeichnet eine gestrichelte Linie (z. B. Startguthaben).
 */
const props = withDefaults(
  defineProps<{ werte: number[]; referenz?: number; label: string; hoehe?: number }>(),
  { hoehe: 220 },
)

const B = 600
const pad = { l: 48, r: 12, t: 12, b: 24 }

const bereich = computed(() => {
  const all = props.werte.length ? [...props.werte] : [0]
  if (props.referenz !== undefined) all.push(props.referenz)
  let min = Math.min(0, ...all)
  let max = Math.max(...all)
  if (max - min < 10) max = min + 10
  return { min, max }
})

function x(i: number) {
  const n = Math.max(1, props.werte.length - 1)
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
  return `${pfad.value} L${x(props.werte.length - 1).toFixed(1)},${y(bereich.value.min)} L${x(0)},${y(bereich.value.min)} Z`
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
  return `${props.label}: ${w.length - 1} Schritte, Start CHF ${chf(w[0])}, aktuell CHF ${chf(letzter.value)}, Tiefstwert CHF ${chf(Math.min(...w))}, Höchstwert CHF ${chf(Math.max(...w))}.`
})
</script>

<template>
  <figure class="chart">
    <svg :viewBox="`0 0 ${B} ${hoehe}`" role="img" :aria-label="beschreibung" preserveAspectRatio="none">
      <g class="grid-lines">
        <g v-for="t in ticks" :key="t">
          <line :x1="pad.l" :x2="B - pad.r" :y1="y(t)" :y2="y(t)" />
          <text :x="pad.l - 6" :y="y(t) + 4" text-anchor="end">{{ t }}</text>
        </g>
      </g>
      <line
        v-if="referenz !== undefined"
        class="ref"
        :x1="pad.l"
        :x2="B - pad.r"
        :y1="y(referenz)"
        :y2="y(referenz)"
      />
      <path v-if="flaeche" :d="flaeche" :class="['area', trend]" />
      <path :d="pfad" :class="['line', trend]" />
      <circle v-if="werte.length" :cx="x(werte.length - 1)" :cy="y(letzter)" r="5" :class="['dot', trend]" />
    </svg>
    <figcaption class="small muted">
      <span class="legend-line" aria-hidden="true"></span> {{ label }}
      <template v-if="referenz !== undefined">
        · <span class="legend-ref" aria-hidden="true"></span> Eingezahlt (CHF {{ chf(referenz, 0) }})
      </template>
    </figcaption>
  </figure>
</template>

<style scoped>
.chart { margin: 0; }
svg { width: 100%; height: auto; display: block; overflow: visible; }
.grid-lines line { stroke: var(--line); stroke-width: 1; }
.grid-lines text { fill: var(--muted); font-size: 12px; }
.ref { stroke: var(--warn); stroke-dasharray: 6 5; stroke-width: 1.5; }
.line { fill: none; stroke-width: 3; stroke-linejoin: round; vector-effect: non-scaling-stroke; }
.line.win { stroke: var(--win); }
.line.loss { stroke: var(--loss); }
.area.win { fill: rgba(61, 255, 143, 0.12); }
.area.loss { fill: rgba(255, 107, 122, 0.12); }
.dot.win { fill: var(--win); }
.dot.loss { fill: var(--loss); }
.legend-line, .legend-ref { display: inline-block; width: 18px; height: 0; vertical-align: middle; border-top: 3px solid var(--accent); }
.legend-ref { border-top: 2px dashed var(--warn); }
</style>
