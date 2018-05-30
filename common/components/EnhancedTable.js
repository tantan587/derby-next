import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '2material-ui/styles'
import TableFooter from '@material-ui/TableFooter'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Tooltip from '@material-ui/core/Tooltip'
import { FormGroup, FormControlLabel } from '@material-ui/core/Form'
import Checkbox from '@material-ui/core/Checkbox'
import TextField from '@material-ui/core/TextField'
import {MenuItem} from '@material-ui/core/Menu'

class EnhancedTableHead extends React.Component {
  static propTypes = {
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired
  };

  createSortHandler = (property, propertyDisplay) => event => {
    this.props.onRequestSort(event, property, propertyDisplay)
  };

  render() {
    const { order, orderBy, orderByDisplay, columnData } = this.props

    return (
      <TableHead>
        <TableRow>
          <TableCell></TableCell>
          {columnData.filter(col => col.id !== 'order').map(column => {
            return (
              <TableCell
                key={column.id}
                numeric={column.numeric}
                padding={column.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === column.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={column.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderByDisplay === column.id}
                    direction={order}
                    onClick={this.createSortHandler(column.sortId, column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            )
          }, this)}
        </TableRow>
      </TableHead>
    )
  }
}

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

class EnhancedTable extends React.Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      order: 'asc',
      orderBy: '',
      orderByDisplay:'',
      myRows: [],
      myHeaders:[],
      page: 0,
      rowsPerPage: 20,
      checkboxes: [],
      dropdown: '',
      myOwnerName:''
    }
  }
  componentWillMount() {
    if (this.state.myRows.length === 0)
    {
      this.setState({ myRows:this.props.myRows })
      this.setState({ myHeaders:[{label: 'Order', key: 'order'}].concat(this.props.myHeaders) })
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

  handleRequestSort = (event, property, propertyDisplay) => {
    const orderBy = property
    const orderByDisplay = propertyDisplay
    let order = 'desc'

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc'
    }

    const myRows =
      this.state.myRows.sort((a, b) =>  
        (order === 'desc') 
          ? isNaN(b[orderBy]) 
            ? (b[orderBy].toLowerCase() < a[orderBy].toLowerCase() ? -1 : 1)
            : (b[orderBy] < a[orderBy] ? -1 : 1)
          : isNaN(b[orderBy]) 
            ? (a[orderBy].toLowerCase() < b[orderBy].toLowerCase() ? -1 : 1)
            : (a[orderBy] < b[orderBy] ? -1 : 1))

    // const myRows =
    //   order === 'desc'
    //     ? this.state.myRows.sort((a, b) => (b[orderBy].toLowerCase() < a[orderBy].toLowerCase() ? -1 : 1) )
    //     : this.state.myRows.sort((a, b) => (a[orderBy].toLowerCase() < b[orderBy].toLowerCase() ? -1 : 1) )

    this.setState({ myRows, order, orderBy, orderByDisplay })
  };

  handleChangePage = (event, page) => {
    this.setState({ page })
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value })
  };

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

    const localColumns = 
    myHeaders.map(header => ({
      id: header.key, 
      sortId: header.sortId ? header.sortId : header.key,
      numeric: localRows.length > 0 ? !isNaN(localRows[0][header.key]) : false, 
      disablePadding: false,
      label: header.label
    }))

    const sliceStart = usePagination ?  page * rowsPerPage : 0
    const sliceEnd = usePagination ? sliceStart + rowsPerPage : localRows.length
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
          
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell  colSpan={localColumns.length}>
                  <FormGroup style={{textAlign: 'center'}} row>
                    {checkboxes.map( (check, i) => 
                      <FormControlLabel
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
                </TableCell>
              </TableRow>
            </TableHead>
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              orderByDisplay={orderByDisplay}
              onRequestSort={this.handleRequestSort}
              columnData={localColumns}
            />
            <TableBody>
              {localRows.slice(sliceStart, sliceEnd).map((n,i) => {
                return (
                  <TableRow
                    hover
                    tabIndex={-1}
                    key={i}
                  >
                    <TableCell key={'order'}
                      numeric>
                      {i+1}
                    </TableCell>
                    {localColumns.filter(
                      header => header.id !=='order').map(
                      header =>
                        <TableCell key={header.id}
                          numeric={header.numeric}>
                          {header.id == 'logo_url' && n['logo_url'] !== 'none' ? 
                            <img src={n['logo_url']} alt="Basketball" width="40" height="40"/>
                            : n[header.id]}
                        </TableCell>
                    )}
                  </TableRow>
                )
              })}
            </TableBody>
            <TableFooter>
              {usePagination 
                ? <TableRow>
                  <TablePagination
                    count={localRows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                    rowsPerPageOptions={[5,20,40,80]}
                  />
                </TableRow> 
                : <TableRow/>}
            </TableFooter>
          </Table>
          <br/>
          <br/>
        </div>
      </Paper>
    )
  }
}

EnhancedTable.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(EnhancedTable)