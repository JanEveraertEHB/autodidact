
exports.up = function(knex) {
  
  knex.schema.hasTable('request').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable('request', function(t) {
        t.increments('id').primary();
        t.uuid('uuid');
        t.string('student_id', 100);
        t.string('request', 100);
        t.json('payload');
        t.boolean('active').defaultTo(false);
        t.timestamps(true, true);
      });
    }
  })
};

exports.down = function(knex) {
  
  knex.schema.dropTable('request')
};
