import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import logo from '../../../assets/figma/header/logo-mts-ads.svg'
import { ActionButton } from '../action-button/ActionButton'
import './SiteHeader.css'

const navigationItems = [
  { label: 'Решения', href: '#top', hasChevron: true },
  { label: 'Платформы', href: '#top', hasChevron: true },
  { label: 'Сертификация', href: `${import.meta.env.BASE_URL}certification/` },
  { label: 'Контакты', href: `${import.meta.env.BASE_URL}contacts/` },
]

export function SiteHeader({ actionHref, contactMode = false }) {
  const [isScrolled, setIsScrolled] = useState(() => window.scrollY > 0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const updateScrollState = () => setIsScrolled(window.scrollY > 0)

    window.addEventListener('scroll', updateScrollState, { passive: true })
    updateScrollState()

    return () => window.removeEventListener('scroll', updateScrollState)
  }, [])

  return createPortal(
    <header className={`site-header${isScrolled ? ' site-header--fixed-on' : ''}`}>
      <div className="site-header__frame" aria-hidden="true" />
      <div className="site-header__content">
        <a className="site-header__logo" href={`${import.meta.env.BASE_URL}enterprise-hero/`} aria-label="МТС ADS — главная">
          <img src={logo} alt="МТС ADS" />
        </a>

        <nav className={`site-header__navigation${isMenuOpen ? ' site-header__navigation--open' : ''}`} id="site-header-navigation" aria-label="Основная навигация">
          {navigationItems.map((item) => (
            <a className="site-header__navigation-link" href={contactMode && item.href === '#top' ? import.meta.env.BASE_URL : item.href} key={item.label} onClick={() => setIsMenuOpen(false)} aria-current={contactMode && item.label === 'Контакты' ? 'page' : undefined}>
              {item.label}
              {item.hasChevron && <span className="site-header__chevron" aria-hidden="true" />}
            </a>
          ))}
        </nav>

        {contactMode || actionHref ? (
          <a className="action-button action-button--medium site-header__action" href={actionHref ?? 'mailto:sales.ads@mts.ru?subject=Запуск%20рекламы'}><span className="action-button__label">Запустить рекламу</span></a>
        ) : (
          <ActionButton className="site-header__action" size="medium">Запустить рекламу</ActionButton>
        )}
        <button
          className="site-header__menu-button"
          type="button"
          aria-controls="site-header-navigation"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
      </div>
    </header>,
    document.body,
  )
}
