import { useState } from 'react'
import { dspAsset } from './dspAssets'
import { DspAction, DspSegments } from './DspControls'

export function DspServices() {
  const [selected, setSelected] = useState('Full-service')
  const full = selected === 'Full-service'
  return <section className="dsp-services dsp-container" aria-labelledby="dsp-services-title">
    <h2 id="dsp-services-title">Управляйте сами или доверьтесь нам</h2>
    <div className="dsp-services__scene">
      <img className="dsp-services__background" src={dspAsset('services-background.png')} width="1440" height="620" alt="Эксперт МТС ADS" loading="lazy" /><div className="dsp-services__fade" />
      <div className="dsp-services__copy"><DspSegments options={['Full-service', 'Self-service']} selected={selected} onChange={setSelected} label="Управление рекламной кампанией" controls="dsp-service-details" />
        <div className="dsp-switch-content" id="dsp-service-details" key={selected}><h3>{full ? 'Доверьте запуски нашей команде экспертов' : 'Управляйте кампаниями самостоятельно'}</h3><p>{full ? <>Настроим размещение, запустим, проконтролируем и доведём до результата. <strong>От 300 000 ₽</strong></> : 'Личный кабинет, аналитика и управление кампаниями в одном месте'}</p><DspAction>{full ? 'Получить консультацию' : 'Получить доступ'}</DspAction></div>
      </div>
      {full && <img className="dsp-services__chat dsp-switch-content" src={dspAsset('services-chat.png')} width="390" height="314" alt="Эксперт МТС ADS: отчёт по рекламной кампании готов" />}
    </div>
  </section>
}
