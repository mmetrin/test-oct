import { useId } from 'react'

// Trace the original artwork along its vector route, preserving the Figma gradients.
export function AudienceConnector({ className, src, width, height, trace, strokeWidth = 4, children }) {
  const maskId = useId()

  return <svg className={className} width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
    <defs>
      <mask id={maskId} maskUnits="userSpaceOnUse" x="-2" y="-2" width={width + 4} height={height + 4}>
        {children}
        <path className="platform-audience__line-trace" d={trace} fill="none" stroke="white" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      </mask>
    </defs>
    <image href={src} width={width} height={height} mask={`url(#${maskId})`} />
  </svg>
}
