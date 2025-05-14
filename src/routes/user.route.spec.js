import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import { userGenerator } from '../../tests/user.generator.js';
import { loginE2E } from '../../tests/login.e2e-tests.js';

const basePath = '/users'

describe('/users', () => {
    describe('POST /users', () => {
      let token = null;
      beforeAll(async () => {
        const [tokenResponse] = await loginE2E()
        token = `Bearer ${tokenResponse}`
      })

      it('fails on unauthorized', async () => {
        const user = userGenerator()
        const res = await request(app).post(basePath).send(user);
    
        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('error');
      })

      it('creates successfully an user', async () => {
        const user = userGenerator()
        const res = await request(app).post(basePath).set('Authorization', token).send(user);
    
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.nome).toBe(user.nome);
        expect(res.body.email).toBe(user.email);
      });
    
      it('fails on missing required fields', async () => {
        const missingFieldsBodies = {
            email: {body: {...userGenerator(), email: undefined}, error: 'email is a required field'},
            nome: {body: {...userGenerator(), nome: undefined}, error: 'nome is a required field'},
            senha: {body: {...userGenerator(), senha: undefined}, error: 'senha is a required field'},
        }

        for(const key in missingFieldsBodies) {
            const { body, error } = missingFieldsBodies[key]
            const res = await request(app).post(basePath).set('Authorization', token).send(body);
        
            expect(res.status).toBe(500);
            expect(res.body).toHaveProperty('error');
            expect(res.body.error).toContain(error);
        }
      });

      it('fails on duplicated users', async () => {
        const user = userGenerator()
        const res = await request(app).post(basePath).set('Authorization', token).send(user);
    
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.nome).toBe(user.nome);
        expect(res.body.email).toBe(user.email);

        const res2 = await request(app).post(basePath).set('Authorization', token).send(user);
        expect(res2.status).toBe(500);
        expect(res2.body).not.toHaveProperty('id');
        expect(res2.body).toHaveProperty('error');
        expect(res2.body.error).toContain('Usuário já existe');
      });
    });
})
