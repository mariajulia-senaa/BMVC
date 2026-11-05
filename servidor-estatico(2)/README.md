# Servidor estático com NGINX (via Docker)

Estrutura:

```
servidor-estatico/
├── Dockerfile
├── docker-compose.yml
└── site/
    ├── login.html        (tela de login)
    ├── index.html        (sistema: cardápio, pedido e CRUD)
    ├── css/style.css
    ├── img/cafeteria.jpg   (SUA FOTO de fundo - coloque aqui)
    └── js/
        ├── auth.js       (login/logout e proteção da página)
        └── script.js     (CRUD do cardápio + pedido)
```

## Como rodar

Pré-requisito: Docker Desktop instalado e aberto.

Opção A – docker compose:
```
cd servidor-estatico
docker compose up --build
```

Opção B – só docker:
```
cd servidor-estatico
docker build -t cafe-dojo .
docker run -d -p 8080:80 --name cafe-dojo cafe-dojo
```

Opção C – sem Dockerfile (montando a pasta):
```
docker run -d -p 8080:80 -v "%cd%/site:/usr/share/nginx/html:ro" nginx:alpine
```
(No PowerShell use `${PWD}/site`; no Linux/Mac use `$(pwd)/site`.)

Abra: http://localhost:8080

## Parar
```
docker compose down
# ou
docker stop cafe-dojo && docker rm cafe-dojo
```

## Login
Usuários de demonstração: `admin` / `1234` e `atendente` / `cafe`.

## CRUD
Em "Gerenciar cardápio": cadastrar (Create), listar na tabela (Read),
editar (Update) e excluir (Delete) itens. Os dados ficam no `localStorage`
do navegador, então sobrevivem ao recarregar a página.

Obs.: o login é feito no navegador (didático). Em um sistema real a
autenticação precisa ser validada em um back-end.
