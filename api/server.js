require("dotenv").config();
const DB = require("../config/DB");
const a = require("../app");
//connecting the database
DB();
const P = process.env.PORT || 4053;
a.listen(P, () => {
  console.log(`Your app is running on http://localhost:${P}`);
});
