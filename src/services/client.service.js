const ClientRepository = require('../repositories/client.repository.js')
const { createClientSchema, ClientMessageMap, validateClientError } = require('../validators/client.validator.js')

const errorName = 'ClientServiceError'

const ClientService = {
    create: async (client) => {
        try {
            const clientToCreate = await createClientSchema.validate(client)
            const newClient = await ClientRepository.create({
                ...clientToCreate,
                cpf: clientToCreate.cpf.replace(/\D/g, ''),
                phone: clientToCreate.phone.replace(/\D/g, ''),
            })
            return [newClient, null]
        } catch (error) {
            console.error(errorName, error)
            const errorMessage = validateClientError(error)
            return [null, errorMessage || [ClientMessageMap.ErrorCreationClient]]
        }
    },
    show: async (id) => {
        try {
            const client = await ClientRepository.show(id)
            if (!client || client.length === 0) {
                return [null, [ClientMessageMap.ClientNotFound]]
            }
            return [client, null]
        } catch (error) {
            console.error(errorName, error)
            return [null, [ClientMessageMap.ErrorShowClients]]
        }
    },
    index: async () => {
        try {
            const clients = await ClientRepository.index()
            return [clients, null]
        } catch (error) {
            console.error(errorName, error)
            return [null, [ClientMessageMap.ErrorShowClient]]
        }
    },
}

module.exports = ClientService
