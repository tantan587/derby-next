import React from 'react'
import {withStyles} from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import {LTB} from './ScoreCardLayouts'

const styles = {
  L: {
    justifyContent: 'center'
  }
}

const TeamCard = ({
  classes,
  logo_url = "https://upload.wikimedia.org/wikipedia/en/2/24/Atlanta_Hawks_logo.svg",
  team_name = "Rays"
}) => (
  <LTB
    classes={classes}
    L={(
      <Avatar
        alt={`${team_name} Logo`}
        src={logo_url}
      />
    )}
    T={(
      <Typography
        variant="body2"
        style={{fontWeight: 'bold'}}
        children={team_name}
      />
    )}
    B={(
      <Typography
        variant="caption"
        children="(28-30, 17-17 Away)"
      />
    )}
  />
)

export default withStyles(styles)(TeamCard)