require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./models");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());

// Request logger for development
if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
  });
}

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date(), message: "PostArea API is healthy." });
});

// Route Handlers
app.use("/auth", require("./routes/users"));
app.use("/posts", require("./routes/posts"));
app.use("/comments", require("./routes/comments"));
app.use("/like", require("./routes/likes"));
app.use("/follow", require("./routes/followRoutes"));

// Error Middlewares
app.use(notFound);
app.use(errorHandler);

async function ensureSchemaCompatibility() {
  try {
    const qi = db.sequelize.getQueryInterface();
    const table = await qi.describeTable("Users");
    if (!table.fullName) {
      await qi.addColumn("Users", "fullName", {
        type: db.Sequelize.STRING(100),
        allowNull: true,
        defaultValue: "",
      });
      console.log("✓ Added missing column 'fullName' to Users table.");
    }
    if (!table.bio) {
      await qi.addColumn("Users", "bio", {
        type: db.Sequelize.STRING(250),
        allowNull: true,
        defaultValue: "",
      });
      console.log("✓ Added missing column 'bio' to Users table.");
    }
    if (!table.avatar) {
      await qi.addColumn("Users", "avatar", {
        type: db.Sequelize.STRING,
        allowNull: true,
        defaultValue: "",
      });
      console.log("✓ Added missing column 'avatar' to Users table.");
    }
    if (!table.hideUsername) {
      await qi.addColumn("Users", "hideUsername", {
        type: db.Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      });
      console.log("✓ Added missing column 'hideUsername' to Users table.");
    }
    if (!table.isPrivate) {
      await qi.addColumn("Users", "isPrivate", {
        type: db.Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      });
      console.log("✓ Added missing column 'isPrivate' to Users table.");
    }

    try {
      const [indexes] = await db.sequelize.query("SHOW INDEX FROM Users WHERE Column_name = 'userName'");
      if (indexes.length === 0) {
        await db.sequelize.query("ALTER TABLE Users ADD UNIQUE INDEX idx_users_username (userName)");
        console.log("✓ Added UNIQUE INDEX on 'userName' to Users table.");
      }
    } catch (idxErr) {
      // index might already exist
    }
  } catch (err) {
    // If table doesn't exist yet or columns exist, safely continue
  }
}

// Database Sync & Server Start
db.sequelize
  .sync({ alter: false })
  .then(async () => {
    await ensureSchemaCompatibility();
    console.log("✓ Database connected & synchronized successfully.");
    app.listen(PORT, () => {
      console.log(`🚀 PostArea Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("✗ Failed to connect to the database:", err.message);
    // Still start server or let developers know
    app.listen(PORT, () => {
      console.log(`⚠️ Server running without active DB connection on port ${PORT}`);
    });
  });

module.exports = app;
