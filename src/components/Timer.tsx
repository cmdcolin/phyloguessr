import { useState, useEffect, useRef } from 'react'

export default function Timer({
  onExpire,
  duration = 30000,
}: {
  onExpire: () => void
  duration?: number
}) {
  const [timeLeft, setTimeLeft] = useState(duration)
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
  const fraction = timeLeft / duration
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
