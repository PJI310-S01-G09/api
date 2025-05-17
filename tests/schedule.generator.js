import request from "supertest";
import app from "../src/app.js";
const { faker } = require("@faker-js/faker");

function generateFakeCPF() {
  let cpf = "";
  for (let i = 0; i < 11; i++) {
    cpf += faker.number.int({ min: 0, max: 9 }).toString();
  }
  return cpf;
}

import { faker } from "@faker-js/faker";

export async function getNextAvailableHour() {
  const res = await request(app).get("/schedule/free-hours");

  if (res.status !== 200 || !res.body.data || res.body.data.length === 0) {
    throw new Error("Nenhum horário disponível encontrado");
  }

  const { date, slots } = res.body.data[0];

  if (!slots || slots.length === 0) {
    throw new Error("Nenhum slot disponível encontrado");
  }

  return {
    date,
    hour: slots[0]
  }
}

export async function scheduleGenerator(duration = 60) {
  const { date, hour } = await getNextAvailableHour()

  const scheduledAt = `${date}T${hour}:00`;
  return {
    scheduledAt: scheduledAt,
    serviceDuration: duration,
  };
}

export const scheduleGeneratorWithClient = async (duration = 60) => ({
  ...(await scheduleGenerator(duration)),
  client: {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    cpf: generateFakeCPF(),
    phone: faker.phone.number("##########").replace(/\D/g, ""),
  },
});
