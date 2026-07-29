import Link from 'next/link'
import { FeedbackForm } from './FeedbackForm'
import styles from './feedback.module.css'

/* Prompts for the kind of feedback that is actually actionable, so the textarea
 * is not the only thing on the page telling people what to write. */
const PROMPTS = [
  {
    title: 'Was a step wrong?',
    body: 'A command that failed, a prompt that drifted, a version that has moved on.'
  },
  {
    title: 'What should we build next?',
    body: 'The build you would watch end to end, and the stack you want it on.'
  },
  {
    title: 'Where did you get stuck?',
    body: 'The point where the guide stopped matching what you saw on screen.'
  }
]

/**
 * The feedback route: framing, a few prompts, and the form itself. Server
 * rendered apart from the form, which owns all of the interactive state.
 */
export function FeedbackPage() {
  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <p className={styles.eyebrow}>Feedback</p>
        <h1 className={styles.title}>Tell us what to fix next</h1>
        <p className={styles.lead}>
          Every demo and guide here is meant to be followed along with, so the useful
          feedback is the specific kind: the step that broke, the build you wanted
          instead, the thing you could not find. It takes a minute.
        </p>
      </header>

      <ul className={styles.prompts}>
        {PROMPTS.map((prompt) => (
          <li key={prompt.title} className={styles.prompt}>
            <h2 className={styles.promptTitle}>{prompt.title}</h2>
            <p className={styles.promptBody}>{prompt.body}</p>
          </li>
        ))}
      </ul>

      <FeedbackForm />

      <p className={styles.footnote}>
        Nothing is submitted anywhere yet. This page is the interface only. In the
        meantime, the <Link href="/">demo library</Link> is where the current material
        lives.
      </p>
    </div>
  )
}
