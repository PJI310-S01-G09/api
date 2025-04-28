import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import { clientGenerator } from '../../tests/client.generator.js';

const basePath = '/clients'

describe('/clients', () => {
    describe('POST /clients', () => {
      it('creates successfully a client', async () => {
        const client = clientGenerator()
        const res = await request(app).post(basePath).send(client);

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.name).toBe(client.name);
        expect(res.body.email).toBe(client.email);
        expect(res.body.cpf).toBe(client.cpf);
        expect(res.body.phone).toBe(client.phone);
      });
    
      it('fails on missing required fields', async () => {
        const missingFieldsBodies = {
            name: {body: {...clientGenerator(), name: undefined}, error: 'name is a required field'},
            email: {body: {...clientGenerator(), email: undefined}, error: 'email is a required field'},
            cpf: {body: {...clientGenerator(), cpf: undefined}, error: 'cpf is a required field'},
            phone: {body: {...clientGenerator(), phone: undefined}, error: 'phone is a required field'},
        }

        for(const key in missingFieldsBodies) {
            const { body, error } = missingFieldsBodies[key]
            const res = await request(app).post(basePath).send(body);
        
            expect(res.status).toBe(500);
            expect(res.body).toHaveProperty('error');
            expect(res.body.error).toContain(error);
        }
      });

      it('fails on duplicated clients', async () => {
        const client = clientGenerator()
        const res = await request(app).post(basePath).send(client);
    
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.name).toBe(client.name);
        expect(res.body.email).toBe(client.email);
        expect(res.body.cpf).toBe(client.cpf);
        expect(res.body.phone).toBe(client.phone);

        const res2 = await request(app).post(basePath).send(client);
        expect(res2.status).toBe(500);
        expect(res2.body).not.toHaveProperty('id');
        expect(res2.body).toHaveProperty('error');
        expect(res2.body.error).toContain('Cliente já existe');
      });
    });
})
