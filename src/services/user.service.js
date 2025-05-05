const UserRepository = require('../repositories/user.repository.js')
const { createUserSchema, UserErrorsMap, validateUserError } = require('../validators/user.validator.js')
const AuthService = require('./auth.service.js')

const errorName = 'UserServiceError'

const UserService = {
    create: async (user) => {
        try {
            const userToCreate = await createUserSchema.validate(user)
            const newUser = await UserRepository.create({
                ...userToCreate,
                senha: await AuthService.hashPassword(userToCreate.senha)
            })

            delete newUser.senha
            return [newUser, null]
        } catch (error) {
            console.error(errorName, error)
            const errorMessage = validateUserError(error)
            return [null, errorMessage || [UserErrorsMap.ErrorCreationUser]]
        }
    }
}

module.exports = UserService
