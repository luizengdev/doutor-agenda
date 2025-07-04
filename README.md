# 🩺 Doutor Agenda

Doutor Agenda é um SaaS moderno e robusto para gestão de clínicas, médicos, pacientes e agendamentos, desenvolvida com as melhores práticas do ecossistema React/Next.js. O projeto foi desenhado para ser escalável, seguro, intuitivo e com foco total em experiência do usuário e produtividade do time de desenvolvimento.

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

## ✨ Funcionalidades

- Cadastro e gerenciamento de clínicas, médicos e pacientes
- Agendamento de consultas com seleção de horários disponíveis
- Validação de formulários com feedback instantâneo
- Máscara de inputs para telefone e valores monetários
- Autenticação segura e controle de acesso por clínica
- UI responsiva, acessível e elegante
- Server Actions e Server Components para máxima performance
- Listagens dinâmicas com DataTable e ações rápidas (editar, excluir)

## 📸 Screenshots

<p align="center">
<img width="1478" height="903" alt="Image" src="https://github.com/user-attachments/assets/f7d89e61-e34f-4bec-83b6-98beaed898f7" />
  <img width="1489" height="903" alt="Image" src="https://github.com/user-attachments/assets/b281aab5-8525-4a9d-9b9f-15f0af34e540" />
</p>

## 🧑‍💻 Como rodar localmente

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/doutor-agenda.git
cd doutor-agenda

# Instale as dependências
npm install

# Configure as variáveis de ambiente (exemplo em .env.example)
cp .env.example .env

# Rode as migrations do banco
npm run db:migrate

# Inicie o projeto
npm run dev
```

**Acesse:** http://localhost:3000

## 🏗️ Estrutura do Projeto

```
├── src/
│   ├── actions/           # Server Actions (CRUD, agendamento, etc)
│   ├── app/               # Rotas e páginas (App Router)
│   ├── components/        # Componentes reutilizáveis (UI, layouts)
│   ├── db/                # Schema e acesso ao banco (Drizzle)
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Helpers, autenticação, utils
│   └── ...
├── public/                # Assets estáticos
├── package.json
├── tailwind.config.js
└── ...
```

## 🛡️ Boas Práticas e Diferenciais

- **Clean Code & SOLID**: código limpo, modular e fácil de manter
- **TypeScript estrito**: tipagem forte em todo o projeto
- **Componentização inteligente**: DRY, reuso e isolamento de responsabilidades
- **Acessibilidade**: foco em usabilidade para todos
- **Performance**: Server Actions, SSR, otimização de queries
- **Testes**: fácil integração com ferramentas de testes modernos

## 💡 Por que este projeto é especial?

- **Stack moderna**: tudo que há de mais atual no universo React/Next.js
- **Experiência real de produto**: pronto para produção, com autenticação, permissões e flows reais
- **Foco em DX (Developer Experience)**: arquitetura pensada para times crescerem rápido
- **Documentação clara**: fácil de entender, fácil de contribuir

---

<p align="center">
  Desenvolvido com ❤️ usando as melhores tecnologias do mercado
</p>
