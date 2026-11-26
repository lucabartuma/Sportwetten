<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { abschnitte, projekt } from '../config/texts'
import { demoAktiv } from '../composables/demo'
import { scrolleZu, useScrollSpy } from '../composables/navigation'

const { aktiv, fortschritt } = useScrollSpy()
const nav = ref<HTMLElement | null>(null)

// Aktiven Eintrag in der (mobil scrollbaren) Navigation sichtbar halten
watch(aktiv, () =>
  nextTick(() => {
    const el = nav.value?.querySelector<HTMLElement>('.aktiv')
    const box = nav.value
    if (!el || !box) return
    const ziel = el.offsetLeft - box.clientWidth / 2 + el.clientWidth / 2
    box.scrollTo({ left: ziel, behavior: 'smooth' })
  }),
)
</script>

<template>
  <header class="header">
    <div class="wrap bar">
      <a href="#start" class="brand" @click.prevent="scrolleZu('start')">
        <span class="logo" aria-hidden="true">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 7.5l3.2 2.3-1.2 3.8h-4l-1.2-3.8z" /></svg>
        </span>
        <span>{{ projekt.titel }}</span>
      </a>
      <p class="badge" role="note">
        <span class="dot" aria-hidden="true"></span>{{ projekt.banner }}
        <span v-if="demoAktiv" class="demo">Demo</span>
      </p>
      <a href="#hilfe" class="btn btn-ghost hilfe-btn" @click.prevent="scrolleZu('hilfe')">{{ projekt.hilfeButton }}</a>
    </div>
    <nav aria-label="Abschnitte" class="wrap">
      <ul ref="nav" class="nav">
        <li v-for="a in abschnitte" :key="a.id">
          <a
            :href="`#${a.id}`"
            :class="{ aktiv: aktiv === a.id }"
            :aria-current="aktiv === a.id ? 'location' : undefined"
            @click.prevent="scrolleZu(a.id)"
          >{{ a.label }}</a>
        </li>
      </ul>
    </nav>
    <div class="progress" aria-hidden="true"><span :style="{ transform: `scaleX(${fortschritt})` }"></span></div>
  </header>
</template>

<style scoped>
.header {
  position: sticky; top: 0; z-index: 30;
  background: rgba(7, 10, 18, 0.9); backdrop-filter: saturate(160%) blur(18px); -webkit-backdrop-filter: saturate(160%) blur(18px);
  border-bottom: 1px solid var(--border);
}
.bar { display: flex; align-items: center; gap: 16px; padding-top: 12px; padding-bottom: 8px; }
.brand { display: inline-flex; align-items: center; gap: 10px; color: var(--text); text-decoration: none; font-weight: 800; letter-spacing: -0.02em; font-size: 1.08rem; white-space: nowrap; }
.logo { display: grid; place-items: center; width: 32px; height: 32px; border-radius: 10px; background: linear-gradient(135deg, var(--accent), var(--accent-2)); }
.logo svg { width: 20px; height: 20px; fill: none; stroke: #07131a; stroke-width: 2; stroke-linejoin: round; }
.logo svg path { fill: #07131a; }
.badge { margin: 0 auto 0 8px; display: inline-flex; align-items: center; gap: 8px; font-size: 0.78rem; font-weight: 700; color: var(--warn); background: rgba(255, 201, 92, 0.1); border: 1px solid rgba(255, 201, 92, 0.3); padding: 4px 12px; border-radius: 999px; }
.dot { width: 7px; height: 7px; border-radius: 50%; background: var(--warn); box-shadow: 0 0 0 4px rgba(255, 201, 92, 0.18); }
.demo { background: var(--warn); color: #241800; border-radius: 999px; padding: 0 8px; font-size: 0.7rem; }
.hilfe-btn { min-height: 38px; padding: 6px 16px; font-size: 0.9rem; }
.nav { list-style: none; margin: 0; padding: 0 0 10px; display: flex; gap: 4px; overflow-x: auto; scrollbar-width: none; -webkit-mask-image: linear-gradient(90deg, #000 92%, transparent); mask-image: linear-gradient(90deg, #000 92%, transparent); }
.nav::-webkit-scrollbar { display: none; }
.nav a { display: block; padding: 6px 14px; border-radius: 999px; color: var(--muted); text-decoration: none; font-weight: 600; font-size: 0.9rem; white-space: nowrap; transition: color 0.3s var(--ease), background 0.3s var(--ease); }
.nav a:hover { color: var(--text); background: var(--surface-strong); }
.nav a.aktiv { color: var(--accent-ink); background: var(--accent); }
.progress { position: absolute; left: 0; right: 0; bottom: -1px; height: 2px; }
.progress span { display: block; height: 100%; background: linear-gradient(90deg, var(--accent), var(--accent-2)); transform-origin: left; transition: transform 0.15s linear; }
@media (max-width: 760px) {
  .bar { flex-wrap: wrap; row-gap: 6px; padding-top: 8px; }
  .badge { order: 3; margin: 0; width: 100%; justify-content: center; font-size: 0.72rem; padding: 3px 10px; }
  .hilfe-btn { margin-left: auto; }
  .nav { padding-bottom: 8px; }
  .nav a { padding: 5px 11px; font-size: 0.85rem; }
}
</style>
