const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protect = async (request, response, next) => {
  let token;

  if (
    request.headers.authorization &&
    request.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = request.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.JWT_CODE);
      request.user = await User.findById(decodedToken.id).select("-password");
      next();
    } catch (error) {
      response.status(401).send({
        message: "Not Authorized, token failed.",
        status: false,
        error,
      });
    }
  }
  if (!token) {
    response.status(401).send({
      message: "Not Authorized, no token.",
      status: false,
    });
  }
};

module.exports = { protect };
