<script setup lang="ts">
import VideoEmbed from '../components/VideoEmbed.vue'
import { angebote, angehoerigeTipps, clip, hilfeTexte as T, medien } from '../data/help'
</script>

<template>
  <header class="page-head">
    <h1>{{ T.titel }}</h1>
    <p class="einstieg">{{ T.einstieg }}</p>
  </header>

  <section aria-labelledby="angebote">
    <h2 id="angebote">{{ T.angeboteTitel }}</h2>
    <ul class="grid grid-2 liste">
      <li v-for="a in angebote" :key="a.url">
        <a :href="a.url" target="_blank" rel="noopener noreferrer" class="card angebot">
          <strong>{{ a.name }} <span aria-hidden="true">↗</span><span class="sr-only"> (öffnet in neuem Tab)</span></strong>
          <span class="muted">{{ a.text }}</span>
        </a>
      </li>
    </ul>
  </section>

  <section class="section clip-layout">
    <div>
      <h2>{{ T.clipTitel }}</h2>
      <VideoEmbed
        :embed-url="clip.embedUrl"
        :extern-url="clip.externUrl"
        :titel="clip.titel"
        :format="clip.format"
        :laden-text="T.clipLaden"
        :extern-text="T.clipExtern"
        :hinweis="T.clipHinweis"
      />
      <p class="small muted center">{{ T.clipRechte }}</p>
    </div>
    <div class="rechts">
      <div class="card">
        <h2>{{ T.medienTitel }}</h2>
        <ul class="medien">
          <li v-for="m in medien" :key="m.url">
            <a :href="m.url" target="_blank" rel="noopener noreferrer">{{ m.name }}<span class="sr-only"> (öffnet in neuem Tab)</span></a>
            <span class="small muted">{{ m.text }}</span>
          </li>
        </ul>
      </div>
      <div class="card">
        <h2>{{ T.angehoerigeTitel }}</h2>
        <ul class="tipps">
          <li v-for="t in angehoerigeTipps" :key="t">{{ t }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.einstieg { font-size: clamp(1.15rem, 2.6vw, 1.5rem); font-weight: 700; color: var(--text) !important; }
.liste { list-style: none; padding: 0; margin: 0; }
.angebot { display: flex; flex-direction: column; gap: 6px; height: 100%; color: var(--text); text-decoration: none; transition: border-color .15s; }
.angebot strong { color: var(--accent); font-size: 1.15rem; }
.angebot:hover { border-color: var(--accent); }
.clip-layout { display: grid; gap: 20px; }
@media (min-width: 900px) { .clip-layout { grid-template-columns: 360px 1fr; align-items: start; } }
.rechts { display: grid; gap: 16px; }
.medien { list-style: none; padding: 0; margin: 0; }
.medien li { display: flex; flex-direction: column; padding: 8px 0; border-bottom: 1px solid var(--line); }
.tipps { padding-left: 20px; margin: 0; }
.tipps li { margin-bottom: 6px; }
</style>
