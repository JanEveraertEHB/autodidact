
exports.up = function(knex) {
  
  knex.schema.hasTable('users').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable('users', function(t) {
        t.increments('id').primary();
        t.uuid('uuid');
        t.string('first_name', 100);
        t.string('last_name', 100);
        t.string('email', 100);
        t.string('password');
        t.string('class');
        t.integer('year', 4);
        t.timestamps(true, true);
      });
    }
  })
  knex.schema.hasTable('attendance').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable('attendance', function(t) {
        t.increments('id').primary();
        t.uuid('uuid');
        t.string("student_id")
        t.integer('checkin');
        t.timestamps(true, true);
      });
    }
  })

  knex.schema.hasTable('noiselevel').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable('noiselevel', function(t) {
        t.increments('id').primary();
        t.uuid('uuid');
        t.string("student_id")
        t.integer('level');
        t.timestamps(true, true);
      });
    }
  })
  knex.schema.hasTable('attention').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable('attention', function(t) {
        t.increments('id').primary();
        t.uuid('uuid');
        t.string("student_id")
        t.integer('attention');
        t.timestamps(true, true);
      });
    }
  })
  knex.schema.hasTable('questions').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable('questions', function(t) {
        t.increments('id').primary();
        t.uuid('uuid');
        t.string("student_id")
        t.string("question")
        t.timestamps(true, true);
      });
    }
  })
};

exports.down = function(knex) {
  
};
