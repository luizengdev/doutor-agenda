# 🩺 Doutor Agenda

Doutor Agenda é um SaaS moderno e robusto para gestão de clínicas, médicos, pacientes e agendamentos, desenvolvido com as melhores práticas do ecossistema React/Next.js. O projeto foi desenhado para ser escalável, seguro, intuitivo e conta com uma arquitetura sólida de **Testes de Ponta a Ponta (E2E)** para garantir estabilidade contínua em produção.

https://doutor-agenda-mocha.vercel.app/

## 🚀 Tecnologias Utilizadas

- **Next.js 15** (App Router)
- **TypeScript**
- **React 19**
- **Tailwind CSS**
- **shadcn/ui**
- **React Hook Form + Zod**
- **PostgreSQL + Drizzle ORM**
- **BetterAuth**
- **React Query**
- **Day.js**
- **Playwright** (Automação de Testes E2E)

## ✨ Funcionalidades

- Cadastro e gerenciamento de clínicas, médicos e pacientes.
- Agendamento de consultas com seleção de horários disponíveis.
- Regras de concorrência na agenda (bloqueio automático de horários ocupados).
- Validação de formulários com feedback instantâneo via Zod.
- Máscara de inputs para telefone e valores monetários.
- Autenticação segura e controle de acesso por clínica.
- UI responsiva, acessível e elegante.
- Server Actions e Server Components para máxima performance.
- Listagens dinâmicas com DataTable e ações rápidas (editar, excluir).

## 📸 Screenshots

<p align="center">
<img alt="Image" src="https://github.com/user-attachments/assets/f7d89e61-e34f-4bec-83b6-98beaed898f7" style="max-width: 100%; height: auto;" />
<img alt="Image" src="https://github.com/user-attachments/assets/b281aab5-8525-4a9d-9b9f-15f0af34e540" style="max-width: 100%; height: auto;" />
</p>

## 🧑‍💻 Como rodar localmente

```bash
# Clone o repositório
git clone https://github.com
cd doutor-agenda

# Instale as dependências
npm install

# Instale os navegadores do Playwright (necessário para rodar os testes)
npx playwright install

# Configure as variáveis de ambiente (exemplo em .env.example)
cp .env.example .env

# Rode para sincronizar o banco de dados
npx drizzle-kit push

# Inicie o projeto
npm run dev
```

**Acesse:** http://localhost:3000

---

## 🧪 Qualidade de Software & Testes E2E (Playwright)

O projeto conta com uma esteira completa de testes de ponta a ponta automatizados com **Playwright**, cobrindo fluxos críticos de negócios e garantindo a resiliência do software contra regressões.

### Casos de Teste Mapeados e Automatizados:
*   **CT-01 (Fluxo Feliz):** Criação de agendamento completo com preenchimento válido e validação de carregamento dinâmico de preços.
*   **CT-02 (Concorrência):** Ocultação e bloqueio de horários na interface assim que eles são agendados.
*   **CT-03 (Regra de Negócio):** Validação de indisponibilidade de datas fora da escala ativa do médico no calendário.
*   **CT-04 (Segurança):** Interceptação de formulários incompletos e validação das mensagens de erro tratadas pelo Zod.

### 📑 Documentação Técnica de QA
O planejamento detalhado da estratégia de testes está centralizado na pasta de governança do projeto:
*   `docs/testing/plano_teste_agendamento_e2e.md`: Estratégia de testes, escopo e ferramentas.
*   `docs/testing/casos_teste_agendamentos.md`: Matriz de testes mapeando entradas, passos e resultados esperados.

### 🏃‍♂️ Como Executar a Suíte de Testes

Certifique-se de que a aplicação está rodando localmente (`npm run dev`) antes de executar os comandos:

```bash
# Executa todos os testes E2E em segundo plano (Headless)
npm run test:e2e

# Abre a Interface Visual Interativa do Playwright (UI Mode)
npm run test:e2e:ui

# Exibe o Relatório HTML detalhado da última execução
npm run test:e2e:report
```

---

## 🏗️ Estrutura do Projeto

```
├── docs/
│   └── testing/            # Plano de Testes e Matriz de Casos de Teste (QA)
├── e2e/                    # Scripts de automação do Playwright
│   ├── setup/              # Hooks de autenticação global e reaproveitamento de sessão
(auth.setup.ts)
│   └── agendamento.spec.ts # Cenários de teste automatizados   
├── src/
│   ├── actions/            # Server Actions (CRUD, agendamento, etc)
│   ├── app/                # Rotas e páginas (App Router)
│   ├── components/         # Componentes reutilizáveis (UI, layouts)
│   ├── db/                 # Schema e acesso ao banco (Drizzle)
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Helpers, autenticação, utils
│   └── ...

```

## 🛡️ Boas Práticas e Diferenciais

- **Clean Code & SOLID**: Código limpo, modular e fácil de manter.
- **Autenticação Persistida**: Configuração do Playwright Storage State para injetar sessões salvas, acelerando a execução dos testes ao evitar logins repetitivos.
- **Tratamento de Hidratação do Next.js**: Uso correto de propriedades de supressão de hidratação para evitar conflitos de sincronismo entre servidores de renderização (SSR) e scripts injetados de automação.
- **Sincronismo Avançado de Elementos**: Uso de seletores baseados em comportamento de acessibilidade e filtros dinâmicos de estado para evitar testes instáveis (*flaky tests*).
- **TypeScript estrito**: Tipagem forte de ponta a ponta, diminuindo erros em tempo de desenvolvimento.

## 🔮 Próximos Passos (Melhorias Futuras)

- **Refatoração para Page Object Model (POM)**: Migrar a estrutura atual de testes para o padrão POM, centralizando seletores e isolando completamente a lógica dos cenários das interações diretas da interface.
- **Pipeline de CI/CD**: Integrar a execução automática dos testes do Playwright ao GitHub Actions para validar o código a cada Pull Request enviado.

## 💡 Por que este projeto é especial?

- **Stack moderna**: Tudo o que há de mais atual no universo React/Next.js.
- **Pronto para o mercado**: Um produto real com foco em resiliência, automação de testes e governança de documentação de qualidade.
- **Foco em DX (Developer Experience)**: Arquitetura limpa pensada para times crescerem mantendo a confiabilidade através de testes automatizados.

---

<p align="center">
  Desenvolvido com ❤️ usando as melhores tecnologias do mercado
</p>
