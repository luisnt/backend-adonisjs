const cluster = require("cluster");

if (cluster.isMaster) {
  const instances = require("os").cpus().length

  for (let i = 0; i < instances; i++) {
    cluster.fork()
  }

  cluster.on("exit", (worker, code, signal) => {
    if (code !== 0 && !worker.exitedAfterDisconnect)
      cluster.fork()
  });
} else {
  require("./server")
}