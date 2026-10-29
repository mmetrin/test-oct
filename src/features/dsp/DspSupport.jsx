import { dspAsset } from './dspAssets'
import { DspAction } from './DspControls'

const support = [
  { image: 'experts', title: 'Помощь экспертов', description: 'Поможем рассчитать медиаплан, подобрать форматы и аудиторию, а также сформировать гипотезы для эффективного запуска' },
  { image: 'reports', title: 'Отчётность', description: <>Предоставим данные в удобном формате<br />и в нужные сроки</> },
  { image: 'manager', title: <>Сопровождение<br />на каждом этапе</>, description: 'Поможем спланировать и оптимизировать кампании даже при самостоятельном запуске' },
]
export function DspSupport() {
  return <section className="dsp-support dsp-container" aria-labelledby="dsp-support-title"><h2 id="dsp-support-title">Поддержка<br />на каждом этапе</h2><div className="dsp-support__cards">{support.map(item => <article key={item.image}><img src={dspAsset(`support-${item.image}.png`)} width="475" height="170" alt="" loading="lazy" /><div><h3>{item.title}</h3><p>{item.description}</p></div></article>)}</div><DspAction>Подобрать предложение</DspAction></section>
}
