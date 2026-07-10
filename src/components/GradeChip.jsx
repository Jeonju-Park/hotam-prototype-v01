import React from 'react'

// 등급 칩 — 칩·그룹 헤더 어휘: 좋음/그저/별로 (스펙 §3). 항상 색+텍스트 병행.
const GRADE_LABELS = { good: '좋음', soso: '그저', bad: '별로' }

export default function GradeChip({ grade, count }) {
  return (
    <span className={`grade-chip ${grade}`}>
      {GRADE_LABELS[grade]}
      {count != null && <span className="grade-chip-count">{count}</span>}
    </span>
  )
}
