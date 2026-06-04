import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import AreyaLogo from '../components/AreyaLogo'
import { supabase } from '../lib/supabase'
import { QUESTIONS } from '../data/questions'
import styles from './Play.module.css'

const TIMER_SEC = 15

export default function Play() {
  const [params] = useSearchParams()
  const sessionId = params.get('session')

  const [phase, setPhase]       = useState('register') // register | waiting | playing | answered | finished
  const [name, setName]         = useState('')
  const [horseName, setHorseName] = useState('')
  const [player, setPlayer]     = useState(null)
  const [session, setSession]   = useState(null)
  const [selected, setSelected] = useState(null)
  const [result, setResult]     = useState(null)   // { correct, rank, bonus }
  const [timerVal, setTimerVal] = useState(TIMER_SEC)
  const [note, setNote]         = useState('')
  const timerRef = useRef(null)
  const startTimeRef = useRef(null)

  const curQ = session?.current_question ?? -1
  const question = curQ >= 0 ? QUESTIONS[curQ] : null

  // Subscribe to session changes
  useEffect(() => {
    if (!sessionId) return
    supabase.from('game_sessions').select('*').eq('id', sessionId).single()
      .then(({ data }) => {
        setSession(data)
        if (data?.status === 'waiting' && player) setPhase('waiting')
        if (data?.status === 'playing') setPhase('playing')
        if (data?.status === 'finished') setPhase('finished')
      })

    const sub = supabase.channel(`session-play-${sessionId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'game_sessions', filter: `id=eq.${sessionId}` },
        payload => {
          const s = payload.new
          setSession(s)
          if (s.status === 'playing') {
            setPhase('playing')
            setSelected(null)
            setResult(null)
            setNote('')
            setTimerVal(TIMER_SEC)
            startTimeRef.current = Date.now()
          }
          if (s.status === 'waiting') setPhase(player ? 'waiting' : 'register')
          if (s.status === 'finished') setPhase('finished')
        })
      .subscribe()

    return () => supabase.removeChannel(sub)
  }, [sessionId, player])

  // Timer
  useEffect(() => {
    clearInterval(timerRef.current)
    if (phase === 'playing' && !selected) {
      timerRef.current = setInterval(() => {
        setTimerVal(v => {
          if (v <= 1) { clearInterval(timerRef.current); setPhase('answered'); return 0 }
          return v - 1
        })
      }, 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [phase, curQ, selected])

  async function register() {
    if (!name.trim() || !horseName.trim() || !sessionId) return
    const { data, error } = await supabase.from('players')
      .insert({ session_id: sessionId, name: name.trim(), horse_name: horseName.trim(), water_level: 0, score: 0 })
      .select().single()
    if (!error) { setPlayer(data); setPhase('waiting') }
  }

  async function pick(optIdx) {
    if (!player || selected !== null || !question) return
    clearInterval(timerRef.current)
    const elapsed = Date.now() - (startTimeRef.current || Date.now())
    setSelected(optIdx)
    const isCorrect = optIdx === question.c

    // Count how many already answered correctly for this question
    const { count } = await supabase.from('answers')
      .select('*', { count: 'exact', head: true })
      .eq('session_id', sessionId)
      .eq('question_index', curQ)
      .eq('is_correct', true)
    const rank = count || 0

    await supabase.from('answers').insert({
      session_id: sessionId,
      player_id: player.id,
      question_index: curQ,
      answer_index: optIdx,
      is_correct: isCorrect,
      response_time_ms: elapsed,
      speed_rank: isCorrect ? rank : -1
    })

    const SPEED_BONUS = [0.18, 0.13, 0.09]
    const bonus = isCorrect ? (SPEED_BONUS[rank] || 0.09) : 0
    if (isCorrect && player) {
      const newWater = Math.min(1, (player.water_level || 0) + bonus)
      await supabase.from('players').update({ water_level: newWater, score: (player.score||0)+1 }).eq('id', player.id)
      setPlayer(p => ({ ...p, water_level: newWater, score: (p.score||0)+1 }))
    }

    const rankLabels = ['🥇 ¡PRIMERO!', '🥈 Segundo', '🥉 Tercero']
    setResult({ correct: isCorrect, rank, bonus, rankLabel: rankLabels[rank] || '' })
    setNote(question.note || '')
    setPhase('answered')
  }

  // ── RENDER ──
  if (!sessionId) return (
    <div className={styles.center}>
      <AreyaLogo size={44} />
      <p style={{color:'#8597AC',marginTop:12}}>Necesitas un link con código de sesión.</p>
    </div>
  )

  if (phase === 'register') return (
    <div className={styles.wrap}>
      <div className={styles.center}>
        <AreyaLogo size={44} />
        <h2 className={styles.title}>💦 Agua, Agua, Agua!</h2>
        <p className={styles.sub}>Ingresa tu nombre y el nombre de tu caballo 🏇</p>
        <input
          className={styles.nameInput}
          type="text"
          placeholder="Tu nombre..."
          value={name}
          maxLength={20}
          onChange={e => setName(e.target.value)}
          autoFocus
        />
        <input
          className={styles.nameInput}
          type="text"
          placeholder="Nombre de tu caballo..."
          value={horseName}
          maxLength={20}
          onChange={e => setHorseName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && register()}
        />
        <button className={styles.btnPrimary} onClick={register} disabled={!name.trim() || !horseName.trim()}>
          🔫 ¡ENTRAR AL JUEGO!
        </button>
      </div>
    </div>
  )

  if (phase === 'waiting') return (
    <div className={styles.wrap}>
      <div className={styles.center}>
        <AreyaLogo size={36} />
        <div className={styles.waitEmoji}>⌛</div>
        <h3 className={styles.title}>¡Listo, {player?.name}!</h3>
        <p className={styles.sub}>Esperando que el host inicie el juego...</p>
        <div className={styles.playerBadge}>{player?.name}</div>
      </div>
    </div>
  )

  if (phase === 'playing' && question) return (
    <div className={styles.wrap}>
      <div className={styles.playHeader}>
        <AreyaLogo size={24} showText={false} />
        <span className={styles.playerBadgeSmall}>{player?.name}</span>
        <span className={styles.timerSmall} style={{ color: timerVal<=5?'#ff4444':timerVal<=9?'#F18A21':'#F3722A' }}>
          ⏱ {timerVal}s
        </span>
      </div>
      <div className={styles.timerBar}>
        <div className={styles.timerFill} style={{
          width: `${(timerVal/TIMER_SEC)*100}%`,
          background: timerVal>8?'linear-gradient(90deg,#F3722A,#E4630E)':timerVal>4?'linear-gradient(90deg,#F18A21,#cc6600)':'linear-gradient(90deg,#cc3300,#880000)'
        }}/>
      </div>
      <div className={styles.qNum}>PREGUNTA {curQ+1} / {QUESTIONS.length}</div>
      <div className={styles.qText}>{question.q}</div>
      <div className={styles.optsGrid} style={{ gridTemplateColumns: question.tf ? '1fr 1fr' : '1fr 1fr' }}>
        {(question.tf ? question.opts.slice(0,2) : question.opts).map((o, i) => (
          <button
            key={i}
            className={styles.optBtn}
            onClick={() => pick(i)}
            disabled={selected !== null}
          >
            <span className={styles.optLetter}>{String.fromCharCode(65+i)}</span>
            <span className={styles.optText}>{o}</span>
          </button>
        ))}
      </div>
      <div className={styles.waterBar}>
        <div className={styles.waterFill} style={{ width: `${(player?.water_level||0)*100}%` }}/>
      </div>
      <div className={styles.waterLabel}>Tu agua: {Math.round((player?.water_level||0)*100)}%</div>
    </div>
  )

  if (phase === 'answered') return (
    <div className={styles.wrap}>
      <div className={styles.resultBox}>
        <div className={styles.resultIcon}>{result?.correct ? '💦' : '💨'}</div>
        <div className={styles.resultTitle} style={{ color: result?.correct ? '#F3722A' : '#8597AC' }}>
          {result?.correct ? '¡CORRECTO!' : 'INCORRECTO'}
        </div>
        {result?.correct && (
          <>
            <div className={styles.speedBadge}>{result.rankLabel}</div>
            <div className={styles.bonusText}>+{Math.round((result.bonus||0)*100)}% agua subió</div>
          </>
        )}
        {note && <div className={styles.noteText}>💡 {note}</div>}
        <div className={styles.waitNext}>Esperando siguiente pregunta...</div>
        <div className={styles.waterBar}>
          <div className={styles.waterFill} style={{ width: `${(player?.water_level||0)*100}%` }}/>
        </div>
        <div className={styles.waterLabel}>Tu agua: {Math.round((player?.water_level||0)*100)}%</div>
      </div>
    </div>
  )

  if (phase === 'finished') return (
    <div className={styles.wrap}>
      <div className={styles.center}>
        <div style={{fontSize:'3rem',marginBottom:8}}>🏆</div>
        <h2 className={styles.title}>¡Juego terminado!</h2>
        <p className={styles.sub}>Gracias por participar, <strong style={{color:'#F3722A'}}>{player?.name}</strong></p>
        <div className={styles.finalScore}>
          <div className={styles.finalScoreNum}>{player?.score || 0}</div>
          <div className={styles.finalScoreLabel}>respuestas correctas</div>
        </div>
        <div className={styles.waterBar} style={{marginTop:12}}>
          <div className={styles.waterFill} style={{ width: `${(player?.water_level||0)*100}%` }}/>
        </div>
        <div className={styles.waterLabel}>Torre llenada: {Math.round((player?.water_level||0)*100)}%</div>
      </div>
    </div>
  )

  return <div className={styles.center}><AreyaLogo size={40}/></div>
}
