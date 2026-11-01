# Decisões técnicas — LabAgenda

## Contexto

O LabAgenda é um sistema para consultar espaços/laboratórios e apoiar solicitações de agendamento. O repositório mantém o backend FastAPI/Python na raiz e o frontend independente em frontend/.

O frontend usa React, TypeScript, Vite, CSS tradicional e React Router. Até o momento, não há integração entre frontend e API.

## Estrutura e navegação

- src/pages/: páginas de catálogo e detalhes provisórios.
- src/components/: cabeçalho e cartão de laboratório.
- src/types/: tipo Laboratorio e tema visual.
- src/data/: dados fictícios usados pelo catálogo.
- src/styles/global.css: estilos e regras responsivas.
- src/App.tsx: configuração das rotas; src/main.tsx envolve a aplicação com BrowserRouter.

Rotas implementadas:

- / — catálogo de laboratórios.
- /laboratorios/:id — página provisória de detalhes.

IDs não numéricos e caminhos sem correspondência redirecionam para /. A rota aceita IDs numéricos sem confirmar que o laboratório existe; a tela de detalhes ainda é um placeholder.

## Implementado

- Catálogo com quatro laboratórios fictícios, definidos em src/data/laboratorios.ts.
- Pesquisa por nome sem distinção entre maiúsculas/minúsculas ou acentos.
- Filtros por bloco/prédio, capacidade, equipamentos e tipo de uso. As opções vêm dos dados fictícios; cada filtro permite voltar à seleção geral.
- Resumo de quantidade e disponibilidade calculado a partir desses mesmos dados.
- Navegação no cliente entre catálogo e detalhes com React Router.
- Estilos CSS próprios alinhados às referências disponíveis em docs/referencias/figma/, com ajustes responsivos para telas menores. A implementação visual está limitada às páginas atuais.

## Backend e limitações atuais

O backend FastAPI possui rotas para espaços e usuários. Para espaços, há listagem autenticada em GET /espacos/, operações administrativas de cadastro/atualização/desativação, configuração de horário em PATCH /espacos/{id_espaco}/horarios e operações de consulta e gestão de pausas em /espacos/{id_espaco}/pausas.

O esquema de resposta de espaço contém id, nome, descricao, capacidade, bloco e disponibilidade. O tipo fictício do frontend também contém sala, equipamentos, tipos de uso e tema visual; esses campos não fazem parte desse esquema de resposta observado.

A existência de configuração de horários e pausas não equivale a uma consulta de horários livres nem a uma reserva. No código de rotas examinado não há endpoints confirmados para consultar disponibilidade por data/horário, enviar solicitação de agendamento, listar agendamentos do usuário ou obter motivo de recusa. O frontend não consome os endpoints existentes.

## Pendências

- Implementar a tela completa de detalhes do laboratório.
- Construir a visualização de disponibilidade/calendário e seleção de horário.
- Implementar o formulário de solicitação.
- Implementar Meus Agendamentos e a visualização do motivo de recusa.
- Definir e integrar contratos da API para catálogo, disponibilidade e solicitações; alinhar os campos do backend com os dados necessários pela interface.
- Alinhar com o responsável pela autenticação as rotas, o acesso ao usuário autenticado, o armazenamento do token e os componentes compartilhados. Embora existam rotas de autenticação no backend, este frontend ainda não as integra.
- **Proposta pendente de avaliação e alinhamento com o grupo:** definir uma transição global padronizada entre páginas. Ela não está implementada. O CSS atual contém apenas efeitos locais, como o hover dos botões.

## Histórico técnico

- 7c71d70 — início do catálogo e estrutura básica do frontend.
- 7501509 — navegação com React Router.