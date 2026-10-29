import { DspHero, DspData, DspStrategies, DspFormats, DspSupply, DspServices, DspAnalysis, DspSupport } from '../../features/dsp'
import { SiteHeader } from '../../shared/ui/site-header'
import { SiteFooter, SitePlatforms } from '../../shared/ui/site-sections/SiteSections'
import platforms from '../../assets/figma/dsp/platforms.png'
import background from '../../assets/figma/dsp/ssp-background.png'
import './DspPage.css'

export function DspPage() {
  return <main className="dsp-page">
    <SiteHeader homeNavigation actionHref={`${import.meta.env.BASE_URL}contacts/`} />
    <DspHero /><DspData /><DspStrategies />
    <div className="dsp-page__middle"><img className="dsp-page__middle-background" src={background} width="1920" height="1514.5" alt="" loading="lazy" /><DspFormats /><DspSupply /></div>
    <DspServices /><DspAnalysis /><DspSupport />
    <SitePlatforms className="dsp-platforms" image={platforms} imageHeight={816} />
    <SiteFooter className="dsp-footer" />
  </main>
}
