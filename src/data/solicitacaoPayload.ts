export interface SelecaoAgendamentoValidada {
  idEspaco: number
  dataReserva: string
  horaInicio: string
  horaFim: string
}

export interface PayloadSolicitacaoEspaco {
  tipo: 'Espaço'
  id_espaco: number
  finalidade: string
  horarios: Array<{
    data_reserva: string
    hora_inicio: string
    hora_fim: string
  }>
}

/** Valida a finalidade segundo o contrato confirmado para POST /solicitacoes/. */
export function validarFinalidadeSolicitacao(finalidade: string): string | null {
  const valor = finalidade.trim()
  if (valor.length === 0) return 'Informe a finalidade da solicitação.'
  if (valor.length < 3) return 'A finalidade deve ter pelo menos 3 caracteres.'
  if (valor.length > 255) return 'A finalidade deve ter no máximo 255 caracteres.'
  return null
}

/** Normaliza horários locais sem usar Date ou conversões de fuso horário. */
export function normalizarHoraParaApi(hora: string): string {
  const match = /^(\d{1,2})(?::([0-5]\d))?(?::[0-5]\d)?$/.exec(hora)
  if (!match) throw new Error('Horário inválido; esperado HH:mm.')
  const horas = Number(match[1])
  if (horas > 23) throw new Error('Horário inválido; hora deve estar entre 00 e 23.')
  return `${String(horas).padStart(2, '0')}:${match[2] ?? '00'}`
}

function validarDataIso(data: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(data)
  if (!match) return false
  const ano = Number(match[1])
  const mes = Number(match[2])
  const dia = Number(match[3])
  if (ano < 1 || mes < 1 || mes > 12 || dia < 1) return false
  const diasPorMes = [31, ano % 4 === 0 && (ano % 100 !== 0 || ano % 400 === 0) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  return dia <= diasPorMes[mes - 1]
}

function minutos(hora: string): number {
  const [horas, minutos] = hora.split(':').map(Number)
  return horas * 60 + minutos
}

/** Converte uma seleção já validada em dados de payload, sem persistir ou enviar nada. */
export function criarPayloadSolicitacao(
  selecao: SelecaoAgendamentoValidada,
  finalidade: string,
): PayloadSolicitacaoEspaco {
  const finalidadeValidada = validarFinalidadeSolicitacao(finalidade)
  if (finalidadeValidada) throw new Error(finalidadeValidada)
  if (!Number.isInteger(selecao.idEspaco) || selecao.idEspaco <= 0) {
    throw new Error('O ID do espaço deve ser um inteiro positivo.')
  }
  if (!validarDataIso(selecao.dataReserva)) throw new Error('Data inválida; esperado YYYY-MM-DD.')

  const horaInicio = normalizarHoraParaApi(selecao.horaInicio)
  const horaFim = normalizarHoraParaApi(selecao.horaFim)
  if (minutos(horaInicio) >= minutos(horaFim)) {
    throw new Error('O horário inicial deve ser anterior ao horário final.')
  }

  return {
    tipo: 'Espaço',
    id_espaco: selecao.idEspaco,
    finalidade: finalidade.trim(),
    horarios: [{
      data_reserva: selecao.dataReserva,
      hora_inicio: horaInicio,
      hora_fim: horaFim,
    }],
  }
}
