import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useMobile } from '../hooks/useMobile'
import ChipSelect from '../components/ChipSelect'

const HUIS_IDS = {
  "🏠 Olivier & Ashley": "ada24453-c203-4639-be69-0cdae55df9f4",
  "🏡 Jan": "b678cfb5-66be-4a29-8200-7b417e9e7ff5"
}

const HUIS_NAMEN = Object.fromEntries(Object.entries(HUIS_IDS).map(([k, v]) => [v, k]))
const HUISHOUDENS = ["🏠 Olivier & Ashley", "🏡 Jan"]

export default function Boodschappen() {
  const { user } = useAuth()
  const isMobile = useMobile()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [newItemText, setNewItemText] = useState('')
  const [selectedHuis, setSelectedHuis] = useState(null)

  const magAllesZien = user?.permissions?.length > 1
  const visibleHuisIds = user?.permissions?.map(perm => HUIS_IDS[perm]).filter(Boolean) || []
  const defaultHuis = visibleHuisIds[0]

  useEffect(() => {
    if (visibleHuisIds.length > 0) {
      setSelectedHuis(defaultHuis)
      loadItems()
    }
  }, [user, visibleHuisIds.length])

  const loadItems = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('boodschappen')
        .select('*')
        .in('huis_id', visibleHuisIds)
        .order('created_at', { ascending: true })

      if (error) throw error
      setItems(data || [])
    } catch (error) {
      console.error('Error loading boodschappen:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddItem = async (huisId) => {
    if (!newItemText.trim()) return

    try {
      const { error } = await supabase
        .from('boodschappen')
        .insert({
          item: newItemText,
          huis_id: huisId,
          gedaan: false
        })

      if (error) throw error
      setNewItemText('')
      await loadItems()
    } catch (error) {
      console.error('Error adding item:', error)
    }
  }

  const handleToggleItem = async (id, currentDone) => {
    try {
      const { error } = await supabase
        .from('boodschappen')
        .update({ gedaan: !currentDone })
        .eq('id', id)

      if (error) throw error
      await loadItems()
    } catch (error) {
      console.error('Error updating item:', error)
    }
  }

  const handleDeleteItem = async (id) => {
    try {
      const { error } = await supabase
        .from('boodschappen')
        .delete()
        .eq('id', id)

      if (error) throw error
      await loadItems()
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }

  if (loading) {
    return <p style={{ textAlign: 'center', color: '#999' }}>Laden...</p>
  }

  if (!user || visibleHuisIds.length === 0) {
    return <p style={{ textAlign: 'center', color: '#999' }}>Geen huishoudens toegankelijk</p>
  }

  const huishoudenToShow = magAllesZien ? visibleHuisIds : [defaultHuis]

  return (
    <div>
      <h1 style={{ fontSize: isMobile ? 18 : 24, fontWeight: 600, color: "#1e293b", margin: "0 0 16px" }}>
        Boodschappen
      </h1>

      <div style={{
        backgroundColor: "white",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
      }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
          <input
            placeholder="Nieuw item"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddItem(selectedHuis || defaultHuis)
              }
            }}
            style={{
              flex: 1,
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid #d1d5db",
              fontSize: 13,
              minHeight: 44,
              minWidth: isMobile ? "100%" : "auto",
              boxSizing: "border-box"
            }}
          />
          {magAllesZien && (
            <ChipSelect
              opties={huishoudenToShow.map(id => HUIS_NAMEN[id])}
              waarde={HUIS_NAMEN[selectedHuis] || HUIS_NAMEN[defaultHuis]}
              onChange={(name) => setSelectedHuis(HUIS_IDS[name])}
            />
          )}
          <button
            onClick={() => handleAddItem(selectedHuis || defaultHuis)}
            style={{
              padding: "10px 16px",
              backgroundColor: "#1e3a5f",
              color: "white",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 13,
              minHeight: 44,
              whiteSpace: "nowrap"
            }}
          >
            + Voeg toe
          </button>
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : magAllesZien ? "repeat(2, 1fr)" : "1fr",
        gap: 16
      }}>
        {huishoudenToShow.map(huisId => {
          const huisItems = items.filter(i => i.huis_id === huisId)
          const undone = huisItems.filter(i => !i.gedaan)
          const done = huisItems.filter(i => i.gedaan)

          return (
            <div key={huisId}>
              {magAllesZien && (
                <h3 style={{ fontSize: 14, fontWeight: 600, color: "#1e293b", margin: "0 0 12px" }}>
                  {HUIS_NAMEN[huisId]}
                </h3>
              )}

              <div style={{
                backgroundColor: "white",
                borderRadius: 12,
                padding: 16,
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
              }}>
                {undone.length === 0 && done.length === 0 ? (
                  <p style={{
                    margin: 0,
                    padding: 12,
                    textAlign: "center",
                    color: "#94a3b8",
                    fontSize: 13
                  }}>
                    Alles afgevinkt! 🎉
                  </p>
                ) : (
                  <>
                    {undone.map((item, idx) => (
                      <div
                        key={item.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "10px 0",
                          borderBottom: idx < undone.length - 1 || done.length > 0 ? "1px solid #f1f5f9" : "none",
                          minHeight: 44
                        }}
                      >
                        <label style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          minHeight: 44,
                          minWidth: 44,
                          cursor: "pointer"
                        }}>
                          <input
                            type="checkbox"
                            checked={false}
                            onChange={() => handleToggleItem(item.id, false)}
                            style={{ width: 20, height: 20, cursor: "pointer" }}
                          />
                        </label>
                        <span style={{
                          flex: 1,
                          fontSize: 13,
                          color: "#1e293b"
                        }}>
                          {item.item}
                        </span>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: 12,
                            color: "#ef4444",
                            padding: "4px 8px",
                            minHeight: 44,
                            fontWeight: 500
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}

                    {done.length > 0 && (
                      <>
                        <div style={{
                          padding: "10px 0",
                          borderTop: undone.length > 0 ? "1px solid #f1f5f9" : "none",
                          borderBottom: "1px solid #f1f5f9",
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#475569"
                        }}>
                          Afgevinkt ({done.length})
                        </div>
                        {done.map((item, idx) => (
                          <div
                            key={item.id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                              padding: "10px 0",
                              borderBottom: idx < done.length - 1 ? "1px solid #f1f5f9" : "none",
                              minHeight: 44,
                              backgroundColor: "#f8fafc"
                            }}
                          >
                            <label style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              minHeight: 44,
                              minWidth: 44,
                              cursor: "pointer"
                            }}>
                              <input
                                type="checkbox"
                                checked={true}
                                onChange={() => handleToggleItem(item.id, true)}
                                style={{ width: 20, height: 20, cursor: "pointer" }}
                              />
                            </label>
                            <span style={{
                              flex: 1,
                              fontSize: 13,
                              color: "#94a3b8",
                              textDecoration: "line-through"
                            }}>
                              {item.item}
                            </span>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                fontSize: 12,
                                color: "#ef4444",
                                padding: "4px 8px",
                                minHeight: 44,
                                fontWeight: 500
                              }}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
