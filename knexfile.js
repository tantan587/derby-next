// Update with your config settings.

module.exports = {
  development: {
    client: 'postgresql',
    connection: 'postgres://koperman:derbyapp123@localhost:5432/derby',
    migrations: {
      directory: __dirname + '/src/server/db/migrations/dev'
    },
    seeds: {
      directory: __dirname + '/src/server/db/seeds/dev'
    }
  },
  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL + '?ssl=true',
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: __dirname + '/src/server/db/migrations/prod'
    },
    seeds: {
      directory: __dirname + '/src/server/db/seeds/dev'
    }
  }
}

