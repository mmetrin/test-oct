import { FunnelJourneyPage } from '../pages/funnel-journey'
import { ContactsPage } from '../pages/contacts'
import { BloggersPage } from '../pages/bloggers'

export function App() {
  const contactsPath = `${import.meta.env.BASE_URL}contacts`

  if (window.location.pathname === contactsPath || window.location.pathname === `${contactsPath}/`) {
    return <ContactsPage />
  }

  const bloggersPath = `${import.meta.env.BASE_URL}bloggers`
  if (window.location.pathname === bloggersPath || window.location.pathname === `${bloggersPath}/`) {
    return <BloggersPage />
  }

  return <FunnelJourneyPage />
}
