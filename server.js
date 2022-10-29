const express = require("express");
const app = express();
const cors = require('cors')

app.use(express.json());
app.use(cors())

app.use("/api/v2", require("./src/middleware/api"));

app.listen(8081, () => console.log("server is running"));