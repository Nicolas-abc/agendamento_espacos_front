import { Link } from 'react-router-dom'
import { Cabecalho } from '../components/Cabecalho'
import { laboratoriosFicticios } from '../data/laboratorios'

interface DetalhesLaboratorioProps {
  id: string
}

export function DetalhesLaboratorio({ id }: DetalhesLaboratorioProps) {
  const laboratorio = laboratoriosFicticios.find((item) => String(item.id) === id)

  return (
    <>
      <Cabecalho />
      <main className="page-shell placeholder-page">
        <p className="breadcrumb">
          <Link to="/">Laboratórios</Link><span aria-hidden="true">/</span><span>{laboratorio?.nome ?? 'Laboratório não encontrado'}</span>
        </p>
        <section className="placeholder-card">
          <p className="placeholder-card__eyebrow">
            {laboratorio ? `Laboratório ${laboratorio.id}` : `ID ${id}`}
          </p>
          <h1>{laboratorio?.nome ?? 'Laboratório não encontrado'}</h1>
          <p>
            {laboratorio
              ? 'Esta página está em desenvolvimento.'
              : `Não foi possível encontrar um laboratório com o ID ${id}.`}
          </p>
          <Link className="button button--primary" to="/">Voltar ao catálogo</Link>
        </section>
      </main>
    </>
  )
}
