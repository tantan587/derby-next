import {withStyles} from '@material-ui/core/styles'
//import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import {LTB} from './ScoreCardLayouts'
import { connect } from 'react-redux'
import { handleOpenDialog } from '../../actions/dialog-actions.js'
import { clickedOneTeam } from '../../actions/sport-actions.js'

const styles = {
  L: {
    justifyContent: 'center'
  },
  teamName: {
    '&:hover': {
      textDecoration: 'underline',
      cursor: 'pointer',
    }
  }
}

const TeamSection = ({
  classes,
  lostInd,
  team_id = 101101,
  logo_url = 'https://upload.wikimedia.org/wikipedia/en/2/24/Atlanta_Hawks_logo.svg',
  team_name = 'Rays',
  //record='(28-30, 36 Points)',
  //owner_name='N/A',
  handleOpenDialog,
  clickedOneTeam
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
        className={classes.teamName}
        style={{fontWeight: lostInd ? 'normal':'bold', color: lostInd ? '#777':'#000'}}
        children={team_name}
        onClick={() => {
          console.log('hello')
          clickedOneTeam(team_id)
            .then(() => handleOpenDialog())
        }}
      />
    )}
    B={(
      <Typography
        variant="caption">
        {/* {owner_name} <br />
        {record} */}
      </Typography>
    )}
  />
)

export default connect(
  null,
  { handleOpenDialog, clickedOneTeam }
)(withStyles(styles)(TeamSection))