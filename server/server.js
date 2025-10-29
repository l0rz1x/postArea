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

app.get("/api", (req, res) => {
  res.json({
    users: ["userOne", "userTwo", "userThree", "if this works u are"],
  });
});

db.sequelize.sync().then(() => {
  app.listen(5000, () => {
    console.log("server started at 5000");
  });
});
