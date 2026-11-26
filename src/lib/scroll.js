// Scroll suave a una sección (Lenis si está activo, scroll nativo si no)
export function scrollToId(href, offset = -20) {
  const target = document.querySelector(href)
  if (!target) return
  if (window.__lenis) window.__lenis.scrollTo(target, { offset })
  else target.scrollIntoView({ behavior: 'smooth' })
}

export function scrollToTop() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (window.__lenis) window.__lenis.scrollTo(0, { immediate: reduced })
  else window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
}
