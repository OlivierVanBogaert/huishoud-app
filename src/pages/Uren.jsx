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

export default function Uren() {
  const { user } = useAuth()
  const isMobile = useMobile()
  const [uren, setUren] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    datum: new Date().toISOString().split('T')[0],
    startTijd: '08:00',
    eindeTijd: '17:00',
    pauzeMitten: '30'
  })

  useEffect(() => {
    loadUren()
  }, [user])

  const loadUren = async () => {
    try {
      setLoading(true)
      // Mock data for now - will be replaced with real Supabase queries
      setUren([])
    } catch (error) {
      console.error('Error loading uren:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddUren = async (e) => {
    e.preventDefault()

    try {
      // This will be implemented once Supabase schema is set up
      setFormData({
        datum: new Date().toISOString().split('T')[0],
        startTijd: '08:00',
        eindeTijd: '17:00',
        pauzeMitten: '30'
      })
      setShowForm(false)
      await loadUren()
    } catch (error) {
      console.error('Error adding uren:', error)
    }
  }

  const calculateNettoHours = (startTijd, eindeTijd, pauzeMitten) => {
    const [startHour, startMin] = startTijd.split(':').map(Number)
    const [endHour, endMin] = eindeTijd.split(':').map(Number)

    const startTotal = startHour * 60 + startMin
    const endTotal = endHour * 60 + endMin
    const grossMinutes = endTotal - startTotal
    const nettoMinutes = grossMinutes - pauzeMitten
    const hours = Math.floor(nettoMinutes / 60)
    const minutes = nettoMinutes % 60

    return `${hours}h ${minutes}m`
  }

  const grossHours = uren.reduce((total, u) => {
    const [startHour, startMin] = u.startTijd.split(':').map(Number)
    const [endHour, endMin] = u.eindeTijd.split(':').map(Number)
    return total + (endHour * 60 + endMin - startHour * 60 - startMin)
  }, 0)

  const totalPauze = uren.reduce((total, u) => total + u.pauzeMitten, 0)
  const nettoHours = grossHours - totalPauze

  return (
    <div>
      <h2 style={{
        fontSize: isMobile ? '20px' : '28px',
        fontWeight: '700',
        color: COLORS.primary,
        marginBottom: '1.5rem'
      }}>
        Uren
      </h2>

      {/* Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{
          backgroundColor: COLORS.white,
          borderRadius: '8px',
          padding: '1rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '12px', color: '#999', marginBottom: '0.5rem' }}>
            Bruto uren
          </div>
          <div style={{
            fontSize: isMobile ? '24px' : '28px',
            fontWeight: '700',
            color: COLORS.primary
          }}>
            {Math.floor(grossHours / 60)}h {grossHours % 60}m
          </div>
        </div>

        <div style={{
          backgroundColor: COLORS.white,
          borderRadius: '8px',
          padding: '1rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '12px', color: '#999', marginBottom: '0.5rem' }}>
            Pauze
          </div>
          <div style={{
            fontSize: isMobile ? '24px' : '28px',
            fontWeight: '700',
            color: COLORS.primary
          }}>
            {Math.floor(totalPauze / 60)}h {totalPauze % 60}m
          </div>
        </div>

        <div style={{
          backgroundColor: COLORS.white,
          borderRadius: '8px',
          padding: '1rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          textAlign: 'center',
          gridColumn: isMobile ? 'span 2' : 'auto'
        }}>
          <div style={{ fontSize: '12px', color: '#999', marginBottom: '0.5rem' }}>
            Netto uren
          </div>
          <div style={{
            fontSize: isMobile ? '24px' : '28px',
            fontWeight: '700',
            color: COLORS.primary
          }}>
            {Math.floor(nettoHours / 60)}h {nettoHours % 60}m
          </div>
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <div style={{
          backgroundColor: COLORS.white,
          borderRadius: '8px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: COLORS.primary,
            marginBottom: '1rem'
          }}>
            Uren toevoegen
          </h3>

          <form onSubmit={handleAddUren}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: COLORS.primary,
                marginBottom: '0.5rem'
              }}>
                Datum
              </label>
              <input
                type="date"
                value={formData.datum}
                onChange={(e) => setFormData({ ...formData, datum: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  border: `1px solid ${COLORS.secondary}`,
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: COLORS.primary,
                  marginBottom: '0.5rem'
                }}>
                  Starttijd
                </label>
                <input
                  type="time"
                  value={formData.startTijd}
                  onChange={(e) => setFormData({ ...formData, startTijd: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    border: `1px solid ${COLORS.secondary}`,
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: COLORS.primary,
                  marginBottom: '0.5rem'
                }}>
                  Eindtijd
                </label>
                <input
                  type="time"
                  value={formData.eindeTijd}
                  onChange={(e) => setFormData({ ...formData, eindeTijd: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    border: `1px solid ${COLORS.secondary}`,
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: COLORS.primary,
                marginBottom: '0.5rem'
              }}>
                Pauze (minuten)
              </label>
              <input
                type="number"
                value={formData.pauzeMitten}
                onChange={(e) => setFormData({ ...formData, pauzeMitten: e.target.value })}
                min="0"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  border: `1px solid ${COLORS.secondary}`,
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{
              padding: '1rem',
              backgroundColor: COLORS.light,
              borderRadius: '6px',
              marginBottom: '1rem',
              fontSize: '14px',
              fontWeight: '500',
              color: COLORS.primary
            }}>
              Netto: {calculateNettoHours(formData.startTijd, formData.eindeTijd, parseInt(formData.pauzeMitten))}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="submit"
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: COLORS.secondary,
                  color: COLORS.white,
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                Opslaan
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '6px',
                  border: `1px solid ${COLORS.secondary}`,
                  backgroundColor: COLORS.white,
                  color: COLORS.secondary,
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                Annuleren
              </button>
            </div>
          </form>
        </div>
      )}

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: COLORS.secondary,
            color: COLORS.white,
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '1.5rem'
          }}
        >
          + Uren toevoegen
        </button>
      )}

      {/* Uren List */}
      {loading ? (
        <p style={{ textAlign: 'center', color: '#999' }}>Laden...</p>
      ) : uren.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999' }}>Nog geen uren ingevoerd</p>
      ) : (
        <div style={{
          backgroundColor: COLORS.white,
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: COLORS.secondary }}>
                <th style={{
                  padding: '1rem',
                  color: COLORS.white,
                  fontWeight: '600',
                  textAlign: 'left',
                  fontSize: '14px'
                }}>
                  Datum
                </th>
                <th style={{
                  padding: '1rem',
                  color: COLORS.white,
                  fontWeight: '600',
                  textAlign: 'center',
                  fontSize: '14px'
                }}>
                  Start
                </th>
                <th style={{
                  padding: '1rem',
                  color: COLORS.white,
                  fontWeight: '600',
                  textAlign: 'center',
                  fontSize: '14px'
                }}>
                  Einde
                </th>
                <th style={{
                  padding: '1rem',
                  color: COLORS.white,
                  fontWeight: '600',
                  textAlign: 'center',
                  fontSize: '14px'
                }}>
                  Netto
                </th>
              </tr>
            </thead>
            <tbody>
              {uren.map((entry, idx) => (
                <tr
                  key={idx}
                  style={{
                    backgroundColor: idx % 2 === 0 ? COLORS.white : '#f9f9f9',
                    borderBottom: '1px solid #e0e0e0'
                  }}
                >
                  <td style={{ padding: '1rem', fontSize: '14px' }}>
                    {new Date(entry.datum).toLocaleDateString('nl-NL')}
                  </td>
                  <td style={{ padding: '1rem', fontSize: '14px', textAlign: 'center' }}>
                    {entry.startTijd}
                  </td>
                  <td style={{ padding: '1rem', fontSize: '14px', textAlign: 'center' }}>
                    {entry.eindeTijd}
                  </td>
                  <td style={{ padding: '1rem', fontSize: '14px', textAlign: 'center', fontWeight: '600' }}>
                    {calculateNettoHours(entry.startTijd, entry.eindeTijd, entry.pauzeMitten)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
