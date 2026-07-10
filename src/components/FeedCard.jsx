import React, { useState } from 'react'
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react'
import { useApp } from '../App.jsx'
import MsGate from './MsGate.jsx'
import Avatar from './Avatar.jsx'
import GradeChip from './GradeChip.jsx'
import ScoreBadge from './ScoreBadge.jsx'
import BottomSheet from './BottomSheet.jsx'
import PhotoPlaceholder from './PhotoPlaceholder.jsx'
import { getUser, getRestaurant, users } from '../data/dummy.js'

// 피드 카드 (CRD_) — S7·S17 공용.
// 등급 칩은 축약 어휘(좋음/그저/별로) + 색·텍스트 병행. 점수 숫자는 text-brand.
// withFuncIds: S7에서만 HTM-S7-## 기능ID 부착 (S17은 자체 기능ID 사용)
const SHARE_TARGETS = ['카카오톡', '인스타그램', '메시지', '링크 복사']

export default function FeedCard({ post, withFuncIds = true, headerRight = null }) {
  const { navigate, likedPostIds, toggleLike, savedPostIds, toggleSave, showToast } = useApp()
  const [likeSheet, setLikeSheet] = useState(false)
  const [shareSheet, setShareSheet] = useState(false)

  const user = getUser(post.userId)
  const restaurant = getRestaurant(post.restaurantId)
  const liked = likedPostIds.includes(post.id)
  const saved = savedPostIds.includes(post.id)
  const likeCount = post.likes + (liked ? 1 : 0)
  const fid = (id) => (withFuncIds ? { 'data-func-id': id } : {})

  const likers = users.filter((u) => u.id !== post.userId && u.id !== 'u1').slice(0, Math.min(5, likeCount))

  return (
    <article className="feed-card">
      {/* 작성자 정보 → 프로필 */}
      <div className="card-head">
        <button className="card-author" {...fid('HTM-S7-08')} onClick={() => navigate('S10', { params: { userId: post.userId } })}>
          <Avatar user={user} size={36} />
          <span className="card-author-text">
            <span className="t-title">{user?.nickname}</span>
            <span className="t-caption" style={{ color: 'var(--text-tertiary)' }}>{post.createdAt}</span>
          </span>
        </button>
        <span className="spacer" />
        {headerRight}
      </div>

      {/* 등급 칩 + 표시 점수 */}
      <div className="card-grade" {...fid('HTM-S7-09')}>
        <GradeChip grade={post.grade} />
        <ScoreBadge score={post.score} />
      </div>

      {/* 본문(선택) → 상세 */}
      {post.body && (
        <button className="card-body t-body" {...fid('HTM-S7-10')} onClick={() => navigate('S17', { params: { postId: post.id } })}>
          {post.body}
        </button>
      )}

      {/* 식당명 링크 → S4 */}
      <button className="card-rest t-caption" {...fid('HTM-S7-11')} onClick={() => navigate('S4', { params: { restaurantId: post.restaurantId } })}>
        {restaurant?.name} · {restaurant?.area}
      </button>

      {/* 사진(선택) — 복수 시 가로 스와이프 */}
      {post.photoCount > 0 && (
        <div className="card-photos" {...fid('HTM-S7-12')}>
          {Array.from({ length: post.photoCount }, (_, i) => (
            <PhotoPlaceholder key={i} label={`${restaurant?.label}${post.photoCount > 1 ? ` ${i + 1}/${post.photoCount}` : ''}`} height={200} />
          ))}
        </div>
      )}

      {/* 액션 행: 좋아요 / 좋아요 수(→리스트 시트 M2) / 댓글(M2) / 공유 / 저장 */}
      <div className="card-actions">
        <button
          className={`card-action${liked ? ' is-on' : ''}`}
          {...fid('HTM-S7-13')}
          aria-label="좋아요"
          onClick={() => toggleLike(post.id)}
        >
          <Heart size={20} strokeWidth={1.8} fill={liked ? 'var(--main-primary)' : 'none'} />
        </button>
        <MsGate ms="M2" {...fid('HTM-S7-14')} style={{ display: 'inline-flex' }}>
          <button className="card-count t-caption" onClick={() => setLikeSheet(true)} aria-label="좋아요한 사람 보기">
            {likeCount}
          </button>
        </MsGate>

        <MsGate ms="M2" {...fid('HTM-S7-15')} style={{ display: 'inline-flex' }}>
          <button className="card-action" aria-label="댓글" onClick={() => navigate('S17', { params: { postId: post.id } })}>
            <MessageCircle size={20} strokeWidth={1.8} />
            <span className="t-caption">{post.comments.length}</span>
          </button>
        </MsGate>

        <button className="card-action" {...fid('HTM-S7-16')} aria-label="공유" onClick={() => setShareSheet(true)}>
          <Share2 size={20} strokeWidth={1.8} />
        </button>

        <span className="spacer" />
        <button
          className={`card-action${saved ? ' is-on' : ''}`}
          {...fid('HTM-S7-17')}
          aria-label="저장"
          onClick={() => toggleSave(post.id)}
        >
          <Bookmark size={20} strokeWidth={1.8} fill={saved ? 'var(--main-primary)' : 'none'} />
        </button>
      </div>

      {/* 좋아요 리스트 바텀시트 (M2) */}
      <BottomSheet open={likeSheet} onClose={() => setLikeSheet(false)} title={`좋아요 ${likeCount}`}>
        <div className="sheet-list">
          {likers.map((u) => (
            <div className="sheet-user-row" key={u.id}>
              <Avatar user={u} size={32} />
              <span className="t-title">{u.nickname}</span>
              <span className="t-caption" style={{ color: 'var(--text-secondary)' }}>{u.area}</span>
            </div>
          ))}
          {likers.length === 0 && (
            <p className="t-body" style={{ color: 'var(--text-secondary)' }}>아직 아무도 없어요 — 첫 좋아요의 주인공이 되어보세요</p>
          )}
        </div>
      </BottomSheet>

      {/* OS 공유 흉내 시트 */}
      <BottomSheet open={shareSheet} onClose={() => setShareSheet(false)} title="공유하기">
        <div className="share-grid">
          {SHARE_TARGETS.map((t) => (
            <button
              key={t}
              className="share-target"
              onClick={() => { setShareSheet(false); showToast(t === '링크 복사' ? '링크를 복사했어요' : 'OS 공유로 이어질 자리예요 (프로토타입)') }}
            >
              <span className="share-target-icon" />
              <span className="t-caption">{t}</span>
            </button>
          ))}
        </div>
      </BottomSheet>
    </article>
  )
}
