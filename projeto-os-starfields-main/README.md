[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/x0qOpVsN)

# 🚀 Projeto Phaser + React + Spring Boot WebSocket

Este projeto consiste em um jogo desenvolvido com **Phaser** no frontend (**React**) e um backend em **Spring Boot**, que utiliza **WebSockets** para comunicação em tempo real. O banco de dados utilizado é o **PostgreSQL** rodando via **Docker**.

---
## Usando Docker & Docker Compose
1. Verifique se as portas expostas no arquivo `docker-compose.yml` localizado na raiz do projeto estão disponíveis no seu computador.
2. Abra o terminal na pasta diretório do projeto (ex.: `cd caminho_da_pasta`).
3. Execute o comando `docker-compose up -d` ou `docker-compose up --build`.
4. Use o navegador para acessar a url do jogo definida no `docker-compose.yml`, que ,por padrão, é `localhost:3000`. 

## Instalação Manual
### ✅ **Pré-requisitos**

Antes de iniciar, você precisa instalar os seguintes programas:

1. **Node.js** (v20.16.0 ou superior)
    - [Download](https://nodejs.org/)
    - Verificar instalação:
      ```sh
      node -v
      npm -v
      ```

2. **Java JDK** (versão 17 ou superior)
    - [Download](https://adoptium.net/)
    - Verificar instalação:
      ```sh
      java -version
      ```

3. **Maven** (caso não esteja embutido no JDK)
    - [Download](https://maven.apache.org/download.cgi)
    - Verificar instalação:
      ```sh
      mvn -version
      ```

4. **Docker** (para rodar o PostgreSQL)
    - [Download](https://www.docker.com/get-started)
    - Verificar instalação:
      ```sh
      docker --version
      ```

---

## 🛠 **Instalação e Execução**

### **1️⃣ Clonar o repositório**
```sh
git clone https://github.com/seu-usuario/seu-repositorio.git
```

### **Executa o Backend**

#### Instalar dependências e compilar
```sh
mvn clean install
```

#### Rodar o Backend
```sh
mvn spring-boot:run

```

Obs: O servidor será iniciado em http://localhost:8080


### **Executa o Frontend**

#### Instalar dependências e compilar
```sh
cd frontend
npm install
```

#### Rodar o Backend
```sh
npm start
```

Obs: O projeto será aberto no navegador em http://localhost:3000

### **Executa o Banco de Dados**

#### Para rodar o docker
```sh
docker compose up -d
```


#### Autores

- Matheus Victor Fontes Santos
- Willian
- Caio
- Rafael
