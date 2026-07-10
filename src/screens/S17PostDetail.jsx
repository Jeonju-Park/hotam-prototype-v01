import React, { useState } from 'react'
import { Image } from 'lucide-react'
import { useApp } from '../App.jsx'
import AppBar from '../components/AppBar.jsx'
import MsGate from '../components/MsGate.jsx'
import Avatar from '../components/Avatar.jsx'
import FeedCard from '../components/FeedCard.jsx'
import FollowButton from '../components/FollowButton.jsx'
import ScoreBadge from '../components/ScoreBadge.jsx'
import BottomSheet from '../components/BottomSheet.jsx'
import { getUser, getRestaurant, users } from '../data/dummy.js'

// S17 게시물 상세 (M2) — 피드 카드 풀 + 댓글 전체. 미팔로우 작성자면 팔로우 버튼.
// 반응한 사람들 보기(M3 시트) · 하단 식당 요약 카드(M3 → S4).
export default function S17PostDetail() {
  const { params, feedPosts, followedUserIds, goBack, navigate, showToast } = useApp()
  const [reactSheet, setReactSheet] = useState(false)

  const post = feedPosts.find((p) => p.id === params.postId)

  if (!post) {
    return (
      <div className="page">
        <AppBar title="게시물" onBack={goBack} />
        <div className="feed-empty">
          <div className="tami"><span className="t-caption">탐이</span></div>
          <p className="t-heading-sm">게시물을 찾지 못했어요</p>
          <button className="btn btn-secondary" style={{ width: 'auto', padding: '0 24px' }} onClick={() => navigate('S7', { replace: true })}>
            홈으로
          </button>
        </div>
      </div>
    )
  }

  const isMine = post.userId === 'u1'
  const restaurant = getRestaurant(post.restaurantId)
  const reactors = users.filter((u) => u.id !== post.userId && u.id !== 'u1').slice(0, 4)

  return (
    <div className="page">
      <AppBar title="게시물" onBack={goBack} />

      <div data-func-id="HTM-S17-01">
        {/* 피드 카드 풀 — 미팔로우 작성자면 팔로우 버튼(M2) */}
        <FeedCard
          post={post}
          withFuncIds={false}
          headerRight={
            !isMine && !followedUserIds.includes(post.userId) ? (
              <MsGate ms="M2" data-func-id="HTM-S17-02" style={{ display: 'inline-flex' }}>
                <FollowButton userId={post.userId} />
              </MsGate>
            ) : null
          }
        />

        {/* 반응한 사람들 보기 (M3) */}
        <MsGate ms="M3" data-func-id="HTM-S17-04" className="page-pad-x">
          <button className="btn-text" onClick={() => setReactSheet(true)}>반응한 사람들 보기</button>
        </MsGate>

        {/* 댓글 전체 */}
        <section className="comment-section page-pad-x">
          <span className="t-caption section-label">댓글 {post.comments.length}</span>
          {post.comments.map((c) => {
            const u = getUser(c.userId)
            return (
              <div className="comment-row" key={c.id}>
                <Avatar user={u} size={32} />
                <div className="comment-text">
                  <span className="t-caption" style={{ fontWeight: 600 }}>{u?.nickname}
                    <span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}> · {c.createdAt}</span>
                  </span>
                  <span className="t-body">{c.text}</span>
                </div>
              </div>
            )
          })}
          {post.comments.length === 0 && (
            <p className="t-body" style={{ color: 'var(--text-secondary)' }}>
              첫 댓글이 비어 있어요 — 정적이 어색한 집이네요
            </p>
          )}
        </section>
      </div>

      {/* 하단 식당 요약 카드 (M3 → S4) */}
      <MsGate ms="M3" data-func-id="HTM-S17-05" className="page-pad">
        <button className="rest-summary" onClick={() => navigate('S4', { params: { restaurantId: post.restaurantId } })}>
          <div className="rest-row-thumb"><Image size={16} strokeWidth={1.5} /></div>
          <div className="rest-row-text">
            <span className="t-title">{restaurant?.name}</span>
            <span className="t-caption" style={{ color: 'var(--text-secondary)' }}>{restaurant?.area} · {restaurant?.category}</span>
          </div>
          <ScoreBadge score={restaurant.rating} size="sm" />
        </button>
      </MsGate>

      {/* 댓글 입력 — 프로토타입에선 구경만 */}
      <div className="comment-input-bar">
        <input
          className="input"
          placeholder="댓글 남기기"
          readOnly
          onClick={() => showToast('프로토타입에선 구경만 할 수 있어요')}
        />
      </div>

      {/* 반응한 사람들 시트 (M3) */}
      <BottomSheet open={reactSheet} onClose={() => setReactSheet(false)} title="반응한 사람들">
        <div className="sheet-list">
          {reactors.map((u) => (
            <div className="sheet-user-row" key={u.id}>
              <Avatar user={u} size={32} />
              <span className="t-title">{u.nickname}</span>
              <span className="spacer" />
              <FollowButton userId={u.id} />
            </div>
          ))}
        </div>
      </BottomSheet>
    </div>
  )
}
