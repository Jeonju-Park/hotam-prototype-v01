import React from 'react'
import { Image } from 'lucide-react'

// 더미 사진 (스펙 §1): 실사 금지 — gray-100 면 + 중앙 이미지 아이콘 + 좌하단 12px 라벨
export default function PhotoPlaceholder({ label, height = 200, style }) {
  return (
    <div className="photo-ph" style={{ height, ...style }}>
      <Image size={32} strokeWidth={1.5} />
      {label && <span className="ph-label">{label}</span>}
    </div>
  )
}
