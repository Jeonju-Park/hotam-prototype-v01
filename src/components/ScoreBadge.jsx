import React from 'react'

// 표시 점수 뱃지 — 점수 숫자는 text-brand 전용(orange-700), tabular-nums
export default function ScoreBadge({ score, size = 'md' }) {
  return <span className={`score-badge score-${size}`}>{score.toFixed(1)}</span>
}
