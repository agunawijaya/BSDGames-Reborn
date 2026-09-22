import { useRef, useCallback, useState } from 'react'

export function useSound() {
  const [enabled, setEnabled] = useState(false)
  const ctxRef = useRef<AudioContext | null>(null)

  const ensureCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume()
    }
    return ctxRef.current
  }, [])

  const playTone = useCallback((freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.1) => {
    if (!enabled) return
    const ctx = ensureCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    gain.gain.setValueAtTime(volume, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + duration)
  }, [enabled, ensureCtx])

  const playFlip = useCallback(() => {
    playTone(600, 0.08, 'triangle', 0.05)
  }, [playTone])

  const playClink = useCallback(() => {
    playTone(1200, 0.1, 'sine', 0.08)
    setTimeout(() => playTone(1800, 0.08, 'sine', 0.06), 40)
  }, [playTone])

  const playInvalid = useCallback(() => {
    playTone(150, 0.2, 'sawtooth', 0.05)
  }, [playTone])

  const playWin = useCallback(() => {
    [523, 659, 784, 1047].forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.3, 'sine', 0.1), i * 120)
    })
  }, [playTone])

  return {
    enabled,
    setEnabled,
    playFlip,
    playClink,
    playInvalid,
    playWin,
  }
}
