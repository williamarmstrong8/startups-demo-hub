import { Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import { GuideResources } from '../components/guide'
import { SearchModal, SearchTrigger } from '../components/search'
import { ThemeToggle } from '../components/theme'
import { getSearchIndex } from '../lib/demos/search-index'
import { getGuideResourceIndex } from '../lib/demos/resources'
import 'nextra-theme-docs/style.css'
import './guide-chrome.css'

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'http://localhost:3000'

export const metadata = {
  // Resolves the generated app/opengraph-image to an absolute URL, which every
  // link scraper requires.
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Startups Demo Hub',
    template: '%s – Startups Demo Hub'
  },
  description:
    'Recorded end-to-end build sessions, each paired with a step-by-step build guide.',
  openGraph: {
    type: 'website',
    siteName: 'Startups Demo Hub',
    title: 'Startups Demo Hub',
    description:
      'Recorded end-to-end build sessions, each paired with a step-by-step build guide.'
  },
  twitter: { card: 'summary_large_image' }
}

/* `projectLink` is omitted so the navbar carries only the logo, the search and
 * the theme toggle. Children render immediately after the search box. */
const navbar = (
  <Navbar logo={<b>Startups Demo Hub</b>}>
    <ThemeToggle />
  </Navbar>
)

export default async function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      {/* Monotone palette: zero saturation, near-black accent in light mode and
        * near-white in dark. Nextra derives its whole primary-* scale from these. */}
      <Head
        color={{
          hue: 0,
          saturation: 0,
          lightness: { light: 12, dark: 92 }
        }}
      />
      <body>
        <Layout
          navbar={navbar}
          pageMap={await getPageMap()}
          // Pagefind's full-text search is replaced by a catalog-aware palette.
          search={<SearchTrigger />}
          sidebar={{ defaultMenuCollapseLevel: 1 }}
          // `float: false` hands the step outline to the sidebar tree, which
          // frees the right rail for each guide's resources.
          toc={{
            float: false,
            extraContent: <GuideResources index={getGuideResourceIndex()} />
          }}
          // Both would render in the now-empty right rail, and their default
          // targets are the Nextra template's own repository.
          editLink={null}
          feedback={{ content: null }}
          // Drops Nextra's own theme select from the sidebar and mobile menu
          // footers; the navbar toggle replaces it. next-themes is unaffected.
          darkMode={false}
          copyPageButton={false}
        >
          {children}
        </Layout>
        {/* Outside <Layout> so the dialog's top layer is never nested inside the
          * sidebar or content stacking contexts. */}
        <SearchModal demos={getSearchIndex()} />
      </body>
    </html>
  )
}
