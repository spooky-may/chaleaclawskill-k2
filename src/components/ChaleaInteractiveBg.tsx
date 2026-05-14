import { useEffect, useRef } from 'react'

// Rising magic dust — deterministic, no Math.random on render
const RISING = [
  { id: 0,  size: 3,   left: 7,  delay: 0,    dur: 18, type: 'teal'   },
  { id: 1,  size: 2,   left: 16, delay: 3.5,  dur: 23, type: 'silver' },
  { id: 2,  size: 4,   left: 25, delay: 6,    dur: 16, type: 'white'  },
  { id: 3,  size: 2.5, left: 33, delay: 1.5,  dur: 21, type: 'teal'   },
  { id: 4,  size: 3.5, left: 44, delay: 8,    dur: 26, type: 'silver' },
  { id: 5,  size: 2,   left: 51, delay: 2.5,  dur: 19, type: 'teal'   },
  { id: 6,  size: 4.5, left: 59, delay: 7,    dur: 24, type: 'white'  },
  { id: 7,  size: 3,   left: 67, delay: 4,    dur: 20, type: 'silver' },
  { id: 8,  size: 2.5, left: 74, delay: 9,    dur: 22, type: 'teal'   },
  { id: 9,  size: 4,   left: 81, delay: 1,    dur: 17, type: 'silver' },
  { id: 10, size: 2,   left: 89, delay: 5.5,  dur: 25, type: 'white'  },
  { id: 11, size: 3,   left: 20, delay: 11,   dur: 20, type: 'teal'   },
  { id: 12, size: 2.5, left: 40, delay: 13,   dur: 18, type: 'silver' },
  { id: 13, size: 3.5, left: 63, delay: 9.5,  dur: 23, type: 'white'  },
  { id: 14, size: 2,   left: 78, delay: 6.5,  dur: 21, type: 'teal'   },
] as const

// Firefly twinklers — float at fixed positions, pulse like spirits
const FIREFLIES = [
  { id: 'f0', size: 3.5, left: 12, top: 28, delay: 0,   dur: 6,  color: 'rgba(82,170,167,0.80)'  },
  { id: 'f1', size: 2.5, left: 38, top: 55, delay: 1.8, dur: 8,  color: 'rgba(196,194,216,0.90)' },
  { id: 'f2', size: 4,   left: 62, top: 18, delay: 3.2, dur: 7,  color: 'rgba(82,170,167,0.70)'  },
  { id: 'f3', size: 2,   left: 80, top: 42, delay: 0.6, dur: 9,  color: 'rgba(196,194,216,0.80)' },
  { id: 'f4', size: 3,   left: 22, top: 72, delay: 4.5, dur: 6,  color: 'rgba(255,255,255,0.85)' },
  { id: 'f5', size: 2.5, left: 55, top: 85, delay: 2.1, dur: 10, color: 'rgba(82,170,167,0.65)'  },
  { id: 'f6', size: 3.5, left: 90, top: 20, delay: 5.8, dur: 7,  color: 'rgba(196,194,216,0.75)' },
  { id: 'f7', size: 2,   left: 48, top: 35, delay: 1.2, dur: 8,  color: 'rgba(255,255,255,0.80)' },
] as const

// Shimmer rings — concentric expanding circles (anime magic circle hint)
const RINGS = [
  { id: 'r0', size: 180, left: '8%',  top: '12%', color: '#52aaa7', delay: 0,   dur: 7  },
  { id: 'r1', size: 140, left: '85%', top: '65%', color: '#c4c2d8', delay: 3.5, dur: 9  },
  { id: 'r2', size: 220, left: '50%', top: '40%', color: '#84cbc9', delay: 6.5, dur: 11 },
] as const

