import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from 'material-ui/Table'
import Typography from 'material-ui/Typography'
import Paper from 'material-ui/Paper'
import Tooltip from 'material-ui/Tooltip'

class EnhancedTableHead extends React.Component {
  static propTypes = {
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
  };

  createSortHandler = property => event => {
    this.props.onRequestSort(event, property)
  };

  render() {
    const { order, orderBy, columnData } = this.props

    return (
      <TableHead>
        <TableRow>
          {columnData.map(column => {
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
                    active={orderBy === column.id}
                    direction={order}
                    onClick={this.createSortHandler(column.id)}
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
    maxWidth: 800
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  title : {
    textAlign : 'center'
  }
})

class EnhancedTable extends React.Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      order: 'asc',
      orderBy: '',
      myRows: [],
      myHeaders:[],
    }
  }
  componentWillMount() {
    if (this.state.myRows.length === 0)
    {
      this.setState({ myRows:this.props.myRows })
      this.setState({ myHeaders:[{label: '', key: 'order'}].concat(this.props.myHeaders) })
    }
  }
  
  componentWillReceiveProps(nextProps) {
    if(this.props != nextProps) {
      this.setState({
        myRows: nextProps.myRows,
        myHeaders: [{label: '', key: 'order'}].concat(nextProps.myHeaders),
        orderBy: nextProps.myHeaders.length > 0 ? nextProps.myHeaders[0].key : ''
      })
    }
  }

  handleRequestSort = (event, property) => {
    const orderBy = property
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

    this.setState({ myRows, order, orderBy })
  };

  render() {
    const { classes} = this.props

    const {order, orderBy, myRows, myHeaders} = this.state
    let localRows = myRows
    if (typeof myRows === 'undefined')
    {
      localRows = []
    }
  
    const columnData1 = 
    myHeaders.map(header => ({
      id: header.key, 
      numeric: localRows.length > 0 ? !isNaN(localRows[0][header.key]) : false, 
      disablePadding: false,
      label: header.label
    }))
    return (
      <Paper className={classes.root}>
        <div className={classes.tableWrapper}>
          <br/>
          <Typography className={classes.title} type="display1">{this.props.title}</Typography>
          <br/>
          <Table className={classes.table}>
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={this.handleRequestSort}
              columnData={columnData1}
            />
            <TableBody>
              {localRows.map((n,i) => {
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
                    {columnData1.map(header => header.id !=='order' ? (
                      <TableCell key={header.id}
                        numeric={header.numeric}>
                        {n[header.id]}
                      </TableCell>
                    ) : '' )}
                  </TableRow>
                )
              })}
            </TableBody>
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