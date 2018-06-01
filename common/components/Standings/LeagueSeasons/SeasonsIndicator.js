const schedules = {
  'NFL Football': ['August 1 2017', 'February 1 2018'],
  'NCAA Football': ['September 10 2017', 'January 10 2018'],
  'NHL Hockey': ['October 20 2017', 'June 25 2018'],
  'NCAA Basketball': ['November 1 2017', 'April 25 2018'],
  'NBA': ['November 5 2017', 'June 25 2018'],
  'English Premier League': ['August 15 2017', 'July 25 2018'],
  'MLB Baseball': ['April 20 2018', 'October 30 2018']
}


const SeasonsIndicator = ({ start, end, fullDifference }) =>
  <div style={{ backgroundColor: '#299149', textTransform: 'uppercase' }}>
    {
      Object.keys(schedules).map(schedule => <div key={schedule} style={{ display: 'flex' }}>
        <div
          style={{ width: ( Date.parse(schedules[schedule][0]) - start ) / fullDifference * 100 + '%' }}
        />
        <div
          style={{
            backgroundColor: '#0E7838',
            color: 'white',
            width: ( Date.parse(schedules[schedule][1]) - Date.parse(schedules[schedule][0]) ) / fullDifference * 100 + '%'
          }}>
          &nbsp; &nbsp; { schedule } season
        </div>
        <div
          style={{ width: ( end - Date.parse(schedules[schedule][1]) ) / fullDifference * 100 + '%' }}
        />
      </div>)
    }
  </div>

export default SeasonsIndicator
