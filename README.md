# Criar e executar container Postgres
docker run \
    --name  postgres \
    -e POSTGRES_USER=frali \
    -e POSTGRES_PASSWORD=pass \
    -e POSTGRES_DB=cars \
    -p 5432:5432 \
    -d \
    postgres

## Lista os containers em execução
docker ps

### Abre o terminal do postgres
docker exec -it postgres /bin/bash

## Criar e executar container adminer
docker run \
    --name adminer \
    -p 8080:8080 \
    --link postgres:postgres \
    -d \
    adminer

# Criar container MongoDB
