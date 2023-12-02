const e = require("express");
const a = e();
const u = require("./routes/route");
//body parsing middleware
a.use(e.json());
a.use("/", u);
module.exports = a;
