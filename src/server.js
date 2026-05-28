import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import configViewEngine from "./config/configEngine.js";
import routes from "./routes/web.js";
import cronJobController from "./controllers/cronJobController.js";
import socketIoController from "./controllers/socketIoController.js";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = process.env.PORT || 3000;

app.use(cookieParser());

// CORS - allow web browsers, Capacitor Android (https://localhost), Capacitor iOS (capacitor://localhost)
app.use((req, res, next) => {
  const allowed = [
    'https://localhost',
    'capacitor://localhost',
    'http://localhost',
    'http://localhost:5173',
    'http://localhost:3000',
    'https://rajagame21.xyz',
    'http://rajagame21.xyz',
  ];
  const origin = req.headers.origin;
  if (!origin || allowed.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// Normalize auth: populate req.cookies.auth from Authorization header or ?t= query param
app.use((req, res, next) => {
  if (!req.cookies.auth) {
    const bearer = req.headers.authorization?.replace(/^Bearer\s+/i, '');
    if (bearer) req.cookies.auth = bearer;
    else if (req.query.t) req.cookies.auth = req.query.t;
  }
  next();
});

// setup viewEngine - MUST be before other static middleware
configViewEngine(app);

// Serve Vue app dist files from src/public/dist
app.use(express.static(path.join(__dirname, "public", "dist")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// init Web Routes
routes.initWebRouter(app);

// Cron game 1 Phut
cronJobController.cronJobGame1p(io);

// Check xem ai connect vào sever
socketIoController.sendMessageAdmin(io);

// app.all('*', (req, res) => {
//     return res.render("404.ejs");
// });

server.listen(port, () => {
  console.log(`Connected success http://localhost:${port}`);
});
