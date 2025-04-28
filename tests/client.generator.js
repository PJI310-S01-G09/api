const { faker } = require("@faker-js/faker");

function generateFakeCPF() {
  let cpf = '';
  for (let i = 0; i < 11; i++) {
    cpf += faker.number.int({ min: 0, max: 9 }).toString();
  }
  return cpf;
}

export const clientGenerator = () => ({
  name: faker.person.fullName(),
  email: faker.internet.email(),
  cpf: generateFakeCPF(),
  phone: faker.phone.number("##########").replace(/\D/g, ""),
});
