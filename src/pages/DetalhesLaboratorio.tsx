import { Cabecalho } from '../components/Cabecalho'

interface DetalhesLaboratorioProps {
  id: string
}

export function DetalhesLaboratorio({ id }: DetalhesLaboratorioProps) {
  return (
    <>
      <Cabecalho />
      <main className="page-shell placeholder-page">
        <p className="breadcrumb">
          <a href="/">Laboratórios</a><span aria-hidden="true">/</span><span>Detalhes do laboratório</span>
        </p>
        <section className="placeholder-card">
          <p className="placeholder-card__eyebrow">Laboratório {id}</p>
          <h1>Detalhes do laboratório</h1>
          <p>Esta página está em desenvolvimento.</p>
          <a className="button button--primary" href="/">Voltar ao catálogo</a>
        </section>
      </main>
    </>
  )
}
