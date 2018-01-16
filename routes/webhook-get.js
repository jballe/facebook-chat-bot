const VALIDATION_TOKEN = require("../utils/config").VALIDATION_TOKEN;

module.exports = function(app) {
  /*
 * Use your own validation token. Check that the token used in the Webhook
 * setup is the same token used here.
 *
 */
  app.get("/webhook", function(req, res) {
    if (
      req.query["hub.mode"] === "subscribe" &&
      req.query["hub.verify_token"] === VALIDATION_TOKEN
    ) {
      console.log("Validating webhook");
      res.status(200).send(req.query["hub.challenge"]);
    } else {
      console.error(
        "Failed validation. Make sure the validation tokens match."
      );
      res.sendStatus(403);
    }
  });
};
