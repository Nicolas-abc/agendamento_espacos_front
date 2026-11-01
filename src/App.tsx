import { CatalogoLaboratorios } from './pages/CatalogoLaboratorios'
import { DetalhesLaboratorio } from './pages/DetalhesLaboratorio'

function App() {
  const rotaDetalhes = window.location.pathname.match(/^\/laboratorios\/(\d+)\/?$/)
  if (rotaDetalhes) return <DetalhesLaboratorio id={rotaDetalhes[1]} />
  return <CatalogoLaboratorios />
}

export default App
