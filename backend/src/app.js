const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const studentAttendanceRoutes = require("./routes/studentAttendance.routes");
const wardenAttendanceRoutes = require("./routes/wardenAttendance.routes");

const app = express();

// ✅ CORS for allowed frontends (Netlify, Vercel, Render backend)
const allowedOrigins = [
  "https://hoostelhub.netlify.app",
  "https://hostal-hub.vercel.app",
  "https://hostal-hub.onrender.com",
  "http://localhost:5173",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server or curl with no origin
      if (!origin) return callback(null, true);
      return allowedOrigins.includes(origin)
        ? callback(null, true)
        : callback(new Error(`CORS blocked for origin ${origin}`), false);
    },
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/student/auth", require("./routes/user.auth.routes"));
app.use("/api/warden/auth", require("./routes/warden.auth.routes"));
app.use("/api/admin", require("./routes/admin.auth.routes"));
app.use("/api/admin", require("./routes/admin.routes"));

app.use("/api/students", require("./routes/user.routes"));
app.use("/api/warden", require("./routes/warden.routes"));
app.use("/api/rooms", require("./routes/room.routes"));
app.use("/api/complaints", require("./routes/complaint.routes"));
app.use("/api/notices", require("./routes/notice.routes"));
app.use("/api/menu", require("./routes/menu.routes"));
app.use("/api/student/attendance", studentAttendanceRoutes);
app.use("/api/warden/attendance", wardenAttendanceRoutes);

module.exports = app;