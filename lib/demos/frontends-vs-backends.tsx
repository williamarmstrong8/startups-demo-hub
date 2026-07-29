import type { DemoMeta } from '@/components/guide/types'
import { Step, Description, Code } from '@/components/guide'
import { william } from './hosts'

export const demoMeta: DemoMeta = {
  slug: 'frontends-vs-backends',
  title: 'Frontends vs. Backends',
  date: 'July 28, 2026',
  summary:
    'The one difference that makes the whole thing click: where your code runs. A whiteboard-style walkthrough of what a server actually is, the difference between code that lives on a server and code that runs on one, and how APIs, functions, and databases fit together. Then why Vercel is fast: the CDN and edge network up front, and Fluid Compute versus serverless on the back end.',
  tags: ['fundamentals', 'back-ends', 'CDN', 'Fluid Compute'],
  hosts: [william],
  poster: '/frontends-vs-backends.png',
  steps: [
    { id: 'servers', title: 'What a server actually is' },
    { id: 'frontend-backend', title: 'Front-end vs back-end' },
    { id: 'backend-time', title: 'Back-end: answers on demand' },
    { id: 'apis', title: 'APIs, functions, and the database' },
    { id: 'javascript', title: 'JavaScript, Node, and Vercel Services' },
    { id: 'cdn', title: 'The CDN and the edge network' },
    { id: 'caching', title: 'Caching at the edge' },
    { id: 'serverless', title: 'From renting servers to serverless' },
    { id: 'fluid', title: 'Fluid Compute' },
    { id: 'recap', title: 'The one-sentence version' }
  ],
  recording: {
    src: '/demos/frontends-vs-backends.mp4',
    duration: 1804.36,
    // The transcript is not timestamped; these are read off the flow of the
    // talk across the ~30 minute recording.
    taps: [
      { stepId: 'servers', t: 0 },
      { stepId: 'frontend-backend', t: 95 },
      { stepId: 'backend-time', t: 300 },
      { stepId: 'apis', t: 520 },
      { stepId: 'javascript', t: 830 },
      { stepId: 'cdn', t: 1080 },
      { stepId: 'caching', t: 1180 },
      { stepId: 'serverless', t: 1330 },
      { stepId: 'fluid', t: 1490 },
      { stepId: 'recap', t: 1760 }
    ]
  }
}

