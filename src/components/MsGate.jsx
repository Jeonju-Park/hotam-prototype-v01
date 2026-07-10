import React from 'react'
import { useApp } from '../App.jsx'

// ─────────────────────────────────────────────
// 마일스톤 렌즈 게이트 (스펙 §7 + v2 §3-③)
// v2: data-func-id가 있으면 마일스톤을 라이브 IA(Supabase)에서 조회 —
// 테이블에서 드롭다운을 바꾸면 내 화면·원격 모두 뱃지/투명도가 즉시 재계산된다.
// ms prop은 폴백(func-id 없는 요소·오프라인 초기값).
// Later/결정대기로 바뀐 기능은 어떤 렌즈에서도 잠긴다(프로토타입 스코프 밖).
// ─────────────────────────────────────────────
const msRank = (ms) => {
  if (!ms) return 1
  if (/later|결정대기/i.test(ms)) return 4
  if (/M3/.test(ms)) return 3
  if (/M2/.test(ms)) return 2
  return 1
}
const LENS_RANK = { M1: 1, M2: 2, M3: 3 }
const badgeLabel = (ms) => (/결정대기/.test(ms) ? '대기' : /later/i.test(ms) ? 'Later' : /M3/.test(ms) ? 'M3' : 'M2')

export default function MsGate({ ms, children, className = '', ...rest }) {
  const { lens, iaFeatures } = useApp()
  const funcId = rest['data-func-id']
  const liveMs = funcId ? iaFeatures?.[funcId]?.milestone : undefined
  const effMs = liveMs ?? ms

  const r = msRank(effMs)
  const locked = r > LENS_RANK[lens]

  return (
    <div className={`ms-wrap${locked ? ' ms-locked' : ''}${className ? ` ${className}` : ''}`} {...rest}>
      {r >= 2 && (
        <span className={`ms-flag ${r === 4 ? 'later' : r === 3 ? 'm3' : 'm2'}`}>{badgeLabel(effMs)}</span>
      )}
      {children}
    </div>
  )
}
