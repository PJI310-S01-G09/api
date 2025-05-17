const dotenv = require("dotenv");
const UserService = require("../../services/user.service.js");

dotenv.config();
const { ROOT_PASSWORD } = process.env;

exports.seed = async function () {
  const [user, error] = await UserService.create({
    nome: "root",
    email: "root@root.com",
    senha: ROOT_PASSWORD,
  });
  if (error) {
    console.error("Error creating root user:", error);
    return;
  }
};
