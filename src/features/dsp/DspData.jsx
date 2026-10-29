import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import motion from './dspMotion.json'
import { dspAsset } from './dspAssets'

const partners = [
  ['dixy', 205, 45], ['khl', 160.99, 195], ['magnit', 205, 352],
  ['mvideo', 1477, 45], ['ofd', 1521, 195], ['x5', 1477, 352],
]

// Sample the exported linear keyframes, including explicit holds and loop resets.
function sampleTrack(track, progress) {
  let low = 0
  let high = track.times.length - 1
  while (low + 1 < high) {
    const middle = Math.floor((low + high) / 2)
    if (track.times[middle] <= progress) low = middle
    else high = middle
  }
  const span = track.times[high] - track.times[low]
  const fraction = span ? Math.max(0, Math.min(1, (progress - track.times[low]) / span)) : 1
  return track.values[low] + (track.values[high] - track.values[low]) * fraction
}

export function DspData() {
  const scene = useRef(null)
  useEffect(() => {
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const elements = [...scene.current.querySelectorAll('[data-stream-index]')]
      const clock = { progress: 0 }
      const render = () => motion.forEach((node, index) => {
        const values = { ...node.initial }
        Object.entries(node.tracks).forEach(([property, track]) => {
          values[property] = sampleTrack(track, clock.progress)
        })
        elements[index].style.transform = `translate(${values.x}px, ${values.y}px)`
        elements[index].style.opacity = values.opacity
      })
      render()
      const timeline = gsap.to(clock, { progress: 1, duration: 26, ease: 'none', repeat: -1, paused: true, onUpdate: render })
      const observer = new IntersectionObserver(([entry]) => entry.isIntersecting ? timeline.play() : timeline.pause())
      observer.observe(scene.current)
      return () => {
        observer.disconnect()
        timeline.kill()
        elements.forEach((element, index) => {
          const { x, y } = motion[index].initial
          element.style.transform = `translate(${x}px, ${y}px)`
          element.style.removeProperty('opacity')
        })
      }
    })
    return () => media.revert()
  }, [])

  return <section className="dsp-data" aria-labelledby="dsp-data-title">
    <h2 id="dsp-data-title">Анализируем данные МТС и партнёров<br />— точнее находим <em>ваших клиентов</em></h2>
    <p className="dsp-data__description">Подберём аудиторию среди 65+ млн абонентов МТС по интересам, онлайн-поведению, звонкам и геолокации. Данные партнёров о покупках помогут точнее найти клиентов для вашего бренда</p>
    <div className="dsp-data__scene" ref={scene} aria-label="Данные партнёров поступают в Big Data МТС">
      <img className="dsp-data__people" src={dspAsset('data-people.png')} width="1920" height="500" alt="" loading="lazy" />
      <img className="dsp-data__paths dsp-data__paths--first" src={dspAsset('data-imgFrame.svg')} alt="" />
      <img className="dsp-data__paths dsp-data__paths--second" src={dspAsset('data-imgFrame1.svg')} alt="" />
      {motion.map((node, index) => <span key={node.id} className={`dsp-data__particle${index > 5 ? ' dsp-data__particle--portrait' : ''}`} data-stream-index={index} style={{ transform: `translate(${node.initial.x}px, ${node.initial.y}px)` }} aria-hidden="true"><img src={dspAsset(index < 6 ? `data-imgFrame${index + 2}.svg` : 'data-imgFrame8.png')} alt="" /></span>)}
      {partners.map(([name, x, y]) => <img key={name} className="dsp-data__partner" src={dspAsset(`data-${name}.png`)} style={{ left: x, top: y }} width="238" height="154" alt={name} loading="lazy" />)}
      <img className="dsp-data__core" src={dspAsset('data-core.png')} width="405.5" height="360" alt="Big Data МТС — 65+ млн абонентов" loading="lazy" />
    </div>
  </section>
}
