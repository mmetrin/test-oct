export function CaseCard({ caseItem, isActive, style, onClick }) {
  return (
    <button
      aria-label={`${caseItem.company}: ${caseItem.product}, ${caseItem.metric}`}
      aria-current={isActive ? 'true' : undefined}
      className={`hero-case-card hero-case-card--${caseItem.tone}${caseItem.artwork ? ' hero-case-card--artwork' : ''}${isActive ? ' is-active' : ''}`}
      onClick={onClick}
      style={style}
      tabIndex={isActive ? 0 : -1}
      type="button"
    >
      <span className="hero-case-card__back" aria-hidden="true" />
      <span className="hero-case-card__edge hero-case-card__edge--left" aria-hidden="true" />
      <span className="hero-case-card__edge hero-case-card__edge--right" aria-hidden="true" />
      <span className="hero-case-card__top-edge" aria-hidden="true" />
      <span className="hero-case-card__front">
        <span className="hero-case-card__image">
          {caseItem.image ? <img src={caseItem.image} alt="" draggable="false" /> : <span className="hero-case-card__placeholder" aria-hidden="true" />}
          {!caseItem.artwork && <span className="hero-case-card__company">
            {caseItem.companyLogo ? <img src={caseItem.companyLogo} alt={caseItem.company} /> : caseItem.company}
          </span>}
        </span>
        {!caseItem.artwork && <span className="hero-case-card__content">
          <span className="hero-case-card__product"><span className="hero-case-card__product-mark" />{caseItem.product}</span>
          <strong className="hero-case-card__metric">{caseItem.metric}</strong>
          <span className="hero-case-card__description">{caseItem.description}</span>
        </span>}
      </span>
    </button>
  )
}
