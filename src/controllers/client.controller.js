const ClientService = require('../services/client.service.js')

const ClientController = {
    create: async (req, res) => {
        const [client, error] = await ClientService.create(req.body)
        if (!client) {
            return res.status(500).json({ error })
        }
        return res.status(201).json(client)
    },
    show: async (req, res) => {
        const { id } = req.params
        const [client, error] = await ClientService.show(id)
        if (!client) {
            return res.status(404).json({ error })
        }
        return res.status(200).json(client)
    },
    index: async (req, res) => {
        const [clients, error] = await ClientService.index()
        if (!clients) {
            return res.status(500).json({ error })
        }
        return res.status(200).json(clients)
    },
}

module.exports = ClientController
