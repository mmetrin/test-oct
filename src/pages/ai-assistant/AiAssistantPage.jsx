import aiAssistantImage from '../../assets/funnel-journey/ai-assistant.png'
import { LightGlowCanvas } from '../../features/light-glow'
import { usePageScrollRestoration } from '../../shared/lib/usePageScrollRestoration'
import { SiteHeader } from '../../shared/ui/site-header'

import './AiAssistantPage.css'

export function AiAssistantPage() {
  usePageScrollRestoration()

  return (
    <>
    <SiteHeader />
    <main className="ai-assistant-page" id="top">
      <section className="ai-assistant-page__content" aria-label="ИИ-ассистент для запуска рекламной кампании">
        <LightGlowCanvas />
        <img src={aiAssistantImage} alt="ИИ-ассистент поможет создать и запустить рекламную кампанию" />
      </section>
    </main>
    </>
  )
}
