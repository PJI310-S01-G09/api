import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../app.js";
import { clientGenerator } from "../../tests/client.generator.js";
import {
  scheduleGenerator,
  scheduleGeneratorWithClient,
} from "../../tests/schedule.generator.js";
import { loginE2E } from "../../tests/login.e2e-tests.js";

const basePath = "/schedule";

describe("/schedule", () => {
  let token = null;
  beforeAll(async () => {
    const [tokenResponse] = await loginE2E();
    token = `Bearer ${tokenResponse}`;
  });
  describe("POST /schedule", () => {
    it("creates successfully a schedule", async () => {
      const client = clientGenerator();
      const schedule = scheduleGenerator();
      const body = {
        ...schedule,
        client,
      }
      const res = await request(app)
        .post(basePath)
        .send(body);

      expect(res.status).toBe(201);
      expect(res.body.data).toHaveProperty("id");
      expect(res.body.data.clientId).toBeDefined();
      expect(res.body.data.clientId).toBeGreaterThanOrEqual(1);
      expect(res.body.data.scheduledAt).toBeDefined();
    });

    it("fails on missing required fields", async () => {
      const missingFieldsBodies = {
        scheduledAt: {
          body: { ...scheduleGeneratorWithClient(), scheduledAt: undefined },
          error: "scheduledAt is a required field",
        },
        serviceDuration: {
          body: {
            ...scheduleGeneratorWithClient(),
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
      const schedule = scheduleGeneratorWithClient();
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
  });
});
