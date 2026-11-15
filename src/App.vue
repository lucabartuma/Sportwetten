<script setup lang="ts">
import { onMounted } from 'vue'
import SiteHeader from './components/SiteHeader.vue'
import { projekt } from './config/texts'
import { erkenneDemo } from './composables/demo'
import { abschnittAusHash, scrolleZu } from './composables/navigation'
import HeroSection from './sections/HeroSection.vue'
import SimulatorSection from './sections/SimulatorSection.vue'
import FansSection from './sections/FansSection.vue'
import HintergrundSection from './sections/HintergrundSection.vue'
import FaktenSection from './sections/FaktenSection.vue'
import SelbsttestSection from './sections/SelbsttestSection.vue'
import HilfeSection from './sections/HilfeSection.vue'

erkenneDemo()

function springeZuHash() {
  const id = abschnittAusHash(window.location.hash)
  if (id) requestAnimationFrame(() => scrolleZu(id, false))
}

onMounted(() => {
  springeZuHash()
  window.addEventListener('hashchange', () => {
    erkenneDemo()
    springeZuHash()
  })
})

function zumInhalt() {
  scrolleZu('simulator')
}
</script>

<template>
  <div class="aurora" aria-hidden="true"></div>
  <a class="skip-link" href="#simulator" @click.prevent="zumInhalt">Zum Simulator springen</a>
  <SiteHeader />
  <main>
    <HeroSection />
    <SimulatorSection />
    <FansSection />
    <HintergrundSection />
    <FaktenSection />
    <SelbsttestSection />
    <HilfeSection />
  </main>
  <footer class="footer">
    <p>{{ projekt.footer }}</p>
  </footer>
</template>
