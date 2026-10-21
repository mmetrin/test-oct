const SCALE_THRESHOLD = 1600

export function getDesignScale() {
  return Math.min(1, window.innerWidth / SCALE_THRESHOLD)
}
