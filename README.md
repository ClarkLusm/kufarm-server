#### NestJS MVC boilerplate for rapid development with battle-tested standards.

[Use this template](https://github.com/thisismydesign/nestjs-starter/generate)

## Usage

The deployments below are probably in sleep mode and will take a minute to come online when you open them.

### Dev

```sh
cp .env.example .env
docker-compose up
docker-compose exec web yarn lint
docker-compose exec web yarn test
docker-compose exec web yarn test:request
docker-compose exec web yarn build
docker run -it -v $PWD:/e2e -w /e2e --network="host" --entrypoint=cypress cypress/included:12.2.0 run
```
### Useful commands

Nest CLI:
```
docker-compose exec web yarn nest -- --help
```

TypeORM CLI:
```
docker-compose exec web yarn typeorm -- --help
```

## Requirements

- Node 18
