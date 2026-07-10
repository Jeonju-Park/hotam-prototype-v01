// ─────────────────────────────────────────────
// 라이브 IA 데이터 훅 (스펙 v2 §1·§2)
// - Supabase에서 4개 테이블 로드 + Realtime 구독(모든 브라우저 동기화)
// - 연결 실패 시 ia_inspector.js 정적 데이터로 읽기 전용 폴백
// - 모든 쓰기는 ia_change_log에 자동 기록
// - localStorage는 도구 설정(작성자·필터)에 한해 허용 (스펙 v2 §1)
// ─────────────────────────────────────────────
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from './supabase.js'
import { SCREENS as STATIC_SCREENS, FEATURES as STATIC_FEATURES } from '../data/ia_inspector.js'

// 정적 폴백 데이터를 라이브 스키마 모양으로 정규화
const staticScreens = () => Object.fromEntries(
  Object.entries(STATIC_SCREENS).map(([id, s]) => [id, { ...s, id, memo: '', archived: false }])
)
const staticFeatures = () => Object.fromEntries(
  Object.entries(STATIC_FEATURES).map(([id, f], i) => [id, {
    ...f, id, screen_name: f.screenName ?? '', sort_order: i, memo: '', archived: false,
  }])
)

const FIELD_LABELS = {
  milestone: '마일스톤', name: '명칭', importance: '중요도', memo: '메모',
  purpose: '목적', copy: 'UX카피', nav: '연결', flags: '이슈', note: '비고',
  archived: '보관', created: '생성', memo_thread: '메모글',
  memo_confirmed: '메모확인', memo_deleted: '메모삭제',
}
export const fieldLabel = (f) => FIELD_LABELS[f] ?? f

