import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'

import './Masonry.css'

const COLUMN_QUERIES = ['(min-width:1500px)', '(min-width:1000px)', '(min-width:600px)', '(min-width:400px)']
const COLUMN_VALUES = [5, 4, 3, 2]
const MEDIA_CACHE_VERSION = '20260821-1'

function withMediaVersion(src) {
  if (typeof src !== 'string' || /^(?:blob:|data:)/.test(src)) return src
  return `${src}${src.includes('?') ? '&' : '?'}v=${MEDIA_CACHE_VERSION}`
}

function posterFromSrc(src) {
  if (typeof src !== 'string') return undefined
  const match = src.split('?')[0].match(/\/portfolio\/motion\/([^/]+)\.mp4$/i)
  return match ? `/portfolio/motion/posters/${match[1]}.jpg?v=${MEDIA_CACHE_VERSION}` : undefined
}

function useMedia(queries, values, defaultValue) {
  const get = () => {
    if (typeof window === 'undefined') return defaultValue
    return values[queries.findIndex((query) => window.matchMedia(query).matches)] ?? defaultValue
  }

  const [value, setValue] = useState(get)

  useEffect(() => {
    const handler = () => setValue(get())
    const lists = queries.map((query) => window.matchMedia(query))
    lists.forEach((list) => list.addEventListener('change', handler))
    return () => lists.forEach((list) => list.removeEventListener('change', handler))
  }, [queries, values])

  return value
}

function useMeasure() {
  const ref = useRef(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useLayoutEffect(() => {
    if (!ref.current) return undefined
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize({ width, height })
    })
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return [ref, size]
}

function LazyVideo({ src, title }) {
  const ref = useRef(null)
  const [isNear, setIsNear] = useState(false)
  const versionedSrc = withMediaVersion(src)

  useEffect(() => {
    if (!ref.current) return undefined
    const video = ref.current
    const observer = new IntersectionObserver(([entry]) => {
      setIsNear(entry.isIntersecting)
      if (entry.isIntersecting) {
        video.play().catch(() => {})
      } else {
        video.pause()
      }
    }, { rootMargin: '320px 0px', threshold: 0.01 })
    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <video
      ref={ref}
      className="masonry-media"
      src={isNear ? versionedSrc : undefined}
      poster={posterFromSrc(src)}
      aria-label={title}
      muted
      loop
      playsInline
      autoPlay={isNear}
      preload="none"
    />
  )
}

export default function Masonry({
  items,
  ease = 'power3.out',
  duration = 0.6,
  stagger = 0.05,
  animateFrom = 'bottom',
  scaleOnHover = true,
  hoverScale = 0.95,
  blurToFocus = true,
  colorShiftOnHover = false,
}) {
  const columns = useMedia(COLUMN_QUERIES, COLUMN_VALUES, 1)
  const [containerRef, { width }] = useMeasure()
  const itemRefs = useRef(new Map())
  const hasMounted = useRef(false)

  const { grid, containerHeight } = useMemo(() => {
    if (!width) return { grid: [], containerHeight: 0 }
    const colHeights = new Array(columns).fill(0)
    const columnWidth = width / columns
    const nextGrid = items.map((child) => {
      const col = colHeights.indexOf(Math.min(...colHeights))
      const x = columnWidth * col
      const height = child.height / 2
      const y = colHeights[col]
      colHeights[col] += height
      return { ...child, x, y, w: columnWidth, h: height }
    })
    return { grid: nextGrid, containerHeight: Math.max(...colHeights) }
  }, [columns, items, width])

  useLayoutEffect(() => {
    if (!grid.length) return undefined
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const context = gsap.context(() => {
      grid.forEach((item, index) => {
        const element = itemRefs.current.get(item.id)
        if (!element) return
        const target = { x: item.x, y: item.y, width: item.w, height: item.h }
        if (!hasMounted.current && !reducedMotion) {
          const origins = {
            top: { x: item.x, y: -200 },
            bottom: { x: item.x, y: window.innerHeight + 160 },
            left: { x: -item.w, y: item.y },
            right: { x: window.innerWidth + item.w, y: item.y },
            center: { x: width / 2 - item.w / 2, y: containerHeight / 2 - item.h / 2 },
          }
          const randomDirections = ['top', 'bottom', 'left', 'right']
          const direction = animateFrom === 'random' ? randomDirections[index % randomDirections.length] : animateFrom
          gsap.fromTo(element, {
            opacity: 0,
            ...(origins[direction] ?? { x: item.x, y: item.y + 100 }),
            width: item.w,
            height: item.h,
            ...(blurToFocus ? { filter: 'blur(10px)' } : {}),
          }, {
            opacity: 1,
            ...target,
            filter: 'blur(0px)',
            duration: 0.8,
            ease: 'power3.out',
            delay: index * stagger,
          })
        } else if (reducedMotion) {
          gsap.set(element, { opacity: 1, ...target, filter: 'none' })
        } else {
          gsap.to(element, { opacity: 1, filter: 'blur(0px)', ...target, duration, ease, overwrite: 'auto' })
        }
      })
    }, containerRef)
    hasMounted.current = true
    return () => context.revert()
  }, [animateFrom, blurToFocus, containerHeight, duration, ease, grid, stagger, width])

  const handleMouseEnter = (event) => {
    if (scaleOnHover) gsap.to(event.currentTarget, { scale: hoverScale, duration: 0.3, ease: 'power2.out' })
    if (colorShiftOnHover) gsap.to(event.currentTarget.querySelector('.color-overlay'), { opacity: 0.3, duration: 0.3 })
  }

  const handleMouseLeave = (event) => {
    if (scaleOnHover) gsap.to(event.currentTarget, { scale: 1, duration: 0.3, ease: 'power2.out' })
    if (colorShiftOnHover) gsap.to(event.currentTarget.querySelector('.color-overlay'), { opacity: 0, duration: 0.3 })
  }

  return (
    <div ref={containerRef} className="masonry-list" style={{ height: containerHeight }}>
      {grid.map((item) => (
        <article
          ref={(element) => {
            if (element) itemRefs.current.set(item.id, element)
            else itemRefs.current.delete(item.id)
          }}
          key={item.id}
          className="masonry-item-wrapper"
          onClick={() => window.open(item.url || item.src, '_blank', 'noopener,noreferrer')}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="masonry-item-media">
            {item.media === 'video'
              ? <LazyVideo src={item.src} title={item.title} />
              : <img className="masonry-media" src={item.src} alt={item.title} loading="lazy" decoding="async" />}
            {colorShiftOnHover && <div className="color-overlay" />}
            <div className="masonry-item-shade" />
            {item.media === 'video' && <span className="masonry-play">PLAY</span>}
            <footer><small>{item.group}</small><strong>{item.title}</strong><span>{item.id}</span></footer>
          </div>
        </article>
      ))}
    </div>
  )
}
