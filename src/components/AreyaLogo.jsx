export default function AreyaLogo({ size = 32, showText = true }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
      <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
        <g transform="translate(30,30)">
          {[0,90,45,135].map((rot, i) => (
            <g key={rot} transform={`rotate(${rot})`} opacity={1 - i*0.18}>
              <rect x="-20" y="-5" width="16" height="5" rx="2" fill="#F3722A" transform="rotate(-45)"/>
              <rect x="4" y="-5" width="16" height="5" rx="2" fill="#F3722A" transform="rotate(-45)"/>
            </g>
          ))}
        </g>
      </svg>
      {showText && (
        <span style={{ fontFamily:"'Fredoka One',cursive", fontSize: size*0.75, color:'#F3722A', letterSpacing:1 }}>
          Areya
        </span>
      )}
    </div>
  )
}
