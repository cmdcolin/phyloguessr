import { useEffect, useState } from 'react'

import { getOnlineCount, startPresence } from '../firebase.ts'

export default function OnlinePlayers() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let id: ReturnType<typeof setInterval> | undefined
    const poll = () => {
      getOnlineCount().then(setCount).catch(console.error)
    }
    void startPresence().then(() => {
      poll()
      id = setInterval(poll, 30_000)
    })
    return () => {
      clearInterval(id)
    }
  }, [])

  if (count === 0) {
    return null
  }

  return (
    <span className="online-counter" title="Signed-in players online now">
      <span className="online-dot" />
      {count} online
    </span>
  )
}
