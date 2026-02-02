require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();

/* body parser */
app.use(express.urlencoded({ extended: true }));

/* static */
app.use(express.static(path.join(__dirname, "public")));

/* ejs */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* routes */
const financeRoute = require("./routes/finance");
app.use("/", financeRoute);

/* start */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 http://localhost:${PORT}`);
});
