import {withStyles} from '@material-ui/core/styles'
//import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import {LTB} from './ScoreCardLayouts'

const styles = {
  L: {
    justifyContent: 'center'
  }
}

const TeamSection = ({
  classes,
  lostInd,
  logo_url = 'https://upload.wikimedia.org/wikipedia/en/2/24/Atlanta_Hawks_logo.svg',
  team_name = 'Rays',
  record='(28-30, 36 Points)'
}) => (
  <LTB
    classes={classes}
    L={(
      <img
        preserveAspectRatio='true' 
        //alt={`${team_name} Logo`}
        src={logo_url}
        style={{maxWidth:'40px', maxHeight:'40px'}}
      />
    )}
    T={(
      <Typography
        variant="body2"
        style={{fontWeight: lostInd ? 'normal':'bold', color: lostInd ? '#777':'#000'}}
        children={team_name}
      />
    )}
    B={(
      <Typography
        variant="caption"
        children={record}
      />
    )}
  />
)

export default withStyles(styles)(TeamSection)