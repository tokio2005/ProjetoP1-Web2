# API de Produtos - P1

API REST em Node.js, Express e TypeORM (TypeScript) com MySQL. Implementa o CRUD de **categorias**, **situações de produtos** e **produtos**, com migrations, seeds e paginação.

## Tecnologias
- Node.js, Express, TypeScript
- TypeORM, MySQL
- dotenv
- Postman (testes)

## Como executar

1. Instale as dependências:
```bash
npm install
```

2. Crie o arquivo `.env` na raiz, copiando o `.env.example`, e preencha com os dados do seu MySQL:
```
PORT=8080
DB_DIALECT=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=sua_senha
DB_DATABASE=nodeapi
```

3. Crie o banco de dados no MySQL (`CREATE DATABASE nodeapi;`).

4. Compile o projeto:
```bash
npx tsc
```

5. Execute as migrations:
```bash
npx typeorm migration:run -d dist/data-source.js
```

6. Execute os seeds:
```bash
node dist/run-seeds.js
```

7. Inicie o servidor:
```bash
node dist/index.js
```

O servidor sobe em `http://localhost:8080`.

## Estrutura do projeto
```
src/
  controllers/   -> rotas e lógica do CRUD
  entity/        -> entidades (tabelas)
  migration/     -> criação das tabelas
  seeds/         -> dados iniciais
  services/      -> PaginationService (paginação)
  data-source.ts -> configuração do banco
  run-seeds.ts   -> execução dos seeds
  index.ts       -> inicialização da API
postman/         -> coleção de testes do Postman
```

## Banco de dados
- `product_categories` (id, name, createdAt, updatedAt)
- `product_situations` (id, name, createdAt, updatedAt)
- `products` (id, name, productSituationId, productCategoryId, createdAt, updatedAt)

Uma categoria e uma situação podem ter vários produtos. Uma categoria ou situação que possui produtos não pode ser excluída (retorna 409).

## Endpoints

Todos os recursos seguem o mesmo padrão:

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/recurso?page=1&limit=10` | Lista paginada |
| GET | `/recurso/:id` | Visualiza um registro |
| POST | `/recurso` | Cadastra |
| PUT | `/recurso/:id` | Edita |
| DELETE | `/recurso/:id` | Exclui |

Recursos: `/categories`, `/product-situations` e `/products`.

Exemplo de corpo para `POST /products`:
```json
{ "name": "Notebook", "productSituationId": 1, "productCategoryId": 1 }
```

### Paginação
`GET /products?page=2&limit=5` retorna:
```json
{
  "data": [],
  "pagination": {
    "currentPage": 2,
    "perPage": 5,
    "totalItems": 25,
    "lastPage": 5,
    "prevPage": 1,
    "nextPage": 3
  }
}
```

### Códigos de resposta
200 (sucesso), 201 (criado), 400 (dados inválidos), 404 (não encontrado), 409 (registro vinculado a outros).

## Testes no Postman
A coleção está em `postman/`. Para usar:
1. No Postman, clique em **Import** e selecione o arquivo da pasta `postman/`.
2. Confira a variável `host` da coleção (`http://localhost:8080`).
3. Com o servidor rodando, execute as requisições de cada pasta.