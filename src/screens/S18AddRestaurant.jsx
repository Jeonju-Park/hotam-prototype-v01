import React, { useState } from 'react'
import { Image, Check } from 'lucide-react'
import { useApp } from '../App.jsx'
import AppBar from '../components/AppBar.jsx'

// S18 식당 추가 — 폼: 사진(선택)·식당명·위치·카테고리.
// 필수 3개(식당명·위치·카테고리) 채우면 버튼 활성 → 성공 토스트 → 뒤로.
const CATEGORIES = ['한식', '중식', '일식', '양식', '카페', '디저트', '분식']

export default function S18AddRestaurant() {
  const { goBack, showToast } = useApp()
  const [photo, setPhoto] = useState(false)
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [category, setCategory] = useState(null)

  const canSubmit = name.trim().length > 0 && location.trim().length > 0 && category !== null

  const submit = () => {
    showToast('제보 접수! 탐이가 킁킁 맡아볼게요')
    goBack()
  }

  return (
    <div className="page">
      <AppBar title="식당 추가" onBack={goBack} />

      <div className="page-pad form-group" data-func-id="HTM-S18-01" style={{ gap: 'var(--sp-md)' }}>
        <div>
          <span className="t-caption field-label">사진 (선택)</span>
          <button
            className={`photo-tile s18-photo${photo ? ' is-selected' : ''}`}
            onClick={() => setPhoto(!photo)}
            aria-label="사진 추가"
          >
            {photo ? <Check size={20} /> : <Image size={20} strokeWidth={1.5} />}
          </button>
        </div>

        <div>
          <label className="t-caption field-label" htmlFor="s18-name">식당명</label>
          <input id="s18-name" className="input" placeholder="가게 이름" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div>
          <label className="t-caption field-label" htmlFor="s18-loc">위치</label>
          <input id="s18-loc" className="input" placeholder="예: 성수동 2가" value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>

        <div>
          <span className="t-caption field-label">카테고리</span>
          <div className="chip-row">
            {CATEGORIES.map((c) => (
              <button key={c} className={`criteria-chip${category === c ? ' is-selected' : ''}`} onClick={() => setCategory(c)}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <button className="btn btn-primary" disabled={!canSubmit} onClick={submit}>
          제보하기
        </button>
      </div>
    </div>
  )
}
