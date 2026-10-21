import './AudienceTransferImpulses.css'

const impulses = Array.from({ length: 24 }, (_, index) => ({
  id: `impulse-${index}`,
  x: 1020 + ((index * 71) % 390),
  y: 18 + ((index * 43) % 320),
  hasBead: index % 3 === 0,
  length: 45 + (index % 4) * 22,
  duration: 3.8 + (index % 4) * 0.5,
  delay: (index * 0.87) % 5,
  color: ['128 179 255', '151 194 255', '103 161 247'][index % 3],
}))

export function AudienceTransferImpulses() {
  return (
    <div className="audience-transfer-impulses" aria-hidden="true">
      {impulses.map((impulse) => (
        <span
          className={`audience-transfer-impulses__particle${impulse.hasBead ? ' audience-transfer-impulses__particle--bead' : ''}`}
          key={impulse.id}
          style={{
            left: `${impulse.x}px`,
            top: `${impulse.y}px`,
            '--impulse-length': `${impulse.length}px`,
            '--impulse-duration': `${impulse.duration}s`,
            '--impulse-phase': `${impulse.delay}s`,
            '--impulse-color': impulse.color,
          }}
        />
      ))}
    </div>
  )
}
