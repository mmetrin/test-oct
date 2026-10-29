import { TargetedCallsHero } from '../../features/targeted-calls/TargetedCallsHero'
import { CallsAccess } from '../../features/targeted-calls/CallsAccess'
import { CallsScenarios } from '../../features/targeted-calls/CallsScenarios'
import { CallsPricing } from '../../features/targeted-calls/CallsPricing'
import { EnterpriseBigData } from '../../features/enterprise-big-data/EnterpriseBigData'
import { EnterpriseLead } from '../../features/enterprise-content/EnterpriseLead'
import { MultichannelStrategySection } from '../../features/multichannel-strategy'
import { SiteHeader } from '../../shared/ui/site-header'
import { SiteCases, SitePlatforms, SiteFooter } from '../../shared/ui/site-sections'
import '../enterprise-hero/EnterpriseFigmaVariables.css'
import '../enterprise-hero/EnterpriseHeroPage.css'
import './TargetedCallsPage.css'

export function TargetedCallsPage() {
  return <main className="enterprise-hero-page calls-page">
    <SiteHeader homeNavigation actionHref="#calls-lead" />
    <TargetedCallsHero />
    <EnterpriseBigData variant="network" title={<>Аудитория для <span className="calls-accent">точных</span> запусков</>}
      description="Объединяем данные МТС о поведении и интересах с данными партнёров о фактических покупках — находим клиентов не по гипотезам, а по подтверждённым действиям" />
    <CallsAccess />
    <CallsScenarios />
    <CallsPricing />
    <MultichannelStrategySection />
    <div className="calls-page__lead" id="calls-lead"><EnterpriseLead /></div>
    <div className="calls-page__ending"><SiteCases /><SitePlatforms id="calls-platforms" /><SiteFooter /></div>
  </main>
}
