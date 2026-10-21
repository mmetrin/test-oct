// Values are CSS pixels/degrees; mobile overrides preserve a readable center card.
export const carouselSettings = {
  cardWidth: 360,
  horizontalGap: 190,
  rotateStep: 54,
  translateZStep: 72,
  verticalStep: 8,
  scaleStep: 0.025,
  blurStep: 1.1,
  perspective: 1100,
  transitionDuration: 650,
  mobile: {
    cardWidth: 250,
    horizontalGap: 110,
    rotateStep: 38,
    translateZStep: 48,
    verticalStep: 5,
    scaleStep: 0.052,
    blurStep: 1.2,
    perspective: 1100,
    transitionDuration: 480,
  },
}
