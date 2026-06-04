import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

export function useGameSession(sessionId) {
  const [session, setSession]   = useState(null)
  const [players, setPlayers]   = useState([])
  const [answers, setAnswers]   = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    if (!sessionId) { setLoading(false); return }

    // Initial fetch
    async function fetchAll() {
      const [{ data: sess }, { data: pls }, { data: ans }] = await Promise.all([
        supabase.from('game_sessions').select('*').eq('id', sessionId).single(),
        supabase.from('players').select('*').eq('session_id', sessionId).order('joined_at'),
        supabase.from('answers').select('*').eq('session_id', sessionId),
      ])
      setSession(sess)
      setPlayers(pls || [])
      setAnswers(ans || [])
      setLoading(false)
    }
    fetchAll()

    // Realtime subscriptions
    const sessionSub = supabase.channel(`session-${sessionId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'game_sessions', filter: `id=eq.${sessionId}` },
        payload => setSession(payload.new))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'players', filter: `session_id=eq.${sessionId}` },
        () => supabase.from('players').select('*').eq('session_id', sessionId).order('joined_at').then(({ data }) => setPlayers(data || [])))
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'answers', filter: `session_id=eq.${sessionId}` },
        payload => setAnswers(prev => [...prev, payload.new]))
      .subscribe()

    return () => supabase.removeChannel(sessionSub)
  }, [sessionId])

  return { session, players, answers, loading }
}
