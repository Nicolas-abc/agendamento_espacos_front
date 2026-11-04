# Decisões técnicas — LabAgenda

## 1. Contexto e estado atual

O LabAgenda permite consultar laboratórios e preparar uma solicitação demonstrativa. Este é o repositório independente do frontend; o backend FastAPI é mantido separadamente.

Estado de referência: branch `feature/frontend-laboratorios`, commit `42d2e48`. As Etapas 7.1 a 7.5 e a Revisão R1 estão implementadas e versionadas. O fluxo chega à prévia, sem integração HTTP, autenticação, envio real, persistência, aprovação de solicitações ou confirmação de reservas neste módulo.

## 2. Stack e organização do repositório

React, TypeScript, Vite, React Router e CSS próprio, sem biblioteca adicional de interface.

| Caminho | Responsabilidade |
| --- | --- |
| `src/pages/` | Catálogo, detalhes do laboratório, calendário e detalhes da solicitação |
| `src/components/` | Cabeçalho e cartão do laboratório |
| `src/types/laboratorio.ts` | Modelo visual do laboratório |
| `src/data/` | Fixtures demonstrativas, regras de seleção e adaptador de payload |
| `src/styles/global.css` | Estilos compartilhados, estados e adaptações responsivas |
| `src/App.tsx` | Rotas e validação do formato do ID |
| `src/main.tsx` | Inicialização do React com StrictMode e BrowserRouter |
| `package.json` | Dependências e comandos disponíveis |

## 3. Rotas e fluxo de navegação

| Rota | Tela |
| --- | --- |
| `/` | Catálogo de laboratórios |
| `/laboratorios/:id` | Detalhes do laboratório |
| `/laboratorios/:id/agendamento` | Calendário e seleção de intervalo |
| `/laboratorios/:id/agendamento/detalhes` | Resumo, formulário de finalidade e prévia |

Fluxo: catálogo → detalhes → calendário e horários → formulário → prévia. Formulário e prévia compartilham a última rota e alternam por estado React; não existe rota exclusiva da prévia.

IDs não numéricos e caminhos sem correspondência redirecionam ao catálogo. IDs numéricos inexistentes exibem mensagem e retorno seguro. Laboratórios indisponíveis continuam consultáveis, mas suas rotas de calendário e formulário exibem um bloqueio explicativo, inclusive em acesso direto.

## 4. Funcionalidades demonstrativas concluídas

- Catálogo com quatro laboratórios, pesquisa por nome sem distinção de caixa ou acentos, filtros combinados por bloco, capacidade, equipamento e tipo de uso, resumo geral e estado sem resultados.
- Detalhes com identificação, localização, capacidade, descrição, regras de uso, funcionamento e próximos horários demonstrativos compatíveis com o funcionamento cadastrado.
- Calendário mensal com navegação, legenda e estados de dia livre, ocupado, passado, sem dados e fim de semana.
- Seleção de início e término em slots de uma hora, bloqueio de lacunas e períodos ocupados, resumo e duração. Dois cliques no mesmo slot completam um intervalo de uma hora.
- Transporte da seleção para o resumo/formulário e retorno ao calendário pela ação “Alterar data e horário”.
- Formulário demonstrativo de finalidade com mensagens de validação e contador; prévia com laboratório, data, horários, duração e finalidade normalizada, além de “Voltar para editar”.
- Labels, mensagens associadas ao campo, indicadores de foco e foco no título ao alternar formulário/prévia. Data apresentada em pt-BR com inicial maiúscula e layouts adaptados a telas menores.

## 5. Estado, parâmetros e validações

O ID do laboratório fica no caminho. A seleção usa a URL como fonte, por meio de useSearchParams:

| Parâmetro | Formato e finalidade |
| --- | --- |
| `mes` | `YYYY-MM`; mês exibido e contexto de retorno |
| `data` | `YYYY-MM-DD`; data selecionada |
| `inicio` | `HH:mm`; início do intervalo |
| `fim` | `HH:mm`; término do intervalo |

`src/data/selecaoAgendamento.ts` centraliza leitura de data, validação da seleção e transporte desses quatro parâmetros. A navegação entre calendário e formulário preserva a seleção; atualizar a página permite reconstruí-la e revalidá-la. Mudar o mês preserva a seleção, mesmo que ela pertença a outro mês. Escolher outra data limpa início e término.

