const UserService = require('../services/user.service.js')

const UserController = {
    create: async (req, res) => {
        const [user, error] = await UserService.create(req.body)
        if (!user) {
            return res.status(500).json({ error })
        }
        return res.status(201).json(user)
    }
}

module.exports = UserController
