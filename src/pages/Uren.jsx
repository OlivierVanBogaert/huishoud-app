import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useMobile } from '../hooks/useMobile'

function berekenUren(start, einde, pauze) {
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = einde.split(':').map(Number)
  const totaalMin = (eh * 60 + em) - (sh * 60 + sm) - pauze
  return {
    text: `${Math.floor(totaalMin / 60)}u${(totaalMin % 60).toString().padStart(2, '0')}`,
    minuten: totaalMin
  }
}

export default function Uren() {
  const { user } = useAuth()
  const isMobile = useMobile()
  const [uren, setUren] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    datum: new Date().toISOString().split('T')[0],
    start_tijd: '08:00',
    einde_tijd: '17:00',
    pauze_minuten: 0
  })

  useEffect(() => {
    if (user?.id) {
      loadUren()
    }
  }, [user?.id])

  const loadUren = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('uren')
        .select('*')
        .eq('gebruiker_id', user.id)
        .order('datum', { ascending: false })

      if (error) throw error
      setUren(data || [])
    } catch (error) {
      console.error('Error loading uren:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddUren = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const { error } = await supabase
        .from('uren')
        .insert({
          gebruiker_id: user.id,
          datum: formData.datum,
          start_tijd: formData.start_tijd,
          einde_tijd: formData.einde_tijd,
          pauze_minuten: parseInt(formData.pauze_minuten) || 0
        })

      if (error) throw error

      setFormData({
        datum: new Date().toISOString().split('T')[0],
        start_tijd: '08:00',
        einde_tijd: '17:00',
        pauze_minuten: 0
      })
      setShowForm(false)
      await loadUren()
    } catch (error) {
      console.error('Error adding uren:', error)
    } finally {
      setSubmitting(false)
    }
  }

  // Calculate total hours
  let totalMinuten = 0
  uren.forEach((u) => {
    const calc = berekenUren(u.start_tijd, u.einde_tijd, u.pauze_minuten)
    totalMinuten += calc.minuten
  })
  const totalHours = Math.floor(totalMinuten / 60)
  const totalMins = totalMinuten % 60
  const totalDisplay = `${totalHours}u${totalMins.toString().padStart(2, '0')}`

  return (
    <div>
      <h2 style={{
        fontSize: isMobile ? '20px' : '28px',
        fontWeight: '700',
        color: '#1e3a5f',
        marginBottom: '1.5rem'
      }}>
        Gewerkte uren
      </h2>

      {/* Total + Button */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <div style={{
          fontSize: 13,
          color: '#64748b',
          marginBottom: 12
        }}>
          Totaal: <span style={{
            fontSize: 16,
            fontWeight: 700,
            color: '#1e3a5f'
          }}>
            {totalDisplay}
          </span>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            style={{
              padding: '10px 16px',
              backgroundColor: '#1e3a5f',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 600,
              minHeight: 44
            }}
          >
            + Handmatig invoeren
          </button>
        )}
      </div>

      {/* Manual entry form */}
      {showForm && (
        <div style={{
          marginTop: 12,
          padding: 12,
          backgroundColor: '#f8fafc',
          borderRadius: 8,
          marginBottom: 16
        }}>
          <form onSubmit={handleAddUren}>
            <div style={{ marginBottom: 12 }}>
              <label style={{
                fontSize: 12,
                fontWeight: 600,
                color: '#475569',
                display: 'block',
                marginBottom: 6
              }}>
                Datum
              </label>
              <input
                type="date"
                value={formData.datum}
                onChange={(e) => setFormData({ ...formData, datum: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: '1px solid #d1d5db',
                  fontSize: 13,
                  minHeight: 44,
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
              gap: 10,
              marginBottom: 12
            }}>
              <div>
                <label style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#475569',
                  display: 'block',
                  marginBottom: 6
                }}>
                  Start
                </label>
                <input
                  type="time"
                  value={formData.start_tijd}
                  onChange={(e) => setFormData({ ...formData, start_tijd: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: '1px solid #d1d5db',
                    fontSize: 13,
                    minHeight: 44,
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#475569',
                  display: 'block',
                  marginBottom: 6
                }}>
                  Einde
                </label>
                <input
                  type="time"
                  value={formData.einde_tijd}
                  onChange={(e) => setFormData({ ...formData, einde_tijd: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: '1px solid #d1d5db',
                    fontSize: 13,
                    minHeight: 44,
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#475569',
                  display: 'block',
                  marginBottom: 6
                }}>
                  Pauze (min)
                </label>
                <input
                  type="number"
                  value={formData.pauze_minuten}
                  onChange={(e) => setFormData({ ...formData, pauze_minuten: e.target.value })}
                  min="0"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: '1px solid #d1d5db',
                    fontSize: 13,
                    minHeight: 44,
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: '#1e3a5f',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                  minHeight: 44,
                  opacity: submitting ? 0.6 : 1
                }}
              >
                {submitting ? 'Bezig...' : 'Voeg uren toe'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: '#e2e8f0',
                  color: '#64748b',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontWeight: 600,
                  minHeight: 44
                }}
              >
                Annuleer
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Desktop: table */}
      {!isMobile && (
        <>
          {loading ? (
            <p style={{ textAlign: 'center', color: '#94a3b8' }}>Laden...</p>
          ) : uren.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#94a3b8' }}>Nog geen uren ingevoerd</p>
          ) : (
            <div style={{
              backgroundColor: 'white',
              borderRadius: 12,
              padding: 16,
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              overflowX: 'auto'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #d1d5db' }}>
                    <th style={{
                      padding: '10px',
                      textAlign: 'left',
                      fontSize: 12,
                      fontWeight: 600,
                      color: '#475569'
                    }}>
                      Datum
                    </th>
                    <th style={{
                      padding: '10px',
                      textAlign: 'left',
                      fontSize: 12,
                      fontWeight: 600,
                      color: '#475569'
                    }}>
                      Start
                    </th>
                    <th style={{
                      padding: '10px',
                      textAlign: 'left',
                      fontSize: 12,
                      fontWeight: 600,
                      color: '#475569'
                    }}>
                      Einde
                    </th>
                    <th style={{
                      padding: '10px',
                      textAlign: 'left',
                      fontSize: 12,
                      fontWeight: 600,
                      color: '#475569'
                    }}>
                      Pauze
                    </th>
                    <th style={{
                      padding: '10px',
                      textAlign: 'left',
                      fontSize: 12,
                      fontWeight: 600,
                      color: '#475569'
                    }}>
                      Uren
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {uren.map((u) => {
                    const calc = berekenUren(u.start_tijd, u.einde_tijd, u.pauze_minuten)
                    return (
                      <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{
                          padding: '10px',
                          fontSize: 13,
                          color: '#1e293b'
                        }}>
                          {new Date(u.datum).toLocaleDateString('nl-NL')}
                        </td>
                        <td style={{
                          padding: '10px',
                          fontSize: 13,
                          color: '#1e293b'
                        }}>
                          {u.start_tijd}
                        </td>
                        <td style={{
                          padding: '10px',
                          fontSize: 13,
                          color: '#1e293b'
                        }}>
                          {u.einde_tijd}
                        </td>
                        <td style={{
                          padding: '10px',
                          fontSize: 13,
                          color: '#1e293b'
                        }}>
                          {u.pauze_minuten}
                        </td>
                        <td style={{
                          padding: '10px',
                          fontSize: 13,
                          fontWeight: 600,
                          color: '#1e3a5f'
                        }}>
                          {calc.text}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Mobile: card grid */}
      {isMobile && (
        <>
          {loading ? (
            <p style={{ textAlign: 'center', color: '#94a3b8' }}>Laden...</p>
          ) : uren.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#94a3b8' }}>Nog geen uren ingevoerd</p>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 12
            }}>
              {uren.map((u) => {
                const calc = berekenUren(u.start_tijd, u.einde_tijd, u.pauze_minuten)
                return (
                  <div
                    key={u.id}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: 12,
                      padding: 12,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                      border: '1px solid #e2e8f0'
                    }}
                  >
                    <div style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: '#1e3a5f',
                      marginBottom: 8
                    }}>
                      {calc.text}
                    </div>
                    <div style={{
                      fontSize: 12,
                      color: '#94a3b8',
                      marginBottom: 4
                    }}>
                      {new Date(u.datum).toLocaleDateString('nl-NL')}
                    </div>
                    <div style={{
                      fontSize: 11,
                      color: '#64748b'
                    }}>
                      {u.start_tijd} - {u.einde_tijd}
                    </div>
                    {u.pauze_minuten > 0 && (
                      <div style={{
                        fontSize: 11,
                        color: '#64748b'
                      }}>
                        Pauze: {u.pauze_minuten}m
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}
