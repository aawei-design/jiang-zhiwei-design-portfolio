import { useEffect, useLayoutEffect } from 'react'
import { gsap } from 'gsap'

import App from './App.jsx'
import Dock from './Dock.jsx'
import LiquidEther from './LiquidEther.jsx'
import MediaLightbox from './MediaLightbox.jsx'

const MEDIA_SELECTOR = 'main img:not(.pc-avatar):not([src*="/logos/"]), main video'
const LONG_IMAGE_SELECTOR = '.vip-promo-long-story img, .archive-item--long-scroll img'
const LONG_SCROLL_SELECTOR = [
  '.vip-promo-long-grid figure',
  '.vip-promo-long-story figure',
  '.mihome-long-scrolls figure',
  '.ip-app--scrollable',
  '.archive-item--long-scroll .archive-art',
].join(', ')

function isLongImage(element) {
  if (!element.matches('img')) return false
  if (element.matches(LONG_IMAGE_SELECTOR)) return true
  return element.naturalWidth > 0 && element.naturalHeight / element.naturalWidth >= 2.2
}

function MasonryMediaEffects({
  ease = 'elastic.out(1, 0.75)',
  duration = 0.9,
  stagger = 0.08,
  animateFrom = 'bottom',
  scaleOnHover = true,
  hoverScale = 0.95,
  blurToFocus = true,
  colorShiftOnHover = false,
}) {
  useEffect(() => {
    const media = [...document.querySelectorAll(MEDIA_SELECTOR)]
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const entered = new WeakSet()
    const cleanup = []

    const offsets = {
      top: { y: -64 },
      bottom: { y: 64 },
      left: { x: -64 },
      right: { x: 64 },
      center: { scale: 0.86 },
    }

    const reveal = (elements) => {
      const fresh = elements.filter((element) => !entered.has(element))
      fresh.forEach((element) => entered.add(element))
      if (!fresh.length) return

      if (reducedMotion) {
        gsap.set(fresh, { opacity: 1, clearProps: 'transform,filter' })
        return
      }

      gsap.fromTo(fresh, {
        opacity: 0,
        ...(offsets[animateFrom] || offsets.bottom),
        ...(blurToFocus ? { filter: 'blur(10px)' } : {}),
      }, {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        duration,
        ease,
        stagger,
        overwrite: 'auto',
      })
    }

    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).map((entry) => entry.target)
      reveal(visible)
      visible.forEach((element) => observer.unobserve(element))
    }, { rootMargin: '8% 0px', threshold: 0.06 })

    media.forEach((element) => {
      if (!reducedMotion) gsap.set(element, { opacity: 0 })
      observer.observe(element)

      const onEnter = () => {
        const tween = {
          ...(scaleOnHover ? { scale: isLongImage(element) ? 1 : hoverScale } : {}),
          ...(colorShiftOnHover ? { filter: 'saturate(1.18) hue-rotate(-7deg)' } : {}),
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto',
        }
        gsap.to(element, tween)
      }
      const onLeave = () => gsap.to(element, {
        scale: 1,
        filter: 'blur(0px)',
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto',
      })

      element.addEventListener('pointerenter', onEnter)
      element.addEventListener('pointerleave', onLeave)
      cleanup.push(() => {
        element.removeEventListener('pointerenter', onEnter)
        element.removeEventListener('pointerleave', onLeave)
      })
    })

    return () => {
      observer.disconnect()
      cleanup.forEach((remove) => remove())
      gsap.killTweensOf(media)
      gsap.set(media, { clearProps: 'opacity,transform,filter' })
    }
  }, [animateFrom, blurToFocus, colorShiftOnHover, duration, ease, hoverScale, scaleOnHover, stagger])

  return null
}

