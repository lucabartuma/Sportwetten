import { ref } from 'vue'

/**
 * Demo-Modus: aktiv mit ?demo=1 – entweder vor dem Hash
 * (index.html?demo=1#/simulator) oder im Hash (#/simulator?demo=1).
 * Bleibt für die ganze Sitzung aktiv, sobald er einmal erkannt wurde.
 */
export const demoAktiv = ref(false)

export function erkenneDemo(hashQuery?: unknown) {
  const vorHash = new URLSearchParams(window.location.search).get('demo')
  if (vorHash === '1' || hashQuery === '1') demoAktiv.value = true
  if (vorHash === '0' || hashQuery === '0') demoAktiv.value = false
}
