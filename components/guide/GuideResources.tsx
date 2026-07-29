'use client'

import { usePathname } from 'next/navigation'
import { BrandLogo } from './brand-logos'
import type { DemoSkill, Requirement } from './types'
import styles from './resources.module.css'

interface Resources {
  requirements: Requirement[]
  skills: DemoSkill[]
}

/**
 * The guide's right-hand rail: the software the build needs and the skills it
 * produces, as a menu that mirrors the step outline on the left.
 *
 * It renders in the theme's shared right column, so it is handed every guide's
 * resources and picks its own out by route, rendering nothing off a guide page.
 */
export function GuideResources({ index }: { index: Record<string, Resources> }) {
  const pathname = usePathname() ?? ''
  const slug = pathname.replace(/\/$/, '').split('/g/')[1]
  const resources = slug ? index[slug] : undefined

  if (!resources) return null

  const { requirements, skills } = resources

  return (
    <div className={styles.rail}>
      <p className={styles.title}>Resources</p>

      {requirements.length > 0 && (
        <>
          <p className={styles.group}>What you need</p>
          <ul className={styles.list}>
            {requirements.map((item) => (
              <li key={item.name}>
                <a
                  className={styles.link}
                  href={item.href}
                  title={item.note}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className={styles.icon}>
                    <BrandLogo brand={item.brand} size={14} />
                  </span>
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </>
      )}

      {skills.length > 0 && (
        <>
          <p className={styles.group}>Skills used</p>
          <ul className={styles.list}>
            {skills.map((skill) => {
              const glyph = (
                <>
                  <span className={styles.icon}>
                    <SkillGlyph />
                  </span>
                  {skill.name}
                </>
              )

              return (
                <li key={skill.name}>
                  {/* Only the skills installed from somewhere public have a page
                    * of their own to link to; the rest are written in the build,
                    * so the guide's own step is where they live. */}
                  {skill.href ? (
                    <a
                      className={styles.link}
                      href={skill.href}
                      title={skill.note}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {glyph}
                    </a>
                  ) : (
                    <span className={styles.item} title={skill.note}>
                      {glyph}
                    </span>
                  )}
                </li>
              )
            })}
          </ul>
        </>
      )}
    </div>
  )
}

/** Skills are markdown files, so they get a page mark rather than a brand mark. */
function SkillGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M9.5 1.75H4.25a1.5 1.5 0 0 0-1.5 1.5v9.5a1.5 1.5 0 0 0 1.5 1.5h7.5a1.5 1.5 0 0 0 1.5-1.5V5.5L9.5 1.75Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M9.25 2v3.25h3.5M5.5 8.5h5M5.5 11h3"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
