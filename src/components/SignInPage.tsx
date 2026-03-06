import { useEffect, useState } from "react"
import {
  getCurrentUser,
  isNameTaken,
  signInWithGoogle,
  signOut,
} from "../firebase.ts"

export default function SignInPage() {
  const [mounted, setMounted] = useState(false)
  const [signedIn, setSignedIn] = useState(false)
  const [googleName, setGoogleName] = useState<string | null>(null)
  const [signingIn, setSigningIn] = useState(false)
  const [error, setError] = useState("")
  const [nickname, setNickname] = useState("")
  const [nicknameSaved, setNicknameSaved] = useState(false)
  const [nameError, setNameError] = useState("")
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("phyloLeaderboardName") ?? ""
    setNickname(saved)
    setNicknameSaved(!!saved)
    setMounted(true)
    getCurrentUser().then((user) => {
      if (user) {
        setSignedIn(true)
        if (user.displayName) {
          setGoogleName(user.displayName)
        }
      }
    })
  }, [])

  const handleSaveNickname = async () => {
    const trimmed = nickname.trim()
    if (!trimmed || trimmed.length > 20) {
      return
    }
    setNameError("")
    setChecking(true)
    try {
      const taken = await isNameTaken(trimmed)
      if (taken) {
        setNameError("That name is already taken")
      } else {
        localStorage.setItem("phyloLeaderboardName", trimmed)
        window.dispatchEvent(new Event("nickname-changed"))
        setNicknameSaved(true)
      }
    } catch {
      setNameError("Could not check name availability")
    }
    setChecking(false)
  }

  const handleSignIn = async () => {
    setSigningIn(true)
    setError("")
    try {
      const user = await signInWithGoogle()
      setSignedIn(true)
      if (user.displayName) {
        setGoogleName(user.displayName)
      }
    } catch (err) {
      console.error(err)
      setError("Sign-in failed. Please try again.")
    }
    setSigningIn(false)
  }

  const handleSignOut = async () => {
    await signOut()
    setSignedIn(false)
    setGoogleName(null)
  }

  if (!mounted) {
    return <div className="loading">Loading...</div>
  }

  if (signedIn) {
    return (
      <div className="signin-status">
        <p className="signin-success">
          Signed in with Google{googleName ? ` (${googleName})` : ""}
        </p>
        <p className="signin-detail">
          Your scores are linked to your Google account. You can play on
          different devices and your leaderboard entry will stay connected.
        </p>
        <p>
          Leaderboard nickname: <strong>{nickname || "not set"}</strong>
          {" \u2014 "}
          <button
            className="leaderboard-change-btn"
            onClick={() => setNicknameSaved(false)}
          >
            change
          </button>
        </p>
        {!nicknameSaved && (
          <div className="signin-nickname-form">
            <input
              type="text"
              className="leaderboard-name-input"
              placeholder="Choose a nickname (max 20 chars)"
              maxLength={20}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSaveNickname()
                }
              }}
            />
            <button
              className="leaderboard-submit-btn"
              disabled={!nickname.trim() || checking}
              onClick={handleSaveNickname}
            >
              {checking ? "Checking..." : "Save"}
            </button>
            {nameError && <p className="signin-error">{nameError}</p>}
          </div>
        )}
        <div className="signin-actions">
          <a className="btn btn-primary" href={import.meta.env.BASE_URL}>
            Play
          </a>
          <button className="btn btn-secondary" onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="signin-prompt">
      <h3>Sign in with Google</h3>
      <p>
        Sign in to save your scores to the leaderboard. Your scores will
        persist across devices and browsers.
      </p>
      {error && <p className="signin-error">{error}</p>}
      <div className="signin-actions">
        <button
          className="btn btn-primary"
          disabled={signingIn}
          onClick={handleSignIn}
        >
          {signingIn ? "Signing in..." : "Sign in with Google"}
        </button>
        <a className="btn btn-secondary" href={import.meta.env.BASE_URL}>
          Back to game
        </a>
      </div>
    </div>
  )
}
