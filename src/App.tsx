import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ComingSoon from './components/ComingSoon'
import Layout from './components/Layout'
import { LanguageProvider, useLanguage } from './i18n/LanguageContext'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

function AppRoutes() {
  const { t } = useLanguage()
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="calculator" element={<ComingSoon title={t.nav.calculator} />} />
        <Route path="notes" element={<ComingSoon title={t.nav.notes} />} />
        <Route path="formulas" element={<ComingSoon title={t.nav.formulas} />} />
        <Route path="units" element={<ComingSoon title={t.nav.units} />} />
        <Route path="periodic-table" element={<ComingSoon title={t.nav.periodicTable} />} />
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
