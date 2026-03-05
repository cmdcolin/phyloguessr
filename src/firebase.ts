import { initializeApp } from "firebase/app"
import {
  getAuth,
  signInAnonymously,
  signInWithPopup,
  linkWithPopup,
  onAuthStateChanged,
  GoogleAuthProvider,
} from "firebase/auth"
import type { User } from "firebase/auth"
import {
  getFirestore,
  getCountFromServer,
  collection,
  doc,
  setDoc,
  query,
  orderBy,
  where,
  limit,
  getDocs,
  runTransaction,
} from "firebase/firestore"

const app = initializeApp({
  apiKey: "AIzaSyBmY2MC3gACK-Q6DtMmn1jCY7OVI-RF-aU",
  authDomain: "phyloguessr.firebaseapp.com",
  projectId: "phyloguessr",
  storageBucket: "phyloguessr.firebasestorage.app",
  messagingSenderId: "482031111716",
  appId: "1:482031111716:web:1de25af2d6f4f3e7b752b1",
  measurementId: "G-H60S7BXHPJ",
})

const auth = getAuth(app)
const db = getFirestore(app)
const scoresRef = collection(db, "scores")
const googleProvider = new GoogleAuthProvider()

let resolveAuth: (user: User) => void
let authReady = new Promise<User>((resolve) => {
  resolveAuth = resolve
})

onAuthStateChanged(auth, (user) => {
  if (user) {
    resolveAuth(user)
  } else {
    authReady = new Promise<User>((resolve) => {
      resolveAuth = resolve
    })
    signInAnonymously(auth).catch(console.error)
  }
})

export function getUid() {
  return authReady.then((u) => u.uid)
}

export function getCurrentUser() {
  return authReady
}

export async function signInWithGoogle() {
  const currentUser = auth.currentUser
  if (currentUser?.isAnonymous) {
    try {
      const result = await linkWithPopup(currentUser, googleProvider)
      return result.user
    } catch (err: unknown) {
      if (
        err !== null &&
        typeof err === "object" &&
        "code" in err &&
        err.code === "auth/credential-already-in-use"
      ) {
        const anonUid = currentUser.uid
        const result = await signInWithPopup(auth, googleProvider)
        await deleteAnonScore(anonUid)
        return result.user
      }
      throw err
    }
  }
  const result = await signInWithPopup(auth, googleProvider)
  return result.user
}

export async function signOut() {
  stopPresence()
  await auth.signOut()
}

async function deleteAnonScore(anonUid: string) {
  const oldRef = doc(scoresRef, anonUid)
  await runTransaction(db, async (transaction) => {
    const oldSnap = await transaction.get(oldRef)
    if (oldSnap.exists()) {
      transaction.delete(oldRef)
    }
  })
}

export interface LeaderboardEntry {
  uid: string
  name: string
  bestStreak: number
  currentStreak: number
  totalWins: number
  totalPlayed: number
  timestamp: number
}

function toLeaderboardEntry(uid: string, data: Record<string, unknown>): LeaderboardEntry {
  return {
    uid: typeof data.uid === "string" ? data.uid : uid,
    name: typeof data.name === "string" ? data.name : "Anonymous",
    bestStreak: typeof data.bestStreak === "number" ? data.bestStreak : 0,
    currentStreak: typeof data.currentStreak === "number" ? data.currentStreak : 0,
    totalWins: typeof data.totalWins === "number" ? data.totalWins : 0,
    totalPlayed: typeof data.totalPlayed === "number" ? data.totalPlayed : 0,
    timestamp: typeof data.timestamp === "number" ? data.timestamp : 0,
  }
}

export async function recordRound(name: string, correct: boolean) {
  const user = await authReady
  const uid = user.uid
  const docRef = doc(scoresRef, uid)

  await runTransaction(db, async (transaction) => {
    const existing = await transaction.get(docRef)

    if (existing.exists()) {
      const prev = toLeaderboardEntry(uid, existing.data())
      const currentStreak = correct ? prev.currentStreak + 1 : 0
      transaction.set(docRef, {
        uid,
        name,
        bestStreak: Math.max(prev.bestStreak, currentStreak),
        currentStreak,
        totalWins: prev.totalWins + (correct ? 1 : 0),
        totalPlayed: prev.totalPlayed + 1,
        timestamp: Date.now(),
      } satisfies LeaderboardEntry)
    } else {
      transaction.set(docRef, {
        uid,
        name,
        bestStreak: correct ? 1 : 0,
        currentStreak: correct ? 1 : 0,
        totalWins: correct ? 1 : 0,
        totalPlayed: 1,
        timestamp: Date.now(),
      } satisfies LeaderboardEntry)
    }
  })
}

export async function getTopStreaks(count = 20) {
  const q = query(scoresRef, orderBy("bestStreak", "desc"), limit(count))
  const snap = await getDocs(q)
  return snap.docs.map((d) => toLeaderboardEntry(d.id, d.data()))
}

const presenceRef = collection(db, "presence")
const PRESENCE_TIMEOUT_MS = 2 * 60 * 1000

export interface PresenceEntry {
  uid: string
  name: string
  lastSeen: number
}

async function updatePresence() {
  const user = await authReady
  const name = localStorage.getItem("phyloLeaderboardName") ?? "Anonymous"
  await setDoc(doc(presenceRef, user.uid), {
    uid: user.uid,
    name,
    lastSeen: Date.now(),
  } satisfies PresenceEntry)
}

let heartbeatId: ReturnType<typeof setInterval> | null = null
let visibilityHandler: (() => void) | null = null

export function startPresence() {
  if (heartbeatId !== null) {
    return
  }
  updatePresence()
  heartbeatId = setInterval(() => updatePresence(), 60_000)
  visibilityHandler = () => {
    if (document.visibilityState === "visible") {
      updatePresence()
    }
  }
  document.addEventListener("visibilitychange", visibilityHandler)
}

export function stopPresence() {
  if (heartbeatId !== null) {
    clearInterval(heartbeatId)
    heartbeatId = null
  }
  if (visibilityHandler) {
    document.removeEventListener("visibilitychange", visibilityHandler)
    visibilityHandler = null
  }
}

export async function getOnlineCount() {
  const cutoff = Date.now() - PRESENCE_TIMEOUT_MS
  const q = query(presenceRef, where("lastSeen", ">", cutoff))
  const snap = await getCountFromServer(q)
  return snap.data().count
}
