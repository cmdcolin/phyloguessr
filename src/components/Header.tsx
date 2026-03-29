import { useEffect, useRef, useState } from 'react'

import OnlinePlayers from './OnlinePlayers.tsx'
import TreeIcon from './TreeIcon.tsx'
import { getCurrentUser, signOut } from '../firebase.ts'

export default function Header() {
  const [showMenu, setShowMenu] = useState(false)
  const [signedIn, setSignedIn] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    getCurrentUser().then(user => {
      setSignedIn(user !== null)
    })
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
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showMenu])

  return (
    <header className="site-header">
      <div className="site-header-left">
        <TreeIcon size={26} />
        <h1>
          <a className="site-home-btn" href="/">
            PhyloGuessr
          </a>
        </h1>
      </div>
      <div className="site-header-animals" aria-hidden="true">
        <img
          className="site-header-animal site-animal-platypus"
          src="https://images.phylopic.org/images/61932f57-1fd2-49d9-bb86-042d6005581a/thumbnail/128x128.png"
          alt=""
        />
        <img
          className="site-header-animal site-animal-aardvark"
          src="https://images.phylopic.org/images/cfee2dca-3767-46b8-8d03-bd8f46e79e9e/thumbnail/128x128.png"
          alt=""
        />
        <img
          className="site-header-animal site-animal-octopus"
          src="https://images.phylopic.org/images/f400b519-3564-4183-b4bd-c3b922cc7c5e/thumbnail/128x128.png"
          alt=""
        />
        <img
          className="site-header-animal site-animal-hippo"
          src="https://images.phylopic.org/images/3769e205-b10c-4aab-affc-b4f0302f4eaa/thumbnail/128x128.png"
          alt=""
        />
        <img
          className="site-header-animal site-animal-axolotl"
          src="https://images.phylopic.org/images/575eaa51-6c9b-4d36-9881-b8463c68ebbc/thumbnail/128x128.png"
          alt=""
        />
        <img
          className="site-header-animal site-animal-horseshoecrab"
          src="https://images.phylopic.org/images/38c82deb-b187-4e85-a9f8-dba2794b42d0/thumbnail/128x128.png"
          alt=""
        />
      </div>
      <div className="site-header-right">
        <OnlinePlayers />
        <div className="site-hamburger-wrapper" ref={menuRef}>
          <button
            className="site-hamburger-btn"
            title="Menu"
            onClick={() => setShowMenu(s => !s)}
            aria-label="Menu"
          >
            <span className="site-hamburger-icon" />
            <span className="site-hamburger-icon" />
            <span className="site-hamburger-icon" />
          </button>
          {showMenu && (
            <div className="site-hamburger-dropdown">
              <a className="site-hamburger-item" href="/about">
                About
              </a>
              <a className="site-hamburger-item" href="/why">
                Why
              </a>
              <a className="site-hamburger-item" href="/donate">
                Donate
              </a>
              <a className="site-hamburger-item" href="/privacy">
                Privacy
              </a>
              <div className="site-hamburger-divider" />
              {signedIn ? (
                <>
                  <a className="site-hamburger-item" href="/login">
                    Account settings
                  </a>
                  <button
                    className="site-hamburger-item"
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
                <a className="site-hamburger-item" href="/login">
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
