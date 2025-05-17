const db = require('../db/conn.js')
const { mapClientFields } = require('../validators/client.validator.js')
const tableName = 'clients'

const ClientRepository = {
    create: async (client) => {
        const [id] = await db(tableName).insert({
            cpf: client.cpf,
            name: client.name,
            email: client.email,
            phone: client.phone,
            is_whatsapp: client.isWhatsapp ?? false,
        })
        return { id, ...client }
    },
    update: async (id, client) => {
        const updatedClient = await db(tableName).where({ id }).update({
            cpf: client.cpf,
            name: client.name,
            email: client.email,
            phone: client.phone,
            is_whatsapp: client.isWhatsapp,
        }).returning('*')
        return updatedClient
    },
    show: async (id) => {
        const client = await db(tableName).where({ id }).first();
        if (!client) return null;
    
        const schedules = await db('schedule')
            .where({ client_id: id })
            .select('id', 'scheduled_at', 'service_duration', 'created_at', 'updated_at');
    
        return mapClientFields({ ...client, schedules });
    },
    index: async () => {
        const clients = await db(tableName).select('*');
    
        const clientIds = clients.map(c => c.id);
    
        const schedules = await db('schedule')
            .whereIn('client_id', clientIds)
            .select('id', 'client_id', 'scheduled_at', 'service_duration', 'created_at', 'updated_at');
    
        const scheduleMap = schedules.reduce((acc, s) => {
            acc[s.client_id] = acc[s.client_id] || [];
            acc[s.client_id].push(s);
            return acc;
        }, {});
    
        return clients.map(client => {
            return mapClientFields({
                ...client,
                schedules: scheduleMap[client.id] || []
            });
        });
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
            await ClientRepository.update(existingClient.id, client)
            return { id: existingClient.id, ...client };
        }
    
        const { id } = await ClientRepository.create(client);
        return { id, ...client }
    }
}

module.exports = ClientRepository
