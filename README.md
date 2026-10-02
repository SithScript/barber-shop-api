# Barbershop Scheduling API

API REST para gerenciamento de agendamentos de barbearia, desenvolvida como atividade prática supervisionada (APS) para a disciplina de **Desenvolvimento BackEnd**, do curso de **Engenharia de Software** da **UniSenai-PR**, sob orientação do **Prof. Mateus Ramos**.

---

## 1. Nome e Descrição do Projeto

**Barbershop Scheduling API**

- **Problema que busca resolver:** O agendamento manual de barbearias costuma gerar conflitos de horários, falta de padronização na listagem de serviços e dificuldades no acompanhamento do status do atendimento.
- **Domínio escolhido:** Prestação de serviços e agendamentos para barbearias.
- **Objetivo da API:** Fornecer uma interface centralizada e estruturada para gerenciar categorias de serviços, catálogo de cortes e tratamentos, e o fluxo completo de agendamento de horários dos clientes.

---

## 2. Integrantes da Equipe

- Leofredo M. do Rosario Junior
- Gustavo Cordeiro de Andrade

---

## 3. Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript no servidor.
- **TypeScript**: Superset do JavaScript que adiciona tipagem estática e segurança ao código.
- **Express**: Framework web para gerenciamento de rotas, middlewares e requisições HTTP.
- **Supabase**: Backend-as-a-Service utilizado para persistência dos dados em banco PostgreSQL.
- **PostgreSQL**: Banco de dados relacional.
- **TSX**: Executor TypeScript em tempo de desenvolvimento.
- **Git**: Sistema de controle de versão.

---

## 4. Entidades e Relacionamento

### Entidades

#### Categoria (`Category`)
- `id`: Identificador único (UUID).
- `name`: Nome da categoria (ex: Cabelo, Barba, Combos).
- `description`: Descrição detalhada da categoria.
- `created_at`: Data de criação do registro.

#### Serviço (`Service`)
- `id`: Identificador único (UUID).
- `category_id`: Chave estrangeira que referencia a Categoria.
- `name`: Nome do serviço (ex: Corte Social, Barba Completa).
- `price`: Preço do serviço.
- `estimated_minutes`: Tempo estimado de duração em minutos.
- `created_at`: Data de criação do registro.

#### Agendamento (`Appointment`)
- `id`: Identificador único (UUID).
- `service_id`: Chave estrangeira que referencia o Serviço.
- `client_name`: Nome do cliente.
- `client_phone`: Telefone do cliente.
- `date_time`: Data e horário agendados.
- `status`: Status do agendamento (`scheduled`, `completed`, `canceled`).
- `created_at`: Data de criação do registro.

### Relacionamentos

- **Categoria -> Serviço**: Uma Categoria pode possuir vários Serviços, e cada Serviço pertence obrigatoriamente a uma Categoria (1:N).
- **Serviço -> Agendamento**: Um Serviço pode estar associado a vários Agendamentos, e cada Agendamento refere-se a um único Serviço (1:N).

---

## 5. Estrutura do Projeto

O código-fonte segue o padrão arquitetural em camadas (MVC / Repository Pattern) conforme trabalhado em sala de aula:

```text
src/
├── config/
│   └── supabase.ts          # Configuração e conexão do cliente Supabase
├── controllers/
│   ├── appointment.controller.ts
│   ├── category.controller.ts
│   └── service.controller.ts # Gerenciamento de req/res, erros e status HTTP
├── models/
│   ├── appointment.model.ts
│   ├── category.model.ts
│   └── service.model.ts     # Interfaces e definições de tipos TypeScript
├── repositories/
│   ├── appointment.repository.ts
│   ├── category.repository.ts
│   └── service.repository.ts # Camada de comunicação direta com o Supabase
├── routes/
│   ├── appointment.routes.ts
│   ├── category.routes.ts
│   └── service.routes.ts    # Mapeamento das rotas e verbos HTTP
├── app.ts                    # Configuração da aplicação e middlewares Express
└── server.ts                 # Inicialização do servidor HTTP


Aqui está o conteúdo do **tópico 6 até o final**, formatado em Markdown pronto para você copiar e colar diretamente no seu `README.md`:

```markdown
## 6. Configuração e Execução

