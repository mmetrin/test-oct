export const portraitDeclarations = /* glsl */`
varying vec3 vCoreSurface;
uniform sampler2D uPortraitAtlas;
uniform vec2 uPortraitGrid;
uniform vec4 uPortraitPatches[12];
uniform vec3 uPortraitRight[12];
uniform vec3 uPortraitUp[12];
uniform vec4 uPortraitState[12];
vec3 corePortrait(float index, vec2 point) {
  vec2 cell = vec2(mod(index, uPortraitGrid.x), floor(index / uPortraitGrid.x));
  vec2 uv = (cell + vec2(point.x * 0.48 + 0.5, 0.5 - point.y * 0.48)) / uPortraitGrid;
  uv.y = 1.0 - uv.y;
  return texture2D(uPortraitAtlas, uv).rgb;
}
`

export const portraitColor = /* glsl */`
vec3 surface = normalize(vCoreSurface);
for (int i = 0; i < 12; i++) {
  vec4 portraitArea = uPortraitPatches[i];
  vec4 state = uPortraitState[i];
  if (state.x > 0.001 && dot(surface, portraitArea.xyz) > 0.0) {
    vec2 point = vec2(dot(surface, uPortraitRight[i]), dot(surface, uPortraitUp[i])) / portraitArea.w;
    float distanceToEdge = length(point);
    if (distanceToEdge < 1.0) {
      float coverage = (1.0 - smoothstep(0.86, 1.0, distanceToEdge)) * state.x;
      vec3 photograph = mix(corePortrait(state.y, point), corePortrait(state.z, point), state.w);
      diffuseColor.rgb = mix(diffuseColor.rgb, photograph, coverage);
    }
  }
}
`
