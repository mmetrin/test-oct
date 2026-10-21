import bigDataMtsImage from '../../assets/figma/dcp/big-data/big-data-mts.svg'
import dataOrbImage from '../../assets/figma/audience-data/data-orb.png'
import dataOrbMask from '../../assets/figma/audience-data/data-orb-mask.svg'
import dataPlusImage from '../../assets/figma/audience-data/audience-data-img.png'
import dataRingImage from '../../assets/figma/audience-data/data-ring.png'
import dataShapeImage from '../../assets/figma/audience-data/orbit-light.png'
import { AudienceCursorTrail } from './AudienceCursorTrail'
import { AudienceDataChannels } from './AudienceDataChannels'
import { AudienceTransferImpulses } from './AudienceTransferImpulses'
import { AudiencePartnerLogos } from './AudiencePartnerLogos'
import './AudienceDataScene.css'

// Retained as a reversible backup: enable to restore the original plus intro.
const SHOW_DATA_INTRO = false

export function AudienceDataScene() {
  return (
    <div className={`audience-data-scene${SHOW_DATA_INTRO ? ' audience-data-scene--with-intro' : ''}`}>
      <img className="audience-data-scene__orbit" src={dataShapeImage} alt="" />
      <img className="audience-data-scene__label" src={bigDataMtsImage} alt="Big Data MTS" />
      <div className="audience-data-scene__intro-decoration" hidden={!SHOW_DATA_INTRO} aria-hidden="true">
        <div className="audience-data-scene__orb" style={{ maskImage: `url(${dataOrbMask})` }}>
          <img src={dataOrbImage} alt="" />
        </div>
        <img className="audience-data-scene__ring" src={dataRingImage} alt="" />
        <img className="audience-data-scene__plus-image" src={dataPlusImage} alt="" />
        <div className="audience-data-scene__plus">
          <span />
          <span />
        </div>
      </div>
      <AudienceDataChannels />
      <AudienceTransferImpulses />
      <AudiencePartnerLogos />
      <AudienceCursorTrail />
    </div>
  )
}
