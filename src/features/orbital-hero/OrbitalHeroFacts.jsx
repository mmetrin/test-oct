import './OrbitalHeroFacts.css'

const defaultFacts = [
  {
    id: 'audience',
    value: <>65+ <span>млн</span></>,
    description: <><span>активной аудитории</span> от самого крупного оператора страны</>,
  },
  {
    id: 'parameters',
    value: '5 000',
    description: <><span>параметров аудитории</span> для формирования сегмента</>,
  },
  {
    id: 'segments',
    value: '350',
    description: <span>уже готовых<br />сегментов</span>,
  },
]

export function OrbitalHeroFacts({ facts = defaultFacts }) {
  return (
    <div className="orbital-hero__facts" aria-label="МТС ADS в цифрах">
      {facts.map(({ id, value, description }) => (
        <div className="orbital-hero__fact" key={id}>
          <p className="orbital-hero__number">{value}</p>
          <p>{description}</p>
        </div>
      ))}
    </div>
  )
}
