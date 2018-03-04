const localDateTime = (extraHours = 0) =>
{
  const x = new Date()
  x.setHours(extraHours + x.getHours() - x.getTimezoneOffset() / 60)
  return x
}

export function myTimeout(callback, delay) {
  var id, started, remaining = delay, running

  this.start = function() {
    running = true
    started = new Date()
    id = setTimeout(callback, remaining)
  }

  this.pause = function() {
    running = false
    clearTimeout(id)
    remaining -= new Date() - started
  }

  this.getTimeLeft = function() {
    if (running) {
      this.pause()
      this.start()
    }

    return remaining
  }

  this.getStateRunning = function() {
    return running
  }

  this.start()
}

export const GetLocalDateStr = () =>
{
  return localDateTime().toJSON().slice(0,10)
}

export const GetTomorrowLocalDateTimeStr = () =>
{
  return localDateTime(24).toJSON().slice(0,16)
}

export const GetLocalDateTimeStr = () =>
{
  return localDateTime().toJSON().slice(0,16)
}


export const GetFullDateStr = (date) =>
{
  var split = date.split('-')
  var d = new Date(split[0],split[1]-1,split[2])

  return weekdays[d.getDay()] + ', ' + monthNames[d.getMonth()] + ' ' + (d.getDate()) + ', ' + d.getFullYear()
}

export const GetCountdownTimeStr = (num) =>
{
  const sec = 1
  const min = sec * 60
  const hour = min * 60
  const day = hour * 24
  let daysRemaining = Math.floor(num / day)
  let hourRemaining = Math.floor((num- daysRemaining *day) / hour) 
  let minRemaining = Math.floor((num- daysRemaining *day - hourRemaining*hour) / min)
  let secRemaining = Math.floor((num- daysRemaining *day- hourRemaining*hour- minRemaining*min) / sec)

  let str =  daysRemaining + ' Days ' + hourRemaining + ' Hours ' + minRemaining + ' Minutes ' + secRemaining + ' Seconds '
  return str
}

export const GetNextDay = (inputDay, forward) =>
{
  const date = new Date(inputDay+'T00:00:00')
    
  date.setDate(date.getDate() + (forward ? 1 : -1))
  let month = date.getMonth() + 1
  month = month < 10 ? '0' + month : month
  let day = date.getDate()
  day = day < 10 ? '0' + day : day
  return date.getFullYear() + '-' + month + '-' + day
}

export const Timezones = {'0': {value:'-07', name:'PST'},'1': {value:'-06', name:'MST'},'2': {value:'-05',name:'CST'},'3': {value:'-04', name:'EST'}}

const weekdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']
