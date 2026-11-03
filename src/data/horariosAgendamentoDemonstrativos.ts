import { obterEstadoDiaDemonstrativo } from './calendarioDemonstrativo'
export type EstadoIntervaloDemonstrativo = 'livre' | 'ocupado'
export interface IntervaloHorarioDemonstrativo { inicio: string; fim: string; estado: EstadoIntervaloDemonstrativo }
export const granularidadeIntervaloDemonstrativoMinutos = 60
export type HorariosAgendamentoDemonstrativos = Record<string, Record<string, IntervaloHorarioDemonstrativo[]>>
// Fixture fictícia e relativa; não representa funcionamento, reservas ou disponibilidade oficial.
function criarFixture(): HorariosAgendamentoDemonstrativos {
 const fixture: HorariosAgendamentoDemonstrativos = {}
 for (const id of [1, 2, 3, 4]) {
  fixture[id] = {}; const datas: Date[] = []; const hoje = new Date()
  for (let offset = 0; offset < 120 && datas.length < 3; offset++) {
   const d = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + offset)
   if (obterEstadoDiaDemonstrativo(id, d) === 'livre') datas.push(d)
  }
  datas.forEach((d, indice) => {
   const iso = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
   if (indice === 2) return
   const horas = indice === 1 ? ['09:00','10:00','11:00','12:00','13:00'] : ['09:00','10:00','11:00','12:00','13:00','14:00']
   fixture[id][iso] = horas.slice(0, -1).map((inicio, pos) => ({ inicio, fim: horas[pos + 1], estado: indice === 1 ? 'ocupado' : pos === 1 ? 'ocupado' : 'livre' }))
  })
 }
 return fixture
}
export const horariosAgendamentoDemonstrativos = criarFixture()
export function obterIntervalosDemonstrativos(id: number, data: string) { return horariosAgendamentoDemonstrativos[id]?.[data] }
export function minutos(h: string): number | null { const p = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(h); return p ? Number(p[1]) * 60 + Number(p[2]) : null }
export function intervaloEstaLivre(items: IntervaloHorarioDemonstrativo[] | undefined, inicio: string, fim: string): boolean {
 const a = minutos(inicio), b = minutos(fim); if (!items || a === null || b === null || a >= b) return false
 let cursor = a; const ordenados = [...items].sort((x,y) => (minutos(x.inicio) ?? 0) - (minutos(y.inicio) ?? 0))
 for (const item of ordenados) { const x = minutos(item.inicio), y = minutos(item.fim); if (x === null || y === null || y <= cursor || x >= b) continue; if (x !== cursor || item.estado !== 'livre') return false; cursor = y; if (cursor === b) return true }
 return false
}
export function duracaoMinutos(inicio: string, fim: string): number { const a = minutos(inicio), b = minutos(fim); return a === null || b === null || b <= a ? 0 : b - a }