require("dotenv").config();
const DB = require("../config/DB");
const a = require("../app");
const u = require("./routes/route");
a.use("/api", u);
//connecting the database
DB();
const P = process.env.PORT || 4053;
a.listen(P, () => {
  console.log(`Your app is running on http://localhost:${P}`);
});
