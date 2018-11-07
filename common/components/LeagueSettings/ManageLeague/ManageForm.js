import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'

import StyledButton from '../../Navigation/Buttons/StyledButton'

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 140,
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

const ManageForm = withStyles(styles)(({ classes, form, onInputChange, onFormSubmit }) =>
  <form className={classes.root} onSubmit={onFormSubmit}>
    <div className={classes.title}>New Member Info</div>
    {/*<TextField
      className={classes.textMargin}
      label="New Member First Name"
    />
    <TextField
      className={classes.textMargin}
      label="New Member Last Name"
    />*/}
    <TextField
      name="email"
      className={classes.textMargin}
      label="New Member Email"
      onChange={onInputChange}
      value={form.email}
    />
    <div style={{ alignSelf: 'flex-end', marginTop: 20 }}>
      <StyledButton
        onClick={onFormSubmit}
        text="Add to Member List"
        height={20}
      />
    </div>
  </form>)

export default ManageForm
