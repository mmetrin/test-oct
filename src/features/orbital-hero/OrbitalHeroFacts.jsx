import './OrbitalHeroFacts.css'

// Copy and column anchors match EnterpriseHeroFacts on the main page.
export function OrbitalHeroFacts() {
  return (
    <div className="orbital-hero__facts" aria-label="МТС ADS в цифрах">
      <div className="orbital-hero__fact">
        <p className="orbital-hero__number">65+ <span>млн</span></p>
        <p><span>активной аудитории</span> от самого крупного оператора страны</p>
      </div>
      <div className="orbital-hero__fact">
        <p className="orbital-hero__number">5 000</p>
        <p><span>параметров аудитории</span> для формирования сегмента</p>
      </div>
      <div className="orbital-hero__fact">
        <p className="orbital-hero__number">350</p>
        <p><span>уже готовых<br />сегментов</span></p>
      </div>
    </div>
  )
}
