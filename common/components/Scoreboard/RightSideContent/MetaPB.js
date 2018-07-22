import {withStyles} from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import {LTB} from '../ScoreCardLayouts'
import BSO from './BSO'

const styles = (theme) => ({
  title: {
    fontSize: '0.7em',
    color: theme.palette.grey.A700,
  }
})

// Meta Pitcher Batter
const MetaPB = ({
  classes,
  logo_url = 'https://upload.wikimedia.org/wikipedia/en/2/24/Atlanta_Hawks_logo.svg',
}) => (
  <div>
    <LTB
      L={(
        <Avatar
          src={logo_url}
        />
      )}
      T={(
        <Typography
          className={classes.title}
          children={<span><b>Pitching</b>: M Scherzer</span>}
        />
      )}
      B={(
        <Typography
          className={classes.title}
          children={<span><b>Batting</b>: B Miller</span>}
        />
      )}
    />
    <BSO />
    <Typography
      className={classes.title}
      children={<span><b>LAST PLAY</b>: Pitch 2: Strike 1 (looking)</span>}
    />
  </div>
)

export default withStyles(styles)(MetaPB)