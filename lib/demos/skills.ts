/**
 * The skills each build produces, kept here rather than inline in the guide so
 * the guide's code block and its resources rail always describe the same file.
 */
export interface Skill {
  /** Key within the group, e.g. `morning-report`. */
  id: string
  /** How the agent refers to the skill. */
  name: string
  /** One line on what it does. */
  summary: string
  /** Where it lives in the project, when the build writes a file. */
  file?: string
  /** The step in the demo's guide where it appears, e.g. `morning-report`. */
  stepId: string
  /** The skill's markdown. */
  source?: string
  /** For skills a model writes for you, the prompt that produces one. */
  prompt?: string
  /** Which assistant that prompt is written for, e.g. "Claude". */
  promptTool?: string
  /** For skills you install rather than write. */
  install?: string
  /** Where an installed skill comes from. */
  href?: string
}

const eveSkills = {
  'morning-report': {
    id: 'morning-report',
    name: 'morning_report',
    summary:
      'Calls the weather and news tools in order, then composes a short briefing in the agent’s voice.',
    file: 'skills/morning-report.md',
    stepId: 'morning-report',
    source: `---
description: Use when the user asks for a morning report, daily briefing, or an update on the weather and the news.
---

# Morning report

Prepare a concise morning briefing for the user in your usual manner.

## Procedure

1. Call the \`get_weather\` tool to obtain the current weather. Use "nyc" unless the user names another location.
2. Call the \`get_news\` tool to obtain the latest headlines.
3. Compose a short report from the results. Do not invent details; use only what the tools return.

## Report format

Present the briefing as follows, keeping it brief and dignified:

- Open with a courteous greeting appropriate to the morning.
- **Weather:** one sentence summarising the current conditions.
- **In the news:** the headlines as a short bullet list, each with a brief note drawn from its summary.
- Close with a brief, gracious sign-off, and offer to be of further assistance.`
  },
  'email-reply-drafter': {
    id: 'email-reply-drafter',
    name: 'email-reply-drafter',
    summary:
      'Drafts replies in your own writing voice, learned from the mail you have already sent.',
    file: 'skills/email-reply-drafter.md',
    stepId: 'email-drafter',
    promptTool: 'Claude',
    prompt: `Analyze all the emails I've sent in the past 30 days to learn how I write: my tone, vocabulary, sentence structure, greetings and sign-offs, level of formality, and how I adjust across different recipients and contexts. Identify the patterns that make my writing recognizably mine.

Then create a skill called email-reply-drafter that uses what you learned to draft email replies in my voice. The skill should capture concrete, reusable guidance (with examples from my actual emails where helpful) so future drafts read as if I wrote them myself.`
  },
  'daily-briefing': {
    id: 'daily-briefing',
    name: 'daily-briefing',
    summary:
      'Pulls meeting notes from Notion, adds the weather and news, and drafts a follow-up email for every action item.',
    file: 'skills/daily-briefing.md',
    stepId: 'daily-briefing',
    source: `---
description: Use at the start of the day to prepare a daily briefing that combines meeting follow-ups, the weather, and the news, together with drafted follow-up emails. Trigger for requests like "prepare my daily briefing", "plan my day", or "morning follow-ups".
---

# Daily briefing and day plan

Prepare a complete morning briefing for the user in your usual manner, then draft the follow-up emails their meetings require.

## Procedure

1. Retrieve recent meeting notes from the \`notion\` connection. Use \`connection_search\` to discover the Notion search and page-reading tools, then search the Notion workspace for the most recent meeting notes and read their contents to gather the meetings, decisions, and action items.
   - The Notion connection is user-scoped, so the first call may require the user to authorise access. If an authorisation prompt appears, wait for the user to complete sign-in, then continue. Do not fabricate meeting notes in the meantime.
2. Call the \`get_weather\` tool for the current weather. Use "nyc" unless the user names another location.
3. Call the \`get_news\` tool for the latest headlines.
4. From the Notion meeting notes, identify the outstanding action items and follow-ups that still require attention, and build a plan for the day around them.
5. For each follow-up that warrants an email, draft it. Follow the \`email-reply-drafter\` skill so every draft is in Will's voice. Load that skill if it is not already loaded.
6. Use only the information returned by Notion and the tools. Do not invent meetings, action items, weather, or headlines.

## Report format

Present the briefing in this order, keeping it dignified and concise:

- A courteous morning greeting.
- **Weather:** one sentence on the current conditions.
- **In the news:** the headlines as a short bullet list, each with a brief note.
- **Today's plan:** a short, ordered list of the day's follow-ups drawn from the meeting notes, each noting the meeting it relates to and what is outstanding.
- **Drafted follow-up emails:** for each follow-up needing an email, present the draft clearly under a short label naming the recipient and subject. Draft in Will's voice per the email drafter skill.
- A brief, gracious closing offering further assistance.`
  },
  'vercel-eve': {
    id: 'vercel-eve',
    name: 'vercel/eve',
    summary:
      'Not written in the build, but installed, so the coding agent knows the framework before you start.',
    stepId: 'setup',
    install: 'npx skills add vercel/eve --yes',
    href: 'https://www.skills.sh/'
  }
} satisfies Record<string, Skill>

export { eveSkills }

/** The set of skills one build produces. */
export interface SkillGroup {
  /** The demo these skills were written in. */
  demoSlug: string
  /** Declaration order is display order. */
  skills: Skill[]
}

export const skillGroups: SkillGroup[] = [
  {
    demoSlug: 'build-a-personal-ai-assistant-with-eve',
    skills: Object.values(eveSkills)
  }
]

export function getSkillsForDemo(demoSlug: string): SkillGroup | undefined {
  return skillGroups.find((group) => group.demoSlug === demoSlug)
}
