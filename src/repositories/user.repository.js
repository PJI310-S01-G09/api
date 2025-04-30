const db = require('../db/conn.js')
const tableName = 'nc_usuario'

const UserRepository = {
    create: async (user) => {
        const [id] = await db(tableName).insert(user)
        return { id, ...user }
    },
    update: async (id, user) => {
        const updatedUser = await db(tableName).where({ id }).update(user).returning('*')
        return updatedUser
    },
    show: async () => {
        const users = await db(tableName).select('*')
        return users
    },
    index: async (id) => {
        const user = await db(tableName).where({ id }).first()
        return user
    },
    delete: async (id) => {
        const user = await db(tableName).where({ id }).del()
        return user
    }
}

module.exports = UserRepository
