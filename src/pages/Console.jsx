import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import AreyaLogo from '../components/AreyaLogo'
import { useGameSession } from '../hooks/useGameSession'
import { QUESTIONS } from '../data/questions'
import styles from './Console.module.css'

const TIMER_SEC = 15
const TOP_N = 14

const COLORS = [
  '#F3722A','#4ECDC4','#F18A21','#45B7D1','#F5B979','#96CEB4',
  '#E4630E','#DDA0DD','#F3722A','#85C1E9','#F18A21','#82E0AA',
  '#F5B979','#F1948A','#E4630E','#FAD7A0',
]

export default function Console() {
  const [params] = useSearchParams()
  const sessionId = params.get('session')
  const { session, players, answers, loading } = useGameSession(sessionId)

  const curQ = session?.current_question ?? -1
  const question = curQ >= 0 ? QUESTIONS[curQ] : null

  const SPEED_BONUS = [0.18, 0.13, 0.09]
  const waterLevels = {}
  if (players.length) {
    players.forEach(p => { waterLevels[p.id] = 0 })
    for (let qi = 0; qi < QUESTIONS.length; qi++) {
      const qAns = answers
        .filter(a => a.question_index === qi && a.is_correct)
        .sort((a, b) => a.response_time_ms - b.response_time_ms)
      qAns.forEach((a, rank) => {
        waterLevels[a.player_id] = Math.min(1, (waterLevels[a.player_id] || 0) + (SPEED_BONUS[rank] || 0.09))
      })
    }
  }

  const colorOf = id => {
    const idx = players.findIndex(p => p.id === id)
    return COLORS[idx % COLORS.length]
  }

  const sorted = [...players].sort((a, b) => (waterLevels[b.id] || 0) - (waterLevels[a.id] || 0))
  const topPlayers  = sorted.slice(0, TOP_N)
  const restPlayers = sorted.slice(TOP_N)

  const [timerVal, setTimerVal] = useState(TIMER_SEC)
  const timerRef = useRef(null)
  useEffect(() => {
    clearInterval(timerRef.current)
    if (session?.status === 'playing' && curQ >= 0) {
      setTimerVal(TIMER_SEC)
      timerRef.current = setInterval(() => setTimerVal(v => Math.max(0, v - 1)), 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [curQ, session?.status])

  const winner = players.find(p => (waterLevels[p.id] || 0) >= 1)
  const answeredThisQ = answers.filter(a => a.question_index === curQ).length
  const timerColor = timerVal <= 5 ? '#ff4444' : timerVal <= 9 ? '#F18A21' : '#F3722A'
  const timerBg = timerVal > 8
    ? 'linear-gradient(90deg,#F3722A,#E4630E)'
    : timerVal > 4
      ? 'linear-gradient(90deg,#F18A21,#cc6600)'
      : 'linear-gradient(90deg,#cc3300,#880000)'

  if (!sessionId) return (
    <div className={styles.noSession}>
      <AreyaLogo size={48} />
      <h2>Consola Principal</h2>
      <p>Abre <strong>/admin</strong> para crear una sesión y obtener este link.</p>
    </div>
  )

  if (loading) return (
    <div className={styles.loading}>
      <AreyaLogo size={40} /><span>Cargando sesión...</span>
    </div>
  )

  return (
    <div className={styles.wrap}>

      {/* HEADER */}
      <div className={styles.header}>
        <AreyaLogo size={24} />
        <span className={styles.gameTitle}>💦 AGUA, AGUA, AGUA!</span>
        <span className={styles.sessionCode}>Código: <strong>{sessionId?.slice(-6).toUpperCase()}</strong></span>
      </div>

      {/* WINNER BANNER */}
      {winner && (
        <div className={styles.winnerBanner}>
          🏆 ¡GANADOR: {winner.name}! 🎉
        </div>
      )}

      {/* MAIN SPLIT */}
      <div className={styles.mainSplit}>

        {/* ── LEFT: Pregunta ── */}
        <div className={styles.leftPanel}>

          {session?.status === 'waiting' && (
            <div className={styles.waitState}>
              <div className={styles.waitIcon}>🔫</div>
              <div className={styles.waitTitle}>Esperando jugadores...</div>
              <div className={styles.waitCount}>{players.length} registrados</div>
              <div className={styles.waitUrl}>
                📱 {window.location.origin}/play?session={sessionId}
              </div>
            </div>
          )}

          {session?.status === 'finished' && (
            <div className={styles.waitState}>
              <div className={styles.waitIcon}>🏁</div>
              <div className={styles.waitTitle}>¡Juego terminado!</div>
              {winner && <div className={styles.waitCount}>Ganador: {winner.name}</div>}
            </div>
          )}

          {session?.status === 'playing' && question && (
            <div className={styles.qPanel}>
              <div className={styles.qMeta}>
                <span className={styles.qNum}>PREGUNTA {curQ + 1} / {QUESTIONS.length}</span>
                <span className={styles.qAnswered}>{answeredThisQ} / {players.length} respondieron</span>
                <span className={styles.timerNum} style={{ color: timerColor }}>⏱ {timerVal}s</span>
              </div>
              <div className={styles.timerBar}>
                <div className={styles.timerFill} style={{ width: `${(timerVal / TIMER_SEC) * 100}%`, background: timerBg }} />
              </div>
              <div className={styles.qText}>{question.q}</div>
              <div className={styles.qOpts} style={{ gridTemplateColumns: question.tf ? '1fr 1fr' : '1fr 1fr' }}>
                {(question.tf ? question.opts.slice(0, 2) : question.opts).map((o, i) => (
                  <div key={i} className={styles.qOpt}>
                    <span className={styles.qLetter}>{String.fromCharCode(65 + i)}</span>
                    <span>{o}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT: Marcador ── */}
        <div className={styles.rightPanel}>
          <div className={styles.leaderHeader}>
            <span className={styles.leaderTitle}>🏆 MARCADOR</span>
            <span className={styles.leaderCount}>{players.length} jugadores</span>
          </div>

          {players.length === 0 ? (
            <div className={styles.noPlayers}>Sin jugadores aún</div>
          ) : (
            <>
              <div className={styles.leaderList}>
                {topPlayers.map((p, i) => {
                  const wl = waterLevels[p.id] || 0
                  const color = colorOf(p.id)
                  const answeredThis = answers.some(a => a.player_id === p.id && a.question_index === curQ)
                  const isWinner = wl >= 1
                  return (
                    <div key={p.id} className={styles.leaderRow} style={{ background: isWinner ? 'rgba(243,114,42,.1)' : undefined }}>
                      <span className={styles.rank} style={{ color: i === 0 ? '#F3722A' : i === 1 ? '#8597AC' : i === 2 ? '#F5B979' : '#676B73' }}>
                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                      </span>
                      <span className={styles.dot} style={{ background: color }} />
                      <span className={styles.pName}>{p.name}</span>
                      {answeredThis && session?.status === 'playing' && (
                        <span className={styles.answeredBadge}>✓</span>
                      )}
                      <div className={styles.barWrap}>
                        <div className={styles.barFill} style={{ width: `${wl * 100}%`, background: color }} />
                      </div>
                      <span className={styles.pct}>{Math.round(wl * 100)}%</span>
                    </div>
                  )
                })}
              </div>

              {restPlayers.length > 0 && (
                <div className={styles.restSection}>
                  <div className={styles.restLabel}>+ {restPlayers.length} jugadores más</div>
                  <div className={styles.restGrid}>
                    {restPlayers.map(p => {
                      const answeredThis = answers.some(a => a.player_id === p.id && a.question_index === curQ)
                      return (
                        <span key={p.id} className={styles.chip} style={{ borderColor: colorOf(p.id) + '55' }}>
                          <span style={{ color: colorOf(p.id) }}>●</span> {p.name}
                          {answeredThis && session?.status === 'playing' && ' ✓'}
                        </span>
                      )
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* FOOTER */}
      {session?.status !== 'waiting' && (
        <div className={styles.footer}>
          📱 Únete: <strong>{window.location.origin}/play?session={sessionId}</strong>
        </div>
      )}
    </div>
  )
}
