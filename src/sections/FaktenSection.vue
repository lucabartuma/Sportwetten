<script setup lang="ts">
import { ref } from 'vue'
import QuelleLink from '../components/QuelleLink.vue'
import { fakten, faktenTexte as T, mythen, skala } from '../data/facts'
import { scrolleZu } from '../composables/navigation'

const umgedreht = ref<boolean[]>(mythen.map(() => false))
const stufe = ref(0)
function taste(e: KeyboardEvent) {
  const n = skala.stufen.length
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') stufe.value = (stufe.value + 1) % n
  else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') stufe.value = (stufe.value - 1 + n) % n
  else return
  e.preventDefault()
  ;(e.currentTarget as HTMLElement).querySelectorAll<HTMLElement>('[role=tab]')[stufe.value]?.focus()
}
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

      <div class="card skala block" v-reveal>
        <header class="skala-head">
          <div>
            <h2 class="h-sm">{{ skala.titel }}</h2>
            <p class="muted">{{ skala.intro }}</p>
          </div>
        </header>
        <div class="track" role="tablist" aria-label="Stufen" @keydown="taste">
          <button
            v-for="(st, i) in skala.stufen"
            :id="`stufe-tab-${st.id}`"
            :key="st.id"
            role="tab"
            class="stufe"
            :class="[st.ton, { aktiv: stufe === i }]"
            :aria-selected="stufe === i"
            :aria-controls="`stufe-panel`"
            :tabindex="stufe === i ? 0 : -1"
            @click="stufe = i"
          >
            <span class="balken" aria-hidden="true"></span>
            <span class="st-titel">{{ i + 1 }}. {{ st.titel }}</span>
            <span class="st-kurz">{{ st.kurz }}</span>
          </button>
        </div>
        <Transition name="fade" mode="out-in">
          <div id="stufe-panel" :key="stufe" role="tabpanel" :aria-labelledby="`stufe-tab-${skala.stufen[stufe].id}`" class="panel" :class="skala.stufen[stufe].ton">
            <p class="panel-titel">Woran Du «{{ skala.stufen[stufe].titel }}» erkennst</p>
            <ul class="plain-list zeichen">
              <li v-for="z in skala.stufen[stufe].zeichen" :key="z"><span class="z-icon" aria-hidden="true">•</span>{{ z }}</li>
            </ul>
          </div>
        </Transition>
        <div class="skala-fuss">
          <p class="muted small">{{ skala.hinweis }}</p>
          <a href="#selbsttest" class="btn btn-primary" @click.prevent="scrolleZu('selbsttest')">Selbsttest machen <span class="arrow" aria-hidden="true">→</span></a>
        </div>
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
.skala-head { margin-bottom: 18px; }
.track { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
@media (max-width: 640px) { .track { grid-template-columns: 1fr 1fr; } }
.stufe { --c: var(--win); display: flex; flex-direction: column; gap: 4px; text-align: left; padding: 12px 14px 14px; border-radius: var(--radius-sm); border: 1px solid var(--border); background: rgba(255, 255, 255, 0.03); color: var(--text); font: inherit; cursor: pointer; transition: border-color 0.35s var(--ease), background 0.35s var(--ease), transform 0.35s var(--ease); }
.stufe.gelb { --c: var(--warn); }
.stufe.orange { --c: #ffa25c; }
.stufe.rot { --c: var(--loss); }
.stufe:hover { transform: translateY(-2px); border-color: var(--border-strong); }
.stufe.aktiv { border-color: var(--c); background: color-mix(in srgb, var(--c) 12%, transparent); }
.balken { height: 4px; border-radius: 4px; background: var(--c); opacity: 0.5; margin-bottom: 6px; transition: opacity 0.35s; }
.stufe.aktiv .balken { opacity: 1; }
.st-titel { font-weight: 800; }
.st-kurz { font-size: 0.82rem; color: var(--muted); }
.panel { --c: var(--win); margin-top: 14px; padding: 18px 20px; border-radius: var(--radius-sm); border-left: 3px solid var(--c); background: rgba(255, 255, 255, 0.03); }
.panel.gelb { --c: var(--warn); }
.panel.orange { --c: #ffa25c; }
.panel.rot { --c: var(--loss); }
.panel-titel { font-weight: 800; margin-bottom: 8px; }
.zeichen li { display: flex; gap: 10px; padding: 4px 0; color: #cfd6e2; }
.z-icon { color: var(--c); font-weight: 900; }
.skala-fuss { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 14px; margin-top: 18px; }
.skala-fuss p { margin: 0; max-width: 52ch; }
</style>
