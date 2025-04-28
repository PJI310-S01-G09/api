/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("clients", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("email").notNullable().unique();
    table.string("phone").notNullable();
    table.string("cpf").notNullable().unique();
    table.timestamps(true, true);
  });

  await knex.schema.createTable("schedule", (table) => {
    table.increments("id").primary();
    table
      .integer("client_id")
      .unsigned()
      .references("id")
      .inTable("clients")
      .onDelete("CASCADE");
    table.datetime("scheduled_at").notNullable();
    table.integer("service_duration").notNullable();
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.dropTable('schedule')
    await knex.schema.dropTable('clients')
};
