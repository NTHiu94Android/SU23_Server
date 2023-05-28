const jwt = require("jsonwebtoken");

const authen = function (request, response, next) {
  try {
    if (request.headers.authorization && request.headers.authorization.split(" ")[0] == "Bearer") {
      const token = request.headers.authorization.split(' ')[1];
      jwt.verify(token, 'shhhhh', function (error, decoded) {
        if (error) {
          response.json({ status: false });
        } else {
          request.us = decoded;
          //console.log('auth.js: ', request.us);
          next();
        }
      });
    } else {
      response.status(401).json({ error: 'Not authorization' });
    }
  } catch (error) {
    response.status(401).json({ error: error.message });
  }
};

module.exports = authen;
