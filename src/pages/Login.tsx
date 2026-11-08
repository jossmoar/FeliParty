import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { party } from '../config/party'

type Mode = 'login' | 'signup' | 'reset'

// Página a la que lleva el QR. El invitado inicia sesión o crea su cuenta
// y luego ve su invitación personalizada en /fiesta.
export function Login() {
  const { user, loading: authLoading, login, signup, resetPassword } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>('signup')
  const [childName, setChildName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)

  if (!authLoading && user) return <Navigate to="/fiesta" replace />

  const switchMode = (next: Mode) => {
    setMode(next)
    setError('')
    setInfo('')
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(email, password)
        navigate('/fiesta')
      } else if (mode === 'signup') {
        await signup(childName.trim(), email, password)
        navigate('/fiesta')
      } else {
        await resetPassword(email)
        setInfo('Te enviamos un correo para cambiar la contraseña.')
      }
    } catch (err) {
      console.error(err)
      setError(
        mode === 'signup'
          ? 'No se pudo crear la cuenta. Revisa el correo o usa otro.'
          : mode === 'login'
            ? 'Correo o contraseña incorrectos.'
            : 'No se pudo enviar el correo.',
      )
    } finally {
      setLoading(false)
    }
  }

  const title =
    mode === 'signup' ? 'Crea tu invitación' : mode === 'login' ? 'Entra a tu invitación' : 'Recuperar contraseña'

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
      <p className="text-center text-sm uppercase tracking-widest text-gray-500">
        ¡Estás invitado al cumpleaños de {party.birthdayKid}!
      </p>
      <h1 className="mt-2 text-center text-3xl font-bold">{title}</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {mode === 'signup' && (
          <input
            className="input"
            placeholder="Nombre del niño o niña invitado"
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
            required
          />
        )}
        <input
          className="input"
          type="email"
          placeholder="Correo de mamá o papá"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {mode !== 'reset' && (
          <input
            className="input"
            type="password"
            placeholder="Contraseña (mínimo 6)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
        )}
        {mode === 'login' && (
          <button type="button" onClick={() => switchMode('reset')} className="text-xs text-gray-500 underline">
            ¿Olvidaste tu contraseña?
          </button>
        )}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {info && <p className="text-sm text-green-700">{info}</p>}
        <button className="btn w-full" disabled={loading}>
          {loading ? 'Procesando…' : mode === 'signup' ? 'Ver mi invitación' : mode === 'login' ? 'Entrar' : 'Enviar correo'}
        </button>
      </form>

      <button
        className="mt-6 text-center text-sm text-gray-600 underline"
        onClick={() => switchMode(mode === 'signup' ? 'login' : 'signup')}
      >
        {mode === 'signup' ? '¿Ya tienes cuenta? Inicia sesión' : '¿Primera vez? Crea tu cuenta'}
      </button>
    </div>
  )
}
