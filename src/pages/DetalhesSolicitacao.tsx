import { useId, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Cabecalho } from '../components/Cabecalho'
import { duracaoMinutos } from '../data/horariosAgendamentoDemonstrativos'
import { laboratoriosFicticios } from '../data/laboratorios'
import { validarFinalidadeSolicitacao } from '../data/solicitacaoPayload'
import { parametrosSelecao, parseData, selecaoDemonstrativaValida } from '../data/selecaoAgendamento'

export function DetalhesSolicitacao({ id }: { id: string }) {
  const [params] = useSearchParams()
  const [finalidade, setFinalidade] = useState('')
  const [finalidadeTocada, setFinalidadeTocada] = useState(false)
  const finalidadeId = useId()
  const lab = laboratoriosFicticios.find(item => String(item.id) === id)
  const valida = Boolean(lab && selecaoDemonstrativaValida(lab.id, params))
  const data = parseData(params.get('data'))
  const inicio = params.get('inicio') || ''
  const fim = params.get('fim') || ''
  const duracao = duracaoMinutos(inicio, fim)
  const calendario = `/laboratorios/${id}/agendamento${parametrosSelecao(params)}`
  const finalidadeTrimada = finalidade.trim()
  const erroFinalidade = validarFinalidadeSolicitacao(finalidade)

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
        <p className="booking-day-panel__hint">Nenhuma solicitação foi enviada ou reserva criada.</p>
        <Link className="booking-back-link" to={calendario}><span aria-hidden="true">←</span>Alterar data e horário</Link>
        <form className="booking-purpose-form" aria-labelledby={`${finalidadeId}-title`} onSubmit={event => event.preventDefault()} noValidate>
          <div className="booking-purpose-form__heading">
            <h2 id={`${finalidadeId}-title`}>Finalidade da solicitação</h2>
            <p id={`${finalidadeId}-help`}>Descreva o motivo do uso do laboratório, com 3 a 255 caracteres.</p>
          </div>
          <label className="booking-purpose-form__label" htmlFor={finalidadeId}>Finalidade da solicitação <span aria-hidden="true">*</span></label>
          <textarea
            id={finalidadeId}
            name="finalidade"
            value={finalidade}
            onChange={event => setFinalidade(event.target.value)}
            onBlur={() => setFinalidadeTocada(true)}
            maxLength={255}
            required
            aria-required="true"
            aria-invalid={Boolean(finalidadeTocada && erroFinalidade)}
            aria-describedby={`${finalidadeId}-help ${finalidadeId}-count${finalidadeTocada && erroFinalidade ? ` ${finalidadeId}-error` : ''}`}
            aria-errormessage={finalidadeTocada && erroFinalidade ? `${finalidadeId}-error` : undefined}
            rows={5}
          />
          <div className="booking-purpose-form__meta">
            {finalidadeTocada && erroFinalidade
              ? <p className="booking-purpose-form__error" id={`${finalidadeId}-error`} role="status">{erroFinalidade}</p>
              : <span />}
            <span className="booking-purpose-form__count" id={`${finalidadeId}-count`} aria-live="polite">{finalidadeTrimada.length}/255 caracteres</span>
          </div>
          <p className="booking-purpose-form__notice" role="note">Formulário demonstrativo. O envio ainda não está disponível nesta versão.</p>
          <button className="button button--primary booking-purpose-form__submit" type="submit" disabled>Enviar solicitação</button>
        </form>
      </section>}
    </main>
  </>
}
