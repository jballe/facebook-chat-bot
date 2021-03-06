
module.exports = function(app) {
  const APP_SECRET = require("../utils/config").APP_SECRET;
  const bodyParser = require("body-parser"),
    crypto = require("crypto");

  app.use(bodyParser.json({ verify: verifyRequestSignature }));

  /*
 * Verify that the callback came from Facebook. Using the App Secret from
 * the App Dashboard, we can verify the signature that is sent with each
 * callback in the x-hub-signature field, located in the header.
 *
 * https://developers.facebook.com/docs/graph-api/webhooks#setup
 *
 */
  function verifyRequestSignature(req, res, buf) {
    console.log('VerifyRequestSegnature');
    console.log(req);

    var signature = req.headers["x-hub-signature"];

    if (!signature) {
      // For testing, let's log an error. In production, you should throw an
      // error.
      console.error("Couldn't validate the signature.");
    } else {
      var elements = signature.split("=");
      var method = elements[0];
      var signatureHash = elements[1];

      var expectedHash = crypto
        .createHmac("sha1", APP_SECRET)
        .update(buf)
        .digest("hex");

      if (signatureHash != expectedHash) {
        throw new Error("Couldn't validate the request signature.");
      }
    }
  }
};
