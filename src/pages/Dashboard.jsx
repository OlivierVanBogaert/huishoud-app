import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useMobile } from '../hooks/useMobile'
import TaakKaart from '../components/TaakKaart'

const PRIORITEITEN = { hoog: "🔴", normaal: "🟠", laag: "🟢" }

const HUIS_IDS = {
  "🏠 Olivier & Ashley": "ada24453-c203-4639-be69-0cdae55df9f4",
  "🏡 Jan": "b678cfb5-66be-4a29-8200-7b417e9e7ff5"
}

const HUIS_NAMEN = Object.fromEntries(Object.entries(HUIS_IDS).map(([k, v]) => [v, k]))

export default function Dashboard() {
  const { user } = useAuth()
  const isMobile = useMobile()
  const navigate = useNavigate()
  const [taken, setTaken] = useState([])
  const [openBoodschappen, setOpenBoodschappen] = useState(0)
  const [totaalUrenMin, setTotaalUrenMin] = useState(0)
  const [loading, setLoading] = useState(true)

  const visibleHuisIds = (user?.permissions || []).map(perm => HUIS_IDS[perm]).filter(Boolean)
  const magAllesZien = user?.permissions?.length > 1

  useEffect(() => {
    if (user?.permissions?.length > 0) {
      loadDashboard()
    }
  }, [user])

  const loadDashboard = async () => {
    try {
      setLoading(true)
      // Load taken
      const { data: takenData, error: takenErr } = await supabase
        .from('taken')
        .select('*, reacties(*)')
        .in('huis_id', visibleHuisIds)
      if (takenErr) throw takenErr
      setTaken(takenData || [])

      // Load open boodschappen count
      const { count, error: boodErr } = await supabase
        .from('boodschappen')
        .select('id', { count: 'exact', head: true })
        .in('huis_id', visibleHuisIds)
        .eq('gedaan', false)
      if (!boodErr) setOpenBoodschappen(count || 0)

      // Load uren total
      const { data: urenData, error: urenErr } = await supabase
        .from('uren')
        .select('start_tijd, einde_tijd, pauze_minuten')
        .eq('gebruiker_id', user.id)
      if (!urenErr && urenData) {
        const totaal = urenData.reduce((sum, u) => {
          const [sh, sm] = u.start_tijd.split(':').map(Number)
          const [eh, em] = u.einde_tijd.split(':').map(Number)
          return sum + (eh * 60 + em) - (sh * 60 + sm) - (u.pauze_minuten || 0)
        }, 0)
        setTotaalUrenMin(totaal)
      }
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
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
      await loadDashboard()
    } catch (error) {
      console.error('Error adding reaction:', error)
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
      await loadDashboard()
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const handleStatusChange = async (taakId, newStatus) => {
    try {
      const { error } = await supabase
        .from('taken')
        .update({ status: newStatus })
        .eq('id', taakId)

      if (error) throw error
      await loadDashboard()
    } catch (error) {
      console.error('Error updating task status:', error)
    }
  }

  // Get today's date
  const vandaag = new Date().toISOString().slice(0, 10)

  // Calculate stats
  const vandaagTaken = taken.filter(t => t.datum === vandaag && t.status !== 'klaar')
  const dringendTaken = taken.filter(t => t.prioriteit === 'hoog' && t.status !== 'klaar')

  const statCards = [
    {
      label: 'Vandaag',
      waarde: vandaagTaken.length,
      kleur: '#3b82f6',
      icon: '📅',
      link: 'taken'
    },
    {
      label: 'Dringend',
      waarde: dringendTaken.length,
      kleur: '#ef4444',
      icon: '🔴',
      link: 'taken'
    },
    {
      label: 'Boodschappen',
      waarde: openBoodschappen,
      kleur: '#f59e0b',
      icon: '🛒',
      link: 'boodschappen'
    },
    {
      label: 'Uren',
      waarde: `${Math.floor(totaalUrenMin / 60)}h`,
      kleur: '#10b981',
      icon: '⏱️',
      link: 'uren'
    }
  ]

  // Get today's date in Dutch format
  const vandaagFormatted = new Date().toLocaleDateString('nl-NL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{
          fontSize: isMobile ? 18 : 22,
          fontWeight: 700,
          color: '#1e293b',
          margin: 0
        }}>
          Hallo {user?.name} 👋
        </h1>
        <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: 13, textTransform: 'capitalize' }}>
          {vandaagFormatted}
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
        gap: 14,
        marginBottom: 24
      }}>
        {statCards.map(stat => (
          <div
            key={stat.label}
            onClick={() => navigate(`/${stat.link}`)}
            style={{
              backgroundColor: 'white',
              borderRadius: 12,
              padding: 16,
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              border: '1px solid #e2e8f0',
              transition: 'all 0.15s',
              minHeight: 100
            }}
          >
            <div style={{ fontSize: isMobile ? 24 : 28, marginBottom: 8 }}>
              {stat.icon}
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>
              {stat.label}
            </div>
            <div style={{
              fontSize: isMobile ? 20 : 24,
              fontWeight: 700,
              color: stat.kleur
            }}>
              {stat.waarde}
            </div>
          </div>
        ))}
      </div>

      {/* Vandaag & Dringend sections */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: 14
      }}>
        {/* Vandaag */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: 12,
          padding: 16,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{
            fontSize: 14,
            fontWeight: 600,
            color: '#1e293b',
            margin: '0 0 12px'
          }}>
            Vandaag
          </h3>
          {loading ? (
            <p style={{ color: '#94a3b8', fontSize: 13 }}>Laden...</p>
          ) : vandaagTaken.length === 0 ? (
            <p style={{ color: '#94a3b8', fontSize: 13 }}>Geen taken vandaag</p>
          ) : (
            <div>
              {vandaagTaken.slice(0, 3).map(t => (
                <TaakKaart
                  key={t.id}
                  taak={t}
                  magAllesZien={magAllesZien}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDeleteTask}
                  onAddReaction={handleAddReaction}
                />
              ))}
            </div>
          )}
        </div>

        {/* Dringend */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: 12,
          padding: 16,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{
            fontSize: 14,
            fontWeight: 600,
            color: '#1e293b',
            margin: '0 0 12px'
          }}>
            Dringend
          </h3>
          {loading ? (
            <p style={{ color: '#94a3b8', fontSize: 13 }}>Laden...</p>
          ) : dringendTaken.length === 0 ? (
            <p style={{ color: '#94a3b8', fontSize: 13 }}>Geen dringende taken</p>
          ) : (
            <div>
              {dringendTaken.slice(0, 3).map(t => (
                <TaakKaart
                  key={t.id}
                  taak={t}
                  magAllesZien={magAllesZien}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDeleteTask}
                  onAddReaction={handleAddReaction}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
