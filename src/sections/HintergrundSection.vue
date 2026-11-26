<script setup lang="ts">
import { ref } from 'vue'
import { artikel } from '../data/article'
import { faktById } from '../data/facts'
import { tricks, tricksTexte } from '../data/tricks'

const trickListe = Object.values(tricks)
const offen = ref<Record<string, boolean>>({})
</script>

<template>
  <section id="hintergrund" class="section" aria-labelledby="artikel-titel">
    <div class="wrap">
      <article class="artikel">
        <header class="artikel-head">
          <div class="sticky">
            <p class="kicker" v-reveal>{{ artikel.kicker }}</p>
            <h2 id="artikel-titel" v-reveal="60">{{ artikel.titel }}</h2>
            <p class="lede" v-reveal="120">{{ artikel.lede }}</p>
            <p class="pill" v-reveal="160">⏱ {{ artikel.lesezeit }}</p>
          </div>
        </header>

        <div class="absaetze">
          <section v-for="(a, i) in artikel.absaetze" :key="a.titel" class="absatz" v-reveal>
            <h3><span class="nr" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>{{ a.titel }}</h3>
            <p v-for="(t, k) in a.text" :key="k">{{ t }}</p>
            <blockquote v-if="a.zitat">{{ a.zitat }}</blockquote>
            <p v-if="a.quellen?.length || a.link" class="quelle">
              Quellen:
              <template v-for="(id, k) in a.quellen ?? []" :key="id">
                <template v-if="faktById(id)">
                  <a :href="faktById(id)!.url" target="_blank" rel="noopener noreferrer">{{ faktById(id)!.quelle }}</a><template v-if="k < (a.quellen?.length ?? 0) - 1 || a.link"> · </template>
                </template>
              </template>
              <a v-if="a.link" :href="a.link.url" target="_blank" rel="noopener noreferrer">{{ a.link.label }}</a>
            </p>
          </section>
        </div>
      </article>

      <div class="tricks">
        <header class="section-head">
          <h2 class="h-sm" v-reveal>{{ tricksTexte.titel }}</h2>
          <p v-reveal="60">{{ tricksTexte.intro }}</p>
        </header>
        <ul class="grid grid-3 plain-list">
          <li v-for="(t, i) in trickListe" :key="t.id" v-reveal="i * 90">
            <div class="card trick" :class="{ offen: offen[t.id] }">
              <p class="tag">{{ offen[t.id] ? tricksTexte.wahrheit : tricksTexte.werbung }}</p>
              <Transition name="fade" mode="out-in">
                <div v-if="!offen[t.id]" key="w" class="werbung">
                  <h3>{{ t.popupTitel }}</h3>
                  <p>{{ t.popupText }}</p>
                </div>
                <div v-else key="a" :id="`trick-${t.id}`">
                  <p>{{ t.aufloesung }}</p>
                </div>
              </Transition>
              <button
                class="btn btn-ghost"
                :aria-expanded="!!offen[t.id]"
                :aria-controls="`trick-${t.id}`"
                @click="offen[t.id] = !offen[t.id]"
              >{{ offen[t.id] ? 'Zurück zur Werbung' : tricksTexte.aufdecken }}</button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.artikel { display: grid; gap: clamp(24px, 5vw, 72px); }
@media (min-width: 960px) {
  .artikel { grid-template-columns: 0.9fr 1.3fr; }
  .sticky { position: sticky; top: calc(var(--header-h) + 32px); }
}
.lede { font-size: clamp(1.05rem, 1.8vw, 1.22rem); color: var(--muted); }
.absatz { padding-bottom: 28px; margin-bottom: 28px; border-bottom: 1px solid var(--border); }
.absatz:last-child { border-bottom: 0; }
.absatz h3 { font-size: clamp(1.25rem, 2.4vw, 1.55rem); display: flex; gap: 14px; align-items: baseline; }
.nr { font-size: 0.85rem; font-weight: 800; color: var(--accent); font-variant-numeric: tabular-nums; letter-spacing: 0.05em; }
.absatz p { color: #cfd6e2; font-size: 1.05rem; max-width: 62ch; }
blockquote { margin: 22px 0; padding: 18px 22px; border-left: 3px solid var(--accent-2); border-radius: 0 var(--radius-sm) var(--radius-sm) 0; background: rgba(143, 128, 255, 0.08); font-size: clamp(1.15rem, 2.2vw, 1.4rem); font-weight: 700; letter-spacing: -0.015em; line-height: 1.4; }
.tricks { margin-top: clamp(64px, 9vw, 120px); }
.h-sm { font-size: clamp(1.6rem, 3.4vw, 2.4rem); }
.trick { display: flex; flex-direction: column; gap: 10px; height: 100%; min-height: 250px; transition: border-color 0.5s var(--ease), background 0.5s var(--ease); }
.trick .btn { margin-top: auto; align-self: flex-start; }
.trick:not(.offen) { background: linear-gradient(150deg, rgba(143, 128, 255, 0.22), rgba(62, 230, 176, 0.1)); border-color: rgba(143, 128, 255, 0.35); }
.trick.offen { border-color: rgba(255, 201, 92, 0.4); background: rgba(255, 201, 92, 0.06); }
.tag { margin: 0; font-size: 0.72rem; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); }
.trick.offen .tag { color: var(--warn); }
.werbung h3 { font-size: 1.5rem; }
</style>
