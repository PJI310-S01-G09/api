import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../app.js";
import { clientGenerator } from "../../tests/client.generator.js";
import { loginE2E } from "../../tests/login.e2e-tests.js";

const basePath = "/clients";

describe("/clients", () => {

  let token = null;
  beforeAll(async () => {
    const [tokenResponse] = await loginE2E();
    token = `Bearer ${tokenResponse}`;
  });

  const regRandomClient = async () => {
    const client = clientGenerator();
    const regClient = await request(app).post(basePath).set('Authorization', token).send(client);
    return regClient.body.data;
  };

  describe("POST /clients", () => {
    it("fails on unauthorized", async () => {
      const client = clientGenerator();
      const res = await request(app).post(basePath).send(client);
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("error");
    });

    it("creates successfully a client", async () => {
      const client = clientGenerator();
      const res = await request(app).post(basePath).set('Authorization', token).send(client);

      expect(res.status).toBe(201);
      expect(res.body.data).toHaveProperty("id");
      expect(res.body.data.name).toBe(client.name);
      expect(res.body.data.email).toBe(client.email);
      expect(res.body.data.cpf).toBe(client.cpf);
      expect(res.body.data.phone).toBe(client.phone);
    });

    it("fails on missing required fields", async () => {
      const missingFieldsBodies = {
        name: {
          body: { ...clientGenerator(), name: undefined },
          error: "name is a required field",
        },
        email: {
          body: { ...clientGenerator(), email: undefined },
          error: "email is a required field",
        },
        cpf: {
          body: { ...clientGenerator(), cpf: undefined },
          error: "cpf is a required field",
        },
        phone: {
          body: { ...clientGenerator(), phone: undefined },
          error: "phone is a required field",
        },
      };

      for (const key in missingFieldsBodies) {
        const { body, error } = missingFieldsBodies[key];
        const res = await request(app).post(basePath).set('Authorization', token).send(body);

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("error");
        expect(res.body.error).toContain(error);
      }
    });

    it("fails on duplicated clients", async () => {
      const client = clientGenerator();
      const res = await request(app).post(basePath).set('Authorization', token).send(client);

      expect(res.status).toBe(201);
      expect(res.body.data).toHaveProperty("id");
      expect(res.body.data.name).toBe(client.name);
      expect(res.body.data.email).toBe(client.email);
      expect(res.body.data.cpf).toBe(client.cpf);
      expect(res.body.data.phone).toBe(client.phone);

      const res2 = await request(app).post(basePath).set('Authorization', token).send(client);
      expect(res2.status).toBe(500);
      expect(res2.body.data).toBeNull();
      expect(res2.body).toHaveProperty("error");
      expect(res2.body.error).toContain("Cliente já existe");
    });
  });

  describe("GET /clients", () => {
    it("returns all clients", async () => {
      for (let i = 0; i < 5; i++) {
        await regRandomClient();
      }
      const res = await request(app).get(basePath).set('Authorization', token);
      expect(res.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  describe("GET /clients/:id", () => {
    it("returns a client by id", async () => {
      const client = await regRandomClient();
      const res = await request(app).get(`${basePath}/${client.id}`).set('Authorization', token);
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty("id");
      expect(res.body.data.name).toBe(client.name);
      expect(res.body.data.email).toBe(client.email);
      expect(res.body.data.cpf).toBe(client.cpf);
      expect(res.body.data.phone).toBe(client.phone);
    });

    it("returns 404 for non-existing client", async () => {
      const res = await request(app).get(`${basePath}/999999`).set('Authorization', token);
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error).toContain("Cliente não encontrado");
    });
  });
});
