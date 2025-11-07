
exports.up = function(knex) {
  
  knex.schema.hasTable('actions').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable('actions', function(t) {
        t.increments('id').primary();
        t.uuid('uuid');
        t.string('student_id', 100);
        t.string('action', 100);
        t.json('payload');
        t.timestamps(true, true);
      });
    }
  })
};

exports.down = function(knex) {
  knex.schema.dropTable('actions')
  
};
