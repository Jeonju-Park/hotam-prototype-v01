import React from 'react'
import { useApp } from '../App.jsx'

// ─────────────────────────────────────────────
// 마일스톤 렌즈 게이트 (스펙 §7)
// M2·M3 기능 요소에 우상단 micro 뱃지(M2=forest, M3=회청)를 달고,
// 렌즈 범위 밖이면 opacity 0.25 + 클릭 잠금.
// 사용: <MsGate ms="M2" data-func-id="HTM-S1-03">…</MsGate>
// ─────────────────────────────────────────────
const msRank = (ms) => (!ms ? 1 : /M3/.test(ms) ? 3 : /M2/.test(ms) ? 2 : 1)
const LENS_RANK = { M1: 1, M2: 2, M3: 3 }

export default function MsGate({ ms, children, className = '', ...rest }) {
  const { lens } = useApp()
  const r = msRank(ms)
  const locked = r > LENS_RANK[lens]

  return (
    <div className={`ms-wrap${locked ? ' ms-locked' : ''}${className ? ` ${className}` : ''}`} {...rest}>
      {r >= 2 && <span className={`ms-flag ${r === 3 ? 'm3' : 'm2'}`}>{r === 3 ? 'M3' : 'M2'}</span>}
      {children}
    </div>
  )
}
