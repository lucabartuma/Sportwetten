<script setup lang="ts">
import VideoEmbed from '../components/VideoEmbed.vue'
import { angebote, angehoerigeTipps, clip, hilfeTexte as T, medien } from '../data/help'
</script>

<template>
  <section id="hilfe" class="section" aria-labelledby="hilfe-titel">
    <div class="wrap">
      <header class="section-head">
        <p class="kicker" v-reveal>Unterstützung</p>
        <h2 id="hilfe-titel" v-reveal="60">{{ T.titel }}</h2>
        <p class="einstieg" v-reveal="120">{{ T.einstieg }}</p>
      </header>

      <h3 class="sub" v-reveal>{{ T.angeboteTitel }}</h3>
      <ul class="grid grid-2 plain-list">
        <li v-for="(a, i) in angebote" :key="a.url" v-reveal="(i % 2) * 90">
          <a :href="a.url" target="_blank" rel="noopener noreferrer" class="card angebot">
            <span class="name">{{ a.name }}<span class="pfeil" aria-hidden="true">↗</span><span class="sr-only"> (öffnet in neuem Tab)</span></span>
            <span class="muted">{{ a.text }}</span>
          </a>
        </li>
      </ul>

      <div class="clip-layout">
        <div v-reveal>
          <h3 class="sub">{{ T.clipTitel }}</h3>
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
          <div class="card" v-reveal="80">
            <h3>{{ T.angehoerigeTitel }}</h3>
            <ul class="tipps">
              <li v-for="t in angehoerigeTipps" :key="t">{{ t }}</li>
            </ul>
          </div>
          <div class="card" v-reveal="140">
            <h3>{{ T.medienTitel }}</h3>
            <ul class="plain-list medien">
              <li v-for="m in medien" :key="m.url">
                <a :href="m.url" target="_blank" rel="noopener noreferrer">{{ m.name }}<span class="sr-only"> (öffnet in neuem Tab)</span></a>
                <span class="small muted">{{ m.text }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.einstieg { font-size: clamp(1.2rem, 2.6vw, 1.6rem) !important; font-weight: 700; color: var(--text) !important; letter-spacing: -0.02em; }
.sub { font-size: 1.25rem; margin-bottom: 16px; }
.angebot { display: flex; flex-direction: column; gap: 6px; height: 100%; color: var(--text); text-decoration: none; transition: border-color 0.4s var(--ease), transform 0.4s var(--ease); }
.angebot:hover { border-color: rgba(62, 230, 176, 0.5); transform: translateY(-3px); }
.name { display: flex; justify-content: space-between; gap: 10px; font-weight: 800; font-size: 1.2rem; color: var(--accent); letter-spacing: -0.015em; }
.pfeil { transition: transform 0.4s var(--ease); }
.angebot:hover .pfeil { transform: translate(3px, -3px); }
.clip-layout { display: grid; gap: 24px; margin-top: clamp(48px, 6vw, 72px); }
@media (min-width: 900px) { .clip-layout { grid-template-columns: 360px 1fr; align-items: start; } }
.rechts { display: grid; gap: 18px; }
.medien li { display: flex; flex-direction: column; padding: 10px 0; border-bottom: 1px solid var(--border); }
.medien li:last-child { border-bottom: 0; }
.tipps { padding-left: 20px; margin: 0; color: #cfd6e2; }
.tipps li { margin-bottom: 6px; }
</style>
