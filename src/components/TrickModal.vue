<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import type { Trick } from '../data/tricks'

const props = defineProps<{ trick: Trick }>()
const emit = defineEmits<{ close: [] }>()
const aufgeloest = ref(false)
const dialog = ref<HTMLElement | null>(null)

onMounted(() => nextTick(() => dialog.value?.querySelector<HTMLElement>('button')?.focus()))

function aufloesen() {
  aufgeloest.value = true
  nextTick(() => dialog.value?.querySelector<HTMLElement>('button')?.focus())
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    if (!aufgeloest.value) aufloesen()
    else emit('close')
  }
}
void props
</script>

<template>
  <div class="overlay" @keydown="onKey">
    <div
      ref="dialog"
      class="modal"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="`trick-titel-${trick.id}`"
      :class="{ aufgeloest }"
    >
      <template v-if="!aufgeloest">
        <span class="werbung">Anzeige · so sieht’s in echten Apps aus</span>
        <h2 :id="`trick-titel-${trick.id}`">{{ trick.popupTitel }}</h2>
        <p>{{ trick.popupText }}</p>
        <div class="btn-row">
          <button class="btn btn-primary" @click="aufloesen">{{ trick.popupButton }}</button>
          <button class="btn btn-ghost" @click="aufloesen">Nein danke</button>
        </div>
      </template>
      <template v-else>
        <span class="werbung aufl">💡 Durchschaut</span>
        <h2 :id="`trick-titel-${trick.id}`">{{ trick.aufloesungTitel }}</h2>
        <p>{{ trick.aufloesung }}</p>
        <button class="btn btn-primary" @click="emit('close')">Verstanden, weiter</button>
      </template>
    </div>
  </div>
</template>

<style scoped>
.overlay { position: fixed; inset: 0; z-index: 50; display: grid; place-items: center; padding: 16px; background: rgba(0, 0, 0, 0.7); }
.modal { max-width: 440px; width: 100%; background: linear-gradient(160deg, #2a1748, #10331f); border: 2px solid var(--accent); border-radius: 18px; padding: 24px; box-shadow: 0 20px 60px rgba(0,0,0,.6); animation: pop .25s ease; }
.modal.aufgeloest { background: #2a2614; border-color: var(--warn); }
.werbung { display: inline-block; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: var(--muted); margin-bottom: 8px; }
.werbung.aufl { color: var(--warn); }
@keyframes pop { from { transform: scale(.9); opacity: 0 } to { transform: scale(1); opacity: 1 } }
</style>
