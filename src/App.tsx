import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { CatalogoLaboratorios } from './pages/CatalogoLaboratorios'
import { DetalhesLaboratorio } from './pages/DetalhesLaboratorio'
import { SolicitacaoAgendamento } from './pages/SolicitacaoAgendamento'

function RotaDetalhesLaboratorio() {
  const { id } = useParams()

  if (!id || !/^\d+$/.test(id)) return <Navigate to="/" replace />

  return <DetalhesLaboratorio id={id} />
}

function RotaSolicitacaoAgendamento() {
  const { id } = useParams()

  if (!id || !/^\d+$/.test(id)) return <Navigate to="/" replace />

  return <SolicitacaoAgendamento id={id} />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<CatalogoLaboratorios />} />
      <Route path="/laboratorios/:id" element={<RotaDetalhesLaboratorio />} />
      <Route path="/laboratorios/:id/agendamento" element={<RotaSolicitacaoAgendamento />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
