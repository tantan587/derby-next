import React from 'react'
import { withStyles } from 'material-ui/styles'
import { Manager, Target, Popper } from 'react-popper'
import Button from 'material-ui/Button'
import ClickAwayListener from 'material-ui/utils/ClickAwayListener'
import Collapse from 'material-ui/transitions/Collapse'
import Grow from 'material-ui/transitions/Grow'
import Paper from 'material-ui/Paper'
import Portal from 'material-ui/Portal'
import  Menu, { MenuItem, MenuList } from 'material-ui/Menu'
import classNames from 'classnames'
import TextField from 'material-ui/TextField'


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
    width: 300
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 300,
  },
})

class DropdownFilter extends React.Component {
  state = {
    value:''
  };

  handleChange = () => event => {
    const value = event.target.value
    this.setState({
      value: value,
    })

    const {rows, column, updateMyRows, passUpFilterInfo} = this.props

    const filter = (!value || value === 'All') ? null : value

    const localRows = filter ? rows.filter(row => row[column] === filter) : rows
    updateMyRows(localRows)
    if (passUpFilterInfo)
    {
      passUpFilterInfo({key:column, value:filter, type:'dropdown'})
    }

  }

  render() {
    const {dropdowns, allInd, classes, name} = this.props
    const {value} = this.state
    let localDropdown = allInd ? ['All'].concat(dropdowns) : dropdowns
    
    return (

      <div style={{display: 'inline', float:'left'}}>
        <TextField
          id="drowndown"
          select
          label={'Select ' + name}
          className={classes.textField}
          value={value}
          onChange={this.handleChange()}
          style={{marginTop:5, marginLeft:38}}
          SelectProps={{
            MenuProps: {
              className: classes.menu,
            },
          }}
          margin="normal"
        >
          {localDropdown.map(option => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </div>

    )
  }
}

export default withStyles(styles)(DropdownFilter)