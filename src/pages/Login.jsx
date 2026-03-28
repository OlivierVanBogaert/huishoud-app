import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { nameToEmail } from '../lib/supabase'

const COLORS = {
  primary: '#1e3a5f',
  secondary: '#2d5f8a',
  white: '#ffffff',
  light: '#f5f5f5'
}

export default function Login() {
  const { login, loading, error } = useAuth()
  const [selectedName, setSelectedName] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState('')

  const users = Object.keys(nameToEmail)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')

    if (!selectedName || !password) {
      setLocalError('Vul alstublieft uw naam en wachtwoord in')
      return
    }

    await login(selectedName, password)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: COLORS.white,
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{
          textAlign: 'center',
          fontSize: '28px',
          fontWeight: '700',
          color: COLORS.primary,
          marginBottom: '0.5rem'
        }}>
          Huishoud Van Bogaert
        </h1>

        <p style={{
          textAlign: 'center',
          fontSize: '14px',
          color: '#666',
          marginBottom: '2rem'
        }}>
          Aanmelden
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: COLORS.primary,
              marginBottom: '0.5rem'
            }}>
              Selecteer uw naam
            </label>
            <select
              value={selectedName}
              onChange={(e) => setSelectedName(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '6px',
                border: `2px solid ${COLORS.secondary}`,
                fontSize: '14px',
                fontWeight: '500',
                color: COLORS.primary,
                backgroundColor: COLORS.white,
                cursor: 'pointer',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.75rem center',
                backgroundSize: '1.5em 1.5em',
                paddingRight: '2.5rem'
              }}
            >
              <option value="">-- Kies een naam --</option>
              {users.map(name => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: COLORS.primary,
              marginBottom: '0.5rem'
            }}>
              Wachtwoord
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Voer uw wachtwoord in"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '6px',
                border: `2px solid ${COLORS.secondary}`,
                fontSize: '14px',
                color: COLORS.primary,
                boxSizing: 'border-box'
              }}
            />
          </div>

          {(error || localError) && (
            <div style={{
              backgroundColor: '#f8d7da',
              color: '#721c24',
              padding: '0.75rem 1rem',
              borderRadius: '6px',
              marginBottom: '1.5rem',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              {error || localError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: COLORS.secondary,
              color: COLORS.white,
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = COLORS.primary)}
            onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = COLORS.secondary)}
          >
            {loading ? 'Bezig met aanmelden...' : 'Aanmelden'}
          </button>
        </form>

        <p style={{
          textAlign: 'center',
          fontSize: '12px',
          color: '#999',
          marginTop: '1.5rem'
        }}>
          Demo-app. Voor testing: zie .env.example voor credentials.
        </p>
      </div>
    </div>
  )
}
