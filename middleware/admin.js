const jwt = require("jsonwebtoken");
//we know that when we talk about jwt,there must be secret by which we can sign the token and by that token we can verify the token
const { JWT_SECRET } = require("../config");

// Middleware for handling auth
function adminMiddleware(req, res, next) {
  const token = req.headers.authorization;
  // all the headers are converted to lowercase irrespective of sending info
  //here the token is like: Bearer nfasnflsnfl.dfnkdfs.dfdslknd as instructed
  //But we just want the token and we have to remove Bearer
  const words = token.split(" ");
  const jwtToken = words[1];
  try {
    const decodedValue = jwt.verify(jwtToken, JWT_SECRET);
    //In the above code the username is encoded when we sign the jwt with secret and username
    //so after decoded it must have the username.
    if (decodedValue.username) {
      next();
    } else {
      res.status(403).json({
        msg: "You are not authenticated",
      });
    }
  } catch (e) {
    res.json({
      msg: "Incorrect inputs",
    });
  }
}

module.exports = adminMiddleware;
