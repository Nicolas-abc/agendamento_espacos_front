import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Cabecalho } from '../components/Cabecalho'
import { atualizarDataSelecionada, diaPodeSerSelecionado, obterEstadoDiaDemonstrativo } from '../data/calendarioDemonstrativo'
import { laboratoriosFicticios } from '../data/laboratorios'

interface SolicitacaoAgendamentoProps {
  id: string
}

export function SolicitacaoAgendamento({ id }: SolicitacaoAgendamentoProps) {
  const laboratorio = laboratoriosFicticios.find((item) => String(item.id) === id)
  const [mesExibido, setMesExibido] = useState(() => {
    const hoje = new Date()
    return new Date(hoje.getFullYear(), hoje.getMonth(), 1)
  })
  const [dataSelecionada, setDataSelecionada] = useState<Date | null>(null)

  const hoje = new Date()
  const primeiroDiaDoMes = new Date(mesExibido.getFullYear(), mesExibido.getMonth(), 1)
  const deslocamentoDoPrimeiroDia = (primeiroDiaDoMes.getDay() + 6) % 7
  const primeiroDiaDaGrade = new Date(
    mesExibido.getFullYear(),
    mesExibido.getMonth(),
    1 - deslocamentoDoPrimeiroDia,
  )
  const diasDaGrade = Array.from({ length: 42 }, (_, indice) => (
    new Date(primeiroDiaDaGrade.getFullYear(), primeiroDiaDaGrade.getMonth(), primeiroDiaDaGrade.getDate() + indice)
  ))
  const diaSelecionado = dataSelecionada

  function alterarMes(deslocamento: number) {
    setMesExibido((mesAtual) => new Date(mesAtual.getFullYear(), mesAtual.getMonth() + deslocamento, 1))
    setDataSelecionada(null)
  }

  return (
    <>
      <Cabecalho />
      <main className="page-shell booking-page">
        {laboratorio ? (
          <>
            <nav className="booking-progress" aria-label="Etapas da solicitação">
              <Link className="booking-progress__step booking-progress__step--complete" to={`/laboratorios/${laboratorio.id}`}>
                <span className="booking-progress__number">1</span>
                <span>Laboratório</span>
              </Link>
              <span className="booking-progress__connector booking-progress__connector--complete" aria-hidden="true" />
              <div className="booking-progress__step booking-progress__step--current" aria-current="step">
                <span className="booking-progress__number">2</span>
                <span>Data e horário</span>
              </div>
              <span className="booking-progress__connector" aria-hidden="true" />
              <div className="booking-progress__step booking-progress__step--upcoming" aria-disabled="true">
                <span className="booking-progress__number">3</span>
                <span>Detalhes</span>
              </div>
            </nav>

            <header className="booking-intro">
              <h1>Escolha a data e o horário</h1>
              <p>Selecione um dia disponível. A escolha dos horários será habilitada na próxima etapa.</p>
            </header>

            <p className="booking-notice" id="booking-demo-notice" role="note">
              Datas e estados demonstrativos; não representam a disponibilidade oficial do laboratório.
            </p>
            <p className="booking-weekend-notice" id="booking-weekend-notice" role="note">
              Finais de semana indisponíveis para agendamento. Esta é uma restrição provisória, sujeita à confirmação do funcionamento oficial do laboratório.
            </p>

            <div className="booking-calendar-layout">
              <section className="booking-card booking-calendar" aria-labelledby="booking-calendar-title" aria-describedby="booking-demo-notice booking-weekend-notice">
                <div className="booking-calendar__header">
                  <div>
                    <h2 id="booking-calendar-title">
                      {formatarMesAno(mesExibido)}
                    </h2>
                    <p>Disponibilidade demonstrativa do laboratório</p>
                  </div>
                  <div className="booking-calendar__navigation">
                    <button className="booking-calendar__month-button" type="button" aria-label="Mês anterior" onClick={() => alterarMes(-1)}>
                      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="m15 18-6-6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                    <button className="booking-calendar__month-button" type="button" aria-label="Próximo mês" onClick={() => alterarMes(1)}>
                      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="m9 18 6-6-6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                  </div>
                </div>

                <div className="booking-calendar__weekdays" aria-hidden="true">
                  {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((dia) => <span key={dia}>{dia}</span>)}
                </div>
                <div className="booking-calendar__days" role="group" aria-label={`Dias de ${formatarMesAno(mesExibido)}`}>
                  {diasDaGrade.map((dia) => {
                    const pertenceAoMes = dia.getMonth() === mesExibido.getMonth()
                      && dia.getFullYear() === mesExibido.getFullYear()
                    const estado = pertenceAoMes
                      ? obterEstadoDiaDemonstrativo(laboratorio.id, dia, hoje)
                      : 'sem-dados'
                    const ehHoje = formatarDataISO(dia) === formatarDataISO(hoje)
                    const estaSelecionado = dataSelecionada !== null
                      && formatarDataISO(dia) === formatarDataISO(dataSelecionada)
                    const diaDisponivel = diaPodeSerSelecionado(estado, pertenceAoMes)

                    return (
                      <button
                        className={[
                          'booking-calendar__day',
                          `booking-calendar__day--${estado}`,
                          pertenceAoMes ? '' : 'booking-calendar__day--outside',
                          ehHoje ? 'booking-calendar__day--today' : '',
                          estaSelecionado ? 'booking-calendar__day--selected' : '',
                        ].filter(Boolean).join(' ')}
                        type="button"
                        key={formatarDataISO(dia)}
                        disabled={!diaDisponivel}
                        aria-label={`${formatarDataLonga(dia)}: ${pertenceAoMes ? rotuloEstadoDia(estado) : 'dia de mês adjacente, indisponível nesta etapa'}${ehHoje ? ', hoje' : ''}`}
                        aria-pressed={estaSelecionado}
                        onClick={() => setDataSelecionada((atual) => (
                          atualizarDataSelecionada(atual, dia, estado, pertenceAoMes)
                        ))}
                      >
                        {dia.getDate()}
                      </button>
                    )
                  })}
                </div>

                <div className="booking-calendar__legend" aria-label="Legenda de disponibilidade">
                  <span><i className="booking-calendar__legend-dot booking-calendar__legend-dot--free" />Livre</span>
                  <span><i className="booking-calendar__legend-dot booking-calendar__legend-dot--occupied" />Ocupado</span>
                  <span><i className="booking-calendar__legend-dot booking-calendar__legend-dot--no-data" />Sem disponibilidade demonstrativa</span>
                  <span><i className="booking-calendar__legend-dot booking-calendar__legend-dot--weekend" />Fim de semana, provisório</span>
                  <span><i className="booking-calendar__legend-dot booking-calendar__legend-dot--today" />Hoje</span>
                </div>
              </section>

              <aside className="booking-card booking-day-panel" aria-live="polite" aria-label="Dia selecionado">
                {diaSelecionado ? (
                  <>
                    <h2>{formatarDataLonga(diaSelecionado)}</h2>
                    <p className="booking-day-panel__hint">Dia demonstrativo selecionado.</p>
                    <div className="booking-day-panel__empty">
                      A seleção de horários será disponibilizada na próxima etapa.
                    </div>
                  </>
                ) : (
                  <>
                    <h2>Selecione uma data</h2>
                    <p className="booking-day-panel__hint">Escolha um dia marcado como livre no calendário.</p>
                    <div className="booking-day-panel__empty">
                      Os horários deste dia aparecerão aqui na próxima etapa.
                    </div>
                  </>
                )}
              </aside>
            </div>

            <Link className="booking-back-link" to={`/laboratorios/${laboratorio.id}`}>
              <span aria-hidden="true">←</span> Voltar aos detalhes do laboratório
            </Link>
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

function formatarDataISO(data: Date): string {
  const ano = data.getFullYear()
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  const dia = String(data.getDate()).padStart(2, '0')
  return `${ano}-${mes}-${dia}`
}

function formatarMesAno(data: Date): string {
  const texto = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(data)
  return texto.charAt(0).toLocaleUpperCase('pt-BR') + texto.slice(1)
}

function formatarDataLonga(data: Date): string {
  const texto = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(data)
  return texto.charAt(0).toLocaleUpperCase('pt-BR') + texto.slice(1)
}

function rotuloEstadoDia(estado: string): string {
  if (estado === 'livre') return 'livre, demonstrativo'
  if (estado === 'ocupado') return 'ocupado, demonstrativo'
  if (estado === 'passado') return 'data passada'
  if (estado === 'fim-de-semana') return 'fim de semana indisponível provisoriamente'
  return 'sem disponibilidade demonstrativa cadastrada'
}
