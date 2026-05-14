import { useState, useEffect } from 'react'

// 650×650 container centered on mascot. Center point at (325, 325).
// Mascot (320×320 on md) occupies (165,165)→(485,485) inside this container.
const CX = 325
const CY = 325

function makeDots(
  r: number,
  angles: readonly number[],
  sizes: readonly number[],
  colors: readonly string[],
  delayBase: number,
) {
  return angles.map((deg, i) => {
    const rad = deg * (Math.PI / 180)
    const size = sizes[i % sizes.length]
    return {
      id:    `hr${r}-${i}`,
      left:  CX + r * Math.cos(rad) - size / 2,
      top:   CY + r * Math.sin(rad) - size / 2,
      size,
      color: colors[i % colors.length],
      delay: `${(delayBase + i * 0.085).toFixed(2)}s`,
      glow:  size >= 3.5 ? 8 : size >= 2.5 ? 5 : 3,
    }
  })
}

const T = 'rgba(82,170,167,0.90)'
const S = 'rgba(196,194,216,0.90)'
const W = 'rgba(255,255,255,0.94)'

const A1 = [3,18,36,54,76,100,128,162,198,232,268,302,326,348] as const
const A2 = [8,22,40,58,74,90,110,130,152,170,188,208,225,244,260,278,298,318,338,354] as const
const A3 = [6,28,55,82,118,162,200,234,268,298,326,350] as const
const A4 = [32,86,142,188,244,300,352] as const

const RINGS = [
  { dots: makeDots(176, A1, [1.5,2.5,1.5,3.5,2,1,3,1.5,2.5,1,4,2,1.5,3],                   [T,S,T,W,S,T,T,S,W,T,S,T,T,W],            0)    },
  { dots: makeDots(206, A2, [1,2,1.5,2.5,1,1.5,2,1,3,1.5,2,1,2.5,1.5,1,2,1.5,4,1,2],       [S,T,W,S,T,W,T,S,T,W,S,T,W,T,S,W,T,S,T,W], 0.25) },
  { dots: makeDots(236, A3, [2,1,3.5,1.5,2.5,1,5,2,1.5,3.5,1.5,2.5],                        [T,W,T,S,T,W,S,T,W,T,S,T],                 0.50) },
  { dots: makeDots(262, A4, [1.5,2.5,1,3,1.5,2,1],                                           [S,T,W,T,S,W,T],                            0.72) },
]

const RIPPLES = [
  { id: 0, delay: '0s'    },
  { id: 1, delay: '0.95s' },
  { id: 2, delay: '1.9s'  },
  { id: 3, delay: '2.85s' },
]

// Helper for border dots — delay cycles 0→3.5s across all 56 dots
function bd(
  id: string, x: number, y: number, size: number,
  color: string, dur: number, di: number,
) {
  return {
    id, x, y, size, color, dur,
    delay: `${((di * 0.14) % 3.5).toFixed(2)}s`,
    glow:  size >= 4.5 ? 18 : size >= 3.5 ? 14 : size >= 3 ? 11 : 8,
  }
}

