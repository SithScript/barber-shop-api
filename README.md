# Barbershop Scheduling API – Sistema de Agendamento para Barbearia

## Descrição

API REST desenvolvida para gerenciamento completo de atendimentos, catálogo de serviços e agendamentos de uma barbearia. O objetivo da aplicação é organizar o fluxo de agendamentos de forma escalável e padronizada, prevenindo conflitos de horários, organizando categorias (ex.: Cabelo, Barba, Combos) e seus respectivos serviços, além de fornecer aos clientes e administradores visibilidade sobre status e disponibilidade.

**Objetivo da API:** fornecer endpoints para gerenciar o ciclo de vida completo (CRUD) de categorias, serviços e agendamentos, com persistência no Supabase (PostgreSQL), regras de negócio implementadas em classes ricas de domínio (POO), validações de consistência e conflitos de horários, documentação interativa via Swagger (OpenAPI 3.0) e testes automatizados com Vitest.

---

## Identificação do Projeto e Equipe

* **Projeto:** Barbershop Scheduling API
* **Curso:** Engenharia de Software – 4º Período – Turma B
* **Disciplina:** Desenvolvimento Back-End – UniSenai-PR
* **Docente:** Prof. Mateus Ramos
* **Integrantes da Equipe:**
  * Leofredo M. do Rosario Junior
  * Gustavo Cordeiro de Andrade

---

## Tecnologias e Padrões Utilizados

* **Linguagem & Runtime:** Node.js (v20+ / v22+) & TypeScript
* **Framework Web:** Express 5
* **Banco de Dados:** PostgreSQL (via Supabase Client `@supabase/supabase-js`)
* **Documentação Interativa:** Swagger UI & OpenAPI 3.0 (`swagger-ui-express`, `swagger-jsdoc`)
* **Testes Automatizados:** Vitest com relatório de cobertura (V8) e Supertest
* **Padrões de Arquitetura:**
  * **Repository Pattern:** Separação completa entre regras de negócio e camada de acesso a dados (`CategoryRepository`, `ServiceRepository`, `AppointmentRepository`).
  * **Orientação a Objetos (POO):** Modelos de domínio ricos (`Category`, `Service`, `Appointment`) com atributos privados, encapsulamento, setters com validação e método estático de restauração (`restore`).
  * **Tratamento de Erros Personalizado:** Classes de exceção dedicadas (`ValidationError`, `NotFoundError`).
  * **Prevenção de Conflitos e Inconsistências:** Validação de formato UUID, serviço ativo obrigatório para agendamentos e verificação contra horários duplicados no banco.

---

## Estrutura do Projeto

```text
src/
├── config/             # Conexão com Supabase e especificação do Swagger/OpenAPI
├── controller/         # Manipuladores de requisições e respostas HTTP (Controllers)
├── errors/             # Classes customizadas de erros (ValidationError, NotFoundError)
├── models/             # Classes de domínio com encapsulamento e validações (POO)
├── repository/         # Camada de comunicação com o Supabase (Repository Pattern)
├── routes/             # Definição dos endpoints da API documentados com JSDoc OpenAPI
├── tests/              # Testes unitários e de integração automatizados com Vitest
├── app.ts              # Configuração do Express, Swagger UI, middlewares e rotas
└── server.ts           # Inicialização do servidor HTTP
```

---

## Entidades e Relacionamentos

### Categoria (`categories`)

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | UUID | Identificador único (Chave Primária) |
| `name` | text | Nome da categoria (obrigatório, sem espaços vazios) |
| `description` | text | Descrição detalhada da categoria |
| `created_at` | timestamptz | Data e hora de criação do registro |

### Serviço (`services`)

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | UUID | Identificador único (Chave Primária) |
| `category_id` | UUID | Chave estrangeira referenciando `categories(id)` |
| `name` | text | Nome do serviço (obrigatório) |
| `description` | text | Descrição do procedimento ou corte |
| `price` | numeric(10,2) | Preço do serviço (obrigatório, $\ge 0$) |
| `estimated_minutes` | integer | Duração estimada em minutos (inteiro $> 0$) |
| `is_active` | boolean | Status de ativação do serviço (padrão: `true`) |
| `created_at` | timestamptz | Data e hora de criação do registro |

### Agendamento (`appointments`)

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | UUID | Identificador único (Chave Primária) |
| `service_id` | UUID | Chave estrangeira referenciando `services(id)` |
| `client_name` | text | Nome completo do cliente (obrigatório) |
| `client_phone` | text | Telefone de contato do cliente (obrigatório) |
| `date_time` | timestamptz | Data e horário agendados (obrigatório, sem duplicidade ativa) |
| `status` | text | Status: `agendado`, `finalizado` ou `cancelado` (padrão: `agendado`) |
| `created_at` | timestamptz | Data e hora de criação do registro |

