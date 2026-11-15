import { onBeforeUnmount, onMounted, ref } from 'vue'
import { abschnitte, type AbschnittId } from '../config/texts'

const ids = abschnitte.map((a) => a.id) as string[]

/**
 * Liest einen Anker aus dem Hash. Unterstützt:
 *  #simulator  (neu, funktioniert auch im Claude-Artifact)
 *  #/simulator, #/simulator?demo=1  (alte Links aus der PowerPoint)
 *  #demo  → Simulator im Demo-Modus
 */
export function abschnittAusHash(hash: string): AbschnittId | null {
  const h = hash.replace(/^#\/?/, '').split('?')[0]
  if (h === 'demo') return 'simulator'
  if (h === '') return null
  return ids.includes(h) ? (h as AbschnittId) : null
}

function reduzierteBewegung() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

export function scrolleZu(id: string, smooth = true) {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: smooth && !reduzierteBewegung() ? 'smooth' : 'auto', block: 'start' })
  try {
    history.replaceState(null, '', id === 'start' ? window.location.pathname + window.location.search : `#${id}`)
  } catch {
    /* in manchen Sandboxes nicht erlaubt */
  }
  // Fokus für Tastatur/Screenreader auf den Abschnitt setzen, ohne erneut zu scrollen
  el.setAttribute('tabindex', '-1')
  el.focus({ preventScroll: true })
}

/** Scrollspy: welcher Abschnitt ist gerade sichtbar? Plus Lesefortschritt 0–1. */
export function useScrollSpy() {
  const aktiv = ref<AbschnittId>('start')
  const fortschritt = ref(0)
  let raf = 0

  function update() {
    raf = 0
    const linie = window.innerHeight * 0.35
    let current: AbschnittId = 'start'
    for (const a of abschnitte) {
      const el = document.getElementById(a.id)
      if (el && el.getBoundingClientRect().top <= linie) current = a.id
    }
    // ganz unten: letzter Abschnitt
    const max = document.documentElement.scrollHeight - window.innerHeight
    if (max > 0 && window.scrollY >= max - 4) current = abschnitte[abschnitte.length - 1].id
    aktiv.value = current
    fortschritt.value = max > 0 ? Math.min(1, window.scrollY / max) : 0
  }
  function onScroll() {
    if (!raf) raf = requestAnimationFrame(update)
  }
  onMounted(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    update()
  })
  onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
    cancelAnimationFrame(raf)
  })
  return { aktiv, fortschritt }
}
