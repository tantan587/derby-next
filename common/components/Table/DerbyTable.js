import React from 'react'
import Table from 'material-ui/Table'
import DerbyHeader from './DerbyHeader'
import DerbyBody from './DerbyBody'
import DerbyFooter from './DerbyFooter'

class DerbyTable extends React.Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      order: 'asc',
      orderBy: '',
      orderByDisplay:'',
      page: 0,
      rowsPerPage: 20,
    }
  }
  
  handleRequestSort = (property, propertyDisplay) => {
    const orderBy = property
    const orderByDisplay = propertyDisplay
    let order = 'desc'

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc'
    }

    this.setState({ order, orderBy, orderByDisplay })
  };

  handleChangePage = (event, page) => {
    this.setState({ page })
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value })
  };

  render() {
    const { usePagination, rows, headers } = this.props
    const {order, orderBy, orderByDisplay, rowsPerPage, page} = this.state
    const localRows = orderBy === '' ? rows : rows.sort((a, b) =>  
      (order === 'desc') 
        ? isNaN(b[orderBy]) 
          ? (b[orderBy].toLowerCase() < a[orderBy].toLowerCase() ? -1 : 1)
          : (b[orderBy] < a[orderBy] ? -1 : 1)
        : isNaN(b[orderBy]) 
          ? (a[orderBy].toLowerCase() < b[orderBy].toLowerCase() ? -1 : 1)
          : (a[orderBy] < b[orderBy] ? -1 : 1))

    console.log('local',rows, localRows)
    const myHeaders = headers
    
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
      <Table style={{minWidth: 600,maxWidth: 1000,  overflowX: 'auto', width:'94%', marginLeft:'3%'}}>
        <DerbyHeader
          order={order}
          orderBy={orderBy}
          orderByDisplay={orderByDisplay}
          onRequestSort={this.handleRequestSort}
          columnData={localColumns}/>
        <DerbyBody
          rows={localRows.slice(sliceStart,sliceEnd)}
          columns={localColumns}/>
        {[1].map(() => {if (usePagination)
        {
          return <DerbyFooter
            count={localRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            handleChangePage={this.handleChangePage}
            handleChangeRowsPerPage={this.handleChangeRowsPerPage}/>
        }
        })}
      </Table>
    )
  }
}

export default DerbyTable