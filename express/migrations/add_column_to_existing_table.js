import  knex  from 'knex';

export const up = async (knex) => {
    return knex.schema.alterTable('documents', table => {
      table.boolean('isDeleted', false);
    })
}

export const down = async (knex) => {
    return knex.schema.alterTable('documents', table => {
        table.dropColumn('isDeleted');
      })
};