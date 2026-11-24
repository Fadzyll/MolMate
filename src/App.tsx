import { lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { LanguageProvider } from './i18n/LanguageContext'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

// Pages other than Home load on demand, so the first visit downloads less.
const Calculator = lazy(() => import('./pages/Calculator'))
const Notes = lazy(() => import('./pages/Notes'))
const Formulas = lazy(() => import('./pages/Formulas'))
const Units = lazy(() => import('./pages/Units'))
const PeriodicTable = lazy(() => import('./pages/PeriodicTable'))

function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="calculator" element={<Calculator />} />
        <Route path="notes" element={<Notes />} />
        <Route path="formulas" element={<Formulas />} />
        <Route path="units" element={<Units />} />
        <Route path="periodic-table" element={<PeriodicTable />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </LanguageProvider>
  )
}
