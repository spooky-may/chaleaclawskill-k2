import { useEffect, useState } from 'react'

// --- Orbital dot constellation — non-uniform angles for organic density variation ---
// Frame is w-28 h-28 = 112px. Center at (56, 56).
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
      id:    `r${r}-${i}`,
      left:  56 + r * Math.cos(rad) - size / 2,
      top:   56 + r * Math.sin(rad) - size / 2,
      size,
      color: colors[i % colors.length],
      delay: `${(delayBase + i * 0.085).toFixed(2)}s`,
      glow:  size >= 3.5 ? 7 : size >= 2.5 ? 5 : 3,
    }
  })
}

const T = 'rgba(82,170,167,0.88)'     // teal
const S = 'rgba(196,194,216,0.88)'    // silver
const W = 'rgba(255,255,255,0.92)'    // white

// Non-uniform angles — clusters create density variation instead of mechanical rings
// Inner r=76: dense top-right arc, sparse bottom-left
const A1 = [3, 18, 36, 54, 76, 100, 128, 162, 198, 232, 268, 302, 326, 348] as const
// Mid r=106: two dense clusters (top, bottom-left), gaps on right
const A2 = [8, 22, 40, 58, 74, 90, 110, 130, 152, 170, 188, 208, 225, 244, 260, 278, 298, 318, 338, 354] as const
// Outer r=134: sparse, mixed large/small for depth
const A3 = [6, 28, 55, 82, 118, 162, 200, 234, 268, 298, 326, 350] as const
// Far accent r=158: 7 sparse glints
const A4 = [32, 86, 142, 188, 244, 300, 352] as const

const ORBITAL_DOTS = [
  ...makeDots(76,  A1, [1.5, 2.5, 1.5, 3.5, 2, 1, 3, 1.5, 2.5, 1, 4, 2, 1.5, 3],   [T,S,T,W,S,T,T,S,W,T,S,T,T,W],           0),
  ...makeDots(106, A2, [1, 2, 1.5, 2.5, 1, 1.5, 2, 1, 3, 1.5, 2, 1, 2.5, 1.5, 1, 2, 1.5, 4, 1, 2], [S,T,W,S,T,W,T,S,T,W,S,T,W,T,S,W,T,S,T,W], 0.25),
  ...makeDots(134, A3, [2, 1, 3.5, 1.5, 2.5, 1, 5, 2, 1.5, 3.5, 1.5, 2.5],           [T,W,T,S,T,W,S,T,W,T,S,T],                0.50),
  ...makeDots(158, A4, [1.5, 2.5, 1, 3, 1.5, 2, 1],                                   [S,T,W,T,S,W,T],                           0.72),
]

interface ChaleaSplashProps {
  onDone: () => void
}

