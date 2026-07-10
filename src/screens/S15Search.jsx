import React, { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, Search, Map, List, Image, BadgeCheck } from 'lucide-react'
import { useApp } from '../App.jsx'
import MsGate from '../components/MsGate.jsx'
import Avatar from '../components/Avatar.jsx'
import FollowButton from '../components/FollowButton.jsx'
import ScoreBadge from '../components/ScoreBadge.jsx'
import MapPlaceholder from '../components/MapPlaceholder.jsx'
import { restaurants, users, searchSuggests } from '../data/dummy.js'

// S15 통합검색 — placeholder 로테이션 3종(브랜드 캐논: 브랜드형/스코프형/공감형 순환),
// 결과 탭 식당|미식가, 정렬·필터(M2), 지도뷰 토글(M3), 결과 없음 상태.
const PLACEHOLDERS = ['식당, 미식가 검색', '오늘은 어느 집을 노려볼까요?', '어제 그 집 이름이 뭐였더라']
const SORTS = [
  { key: 'rank', label: '랭킹순' },
  { key: 'dist', label: '거리순' },
  { key: 'new',  label: '최신순' },
]
const AREAS = ['성수', '연남', '을지로', '망원']
const PIN_POS = [
  { x: 22, y: 30 }, { x: 55, y: 20 }, { x: 75, y: 45 },
  { x: 35, y: 62 }, { x: 60, y: 75 }, { x: 18, y: 80 },
]

