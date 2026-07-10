import React from 'react'
import { Image, Heart } from 'lucide-react'
import { useApp } from '../App.jsx'
import MsGate from './MsGate.jsx'
import ScoreBadge from './ScoreBadge.jsx'

// 탐색 리스트 행 (S9·S11 공용) — 사진·이름·동네·카테고리·전체 평점
// + M2: 리뷰 수·거리·찜 토글 / M3: 예상 점수 점선 뱃지 "예상 8.2"
// 거리·예상 점수는 더미(식당 id 기반 결정적 계산 — 사용자가 입력·수정 불가)
export const distanceOf = (r) => 150 + (parseInt(r.id.slice(1), 10) * 173) % 1200
export const predictedOf = (r) => {
  const n = parseInt(r.id.slice(1), 10)
  return Math.round(Math.min(9.8, Math.max(0.5, r.rating + ((n % 3) - 1) * 0.4)) * 10) / 10
}

export default function RestaurantRow({ restaurant: r, onClick, withFuncIds = true }) {
  const { wishedRestaurantIds, toggleWish } = useApp()
  const wished = wishedRestaurantIds.includes(r.id)
  const fid = (id) => (withFuncIds ? { 'data-func-id': id } : {})

  return (
    <div className="rrow">
      <button className="rrow-main" {...fid('HTM-S9-07')} onClick={onClick}>
        <div className="rest-row-thumb"><Image size={16} strokeWidth={1.5} /></div>
        <div className="rrow-text">
          <span className="t-title">{r.name}</span>
          <span className="t-caption" style={{ color: 'var(--text-secondary)' }}>
            {r.area} · {r.category} · <ScoreBadge score={r.rating} size="sm" />
          </span>
          {/* 확장 정보 (M2): 리뷰 수 · 거리 */}
          <MsGate ms="M2" {...fid('HTM-S9-08')} style={{ display: 'inline-block' }}>
            <span className="t-caption" style={{ color: 'var(--text-tertiary)' }}>
              리뷰 {r.reviewCount} · {distanceOf(r)}m
            </span>
          </MsGate>
        </div>
      </button>
      {/* 예상 점수 (M3) — 점선 뱃지 */}
      <MsGate ms="M3" {...fid('HTM-S9-09')} style={{ display: 'inline-flex' }}>
        <span className="predict-badge t-micro">예상 {predictedOf(r).toFixed(1)}</span>
      </MsGate>
      {/* 찜 토글 (M2) */}
      <MsGate ms="M2" {...fid('HTM-S9-08')} style={{ display: 'inline-flex' }}>
        <button
          className={`card-action${wished ? ' is-on' : ''}`}
          aria-label="찜"
          onClick={(e) => { e.stopPropagation(); toggleWish(r.id) }}
        >
          <Heart size={18} strokeWidth={1.8} fill={wished ? 'var(--main-primary)' : 'none'} />
        </button>
      </MsGate>
    </div>
  )
}
