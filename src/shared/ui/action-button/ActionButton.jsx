import './ActionButton.css'

export function ActionButton({ children, className = '', disabled = false, size = 'large', type = 'button' }) {
  const buttonClassName = ['action-button', `action-button--${size}`, className].filter(Boolean).join(' ')

  return (
    <button className={buttonClassName} disabled={disabled} type={type}>
      <span className="action-button__label">{children}</span>
    </button>
  )
}
