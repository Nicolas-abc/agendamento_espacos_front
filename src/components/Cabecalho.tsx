import { Link } from 'react-router-dom'

export function Cabecalho() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="brand" to="/" aria-label="LabAgenda — início">
          <span className="brand__mark" aria-hidden="true">L</span>
          <span className="brand__name">LabAgenda</span>
        </Link>
        <nav className="site-nav" aria-label="Navegação principal">
          <Link className="site-nav__link site-nav__link--active" to="/" aria-current="page">
            Laboratórios
          </Link>
          <span className="site-nav__link">Meus agendamentos</span>
          <span className="user-avatar" aria-label="Perfil de usuário" title="Perfil">UE</span>
        </nav>
      </div>
    </header>
  )
}
