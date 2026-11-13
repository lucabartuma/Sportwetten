<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import QuelleLink from '../components/QuelleLink.vue'
import { fakten, faktenTexte as T, mythen, warnsignale } from '../data/facts'

const umgedreht = ref<boolean[]>(mythen.map(() => false))
</script>

<template>
  <header class="page-head">
    <h1>{{ T.titel }}</h1>
    <p>{{ T.intro }}</p>
  </header>

  <ul class="grid grid-3 karten">
    <li v-for="f in fakten" :key="f.id" class="card fakt">
      <p class="wert">{{ f.wert }}</p>
      <p>{{ f.text }}</p>
      <QuelleLink :quelle="f.quelle" :url="f.url" :stand="f.stand" />
    </li>
  </ul>

  <section class="section" aria-labelledby="mythen">
    <h2 id="mythen">{{ T.mythenTitel }}</h2>
    <p class="muted">{{ T.mythenHinweis }}</p>
    <ul class="grid grid-3 karten">
      <li v-for="(m, i) in mythen" :key="i">
        <button
          class="flip"
          :class="{ umgedreht: umgedreht[i] }"
          :aria-pressed="umgedreht[i]"
          @click="umgedreht[i] = !umgedreht[i]"
        >
          <span class="flip-inner">
            <span class="seite vorne" :aria-hidden="umgedreht[i]">
              <span class="tag mythos">✗ Mythos</span>
              <span class="text">{{ m.mythos }}</span>
              <span class="small muted">Umdrehen ↻</span>
            </span>
            <span class="seite hinten" :aria-hidden="!umgedreht[i]">
              <span class="tag fakt-tag">✓ Fakt</span>
              <span class="text">{{ m.fakt }}</span>
            </span>
          </span>
        </button>
      </li>
    </ul>
  </section>

  <section class="section grid grid-2">
    <div class="card">
      <h2>{{ T.warnsignaleTitel }}</h2>
      <ul class="warn">
        <li v-for="w in warnsignale" :key="w"><span aria-hidden="true">⚠️</span> {{ w }}</li>
      </ul>
      <RouterLink to="/selbsttest" class="btn btn-primary">Selbsttest machen</RouterLink>
    </div>
    <div class="card">
      <h2>{{ T.rechtlichTitel }}</h2>
      <p>{{ T.rechtlich }}</p>
      <QuelleLink :quelle="T.rechtlichQuelle.label.replace('Quelle: ', '')" :url="T.rechtlichQuelle.url" />
      <RouterLink to="/hilfe" class="btn btn-ghost">Hilfe & Infos</RouterLink>
    </div>
  </section>
</template>

<style scoped>
.karten { list-style: none; padding: 0; margin: 0; }
.fakt { display: flex; flex-direction: column; }
.fakt .quelle { margin-top: auto; margin-bottom: 0; }
.wert { font-size: clamp(2.4rem, 6vw, 3.2rem); font-weight: 900; color: var(--accent); margin: 0; line-height: 1.1; }
.flip { width: 100%; min-height: 190px; padding: 0; border: 0; background: none; color: var(--text); font: inherit; cursor: pointer; perspective: 900px; text-align: left; }
.flip-inner { display: grid; height: 100%; min-height: 190px; transition: transform .5s; transform-style: preserve-3d; }
.flip.umgedreht .flip-inner { transform: rotateY(180deg); }
.seite { grid-area: 1 / 1; display: flex; flex-direction: column; gap: 10px; padding: 18px; border-radius: var(--radius); border: 1px solid var(--line); backface-visibility: hidden; }
.vorne { background: var(--card); }
.hinten { background: #13301f; border-color: var(--accent); transform: rotateY(180deg); }
.text { font-size: 1.1rem; font-weight: 700; }
.tag { align-self: flex-start; font-size: .78rem; font-weight: 800; padding: 2px 10px; border-radius: 999px; }
.tag.mythos { background: var(--loss); color: #2a0006; }
.tag.fakt-tag { background: var(--accent); color: var(--accent-ink); }
.flip:hover .vorne { border-color: var(--accent); }
.warn { list-style: none; padding: 0; }
.warn li { padding: 8px 0; border-bottom: 1px solid var(--line); }
</style>
