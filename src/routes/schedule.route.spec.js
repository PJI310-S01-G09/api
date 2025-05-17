import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../app.js";
import { clientGenerator } from "../../tests/client.generator.js";
import {
  getNextAvailableHour,
  scheduleGeneratorWithClient,
} from "../../tests/schedule.generator.js";
import { loginE2E } from "../../tests/login.e2e-tests.js";
import moment from "moment";

const basePath = "/schedule";

describe("/schedule", () => {
  let token = null;
  beforeAll(async () => {
    const [tokenResponse] = await loginE2E();
    token = `Bearer ${tokenResponse}`;
  });
  describe("POST /schedule", () => {
    it("creates successfully a schedule", async () => {
      const body = await scheduleGeneratorWithClient()
      const res = await request(app).post(basePath).send(body);

      expect(res.status).toBe(201);
      expect(res.body.data).toHaveProperty("id");
      expect(res.body.data.clientId).toBeDefined();
      expect(res.body.data.clientId).toBeGreaterThanOrEqual(1);
      expect(res.body.data.scheduledAt).toBeDefined();
    });

    it("fails on missing required fields", async () => {
      const missingFieldsBodies = {
        scheduledAt: {
          body: { ...await scheduleGeneratorWithClient(), scheduledAt: undefined },
          error: "scheduledAt is a required field",
        },
        serviceDuration: {
          body: {
            ...await scheduleGeneratorWithClient(),
            serviceDuration: undefined,
          },
          error: "serviceDuration is a required field",
        },
      };

      for (const key in missingFieldsBodies) {
        const { body, error } = missingFieldsBodies[key];
        const res = await request(app).post(basePath).send(body);

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("error");
        expect(res.body.error).toContain(error);
      }
    });

    it("fails on duplicated schedules", async () => {
      const schedule = await scheduleGeneratorWithClient();
      const res = await request(app).post(basePath).send(schedule);

      expect(res.status).toBe(201);
      expect(res.body.data).toHaveProperty("id");
      expect(res.body.data.clientId).toBeDefined();
      expect(res.body.data.clientId).toBeGreaterThanOrEqual(1);
      expect(res.body.data.scheduledAt).toBeDefined();

      const res2 = await request(app).post(basePath).send(schedule);
      expect(res2.status).toBe(500);
      expect(res2.body).not.toHaveProperty("id");
      expect(res2.body).toHaveProperty("error");
      expect(res2.body.error).toContain(
        "Agendamento não permitido - Conflito de horários"
      );
    });

    it("fails when scheduling outside business hours", async () => {
      const client = clientGenerator();

      const now = new Date();
      const date = new Date(now);
      date.setDate(date.getDate() + 2);
      date.setHours(7, 0, 0, 0);

      const body = {
        client,
        scheduledAt: date.toISOString(),
        serviceDuration: 60,
      };

      const res = await request(app).post(basePath).send(body);

      expect(res.status).toBe(500);
      expect(res.body.error).toContain(
        "Agendamento não permitido: fora do horário de funcionamento."
      );
    });

    it("fails when scheduling conflicts with existing schedule", async () => {
      const { date, hour } = await getNextAvailableHour()
      const nextAvailableHour = moment(`${date} ${hour}`, 'YYYY-MM-DD HH:mm')
      const body1 = {
        client: clientGenerator(),
        serviceDuration: 60,
        scheduledAt: nextAvailableHour.toISOString()
      };

      const res1 = await request(app).post(basePath).send(body1);
      expect(res1.status).toBe(201);

      const body2 = {...body1, scheduledAt: nextAvailableHour.add(20, "minutes").toISOString()};
      
      const res2 = await request(app).post(basePath).send(body2);
      expect(res2.status).toBe(500);
      expect(res2.body.error).toContain("Agendamento não permitido - Conflito de horários");
    });
  });
});
