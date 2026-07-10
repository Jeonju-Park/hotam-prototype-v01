import React from 'react'
import { MapPin } from 'lucide-react'

// 지도 플레이스홀더 (스펙 §1) — gray-100 면 + 도로 느낌 라인 + 핀
export default function MapPlaceholder({ height = 240, pins = [], onPinClick }) {
  return (
    <div className="map-ph" style={{ height }}>
      <svg className="map-roads" viewBox="0 0 350 240" preserveAspectRatio="none" aria-hidden>
        <path d="M0 60 L350 40" stroke="var(--border-default)" strokeWidth="6" fill="none" />
        <path d="M0 150 L350 180" stroke="var(--border-default)" strokeWidth="10" fill="none" />
        <path d="M80 0 L110 240" stroke="var(--border-default)" strokeWidth="6" fill="none" />
        <path d="M240 0 L220 240" stroke="var(--border-default)" strokeWidth="8" fill="none" />
      </svg>
      {pins.map((pin, i) => {
        const color = pin.color ?? 'var(--main-secondary)'
        const outline = pin.variant === 'outline' // 찜 핀 = 테두리만
        return (
          <button
            key={pin.id ?? i}
            className="map-pin"
            style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
            onClick={() => onPinClick?.(pin)}
            aria-label={pin.label ?? '핀'}
          >
            <MapPin size={24} fill={outline ? 'var(--bg-surface)' : color} color={outline ? color : 'var(--bg-surface)'} />
          </button>
        )
      })}
    </div>
  )
}
