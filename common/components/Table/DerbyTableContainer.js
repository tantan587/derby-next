import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  TableFooter,
  TableSortLabel,
} from 'material-ui/Table'
import Typography from 'material-ui/Typography'
import Paper from 'material-ui/Paper'
import Tooltip from 'material-ui/Tooltip'
import { FormGroup, FormControlLabel } from 'material-ui/Form'
import Checkbox from 'material-ui/Checkbox'
import TextField from 'material-ui/TextField'
import {MenuItem} from 'material-ui/Menu'



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
  title : {
    textAlign : 'center'
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

class DerbyTableContainer extends React.Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      myRows: [],
      checkboxes: [],
      dropdown: '',
      myOwnerName:''
    }
  }
  componentWillMount() {
    if (this.state.myRows.length === 0)
    {
      this.setState({ myRows:this.props.myRows })
      let checkboxes = []
      if (this.props.sportLeagues)
      {
        checkboxes = [{val: true, label: 'All'}]
        this.props.sportLeagues.map(col => checkboxes.push({val:true, label:col.sport}))
      }
      this.setState({ checkboxes:checkboxes})
      if (this.props.owners)
      {
        const myOwnerName = this.props.owners.filter(x => x.owner_id === this.props.myOwnerId)[0].owner_name
        const dropdown = myOwnerName
        this.setState({myOwnerName, dropdown})
      }
      
    }
  }
  
  componentWillReceiveProps(nextProps) {
    if(this.props != nextProps) {
      let checkboxes = []
      if (nextProps.sportLeagues)
      {
        checkboxes = [{val: true, label: 'All'}]
        nextProps.sportLeagues.map(col => checkboxes.push({val:true, label:col.sport}))
      }
      this.setState({
        myRows: nextProps.myRows,
        myHeaders: [{label: 'Order', key: 'order'}].concat(nextProps.myHeaders),
        orderBy: nextProps.myHeaders.length > 0 ? nextProps.myHeaders[0].key : '',
        checkboxes:checkboxes
      })
      if (nextProps.owners)
      {
        const myOwnerName = nextProps.owners.filter(x => x.owner_id === nextProps.myOwnerId)[0].owner_name
        const dropdown = myOwnerName
        this.setState({myOwnerName, dropdown})
      }
    }
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
  }

  handleUpdateDropdown = () => event => {
    this.setState({
      dropdown: event.target.value
    })
  }


  render() {
    const { classes, usePagination, checkboxColumn } = this.props
    const {order, orderBy, orderByDisplay, myRows, myHeaders, rowsPerPage, page, checkboxes} = this.state

    let localRows = myRows
    if (typeof myRows === 'undefined')
    {
      localRows = []
    }
    
    if(typeof checkboxes !== 'undefined' )
    {
      let localCheckboxes =[]
      checkboxes.filter(check => check.val !== true).map(check => localCheckboxes.push(check.label))
      localRows = localRows.filter(row => !localCheckboxes.includes(row[checkboxColumn]))
    }

    if(this.state.dropdown !== '')
    {
      localRows = localRows.filter(row => row.owner_name === this.state.dropdown)
    }


    return (
      <Paper className={classes.root}>
        <div className={classes.tableWrapper}>
          <br/>
          {this.props.rosterTitle 
            ? <div>
              <TextField
                id={'select-owner'}
                select
                label="Select Owner"
                className={classes.textField}
                value={this.state.dropdown}
                onChange={this.handleUpdateDropdown()}
                SelectProps={{
                  MenuProps: {
                    className: classes.menu,
                  },
                }}
                //helperText="Please select your currency"
                margin="normal"
              >
                {this.props.owners.map(option => (
                  <MenuItem key={option.owner_name} value={option.owner_name}>
                    {option.owner_name === this.state.myOwnerName ? 'Me' : option.owner_name}
                  </MenuItem>
                ))}
              </TextField>
              <Typography className={classes.title} type="display1" style={{paddingTop:'20px'}}>
                {this.state.myOwnerName === this.state.dropdown ? 'My Roster' : this.state.dropdown + '\'s Roster'}
              </Typography>
            </div>
            : <Typography className={classes.title} type="display1">{this.props.title}</Typography>
          }
          <br/>
          <DerbyTable 
            usePagination={true}
            rows={myRows}
            headers={headers}/>
          <br/>
          <br/>
        </div>
      </Paper>
    )
  }
}

export default withStyles(styles)(DerbyTableContainer)