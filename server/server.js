
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

const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const handle = nextApp.getRequestHandler()
const mySocketIo = require('./socketio/socketio')



//setInterval(() => {console.log('here1')}, 1000)



// io.on('connection', socket => {
//   socket.on('message', (data) => {
//     messages.push(data)
//     socket.broadcast.emit('message', data)
//   })
// })

io.sockets.on('connection', socket => mySocketIo.draftRoom(io,socket))

// const room = 'room123'
// io.sockets.in(room).emit('message', 'what is going on, party people?');

nextApp.prepare()
  .then(() => {

    app.use(bodyParser.json())
    app.use(require('cookie-parser')())
    app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }))
    app.use(passport.initialize())
    app.use(passport.session())
    app.use('/api', authRoutes)
    app.use('/api', fantasyRoutes)
    app.use('/api', sportRoutes)
    app.use('/api', draftRoutes)

    // app.get('/messages', (req, res) => {
    //   console.log(messages)
    //   res.json(messages)
    // })

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