### Passos para execução:

1. **Clonar o repositório:**
   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd barber-shop-api

```

2. **Instalar as dependências:**
```bash
npm install

```


3. **Configurar as variáveis de ambiente:**
Crie um arquivo `.env` na raiz do projeto com base no arquivo `.env.example` fornecido.
4. **Iniciar a aplicação em modo de desenvolvimento:**
```bash
npm run dev

```



---

## 7. Variáveis de Ambiente

Para executar a aplicação é necessário criar o arquivo `.env` contendo as credenciais do Supabase:

```env
SUPABASE_URL=[https://seu-projeto.supabase.co](https://seu-projeto.supabase.co)
SUPABASE_KEY=sua-chave-anon-publica
PORT=3001

```

> **Atenção:** O arquivo `.env` contendo as chaves reais de acesso **não deve** ser enviado ao controle de versão Git. Utilize o arquivo `.env.example` no repositório.

---

## 8. Banco de Dados

A persistência de dados utiliza tabelas relacionais no PostgreSQL hospedado pelo Supabase.

### Tabela `categories`

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

```

### Tabela `services`

```sql
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  estimated_minutes INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

```

### Tabela `appointments`

```sql
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES services(id) ON DELETE RESTRICT,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  date_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

```

---

## 9. Documentação dos Endpoints

| Método | Endpoint | Descrição | Dados Necessários |
| --- | --- | --- | --- |
| **GET** | `/categories` | Lista todas as categorias | Nenhum |
| **GET** | `/categories/:id` | Consulta uma categoria por ID | Params: `id` |
| **POST** | `/categories` | Cadastra uma nova categoria | Body JSON: `name`, `description` |
| **PUT** | `/categories/:id` | Atualiza uma categoria | Params: `id`, Body JSON |
| **DELETE** | `/categories/:id` | Remove uma categoria | Params: `id` |
| **GET** | `/services` | Lista todos os serviços | Nenhum |
| **GET** | `/services/:id` | Consulta um serviço por ID | Params: `id` |
| **POST** | `/services` | Cadastra um novo serviço | Body JSON: `category_id`, `name`, `price`, `estimated_minutes` |
| **PUT** | `/services/:id` | Atualiza um serviço | Params: `id`, Body JSON |
| **DELETE** | `/services/:id` | Remove um serviço | Params: `id` |
| **GET** | `/appointments` | Lista todos os agendamentos | Nenhum |
| **GET** | `/appointments/:id` | Consulta um agendamento por ID | Params: `id` |
| **POST** | `/appointments` | Cria um novo agendamento | Body JSON: `client_name`, `client_phone`, `service_id`, `date_time` |
| **PUT** | `/appointments/:id` | Atualiza dados de um agendamento | Params: `id`, Body JSON |
| **PATCH** | `/appointments/:id/status` | Atualiza o status do agendamento | Params: `id`, Body JSON: `status` |
| **DELETE** | `/appointments/:id` | Remove um agendamento | Params: `id` |

---

## 10. Exemplos de Requisições

### Criação de Categoria (`POST /categories`)

```json
{
  "name": "Cabelo",
  "description": "Cortes e tratamentos capilares diversos"
}

```

### Criação de Serviço (`POST /services`)

```json
{
  "category_id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
  "name": "Corte Degradê",
  "price": 45.00,
  "estimated_minutes": 40
}

```

### Criação de Agendamento (`POST /appointments`)

```json
{
  "client_name": "Lucas Gabriel",
  "client_phone": "41999998888",
  "service_id": "b1ffbc88-8c0b-4ef8-bb6d-7bb9bd380a22",
  "date_time": "2026-10-15T14:30:00"
}

```

### Atualização de Status (`PATCH /appointments/:id/status`)

```json
{
  "status": "completed"
}

```
