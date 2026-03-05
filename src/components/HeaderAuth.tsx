import { useEffect, useRef, useState } from "react"
import { getCurrentUser, signOut } from "../firebase.ts"

export default function HeaderAuth() {
  const [isAnonymous, setIsAnonymous] = useState(true)
  const [nickname, setNickname] = useState<string | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem("phyloLeaderboardName")
    if (saved) {
      setNickname(saved)
    }
    getCurrentUser().then((user) => {
      setIsAnonymous(user.isAnonymous)
    })
    const onNicknameChanged = () => {
      setNickname(localStorage.getItem("phyloLeaderboardName"))
    }
    window.addEventListener("nickname-changed", onNicknameChanged)
    return () => window.removeEventListener("nickname-changed", onNicknameChanged)
  }, [])

  useEffect(() => {
    if (!showDropdown) {
      return
    }
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showDropdown])

  if (isAnonymous && !nickname) {
    return (
      <a
        className="header-signin-btn"
        href={`${import.meta.env.BASE_URL}login`}
      >
        Sign in
      </a>
    )
  }

  if (isAnonymous && nickname) {
    return (
      <a
        className="header-signed-in"
        href={`${import.meta.env.BASE_URL}login`}
      >
        {nickname}
      </a>
    )
  }

  return (
    <div className="header-user-menu" ref={menuRef}>
      <button
        className="header-user-btn"
        onClick={() => setShowDropdown((s) => !s)}
      >
        {nickname ?? "Account"}
      </button>
      {showDropdown && (
        <div className="header-user-dropdown">
          <a
            className="header-dropdown-item"
            href={`${import.meta.env.BASE_URL}login`}
          >
            Account settings
          </a>
          <button
            className="header-dropdown-item"
            onClick={async () => {
              await signOut()
              setIsAnonymous(true)
              setShowDropdown(false)
            }}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}
