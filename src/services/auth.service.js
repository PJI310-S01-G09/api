const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const UserRepository = require("../repositories/user.repository.js");
const {
  AuthMessageMap,
  loginSchema,
} = require("../validators/auth.validator.js");

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRES_IN = "1h";

const AuthService = {
  hashPassword: async (plainPassword) => {
    const saltRounds = 10;
    return await bcrypt.hash(plainPassword, saltRounds);
  },

  verifyPassword: async (plainPassword, hashedPassword) => {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (err) {
      console.error("Error verifying password:", err);
      return false;
    }
  },

  generateToken: (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  },

  verifyToken: (token) => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return null;
    }
  },

  login: async (email, password) => {
    await loginSchema.validate({ email, password });

    const [user] = await UserRepository.show({ email });

    if (!user) {
      return [null, AuthMessageMap.ErrorInvalidLogin];
    }

    const isPasswordValid = await AuthService.verifyPassword(
      password,
      user.senha
    );

    if (!isPasswordValid) {
      return [null, AuthMessageMap.ErrorInvalidLogin];
    }

    const token = AuthService.generateToken({ email: user.email });
    return [token, null];
  },
};

module.exports = AuthService;
