export type EstadoDiaCalendario = 'livre' | 'ocupado' | 'passado' | 'sem-dados' | 'fim-de-semana'

interface DiasDemonstrativosDoMes {
  livres: number[]
  ocupados: number[]
  diasDaSemanaPermitidos: number[]
}

// Fixture visual fictícia: os mesmos números de dia são reaproveitados em cada
// mês e não representam disponibilidade oficial nem consideram reservas reais.
// A permissão semanal é provisória e pode ser ajustada por laboratório.
const disponibilidadeMensalDemonstrativa: Record<number, DiasDemonstrativosDoMes> = {
  1: {
    diasDaSemanaPermitidos: [1, 2, 3, 4, 5],
    livres: [1, 2, 5, 6, 9, 12, 14, 15, 19, 20, 23, 26, 28, 29],
    ocupados: [3, 7, 10, 16, 22, 25, 30],
  },
  2: {
    diasDaSemanaPermitidos: [1, 2, 3, 4, 5],
    livres: [2, 4, 8, 11, 13, 17, 18, 21, 24, 27, 31],
    ocupados: [1, 5, 9, 14, 20, 26],
  },
  3: {
    diasDaSemanaPermitidos: [1, 2, 3, 4, 5],
    livres: [1, 3, 6, 10, 12, 15, 17, 22, 24, 28, 30],
    ocupados: [4, 8, 13, 19, 25, 29],
  },
  4: {
    diasDaSemanaPermitidos: [1, 2, 3, 4, 5],
    livres: [2, 5, 7, 11, 14, 16, 20, 23, 25, 29, 31],
    ocupados: [3, 9, 12, 18, 22, 27],
  },
}

function compararDataLocal(primeira: Date, segunda: Date): number {
  return new Date(primeira.getFullYear(), primeira.getMonth(), primeira.getDate()).getTime()
    - new Date(segunda.getFullYear(), segunda.getMonth(), segunda.getDate()).getTime()
}

export function obterEstadoDiaDemonstrativo(
  idLaboratorio: number,
  data: Date,
  hoje = new Date(),
): EstadoDiaCalendario {
  if (compararDataLocal(data, hoje) < 0) return 'passado'

  const dadosDoLaboratorio = disponibilidadeMensalDemonstrativa[idLaboratorio]
  if (!dadosDoLaboratorio) return 'sem-dados'
  if (!dadosDoLaboratorio.diasDaSemanaPermitidos.includes(data.getDay())) return 'fim-de-semana'

  if (dadosDoLaboratorio.livres.includes(data.getDate())) return 'livre'
  if (dadosDoLaboratorio.ocupados.includes(data.getDate())) return 'ocupado'
  return 'sem-dados'
}

export function diaPodeSerSelecionado(estado: EstadoDiaCalendario, pertenceAoMesExibido: boolean): boolean {
  return pertenceAoMesExibido && estado === 'livre'
}

export function atualizarDataSelecionada(
  atual: Date | null,
  candidata: Date,
  estado: EstadoDiaCalendario,
  pertenceAoMesExibido: boolean,
): Date | null {
  if (!diaPodeSerSelecionado(estado, pertenceAoMesExibido)) return atual

  return new Date(candidata.getFullYear(), candidata.getMonth(), candidata.getDate())
}
