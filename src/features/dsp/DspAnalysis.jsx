import { dspAsset } from './dspAssets'

export function DspAnalysis() {
  return <section className="dsp-analysis dsp-container" aria-labelledby="dsp-analysis-title"><h2 id="dsp-analysis-title">Принимайте решения<br />на <em>основе данных</em></h2><div className="dsp-analysis__cards">
    <article><span className="dsp-analysis__icon"><img src={dspAsset('analysis-imgBox.svg')} alt="" /></span><h3>Расширенная аналитика кампаний</h3><p>Оценивайте эффективность рекламы по множеству метрик, находите успешные гипотезы и повышайте результат кампаний в процессе размещения</p></article>
    <article><span className="dsp-analysis__icon"><img src={dspAsset('analysis-imgBox1.svg')} alt="" /></span><h3>Исследования под ваши задачи</h3><p>Подготовим решения по вашему запросу: Brand Lift, Sales Lift, опросы, профилирование, кросс-канальный или аудиторный анализ и другие</p></article>
  </div></section>
}

