import React from 'react'
import { withStyles } from 'material-ui/styles'
import { FormGroup, FormControlLabel } from 'material-ui/Form'
import Checkbox from 'material-ui/Checkbox'



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
  constructor(props, context) {
    super(props, context)

    this.state = {
      checkboxes: [],
    }
  }
  componentWillMount() {
    const checkboxes = [{val: true, label: 'All'}]
    this.props.checkboxes.map(x => checkboxes.push({val:true, label:x}))
    this.setState({checkboxes:checkboxes})
  }

  handleCheckboxClick = i => event =>
  {
    let localCheck = this.state.checkboxes
    if(localCheck[i].label ==='All')  {
      localCheck.map(check => check.val = event.target.checked)
    }
    else{
      localCheck[i].val = event.target.checked
    }
    this.setState({ checkboxes: localCheck })

    const {rows, checkboxColumn} = this.props
    const notCheckboxes = localCheck
      .filter(check => check.val !== true)
      .map(check => {return check.label})
    const localRows = rows.filter(row => !notCheckboxes.includes(row[checkboxColumn]))
    this.props.updateMyRows(localRows)

  }

  render() {
    const {checkboxes} = this.state
    return (
      <FormGroup style={{textAlign: 'center', marginLeft:10}} row>
        {checkboxes.map( (check, i) => 
          <FormControlLabel style={{}}
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