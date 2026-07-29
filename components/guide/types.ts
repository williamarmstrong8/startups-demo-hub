import type { ReactNode } from 'react'
import type { BrandId } from './brand-logos'

export type GuideMode = 'full' | 'live' | 'demo'

/** A piece of software or an account needed before starting a build. */
export interface Requirement {
  brand: BrandId
  /** Display name, e.g. "Cursor". */
  name: string
  /** What it is needed for, in a few words. */
  note: string
  /** Where to get it — a download or sign-up page. */
  href: string
  /** Link text, e.g. "Download" or "Create an account". */
  action: string
}

/** A skill listed in a guide's resources rail. */
export interface DemoSkill {
  /** The skill's own name, e.g. `morning_report`. */
  name: string
  /** One line on what it does. */
  note?: string
  /** Set only for skills installed from somewhere public, e.g. skills.sh. */
  href?: string
}

export interface GuideTap {
  /** The step that became active. */
  stepId: string
  /** Seconds into the recording when this step became active. */
  t: number
}

export interface GuideRecording {
  /** Vercel Blob URL of the .mp4 recording. */
  src: string
  /** Recording duration in seconds. */
  duration?: number
  /** Epoch ms when the recording started (used to derive tap timings). */
  startedAt?: number
  /** Ordered tap timings that drive replay highlighting. */
  taps?: GuideTap[]
}

export interface DemoHighlight {
  label: string
  value: string
}

/** Whoever ran the session, credited under the video. */
export interface DemoHost {
  name: string
  /** Job title, e.g. "Solutions Architect". */
  title?: string
  /** Square headshot in `/public`. */
  avatar?: string
  /** Profiles to link, shown as icon-only buttons in this order. */
  socials?: { brand: BrandId; href: string }[]
}

export interface DemoMeta {
  /** URL slug — canonical page is /demo/[slug], build guide is /g/[slug]. */
  slug?: string
  title: string
  date?: string
  summary?: string
  tags?: string[]
  /** Who ran the session. Credited under the video on the demo page. */
  hosts?: DemoHost[]
  /** Rows of the guide's "At a glance" card. Omit to hide the card. */
  highlights?: DemoHighlight[]
  /** Software and accounts needed. Shown in the guide's step and its resources rail. */
  requirements?: Requirement[]
  /** Ordered steps — used by the demo view (survives client/server boundaries). */
  steps?: StepInfo[]
  /** Present only when a demo has an archived recording. */
  recording?: GuideRecording
  /** Poster image for hub cards. Takes precedence over `thumbnailTime`. */
  poster?: string
  /** Seconds into the recording to use as the hub card frame. */
  thumbnailTime?: number
  /** Renders in the hub's hero slot instead of the grid. */
  featured?: boolean
  /** True when an authored build guide page exists at /g/[slug]. */
  hasGuide?: boolean
}

export interface StepInfo {
  id: string
  title: string
}

export interface GuideContextValue {
  meta: DemoMeta
  /** Ordered list of steps, derived from the authored <Step> children. */
  steps: StepInfo[]
  currentStepId: string | null
  setCurrentStepId: (id: string) => void
  goNext: () => void
  goPrev: () => void
  mode: GuideMode
  /** Replay: seek the video to the tap time for a step (no-op without a recording). */
  seek: (id: string) => void
  /** Replay: whether a step has a known tap time (so it can be made seekable). */
  hasTap: (id: string) => boolean
  /** Replay: keep the active step scrolled into view. */
  autoScroll: boolean
  toggleAutoScroll: () => void
}

export interface StepProps {
  id: string
  title: string
  children?: ReactNode
}
