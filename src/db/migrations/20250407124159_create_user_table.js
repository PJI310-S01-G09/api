/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable('nc_usuario', function (table) {
      table.increments('id');
      table.string('nome', 255).notNullable();
      table.string('email', 255).notNullable();
      table.string('senha', 255).notNullable();
      table.timestamps(true, true);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('nc_usuario')
};
