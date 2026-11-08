import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '../firebase/config'

export type Rsvp = 'pending' | 'yes' | 'no'

// Perfil del invitado (un niño invitado = una cuenta).
export interface GuestProfile {
  childName: string
  rsvp: Rsvp
  companions: number
}

interface AuthContextValue {
  user: User | null
  profile: GuestProfile | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (childName: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateGuest: (data: Partial<GuestProfile>) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<GuestProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      try {
        if (firebaseUser) {
          const ref = doc(db, 'guests', firebaseUser.uid)
          const snap = await getDoc(ref)
          if (snap.exists()) {
            setProfile(snap.data() as GuestProfile)
          } else {
            const initial: GuestProfile = {
              childName: firebaseUser.displayName ?? '',
              rsvp: 'pending',
              companions: 0,
            }
            await setDoc(ref, initial)
            setProfile(initial)
          }
        } else {
          setProfile(null)
        }
      } catch (err) {
        console.error('No se pudo cargar el perfil del invitado:', err)
        setProfile(null)
      } finally {
        setLoading(false)
      }
    })
  }, [])

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const signup = async (childName: string, email: string, password: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(cred.user, { displayName: childName })
    const initial: GuestProfile = { childName, rsvp: 'pending', companions: 0 }
    await setDoc(doc(db, 'guests', cred.user.uid), initial)
    setProfile(initial)
  }

  const logout = () => signOut(auth)

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email)
  }

  const updateGuest = async (data: Partial<GuestProfile>) => {
    if (!user) return
    await updateDoc(doc(db, 'guests', user.uid), data)
    setProfile((prev) => (prev ? { ...prev, ...data } : prev))
  }

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, login, signup, logout, resetPassword, updateGuest }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
