import { audienceDataThreads } from './audienceDataThreads'
import './AudienceDataChannels.css'

export function AudienceDataChannels() {
  return (
    <div className="audience-data-scene__channels" aria-hidden="true">
      {audienceDataThreads.map((thread) => (
        <div
          className="audience-data-scene__thread"
          key={thread.id}
          style={{
            left: `${thread.left}px`,
            // Convert scene Y into the channel layer and align its 1px line.
            top: `calc(${thread.top}px - var(--channels-top) - var(--thread-line-y))`,
            width: `${thread.width}px`,
            '--thread-opacity': Math.min(1, thread.opacity * 1.4),
            '--thread-color': thread.color,
            '--thread-thickness': `${thread.thickness}px`,
            '--thread-blur': `${thread.blur}px`,
            '--flow-start-x': `${Math.round(thread.width * 0.7)}px`,
            '--channel-duration': `${thread.duration}s`,
          }}
        >
          {thread.symbols && (
            <span
              className={`audience-data-scene__symbols${thread.gradient ? ' audience-data-scene__symbols--gradient' : ''}`}
              style={{
                '--symbol-duration': `${thread.symbolDuration}s`,
                '--symbol-size': `${thread.symbolSize}px`,
                '--symbol-alpha': thread.symbolAlpha,
                '--symbol-spacing': `${thread.symbolSpacing}px`,
                '--symbol-delay': `${thread.symbolDelay ?? 0}s`,
                '--symbol-color': thread.symbolColor ?? 'rgb(var(--thread-color) / var(--symbol-alpha))',
              }}
            >
              {thread.symbols}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
