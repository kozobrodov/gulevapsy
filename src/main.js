// The page markup is static in index.html. This entry only pulls in the
// stylesheet (processed by Vite/Tailwind) and adds the interactive behaviour
// for the certificate carousel and its fullscreen lightbox.
import './style.css'

/* ------------------------------------------------------------------ *
 * Certificate carousel — prev / next buttons scroll the track
 * ------------------------------------------------------------------ */

const track = document.querySelector('[data-carousel-track]')
if (track) {
  const scrollByCard = (dir) => {
    const card = track.querySelector('figure')
    const amount = card ? card.offsetWidth + 20 /* gap-5 */ : track.clientWidth * 0.8
    track.scrollBy({ left: dir * amount, behavior: 'smooth' })
  }
  document.querySelector('[data-carousel-prev]')?.addEventListener('click', () => scrollByCard(-1))
  document.querySelector('[data-carousel-next]')?.addEventListener('click', () => scrollByCard(1))
}

/* ------------------------------------------------------------------ *
 * Fullscreen lightbox for certificates
 * ------------------------------------------------------------------ */

const overlay = document.querySelector('#lightbox')
const triggers = Array.from(document.querySelectorAll('[data-lightbox]'))

if (overlay && triggers.length) {
  // Build the slide list straight from the static markup.
  const slides = triggers.map((btn) => ({
    full: btn.dataset.full,
    caption: btn.dataset.caption || '',
    alt: btn.querySelector('img')?.alt || '',
  }))

  const imgEl = overlay.querySelector('[data-lb-img]')
  const captionEl = overlay.querySelector('[data-lb-caption]')
  let index = 0

  const render = () => {
    const slide = slides[index]
    imgEl.src = slide.full
    imgEl.alt = slide.alt
    captionEl.textContent = slide.caption
  }

  const open = (i) => {
    index = i
    render()
    overlay.classList.remove('hidden')
    overlay.classList.add('flex', 'animate-fade-in')
    document.body.style.overflow = 'hidden'
  }

  const close = () => {
    overlay.classList.add('hidden')
    overlay.classList.remove('flex')
    document.body.style.overflow = ''
  }

  const go = (dir) => {
    index = (index + dir + slides.length) % slides.length
    render()
  }

  triggers.forEach((btn, i) => btn.addEventListener('click', () => open(i)))
  overlay.querySelector('[data-lb-close]').addEventListener('click', close)
  overlay.querySelector('[data-lb-prev]').addEventListener('click', () => go(-1))
  overlay.querySelector('[data-lb-next]').addEventListener('click', () => go(1))
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close()
  })
  document.addEventListener('keydown', (e) => {
    if (overlay.classList.contains('hidden')) return
    if (e.key === 'Escape') close()
    if (e.key === 'ArrowLeft') go(-1)
    if (e.key === 'ArrowRight') go(1)
  })
}
