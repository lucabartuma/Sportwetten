<script setup lang="ts">
import { ref } from 'vue'
import QuelleLink from '../components/QuelleLink.vue'
import { fakten, faktenTexte as T, mythen, warnsignale } from '../data/facts'
import { scrolleZu } from '../composables/navigation'

const umgedreht = ref<boolean[]>(mythen.map(() => false))
</script>

<template>
  <section id="fakten" class="section" aria-labelledby="fakten-titel">
    <div class="wrap">
      <header class="section-head">
        <p class="kicker" v-reveal>Zahlen</p>
        <h2 id="fakten-titel" v-reveal="60">{{ T.titel }}</h2>
        <p v-reveal="120">{{ T.intro }}</p>
      </header>

      <ul class="grid grid-3 plain-list">
        <li v-for="(f, i) in fakten" :key="f.id" class="card fakt" v-reveal="(i % 3) * 90">
          <p class="wert">{{ f.wert }}</p>
          <p class="text">{{ f.text }}</p>
          <QuelleLink :quelle="f.quelle" :url="f.url" :stand="f.stand" />
        </li>
      </ul>

      <div class="block">
        <header class="section-head">
          <h2 class="h-sm" v-reveal>{{ T.mythenTitel }}</h2>
          <p v-reveal="60">{{ T.mythenHinweis }}</p>
        </header>
        <ul class="grid grid-3 plain-list">
          <li v-for="(m, i) in mythen" :key="i" v-reveal="(i % 3) * 90">
            <button class="flip" :class="{ umgedreht: umgedreht[i] }" :aria-pressed="umgedreht[i]" @click="umgedreht[i] = !umgedreht[i]">
              <span class="flip-inner">
                <span class="seite vorne" :aria-hidden="umgedreht[i]">
                  <span class="tag mythos">✗ Mythos</span>
                  <span class="text">{{ m.mythos }}</span>
                  <span class="small muted dreh">Umdrehen ↻</span>
                </span>
                <span class="seite hinten" :aria-hidden="!umgedreht[i]">
                  <span class="tag fakt-tag">✓ Fakt</span>
                  <span class="text">{{ m.fakt }}</span>
                </span>
              </span>
            </button>
          </li>
        </ul>
      </div>

      <div class="card warn-card block" v-reveal>
        <div>
          <h2 class="h-sm">{{ T.warnsignaleTitel }}</h2>
          <p class="muted">Erkennst Du Dich oder jemanden in Deinem Umfeld wieder?</p>
          <a href="#selbsttest" class="btn btn-primary" @click.prevent="scrolleZu('selbsttest')">Selbsttest machen <span class="arrow" aria-hidden="true">→</span></a>
        </div>
        <ul class="plain-list warn">
          <li v-for="w in warnsignale" :key="w"><span class="w-icon" aria-hidden="true">!</span>{{ w }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.fakt { display: flex; flex-direction: column; gap: 8px; transition: transform 0.5s var(--ease), border-color 0.5s var(--ease); }
.fakt:hover { transform: translateY(-4px); border-color: var(--border-strong); }
.fakt .quelle { margin-top: auto; }
.wert { font-size: clamp(2.6rem, 5.5vw, 3.6rem); font-weight: 800; letter-spacing: -0.05em; line-height: 1; margin: 0; background: linear-gradient(100deg, var(--accent), var(--accent-2)); -webkit-background-clip: text; background-clip: text; color: transparent; }
.fakt .text { color: #cfd6e2; }
.block { margin-top: clamp(56px, 8vw, 96px); }
.h-sm { font-size: clamp(1.6rem, 3.4vw, 2.4rem); }
.flip { width: 100%; padding: 0; border: 0; background: none; color: var(--text); font: inherit; cursor: pointer; perspective: 1200px; text-align: left; border-radius: var(--radius); }
.flip-inner { display: grid; min-height: 210px; transition: transform 0.8s var(--ease); transform-style: preserve-3d; }
.flip.umgedreht .flip-inner { transform: rotateY(180deg); }
.seite { grid-area: 1 / 1; display: flex; flex-direction: column; gap: 12px; padding: 22px; border-radius: var(--radius); border: 1px solid var(--border); backface-visibility: hidden; -webkit-backface-visibility: hidden; }
.vorne { background: linear-gradient(180deg, var(--surface-strong), var(--surface)); }
.hinten { background: linear-gradient(150deg, rgba(62, 230, 176, 0.16), rgba(62, 230, 176, 0.05)); border-color: rgba(62, 230, 176, 0.4); transform: rotateY(180deg); }
.flip:hover .vorne { border-color: var(--border-strong); }
.seite .text { font-size: 1.12rem; font-weight: 700; letter-spacing: -0.01em; line-height: 1.4; }
.dreh { margin-top: auto; }
.tag { align-self: flex-start; font-size: 0.75rem; font-weight: 800; padding: 3px 10px; border-radius: 999px; }
.tag.mythos { background: rgba(255, 125, 140, 0.16); color: var(--loss); }
.tag.fakt-tag { background: rgba(62, 230, 176, 0.18); color: var(--accent); }
.warn-card { display: grid; gap: 24px; align-items: center; }
@media (min-width: 860px) { .warn-card { grid-template-columns: 1fr 1fr; } }
.warn li { display: flex; align-items: center; gap: 14px; padding: 14px 0; border-bottom: 1px solid var(--border); font-weight: 600; }
.warn li:last-child { border-bottom: 0; }
.w-icon { display: grid; place-items: center; width: 28px; height: 28px; border-radius: 50%; background: rgba(255, 201, 92, 0.15); color: var(--warn); font-weight: 900; flex: none; }
</style>
