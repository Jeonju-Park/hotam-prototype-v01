import React, { useMemo, useState } from 'react'
import { useApp } from '../../App.jsx'
import { msBucket } from '../../lib/useIaLive.js'

// 마일스톤 집계 미니 패널 (v2.1 §5) — 렌즈 바로 아래.
// 현재 화면|전체 토글 · 항목 클릭 = 테이블 마일스톤 필터 · 실시간 값 기준 · 미구현 병기.
const BUCKETS = ['M1', 'M2', 'M3', 'Later', '결정대기']

export default function MsAggregate({ setFilter, setTab, implementedIds }) {
  const { iaFeatureList, currentScreen } = useApp()
  const [scope, setScope] = useState('screen') // 'screen' | 'all'

  const { counts, unimpl, total } = useMemo(() => {
    const list = iaFeatureList.filter((f) => !f.archived && (scope === 'all' || f.screen === currentScreen))
    const counts = Object.fromEntries(BUCKETS.map((b) => [b, 0]))
    const unimpl = Object.fromEntries(BUCKETS.map((b) => [b, 0]))
    for (const f of list) {
      const b = msBucket(f.milestone)
      counts[b]++
      // 미구현 병기는 DOM 판정이 가능한 현재 화면 행 기준
      if (f.screen === currentScreen && !implementedIds.has(f.id)) unimpl[b]++
    }
    return { counts, unimpl, total: list.length }
  }, [iaFeatureList, scope, currentScreen, implementedIds])

  const max = Math.max(1, ...BUCKETS.map((b) => counts[b]))

  return (
    <div className="ms-agg">
      <div className="ms-agg-head">
        <span className="t-caption tool-label">마일스톤 집계 · {total}</span>
        <span className="spacer" />
        <div className="lens-seg" style={{ width: 130, gridTemplateColumns: '1fr 1fr' }}>
          <button className={scope === 'screen' ? 'is-active' : ''} onClick={() => setScope('screen')}>현재 화면</button>
          <button className={scope === 'all' ? 'is-active' : ''} onClick={() => setScope('all')}>전체</button>
        </div>
      </div>
      {BUCKETS.map((b) => (
        <button
          key={b}
          className="ms-agg-row"
          title={`테이블을 ${b} 필터로 보기`}
          onClick={() => {
            setFilter((p) => ({ ...p, milestone: b, scope: scope === 'all' ? 'all' : 'screen' }))
            setTab('table')
          }}
        >
          <span className="t-micro ms-agg-label">{b}</span>
          <span className="ms-agg-track">
            <span className="ms-agg-fill" style={{ width: `${(counts[b] / max) * 100}%` }} />
          </span>
          <span className="t-micro ms-agg-num">
            {counts[b]}{scope === 'screen' && unimpl[b] > 0 ? ` (미구현 ${unimpl[b]})` : ''}
          </span>
        </button>
      ))}
    </div>
  )
}
