# 📋 Desafio Fullstack Integrado - BIP

![Java](https://img.shields.io/badge/Java-17-orange.svg)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen.svg)
![Angular](https://img.shields.io/badge/Angular-21-red.svg)
![EJB](https://img.shields.io/badge/EJB-3.2-blue.svg)

Este repositório contém a solução para o Desafio Fullstack Integrado, que engloba o desenvolvimento de uma aplicação completa em camadas (Banco de Dados, EJB, Backend Spring Boot e Frontend Angular).

## 📑 Índice

- [Objetivo do Desafio](#-objetivo-do-desafio)
- [Arquitetura e Tecnologias](#-arquitetura-e-tecnologias)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Solução Implementada](#-solução-implementada)
  - [Correção do Bug no EJB](#correção-do-bug-no-ejb)
  - [Backend (Spring Boot)](#backend-spring-boot)
  - [Frontend (Angular)](#frontend-angular)
- [Como Executar](#-como-executar)
  - [Pré-requisitos](#pré-requisitos)
  - [Passo a Passo](#passo-a-passo)
- [Como Rodar os Testes](#-como-rodar-os-testes)
- [Documentação da API (Swagger)](#-documentação-da-api-swagger)

---

## 🎯 Objetivo do Desafio

Criar uma solução completa em camadas, corrigindo um bug crítico de concorrência e regras de negócio em um serviço EJB legado, e entregando uma aplicação funcional com backend moderno e frontend responsivo.

## 🏗️ Arquitetura e Tecnologias

O projeto foi desenvolvido utilizando as seguintes tecnologias:

- **Banco de Dados:** H2 Database (em memória para facilitar a execução local) / Scripts SQL padrão.
- **Módulo EJB (`ejb-module`):** Java EE, EJB 3.2, JPA (Hibernate). Responsável pelas regras de negócio críticas e transações complexas.
- **Backend (`backend-module`):** Java 17, Spring Boot 3, Spring Data JPA, Spring Web, OpenAPI/Swagger. Arquitetura Hexagonal / Clean Architecture adaptada.
- **Frontend (`frontend`):** Angular 21, TypeScript, HTML5, CSS3, RxJS.
- **Testes:** JUnit 5, Mockito, Jest (Frontend).

## 📂 Estrutura do Projeto

O repositório está organizado nos seguintes módulos:

- `db/`: Scripts de criação de schema e carga inicial de dados (seed).
- `ejb-module/`: Módulo contendo o serviço EJB com as regras de negócio de transferência.
- `backend-module/`: Aplicação Spring Boot que expõe a API REST e integra com o módulo EJB.
- `frontend/`: Aplicação SPA (Single Page Application) desenvolvida em Angular.
- `docs/`: Documentação adicional do projeto.

Na **raiz do repositório**, arquivos como `PROMPT_DEV_v4.md`, `PROMPT_EF_ET_v4.md`, `especificacao_funcional.html` e `especificacao_tecnica.html` estão no **`.gitignore`** (instruções ou especificações locais / internas). Para documentação oficial versionada, use `docs/` ou outro caminho acordado com o time.

---

## ✅ Solução Implementada

### Correção do Bug no EJB (`ejb-module`)
O serviço `BeneficioEjbService` possuía falhas graves na operação de transferência. As seguintes correções foram aplicadas:
- **Validações de Entrada:** Verificação de contas de origem e destino nulas ou iguais, e valores de transferência inválidos (menores ou iguais a zero).
- **Verificação de Saldo:** Garantia de que a conta de origem possui saldo suficiente antes de realizar o débito.
- **Controle de Concorrência (Locking):** Implementação de `LockModeType.PESSIMISTIC_WRITE` nas consultas para evitar condições de corrida (race conditions) durante transferências simultâneas.
- **Controle Otimista:** Adição da anotação `@Version` na entidade para controle de concorrência otimista.
- **Transações Seguras:** Uso de exceções de negócio específicas que disparam o rollback transacional em caso de falha.

### Backend (Spring Boot)
- Desenvolvimento de uma API RESTful completa para o gerenciamento de `Beneficio` (CRUD).
- Criação de um endpoint específico para transferência de saldo, que delega a execução para o `BeneficioEjbService`.
- Tratamento global de exceções utilizando `@RestControllerAdvice` para padronizar as respostas de erro da API.
- Documentação interativa da API gerada automaticamente com Swagger/OpenAPI.

### Frontend (Angular)
- Interface de usuário intuitiva e responsiva.
- Funcionalidades implementadas:
  - Listagem de todos os benefícios cadastrados.
  - Criação de novos benefícios.
  - Edição de benefícios existentes.
  - Exclusão de benefícios.
  - Interface dedicada para realizar transferências de saldo entre benefícios.

---

## 🚀 Como Executar

### Pré-requisitos
Certifique-se de ter as seguintes ferramentas instaladas em sua máquina:
- [Java 17](https://adoptium.net/) — **versão oficial do build** (`<java.version>17</java.version>` no Maven). JDKs mais novos (21+) costumam funcionar, mas o módulo `ejb-module` fixa versões de **Byte Buddy** e **Mockito** para testes compatíveis com bytecode mais recente; qualquer upgrade dessas bibliotecas deve ser feito nas propriedades `byte-buddy.version` e `mockito.version` no `pom.xml` raiz.
- [Maven 3.8+](https://maven.apache.org/)
- [Node.js 18+](https://nodejs.org/) e npm (ou [Bun](https://bun.sh/) — os scripts em `frontend/package.json` funcionam com `npm run` / `bun run`)
- [Angular CLI](https://angular.io/cli) (Opcional, mas recomendado)

**Reprodutibilidade:** em CI ou equipe, alinhe o JDK ao **17** salvo decisão explícita de suportar outra versão e validar `mvn verify` nela.

### Passo a Passo

#### 1. Banco de Dados
Para execução local, o backend já está configurado para inicializar um banco de dados H2 em memória e executar os scripts equivalentes aos encontrados na pasta `db/` (`schema.sql` e `data.sql` em `src/main/resources`).
*Caso deseje utilizar outro banco, execute os scripts `db/schema.sql` e `db/seed.sql` manualmente e altere as configurações no `application.yml`.*

#### 2. Compilar e Executar o Backend

Na raiz do projeto, execute o build completo com o Maven:

```bash
mvn clean install
```

Em seguida, inicie a aplicação Spring Boot:

```bash
mvn -f backend-module spring-boot:run
```

O backend estará disponível em: `http://localhost:8082`

#### 3. Executar o Frontend

Abra um novo terminal, navegue até a pasta do frontend e instale as dependências:

```bash
cd frontend
npm install
```

Inicie o servidor de desenvolvimento do Angular:

```bash
npm start
```

O frontend estará disponível em: `http://localhost:4200`

---

## 🧪 Como Rodar os Testes

O projeto conta com uma suíte de testes automatizados para garantir a qualidade e o funcionamento correto das regras de negócio.

### Testes do Backend (Unitários e Integração)
Na raiz do projeto ou dentro da pasta `backend-module`, execute:

```bash
mvn test
```
*Os testes cobrem cenários de sucesso na transferência, bloqueio por saldo insuficiente e validações de payload.*

### Testes do Frontend
Dentro da pasta `frontend`, execute:

```bash
npm test
```

---

## 📖 Documentação da API (Swagger)

Com o backend em execução, você pode acessar a documentação interativa da API REST através do Swagger UI:

👉 **[Acessar Swagger UI](http://localhost:8082/swagger-ui/index.html)**

### Endpoints Principais

- `GET /api/v1/beneficios` - Lista todos os benefícios.
- `GET /api/v1/beneficios/{id}` - Busca um benefício pelo ID.
- `POST /api/v1/beneficios` - Cria um novo benefício.
- `PUT /api/v1/beneficios/{id}` - Atualiza um benefício existente.
- `DELETE /api/v1/beneficios/{id}` - Remove um benefício.
- `POST /api/v1/beneficios/transfer` - Realiza a transferência de saldo entre dois benefícios.

#### Campo opcional `cnpj` (CNPJ alfanumérico)

Nos payloads de **criação** e **atualização** e nas **respostas** JSON de benefício, o campo `cnpj` é **opcional**. Valores `null`, omitido ou apenas espaços em branco são aceitos no envio; quando preenchido, o backend valida com a anotação **`@ValidCnpjAlfanumerico`** (`ValidCnpjAlfanumericoValidator`), que delega a **`CnpjAlfanumerico`**: na entrada, só são permitidos alfanuméricos e os separadores da máscara (`.`, `/`, `-`) e espaços; em seguida remove separadores, normaliza para maiúsculas (`Locale.ROOT`), exige **14 caracteres** no padrão **`[A-Z0-9]{12}[0-9]{2}`** e confere os **dígitos verificadores módulo 11**, alinhado ao frontend (`frontend/src/app/core/utils/cnpj-alfanumerico.ts`).

**Persistência:** o domínio grava o CNPJ **sem máscara**, apenas **14 caracteres alfanuméricos em maiúsculas** (ex.: `12ABC34501DE35`). A API pode receber com ou sem máscara; nas respostas JSON o valor segue o formato armazenado. O frontend formata na listagem para leitura humana e permite busca com ou sem máscara.

**Exemplos mínimos** (`POST` ou `PUT`; demais campos conforme contrato da API):

```json
{
  "nome": "Benefício Exemplo",
  "descricao": "Descrição",
  "valor": 100.0,
  "ativo": true,
  "cnpj": null
}
```

```json
{
  "nome": "Benefício Exemplo",
  "descricao": "Descrição",
  "valor": 100.0,
  "ativo": true,
  "cnpj": "12.ABC.345/01DE-35"
}
```

O mesmo CNPJ válido pode ser enviado já normalizado (equivalente ao que fica no banco):

```json
{
  "nome": "Benefício Exemplo",
  "descricao": "Descrição",
  "valor": 100.0,
  "ativo": true,
  "cnpj": "12ABC34501DE35"
}
```

Para **schemas**, parâmetros e testes interativos, use o **Swagger UI** indicado acima ou o documento **OpenAPI** exposto pelo SpringDoc (por exemplo `http://localhost:8082/v3/api-docs`), com o backend em execução.

**Frontend:** na listagem de benefícios, a **busca global** da tabela considera nome, descrição, valor e CNPJ (incluindo variantes com e sem máscara via campos derivados).

**Produção:** defina `JWT_SECRET` (e demais variáveis de segurança) no ambiente; não use segredos padrão de perfil `local` em produção.
