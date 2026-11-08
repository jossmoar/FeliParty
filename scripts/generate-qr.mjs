// Genera el código QR de la invitación.
// Uso:  npm run qr                       (usa SITE_URL del archivo .env)
//       npm run qr -- https://otro.dominio (usa la URL que le pases)
import { mkdirSync, readFileSync, existsSync } from 'node:fs'
import QRCode from 'qrcode'

function readEnvUrl() {
  if (!existsSync('.env')) return undefined
  const line = readFileSync('.env', 'utf8')
    .split(/\r?\n/)
    .find((l) => l.startsWith('SITE_URL='))
  return line?.slice('SITE_URL='.length).trim() || undefined
}

const url = process.argv[2] || process.env.SITE_URL || readEnvUrl() || 'https://feliparty.vercel.app'

mkdirSync('qr', { recursive: true })
const options = { errorCorrectionLevel: 'H', margin: 2, color: { dark: '#000000', light: '#ffffff' } }

await QRCode.toFile('qr/invitacion-qr.png', url, { ...options, width: 1200 })
await QRCode.toFile('qr/invitacion-qr.svg', url, { ...options, type: 'svg' })

console.log(`QR generado para: ${url}`)
console.log('  qr/invitacion-qr.png  (para imprimir)')
console.log('  qr/invitacion-qr.svg  (vectorial, para diseño)')