export default function useIaLive(showToast) {
  const [status, setStatus] = useState('connecting') // 'connecting' | 'live' | 'offline'
  const [screens, setScreens] = useState({})
  const [features, setFeatures] = useState({})
  const [memos, setMemos] = useState([])          // 최신순
  const [changeLog, setChangeLog] = useState([])  // 최신순
  const [flashId, setFlashId] = useState(null)    // 원격 변경 행 1초 플래시
  const [unseenMemos, setUnseenMemos] = useState(0)

  // 작성자 — 도구 설정이므로 localStorage 허용
  const [author, setAuthorState] = useState(() => localStorage.getItem('hotam_ia_author') || '')
  const authorRef = useRef(author)
  const setAuthor = useCallback((name) => {
    authorRef.current = name
    setAuthorState(name)
    localStorage.setItem('hotam_ia_author', name)
  }, [])

  const showToastRef = useRef(showToast)
  showToastRef.current = showToast

  // ── 초기 로드 + Realtime 구독 ──
  useEffect(() => {
    let cancelled = false
    let channel = null

    const fallback = () => {
      if (cancelled) return
      setScreens(staticScreens())
      setFeatures(staticFeatures())
      setStatus('offline')
    }

    const load = async () => {
      try {
        const [sc, ft, mm, cl] = await Promise.all([
          supabase.from('ia_screens').select('*'),
          supabase.from('ia_features').select('*').order('sort_order'),
          supabase.from('ia_memos').select('*').order('created_at', { ascending: false }),
          supabase.from('ia_change_log').select('*').order('created_at', { ascending: false }).limit(300),
        ])
        if (sc.error || ft.error || mm.error || cl.error) throw (sc.error ?? ft.error ?? mm.error ?? cl.error)
        if (!ft.data?.length) throw new Error('empty features')
        if (cancelled) return
        setScreens(Object.fromEntries(sc.data.map((r) => [r.id, r])))
        setFeatures(Object.fromEntries(ft.data.map((r) => [r.id, r])))
        setMemos(mm.data)
        setChangeLog(cl.data)
        setStatus('live')

        // Realtime — 4개 테이블 단일 채널
        channel = supabase
          .channel('ia-live')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'ia_screens' }, (p) => {
            if (p.new?.id) setScreens((prev) => ({ ...prev, [p.new.id]: p.new }))
          })
          .on('postgres_changes', { event: '*', schema: 'public', table: 'ia_features' }, (p) => {
            if (!p.new?.id) return
            setFeatures((prev) => ({ ...prev, [p.new.id]: p.new }))
            setFlashId(p.new.id)
            setTimeout(() => setFlashId((f) => (f === p.new.id ? null : f)), 1000)
          })
          .on('postgres_changes', { event: '*', schema: 'public', table: 'ia_memos' }, (p) => {
            if (!p.new?.id) return
            setMemos((prev) => {
              const exists = prev.some((m) => m.id === p.new.id)
              return exists ? prev.map((m) => (m.id === p.new.id ? p.new : m)) : [p.new, ...prev]
            })
            // 새 메모(INSERT)만 알림 — 확인/삭제(UPDATE)는 change_log 토스트로 전달
            if (p.eventType === 'INSERT' && !p.new.deleted && p.new.author !== authorRef.current) {
              setUnseenMemos((n) => n + 1)
              showToastRef.current?.(`${p.new.author}: ${p.new.target_id}에 메모를 남겼어요`)
            }
          })
          .on('postgres_changes', { event: 'insert', schema: 'public', table: 'ia_change_log' }, (p) => {
            if (!p.new?.id) return
            setChangeLog((prev) => (prev.some((c) => c.id === p.new.id) ? prev : [p.new, ...prev]))
            // 원격 변경 토스트: "대표: HTM-S7-15 마일스톤 M2→M3"
            if (p.new.author !== authorRef.current && p.new.field !== 'memo_thread') {
              showToastRef.current?.(
                `${p.new.author}: ${p.new.target_id} ${fieldLabel(p.new.field)} ${p.new.old_value ?? ''}→${p.new.new_value ?? ''}`
              )
            }
          })
          .subscribe()
      } catch (e) {
        console.warn('[IA Live] Supabase 연결 실패 — 정적 폴백:', e?.message)
        fallback()
      }
    }
    load()
    return () => {
      cancelled = true
      if (channel) supabase.removeChannel(channel)
    }
  }, [])

  const live = status === 'live'

  // change_log 기록 (모든 쓰기 공통)
  const logChange = useCallback(async (targetId, field, oldValue, newValue) => {
    const row = {
      target_id: targetId, field,
      old_value: oldValue == null ? null : String(oldValue),
      new_value: newValue == null ? null : String(newValue),
      author: authorRef.current || '게스트',
    }
    const { data } = await supabase.from('ia_change_log').insert(row).select().single()
    if (data) setChangeLog((prev) => (prev.some((c) => c.id === data.id) ? prev : [data, ...prev]))
  }, [])

  // ── 필드 수정 (낙관적 반영 → Supabase → change_log) ──
  const updateFeatureField = useCallback(async (id, field, value) => {
    if (!live) return { error: '오프라인 — 읽기 전용이에요' }
    const old = features[id]?.[field] ?? ''
    if (String(old) === String(value)) return {}
    setFeatures((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }))
    const { error } = await supabase.from('ia_features').update({ [field]: value }).eq('id', id)
    if (error) {
      setFeatures((prev) => ({ ...prev, [id]: { ...prev[id], [field]: old } })) // 롤백
      return { error: `저장 실패: ${error.message}` }
    }
    await logChange(id, field, old, value)
    return {}
  }, [live, features, logChange])

  // ── 기능 추가 — HTM-S#-## 형식 + 화면 접두사 실존 검증 + 중복 차단.
  //    화면은 ID 접두사에서 유도(다른 화면을 보며 추가해도 올바른 화면에 귀속) ──
  const addFeature = useCallback(async (id, name) => {
    if (!live) return { error: '오프라인 — 읽기 전용이에요' }
    const m = /^HTM-(A0|S\d{1,2})-\d{2}$/.exec(id)
    if (!m) return { error: '형식: HTM-S#-## (예 HTM-S7-18)' }
    const screenId = m[1]
    if (!screens[screenId]) return { error: `등록되지 않은 화면이에요 (${screenId}) — 캐논에 화면 먼저 등록` }
    if (features[id]) return { error: '이미 있는 기능ID예요' }
    const scr = screens[screenId]
    const row = {
      id, screen: screenId, area: scr?.area ?? '', screen_name: scr?.name ?? '',
      name, milestone: 'M1',
      sort_order: Math.max(0, ...Object.values(features).map((f) => f.sort_order ?? 0)) + 1,
    }
    const { data, error } = await supabase.from('ia_features').insert(row).select().single()
    if (error) return { error: `추가 실패: ${error.message}` }
    setFeatures((prev) => ({ ...prev, [data.id]: data }))
    await logChange(id, 'created', null, name)
    return {}
  }, [live, features, screens, logChange])

  // ── 보관/복원 (삭제 없음 원칙) ──
  const archiveFeature = useCallback(
    (id, archived = true) => updateFeatureField(id, 'archived', archived),
    [updateFeatureField]
  )

  // ── 메모 스레드 작성 ──
  const addMemo = useCallback(async (targetId, body) => {
    if (!live) return { error: '오프라인 — 읽기 전용이에요' }
    const row = { target_id: targetId, author: authorRef.current || '게스트', body }
    const { data, error } = await supabase.from('ia_memos').insert(row).select().single()
    if (error) return { error: `메모 실패: ${error.message}` }
    setMemos((prev) => (prev.some((m) => m.id === data.id) ? prev : [data, ...prev]))
    await logChange(targetId, 'memo_thread', null, body.slice(0, 40))
    return {}
  }, [live, logChange])

  // ── 메모 확인 체크 / 소프트 삭제 (기록 보존 — deleted 플래그로 숨김) ──
  const patchMemo = useCallback(async (memoId, patch, logField, oldValue, newValue) => {
    if (!live) return { error: '오프라인 — 읽기 전용이에요' }
    const { data, error } = await supabase.from('ia_memos').update(patch).eq('id', memoId).select().single()
    if (error) return { error: `저장 실패: ${error.message} — scripts/schema_v2_1_memos.sql 실행 여부 확인` }
    setMemos((prev) => prev.map((m) => (m.id === memoId ? data : m)))
    await logChange(data.target_id, logField, oldValue, newValue)
    return {}
  }, [live, logChange])

  const confirmMemo = useCallback(
    (memoId, confirmed) => patchMemo(memoId, { confirmed }, 'memo_confirmed', String(!confirmed), String(confirmed)),
    [patchMemo]
  )
  const deleteMemo = useCallback(
    (memoId, body) => patchMemo(memoId, { deleted: true }, 'memo_deleted', (body ?? '').slice(0, 40), null),
    [patchMemo]
  )

  const markMemosSeen = useCallback(() => setUnseenMemos(0), [])

  const featureList = useMemo(
    () => Object.values(features).sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    [features]
  )

  return {
    iaStatus: status, iaScreens: screens, iaFeatures: features, iaFeatureList: featureList,
    iaMemos: memos, iaChangeLog: changeLog, iaFlashId: flashId,
    author, setAuthor, unseenMemos, markMemosSeen,
    updateFeatureField, addFeature, archiveFeature, addMemo, confirmMemo, deleteMemo,
  }
}
