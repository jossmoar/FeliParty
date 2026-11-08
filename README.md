# FeliParty 🎉

Invitación de cumpleaños con código QR. El QR abre la página de inicio de sesión;
cada invitado crea su cuenta y ve su invitación personalizada (con su nombre) y
puede confirmar si asiste.

Stack: Vite + React + TypeScript + Tailwind + Firebase (Auth + Firestore), desplegado en Vercel
(igual que SupplementsCatalog).

## Estructura

| Archivo | Para qué |
|---|---|
| `src/config/party.ts` | **Datos de la fiesta** (fecha, lugar, etc.). Editar aquí. |
| `src/pages/Login.tsx` | Página que abre el QR (crear cuenta / iniciar sesión). |
| `src/pages/Party.tsx` | Invitación personalizada + confirmación de asistencia. |
| `scripts/generate-qr.mjs` | Genera el QR en `qr/`. |
| `firestore.rules` | Reglas de seguridad (cada invitado ve solo lo suyo). |

## Paso a paso

1. **Firebase**: crear proyecto → activar *Authentication > Correo/contraseña* →
   crear *Firestore Database* → pegar el contenido de `firestore.rules` en la pestaña *Reglas*.
2. **Local**: copiar `.env.example` como `.env` y llenar los valores de Firebase.
   ```bash
   npm install
   npm run dev
   ```
3. **Vercel**: *Add New Project* → importar `jossmoar/FeliParty` → en *Environment Variables*
   agregar las mismas `VITE_FIREBASE_*` del `.env` → *Deploy*.
4. **Dominio autorizado**: en Firebase > Authentication > Settings > *Authorized domains*,
   agregar el dominio de Vercel (ej. `feliparty.vercel.app`).
5. **QR**: si Vercel te dio un dominio distinto a `feliparty.vercel.app`, cambia `SITE_URL`
   en `.env` y corre:
   ```bash
   npm run qr
   ```
   El QR queda en `qr/invitacion-qr.png` (imprimir) y `qr/invitacion-qr.svg` (diseño).

> El QR solo contiene la dirección del sitio: puedes imprimirlo ya y cambiar el diseño
> o los datos de la página después, sin tener que regenerarlo.
