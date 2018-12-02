class DayCountCreator {

  constructor(){

  }

  GetDayCountByDate(day){
    var dd = day.getDate()
    var mm = day.getMonth()+1
    var yyyy = day.getFullYear()
  
    if(dd<10) {
      dd = '0'+dd
    } 
  
    if(mm<10) {
      mm = '0'+mm
    } 
    return this.GetDayCountByYMD(yyyy, mm, dd)
  }
  GetDayCountByYMD(year,month,day)
  {
    const date = new Date(year + ' ' + month + ' ' + day + ' ' + '00:00:00 GMT-04:00')
    // The number of milliseconds in one day
    var ONE_DAY = 1000 * 60 * 60 * 24
  
    //my starting point 08/25/2013 12AM EST
    var startingDate = 1377403200000
    var date_ms = date.getTime()
  
    // Convert back to days and return
    return Math.floor((date_ms - startingDate)/ONE_DAY)
  }

}
module.exports = DayCountCreator
