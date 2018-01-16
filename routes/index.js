const 
    bodyparser = require('./bodyparser-middleware'),
    webhookGet = require('./webhook-get'),
    webhookPost = require('./webhook-post'),
    authorizeGet = require('./authorize-get')
    ;

module.exports = function(app) {
    bodyparser(app);
    webhookGet(app);
    webhookPost(app);
    authorizeGet(app);
};
console.log(module.exports);