export interface DetalhesLaboratorioDemonstrativos {
  descricao: string
  regrasDeUso: string[]
}

// Conteúdo fictício de protótipo. As regras são ilustrativas e não foram
// validadas institucionalmente.
const regrasDeUsoIlustrativas = [
  'Não consumir alimentos ou bebidas próximo aos equipamentos.',
  'Manter o ambiente organizado após a utilização.',
  'Respeitar o horário reservado e a capacidade máxima do laboratório.',
  'Comunicar imediatamente qualquer problema técnico ao responsável.',
]

export const detalhesLaboratoriosDemonstrativos: Record<number, DetalhesLaboratorioDemonstrativos> = {
  1: {
    descricao: 'Espaço colaborativo pensado para atividades de pesquisa, extensão e trabalho em grupo. O ambiente oferece recursos de apresentação e acesso à internet para apoiar encontros e projetos acadêmicos.',
    regrasDeUso: regrasDeUsoIlustrativas,
  },
  2: {
    descricao: 'Ambiente de informática destinado a atividades práticas, pesquisa e treinamentos. As estações de trabalho e os recursos de apresentação apoiam atividades acadêmicas individuais e em grupo.',
    regrasDeUso: regrasDeUsoIlustrativas,
  },
  3: {
    descricao: 'Espaço de apoio a atividades de ensino e pesquisa em eletrônica. As bancadas e os recursos de instrumentação permitem organizar práticas e experimentos em ambiente acadêmico.',
    regrasDeUso: regrasDeUsoIlustrativas,
  },
  4: {
    descricao: 'Ambiente voltado a atividades de ensino e treinamento em redes. O espaço reúne recursos relacionados a redes e servidores para apoiar práticas e estudos na área.',
    regrasDeUso: regrasDeUsoIlustrativas,
  },
}
