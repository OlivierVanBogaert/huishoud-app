import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useMobile } from '../hooks/useMobile'
import ChipSelect from '../components/ChipSelect'

const HUISHOUDENS = ['🏠 Olivier & Ashley', '🏡 Jan']
const PERSONEN = ['Edna', 'Olivier', 'Ashley', 'Jan']
const PRIORITEITEN = { hoog: '🔴', normaal: '🟠', laag: '🟢' }
const DEFAULT_CATS = ['Schoonmaak', 'Boodschappen', 'Was & Strijk', 'Varia']

const HUIS_IDS = {
  '🏠 Olivier & Ashley': 'ada24453-c203-4639-be69-0cdae55df9f4',
  '🏡 Jan': 'b678cfb5-66be-4a29-8200-7b417e9e7ff5'
}

const HUIS_NAMEN = Object.fromEntries(
  Object.entries(HUIS_IDS).map(([k, v]) => [v, k])
)

function TaakKaart({
  taak,
  magAllesZien,
  onStatusChange,
  onDelete,
  onReactionClick,
  onAddReaction
}) {
  const [isOpenReacties, setIsOpenReacties] = useState(false)
  const [nieuweReactie, setNieuweReactie] = useState('')

  const handleAddReaction = async () => {
    if (!nieuweReactie.trim()) return
    await onAddReaction(taak.id, nieuweReactie)
    setNieuweReactie('')
  }

  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        border: '1px solid #e2e8f0'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'start',
          marginBottom: 6
        }}
      >
        <div style={{ fontWeight: 500, fontSize: 14, color: '#1e293b', flex: 1 }}>
          {PRIORITEITEN[taak.prioriteit]} {taak.taak}
        </div>
        <button
          onClick={() => onDelete(taak.id)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 14,
            color: '#94a3b8',
            padding: '4px 8px',
            minHeight: 44,
            minWidth: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ✕
        </button>
      </div>

      {taak.foto_url && (
        <div
          style={{
            fontSize: 12,
            padding: '4px 8px',
            backgroundColor: '#f0fdf4',
            borderRadius: 6,
            color: '#15803d',
            marginBottom: 6,
            display: 'inline-block'
          }}
        >
          📷 {taak.foto_url.split('/').pop()}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          gap: 5,
          flexWrap: 'wrap',
          marginBottom: 8
        }}
      >
        {magAllesZien && (
          <span
            style={{
              fontSize: 11,
              padding: '3px 8px',
              borderRadius: 6,
              backgroundColor: taak.huis_id === HUIS_IDS['🏠 Olivier & Ashley'] ? '#eff6ff' : '#fef3c7',
              color: taak.huis_id === HUIS_IDS['🏠 Olivier & Ashley'] ? '#1e40af' : '#92400e'
            }}
          >
            {HUIS_NAMEN[taak.huis_id]}
          </span>
        )}
        <span
          style={{
            fontSize: 11,
            padding: '3px 8px',
            borderRadius: 6,
            backgroundColor: '#f1f5f9',
            color: '#475569'
          }}
        >
          {taak.categorie}
        </span>
        {taak.herhaling && (
          <span
            style={{
              fontSize: 11,
              padding: '3px 8px',
              borderRadius: 6,
              backgroundColor: '#f0f9ff',
              color: '#0369a1'
            }}
          >
            🔄 {taak.herhaling}
          </span>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 4
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: '#94a3b8' }}>👤 {taak.persoon}</span>
          <button
            onClick={() => setIsOpenReacties(!isOpenReacties)}
            style={{
              background:
                taak.reacties && taak.reacties.length > 0 ? '#eff6ff' : '#f8fafc',
              border:
                taak.reacties && taak.reacties.length > 0
                  ? '1px solid #bfdbfe'
                  : '1px solid #e2e8f0',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 14,
              color:
                taak.reacties && taak.reacties.length > 0
                  ? '#2563eb'
                  : '#64748b',
              padding: '8px 14px',
              fontWeight:
                taak.reacties && taak.reacties.length > 0 ? 600 : 400,
              minHeight: 44,
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            💬{' '}
            {taak.reacties && taak.reacties.length > 0
              ? taak.reacties.length
              : 'Reageer'}
          </button>
        </div>

        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {taak.status !== 'todo' && (
            <button
              onClick={() => onStatusChange(taak.id, 'todo')}
              style={{
                fontSize: 12,
                padding: '8px 14px',
                borderRadius: 8,
                border: '1px solid #d1d5db',
                backgroundColor: 'white',
                cursor: 'pointer',
                color: '#64748b',
                minHeight: 44
              }}
            >
              ← Te doen
            </button>
          )}
          {taak.status === 'todo' && (
            <button
              onClick={() => onStatusChange(taak.id, 'bezig')}
              style={{
                fontSize: 12,
                padding: '8px 14px',
                borderRadius: 8,
                border: 'none',
                backgroundColor: '#fef3c7',
                cursor: 'pointer',
                color: '#92400e',
                fontWeight: 600,
                minHeight: 44
              }}
            >
              Bezig →
            </button>
          )}
          {taak.status !== 'klaar' && (
            <button
              onClick={() => onStatusChange(taak.id, 'klaar')}
              style={{
                fontSize: 12,
                padding: '8px 14px',
                borderRadius: 8,
                border: 'none',
                backgroundColor: '#d1fae5',
                cursor: 'pointer',
                color: '#065f46',
                fontWeight: 600,
                minHeight: 44
              }}
            >
              Klaar ✓
            </button>
          )}
        </div>
      </div>

      {isOpenReacties && (
        <div
          style={{
            marginTop: 10,
            paddingTop: 10,
            borderTop: '1px solid #f1f5f9'
          }}
        >
          {!taak.reacties || taak.reacties.length === 0 ? (
            <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 8px' }}>
              Nog geen reacties
            </p>
          ) : (
            taak.reacties.map((r, i) => (
              <div
                key={i}
                style={{
                  padding: '8px 10px',
                  backgroundColor: '#f8fafc',
                  borderRadius: 8,
                  marginBottom: 6
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#1e293b' }}>
                    {r.van}
                  </span>
                  <span style={{ fontSize: 10, color: '#94a3b8' }}>
                    {new Date(r.created_at).toLocaleTimeString('nl-NL', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: '#475569', marginTop: 2 }}>
                  {r.tekst}
                </div>
              </div>
            ))
          )}
          <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
            <input
              placeholder="Schrijf een reactie..."
              value={nieuweReactie}
              onChange={e => setNieuweReactie(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleAddReaction()
              }}
              style={{
                flex: 1,
                padding: '8px 10px',
                borderRadius: 8,
                border: '1px solid #d1d5db',
                fontSize: 12,
                minHeight: 44
              }}
            />
            <button
              onClick={handleAddReaction}
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                border: 'none',
                backgroundColor: '#1e3a5f',
                color: 'white',
                cursor: 'pointer',
                fontSize: 11,
                fontWeight: 600,
                minHeight: 44
              }}
            >
              Verstuur
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Takenbord() {
  const { user } = useAuth()
  const isMobile = useMobile()
  const [taken, setTaken] = useState([])
  const [loading, setLoading] = useState(true)
  const [toonNieuweTaak, setToonNieuweTaak] = useState(false)
  const [actieveTab, setActieveTab] = useState('todo')
  const [categorieen, setCategorieen] = useState(DEFAULT_CATS)
  const [toonNieuweCat, setToonNieuweCat] = useState(false)
  const [nieuweCategorie, setNieuweCategorie] = useState('')

  const [nieuweTaak, setNieuweTaak] = useState({
    taak: '',
    huis: HUISHOUDENS[0],
    prioriteit: 'normaal',
    persoon: 'Edna',
    categorie: 'Schoonmaak',
    datum: new Date().toISOString().slice(0, 10),
    herhaling: null
  })

  const visibleHuisIds = (user?.permissions || [])
    .map(perm => HUIS_IDS[perm])
    .filter(Boolean)
  const zichtbareHuizen = (user?.permissions || [])
    .filter(perm => HUIS_IDS[perm])
  const magAllesZien = user?.permissions?.length > 1

  useEffect(() => {
    if (user?.permissions?.length > 0) {
      loadTaken()
    }
  }, [user])

  const loadTaken = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('taken')
        .select('*, reacties(*)')
        .in('huis_id', visibleHuisIds)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTaken(data || [])
    } catch (error) {
      console.error('Error loading tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddTask = async () => {
    if (!nieuweTaak.taak.trim()) {
      alert('Vul een taaknaam in')
      return
    }

    try {
      const huis_id = HUIS_IDS[magAllesZien ? nieuweTaak.huis : zichtbareHuizen[0]]

      const { error } = await supabase.from('taken').insert({
        taak: nieuweTaak.taak,
        huis_id,
        status: 'todo',
        prioriteit: nieuweTaak.prioriteit,
        persoon: nieuweTaak.persoon,
        categorie: nieuweTaak.categorie,
        datum: nieuweTaak.datum,
        herhaling: nieuweTaak.herhaling,
        foto_url: null
      })

      if (error) throw error

      setNieuweTaak({
        taak: '',
        huis: zichtbareHuizen[0] || HUISHOUDENS[0],
        prioriteit: 'normaal',
        persoon: 'Edna',
        categorie: 'Schoonmaak',
        datum: new Date().toISOString().slice(0, 10),
        herhaling: null
      })
      setToonNieuweTaak(false)
      await loadTaken()
    } catch (error) {
      console.error('Error adding task:', error)
      alert('Fout bij toevoegen van taak')
    }
  }

  const handleStatusChange = async (taakId, newStatus) => {
    try {
      const { error } = await supabase
        .from('taken')
        .update({ status: newStatus })
        .eq('id', taakId)

      if (error) throw error
      await loadTaken()
    } catch (error) {
      console.error('Error updating task status:', error)
    }
  }

  const handleDeleteTask = async (taakId) => {
    if (!window.confirm('Weet je zeker dat je deze taak wilt verwijderen?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('taken')
        .delete()
        .eq('id', taakId)

      if (error) throw error
      await loadTaken()
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const handleAddReaction = async (taakId, tekst) => {
    if (!tekst.trim()) return

    try {
      const { error } = await supabase.from('reacties').insert({
        taak_id: taakId,
        van: user.name,
        tekst: tekst.trim()
      })

      if (error) throw error
      await loadTaken()
    } catch (error) {
      console.error('Error adding reaction:', error)
    }
  }

  const handleAddCategory = async () => {
    if (!nieuweCategorie.trim()) return
    if (categorieen.includes(nieuweCategorie.trim())) {
      alert('Deze categorie bestaat al')
      return
    }

    setCategorieen([...categorieen, nieuweCategorie.trim()])
    setNieuweCategorie('')
    setToonNieuweCat(false)
  }

  // Filter tasks by status
  const todoTaken = taken.filter(t => t.status === 'todo')
  const bezigTaken = taken.filter(t => t.status === 'bezig')
  const klaarTaken = taken.filter(t => t.status === 'klaar')

  return (
    <div style={{ padding: isMobile ? '0 12px' : '0 20px', paddingBottom: 20 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
          flexWrap: 'wrap',
          gap: 10
        }}
      >
        <h1
          style={{
            fontSize: isMobile ? 18 : 22,
            fontWeight: 700,
            color: '#1e293b',
            margin: 0
          }}
        >
          Takenbord
        </h1>
        <button
          onClick={() => setToonNieuweTaak(!toonNieuweTaak)}
          style={{
            padding: '8px 14px',
            backgroundColor: '#1e3a5f',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 600,
            minHeight: 44
          }}
        >
          + Nieuwe taak
        </button>
      </div>

      {/* New Task Form */}
      {toonNieuweTaak && (
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
          }}
        >
          <input
            placeholder="Taaknaam"
            value={nieuweTaak.taak}
            onChange={e => setNieuweTaak({ ...nieuweTaak, taak: e.target.value })}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid #d1d5db',
              fontSize: 13,
              marginBottom: 12,
              minHeight: 44
            }}
          />

          {magAllesZien && (
            <div style={{ marginBottom: 12 }}>
              <label
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#475569',
                  display: 'block',
                  marginBottom: 6
                }}
              >
                Huis
              </label>
              <ChipSelect
                opties={zichtbareHuizen}
                waarde={nieuweTaak.huis}
                onChange={h => setNieuweTaak({ ...nieuweTaak, huis: h })}
                small
              />
            </div>
          )}

          <div style={{ marginBottom: 12 }}>
            <label
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: '#475569',
                display: 'block',
                marginBottom: 6
              }}
            >
              Prioriteit
            </label>
            <ChipSelect
              opties={['hoog', 'normaal', 'laag']}
              waarde={nieuweTaak.prioriteit}
              onChange={p => setNieuweTaak({ ...nieuweTaak, prioriteit: p })}
              iconen={PRIORITEITEN}
              small
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: '#475569',
                display: 'block',
                marginBottom: 6
              }}
            >
              Persoon
            </label>
            <ChipSelect
              opties={PERSONEN}
              waarde={nieuweTaak.persoon}
              onChange={p => setNieuweTaak({ ...nieuweTaak, persoon: p })}
              small
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: '#475569',
                display: 'block',
                marginBottom: 6
              }}
            >
              Categorie
            </label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
              <ChipSelect
                opties={categorieen}
                waarde={nieuweTaak.categorie}
                onChange={c => setNieuweTaak({ ...nieuweTaak, categorie: c })}
                small
              />
            </div>
            <button
              onClick={() => setToonNieuweCat(!toonNieuweCat)}
              style={{
                fontSize: 11,
                padding: '4px 8px',
                border: '1px dashed #d1d5db',
                background: 'white',
                borderRadius: 6,
                cursor: 'pointer',
                color: '#64748b',
                minHeight: 44
              }}
            >
              + Nieuwe categorie
            </button>
            {toonNieuweCat && (
              <div
                style={{
                  display: 'flex',
                  gap: 6,
                  marginTop: 8,
                  flexWrap: 'wrap'
                }}
              >
                <input
                  placeholder="Categorie naam"
                  value={nieuweCategorie}
                  onChange={e => setNieuweCategorie(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px 10px',
                    borderRadius: 6,
                    border: '1px solid #d1d5db',
                    fontSize: 12,
                    minHeight: 44,
                    minWidth: isMobile ? '100%' : 'auto'
                  }}
                />
                <button
                  onClick={handleAddCategory}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: 'none',
                    backgroundColor: '#1e3a5f',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: 11,
                    minHeight: 44
                  }}
                >
                  Voeg toe
                </button>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleAddTask}
              style={{
                flex: 1,
                padding: '10px',
                backgroundColor: '#1e3a5f',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: 600,
                minHeight: 44
              }}
            >
              Voeg taak toe
            </button>
            <button
              onClick={() => setToonNieuweTaak(false)}
              style={{
                flex: 1,
                padding: '10px',
                backgroundColor: '#e2e8f0',
                color: '#64748b',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: 600,
                minHeight: 44
              }}
            >
              Annuleer
            </button>
          </div>
        </div>
      )}

      {/* Task Board */}
      {isMobile ? (
        // Mobile: Tab view
        <div>
          <div
            style={{
              display: 'flex',
              gap: 8,
              marginBottom: 16,
              borderBottom: '1px solid #e2e8f0',
              overflowX: 'auto'
            }}
          >
            {[
              { id: 'todo', label: 'Te doen', count: todoTaken.length },
              { id: 'bezig', label: 'Bezig', count: bezigTaken.length },
              { id: 'klaar', label: 'Klaar', count: klaarTaken.length }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActieveTab(tab.id)}
                style={{
                  padding: '10px 12px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  borderBottom:
                    actieveTab === tab.id
                      ? '2px solid #1e3a5f'
                      : '2px solid transparent',
                  color: actieveTab === tab.id ? '#1e3a5f' : '#94a3b8',
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: actieveTab === tab.id ? 600 : 400,
                  transition: 'all 0.15s',
                  minHeight: 44,
                  whiteSpace: 'nowrap'
                }}
              >
                {tab.label} {tab.count > 0 && `(${tab.count})`}
              </button>
            ))}
          </div>
          <div>
            {loading ? (
              <p style={{ color: '#94a3b8', fontSize: 13 }}>Laden...</p>
            ) : actieveTab === 'todo' ? (
              todoTaken.length === 0 ? (
                <p style={{ color: '#94a3b8', fontSize: 13 }}>Geen taken</p>
              ) : (
                todoTaken.map(t => (
                  <TaakKaart
                    key={t.id}
                    taak={t}
                    magAllesZien={magAllesZien}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDeleteTask}
                    onAddReaction={handleAddReaction}
                  />
                ))
              )
            ) : actieveTab === 'bezig' ? (
              bezigTaken.length === 0 ? (
                <p style={{ color: '#94a3b8', fontSize: 13 }}>Geen taken</p>
              ) : (
                bezigTaken.map(t => (
                  <TaakKaart
                    key={t.id}
                    taak={t}
                    magAllesZien={magAllesZien}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDeleteTask}
                    onAddReaction={handleAddReaction}
                  />
                ))
              )
            ) : (
              klaarTaken.length === 0 ? (
                <p style={{ color: '#94a3b8', fontSize: 13 }}>Geen taken</p>
              ) : (
                klaarTaken.map(t => (
                  <TaakKaart
                    key={t.id}
                    taak={t}
                    magAllesZien={magAllesZien}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDeleteTask}
                    onAddReaction={handleAddReaction}
                  />
                ))
              )
            )}
          </div>
        </div>
      ) : (
        // Desktop: 3-column layout
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16
          }}
        >
          {/* Te doen */}
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: 12,
              padding: 16,
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
            }}
          >
            <h3
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: '#1e293b',
                margin: '0 0 12px'
              }}
            >
              Te doen
            </h3>
            {loading ? (
              <p style={{ color: '#94a3b8', fontSize: 13 }}>Laden...</p>
            ) : todoTaken.length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: 13 }}>Geen taken</p>
            ) : (
              todoTaken.map(t => (
                <TaakKaart
                  key={t.id}
                  taak={t}
                  magAllesZien={magAllesZien}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDeleteTask}
                  onAddReaction={handleAddReaction}
                />
              ))
            )}
          </div>

          {/* Bezig */}
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: 12,
              padding: 16,
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
            }}
          >
            <h3
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: '#1e293b',
                margin: '0 0 12px'
              }}
            >
              Bezig
            </h3>
            {loading ? (
              <p style={{ color: '#94a3b8', fontSize: 13 }}>Laden...</p>
            ) : bezigTaken.length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: 13 }}>Geen taken</p>
            ) : (
              bezigTaken.map(t => (
                <TaakKaart
                  key={t.id}
                  taak={t}
                  magAllesZien={magAllesZien}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDeleteTask}
                  onAddReaction={handleAddReaction}
                />
              ))
            )}
          </div>

          {/* Klaar */}
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: 12,
              padding: 16,
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
            }}
          >
            <h3
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: '#1e293b',
                margin: '0 0 12px'
              }}
            >
              Klaar
            </h3>
            {loading ? (
              <p style={{ color: '#94a3b8', fontSize: 13 }}>Laden...</p>
            ) : klaarTaken.length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: 13 }}>Geen taken</p>
            ) : (
              klaarTaken.map(t => (
                <TaakKaart
                  key={t.id}
                  taak={t}
                  magAllesZien={magAllesZien}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDeleteTask}
                  onAddReaction={handleAddReaction}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
