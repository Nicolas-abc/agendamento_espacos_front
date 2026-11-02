export type DiaSemanaFuncionamento = 0 | 1 | 2 | 3 | 4 | 5 | 6

export interface HorarioDiaDemonstrativo {
  diaSemana: DiaSemanaFuncionamento
  ativo: boolean
  horaAbertura?: string
  horaFechamento?: string
}

interface HorariosDemonstrativosBase {
  aberturaDiasUteis: string
  fechamentoDiasUteis: string
  sabado?: { abertura: string; fechamento: string }
}

function criarSemanaDemonstrativa({ aberturaDiasUteis, fechamentoDiasUteis, sabado }: HorariosDemonstrativosBase): HorarioDiaDemonstrativo[] {
  const diasUteis: HorarioDiaDemonstrativo[] = [1, 2, 3, 4, 5].map((diaSemana) => ({
    diaSemana: diaSemana as DiaSemanaFuncionamento,
    ativo: true,
    horaAbertura: aberturaDiasUteis,
    horaFechamento: fechamentoDiasUteis,
  }))

  return [
    ...diasUteis,
    sabado
      ? { diaSemana: 6, ativo: true, horaAbertura: sabado.abertura, horaFechamento: sabado.fechamento }
      : { diaSemana: 6, ativo: false },
    { diaSemana: 0, ativo: false },
  ]
}

// Dados de protótipo, ilustrativos e não oficiais. Não representam horários
// confirmados pelos responsáveis dos laboratórios.
export const horariosLaboratoriosDemonstrativos: Record<number, HorarioDiaDemonstrativo[]> = {
  1: criarSemanaDemonstrativa({ aberturaDiasUteis: '08:00', fechamentoDiasUteis: '18:00' }),
  2: criarSemanaDemonstrativa({
    aberturaDiasUteis: '08:00',
    fechamentoDiasUteis: '18:00',
    sabado: { abertura: '08:00', fechamento: '12:00' },
  }),
  3: criarSemanaDemonstrativa({
    aberturaDiasUteis: '09:00',
    fechamentoDiasUteis: '17:00',
    sabado: { abertura: '08:00', fechamento: '12:00' },
  }),
  4: criarSemanaDemonstrativa({ aberturaDiasUteis: '08:30', fechamentoDiasUteis: '17:30' }),
}
