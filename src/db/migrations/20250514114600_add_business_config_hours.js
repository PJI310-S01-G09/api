/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable('business_hours', (table) => {
    table.integer('weekday').primary()
    table.time('start_time').notNullable()
    table.time('end_time').notNullable()
    table.boolean('is_open').defaultTo(true)
  })

  await knex('business_hours').insert([
    { weekday: 0, start_time: '00:00:00', end_time: '00:00:00', is_open: false }, // Sunday
    { weekday: 1, start_time: '08:00:00', end_time: '18:00:00', is_open: true },
    { weekday: 2, start_time: '08:00:00', end_time: '18:00:00', is_open: true },
    { weekday: 3, start_time: '08:00:00', end_time: '18:00:00', is_open: true },
    { weekday: 4, start_time: '08:00:00', end_time: '18:00:00', is_open: true },
    { weekday: 5, start_time: '08:00:00', end_time: '18:00:00', is_open: true },
    { weekday: 6, start_time: '08:00:00', end_time: '12:00:00', is_open: true }, // Saturday
  ])

  await knex.schema.createTable("business_exceptions", (table) => {
    table.increments("id").primary();
    table.date("date").notNullable().unique();
    table.string("reason");
    table.boolean("is_open").defaultTo(false);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTable("business_hours");
  await knex.schema.dropTable("business_exceptions");
};
