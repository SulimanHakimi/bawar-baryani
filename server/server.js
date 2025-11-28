const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local';
require("dotenv").config({ path: path.resolve(__dirname, envFile) });

const app = express();

// Middleware
app.use(
  cors({
    origin: "https://bawar-biryani.vercel.app", // Explicitly allow the client origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allow all standard HTTP methods
    credentials: true, // Allow cookies and authorization headers to be sent
    optionsSuccessStatus: 204, // Return 204 for preflight requests
  })
);
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/products"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/reviews", require("./routes/reviews"));
app.use("/api/admin", require("./routes/admin"));

// Database Connection
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Start Server
// Start Server
const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
