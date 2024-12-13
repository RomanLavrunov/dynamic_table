export async function up(knex) {
    await knex.schema.alterTable('documents', (table) => {
      table.boolean('isDeleted').defaultTo(0); 
    });
  }
  
  export async function down(knex) {
    await knex.schema.alterTable('documents', (table) => {
      table.dropColumn('isDeleted');
    });
  }