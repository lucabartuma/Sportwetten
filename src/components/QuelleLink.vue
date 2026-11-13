<script setup lang="ts">
defineProps<{ quelle: string; url: string; stand?: string }>()
</script>

<template>
  <p class="quelle">
    Quelle:
    <a :href="url" target="_blank" rel="noopener noreferrer">{{ quelle }}<span class="sr-only"> (öffnet in neuem Tab)</span></a>
    <template v-if="stand"> · Stand {{ stand }}</template>
  </p>
</template>
