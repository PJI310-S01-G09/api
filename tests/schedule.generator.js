const { faker } = require("@faker-js/faker");

function generateFakeCPF() {
  let cpf = "";
  for (let i = 0; i < 11; i++) {
    cpf += faker.number.int({ min: 0, max: 9 }).toString();
  }
  return cpf;
}

import { faker } from "@faker-js/faker";

export const scheduleGenerator = (daysOffset, duration = 60) => {
  const now = new Date();
  const scheduledDate = new Date(now);

  const offset =
    typeof daysOffset === "number"
      ? daysOffset
      : faker.number.int({ min: 1, max: 1000 });

  scheduledDate.setDate(now.getDate() + offset);

  const openingHour = 8;
  const closingHour = 18;
  const maxStartHour = closingHour - Math.ceil(duration / 60);

  const hour = faker.number.int({ min: openingHour, max: maxStartHour });
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
