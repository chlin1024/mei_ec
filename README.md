## Project Title

Mei-Ecommerce

## Technologies

NestJS, PostgreSQL, Redis, TypeORM, Bull, NodeMailer, Line Pay API, Jest, Seed, Swagger, Docker

## Project Description

This project is a scalable backend server for an e-commerce platform, developed using NestJS. It features a member system, ordering system, product management.

## Features

- **Server Development**: Built a backend server using NestJS, integrating TypeORM for database interactions and PostgreSQL for data storage.
- **API Design**: Designed RESTful APIs and documented them using Swagger to communication of endpoint functionality.
- **Data Consistency**: Utilized database transactions to ensure data integrity and consistency across operations.
- **Logging & Monitoring**: Integrated a logging system for tracking of system activities and error management, facilitating effective monitoring and debugging.
- **Authentication**: Implemented JWT-based authentication to secure access to member-specific content.
- **Payment Integration**: Integrated the LinePay payment gateway to facilitate secure and seamless payment transactions.
- **Caching Strategies**: Employed Redis for caching strategies to store login sessions, ensuring quick access and scalability.
- **Event-Driven Architecture**: Employed EventEmitter to establish an event-driven architecture, streamlining modular handling of system events such as user registration and order
- **Background Job Management**: Leveraged Bull for managing background jobs and task queues, enabling asynchronous email sending.
- **Schema Management**: Utilized TypeORM migrations for managing database schema changes, ensuring smooth deployment of updates without disrupting the production environment.
- **Testing & Reliability**: Conducted end-to-end (E2E) testing using Jest to validate the reliability and performance of API endpoints.
- **Containerization**: Used Docker and Docker Compose for consistent development and deployment across environments.

## System Architecture

![system architecture](./system%20architecture.png)

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

# create .env file (reference to .env.example)
$ cp .env.example .env

# run database migration
$ npm run typeorm migration:run

# run with docker(optional)
$ docker-compose up

```

## Test

```bash
# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Future Features

...
