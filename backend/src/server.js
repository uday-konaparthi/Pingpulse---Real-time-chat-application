const express = require('express')
const dotenv = require('dotenv')
const cookieparser = require("cookie-parser")
const cors = require("cors")
const http = require('http');
dotenv.config();

const authRoute = require("./route/authRoute");
const userRoute = require("./route/userRoute");
const messageRoute = require('./route/messageRoute')
const connectDB = require('./database/db');
const socketHandler = require('./utils/socketHandler');

const app = express()
const port = process.env.PORT || 5000

const fs = require('fs');
const path = require('path');

const uploadDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use(cookieparser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

app.use(cors({
  origin: 'http://localhost:5173',      // ✅ Allow your frontend
  credentials: true,                    // ✅ Allow cookies to be sent
  optionsSuccessStatus: 200             // Optional for legacy support
}));

connectDB()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/message", messageRoute)


const server = http.createServer(app);

// Initialize socket.io with the server and handle connections
const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:5173", // your frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});

require('./utils/socketHandler')(io);

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})