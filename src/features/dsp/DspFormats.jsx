import { useState } from 'react'
import { dspAsset } from './dspAssets'
import { DspSegments } from './DspControls'

const mobile = [['native', 'Нативный баннер'], ['full', 'Полноэкранный баннер'], ['video', 'Видео'], ['dynamic', 'Динамические баннеры']]
const inAppLabels = ['Баннер', 'Полноэкранный баннер', 'Нативный баннер', 'Баннер', 'Полноэкранное видео']

export function DspFormats() {
  const [selected, setSelected] = useState('Mobile')
  return <section className="dsp-formats dsp-container" aria-labelledby="dsp-formats-title">
    <h2 id="dsp-formats-title">Покрываем <em>99% форматов</em> в интернете</h2>
    <DspSegments options={['Mobile', 'In-App', 'Desktop']} selected={selected} onChange={setSelected} label="Устройство для показа рекламы" controls="dsp-formats-preview" />
    <div className={`dsp-formats__preview dsp-switch-content dsp-formats__preview--${selected.toLowerCase()}`} id="dsp-formats-preview" key={selected}>
      {selected === 'Mobile' ? <div className="dsp-formats__mobile">{mobile.map(([name, label]) => <figure key={name}><img src={dspAsset(`mobile-${name}.png`)} width="290" height="600" alt={`Пример: ${label}`} loading="lazy" /><figcaption>{label}</figcaption></figure>)}</div> : selected === 'In-App' ? <><img src={dspAsset('inapp-formats.png')} width="1440" height="520" alt="Примеры рекламы в мобильных приложениях" /><div className="dsp-formats__labels">{inAppLabels.map((label, index) => <span key={`${index}-${label}`}>{label}</span>)}</div></> : <><img className="dsp-formats__desktop" src={dspAsset('desktop-formats.png')} width="975" height="504" alt="Баннеры и видео в браузере на компьютере" /></>}
    </div>
  </section>
}
