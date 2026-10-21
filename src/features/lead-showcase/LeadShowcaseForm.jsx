import { useState } from 'react'
import chevron from '../../assets/figma/lead-showcase/chevron.svg'
import sliderKnob from '../../assets/figma/lead-showcase/knob-right.svg'
import { ActionButton } from '../../shared/ui/action-button/ActionButton'
import './LeadShowcaseSection.css'

const minimumBudget = 100_000
const maximumBudget = 500_000

const formatBudget = (amount) => `${new Intl.NumberFormat('ru-RU').format(amount)} ₽`

export function LeadShowcaseForm({ className = '', showHeading = false }) {
  const [budget, setBudget] = useState(300_000)
  const [showSubmitNotice, setShowSubmitNotice] = useState(false)
  const budgetProgress = ((budget - minimumBudget) / (maximumBudget - minimumBudget)) * 100

  function handleSubmit(event) {
    event.preventDefault()
    setShowSubmitNotice(true)
  }

  return (
    <form className={`lead-showcase-section__form ${className}`.trim()} onSubmit={handleSubmit}>
      {showHeading && (
        <h2 className="lead-showcase-section__form-title">
          Запустите рекламу<br /><span>с МТС ADS</span>
        </h2>
      )}
      <div className="lead-showcase-section__fields">
        <div className="lead-showcase-section__field-row">
          <label className="lead-showcase-section__field">
            <span className="sr-only">Телефон</span>
            <input type="tel" name="phone" placeholder="Телефон*" autoComplete="tel" required onChange={() => setShowSubmitNotice(false)} />
          </label>
          <label className="lead-showcase-section__field">
            <span className="sr-only">Почта</span>
            <input type="email" name="email" placeholder="Почта*" autoComplete="email" required onChange={() => setShowSubmitNotice(false)} />
          </label>
        </div>

        <label className="lead-showcase-section__field">
          <span className="sr-only">Фамилия и имя</span>
          <input type="text" name="name" placeholder="Фамилия и имя" autoComplete="name" onChange={() => setShowSubmitNotice(false)} />
        </label>

        <label className="lead-showcase-section__field lead-showcase-section__field--select">
          <span className="sr-only">Сфера бизнеса</span>
          <select name="business" defaultValue="" onChange={() => setShowSubmitNotice(false)}>
            <option value="" disabled>Сфера бизнеса</option>
            <option value="retail">Розничная торговля</option>
            <option value="services">Услуги</option>
            <option value="finance">Финансы</option>
            <option value="other">Другое</option>
          </select>
          <img src={chevron} alt="" aria-hidden="true" />
        </label>

        <div className="lead-showcase-section__budget">
          <label className="lead-showcase-section__budget-label" htmlFor="lead-showcase-budget">Примерный бюджет на запуск</label>
          <output className="lead-showcase-section__budget-value" htmlFor="lead-showcase-budget">{formatBudget(budget)}</output>
          <div className="lead-showcase-section__slider" style={{ '--budget-progress': `${budgetProgress}%` }}>
            <div className="lead-showcase-section__slider-track" aria-hidden="true">
              <div className="lead-showcase-section__slider-fill" />
              <img className="lead-showcase-section__slider-knob" src={sliderKnob} alt="" />
            </div>
            <input
              id="lead-showcase-budget"
              type="range"
              name="budget"
              min={minimumBudget}
              max={maximumBudget}
              step="10000"
              value={budget}
              onChange={(event) => {
                setBudget(Number(event.target.value))
                setShowSubmitNotice(false)
              }}
              aria-valuetext={formatBudget(budget)}
            />
            <div className="lead-showcase-section__slider-labels" aria-hidden="true">
              <span>100 000</span>
              <span>300 000</span>
              <span>500 000</span>
            </div>
          </div>
        </div>
      </div>

      <div className="lead-showcase-section__actions">
        <ActionButton className="lead-showcase-section__submit" type="submit">Обсудить рекламную кампанию</ActionButton>
        <p>Продолжая, я соглашаюсь с условиями обработки персональных данных</p>
        {showSubmitNotice && <p className="lead-showcase-section__submit-notice" role="status">Данные не отправлены: форма пока работает только в предпросмотре.</p>}
      </div>
    </form>
  )
}
