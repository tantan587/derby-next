import { withStyles } from '@material-ui/core/styles'

// const  monthDiff = (d1, d2) => {
//   var months
//   months = (d2.getFullYear() - d1.getFullYear()) * 12
//   months -= d1.getMonth() + 1
//   months += d2.getMonth()
//   return months <= 0 ? 0 : months
// }

const styles = theme => ({
  month: {
    [theme.breakpoints.only('xs')]: {
      fontSize: '1.35vh',
      lineHeight: '200%',
    }
  }
})

const MonthIndicator = withStyles(styles)(({ classes }) => {
  //this needs to be automated
  const monthsToRender = [null, 'sep', null, 'nov', null, 'jan', null, 'mar', null, 'may', null, 'jul', null, 'sep', null]
  const NUM_MONTHS = monthsToRender.length


  return (
    <div style={{
      display: 'flex',
      overflow: 'hidden',
      height: 20,
      textTransform: 'uppercase',
      backgroundColor: '#299149',
      borderTop: '1px solid white',
      borderBottom: '1px solid white',
      // paddingTop: '2px'
    }}>
      {
        monthsToRender.map((month, i) => <div key={i} className={classes.month} style={{
          // backgroundColor: '#299149',
          color: 'white',
          // fontSize: '16px',
          width: 100 / NUM_MONTHS + '%',
          textAlign: 'center',
          // alignSelf: 'center'
          borderLeft: '1px solid white',
          borderRight: '1px solid white',
        }}
        >
          { month ? month : '' }
        </div>)
      }
    </div>
  )
})

export default MonthIndicator
