import { useState, useEffect } from 'react'

// Free-form glowing constellation that sits BEHIND the transparent mascot.
// No square frame — concentric rings radiating from a center point so it
// works with any artwork shape.

const BOX = 760
const CX = BOX / 2
const CY = BOX / 2

const T = 'rgba(82,170,167,0.92)'   // sage-teal (mascot eyes)
const S = 'rgba(196,194,216,0.90)'  // silver-lavender (robe)
const W = 'rgba(255,255,255,0.95)'  // spark white

function makeRing(
  r: number,
  count: number,
  offsetDeg: number,
  sizes: readonly number[],
  colors: readonly string[],
  delayBase: number,
) {
  return Array.from({ length: count }, (_, i) => {
    const deg = (360 / count) * i + offsetDeg
    const rad = deg * (Math.PI / 180)
    const size = sizes[i % sizes.length]
    // squash vertically a touch so it reads as an orbit, not a flat circle
    const x = CX + r * Math.cos(rad)
    const y = CY + r * 0.92 * Math.sin(rad)
    return {
      id: `o${r}-${i}`,
      x,
      y,
      size,
      color: colors[i % colors.length],
      enterDelay: `${(delayBase + i * 0.045).toFixed(2)}s`,
      glowDur: 4 + (i % 5) * 0.7,
      glowDelay: `${((i * 0.17) % 3.2).toFixed(2)}s`,
      glow: size >= 4 ? 16 : size >= 3 ? 12 : size >= 2 ? 8 : 5,
    }
  })
}

const RINGS = [
  makeRing(208, 18, 0,  [1.5, 3, 2, 4, 2.5, 1.5, 3.5, 2], [W, T, W, S, W, T, W, W], 0.00),
  makeRing(256, 24, 9,  [1, 2, 1.5, 3, 1.5, 2.5, 1, 2],   [W, S, W, T, W, W, S, W], 0.30),
  makeRing(304, 20, 5,  [2, 1, 3.5, 1.5, 2.5, 1, 4, 1.5], [W, W, T, S, W, T, W, W], 0.58),
  makeRing(348, 14, 13, [1.5, 2.5, 1, 3, 1.5, 2, 1],      [W, T, W, S, W, W, T],    0.82),
].flat()

const RIPPLES = [
  { id: 0, delay: '0s' },
  { id: 1, delay: '1.1s' },
  { id: 2, delay: '2.2s' },
  { id: 3, delay: '3.3s' },
]

export function ChaleaHeroOrbit() {
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 350)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      className="hidden md:block absolute pointer-events-none"
      style={{
        width: BOX,
        height: BOX,
        left: '50%',
        top: '82%',
        transform: 'translate(-50%, -50%)',
        zIndex: 0,
        overflow: 'visible',
      }}
    >
      {/* Water ripple rings — soft expanding glow */}
      {revealed &&
        RIPPLES.map(r => (
          <div
            key={r.id}
            style={{
              position: 'absolute',
              width: 300,
              height: 300,
              left: CX - 150,
              top: CY - 150,
              borderRadius: '50%',
              border: '1.5px solid rgba(82,170,167,0.30)',
              animation: `ripple-hero 4.4s ease-out ${r.delay} infinite`,
            }}
          />
        ))}

      {/* Constellation dots — enter once, then breathe forever */}
      {revealed &&
        RINGS.map(d => (
          <div
            key={d.id}
            style={{
              position: 'absolute',
              width: d.size,
              height: d.size,
              left: d.x - d.size / 2,
              top: d.y - d.size / 2,
              borderRadius: '50%',
              background: d.color,
              boxShadow: `0 0 ${d.glow}px ${d.color}, 0 0 ${d.glow * 2}px ${d.color
                .replace('0.92', '0.28')
                .replace('0.90', '0.26')
                .replace('0.95', '0.30')}`,
              animation: `dot-hero-enter 0.5s cubic-bezier(0.34,1.56,0.64,1) ${d.enterDelay} both, border-dot-glow ${d.glowDur}s ease-in-out ${d.glowDelay} infinite`,
            }}
          />
        ))}
    </div>
  )
}
