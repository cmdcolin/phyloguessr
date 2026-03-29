import { useEffect, useRef, useState } from 'react'

import OnlinePlayers from './OnlinePlayers.tsx'
import TreeIcon from './TreeIcon.tsx'
import { getCurrentUser, signOut } from '../firebase.ts'
import styles from './Header.module.css'

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
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <TreeIcon size={26} />
        <h1>
          <a className={styles.homeBtn} href="/">
            PhyloGuessr
          </a>
        </h1>
      </div>
      <div className={styles.headerAnimals} aria-hidden="true">
        <img
          className={`${styles.headerAnimal} ${styles.animalPlatypus}`}
          src="https://images.phylopic.org/images/61932f57-1fd2-49d9-bb86-042d6005581a/thumbnail/128x128.png"
          alt=""
        />
        <img
          className={`${styles.headerAnimal} ${styles.animalAardvark}`}
          src="https://images.phylopic.org/images/cfee2dca-3767-46b8-8d03-bd8f46e79e9e/thumbnail/128x128.png"
          alt=""
        />
        <img
          className={`${styles.headerAnimal} ${styles.animalOctopus}`}
          src="https://images.phylopic.org/images/f400b519-3564-4183-b4bd-c3b922cc7c5e/thumbnail/128x128.png"
          alt=""
        />
        <img
          className={`${styles.headerAnimal} ${styles.animalHippo}`}
          src="https://images.phylopic.org/images/3769e205-b10c-4aab-affc-b4f0302f4eaa/thumbnail/128x128.png"
          alt=""
        />
        <img
          className={`${styles.headerAnimal} ${styles.animalAxolotl}`}
          src="https://images.phylopic.org/images/575eaa51-6c9b-4d36-9881-b8463c68ebbc/thumbnail/128x128.png"
          alt=""
        />
        <img
          className={`${styles.headerAnimal} ${styles.animalHorseshoecrab}`}
          src="https://images.phylopic.org/images/38c82deb-b187-4e85-a9f8-dba2794b42d0/thumbnail/128x128.png"
          alt=""
        />
      </div>
      <div className={styles.headerRight}>
        <OnlinePlayers />
        <div className={styles.hamburgerWrapper} ref={menuRef}>
          <button
            className={styles.hamburgerBtn}
            title="Menu"
            onClick={() => setShowMenu(s => !s)}
            aria-label="Menu"
          >
            <span className={styles.hamburgerIcon} />
            <span className={styles.hamburgerIcon} />
            <span className={styles.hamburgerIcon} />
          </button>
          {showMenu && (
            <div className={styles.hamburgerDropdown}>
              <a className={styles.hamburgerItem} href="/about">
                About
              </a>
              <a className={styles.hamburgerItem} href="/why">
                Why
              </a>
              <a className={styles.hamburgerItem} href="/donate">
                Donate
              </a>
              <a className={styles.hamburgerItem} href="/privacy">
                Privacy
              </a>
              <div className={styles.hamburgerDivider} />
              {signedIn ? (
                <>
                  <a className={styles.hamburgerItem} href="/login">
                    Account settings
                  </a>
                  <button
                    className={styles.hamburgerItem}
                    onClick={async () => {
                      await signOut()
                      setSignedIn(false)
                      setNickname(null)
                      setShowMenu(false)
                    }}
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <a className={styles.hamburgerItem} href="/login">
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
