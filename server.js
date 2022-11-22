const express = require("express");
const app = express();
const cors = require('cors')

app.use(express.json());
app.use(cors())

app.use("/api", require("./src/middleware/api"));
app.use('/public/uploaded', express.static(__dirname + '/public/uploaded'));

app.listen(8081, () => console.log("server is running"));