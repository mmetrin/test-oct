import device from '../../assets/figma/targeted-calls/price-imgImage2090007989.png'
import operator from '../../assets/figma/targeted-calls/price-imgIcons02.svg'
import person from '../../assets/figma/targeted-calls/price-imgVector.svg'
import status from '../../assets/figma/targeted-calls/price-imgImage2090007991.png'
import connected from '../../assets/figma/targeted-calls/price-imgShape2.svg'
import unavailable from '../../assets/figma/targeted-calls/price-imgShape4.svg'
import cross from '../../assets/figma/targeted-calls/price-imgBox.svg'

function CallDiagram({ answered }) {
  return <div className={`calls-diagram ${answered ? 'is-answered' : ''}`} aria-hidden="true">
    <div className="calls-diagram__device"><img src={device} alt="" /><span className="calls-diagram__screen"><img className="calls-diagram__operator" src={operator} alt="" /></span></div>
    <div className="calls-diagram__connection"><img src={answered ? connected : unavailable} alt="" />{!answered && <img className="calls-diagram__cross" src={cross} alt="" />}<span>{answered ? <>Если состоялся<br />разговор от 5 секунд</> : <>Если абонент<br />занят или недоступен</>}</span></div>
    <div className="calls-diagram__device"><img src={device} alt="" /><span className="calls-diagram__screen"><img className="calls-diagram__person" src={person} alt="" /><span className="calls-diagram__status"><img src={status} alt="" /></span></span></div>
  </div>
}

export function CallsPricing() {
  return <section className="calls-pricing calls-container" aria-labelledby="calls-pricing-title">
    <h2 id="calls-pricing-title">Фиксированная цена за контакт —<br />не нужно считать минуты</h2>
    <div className="calls-pricing__grid">
      <article className="calls-pricing__card"><CallDiagram answered /><div className="calls-pricing__rate"><p className="calls-pricing__number">12<span> ₽ +</span></p><p>наценка за самый<br />дорогой таргетинг</p></div></article>
      <article className="calls-pricing__card"><CallDiagram answered={false} /><div className="calls-pricing__rate"><p className="calls-pricing__number">0<span> ₽</span></p><p>за недозвоны<br />и повторные звонки</p></div></article>
    </div>
  </section>
}
