import { Link } from 'react-router-dom'
import { Cabecalho } from '../components/Cabecalho'
import { laboratoriosFicticios } from '../data/laboratorios'

interface SolicitacaoAgendamentoProps {
  id: string
}

export function SolicitacaoAgendamento({ id }: SolicitacaoAgendamentoProps) {
  const laboratorio = laboratoriosFicticios.find((item) => String(item.id) === id)

  return (
    <>
      <Cabecalho />
      <main className="page-shell detail-page">
        {laboratorio ? (
          <>
            <p className="breadcrumb">
              <Link to="/">Laboratórios</Link>
              <span aria-hidden="true">/</span>
              <Link to={`/laboratorios/${laboratorio.id}`}>{laboratorio.nome}</Link>
              <span aria-hidden="true">/</span>
              <span>Solicitar agendamento</span>
            </p>
            <section className="placeholder-card">
              <p className="placeholder-card__eyebrow">Solicitação de agendamento</p>
              <h1>Solicitar agendamento</h1>
              <p>Laboratório selecionado: <strong>{laboratorio.nome}</strong></p>
              <p>O formulário de solicitação será disponibilizado em uma etapa futura.</p>
              <Link className="button button--primary" to={`/laboratorios/${laboratorio.id}`}>
                Voltar aos detalhes do laboratório
              </Link>
            </section>
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
