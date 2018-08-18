const fantasyHelpers = require('../../server/routes/helpers/fantasyHelpers')

const dayCount = (day) => {
  var dd = day.getDate()
  var mm = day.getMonth()+1
  var yyyy = day.getFullYear()

  if(dd<10) {
    dd = '0'+dd
  } 

  if(mm<10) {
    mm = '0'+mm
  } 
  return fantasyHelpers.getDayCount(yyyy, mm, dd)

}

module.exports = dayCount