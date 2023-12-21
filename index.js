const { spawn } = require("child_process");
const logger = require('./utils/logger');
const url = require('url');

 
function startBot(message) {
    if (message) {
        logger.info(message, "Starting");
    }

    const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "nextgen.js"], {
        cwd: __dirname,
        stdio: "inherit",
        shell: true
    });

    child.on("error", (error) => {
        logger.error("An error occurred: " + JSON.stringify(error), "Starting");
    });
}

startBot("Starting up...");
