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

  socket.in(theRoom).on('startTime', (startTime) => {
    let date = new Date(new Date().getTime() + startTime * 1000)
    io.in(theRoom).emit('stop')
    io.in(theRoom).emit('restart', {clock: 10, draftStartTime: date.toJSON()})
    setTimeout(() => io.in(theRoom).emit('start'),1000*startTime)
  })

  socket.in(theRoom).on('draft', () => {
    io.in(theRoom).emit('restart', {clock: 10})
  })

}

module.exports = {
  draftRoom
}