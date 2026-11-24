import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { LanguageProvider } from './i18n/LanguageContext'
import Calculator from './pages/Calculator'
import Formulas from './pages/Formulas'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Notes from './pages/Notes'
import PeriodicTable from './pages/PeriodicTable'
import Units from './pages/Units'

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
