import { Fragment, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { CONCEPTS, CONCEPT_MAP } from '../content'
import { DOMAIN_MAP } from '../content/domains'
import { googleUrl, links, wiki, wikiSearchUrl, type WikiSummary } from '../lib/web'
import { search } from '../lib/search'
import { Tex } from './ui'

/* ---------- Term index: which words in prose link to a concept card ---------- */
const SKIP = new Set(['career.ethics', 'career.resume', 'pm.scope', 'manufacturing.routing'])
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const INDEX = (() => {
  const map = new Map<string, string>() // lowercased pattern -> id (acronyms keep case)
  const acr = new Map<string, string>()
  for (const c of CONCEPTS) {
    if (SKIP.has(c.id)) continue
    const base = c.term.replace(/\s*\(.*?\)\s*/g, ' ').trim()
    const names = [base, c.full, ...(c.aka || []).filter((a) => /^[A-Z][A-Za-z0-9&/-]{1,7}$/.test(a) && /[A-Z].*[A-Z]/.test(a))]
    for (const n of names) {
      if (!n || n.length < 3 || /[,]/.test(n)) continue
      if (/^[A-Z0-9&/-]{2,8}$/.test(n)) { if (!acr.has(n)) acr.set(n, c.id) }
      else if (!map.has(n.toLowerCase())) map.set(n.toLowerCase(), c.id)
    }
  }
  return { map, acr }
})()

const RE_WORDS = new RegExp(`(?<![A-Za-z0-9])(${[...INDEX.map.keys()].sort((a, b) => b.length - a.length).map(esc).join('|')})(?![A-Za-z0-9])`, 'gi')
const RE_ACR = new RegExp(`(?<![A-Za-z0-9])(${[...INDEX.acr.keys()].sort((a, b) => b.length - a.length).map(esc).join('|')})(?![A-Za-z0-9])`, 'g')

function findTerms(text: string) {
  const hits: { start: number; end: number; id: string }[] = []
  for (const m of text.matchAll(RE_ACR)) hits.push({ start: m.index!, end: m.index! + m[0].length, id: INDEX.acr.get(m[0])! })
  for (const m of text.matchAll(RE_WORDS)) hits.push({ start: m.index!, end: m.index! + m[0].length, id: INDEX.map.get(m[0].toLowerCase())! })
  hits.sort((a, b) => a.start - b.start || b.end - b.start - (a.end - a.start))
  const out: typeof hits = []
  let last = -1
  for (const h of hits) if (h.start >= last) { out.push(h); last = h.end }
  return out
}

/* ---------- Popover shown on hover / focus / tap ---------- */
function TermLink({ id, children }: { id: string; children: ReactNode }) {
  const c = CONCEPT_MAP[id]
  const [open, setOpen] = useState(false)
  const t = useRef<number | null>(null)
  const show = () => { if (t.current) clearTimeout(t.current); setOpen(true) }
  const hide = () => { t.current = window.setTimeout(() => setOpen(false), 150) }
  const L = links(c)
  return (
    <span className="relative inline" onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
      <Link to={`/c/${id}`} className="term-link" onClick={(e) => { if (window.matchMedia('(hover: none)').matches && !open) { e.preventDefault(); setOpen(true) } }}>{children}</Link>
      {open && (
        <span role="tooltip" className="term-pop not-italic" onMouseEnter={show} onMouseLeave={hide}>
          <span className="mb-1 flex items-center gap-2 text-xs text-ink-2">
            <span className="inline-block h-2 w-4 rounded-sm" style={{ background: DOMAIN_MAP[c.domain].tape }} />{DOMAIN_MAP[c.domain].name}
          </span>
          <span className="block font-semibold text-ink">{c.term}{c.full && c.full !== c.term ? ` — ${c.full}` : ''}</span>
          <span className="mt-1 block text-[0.9rem] leading-snug text-ink">{c.one}</span>
          {c.formula && <span className="mt-1 block overflow-x-auto text-sm"><Tex tex={c.formula.tex} /></span>}
          <span className="mt-2 flex flex-wrap gap-1.5">
            <Link to={`/c/${id}`} className="pop-btn">Open card</Link>
            <a href={L.wikipedia} target="_blank" rel="noopener noreferrer" className="pop-btn">Wikipedia ↗</a>
            <a href={L.google} target="_blank" rel="noopener noreferrer" className="pop-btn">Google ↗</a>
          </span>
        </span>
      )}
    </span>
  )
}

/** Prose renderer: $inline math$, plus core terms auto-linked with hover cards. */
export function Linked({ text, self, max = 8 }: { text: string; self?: string; max?: number }) {
  const parts = useMemo(() => text.split(/(\$[^$]+\$)/g), [text])
  let used = 0
  const seen = new Set<string>()
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith('$') && p.endsWith('$') && p.length > 2) return <Tex key={i} tex={p.slice(1, -1)} />
        const hits = findTerms(p).filter((h) => h.id !== self && !seen.has(h.id))
        const nodes: ReactNode[] = []
        let pos = 0
        for (const h of hits) {
          if (used >= max || seen.has(h.id)) continue
          seen.add(h.id)
          used++
          nodes.push(p.slice(pos, h.start))
          nodes.push(<TermLink key={`${i}-${h.start}`} id={h.id}>{p.slice(h.start, h.end)}</TermLink>)
          pos = h.end
        }
        nodes.push(p.slice(pos))
        return <Fragment key={i}>{nodes}</Fragment>
      })}
    </>
  )
}

