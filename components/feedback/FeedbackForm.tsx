'use client'

import { useId, useState } from 'react'
import styles from './feedback.module.css'

const RATINGS = [1, 2, 3, 4, 5] as const

const KINDS = [
  { value: 'idea', label: 'Idea' },
  { value: 'bug', label: 'Something broken' },
  { value: 'content', label: 'Content feedback' },
  { value: 'praise', label: 'Praise' },
  { value: 'other', label: 'Other' }
] as const

const AREAS = [
  { value: '', label: 'Pick an area (optional)' },
  { value: 'demos', label: 'Demo library' },
  { value: 'guides', label: 'Build guides' },
  { value: 'search', label: 'Search' },
  { value: 'site', label: 'The site overall' },
  { value: 'other', label: 'Something else' }
] as const

const MESSAGE_LIMIT = 1200
const MESSAGE_MINIMUM = 10

const RATING_LABELS: Record<number, string> = {
  1: 'Not useful',
  2: 'Could be better',
  3: 'Useful',
  4: 'Very useful',
  5: 'Exactly what I needed'
}

type Status = 'editing' | 'sending' | 'sent'

const EMPTY = {
  rating: 0,
  kind: 'idea' as (typeof KINDS)[number]['value'],
  area: '',
  message: '',
  email: '',
  contactOk: false
}

/**
 * Feedback capture form. Front end only: submitting runs a short pending state
 * and swaps in the confirmation panel. Nothing leaves the browser, and the
 * answers are dropped when the form is reset.
 */
export function FeedbackForm() {
  const formId = useId()
  const [form, setForm] = useState(EMPTY)
  const [status, setStatus] = useState<Status>('editing')
  const [error, setError] = useState<string | null>(null)

  const messageId = `${formId}-message`
  const errorId = `${formId}-error`
  const remaining = MESSAGE_LIMIT - form.message.length
  const tooShort = form.message.trim().length < MESSAGE_MINIMUM

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (tooShort) {
      setError(`Add at least ${MESSAGE_MINIMUM} characters so we know what to act on.`)
      document.getElementById(messageId)?.focus()
      return
    }

    setError(null)
    setStatus('sending')
    // Stands in for the request a real submit handler would make.
    window.setTimeout(() => setStatus('sent'), 700)
  }

  function reset() {
    setForm(EMPTY)
    setError(null)
    setStatus('editing')
  }

  if (status === 'sent') {
    return (
      <div className={styles.done} role="status">
        <span className={styles.doneMark} aria-hidden="true">
          <CheckIcon />
        </span>
        <h2 className={styles.doneTitle}>Thanks, that helps</h2>
        <p className={styles.doneBody}>
          Your notes are queued up for the next round of demos and guides.
          {form.contactOk && form.email
            ? ` We'll follow up at ${form.email} if we have questions.`
            : ''}
        </p>
        <button type="button" className={styles.secondaryButton} onClick={reset}>
          Send more feedback
        </button>
      </div>
    )
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <fieldset className={styles.field}>
        <legend className={styles.label}>How useful is this so far?</legend>
        <div className={styles.rating}>
          {RATINGS.map((value) => {
            const active = form.rating >= value
            return (
              <label
                key={value}
                className={`${styles.star} ${active ? styles.starOn : ''}`}
                title={RATING_LABELS[value]}
              >
                <input
                  type="radio"
                  name="rating"
                  value={value}
                  className={styles.srOnly}
                  checked={form.rating === value}
                  onChange={() => setForm((prev) => ({ ...prev, rating: value }))}
                />
                <StarIcon filled={active} />
                <span className={styles.srOnly}>
                  {value} out of 5: {RATING_LABELS[value]}
                </span>
              </label>
            )
          })}
          <span className={styles.ratingHint}>
            {form.rating ? RATING_LABELS[form.rating] : 'Optional'}
          </span>
        </div>
      </fieldset>

      <fieldset className={styles.field}>
        <legend className={styles.label}>What kind of feedback is it?</legend>
        <div className={styles.pills}>
          {KINDS.map((kind) => (
            <label
              key={kind.value}
              className={`${styles.pill} ${
                form.kind === kind.value ? styles.pillOn : ''
              }`}
            >
              <input
                type="radio"
                name="kind"
                value={kind.value}
                className={styles.srOnly}
                checked={form.kind === kind.value}
                onChange={() => setForm((prev) => ({ ...prev, kind: kind.value }))}
              />
              {kind.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className={styles.field}>
        <label className={styles.label} htmlFor={`${formId}-area`}>
          Which part is it about?
        </label>
        <select
          id={`${formId}-area`}
          name="area"
          className={styles.select}
          value={form.area}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, area: event.target.value }))
          }
        >
          {AREAS.map((area) => (
            <option key={area.value} value={area.value}>
              {area.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor={messageId}>
          Your feedback
        </label>
        <p className={styles.hint}>
          The more specific the better: which demo, which step, what you expected.
        </p>
        <textarea
          id={messageId}
          name="message"
          className={styles.textarea}
          rows={7}
          maxLength={MESSAGE_LIMIT}
          placeholder="What worked, what got in the way, what you wish was here…"
          aria-describedby={error ? errorId : undefined}
          aria-invalid={error ? true : undefined}
          value={form.message}
          onChange={(event) => {
            setForm((prev) => ({ ...prev, message: event.target.value }))
            if (error) setError(null)
          }}
        />
        <p className={styles.counter}>
          {remaining} character{remaining === 1 ? '' : 's'} left
        </p>
        {error && (
          <p id={errorId} className={styles.error} role="alert">
            {error}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor={`${formId}-email`}>
          Email <span className={styles.optional}>optional</span>
        </label>
        <input
          id={`${formId}-email`}
          name="email"
          type="email"
          className={styles.input}
          placeholder="you@company.com"
          autoComplete="email"
          value={form.email}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, email: event.target.value }))
          }
        />
        <label className={styles.checkboxRow}>
          <input
            type="checkbox"
            name="contactOk"
            className={styles.checkbox}
            checked={form.contactOk}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, contactOk: event.target.checked }))
            }
          />
          <span>It&apos;s fine to reply with follow-up questions</span>
        </label>
      </div>

      <div className={styles.actions}>
        <button
          type="submit"
          className={styles.primaryButton}
          disabled={status === 'sending'}
        >
          {status === 'sending' ? 'Sending…' : 'Send feedback'}
        </button>
        <button type="button" className={styles.secondaryButton} onClick={reset}>
          Clear
        </button>
      </div>
    </form>
  )
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3.6l2.6 5.3 5.9.85-4.25 4.15 1 5.9L12 17.05 6.75 19.8l1-5.9L3.5 9.75l5.9-.85z" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.5 12.5l5 5 10-11" />
    </svg>
  )
}
