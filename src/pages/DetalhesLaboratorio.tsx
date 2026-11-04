import { Link } from 'react-router-dom'
import { Cabecalho } from '../components/Cabecalho'
import { detalhesLaboratoriosDemonstrativos } from '../data/detalhesLaboratorios'
import { horariosLaboratoriosDemonstrativos } from '../data/horariosLaboratorios'
import { laboratoriosFicticios } from '../data/laboratorios'
import { filtrarProximosHorariosDemonstrativos, formatarDataRelativa, proximosHorariosLivresDemonstrativos } from '../data/proximosHorariosLivres'

interface DetalhesLaboratorioProps {
  id: string
}

const nomesDias: Record<number, string> = {
  0: 'Domingo',
  1: 'Segunda',
  2: 'Terça',
  3: 'Quarta',
  4: 'Quinta',
  5: 'Sexta',
  6: 'Sábado',
}

function agruparDiasComMesmoHorario(horarios: typeof horariosLaboratoriosDemonstrativos[number]) {
  const agrupados: Array<{ dias: string[]; ativo: boolean; horaAbertura?: string; horaFechamento?: string }> = []

  for (const horario of horarios) {
    const anterior = agrupados[agrupados.length - 1]
    const mesmoHorario = anterior
      && anterior.ativo === horario.ativo
      && anterior.horaAbertura === horario.horaAbertura
      && anterior.horaFechamento === horario.horaFechamento

    if (anterior && mesmoHorario) {
      anterior.dias.push(nomesDias[horario.diaSemana])
    } else {
      agrupados.push({
        dias: [nomesDias[horario.diaSemana]],
        ativo: horario.ativo,
        horaAbertura: horario.horaAbertura,
        horaFechamento: horario.horaFechamento,
      })
    }
  }

  return agrupados.map((grupo) => ({
    ...grupo,
    periodo: grupo.dias.length > 1
      ? `${grupo.dias[0]} a ${grupo.dias[grupo.dias.length - 1].toLowerCase()}`
      : grupo.dias[0],
  }))
}

export function DetalhesLaboratorio({ id }: DetalhesLaboratorioProps) {
  const laboratorio = laboratoriosFicticios.find((item) => String(item.id) === id)
  const detalhes = laboratorio ? detalhesLaboratoriosDemonstrativos[laboratorio.id] : undefined
  const horarios = laboratorio ? horariosLaboratoriosDemonstrativos[laboratorio.id] : undefined
  const hoje = new Date()
  const proximosHorarios = laboratorio?.disponivel
    ? filtrarProximosHorariosDemonstrativos(proximosHorariosLivresDemonstrativos[laboratorio.id] || [], horarios || [], hoje)
    : []
  const periodosDeFuncionamento = horarios ? agruparDiasComMesmoHorario(horarios) : []

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
              <div className="detail-slots-column">
                {horarios && (
                  <section className="detail-card detail-hours" aria-labelledby="detail-hours-title">
                    <h2 id="detail-hours-title">Horário de funcionamento</h2>
                    <p className="detail-card__note">Horários demonstrativos; não representam a disponibilidade oficial.</p>
                    <dl className="detail-hours__rows">
                      {periodosDeFuncionamento.map((periodo) => (
                        <div className="detail-hours__row" key={periodo.periodo}>
                          <dt>{periodo.periodo}</dt>
                          <dd>
                            {periodo.ativo
                              ? `${periodo.horaAbertura} — ${periodo.horaFechamento}`
                              : 'Fechado'}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </section>
                )}

                <section className="detail-card detail-slots" aria-labelledby="detail-slots-title">
                  <h2 id="detail-slots-title">{laboratorio.disponivel ? 'Próximos horários livres' : 'Agendamento indisponível'}</h2>
                  <p className="detail-slots__notice">Horários demonstrativos; não representam a disponibilidade oficial.</p>
                  {!laboratorio.disponivel ? (
                    <p className="detail-slots__empty">Este laboratório está indisponível para novas solicitações; não há horários apresentados para agendamento.</p>
                  ) : proximosHorarios.length > 0 ? (
                    <div className="detail-slots__groups">
                      {proximosHorarios.map((grupo) => (
                        <div className="detail-slots__group" key={grupo.diasAFrente}>
                          <h3 className="detail-slots__date">{formatarDataRelativa(grupo.diasAFrente, hoje)}</h3>
                          <ul className="detail-slots__list">
                            {grupo.horarios.map((horario) => (
                              <li className="detail-slots__item" key={horario}>
                                <span>{horario}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="detail-slots__empty">Nenhum horário demonstrativo compatível com o funcionamento cadastrado.</p>
                  )}
                </section>
                {laboratorio.disponivel ? <Link className="button button--primary" to={`/laboratorios/${laboratorio.id}/agendamento`}>
                  Solicitar agendamento
                </Link> : <p className="booking-weekend-notice" role="note">Este laboratório está indisponível para novas solicitações de agendamento. Os detalhes continuam disponíveis para consulta.</p>}
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
