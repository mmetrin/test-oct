export function DspAction({ children = 'Получить консультацию', className = '' }) {
  return <a className={`dsp-action ${className}`} href={`${import.meta.env.BASE_URL}contacts/`}><span>{children}</span></a>
}

export function DspSegments({ options, selected, onChange, label, controls }) {
  return <div className="dsp-segments" role="group" aria-label={label}>{options.map(option => <button type="button" key={option} aria-pressed={selected === option} aria-controls={controls} onClick={() => onChange(option)}>{option}</button>)}</div>
}
