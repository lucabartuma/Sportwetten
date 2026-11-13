<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * Video mit Klick-zum-Laden: Erst nach Klick wird der YouTube-Player
 * (youtube-nocookie.com) geladen. Offline wird ein Link angezeigt.
 */
const props = defineProps<{
  embedUrl: string
  externUrl: string
  titel: string
  format: '9:16' | '16:9'
  ladenText: string
  externText: string
  hinweis: string
}>()

const geladen = ref(false)
const online = ref(true)
function update() {
  online.value = navigator.onLine
}
onMounted(() => {
  update()
  window.addEventListener('online', update)
  window.addEventListener('offline', update)
})
onBeforeUnmount(() => {
  window.removeEventListener('online', update)
  window.removeEventListener('offline', update)
})
void props
</script>

<template>
  <div class="video" :class="format === '9:16' ? 'hoch' : 'quer'">
    <iframe
      v-if="geladen && online"
      :src="embedUrl"
      :title="titel"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      referrerpolicy="strict-origin-when-cross-origin"
    ></iframe>
    <div v-else class="platzhalter">
      <span class="play" aria-hidden="true">▶</span>
      <button v-if="online" class="btn btn-primary" @click="geladen = true">{{ ladenText }}</button>
      <p v-else class="small">Du bist offline.</p>
      <a :href="externUrl" target="_blank" rel="noopener noreferrer">{{ externText }}<span class="sr-only"> (öffnet in neuem Tab)</span></a>
      <p class="small muted">{{ hinweis }}</p>
    </div>
  </div>
</template>

<style scoped>
.video { position: relative; width: 100%; border-radius: var(--radius); overflow: hidden; background: #000; border: 1px solid var(--line); }
.video.hoch { aspect-ratio: 9 / 16; max-width: 340px; margin: 0 auto; }
.video.quer { aspect-ratio: 16 / 9; }
iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
.platzhalter { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 20px; text-align: center; background: radial-gradient(circle at 50% 35%, #1f3a2b, #000 70%); }
.play { font-size: 3rem; color: var(--accent); }
</style>
