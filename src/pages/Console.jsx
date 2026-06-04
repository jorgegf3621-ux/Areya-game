import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import AreyaLogo from '../components/AreyaLogo'
import { useGameSession } from '../hooks/useGameSession'
import { QUESTIONS } from '../data/questions'
import styles from './Console.module.css'

const TIMER_SEC = 15
const SPEED_BONUS = [0.18, 0.13, 0.09]
const COLORS = [
  '#F3722A','#4ECDC4','#F18A21','#45B7D1','#96CEB4','#DDA0DD',
  '#E4630E','#85C1E9','#F5B979','#82E0AA','#F1948A','#FAD7A0',
  '#BB8FCE','#FF6B9D','#C7EFCF','#FFA552','#7EC8E3','#B8E0D2',
  '#F3722A','#4ECDC4','#F18A21','#45B7D1','#96CEB4','#DDA0DD',
]

export default function Console() {
  const [params] = useSearchParams()
  const sessionId = params.get('session')
  const { session, players, answers, loading } = useGameSession(sessionId)

  const curQ = session?.current_question ?? -1
  const question = curQ >= 0 ? QUESTIONS[curQ] : null

  // Water levels from answers
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

  // Stable race order (join order so rows don't jump around)
  const raceOrder = [...players].sort((a, b) => new Date(a.joined_at) - new Date(b.joined_at))
  const colorOf = id => COLORS[raceOrder.findIndex(p => p.id === id) % COLORS.length]

  // Splash animation when player answers correctly
  const [splashes, setSplashes] = useState({})
  const seenAns = useRef(new Set())
  useEffect(() => {
    const newCorrect = answers.filter(a => a.is_correct && !seenAns.current.has(a.id))
    newCorrect.forEach(a => seenAns.current.add(a.id))
    if (newCorrect.length) {
      setSplashes(prev => {
        const next = { ...prev }
        newCorrect.forEach(a => { next[a.player_id] = (prev[a.player_id] || 0) + 1 })
        return next
      })
    }
  }, [answers])

  // Timer
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
  const timerPct = (timerVal / TIMER_SEC) * 100
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
      <p>Abre <strong>/admin</strong> para crear una sesión.</p>
    </div>
  )

  if (loading) return (
    <div className={styles.loading}>
      <AreyaLogo size={40} /><span>Cargando...</span>
    </div>
  )

  return (
    <div className={styles.wrap}>

      {/* ── HEADER ── */}
      <div className={styles.header}>
        <AreyaLogo size={22} />
        <span className={styles.gameTitle}>🔫 TIRO AL BLANCO — AREYA</span>
        <span className={styles.code}>Código: <strong>{sessionId?.slice(-6).toUpperCase()}</strong></span>
      </div>

      {/* ── QUESTION STRIP ── */}
      {session?.status === 'playing' && question && (
        <div className={styles.qStrip}>
          <div className={styles.qLine}>
            <span className={styles.qNum}>P{curQ + 1}/{QUESTIONS.length}</span>
            <span className={styles.qText}>{question.q}</span>
            <span className={styles.qCount}>{answeredThisQ}/{players.length}</span>
            <span className={styles.timerNum} style={{ color: timerColor }}>⏱ {timerVal}s</span>
          </div>
          <div className={styles.timerBar}>
            <div className={styles.timerFill} style={{ width: `${timerPct}%`, background: timerBg }} />
          </div>
          <div className={styles.opts}>
            {(question.tf ? question.opts.slice(0, 2) : question.opts).map((o, i) => (
              <span key={i} className={styles.opt}>
                <span className={styles.letter}>{String.fromCharCode(65 + i)}</span>{o}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── WAITING STRIP ── */}
      {session?.status === 'waiting' && (
        <div className={styles.waitStrip}>
          <span className={styles.waitText}>🔫 Esperando jugadores — <strong>{players.length}</strong> registrados</span>
          <span className={styles.waitUrl}>📱 {window.location.origin}/play?session={sessionId}</span>
        </div>
      )}

      {/* ── FINISHED ── */}
      {session?.status === 'finished' && (
        <div className={styles.waitStrip}>
          <span className={styles.waitText}>🏁 Juego terminado{winner ? ` — Ganador: ${winner.name}` : ''}</span>
        </div>
      )}

      {/* ── WINNER BANNER ── */}
      {winner && (
        <div className={styles.winnerBanner}>
          🏆 ¡{winner.name} ganó la carrera! 🎉
        </div>
      )}

      {/* ── RACE TRACK ── */}
      <div className={styles.race}>
        {/* Finish line overlay */}
        <div className={styles.finishOverlay}>
          <span className={styles.finishFlag}>🏁</span>
          <div className={styles.finishLine} />
        </div>

        {raceOrder.length === 0 && (
          <div className={styles.emptyRace}>
            Esperando jugadores...
          </div>
        )}

        {raceOrder.map((p) => {
          const wl = waterLevels[p.id] || 0
          const color = colorOf(p.id)
          const isWinner = wl >= 1
          const splashKey = splashes[p.id]
          const answeredThis = answers.some(a => a.player_id === p.id && a.question_index === curQ)

          return (
            <div
              key={p.id}
              className={`${styles.row} ${isWinner ? styles.rowWinner : ''}`}
              style={{ '--c': color }}
            >
              {/* Horse name + player name */}
              <div className={styles.nameCol}>
                <span className={styles.horseName}>{p.horse_name || p.name}</span>
                {p.horse_name && <span className={styles.playerSmall}>{p.name}</span>}
              </div>

              {/* Track */}
              <div className={styles.track}>
                {/* Water fill behind horse */}
                <div
                  className={styles.fill}
                  style={{ width: `${wl * 100}%`, background: `${color}30` }}
                />

                {/* Horse */}
                <div
                  className={styles.horse}
                  style={{ '--wl': wl }}
                >
                  {isWinner ? '🏆' : '🏇'}
                </div>

                {/* Splash on correct answer */}
                {splashKey && (
                  <span
                    key={`s-${splashKey}`}
                    className={styles.splash}
                    style={{ '--wl': wl }}
                  >💧</span>
                )}
              </div>

              {/* Answered indicator */}
              {answeredThis && session?.status === 'playing' && (
                <span className={styles.check}>✓</span>
              )}
            </div>
          )
        })}
      </div>

      {/* ── FOOTER ── */}
      <div className={styles.footer}>
        📱 Únete: <strong>{window.location.origin}/play?session={sessionId}</strong>
      </div>
    </div>
  )
}
