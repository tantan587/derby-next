const R = require('ramda')
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import Grid from '@material-ui/core/Grid'

import Silk from '../../Icons/Avatars/Silk'
import Patterns from '../../Icons/Avatars/Patterns'

const styles = {
  container: {
    '&:hover': {
      backgroundColor: '#E3DAC9',
      cursor: 'pointer',
    }
  },
  mapItem: {
    display: 'flex',
    justifyContent: 'center',
  }
}

const mapItems = (cls, handler) => arr => arr.map(pattern =>
  <Grid item xs={4} sm={3} key={pattern[0]} className={cls[1]}>
    <div
      className={cls[0]}
      onClick={() => handler(Patterns[pattern[0]])}
    >
      <Silk
        pattern={pattern[1].silk}
        style={{ height: 80, margin: 5, marginBottom: 0 }}
      />
    </div>
  </Grid>
)

const ChoosePattern = withStyles(styles)(({ classes, handlePatternClick }) =>

  <Card style={{ paddingTop: 10, paddingBottom: 10 }}>
    <Grid container justify="space-between">
      {R.pipe(
        R.omit(['Default']),
        R.toPairs,
        mapItems([classes.container, classes.mapItem], handlePatternClick)
      )(Patterns)}
    </Grid>
  </Card>)

export default ChoosePattern
