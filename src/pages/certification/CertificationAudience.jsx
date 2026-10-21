import entrepreneurPhoto from './assets/people/240655284.png'
import marketersPhoto from './assets/people/240655285.png'
import beginnerPhoto from './assets/people/240655286.png'
import analystPhoto from './assets/people/240655282.png'
import learnerPhoto from './assets/people/240655288.png'
import consultantPhoto from './assets/people/240655283.png'
import tabletStudentPhoto from './assets/people/240655279.png'
import tabletLearnerPhoto from './assets/people/240655281.png'
import presenterPhoto from './assets/people/240655287.png'

const audienceCards = [
  {
    id: 'entrepreneurs',
    title: 'Предпринимателям',
    description: 'Научитесь работать с рекламными инструментами и привлекайте клиентов самостоятельно',
    photo: entrepreneurPhoto,
  },
  {
    id: 'marketers',
    title: 'Маркетологам и digital-специалистам',
    description: 'Расширьте набор рекламных инструментов и научитесь использовать МТС Маркетолог и МТС DSP под разные задачи бизнеса',
    photo: marketersPhoto,
  },
  {
    id: 'beginners',
    title: 'Начинающим специалистам',
    description: 'Пройдите обучение на реальных кейсах и получите подтверждённый навыки для резюме',
    photo: beginnerPhoto,
  },
]

const floatingPhotos = [
  { id: 'analyst', photo: analystPhoto },
  { id: 'learner', photo: learnerPhoto },
  { id: 'consultant', photo: consultantPhoto },
  { id: 'tablet-student', photo: tabletStudentPhoto },
  { id: 'tablet-learner', photo: tabletLearnerPhoto },
  { id: 'presenter', photo: presenterPhoto },
]

export function CertificationAudience() {
  return (
    <section className="cert-audience" aria-labelledby="cert-audience-title">
      <div className="cert-audience__floats" aria-hidden="true">
        {floatingPhotos.map(({ id, photo }) => (
          <div className={`cert-audience__float cert-audience__float--${id}`} key={id}>
            <img src={photo} alt="" loading="lazy" />
          </div>
        ))}
      </div>
      <div className="cert-audience__content">
        <h2 id="cert-audience-title">Кому подойдёт обучение</h2>
        <div className="cert-audience__cards">
          {audienceCards.map(({ id, title, description, photo }) => (
            <article className={`cert-audience__card cert-audience__card--${id}`} key={id}>
              <div className="cert-audience__text">
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
              <div className="cert-audience__main-photo">
                <img src={photo} alt="" loading="lazy" />
              </div>
            </article>
          ))}
        </div>
        <a className="cert-outline-button cert-audience__action" href="#courses">Начать обучение</a>
      </div>
    </section>
  )
}
