<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { navigation, projekt } from './config/texts'
import { demoAktiv, erkenneDemo } from './composables/demo'

const route = useRoute()
const header = ref<HTMLElement | null>(null)
onMounted(() => {
  // Höhe des sticky Headers als CSS-Variable (für sticky Elemente darunter)
  const ro = new ResizeObserver(() => {
    document.documentElement.style.setProperty('--header-h', `${header.value?.offsetHeight ?? 0}px`)
  })
  if (header.value) ro.observe(header.value)
})
function zumInhalt() {
  document.getElementById('inhalt')?.focus()
}
watch(
  () => route.fullPath,
  () => {
    erkenneDemo(route.query.demo)
    const t = (route.meta.titel as string) ?? ''
    document.title = `${t ? t + ' · ' : ''}${projekt.titel}`
  },
  { immediate: true },
)
</script>

<template>
  <a class="skip-link" href="#inhalt" @click.prevent="zumInhalt">Zum Inhalt springen</a>
  <header ref="header" class="topbar">
    <div class="banner" role="note">
      <span class="banner-icon" aria-hidden="true">🛡️</span>
      <strong>{{ projekt.banner }}</strong>
      <span v-if="demoAktiv" class="demo-badge">Demo-Modus</span>
    </div>
    <div class="topbar-inner">
      <RouterLink to="/" class="brand" aria-label="Gegen die Quote – zur Startseite">
        <span class="brand-mark" aria-hidden="true">⚽</span>{{ projekt.titel }}
      </RouterLink>
      <nav aria-label="Hauptnavigation">
        <ul class="nav">
          <li v-for="n in navigation" :key="n.to">
            <RouterLink :to="n.to" class="nav-link" exact-active-class="aktiv">{{ n.label }}</RouterLink>
          </li>
        </ul>
      </nav>
    </div>
  </header>

  <main id="inhalt" tabindex="-1" class="container">
    <RouterView />
  </main>

  <footer class="footer">
    <p>{{ projekt.footer }}</p>
  </footer>
</template>
