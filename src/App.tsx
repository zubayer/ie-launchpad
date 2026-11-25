import { HashRouter, Route, Routes, Link } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import ConceptPage from './pages/ConceptPage'
import { CheatSheet, Directory, DomainPage, Domains } from './pages/Browse'
import { Practice, Review } from './pages/Study'
import { Lab, LabPage } from './pages/Lab'
import { Interview, RolePage, Roles } from './pages/Career'
import { Graph, Method, Plan, Progress } from './pages/Misc'

function NotFound() {
  return (
    <div>
      <h1 className="display text-3xl">Page not found</h1>
      <p className="mt-2">That address doesn't match a page. <Link className="underline" to="/">Go to Today</Link> or press / to search.</p>
    </div>
  )
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="directory" element={<Directory />} />
          <Route path="domains" element={<Domains />} />
          <Route path="d/:id" element={<DomainPage />} />
          <Route path="d/:id/cheatsheet" element={<CheatSheet />} />
          <Route path="c/:id" element={<ConceptPage />} />
          <Route path="review" element={<Review />} />
          <Route path="practice" element={<Practice />} />
          <Route path="lab" element={<Lab />} />
          <Route path="lab/:id" element={<LabPage />} />
          <Route path="roles" element={<Roles />} />
          <Route path="roles/:id" element={<RolePage />} />
          <Route path="interview" element={<Interview />} />
          <Route path="plan" element={<Plan />} />
          <Route path="graph" element={<Graph />} />
          <Route path="progress" element={<Progress />} />
          <Route path="method" element={<Method />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
