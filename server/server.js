const bodyParser = require('body-parser')
const passport = require('passport')
const authRoutes = require('./routes/auth')
const fantasyRoutes = require('./routes/fantasy')
const sportRoutes = require('./routes/sports')
const draftRoutes = require('./routes/draft')

const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const next = require('next')
const session = require('express-session')

const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const handle = nextApp.getRequestHandler()
const mySocketIo = require('./socketio/socketio')

mySocketIo.startSocketIo(io)

nextApp.prepare()
  .then(() => {

    app.use(bodyParser.json())
    app.use(require('cookie-parser')())
    app.use(session({
      store: new (require('connect-pg-simple')(session))({
        conString: require('../knexfile.js')[process.env.NODE_ENV].connection,
        schemaName: 'users',
        tableName : 'session',
      }),
      secret: 'keyboard cat',
      resave: false,
      cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
    }))
    
    app.use(passport.initialize())
    app.use(passport.session())
    app.use('/api', authRoutes)
    app.use('/api', fantasyRoutes)
    app.use('/api', sportRoutes)
    app.use('/api', draftRoutes)

    app.get('*', (req, res) => {
      return handle(req, res)
    })

    server.listen(process.env.PORT || 3000, (err) => {
      if (err) throw err
      // eslint-disable-next-line no-console
      console.log(process.env.PORT)
      // eslint-disable-next-line no-console
      console.log('> Ready on http://localhost:3000')
    })
  })
  .catch((ex) => {
    // eslint-disable-next-line no-console
    console.error(ex.stack)
    process.exit(1)
  })