const jwt = require("jsonwebtoken");
var publicKEY = fs.readFileSync(path.join(__dirname + "./public.key"), "utf8");
var privateKEY = fs.readFileSync(path.join(__dirname + "./private.key"), "utf8");