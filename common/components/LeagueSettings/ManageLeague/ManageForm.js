import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'

import StyledButton from '../../Navigation/Buttons/StyledButton'

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 250,
    [theme.breakpoints.down('md')]: {
      width: 250
    }
  },
  title: {
    fontWeight: 600,
  },
  textMargin: {
    marginLeft: 8
  }
})

const ManageForm = withStyles(styles)(({ classes }) =>
  <div className={classes.root}>
    <div className={classes.title}>New Member Info</div>
    <TextField
      className={classes.textMargin}
      label="New Member First Name"
    />
    <TextField
      className={classes.textMargin}
      label="New Member Last Name"
    />
    <TextField
      className={classes.textMargin}
      label="New Member Email"
    />
    <div style={{ alignSelf: 'flex-end', marginTop: 20 }}>
      <StyledButton
        text="Add to Member List"
        height={20}
      />
    </div>
  </div>)

export default ManageForm
