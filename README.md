# Library Management API

This project is a RESTful API for managing a library's users, books, and borrowing operations. It is built using Node.js, Express, TypeScript, and Prisma ORM with a PostgreSQL database. The API allows you to manage library members, list and view books, borrow and return books, and track users' borrowing history.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Running Tests](#running-tests)
- [API Documentation](#api-documentation)
- [Docker Setup](#docker-setup)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Management**: List all users, view a user's borrowed books, create new users.
- **Book Management**: List all books, view book details, create new books.
- **Borrowing Operations**: Borrow books, return books with ratings.
- **Error Handling**: Comprehensive error handling for invalid operations.
- **Request Validation**: Ensures data integrity using `express-validator`.
- **Swagger API Documentation**: Auto-generated API documentation.

## Tech Stack

- **Node.js**: JavaScript runtime.
- **Express**: Web framework for Node.js.
- **TypeScript**: Type-safe JavaScript.
- **Prisma**: ORM for Node.js and TypeScript.
- **PostgreSQL**: Relational database.
- **Jest**: Testing framework.
- **Docker**: Containerization platform.

## Project Structure

```plaintext
.
├── src
│   ├── config          # Configuration files (e.g., Swagger)
│   ├── controllers     # Route handlers
│   ├── middlewares     # Express middlewares (validation, error handling)
│   ├── routes          # API route definitions
│   ├── utils           # Utility functions and custom error classes
│   └── index.ts        # Application entry point
├── prisma              # Prisma schema and migrations
├── tests               # Unit tests for controllers
├── Dockerfile          # Docker configuration
├── docker-compose.yml  # Docker Compose configuration
├── entrypoint.sh       # Entrypoint script for Docker
├── .env.example        # Example environment variables file
├── README.md           # Project documentation
└── package.json        # NPM dependencies and scripts
```

## Installation

### Prerequisites

- **Node.js**: Make sure you have Node.js installed (v18.x recommended).
- **PostgreSQL**: Ensure PostgreSQL is installed and running.

### Steps

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/library-management-api.git
   cd library-management-api
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Copy the environment variables file**:

   ```bash
   cp .env.example .env
   ```

4. **Set up environment variables**: Update the `.env` file with your database connection details and other necessary environment variables.

## Environment Variables

The environment variables are stored in the `.env` file. Here are the key variables:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/mydatabase
PORT=3000
NODE_ENV=development
```

## Database Setup

1. **Prisma Initialization**: Initialize Prisma and generate the client.

   ```bash
   npx prisma generate
   ```

2. **Run Migrations**: Apply migrations to your PostgreSQL database.

   ```bash
   npx prisma migrate dev --name init
   ```

3. **Seed the Database** (optional): Add initial data to your database if necessary.

## Running the Application

### Development

To run the application in development mode:

```bash
npm run dev
```

This command will start the server with hot-reloading using `nodemon` and `ts-node`.

### Production

To build and run the application in production mode:

```bash
npm run build
npm start
```

## Running Tests

To run the unit tests:

```bash
npm test
```

This command will execute the Jest test suite, including all tests in the `tests` directory.

## API Documentation

The API is documented using Swagger. After starting the application, the API documentation is available at:

```plaintext
http://localhost:3000/api-docs
```

## Docker Setup

### Build and Run with Docker

To build the Docker image and start the container:

```bash
docker-compose up --build
```

This will start both the Node.js application and PostgreSQL database in Docker containers.

### Stopping Containers

To stop the containers:

```bash
docker-compose down
```

## Deployment

For deployment, ensure that all environment variables are correctly configured and that the database is properly set up. The application can be deployed using any cloud provider or platform that supports Docker.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push to the branch.
5. Open a Pull Request.

Please make sure your code passes all tests and follows the established coding standards.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
