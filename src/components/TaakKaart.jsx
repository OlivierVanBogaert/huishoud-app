const COLORS = {
  primary: '#1e3a5f',
  secondary: '#2d5f8a',
  white: '#ffffff',
  light: '#f5f5f5',
  danger: '#dc3545'
}

const prioriteitKleuren = {
  'hoog': '#dc3545',
  'normaal': '#ffc107',
  'laag': '#28a745'
}

const statusLabels = {
  'todo': 'Te doen',
  'bezig': 'Bezig',
  'klaar': 'Klaar'
}

export default function TaakKaart({
  taak,
  onStatusChange,
  onReactionClick,
  reactionCount = 0
}) {
  return (
    <div style={{
      backgroundColor: COLORS.white,
      borderRadius: '8px',
      padding: '1rem',
      marginBottom: '1rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      borderLeft: `4px solid ${prioriteitKleuren[taak.prioriteit] || prioriteitKleuren.normaal}`
    }}>
      <div style={{ marginBottom: '0.75rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'start',
          gap: '0.5rem'
        }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '16px', fontWeight: '600' }}>
              {taak.taak}
            </h3>
            {taak.foto_url && (
              <img
                src={taak.foto_url}
                alt={taak.taak}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '4px',
                  marginBottom: '0.75rem'
                }}
              />
            )}
          </div>
        </div>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginBottom: '0.75rem'
        }}>
          {taak.categorie && (
            <span style={{
              backgroundColor: '#e9ecef',
              padding: '0.25rem 0.75rem',
              borderRadius: '16px',
              fontSize: '12px',
              fontWeight: '500'
            }}>
              {taak.categorie}
            </span>
          )}
          {taak.persoon && (
            <span style={{
              backgroundColor: '#e9ecef',
              padding: '0.25rem 0.75rem',
              borderRadius: '16px',
              fontSize: '12px',
              fontWeight: '500'
            }}>
              👤 {taak.persoon}
            </span>
          )}
          {taak.datum && (
            <span style={{
              backgroundColor: '#e9ecef',
              padding: '0.25rem 0.75rem',
              borderRadius: '16px',
              fontSize: '12px',
              fontWeight: '500'
            }}>
              📅 {new Date(taak.datum).toLocaleDateString('nl-NL')}
            </span>
          )}
        </div>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '0.5rem',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <select
            value={taak.status}
            onChange={(e) => onStatusChange?.(taak.id, e.target.value)}
            style={{
              padding: '0.5rem 0.75rem',
              borderRadius: '4px',
              border: `1px solid ${COLORS.secondary}`,
              backgroundColor: COLORS.white,
              color: COLORS.primary,
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            {Object.entries(statusLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => onReactionClick?.(taak.id)}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '16px',
            border: `1px solid ${COLORS.secondary}`,
            backgroundColor: COLORS.white,
            color: COLORS.secondary,
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = COLORS.secondary
            e.target.style.color = COLORS.white
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = COLORS.white
            e.target.style.color = COLORS.secondary
          }}
        >
          💬 {reactionCount > 0 ? reactionCount : 'Reageer'}
        </button>
      </div>
    </div>
  )
}
