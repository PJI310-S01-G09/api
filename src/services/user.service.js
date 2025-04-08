const UserRepository = require('../repositories/user.repository.js')
const { createUserSchema, UserErrorsMap } = require('../validators/user.validator.js')

const errorName = 'UserServiceError'

const UserService = {
    create: async (user) => {
        try {
            const userToCreate = await createUserSchema.validate(user)
            const newUser = await UserRepository.create(userToCreate)
            return [newUser, null]
        } catch (error) {
            console.error(errorName, error)
            return [null, error?.errors || [UserErrorsMap.ErrorCreationUser]]
        }
    }
}

module.exports = UserService
