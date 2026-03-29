export default function ChipSelect({ opties, waarde, onChange, iconen, small }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {opties.map(o => (
        <button key={o} onClick={() => onChange(o)} style={{
          padding: small ? "6px 10px" : "8px 14px", borderRadius: 99,
          border: waarde === o ? "2px solid #1e3a5f" : "2px solid #e2e8f0",
          backgroundColor: waarde === o ? "#1e3a5f" : "white",
          color: waarde === o ? "white" : "#475569",
          cursor: "pointer", fontSize: small ? 12 : 13,
          fontWeight: waarde === o ? 600 : 400, transition: "all 0.15s", whiteSpace: "nowrap", minHeight: 44
        }}>
          {iconen && iconen[o] ? `${iconen[o]} ` : ""}{o}
        </button>
      ))}
    </div>
  );
}
