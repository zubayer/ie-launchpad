import type { Concept, DomainId } from '../types'

// Search hints keep web lookups on-topic ("Etching" alone finds the art technique).
export const DOMAIN_HINT: Record<DomainId, string> = {
  stats: 'statistics', quality: 'quality control', doe: 'design of experiments', or: 'operations research',
  simulation: 'simulation', datasci: 'machine learning', manufacturing: 'manufacturing', lean: 'lean manufacturing',
  semiconductor: 'semiconductor fabrication', automation: 'industrial automation', systems: 'systems engineering',
  safety: 'safety engineering', reliability: 'reliability engineering', pm: 'project management', scm: 'supply chain',
  engecon: 'engineering economics', work: 'work measurement', ergo: 'ergonomics', facilities: 'facility layout',
  service: 'operations management', sustain: 'sustainability', career: 'engineering career',
}

// Exact Wikipedia titles where search alone tends to pick the wrong article.
export const WIKI_TITLE: Record<string, string> = {
  'stats.mean-median': 'Central tendency', 'stats.std-dev': 'Standard deviation', 'stats.boxplot-iqr': 'Box plot',
  'stats.normal': 'Normal distribution', 'stats.clt': 'Central limit theorem', 'stats.p-value': 'P-value', 'stats.t-test': "Student's t-test",
  'stats.type-errors': 'Type I and type II errors', 'stats.power': 'Power (statistics)', 'stats.regression': 'Linear regression',
  'stats.r-squared': 'Coefficient of determination', 'quality.control-chart': 'Control chart', 'quality.xbar-r': 'X-bar chart',
  'quality.we-rules': 'Western Electric rules', 'quality.cp': 'Process capability index', 'quality.cpk': 'Process capability index',
  'quality.ppk': 'Process performance index', 'quality.gage-rr': 'ANOVA gauge R&R', 'quality.six-sigma': 'Six Sigma', 'quality.dmaic': 'DMAIC',
  'quality.sipoc': 'SIPOC', 'quality.pareto': 'Pareto chart', 'quality.fishbone': 'Ishikawa diagram', 'quality.seven-tools': 'Seven basic tools of quality',
  'quality.aql': 'Acceptance sampling', 'quality.iso9001': 'ISO 9000', 'doe.basics': 'Design of experiments', 'doe.full-factorial': 'Factorial experiment',
  'doe.fractional-factorial': 'Fractional factorial design', 'doe.rsm': 'Response surface methodology', 'doe.ccd': 'Central composite design',
  'doe.box-behnken': 'Box–Behnken design', 'doe.taguchi': 'Taguchi methods', 'doe.plackett-burman': 'Plackett–Burman design',
  'or.lp': 'Linear programming', 'or.simplex': 'Simplex algorithm', 'or.ip': 'Integer programming', 'or.branch-bound': 'Branch and bound',
  'or.transportation': 'Transportation theory (mathematics)', 'or.assignment': 'Assignment problem', 'or.tsp': 'Travelling salesman problem',
  'or.vrp': 'Vehicle routing problem', 'or.knapsack': 'Knapsack problem', 'or.mm1': 'M/M/1 queue', 'or.mmc': 'M/M/c queue',
  'or.kendall': "Kendall's notation", 'or.eoq': 'Economic order quantity', 'or.newsvendor': 'Newsvendor model', 'or.markov': 'Markov chain',
  'or.gurobi': 'Gurobi Optimizer', 'or.or-tools': 'OR-Tools', 'simulation.des': 'Discrete-event simulation', 'simulation.monte-carlo': 'Monte Carlo method',
  'simulation.digital-twin': 'Digital twin', 'datasci.random-forest': 'Random forest', 'datasci.kmeans': 'K-means clustering',
  'datasci.knn': 'K-nearest neighbors algorithm', 'datasci.pca': 'Principal component analysis', 'datasci.svm': 'Support vector machine',
  'datasci.decision-tree': 'Decision tree learning', 'datasci.gradient-boosting': 'Gradient boosting', 'datasci.confusion-matrix': 'Confusion matrix',
  'datasci.roc-auc': 'Receiver operating characteristic', 'datasci.overfitting': 'Overfitting', 'datasci.sql': 'SQL', 'datasci.pandas': 'Pandas (software)',
  'manufacturing.machining': 'Machining', 'manufacturing.casting': 'Casting (metalworking)', 'manufacturing.mrp': 'Material requirements planning',
  'manufacturing.erp': 'Enterprise resource planning', 'manufacturing.mes': 'Manufacturing execution system', 'manufacturing.gdt': 'Geometric dimensioning and tolerancing',
  'manufacturing.cmm': 'Coordinate-measuring machine', 'manufacturing.ppap': 'Production part approval process', 'manufacturing.apqp': 'Advanced product quality planning',
  'lean.tps': 'Toyota Production System', 'lean.eight-wastes': 'Muda (Japanese term)', 'lean.vsm': 'Value-stream mapping', 'lean.five-s': '5S (methodology)',
  'lean.kanban': 'Kanban', 'lean.smed': 'Single-minute exchange of die', 'lean.poka-yoke': 'Poka-yoke', 'lean.toc': 'Theory of constraints',
  'lean.oee': 'Overall equipment effectiveness', 'lean.littles-law': "Little's law", 'lean.takt-time': 'Takt time', 'lean.heijunka': 'Heijunka',
  'lean.jidoka': 'Autonomation', 'lean.a3': 'A3 problem solving', 'lean.five-whys': 'Five whys', 'lean.pdca': 'PDCA', 'lean.gemba': 'Gemba',
  'lean.andon': 'Andon (manufacturing)', 'lean.cellular': 'Cellular manufacturing',
  'semiconductor.photolithography': 'Photolithography', 'semiconductor.etching': 'Etching (microfabrication)', 'semiconductor.dry-etch': 'Reactive-ion etching',
  'semiconductor.wet-etch': 'Etching (microfabrication)', 'semiconductor.cvd': 'Chemical vapor deposition', 'semiconductor.ald': 'Atomic layer deposition',
  'semiconductor.pvd': 'Sputter deposition', 'semiconductor.cmp': 'Chemical-mechanical polishing', 'semiconductor.ion-implantation': 'Ion implantation',
  'semiconductor.euv': 'Extreme ultraviolet lithography', 'semiconductor.wafer': 'Wafer (electronics)', 'semiconductor.cleanroom': 'Cleanroom',
  'semiconductor.czochralski': 'Czochralski method', 'semiconductor.yield': 'Semiconductor device fabrication', 'semiconductor.cd': 'Critical dimension',
  'semiconductor.damascene': 'Damascene process', 'semiconductor.oxidation': 'Thermal oxidation', 'semiconductor.epitaxy': 'Epitaxy',
  'semiconductor.photoresist': 'Photoresist', 'semiconductor.packaging': 'Integrated circuit packaging', 'semiconductor.advanced-packaging': 'Chiplet',
  'automation.plc': 'Programmable logic controller', 'automation.ladder-logic': 'Ladder logic', 'automation.scada': 'SCADA',
  'automation.gcode': 'G-code', 'automation.cnc': 'Numerical control', 'automation.solidworks': 'SolidWorks', 'automation.fea': 'Finite element method',
  'automation.hmi': 'User interface', 'automation.vfd': 'Variable-frequency drive', 'automation.cobot': 'Cobot', 'automation.robotics': 'Industrial robot',
  'automation.machine-vision': 'Machine vision', 'automation.opc-ua': 'OPC Unified Architecture', 'automation.industry40': 'Fourth Industrial Revolution',
  'systems.v-model': 'V-model', 'systems.mbse': 'Model-based systems engineering', 'systems.sysml': 'Systems modeling language',
  'systems.trl': 'Technology readiness level', 'systems.pugh': 'Decision-matrix method', 'systems.traceability': 'Requirements traceability',
  'safety.fmea': 'Failure mode and effects analysis', 'safety.fta': 'Fault tree analysis', 'safety.eta': 'Event tree analysis', 'safety.bowtie': 'Bow-tie diagram',
  'safety.hazop': 'Hazard and operability study', 'safety.lopa': 'Layers of protection analysis', 'safety.sil': 'Safety integrity level',
  'safety.alarp': 'ALARP', 'safety.hierarchy-controls': 'Hierarchy of hazard controls', 'safety.swiss-cheese': 'Swiss cheese model',
  'safety.loto': 'Lockout–tagout', 'safety.psm': 'Process safety management', 'safety.iso26262': 'ISO 26262', 'safety.stpa': 'STAMP (accident model)',
  'safety.risk-matrix': 'Risk matrix', 'safety.eight-d': 'Eight disciplines problem solving', 'safety.rca': 'Root cause analysis',
  'safety.cmf': 'Crash modification factor', 'reliability.weibull': 'Weibull distribution', 'reliability.bathtub': 'Bathtub curve',
  'reliability.mtbf': 'Mean time between failures', 'reliability.rbd': 'Reliability block diagram', 'reliability.tpm': 'Total productive maintenance',
  'reliability.rcm': 'Reliability-centered maintenance', 'reliability.pdm': 'Predictive maintenance', 'pm.cpm': 'Critical path method',
  'pm.pert': 'Program evaluation and review technique', 'pm.evm': 'Earned value management', 'pm.wbs': 'Work breakdown structure', 'pm.gantt': 'Gantt chart',
  'pm.raci': 'Responsibility assignment matrix', 'pm.scrum': 'Scrum (software development)', 'pm.triple-constraint': 'Project management triangle',
  'scm.bullwhip': 'Bullwhip effect', 'scm.scor': 'Supply chain operations reference', 'scm.safety-stock': 'Safety stock', 'scm.reorder-point': 'Reorder point',
  'scm.abc': 'ABC analysis', 'scm.vmi': 'Vendor-managed inventory', 'scm.cross-docking': 'Cross-docking', 'scm.incoterms': 'Incoterms',
  'scm.tco': 'Total cost of ownership', 'scm.sop': 'Sales and operations planning', 'scm.wms': 'Warehouse management system',
  'engecon.npv': 'Net present value', 'engecon.irr': 'Internal rate of return', 'engecon.tvm': 'Time value of money', 'engecon.macrs': 'MACRS',
  'engecon.payback': 'Payback period', 'engecon.break-even': 'Break-even (economics)', 'engecon.marr': 'Minimum acceptable rate of return',
  'work.time-study': 'Time and motion study', 'work.learning-curve': 'Experience curve effects', 'work.pmts': 'Methods-time measurement',
  'work.work-sampling': 'Work sampling', 'ergo.niosh': 'NIOSH lifting equation', 'ergo.anthropometry': 'Anthropometry', 'ergo.fitts': "Fitts's law",
  'ergo.hick': "Hick's law", 'ergo.hfacs': 'Human Factors Analysis and Classification System', 'ergo.rula-reba': 'Rapid upper limb assessment',
  'facilities.slp': 'Systematic layout planning', 'facilities.asrs': 'Automated storage and retrieval system', 'facilities.agv-amr': 'Automated guided vehicle',
  'service.pue': 'Power usage effectiveness', 'service.data-center-tier': 'Data center', 'sustain.lca': 'Life-cycle assessment', 'sustain.circular-economy': 'Circular economy',
  'sustain.iso14001': 'ISO 14000 series', 'career.star': 'Situation, task, action, result', 'career.fe-exam': 'Fundamentals of Engineering exam',
}

