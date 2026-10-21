import { useEffect, useRef } from 'react'
import './TeamCreditsSectionWebgl.css'

const TEAM_CREDITS = [
  'Designer and Creative: Jack MacKinnon',
  'Creative: Luna Gooriah',
  'Senior Producer: Maud Dedecker',
  'Producer: Josh Gan',
  'Assistant producer: Ibu Hyuga',
  'Creative director: Mélanie Hubert-Crozet',
  'Strategic director: Mattijs Devroedt',
]

const VERTEX_SHADER = `attribute vec2 position; void main(){gl_Position=vec4(position,0.0,1.0);}`

const FRAGMENT_SHADER = `
precision highp float;
uniform vec2 resolution;
uniform float time;
uniform float displacement;
uniform float seed;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),f.x),mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),f.x),f.y);}
float fbm(vec2 p){float value=0.0;float amplitude=0.5;for(int i=0;i<5;i++){value+=amplitude*noise(p);p=p*2.03+13.1;amplitude*=0.5;}return value;}
void main(){
  vec2 uv=gl_FragCoord.xy/resolution.xy;
  float aspect=resolution.x/resolution.y;
  vec2 point=vec2((uv.x-0.5)*aspect,uv.y-0.5);
  float field=fbm(point*2.45+vec2(time*0.035,-time*0.0245)+seed*1.8);
  float warp=(field-0.5)*(0.2+displacement*0.24);
  vec2 warped=uv+vec2(warp*0.7,warp*0.42);
  vec3 color1=vec3(0.055,0.22,0.63);
  vec3 color2=vec3(0.18,0.65,0.98);
  vec3 color3=vec3(0.31,0.26,0.84);
  vec3 color4=vec3(0.015,0.055,0.22);
  float blend=clamp(warped.x*0.9+warped.y*0.45,0.0,1.0);
  vec3 color=mix(color1,color2,smoothstep(0.0,0.38,blend));
  color=mix(color,color3,smoothstep(0.34,0.7,blend));
  color=mix(color,color4,smoothstep(0.66,1.0,blend));
  gl_FragColor=vec4(color+(field-0.5)*0.08,1.0);
}`

export function TeamCreditsSectionWebgl() {
  const sectionRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const canvas = canvasRef.current
    const gl = canvas?.getContext('webgl', { antialias: false, alpha: false })
    if (!section || !canvas || !gl) return undefined

    const vertexShader = gl.createShader(gl.VERTEX_SHADER)
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
    const program = gl.createProgram()
    const buffer = gl.createBuffer()
    if (!vertexShader || !fragmentShader || !program || !buffer) return undefined

    gl.shaderSource(vertexShader, VERTEX_SHADER)
    gl.compileShader(vertexShader)
    gl.shaderSource(fragmentShader, FRAGMENT_SHADER)
    gl.compileShader(fragmentShader)
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    const position = gl.getAttribLocation(program, 'position')
    const resolution = gl.getUniformLocation(program, 'resolution')
    const time = gl.getUniformLocation(program, 'time')
    const displacement = gl.getUniformLocation(program, 'displacement')
    const seed = gl.getUniformLocation(program, 'seed')
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW)
    gl.useProgram(program)
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

    let frameId = 0
    const startedAt = performance.now()
    let targetDisplacement = 2.5
    let targetSeed = 0
    let smoothDisplacement = targetDisplacement
    let smoothSeed = targetSeed

    const resize = () => {
      const bounds = section.getBoundingClientRect()
      canvas.width = Math.max(1, Math.floor(bounds.width))
      canvas.height = Math.max(1, Math.floor(bounds.height))
      gl.viewport(0, 0, canvas.width, canvas.height)
    }

    const onPointerMove = (event) => {
      const bounds = section.getBoundingClientRect()
      targetDisplacement = Math.max(0, Math.min(5, ((event.clientX - bounds.left) / bounds.width) * 5))
      targetSeed = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height) * 2 - 1))
    }

    const render = (now) => {
      smoothDisplacement += 0.1 * (targetDisplacement - smoothDisplacement)
      smoothSeed += 0.1 * (targetSeed - smoothSeed)
      gl.uniform2f(resolution, canvas.width, canvas.height)
      gl.uniform1f(time, (now - startedAt) / 1000)
      gl.uniform1f(displacement, smoothDisplacement)
      gl.uniform1f(seed, smoothSeed)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
      frameId = requestAnimationFrame(render)
    }

    resize()
    window.addEventListener('resize', resize)
    section.addEventListener('pointermove', onPointerMove)
    frameId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', resize)
      section.removeEventListener('pointermove', onPointerMove)
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
      gl.deleteShader(vertexShader)
      gl.deleteShader(fragmentShader)
    }
  }, [])

  return (
    <section className="team-credits-webgl" ref={sectionRef} aria-labelledby="team-credits-title">
      <canvas className="team-credits-webgl__canvas" ref={canvasRef} aria-hidden="true" />
      <div className="team-credits-webgl__inner">
        <h2 className="team-credits-webgl__eyebrow" id="team-credits-title">Credits</h2>
        <h3 className="team-credits-webgl__title">The team</h3>
        <ul className="team-credits-webgl__list">
          {TEAM_CREDITS.map((credit) => <li key={credit}>{credit}</li>)}
        </ul>
      </div>
    </section>
  )
}
