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
      <main className={'page-shell ' + (laboratorio ? 'detail-page' : 'placeholder-page')}>
        <p className="breadcrumb">
          <Link to="/">Laboratórios</Link><span aria-hidden="true">/</span><span>{laboratorio?.nome ?? 'Laboratório não encontrado'}</span>
        </p>
        {laboratorio ? (
          <section className="detail-hero" aria-labelledby="detail-lab-title">
            <div className="detail-hero__content">
              <span className={'availability-pill ' + (laboratorio.disponivel ? 'availability-pill--open' : 'availability-pill--closed')}>
                <span className="availability-pill__dot" aria-hidden="true" />
                {laboratorio.disponivel ? 'Disponível para agendamento' : 'Indisponível no momento'}
              </span>
              <h1 id="detail-lab-title">{laboratorio.nome}</h1>
              <p className="detail-hero__summary">{laboratorio.resumo}</p>

              <div className="detail-hero__facts">
                <div className="detail-hero__fact">
                  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                    <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" stroke="currentColor" strokeWidth="1.8" />
                    <circle cx="12" cy="10" r="2.3" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                  <span>
                    <span className="detail-hero__fact-label">Localização</span>
                    <strong>{laboratorio.bloco} · {laboratorio.sala}</strong>
                  </span>
                </div>

                <div className="detail-hero__fact">
                  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                    <circle cx="9" cy="7" r="3" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M3 20v-1a6 6 0 0 1 12 0v1m2-10a3 3 0 1 0 0-6m1 9a5 5 0 0 1 3 4.6v1.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                  <span>
                    <span className="detail-hero__fact-label">Capacidade</span>
                    <strong>{laboratorio.capacidade} pessoas</strong>
                  </span>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="placeholder-card">
            <p className="placeholder-card__eyebrow">ID {id}</p>
            <h1>Laboratório não encontrado</h1>
            <p>Não foi possível encontrar um laboratório com o ID {id}.</p>
            <Link className="button button--primary" to="/">Voltar ao catálogo</Link>
          </section>
        )}
      </main>
    </>
  )
}
