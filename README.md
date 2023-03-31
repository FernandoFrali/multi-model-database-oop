# Criar e executar container Postgres

docker run \
 --name postgres \
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

## Criar e executar container adminer (client sql)

docker run \
 --name adminer \
 -p 8080:8080 \
 --link postgres:postgres \
 -d \
 adminer

# Criar container MongoDB

docker run \
 --name mongodb \
 -p 27017:27017 \
 -e MONGO_INITDB_ROOT_USERNAME=admin \
 -e MONGO_INITDB_ROOT_PASSWORD=pass \
 -d \
 mongo:4

## Mongo Client

docker run \
 --name mongoclient \
 -p 3000:3000 \
 --link mongodb:mongodb \
 -d \
 mongoclient/mongoclient

## DB

docker exec -it mongodb \
 mongo --host localhost -u admin -p pass --authenticationDatabase admin \
 --eval "db.getSiblingDB('cars').createUser({user: 'nandin', pwd: 'mypass', roles: [{role: 'readWrite', db: 'cars'}]})"
