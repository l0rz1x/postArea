const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { validateToken } = require("../middlewares/authMiddleware");
const { sign } = require("jsonwebtoken");

router.post("/", async (req, res) => {
  const { userName, password } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    Users.create({
      userName: userName,
      password: hash,
    });
    res.json("success");
  });
});

router.post("/login", async (req, res) => {
  const { userName, password } = req.body;
  const user = await Users.findOne({ where: { userName: userName } });

  if (!user) {
    res.json({ error: "ERROR user doesnt exist" });
  } else {
    bcrypt.compare(password, user.password).then((match) => {
      if (!match) {
        res.json({ error: "Wrong user name and password combination" });
      } else {
        const accessToken = sign(
          { userName: user.userName, id: user.id },
          "importantsecret"
        );
        res.json({ accessToken: accessToken, userName: userName, id: user.id });
      }
    });
  }
});
router.get("/check", validateToken, (req, res) => {
  res.json(req.user);
});

module.exports = router;
