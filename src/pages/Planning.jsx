import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useMobile } from '../hooks/useMobile'

const HUIS_IDS = {
  "🏠 Olivier & Ashley": "ada24453-c203-4639-be69-0cdae55df9f4",
  "🏡 Jan": "b678cfb5-66be-4a29-8200-7b417e9e7ff5"
}

const HUIS_NAMEN = Object.fromEntries(Object.entries(HUIS_IDS).map(([k, v]) => [v, k]))

const DAGEN = ["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag"]

function getWeekDatums(offset = 0) {
  const vandaag = new Date()
  const dagVanWeek = vandaag.getDay()
  const maandag = new Date(vandaag)
  maandag.setDate(vandaag.getDate() - (dagVanWeek === 0 ? 6 : dagVanWeek - 1) + (offset * 7))

  return DAGEN.map((dag, i) => {
    const d = new Date(maandag)
    d.setDate(maandag.getDate() + i)
    return {
      dag,
      datum: `${d.getDate()}/${d.getMonth() + 1}`,
      volledig: d.toISOString().slice(0, 10),
      weekdag: i
    }
  })
}

const inputStyle = {
  padding: '8px 10px',
  borderRadius: 6,
  border: '1px solid #d1d5db',
  fontSize: 12,
  minHeight: 44,
  boxSizing: 'border-box'
}

const btnPrimary = {
  padding: '8px 12px',
  borderRadius: 6,
  border: 'none',
  background: '#1e3a5f',
  color: 'white',
  cursor: 'pointer',
  fontSize: 12,
  fontWeight: 600,
  minHeight: 44
}

const btnSecondary = {
  padding: '8px 12px',
  borderRadius: 6,
  border: '1px solid #d1d5db',
  background: 'white',
  color: '#475569',
  cursor: 'pointer',
  fontSize: 12,
  fontWeight: 600,
  minHeight: 44
}

