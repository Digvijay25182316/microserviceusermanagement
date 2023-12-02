const e = require("express");
const a = e();
//body parsing middleware
a.use(e.json());
module.exports = a;