O calendário remove parâmetros inválidos com substituição da entrada do histórico. O destino valida a seleção e oferece retorno seguro quando ela está ausente ou inválida. `mes` é contexto de navegação: sua validade não faz parte da validação do intervalo no destino.

As telas verificam existência e disponibilidade do laboratório. Datas devem existir, não estar em dias anteriores ao atual e pertencer a dias livres da fixture. Fins de semana são bloqueados provisoriamente. Horas devem formar um intervalo positivo inteiramente coberto por slots livres e contíguos; a duração é calculada.

A finalidade é validada após trim: obrigatória, entre 3 e 255 caracteres. O campo limita o texto bruto a 255, enquanto o contador usa o texto trimado. O botão de revisão só é habilitado para dados válidos.

Finalidade, modo e dados da prévia ficam em memória no componente. “Voltar para editar” preserva a finalidade; atualizar a página ou sair para o calendário perde esse texto. A prévia não cria uma entrada própria no histórico do navegador. Não há rascunho persistente em armazenamento local.

## 6. Fixtures e limitações conhecidas

- `src/data/laboratorios.ts`: IDs e informações visuais fictícios; não comprovam correspondência com espaços reais.
- `src/data/detalhesLaboratorios.ts` e `src/data/horariosLaboratorios.ts`: descrição, regras e funcionamento ilustrativos, sem validação institucional.
- `src/data/proximosHorariosLivres.ts`: horários relativos ao dia atual, filtrados por dia ativo e início dentro da faixa de funcionamento. Grupos vazios são omitidos; laboratórios indisponíveis exibem mensagem em vez de horários.
- `src/data/calendarioDemonstrativo.ts`: números de dias reaproveitados mensalmente, com bloqueio provisório de fins de semana.
- `src/data/horariosAgendamentoDemonstrativos.ts`: slots gerados na carga a partir das primeiras datas elegíveis; há exemplos com horários livres, todos ocupados e sem slots.

As fontes dos detalhes e do calendário são distintas: próximos horários não garantem correspondência com os slots do calendário nem disponibilidade oficial. O funcionamento dos detalhes pode incluir sábado, enquanto o calendário o bloqueia provisoriamente. Nem todo dia marcado livre possui slots cadastrados.

Fixtures relativas e validações dependem do relógio local; um link pode deixar de ser válido com o passar dos dias. Horários já passados no dia atual ainda não são bloqueados. O filtro dos próximos horários não revalida a hora atual nem representa duração de reserva.

Os avisos demonstrativos devem permanecer. “Meus agendamentos” e o perfil no cabeçalho não implementam navegação funcional ou autenticação.

## 7. Adaptador e contrato de referência da API

`criarPayloadSolicitacao`, em `src/data/solicitacaoPayload.ts`, prepara dados locais para a prévia. Não executa HTTP nem persiste informações. Recebe uma seleção previamente validada, valida finalidade, ID inteiro positivo, existência da data e ordenação das horas, e produz:

| Campo | Valor preparado |
| --- | --- |
| `tipo` | `Espaço` |
| `id_espaco` | ID demonstrativo do laboratório |
| `finalidade` | Texto trimado |
| `horarios` | Um objeto com `data_reserva`, `hora_inicio` e `hora_fim` |

Datas usam `YYYY-MM-DD`; horas são normalizadas para `HH:mm`, sem conversões de fuso. O normalizador aceita segundos, mas os descarta; esse comportamento precisa de alinhamento antes de consumir horários com segundos. Não há seleção de múltiplos intervalos na interface.

Contrato de referência consultado no backend: `origin/dev`, commit `400e79e`. Não se trata de integração executada neste frontend. Para `POST /solicitacoes/`:

- Obrigatórios: `tipo` (`Espaço`, `Recurso` ou `Serviço`), `finalidade` de 3 a 255 caracteres, `id_espaco` positivo e existente e `horarios` com pelo menos um elemento.
- Cada horário exige `data_reserva`, `hora_inicio` e `hora_fim`, com fim posterior ao início. Horas são locais, sem deslocamento de fuso; datas passadas e início já passado no dia atual são rejeitados.
- Opcionais com padrão: `urgencia=false`, `id_projeto=null`, `ids_recursos=[]` e `ids_usuarios_envolvidos=[]`. Campos extras são proibidos. IDs opcionais informados passam por validações do backend.
- Criação exige usuário autenticado com perfil Servidor; solicitante vem da autenticação. A resposta de criação é 201, com solicitação Pendente, sem equivaler a reserva confirmada.

