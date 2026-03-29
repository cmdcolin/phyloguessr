import { initializeApp } from 'firebase/app'
import {
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
} from 'firebase/auth'
import {
  collection,
  deleteDoc,
  doc,
  getCount,
  getFirestore,
  query,
  setDoc,
  where,
} from 'firebase/firestore/lite'

import type { User } from 'firebase/auth'

const app = initializeApp({
  apiKey: 'AIzaSyBmY2MC3gACK-Q6DtMmn1jCY7OVI-RF-aU',
  authDomain: 'phyloguessr.firebaseapp.com',
  projectId: 'phyloguessr',
  storageBucket: 'phyloguessr.firebasestorage.app',
  messagingSenderId: '482031111716',
  appId: '1:482031111716:web:1de25af2d6f4f3e7b752b1',
  measurementId: 'G-H60S7BXHPJ',
})

const auth = getAuth(app)
const db = getFirestore(app)
const googleProvider = new GoogleAuthProvider()

let currentUser: User | null = null
let resolveAuthReady: () => void
const authReady = new Promise<void>(resolve => {
  resolveAuthReady = resolve
})

onAuthStateChanged(auth, user => {
  currentUser = user
  resolveAuthReady()
})

export async function getUid() {
  await authReady
  return currentUser?.uid ?? null
}

export async function getCurrentUser() {
  await authReady
  return currentUser
}

export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider)
  return result.user
}

export async function signOut() {
  stopPresence()
  if (currentUser) {
    await deleteDoc(doc(presenceRef, currentUser.uid)).catch(() => {})
  }
  await auth.signOut()
}


const presenceRef = collection(db, 'presence')
const PRESENCE_INTERVAL_MS = 5 * 60 * 1000
const PRESENCE_TIMEOUT_MS = 8 * 60 * 1000

export interface PresenceEntry {
  uid: string
  name: string
  lastSeen: number
}

async function updatePresence() {
  await authReady
  if (!currentUser) {
    return
  }
  const name = currentUser.displayName ?? 'Anonymous'
  await setDoc(doc(presenceRef, currentUser.uid), {
    uid: currentUser.uid,
    name,
    lastSeen: Date.now(),
  } satisfies PresenceEntry)
}

let heartbeatId: ReturnType<typeof setInterval> | null = null
let visibilityHandler: (() => void) | null = null
let lastPresenceWrite = 0

export function startPresence() {
  if (heartbeatId !== null) {
    return Promise.resolve()
  }
  const firstWrite = updatePresence()
  lastPresenceWrite = Date.now()
  heartbeatId = setInterval(() => {
    updatePresence()
    lastPresenceWrite = Date.now()
  }, PRESENCE_INTERVAL_MS)
  visibilityHandler = () => {
    if (
      document.visibilityState === 'visible' &&
      Date.now() - lastPresenceWrite >= PRESENCE_INTERVAL_MS
    ) {
      updatePresence()
      lastPresenceWrite = Date.now()
    }
  }
  document.addEventListener('visibilitychange', visibilityHandler)
  return firstWrite
}

export function stopPresence() {
  if (heartbeatId !== null) {
    clearInterval(heartbeatId)
    heartbeatId = null
  }
  if (visibilityHandler) {
    document.removeEventListener('visibilitychange', visibilityHandler)
    visibilityHandler = null
  }
}

export async function getOnlineCount() {
  const cutoff = Date.now() - PRESENCE_TIMEOUT_MS
  const q = query(presenceRef, where('lastSeen', '>', cutoff))
  const snap = await getCount(q)
  return snap.data().count
}
