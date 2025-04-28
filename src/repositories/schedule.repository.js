const db = require('../db/conn.js')
const tableName = 'schedule'

const ScheduleRepository = {
    create: async (schedule) => {
        const { clientId, scheduledAt, serviceDuration , ...scheduleData } = schedule
        const [id] = await db(tableName).insert({
            ...scheduleData,
            client_id: clientId,
            scheduled_at: scheduledAt,
            service_duration: serviceDuration
        })
        return { id, ...schedule }
    },
    update: async (id, schedule) => {
        const updatedSchedule = await db(tableName).where({ id }).update(schedule).returning('*')
        return updatedSchedule
    },
    index: async (id) => {
        const schedule = await db(tableName).where({ id }).first()
        return schedule
    },
    delete: async (id) => {
        const schedule = await db(tableName).where({ id }).del()
        return schedule
    }
}

module.exports = ScheduleRepository
