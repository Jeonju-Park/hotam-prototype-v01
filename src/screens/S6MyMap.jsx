import React from 'react'
import { Share2 } from 'lucide-react'
import { useApp } from '../App.jsx'
import AppBar from '../components/AppBar.jsx'
import MsGate from '../components/MsGate.jsx'
import MapPlaceholder from '../components/MapPlaceholder.jsx'
import { getRestaurant } from '../data/dummy.js'

// S6 내 지도 (M3) — 가본 곳 핀(등급색) + 찜 핀(테두리만) + 범례 + 공유 → S8
const PIN_POS = [
  { x: 18, y: 22 }, { x: 45, y: 15 }, { x: 72, y: 28 }, { x: 30, y: 42 },
  { x: 60, y: 50 }, { x: 82, y: 62 }, { x: 22, y: 66 }, { x: 48, y: 78 },
  { x: 70, y: 82 }, { x: 35, y: 88 }, { x: 85, y: 40 }, { x: 12, y: 45 },
]
const GRADE_COLORS = { good: 'var(--grade-good)', soso: 'var(--grade-soso)', bad: 'var(--grade-bad)' }

export default function S6MyMap() {
  const { goBack, navigate, myListData, wishedRestaurantIds } = useApp()

  const visitedPins = Object.entries(myListData)
    .flatMap(([grade, items]) => items.map((it) => ({ id: it.restaurantId, grade })))
  const wishPins = wishedRestaurantIds
    .filter((id) => !visitedPins.some((p) => p.id === id))
    .map((id) => ({ id, wish: true }))
  const pins = [...visitedPins, ...wishPins].slice(0, PIN_POS.length).map((p, i) => ({
    ...PIN_POS[i],
    id: p.id,
    label: getRestaurant(p.id)?.name,
    color: p.wish ? 'var(--main-secondary)' : GRADE_COLORS[p.grade],
    variant: p.wish ? 'outline' : 'fill',
  }))

  return (
    <div className="page">
      <AppBar
        title="내 미식 지도"
        onBack={goBack}
        right={
          <button className="icon-btn" aria-label="지도 공유" onClick={() => navigate('S8')}>
            <Share2 size={22} strokeWidth={1.8} />
          </button>
        }
      />

      <MsGate ms="M3" data-func-id="HTM-S6-01" className="page-pad" style={{ flex: 1 }}>
        <MapPlaceholder
          height={480}
          pins={pins}
          onPinClick={(pin) => navigate('S4', { params: { restaurantId: pin.id } })}
        />
        {/* 범례 — 등급은 항상 색+텍스트 병행 */}
        <div className="map-legend">
          <span className="legend-item"><span className="legend-dot" style={{ background: 'var(--grade-good)' }} />좋음</span>
          <span className="legend-item"><span className="legend-dot" style={{ background: 'var(--grade-soso)' }} />그저</span>
          <span className="legend-item"><span className="legend-dot" style={{ background: 'var(--grade-bad)' }} />별로</span>
          <span className="legend-item"><span className="legend-dot legend-outline" />찜</span>
        </div>
      </MsGate>
    </div>
  )
}
