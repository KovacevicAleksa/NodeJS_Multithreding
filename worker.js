const { parentPort, workerData } = require("worker_threads");

let counter = 0;
for (let i = workerData.start; i < workerData.end; i++) {
  counter++;
}

parentPort.postMessage(counter);
