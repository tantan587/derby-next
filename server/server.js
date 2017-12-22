const express = require('express')
const next = require('next')
const bodyParser = require('body-parser')
const passport = require('passport')
const authRoutes = require('./routes/auth')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare()
  .then(() => {
    const server = express()

    server.use(bodyParser.json())
    server.use(require('cookie-parser')())
    server.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }))
    server.use(passport.initialize())
    server.use(passport.session())
    server.use('/api', authRoutes)

    server.get('*', (req, res) => {
      return handle(req, res)
    })

    server.listen(process.env.PORT || 3000, (err) => {
      if (err) throw err
      console.log(process.env.PORT)
      console.log('> Ready on http://localhost:3000')
    })
  })
  .catch((ex) => {
    console.error(ex.stack)
    process.exit(1)
  })