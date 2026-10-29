import { dspAsset } from './dspAssets'
import { DspAction } from './DspControls'

export function DspHero() {
  return <section className="dsp-hero" id="top" aria-labelledby="dsp-title">
    <img className="dsp-hero__background" src={dspAsset('hero-background.png')} width="1920" height="720" alt="" />
    <img className="dsp-hero__art" src={dspAsset('hero-art.png')} width="1070" height="794.5" alt="Автоматические инструменты оптимизации показов и кликов" />
    <div className="dsp-hero__copy">
      <div className="dsp-hero__brand"><span>МТС DSP</span><p>Programmatic-платформа<br />для рекламодателей и агентств</p></div>
      <h1 id="dsp-title">Гибкие стратегии<br />оптимизации<br />под ваши KPI</h1>
      <DspAction>Оставить заявку</DspAction>
    </div>
  </section>
}
