const UserService = require('../services/user.service.js')

const UserController = {
    create: async (req, res) => {
        const user = await UserService.create(req.body)
        if (!user) {
            return res.status(500).json({ error: "User couldn't be created" })
        }
        return res.status(201).json(user)
    }
}

module.exports = UserController
