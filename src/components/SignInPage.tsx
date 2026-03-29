import { useEffect, useState } from 'react'

import { getCurrentUser, signInWithGoogle, signOut } from '../firebase.ts'

export default function SignInPage() {
  const [signedIn, setSignedIn] = useState(false)
  const [googleName, setGoogleName] = useState<string | null>(null)
  const [signingIn, setSigningIn] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getCurrentUser().then(user => {
      if (user) {
        setSignedIn(true)
        if (user.displayName) {
          setGoogleName(user.displayName)
        }
      }
    })
  }, [])

  const handleSignIn = async () => {
    setSigningIn(true)
    setError('')
    try {
      const user = await signInWithGoogle()
      setSignedIn(true)
      if (user.displayName) {
        setGoogleName(user.displayName)
      }
    } catch (err) {
      console.error(err)
      setError('Sign-in failed. Please try again.')
    }
    setSigningIn(false)
  }

  const handleSignOut = async () => {
    await signOut()
    setSignedIn(false)
    setGoogleName(null)
  }

  if (signedIn) {
    return (
      <div className="signin-status">
        <p className="signin-success">
          Signed in with Google{googleName ? ` (${googleName})` : ''}
        </p>
        <div className="signin-actions">
          <a className="btn btn-primary" href="/">
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
      <h3>Sign in</h3>
      <p>Sign in with Google to be counted among online players.</p>
      {error && <p className="signin-error">{error}</p>}
      <div className="signin-actions">
        <button
          className="btn btn-primary"
          disabled={signingIn}
          onClick={handleSignIn}
        >
          {signingIn ? 'Signing in...' : 'Sign in with Google'}
        </button>
        <a className="btn btn-secondary" href="/">
          Back to game
        </a>
      </div>
    </div>
  )
}