export function ChaleaSplash({ onDone }: ChaleaSplashProps) {
  const [phase, setPhase] = useState<'in' | 'hold' | 'out'>('in')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hold'), 400)
    const t2 = setTimeout(() => setPhase('out'), 2400)
    const t3 = setTimeout(onDone, 2900)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onDone])

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#f3f4f7] dot-grid"
      style={{
        opacity: phase === 'out' ? 0 : 1,
        transition: phase === 'out' ? 'opacity 0.5s cubic-bezier(0.4,0,0.2,1)' : 'opacity 0.35s ease',
        pointerEvents: phase === 'out' ? 'none' : 'all',
      }}
    >
      {/* Ambient glow behind mascot */}
      <div
        className="absolute rounded-full"
        style={{
          width: 400, height: 400,
          background: 'radial-gradient(ellipse, rgba(82,170,167,0.17) 0%, rgba(196,194,216,0.09) 50%, transparent 72%)',
          filter: 'blur(52px)',
          transform: phase === 'hold' ? 'scale(1.14)' : 'scale(0.88)',
          transition: 'transform 2s cubic-bezier(0.16,1,0.3,1)',
        }}
      />

      {/* Mascot frame — orbital dot ring radiates from here */}
      <div
        className="relative mb-8"
        style={{
          opacity:   phase === 'in' ? 0 : 1,
          transform: phase === 'in' ? 'translateY(18px) scale(0.90)' : 'translateY(0) scale(1)',
          transition: 'opacity 0.55s ease, transform 0.55s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {/* Layered border ring */}
        <div className="absolute -inset-[3px] rounded-[14px] bg-gradient-to-br from-sky-300/50 via-[#c4c2d8]/60 to-sky-400/40" />
        <div className="absolute inset-[1px] rounded-[12px] bg-[#f3f4f7]" />
        <img
          src="/mascot.jpeg"
          alt="Chalea"
          className="relative w-28 h-28 object-cover object-top rounded-[11px]"
          style={{ boxShadow: '0 8px 32px rgba(82,170,167,0.22), 0 2px 8px rgba(0,0,0,0.06)' }}
        />

        {/* === Orbital dot constellation (38 dots across 3 rings) === */}
        {ORBITAL_DOTS.map(dot => (
          <div
            key={dot.id}
            className="absolute rounded-full"
            style={{
              width:  dot.size,
              height: dot.size,
              left:   dot.left,
              top:    dot.top,
              background:  dot.color,
              boxShadow:   `0 0 ${dot.glow}px ${dot.color}`,
              opacity:     phase === 'hold' ? 1 : 0,
              transform:   phase === 'hold' ? 'scale(1)' : 'scale(0)',
              transition:  `opacity 0.38s ease ${dot.delay}, transform 0.38s cubic-bezier(0.34,1.56,0.64,1) ${dot.delay}`,
            }}
          />
        ))}
      </div>

      {/* Wordmark */}
      <div
        className="text-center"
        style={{
          opacity:   phase === 'in' ? 0 : 1,
          transform: phase === 'in' ? 'translateY(10px)' : 'translateY(0)',
          transition: 'opacity 0.5s ease 0.15s, transform 0.5s cubic-bezier(0.16,1,0.3,1) 0.15s',
        }}
      >
        <div className="text-2xl font-semibold tracking-tight text-[#09090b]">
          Chalea
          <span className="text-[#52aaa7] ml-1">Clawskill</span>
        </div>
        <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-[#71717a] font-medium">
          OpenClaw Skills Directory
        </div>
      </div>

      {/* Progress bar */}
      <div
        className="mt-10 w-40 h-[2px] rounded-full bg-black/6 overflow-hidden"
        style={{
          opacity:   phase === 'in' ? 0 : 1,
          transition: 'opacity 0.4s ease 0.3s',
        }}
      >
        <div
          className="h-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, #52aaa7, #84cbc9, #c4c2d8)',
            width: phase === 'out' ? '100%' : phase === 'hold' ? '82%' : '0%',
            transition: phase === 'hold'
              ? 'width 1.8s cubic-bezier(0.4,0,0.2,1)'
              : phase === 'out'
              ? 'width 0.4s ease'
              : 'none',
          }}
        />
      </div>

      {/* Corner shimmer rings — anime spell-circle hints */}
      {[
        { top: 0,    right: 0,  size: 260, color: '#52aaa7', delay: 0,   dur: 8  },
        { bottom: 0, left: 0,   size: 200, color: '#c4c2d8', delay: 3.5, dur: 10 },
        { top: '40%', left: '10%', size: 140, color: '#84cbc9', delay: 1.5, dur: 7 },
      ].map((ring, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: ring.size, height: ring.size,
            borderRadius: '50%',
            border: `1px solid ${ring.color}`,
            top: 'top' in ring ? ring.top : 'auto',
            right: 'right' in ring ? ring.right : 'auto',
            bottom: 'bottom' in ring ? ring.bottom : 'auto',
            left: 'left' in ring ? ring.left : 'auto',
            opacity: 0,
            animation: phase === 'hold'
              ? `ring-expand ${ring.dur}s ease-out infinite`
              : 'none',
            animationDelay: `${ring.delay}s`,
            pointerEvents: 'none',
          }}
        />
      ))}
    </div>
  )
}
