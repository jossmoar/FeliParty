import { useState } from 'react'
import { useAuth, type Rsvp } from '../context/AuthContext'
import { party } from '../config/party'

// Invitación personalizada para el invitado que inició sesión.
// El diseño final se aplicará según las indicaciones del cliente.
export function Party() {
  const { profile, logout, updateGuest } = useAuth()
  const [saving, setSaving] = useState(false)
  const name = profile?.childName || 'amigo'

  const setRsvp = async (rsvp: Rsvp) => {
    setSaving(true)
    try {
      await updateGuest({ rsvp })
    } finally {
      setSaving(false)
    }
  }

  const waText = encodeURIComponent(`Hola, soy de parte de ${name}, invitado al cumpleaños de ${party.birthdayKid}.`)

  return (
    <div className="mx-auto max-w-xl px-6 py-12">
      <div className="flex justify-end">
        <button onClick={logout} className="text-xs text-gray-500 underline">
          Cerrar sesión
        </button>
      </div>

      <p className="mt-4 text-center text-lg">¡Hola, {name}!</p>
      <h1 className="mt-2 text-center text-4xl font-bold">
        {party.birthdayKid} cumple {party.age} 🎉
      </h1>
      <p className="mt-2 text-center text-gray-600">{party.theme}</p>

      <dl className="mt-10 space-y-4 rounded-2xl border border-gray-200 p-6">
        <Item label="Fecha" value={party.date} />
        <Item label="Hora" value={party.time} />
        <Item label="Lugar" value={party.place} />
        <Item label="Dirección" value={party.address} />
        <Item label="Vestimenta" value={party.dressCode} />
        <Item label="Nota" value={party.notes} />
      </dl>

      <a href={party.mapsUrl} target="_blank" rel="noreferrer" className="btn mt-4 block w-full text-center">
        Cómo llegar
      </a>

      <section className="mt-10 text-center">
        <h2 className="text-xl font-semibold">¿Vas a venir?</h2>
        <div className="mt-4 flex gap-3">
          <button
            disabled={saving}
            onClick={() => setRsvp('yes')}
            className={`btn flex-1 ${profile?.rsvp === 'yes' ? '' : 'btn-outline'}`}
          >
            ¡Sí, ahí estaré!
          </button>
          <button
            disabled={saving}
            onClick={() => setRsvp('no')}
            className={`btn flex-1 ${profile?.rsvp === 'no' ? '' : 'btn-outline'}`}
          >
            No podré ir
          </button>
        </div>
        {profile?.rsvp === 'yes' && <p className="mt-3 text-green-700">¡Genial! Te esperamos, {name}.</p>}
        {profile?.rsvp === 'no' && <p className="mt-3 text-gray-600">¡Te vamos a extrañar!</p>}
      </section>

      <a
        href={`https://wa.me/${party.contactWhatsapp}?text=${waText}`}
        target="_blank"
        rel="noreferrer"
        className="mt-10 block text-center text-sm text-gray-600 underline"
      >
        ¿Dudas? Escribe a {party.contactName} por WhatsApp
      </a>
    </div>
  )
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-widest text-gray-500">{label}</dt>
      <dd className="text-lg">{value}</dd>
    </div>
  )
}
