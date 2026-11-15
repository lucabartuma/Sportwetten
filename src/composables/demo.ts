import { ref } from 'vue'

/**
 * Demo-Modus für die Präsentation: fester Zufalls-Seed, kürzere Animationen.
 * Aktiv mit ?demo=1 (index.html?demo=1#simulator), mit #demo oder mit dem
 * alten Format #/simulator?demo=1.
 */
export const demoAktiv = ref(false)

export function erkenneDemo() {
  const query = new URLSearchParams(window.location.search).get('demo')
  const hash = window.location.hash
  if (query === '1' || hash === '#demo' || /[?&]demo=1/.test(hash)) demoAktiv.value = true
  if (query === '0' || /[?&]demo=0/.test(hash)) demoAktiv.value = false
}
