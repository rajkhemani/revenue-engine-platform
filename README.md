# Node.js Docker Example

A minimal Node.js TypeScript application with Express.js, RESTful APIs, WebSocket support, and task management capabilities. This project demonstrates best practices for containerizing Node.js applications with Docker.

## Features

- 🚀 **Express.js Server** - Robust HTTP server with JSON middleware
- 🔌 **RESTful APIs** - Health checks, stats, agent monitoring, task management, and event tracking
- 💾 **Persistent Storage** - File-based JSON storage for tasks and events
- 🌐 **WebSocket Support** - Real-time updates for connected clients
- 📦 **Docker Ready** - Optimized Dockerfile for production and development
- 🔧 **Development Experience** - Hot reload with `tsx` watch mode
- 📊 **Monitoring Endpoints** - Health, stats, and agent metrics
- ⚡ **Task Management** - CRUD operations for organizing work streams
- 📡 **Event Tracking** - Audit trail for system activities

## Project Structure

```
nodejs-docker-example/
├── src/                 # Source TypeScript files
│   └── index.ts         # Main application entry point
├── dist/                # Compiled JavaScript output
├── data/                # Persistent JSON storage (tasks.json, events.json)
├── node_modules/        # Dependencies
├── __tests__/           # Test files (to be added)
├── package.json         # Project metadata and scripts
├── tsconfig.json        # TypeScript configuration
├── Dockerfile           # Docker container definition
├── DOCKER_RUN.md        # Detailed Docker usage guide
└── README.md            # This file
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm (comes with Node.js)
- Docker (for containerization)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd nodejs-docker-example
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server with hot reload:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Build

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## Docker Usage

### Building the Image

```bash
docker build -t nodejs-docker-example .
```

### Running the Container

```bash
docker run -d -p 3000:3000 --name nodejs-app nodejs-docker-example
```

### Development with Docker (Live Reload)

```bash
docker run -d -p 3000:3000 \
  -v $(pwd)/src:/usr/src/app/src \
  -v $(pwd)/tsconfig.json:/usr/src/app/tsconfig.json \
  --name nodejs-dev \
  nodejs-docker-example \
  npm run dev
```

For detailed Docker instructions, see [DOCKER_RUN.md](./DOCKER_RUN.md)

## API Documentation

### Base URL

```
http://localhost:3000
```

### Health Check

**GET** `/api/health`

Returns application health status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-08-17T10:30:00.000Z",
  "uptime_ms": 3600000,
  "request_count": 42,
  "memory_usage": "45.67 MB"
}
```

### Statistics

**GET** `/api/stats`

Returns mock business statistics.

**Response:**
```json
{
  "daily_revenue": 1234,
  "active_users": 25,
  "conversion_rate": "4.2",
  "total_visitors": 5678,
  "last_updated": "2026-08-17T10:30:00.000Z"
}
```

### Agent Monitoring

**GET** `/api/agents`

Returns agent activity metrics for two work streams and synergy.

**Response:**
```json
{
  "streamA": {
    "active": 2,
    "idle": 1,
    "tasks_today": 12,
    "efficiency": "85.3"
  },
  "streamB": {
    "active": 1,
    "idle": 2,
    "tasks_today": 7,
    "efficiency": "90.1"
  },
  "synergy": {
    "active": 1,
    "idle": 1,
    "tasks_today": 4,
    "efficiency": "92.5"
  },
  "last_updated": "2026-08-17T10:30:00.000Z"
}
```

### Task Management

#### Get All Tasks

**GET** `/api/tasks`

Returns all tasks organized by stream and column.

**Response:**
```json
{
  "streamA": {
    "todo": [
      {
        "id": 1692300000123,
        "title": "Sample Task",
        "description": "Task description",
        "createdAt": "2026-08-17T10:30:00.000Z"
      }
    ],
    "in_progress": [],
    "done": []
  },
  "streamB": { ... },
  "synergy": { ... }
}
```

#### Create Task

**POST** `/api/tasks`

Create a new task.

**Request Body:**
```json
{
  "stream": "streamA",
  "column": "todo",
  "task": {
    "title": "New Task",
    "description": "Task description"
  }
}
```

**Response:**
```json
{
  "success": true,
  "task": {
    "id": 1692300000123,
    "title": "New Task",
    "description": "Task description",
    "createdAt": "2026-08-17T10:30:00.000Z"
  }
}
```

#### Delete Task

**DELETE** `/api/tasks/:stream/:column/:id`

Delete a specific task.

**Parameters:**
- `stream`: stream identifier (streamA, streamB, synergy)
- `column`: column identifier (todo, in_progress, done, etc.)
- `id`: task ID (numeric)

**Response:**
```json
{
  "success": true,
  "message": "Task deleted"
}
```

### Event Tracking

#### Get Recent Events

**GET** `/api/events`

Returns the last 50 tracked events.

**Response:**
```json
[
  {
    "id": 1692300000123,
    "type": "task_created",
    "timestamp": "2026-08-17T10:30:00.000Z",
    "data": { "taskId": 1692300000123 }
  }
]
```

#### Create Event

**POST** `/api/events`

Track a new event.

**Request Body:**
```json
{
  "type": "user_action",
  "data": { "action": "button_click", "element": "submit_button" }
}
```

**Response:**
```json
{
  "success": true,
  "event_id": 1692300000123,
  "message": "Event tracked successfully"
}
```

### WebSocket Connection

Connect to the WebSocket server for real-time updates.

**URL:** `ws://localhost:3000`

**Message Types:**
- `initial_agents`: Sent on connection with initial agent data
- `agents_update`: Sent every 5 seconds with updated agent metrics

**Example:**
```javascript
const ws = new WebSocket('ws://localhost:3000');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
};

ws.onopen = () => {
  console.log('Connected to WebSocket server');
};
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Port number for the server | `3000` |

## npm Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Compile TypeScript to JavaScript (outputs to dist/) |
| `npm start` | Run the compiled application (Node.js server) |
| `npm run dev` | Start development server with tsx watch (auto-restarts on changes) |
| `npm test` | Run tests (requires test setup) |

## Configuration

### TypeScript

See `tsconfig.json` for TypeScript compiler options.

### Data Storage

The application stores data in JSON files located in the `data/` directory:
- `tasks.json`: Task management data
- `events.json`: Event tracking data

These files are automatically created if they don't exist.

## Testing

To add tests to this project:

1. Install testing dependencies:
   ```bash
   npm install -D jest @types/jest ts-jest
   ```

2. Create test files in the `__tests__` directory

3. Add test script to package.json:
   ```json
   "test": "jest"
   ```

## Deployment

### Docker Deployment

See [DOCKER_RUN.md](./DOCKER_RUN.md) for detailed Docker deployment instructions.

### Manual Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the server:
   ```bash
   npm start
   ```

3. For production use, consider using a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start dist/index.js --name nodejs-app
   ```

## RTK Integration

This repository uses the RTK (Rust Token Killer) tool for token optimization:
- RTK hooks automatically optimize bash commands to reduce token usage
- Use `rtk gain` to view token savings analytics
- Commands are transparently proxied through RTK (e.g., `git status` becomes `rtk git status`)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Express.js team for the excellent web framework
- TypeScript team for type-safe JavaScript
- Docker team for containerization excellence