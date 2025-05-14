const UserRepository = require("../src/repositories/user.repository.js");
const UserService = require("../src/services/user.service.js");
const AuthService = require("../src/services/auth.service.js");

const rootUserTest = {
  nome: "root_test",
  email: "root_test@email.com",
  senha: "R00t_T3st!",
};

const loginE2E = async () => {
  try {
    const userExists = await UserRepository.show({
      nome: rootUserTest.nome,
    });
    if (!userExists.length) {
      const [user, error] = await UserService.create({
        nome: rootUserTest.nome,
        email: rootUserTest.email,
        senha: rootUserTest.senha,
      });
      if (error) {
        console.error("Error creating root user:", error);
        return [null, "Error creating root user"];
      }
      console.log("User created:", user);
    }
    const [token, error] = await AuthService.login(
      rootUserTest.email,
      rootUserTest.senha
    );
    if (token && token) {
      console.log("Login successful:", token);
      return [token, null];
    } else {
      console.error("Login failed:", error);
      return [null, error];
    }
  } catch (error) {
    console.error("Login error:", error);
    return [null, "Login failed"];
  }
};

module.exports = {
  loginE2E,
};
