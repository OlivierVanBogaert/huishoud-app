import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useMobile } from '../hooks/useMobile'

const COLORS = {
  primary: '#1e3a5f',
  secondary: '#2d5f8a',
  white: '#ffffff',
  light: '#f5f5f5'
}

const navItems = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/takenbord', label: 'Takenbord', icon: '✓' },
  { path: '/planning', label: 'Planning', icon: '📅' },
  { path: '/boodschappen', label: 'Boodschappen', icon: '🛒' },
  { path: '/uren', label: 'Uren', icon: '⏱' }
]

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const isMobile = useMobile()
  const location = useLocation()

  const handleLogout = async () => {
    await logout()
  }

  const NavLinks = () => (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      {navItems.map(item => {
        const isActive = location.pathname === item.path
        return (
          <Link
            key={item.path}
            to={item.path}
            style={{
              padding: isMobile ? '0.5rem' : '0.75rem 1rem',
              textDecoration: 'none',
              color: isActive ? COLORS.white : COLORS.secondary,
              backgroundColor: isActive ? COLORS.secondary : 'transparent',
              borderRadius: '4px',
              fontSize: isMobile ? '12px' : '14px',
              fontWeight: isActive ? '600' : '500',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              transition: 'all 0.2s'
            }}
          >
            {item.icon}
            {!isMobile && item.label}
          </Link>
        )
      })}
    </div>
  )

  if (isMobile) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: COLORS.light
      }}>
        {/* Mobile Header */}
        <header style={{
          backgroundColor: COLORS.primary,
          color: COLORS.white,
          padding: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 4px 0' }}>
              Huishoud Van Bogaert
            </h1>
            <p style={{ fontSize: '12px', margin: 0, opacity: 0.9 }}>
              {user?.name}
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: COLORS.white,
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '500'
            }}
          >
            Afmelden
          </button>
        </header>

        {/* Content */}
        <main style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1rem',
          paddingBottom: '80px'
        }}>
          {children}
        </main>

        {/* Bottom Navigation */}
        <nav style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: COLORS.white,
          borderTop: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'space-around',
          height: '60px',
          alignItems: 'center',
          zIndex: 100
        }}>
          <NavLinks />
        </nav>
      </div>
    )
  }

  // Desktop layout
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: COLORS.light
    }}>
      {/* Desktop Header with Nav */}
      <header style={{
        backgroundColor: COLORS.primary,
        color: COLORS.white,
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>
            Huishoud Van Bogaert
          </h1>
        </div>
        <NavLinks />
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '14px' }}>{user?.name}</span>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: COLORS.white,
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.3)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'}
          >
            Afmelden
          </button>
        </div>
      </header>

      {/* Content */}
      <main style={{
        flex: 1,
        overflowY: 'auto',
        padding: '2rem'
      }}>
        {children}
      </main>
    </div>
  )
}