export function ChaleaInteractiveBg() {
  const spotRef   = useRef<HTMLDivElement>(null)
  const tealRef   = useRef<HTMLDivElement>(null)
  const silverRef = useRef<HTMLDivElement>(null)

  const rafRef    = useRef<number>(0)
  const mouseRef  = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  const spotPos   = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  const orbPos    = useRef({ x: 0, y: 0 })
  const orbTarget = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
      orbTarget.current = {
        x: (e.clientX / window.innerWidth  - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      }
    }

    const tick = () => {
      // Spotlight — snappy follow (magnetised feel)
      spotPos.current.x += (mouseRef.current.x - spotPos.current.x) * 0.10
      spotPos.current.y += (mouseRef.current.y - spotPos.current.y) * 0.10
      if (spotRef.current) {
        spotRef.current.style.transform =
          `translate(${spotPos.current.x - 350}px, ${spotPos.current.y - 350}px)`
      }

      // Ambient orbs — slow dreamy parallax
      orbPos.current.x += (orbTarget.current.x - orbPos.current.x) * 0.028
      orbPos.current.y += (orbTarget.current.y - orbPos.current.y) * 0.028
      if (tealRef.current) {
        tealRef.current.style.transform =
          `translate(${orbPos.current.x * 40}px, ${orbPos.current.y * 26}px)`
      }
      if (silverRef.current) {
        silverRef.current.style.transform =
          `translate(${-orbPos.current.x * 28}px, ${-orbPos.current.y * 20}px)`
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0, overflow: 'hidden' }}>

      {/* ── Mouse spotlight: sage-teal aura trails cursor ────────────── */}
      <div
        ref={spotRef}
        style={{
          position: 'absolute', top: 0, left: 0,
          width: 700, height: 700,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(82,170,167,0.11) 0%, rgba(82,170,167,0.04) 45%, transparent 70%)',
          filter: 'blur(24px)',
          willChange: 'transform',
        }}
      />

      {/* ── Teal orb: mascot eye-color energy — top-left, parallax ─── */}
      <div
        ref={tealRef}
        style={{
          position: 'absolute',
          width: 580, height: 380,
          top: -110, left: -90,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(82,170,167,0.26) 0%, rgba(132,203,201,0.10) 50%, transparent 72%)',
          filter: 'blur(64px)',
          willChange: 'transform',
        }}
      />

      {/* ── Silver orb: mascot robe energy — bottom-right, counter-parallax */}
      <div
        ref={silverRef}
        style={{
          position: 'absolute',
          width: 500, height: 320,
          bottom: '3%', right: -70,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(196,194,216,0.28) 0%, rgba(180,176,210,0.09) 50%, transparent 72%)',
          filter: 'blur(64px)',
          willChange: 'transform',
        }}
      />

      {/* ── Mid-page breathing orb — gentle pulse ────────────────────── */}
      <div
        style={{
          position: 'absolute',
          width: 360, height: 240,
          top: '38%', left: '48%',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(196,194,216,0.14) 0%, rgba(82,170,167,0.06) 55%, transparent 75%)',
          filter: 'blur(56px)',
          animation: 'orb-drift 36s ease-in-out infinite alternate',
        }}
      />

      {/* ── Light wave sweep — soft horizontal band (replaces harsh scan) */}
      <div
        style={{
          position: 'absolute', left: 0, width: '100%', height: 60,
          background: 'linear-gradient(180deg, transparent 0%, rgba(82,170,167,0.055) 50%, transparent 100%)',
          filter: 'blur(12px)',
          animation: 'wave-light 18s linear infinite',
        }}
      />
      {/* Second wave, offset phase */}
      <div
        style={{
          position: 'absolute', left: 0, width: '100%', height: 40,
          background: 'linear-gradient(180deg, transparent 0%, rgba(196,194,216,0.05) 50%, transparent 100%)',
          filter: 'blur(8px)',
          animation: 'wave-light 26s linear infinite',
          animationDelay: '-11s',
        }}
      />

      {/* ── Magic shimmer rings — anime spell-circle hints ──────────── */}
      {RINGS.map(r => (
        <div
          key={r.id}
          style={{
            position: 'absolute',
            width: r.size, height: r.size,
            left: r.left, top: r.top,
            marginLeft: -r.size / 2, marginTop: -r.size / 2,
            borderRadius: '50%',
            border: `1px solid ${r.color}`,
            opacity: 0,
            animation: `ring-expand ${r.dur}s ease-out infinite`,
            animationDelay: `${r.delay}s`,
          }}
        />
      ))}

      {/* ── Firefly twinklers — spirit lights at fixed positions ─────── */}
      {FIREFLIES.map(f => (
        <div
          key={f.id}
          style={{
            position: 'absolute',
            width: f.size, height: f.size,
            left: `${f.left}%`, top: `${f.top}%`,
            borderRadius: '50%',
            background: f.color,
            boxShadow: `0 0 ${f.size * 3}px ${f.color}`,
            animation: `twinkle ${f.dur}s ease-in-out infinite`,
            animationDelay: `${f.delay}s`,
          }}
        />
      ))}

      {/* ── Rising magic dust — particles float up from bottom ───────── */}
      {RISING.map(p => (
        <div
          key={p.id}
          className={`chalea-particle chalea-particle-${p.type}`}
          style={{
            width:  p.size,
            height: p.size,
            left:   `${p.left}%`,
            animationDelay:    `${p.delay}s`,
            animationDuration: `${p.dur}s`,
          }}
        />
      ))}
    </div>
  )
}
