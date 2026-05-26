import { useEffect, useLayoutEffect, useRef, useState } from 'react'

export default function Timer({
  onExpire,
  duration = 30000,
}: {
  onExpire: () => void
  duration?: number
}) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const onExpireRef = useRef(onExpire)
  useLayoutEffect(() => {
    onExpireRef.current = onExpire
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpireRef.current()
    }
  }, [timeLeft])

  const seconds = Math.ceil(timeLeft / 1000)
  const fraction = timeLeft / duration
  const low = fraction < 0.33

  return (
    <div className="timer-container">
      <div
        className="timer-display"
        style={{ color: low ? 'var(--error)' : undefined }}
      >
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
