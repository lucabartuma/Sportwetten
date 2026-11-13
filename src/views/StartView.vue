<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { startseite as S } from '../config/texts'
import { simulationConfig as cfg } from '../config/simulation'
import { ligaName } from '../data/teams'
</script>

<template>
  <section class="hero">
    <p class="pill">⚽ {{ ligaName }} · CHF {{ cfg.startguthaben }} Spielgeld</p>
    <h1>{{ S.headline }}</h1>
    <p class="sub">{{ S.subline }}</p>
    <RouterLink to="/simulator" class="btn btn-primary btn-lg cta">{{ S.cta }} →</RouterLink>
    <div class="fake-odds" aria-hidden="true">
      <span>1 <b>1.86</b></span><span>X <b>3.41</b></span><span>2 <b>3.92</b></span>
    </div>
  </section>

  <section class="grid grid-3 kacheln" aria-label="Weitere Angebote">
    <RouterLink v-for="k in S.kacheln" :key="k.to" :to="k.to" class="card kachel">
      <span class="icon" aria-hidden="true">{{ k.icon }}</span>
      <h2>{{ k.titel }}</h2>
      <p class="muted">{{ k.text }}</p>
      <span class="weiter" aria-hidden="true">→</span>
    </RouterLink>
  </section>
</template>

<style scoped>
.hero { text-align: center; padding: clamp(24px, 7vw, 80px) 0 clamp(24px, 5vw, 56px); max-width: 860px; margin: 0 auto; }
.hero h1 { font-size: clamp(2rem, 6vw, 3.8rem); margin: 16px 0; }
.sub { font-size: clamp(1.05rem, 2.4vw, 1.4rem); color: var(--muted); }
.cta { margin-top: 8px; font-size: 1.35rem; padding: 16px 40px; box-shadow: 0 0 40px rgba(61, 255, 143, .35); }
.fake-odds { display: flex; justify-content: center; gap: 10px; margin-top: 32px; opacity: .6; }
.fake-odds span { background: var(--card); border: 1px solid var(--line); border-radius: 10px; padding: 8px 14px; color: var(--muted); font-weight: 700; }
.fake-odds b { color: var(--accent); margin-left: 8px; }
.kachel { position: relative; color: var(--text); text-decoration: none; transition: transform .15s, border-color .15s; }
.kachel:hover { transform: translateY(-3px); border-color: var(--accent); }
.kachel h2 { font-size: 1.2rem; }
.kachel p { margin: 0; }
.icon { font-size: 1.8rem; display: block; margin-bottom: 8px; }
.weiter { position: absolute; right: 16px; top: 16px; color: var(--accent); font-size: 1.3rem; }
</style>
