// Update with your config settings.

module.exports = {
  development: {
    client: 'postgresql',
    connection: 'postgres://koperman:derbyapp123@localhost:5432/derby',
    migrations: {
      directory: __dirname + '/server/db/migrations/dev'
    },
    seeds: {
      directory: __dirname + '/server/db/seeds/dev'
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
      directory: __dirname + '/server/db/migrations/prod'
    },
    seeds: {
      directory: __dirname + '/server/db/seeds/prod'
    }
  }
}
