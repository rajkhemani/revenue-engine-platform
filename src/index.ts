// A minimal Express application.
// The root endpoint (GET /) returns a JSON greeting.
// See https://expressjs.com/ for the framework reference.

import express, { type Request, type Response } from "express";
import { WebSocketServer } from "ws";
import * as fs from "fs";
import * as path from "path";
import puppeteer from "puppeteer";

const app = express();
// Browser automation instance
let browser: puppeteer.Browser | null = null;

// Middleware to parse JSON bodies
app.use(express.json());

// In-memory storage for demo purposes
let startTime = Date.now();
let requestCount = 0;

// Persistence file paths
const DATA_DIR = path.join(process.cwd(), "data");
const TASKS_FILE = path.join(DATA_DIR, "tasks.json");
const EVENTS_FILE = path.join(DATA_DIR, "events.json");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize storage files if they don't exist
if (!fs.existsSync(TASKS_FILE)) {
  fs.writeFileSync(TASKS_FILE, JSON.stringify({ streamA: {}, streamB: {}, synergy: {} }, null, 2));
}
if (!fs.existsSync(EVENTS_FILE)) {
  fs.writeFileSync(EVENTS_FILE, JSON.stringify([], null, 2));
}

// Middleware to count requests
app.use((req, res, next) => {
  requestCount++;
  next();
});

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Hello World" });
});

app.get("/api/health", (_req: Request, res: Response) => {
  const uptime = Date.now() - startTime;
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime_ms: uptime,
    request_count: requestCount,
    memory_usage: `${Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100} MB`
  });
});

app.get("/api/stats", (_req: Request, res: Response) => {
  res.json({
    daily_revenue: Math.floor(Math.random() * 1000) + 500,
    active_users: Math.floor(Math.random() * 50) + 10,
    conversion_rate: (Math.random() * 5 + 2).toFixed(1),
    total_visitors: Math.floor(Math.random() * 10000) + 1000,
    last_updated: new Date().toISOString()
  });
});

app.get("/api/agents", (_req: Request, res: Response) => {
  res.json({
    streamA: {
      active: Math.floor(Math.random() * 3) + 1,
      idle: Math.floor(Math.random() * 2),
      tasks_today: Math.floor(Math.random() * 15) + 5,
      efficiency: (Math.random() * 20 + 80).toFixed(1)
    },
    streamB: {
      active: Math.floor(Math.random() * 2) + 1,
      idle: Math.floor(Math.random() * 3),
      tasks_today: Math.floor(Math.random() * 10) + 3,
      efficiency: (Math.random() * 15 + 85).toFixed(1)
    },
    synergy: {
      active: Math.floor(Math.random() * 2),
      idle: Math.floor(Math.random() * 2),
      tasks_today: Math.floor(Math.random() * 8) + 2,
      efficiency: (Math.random() * 10 + 90).toFixed(1)
    },
    last_updated: new Date().toISOString()
  });
});

// Task Management APIs
app.get("/api/tasks", (_req: Request, res: Response) => {
  try {
    const tasksData = JSON.parse(fs.readFileSync(TASKS_FILE, "utf8"));
    res.json(tasksData);
  } catch (error) {
    console.error("Error reading tasks:", error);
    res.status(500).json({ error: "Failed to read tasks" });
  }
});

app.post("/api/tasks", (req: Request, res: Response) => {
  try {
    const { stream, column, task } = req.body;

    if (!stream || !column || !task) {
      return res.status(400).json({ error: "Stream, column, and task are required" });
    }

    const tasksData = JSON.parse(fs.readFileSync(TASKS_FILE, "utf8"));

    // Initialize stream and column if they don't exist
    if (!tasksData[stream]) {
      tasksData[stream] = {};
    }
    if (!tasksData[stream][column]) {
      tasksData[stream][column] = [];
    }

    // Add task with ID and timestamp
    const newTask = {
      ...task,
      id: Date.now() + Math.floor(Math.random() * 10000),
      createdAt: new Date().toISOString()
    };

    tasksData[stream][column].push(newTask);

    // Save back to file
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasksData, null, 2));

    res.status(201).json({ success: true, task: newTask });
  } catch (error) {
    console.error("Error saving task:", error);
    res.status(500).json({ error: "Failed to save task" });
  }
});

