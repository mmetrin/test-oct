import { useEffect, useRef } from 'react'

import './LightGlowCanvas.css'

const FRAME_INTERVAL = 1000 / 30

const vertexShaderSource = `#version 300 es
layout(location = 0) in vec2 a_position;
out vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`

const fragmentShaderSource = `#version 300 es
precision mediump float;

in vec2 v_uv;
out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;

const vec3 BG = vec3(0.0, 0.0314, 0.0784);
const vec3 CYAN_BLUE = vec3(0.09, 0.40, 0.72);
const vec3 BLUE = vec3(0.25, 0.52, 0.90);
const vec3 PALE_BLUE = vec3(0.70, 0.80, 0.98);

mat2 rotate2d(float angle) {
  float cosine = cos(angle);
  float sine = sin(angle);
  return mat2(cosine, -sine, sine, cosine);
}

float hash(vec2 point) {
  point = fract(point * vec2(123.34, 345.45));
  point += dot(point, point + 34.345);
  return fract(point.x * point.y);
}

float noise(vec2 point) {
  vec2 cell = floor(point);
  vec2 fraction = fract(point);
  fraction = fraction * fraction * (3.0 - 2.0 * fraction);
  return mix(
    mix(hash(cell), hash(cell + vec2(1.0, 0.0)), fraction.x),
    mix(hash(cell + vec2(0.0, 1.0)), hash(cell + vec2(1.0, 1.0)), fraction.x),
    fraction.y
  );
}

float fbm(vec2 point) {
  float value = 0.0;
  float amplitude = 0.5;

  for (int index = 0; index < 3; index++) {
    value += noise(point) * amplitude;
    point = point * 2.03 + vec2(4.7, 8.2);
    amplitude *= 0.5;
  }

  return value;
}

float softGlow(vec2 uv, vec2 center, vec2 size, float angle, float softness) {
  vec2 point = (uv - center) * rotate2d(angle) / size;
  return exp(-dot(point, point) * softness);
}

vec3 paintGlow(float mainGlow, float innerGlow, float softGlowValue) {
  float cyanBand = smoothstep(0.025, 0.48, max(mainGlow - innerGlow * 0.52, 0.0));
  float cyanHalo = smoothstep(0.015, 0.50, max(softGlowValue - mainGlow * 0.58, 0.0));
  vec3 color = vec3(0.0);

  color += CYAN_BLUE * mainGlow * 0.54;
  color += BLUE * mainGlow * 0.31;
  color += PALE_BLUE * mainGlow * 0.23;
  color += vec3(1.0) * mainGlow * 0.105;
  color += CYAN_BLUE * cyanBand * 0.24;
  color += CYAN_BLUE * innerGlow * 0.105;
  color += BLUE * innerGlow * 0.23;
  color += PALE_BLUE * innerGlow * 0.24;
  color += vec3(1.0) * innerGlow * 0.175;
  color += CYAN_BLUE * cyanHalo * 0.13;
  color += CYAN_BLUE * softGlowValue * 0.11;
  color += BLUE * softGlowValue * 0.055;
  color += PALE_BLUE * softGlowValue * 0.07;

  return color;
}

vec3 createSideGlow(vec2 warpedUv, float aspect, float time, float direction) {
  float isLeft = step(0.0, -direction);
  float phase = mix(2.0, 0.0, isLeft);
  float verticalOffset = mix(-0.04, 0.04, isLeft);
  float angle = mix(0.08, -0.08, isLeft);
  float centerX = direction * (aspect + 0.16) + sin(time * mix(0.73, 0.78, isLeft) + phase) * 0.34;
  float centerY = verticalOffset + cos(time * mix(0.64, 0.61, isLeft) + mix(1.3, 0.0, isLeft)) * 0.22;
  vec2 center = vec2(centerX, centerY);
  float width = 1.0 + sin(time * mix(1.01, 1.04, isLeft) + mix(1.7, 0.0, isLeft)) * 0.16 + sin(time * mix(0.43, 0.46, isLeft)) * 0.10;
  float height = 1.0 + cos(time * mix(0.84, 0.88, isLeft) + mix(0.8, 0.0, isLeft)) * 0.10;
  vec2 innerOffset = vec2(direction * -0.16, direction * 0.03) + vec2(sin(time * mix(0.72, 0.75, isLeft)) * 0.08, cos(time * mix(0.59, 0.62, isLeft)) * 0.07);
  vec2 softOffset = vec2(direction * 0.05, direction * -0.10);
  float mainGlow = softGlow(warpedUv, center, vec2(0.44 * width, 0.82 * height), angle + sin(time * 0.5) * 0.10, 1.14);
  float innerGlow = softGlow(warpedUv, center + innerOffset, vec2(0.22, 0.62), angle * 0.25 + sin(time * 0.64) * 0.10, 1.38);
  float outerGlow = softGlow(warpedUv, center + softOffset, vec2(0.56, 0.56), -angle + sin(time * 0.4) * 0.07, 1.50);

  return paintGlow(mainGlow, innerGlow, outerGlow);
}

void main() {
  vec2 uv = v_uv * 2.0 - 1.0;
  float aspect = u_resolution.x / u_resolution.y;
  uv.x *= aspect;
  float time = u_time * 0.60;
  vec2 warpedUv = uv;
  warpedUv.x += (fbm(uv * 0.55 + vec2(time * 0.10, -time * 0.07)) - 0.5) * 0.09;
  warpedUv.y += (fbm(uv * 0.70 + vec2(-time * 0.08, time * 0.09) + 7.4) - 0.5) * 0.06;
  vec3 lighting = createSideGlow(warpedUv, aspect, time, 1.0) + createSideGlow(warpedUv, aspect, time, -1.0);
  lighting *= 0.28 + smoothstep(0.34, 1.05, abs(uv.x)) * 0.72;
  vec3 color = BG + lighting;
  color = color / (vec3(1.0) + color * 0.30);
  fragColor = vec4(color, 1.0);
}`