/* ---------- Web answer card (Wikipedia summary with lead image) ---------- */
export function WikiCard({ data, loading, query, compact = false }: { data: WikiSummary | null; loading: boolean; query: string; compact?: boolean }) {
  if (loading) return <p className="text-sm text-ink-2">Looking it up on Wikipedia…</p>
  if (!data) return (
    <p className="text-sm text-ink-2">No Wikipedia summary found for “{query}”. <a className="underline" href={googleUrl(query)} target="_blank" rel="noopener noreferrer">Search Google ↗</a></p>
  )
  return (
    <div className={`flex gap-3 ${compact ? 'flex-col' : 'flex-col sm:flex-row'}`}>
      {data.thumb && <img src={data.thumb} alt={data.title} loading="lazy" className={`${compact ? 'max-h-36 self-start' : 'max-h-56 sm:w-56'} rounded-md border border-line bg-white object-contain`} />}
      <div className="min-w-0">
        <p className="font-semibold">{data.title}{data.desc && <span className="font-normal text-ink-2"> — {data.desc}</span>}</p>
        <p className={`mt-1 text-[0.95rem] ${compact ? 'line-clamp-5' : ''}`}>{data.extract}</p>
        <p className="mt-2 text-xs text-ink-2">Source: Wikipedia (CC BY-SA). <a className="underline" href={data.url} target="_blank" rel="noopener noreferrer">Read the full article ↗</a></p>
      </div>
    </div>
  )
}

export function useWiki(fn: () => Promise<WikiSummary | null>, deps: unknown[]) {
  const [data, setData] = useState<WikiSummary | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let live = true
    setLoading(true)
    fn().then((d) => { if (live) { setData(d); setLoading(false) } })
    return () => { live = false }
  }, deps) // eslint-disable-line
  return { data, loading }
}

/* ---------- Select any word or phrase to look it up ---------- */
export function SelectionLookup() {
  const [sel, setSel] = useState<{ text: string; x: number; y: number } | null>(null)
  const [card, setCard] = useState<{ text: string; x: number; y: number } | null>(null)
  const [data, setData] = useState<WikiSummary | null>(null)
  const [loading, setLoading] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const onUp = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement
      if (boxRef.current?.contains(target)) return
      setTimeout(() => {
        const s = window.getSelection()
        const text = s?.toString().replace(/\s+/g, ' ').trim() || ''
        if (!s || !text || text.length < 2 || text.length > 60 || target.closest('input,textarea,select,button,a,svg')) { setSel(null); return }
        const r = s.getRangeAt(0).getBoundingClientRect()
        setSel({ text, x: r.left + r.width / 2 + window.scrollX, y: r.bottom + window.scrollY })
      }, 10)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setSel(null); setCard(null) } }
    const onDown = (e: MouseEvent) => { if (!boxRef.current?.contains(e.target as Node)) setCard(null) }
    document.addEventListener('mouseup', onUp)
    document.addEventListener('touchend', onUp)
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onDown)
    return () => { document.removeEventListener('mouseup', onUp); document.removeEventListener('touchend', onUp); document.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onDown) }
  }, [])
  const look = () => {
    if (!sel) return
    setCard(sel); setSel(null); setLoading(true); setData(null)
    wiki({ query: sel.text }).then((d) => { setData(d); setLoading(false) })
  }
  const local = card ? search(card.text, 1)[0] : undefined
  const left = (x: number, w: number) => Math.max(8, Math.min(x - w / 2, window.innerWidth - w - 8))
  return (
    <div ref={boxRef}>
      {sel && (
        <button onMouseDown={(e) => e.preventDefault()} onClick={look} className="no-print absolute z-50 rounded-full border border-sblue bg-sblue px-3 py-1 text-sm font-semibold text-white shadow-lg"
          style={{ left: left(sel.x, 160), top: sel.y + 6 }}>
          Look up “{sel.text.length > 18 ? sel.text.slice(0, 18) + '…' : sel.text}”
        </button>
      )}
      {card && (
        <div role="dialog" aria-label={`Lookup: ${card.text}`} className="no-print absolute z-50 w-[22rem] max-w-[calc(100vw-16px)] rounded-lg border border-line bg-sheet p-4 shadow-2xl"
          style={{ left: left(card.x, 352), top: card.y + 8 }}>
          {local && (
            <Link to={`/c/${local.id}`} onClick={() => setCard(null)} className="mb-3 block rounded-md border border-sblue/40 bg-sblue/5 px-3 py-2 text-sm hover:border-sblue">
              In IE Launchpad: <strong>{local.term}</strong> — {local.one}
            </Link>
          )}
          <WikiCard data={data} loading={loading} query={card.text} compact />
          <div className="mt-3 flex flex-wrap gap-1.5">
            <a className="pop-btn" href={googleUrl(card.text)} target="_blank" rel="noopener noreferrer">Google ↗</a>
            <a className="pop-btn" href={wikiSearchUrl(card.text)} target="_blank" rel="noopener noreferrer">Wikipedia ↗</a>
            <a className="pop-btn" href={`https://www.youtube.com/results?search_query=${encodeURIComponent(card.text + ' explained')}`} target="_blank" rel="noopener noreferrer">YouTube ↗</a>
            <button className="pop-btn" onClick={() => setCard(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}