app.delete("/api/tasks/:stream/:column/:id", (req: Request, res: Response) => {
  try {
    const { stream, column, id } = req.params;
    const taskId = parseInt(id);

    const tasksData = JSON.parse(fs.readFileSync(TASKS_FILE, "utf8"));

    if (!tasksData[stream] || !tasksData[stream][column]) {
      return res.status(404).json({ error: "Task not found" });
    }

    const initialLength = tasksData[stream][column].length;
    tasksData[stream][column] = tasksData[stream][column].filter(task => task.id !== taskId);

    if (tasksData[stream][column].length === initialLength) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Save back to file
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasksData, null, 2));

    res.json({ success: true, message: "Task deleted" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

app.post("/api/events", (req: Request, res: Response) => {
  const event = {
    id: Date.now() + Math.floor(Math.random() * 1000),
    type: req.body.type || "unknown",
    timestamp: new Date().toISOString(),
    data: req.body.data || {}
  };

  // Save event to persistence
  try {
    const eventsData = JSON.parse(fs.readFileSync(EVENTS_FILE, "utf8"));
    eventsData.push(event);
    // Keep only last 1000 events to prevent file from growing too large
    if (eventsData.length > 1000) {
      eventsData.splice(0, eventsData.length - 1000);
    }
    fs.writeFileSync(EVENTS_FILE, JSON.stringify(eventsData, null, 2));
  } catch (error) {
    console.error("Error saving event:", error);
    // Continue anyway - event tracking failure shouldn't break the API
  }

  console.log("Event received:", event);

  res.status(201).json({
    success: true,
    event_id: event.id,
    message: "Event tracked successfully"
  });
});

// Get recent events
app.get("/api/events", (_req: Request, res: Response) => {
  try {
    const eventsData = JSON.parse(fs.readFileSync(EVENTS_FILE, "utf8"));
    // Return last 50 events
    const recentEvents = eventsData.slice(-50);
    res.json(recentEvents);
  } catch (error) {
    console.error("Error reading events:", error);
    res.status(500).json({ error: "Failed to read events" });
  }
});

const port = parseInt(process.env.PORT ?? "3000", 10);
const server = app.listen(port, async () => {
  console.log(`Server listening on port ${port}`);
  console.log(`API endpoints available:`);
  console.log(`  GET  http://localhost:${port}/api/health`);
  console.log(`  GET  http://localhost:${port}/api/stats`);
  console.log(`  GET  http://localhost:${port}/api/agents`);
  console.log(`  GET  http://localhost:${port}/api/tasks`);
  console.log(`  POST http://localhost:${port}/api/tasks`);
  console.log(`  DELETE http://localhost:${port}/api/tasks/:stream/:column/:id`);
  console.log(`  GET  http://localhost:${port}/api/events`);
  console.log(`  POST http://localhost:${port}/api/events`);

  // Initialize browser automation
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    console.log('Browser automation initialized');
  } catch (error) {
    console.error('Failed to initialize browser automation:', error);
  }
});

// WebSocket Server for real-time updates
const wss = new WebSocketServer({ server });

// Broadcast function to send data to all connected clients
function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// Periodically send updates to connected clients
setInterval(() => {
  const updateData = {
    type: "agents_update",
    payload: {
      streamA: {
        active: Math.floor(Math.random() * 3) + 1,
        idle: Math.floor(Math.random() * 2),
        tasks_today: Math.floor(Math.random() * 15) + 5,
        efficiency: (Math.random() * 20 + 80).toFixed(1)
      },
      streamB: {
        active: Math.floor(Math.random() * 2) + 1,
        idle: Math.floor(Math.random() * 3),
        tasks_today: Math.floor(Math.random() * 10) + 3,
        efficiency: (Math.random() * 15 + 85).toFixed(1)
      },
      synergy: {
        active: Math.floor(Math.random() * 2),
        idle: Math.floor(Math.random() * 2),
        tasks_today: Math.floor(Math.random() * 8) + 2,
        efficiency: (Math.random() * 10 + 90).toFixed(1)
      },
      timestamp: new Date().toISOString()
    }
  };

  broadcast(updateData);
}, 5000); // Every 5 seconds

wss.on("connection", (ws) => {
  console.log("New WebSocket client connected");

  // Send initial data when client connects
  ws.send(JSON.stringify({
    type: "initial_agents",
    payload: {
      streamA: { active: 2, idle: 1, tasks_today: 10, efficiency: "85.0" },
      streamB: { active: 1, idle: 2, tasks_today: 5, efficiency: "90.0" },
      synergy: { active: 1, idle: 1, tasks_today: 3, efficiency: "92.0" },
      timestamp: new Date().toISOString()
    }
  }));

  ws.on("close", () => {
    console.log("WebSocket client disconnected");
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");

  // Close browser automation if initialized
  if (browser) {
    try {
      await browser.close();
      console.log('Browser automation closed');
    } catch (error) {
      console.error('Error closing browser automation:', error);
    }
  }

  wss.close(() => {
    server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });
  });
});
