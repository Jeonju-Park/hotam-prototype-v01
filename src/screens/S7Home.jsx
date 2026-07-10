import React, { useState } from 'react'
import { UserPlus, Search, Bell, Image } from 'lucide-react'
import { useApp } from '../App.jsx'
import MsGate from '../components/MsGate.jsx'
import Avatar from '../components/Avatar.jsx'
import FeedCard from '../components/FeedCard.jsx'
import { getUser, getRestaurant } from '../data/dummy.js'

// S7 홈 피드 — 앱바(로고+아이콘3) + 팔로잉|추천(M2) 탭 + 추천 섹션(M3) + 피드 카드.
// 빈 상태: 팔로우 0 → 전체 인기 기록 3개로 graceful degrade + 팔로우 추천 CTA.
export default function S7Home() {
  const { navigate, feedPosts, followedUserIds, demoEmpty, demoError, showToast, lens } = useApp()
  const [tab, setTab] = useState('following')

  const followingPosts = feedPosts.filter((p) => p.userId === 'u1' || followedUserIds.includes(p.userId))
  const recommendPosts = [...feedPosts].sort((a, b) => b.likes - a.likes)
  const popularTop3 = [...feedPosts].sort((a, b) => b.likes - a.likes).slice(0, 3)
  const list = tab === 'following' ? followingPosts : recommendPosts
  const m2Locked = lens === 'M1'

  // 추천 섹션(M3) 카드: 미식가 1 + 식당 2
  const recoUser = getUser('u10')
  const recoRests = [getRestaurant('r11'), getRestaurant('r22')]

  return (
    <div className="page">
      <header className="appbar">
        <span className="logotype" style={{ fontSize: 20 }} data-func-id="HTM-S7-01">hotam</span>
        <span className="spacer" />
        <MsGate ms="M2" data-func-id="HTM-S7-02" style={{ display: 'inline-flex' }}>
          <button className="icon-btn" aria-label="팔로우 추천" onClick={() => navigate('S16')}>
            <UserPlus size={22} strokeWidth={1.8} />
          </button>
        </MsGate>
        <button className="icon-btn" data-func-id="HTM-S7-04" aria-label="검색" onClick={() => navigate('S15')}>
          <Search size={22} strokeWidth={1.8} />
        </button>
        <button className="icon-btn" data-func-id="HTM-S7-03" aria-label="알림" onClick={() => navigate('S12')}>
          <Bell size={22} strokeWidth={1.8} />
        </button>
      </header>

      {/* 팔로잉 | 추천(M2) 세그먼트 */}
      <div className="seg-row page-pad-x">
        <button
          className={`seg-btn${tab === 'following' ? ' is-active' : ''}`}
          data-func-id="HTM-S7-05"
          onClick={() => setTab('following')}
        >
          팔로잉
        </button>
        <button
          className={`seg-btn${tab === 'recommend' ? ' is-active' : ''}${m2Locked ? ' ms-locked' : ''}`}
          data-func-id="HTM-S7-06"
          disabled={m2Locked}
          onClick={() => setTab('recommend')}
        >
          추천<span className="seg-ms m2">M2</span>
        </button>
      </div>

      {demoError ? (
        /* 에러 상태 — 데모 스위치 */
        <div className="error-card">
          <p className="t-title">피드를 불러오지 못했어요</p>
          <p className="t-caption" style={{ color: 'var(--text-secondary)' }}>탐이가 길을 잃었나 봐요. 다시 부르면 옵니다.</p>
          <button className="btn btn-secondary" onClick={() => showToast('에러 데모 중 — 스위치를 끄면 복구돼요')}>
            다시 시도
          </button>
        </div>
      ) : (
        <>
          {/* 추천 섹션 (M3): 가로 스크롤 카드 3장 — 미식가 1 · 식당 2 */}
          <MsGate ms="M3" data-func-id="HTM-S7-07">
            <div className="reco-row">
              <button className="reco-card" onClick={() => navigate('S10', { params: { userId: recoUser.id } })}>
                <Avatar user={recoUser} size={40} />
                <span className="t-title">{recoUser.nickname}</span>
                <span className="t-caption" style={{ color: 'var(--text-secondary)' }}>미식가 · {recoUser.area}</span>
              </button>
              {recoRests.map((r) => (
                <button key={r.id} className="reco-card" onClick={() => navigate('S4', { params: { restaurantId: r.id } })}>
                  <span className="reco-thumb"><Image size={18} strokeWidth={1.5} /></span>
                  <span className="t-title">{r.name}</span>
                  <span className="t-caption" style={{ color: 'var(--text-secondary)' }}>{r.area} · {r.category}</span>
                </button>
              ))}
            </div>
          </MsGate>

          {demoEmpty ? (
            /* 빈 상태: 팔로우 0 — 위트 카피 + 전체 인기 기록 3개(graceful degrade) + CTA */
            <div className="feed-list">
              <div className="feed-empty">
                <div className="tami"><span className="t-caption">탐이</span></div>
                <p className="t-heading-sm">아직 팔로우가 없어요</p>
                <p className="t-body" style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>
                  그래도 굶길 순 없죠.<br />요즘 다들 좋아한 기록이에요.
                </p>
                <button className="btn btn-secondary" style={{ width: 'auto', padding: '0 24px' }} onClick={() => navigate('S16')}>
                  팔로우 추천 보기
                </button>
              </div>
              {popularTop3.map((p) => <FeedCard key={p.id} post={p} />)}
            </div>
          ) : (
            <div className="feed-list">
              {list.map((p) => <FeedCard key={p.id} post={p} />)}
            </div>
          )}
        </>
      )}
    </div>
  )
}
