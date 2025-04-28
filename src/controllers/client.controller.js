const ClientService = require('../services/client.service.js')

const ClientController = {
    create: async (req, res) => {
        const [client, error] = await ClientService.create(req.body)
        if (!client) {
            return res.status(500).json({ error })
        }
        return res.status(201).json(client)
    }
}

module.exports = ClientController
