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

const weekdagen = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo']
const blokken = ['Ochtend', 'Namiddag', 'Hele dag']

// Helper function to get week dates
function getWeekDatums(startDate = new Date()) {
  const dates = []
  const current = new Date(startDate)
  const day = current.getDay()
  const diff = current.getDate() - day + (day === 0 ? -6 : 1) // Adjust to Monday

  const monday = new Date(current.setDate(diff))

  for (let i = 0; i < 7; i++) {
    const date = new Date(monday)
    date.setDate(monday.getDate() + i)
    dates.push(new Date(date))
  }

  return dates
}

export default function Planning() {
  const { user } = useAuth()
  const isMobile = useMobile()
  const [weekDates, setWeekDates] = useState([])
  const [blokkeringen, setBlokkeringen] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedBlok, setSelectedBlok] = useState(null)
  const [showNewBlockForm, setShowNewBlockForm] = useState(false)

  useEffect(() => {
    setWeekDates(getWeekDatums())
    loadPlanning()
  }, [user])

  const loadPlanning = async () => {
    try {
      setLoading(true)
      // Mock data for now - will be replaced with real Supabase queries
      setBlokkeringen([])
    } catch (error) {
      console.error('Error loading planning:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddBlock = async (date, blok) => {
    try {
      // This will be implemented once Supabase schema is set up
      await loadPlanning()
    } catch (error) {
      console.error('Error adding block:', error)
    }
  }

  const PlanningGrid = () => {
    if (isMobile) {
      // Mobile: scrollable horizontal grid
      return (
        <div style={{ overflowX: 'auto', marginBottom: '2rem' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            minWidth: '600px'
          }}>
            <thead>
              <tr style={{ backgroundColor: COLORS.secondary }}>
                <th style={{
                  padding: '0.75rem',
                  color: COLORS.white,
                  fontWeight: '600',
                  fontSize: '12px',
                  textAlign: 'left',
                  borderBottom: '2px solid ' + COLORS.primary
                }}>
                  Blok
                </th>
                {weekDates.map((date, idx) => (
                  <th
                    key={idx}
                    style={{
                      padding: '0.75rem',
                      color: COLORS.white,
                      fontWeight: '600',
                      fontSize: '12px',
                      textAlign: 'center',
                      borderBottom: '2px solid ' + COLORS.primary
                    }}
                  >
                    <div>{weekdagen[idx]}</div>
                    <div style={{ fontSize: '11px', fontWeight: '400' }}>
                      {date.getDate()}/{date.getMonth() + 1}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {blokken.map((bolk, blokIdx) => (
                <tr key={blok} style={{
                  backgroundColor: blokIdx % 2 === 0 ? COLORS.white : '#f9f9f9'
                }}>
                  <td style={{
                    padding: '0.75rem',
                    fontWeight: '600',
                    fontSize: '12px',
                    color: COLORS.primary,
                    borderBottom: '1px solid #e0e0e0'
                  }}>
                    {blok}
                  </td>
                  {weekDates.map((date, dateIdx) => {
                    const key = `${date.toISOString().split('T')[0]}-${blok}`
                    const isAssigned = blokkeringen.some(b =>
                      b.date === date.toISOString().split('T')[0] && b.blok === blok
                    )
                    return (
                      <td
                        key={dateIdx}
                        onClick={() => !isAssigned && handleAddBlock(date, blok)}
                        style={{
                          padding: '0.75rem',
                          textAlign: 'center',
                          borderBottom: '1px solid #e0e0e0',
                          cursor: 'pointer',
                          backgroundColor: isAssigned ? '#d4edda' : 'transparent',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          if (!isAssigned) e.target.style.backgroundColor = '#f0f0f0'
                        }}
                        onMouseLeave={(e) => {
                          if (!isAssigned) e.target.style.backgroundColor = 'transparent'
                        }}
                      >
                        {isAssigned ? '✓' : '-'}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }

    // Desktop: full grid layout
    return (
      <div style={{
        backgroundColor: COLORS.white,
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '2rem'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: COLORS.secondary }}>
              <th style={{
                padding: '1rem',
                color: COLORS.white,
                fontWeight: '600',
                textAlign: 'left',
                borderBottom: '2px solid ' + COLORS.primary
              }}>
                Blok
              </th>
              {weekDates.map((date, idx) => (
                <th
                  key={idx}
                  style={{
                    padding: '1rem',
                    color: COLORS.white,
                    fontWeight: '600',
                    textAlign: 'center',
                    borderBottom: '2px solid ' + COLORS.primary
                  }}
                >
                  <div>{weekdagen[idx]}</div>
                  <div style={{ fontSize: '12px', fontWeight: '400' }}>
                    {date.getDate()}/{date.getMonth() + 1}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {blokken.map((blok, blokIdx) => (
              <tr key={blok} style={{
                backgroundColor: blokIdx % 2 === 0 ? COLORS.white : '#f9f9f9'
              }}>
                <td style={{
                  padding: '1rem',
                  fontWeight: '600',
                  color: COLORS.primary,
                  borderBottom: '1px solid #e0e0e0'
                }}>
                  {blok}
                </td>
                {weekDates.map((date, dateIdx) => {
                  const key = `${date.toISOString().split('T')[0]}-${blok}`
                  const isAssigned = blokkeringen.some(b =>
                    b.date === date.toISOString().split('T')[0] && b.blok === blok
                  )
                  return (
                    <td
                      key={dateIdx}
                      onClick={() => !isAssigned && handleAddBlock(date, blok)}
                      style={{
                        padding: '1rem',
                        textAlign: 'center',
                        borderBottom: '1px solid #e0e0e0',
                        cursor: 'pointer',
                        backgroundColor: isAssigned ? '#d4edda' : 'transparent',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        if (!isAssigned) e.target.style.backgroundColor = '#f0f0f0'
                      }}
                      onMouseLeave={(e) => {
                        if (!isAssigned) e.target.style.backgroundColor = 'transparent'
                      }}
                    >
                      {isAssigned ? '✓' : '-'}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div>
      <h2 style={{
        fontSize: isMobile ? '20px' : '28px',
        fontWeight: '700',
        color: COLORS.primary,
        marginBottom: '1.5rem'
      }}>
        Planning
      </h2>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#999' }}>Laden...</p>
      ) : (
        <>
          <PlanningGrid />

          <div style={{
            backgroundColor: COLORS.white,
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: COLORS.primary,
              marginBottom: '1rem'
            }}>
              Legende
            </h3>
            <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem', fontSize: '14px' }}>
                <strong>Ochtend:</strong> 08:00 - 12:00
              </li>
              <li style={{ marginBottom: '0.5rem', fontSize: '14px' }}>
                <strong>Namiddag:</strong> 13:00 - 17:00
              </li>
              <li style={{ fontSize: '14px' }}>
                <strong>Hele dag:</strong> 08:00 - 17:00
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  )
}
