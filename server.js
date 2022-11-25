const express = require("express");
const app = express();
const cors = require('cors')

app.use(express.json());
app.use(cors())

app.use("/api", require("./src/middleware/api"));
app.use('/public/img', express.static(__dirname + '/public/img'));
app.use('/public/pdf', express.static(__dirname + '/public/pdf'));

app.listen(8081, () => console.log("server is running"));