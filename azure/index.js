const createHandler = require("azure-function-express").createHandler;
var app = require("../app.js");

module.exports = createHandler(app);
console.log(module.exports);