const AuthService = require('../services/auth.service.js')
const { mountResponse } = require('../utils/mount_response.js')
const { AuthMessageMap } = require('../validators/auth.validator.js')

const AuthController = {
    login: async (req, res) => {
        const { email, senha: password } = req.body

        const [token, error] = await AuthService.login(email, password)
        if (!token) {
            const response = mountResponse(null, error)
            if (error === AuthMessageMap.ErrorInvalidLogin){
                return res.status(401).json(response)
            }
            return res.status(500).json(response)
        }

        return res.status(201).json(mountResponse(token, null, AuthMessageMap.SuccessOnLogin))
    },
}

module.exports = AuthController
