import React, { useState } from 'react'
import { Settings, BadgeCheck, ChevronRight, Image, Map } from 'lucide-react'
import { useApp } from '../App.jsx'
import AppBar from '../components/AppBar.jsx'
import MsGate from '../components/MsGate.jsx'
import Avatar from '../components/Avatar.jsx'
import GradeChip from '../components/GradeChip.jsx'
import ScoreBadge from '../components/ScoreBadge.jsx'
import FollowButton from '../components/FollowButton.jsx'
import { getUser, getRestaurant, getPost, tasteDNA } from '../data/dummy.js'

// S10 프로필 — 프로필 정보 + 활동 현황(가본 곳·위시) + 나의 식당 리더보드 진입 +
// 취향 DNA(M3, 잉크 막대+등급 3칩+공유→S8). 하위 페이지: 가본 곳(그리드+점수 오버레이) / 위시(통합 리스트).
const WISH_FILTERS = [
  { key: 'all',  label: '전체' },
  { key: 'post', label: '게시물' },
  { key: 'rest', label: '가게' },
]

export default function S10Profile() {
  const {
    params, me, navigate, goBack, feedPosts, myListData,
    savedPostIds, wishedRestaurantIds, followedUserIds,
  } = useApp()
  const [view, setView] = useState('main')          // main | visited | wish
  const [wishFilter, setWishFilter] = useState('all')

  const isMe = !params.userId || params.userId === 'u1'
  const user = isMe ? me : getUser(params.userId)

  if (!user) {
    return (
      <div className="page">
        <AppBar title="프로필" onBack={goBack} />
        <div className="feed-empty">
          <div className="tami"><span className="t-caption">탐이</span></div>
          <p className="t-heading-sm">미식가를 찾지 못했어요</p>
        </div>
      </div>
    )
  }

  // 가본 곳 = 내 리스트 전체 (등급 무관, 점수순)
  const visited = Object.entries(myListData)
    .flatMap(([grade, items]) => items.map((it) => ({ ...it, grade })))
    .sort((a, b) => b.score - a.score)
  const wishCount = savedPostIds.length + wishedRestaurantIds.length

  // ── 하위 페이지: 가본 곳 (사진 그리드 + 점수 오버레이 → 내 기록 있으면 S17, 없으면 S4) ──
  if (view === 'visited') {
    return (
      <div className="page">
        <AppBar title={`가본 곳 ${visited.length}`} onBack={() => setView('main')} />
        <div className="visited-grid page-pad-x" data-func-id="HTM-S10-06">
          {visited.map((it) => {
            const r = getRestaurant(it.restaurantId)
            const myPost = feedPosts.find((p) => p.userId === 'u1' && p.restaurantId === it.restaurantId)
            return (
              <button
                key={it.restaurantId}
                className="visited-tile"
                onClick={() => myPost
                  ? navigate('S17', { params: { postId: myPost.id } })
                  : navigate('S4', { params: { restaurantId: it.restaurantId } })}
              >
                <Image size={20} strokeWidth={1.5} />
                <span className="visited-score">{it.score.toFixed(1)}</span>
                <span className="ph-label">{r.name}</span>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // ── 하위 페이지: 위시 (저장 게시물 + 찜 가게 통합, M3 유형 필터) ──
  if (view === 'wish') {
    const showPosts = wishFilter !== 'rest'
    const showRests = wishFilter !== 'post'
    return (
      <div className="page">
        <AppBar title={`위시 ${wishCount}`} onBack={() => setView('main')} />
        <MsGate ms="M3" data-func-id="HTM-S10-08" className="page-pad-x">
          <div className="chip-row">
            {WISH_FILTERS.map((f) => (
              <button key={f.key} className={`criteria-chip${wishFilter === f.key ? ' is-selected' : ''}`} onClick={() => setWishFilter(f.key)}>
                {f.label}
              </button>
            ))}
          </div>
        </MsGate>
        <div className="page-pad" data-func-id="HTM-S10-07" style={{ display: 'flex', flexDirection: 'column' }}>
          {showPosts && savedPostIds.map((pid) => {
            const p = getPost(pid) ?? feedPosts.find((x) => x.id === pid)
            if (!p) return null
            const author = getUser(p.userId)
            return (
              <button key={pid} className="review-row" onClick={() => navigate('S17', { params: { postId: pid } })}>
                <Avatar user={author} size={32} />
                <span className="review-text">
                  <span className="t-caption" style={{ fontWeight: 600 }}>{author?.nickname} · 게시물</span>
                  <span className="t-body review-body">{getRestaurant(p.restaurantId)?.name}</span>
                </span>
                <ScoreBadge score={p.score} size="sm" />
              </button>
            )
          })}
          {showRests && wishedRestaurantIds.map((rid) => {
            const r = getRestaurant(rid)
            return (
              <button key={rid} className="review-row" onClick={() => navigate('S4', { params: { restaurantId: rid } })}>
                <div className="rest-row-thumb"><Image size={16} strokeWidth={1.5} /></div>
                <span className="review-text">
                  <span className="t-caption" style={{ fontWeight: 600 }}>가게 찜</span>
                  <span className="t-body review-body">{r.name} · {r.area}</span>
                </span>
                <ScoreBadge score={r.rating} size="sm" />
              </button>
            )
          })}
          {wishCount === 0 && (
            <div className="feed-empty">
              <div className="tami"><span className="t-caption">탐이</span></div>
              <p className="t-heading-sm">아직 노려보는 집이 없네요</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── 메인 ──
  return (
    <div className="page">
      <header className="appbar">
        {!isMe && (
          <button className="icon-btn" onClick={goBack} aria-label="뒤로">
            <ChevronRight size={24} style={{ transform: 'rotate(180deg)' }} />
          </button>
        )}
        <span className="t-heading-lg" style={{ paddingLeft: isMe ? 'var(--sp-sm)' : 0 }}>프로필</span>
        <span className="spacer" />
        {isMe && (
          <button className="icon-btn" data-func-id="HTM-S10-01" aria-label="설정" onClick={() => navigate('S20')}>
            <Settings size={22} strokeWidth={1.8} />
          </button>
        )}
      </header>

      {/* 프로필 정보 */}
      <div className="profile-head page-pad" data-func-id="HTM-S10-02">
        <Avatar user={user} size={64} />
        <div className="profile-head-text">
          <span className="t-heading-sm user-row-name">
            {user.nickname}
            {user.verified && <BadgeCheck size={16} color="var(--status-info)" />}
          </span>
          <span className="t-caption" style={{ color: 'var(--text-secondary)' }}>{user.bio}</span>
          <button
            className="t-caption profile-follow-nums"
            onClick={() => isMe && navigate('S21')}
          >
            팔로워 <b>{user.followers}</b> · 팔로잉 <b>{user.following}</b>
          </button>
        </div>
        {!isMe && <FollowButton userId={user.id} />}
      </div>

      {isMe ? (
        <>
          {/* 활동 현황 카드 2 */}
          <div className="stat-cards page-pad-x" data-func-id="HTM-S10-04">
            <button className="stat-card" onClick={() => setView('visited')}>
              <span className="stat-num">{visited.length}</span>
              <span className="t-caption" style={{ color: 'var(--text-secondary)' }}>가본 곳</span>
            </button>
            <button className="stat-card" onClick={() => setView('wish')}>
              <span className="stat-num">{wishCount}</span>
              <span className="t-caption" style={{ color: 'var(--text-secondary)' }}>위시</span>
            </button>
          </div>

          {/* 진입: 나의 식당 리더보드 → S5 / 내 미식 지도(M3) → S6 */}
          <div className="page-pad-x" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-xxs)', marginTop: 'var(--sp-sm)' }}>
            <button className="entry-row" data-func-id="HTM-S10-03" onClick={() => navigate('S5')}>
              <span className="t-title">나의 식당 리더보드</span>
              <ChevronRight size={18} style={{ color: 'var(--text-tertiary)' }} />
            </button>
            <MsGate ms="M3">
              <button className="entry-row" onClick={() => navigate('S6')}>
                <span className="t-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Map size={16} strokeWidth={1.8} /> 내 미식 지도
                </span>
                <ChevronRight size={18} style={{ color: 'var(--text-tertiary)' }} />
              </button>
            </MsGate>
          </div>

          {/* 취향 DNA (M3) — 잉크 막대 + 등급 분포 3칩 + 공유 → S8 */}
          <MsGate ms="M3" data-func-id="HTM-S10-05" className="page-pad">
            <div className="dna-card">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span className="t-title">취향 DNA</span>
                <span className="spacer" style={{ flex: 1 }} />
                <button className="btn-text" onClick={() => navigate('S8')}>공유</button>
              </div>
              {tasteDNA.categories.map((c) => (
                <div key={c.name} className="dna-row">
                  <span className="t-caption dna-name">{c.name}</span>
                  <div className="dna-track"><div className="dna-fill" style={{ width: `${c.pct}%` }} /></div>
                  <span className="t-caption dna-pct">{c.pct}%</span>
                </div>
              ))}
              <div className="dna-grades">
                <GradeChip grade="good" count={tasteDNA.gradeDist.good} />
                <GradeChip grade="soso" count={tasteDNA.gradeDist.soso} />
                <GradeChip grade="bad" count={tasteDNA.gradeDist.bad} />
              </div>
            </div>
          </MsGate>
        </>
      ) : (
        /* 다른 유저 프로필 — 캐논 하위 화면 없음: 기록 요약만 */
        <div className="page-pad">
          <p className="t-caption" style={{ color: 'var(--text-secondary)' }}>평가 {user.reviewCount} · {user.area}</p>
          <div className="feed-list" style={{ padding: 'var(--sp-sm) 0' }}>
            {feedPosts.filter((p) => p.userId === user.id).slice(0, 3).map((p) => (
              <button key={p.id} className="review-row" onClick={() => navigate('S17', { params: { postId: p.id } })}>
                <div className="rest-row-thumb"><ChevronRight size={14} /></div>
                <span className="review-text">
                  <span className="t-body review-body">{getRestaurant(p.restaurantId)?.name}</span>
                </span>
                <GradeChip grade={p.grade} />
                <ScoreBadge score={p.score} size="sm" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
