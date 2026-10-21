import funnelTop from '../../assets/figma/enterprise-funnel/funnel-top.svg'
import funnelBottom from '../../assets/figma/enterprise-funnel/funnel-bottom.svg'
import funnelBottomGlow from '../../assets/figma/enterprise-funnel/funnel-bottom-glow.svg'
import './FunnelDesignArtwork.css'

// Figma 10113:102608: fixed 510 × 624 viewport, with original SVG layers.
export function FunnelDesignArtwork() {
  return (
    <div className="funnel-design-artwork" aria-hidden="true">
      <img className="funnel-design-artwork__top" src={funnelTop} alt="" />
      <img className="funnel-design-artwork__bottom" src={funnelBottom} alt="" />
      <img className="funnel-design-artwork__bottom" src={funnelBottomGlow} alt="" />
    </div>
  )
}
