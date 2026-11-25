import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CONCEPTS, CONCEPT_MAP, neighbors } from '../content'
import { DOMAIN_MAP } from '../content/domains'
import { SIM_META } from '../sims/registry'
import { LEVEL_NAME, type Concept } from '../types'
import { useStore } from '../lib/store'
import { makeQuestion, rng } from '../lib/quiz'
import { Rich, StatusBadge, Tex } from '../components/ui'
import { QuestionCard } from '../components/Quiz'

interface Layer { id: string; name: string }

function layersFor(c: Concept): Layer[] {
  const L: Layer[] = [{ id: 'keyword', name: 'Keyword' }, { id: 'plain', name: 'Plain meaning' }]
  if (c.analogy) L.push({ id: 'analogy', name: 'Analogy' })
  if (c.why) L.push({ id: 'why', name: 'Why it matters' })
  if (c.formula) L.push({ id: 'math', name: 'The math' })
  if (c.example) L.push({ id: 'example', name: 'Worked example' })
  if (c.real || c.used) L.push({ id: 'real', name: 'On the job' })
  L.push({ id: 'try', name: 'Check yourself' })
  if (c.iq?.length) L.push({ id: 'interview', name: 'Interview' })
  L.push({ id: 'teach', name: 'Teach it back' })
  return L
}

const STOP = new Set('about after again against because before being between could during every first through their there these those under where which while would should other using used often when what with that this from into than then they them your have has been were will also each such only more most very same over make made many much must does like just'.split(' '))

function keyWords(c: Concept): string[] {
  const words = (c.def + ' ' + c.one).toLowerCase().match(/[a-z][a-z-]{5,}/g) || []
  const freq = new Map<string, number>()
  words.forEach((w) => !STOP.has(w) && freq.set(w, (freq.get(w) || 0) + 1))
  return [...freq.entries()].sort((a, b) => b[1] - a[1] || b[0].length - a[0].length).slice(0, 6).map((x) => x[0])
}

function Block({ id, n, name, children, onSeen }: { id: string; n: number; name: string; children: React.ReactNode; onSeen: (n: number) => void }) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && onSeen(n)), { rootMargin: '0px 0px -40% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [n, onSeen])
  return (
    <section ref={ref} id={id} className="scroll-mt-20 border-t border-line py-6 first:border-t-0 first:pt-0">
      <h2 className="mb-3 flex items-baseline gap-3">
        <span className="wide text-sm text-ink-2">{n + 1}</span>
        <span className="wide text-xl">{name}</span>
      </h2>
      {children}
    </section>
  )
}

function WorkedExample({ c }: { c: Concept }) {
  const ex = c.example!
  const [shown, setShown] = useState(0)
  const [guess, setGuess] = useState('')
  const all = shown > ex.steps.length
  return (
    <div>
      <p className="measure font-medium"><Rich text={ex.q} /></p>
      <div className="mt-3 flex flex-wrap items-center gap-2 no-print">
        <input className="input max-w-xs" placeholder="Your answer first (optional)" value={guess} onChange={(e) => setGuess(e.target.value)} aria-label="Your answer" />
        {!all && <button className="btn" onClick={() => setShown((s) => s + 1)}>{shown === 0 ? 'Show first step' : shown < ex.steps.length ? 'Next step' : 'Show answer'}</button>}
        {!all && <button className="btn-ghost btn" onClick={() => setShown(ex.steps.length + 1)}>Show everything</button>}
      </div>
      <ol className="mt-4 space-y-2">
        {ex.steps.slice(0, shown).map((s, i) => (
          <li key={i} className="flip-in flex gap-3">
            <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line text-xs font-semibold">{i + 1}</span>
            <span className="measure"><Rich text={s} /></span>
          </li>
        ))}
      </ol>
      {all && (
        <div className="flip-in mt-4 border-l-4 border-sgreen bg-sgreen/10 px-4 py-3">
          <p className="font-semibold"><Rich text={ex.a} /></p>
          {ex.so && <p className="mt-1 text-[0.95rem]"><Rich text={ex.so} /></p>}
          {guess && <p className="mt-2 text-sm text-ink-2">You answered: {guess}</p>}
        </div>
      )}
    </div>
  )
}

