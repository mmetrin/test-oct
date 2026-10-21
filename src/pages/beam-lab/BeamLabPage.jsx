import { SiteHeader } from '../../shared/ui/site-header'
import './BeamLabPage.css'

export function BeamLabPage() {
  return (
    <>
    <SiteHeader />
    <main className="beam-lab" id="top">
      <div className="beam-lab__ambient" aria-hidden="true" />
      <div className="beam-lab__light" aria-hidden="true">
        <div className="beam-lab__volume" />
        <div className="beam-lab__core" />
        <div className="beam-lab__edge" />
      </div>
      <div className="beam-lab__grain" aria-hidden="true" />
    </main>
    </>
  )
}
