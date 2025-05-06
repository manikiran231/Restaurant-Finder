const express = require("express");
const cors = require("cors");
const connectDb = require("./db");
const restaurantRoutes = require("./routers/restaurantsRouter");
const imageSearchRoute = require("./routers/imageSearchRoute");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json()); 
app.use(cors());
// Connect to Database and Start Server
const startServer = async () => {
  try {
    await connectDb();
    console.log("✅ Database connected successfully!");

    // Routes
    app.use("/api", restaurantRoutes); 
    app.use("/image", imageSearchRoute); 

    // Start Server
    app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
    });

  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1); 
  }
};

startServer();