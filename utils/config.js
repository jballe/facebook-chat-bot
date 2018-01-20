
const fs = require('fs');
const cfgPath = __dirname + '/../config/default.json';
const cfgExists = fs.existsSync(cfgPath);
const cfg = cfgExists ? require(cfgPath) : {};

// App Secret can be retrieved from the App Dashboard
const APP_SECRET = (process.env.MESSENGER_APP_SECRET) ?
  process.env.MESSENGER_APP_SECRET :
  cfg.appSecret;

// Arbitrary value used to validate a webhook
const VALIDATION_TOKEN = (process.env.MESSENGER_VALIDATION_TOKEN) ?
  (process.env.MESSENGER_VALIDATION_TOKEN) :
  cfg.validationToken;

// Generate a page access token for your page from the App Dashboard
const PAGE_ACCESS_TOKEN = (process.env.MESSENGER_PAGE_ACCESS_TOKEN) ?
  (process.env.MESSENGER_PAGE_ACCESS_TOKEN) :
  cfg.pageAccessToken;

// URL where the app is running (include protocol). Used to point to scripts and
// assets located at this address.
const SERVER_URL = (process.env.SERVER_URL) ?
  (process.env.SERVER_URL) :
  cfg.serverURL;

if (!(APP_SECRET && VALIDATION_TOKEN && PAGE_ACCESS_TOKEN && SERVER_URL)) {
  console.error("Missing config values");
  process.exit(1);
}

module.exports = {
    APP_SECRET: APP_SECRET,
    VALIDATION_TOKEN: VALIDATION_TOKEN,
    PAGE_ACCESS_TOKEN: PAGE_ACCESS_TOKEN,
    SERVER_URL: SERVER_URL
};