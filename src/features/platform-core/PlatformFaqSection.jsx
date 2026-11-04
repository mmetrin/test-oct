import { useState } from 'react'
import chevronUp from '../../assets/figma/platform-sections/faq-chevron-up.svg'
import chevronRight from '../../assets/figma/platform-sections/faq-chevron-right.svg'
import divider from '../../assets/figma/platform-sections/faq-divider.svg'
import './PlatformFaqSection.css'

const questions = [
  {
    id: 'difference',
    question: 'Чем Маркетолог 2.0 отличается от МТС Маркетолога и Маркетолога PRO?',
    answer: 'МТС Маркетолог — самостоятельный запуск рекламы для малого и среднего бизнеса. Маркетолог PRO — Telegram Ads на данных Big Data МТС. Маркетолог 2.0 собирает VK, Avito и Telegram в одну кампанию с управлением охватом и частотой. Он создан для крупных рекламодателей и агентств.',
  },
  { id: 'account', question: 'Нужен ли рекламный кабинет платформы, чтобы начать обучение?' },
  { id: 'platforms', question: 'Какие площадки доступны на старте?' },
  { id: 'tasks', question: 'Под какие задачи?' },
  { id: 'agency', question: 'Можно работать через агентство?' },
  { id: 'results', question: 'Как оценить результат?' },
]

function PlatformFaqQuestion({ id, question, answer, isLast }) {
  const [isOpen, setIsOpen] = useState(Boolean(answer))
  const heading = <>
    <span className="platform-faq__question-text">{question}</span>
    <img className={`platform-faq__chevron${isOpen ? '' : ' platform-faq__chevron--closed'}`} src={isOpen ? chevronUp : chevronRight} alt="" width="32" height="32" aria-hidden="true" />
  </>

  return <div className="platform-faq__item">
    <h3>
      {answer
        ? <button className="platform-faq__question" type="button" aria-expanded={isOpen} aria-controls={`platform-faq-answer-${id}`} onClick={() => setIsOpen(!isOpen)}>{heading}</button>
        : <span className="platform-faq__question">{heading}</span>}
    </h3>
    {answer && <p className="platform-faq__answer" id={`platform-faq-answer-${id}`} hidden={!isOpen}>{answer}</p>}
    {!isLast && <img className="platform-faq__divider" src={divider} alt="" aria-hidden="true" />}
  </div>
}

export function PlatformFaqSection() {
  return <section className="platform-faq" id="faq" aria-labelledby="platform-faq-title">
    <h2 id="platform-faq-title">Ответы на вопросы</h2>
    <div className="platform-faq__questions">
      {/* Keep unanswered entries collapsed as approved until their copy is supplied. */}
      {questions.map((question, index) => <PlatformFaqQuestion key={question.id} {...question} isLast={index === questions.length - 1} />)}
    </div>
  </section>
}
