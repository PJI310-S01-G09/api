const { faker } = require("@faker-js/faker");

function generateFakeCPF() {
  let cpf = '';
  for (let i = 0; i < 11; i++) {
    cpf += faker.number.int({ min: 0, max: 9 }).toString();
  }
  return cpf;
}

/**
 * Generates a schedule object with a future or offset date
 * @param {number} [daysOffset] - Optional. Number of days to shift (e.g., 2 = in 2 days, -1 = yesterday). If omitted, a random day ahead is used.
 * @param {number} duration - Duration of the service in minutes (default: 60)
 * @returns {{ scheduledAt: string, serviceDuration: number }}
 */
export const scheduleGenerator = (daysOffset, duration = 60) => {
  const now = new Date();
  const scheduledDate = new Date(now);

  const offset = typeof daysOffset === 'number'
    ? daysOffset
    : faker.number.int({ min: 1, max: 1000 });

  scheduledDate.setDate(now.getDate() + offset);

  const hour = faker.number.int({ min: 8, max: 17 });
  const minute = faker.helpers.arrayElement([0, 15, 30, 45]);

  scheduledDate.setHours(hour, minute, 0, 0);

  return {
    scheduledAt: scheduledDate.toISOString(),
    serviceDuration: duration,
  };
};

export const scheduleGeneratorWithClient = (daysOffset, duration = 60) => ({
  ...scheduleGenerator(daysOffset, duration),
  client: {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    cpf: generateFakeCPF(),
    phone: faker.phone.number("##########").replace(/\D/g, ""),
  },
});
