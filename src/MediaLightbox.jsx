import { useEffect, useRef, useState } from 'react'

const MEDIA_SELECTOR = [
  '.work img.project-visual',
  '.work video.project-visual',
  '.casebook img:not([src*="/logos/"])',
  '.casebook video',
].join(', ')

function isInViewport(element) {
  const rect = element.getBoundingClientRect()
  return rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth
}

export default function MediaLightbox() {
  const [media, setMedia] = useState(null)
  const pausedVideosRef = useRef([])
  const previousFocusRef = useRef(null)
  const overlayRef = useRef(null)

  useEffect(() => {
    const protectedSelector = 'main img, main video, .media-lightbox-content'
    const preventMediaAction = (event) => {
      if (event.target.closest?.(protectedSelector)) event.preventDefault()
    }

    document.addEventListener('contextmenu', preventMediaAction)
    document.addEventListener('dragstart', preventMediaAction)
    return () => {
      document.removeEventListener('contextmenu', preventMediaAction)
      document.removeEventListener('dragstart', preventMediaAction)
    }
  }, [])

  useEffect(() => {
    const openMedia = (event) => {
      const target = event.target.closest?.('img, video')
      if (!target || !target.matches(MEDIA_SELECTOR)) return

      previousFocusRef.current = document.activeElement
      pausedVideosRef.current = [...document.querySelectorAll('main video')]
      pausedVideosRef.current.forEach((video) => video.pause())

      if (target instanceof HTMLVideoElement) {
        setMedia({
          type: 'video',
          src: target.currentSrc || target.src,
          label: target.getAttribute('aria-label') || '作品视频',
        })
      } else {
        setMedia({
          type: 'image',
          src: target.currentSrc || target.src,
          label: target.alt || '作品图片',
        })
      }
    }

    document.addEventListener('click', openMedia)
    return () => document.removeEventListener('click', openMedia)
  }, [])

  useEffect(() => {
    if (!media) return undefined

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    const previousOverflow = document.body.style.overflow
    const previousPaddingRight = document.body.style.paddingRight
    document.body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setMedia(null)
    }

    window.addEventListener('keydown', closeOnEscape)
    overlayRef.current?.focus({ preventScroll: true })

    return () => {
      window.removeEventListener('keydown', closeOnEscape)
      document.body.style.overflow = previousOverflow
      document.body.style.paddingRight = previousPaddingRight
      pausedVideosRef.current.forEach((video) => {
        if (isInViewport(video) && !document.hidden) video.play().catch(() => {})
      })
      pausedVideosRef.current = []
      previousFocusRef.current?.focus?.({ preventScroll: true })
    }
  }, [media])

  if (!media) return null

  return (
    <div
      ref={overlayRef}
      className="media-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`${media.label} · 点击返回`}
      tabIndex={-1}
      onClick={() => setMedia(null)}
    >
      <div className="media-lightbox-stage">
        {media.type === 'video' ? (
          <video
            className="media-lightbox-content"
            src={media.src}
            aria-label={media.label}
            autoPlay
            loop
            playsInline
            preload="auto"
            controls
            controlsList="nodownload noremoteplayback"
            disablePictureInPicture
            disableRemotePlayback
            draggable={false}
            onClick={(event) => event.stopPropagation()}
            onLoadedMetadata={(event) => {
              event.currentTarget.muted = false
              event.currentTarget.volume = 0.1
              event.currentTarget.currentTime = 0
              event.currentTarget.play().catch(() => {})
            }}
          />
        ) : (
          <img className="media-lightbox-content" src={media.src} alt={media.label} draggable={false} />
        )}
        <button className="media-lightbox-close" type="button" onClick={() => setMedia(null)} aria-label="关闭单独观看">×</button>
        <span className="media-lightbox-hint">点击背景返回 · ESC</span>
      </div>
    </div>
  )
}
