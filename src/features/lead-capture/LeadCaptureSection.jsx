import arrowChipImage from '../../assets/figma/lead-capture/arrow-chip.png'
import proposalCardImage from '../../assets/figma/format-slider/img.jpg'

const leadFields = [
  {
    id: 'lead-name',
    label: 'Имя и фамилия',
    defaultValue: 'Катерина Михайлова',
  },
  {
    id: 'lead-company',
    label: 'ИНН или название компании*',
  },
  {
    id: 'lead-email',
    label: 'Рабочая почта*',
    type: 'email',
  },
  {
    id: 'lead-phone',
    label: 'Телефон',
    type: 'tel',
  },
]

function LeadInput({ field }) {
  const hasValue = Boolean(field.defaultValue)

  return (
    <label className={`lead-capture-section__field${hasValue ? ' has-value' : ''}`}>
      {hasValue && <span>{field.label}</span>}
      <input
        id={field.id}
        type={field.type ?? 'text'}
        defaultValue={field.defaultValue}
        placeholder={hasValue ? undefined : field.label}
        readOnly
      />
    </label>
  )
}

function AudienceChip({ children, href }) {
  return (
    <a className="lead-capture-section__chip" href={href}>
      <span className="lead-capture-section__chip-text">{children}</span>
      <img
        className="lead-capture-section__chip-icon"
        src={arrowChipImage}
        alt=""
        aria-hidden="true"
      />
    </a>
  )
}

export function LeadCaptureSection() {
  const handleSubmit = (event) => {
    event.preventDefault()
    window.location.reload()
  }

  return (
    <section
      id="lead-capture"
      className="lead-capture-section scroll-reveal"
      aria-labelledby="lead-capture-title"
    >
      <div className="lead-capture-section__grid">
        <div className="lead-capture-section__copy">
          <h2 id="lead-capture-title">Получите предложение под вашу задачу</h2>
          <p>
            Расскажите о кампании — подберём площадки, аудиторию, форматы с учётом
            целей, бюджета и сроков
          </p>
          <div className="lead-capture-section__note-card">
            <img src={proposalCardImage} alt="" aria-hidden="true" />
            <p>
              здесь я бы утп какие-то меняющиеся оставила, чтоб мотивацию сохранять
              заполнить формочку) ну и просто если что-то второстепенное стоит
              упомянуть
            </p>
          </div>
        </div>
        <form className="lead-capture-section__form" id="lead-form" onSubmit={handleSubmit}>
          <div className="lead-capture-section__fields">
            {leadFields.map((field) => (
              <LeadInput field={field} key={field.id} />
            ))}
          </div>
          <div className="lead-capture-section__actions">
            <button className="premium-video-button lead-capture-section__button" type="submit">
              Получить предложение
            </button>
            <p>
              Заполняя форму, вы соглашаетесь{' '}
              <a href="mailto:">с условиями обработки данных</a>
            </p>
          </div>
        </form>
      </div>
      <div className="lead-capture-section__audience">
        <p>Ваши клиенты уже среди зрителей. Поможем найти их</p>
        <p>
          с предложениями <AudienceChip href="#lead-form">для крупного бизнеса</AudienceChip> или
        </p>
        <p>
          <AudienceChip href="https://marketolog.mts.ru/">для малого и среднего бизнеса</AudienceChip>
        </p>
      </div>
      <p className="lead-capture-section__footer-note">Тут надо будет футер продумать</p>
    </section>
  )
}
