const cluster = require('cluster');
const os = require('os');

require('dotenv').config();

if (cluster.isMaster) {
    const cpus = process.env.ALLOW_MT === 'true' ? os.cpus().length : 1;

    console.log(`Taking advantage of ${cpus} CPUs`)
    for (let i = 0; i < cpus; i++) {
        cluster.fork();
    }
    console.dir(cluster.workers, {depth: 0});

    process.stdin.on('data', (data) => {
        initControlCommands(data);
    })

    cluster.on('exit', (worker, code) => {
        if (code !== 0 && !worker.exitedAfterDisconnect) {
            console.log(`\x1b[34mWorker ${worker.process.pid} crashed.\nStarting a new worker...\n\x1b[0m`);
            const nw = cluster.fork();
            console.log(`\x1b[32mWorker ${nw.process.pid} will replace him \x1b[0m`);
        }
    });

    console.log(`Master PID: ${process.pid}`)
} else {
     require('./app.js');
}