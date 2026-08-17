# Node.js Docker Example - API Documentation

Comprehensive reference for all available API endpoints in the Node.js Docker Example application.

## Base URL

All API endpoints are accessible at:
```
http://localhost:3000/api
```

## Authentication

This API does not require authentication for any endpoints.

## Response Format

All API endpoints return JSON responses with the following structure:

### Success Responses
```json
{
  "success": true,
  "data": {...}
}
```

### Error Responses
```json
{
  "success": false,
  "error": "Error message description"
}
```

Some endpoints may return data directly without the success wrapper (as indicated in individual endpoint documentation).

## Endpoints

### Health Check

#### GET `/api/health`
Returns application health status and basic metrics.

**Query Parameters:** None

**Success Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-08-17T10:30:00.000Z",
  "uptime_ms": 3600000,
  "request_count": 42,
  "memory_usage": "45.67 MB"
}
```

**Field Descriptions:**
- `status`: Application health status ("healthy")
- `timestamp`: Current server timestamp in ISO format
- `uptime_ms`: Server uptime in milliseconds
- `request_count`: Total number of requests served since startup
- `memory_usage`: Current heap memory usage

**Example:**
```bash
curl http://localhost:3000/api/health
```

---

### Statistics

#### GET `/api/stats`
Returns mock business statistics for demonstration purposes.

**Query Parameters:** None

**Success Response:**
```json
{
  "daily_revenue": 1234,
  "active_users": 25,
  "conversion_rate": "4.2",
  "total_visitors": 5678,
  "last_updated": "2026-08-17T10:30:00.000Z"
}
```

**Field Descriptions:**
- `daily_revenue`: Mock daily revenue in dollars
- `active_users`: Mock number of active users
- `conversion_rate`: Mock conversion rate percentage (string with 1 decimal place)
- `total_visitors`: Mock total visitor count
- `last_updated`: Timestamp of when stats were generated

**Example:**
```bash
curl http://localhost:3000/api/stats
```

---

### Agent Monitoring

#### GET `/api/agents`
Returns agent activity metrics for two work streams (Stream A, Stream B) and their synergy.

**Query Parameters:** None

**Success Response:**
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

**Field Descriptions:**
- `active`: Number of agents currently working on tasks
- `idle`: Number of agents available but not currently assigned
- `tasks_today`: Number of tasks completed today by this stream
- `efficiency`: Efficiency percentage (string with 1 decimal place)
- `last_updated`: Timestamp of when metrics were generated

**Example:**
```bash
curl http://localhost:3000/api/agents
```

---

### Task Management

The task management API allows organizing work items across different streams and columns (similar to a Kanban board).

#### GET `/api/tasks`
Retrieve all tasks organized by stream and column.

**Query Parameters:** None

**Success Response:**
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
  "streamB": {
    "todo": [],
    "in_progress": [
      {
        "id": 1692300000124,
        "title": "Another Task",
        "description": "Second task description",
        "createdAt": "2026-08-17T10:31:00.000Z"
      }
    ],
    "done": []
  },
  "synergy": {
    "todo": [],
    "in_progress": [],
    "done": [
      {
        "id": 1692300000125,
        "title": "Completed Task",
        "description": "Task that was completed",
        "createdAt": "2026-08-17T10:32:00.000Z"
      }
    ]
  }
}
```

**Structure:**
- Top-level keys: stream identifiers (`streamA`, `streamB`, `synergy`)
- Second-level keys: column identifiers (varies by workflow, common ones: `todo`, `in_progress`, `done`, `review`)
- Array of task objects for each column

**Task Object Fields:**
- `id`: Unique numeric identifier
- `title`: Short task title
- `description`: Detailed task description
- `createdAt`: ISO timestamp when task was created

**Example:**
```bash
curl http://localhost:3000/api/tasks
```

#### POST `/api/tasks`
Create a new task in a specified stream and column.

**Request Body:**
```json
{
  "stream": "streamA",
  "column": "todo",
  "task": {
    "title": "New Task Title",
    "description": "Detailed task description"
  }
}
```

