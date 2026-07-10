import React from 'react'

// 아바타 — 원형(캐논 예외 허용), 이니셜 표시
export default function Avatar({ user, size = 36 }) {
  return (
    <span
      className="avatar"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.4) }}
      aria-hidden
    >
      {user?.initial ?? '?'}
    </span>
  )
}
