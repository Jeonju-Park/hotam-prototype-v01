import React, { useState } from 'react'
import { Heart, CircleHelp, ChevronDown, ChevronLeft } from 'lucide-react'
import { useApp } from '../App.jsx'
import AppBar from '../components/AppBar.jsx'
import MsGate from '../components/MsGate.jsx'
import Avatar from '../components/Avatar.jsx'
import GradeChip from '../components/GradeChip.jsx'
import ScoreBadge from '../components/ScoreBadge.jsx'
import BottomSheet from '../components/BottomSheet.jsx'
import PhotoPlaceholder from '../components/PhotoPlaceholder.jsx'
import { predictedOf } from '../components/RestaurantRow.jsx'
import { getRestaurant, getUser } from '../data/dummy.js'

// S4 식당 상세 — 점수 위계 3단: ①친구 평점 ②전체 평점 ③큐레이션 점수(M2).
// 리뷰 리스트(→S17) · 찜 토글 · [메뉴/상세 M3 접이식] · CTA "방문 기록하기"(주황 1곳)→S2 프리셋.
const fmtPrice = (n) => `${n.toLocaleString('ko-KR')}원`

export default function S4Restaurant() {
  const { params, goBack, navigate, feedPosts, followedUserIds, wishedRestaurantIds, toggleWish } = useApp()
  const [scoreSheet, setScoreSheet] = useState(false)
  const [friendView, setFriendView] = useState(false)
  const [openMenu, setOpenMenu] = useState(false)
  const [openInfo, setOpenInfo] = useState(false)

  const restaurant = getRestaurant(params.restaurantId)

  if (!restaurant) {
    return (
      <div className="page">
        <AppBar title="식당 상세" onBack={goBack} />
        <div className="feed-empty">
          <div className="tami"><span className="t-caption">탐이</span></div>
          <p className="t-heading-sm">식당을 찾지 못했어요</p>
          <button className="btn btn-secondary" style={{ width: 'auto', padding: '0 24px' }} onClick={() => navigate('S9', { replace: true })}>
            탐색으로
          </button>
        </div>
      </div>
    )
  }

  const reviews = feedPosts.filter((p) => p.restaurantId === restaurant.id)
  const friendReviews = reviews.filter((p) => followedUserIds.includes(p.userId))
  const friendAvg = friendReviews.length
    ? Math.round((friendReviews.reduce((s, p) => s + p.score, 0) / friendReviews.length) * 10) / 10
    : null
  const wished = wishedRestaurantIds.includes(restaurant.id)

  // 친구 평점 리스트 — 서브 페이지
  if (friendView) {
    return (
      <div className="page">
        <AppBar title="친구 평점" onBack={() => setFriendView(false)} />
        <div className="user-list" data-func-id="HTM-S4-02">
          {friendReviews.map((p) => {
            const u = getUser(p.userId)
            return (
              <div className="user-row" key={p.id}>
                <button className="user-row-main" onClick={() => navigate('S17', { params: { postId: p.id } })}>
                  <Avatar user={u} size={40} />
                  <span className="user-row-text">
                    <span className="t-title">{u?.nickname}</span>
                    <span className="t-caption" style={{ color: 'var(--text-secondary)' }}>{p.createdAt}</span>
                  </span>
                </button>
                <GradeChip grade={p.grade} />
                <ScoreBadge score={p.score} />
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <AppBar
        title=""
        onBack={goBack}
        right={
          <button
            className={`icon-btn${wished ? ' wish-on' : ''}`}
            data-func-id="HTM-S4-06"
            aria-label="찜"
            onClick={() => toggleWish(restaurant.id)}
          >
            <Heart size={22} strokeWidth={1.8} fill={wished ? 'var(--main-primary)' : 'none'} />
          </button>
        }
      />

      {/* 기본 정보 — 와이드 사진 + 이름/동네/카테고리/영업 */}
      <div data-func-id="HTM-S4-01">
        <PhotoPlaceholder label={restaurant.label} height={180} />
        <div className="page-pad" style={{ paddingBottom: 0 }}>
          <h1 className="t-heading-lg">{restaurant.name}</h1>
          <p className="t-caption" style={{ color: 'var(--text-secondary)' }}>
            {restaurant.area} · {restaurant.category} · {restaurant.open ? '영업 중' : '영업 종료'}
          </p>
        </div>
      </div>

      {/* 점수 위계 3단 */}
      <div className="score-stack page-pad">
        {/* ① 친구 평점 */}
        <button className="score-tier" data-func-id="HTM-S4-02" onClick={() => friendReviews.length && setFriendView(true)}>
          <span className="t-caption score-tier-label">친구 평점</span>
          {friendAvg != null ? (
            <span className="score-tier-value">
              <span className="tier-avatars">
                {friendReviews.slice(0, 3).map((p) => <Avatar key={p.id} user={getUser(p.userId)} size={24} />)}
              </span>
              <ScoreBadge score={friendAvg} size="md" />
              <ChevronLeft size={16} style={{ transform: 'rotate(180deg)', color: 'var(--text-tertiary)' }} />
            </span>
          ) : (
            <span className="t-caption" style={{ color: 'var(--text-tertiary)' }}>
              친구 기록이 아직 없어요 — 전체 평점을 참고하세요
            </span>
          )}
        </button>
        {/* ② 전체 평점 */}
        <div className="score-tier" data-func-id="HTM-S4-03">
          <span className="t-caption score-tier-label">전체 평점</span>
          <span className="score-tier-value">
            <ScoreBadge score={restaurant.rating} size="md" />
            <span className="t-caption" style={{ color: 'var(--text-tertiary)' }}>리뷰 {restaurant.reviewCount}</span>
          </span>
        </div>
        {/* ③ 큐레이션 점수 (M2) */}
        <MsGate ms="M2" data-func-id="HTM-S4-04">
          <div className="score-tier">
            <span className="t-caption score-tier-label">내 예상 점수</span>
            <span className="score-tier-value">
              <ScoreBadge score={predictedOf(restaurant)} size="md" />
              <button className="icon-btn" style={{ width: 32, height: 32 }} aria-label="산정 방식" onClick={() => setScoreSheet(true)}>
                <CircleHelp size={16} strokeWidth={1.8} />
              </button>
            </span>
          </div>
        </MsGate>
      </div>

      {/* 대표 메뉴·가격 / 상세 정보 (M3 접이식) */}
      <MsGate ms="M3" data-func-id="HTM-S4-07" className="page-pad-x">
        <button className="fold-head" onClick={() => setOpenMenu(!openMenu)}>
          <span className="t-title">대표 메뉴·가격</span>
          <ChevronDown size={18} style={{ transform: openMenu ? 'rotate(180deg)' : 'none', color: 'var(--text-tertiary)' }} />
        </button>
        {openMenu && (
          <div className="fold-body">
            {restaurant.menus.map((m) => (
              <div className="menu-row" key={m.name}>
                <span className="t-body">{m.name}</span>
                <span className="t-body" style={{ fontWeight: 600 }}>{fmtPrice(m.price)}</span>
              </div>
            ))}
          </div>
        )}
      </MsGate>
      <MsGate ms="M3" data-func-id="HTM-S4-08" className="page-pad-x">
        <button className="fold-head" onClick={() => setOpenInfo(!openInfo)}>
          <span className="t-title">상세 정보</span>
          <ChevronDown size={18} style={{ transform: openInfo ? 'rotate(180deg)' : 'none', color: 'var(--text-tertiary)' }} />
        </button>
        {openInfo && (
          <div className="fold-body">
            <div className="menu-row"><span className="t-body">좌석</span><span className="t-body">{restaurant.seats}</span></div>
            <div className="menu-row"><span className="t-body">주차</span><span className="t-body">{restaurant.parking ? '가능' : '불가'}</span></div>
            <div className="menu-row"><span className="t-body">예약</span><span className="t-body">{restaurant.reservation ? '가능' : '불가'}</span></div>
          </div>
        )}
      </MsGate>

      {/* 리뷰 리스트 (→S17) */}
      <section className="page-pad" data-func-id="HTM-S4-05">
        <span className="t-caption section-label">기록 {reviews.length}</span>
        {reviews.map((p) => {
          const u = getUser(p.userId)
          return (
            <button className="review-row" key={p.id} onClick={() => navigate('S17', { params: { postId: p.id } })}>
              <Avatar user={u} size={32} />
              <span className="review-text">
                <span className="t-caption" style={{ fontWeight: 600 }}>{u?.nickname ?? '정주'}</span>
                {p.body && <span className="t-body review-body">{p.body}</span>}
              </span>
              <GradeChip grade={p.grade} />
              <ScoreBadge score={p.score} size="sm" />
            </button>
          )
        })}
        {reviews.length === 0 && (
          <p className="t-body" style={{ color: 'var(--text-secondary)' }}>
            아직 기록이 없어요 — 첫 기록의 주인공 자리가 비었네요
          </p>
        )}
      </section>

      {/* CTA — 화면 유일 주황: 방문 기록하기 → S2 (식당 프리셋) */}
      <div className="s4-cta">
        <button className="btn btn-primary" onClick={() => navigate('S2', { params: { restaurantId: restaurant.id } })}>
          방문 기록하기
        </button>
      </div>

      {/* 큐레이션 점수 산정 방식 시트 */}
      <BottomSheet open={scoreSheet} onClose={() => setScoreSheet(false)} title="내 예상 점수는 이렇게 정해져요">
        <p className="t-body sheet-body">
          회원님의 취향과 비교 기록을 바탕으로 예상한 점수예요.
          데이터가 얇으면 전체 평점을 보여드려요.
        </p>
        <button className="btn btn-secondary" onClick={() => setScoreSheet(false)}>알겠어요</button>
      </BottomSheet>
    </div>
  )
}