const q = (s: string) => encodeURIComponent(s)
export const searchName = (c: Concept) => (c.full && c.full.length < 60 ? `${c.term} ${c.full}` : c.term).replace(/[()]/g, '')

export const links = (c: Concept) => {
  const name = searchName(c)
  const hint = DOMAIN_HINT[c.domain]
  return {
    wikipedia: WIKI_TITLE[c.id]
      ? `https://en.wikipedia.org/wiki/${q(WIKI_TITLE[c.id].replace(/ /g, '_'))}`
      : `https://en.wikipedia.org/w/index.php?search=${q(`${c.full || c.term} ${hint}`)}`,
    google: `https://www.google.com/search?q=${q(`${name} ${hint}`)}`,
    images: `https://www.google.com/search?tbm=isch&q=${q(`${name} ${hint} diagram`)}`,
    youtube: `https://www.youtube.com/results?search_query=${q(`${name} explained`)}`,
    scholar: `https://scholar.google.com/scholar?q=${q(name)}`,
  }
}
export const googleUrl = (s: string) => `https://www.google.com/search?q=${q(s)}`
export const wikiSearchUrl = (s: string) => `https://en.wikipedia.org/w/index.php?search=${q(s)}`

export interface WikiSummary { title: string; extract: string; url: string; thumb?: string; desc?: string }

