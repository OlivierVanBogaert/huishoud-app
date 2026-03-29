import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useMobile } from '../hooks/useMobile'
import { supabase } from '../lib/supabase'

const navItems = [
  { id: 'dashboard', path: '/', label: 'Dashboard', icon: '📊' },
  { id: 'takenbord', path: '/takenbord', label: 'Takenbord', icon: '📋' },
  { id: 'planning', path: '/planning', label: 'Planning', icon: '📅' },
  { id: 'boodschappen', path: '/boodschappen', label: 'Boodschappen', icon: '🛒' },
  { id: 'uren', path: '/uren', label: 'Uren', icon: '⏱️' }
]

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const isMobile = useMobile()
  const location = useLocation()
  const navigate = useNavigate()
  const [meldingen, setMeldingen] = useState([])
  const [boodschappenCount, setBoodschappenCount] = useState(0)
  const [showMeldingen, setShowMeldingen] = useState(false)

  // Fetch meldingen from Supabase
  useEffect(() => {
    fetchMeldingen()
    const interval = setInterval(fetchMeldingen, 3000)
    return () => clearInterval(interval)
  }, [])

  // Fetch boodschappen count
  useEffect(() => {
    fetchBoodschappenCount()
    const interval = setInterval(fetchBoodschappenCount, 3000)
    return () => clearInterval(interval)
  }, [])

  async function fetchMeldingen() {
    try {
      const { data, error } = await supabase
        .from('meldingen')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setMeldingen(data || [])
    } catch (err) {
      console.error('Error fetching meldingen:', err)
    }
  }

  async function fetchBoodschappenCount() {
    try {
      const { count, error } = await supabase
        .from('boodschappen')
        .select('id', { count: 'exact', head: true })
        .eq('gedaan', false)
      if (error) throw error
      setBoodschappenCount(count || 0)
    } catch (err) {
      console.error('Error fetching boodschappen count:', err)
    }
  }

  async function markAllAsRead() {
    try {
      const { error } = await supabase
        .from('meldingen')
        .update({ gelezen: true })
        .eq('gelezen', false)
      if (error) throw error
      await fetchMeldingen()
    } catch (err) {
      console.error('Error marking meldingen as read:', err)
    }
  }

  const unreadCount = meldingen.filter(m => !m.gelezen).length

  const handleLogout = async () => {
    await logout()
  }

  const isActive = (path) => location.pathname === path

  // Desktop layout
  if (!isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #2d5f8a 100%)", color: "white", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60, boxShadow: "0 2px 8px rgba(0,0,0,0.15)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 26 }}>🏠</span>
            <div style={{ fontWeight: 700, fontSize: 17, letterSpacing: "-0.3px" }}>Huishoud Van Bogaert</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* Meldingen Bell */}
            <div style={{ position: "relative" }}>
              <button onClick={() => setShowMeldingen(!showMeldingen)} style={{ background: "none", border: "none", color: "white", fontSize: 24, cursor: "pointer", padding: 0 }}>
                🔔
              </button>
              {unreadCount > 0 && (
                <span style={{ position: "absolute", top: -8, right: -8, backgroundColor: "#ef4444", color: "white", borderRadius: 99, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600 }}>
                  {unreadCount}
                </span>
              )}
              {showMeldingen && (
                <div style={{ position: "absolute", top: 50, right: 0, backgroundColor: "white", color: "#1e3a5f", borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.2)", minWidth: 300, maxHeight: 400, overflowY: "auto", zIndex: 1000 }}>
                  {meldingen.length === 0 ? (
                    <div style={{ padding: "12px 16px", fontSize: 14, color: "#64748b" }}>Geen meldingen</div>
                  ) : (
                    <>
                      {meldingen.map(m => (
                        <div key={m.id} style={{ padding: "12px 16px", borderBottom: "1px solid #e2e8f0", fontSize: 13, opacity: m.gelezen ? 0.6 : 1 }}>
                          {m.tekst}
                        </div>
                      ))}
                      <button onClick={markAllAsRead} style={{ width: "100%", padding: "12px", backgroundColor: "#f1f5f9", border: "none", color: "#1e3a5f", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                        Alles gelezen
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
            {/* Avatar */}
            <div style={{ width: 36, height: 36, borderRadius: 99, backgroundColor: "rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 14 }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            {/* Logout */}
            <button onClick={handleLogout} style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "white", border: "none", padding: "8px 16px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
              Afmelden
            </button>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div style={{ backgroundColor: "white", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "center", gap: 4, padding: "0 24px", flexShrink: 0 }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => navigate(item.path)} style={{
              padding: "12px 20px", cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
              fontSize: 14, fontWeight: isActive(item.path) ? 600 : 400,
              color: isActive(item.path) ? "#1e3a5f" : "#64748b",
              backgroundColor: "transparent", border: "none",
              borderBottom: isActive(item.path) ? "3px solid #1e3a5f" : "3px solid transparent",
              transition: "all 0.15s", minHeight: 48, whiteSpace: "nowrap", position: "relative"
            }}>
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              {item.label}
              {item.id === 'boodschappen' && boodschappenCount > 0 && (
                <span style={{ position: "absolute", top: 8, right: 8, backgroundColor: "#ef4444", color: "white", borderRadius: 99, width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>
                  {boodschappenCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <main style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          {children}
        </main>
      </div>
    )
  }

  // Mobile layout
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Mobile Header */}
      <div style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #2d5f8a 100%)", color: "white", padding: "0 12px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60, boxShadow: "0 2px 8px rgba(0,0,0,0.15)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 20 }}>🏠</span>
          <div style={{ fontWeight: 700, fontSize: 13, letterSpacing: "-0.3px" }}>Van Bogaert</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Mobile Meldingen Bell */}
          <div style={{ position: "relative" }}>
            <button onClick={() => setShowMeldingen(!showMeldingen)} style={{ background: "none", border: "none", color: "white", fontSize: 20, cursor: "pointer", padding: 0 }}>
              🔔
            </button>
            {unreadCount > 0 && (
              <span style={{ position: "absolute", top: -6, right: -6, backgroundColor: "#ef4444", color: "white", borderRadius: 99, width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600 }}>
                {unreadCount}
              </span>
            )}
            {showMeldingen && (
              <div style={{ position: "absolute", top: 50, right: 0, backgroundColor: "white", color: "#1e3a5f", borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.2)", minWidth: 280, maxHeight: 300, overflowY: "auto", zIndex: 1000 }}>
                {meldingen.length === 0 ? (
                  <div style={{ padding: "12px 16px", fontSize: 13, color: "#64748b" }}>Geen meldingen</div>
                ) : (
                  <>
                    {meldingen.map(m => (
                      <div key={m.id} style={{ padding: "12px 16px", borderBottom: "1px solid #e2e8f0", fontSize: 12, opacity: m.gelezen ? 0.6 : 1 }}>
                        {m.tekst}
                      </div>
                    ))}
                    <button onClick={markAllAsRead} style={{ width: "100%", padding: "12px", backgroundColor: "#f1f5f9", border: "none", color: "#1e3a5f", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>
                      Alles gelezen
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
          {/* Mobile Avatar */}
          <div style={{ width: 32, height: 32, borderRadius: 99, backgroundColor: "rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 12 }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Content */}
      <main style={{ flex: 1, overflowY: "auto", padding: 12, paddingBottom: 70 }}>
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: 60, backgroundColor: "white", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "space-around", alignItems: "center", boxShadow: "0 -2px 8px rgba(0,0,0,0.08)", zIndex: 100 }}>
        {navItems.map(item => (
          <button key={item.id} onClick={() => navigate(item.path)} style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "6px 8px", cursor: "pointer", background: "none", border: "none",
            color: isActive(item.path) ? "#1e3a5f" : "#64748b",
            fontSize: 11, fontWeight: isActive(item.path) ? 600 : 400, transition: "all 0.15s", position: "relative"
          }}>
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            {item.label}
            {item.id === 'boodschappen' && boodschappenCount > 0 && (
              <span style={{ position: "absolute", top: 0, right: 0, backgroundColor: "#ef4444", color: "white", borderRadius: 99, width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700 }}>
                {boodschappenCount}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
