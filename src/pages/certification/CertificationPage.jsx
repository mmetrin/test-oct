import { SiteFooter } from '../../shared/ui/site-sections'
import { SiteHeader } from '../../shared/ui/site-header'
import heroGlow from './assets/hero-glow@2x.png'
import heroFigure from './assets/hero-figure@2x.jpg'
import heroVideo from './assets/0924_1_perspective_preview.mp4'
import quoteAvatar from './assets/quote-avatar@2x.jpg'
import partnerLogos from './assets/partner-logos@2x.png'
import advantages from './assets/advantages@2x.png'
import { CertificationAudience } from './CertificationAudience'
import curriculum from './assets/curriculum@2x.png'
import courseBackgroundMask from './assets/course-background-mask@2x.png'
import outcomes from './assets/outcomes@2x.png'
import companies from './assets/companies@2x.png'
import reviewsArtwork from './assets/reviews@2x.png'
import enrollmentBackground from './assets/enrollment-background@2x.jpg'
import enrollmentBackgroundMask from './assets/enrollment-background-mask@2x.png'
import enrollmentCard from './assets/enrollment-card@2x.png'
import faq from './assets/faq@2x.png'
import './CertificationPage.css'

const reviews = [
  {
    id: 'sergey',
    quote: 'Запомнился блок про Big Data МТС: стало понятнее, как с её помощью выжимать больше из размещения',
    text: 'Из полезного — узнал, что можно активно работать со стратегиями, если объявлений много, это реально экономит время. Материал давали интересный, всё разложено по полочкам, все блоки раскрыты. По ходу презентации Денис часто задавал вопросы, которые дополняли материал на слайдах и расширяли его. Проходил курс онлайн и если говорить про организацию и качество связи, то меня всё устроило, всё было хорошо.',
    company: 'ADV',
    author: 'Сергей Шилов',
  },
  {
    id: 'elizaveta',
    quote: 'Для меня было много нового даже по тем инструментам, которыми я и так активно пользуюсь',
    text: 'Например, про принцип рандомности узнала только на курсе. В целом всё обучение было полезным. Мне было всё понятно и интересно, без ощущения, что какая-то информация лишняя или неактуальная. Спикер был в контакте и диалоге с аудиторией, не скупился на обратную связь. Техническая часть тоже без нареканий.',
    company: 'iCom',
    author: 'Елизавета Макарова',
  },
  {
    id: 'yulia',
    quote: 'Отдельно хотелось бы выделить блок про поколения рекламных технологий, он был самым полезным для меня',
    text: 'Обучение было информативно, увлекательно и очень полезно! Мы не только освежили свои знания, но и узнали много нового. Материал был объёмный и интересный, с хорошей понятной подачей. Мне понравилось, как спикер Денис Кучумов общался с аудиторией и давал исчерпывающую обратную связь. Я проходила сертификацию офлайн, всё было комфортно, кофе и печенье — топ)',
    company: 'РОССТ',
    author: 'Мацера Юлия',
  },
  {
    id: 'ilya',
    quote: 'Весь курс был полезным, особенно зацепил блок про стратегии, разобрали его интересно и по делу',
    text: 'Само обучение выстроено логично, всё было понятно с первого раза. Лектор последовательно и полно раскрывал все блоки, без белых пятен, давал хорошую обратную связь, которая дополняла уже пройденный материал.',
    company: 'iCom',
    author: 'Илья Шишов',
  },
  {
    id: 'maria',
    quote: 'Курс оказался полезным — подробнее разобралась в сложных стратегиях и в том, как работают алгоритмы',
    text: 'Материала оказалось ровно достаточно: ничего лишнего, но и пробелов не осталось, всё рабочее, актуальное. Само обучение построено логично и понятно, спикер раскрыл заявленные темы полностью и отвечал на вопросы по ходу.',
    company: 'MGCom',
    author: 'Мария Актальчикова',
  },
]

function DesignImage({ src, alt, id, className = '' }) {
  return (
    <section className={`cert-image-section ${className}`} id={id}>
      <img src={src} alt={alt} loading="lazy" />
    </section>
  )
}

