const messages = []

const draftRoom = (io, socket) =>
{
  let theRoom
  socket.on('room', room =>
  {
    
    theRoom = room
    socket.join(theRoom)
  })

  socket.in(theRoom).on('message', (data) => {
    data.sid = (new Date()).getTime()
    messages.push(data)
    console.log(data)
    io.in(theRoom).emit('message', data)
  })

  socket.in(theRoom).on('startTime', (data) => {
    io.in(theRoom).emit('stop')
    io.in(theRoom).emit('restart', 30)
    setTimeout(() => io.in(theRoom).emit('start'),1000*data)
  })

  socket.in(theRoom).on('draft', () => {
    io.in(theRoom).emit('restart', 30)
  })

}

module.exports = {
  draftRoom
}