// ── Standaard Planning beheer ──────────────────────────
function StandaardBeheer({ visibleHuisIds, user, onClose }) {
  const isMobile = useMobile()
  const [standaardBlokken, setStandaardBlokken] = useState([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(null) // weekdag index or null
  const [form, setForm] = useState({ blok: '', van_tijd: '08:00', tot_tijd: '12:00', huis_id: '' })

  useEffect(() => {
    loadStandaard()
  }, [])

  const loadStandaard = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('standaard_blokken')
        .select('*')
        .in('huis_id', visibleHuisIds)
        .order('weekdag')
        .order('van_tijd')
      if (error) throw error
      setStandaardBlokken(data || [])
    } catch (e) {
      console.error('Error loading standaard:', e)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (weekdag) => {
    if (!form.blok.trim()) return
    const huisId = form.huis_id || visibleHuisIds[0]
    try {
      const { error } = await supabase.from('standaard_blokken').insert({
        weekdag,
        blok: form.blok.trim(),
        huis_id: huisId,
        van_tijd: form.van_tijd,
        tot_tijd: form.tot_tijd,
        gebruiker_id: user.id
      })
      if (error) throw error
      setAdding(null)
      setForm({ blok:Color: 'white',
                  borderRadius: 12,
                  padding: 12,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                }}
              >
                <h3 style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', margin: '0 0 8px' }}>
                  {dag}
                </h3>

                {dagBlokken.map(blok => (
                  <div
                    key={blok.id}
                    style={{
                      padding: 10,
                      marginBottom: 6,
                      backgroundColor: '#f0f7ff',
                      borderRadius: 6,
                      borderLeft: '3px solid #3b82f6'
                    }}
                  >
                    <div style={{ fontWeight: 500, fontSize: 12, color: '#1e293b' }}>{blok.blok}</div>
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                      {blok.van_tijd?.slice(0, 5)} - {blok.tot_tijd?.slice(0, 5)}
                    </div>
                    {visibleHuisIds.length > 1 && (
                      <div style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>
                        {HUIS_NAMEN[blok.huis_id]}
                      </div>
                    )}
                    <button
                      onClick={() => handleDelete(blok.id)}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontSize: 11, color: '#ef4444', Color: 'white',
                  borderRadius: 12,
                  padding: 12,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                }}
              >
                <h3 style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', margin: '0 0 8px' }}>
                  {dag}
                </h3>

                {dagBlokken.map(blok => (
                  <div
                    key={blok.id}
                    style={{
                      padding: 10,
                      marginBottom: 6,
                      backgroundColor: '#f0f7ff',
                      borderRadius: 6,
                      borderLeft: '3px solid #3b82f6'
                    }}
                  >
                    <div style={{ fontWeight: 500, fontSize: 12, color: '#1e293b' }}>{blok.blok}</div>
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                      {blok.van_tijd?.slice(0, 5)} - {blok.tot_tijd?.slice(0, 5)}
                    </div>
                    {visibleHuisIds.length > 1 && (
                      <div style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>
                        {HUIS_NAMEN[blok.huis_id]}
                      </div>
                    )}
                    <button
                      onClick={() => handleDelete(blok.id)}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontSize: 11, color: '#ef4444', padding: '2px 4px', marginTop: 4,
                        minHeight: 44, fontWeight: 500
                      }}
                    >
                      ✕ Verwijder
                    </button>
                  </div>
                ))}

                {adding === weekdag ? (
                  <div style={{ padding: 10, backgroundColor: '#f8fafc', borderRadius: 6, border: '1px solid #e2e8f0' }}>
                    <input
                      placeholder="Omschrijving"
                      value={form.blok}
                      onChange={e => setForm(prev => ({ ...prev, blok: e.target.value }))}
                      style={{ ...inputStyle, width: '100%', marginBottom: 8 }}
                    />
                    <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: 10, color: '#64748b', display: 'block', marginBottom: 2 }}>Van</label>
                        <input
                          type="time"
                          value={form.van_tijd}
                          onChange={e => setForm(prev => ({ ...prev, van_tijd: e.target.value }))}
                          style={{ ...inputStyle, width: '100%' }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: 10, color: '#64748b', display: 'block', marginBottom: 2 }}>Tot</label>
                        <input
                          type="time"
                          value={form.tot_tijd}
                          onChange={e => setForm(prev => ({ ...prev, tot_tijd: e.target.value }))}
                          style={{ ...inputStyle, width: '100%' }}
                        />
                      </div>
                    </div>
                    {visibleHuisIds.length > 1 && (
                      <select
                        value={form.huis_id || visibleHuisIds[0]}
                        onChange={e => setForm(prev => ({ ...prev, huis_id: e.target.value }))}
                        style={{ ...inputStyle, width: '100%', marginBottom: 8 }}
                      >
                        {visibleHuisIds.map(id => (
                          <option key={id} value={id}>{HUIS_NAMEN[id]}</option>
                        ))}
                      </select>
                    )}
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => handleAdd(weekdag)} style={{ ...btnPrimary, flex: 1 }}>Toevoegen</button>
                      <button onClick={() => setAdding(null)} style={{ ...btnSecondary, flex: 1 }}>Annuleer</button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setAdding(weekdag)}
                    style={{
                      width: '100%', padding: '8px 10px', borderRadius: 6,
                      border: '1px dashed #d1d5db', background: 'white',
                      color: '#64748b', cursor: 'pointer', fontSize: 12,
                      fontWeight: 500, minHeight: 44, marginTop: 4
                    }}
                  >
                    + Blok toevoegen
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Hoofdcomponent Planning ──────────────────────────
export default function Planning() {
  const { user } = useAuth()
  const isMobile = useMobile()
  const [blokken, setBlokken] = useState([])
  const [loading, setLoading] = useState(true)
  const [weekOffset, setWeekOffset] = useState(0)
  const [weekDatums, setWeekDatums] = useState([])
  const [addingBlok, setAddingBlok] = useState({})
  const [formData, setFormData] = useState({})
  const [dayIndex, setDayIndex] = useState(0)
  const [toonStandaard, setToonStandaard] = useState(false)

  const magAllesZien = user?.permissions?.length > 1
  const visibleHuisIds = user?.permissions?.map(perm => HUIS_IDS[perm]).filter(Boolean) || []

  useEffect(() => {
    const datums = getWeekDatums(weekOffset)
    setWeekDatums(datums)
    if (user && visibleHuisIds.length > 0) {
      loadBlokken(datums)
    }
  }, [user, visibleHuisIds.length, weekOffset])

  const loadBlokken = async (datums) => {
    const weekData = datums || weekDatums
    if (!weekData.length) return
    try {
      setLoading(true)
      const weekStart = weekData[0].volledig
      const weekEnd = weekData[weekData.length - 1].volledig

      const { data, error } = await supabase
        .from('blokken')
        .select('*')
        .gte('dag', weekStart)
        .lte('dag', weekEnd)
        .in('huis_id', visibleHuisIds)
        .order('van_tijd', { ascending: true })

      if (error) throw error

      // Als er geen blokken zijn voor deze week, probeer standaard in te vullen
      if (!data || data.length === 0) {
        await vulStandaardIn(weekData)
      } else {
        setBlokken(data)
      }
    } catch (error) {
      console.error('Error loading blokken:', error)
    } finally {
      setLoading(false)
    }
  }

  const vulStandaardIn = async (weekData) => {
    try {
      // Haal standaard blokken op
      const { data: standaard, error: sError } = await supabase
        .from('standaard_blokken')
        .select('*')
        .in('huis_id', visibleHuisIds)

      if (sError) throw sError
      if (!standaard || standaard.length === 0) {
        setBlokken([])
        return
      }

      // Maak blokken aan voor elke dag
      const nieuweBlokken = standaard.map(sb => ({
        dag: weekData[sb.weekdag].volledig,
        blok: sb.blok,
        huis_id: sb.huis_id,
        van_tijd: sb.van_tijd,
        tot_tijd: sb.tot_tijd,
        gebruiker_id: user.id
      }))

      const { data: inserted, error: iError } = await supabase
        .from('blokken')
        .insert(nieuweBlokken)
        .select()

      if (iError) throw iError
      setBlokken(inserted || [])
    } catch (e) {
      console.error('Error auto-filling standaard:', e)
      setBlokken([])
    }
  }

  const handleAddBlok = async (dagDatum, huisId) => {
    const key = `${dagDatum}-${huisId}`
    const blokNaam = formData[key]?.blok?.trim()
    if (!blokNaam) return

    try {
      const { error } = await supabase.from('blokken').insert({
        dag: dagDatum,
        blok: blokNaam,
        huis_id: huisId,
        van_tijd: formData[key]?.van_tijd || '08:00',
        tot_tijd: formData[key]?.tot_tijd || '12:00',
        gebruiker_id: user.id
      })
      if (error) throw error
      setFormData(prev => { const u = { ...prev }; delete u[key]; return u })
      setAddingBlok(prev => { const u = { ...prev }; delete u[key]; return u })
      await loadBlokken()
    } catch (error) {
      console.error('Error adding blok:', error)
    }
  }

  const handleDeleteBlok = async (id) => {
    try {
      const { error } = await supabase.from('blokken').delete().eq('id', id)
      if (error) throw error
      await loadBlokken()
    } catch (error) {
      console.error('Error deleting blok:', error)
    }
  }

  if (!user || visibleHuisIds.length === 0) {
    return <p style={{ textAlign: 'center', color: '#999' }}>Geen huishoudens toegankelijk</p>
  }

  if (toonStandaard) {
    return <StandaardBeheer visibleHuisIds={visibleHuisIds} user={user} onClose={() => { setToonStandaard(false); loadBlokken() }} />
  }

  // ── Blok-kaart component ──
  const BlokKaart = ({ blok }) => (
    <div
      style={{
        padding: 10,
        marginBottom: 6,
        backgroundColor: '#f8fafc',
        borderRadius: 6,
        borderLeft: '3px solid #1e3a5f',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 500, fontSize: 12, color: '#1e293b' }}>{blok.blok}</div>
        <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
          {blok.van_tijd?.slice(0, 5)} - {blok.tot_tijd?.slice(0, 5)}
        </div>
        {magAllesZien && (
          <div style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>
            {HUIS_NAMEN[blok.huis_id]}
          </div>
        )}
      </div>
      <button
        onClick={() => handleDeleteBlok(blok.id)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 12, color: '#ef4444', padding: '2px 4px',
          minHeight: 44, minWidth: 44
        }}
      >
        ✕
      </button>
    </div>
  )

  // ── Toevoeg formulier ──
  const AddForm = ({ dagDatum, huisId, onCancel }) => {
    const key = `${dagDatum}-${huisId}`
    return (
      <div style={{ padding: 10, backgroundColor: 'white', borderRadius: 8, border: '1px solid #e2e8f0' }}>
        <input
          placeholder="Omschrijving"
          value={formData[key]?.blok || ''}
          onChange={e => setFormData(prev => ({
            ...prev, [key]: { ...prev[key], blok: e.target.value }
          }))}
          style={{ ...inputStyle, width: '100%', marginBottom: 8 }}
        />
        <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 10, color: '#64748b', display: 'block', marginBottom: 2 }}>Van</label>
            <input
              type="time"
              value={formData[key]?.van_tijd || '08:00'}
              onChange={e => setFormData(prev => ({
                ...prev, [key]: { ...prev[key], van_tijd: e.target.value }
              }))}
              style={{ ...inputStyle, width: '100%' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 10, color: '#64748b', display: 'block', marginBottom: 2 }}>Tot</label>
            <input
              type="time"
              value={formData[key]?.tot_tijd || '12:00'}
              onChange={e => setFormData(prev => ({
                ...prev, [key]: { ...prev[key], tot_tijd: e.target.value }
              }))}
              style={{ ...inputStyle, width: '100%' }}
            />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => handleAddBlok(dagDatum, huisId)} style={{ ...btnPrimary, flex: 1 }}>Toevoegen</button>
          <button onClick={onCancel} style={{ ...btnSecondary, flex: 1 }}>Annuleer</button>
        </div>
      </div>
    )
  }

  // ── Header ──
  const Header = () => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
      <div>
        <h1 style={{ fontSize: isMobile ? 16 : 20, fontWeight: 600, color: '#1e293b', margin: 0 }}>Week planning</h1>
        {weekDatums.length > 0 && (
          <div style={{ fontSize: 12, color: '#94a3b8' }}>
            {weekDatums[0].datum} - {weekDatums[4].datum}
            {weekOffset !== 0 && (
              <span style={{ marginLeft: 8, color: '#3b82f6', cursor: 'pointer' }} onClick={() => setWeekOffset(0)}>
                (vandaag)
              </span>
            )}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <button onClick={() => setWeekOffset(w => w - 1)} style={btnSecondary}>←</button>
        <button onClick={() => setWeekOffset(w => w + 1)} style={btnSecondary}>→</button>
        <button
          onClick={() => setToonStandaard(true)}
          style={{
            ...btnPrimary,
            background: '#3b82f6',
            fontSize: 11,
            padding: '6px 10px'
          }}
        >
          ⚙ Standaard
        </button>
      </div>
    </div>
  )

  // ── Mobile view ──
  if (isMobile) {
    const currentDay = weekDatums[dayIndex]
    if (!currentDay) return null

    return (
      <div>
        <Header />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 8 }}>
          <button
            onClick={() => setDayIndex(Math.max(0, dayIndex - 1))}
            disabled={dayIndex === 0}
            style={{ ...btnSecondary, minWidth: 44, opacity: dayIndex === 0 ? 0.5 : 1 }}
          >←</button>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1e293b', margin: 0 }}>{currentDay.dag}</h2>
            <span style={{ fontSize: 12, color: '#94a3b8' }}>{currentDay.datum}</span>
          </div>
          <button
            onClick={() => setDayIndex(Math.min(4, dayIndex + 1))}
            disabled={dayIndex === 4}
            style={{ ...btnSecondary, minWidth: 44, opacity: dayIndex === 4 ? 0.5 : 1 }}
          >→</button>
        </div>

        {visibleHuisIds.map(huisId => {
          const dayBlokken = blokken.filter(b => b.dag === currentDay.volledig && b.huis_id === huisId)
          const key = `${currentDay.volledig}-${huisId}`

          return (
            <div key={huisId} style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', margin: '0 0 8px' }}>
                {HUIS_NAMEN[huisId]}
              </h3>

              {loading ? (
                <p style={{ color: '#94a3b8', fontSize: 13 }}>Laden...</p>
              ) : (
                <>
                  {dayBlokken.map(blok => <BlokKaart key={blok.id} blok={blok} />)}

                  {addingBlok[key] ? (
                    <AddForm
                      dagDatum={currentDay.volledig}
                      huisId={huisId}
                      onCancel={() => setAddingBlok(prev => { const u = { ...prev }; delete u[key]; return u })}
                    />
                  ) : (
                    <button
                      onClick={() => setAddingBlok(prev => ({ ...prev, [key]: true }))}
                      style={{
                        width: '100%', padding: '8px 12px', borderRadius: 6,
                        border: '1px solid #e2e8f0', background: 'white',
                        color: '#475569', cursor: 'pointer', fontSize: 12,
                        fontWeight: 500, minHeight: 44
                      }}
                    >
                      + Blok toevoegen
                    </button>
                  )}
                </>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  // ── Desktop view: 5-kolom grid ──
  return (
    <div>
      <Header />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
        {weekDatums.map(({ dag, datum, volledig }) => {
          const dayBlokken = blokken.filter(b => b.dag === volledig)

          return (
            <div
              key={volledig}
              style={{
                backgroundColor: 'white',
                borderRadius: 12,
                padding: 12,
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
              }}
            >
              <h3 style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', margin: '0 0 2px' }}>{dag}</h3>
              <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 8 }}>{datum}</div>

              {loading ? (
                <p style={{ color: '#94a3b8', fontSize: 13 }}>Laden...</p>
              ) : (
                <>
                  {dayBlokken.map(blok => <BlokKaart key={blok.id} blok={blok} />)}

                  {visibleHuisIds.length === 1 ? (
                    <>
                      {addingBlok[volledig] ? (
                        <AddForm
                          dagDatum={volledig}
                          huisId={visibleHuisIds[0]}
                          onCancel={() => setAddingBlok(prev => { const u = { ...prev }; delete u[volledig]; return u })}
                        />
                      ) : (
                        <button
                          onClick={() => setAddingBlok(prev => ({ ...prev, [volledig]: true }))}
                          style={{
                            width: '100%', padding: '8px 10px', borderRadius: 6,
                            border: '1px solid #e2e8f0', background: 'white',
                            color: '#475569', cursor: 'pointer', fontSize: 12,
                            fontWeight: 500, marginTop: 8, minHeight: 44
                          }}
                        >
                          + Blok
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      {magAllesZien && visibleHuisIds.map(huisId => {
                        const key = `${volledig}-${huisId}`
                        return (
                          <div key={huisId} style={{ marginTop: 8 }}>
                            <div style={{ fontSize: 10, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                              {HUIS_NAMEN[huisId]}
                            </div>
                            {addingBlok[key] ? (
                              <AddForm
                                dagDatum={volledig}
                                huisId={huisId}
                                onCancel={() => setAddingBlok(prev => { const u = { ...prev }; delete u[key]; return u })}
                              />
                            ) : (
                              <button
                                onClick={() => setAddingBlok(prev => ({ ...prev, [key]: true }))}
                                style={{
                                  width: '100%', padding: '6px 8px', borderRadius: 4,
                                  border: '1px solid #e2e8f0', background: 'white',
                                  color: '#475569', cursor: 'pointer', fontSize: 10,
                                  fontWeight: 500, minHeight: 44
                                }}
                              >
                                + Blok
                              </button>
                            )}
                          </div>
                        )
                      })}
                    </>
                  )}
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
