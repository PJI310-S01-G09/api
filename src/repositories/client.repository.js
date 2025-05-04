const db = require('../db/conn.js')
const tableName = 'clients'

const ClientRepository = {
    create: async (client) => {
        const [id] = await db(tableName).insert(client)
        return { id, ...client }
    },
    update: async (id, client) => {
        const updatedClient = await db(tableName).where({ id }).update(client).returning('*')
        return updatedClient
    },
    show: async (id) => {
        const client = await db(tableName).where({ id }).first()
        return client
    },
    index: async () => {
        const clients = await db(tableName).select('*')
        return clients
    },
    delete: async (id) => {
        const client = await db(tableName).where({ id }).del()
        return client
    },
    createOrUpdateByCPFOrEmail: async (client) => {
        const existingClient = await db(tableName)
            .where(function () {
                this.where('cpf', client.cpf).orWhere('email', client.email);
            })
            .first();
    
        if (existingClient) {
            await db(tableName)
                .where({ id: existingClient.id })
                .update(client);
            return { id: existingClient.id, ...client };
        }
    
        const [id] = await db(tableName).insert(client);
        return { id, ...client };
    }
}

module.exports = ClientRepository
