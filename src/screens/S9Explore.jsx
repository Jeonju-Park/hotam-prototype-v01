import React, { useMemo, useRef, useState } from 'react'
import { Search, LocateFixed } from 'lucide-react'
import { useApp } from '../App.jsx'
import MsGate from '../components/MsGate.jsx'
import MapPlaceholder from '../components/MapPlaceholder.jsx'
import RestaurantRow, { distanceOf } from '../components/RestaurantRow.jsx'
import { restaurants } from '../data/dummy.js'

// S9 탐색 — 지도 플레이스홀더+핀 6 + 리스트 바텀시트(절반↔풀 드래그/탭 전환).
// 정렬 세그먼트는 실제 재정렬. 필터 칩(M2)은 탭 시 선택 표시만(스펙).
const SORTS = [
  { key: 'rank', label: '랭킹순' },
  { key: 'dist', label: '거리순' },
  { key: 'new',  label: '최신순' },
]
const FILTERS = ['지역', '종목', '근처']
const PIN_POS = [
  { x: 20, y: 28 }, { x: 52, y: 18 }, { x: 78, y: 38 },
  { x: 30, y: 55 }, { x: 62, y: 62 }, { x: 45, y: 80 },
]

export default function S9Explore() {
  const { navigate, showToast, demoError } = useApp()
  const [sort, setSort] = useState('rank')
  const [filters, setFilters] = useState([])
  const [sheetPos, setSheetPos] = useState('half')
  const grabY = useRef(null)

  const sorted = useMemo(() => {
    const list = [...restaurants]
    if (sort === 'rank') list.sort((a, b) => b.rating - a.rating)
    if (sort === 'dist') list.sort((a, b) => distanceOf(a) - distanceOf(b))
    if (sort === 'new')  list.reverse()
    return list
  }, [sort])

  const pins = sorted.slice(0, 6).map((r, i) => ({ ...PIN_POS[i], id: r.id, label: r.name }))
  const toggleFilter = (f) => setFilters((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]))

  // 시트 절반↔풀: 드래그(±50px) 또는 탭으로 전환
  const onGrabDown = (e) => {
    e.preventDefault()
    try { e.currentTarget.setPointerCapture(e.pointerId) } catch { /* 합성 이벤트 대비 */ }
    grabY.current = e.clientY
  }
  const onGrabUp = (e) => {
    if (grabY.current == null) return
    const dy = e.clientY - grabY.current
    grabY.current = null
    if (dy < -50) setSheetPos('full')
    else if (dy > 50) setSheetPos('half')
    else setSheetPos((p) => (p === 'half' ? 'full' : 'half'))
  }

  return (
    <div className="explore">
      {/* 상단: 검색 바(→S15 식당 탭) + 필터 칩(M2 — 선택 표시만) */}
      <div className="explore-top">
        <button className="search-box explore-search" data-func-id="HTM-S9-01" onClick={() => navigate('S15')}>
          <Search size={18} strokeWidth={1.8} />
          <span className="t-body" style={{ color: 'var(--text-tertiary)' }}>식당 검색</span>
        </button>
        <MsGate ms="M2" data-func-id="HTM-S9-02">
          <div className="chip-row">
            {FILTERS.map((f) => (
              <button key={f} className={`criteria-chip${filters.includes(f) ? ' is-selected' : ''}`} onClick={() => toggleFilter(f)}>
                {f}
              </button>
            ))}
          </div>
        </MsGate>
      </div>

      {/* 지도 + 핀 6 (핀 탭 → S4) */}
      <div className="explore-map" data-func-id="HTM-S9-03">
        <MapPlaceholder height="100%" pins={pins} onPinClick={(pin) => navigate('S4', { params: { restaurantId: pin.id } })} />
      </div>

      {/* 내 위치 */}
      <button
        className="locate-btn"
        data-func-id="HTM-S9-04"
        aria-label="내 위치"
        style={{ bottom: sheetPos === 'half' ? '47%' : undefined, display: sheetPos === 'full' ? 'none' : undefined }}
        onClick={() => showToast('현재 위치로 이동했어요 (더미)')}
      >
        <LocateFixed size={20} strokeWidth={1.8} />
      </button>

      {/* 리스트 바텀시트 — 절반↔풀 */}
      <div className={`explore-sheet ${sheetPos}`} data-func-id="HTM-S9-05">
        <button
          className="sheet-grab"
          aria-label={sheetPos === 'half' ? '시트 펼치기' : '시트 접기'}
          onPointerDown={onGrabDown}
          onPointerUp={onGrabUp}
          onPointerCancel={() => { grabY.current = null }}
        >
          <span className="grab-bar" />
        </button>

        {demoError ? (
          <div className="error-card" style={{ margin: 'var(--sp-md) var(--sp-page)' }}>
            <p className="t-title">주변 식당을 불러오지 못했어요</p>
            <p className="t-caption" style={{ color: 'var(--text-secondary)' }}>탐이 코가 잠시 막혔나 봐요.</p>
            <button className="btn btn-secondary" onClick={() => showToast('에러 데모 중 — 스위치를 끄면 복구돼요')}>다시 시도</button>
          </div>
        ) : (
          <>
            {/* 정렬 세그먼트 — 실제 재정렬 작동 */}
            <div className="seg-row page-pad-x" data-func-id="HTM-S9-06" style={{ marginTop: 0 }}>
              {SORTS.map((s) => (
                <button key={s.key} className={`seg-btn${sort === s.key ? ' is-active' : ''}`} onClick={() => setSort(s.key)}>
                  {s.label}
                </button>
              ))}
            </div>
            <div className="explore-list">
              {sorted.map((r) => (
                <RestaurantRow key={r.id} restaurant={r} onClick={() => navigate('S4', { params: { restaurantId: r.id } })} />
              ))}
              <button className="btn-text" data-func-id="HTM-S9-10" style={{ alignSelf: 'center' }} onClick={() => navigate('S18')}>
                여기 없어요? 식당 추가
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
