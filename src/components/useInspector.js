import { useEffect, useMemo } from 'react'
import { useApp } from '../App.jsx'
import { SCREENS, FEATURES } from '../data/ia_inspector.js'

// ─────────────────────────────────────────────
// IA 인스펙터 표시 로직 (스펙 §8)
// 표시 내용은 전부 src/data/ia_inspector.js에서만 읽는다 — 하드코딩 금지.
// - 비호버: 현재 화면 SCREENS 레코드 + 소속 기능 목록
// - 호버:   해당 FEATURES 레코드 (화면 만들면서 data-func-id로 연결)
// - 스페이스바/핀 아이콘: 현재 표시 내용 고정 토글 (입력창 포커스 중 무시)
// ─────────────────────────────────────────────
export default function useInspector() {
  const {
    currentScreen,
    hoveredFuncId,
    pinnedContent, setPinnedContent,
  } = useApp()

  // 지금 실시간으로 보여줄 내용
  // NAV_GLOBAL_01(바텀 내비)은 IA에서 SCREENS["-"] 레코드로 관리됨 → 화면 레코드로 매핑
  const liveContent = useMemo(() => {
    if (hoveredFuncId && FEATURES[hoveredFuncId]) return { type: 'feature', id: hoveredFuncId }
    if (hoveredFuncId === 'NAV_GLOBAL_01' && SCREENS['-']) return { type: 'screen', id: '-' }
    return { type: 'screen', id: currentScreen }
  }, [hoveredFuncId, currentScreen])

  const pinned = pinnedContent !== null
  const content = pinned ? pinnedContent : liveContent

  const togglePin = () => setPinnedContent(pinned ? null : liveContent)

  // 스페이스바 = 고정 토글. input/textarea/contentEditable 포커스 중에는 무시(타이핑 방해 금지)
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.code !== 'Space') return
      const t = e.target
      if (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable) return
      e.preventDefault() // 스크롤 방지
      setPinnedContent((prev) => (prev !== null ? null : liveContent))
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [liveContent, setPinnedContent])

  // 렌더용 레코드 해석
  const screenRecord = content.type === 'screen' ? SCREENS[content.id] ?? null : null
  const featureRecord = content.type === 'feature' ? FEATURES[content.id] ?? null : null

  // 화면 모드일 때: 그 화면 소속 기능 목록
  const screenFeatures = useMemo(() => {
    if (content.type !== 'screen') return []
    return Object.entries(FEATURES)
      .filter(([, f]) => f.screen === content.id)
      .map(([fid, f]) => ({ fid, ...f }))
  }, [content])

  return { content, pinned, togglePin, screenRecord, featureRecord, screenFeatures }
}
