import { useEffect, useState } from "react"
import { getOnlineCount } from "../firebase.ts"

export default function OnlinePlayers() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const poll = () => {
      getOnlineCount().then(setCount).catch(console.error)
    }
    poll()
    const id = setInterval(poll, 30_000)
    return () => clearInterval(id)
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