A referência também possui consultas de disponibilidade e agendamentos. A existência desses contratos não significa consumo pelo frontend. Sala, equipamentos, tipos de uso e tema do modelo visual não devem ser presumidos como campos equivalentes da resposta de espaço; o mapeamento exige alinhamento.

## 8. Correções da Revisão R1

- `disponivel=false` impede novas solicitações: ação substituída por explicação e proteção também no calendário e formulário acessados diretamente. A consulta dos detalhes permanece disponível.
- Próximos horários são ocultados para laboratórios indisponíveis e filtrados por funcionamento para os demais, sem modificar as fixtures.
- Seletores CSS alinhados aos estados `--livre`, `--ocupado` e `--passado`, com seus indicadores visuais.
- Foco visível restaurado na pesquisa por `:focus-within`, seguindo o padrão visual existente.

## 9. Pendências e planejamento das próximas etapas

Trabalho futuro de integração: obter IDs e catálogo reais; integrar usuário autenticado e autorização; consultar disponibilidade oficial; revalidar seleção e disponibilidade antes do envio; implementar criação, carregamento e tratamento de erros; distinguir solicitação Pendente de reserva confirmada. O servidor deve continuar sendo a autoridade das regras.

Decisões pendentes: alinhar autenticação, acesso ao usuário, armazenamento do token e componentes compartilhados com a equipe; definir fuso e regras temporais; mapear dados visuais para o contrato real; avaliar persistência de rascunho; confirmar regras de finais de semana e tratamento de segundos. A hospedagem deve oferecer fallback para as rotas do BrowserRouter.

Planejamento preliminar, sujeito à confirmação com a equipe:

- Etapa 8: Minha agenda / Meus agendamentos.
- Etapa 9: Motivo de recusa.

Essas telas e integrações não estão implementadas. Formulário demonstrativo e prévia já pertencem às Etapas 7.4 e 7.5; não devem ser descritos como trabalho ainda não iniciado.

A proposta de transição global padronizada entre páginas continua pendente de avaliação e alinhamento com o grupo; não foi aprovada nem implementada. Os efeitos CSS existentes são locais.

## 10. Comandos disponíveis e limites da validação

Comandos definidos em `package.json`, executados na raiz:

- `npm.cmd run dev`: servidor de desenvolvimento Vite.
- `npm.cmd run build`: verificação TypeScript e geração do build Vite.
- `npm.cmd run preview`: pré-visualização do build existente.
- `git diff --check`: verificação de problemas de whitespace no diff.

Não há suíte ou script de testes automatizados no repositório. Build aprovado não comprova navegação, responsividade, acessibilidade, contratos em execução ou integração. Verificações pontuais anteriores em memória não constituem suíte versionada.

A validação manual deve cobrir fluxo até a prévia, edição, retorno e atualização, seleção de uma hora, bloqueios, URLs inválidas, laboratório indisponível, dias fechados, foco por teclado e telas pequenas. Esta revisão documental não executa build nem altera código.

## 11. Histórico técnico resumido

Marcos comprovados no histórico atual:

| Commit | Marco |
| --- | --- |
| `05a8fb1` | Catálogo inicial |
| `270b419` | Navegação com React Router |
| `dd3d5c7` | Registro inicial das decisões técnicas |
| `ed01dc9` | Validação do laboratório na tela de detalhes |
| `ef8f349` / `c45b813` | Identificação visual, descrição e regras dos detalhes |
| `7928a87` / `bb5c47f` | Funcionamento e próximos horários demonstrativos |
| `03f8a30` | Navegação para solicitação de agendamento |
| `a17398c` | Calendário demonstrativo — Etapa 7.1 |
| `dd0b6b9` | Seleção demonstrativa de horários — Etapa 7.2 |
| `3704bf9` | Transporte e detalhes do agendamento — Etapa 7.3 |
| `e50c512` | Formulário demonstrativo — Etapa 7.4 |
| `3ebee19` | Prévia da solicitação — Etapa 7.5 |
| `42d2e48` | Disponibilidade, coerência dos próximos horários e acessibilidade — R1 |
