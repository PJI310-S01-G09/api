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
    }
}

module.exports = ClientService
