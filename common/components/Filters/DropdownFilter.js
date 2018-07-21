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

      <div style={{width:'20%', float:'left'}}>
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