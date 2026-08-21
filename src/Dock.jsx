import { useEffect } from 'react'

const DEFAULT_TARGETS = [
  '.brand',
  '.menu-toggle',
  '.nav-links a',
  '.round-link',
  '.contact-list a',
  '.contact-list button',
  '.project-info > a',
  '.capability-link',
  '.contact-details a',
  '.contact-bottom a',
].join(', ')

const WIDE_TARGETS = '.contact-list a, .contact-list button, .contact-details a'

export default function Dock({
  targetSelector = DEFAULT_TARGETS,
  panelHeight = 68,
  baseItemSize = 50,
  magnification = 70,
}) {
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return undefined

    const targets = [...document.querySelectorAll(targetSelector)]
    const radius = panelHeight * 1.8
    const fullScale = magnification / baseItemSize
    let frame = 0
    let pointer = null

    targets.forEach((target) => target.classList.add('dock-effect-target'))

    const render = () => {
      frame = 0
      targets.forEach((target) => {
        if (!pointer) {
          target.style.removeProperty('scale')
          target.style.removeProperty('z-index')
          return
        }

        const rect = target.getBoundingClientRect()
        const distance = Math.hypot(
          pointer.x - (rect.left + rect.width / 2),
          pointer.y - (rect.top + rect.height / 2),
        )
        const proximity = Math.max(0, 1 - distance / radius)
        const targetMaxScale = target.matches(WIDE_TARGETS) ? Math.min(fullScale, 1.06) : fullScale
        const scale = 1 + (targetMaxScale - 1) * proximity * proximity

        target.style.scale = scale.toFixed(3)
        target.style.zIndex = scale > 1.015 ? '6' : ''
      })
    }

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(render)
    }

    const onPointerMove = (event) => {
      if (event.pointerType === 'touch') return
      pointer = { x: event.clientX, y: event.clientY }
      schedule()
    }
    const onPointerLeave = () => {
      pointer = null
      schedule()
    }
    const onFocusIn = (event) => {
      const target = event.target.closest?.(targetSelector)
      if (!target) return
      const maxScale = target.matches(WIDE_TARGETS) ? Math.min(fullScale, 1.06) : fullScale
      target.style.scale = maxScale.toFixed(3)
      target.style.zIndex = '6'
    }
    const onFocusOut = (event) => {
      const target = event.target.closest?.(targetSelector)
      if (!target) return
      target.style.removeProperty('scale')
      target.style.removeProperty('z-index')
    }

    document.addEventListener('pointermove', onPointerMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onPointerLeave)
    document.addEventListener('focusin', onFocusIn)
    document.addEventListener('focusout', onFocusOut)

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      document.removeEventListener('pointermove', onPointerMove)
      document.documentElement.removeEventListener('pointerleave', onPointerLeave)
      document.removeEventListener('focusin', onFocusIn)
      document.removeEventListener('focusout', onFocusOut)
      targets.forEach((target) => {
        target.classList.remove('dock-effect-target')
        target.style.removeProperty('scale')
        target.style.removeProperty('z-index')
      })
    }
  }, [baseItemSize, magnification, panelHeight, targetSelector])

  return null
}
