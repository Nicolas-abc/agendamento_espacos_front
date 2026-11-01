export function Cabecalho() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a className="brand" href="/" aria-label="LabAgenda — início">
          <span className="brand__mark" aria-hidden="true">L</span>
          <span className="brand__name">LabAgenda</span>
        </a>
        <nav className="site-nav" aria-label="Navegação principal">
          <a className="site-nav__link site-nav__link--active" href="/" aria-current="page">
            Laboratórios
          </a>
          <span className="site-nav__link">Meus agendamentos</span>
          <span className="user-avatar" aria-label="Perfil de usuário" title="Perfil">UE</span>
        </nav>
      </div>
    </header>
  )
}
