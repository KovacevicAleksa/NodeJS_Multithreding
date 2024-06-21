const { cpus } = require("os");
const express = require("express");
const { Worker } = require("worker_threads");

const THREAD_COUNT = cpus().length;
const app = express();
const PORT = process.env.PORT || 8080;

// Endpoint for non-blocking operation
app.get("/non-blocking", (req, res) => {
  res.status(200).json({ message: "This page is not blocking" });
});

// Function to create a worker with a specific range
function createWorker(start, end) {
  return new Promise((resolve, reject) => {
    const worker = new Worker("./worker.js", {
      workerData: { start, end },
    });

    worker.on("message", (message) => {
      resolve(message);
    });

    worker.on("error", (error) => {
      reject(error);
    });
  });
}

// Endpoint for blocking operation distributed across all threads
app.get("/blocking", async (req, res) => {
  const segmentSize = Math.ceil(2_000_000_000 / THREAD_COUNT);
  const promises = [];

  // Create workers for each thread
  for (let i = 0; i < THREAD_COUNT; i++) {
    const start = i * segmentSize;
    const end = Math.min((i + 1) * segmentSize, 30_000_000_000);

    promises.push(createWorker(start, end));
  }

  try {
    const results = await Promise.all(promises);
    const total = results.reduce((acc, val) => acc + val, 0);
    res.status(200).json({ message: `Total result: ${total}` });
  } catch (error) {
    res.status(500).json({ message: `Error in processing: ${error.message}` });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(
    `Server running at http://localhost:${PORT} with ${THREAD_COUNT} Threads`
  );
});