function createShader(context, type, source) {
  const shader = context.createShader(type)

  context.shaderSource(shader, source)
  context.compileShader(shader)

  if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
    context.deleteShader(shader)
    return null
  }

  return shader
}

export function LightGlowCanvas() {
  const canvasRef = useRef(null)
  const overlayRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('webgl2', { alpha: false, antialias: false })

    if (!canvas || !context) {
      return undefined
    }

    const vertexShader = createShader(context, context.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = createShader(context, context.FRAGMENT_SHADER, fragmentShaderSource)

    if (!vertexShader || !fragmentShader) {
      return undefined
    }

    const program = context.createProgram()

    context.attachShader(program, vertexShader)
    context.attachShader(program, fragmentShader)
    context.linkProgram(program)

    if (!context.getProgramParameter(program, context.LINK_STATUS)) {
      return undefined
    }

    const buffer = context.createBuffer()
    const timeUniform = context.getUniformLocation(program, 'u_time')
    const resolutionUniform = context.getUniformLocation(program, 'u_resolution')
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let animationFrameId = 0
    let previousFrameTime = 0
    let isVisible = false
    const startTime = window.performance.now()

    context.useProgram(program)
    context.bindBuffer(context.ARRAY_BUFFER, buffer)
    context.bufferData(context.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), context.STATIC_DRAW)
    context.enableVertexAttribArray(0)
    context.vertexAttribPointer(0, 2, context.FLOAT, false, 0, 0)

    function resize() {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.25)
      const width = Math.max(1, Math.round(canvas.clientWidth * pixelRatio))
      const height = Math.max(1, Math.round(canvas.clientHeight * pixelRatio))

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
      }

      context.viewport(0, 0, width, height)
      context.useProgram(program)
      context.bindBuffer(context.ARRAY_BUFFER, buffer)
      context.enableVertexAttribArray(0)
      context.vertexAttribPointer(0, 2, context.FLOAT, false, 0, 0)
      context.uniform2f(resolutionUniform, width, height)
    }

    function draw(currentTime) {
      resize()
      context.uniform1f(timeUniform, (currentTime - startTime) / 1000)
      context.drawArrays(context.TRIANGLE_STRIP, 0, 4)
    }

    function render(currentTime) {
      animationFrameId = 0

      if (!isVisible || document.hidden || reducedMotionQuery.matches) {
        return
      }

      if (currentTime - previousFrameTime >= FRAME_INTERVAL) {
        previousFrameTime = currentTime
        draw(currentTime)
      }

      animationFrameId = window.requestAnimationFrame(render)
    }

    function stopAnimation() {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId)
        animationFrameId = 0
      }
    }

    function startAnimation() {
      if (!isVisible || document.hidden) {
        return
      }

      const currentTime = window.performance.now()
      draw(reducedMotionQuery.matches ? startTime + 2500 : currentTime)
      previousFrameTime = currentTime

      if (!reducedMotionQuery.matches && !animationFrameId) {
        animationFrameId = window.requestAnimationFrame(render)
      }
    }

    const resizeObserver = new ResizeObserver(() => {
      if (isVisible) {
        draw(window.performance.now())
      }
    })
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting
      overlayRef.current?.style.setProperty('animation-play-state', isVisible ? 'running' : 'paused')

      if (isVisible) {
        startAnimation()
      } else {
        stopAnimation()
      }
    }, { rootMargin: '160px 0px' })
    const handleVisibilityChange = () => {
      if (document.hidden) {
        overlayRef.current?.style.setProperty('animation-play-state', 'paused')
        stopAnimation()
      } else {
        overlayRef.current?.style.setProperty('animation-play-state', isVisible ? 'running' : 'paused')
        startAnimation()
      }
    }

    resizeObserver.observe(canvas)
    intersectionObserver.observe(canvas)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      stopAnimation()
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      context.deleteBuffer(buffer)
      context.deleteProgram(program)
      context.deleteShader(vertexShader)
      context.deleteShader(fragmentShader)
    }
  }, [])

  return (
    <>
      <canvas className="light-glow-canvas" ref={canvasRef} aria-hidden="true" />
      <div className="light-glow-overlay" ref={overlayRef} aria-hidden="true" />
    </>
  )
}
