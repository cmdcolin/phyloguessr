import { useEffect, useRef, useState } from "react"
import OnlinePlayers from "./OnlinePlayers.tsx"
import TreeIcon from "./TreeIcon.tsx"
import { getCurrentUser, signOut } from "../firebase.ts"

export default function Header() {
  const [showMenu, setShowMenu] = useState(false)
  const [signedIn, setSignedIn] = useState(false)
  const [nickname, setNickname] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setNickname(localStorage.getItem("phyloLeaderboardName"))
    getCurrentUser().then((user) => {
      setSignedIn(user !== null)
    })
    const onNicknameChanged = () => {
      setNickname(localStorage.getItem("phyloLeaderboardName"))
    }
    window.addEventListener("nickname-changed", onNicknameChanged)
    return () => window.removeEventListener("nickname-changed", onNicknameChanged)
  }, [])

  useEffect(() => {
    if (!showMenu) {
      return
    }
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showMenu])

  return (
    <header className="game-header">
      <div className="header-left">
        <TreeIcon size={26} />
        <h1>
          <a className="home-btn" href={import.meta.env.BASE_URL}>
            PhyloGuessr
          </a>
        </h1>
      </div>
      <div className="header-animals" aria-hidden="true">
        <img
          className="header-animal animal-platypus"
          src="https://images.phylopic.org/images/61932f57-1fd2-49d9-bb86-042d6005581a/thumbnail/128x128.png"
          alt=""
        />
        <img
          className="header-animal animal-aardvark"
          src="https://images.phylopic.org/images/cfee2dca-3767-46b8-8d03-bd8f46e79e9e/thumbnail/128x128.png"
          alt=""
        />
        <img
          className="header-animal animal-octopus"
          src="https://images.phylopic.org/images/f400b519-3564-4183-b4bd-c3b922cc7c5e/thumbnail/128x128.png"
          alt=""
        />
        <img
          className="header-animal animal-hippo"
          src="https://images.phylopic.org/images/3769e205-b10c-4aab-affc-b4f0302f4eaa/thumbnail/128x128.png"
          alt=""
        />
        <img
          className="header-animal animal-axolotl"
          src="https://images.phylopic.org/images/575eaa51-6c9b-4d36-9881-b8463c68ebbc/thumbnail/128x128.png"
          alt=""
        />
        <img
          className="header-animal animal-horseshoecrab"
          src="https://images.phylopic.org/images/38c82deb-b187-4e85-a9f8-dba2794b42d0/thumbnail/128x128.png"
          alt=""
        />
      </div>
      <div className="header-right">
        {nickname && <span className="header-nickname">{nickname}</span>}
        <OnlinePlayers />
        <div className="hamburger-wrapper" ref={menuRef}>
          <button
            className="hamburger-btn"
            title="Menu"
            onClick={() => setShowMenu((s) => !s)}
            aria-label="Menu"
          >
            <span className="hamburger-icon" />
            <span className="hamburger-icon" />
            <span className="hamburger-icon" />
          </button>
          {showMenu && (
            <div className="hamburger-dropdown">
              <a
                className="hamburger-item"
                href={`${import.meta.env.BASE_URL}leaderboard`}
              >
                Leaderboard
              </a>
              <a
                className="hamburger-item"
                href={`${import.meta.env.BASE_URL}history`}
              >
                History
              </a>
              <a
                className="hamburger-item"
                href={`${import.meta.env.BASE_URL}about`}
              >
                About
              </a>
              <div className="hamburger-divider" />
              {signedIn ? (
                <>
                  <a
                    className="hamburger-item"
                    href={`${import.meta.env.BASE_URL}login`}
                  >
                    Account settings
                  </a>
                  <button
                    className="hamburger-item"
                    onClick={async () => {
                      await signOut()
                      setSignedIn(false)
                      setShowMenu(false)
                    }}
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <a
                  className="hamburger-item"
                  href={`${import.meta.env.BASE_URL}login`}
                >
                  Sign in
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
