import { sliderSlides } from './sliderAssets'

export { sliderSlides }

export const sliderTrackCopies = 7
export const sliderMiddleCopy = Math.floor(sliderTrackCopies / 2)
export const sliderTrack = Array.from({ length: sliderTrackCopies }, () => sliderSlides).flat()
export const sliderStep = 760
export const sliderProgressDuration = 5000
export const sliderSnapDuration = 560
export const sliderCycleWidth = sliderSlides.length * sliderStep
export const sliderMiddleStart = sliderSlides.length * sliderMiddleCopy
