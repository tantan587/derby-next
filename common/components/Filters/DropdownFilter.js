import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import  MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'


const styles = theme => ({
  root: {
    display: 'flex',
  },
  paper: {
    marginRight: theme.spacing.unit * 2,
  },
  popperClose: {
    pointerEvents: 'none',
  },
  menu: {
    width: '100%'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '100%',
  },
  container: {
    [theme.breakpoints.only('xl')]: {
      width: '25%'
    },
    [theme.breakpoints.only('lg')]: {
      width: '25%'
    },
    [theme.breakpoints.only('md')]: {
      width: '30%'
    },
    [theme.breakpoints.only('sm')]: {
      width: '40%'
    },
    [theme.breakpoints.only('xs')]: {
      width: '50%'
    },
  }
})

class DropdownFilter extends React.Component {

  handleChange = () => event => {
    const value = event.target.value

    const { column, clickedUpdateFilter, filterId} = this.props
    clickedUpdateFilter({key:column, value, type:'dropdown'}, filterId)
  }

  render() {
    const {dropdowns, classes, name, value, displayFunction} = this.props
    return (

      <div className={classes.container} style={{float:'left'}}>
        <TextField
          id="drowndown"
          select
          label={value ? ' ' : 'Select ' + name}
          className={classes.textField}
          value={value || ''}
          onChange={this.handleChange()}
          style={{marginTop:5}}
          SelectProps={{
            MenuProps: {
              className: classes.menu,
            },
          }}
          margin="normal"
        >
          {dropdowns.map(option => (
            <MenuItem key={option} value={option}>
              {displayFunction(option)}
            </MenuItem>
          ))}
        </TextField>
      </div>

    )
  }
}

export default withStyles(styles)(DropdownFilter)