export default function S15Search() {
  const { goBack, navigate, demoEmpty } = useApp()
  const [phIdx, setPhIdx] = useState(0)
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState('restaurants')
  const [sort, setSort] = useState('rank')
  const [areas, setAreas] = useState([])
  const [mapView, setMapView] = useState(false)

  // placeholder 로테이션 — 문구별 전환 데이터 수집 컨셉(브랜드 캐논)
  useEffect(() => {
    const t = setInterval(() => setPhIdx((i) => (i + 1) % PLACEHOLDERS.length), 3500)
    return () => clearInterval(t)
  }, [])

  const q = query.trim()

  const restResults = useMemo(() => {
    if (demoEmpty) return []
    let list = restaurants.filter((r) => !q || r.name.includes(q) || r.area.includes(q) || r.category.includes(q))
    if (areas.length) list = list.filter((r) => areas.includes(r.area))
    if (sort === 'rank') list = [...list].sort((a, b) => b.rating - a.rating)
    if (sort === 'new') list = [...list].reverse()
    return list
  }, [q, sort, areas, demoEmpty])

  const userResults = useMemo(() => {
    if (demoEmpty) return []
    return users.filter((u) => u.id !== 'u1' && (!q || u.nickname.includes(q) || u.area.includes(q)))
  }, [q, demoEmpty])

  const toggleArea = (a) => setAreas((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]))
  const pins = restResults.slice(0, 6).map((r, i) => ({ ...PIN_POS[i], id: r.id, label: r.name }))

  return (
    <div className="page">
      {/* 검색 앱바 (HTM-S15-01 검색 실행) */}
      <header className="appbar">
        <button className="icon-btn" onClick={goBack} aria-label="뒤로"><ChevronLeft size={24} /></button>
        <div className="search-box appbar-search" data-func-id="HTM-S15-01">
          <Search size={18} strokeWidth={1.8} />
          <input
            className="search-input"
            placeholder={PLACEHOLDERS[phIdx]}
            value={query}
            autoFocus
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </header>

      {!q && (
        <div className="page-pad">
          {/* 최근 검색어 (M2) */}
          <MsGate ms="M2" data-func-id="HTM-S15-05">
            <span className="t-caption section-label">최근 검색어</span>
            <div className="chip-row">
              {searchSuggests.slice(0, 3).map((s) => (
                <button key={s} className="criteria-chip" onClick={() => setQuery(s)}>{s}</button>
              ))}
            </div>
          </MsGate>
          {/* 추천 검색어 (M3) */}
          <MsGate ms="M3" data-func-id="HTM-S15-06" style={{ marginTop: 'var(--sp-md)' }}>
            <span className="t-caption section-label">탐이의 추천 검색어</span>
            <div className="chip-row">
              {searchSuggests.slice(3).map((s) => (
                <button key={s} className="criteria-chip" onClick={() => setQuery(s)}>{s}</button>
              ))}
            </div>
          </MsGate>
        </div>
      )}

      {q && (
        <>
          {/* 결과 탭: 식당 | 미식가 */}
          <div className="seg-row page-pad-x">
            <button className={`seg-btn${tab === 'restaurants' ? ' is-active' : ''}`} data-func-id="HTM-S15-02" onClick={() => setTab('restaurants')}>
              식당
            </button>
            <button className={`seg-btn${tab === 'users' ? ' is-active' : ''}`} data-func-id="HTM-S15-03" onClick={() => setTab('users')}>
              미식가
            </button>
          </div>

          {tab === 'restaurants' && (
            <>
              {/* 정렬(M2) · 필터(M2) · 지도뷰 토글(M3) */}
              <div className="filter-bar page-pad-x">
                <MsGate ms="M2" data-func-id="HTM-S15-07" style={{ display: 'inline-flex' }}>
                  <div className="chip-row">
                    {SORTS.map((s) => (
                      <button key={s.key} className={`criteria-chip${sort === s.key ? ' is-selected' : ''}`} onClick={() => setSort(s.key)}>
                        {s.label}
                      </button>
                    ))}
                  </div>
                </MsGate>
                <MsGate ms="M2" data-func-id="HTM-S15-08" style={{ display: 'inline-flex' }}>
                  <div className="chip-row">
                    {AREAS.map((a) => (
                      <button key={a} className={`criteria-chip${areas.includes(a) ? ' is-selected' : ''}`} onClick={() => toggleArea(a)}>
                        {a}
                      </button>
                    ))}
                  </div>
                </MsGate>
                <span className="spacer" />
                <MsGate ms="M3" data-func-id="HTM-S15-09" style={{ display: 'inline-flex' }}>
                  <button className="icon-btn" aria-label="지도뷰 전환" onClick={() => setMapView(!mapView)}>
                    {mapView ? <List size={20} strokeWidth={1.8} /> : <Map size={20} strokeWidth={1.8} />}
                  </button>
                </MsGate>
              </div>

              {restResults.length === 0 ? (
                /* 결과 없음 — 위트 + 식당 추가 CTA */
                <div className="feed-empty">
                  <div className="tami"><span className="t-caption">탐이</span></div>
                  <p className="t-heading-sm">이 집은 아직 아무도 못 찾았어요</p>
                  <p className="t-body" style={{ color: 'var(--text-secondary)' }}>먼저 발견한 사람이 임자예요.</p>
                  <button className="btn btn-secondary" style={{ width: 'auto', padding: '0 24px' }} onClick={() => navigate('S18')}>
                    식당 추가하기
                  </button>
                </div>
              ) : mapView ? (
                <div className="page-pad">
                  <MapPlaceholder height={320} pins={pins} onPinClick={(pin) => navigate('S4', { params: { restaurantId: pin.id } })} />
                </div>
              ) : (
                <div className="rest-list page-pad-x">
                  {restResults.map((r) => (
                    <button key={r.id} className="rest-row" onClick={() => navigate('S4', { params: { restaurantId: r.id } })}>
                      <div className="rest-row-thumb"><Image size={16} strokeWidth={1.5} /></div>
                      <div className="rest-row-text">
                        <span className="t-title">{r.name}</span>
                        <span className="t-caption" style={{ color: 'var(--text-secondary)' }}>{r.area} · {r.category} · 리뷰 {r.reviewCount}</span>
                      </div>
                      <ScoreBadge score={r.rating} size="sm" />
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {tab === 'users' && (
            <div className="user-list">
              {userResults.length === 0 ? (
                <div className="feed-empty">
                  <div className="tami"><span className="t-caption">탐이</span></div>
                  <p className="t-heading-sm">그런 미식가는 아직 없어요</p>
                </div>
              ) : (
                userResults.map((u) => (
                  <div className="user-row" key={u.id}>
                    <button className="user-row-main" onClick={() => navigate('S10', { params: { userId: u.id } })}>
                      <Avatar user={u} size={44} />
                      <span className="user-row-text">
                        <span className="t-title user-row-name">
                          {u.nickname}
                          {u.verified && <BadgeCheck size={16} color="var(--status-info)" />}
                        </span>
                        <span className="t-caption" style={{ color: 'var(--text-secondary)' }}>{u.area} · 평가 {u.reviewCount}</span>
                      </span>
                    </button>
                    <FollowButton userId={u.id} />
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
