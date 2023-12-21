const express = require('express');
const fs = require('fs');
const login = require("fb-nextgen");
const logger = require('./utils/logger');
const { handleUnsend, logMessage } = require('./utils/handle');
const app = express();
const PORT = 3000;
const httpExpressUtils = require('./utils/http-express');
const configbot = require('./configbot.json');
const commandBot = require('./utils/commandbot');
const settings = require('./utils/settings');
const logicFiles = require('./utils/logicfiles');
const cookiesDirectory = 'fbstate';
const optionsDirectory = 'options';
const msgs = {};
const vips = [];
global.config = configbot;
const bodyParser = require('body-parser');
app.use(bodyParser.text({ type: 'text/plain' }));
const commands = logicFiles.initCommands();
let configs = settings.loadConfigurations();

function handleEvent(event, api, config) {
  try {
    if (event && event.type) {
      switch (event.type) {
        case 'message_reply':
        case 'message':
          msgs[event.messageID] = event.body;
          commandBot.handleMessageEvent(event, api, config);
          logMessage(event, api);
          break;
        case 'message_unsend':
          handleUnsend(event, api, vips, msgs);
          break;
      }
    }
  } catch (error) {
    console.error("Error in handleEvent function: ", error);
  }
}

async function onBot() {
  for (const config of configs) {
    const fbStateFilePath = config.fb;

    if (!fs.existsSync(fbStateFilePath)) {
      logger.info(`Error: Cookie file not found at ${fbStateFilePath}`);
      settings.clearConfiguration(config);
      continue;
    }

    try {
      const appState = JSON.parse(fs.readFileSync(fbStateFilePath, 'utf8'));

      await new Promise((resolve) => {
        login({ appState }, (err, api) => {
          if (err) {
            logger.error(`Event error: ${err}`);
            fs.unlinkSync(config.fb);
            logger.error(`Deleted cookies file: ${config.fb}`);
            configs = configs.filter(cfg => cfg.fb !== config.fb);
            fs.writeFileSync(path.join(optionsDirectory, 'config.json'), JSON.stringify(configs, null, 4));
            logger.error("Config updated after removing failed bot configuration!")
            settings.clearConfiguration(config);
            onBot();
            resolve();
            return;
          }
          api.setOptions({ listenEvents: true });
          api.listen((err, event) => {
            if (err) logger.error(`Event error: ${err}`);
            handleEvent(event, api, config);
            
          });
          resolve();
          
          
        });
      });

    } catch (err) {
      logger.error(`Error reading or parsing JSON from ${fbStateFilePath}: ${err.message}`);
      settings.clearConfiguration(config);
    }
  }
}
      
      app.listen(PORT, () => {
  logger.info(`Server started on http:localhost:${PORT}`);
  onBot();
});

process.on('unhandledRejection', (err, p) => {
  logger.error(`Unhandled Rejection at: ${p} - reason: ${err}`);
});
