const { parentPort } = require("worker_threads");

let counter = 0;
for (i = 0; i < 2_000_000_000; i++) {
  counter++;
}

parentPort.postMessage(counter);
