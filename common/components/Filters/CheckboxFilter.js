import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import FormGroup  from '@material-ui/core/FormGroup'
import FormControlLabel  from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'



const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 600,
    maxWidth: 1000
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  textField: {
    marginLeft: 40,//theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
    float: 'left'
  },
  menu: {
    width: 200,
  },
})

class CheckboxFilter extends React.Component {

  handleCheckboxClick = i => event =>
  {
    let localCheck = this.props.value
    if(localCheck[i].label ==='All')  {
      localCheck.forEach(check => check.val = event.target.checked)
    }
    else{
      localCheck[i].val = event.target.checked
    }

    // const notCheckboxes = localCheck
    //   .filter(check => check.val !== true)
    //   .map(check => {return check.label})
    // const localRows = rows.filter(row => !notCheckboxes.includes(row[checkboxColumn]))

    const {column, clickedUpdateFilter, filterId} = this.props
    clickedUpdateFilter({key:column, value:localCheck, type:'checkbox'}, filterId)

  }

  render() {
    const {value} = this.props
    return (
      <FormGroup style={{textAlign: 'center', marginLeft:10}} row>
        {value.map( (check, i) => 
          <FormControlLabel style={{height:20, marginTop:25, marginBottom:-25}}
            key={i}
            control={
              <Checkbox
                checked={check.val}
                onChange={this.handleCheckboxClick(i)}
                value={check.label}
              />
            }
            label={check.label}
          />)}
      </FormGroup>
    )
  }
}

export default withStyles(styles)(CheckboxFilter)