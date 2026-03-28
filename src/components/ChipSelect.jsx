const COLORS = {
  primary: '#1e3a5f',
  secondary: '#2d5f8a',
  white: '#ffffff'
}

export default function ChipSelect({
  label,
  options,
  value,
  onChange,
  multiple = false,
  placeholder = 'Selecteer...'
}) {
  const selectedValues = Array.isArray(value) ? value : (value ? [value] : [])

  const toggleOption = (optionValue) => {
    if (multiple) {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter(v => v !== optionValue)
        : [...selectedValues, optionValue]
      onChange(newValues)
    } else {
      onChange(selectedValues.includes(optionValue) ? null : optionValue)
    }
  }

  return (
    <div style={{ marginBottom: '1rem' }}>
      {label && (
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '600',
          marginBottom: '0.5rem',
          color: COLORS.primary
        }}>
          {label}
        </label>
      )}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        {options.map(option => {
          const isSelected = selectedValues.includes(option.value)
          return (
            <button
              key={option.value}
              onClick={() => toggleOption(option.value)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '16px',
                border: `2px solid ${COLORS.secondary}`,
                backgroundColor: isSelected ? COLORS.secondary : COLORS.white,
                color: isSelected ? COLORS.white : COLORS.secondary,
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
