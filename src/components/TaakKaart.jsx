import { useState } from 'react'

const PRIORITEITEN = { hoog: '🔴', normaal: '🟠', laag: '🟢' }

const HUIS_IDS = {
  '🏠 Olivier & Ashley': 'ada24453-c203-4639-be69-0cdae55df9f4',
  '🏡 Jan': 'b678cfb5-66be-4a29-8200-7b417e9e7ff5'
}

const HUIS_NAMEN = Object.fromEntries(
  Object.entries(HUIS_IDS).map(([k, v]) => [v, k])
)

export default function TaakKaart({
  taak,
  magAllesZien,
  onStatusChange,
  onDelete,
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
