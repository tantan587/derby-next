import { withStyles } from '@material-ui/core/styles'

import ChoosePattern from './ChoosePattern'

const styles = {
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 42
  },
  title: {
    marginBottom: 18,
    fontFamily: 'HorsebackSlab',
    fontSize: 15,
    color: '#299149'
  }
}

const StyleSelect = withStyles(styles)(({ classes }) =>
  <div className={classes.root}>
    <div>
      <div className={classes.title}>Choose Pattern</div>
      <ChoosePattern />
    </div>
    <div>
      <div className={classes.title}>Choose Jersey Color</div>
      <div>Bye</div>
    </div>
    <div>
      <div className={classes.title}>Choose Pattern Color</div>
      <div>Bye</div>
    </div>
  </div>)

export default StyleSelect