/** Step content for the player's side card. This demo has no build guide page. */
export function DemoSteps() {
  return (
    <>
      <Step id="servers" title="What a server actually is">
        <Description>
          Servers sound complicated, but a server is just someone else&apos;s
          computer, usually sitting in a data center in Virginia if you are on
          AWS: rows of machines stacked together with no screen attached.
        </Description>
        <Description>
          The only thing that makes it a server is that it is always on. Your own
          laptop could be a server, but the moment you close it, it stops
          responding to requests. A back-end is just code that lives on one of
          these always-on computers, waiting to run when someone asks.
        </Description>
      </Step>

      <Step id="frontend-backend" title="Front-end vs back-end">
        <Description>
          When you load a website, your browser sends a request to a server and
          the server hands back files. That is not a back-end doing work; it is
          almost a file handoff. Your front-end code <em>lives</em> on the server
          but <em>runs</em> on your computer.
        </Description>
        <Description>
          That is the distinction the whole talk hangs on: there is code that
          lives on a server and code that runs on a server. Front-end code lives
          there and gets handed to your browser to run. Back-end code you never
          see, because it only ever runs on the server.
        </Description>
        <Description>
          A slick, heavily animated marketing site is a great example of pure
          front-end. Every animation you scroll through was downloaded and is now
          running on your machine. Nothing is going back to the server. With React
          those are client components, which is what makes the experience feel
          instant. Front-end work is making things look good and feel alive.
        </Description>
      </Step>

      <Step id="backend-time" title="Back-end: answers on demand">
        <Description>
          A back-end is answers on demand. Ask your computer what time it is and
          it does not actually know; it is a fairly dumb device that has to run
          some code to find out. That code is the back-end.
        </Description>
        <Description>
          Spin up a fresh Next.js project with <code>npx create-next-app</code>{' '}
          and you get the standard template. The page is all front-end. To reach a
          back-end you write an API endpoint: a URL like{' '}
          <code>/api/time</code> that says &quot;when this gets hit, run this
          code.&quot;
        </Description>
        <Code lang="ts" filename="app/api/time/route.ts">{`export function GET() {
  return Response.json({ time: new Date().toISOString() });
}`}</Code>
        <Description>
          The bare-bones front-end is a single button, &quot;click to ask the
          server.&quot; Clicking it calls that URL, the back-end code runs, and the
          time comes back. Visit <code>/api/time</code> directly and you get the
          same answer. That round trip, front-end asking, back-end answering, is
          the whole idea.
        </Description>
      </Step>

      <Step id="apis" title="APIs, functions, and the database">
        <Description>
          Not every back-end is a URL you visit. Databases live on servers too,
          and you reach a database through an API endpoint rather than by typing
          its address into a browser. The front-end calls the API, the API runs
          the back-end code, and the back-end talks to the database.
        </Description>
        <Description>
          A login page is the everyday version of this. Everything you see on{' '}
          <code>/login</code>, including the submit button, is front-end. That
          submit button is a function, because it has to actually do something.
          But the sensitive part must not run on your computer, so the function
          fetches an API route where the real back-end code lives.
        </Description>
        <Description>
          That back-end code asks the database, in this case Supabase, whether a
          user exists with this email and whether the password matches. If
          Supabase says yes, you get logged in. This front-end-calls-API-calls-
          database shape is the standard connection you will see over and over.
        </Description>
        <Description>
          It is also why functions are confusing: a function is just code that has
          to run something, and it can live on either side. Where it lives is what
          makes it front-end or back-end. Vercel offers a few back-end shapes, such
          as workflows, queues, and functions, but a function itself is simply a
          unit of compute.
        </Description>
      </Step>

      <Step id="javascript" title="JavaScript, Node, and Vercel Services">
        <Description>
          JavaScript used to only run in the browser: animations, moving
          components, front-end things. Then Node.js let JavaScript run on the
          server too, which is what turned it into a back-end language. It is
          widely considered the most popular language, and Node is a big reason
          why. Next.js is the front-end framework; Node is the runtime underneath
          that can also serve the back-end.
        </Description>
        <Description>
          Other back-ends use other languages. A lot of AI work runs on Python,
          which does not naturally play well with JavaScript. Vercel Services lets
          you build and host a Python back-end and a JavaScript front-end together
          in one project instead of two.
        </Description>
        <Description>
          The practical win is local development. Because the front-end needs the
          back-end running to talk to it, Services can spin both up together on
          your machine, so you see the whole project working before anything ships
          to Vercel, instead of deploying two projects just to test them against
          each other. It is new and not perfect yet, but it means almost any
          back-end language can move onto Vercel.
        </Description>
      </Step>

      <Step id="cdn" title="The CDN and the edge network">
        <Description>
          Now why Vercel is fast. There are roughly 20 big data centers around the
          world, the main regions, like AWS&apos;s <code>IAD</code> in Northern
          Virginia that Vercel defaults to. On top of that sits the edge network:
          many more, much smaller points of presence spread far wider.
        </Description>
        <Description>
          Turn the edge off and every request has to travel to one of those 20
          regions. Turn it on and there is a location close to almost everyone,
          because in the end the internet is light moving through fiber, and you
          are limited by how far that light has to travel. Closer means faster.
        </Description>
      </Step>

      <Step id="caching" title="Caching at the edge">
        <Description>
          The first time anyone visits your site, the request goes to the edge,
          finds no cache, and continues to the origin where the code actually
          lives. The site comes back, and if you have marked it cacheable, often a
          one-line change, the edge stores a copy.
        </Description>
        <Description>
          After that, everyone nearby is served from the closest edge location
          instead of making the full trip to Virginia. A cached marketing page
          loads in a fraction of the time. You also pay less, because a cached edge
          request avoids the round trip to the origin server, so it is faster and
          cheaper at the same time.
        </Description>
      </Step>

      <Step id="serverless" title="From renting servers to serverless">
        <Description>
          There are three ways to think about running back-end code. The old way is
          renting a server from Amazon, setting it all up, and paying for it to run
          24/7. You can customize everything, but you need an AWS engineer, you pay
          while it sits idle, and you have to size it for your peak.
        </Description>
        <Description>
          Picture Nordstrom. Their peak is Black Friday, so they buy a server big
          enough for millions of requests a minute. Every other day they get a
          trickle, and all that capacity is dead space they are still paying for.
        </Description>
        <Description>
          Amazon&apos;s answer was serverless: instead of an always-on machine, a
          request spins something up, runs, and shuts down, so you pay on demand.
          The catch is that every request tends to open its own instance, and each
          one has to spin up cold before it can run.
        </Description>
      </Step>

      <Step id="fluid" title="Fluid Compute">
        <Description>
          Most back-end functions are I/O: they call a database or another service
          and then spend most of their time, often 90%, just waiting for the
          response. With plain serverless you pay for that idle waiting, across a
          separate instance for every request.
        </Description>
        <Description>
          Fluid Compute fixes both. While one function sits idle waiting on a
          response, Vercel runs another function inside the same instance, so you
          are paying for one instance and only really for the time code is actually
          running, not the waiting. Fewer cold starts, and for I/O-heavy work the
          savings can be 80 to 90% of what compute used to cost.
        </Description>
        <Description>
          It is not always the right tool. Something CPU-bound that runs the whole
          time, like a PDF converter or a heavy Python script, has no idle gaps to
          share, so work just queues behind the running job. That is where
          serverless spinning up parallel instances still makes sense. Fluid wins
          decisively on the inbound-to-outbound requests that make up most
          functions.
        </Description>
      </Step>

      <Step id="recap" title="The one-sentence version">
        <Description>
          What makes Vercel amazing is also what makes it hard to hold in your head:
          front-end functions, back-end functions, code that lives on a server,
          code that runs on one, all overlapping in a single project. It used to be
          a front-end folder and a back-end folder, cleanly separated; now it is all
          interwoven.
        </Description>
        <Description>
          So keep the core simple. A front-end is any code that runs in your
          browser, and a back-end is any code that runs on a server. Everything
          else, APIs, functions, the CDN, Fluid Compute, hangs off that one
          distinction.
        </Description>
      </Step>
    </>
  )
}
