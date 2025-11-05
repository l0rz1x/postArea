const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

const db = require("./models");

// routers
const postRouter = require("./routes/posts");
app.use("/posts", postRouter);

const commentRouter = require("./routes/comments");
app.use("/comments", commentRouter);

const usersRouter = require("./routes/users");
app.use("/auth", usersRouter);

db.sequelize.sync().then(() => {
  app.listen(5000, () => {
    console.log("server started at 5000");
  });
});
