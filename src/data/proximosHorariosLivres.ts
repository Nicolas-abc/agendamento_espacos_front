import type { HorarioDiaDemonstrativo } from './horariosLaboratorios'

export interface GrupoHorarioLivreDemonstrativo {
  diasAFrente: number
  horarios: string[]
}

// Valores fictícios para o protótipo. Não correspondem a reservas ou a
// disponibilidade consultada no sistema.
export const proximosHorariosLivresDemonstrativos: Record<number, GrupoHorarioLivreDemonstrativo[]> = {
  1: [
    { diasAFrente: 0, horarios: ['14:00', '15:00', '17:00'] },
    { diasAFrente: 2, horarios: ['10:00', '11:00'] },
  ],
  2: [
    { diasAFrente: 0, horarios: ['14:00', '15:00', '17:00'] },
    { diasAFrente: 1, horarios: ['09:00', '11:00', '16:00'] },
  ],
  3: [
    { diasAFrente: 1, horarios: ['10:00', '14:00'] },
    { diasAFrente: 3, horarios: ['09:00', '15:00'] },
  ],
  4: [
    { diasAFrente: 2, horarios: ['09:00', '13:00'] },
    { diasAFrente: 4, horarios: ['10:00', '16:00'] },
  ],
}

export function formatarDataRelativa(diasAFrente: number, dataBase = new Date()): string {
  const data = new Date(dataBase.getFullYear(), dataBase.getMonth(), dataBase.getDate() + diasAFrente)

  if (diasAFrente === 0) return 'Hoje'
  if (diasAFrente === 1) return 'Amanhã'

  const dataFormatada = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  }).format(data)

  return dataFormatada.charAt(0).toLocaleUpperCase('pt-BR') + dataFormatada.slice(1)
}

// Filtra a fixture sem criar novos dias ou presumir disponibilidade oficial.
export function filtrarProximosHorariosDemonstrativos(
  grupos: GrupoHorarioLivreDemonstrativo[],
  funcionamento: HorarioDiaDemonstrativo[],
  dataBase: Date,
): GrupoHorarioLivreDemonstrativo[] {
  return grupos.flatMap(grupo => {
    const data = new Date(dataBase.getFullYear(), dataBase.getMonth(), dataBase.getDate() + grupo.diasAFrente)
    const periodos = funcionamento.filter(dia => dia.diaSemana === data.getDay() && dia.ativo)
    const horarios = grupo.horarios.filter(hora => periodos.some(periodo =>
      periodo.horaAbertura && periodo.horaFechamento
      && hora >= periodo.horaAbertura && hora < periodo.horaFechamento,
    ))
    return horarios.length ? [{ ...grupo, horarios }] : []
  })
}
