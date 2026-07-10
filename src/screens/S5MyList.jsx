import React, { useState } from 'react'
import { Search, Share2, GripVertical } from 'lucide-react'
import { useApp } from '../App.jsx'
import AppBar from '../components/AppBar.jsx'
import MsGate from '../components/MsGate.jsx'
import GradeChip from '../components/GradeChip.jsx'
import ScoreBadge from '../components/ScoreBadge.jsx'
import { getRestaurant } from '../data/dummy.js'

// S5 내 리스트 — 그룹 헤더 3(좋음/그저/별로, 등급 칩 스타일) + 행: 순번·이름·동네·점수.
// 드래그 재정렬(M2) 작동 — 순서만 바꾸고 점수는 비교 이벤트로 반영(스낵바 카피가 암시).
// [검색/필터 M3] · [리스트 공유 M2→S8] · '별로' 그룹 빈 데모.
const ROW_H = 56
const GRADES = ['good', 'soso', 'bad']

export default function S5MyList() {
  const { goBack, navigate, myListData, reorderMyList, showToast, demoEmpty, lastRecord, lens } = useApp()
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [drag, setDrag] = useState(null) // { grade, from, cur, startY, dy }

  const dragLocked = lens === 'M1' // 렌즈 밖(M2 기능) 클릭 잠금
  const dragEnabled = !query.trim() && !dragLocked

  const itemsOf = (grade) => {
    if (demoEmpty && grade === 'bad') return []
    let items = myListData[grade]
    const q = query.trim()
    if (q) {
      items = items.filter((it) => {
        const r = getRestaurant(it.restaurantId)
        return r.name.includes(q) || r.area.includes(q)
      })
    }
    return items
  }

  const startDrag = (grade, idx) => (e) => {
    if (!dragEnabled) return
    e.preventDefault()
    try { e.currentTarget.setPointerCapture(e.pointerId) } catch { /* 합성 이벤트 대비 */ }
    setDrag({ grade, from: idx, cur: idx, startY: e.clientY, dy: 0 })
  }
  const moveDrag = (grade) => (e) => {
    setDrag((d) => {
      if (!d || d.grade !== grade) return d
      const dy = e.clientY - d.startY
      const len = myListData[grade].length
      const cur = Math.max(0, Math.min(len - 1, d.from + Math.round(dy / ROW_H)))
      return { ...d, dy, cur }
    })
  }
  const endDrag = () => {
    if (drag && drag.cur !== drag.from) {
      reorderMyList(drag.grade, drag.from, drag.cur)
      showToast('순위를 바꿨어요 — 비교 2개로 점수에 반영할게요')
    }
    setDrag(null)
  }

  const rowStyle = (grade, idx) => {
    if (!drag || drag.grade !== grade) return undefined
    if (idx === drag.from) {
      return { transform: `translateY(${drag.dy}px)`, zIndex: 2, position: 'relative', boxShadow: 'var(--shadow-lg)' }
    }
    if (drag.from < drag.cur && idx > drag.from && idx <= drag.cur) {
      return { transform: `translateY(-${ROW_H}px)`, transition: 'transform 120ms' }
    }
    if (drag.from > drag.cur && idx < drag.from && idx >= drag.cur) {
      return { transform: `translateY(${ROW_H}px)`, transition: 'transform 120ms' }
    }
    return { transition: 'transform 120ms' }
  }

  return (
    <div className="page">
      <AppBar
        title="내 리스트"
        onBack={goBack}
        right={
          <>
            <MsGate ms="M3" data-func-id="HTM-S5-03" style={{ display: 'inline-flex' }}>
              <button className="icon-btn" aria-label="리스트 검색" onClick={() => { setSearchOpen(!searchOpen); setQuery('') }}>
                <Search size={22} strokeWidth={1.8} />
              </button>
            </MsGate>
            <MsGate ms="M2" data-func-id="HTM-S5-04" style={{ display: 'inline-flex' }}>
              <button className="icon-btn" aria-label="리스트 공유" onClick={() => navigate('S8')}>
                <Share2 size={22} strokeWidth={1.8} />
              </button>
            </MsGate>
          </>
        }
      />

      {searchOpen && (
        <div className="page-pad" style={{ paddingBottom: 'var(--sp-sm)' }}>
          <input className="input" placeholder="리스트에서 검색" autoFocus value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      )}

      <div className="mylist-body" data-func-id="HTM-S5-01">
        {GRADES.map((grade) => {
          const items = itemsOf(grade)
          return (
            <section key={grade} className="mylist-group">
              <div className="mylist-group-head">
                <GradeChip grade={grade} count={demoEmpty && grade === 'bad' ? 0 : myListData[grade].length} />
              </div>

              {items.map((it, idx) => {
                const r = getRestaurant(it.restaurantId)
                const isNew = lastRecord?.restaurantId === it.restaurantId && lastRecord?.grade === grade
                return (
                  <div className="mylist-row" key={it.restaurantId} style={rowStyle(grade, idx)}>
                    <span className="mylist-rank t-title">{idx + 1}</span>
                    <div className="mylist-text">
                      <span className="t-title">
                        {r.name}
                        {isNew && <span className="new-chip">방금</span>}
                      </span>
                      <span className="t-caption" style={{ color: 'var(--text-secondary)' }}>{r.area} · {r.category}</span>
                    </div>
                    <ScoreBadge score={it.score} />
                    <button
                      className="drag-handle"
                      data-func-id="HTM-S5-02"
                      aria-label="순위 조정"
                      style={dragLocked ? { opacity: 0.25, pointerEvents: 'none' } : undefined}
                      onPointerDown={startDrag(grade, idx)}
                      onPointerMove={moveDrag(grade)}
                      onPointerUp={endDrag}
                      onPointerCancel={endDrag}
                    >
                      <GripVertical size={18} strokeWidth={1.8} />
                    </button>
                  </div>
                )
              })}

              {items.length === 0 && (
                <p className="t-body mylist-empty">
                  {grade === 'bad' && demoEmpty ? '별로였던 집이 없다니, 축하해요' : query.trim() ? '검색 결과가 없어요' : '아직 비어 있어요'}
                </p>
              )}
            </section>
          )
        })}
      </div>
    </div>
  )
}
