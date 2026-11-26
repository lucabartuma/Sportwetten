<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { simulationConfig as cfg } from '../config/simulation'
import { hero } from '../config/texts'
import { faktById, kernkennzahl } from '../data/facts'
import { scrolleZu } from '../composables/navigation'
import { chf, prozent } from '../composables/format'

const rueckzahlung = 100 / (1 + cfg.marge)
const marge = faktById('marge')
const studie = faktById(kernkennzahl.faktId)
const gestartet = ref(false)
onMounted(() => setTimeout(() => (gestartet.value = true), 350))
</script>

<template>
  <section id="start" class="section hero" aria-labelledby="hero-titel">
    <div class="wrap hero-grid">
      <div class="text">
        <p class="kicker" v-reveal>{{ hero.kicker }}</p>
        <h1 id="hero-titel" v-reveal="80">
          {{ hero.headline }}<br />
          <span class="grad">{{ hero.headlineAkzent }}</span>
        </h1>
        <p class="lede" v-reveal="160">{{ hero.lede }}</p>
        <div class="btn-row" v-reveal="240">
          <a href="#simulator" class="btn btn-primary btn-lg" @click.prevent="scrolleZu('simulator')">{{ hero.cta }} <span class="arrow" aria-hidden="true">→</span></a>
          <a href="#hintergrund" class="btn btn-ghost btn-lg" @click.prevent="scrolleZu('hintergrund')">{{ hero.ctaSekundaer }}</a>
        </div>
      </div>

      <aside class="card rechnung" v-reveal="300" aria-label="Die Rechnung in Kürze">
        <p class="label">Die Rechnung</p>
        <p class="satz">Von <strong>CHF 100</strong> Einsatz kommen langfristig im Schnitt zurück:</p>
        <div class="balken" role="img" :aria-label="`CHF ${chf(rueckzahlung)} von CHF 100`">
          <span class="fill" :style="{ transform: `scaleX(${gestartet ? rueckzahlung / 100 : 0})` }"></span>
          <span class="wert">CHF {{ chf(rueckzahlung) }}</span>
        </div>
        <p class="small muted">Bei einer Marge von {{ prozent(cfg.marge) }} pro Tipp (wie im Simulator).</p>
        <div class="stats">
          <div>
            <span class="zahl">106 %</span>
            <span class="small muted">ergeben die Quoten eines Spiels zusammen</span>
          </div>
          <div>
            <span class="zahl">{{ kernkennzahl.wert }}</span>
            <span class="small muted">{{ kernkennzahl.wertText }}</span>
          </div>
        </div>
        <p v-if="marge && studie" class="quelle">
          Quellen: <a :href="marge.url" target="_blank" rel="noopener noreferrer">{{ marge.quelle }}</a> ·
          <a :href="studie.url" target="_blank" rel="noopener noreferrer">Swisslos, Geschäftsbericht 2025</a>
        </p>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.hero { padding-top: clamp(48px, 9vw, 120px); min-height: calc(100svh - var(--header-h)); display: flex; align-items: center; }
.hero-grid { display: grid; gap: clamp(32px, 5vw, 64px); align-items: center; }
@media (min-width: 980px) { .hero-grid { grid-template-columns: 1.35fr 1fr; } }
.lede { font-size: clamp(1.08rem, 1.9vw, 1.3rem); color: var(--muted); max-width: 40ch; margin: 8px 0 32px; }
.rechnung { position: relative; overflow: hidden; }
.rechnung::before { content: ''; position: absolute; inset: -40% -40% auto auto; width: 260px; height: 260px; background: radial-gradient(circle, rgba(143, 128, 255, 0.35), transparent 65%); pointer-events: none; }
.label { font-size: 0.78rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--accent-2); margin-bottom: 10px; }
.satz { font-size: 1.1rem; }
.balken { position: relative; height: 52px; border-radius: 14px; background: rgba(255, 125, 140, 0.16); border: 1px solid rgba(255, 125, 140, 0.35); overflow: hidden; margin-bottom: 10px; }
.fill { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(62, 230, 176, 0.55), rgba(62, 230, 176, 0.85)); transform-origin: left; transition: transform 1.6s var(--ease); }
.wert { position: relative; display: flex; align-items: center; height: 100%; padding-left: 16px; font-weight: 800; font-size: 1.2rem; color: #04130d; }
.stats { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 18px 0 14px; }
.stats div { display: flex; flex-direction: column; gap: 2px; padding: 14px; border-radius: var(--radius-sm); background: rgba(255, 255, 255, 0.04); border: 1px solid var(--border); }
.zahl { font-size: 1.7rem; font-weight: 800; letter-spacing: -0.03em; }
</style>
