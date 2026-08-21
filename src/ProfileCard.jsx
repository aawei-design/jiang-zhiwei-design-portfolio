import { useEffect, useRef } from 'react'
import './ProfileCard.css'

const clamp = (value, min = 0, max = 100) => Math.min(Math.max(value, min), max)

export default function ProfileCard({
  avatarUrl,
  name = '蒋志伟',
  enableTilt = true,
  behindGlowEnabled = true,
  behindGlowColor = 'rgba(255, 92, 30, .5)',
  behindGlowSize = '58%',
  innerGradient = 'linear-gradient(145deg,rgba(255,77,0,.12),rgba(55,110,255,.16))',
}) {
  const wrapRef = useRef(null)
  const shellRef = useRef(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const shell = shellRef.current
    if (!wrap || !shell || !enableTilt || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    let frame = 0
    let lastTime = 0
    let currentX = shell.clientWidth - 70
    let currentY = 60
    let targetX = shell.clientWidth / 2
    let targetY = shell.clientHeight / 2
    let initialUntil = performance.now() + 1200

    const setProperties = (x, y) => {
      const width = shell.clientWidth || 1
      const height = shell.clientHeight || 1
      const percentX = clamp((x / width) * 100)
      const percentY = clamp((y / height) * 100)
      const centerX = percentX - 50
      const centerY = percentY - 50
      wrap.style.setProperty('--pointer-x', `${percentX}%`)
      wrap.style.setProperty('--pointer-y', `${percentY}%`)
      wrap.style.setProperty('--background-x', `${35 + percentX * .3}%`)
      wrap.style.setProperty('--background-y', `${35 + percentY * .3}%`)
      wrap.style.setProperty('--pointer-from-center', `${clamp(Math.hypot(centerX, centerY) / 50, 0, 1)}`)
      wrap.style.setProperty('--pointer-from-top', `${percentY / 100}`)
      wrap.style.setProperty('--pointer-from-left', `${percentX / 100}`)
      wrap.style.setProperty('--rotate-x', `${-(centerX / 5)}deg`)
      wrap.style.setProperty('--rotate-y', `${centerY / 4}deg`)
    }

    const animate = (time) => {
      const delta = lastTime ? (time - lastTime) / 1000 : 0
      lastTime = time
      const tau = time < initialUntil ? .6 : .14
      const easing = 1 - Math.exp(-delta / tau)
      currentX += (targetX - currentX) * easing
      currentY += (targetY - currentY) * easing
      setProperties(currentX, currentY)
      if (Math.abs(targetX - currentX) > .05 || Math.abs(targetY - currentY) > .05) {
        frame = window.requestAnimationFrame(animate)
      } else {
        frame = 0
        lastTime = 0
      }
    }

    const start = () => {
      if (!frame) frame = window.requestAnimationFrame(animate)
    }
    const setTargetFromPointer = (event) => {
      const rect = shell.getBoundingClientRect()
      targetX = event.clientX - rect.left
      targetY = event.clientY - rect.top
      start()
    }
    const onEnter = (event) => {
      wrap.classList.add('is-active')
      setTargetFromPointer(event)
    }
    const onMove = (event) => setTargetFromPointer(event)
    const onLeave = () => {
      wrap.classList.remove('is-active')
      targetX = shell.clientWidth / 2
      targetY = shell.clientHeight / 2
      start()
    }

    setProperties(currentX, currentY)
    wrap.classList.add('is-initial')
    start()
    const initialTimer = window.setTimeout(() => {
      initialUntil = 0
      wrap.classList.remove('is-initial')
    }, 1200)

    shell.addEventListener('pointerenter', onEnter)
    shell.addEventListener('pointermove', onMove)
    shell.addEventListener('pointerleave', onLeave)

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.clearTimeout(initialTimer)
      shell.removeEventListener('pointerenter', onEnter)
      shell.removeEventListener('pointermove', onMove)
      shell.removeEventListener('pointerleave', onLeave)
    }
  }, [enableTilt])

  return (
    <div
      ref={wrapRef}
      className="pc-card-wrapper"
      style={{
        '--behind-glow-color': behindGlowColor,
        '--behind-glow-size': behindGlowSize,
        '--inner-gradient': innerGradient,
      }}
    >
      {behindGlowEnabled && <div className="pc-behind" />}
      <div ref={shellRef} className="pc-card-shell">
        <div className="pc-card">
          <div className="pc-inside">
            <img className="pc-avatar" src={avatarUrl} alt={`${name}个人照`} />
            <div className="pc-shine" />
            <div className="pc-glare" />
          </div>
        </div>
      </div>
    </div>
  )
}