### Relacionamentos
* **Category 1 : N Service** – Uma categoria possui múltiplos serviços. Cada serviço referencia uma categoria obrigatória (`category_id`).
* **Service 1 : N Appointment** – Um serviço pode ter múltiplos agendamentos vinculados. Cada agendamento referencia um único serviço (`service_id`).

---

## Banco de Dados (Supabase / PostgreSQL)

Script SQL para execução no **SQL Editor** do Supabase:

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  estimated_minutes INTEGER NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  date_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'agendado',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## Como Configurar e Executar

### 1. Clonar o repositório
```bash
git clone https://github.com/SithScript/barber-shop-api.git
cd barber-shop-api
```

### 2. Instalar as dependências
```bash
npm install
```

### 3. Configurar variáveis de ambiente
Crie o arquivo `.env` na raiz do projeto:
```env
PORT=3001
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SECRET_KEY=sua-chave-secreta-service-role
```

### 4. Executar a aplicação
* **Modo de desenvolvimento (com auto-reload nativo do Node):**
  ```bash
  npm run dev
  ```
* **Executar a suíte de testes (Vitest):**
  ```bash
  npm test
  ```
* **Executar os testes com relatório de cobertura:**
  ```bash
  npm run test:coverage
  ```
* **Compilação e execução em produção:**
  ```bash
  npm run build
  npm start
  ```

---

## Documentação Interativa com Swagger

Ao iniciar a aplicação, a documentação OpenAPI completa estará disponível em:
* **Interface interativa:** [http://localhost:3001/api-docs](http://localhost:3001/api-docs)
* **Acesso à rota raiz (`/`):** Redireciona automaticamente para `/api-docs`.

---

## Documentação dos Endpoints

### Categorias (`/categories`)

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/categories` | Lista todas as categorias cadastradas |
| `GET` | `/categories/:id` | Retorna uma categoria específica por ID |
| `GET` | `/categories/search/:keyword` | Pesquisa categorias por palavra-chave (nome ou descrição) |
| `POST` | `/categories` | Cadastra uma nova categoria |
| `PUT` | `/categories/:id` | Atualiza os dados de uma categoria existente |
| `DELETE` | `/categories/:id` | Remove uma categoria pelo ID |

### Serviços (`/services`)

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/services` | Lista todos os serviços cadastrados |
| `GET` | `/services/:id` | Retorna um serviço específico por ID |
| `GET` | `/services/category/:categoryId` | Lista todos os serviços de uma categoria específica |
| `GET` | `/services/search/:keyword` | Pesquisa serviços por palavra-chave |
| `POST` | `/services` | Cadastra um novo serviço |
| `PUT` | `/services/:id` | Atualiza dados de um serviço existente |
| `DELETE` | `/services/:id` | Remove um serviço pelo ID |

### Agendamentos (`/appointments`)

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/appointments` | Lista todos os agendamentos cadastrados |
| `GET` | `/appointments/:id` | Retorna um agendamento específico por ID |
| `GET` | `/appointments/service/:serviceId` | Lista agendamentos vinculados a um serviço |
| `POST` | `/appointments` | Cria um novo agendamento com validação de serviço ativo e conflito de horário |
| `PATCH` | `/appointments/:id/status` | Atualiza apenas o status (`agendado`, `finalizado`, `cancelado`) |
| `PUT` | `/appointments/:id` | Atualiza dados gerais de um agendamento existente |
| `DELETE` | `/appointments/:id` | Remove um agendamento pelo ID |

---

## Exemplos de Requisições

### Criar Categoria (`POST /categories`)
```json
{
  "name": "Barba e Rosto",
  "description": "Serviços especializados em cuidados faciais e barba"
}
```

### Criar Serviço (`POST /services`)
```json
{
  "category_id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
  "name": "Barba Terapia Completa",
  "description": "Barba alinhada com toalha quente, hidratação e navalha",
  "price": 40.0,
  "estimated_minutes": 35
}
```

### Criar Agendamento (`POST /appointments`)
```json
{
  "service_id": "b1ffbc88-8c0b-4ef8-bb6d-7bb9bd380a22",
  "client_name": "Lucas Gabriel",
  "client_phone": "41999998888",
  "date_time": "2026-10-15T14:30:00"
}
```

### Atualizar Status (`PATCH /appointments/:id/status`)
```json
{
  "status": "finalizado"
}
```

---

## Códigos de Resposta HTTP

| Código | Significado |
|---|---|
| `200 OK` | Consulta, atualização ou remoção concluída com sucesso |
| `201 Created` | Novo registro criado com sucesso |
| `400 Bad Request` | Falha de validação, parâmetros ausentes/inválidos ou conflito de horário |
| `404 Not Found` | Recurso não encontrado |
| `500 Internal Server Error` | Erro interno do servidor ou falha de conexão |
