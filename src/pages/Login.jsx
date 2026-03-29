import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { nameToEmail } from '../lib/supabase'
import { useMobile } from '../hooks/useMobile'

export default function Login() {
  const { login, loading, error } = useAuth()
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const isMobile = useMobile()

  const users = Object.keys(nameToEmail)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (name && password) {
      await login(name, password)
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #1e3a5f 0%, #2d5f8a 100%)",
      padding: isMobile ? "12px" : "24px"
    }}>
      {/* Icon and Title */}
      <div style={{ textAlign: "center", color: "white", marginBottom: isMobile ? "24px" : "32px" }}>
        <div style={{ fontSize: isMobile ? "48px" : "64px", marginBottom: "12px" }}>🏠</div>
        <h1 style={{ fontSize: isMobile ? "22px" : "28px", fontWeight: 700, margin: "0 0 8px 0", letterSpacing: "-0.5px" }}>Huishoud Van Bogaert</h1>
        <p style={{ fontSize: isMobile ? "13px" : "14px", margin: 0, opacity: 0.9 }}>Huishoudelijk beheer</p>
      </div>

      {/* Login Card */}
      <div style={{
        backgroundColor: "white",
        borderRadius: "12px",
        padding: isMobile ? "20px" : "28px",
        boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
        width: "100%",
        maxWidth: isMobile ? "320px" : "380px"
      }}>
        <h2 style={{ fontSize: isMobile ? "18px" : "20px", fontWeight: 700, color: "#1e3a5f", margin: "0 0 20px 0", textAlign: "center" }}>Welkom terug</h2>

        <form onSubmit={handleSubmit}>
          {/* Name Input */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: isMobile ? "12px" : "13px", fontWeight: 600, color: "#1e3a5f", marginBottom: "6px" }}>Naam</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              list="names"
              placeholder="Selecteer uw naam"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "6px",
                border: "1px solid #e2e8f0",
                fontSize: isMobile ? "13px" : "14px",
                color: "#1e3a5f",
                boxSizing: "border-box",
                fontFamily: "inherit"
              }}
            />
            <datalist id="names">
              {users.map(u => <option key={u} value={u} />)}
            </datalist>
          </div>

          {/* Password Input */}
          <div style={{ marginBottom: "8px" }}>
            <label style={{ display: "block", fontSize: isMobile ? "12px" : "13px", fontWeight: 600, color: "#1e3a5f", marginBottom: "6px" }}>Wachtwoord</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Voer uw wachtwoord in"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "6px",
                border: "1px solid #e2e8f0",
                fontSize: isMobile ? "13px" : "14px",
                color: "#1e3a5f",
                boxSizing: "border-box",
                fontFamily: "inherit"
              }}
            />
          </div>

          {/* Forgot Password Hint */}
          <p style={{ fontSize: isMobile ? "11px" : "12px", color: "#64748b", margin: "0 0 16px 0" }}>
            Wachtwoord vergeten? Contacteer Olivier.
          </p>

          {/* Error Message */}
          {error && (
            <div style={{
              backgroundColor: "#fee2e2",
              color: "#991b1b",
              padding: "10px 12px",
              borderRadius: "6px",
              marginBottom: "16px",
              fontSize: isMobile ? "12px" : "13px",
              fontWeight: 500
            }}>
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !name || !password}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: loading || !name || !password ? "#cbd5e1" : "#1e3a5f",
              color: "white",
              fontSize: isMobile ? "13px" : "14px",
              fontWeight: 600,
              cursor: loading || !name || !password ? "not-allowed" : "pointer",
              opacity: loading || !name || !password ? 0.6 : 1,
              transition: "all 0.15s"
            }}
          >
            {loading ? "Bezig met aanmelden..." : "Aanmelden"}
          </button>
        </form>
      </div>
    </div>
  )
}
