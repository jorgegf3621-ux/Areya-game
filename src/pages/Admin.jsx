import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import AreyaLogo from '../components/AreyaLogo'
import { QUESTIONS } from '../data/questions'
import styles from './Admin.module.css'

export default function Admin() {
  const [session, setSession]   = useState(null)
  const [players, setPlayers]   = useState([])
  const [answers, setAnswers]   = useState([])
  const [creating, setCreating] = useState(false)

  async function createSession() {
    setCreating(true)
    const { data, error } = await supabase.from('game_sessions')
      .insert({ status: 'waiting', current_question: -1 })
      .select().single()
    if (!error) {
      setSession(data)
      setPlayers([])
      setAnswers([])
    }
    setCreating(false)
  }

  // Subscribe
  useEffect(() => {
    if (!session) return
    const sub = supabase.channel(`admin-${session.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'game_sessions', filter: `id=eq.${session.id}` },
        payload => setSession(payload.new))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'players', filter: `session_id=eq.${session.id}` },
        () => supabase.from('players').select('*').eq('session_id', session.id).order('joined_at').then(({ data }) => setPlayers(data||[])))
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'answers', filter: `session_id=eq.${session.id}` },
        payload => setAnswers(prev => [...prev, payload.new]))
      .subscribe()
    return () => supabase.removeChannel(sub)
  }, [session?.id])

  async function updateSession(updates) {
    const { data } = await supabase.from('game_sessions').update(updates).eq('id', session.id).select().single()
    if (data) setSession(data)
  }

  async function startGame() { await updateSession({ status: 'playing', current_question: 0 }) }
  async function nextQuestion() {
    const next = (session.current_question ?? -1) + 1
    if (next >= QUESTIONS.length) { await updateSession({ status: 'finished' }) }
    else { await updateSession({ current_question: next }) }
  }
  async function finishGame() { await updateSession({ status: 'finished' }) }
  async function resetSession() {
    await updateSession({ status: 'waiting', current_question: -1 })
    await supabase.from('answers').delete().eq('session_id', session.id)
    await supabase.from('players').update({ water_level: 0, score: 0 }).eq('session_id', session.id)
    setAnswers([])
  }

  const curQ = session?.current_question ?? -1
  const question = curQ >= 0 ? QUESTIONS[curQ] : null
  const answersByPlayer = {}
  answers.forEach(a => {
    if (!answersByPlayer[a.player_id]) answersByPlayer[a.player_id] = []
    answersByPlayer[a.player_id].push(a)
  })
  const answeredThisQ = answers.filter(a => a.question_index === curQ).length
  const consoleUrl = `${window.location.origin}/?session=${session?.id}`
  const playUrl    = `${window.location.origin}/play?session=${session?.id}`

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <AreyaLogo size={28} />
        <span className={styles.adminTitle}>Panel Administrador</span>
        <span className={styles.statusBadge} data-status={session?.status}>{session?.status || 'sin sesión'}</span>
      </div>

      {!session ? (
        <div className={styles.noSession}>
          <div className={styles.bigIcon}>🎮</div>
          <h3>Crear nueva sesión</h3>
          <p>Se generará un código único para esta partida</p>
          <button className={styles.btnOrange} onClick={createSession} disabled={creating}>
            {creating ? 'Creando...' : '🔫 Nueva Sesión'}
          </button>
        </div>
      ) : (
        <>
          {/* URLS */}
          <div className={styles.urlsBox}>
            <div className={styles.urlRow}>
              <span className={styles.urlLabel}>📺 Consola (proyector):</span>
              <a href={consoleUrl} target="_blank" className={styles.urlLink}>{consoleUrl}</a>
            </div>
            <div className={styles.urlRow}>
              <span className={styles.urlLabel}>📱 Jugadores:</span>
              <a href={playUrl} target="_blank" className={styles.urlLink}>{playUrl}</a>
            </div>
          </div>

          {/* CONTROLS */}
          <div className={styles.controls}>
            {session.status === 'waiting' && (
              <button className={styles.btnOrange} onClick={startGame} disabled={players.length === 0}>
                ▶ Iniciar Juego ({players.length} jugadores)
              </button>
            )}
            {session.status === 'playing' && (
              <>
                <button className={styles.btnOrange} onClick={nextQuestion}>
                  {curQ >= QUESTIONS.length - 1 ? '🏁 Terminar Juego' : `Siguiente Pregunta ▶ (${curQ+1}/${QUESTIONS.length})`}
                </button>
                <button className={styles.btnGray} onClick={finishGame}>Terminar</button>
              </>
            )}
            {session.status === 'finished' && (
              <button className={styles.btnGray} onClick={resetSession}>↩ Reiniciar</button>
            )}
            <button className={styles.btnDanger} onClick={createSession}>+ Nueva Sesión</button>
          </div>

          {/* CURRENT QUESTION */}
          {question && (
            <div className={styles.qCard}>
              <div className={styles.qCardNum}>Pregunta {curQ+1} — {answeredThisQ}/{players.length} respondieron</div>
              <div className={styles.qCardText}>{question.q}</div>
              <div className={styles.qAnswersList}>
                {(question.tf ? question.opts.slice(0,2) : question.opts).map((o, i) => (
                  <div key={i} className={styles.qAnswerOpt} style={{ background: i===question.c ? 'rgba(243,114,42,.15)':'rgba(255,255,255,.04)', borderColor: i===question.c ? '#F3722A':'rgba(255,255,255,.1)' }}>
                    <span style={{ color: i===question.c ? '#F3722A':'#8597AC', fontFamily:"'Fredoka One',cursive" }}>{String.fromCharCode(65+i)}</span>
                    <span>{o}</span>
                    {i===question.c && <span className={styles.correctTag}>✓ Correcta</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PLAYERS TABLE */}
          <div className={styles.playersCard}>
            <div className={styles.cardTitle}>Jugadores ({players.length})</div>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr><th>Nombre</th><th>Correctas</th><th>Agua</th><th>Esta Q</th></tr>
                </thead>
                <tbody>
                  {players.map(p => {
                    const correct = (answersByPlayer[p.id]||[]).filter(a=>a.is_correct).length
                    const thisQ = (answersByPlayer[p.id]||[]).find(a=>a.question_index===curQ)
                    return (
                      <tr key={p.id}>
                        <td className={styles.nameTd}>{p.name}</td>
                        <td className={styles.centerTd}>{correct}</td>
                        <td>
                          <div className={styles.miniBar}>
                            <div style={{ width:`${(p.water_level||0)*100}%`, height:'100%', background:'linear-gradient(90deg,#F3722A,#F18A21)', borderRadius:3 }}/>
                          </div>
                        </td>
                        <td className={styles.centerTd}>
                          {!thisQ ? '—' : thisQ.is_correct ? <span className={styles.okTag}>✓</span> : <span className={styles.noTag}>✗</span>}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
