const express = require("express");
const { Worker } = require("worker_threads");

const app = express();

const PORT = process.env.PORT || 8080;

app.get("/non-blocking", (req, res) => {
  res.status(200).json({ message: "This page is not blocking" });
});

app.get("/blocking", async (req, res) => {
  const worker = new Worker("./worker.js");

  worker.on("message", (data) => {
    res.status(200).json({ message: `result ${data}` });
  });

  worker.on("error", (error) => {
    res.status(404).json({ message: `An error occured ${error}` });
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
