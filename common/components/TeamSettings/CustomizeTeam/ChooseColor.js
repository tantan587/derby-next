const R = require('ramda')
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import Grid from '@material-ui/core/Grid'
import Colors from '../../Icons/Avatars/Colors'

const styles = {
  container: {
    '&:hover': {
      backgroundColor: '#E3DAC9',
      cursor: 'pointer'
    }
  },
  colorContainer: {
    borderTop: '2px solid black',
    borderLeft: '2px solid black',
    borderRight: '2px solid black',
    borderBottom: '2px solid black',
  }
}

const mapItems = (cls, handler) => arr => arr.map((color,i) =>
  <Grid key={i} item xs={4} sm={2} md={4} style={{ display: 'flex', justifyContent: 'center' }}>
    <div
      className={cls[1]}
      onClick={() => handler(color[0])}
    >
      <div className={cls[0]} style={{
        margin: 5,
        height: 40,
        width: 40,
        backgroundColor: color[1],
      }} />
    </div>
  </Grid>
)

const ChooseColor = withStyles(styles)(({ classes, handleColorClick }) =>
  <Card style={{ paddingTop: 10, paddingBottom: 10 }}>
    <Grid container justify="space-between">
      {R.pipe(
        R.omit(['Default']),
        R.toPairs,
        mapItems([classes.colorContainer, classes.container], handleColorClick)
      )(Colors)}
    </Grid>
  </Card>)

export default ChooseColor
