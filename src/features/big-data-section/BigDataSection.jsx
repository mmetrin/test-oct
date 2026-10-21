import bigDataImage from '../../assets/figma/big-data/big-data.png'
import './BigDataSection.css'

export function BigDataSection() {
  return (
    <section className="big-data-section" aria-labelledby="big-data-title">
      <div className="big-data-section__copy">
        <h2 id="big-data-title">
          <span className="big-data-section__title-secondary">Находим точную аудиторию</span> — снижаем стоимость привлечения
        </h2>
        <div className="big-data-section__description">
          <p>Big Data анализирует обезличенные сигналы и формирует сегменты по интересам, поведению и намерениям</p>
          <p>Берем 65 млн МТС и данные от 10+ крупных партнеров о покупках, обогащаем Big Data и тд</p>
        </div>
      </div>

      <img
        className="big-data-section__image"
        src={bigDataImage}
        alt="Сегменты аудитории на основе Big Data"
      />
    </section>
  )
}
