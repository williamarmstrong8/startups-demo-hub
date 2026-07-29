import type { ReactElement } from 'react'
import type { DemoMeta } from '@/components/guide/types'
import {
  demoMeta as alfredMeta,
  DemoSteps as AlfredSteps
} from './build-a-personal-ai-assistant-with-eve'
import {
  demoMeta as tarsMeta,
  DemoSteps as TarsSteps
} from './build-a-startup-landing-page-with-v0'
import {
  demoMeta as backendsMeta,
  DemoSteps as BackendsSteps
} from './frontends-vs-backends'

export interface DemoEntry {
  meta: DemoMeta
  /** Step content, shared by the player's step card and the build guide page. */
  Steps: () => ReactElement
}

/**
 * The demo catalog. Declaration order is the display order on the hub, so the
 * newest recording goes first.
 */
const demos: Record<string, DemoEntry> = {
  'frontends-vs-backends': {
    meta: backendsMeta,
    Steps: BackendsSteps
  },
  'build-a-startup-landing-page-with-v0': {
    meta: tarsMeta,
    Steps: TarsSteps
  },
  'build-a-personal-ai-assistant-with-eve': {
    meta: alfredMeta,
    Steps: AlfredSteps
  }
}

export function getDemo(slug: string): DemoEntry | undefined {
  return demos[slug]
}

export function getDemoSlugs(): string[] {
  return Object.keys(demos)
}

/** Every demo that has a playable recording, in catalog order. */
export function getAllDemos(): DemoEntry[] {
  return Object.values(demos).filter((demo) => demo.meta.recording?.src)
}

/** The hero demo for the hub — the one flagged `featured`, else the first. */
export function getFeaturedDemo(): DemoEntry | undefined {
  const all = getAllDemos()
  return all.find((demo) => demo.meta.featured) ?? all[0]
}

/** Formats a duration in seconds as `h:mm:ss` or `m:ss`. */
export function formatDuration(seconds?: number): string | null {
  if (!seconds || seconds <= 0) return null

  const total = Math.round(seconds)
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const secs = total % 60
  const pad = (n: number) => String(n).padStart(2, '0')

  return hours > 0
    ? `${hours}:${pad(minutes)}:${pad(secs)}`
    : `${minutes}:${pad(secs)}`
}
