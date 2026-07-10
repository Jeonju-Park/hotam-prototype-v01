import React from 'react'
import { useApp } from '../App.jsx'

// 팔로우 토글 버튼 — 비대칭 팔로우(캐논). 해제는 확인 없이(확인 시트는 S21 스코프).
export default function FollowButton({ userId, ...rest }) {
  const { followedUserIds, toggleFollow } = useApp()
  const following = followedUserIds.includes(userId)
  return (
    <button
      className={`follow-btn${following ? ' is-following' : ''}`}
      onClick={(e) => { e.stopPropagation(); toggleFollow(userId) }}
      {...rest}
    >
      {following ? '팔로잉' : '팔로우'}
    </button>
  )
}
