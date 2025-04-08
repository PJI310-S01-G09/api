const { faker } = require("@faker-js/faker");

export const userGenerator = () => ({
  nome: faker.person.fullName(),
  email: faker.internet.email(),
  senha: faker.internet.password() + '1@',
});
