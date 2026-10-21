import {
  sliderCycleWidth,
  sliderMiddleStart,
  sliderSlides,
  sliderStep,
  sliderTrackCopies,
} from './sliderConfig'

export function getSliderIndex(slideIndex) {
  return ((slideIndex % sliderSlides.length) + sliderSlides.length) % sliderSlides.length
}

export function getMiddleTrackSlide(slideIndex) {
  return sliderMiddleStart + getSliderIndex(slideIndex)
}

export function getLoopedSliderOffset(offset) {
  const minOffset = sliderCycleWidth
  const maxOffset = sliderCycleWidth * (sliderTrackCopies - 2)
  let loopedOffset = offset

  while (loopedOffset < minOffset) {
    loopedOffset += sliderCycleWidth
  }

  while (loopedOffset > maxOffset) {
    loopedOffset -= sliderCycleWidth
  }

  return loopedOffset
}

export function getSlideFromOffset(offset) {
  return Math.round(offset / sliderStep)
}
