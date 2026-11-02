import { Link } from 'react-router-dom'
import { Cabecalho } from '../components/Cabecalho'
import { detalhesLaboratoriosDemonstrativos } from '../data/detalhesLaboratorios'
import { laboratoriosFicticios } from '../data/laboratorios'

interface DetalhesLaboratorioProps {
  id: string
}

export function DetalhesLaboratorio({ id }: DetalhesLaboratorioProps) {
  const laboratorio = laboratoriosFicticios.find((item) => String(item.id) === id)
  const detalhes = laboratorio ? detalhesLaboratoriosDemonstrativos[laboratorio.id] : undefined

  return (
    <>
      <Cabecalho />
      <main className={'page-shell ' + (laboratorio ? 'detail-page' : 'placeholder-page')}>
        <p className="breadcrumb">
          <Link to="/">Laboratórios</Link><span aria-hidden="true">/</span><span>{laboratorio?.nome ?? 'Laboratório não encontrado'}</span>
        </p>
        {laboratorio ? (
          <>
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
          {detalhes && (
            <div className="detail-info-layout">
              <div className="detail-info-main">
                <section className="detail-card" aria-labelledby="detail-about-title">
                  <h2 id="detail-about-title">Sobre o laboratório</h2>
                  <p>{detalhes.descricao}</p>
                  <p className="detail-card__note">Descrição demonstrativa, não oficial.</p>
                </section>

                <section className="detail-card detail-rules" aria-labelledby="detail-rules-title">
                  <div className="detail-rules__heading">
                    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                      <path d="M12 3 20 6v5c0 5.1-3.4 8.4-8 10-4.6-1.6-8-4.9-8-10V6l8-3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                      <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <h2 id="detail-rules-title">Regras de uso</h2>
                  </div>
                  <p className="detail-card__note">Orientações ilustrativas, ainda não validadas institucionalmente.</p>
                  <ul className="detail-rules__list">
                    {detalhes.regrasDeUso.map((regra) => <li key={regra}>{regra}</li>)}
                  </ul>
                </section>
              </div>
            </div>
          )}
          </>
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
