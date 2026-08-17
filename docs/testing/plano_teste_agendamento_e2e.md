# Plano de Teste — Fluxo de Agendamento E2E

Este documento define a estratégia e o mapeamento de testes de ponta a ponta (E2E) para garantir a integridade da funcionalidade de agendamento de consultas da aplicação.

## 1. IDENTIFICAÇÃO

| CAMPO | CONTEÚDO |
| :--- | :--- |
| **Sistema testado** | Doutor Agenda |
| **Módulo** | Agendamento de Consultas Médicas |
| **Responsável** | Seu Nome |
| **Data** | 17/08/2026 |
| **Versão do documento** | 1.0 |

## 2. OBJETIVO DO TESTE

| CAMPO | CONTEÚDO |
| :--- | :--- |
| **Objetivo** | Validar o fluxo completo de agendamento de consultas, garantindo que usuários autenticados consigam selecionar médicos, pacientes e horários dinâmicos da mesma clínica (`clinicId`), respeitando as regras de concorrência de agenda, persistência do Drizzle ORM e validações de formulário. |

## 3. ESCOPO — O QUE SERÁ TESTADO

| # | ITEM |
| :--- | :--- |
| **3.1** | Criação de agendamento completo com preenchimento válido (Fluxo Feliz). |
| **3.2** | Atualização dinâmica da lista de horários após um horário específico ser ocupado (Concorrência/Bloqueio). |
| **3.3** | Bloqueio de datas e horários que estejam fora da escala configurada na agenda do profissional. |
| **3.4** | Validação de campos obrigatórios do formulário impedindo o disparo da Server Action. |
| **3.5** | Persistência do valor correto da consulta (`appointmentPriceInCents`) no momento da gravação. |
| **3.6** | Revalidação instantânea da página (`revalidatePath`) para exibição imediata do novo agendamento na listagem. |

## 4. FORA DO ESCOPO — O QUE NÃO SERÁ TESTADO

| # | ITEM |
| :--- | :--- |
| **4.1** | Criação e edição do cadastro inicial de clínicas (Multi-tenancy onboarding). |
| **4.2** | Configuração ou alteração de escala/esquema de horários no perfil do médico. |
| **4.3** | Fluxo completo de autenticação e gerenciamento de permissões de sessão (Auth assume-se ativa). |
| **4.4** | Testes de carga e estresse nas Server Actions ou limites de conexão concorrente no banco de dados. |

## 5. AMBIENTE DE TESTE

| CAMPO | CONTEÚDO |
| :--- | :--- |
| **Ambiente de execução** | Localhost (Ambiente de Desenvolvimento) integrado com banco SQLite/Postgres de testes. |
| **Framework de automação** | Playwright (TypeScript) |
| **Perfil de usuário** | Administrador ou Recepcionista autenticado e associado a uma clínica ativa. |
| **Dados de teste prévios** | 1 clínica cadastrada, 1 médico com agenda configurada e 1 paciente vinculado. |

## 6. CRITÉRIOS DE ACEITE

| # | ITEM |
| :--- | :--- |
| **6.1** | Ao confirmar um agendamento válido, a interface exibe um toast de sucesso e o registro surge na tabela. |
| **6.2** | Horários já reservados para o Médico X no Dia Y não devem estar clicáveis ou visíveis para novos agendamentos. |
| **6.3** | Dias sem escala configurada (ex: domingos) devem exibir a grade de horários vazia ou bloqueada. |
| **6.4** | Se houver erro de validação (Zod), o formulário exibe mensagens de erro nos campos correspondentes. |
| **6.5** | O isolamento de dados por clínica deve ser garantido, gravando estritamente o `clinicId` da sessão ativa. |

## 7. RISCOS E PREMISSAS

| CAMPO | CONTEÚDO |
| :--- | :--- |
| **Riscos identificados** | Testes automatizados concorrentes rodando em paralelo podem tentar consumir o mesmo horário no banco de dados local se não forem isolados por ID, gerando falsos negativos no pipeline. |
| **Premissas assumidas** | A aplicação está rodando em ambiente controlado (`localhost:3000`), a autenticação mockada injeta um token válido no contexto do Playwright e o banco é limpo/resetado a cada bateria de testes. |

## 8. ENTREGÁVEIS DESTE TESTE

| # | ITEM |
| :--- | :--- |
| **8.1** | Plano de teste estruturado em Markdown (este documento). |
| **8.2** | Suíte de testes funcionais automatizados em Playwright (`e2e/agendamento.spec.ts`). |
| **8.3** | Relatório visual gerado pelo Playwright com evidências de execução (Vídeos e Screenshots de falhas). |
