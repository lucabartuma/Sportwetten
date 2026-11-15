<script setup lang="ts">
import VideoEmbed from '../components/VideoEmbed.vue'
import {
  angebote,
  angehoerigeLinks,
  angehoerigeTipps,
  clipEmbedUrl,
  clipExternUrl,
  clips,
  hilfeTexte as T,
  medien,
  multiplikatorenLinks,
  multiplikatorenTipps,
} from '../data/help'

const quer = clips.filter((c) => c.format === '16:9')
const hoch = clips.filter((c) => c.format === '9:16')
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

      <div class="card sperre" v-reveal>
        <span class="sperre-icon" aria-hidden="true">⛔</span>
        <div>
          <h3>{{ T.sperreTitel }}</h3>
          <p>{{ T.sperreText }}</p>
          <a :href="T.sperreLink.url" target="_blank" rel="noopener noreferrer">{{ T.sperreLink.label }}<span class="sr-only"> (öffnet in neuem Tab)</span></a>
        </div>
      </div>

      <div class="block">
        <h3 class="sub" v-reveal>{{ T.clipTitel }}</h3>
        <p class="muted" v-reveal>{{ T.clipIntro }}</p>
        <div class="videos">
          <div class="quer">
            <figure v-for="(c, i) in quer" :key="c.youtubeId" class="clip" v-reveal="i * 90">
              <VideoEmbed :embed-url="clipEmbedUrl(c)" :extern-url="clipExternUrl(c)" :titel="c.titel" :format="c.format" :laden-text="T.clipLaden" :extern-text="T.clipExtern" :hinweis="T.clipHinweis" />
              <figcaption><strong>{{ c.titel }}</strong><span class="small muted"> · {{ c.quelle }}</span></figcaption>
            </figure>
          </div>
          <figure v-for="c in hoch" :key="c.youtubeId" class="clip hoch" v-reveal="180">
            <VideoEmbed :embed-url="clipEmbedUrl(c)" :extern-url="clipExternUrl(c)" :titel="c.titel" :format="c.format" :laden-text="T.clipLaden" :extern-text="T.clipExtern" :hinweis="T.clipHinweis" />
            <figcaption><strong>{{ c.titel }}</strong><span class="small muted"> · {{ c.quelle }}</span></figcaption>
          </figure>
        </div>
      </div>

      <div class="grid grid-2 block">
        <div class="card" v-reveal>
          <h3>{{ T.angehoerigeTitel }}</h3>
          <p class="muted">{{ T.angehoerigeIntro }}</p>
          <ul class="tipps">
            <li v-for="t in angehoerigeTipps" :key="t">{{ t }}</li>
          </ul>
          <ul class="plain-list links">
            <li v-for="l in angehoerigeLinks" :key="l.url">
              <a :href="l.url" target="_blank" rel="noopener noreferrer">{{ l.name }}<span class="sr-only"> (öffnet in neuem Tab)</span></a>
              <span class="small muted">{{ l.text }}</span>
            </li>
          </ul>
        </div>
        <div class="card" v-reveal="90">
          <h3>{{ T.multiplikatorenTitel }}</h3>
          <p class="muted">{{ T.multiplikatorenIntro }}</p>
          <ul class="tipps">
            <li v-for="t in multiplikatorenTipps" :key="t">{{ t }}</li>
          </ul>
          <ul class="plain-list links">
            <li v-for="l in multiplikatorenLinks" :key="l.url">
              <a :href="l.url" target="_blank" rel="noopener noreferrer">{{ l.name }}<span class="sr-only"> (öffnet in neuem Tab)</span></a>
              <span class="small muted">{{ l.text }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="card block" v-reveal>
        <h3>{{ T.medienTitel }}</h3>
        <ul class="plain-list links">
          <li v-for="m in medien" :key="m.url">
            <a :href="m.url" target="_blank" rel="noopener noreferrer">{{ m.name }}<span class="sr-only"> (öffnet in neuem Tab)</span></a>
            <span class="small muted">{{ m.text }}</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.einstieg { font-size: clamp(1.2rem, 2.6vw, 1.6rem) !important; font-weight: 700; color: var(--text) !important; letter-spacing: -0.02em; }
.sub { font-size: 1.25rem; margin-bottom: 16px; }
.block { margin-top: clamp(40px, 6vw, 64px); }
.angebot { display: flex; flex-direction: column; gap: 6px; height: 100%; color: var(--text); text-decoration: none; transition: border-color 0.4s var(--ease), transform 0.4s var(--ease); }
.angebot:hover { border-color: rgba(62, 230, 176, 0.5); transform: translateY(-3px); }
.name { display: flex; justify-content: space-between; gap: 10px; font-weight: 800; font-size: 1.2rem; color: var(--accent); letter-spacing: -0.015em; }
.pfeil { transition: transform 0.4s var(--ease); }
.angebot:hover .pfeil { transform: translate(3px, -3px); }
.sperre { margin-top: 18px; display: flex; gap: 18px; align-items: flex-start; border-color: rgba(255, 201, 92, 0.3); background: linear-gradient(135deg, rgba(255, 201, 92, 0.08), transparent); }
.sperre p { color: #cfd6e2; max-width: 70ch; }
.sperre-icon { font-size: 1.8rem; line-height: 1; }
.videos { display: grid; gap: 20px; align-items: start; }
@media (min-width: 900px) { .videos { grid-template-columns: 1fr 300px; } }
.quer { display: grid; gap: 20px; }
@media (min-width: 640px) { .quer { grid-template-columns: 1fr 1fr; } }
.clip { margin: 0; }
.clip figcaption { margin-top: 10px; }
.tipps { padding-left: 20px; margin: 0 0 14px; color: #cfd6e2; }
.tipps li { margin-bottom: 8px; }
.links li { display: flex; flex-direction: column; padding: 10px 0; border-top: 1px solid var(--border); }
</style>
