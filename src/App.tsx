import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ComingSoon from './components/ComingSoon'
import Layout from './components/Layout'
import { LanguageProvider } from './i18n/LanguageContext'
import { useLanguage } from './i18n/useLanguage'
import Calculator from './pages/Calculator'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import PeriodicTable from './pages/PeriodicTable'

function AppRoutes() {
  const { t } = useLanguage()
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="calculator" element={<Calculator />} />
        <Route path="notes" element={<ComingSoon title={t.nav.notes} />} />
        <Route path="formulas" element={<ComingSoon title={t.nav.formulas} />} />
        <Route path="units" element={<ComingSoon title={t.nav.units} />} />
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