export default function MasonryCloneApp() {
  useLayoutEffect(() => {
    const storageKey = `masonry-scroll:${window.location.pathname}${window.location.search}`
    const navigationEntry = window.performance.getEntriesByType('navigation')[0]
    const isReload = navigationEntry?.type === 'reload'
    const previousScrollRestoration = window.history.scrollRestoration
    let scrollFrame = null
    let restoreFrame = null
    let settled = null
    let longImageFrame = null
    let longImageSettled = null
    let isRestoring = false
    let finalizeReloadRestore = null

    const scrollToHash = () => {
      if (!window.location.hash) return
      const id = decodeURIComponent(window.location.hash.slice(1))
      document.getElementById(id)?.scrollIntoView()
    }

    const saveScrollPosition = () => {
      try {
        window.sessionStorage.setItem(storageKey, String(window.scrollY))
      } catch {
        // Storage can be unavailable in hardened/private browser contexts.
      }
    }

    const queueScrollSave = () => {
      if (isRestoring) return
      if (scrollFrame !== null) return
      scrollFrame = window.requestAnimationFrame(() => {
        scrollFrame = null
        saveScrollPosition()
      })
    }

    const resetLongImageScroll = () => {
      document.querySelectorAll(LONG_SCROLL_SELECTOR).forEach((element) => {
        element.scrollTo({ top: 0, left: 0, behavior: 'auto' })
      })
    }

    if (isReload) {
      let savedPosition = null
      try {
        savedPosition = window.sessionStorage.getItem(storageKey)
      } catch {
        savedPosition = null
      }

      const scrollY = Number(savedPosition)
      if (savedPosition !== null && Number.isFinite(scrollY)) {
        const retainedHash = window.location.hash
        const baseUrl = `${window.location.pathname}${window.location.search}`
        isRestoring = true
        window.history.scrollRestoration = 'manual'
        if (retainedHash) window.history.replaceState(null, '', baseUrl)

        const restorePosition = () => window.scrollTo({ top: scrollY, left: 0, behavior: 'auto' })
        finalizeReloadRestore = () => {
          if (!isRestoring) return
          restorePosition()
          if (retainedHash) window.history.replaceState(null, '', `${baseUrl}${retainedHash}`)
          restoreFrame = window.requestAnimationFrame(restorePosition)
          isRestoring = false
          saveScrollPosition()
        }

        restoreFrame = window.requestAnimationFrame(restorePosition)
        if (document.readyState === 'complete') {
          settled = window.setTimeout(finalizeReloadRestore, 0)
        } else {
          window.addEventListener('pageshow', finalizeReloadRestore, { once: true })
        }
      }
    } else {
      window.history.scrollRestoration = 'manual'
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#top`)
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    }

    longImageFrame = window.requestAnimationFrame(resetLongImageScroll)
    longImageSettled = window.setTimeout(resetLongImageScroll, 240)

    window.addEventListener('hashchange', scrollToHash)
    window.addEventListener('scroll', queueScrollSave, { passive: true })
    window.addEventListener('pageshow', resetLongImageScroll)
    window.addEventListener('pagehide', saveScrollPosition)
    window.addEventListener('beforeunload', saveScrollPosition)

    return () => {
      if (scrollFrame !== null) window.cancelAnimationFrame(scrollFrame)
      if (restoreFrame !== null) window.cancelAnimationFrame(restoreFrame)
      if (longImageFrame !== null) window.cancelAnimationFrame(longImageFrame)
      if (settled !== null) window.clearTimeout(settled)
      if (longImageSettled !== null) window.clearTimeout(longImageSettled)
      window.removeEventListener('hashchange', scrollToHash)
      window.removeEventListener('scroll', queueScrollSave)
      window.removeEventListener('pageshow', resetLongImageScroll)
      if (finalizeReloadRestore) window.removeEventListener('pageshow', finalizeReloadRestore)
      window.removeEventListener('pagehide', saveScrollPosition)
      window.removeEventListener('beforeunload', saveScrollPosition)
      window.history.scrollRestoration = previousScrollRestoration
    }
  }, [])

  return (
    <>
      <LiquidEther
        className="liquid-ether-background"
        style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh' }}
        colors={['#5ce5d4', '#43a1ff', '#5227FF']}
        mouseForce={10}
        cursorSize={110}
        resolution={0.5}
        isBounce
        autoDemo
        autoSpeed={0.6}
        autoIntensity={1.8}
        takeoverDuration={0.25}
        autoResumeDelay={3000}
        autoRampDuration={0.6}
      />
      <App enhancedNav enhancedProfile enhancedContent />
      <MasonryMediaEffects />
      <Dock panelHeight={68} baseItemSize={50} magnification={70} />
      <MediaLightbox />
    </>
  )
}
