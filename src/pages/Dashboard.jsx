import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useMobile } from '../hooks/useMobile'

const COLORS = {
  primary: '#1e3a5f',
  secondary: '#2d5f8a',
  white: '#ffffff',
  light: '#f5f5f5'
}

export default function Dashboard() {
  const { user } = useAuth()
  const isMobile = useMobile()
  const [stats, setStats] = useState({
    totalTaken: 0,
    activeTaken: 0,
    completedTaken: 0,
    boodschappenOpen: 0
  })
  const [loading, setLoading] = useState(true)
  const [recentTaken, setRecentTaken] = useState([])

  useEffect(() => {
    loadDashboard()
  }, [user])

  const loadDashboard = async () => {
    try {
      setLoading(true)

      // For now, load mock data since we don't have a database yet
      // This will be replaced with real Supabase queries once the schema is set up
      setStats({
        totalTaken: 0,
        activeTaken: 0,
        completedTaken: 0,
        boodschappenOpen: 0
      })
      setRecentTaken([])
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ label, value, icon, color }) => (
    <div style={{
      backgroundColor: COLORS.white,
      borderRadius: '8px',
      padding: '1.5rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      textAlign: 'center',
      borderTop: `4px solid ${color}`
    }}>
      <div style={{ fontSize: '28px', marginBottom: '0.5rem' }}>
        {icon}
      </div>
      <div style={{
        fontSize: '32px',
        fontWeight: '700',
        color: COLORS.primary,
        marginBottom: '0.5rem'
      }}>
        {value}
      </div>
      <div style={{
        fontSize: '14px',
        color: '#666',
        fontWeight: '500'
      }}>
        {label}
      </div>
    </div>
  )

  const statsGrid = [
    { label: 'Totaal taken', value: stats.totalTaken, icon: '📋', color: COLORS.secondary },
    { label: 'Actief', value: stats.activeTaken, icon: '⚡', color: '#ffc107' },
    { label: 'Afgerond', value: stats.completedTaken, icon: '✓', color: '#28a745' },
    { label: 'Boodschappen', value: stats.boodschappenOpen, icon: '🛒', color: '#dc3545' }
  ]

  return (
    <div>
      <h2 style={{
        fontSize: isMobile ? '20px' : '28px',
        fontWeight: '700',
        color: COLORS.primary,
        marginBottom: '1.5rem'
      }}>
        Welkom, {user?.name}
      </h2>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        {statsGrid.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      {/* Recent Tasks */}
      <div style={{
        backgroundColor: COLORS.white,
        borderRadius: '8px',
        padding: '1.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '700',
          color: COLORS.primary,
          marginBottom: '1rem'
        }}>
          Recente taken
        </h3>

        {loading ? (
          <p style={{ color: '#999', textAlign: 'center', padding: '2rem 0' }}>
            Laden...
          </p>
        ) : recentTaken.length === 0 ? (
          <p style={{ color: '#999', textAlign: 'center', padding: '2rem 0' }}>
            Geen taken gevonden
          </p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {recentTaken.map((taak, idx) => (
              <li
                key={idx}
                style={{
                  padding: '1rem',
                  borderBottom: idx < recentTaken.length - 1 ? '1px solid #e0e0e0' : 'none'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <p style={{ margin: '0 0 0.5rem 0', fontWeight: '600' }}>
                      {taak.taak}
                    </p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>
                      {taak.persoon}
                    </p>
                  </div>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '600',
                    backgroundColor: taak.status === 'klaar' ? '#d4edda' : '#fff3cd',
                    color: taak.status === 'klaar' ? '#155724' : '#856404'
                  }}>
                    {taak.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
