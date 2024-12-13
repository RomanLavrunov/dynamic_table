import  knex  from 'knex';

export const up = async (knex) => {
  
  return knex.schema.createTable('documents', (table) => {
    table.increments('id').primary();  
    table.string('state').index();
    table.timestamp('stateTime')
    table.string('documentNumber').unique(); 
    table.string('documentName')
    table.date('documentDate')
    table.integer('documentTotalAmount')
    table.integer('eligibleAmount').nullable();
    table.integer('version');
    table.decimal('eligiblePercentage', 5, 2).nullable();
    table.timestamps(true, true);
  });
};

export const down = async (knex) => {
  return knex.schema.dropTable('documents');
};