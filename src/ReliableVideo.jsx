import { useEffect, useRef, useState } from 'react'

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

const pendingVideoLoads = []
let videoLoadTimer = null

function flushVideoLoadQueue() {
  videoLoadTimer = null
  const next = pendingVideoLoads.shift()
  if (!next) return
  next.start(() => {})
  if (pendingVideoLoads.length) videoLoadTimer = window.setTimeout(flushVideoLoadQueue, 140)
}

function enqueueVideoLoad(start) {
  const entry = { start }
  pendingVideoLoads.push(entry)
  if (videoLoadTimer === null) {
    const begin = () => {
      if (videoLoadTimer === null) videoLoadTimer = window.setTimeout(flushVideoLoadQueue, 0)
    }
    if ('requestIdleCallback' in window) window.requestIdleCallback(begin, { timeout: 900 })
    else window.setTimeout(begin, 120)
  }
  return () => {
    const index = pendingVideoLoads.indexOf(entry)
    if (index >= 0) pendingVideoLoads.splice(index, 1)
  }
}

export default function ReliableVideo({ src, enabled = false, className = '', autoPlay = true, poster, ...props }) {
  const versionedSrc = withMediaVersion(src)
  const resolvedPoster = poster || posterFromSrc(src)
  const videoRef = useRef(null)
  const visibleRef = useRef(false)
  const requestedRef = useRef(false)
  const finishLoadRef = useRef(null)
  const cancelLoadRef = useRef(null)
  const retryCountRef = useRef(0)
  const retryTimerRef = useRef(null)
  const stallTimerRef = useRef(null)
  const loadTimeoutRef = useRef(null)
  const [shouldLoad, setShouldLoad] = useState(!enabled)
  const [isReady, setIsReady] = useState(false)

  const finishQueuedLoad = () => {
    if (loadTimeoutRef.current !== null) {
      window.clearTimeout(loadTimeoutRef.current)
      loadTimeoutRef.current = null
    }
    finishLoadRef.current?.()
    finishLoadRef.current = null
  }

  const playIfVisible = () => {
    const video = videoRef.current
    if (!video || !autoPlay || !visibleRef.current || document.hidden) return
    video.play().catch(() => {})
  }

  useEffect(() => {
    const video = videoRef.current
    if (!video || !enabled) return undefined

    const requestLoad = () => {
      if (requestedRef.current) return
      requestedRef.current = true
      cancelLoadRef.current = enqueueVideoLoad((done) => {
        finishLoadRef.current = done
        setShouldLoad(true)
        loadTimeoutRef.current = window.setTimeout(finishQueuedLoad, 12000)
      })
    }

    const playbackObserver = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting && entry.intersectionRatio > 0.08
      if (visibleRef.current) playIfVisible()
      else video.pause()
    }, { threshold: [0, 0.08, 0.35] })

    const handleVisibility = () => {
      if (document.hidden) video.pause()
      else playIfVisible()
    }

    requestLoad()
    playbackObserver.observe(video)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      playbackObserver.disconnect()
      document.removeEventListener('visibilitychange', handleVisibility)
      cancelLoadRef.current?.()
      cancelLoadRef.current = null
      finishQueuedLoad()
      if (retryTimerRef.current !== null) window.clearTimeout(retryTimerRef.current)
      if (stallTimerRef.current !== null) window.clearTimeout(stallTimerRef.current)
    }
  }, [enabled, versionedSrc])

  useEffect(() => {
    if (!enabled || !shouldLoad || !videoRef.current) return
    videoRef.current.load()
  }, [enabled, shouldLoad, versionedSrc])

  const handleLoadedData = () => {
    setIsReady(true)
    retryCountRef.current = 0
    finishQueuedLoad()
    playIfVisible()
  }

  const retryLoad = () => {
    const video = videoRef.current
    if (!video || retryCountRef.current >= 2) return
    retryCountRef.current += 1
    const delay = 700 * retryCountRef.current
    if (retryTimerRef.current !== null) window.clearTimeout(retryTimerRef.current)
    retryTimerRef.current = window.setTimeout(() => {
      retryTimerRef.current = null
      video.load()
      playIfVisible()
    }, delay)
  }

  const handleStalled = () => {
    if (!visibleRef.current || !videoRef.current || videoRef.current.readyState >= 2) return
    if (stallTimerRef.current !== null) window.clearTimeout(stallTimerRef.current)
    stallTimerRef.current = window.setTimeout(() => {
      stallTimerRef.current = null
      if (videoRef.current?.readyState < 2) retryLoad()
    }, 1600)
  }

  return (
    <video
      {...props}
      ref={videoRef}
      className={`${className} reliable-video${isReady ? ' is-video-ready' : ''}`.trim()}
      src={shouldLoad ? versionedSrc : undefined}
      poster={resolvedPoster}
      muted
      loop
      playsInline
      autoPlay={!enabled && autoPlay}
      preload={enabled ? (shouldLoad ? 'metadata' : 'none') : (props.preload || 'metadata')}
      onLoadedData={handleLoadedData}
      onCanPlay={playIfVisible}
      onStalled={handleStalled}
      onError={() => {
        finishQueuedLoad()
        retryLoad()
      }}
    />
  )
}
