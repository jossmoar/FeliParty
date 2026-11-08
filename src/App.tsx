import { Navigate, Route, Routes } from 'react-router-dom'
import { Login } from './pages/Login'
import { Party } from './pages/Party'
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      {/* El QR abre "/" → login */}
      <Route path="/" element={<Login />} />
      <Route
        path="/fiesta"
        element={
          <ProtectedRoute>
            <Party />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
