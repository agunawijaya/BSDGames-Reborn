import { useState, useRef, useEffect } from 'react'

export interface CommandBarProps {
  onCommand: (text: string) => { error?: string }
}

export function CommandBar({ onCommand }: CommandBarProps) {
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '/') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const result = onCommand(text)
    if (result.error) {
      setError(result.error)
    } else {
      setError('')
      setText('')
    }
  }

  return (
    <div className="panel">
      <h3>Command</h3>
      <form onSubmit={submit} className="command-bar">
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="s1, tf, ht, c, b, q..."
          aria-label="Command input"
        />
        <button type="submit">Go</button>
      </form>
      {error && <div style={{ color: '#ff9999', fontSize: '0.85rem', marginTop: '0.25rem' }}>{error}</div>}
      <div className="command-hint">
        s1–s4 · sf · t1–t4 · tf · 12–43 · 1f–4f · ht · c · b · q
      </div>
    </div>
  )
}