export default function ConceptPage() {
  const { id = '' } = useParams()
  const c = CONCEPT_MAP[id]
  const open = useStore((s) => s.open)
  const reachLayer = useStore((s) => s.reachLayer)
  const addCard = useStore((s) => s.addCard)
  const inDeck = useStore((s) => !!s.cards[id])
  const bookmarked = useStore((s) => s.bookmarks.includes(id))
  const toggleBookmark = useStore((s) => s.toggleBookmark)
  const teach = useStore((s) => s.progress[id]?.teach || '')
  const setTeach = useStore((s) => s.setTeach)
  const deepest = useStore((s) => s.progress[id]?.layers ?? -1)
  const [active, setActive] = useState(0)
  const [qSeed, setQSeed] = useState(1)

  useEffect(() => { if (c) open(c.id) }, [c, open])
  const layers = useMemo(() => (c ? layersFor(c) : []), [c])
  const near = useMemo(() => (c ? neighbors(c) : []), [c])
  const question = useMemo(() => (c ? makeQuestion(c, CONCEPTS, rng(qSeed * 7919 + c.id.length)) : null), [c, qSeed])
  const kws = useMemo(() => (c ? keyWords(c) : []), [c])
  const onSeen = useMemo(() => (n: number) => { setActive(n); reachLayer(id, n) }, [id, reachLayer])

  if (!c) return (
    <div>
      <h1 className="display text-3xl">Concept not found</h1>
      <p className="mt-2">This link points to a card that doesn't exist. <Link className="underline" to="/directory">Browse the directory</Link>.</p>
    </div>
  )
  const d = DOMAIN_MAP[c.domain]
  const sim = c.sim ? SIM_META.find((s) => s.id === c.sim) : undefined
  const idx = (lid: string) => layers.findIndex((l) => l.id === lid)

  return (
    <div className="lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-10">
      {/* Depth ladder: shows how deep into the concept the learner has gone */}
      <nav aria-label="Concept layers" className="no-print mb-6 lg:mb-0">
        <div className="lg:sticky lg:top-8">
          <Link to={`/d/${d.id}`} className="text-sm text-ink-2 hover:text-ink">{d.name}</Link>
          <ol className="mt-3 flex gap-1 overflow-x-auto pb-2 lg:block lg:space-y-1 lg:overflow-visible">
            {layers.map((l, i) => (
              <li key={l.id} className="shrink-0">
                <a href={`#${l.id}`} className={`flex items-center gap-2 rounded px-2 py-1 text-sm ${i === active ? 'bg-sheet font-semibold' : 'text-ink-2 hover:text-ink'}`}>
                  <span className="h-4 w-1.5 rounded-sm" style={{ background: i <= Math.max(deepest, active) ? d.tape : 'var(--color-line)' }} />
                  {l.name}
                </a>
              </li>
            ))}
          </ol>
          <p className="mt-3 hidden text-xs text-ink-2 lg:block">Stop at any layer. The tape fills as you go deeper.</p>
        </div>
      </nav>

      <article className="sheet min-w-0 rounded-lg p-5 sm:p-8">
        <Block id="keyword" n={idx('keyword')} name="Keyword" onSeen={onSeen}>
          <div className="mb-3 h-1.5 w-20 rounded-sm" style={{ background: d.tape }} />
          <h1 className="display text-4xl sm:text-5xl">{c.term}</h1>
          {c.full && c.full !== c.term && <p className="wide mt-2 text-lg text-ink-2">{c.full}</p>}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <StatusBadge id={c.id} />
            <span className="chip">{LEVEL_NAME[c.level]}</span>
            <span className="chip">{c.sub}</span>
            {c.used?.freq && <span className="chip">In job postings: {c.used.freq}</span>}
            {c.aka?.map((a) => <span key={a} className="chip">also: {a}</span>)}
          </div>
          <div className="no-print mt-4 flex flex-wrap gap-2">
            <button className="btn" onClick={() => addCard(c.id)} disabled={inDeck}>{inDeck ? 'In your review deck' : 'Add to review deck'}</button>
            <button className="btn-ghost btn" onClick={() => toggleBookmark(c.id)}>{bookmarked ? 'Bookmarked' : 'Bookmark'}</button>
            {sim && <Link className="btn-tape btn" to={`/lab/${sim.id}`}>Open {sim.name}</Link>}
          </div>
        </Block>

        <Block id="plain" n={idx('plain')} name="Plain meaning" onSeen={onSeen}>
          <p className="measure text-xl leading-snug"><Rich text={c.one} /></p>
          <p className="measure mt-3"><Rich text={c.def} /></p>
          {c.confused?.map(([t, diff]) => (
            <p key={t} className="measure mt-3 border-l-4 border-sorange pl-3 text-[0.95rem]"><strong>Not to be confused with {t}:</strong> <Rich text={diff} /></p>
          ))}
        </Block>

        {c.analogy && (
          <Block id="analogy" n={idx('analogy')} name="Analogy" onSeen={onSeen}>
            <p className="measure text-lg italic"><Rich text={c.analogy} /></p>
          </Block>
        )}

        {c.why && (
          <Block id="why" n={idx('why')} name="Why it matters" onSeen={onSeen}>
            <p className="measure"><Rich text={c.why} /></p>
          </Block>
        )}

        {c.formula && (
          <Block id="math" n={idx('math')} name="The math" onSeen={onSeen}>
            <div className="rounded-md border border-line bg-paper/50 px-4 py-2"><Tex tex={c.formula.tex} block /></div>
            {c.formula.vars && (
              <dl className="mt-3 grid gap-x-4 gap-y-1 sm:grid-cols-[auto_1fr]">
                {c.formula.vars.map(([s, m]) => (
                  <div key={s} className="contents">
                    <dt className="font-semibold"><Tex tex={s} /></dt>
                    <dd className="text-ink-2"><Rich text={m} /></dd>
                  </div>
                ))}
              </dl>
            )}
          </Block>
        )}

        {c.example && (
          <Block id="example" n={idx('example')} name="Worked example" onSeen={onSeen}>
            <WorkedExample c={c} />
          </Block>
        )}

        {(c.real || c.used) && (
          <Block id="real" n={idx('real')} name="On the job" onSeen={onSeen}>
            {c.real && (
              <div className="measure">
                <p className="label">{c.real.where}</p>
                <p className="mt-1"><Rich text={c.real.story} /></p>
              </div>
            )}
            {c.used && (
              <dl className="mt-4 grid gap-3 sm:grid-cols-3">
                {c.used.ind && <div><dt className="label">Industries</dt><dd>{c.used.ind.join(', ')}</dd></div>}
                {c.used.roles && <div><dt className="label">Who uses it</dt><dd>{c.used.roles.join(', ')}</dd></div>}
                {c.used.tools && <div><dt className="label">Tools</dt><dd>{c.used.tools.join(', ')}</dd></div>}
              </dl>
            )}
            {c.mistakes && (
              <div className="mt-5">
                <p className="label">Common mistakes</p>
                <ul className="measure mt-1 list-disc space-y-1 pl-5">{c.mistakes.map((m) => <li key={m}><Rich text={m} /></li>)}</ul>
              </div>
            )}
            {c.cert && <p className="mt-4 text-sm text-ink-2">Shows up in: {c.cert.join(', ')}</p>}
          </Block>
        )}

        <Block id="try" n={idx('try')} name="Check yourself" onSeen={onSeen}>
          {question && <QuestionCard key={qSeed} item={question} onDone={() => setQSeed((s) => s + 1)} />}
          {sim && (
            <p className="mt-4">
              Hands-on: <Link className="font-semibold underline" to={`/lab/${sim.id}`}>{sim.name}</Link> — {sim.blurb}
            </p>
          )}
        </Block>

        {c.iq?.length ? (
          <Block id="interview" n={idx('interview')} name="Interview" onSeen={onSeen}>
            <div className="space-y-2">
              {c.iq.map((q) => (
                <details key={q.q} className="group rounded-md border border-line px-4 py-3">
                  <summary className="cursor-pointer font-medium marker:text-ink-2">
                    {q.q} {q.type && <span className="chip ml-2 align-middle">{q.type}</span>}
                  </summary>
                  <p className="measure mt-2 text-[0.97rem]"><Rich text={q.a} /></p>
                </details>
              ))}
            </div>
            <p className="mt-3 text-sm text-ink-2">Say your answer out loud before opening the model answer. More in <Link className="underline" to="/interview">Interview prep</Link>.</p>
          </Block>
        ) : null}

        <Block id="teach" n={idx('teach')} name="Teach it back" onSeen={onSeen}>
          <p className="measure text-[0.97rem] text-ink-2">Explain {c.term} in your own words as if to a new operator. If you can't explain it simply, go back one layer.</p>
          <textarea className="input mt-3 min-h-32" value={teach} onChange={(e) => setTeach(c.id, e.target.value)} placeholder={`${c.term} is…`} aria-label="Your explanation" />
          <div className="mt-2 flex flex-wrap gap-2 text-sm">
            <span className="text-ink-2">Did you mention:</span>
            {kws.map((k) => (
              <span key={k} className={`chip ${teach.toLowerCase().includes(k) ? 'border-sgreen text-sgreen' : ''}`}>{k}</span>
            ))}
          </div>
        </Block>

        {near.length > 0 && (
          <div className="no-print mt-4 border-t border-line pt-6">
            <p className="label mb-2">Connected concepts</p>
            <div className="flex flex-wrap gap-2">
              {near.map((n) => (
                <Link key={n.id} to={`/c/${n.id}`} className="chip hover:border-ink">
                  <span className="inline-block h-2 w-3 rounded-sm" style={{ background: DOMAIN_MAP[n.domain].tape }} />
                  {n.term}{c.pre?.includes(n.id) ? ' (learn first)' : ''}
                </Link>
              ))}
            </div>
          </div>
        )}
        {c.verify && <p className="mt-6 text-xs text-ink-2">Some figures on this card vary by company or source — verify before quoting them.</p>}
      </article>
    </div>
  )
}