function CertificationHero() {
  return (
    <section className="cert-hero" id="top">
      <img className="cert-hero__glow" src={heroGlow} alt="" aria-hidden="true" />
      <div className="cert-hero__inner">
        <div className="cert-hero__copy">
          <div className="cert-hero__tags" aria-label="Особенности курса">
            <span>Бесплатно</span><span>Онлайн</span><span>Теория</span><span>Практические задания</span>
          </div>
          <h1>Освойте рекламные<br className="cert-desktop-break" /> платформы МТС Ads</h1>
          <p>Научитесь запускать и анализировать рекламные кампании<br className="cert-desktop-break" /> в МТС Маркетологе и МТС DSP</p>
          <a className="cert-outline-button" href="#courses">Начать обучение</a>
        </div>
        <div className="cert-hero__visual">
          <div className="cert-hero__figure-mask" aria-hidden="true">
            <img className="cert-hero__figure" src={heroFigure} alt="" />
          </div>
          <div className="cert-hero__video-mask">
            <video className="cert-hero__video" src={heroVideo} autoPlay muted loop playsInline preload="metadata" aria-label="Видео об обучении рекламным платформам МТС Ads" />
          </div>
        </div>
        <div className="cert-hero__quote" aria-label="Отзыв участника курса">
          <strong>« Стало понятнее,<br /> как выжимать<br /> больше из Big Data</strong>
          <span><img className="cert-hero__avatar" src={quoteAvatar} alt="" /> Сергей</span>
        </div>
      </div>
    </section>
  )
}

function Reviews() {
  return (
    <section className="cert-reviews" aria-labelledby="cert-reviews-title">
      <h2 id="cert-reviews-title"><strong>500 специалистов</strong><br /> уже прошли обучение</h2>
      <div className="cert-reviews__track" tabIndex="0" aria-label="Отзывы участников, прокрутите горизонтально">
        <img className="cert-reviews__artwork" src={reviewsArtwork} alt="" aria-hidden="true" loading="lazy" />
      </div>
      <div className="cert-visually-hidden">
        {reviews.map((review) => (
          <article key={review.id}>
            <blockquote>{review.quote}</blockquote>
            <p>{review.text}</p>
            <p>{review.company}, {review.author}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function Enrollment() {
  return (
    <section className="cert-enrollment" id="enroll" aria-label="Присоединитесь к курсу">
      <img className="cert-enrollment__background" src={enrollmentBackground} alt="" aria-hidden="true" loading="lazy" />
      <img className="cert-enrollment__mask" src={enrollmentBackgroundMask} alt="" aria-hidden="true" loading="lazy" />
      <div className="cert-enrollment__card">
        <img src={enrollmentCard} alt="Приступите к курсу прямо сейчас. МТС Маркетолог — для работы с рекламой в разных каналах на основе Big Data МТС. МТС DSP — изучите программатик-платформу для brandformance, performance и охватной рекламы." loading="lazy" />
        <a href="#courses" aria-label="Начать обучение" />
      </div>
    </section>
  )
}

function Questions() {
  return (
    <section className="cert-questions" aria-label="Ответы на вопросы">
      <img src={faq} alt="Ответы на вопросы о прохождении курсов" loading="lazy" />
    </section>
  )
}

export function CertificationPage() {
  return (
    <div className="cert-page">
      <SiteHeader actionHref="#enroll" />
      <main>
      <CertificationHero />
      <div className="cert-partners"><img src={partnerLogos} alt="Компании, которые используют платформы МТС Ads" /></div>
      <div className="cert-advantages-stage">
        <img className="cert-advantages-stage__mask" src={courseBackgroundMask} alt="" aria-hidden="true" loading="lazy" />
        <DesignImage src={advantages} id="benefits" className="cert-image-section--advantages" alt="Три шага для эксперта в МТС Ads: вводный урок, тестирование и сертификат" />
        <CertificationAudience />
      </div>
      <div className="cert-curriculum-stage">
        <DesignImage src={curriculum} id="courses" className="cert-image-section--curriculum" alt="Программа курса МТС Маркетолог и МТС DSP" />
      </div>
      <DesignImage src={outcomes} className="cert-image-section--outcomes" alt="Чему научитесь в процессе обучения" />
      <DesignImage src={companies} className="cert-image-section--companies" alt="Более 5 000 компаний используют инструменты МТС Ads" />
      <div className="cert-reviews-stage">
        <img className="cert-reviews-stage__mask" src={enrollmentBackgroundMask} alt="" aria-hidden="true" loading="lazy" />
        <Reviews />
        <Enrollment />
      </div>
      <Questions />
      <SiteFooter id="contacts" className="cert-footer" />
      </main>
    </div>
  )
}
