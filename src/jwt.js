const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
var publicKEY = fs.readFileSync(path.join(__dirname + "/public.key"), "utf8");
var privateKEY = fs.readFileSync(path.join(__dirname + "/private.key"), "utf8");

var i = "COSCI"; // Issuer (Software organization who issues the token)
var s = "cosci.activitykpi@gmail.com"; // Subject (intended user of the token)
var a = "http://www.kpi.cosci.swu.ac..th"; // Audience (Domain within which this token will live and function)

module.exports = {
  sign: (payload, expiresIn) => {
    // Token signing options
    var signOptions = {
      issuer: i,
      subject: s,
      audience: a,
      expiresIn: expiresIn,
      algorithm: 'RS256',
    };
    return jwt.sign(payload, privateKEY, signOptions);
  },
  verify: (req, res, next) => {
    var token = req.headers.authorization
      ? req.headers.authorization.split(' ')[1]
      : null;
    if (!token)
      return res
        .status(403)
        .json({ result: 'Not found', message: 'No token provided.' , data: {}});

    var verifyOptions = {
      issuer: i,
      subject: s,
      audience: a,
      algorithm: ['RS256'],
    };

    jwt.verify(token, publicKEY, verifyOptions, (err, decoded) => {
      if (err) {
        if (err.name == 'TokenExpiredError') {
          return res
            .status(401)
            .json({ result: 'nOK', message: 'Token expired' , data: {}});
        } else {
          return res.status(500).json({ result: 'Internal Server Error', message: err , data: {}});
        }
      }

      // if everything good, save to request for use in other routes
      req.userId = decoded.id
      req.user_id = decoded.user_id
      req.role = decoded.role
      next();
    });
  },
};
