import type { DemoSkill, Requirement } from '@/components/guide'
import { getAllDemos } from './index'
import { getSkillsForDemo } from './skills'

export interface GuideResources {
  requirements: Requirement[]
  skills: DemoSkill[]
}

/**
 * Per-guide resources keyed by slug, as plain data. The rail that renders them
 * lives in the theme's right-hand column, which is shared by every page, so it
 * picks its guide out of this map by route.
 *
 * Skills are flattened to a name and a note here so the client never receives
 * the skill sources, which the guide's own code blocks already render. Only the
 * skills installed from somewhere public carry a link.
 */
export function getGuideResourceIndex(): Record<string, GuideResources> {
  const index: Record<string, GuideResources> = {}

  for (const { meta } of getAllDemos()) {
    const slug = meta.slug
    if (!slug || !meta.hasGuide) continue

    const requirements = meta.requirements ?? []
    const group = getSkillsForDemo(slug)
    const skills: DemoSkill[] = group
      ? group.skills.map((skill) => ({
          name: skill.name,
          note: skill.summary,
          href: skill.href
        }))
      : []

    if (!requirements.length && !skills.length) continue

    index[slug] = { requirements, skills }
  }

  return index
}
