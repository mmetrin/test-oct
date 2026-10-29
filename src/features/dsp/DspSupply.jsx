import { dspAsset } from './dspAssets'

export function DspSupply() {
  return <section className="dsp-supply dsp-container" aria-labelledby="dsp-supply-title"><h2 id="dsp-supply-title">Размещайте рекламу по лучшей цене<br />на проверенных сайтах</h2><p className="dsp-supply__intro">Интеграции с ведущими programmatic-платформами помогают снижать стоимость рекламных кампаний</p>
    <div className="dsp-supply__cards"><article><img className="dsp-supply__logos" src={dspAsset('ssp-logos.png')} width="636" height="107.5" alt="AdRiver, Unity, ironSource, Sape, Рекламная сеть Яндекса и другие SSP" loading="lazy" /><div className="dsp-supply__copy"><h3>Сторонние SSP <small>с подключением без посредников</small></h3><p>Система следит за brand-safety и качеством рекламного окружения. Модели автоматически оптимизируют закупку в процессе рекламной кампании</p></div></article>
    <article><h3>Собственная SSP — Buzzoola</h3><img className="dsp-supply__percent" src={dspAsset('ssp-percent.png')} width="427" height="131" alt="90%" loading="lazy" /><h3 className="dsp-supply__audience">активной интернет-аудитории</h3><img className="dsp-supply__octopus" src={dspAsset('ssp-octopus.png')} width="205" height="200" alt="" loading="lazy" /></article></div>
  </section>
}

