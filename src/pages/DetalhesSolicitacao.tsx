import { Link, useSearchParams } from 'react-router-dom'
import { Cabecalho } from '../components/Cabecalho'
import { duracaoMinutos } from '../data/horariosAgendamentoDemonstrativos'
import { laboratoriosFicticios } from '../data/laboratorios'
import { parametrosSelecao, parseData, selecaoDemonstrativaValida } from '../data/selecaoAgendamento'

export function DetalhesSolicitacao({ id }: { id: string }) {
  const [params] = useSearchParams()
  const lab = laboratoriosFicticios.find(item => String(item.id) === id)
  const valida = Boolean(lab && selecaoDemonstrativaValida(lab.id, params))
  const data = parseData(params.get('data'))
  const inicio = params.get('inicio') || ''
  const fim = params.get('fim') || ''
  const duracao = duracaoMinutos(inicio, fim)
  const calendario = `/laboratorios/${id}/agendamento${parametrosSelecao(params)}`

  return <>
    <Cabecalho />
    <main className="page-shell booking-page">
      <header className="booking-intro">
        <h1>Detalhes da solicitação</h1>
        <p>Confira a seleção demonstrativa de laboratório, data e horário.</p>
      </header>
      <p className="booking-notice" role="note">Datas e horários demonstrativos; não representam disponibilidade oficial nem confirmam reserva.</p>
      {!lab ? <section className="placeholder-card">
        <h2>Laboratório não encontrado</h2>
        <p>Não foi possível encontrar um laboratório com o ID {id}.</p>
        <Link className="button button--primary" to="/">Voltar ao catálogo</Link>
      </section> : !valida || !data ? <section className="booking-card booking-day-panel">
        <h2>Seleção ausente ou inválida</h2>
        <p className="booking-day-panel__hint">Retorne ao calendário para conferir a data e selecionar um intervalo demonstrativo livre.</p>
        <Link className="booking-back-link" to={calendario}>Voltar ao calendário</Link>
      </section> : <section className="booking-card booking-day-panel" aria-labelledby="selection-title">
        <h2 id="selection-title">Resumo demonstrativo</h2>
        <dl className="booking-details-summary">
          <div><dt>Laboratório</dt><dd>{lab.nome}</dd></div>
          <div><dt>Data</dt><dd>{new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full' }).format(data).replace(/^./, letra => letra.toLocaleUpperCase('pt-BR'))}</dd></div>
          <div><dt>Horário inicial</dt><dd>{inicio}</dd></div>
          <div><dt>Horário final</dt><dd>{fim}</dd></div>
          <div><dt>Duração</dt><dd>{Math.floor(duracao / 60)} h{duracao % 60 ? ` ${duracao % 60} min` : ''}</dd></div>
        </dl>
        <p className="booking-day-panel__hint">Nenhuma solicitação foi enviada ou reserva criada. O formulário será disponibilizado na Etapa 8.</p>
        <Link className="booking-back-link" to={calendario}><span aria-hidden="true">←</span>Alterar data e horário</Link>
      </section>}
    </main>
  </>
}
