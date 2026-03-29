import { useState, useEffect, useRef } from 'react'

const TIMER_DURATION_MS = 30000

export default function Timer({
  onExpire,
}: {
  onExpire: () => void
}) {
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION_MS)
  const onExpireRef = useRef(onExpire)
  onExpireRef.current = onExpire

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        const next = prev - 1000
        if (next <= 0) {
          clearInterval(interval)
          setTimeout(() => onExpireRef.current(), 0)
          return 0
        }
        return next
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const seconds = Math.ceil(timeLeft / 1000)
  const fraction = timeLeft / TIMER_DURATION_MS
  const low = fraction < 0.33

  return (
    <div className="timer-container">
      <div className="timer-display" style={{ color: low ? 'var(--error)' : undefined }}>
        {seconds}s
      </div>
      <div className="timer-track">
        <div
          className={`timer-bar ${low ? 'low' : ''}`}
          style={{ width: `${fraction * 100}%` }}
        />
      </div>
    </div>
  )
}
