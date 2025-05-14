const db = require('../db/conn.js');
const tableName = 'business_exceptions';

const BusinessExceptionsRepository = {
  create: async (data) => {
    const [id] = await db(tableName).insert({
      date: data.date,
      reason: data.reason,
      is_open: data.isOpen ?? false
    });
    return { id, ...data };
  },

  update: async (id, data) => {
    const updatedBusinessException = await db(tableName).where({ id }).update({
      date: data.date,
      reason: data.reason,
      is_open: data.isOpen ?? undefined
    }).returning('*');
    return updatedBusinessException;
  },

  show: async ({ isOpen } = {}) => {
    const query = db(tableName);

    if (isOpen) query.where({ is_open: isOpen });

    const exceptions = await query.select('*');
    return exceptions;
  },

  index: async (id) => {
    const exception = await db(tableName).where({ id }).first();
    return exception;
  },

  delete: async (id) => {
    const exception = await db(tableName).where({ id }).del();
    return exception;
  }
};

module.exports = BusinessExceptionsRepository;
