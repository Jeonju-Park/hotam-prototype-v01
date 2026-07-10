import React, { useState } from 'react'
import { Download } from 'lucide-react'
import { useApp } from '../../App.jsx'
import MilestoneLens from '../MilestoneLens.jsx'
import TableTab from './TableTab.jsx'
import MemoTab from './MemoTab.jsx'
import HistoryTab from './HistoryTab.jsx'

// ─────────────────────────────────────────────
// 라이브 IA 테이블 패널 (스펙 v2 §3) — v1 인스펙터 대체, 폭 480px
// 헤더: "IA Live · v2" + 연결 상태 점 + 작성자 칩 + CSV 내보내기
// 하단 탭: 테이블 | 메모 | 히스토리 · 최하단: 렌즈·데모 스위치(승계)
// ─────────────────────────────────────────────
const AUTHORS = ['정주', '대표', '게스트']

const toCsv = (rows, columns) => {
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
  return [columns.join(','), ...rows.map((r) => columns.map((c) => esc(r[c])).join(','))].join('\n')
}
const download = (filename, text) => {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob(['﻿' + text], { type: 'text/csv;charset=utf-8' }))
  a.download = filename
  a.click()
  URL.revokeObjectURL(a.href)
}

export default function IaPanel() {
  const {
    iaStatus, author, setAuthor, unseenMemos,
    iaFeatureList, iaScreens, showToast,
  } = useApp()
  const [tab, setTab] = useState('table')          // 'table' | 'memo' | 'history'
  const [selectedId, setSelectedId] = useState(null) // 행 선택 고정
  const [pickingAuthor, setPickingAuthor] = useState(false)

  // 메모/히스토리에서 ID 칩 클릭 → 테이블 해당 행으로 점프
  const jumpTo = (targetId) => {
    setTab('table')
    setSelectedId(targetId)
  }

  // CSV 내보내기 — 현재 Supabase 상태 전체 (features + screens 2개 파일)
  const exportCsv = () => {
    const today = new Date().toISOString().slice(0, 10)
    const fCols = ['id', 'screen', 'area', 'screen_name', 'name', 'label', 'type', 'purpose',
      'milestone', 'importance', 'nav', 'copy', 'flags', 'note', 'memo', 'sort_order', 'archived', 'updated_at']
    const sCols = ['id', 'area', 'name', 'label', 'type', 'purpose', 'milestone', 'copy', 'flags', 'note', 'memo', 'archived', 'updated_at']
    download(`ia_features_${today}.csv`, toCsv(iaFeatureList, fCols))
    download(`ia_screens_${today}.csv`, toCsv(Object.values(iaScreens), sCols))
    showToast('CSV 2개(기능·화면)를 내려받았어요')
  }

  // 첫 진입: 작성자 이름 선택 게이트
  const needAuthor = !author || pickingAuthor

  return (
    <aside className="inspector ia-panel">
      <header className="insp-header">
        <span className={`ia-conn-dot ${iaStatus}`} title={iaStatus === 'live' ? '실시간 연결됨' : '오프라인'} />
        <span className="t-caption">IA Live · v2</span>
        <span className="spacer" />
        <button className="ia-author-chip t-micro" onClick={() => setPickingAuthor(true)} title="작성자 변경">
          {author || '작성자?'}
        </button>
        <button className="ia-tool-btn" onClick={exportCsv} title="CSV 내보내기">
          <Download size={13} /> CSV
        </button>
      </header>

      {iaStatus === 'offline' && (
        <div className="ia-offline-banner t-caption">오프라인 — 읽기 전용 (정적 IA 데이터 표시 중)</div>
      )}
      {iaStatus === 'connecting' && (
        <div className="ia-offline-banner is-connecting t-caption">Supabase 연결 중…</div>
      )}

      {needAuthor ? (
        <div className="ia-author-gate">
          <p className="t-heading-sm">누구로 참여하세요?</p>
          <p className="t-caption" style={{ color: 'var(--text-secondary)' }}>편집·메모에 이 이름이 기록돼요</p>
          <div className="ia-author-options">
            {AUTHORS.map((n) => (
              <button
                key={n}
                className={`btn btn-secondary${author === n ? ' is-current' : ''}`}
                onClick={() => { setAuthor(n); setPickingAuthor(false) }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="ia-content">
            {tab === 'table' && <TableTab selectedId={selectedId} setSelectedId={setSelectedId} />}
            {tab === 'memo' && <MemoTab onJump={jumpTo} />}
            {tab === 'history' && <HistoryTab onJump={jumpTo} />}
          </div>

          {/* 하단 탭 3개 (스펙 §3) */}
          <div className="ia-tabs">
            <button className={`ia-tab${tab === 'table' ? ' is-active' : ''}`} onClick={() => setTab('table')}>
              테이블
            </button>
            <button className={`ia-tab${tab === 'memo' ? ' is-active' : ''}`} onClick={() => setTab('memo')}>
              메모
              {unseenMemos > 0 && <span className="ia-badge">{unseenMemos}</span>}
            </button>
            <button className={`ia-tab${tab === 'history' ? ' is-active' : ''}`} onClick={() => setTab('history')}>
              히스토리
            </button>
          </div>
        </>
      )}

      {/* 렌즈·데모 스위치 (v1 승계) */}
      <MilestoneLens />
    </aside>
  )
}
