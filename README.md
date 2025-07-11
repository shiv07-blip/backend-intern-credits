# Backend Intern Assignment

A Node.js/Express.js backend service for managing user credits with automatic daily credit allocation and manual credit operations.


## Prerequisites

- Node.js (v17 or higher)
- PostgreSQL (v15 or higher)
- Docker and Docker Compose (optional, for containerized setup)

## Setup Instructions

### Option 1: Docker Setup (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend-intern-credits
   ```

2. **Start the database**
   ```bash
   docker-compose up -d
   ```

3. **Create environment file**
   ```bash
   cp src/.env.example src/.env
   ```
   
   Edit `src/.env` with the following values:
   ```env
   DB_USER=shiv
   DB_PASSWORD=secret123
   DB_HOST=localhost
   DB_NAME=creditsdb
   DB_PORT=5434
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Initialize database schema**
   ```bash
   # Connect to PostgreSQL and run the schema
   psql -h localhost -p 5434 -U shiv -d creditsdb -f src/schema.sql
   ```

6. **Start the application**
   ```bash
   npm run dev
   ```

### Option 2: Local Setup

1. **Install PostgreSQL** and create a database named `creditsdb`

2. **Create environment file**
   ```bash
   cp src/.env.example src/.env
   ```
   
   Update `src/.env` with your PostgreSQL credentials:
   ```env
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_HOST=localhost
   DB_NAME=creditsdb
   DB_PORT=5432
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Initialize database schema**
   ```bash
   psql -h localhost -U your_username -d creditsdb -f src/schema.sql
   ```

5. **Start the application**
   ```bash
   npm run dev
   ```

## Database Schema

### Tables

#### `users`
- `user_id` (SERIAL PRIMARY KEY): Unique user identifier
- `email` (VARCHAR(255) UNIQUE): User email address
- `name` (VARCHAR(100)): User's full name

#### `credits`
- `user_id` (INT PRIMARY KEY): References users.user_id
- `credits` (INT DEFAULT 0): Current credit balance
- `last_updated` (TIMESTAMP): Last modification timestamp

### Triggers
- Automatic `last_updated` timestamp update on credit modifications

## API Endpoints

Base URL: `http://localhost:3001/api/credits`

### Authentication & Protection
⚠️ **Note**: This API currently has **no authentication or authorization** implemented. All endpoints are publicly accessible. In a production environment, you should implement:

- JWT token authentication
- API key validation
- Role-based access control
- Rate limiting

### 1. Get User Credits

**Endpoint**: `GET /api/credits/:user_id`

**Description**: Retrieve current credit balance and last update timestamp for a user.

**URL Parameters**:
- `user_id` (required): The unique identifier of the user

**Response**:
```json
{
  "credits": 25,
  "last_updated": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses**:
- `404 Not Found`: User not found in credits table
- `500 Internal Server Error`: Database or server error

**Example**:
```bash
curl -X GET http://localhost:3001/api/credits/123
```

### 2. Add Credits to User

**Endpoint**: `POST /api/credits/:user_id/add`

**Description**: Add credits to a user's account.

**URL Parameters**:
- `user_id` (required): The unique identifier of the user

**Request Body**:
```json
{
  "amount": 10
}
```

**Response**:
```json
{
  "credits": 35,
  "last_updated": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid credit amount (must be positive number)
- `404 Not Found`: User not found
- `500 Internal Server Error`: Database or server error

**Example**:
```bash
curl -X POST http://localhost:3001/api/credits/123/add \
  -H "Content-Type: application/json" \
  -d '{"amount": 10}'
```

### 3. Deduct Credits from User

**Endpoint**: `POST /api/credits/:user_id/deduct`

**Description**: Deduct credits from a user's account. Fails if insufficient credits.

**URL Parameters**:
- `user_id` (required): The unique identifier of the user

**Request Body**:
```json
{
  "amount": 5
}
```

**Response**:
```json
{
  "credits": 30,
  "last_updated": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid deduction amount or insufficient credits
- `404 Not Found`: User not found
- `500 Internal Server Error`: Database or server error

**Example**:
```bash
curl -X POST http://localhost:3001/api/credits/123/deduct \
  -H "Content-Type: application/json" \
  -d '{"amount": 5}'
```

### 4. Reset User Credits

**Endpoint**: `PATCH /api/credits/:user_id/reset`

**Description**: Reset a user's credits to zero.

**URL Parameters**:
- `user_id` (required): The unique identifier of the user

**Response**:
```json
{
  "credits": 0,
  "last_updated": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses**:
- `404 Not Found`: User not found
- `500 Internal Server Error`: Database or server error

**Example**:
```bash
curl -X PATCH http://localhost:3001/api/credits/123/reset
```

## Automatic Credit System

The system includes an automatic credit allocation feature that runs daily at midnight UTC:

- **Schedule**: Every day at 00:00 UTC
- **Allocation**: 5 credits added to all users
- **Implementation**: Uses `node-cron` package
- **Timezone**: UTC

The cron job is automatically started when the server starts and runs in the background.

## Available Scripts

- `npm start`: Start the production server
- `npm run dev`: Start the development server with nodemon
- `npm test`: Run tests (currently not implemented)

## Project Structure

```
backend-intern-credits/
├── src/
│   ├── controllers/
│   │   ├── creditsController.js    # Credit management logic
│   │   └── schemaController.js     # Database schema operations
│   ├── routers/
│   │   ├── creditsRoutes.js        # Credit API routes
│   │   └── schemaUpdate.js         # Schema update routes
│   ├── db/
│   │   └── pool.js                 # PostgreSQL connection pool
│   ├── auto-credit/
│   │   └── autoCreditUpdate.js     # Daily credit allocation
│   ├── schema.sql                  # Database schema
│   └── server.js                   # Express server setup
├── docker-compose.yml              # Docker configuration
├── package.json                    # Dependencies and scripts
└── README.md                       # This file
```

## Environment Variables

Create a `.env` file in the `src/` directory with the following variables:

```env
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=localhost
DB_NAME=creditsdb
DB_PORT=5432
```

## Docker Configuration

The `docker-compose.yml` file sets up a PostgreSQL database with:

- **Image**: postgres:15
- **Port**: 5434 (mapped from container port 5432)
- **Database**: creditsdb
- **User**: shiv
- **Password**: secret123
- **Volume**: Persistent data storage

## Security Considerations

### Current State
- No authentication implemented
- No authorization checks
- No rate limiting
- No input validation beyond basic type checking

### Recommended Improvements
1. **Implement JWT Authentication**
2. **Add API Key validation**
3. **Implement rate limiting**
4. **Add comprehensive input validation**
5. **Use HTTPS in production**
6. **Implement proper error handling**
7. **Add request logging and monitoring**

## Testing

Currently, no tests are implemented. Consider adding:

- Unit tests for controllers
- Integration tests for API endpoints
- Database migration tests
- Load testing for the cron job

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

ISC License

## Support

For issues and questions, please create an issue in the repository.
