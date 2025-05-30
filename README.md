# Lyxa Auth Service

A microservice for managing auth with MongoDB database and RabbitMQ messaging.

## Setup Instructions

### Prerequisites

- Docker and Docker Compose
- Node.js (for local development)
- MongoDB (if running without Docker)
- RabbitMQ (accessible via network)

### Environment Setup

1. Clone the repository
2. Copy the environment template to create your .env file:

```bash
cp .env.example .env
```

3. The default configuration includes:
   - Application port: 4015
   - MongoDB connection: mongodb://mongodb:27017/lyxa_auth_service
   - RabbitMQ connection: amqp://guest:guest@172.17.0.1:5672

### Running with Docker Compose

The easiest way to run the service is using Docker Compose:

```bash
docker compose up
```

This will:

- Build the Docker image for the application
- Start the application container
- Start a MongoDB container
- Configure networking between services
- Mount volumes for persistent data

To run in detached mode:

```bash
docker compose up -d
```

To rebuild the containers:

```bash
docker compose up --build
```

### Running Locally (Without Docker)

1. Install dependencies:

```bash
npm install
```

2. Make sure MongoDB is running and accessible
3. Edit the `.env` file to use the local MongoDB connection string:
   - Uncomment `DB_URL=mongodb://localhost:27017/lyxa_auth_service`
   - Comment out the Docker MongoDB URL
4. Start the application:

```bash
npm run start:dev
```

## Inter-Service Communication Flow

This service communicates with other microservices using RabbitMQ for message queuing:

### RabbitMQ Configuration

- By default, the service connects to RabbitMQ at `amqp://guest:guest@172.17.0.1:5672`
- You can:
  - Use your local RabbitMQ instance by updating the RMQ_URL in .env
  - Run a separate RabbitMQ container and configure both services to use it

### Communication Flow

1. **Authentication Requests**: Client applications send authentication requests to this service.
2. **Token Validation**: Other services can verify tokens via RPC calls to this service.
3. **User Information**: User data can be retrieved by other services through the RabbitMQ message queue.

## API Documentation

Once the service is running, you can access the API documentation at:

```
http://localhost:4015/api
```

## Project Structure

- `src/modules/auth`: Auth module with controllers, services, and DTOs
- `src/config`: Configuration modules for app settings and RabbitMQ
- `src/common`: Shared utilities, decorators, guards, and services
