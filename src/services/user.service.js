const UserRepository = require('../repositories/user.repository.js')

const errorName = 'UserServiceError'

const UserService = {
    create: async (user) => {
        try {
            return await UserRepository.create(user)
        } catch (error) {
            console.error(errorName, error)
            return null
        }
    }
}

module.exports = UserService