**Field Descriptions:**
- `stream`: Target stream identifier (`streamA`, `streamB`, or `synergy`)
- `column`: Target column identifier (will be created if doesn't exist)
- `task.title`: Task title (required)
- `task.description`: Task description (optional)

**Success Response:**
```json
{
  "success": true,
  "task": {
    "id": 1692300000126,
    "title": "New Task Title",
    "description": "Detailed task description",
    "createdAt": "2026-08-17T10:35:00.000Z"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Missing required fields
```json
{
  "success": false,
  "error": "Stream, column, and task are required"
}
```
- `500 Internal Server Error`: Failed to save task
```json
{
  "success": false,
  "error": "Failed to save task"
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "stream": "streamA",
    "column": "todo",
    "task": {
      "title": "Implement login feature",
      "description": "Create user authentication with JWT tokens"
    }
  }'
```

#### DELETE `/api/tasks/:stream/:column/:id`
Delete a specific task by stream, column, and ID.

**URL Parameters:**
- `stream`: Stream identifier (required)
- `column`: Column identifier (required)
- `id`: Task ID number (required)

**Success Response:**
```json
{
  "success": true,
  "message": "Task deleted"
}
```

**Error Responses:**
- `404 Not Found`: Task not found
```json
{
  "success": false,
  "error": "Task not found"
}
```
- `500 Internal Server Error`: Failed to delete task
```json
{
  "success": false,
  "error": "Failed to delete task"
}
```

**Example:**
```bash
curl -X DELETE http://localhost:3000/api/tasks/streamA/todo/1692300000126
```

---

### Event Tracking

The event tracking API allows recording and retrieving system events for audit trails and monitoring.

#### GET `/api/events`
Retrieve recent events (last 50 events by default).

**Query Parameters:** None

**Success Response:** Array of event objects
```json
[
  {
    "id": 1692300000123,
    "type": "task_created",
    "timestamp": "2026-08-17T10:30:00.000Z",
    "data": { "taskId": 1692300000123 }
  },
  {
    "id": 1692300000124,
    "type": "user_login",
    "timestamp": "2026-08-17T10:31:00.000Z",
    "data": { "userId": "user123", "ip": "192.168.1.1" }
  }
]
```

**Event Object Fields:**
- `id`: Unique numeric identifier
- `type`: Event type string (customizable)
- `timestamp`: ISO timestamp when event occurred
- `data`: Optional object containing event-specific data

**Example:**
```bash
curl http://localhost:3000/api/events
```

#### POST `/api/events`
Create a new event record.

**Request Body:**
```json
{
  "type": "event_type_string",
  "data": {
    "key1": "value1",
    "key2": "value2"
  }
}
```

**Field Descriptions:**
- `type`: Event type identifier (required, string)
- `data`: Optional object containing arbitrary event data

**Success Response:**
```json
{
  "success": true,
  "event_id": 1692300000125,
  "message": "Event tracked successfully"
}
```

**Error Response:**
- `500 Internal Server Error`: Failed to save event (note: API continues to function)
```json
{
  "success": false,
  "error": "Failed to save event"
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "type": "api_called",
    "data": {
      "endpoint": "/api/tasks",
      "method": "POST",
      "userAgent": "curl/7.68.0"
    }
  }'
```

---

### WebSocket API

Real-time updates are available via WebSocket connection.

#### Connection
```
WebSocket: ws://localhost:3000
```

#### Message Types

##### `initial_agents`
Sent immediately upon connection with initial agent data.

**Payload:**
```json
{
  "type": "initial_agents",
  "payload": {
    "streamA": { "active": 2, "idle": 1, "tasks_today": 10, "efficiency": "85.0" },
    "streamB": { "active": 1, "idle": 2, "tasks_today": 5, "efficiency": "90.0" },
    "synergy": { "active": 1, "idle": 1, "tasks_today": 3, "efficiency": "92.0" },
    "timestamp": "2026-08-17T10:30:00.000Z"
  }
}
```

##### `agents_update`
Sent every 5 seconds with updated agent metrics.

**Payload:** Same structure as `initial_agents` payload

#### Example Client (JavaScript)
```javascript
const ws = new WebSocket('ws://localhost:3000');

ws.onopen = () => {
  console.log('Connected to WebSocket server');
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received message:', data.type);
  
  if (data.type === 'agents_update') {
    // Handle agent metrics update
    console.log('Stream A efficiency:', data.payload.streamA.efficiency);
  }
};

ws.onclose = () => {
  console.log('Disconnected from WebSocket server');
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};
```

## Error Handling

### HTTP Status Codes
- `200`: Success
- `201`: Created (for POST requests that create resources)
- `400`: Bad Request (invalid input)
- `404`: Not Found (resource doesn't exist)
- `500`: Internal Server Error

### Common Error Responses
All JSON error responses follow this format:
```json
{
  "success": false,
  "error": "Descriptive error message"
}
```

## Rate Limiting

This API does not implement rate limiting. For production use, consider adding rate limiting middleware.

## Data Persistence

Data is stored in JSON files in the `data/` directory:
- `tasks.json`: Task management data
- `events.json`: Event tracking data

Files are automatically created if they don't exist and are updated synchronously with each modifying request.

## CORS

This API does not currently set CORS headers. For browser-based clients running on different domains, you may need to add CORS middleware.

## Versioning

This API follows semantic versioning. The current version is 1.0.0.

To request a specific version in the future, version prefixes may be added to the URL path (e.g., `/api/v1/tasks`).

## Changelog

### Version 1.0.0 (Initial Release)
- All core endpoints implemented
- Task management with stream/column organization
- Event tracking system
- Real-time WebSocket updates
- Health check and statistics endpoints
- Docker-ready deployment

## Support

For issues, questions, or feature requests, please check the project repository or contact the maintainers.

---
*API Documentation generated on: 2026-08-17*