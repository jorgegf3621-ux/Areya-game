import { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import TowerCanvas from '../components/TowerCanvas'
import AreyaLogo from '../components/AreyaLogo'
import { useGameSession } from '../hooks/useGameSession'
import { QUESTIONS } from '../data/questions'
import styles from './Console.module.css'

const PLAYER_COLS = ['#F3722A','#8597AC','#F18A21','#D6DCE3','#E4630E','#676B73',
  '#F5B979','#A5A6A2','#F3722A','#8597AC','#F18A21','#D6DCE3',
  '#E4630E','#676B73','#F5B979','#A5A6A2','#F3722A','#8597AC','#F18A21','#D6DCE3']

const TIMER_SEC = 15
const MAX_COLS = 5

export default function Console() {
  const [params] = useSearchParams()
  const sessionId = params.get('session')
  const { session, players, answers, loading } = useGameSession(sessionId)

  const towerRefs = useRef({})
  const prevAnswerCount = useRef(0)

  const curQ = session?.current_question ?? -1
  const question = curQ >= 0 ? QUESTIONS[curQ] : null

  // Compute water levels from answers
  const waterLevels = {}
  const SPEED_BONUS = [0.18, 0.13, 0.09]
  if (players.length && answers.length) {
    players.forEach(p => { waterLevels[p.id] = 0 })
    for (let qi = 0; qi < QUESTIONS.length; qi++) {
      const qAnswers = answers
        .filter(a => a.question_index === qi && a.is_correct)
        .sort((a, b) => a.response_time_ms - b.response_time_ms)
      qAnswers.forEach((a, rank) => {
        waterLevels[a.player_id] = Math.min(1, (waterLevels[a.player_id] || 0) + (SPEED_BONUS[rank] || 0.09))
      })
    }
  }

  // Trigger gun animation when new answer arrives
  useEffect(() => {
    if (answers.length <= prevAnswerCount.current) return
    const newAns = answers.slice(prevAnswerCount.current)
    prevAnswerCount.current = answers.length
    newAns.forEach(a => {
      const canvas = towerRefs.current[a.player_id]
      if (canvas?.fireGun) canvas.fireGun(a.is_correct)
    })
  }, [answers])

  // Timer bar
  const [timerVal, setTimerVal] = useState(TIMER_SEC)
  const timerRef = useRef(null)

  useEffect(() => {
    clearInterval(timerRef.current)
    if (session?.status === 'playing' && curQ >= 0) {
      setTimerVal(TIMER_SEC)
      timerRef.current = setInterval(() => {
        setTimerVal(v => Math.max(0, v - 1))
      }, 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [curQ, session?.status])

  const winner = players.find(p => (waterLevels[p.id] || 0) >= 1)

  if (!sessionId) {
    return (
      <div className={styles.noSession}>
        <AreyaLogo size={48} />
        <h2>Consola Principal</h2>
        <p>Abre <strong>/admin</strong> para crear una sesión y obtener el link de esta consola.</p>
      </div>
    )
  }

  if (loading) return <div className={styles.loading}><AreyaLogo size={40} /><span>Cargando sesión...</span></div>

  const cols = Math.min(players.length, MAX_COLS)

  return (
    <div className={styles.wrap}>
      {/* Header */}
      <div className={styles.header}>
        <AreyaLogo size={30} />
        <div className={styles.gameTitle}>💦 AGUA, AGUA, AGUA!</div>
        <div className={styles.sessionCode}>Código: <strong>{sessionId?.slice(-6).toUpperCase()}</strong></div>
      </div>

      {/* Timer + Question */}
      {session?.status === 'playing' && question && (
        <div className={styles.questionBox}>
          <div className={styles.qTop}>
            <span className={styles.qNum}>PREGUNTA {curQ+1}/{QUESTIONS.length}</span>
            <span className={styles.timerNum} style={{ color: timerVal <= 5 ? '#ff4444' : timerVal <= 9 ? '#F18A21' : '#F3722A' }}>
              ⏱ {timerVal}s
            </span>
          </div>
          <div className={styles.timerBar}>
            <div
              className={styles.timerFill}
              style={{
                width: `${(timerVal/TIMER_SEC)*100}%`,
                background: timerVal > 8 ? 'linear-gradient(90deg,#F3722A,#E4630E)' :
                  timerVal > 4 ? 'linear-gradient(90deg,#F18A21,#cc6600)' :
                  'linear-gradient(90deg,#cc3300,#880000)'
              }}
            />
          </div>
          <div className={styles.qText}>{question.q}</div>
          <div className={styles.qOpts} style={{ gridTemplateColumns: question.tf ? '1fr 1fr' : '1fr 1fr 1fr 1fr' }}>
            {(question.tf ? question.opts.slice(0,2) : question.opts).map((o, i) => (
              <div key={i} className={styles.qOpt}>
                <span className={styles.qOptLetter}>{String.fromCharCode(65+i)}</span>
                <span>{o}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {session?.status === 'waiting' && (
        <div className={styles.waiting}>
          <div className={styles.waitingIcon}>🔫</div>
          <div className={styles.waitingText}>Esperando jugadores...</div>
          <div className={styles.waitingCount}>{players.length} registrados</div>
          <div className={styles.joinUrl}>
            Únete: <strong>{window.location.origin}/play?session={sessionId}</strong>
          </div>
        </div>
      )}

      {session?.status === 'finished' && winner && (
        <div className={styles.finishedBanner}>
          🏆 ¡GANADOR: <strong>{winner.name}</strong>!
        </div>
      )}

      {/* Towers Grid */}
      <div
        className={styles.towersGrid}
        style={{ gridTemplateColumns: `repeat(${cols || 3}, 1fr)` }}
      >
        {players.map((p, i) => (
          <div key={p.id} className={styles.towerCol}>
            <div className={styles.playerName} style={{ color: PLAYER_COLS[i % PLAYER_COLS.length] }}>
              {p.name}
            </div>
            <TowerCanvas
              ref={el => { towerRefs.current[p.id] = el }}
              playerIndex={i}
              playerName={p.name}
              waterLevel={waterLevels[p.id] || 0}
              won={(waterLevels[p.id] || 0) >= 1}
              isActive={false}
              color={PLAYER_COLS[i % PLAYER_COLS.length]}
            />
            <div className={styles.playerScore}>
              {answers.filter(a => a.player_id === p.id && a.is_correct).length} correctas
            </div>
          </div>
        ))}
      </div>

      {/* QR / Join info at bottom */}
      {session?.status === 'playing' && (
        <div className={styles.footer}>
          <span>📱 Únete: <strong>{window.location.origin}/play?session={sessionId}</strong></span>
        </div>
      )}
    </div>
  )
}