const CACHE_KEY = 'ie-wiki-cache-v1'
const mem: Record<string, WikiSummary | null> = (() => {
  try { return JSON.parse(sessionStorage.getItem(CACHE_KEY) || '{}') } catch { return {} }
})()
const save = () => { try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(mem)) } catch { /* storage full or blocked */ } }

async function summary(title: string): Promise<WikiSummary | null> {
  const r = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${q(title.replace(/ /g, '_'))}`)
  if (!r.ok) return null
  const j = await r.json()
  if (j.type === 'disambiguation' || !j.extract) return null
  return { title: j.title, extract: j.extract, url: j.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${q(j.title)}`, thumb: j.thumbnail?.source, desc: j.description }
}

async function searchTitle(query: string): Promise<string | null> {
  const r = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${q(query)}&srlimit=1&format=json&origin=*`)
  if (!r.ok) return null
  const j = await r.json()
  return j?.query?.search?.[0]?.title ?? null
}

/** Wikipedia summary (with lead image) for a title or free-text query. Runs in the learner's browser. */
export async function wiki(opts: { title?: string; query?: string }): Promise<WikiSummary | null> {
  const key = opts.title ? `t:${opts.title}` : `q:${opts.query}`
  if (key in mem) return mem[key]
  let out: WikiSummary | null = null
  try {
    if (opts.title) out = await summary(opts.title)
    if (!out && (opts.query || opts.title)) {
      const t = await searchTitle(opts.query || opts.title!)
      if (t) out = await summary(t)
    }
  } catch { out = null }
  mem[key] = out
  save()
  return out
}

export const wikiFor = (c: Concept) => wiki(WIKI_TITLE[c.id] ? { title: WIKI_TITLE[c.id] } : { query: `${c.full || c.term} ${DOMAIN_HINT[c.domain]}` })
