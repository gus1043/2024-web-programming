const express = require("express");
const path = require("path");
const fs = require("fs").promises;

const router = express.Router();

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/visit.html"));
});

router.get("/users", (req, res) => {
  res.sendFile(path.join(__dirname, "./users.json"));
});

router.use("/user", async (req, res, next) => {
  req.users = JSON.parse(
    await fs.readFile(path.join(__dirname, "./users.json"))
  );
  next();
});

router.post("/user", async (req, res) => {
  const { name, memo } = req.body;
  const id = Date.now();
  req.users[id] = { name, memo };
  await fs.writeFile(
    path.join(__dirname, "./users.json"),
    JSON.stringify(req.users)
  );
  res.end();
});

router
  .route("/user/:id")
  .put(async (req, res) => {
    const { name, memo } = req.body;
    req.users[req.params.id] = { name, memo };
    await fs.writeFile(
      path.join(__dirname, "./users.json"),
      JSON.stringify(req.users)
    );
    res.end();
  })
  .delete(async (req, res) => {
    delete req.users[req.params.id];
    await fs.writeFile(
      path.join(__dirname, "./users.json"),
      JSON.stringify(req.users)
    );
    res.end();
  });

module.exports = router;
