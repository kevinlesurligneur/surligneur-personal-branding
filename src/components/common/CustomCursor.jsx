import { useEffect, useRef, useState } from 'react'

/**
 * Curseur surligneur — traîné lumineuse cyan sur canvas + dot glowing.
 * Actif uniquement sur desktop (pointer: fine).
 * Cache le curseur OS et le remplace par un dot + trail de surligneur.
 */
export function CustomCursor() {
  const canvasRef = useRef(null)
  const dotRef   = useRef(null)
  const active   = useRef(false)

  useEffect(() => {
    // Uniquement sur devices avec souris précise
    if (!window.matchMedia('(pointer: fine)').matches) return

    active.current = true
    const canvas = canvasRef.current
    const dot    = dotRef.current
    if (!canvas || !dot) return

    const ctx = canvas.getContext('2d')
    let points = []
    let animId

    // Cache le curseur OS
    const style = document.createElement('style')
    style.id = 'custom-cursor-hide'
    style.textContent = '*, *::before, *::after { cursor: none !important; }'
    document.head.appendChild(style)

    function resize() {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()

    function onMove(e) {
      const x = e.clientX, y = e.clientY

      // Déplace le dot exactement sur le curseur
      dot.style.transform = `translate(${x - 5}px, ${y - 5}px)`
      dot.style.opacity   = '1'

      points.push({ x, y, t: Date.now() })
    }

    function onLeave() {
      dot.style.opacity = '0'
    }
    function onEnter() {
      dot.style.opacity = '1'
    }

    const TRAIL_MS = 550

    function draw() {
      const now = Date.now()
      points = points.filter(p => now - p.t < TRAIL_MS)

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (points.length >= 2) {
        for (let i = 1; i < points.length; i++) {
          const p0  = points[i - 1]
          const p1  = points[i]
          const age = now - p1.t
          const t   = 1 - age / TRAIL_MS           // 1 = frais, 0 = vieux
          const opacity = t * 0.48
          const width   = 4 + t * 12               // épaisseur qui réduit en vieillissant

          ctx.beginPath()
          ctx.moveTo(p0.x, p0.y)
          ctx.lineTo(p1.x, p1.y)
          ctx.lineWidth   = width
          ctx.lineCap     = 'round'
          ctx.lineJoin    = 'round'
          ctx.strokeStyle = `rgba(0, 212, 245, ${opacity})`
          ctx.stroke()
        }
      }

      animId = requestAnimationFrame(draw)
    }

    window.addEventListener('mousemove',  onMove,   { passive: true })
    window.addEventListener('mouseleave', onLeave)
    window.addEventListener('mouseenter', onEnter)
    window.addEventListener('resize',     resize)
    animId = requestAnimationFrame(draw)

    return () => {
      active.current = false
      window.removeEventListener('mousemove',  onMove)
      window.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('mouseenter', onEnter)
      window.removeEventListener('resize',     resize)
      cancelAnimationFrame(animId)
      const el = document.getElementById('custom-cursor-hide')
      if (el) el.remove()
    }
  }, [])

  return (
    <>
      {/* Trail canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed', inset: 0,
          pointerEvents: 'none',
          zIndex: 9997,
        }}
      />
      {/* Dot glowing */}
      <div
        ref={dotRef}
        style={{
          position:  'fixed',
          top: 0, left: 0,
          width: 10, height: 10,
          borderRadius: '50%',
          background: '#00d4f5',
          boxShadow: '0 0 8px rgba(0,212,245,0.9), 0 0 20px rgba(0,212,245,0.4)',
          pointerEvents: 'none',
          zIndex: 9999,
          opacity: 0,
          transition: 'opacity 0.2s',
          willChange: 'transform',
        }}
      />
    </>
  )
}
