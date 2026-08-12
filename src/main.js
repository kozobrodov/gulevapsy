// The page markup is static in index.html. This entry only pulls in the
// stylesheet (processed by Vite/Tailwind) and adds the interactive behavior
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

/* ------------------------------------------------------------------ *
 * Форма записи — валидация в стиле Google Forms
 * Обязательные поля проверяются при отправке; под пустым полем
 * появляется сообщение «Это обязательный вопрос.», а рамка краснеет.
 * После первой попытки отправки поле перепроверяется на лету, поэтому
 * ошибка исчезает, как только пользователь начинает его заполнять.
 * ------------------------------------------------------------------ */

const form = document.querySelector('[data-appointment-form]')
if (form) {
  const REQUIRED_MESSAGE = 'Это обязательный вопрос.'
  const success = document.querySelector('[data-form-success]')
  const fields = Array.from(form.querySelectorAll('[data-field]'))
  let submitted = false

  const submitButton = form.querySelector('.gform__button')
  const actions = form.querySelector('.gform__actions')

  const controlOf = (field) => field.querySelector('input, textarea')
  const errorOf = (field) => field.querySelector('[data-error]')

  // Сообщение об ошибке отправки (уровень всей формы) создаётся при
  // необходимости и переиспользуется дальше.
  let formError = null
  const showFormError = (message) => {
    if (!formError) {
      formError = document.createElement('p')
      formError.className = 'gform__error'
      formError.setAttribute('role', 'alert')
      actions.insertAdjacentElement('afterend', formError)
    }
    formError.textContent = message
    formError.hidden = false
  }
  const clearFormError = () => {
    if (formError) formError.hidden = true
  }

  const validateField = (field) => {
    const control = controlOf(field)
    const error = errorOf(field)
    const invalid = control.required && control.value.trim() === ''

    const invalidClass =
      control.tagName === 'TEXTAREA' ? 'gform__textarea--invalid' : 'gform__input--invalid'
    control.classList.toggle(invalidClass, invalid)
    control.setAttribute('aria-invalid', invalid ? 'true' : 'false')

    if (error) {
      error.textContent = REQUIRED_MESSAGE
      error.hidden = !invalid
    }
    return !invalid
  }

  form.addEventListener('submit', (e) => {
    // Отправки пока нет (пустой action) — обработчик подключат позже.
    e.preventDefault()
    submitted = true

    const allValid = fields.map(validateField).every(Boolean)
    if (!allValid) {
      const firstInvalid = fields.find((field) => controlOf(field).getAttribute('aria-invalid') === 'true')
      controlOf(firstInvalid)?.focus()
      return
    }

    // Отправляем заявку в Google Forms. Эндпоинт formResponse не отдаёт
    // CORS-заголовки, поэтому запрос идёт в режиме no-cors: ответ непрозрачный
    // и прочитать его нельзя. Успешно завершившийся запрос считаем успешной
    // отправкой, ошибку сети — неудачей.
    clearFormError()
    submitButton.disabled = true
    submitButton.textContent = 'Отправляю…'

    fetch(form.action, {
      method: 'POST',
      mode: 'no-cors',
      body: new FormData(form),
    })
      .then(() => {
        form.reset()
        form.hidden = true
        if (success) success.hidden = false
      })
      .catch(() => {
        submitButton.disabled = false
        submitButton.textContent = 'Отправить'
        showFormError(
          'Не удалось отправить заявку. Проверьте соединение и попробуйте ещё раз — ' +
            'или напишите мне напрямую в WhatsApp либо Telegram.',
        )
      })
  })

  // После первой попытки отправки — проверяем поле по мере ввода.
  fields.forEach((field) => {
    controlOf(field)?.addEventListener('input', () => {
      if (submitted) validateField(field)
    })
  })
}
