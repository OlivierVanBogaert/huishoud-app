import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useMobile } from '../hooks/useMobile'
import TaakKaart from '../components/TaakKaart'
import ChipSelect from '../components/ChipSelect'

const COLORS = {
  primary: '#1e3a5f',
  secondary: '#2d5f8a',
  white: '#ffffff',
  light: '#f5f5f5'
}

const prioriteiten = [
  { label: '🔴 Hoog', value: 'hoog' },
  { label: '🟡 Normaal', value: 'normaal' },
  { label: '🟢 Laag', value: 'laag' }
]

const statuses = [
  { label: 'Te doen', value: 'todo' },
  { label: 'Bezig', value: 'bezig' },
  { label: 'Klaar', value: 'klaar' }
]

const categorien = [
  { label: 'Keuken', value: 'keuken' },
  { label: 'Badkamer', value: 'badkamer' },
  { label: 'Woonkamer', value: 'woonkamer' },
  { label: 'Slaapkamer', value: 'slaapkamer' },
  { label: 'Buiten', value: 'buiten' },
  { label: 'Tuin', value: 'tuin' }
]

export default function Takenbord() {
  const { user } = useAuth()
  const isMobile = useMobile()
  const [taken, setTaken] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState(null)
  const [filterCategorie, setFilterCategorie] = useState(null)
  const [newTaskName, setNewTaskName] = useState('')
  const [newTaskCategory, setNewTaskCategory] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState('normaal')
  const [showNewTaskForm, setShowNewTaskForm] = useState(false)

  useEffect(() => {
    loadTaken()
  }, [user])

  const loadTaken = async () => {
    try {
      setLoading(true)
      // Mock data for now - will be replaced with real Supabase queries
      setTaken([])
    } catch (error) {
      console.error('Error loading tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddTask = async (e) => {
    e.preventDefault()
    if (!newTaskName.trim()) return

    try {
      // This will be implemented once Supabase schema is set up
      setNewTaskName('')
      setNewTaskCategory('')
      setNewTaskPriority('normaal')
      setShowNewTaskForm(false)
    } catch (error) {
      console.error('Error adding task:', error)
    }
  }

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      // This will be implemented once Supabase schema is set up
      await loadTaken()
    } catch (error) {
      console.error('Error updating task status:', error)
    }
  }

  const filteredTaken = taken.filter(taak => {
    if (filterStatus && taak.status !== filterStatus) return false
    if (filterCategorie && taak.categorie !== filterCategorie) return false
    return true
  })

  return (
    <div>
      <h2 style={{
        fontSize: isMobile ? '20px' : '28px',
        fontWeight: '700',
        color: COLORS.primary,
        marginBottom: '1.5rem'
      }}>
        Takenbord
      </h2>

      {/* Filters */}
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
          Filter
        </h3>

        <ChipSelect
          label="Status"
          options={statuses}
          value={filterStatus}
          onChange={setFilterStatus}
        />

        <ChipSelect
          label="Categorie"
          options={categorien}
          value={filterCategorie}
          onChange={setFilterCategorie}
        />

        {(filterStatus || filterCategorie) && (
          <button
            onClick={() => {
              setFilterStatus(null)
              setFilterCategorie(null)
            }}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: COLORS.secondary,
              color: COLORS.white,
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Filters wissen
          </button>
        )}
      </div>

      {/* New Task Form */}
      {showNewTaskForm && (
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
            Nieuwe taak
          </h3>

          <form onSubmit={handleAddTask}>
            <div style={{ marginBottom: '1rem' }}>
              <input
                type="text"
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                placeholder="Taak omschrijving"
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

            <ChipSelect
              label="Categorie"
              options={categorien}
              value={newTaskCategory}
              onChange={setNewTaskCategory}
            />

            <ChipSelect
              label="Prioriteit"
              options={prioriteiten}
              value={newTaskPriority}
              onChange={setNewTaskPriority}
            />

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
                Toevoegen
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowNewTaskForm(false)
                  setNewTaskName('')
                  setNewTaskCategory('')
                  setNewTaskPriority('normaal')
                }}
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

      {!showNewTaskForm && (
        <button
          onClick={() => setShowNewTaskForm(true)}
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
          + Nieuwe taak
        </button>
      )}

      {/* Tasks */}
      {loading ? (
        <p style={{ textAlign: 'center', color: '#999' }}>Laden...</p>
      ) : filteredTaken.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999' }}>Geen taken gevonden</p>
      ) : (
        <div>
          {filteredTaken.map(taak => (
            <TaakKaart
              key={taak.id}
              taak={taak}
              onStatusChange={handleStatusChange}
              onReactionClick={(id) => console.log('Reaction clicked:', id)}
              reactionCount={taak.reactionCount || 0}
            />
          ))}
        </div>
      )}
    </div>
  )
}
