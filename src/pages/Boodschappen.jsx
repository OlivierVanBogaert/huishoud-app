import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useMobile } from '../hooks/useMobile'

const COLORS = {
  primary: '#1e3a5f',
  secondary: '#2d5f8a',
  white: '#ffffff',
  light: '#f5f5f5',
  danger: '#dc3545'
}

export default function Boodschappen() {
  const { user } = useAuth()
  const isMobile = useMobile()
  const [boodschappen, setBoodschappen] = useState([])
  const [loading, setLoading] = useState(true)
  const [newItem, setNewItem] = useState('')
  const [filterDone, setFilterDone] = useState(false)

  useEffect(() => {
    loadBoodschappen()
  }, [user])

  const loadBoodschappen = async () => {
    try {
      setLoading(true)
      // Mock data for now - will be replaced with real Supabase queries
      setBoodschappen([])
    } catch (error) {
      console.error('Error loading boodschappen:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddItem = async (e) => {
    e.preventDefault()
    if (!newItem.trim()) return

    try {
      // This will be implemented once Supabase schema is set up
      setNewItem('')
      await loadBoodschappen()
    } catch (error) {
      console.error('Error adding item:', error)
    }
  }

  const handleToggleItem = async (id, currentDone) => {
    try {
      // This will be implemented once Supabase schema is set up
      await loadBoodschappen()
    } catch (error) {
      console.error('Error updating item:', error)
    }
  }

  const handleDeleteItem = async (id) => {
    try {
      // This will be implemented once Supabase schema is set up
      await loadBoodschappen()
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }

  const undone = boodschappen.filter(b => !b.gedaan)
  const done = boodschappen.filter(b => b.gedaan)

  return (
    <div>
      <h2 style={{
        fontSize: isMobile ? '20px' : '28px',
        fontWeight: '700',
        color: COLORS.primary,
        marginBottom: '1.5rem'
      }}>
        Boodschappenlijst
      </h2>

      {/* Add Item Form */}
      <div style={{
        backgroundColor: COLORS.white,
        borderRadius: '8px',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <form onSubmit={handleAddItem} style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Voeg item toe..."
            style={{
              flex: 1,
              padding: '0.75rem',
              borderRadius: '6px',
              border: `1px solid ${COLORS.secondary}`,
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
          <button
            type="submit"
            style={{
              padding: isMobile ? '0.75rem 1rem' : '0.75rem 1.5rem',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: COLORS.secondary,
              color: COLORS.white,
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              whiteSpace: 'nowrap'
            }}
          >
            {isMobile ? '+' : '+ Toevoegen'}
          </button>
        </form>
      </div>

      {/* Filter Toggle */}
      <div style={{ marginBottom: '1.5rem' }}>
        <button
          onClick={() => setFilterDone(!filterDone)}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: filterDone ? COLORS.secondary : 'transparent',
            color: filterDone ? COLORS.white : COLORS.secondary,
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s',
            borderBottom: filterDone ? 'none' : `2px solid ${COLORS.secondary}`
          }}
        >
          {filterDone ? 'Alles weergeven' : 'Alleen openstaande'}
        </button>
      </div>

      {/* Items List */}
      {loading ? (
        <p style={{ textAlign: 'center', color: '#999' }}>Laden...</p>
      ) : (
        <>
          {/* Undone Items */}
          <div style={{
            backgroundColor: COLORS.white,
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            marginBottom: undone.length > 0 ? '1.5rem' : 0
          }}>
            {undone.length === 0 ? (
              <p style={{
                padding: '1.5rem',
                textAlign: 'center',
                color: '#999',
                margin: 0
              }}>
                Alles afgevinkt !🎉
              </p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {undone.map((item, idx) => (
                  <li
                    key={item.id}
                    style={{
                      padding: '1rem',
                      borderBottom: idx < undone.length - 1 ? '1px solid #e0e0e0' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={false}
                      onChange={() => handleToggleItem(item.id, false)}
                      style={{
                        width: '20px',
                        height: '20px',
                        cursor: 'pointer'
                      }}
                    />
                    <span style={{ flex: 1, fontSize: '14px' }}>
                      {item.item}
                    </span>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '4px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: COLORS.danger,
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}
                    >
                      Verwijder
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Done Items */}
          {done.length > 0 && !filterDone && (
            <div style={{
              backgroundColor: COLORS.white,
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                padding: '1rem',
                backgroundColor: '#d4edda',
                borderBottom: '1px solid #c3e6cb',
                fontWeight: '600',
                color: '#155724'
              }}>
                Afgevinkt ({done.length})
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {done.map((item, idx) => (
                  <li
                    key={item.id}
                    style={{
                      padding: '1rem',
                      borderBottom: idx < done.length - 1 ? '1px solid #e0e0e0' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      backgroundColor: '#f9f9f9'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={true}
                      onChange={() => handleToggleItem(item.id, true)}
                      style={{
                        width: '20px',
                        height: '20px',
                        cursor: 'pointer'
                      }}
                    />
                    <span style={{
                      flex: 1,
                      fontSize: '14px',
                      textDecoration: 'line-through',
                      color: '#999'
                    }}>
                      {item.item}
                    </span>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '4px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: COLORS.danger,
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}
                    >
                      Verwijder
                    </button>
                  </li>
               ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  )
}
