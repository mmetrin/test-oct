import launch from '../../assets/figma/targeted-calls/analysis-imgBox.svg'
import cycle from '../../assets/figma/targeted-calls/analysis-imgBox1.svg'
import market from '../../assets/figma/targeted-calls/analysis-imgBox2.svg'

const scenarios = [
  { title: <>Запуск нового<br />продукта или услуги</>, text: 'Быстро информируете широкую аудиторию о новинке и собираете первые заявки', icon: launch },
  { title: <>Продукты с длинным<br />циклом сделки</>, text: 'Страхование, недвижимость, ПО, логистика, оборудование — в этих нишах живой диалог помогает снять возражения и разобраться в деталях', icon: cycle },
  { title: <>Привлечение<br />в офлайн-точки</>, text: 'Обзваниваете жителей района, города или области — приглашаете в магазин, салон, фитнес-клуб', icon: market },
]

export function CallsScenarios() {
  return <section className="calls-scenarios calls-container" aria-labelledby="calls-scenarios-title">
    <h2 id="calls-scenarios-title">Принимайте решения<br />на <span>основе данных</span></h2>
    <div className="calls-scenarios__grid">{scenarios.map(item => <article key={item.icon}>
      <span className="calls-icon"><img src={item.icon} alt="" /></span><h3>{item.title}</h3><p>{item.text}</p>
    </article>)}</div>
  </section>
}
