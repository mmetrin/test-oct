import { gsap } from 'gsap'

function prepareStroke(elements) {
  elements.forEach((element) => {
    const length = element.getTotalLength()
    gsap.set(element, { strokeDasharray: `${length} ${length}`, strokeDashoffset: length, opacity: 0, autoRound: false })
  })
}

export function createStableIdMotion(element) {
  const select = gsap.utils.selector(element)
  const sources = select('.stable-id__source')
  const links = select('.stable-id__link')
  const signals = select('.stable-id__signal')
  const resolved = select('.stable-id__resolved')
  const ring = select('.stable-id__result-ring')
  const confirmation = select('.stable-id__confirmation')
  const mtsLogo = select('.stable-id__mts-logo')

  gsap.set(sources, { opacity: 0, x: -4, y: 2, scale: 0.8, svgOrigin: '0 0' })
  gsap.set(resolved, { opacity: 0, scale: 0.74, x: -8, svgOrigin: '0 0' })
  gsap.set(confirmation, { opacity: 0, scale: 1, svgOrigin: '0 0' })
  gsap.set(mtsLogo, { opacity: 0 })
  prepareStroke([...links, ...ring])
  signals.forEach((signal) => gsap.set(signal, { opacity: 0, strokeDasharray: `4 ${signal.getTotalLength()}`, strokeDashoffset: 4, autoRound: false }))

  return gsap.timeline()
    .to(sources, { opacity: 1, x: 0, y: 0, scale: 1, duration: 0.7, stagger: 0.14, ease: 'sine.out' })
    .set(links, { opacity: 1 }, 0.55)
    .to(links, { strokeDashoffset: 0, duration: 0.9, stagger: 0.08, ease: 'sine.inOut', autoRound: false }, 0.55)
    .to(signals, { opacity: 0.8, strokeDashoffset: (_, signal) => -signal.getTotalLength(), duration: 0.9, stagger: 0.08, ease: 'sine.inOut', autoRound: false }, 1.25)
    .to(signals, { opacity: 0, duration: 0.25 }, 2.25)
    .to(resolved, { opacity: 1, scale: 1, x: 0, duration: 0.9, ease: 'sine.inOut' }, 1.95)
    .set(ring, { opacity: 1 }, 1.95)
    .to(ring, { strokeDashoffset: 0, duration: 0.95, ease: 'sine.inOut', autoRound: false }, 1.95)
    .to(confirmation, { opacity: 0.4, duration: 0.2, ease: 'sine.out' }, 2.65)
    .to(confirmation, { opacity: 0, scale: 1.13, duration: 0.8, ease: 'sine.out' }, 2.85)
    .to(mtsLogo, { opacity: 1, duration: 0.65, ease: 'sine.inOut' })
}

export function createSmartTargetMotion(element) {
  const select = gsap.utils.selector(element)
  const others = select('.smart-target__other')
  const selected = select('.smart-target__selected')
  const selection = select('.smart-target__selection')
  const confirmation = select('.smart-target__confirmation')

  gsap.set(others, { opacity: 0, scale: 0.82, svgOrigin: '0 0' })
  gsap.set(selected, {
    opacity: 0,
    scale: 0.62,
    x: (_, portrait) => Number(portrait.dataset.fromX),
    y: (_, portrait) => Number(portrait.dataset.fromY),
    svgOrigin: '0 0',
  })
  prepareStroke(selection)
  gsap.set(selection, { scale: 1.16, svgOrigin: '0 0' })
  gsap.set(confirmation, { opacity: 0, scale: 1, svgOrigin: '0 0' })

  return gsap.timeline()
    .to(others, { opacity: 1, scale: 1, duration: 0.7, stagger: 0.06, ease: 'sine.out' })
    .to(selected, { opacity: 0.45, duration: 0.65, stagger: 0.07, ease: 'sine.out' }, 0.1)
    .set(selection, { opacity: 1 }, 0.8)
    .to(selection, { strokeDashoffset: 0, scale: 1, duration: 1.5, ease: 'sine.inOut', autoRound: false }, 0.8)
    .to(selected, { opacity: 1, scale: 1, x: 0, y: 0, duration: 0.9, stagger: 0.18, ease: 'sine.inOut' }, 1.1)
    .to(others, { opacity: 0.7, duration: 1, ease: 'sine.inOut' }, 1.15)
    .to(confirmation, { opacity: 0.3, duration: 0.2, ease: 'sine.out' }, 2.45)
    .to(confirmation, { opacity: 0, scale: 1.07, duration: 0.8, ease: 'sine.out' }, 2.65)
}
