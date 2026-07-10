import React from 'react'
import { ChevronLeft } from 'lucide-react'

// 하위 페이지 공용 앱바 — 뒤로 + 타이틀 + 우측 슬롯
export default function AppBar({ title, onBack, right }) {
  return (
    <header className="appbar">
      {onBack ? (
        <button className="icon-btn" onClick={onBack} aria-label="뒤로">
          <ChevronLeft size={24} />
        </button>
      ) : (
        <span style={{ width: 44 }} />
      )}
      <span className="t-heading-sm">{title}</span>
      <span className="spacer" />
      {right}
    </header>
  )
}
