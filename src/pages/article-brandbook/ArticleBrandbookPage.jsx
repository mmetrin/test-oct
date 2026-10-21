import { useEffect, useRef, useState } from 'react'
import header from '../../assets/figma/article-brandbook/header.png'
import heroBackground from '../../assets/figma/article-brandbook/hero-background.png'
import heroContent from '../../assets/figma/article-brandbook/hero-content.png'
import content01 from '../../assets/figma/article-brandbook/content-01.png'
import content02 from '../../assets/figma/article-brandbook/content-02.png'
import content03 from '../../assets/figma/article-brandbook/content-03.png'
import content04 from '../../assets/figma/article-brandbook/content-04.png'
import bottom from '../../assets/figma/article-brandbook/bottom.png'
import './ArticleBrandbookPage.css'

const articleImages = [
  { src: content01, height: 2479 },
  { src: content02, height: 2500 },
  { src: content03, height: 2368 },
  { src: content04, height: 1995 },
]

const sections = [
  { id: 'contents', label: 'Содержание' },
  { id: 'difference', label: 'Чем брендбук отличается от гайдлайна и логобука', offset: 418 },
  { id: 'tasks', label: 'Какие задачи решает брендбук', offset: 666 },
  { id: 'includes', label: 'Что входит в брендбук', offset: 2575 },
  { id: 'development', label: 'Как разработать брендбук', offset: 6319 },
  { id: 'questions', label: 'Вопросы и ответы', offset: 8232 },
]

const relatedArticlesHeadingOffset = 200

export function ArticleBrandbookPage() {
  const pageRef = useRef(null)
  const bodyRef = useRef(null)
  const bottomRef = useRef(null)
  const tocRef = useRef(null)
  const [activeSection, setActiveSection] = useState('contents')
  const [isTocHidden, setIsTocHidden] = useState(false)

  useEffect(() => {
    let frame = 0

    const updateActiveSection = () => {
      const page = pageRef.current
      const body = bodyRef.current
      const bottom = bottomRef.current
      const toc = tocRef.current
      if (!page || !body || !bottom || !toc) return

      const pageRect = page.getBoundingClientRect()
      const scale = pageRect.width / 1920
      toc.style.setProperty('--toc-unit', `${scale}px`)
      toc.style.left = `${pageRect.left + 240 * scale}px`
      toc.style.width = `${250 * scale}px`
      toc.style.top = `${148 * scale}px`
      toc.style.visibility = 'visible'

      const relatedHeadingTop = bottom.getBoundingClientRect().top + relatedArticlesHeadingOffset * scale
      const fadeStart = window.innerHeight * 1.1
      const fadeEnd = window.innerHeight * 0.82
      const tocOpacity = Math.min(1, Math.max(0, (relatedHeadingTop - fadeEnd) / (fadeStart - fadeEnd)))
      toc.style.opacity = `${tocOpacity}`
      const shouldHideToc = tocOpacity === 0
      setIsTocHidden((current) => current === shouldHideToc ? current : shouldHideToc)

      const bodyImageTop = window.scrollY + body.getBoundingClientRect().top + 40 * scale
      const readingLine = window.scrollY + Math.min(window.innerHeight * 0.28, 260)
      let nextSection = sections[0].id

      for (const section of sections.slice(1)) {
        if (readingLine >= bodyImageTop + section.offset * scale) {
          nextSection = section.id
        }
      }

      setActiveSection((current) => current === nextSection ? current : nextSection)
    }

    const scheduleUpdate = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        updateActiveSection()
      })
    }

    updateActiveSection()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)

    return () => {
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <>
      <div className={`article-brandbook-page__toc-track${isTocHidden ? ' article-brandbook-page__toc-track--hidden' : ''}`} ref={tocRef} aria-hidden={isTocHidden} inert={isTocHidden}>
        <nav className="article-brandbook-page__toc" aria-label="Содержание статьи">
          {sections.map(({ id, label }) => (
            <a key={id} className="article-brandbook-page__toc-link" href={`#${id}`} aria-current={activeSection === id ? 'location' : undefined}>
              {label}
            </a>
          ))}
        </nav>
      </div>

      <main className="article-brandbook-page" id="contents" ref={pageRef} aria-label="Брендбук: зачем нужен и как создать">
        <h1 className="article-brandbook-page__accessible-title">Брендбук: зачем нужен и как создать</h1>

        <section className="article-brandbook-page__hero" aria-label="Обложка статьи">
          <img className="article-brandbook-page__hero-background" src={heroBackground} width="1920" height="914" alt="" />
          <img className="article-brandbook-page__header" src={header} width="1920" height="88" alt="" />
          <img className="article-brandbook-page__hero-content" src={heroContent} width="770" height="794" alt="Обложка статьи «Брендбук: зачем нужен и как создать»" />
        </section>

        <section className="article-brandbook-page__article" ref={bodyRef} aria-label="Текст статьи">
          {sections.slice(1).map(({ id, offset }) => (
            <span key={id} className="article-brandbook-page__section-anchor" id={id} style={{ top: `${(offset + 40) / 19.2}cqw` }} aria-hidden="true" />
          ))}
          {articleImages.map(({ src, height }, index) => (
            <img
              key={src}
              className="article-brandbook-page__article-image"
              src={src}
              width="770"
              height={height}
              alt={`Содержание статьи, часть ${index + 1}`}
              loading={index === 0 ? 'eager' : 'lazy'}
              decoding="async"
            />
          ))}
        </section>

        <img className="article-brandbook-page__bottom" ref={bottomRef} src={bottom} width="1920" height="1391" alt="Другие статьи и подвал сайта" loading="lazy" decoding="async" />
      </main>
    </>
  )
}
