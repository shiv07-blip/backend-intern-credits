const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const scheduleCreditAddition = require("./auto-credit/autoCreditUpdate");
const dotenv = require("dotenv");

dotenv.config({ path: "./src/.env" });

const port = 3001;
const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/credits", require("./routers/creditsRoutes"));

scheduleCreditAddition();

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
