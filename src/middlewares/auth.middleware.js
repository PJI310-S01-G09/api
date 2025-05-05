const jwt = require("jsonwebtoken");
const { mountResponse } = require("../utils/mount_response");
const { AuthMessageMap } = require("../validators/auth.validator");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json(mountResponse(null, [AuthMessageMap.ErrorInvalidToken]));
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json(mountResponse(null, [AuthMessageMap.ErrorInvalidToken]));
  }
};

module.exports = authMiddleware;
