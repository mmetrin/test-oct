import background from '../../assets/figma/lead-showcase/background-source.png'
import cube from '../../assets/figma/lead-showcase/cube.png'
import { LeadShowcaseForm } from './LeadShowcaseForm'
import './LeadShowcaseSection.css'

export function LeadShowcaseSection() {
  return (
    <section className="lead-showcase-section" id="lead-showcase" aria-labelledby="lead-showcase-title">
      <img className="lead-showcase-section__background" src={background} alt="" decoding="sync" />
      <div className="lead-showcase-section__container">
        <LeadShowcaseForm />
        <h2 className="lead-showcase-section__title" id="lead-showcase-title">
          <span>Запустите рекламу</span>
          <span>с&nbsp;МТС ADS</span>
        </h2>
        <img className="lead-showcase-section__cube" src={cube} alt="" decoding="sync" />
      </div>
    </section>
  )
}
