import heroPeople from '../../assets/figma/smb/hero-people.png'
import instruments from '../../assets/figma/smb/instruments.png'
import questions from '../../assets/figma/smb/questions.png'
import aiMarketer from '../../assets/figma/smb/ai-marketer.png'
import maskGroup from '../../assets/figma/smb/mask-group@2x.png'
import { SiteCases, SiteFooter, SitePlatforms } from '../../shared/ui/site-sections'
import { SmallBusinessSteps } from './SmallBusinessSteps'
import './SmallBusinessContent.css'

function ImageSection({ className, src, alt, width, height }) {
  return (
    <section className={`small-business-content__image ${className}`} aria-label={alt}>
      <img src={src} alt={alt} width={width} height={height} loading="lazy" draggable={false} />
    </section>
  )
}

export function SmallBusinessContent() {
  return (
    <div className="small-business-content" id="small-business-content">
      <img className="small-business-content__mask" src={maskGroup} alt="" aria-hidden="true" width="1920" height="1687" loading="lazy" draggable={false} />
      <section className="small-business-content__hero" aria-label="МТС Маркетолог для малого и среднего бизнеса">
        <img src={heroPeople} alt="Достигайте целей бизнеса вместе с МТС Маркетологом. Привлекайте новых клиентов и удерживайте текущих." width="1890" height="934" draggable={false} />
      </section>
      <ImageSection className="small-business-content__instruments" src={instruments} alt="Дотянитесь до клиентов с помощью инструментов МТС ADS" width="1440" height="546" />
      <ImageSection className="small-business-content__questions" src={questions} alt="Подберём точную аудиторию среди 65 млн абонентов МТС" width="1440" height="372" />
      <ImageSection className="small-business-content__ai" src={aiMarketer} alt="ИИ-маркетолог создаст и подготовит рекламную кампанию за 5 минут" width="1080" height="472" />
      <SmallBusinessSteps />
      <SiteCases />
      <SitePlatforms />
      <SiteFooter />
    </div>
  )
}