// 56 dots hugging all 4 edges of the mascot frame (just outside border)
// Top-left of mascot frame in container: (165, 165). Bottom-right: (485, 485).
const BORDER_DOTS = [
  // ── Top edge (y ≈ 154–163) ─────────────────────────────────────────────
  bd('bt0',  175, 158, 2.5, T, 7,  0), bd('bt1',  193, 162, 3.5, W, 6,  1),
  bd('bt2',  212, 156, 2,   S, 8,  2), bd('bt3',  235, 160, 4.5, T, 7,  3),
  bd('bt4',  258, 155, 2.5, S, 9,  4), bd('bt5',  280, 161, 3,   W, 6,  5),
  bd('bt6',  305, 157, 2,   T, 8,  6), bd('bt7',  325, 159, 5,   T, 5,  7),
  bd('bt8',  348, 156, 2.5, S, 7,  8), bd('bt9',  370, 161, 3,   W, 8,  9),
  bd('bt10', 393, 157, 2,   T, 6, 10), bd('bt11', 418, 160, 3.5, S, 9, 11),
  bd('bt12', 442, 156, 2.5, T, 7, 12), bd('bt13', 464, 161, 3,   W, 6, 13),
  bd('bt14', 480, 157, 2,   S, 8, 14),
  // ── Bottom edge (y ≈ 487–495) ─────────────────────────────────────────
  bd('bb0',  175, 488, 2.5, S, 8, 15), bd('bb1',  194, 492, 3,   T, 6, 16),
  bd('bb2',  216, 488, 2,   W, 7, 17), bd('bb3',  240, 491, 4.5, S, 9, 18),
  bd('bb4',  263, 488, 2.5, T, 6, 19), bd('bb5',  285, 492, 3,   W, 8, 20),
  bd('bb6',  308, 488, 2,   T, 7, 21), bd('bb7',  328, 491, 5,   S, 5, 22),
  bd('bb8',  352, 488, 2.5, T, 8, 23), bd('bb9',  374, 492, 3,   W, 7, 24),
  bd('bb10', 396, 488, 2,   S, 6, 25), bd('bb11', 420, 491, 3.5, T, 9, 26),
  bd('bb12', 444, 488, 2.5, W, 7, 27), bd('bb13', 465, 492, 3,   S, 6, 28),
  bd('bb14', 480, 488, 2,   T, 8, 29),
  // ── Left edge (x ≈ 155–163) ───────────────────────────────────────────
  bd('bl0',  157, 178, 2.5, T, 7, 30), bd('bl1',  161, 202, 3,   S, 8, 31),
  bd('bl2',  156, 225, 2,   W, 6, 32), bd('bl3',  160, 250, 4.5, T, 7, 33),
  bd('bl4',  156, 274, 2.5, S, 9, 34), bd('bl5',  160, 298, 3,   T, 6, 35),
  bd('bl6',  156, 325, 5,   W, 5, 36), bd('bl7',  160, 348, 2.5, T, 8, 37),
  bd('bl8',  156, 372, 3,   S, 7, 38), bd('bl9',  160, 396, 2,   T, 6, 39),
  bd('bl10', 156, 420, 3.5, W, 9, 40), bd('bl11', 160, 444, 2.5, S, 7, 41),
  bd('bl12', 157, 466, 2,   T, 8, 42),
  // ── Right edge (x ≈ 487–496) ─────────────────────────────────────────
  bd('br0',  489, 178, 2.5, S, 8, 43), bd('br1',  486, 202, 3,   T, 6, 44),
  bd('br2',  490, 225, 2,   W, 7, 45), bd('br3',  486, 250, 4.5, S, 9, 46),
  bd('br4',  490, 274, 2.5, T, 6, 47), bd('br5',  486, 298, 3,   W, 8, 48),
  bd('br6',  490, 325, 5,   T, 5, 49), bd('br7',  486, 348, 2.5, S, 7, 50),
  bd('br8',  490, 372, 3,   T, 8, 51), bd('br9',  486, 396, 2,   W, 6, 52),
  bd('br10', 490, 420, 3.5, S, 9, 53), bd('br11', 486, 444, 2.5, T, 7, 54),
  bd('br12', 490, 466, 2,   W, 8, 55),
]

export function ChaleaHeroOrbit() {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const times = [400, 1000, 1800, 2800]
    const ts = times.map((t, i) => setTimeout(() => setPhase(i + 1), t))
    return () => ts.forEach(clearTimeout)
  }, [])

  return (
    <div
      className="hidden md:block absolute pointer-events-none"
      style={{
        width: 650, height: 650,
        left: '50%', top: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10,
        overflow: 'visible',
      }}
    >
      {/* Water ripple rings */}
      {phase >= 1 && RIPPLES.map(r => (
        <div
          key={r.id}
          style={{
            position:     'absolute',
            width:        340, height: 340,
            left:         CX - 170, top: CY - 170,
            borderRadius: '50%',
            border:       '1.5px solid rgba(82,170,167,0.40)',
            animation:    `ripple-hero 3.8s ease-out ${r.delay} infinite`,
          }}
        />
      ))}

      {/* Border edge dots — aura glow hugging the mascot frame */}
      {phase >= 1 && BORDER_DOTS.map(d => (
        <div
          key={d.id}
          style={{
            position:     'absolute',
            width:        d.size,
            height:       d.size,
            left:         d.x - d.size / 2,
            top:          d.y - d.size / 2,
            borderRadius: '50%',
            background:   d.color,
            boxShadow:    `0 0 ${d.glow}px ${d.color}, 0 0 ${d.glow * 2}px ${d.color.replace('0.90', '0.30').replace('0.94', '0.30')}`,
            animation:    `border-dot-glow ${d.dur}s ease-in-out ${d.delay} infinite`,
          }}
        />
      ))}

      {/* Orbital dot rings — progressive reveal */}
      {RINGS.map((ring, ri) =>
        phase > ri
          ? ring.dots.map(dot => (
              <div
                key={dot.id}
                style={{
                  position:     'absolute',
                  width:        dot.size,
                  height:       dot.size,
                  left:         dot.left,
                  top:          dot.top,
                  borderRadius: '50%',
                  background:   dot.color,
                  boxShadow:    `0 0 ${dot.glow}px ${dot.color}`,
                  animation:    `dot-hero-enter 0.42s cubic-bezier(0.34,1.56,0.64,1) ${dot.delay} both`,
                }}
              />
            ))
          : null
      )}
    </div>
  )
}
