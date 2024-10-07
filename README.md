
## Project Title
Mei-Ecommerce

## Project Description
This project is a scalable backend server for an e-commerce platform, developed using NestJS. It features a member system, ordering system, product management, and integrates JWT authentication, email notifications, and search query for products and members.

## Features

- **Server Development**: Built a backend server using NestJS, integrating TypeORM for database interactions and PostgreSQL for data storage.
- **CRUD Operations & Pagination**: Implemented CRUD operations, pagination, and search functionality to enhance data retrieval and management.
- **API Design**: Designed RESTful APIs and documented them using Swagger to communication of endpoint functionality.
- **Data Consistency**: Utilized database transactions to ensure data integrity and consistency across operations.
- **Logging & Monitoring**: Integrated a logging system for tracking of system activities and error management, facilitating effective monitoring and debugging.
- **Testing & Reliability**: Conducted end-to-end (E2E) testing using Jest to validate the reliability and performance of API endpoints.
- **Background Job Management**: Leveraged Bull for managing background jobs and task queues, enabling asynchronous email sending.
- **Event-Driven Architecture**: Employed EventEmitter to establish an event-driven architecture, streamlining modular handling of system events such as user registration and order creation.
- **Authentication**: Implemented JWT-based authentication to secure access to member-specific content.
- **Payment Integration**: Integrated the LinePay payment gateway to facilitate secure and seamless payment transactions.
- **Caching Strategies**: Employed Redis for caching strategies to store login sessions, ensuring quick access and scalability.
- **Schema Management**: Utilized TypeORM migrations for managing database schema changes, ensuring smooth deployment of updates without disrupting the production environment.
- **Containerization**: Used Docker and Docker Compose for consistent development and deployment across environments.

## Technologies
- NestJS: Framework for building the server-side application.
- TypeORM: ORM for interacting with PostgreSQL databases.
- PostgreSQL: Database for storing application data.
- Redis: Used for caching and session management.
- Bull: Background job queue for handling asynchronous tasks.
- Swagger: API documentation.
- Docker: Containerization for development and deployment.
- Jest: End-to-end testing.

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
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
