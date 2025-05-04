const { faker } = require("@faker-js/faker");

function generateFakeCPF() {
  let cpf = '';
  for (let i = 0; i < 11; i++) {
    cpf += faker.number.int({ min: 0, max: 9 }).toString();
  }
  return cpf;
}

/**
 * Gera um objeto de agendamento com data futura (ou ajustada)
 * @param {number} daysOffset - dias de deslocamento (ex: 2 = +2 dias, -1 = ontem)
 * @param {number} duration - duração do serviço em minutos (default: 60)
 * @returns {{ scheduledAt: string, serviceDuration: number }}
 */
export const scheduleGenerator = (daysOffset = 1, duration = 60) => {
  const now = new Date();
  const scheduledDate = new Date(now);
  scheduledDate.setDate(now.getDate() + daysOffset);

  const hour = faker.number.int({ min: 8, max: 17 });
  const minute = faker.helpers.arrayElement([0, 15, 30, 45]);

  scheduledDate.setHours(hour, minute, 0, 0);

  return {
    scheduledAt: scheduledDate.toISOString(),
    serviceDuration: duration,
  };
};

export const scheduleGeneratorWithClient = (daysOffset = 1, duration = 60) => ({
  ...scheduleGenerator(daysOffset, duration),
  client: {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    cpf: generateFakeCPF(),
    phone: faker.phone.number("##########").replace(/\D/g, ""),
  },
});
