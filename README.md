# How to run:

## This is a multi-model database project: OOP API with authentication (JWT) and documentation (Swagger).

_Instructions to access NoSQL and SQL local clients are on bottom of the page!

### How to run:

Just is required <a href="https://www.docker.com/"><strong>Docker (and docker-compose)</strong></a> and <a href="https://nodejs.org/en/download"><strong>Node</strong></a>.

1. First of all, go to project root path on your terminal. Example:
```
cd strategy-multi-datasources
```

2. Mount the images and containers with docker-compose
```
docker-compose up
```

3. Install dependencies
```
npm install
```

4. Run project with node
```
npm start
```

> **Note**
> When you use "docker-compose up" to mount image and containers, a NoSQL Client and SQL Client becomes up with Postgres and MongoDB container.
> If you want to access it, is possible with: http://localhost:8080 (adminer) and http://localhost:3000 (mongodb). User and password can be find on docker-compose file, but just do that if you know how to!
> </br>

_Now you can access API and Documentation on "http://localhost:4040/cars" and "http://localhost:4040/documentation".

