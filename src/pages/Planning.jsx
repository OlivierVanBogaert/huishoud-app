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
const DAGEN = ["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag"]
const TIJDSLOTEN = ["Ochtend", "Namiddag", "Hele dag"]

function getWeekDatums() {
  const vandaag = new Date()
  const dagVanWeek = vandaag.getDay()
  const maandag = new Date(vandaag)
  maandag.setDate(vandaag.getDate() - (dagVanWeek === 0 ? 6 : dagVanWeek - 1))

  return DAGEN.map((dag, i) => {
    const d = new Date(maandag)
    d.setDate(maandag.getDate() + i)
    return {
      dag,
      datum: `${d.getDate()}/${d.getMonth() + 1}`,
      volledig: d.toISOString().slice(0, 10)
    }
  })
}

export default function Planning() {
  const { user } = useAuth()
  const isMobile = useMobile()
  const [blokken, setBlokken] = useState([])
  const [loading, setLoading] = useState(true)
  const [weekDatums, setWeekDatums] = useState([])
  const [addingBlok, setAddingBlok] = useState({})
  const [formData, setFormData] = useState({})
  const [dayIndex, setDayIndex] = useState(0)

  const magAllesZien = user?.permissions?.length > 1
  const visibleHuisIds = user?.permissions?.map(perm => HUIS_IDS[perm]).filter(Boolean) || []

  useEffect(() => {
    setWeekDatums(getWeekDatums())
    if (user && visibleHuisIds.length > 0) {
      loadBlokken()
    }
  }, [user, visibleHuisIds.length])

  const loadBlokken = async () => {
    try {
      setLoading(true)
      const weekData = getWeekDatums()
      const weekStart = weekData[0].volledig
      const weekEnd = weekData[weekData.length - 1].volledig

      const { data, error } = await supabase
        .from('blokken')
        .select('*')
        .gte('dag', weekStart)
        .lte('dag', weekEnd)
        .in('huis_id', visibleHuisIds)
        .order('dag', { ascending: true })

      if (error) throw error
      setBlokken(data || [])
    } catch (error) {
      console.error('Error loading blokken:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddBlok = async (dagDatum, huisId) => {
    const key = `${dagDatum}-${huisId}`
    const blokNaam = formData[key]?.blok?.trim()

    if (!blokNaam) return

    try {
      const { error } = await supabase
        .from('blokken')
        .insert({
          dag: dagDatum,
          blok: blokNaam,
          huis_id: huisId,
          tijdslot: formData[key]?.tijdslot || "Ochtend",
          gebruiker_id: user.id
        })

      if (error) throw error

      setFormData(prev => {
        const updated = { ...prev }
        delete updated[key]
        return updated
      })
      setAddingBlok(prev => {
        const updated = { ...prev }
        delete updated[key]
        return updated
      })
      await loadBlokken()
    } catch (error) {
      console.error('Error adding blok:', error)
    }
  }

  const handleDeleteBlok = async (id) => {
    try {
      const { error } = await supabase
        .from('blokken')
        .delete()
        .eq('id', id)

      if (error) throw error
      await loadBlokken()
    } catch (error) {
      console.error('Error deleting blok:', error)
    }
  }

  if (loading) {
    return <p style={{ textAlign: 'center', color: '#999' }}>Laden...</p>
  }

  if (!user || visibleHuisIds.length === 0) {
    return <p style={{ textAlign: 'center', color: '#999' }}>Geen huishoudens toegankelijk</p>
  }

  if (isMobile) {
    const currentDay = weekDatums[dayIndex]

    return (
      <div>
        <h1 style={{ fontSize: 16, fontWeight: 600, color: "#1e293b", margin: 0 }}>Week planning</h1>
        <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 16 }}>
          {weekDatums[0].datum} - {weekDatums[4].datum}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 8 }}>
          <button
            onClick={() => setDayIndex(Math.max(0, dayIndex - 1))}
            disabled={dayIndex === 0}
            style={{
              padding: "6px 10px",
              border: "1px solid #d1d5db",
              background: "white",
              borderRadius: 6,
              cursor: dayIndex === 0 ? "default" : "pointer",
              minHeight: 44,
              minWidth: 44,
              fontWeight: 600,
              opacity: dayIndex === 0 ? 0.5 : 1
            }}
          >
            ←
          </button>
          <div style={{ flex: 1, textAlign: "center" }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: "#1e293b", margin: 0 }}>
              {currentDay.dag}
            </h2>
            <span style={{ fontSize: 12, color: "#94a3b8" }}>{currentDay.datum}</span>
          </div>
          <button
            onClick={() => setDayIndex(Math.min(4, dayIndex + 1))}
            disabled={dayIndex === 4}
            style={{
              padding: "6px 10px",
              border: "1px solid #d1d5db",
              background: "white",
              borderRadius: 6,
              cursor: dayIndex === 4 ? "default" : "pointer",
              minHeight: 44,
              minWidth: 44,
              fontWeight: 600,
              opacity: dayIndex === 4 ? 0.5 : 1
            }}
          >
            →
          </button>
        </div>

        {visibleHuisIds.map(huisId => {
          const dayBlokken = blokken.filter(b => b.dag === currentDay.volledig && b.huis_id === huisId)
          const key = `${currentDay.volledig}-${huisId}`

          return (
            <div key={huisId} style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", margin: "0 0 8px" }}>
                {HUIS_NAMEN[huisId]}
              </h3>

              {dayBlokken.map(blok => (
                <div
                  key={blok.id}
                  style={{
                    padding: 12,
                    marginBottom: 8,
                    backgroundColor: "#f8fafc",
                    borderRadius: 8,
                    borderLeft: "3px solid #1e3a5f",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start"
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, fontSize: 12, color: "#1e293b" }}>{blok.blok}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>{blok.tijdslot}</div>
                  </div>
                  <button
                    onClick={() => handleDeleteBlok(blok.id)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: 12,
                      color: "#ef4444",
                      padding: "2px 4px",
                      minHeight: 44,
                      minWidth: 44
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}

              {!addingBlok[key] ? (
                <button
                  onClick={() => setAddingBlok(prev => ({ ...prev, [key]: true }))}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 6,
                    border: "1px solid #e2e8f0",
                    background: "white",
                    color: "#475569",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 500,
                    minHeight: 44,
                    width: "100%"
                  }}
                >
                  + Blok toevoegen
                </button>
              ) : (
                <div style={{ padding: 12, backgroundColor: "white", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                  <input
                    placeholder="Bloknaam"
                    value={formData[key]?.blok || ""}
                    onChange={(e) =>
                      setFormData(prev => ({
                        ...prev,
                        [key]: { ...prev[key], blok: e.target.value }
                      }))
                    }
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      borderRadius: 6,
                      border: "1px solid #d1d5db",
                      fontSize: 12,
                      marginBottom: 8,
                      boxSizing: "border-box",
                      minHeight: 44
                    }}
                  />
                  <ChipSelect
                    opties={TIJDSLOTEN}
                    waarde={formData[key]?.tijdslot || "Ochtend"}
                    onChange={(val) =>
                      setFormData(prev => ({
                        ...prev,
                        [key]: { ...prev[key], tijdslot: val }
                      }))
                    }
                    small
                  />
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <button
                      onClick={() => handleAddBlok(currentDay.volledig, huisId)}
                      style={{
                        flex: 1,
                        padding: "8px 12px",
                        borderRadius: 6,
                        border: "none",
                        background: "#1e3a5f",
                        color: "white",
                        cursor: "pointer",
                        fontSize: 12,
                        fontWeight: 600,
                        minHeight: 44
                      }}
                    >
                      Toevoegen
                    </button>
                    <button
                      onClick={() =>
                        setAddingBlok(prev => {
                          const updated = { ...prev }
                          delete updated[key]
                          return updated
                        })
                      }
                      style={{
                        flex: 1,
                        padding: "8px 12px",
                        borderRadius: 6,
                        border: "1px solid #d1d5db",
                        background: "white",
                        color: "#475569",
                        cursor: "pointer",
                        fontSize: 12,
                        fontWeight: 600,
                        minHeight: 44
                      }}
                    >
                      Annuleer
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 600, color: "#1e293b", margin: "0 0 4px" }}>
        Week planning
      </h1>
      <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 16 }}>
        {weekDatums[0].datum} - {weekDatums[4].datum}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
        {weekDatums.map(({ dag, datum, volledig }) => {
          const dayBlokken = blokken.filter(b => b.dag === volledig)

          return (
            <div
              key={volledig}
              style={{
                backgroundColor: "white",
                borderRadius: 12,
                padding: 12,
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
              }}
            >
              <h3 style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", margin: "0 0 2px" }}>
                {dag}
              </h3>
              <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 8 }}>{datum}</div>

              {dayBlokken.map(blok => (
                <div
                  key={blok.id}
                  style={{
                    padding: 8,
                    marginBottom: 6,
                    backgroundColor: "#f8fafc",
                    borderRadius: 6,
                    borderLeft: "2px solid #1e3a5f"
                  }}
                >
                  <div style={{ fontWeight: 500, fontSize: 12, color: "#1e293b" }}>{blok.blok}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{blok.tijdslot}</div>
                  {magAllesZien && (
                    <div style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>
                      {HUIS_NAMEN[blok.huis_id]}
                    </div>
                  )}
                  <button
                    onClick={() => handleDeleteBlok(blok.id)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: 12,
                      color: "#ef4444",
                      padding: "2px 4px",
                      marginTop: 4,
                      minHeight: 44,
                      fontWeight: 500
                    }}
                  >
                    ✕ Verwijder
                  </button>
                </div>
              ))}

              {visibleHuisIds.length === 1 ? (
                <>
                  {!addingBlok[volledig] ? (
                    <button
                      onClick={() => setAddingBlok(prev => ({ ...prev, [volledig]: true }))}
                      style={{
                        width: "100%",
                        padding: "8px 10px",
                        borderRadius: 6,
                        border: "1px solid #e2e8f0",
                        background: "white",
                        color: "#475569",
                        cursor: "pointer",
                        fontSize: 12,
                        fontWeight: 500,
                        marginTop: 8,
                        minHeight: 44
                      }}
                    >
                      + Blok
                    </button>
                  ) : (
                    <div style={{ padding: 8, marginTop: 8, backgroundColor: "#f8fafc", borderRadius: 6 }}>
                      <input
                        placeholder="Bloknaam"
                        value={formData[volledig]?.blok || ""}
                        onChange={(e) =>
                          setFormData(prev => ({
                            ...prev,
                            [volledig]: { ...prev[volledig], blok: e.target.value }
                          }))
                        }
                        style={{
                          width: "100%",
                          padding: "6px 8px",
                          borderRadius: 4,
                          border: "1px solid #d1d5db",
                          fontSize: 11,
                          marginBottom: 6,
                          boxSizing: "border-box",
                          minHeight: 44
                        }}
                      />
                      <ChipSelect
                        opties={TIJDSLOTEN}
                        waarde={formData[volledig]?.tijdslot || "Ochtend"}
                        onChange={(val) =>
                          setFormData(prev => ({
                            ...prev,
                            [volledig]: { ...prev[volledig], tijdslot: val }
                          }))
                        }
                        small
                      />
                      <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
                        <button
                          onClick={() => handleAddBlok(volledig, visibleHuisIds[0])}
                          style={{
                            flex: 1,
                            padding: "4px 8px",
                            borderRadius: 4,
                            border: "none",
                            background: "#1e3a5f",
                            color: "white",
                            cursor: "pointer",
                            fontSize: 11,
                            fontWeight: 600,
                            minHeight: 44
                          }}
                        >
                          OK
                        </button>
                        <button
                          onClick={() =>
                            setAddingBlok(prev => {
                              const updated = { ...prev }
                              delete updated[volledig]
                              return updated
                            })
                          }
                          style={{
                            flex: 1,
                            padding: "4px 8px",
                            borderRadius: 4,
                            border: "1px solid #d1d5db",
                            background: "white",
                            color: "#475569",
                            cursor: "pointer",
                            fontSize: 11,
                            fontWeight: 600,
                            minHeight: 44
                          }}
                        >
                          X
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {magAllesZien &&
                    visibleHuisIds.map(huisId => {
                      const key = `${volledig}-${huisId}`
                      return (
                        <div key={huisId} style={{ marginTop: 8 }}>
                          <div style={{ fontSize: 10, fontWeight: 600, color: "#475569", marginBottom: 4 }}>
                            {HUIS_NAMEN[huisId]}
                          </div>
                          {!addingBlok[key] ? (
                            <button
                              onClick={() => setAddingBlok(prev => ({ ...prev, [key]: true }))}
                              style={{
                                width: "100%",
                                padding: "6px 8px",
                                borderRadius: 4,
                                border: "1px solid #e2e8f0",
                                background: "white",
                                color: "#475569",
                                cursor: "pointer",
                                fontSize: 10,
                                fontWeight: 500,
                                minHeight: 44
                              }}
                            >
                              + Blok
                            </button>
                          ) : (
                            <div style={{ padding: 6, backgroundColor: "#f8fafc", borderRadius: 4 }}>
                              <input
                                placeholder="Bloknaam"
                                value={formData[key]?.blok || ""}
                                onChange={(e) =>
                                  setFormData(prev => ({
                                    ...prev,
                                    [key]: { ...prev[key], blok: e.target.value }
                                  }))
                                }
                                style={{
                                  width: "100%",
                                  padding: "4px 6px",
                                  borderRadius: 3,
                                  border: "1px solid #d1d5db",
                                  fontSize: 10,
                                  marginBottom: 4,
                                  boxSizing: "border-box",
                                  minHeight: 44
                                }}
                              />
                              <ChipSelect
                                opties={TIJDSLOTEN}
                                waarde={formData[key]?.tijdslot || "Ochtend"}
                                onChange={(val) =>
                                  setFormData(prev => ({
                                    ...prev,
                                    [key]: { ...prev[key], tijdslot: val }
                                  }))
                                }
                                small
                              />
                              <div style={{ display: "flex", gap: 3, marginTop: 4 }}>
                                <button
                                  onClick={() => handleAddBlok(volledig, huisId)}
                                  style={{
                                    flex: 1,
                                    padding: "3px 6px",
                                    borderRadius: 3,
                                    border: "none",
                                    background: "#1e3a5f",
                                    color: "white",
                                    cursor: "pointer",
                                    fontSize: 9,
                                    fontWeight: 600,
                                    minHeight: 44
                                  }}
                                >
                                  OK
                                </button>
                                <button
                                  onClick={() =>
                                    setAddingBlok(prev => {
                                      const updated = { ...prev }
                                      delete updated[key]
                                      return updated
                                    })
                                  }
                                  style={{
                                    flex: 1,
                                    padding: "3px 6px",
                                    borderRadius: 3,
                                    border: "1px solid #d1d5db",
                                    background: "white",
                                    color: "#475569",
                                    cursor: "pointer",
                                    fontSize: 9,
                                    fontWeight: 600,
                                    minHeight: 44
                                  }}
                                >
                                  X
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
