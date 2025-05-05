const ClientService = require('../services/client.service.js')
const { mountResponse } = require('../utils/mount_response.js')
const { ClientMessageMap } = require('../validators/client.validator.js')

const ClientController = {
    create: async (req, res) => {
        const [client, error] = await ClientService.create(req.body)
        if (!client) {
            return res.status(500).json(mountResponse(null, error))
        }
        return res.status(201).json(mountResponse(client, null, ClientMessageMap.SuccessoOnCreateClient))
    },
    show: async (req, res) => {
        const { id } = req.params
        const [client, error] = await ClientService.show(id)
        if (!client) {
            return res.status(404).json(mountResponse(null, error))
        }
        return res.status(200).json(mountResponse(client, null, ClientMessageMap.SuccessOnGetClient))
    },
    index: async (req, res) => {
        const [clients, error] = await ClientService.index()
        if (!clients) {
            return res.status(500).json(mountResponse(null, error))
        }
        return res.status(200).json(mountResponse(clients, null, ClientMessageMap.SuccessOnGetClients))
    },
}

module.exports = ClientController
