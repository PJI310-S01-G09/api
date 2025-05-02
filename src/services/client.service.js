const ClientRepository = require('../repositories/client.repository.js')
const { createClientSchema, ClientErrorsMap, validateClientError } = require('../validators/client.validator.js')

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
            return [null, errorMessage || [ClientErrorsMap.ErrorCreationClient]]
        }
    },
    show: async (id) => {
        try {
            const client = await ClientRepository.show(id)
            if (!client || client.length === 0) {
                return [null, [ClientErrorsMap.ClientNotFound]]
            }
            return [client, null]
        } catch (error) {
            console.error(errorName, error)
            return [null, [ClientErrorsMap.ErrorShowClient]]
        }
    },
    index: async () => {
        try {
            const clients = await ClientRepository.index()
            return [clients, null]
        } catch (error) {
            console.error(errorName, error)
            return [null, [ClientErrorsMap.ErrorShowClient]]
        }
    },
}

module.exports = ClientService
