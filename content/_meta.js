/* The hub is the home page, so it needs no navbar link of its own.
 *
 * `display: 'children'` on `g` hoists the guides to the top of the sidebar tree
 * so there is no "Build Guides" folder row above them. */
export default {
  index: {
    display: 'hidden',
    theme: {
      layout: 'full',
      sidebar: false,
      toc: false,
      breadcrumb: false,
      pagination: false,
      timestamp: false
    }
  },
  /* Parked until the form submits somewhere real. The entry has to stay, because
   * a page left out of this file is auto-added to the sidebar; `display: 'hidden'`
   * is what keeps it out of the navbar and the sidebar while /feedback stays
   * reachable directly. Restore `type: 'page'` to put it back in the navbar, left
   * of the search box. */
  feedback: {
    title: 'Feedback',
    display: 'hidden',
    // type: 'page',
    theme: {
      // The page is one form under a short intro, so the sidebar, the right rail
      // and the footer navigation have nothing to carry.
      sidebar: false,
      toc: false,
      breadcrumb: false,
      pagination: false,
      timestamp: false
    }
  },
  g: {
    title: 'Build Guides',
    display: 'children'
  }
}
