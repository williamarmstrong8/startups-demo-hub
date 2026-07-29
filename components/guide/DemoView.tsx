'use client'

import Link from 'next/link'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from 'react'
import { BrandLogo, brandTitle } from './brand-logos'
import { GuideContext } from './guide-context'
import type { DemoMeta, GuideTap } from './types'
import { extractSteps } from './utils'
import styles from './demo.module.css'

interface DemoViewProps {
  meta: DemoMeta
  children: ReactNode
}

/**
 * Where each recording was left, so stepping out to the hub and back does not
 * start it over. Module scope rather than storage: it only has to survive
 * client-side navigation, and a full reload is a reasonable place to start
 * again.
 */
const playbackState = new Map<string, { t: number; paused: boolean }>()

/**
 * Demo playback view: video is the main focus; a sticky sidebar card shows
 * one build-guide step at a time, synced to the recording via tap timings.
 */
export function DemoView({ meta, children }: DemoViewProps) {
  const steps = useMemo(
    () => meta.steps ?? extractSteps(children),
    [meta.steps, children]
  )
  const recording = meta.recording!
  const taps: GuideTap[] = useMemo(
    () => [...(recording.taps ?? [])].sort((a, b) => a.t - b.t),
    [recording.taps]
  )

  const [currentStepId, setCurrentStepId] = useState<string | null>(
    () => steps[0]?.id ?? null
  )
  const videoRef = useRef<HTMLVideoElement>(null)
  const [needsUnmute, setNeedsUnmute] = useState(false)

  /* Attaches the recording, picks up where a previous visit left off, and starts
   * playing. Browsers refuse autoplay with sound until a visitor has interacted
   * with the origin, so fall back to a muted start and offer the sound back
   * rather than not playing at all. */
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let active = true
    const key = meta.slug ?? recording.src
    const saved = playbackState.get(key)
    const resumeAt = saved?.t ?? 0

    /* The source is attached here rather than in JSX so the cleanup below can
     * drop it again: React only writes an attribute it believes has changed, so
     * it would not restore a `src` it had already set. */
    video.src = recording.src

    if (resumeAt > 0) {
      video.addEventListener(
        'loadedmetadata',
        () => {
          video.currentTime = resumeAt
        },
        { once: true }
      )
    }

    /* Someone who paused before leaving does not want sound the moment they come
     * back, so only a fresh visit or one left playing starts itself. */
    if (!saved?.paused) {
      void video.play().catch(() => {
        if (!active) return
        video.muted = true
        void video
          .play()
          .then(() => active && setNeedsUnmute(true))
          .catch(() => {
            video.muted = false
          })
      })
    }

    return () => {
      active = false

      // A recording watched to the end has nothing to resume, so forgetting it
      // lets the next visit behave like the first one.
      if (video.ended) playbackState.delete(key)
      else playbackState.set(key, { t: video.currentTime, paused: video.paused })

      /* Leaving the route detaches the element, which is not enough to stop it:
       * the browser keeps the media object alive and sounding until it is
       * collected, so the audio carries on over the hub and the next visit
       * mounts a second one on top of it. Dropping the source leaves nothing to
       * play, and stops the download with it. */
      video.pause()
      video.removeAttribute('src')
      video.load()
    }
  }, [meta.slug, recording.src])

  const enableSound = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    video.muted = false
    setNeedsUnmute(false)
    void video.play().catch(() => {})
  }, [])

  const currentIndex = steps.findIndex((s) => s.id === currentStepId)
  const currentStep = currentIndex >= 0 ? steps[currentIndex] : steps[0]

  const hasTap = useCallback(
    (id: string) => taps.some((t) => t.stepId === id),
    [taps]
  )

  const seek = useCallback(
    (id: string) => {
      const tap = taps.find((t) => t.stepId === id)
      const video = videoRef.current
      if (video && tap) {
        video.currentTime = tap.t + 0.05
        void video.play().catch(() => {})
      }
      setCurrentStepId(id)
    },
    [taps]
  )

  const goNext = useCallback(() => {
    const next = steps[currentIndex + 1]
    if (next) seek(next.id)
  }, [steps, currentIndex, seek])

  const goPrev = useCallback(() => {
    const prev = steps[currentIndex - 1]
    if (prev) seek(prev.id)
  }, [steps, currentIndex, seek])

  const handleTimeUpdate = useCallback(() => {
    const t = videoRef.current?.currentTime ?? 0
    let active: string | null = null
    for (const tap of taps) {
      if (tap.t <= t + 0.001) active = tap.stepId
      else break
    }
    if (active && active !== currentStepId) setCurrentStepId(active)
  }, [taps, currentStepId])

  const value = useMemo(
    () => ({
      meta,
      steps,
      currentStepId,
      setCurrentStepId: seek,
      goNext,
      goPrev,
      mode: 'demo' as const,
      seek,
      hasTap,
      autoScroll: false,
      toggleAutoScroll: () => {}
    }),
    [meta, steps, currentStepId, seek, goNext, goPrev, hasTap]
  )

  const guideHref = meta.hasGuide && meta.slug ? `/g/${meta.slug}` : null

  return (
    <GuideContext.Provider value={value}>
      {/* Marks this route for Pagefind, which skips pages without the attribute.
        * MDX pages get it from Nextra's wrapper; this route renders outside it. */}
      <div className={styles.page} data-pagefind-body>
        <div className={styles.topBar}>
          <Link href="/" className={styles.backLink}>
            ← All demos
          </Link>

          {guideHref && (
            <Link href={guideHref} className={styles.guideLink}>
              Read the build guide →
            </Link>
          )}
        </div>

        <div className={styles.layout}>
          <div className={styles.videoPanel}>
            <div className={styles.videoFrame}>
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              {/* `src` and playback are owned by the effect above, so there is
                * no `autoPlay` here: the attribute would start a second, muted
                * attempt of its own before the effect could restore the
                * position. */}
              <video
                ref={videoRef}
                className={styles.video}
                poster={meta.poster}
                controls
                playsInline
                preload="auto"
                onTimeUpdate={handleTimeUpdate}
                onVolumeChange={() => {
                  if (videoRef.current && !videoRef.current.muted) {
                    setNeedsUnmute(false)
                  }
                }}
              />

              {needsUnmute && (
                <button
                  type="button"
                  className={styles.unmuteBtn}
                  onClick={enableSound}
                >
                  Playing muted — turn on sound
                </button>
              )}
            </div>

            <div className={styles.videoMeta}>
              {meta.hosts?.length ? (
                <section className={styles.hosts}>
                  <h2 className={styles.hostsLabel}>
                    {meta.hosts.length > 1 ? 'Hosts' : 'Host'}
                  </h2>
                  <ul className={styles.hostList}>
                    {meta.hosts.map((host) => (
                      <li key={host.name} className={styles.host}>
                        {host.avatar && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            className={styles.hostAvatar}
                            src={host.avatar}
                            alt=""
                            width={44}
                            height={44}
                          />
                        )}
                        <div className={styles.hostText}>
                          <p className={styles.hostName}>{host.name}</p>
                          {host.title && (
                            <p className={styles.hostTitle}>{host.title}</p>
                          )}
                        </div>
                        {host.socials?.length ? (
                          <div className={styles.hostLinks}>
                            {host.socials.map((social) => (
                              <a
                                key={social.brand}
                                className={styles.hostLink}
                                href={social.href}
                                target="_blank"
                                rel="noreferrer"
                                title={`${host.name} on ${brandTitle(social.brand)}`}
                                aria-label={`${host.name} on ${brandTitle(social.brand)}`}
                              >
                                <BrandLogo brand={social.brand} size={15} />
                              </a>
                            ))}
                          </div>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              <h1 className={styles.title}>{meta.title}</h1>
              {meta.summary && <p className={styles.summary}>{meta.summary}</p>}
              {(meta.date || recording.duration) && (
                <p className={styles.byline}>
                  {[
                    meta.date,
                    recording.duration
                      ? `${Math.round(recording.duration / 60)} min`
                      : null
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
              )}
            </div>
          </div>

          <aside className={styles.stepCard} aria-live="polite">
            <header className={styles.cardHead}>
              <p className={styles.stepLabel}>
                Step {currentIndex + 1} of {steps.length}
              </p>
              <h2 className={styles.stepTitle}>{currentStep?.title}</h2>
            </header>

            <div className={styles.cardBody} key={currentStepId ?? 'empty'}>
              {children}
            </div>

            <footer className={styles.cardFoot}>
              <button
                type="button"
                className={`${styles.navBtn} ${styles.navPrev}`}
                onClick={goPrev}
                disabled={currentIndex <= 0}
              >
                Prev ←
              </button>

              <div className={styles.stepDots} aria-label="Steps">
                {steps.map((step, i) => (
                  <button
                    key={step.id}
                    type="button"
                    className={`${styles.dot} ${i === currentIndex ? styles.dotActive : ''}`}
                    aria-label={`Go to step ${i + 1}: ${step.title}`}
                    aria-current={i === currentIndex ? 'step' : undefined}
                    onClick={() => seek(step.id)}
                  />
                ))}
              </div>

              <button
                type="button"
                className={`${styles.navBtn} ${styles.navNext}`}
                onClick={goNext}
                disabled={currentIndex >= steps.length - 1}
              >
                Next →
              </button>
            </footer>
          </aside>
        </div>
      </div>
    </GuideContext.Provider>
  )
}
