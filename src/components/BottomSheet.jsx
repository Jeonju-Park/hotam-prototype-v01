import React from 'react'

// 바텀시트 (SHT_) — 프레임 안 스크림 + radius-lg 시트, 스크림 탭으로 닫기
export default function BottomSheet({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <div className="sheet-scrim" onClick={onClose}>
      <div className="sheet" role="dialog" onClick={(e) => e.stopPropagation()}>
        {title && <h2 className="t-heading-sm sheet-title">{title}</h2>}
        {children}
      </div>
    </div>
  )
}
