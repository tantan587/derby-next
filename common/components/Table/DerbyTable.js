import React from 'react'
import Table from '@material-ui/core/Table'
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
      rowsPerPage: 10,
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
    const { usePagination, rows, headers,orderInd, extraTableRow, styleProps } = this.props
    const {order, orderBy, orderByDisplay, rowsPerPage, page} = this.state

    let localRows = orderBy === '' ? rows : rows.sort((a, b) =>
      (order === 'desc')
        ? isNaN(b[orderBy])
          ? (b[orderBy].toLowerCase() < a[orderBy].toLowerCase() ? -1 : 1)
          : (b[orderBy] < a[orderBy] ? -1 : 1)
        : isNaN(b[orderBy])
          ? (a[orderBy].toLowerCase() < b[orderBy].toLowerCase() ? -1 : 1)
          : (a[orderBy] < b[orderBy] ? -1 : 1))

    localRows = localRows ? localRows : []

    const myHeaders = headers

    const localColumns = myHeaders.map(header => ({
      id: header.key,
      sortId: header.sortId ? header.sortId : header.key,
      numeric: false,//localRows.length > 0 && !header.button ? !isNaN(localRows[0][header.key]) : false,
      disablePadding: true,
      label: header.label,
      button:header.button,
      imageInd:header.imageInd,
      disableSort:header.disableSort
    }))

    const sliceStart = usePagination ?  page * rowsPerPage : 0
    const sliceEnd = usePagination ? sliceStart + rowsPerPage : localRows.length

    return (
      //maxWidth: 1000,
      <Table style={Object.assign({
        minWidth: 600,
        width:'94%',
        marginLeft:'3%',
        // backgroundColor: 'black'
      }, styleProps && styleProps.Table)}>
        <DerbyHeader
          order={order}
          orderBy={orderBy}
          orderByDisplay={orderByDisplay}
          onRequestSort={this.handleRequestSort}
          columnData={localColumns}
          orderInd={orderInd}
          styleProps={styleProps && styleProps.Header}
        />
        <DerbyBody
          orderInd={orderInd}
          rows={localRows.slice(sliceStart,sliceEnd)}
          columns={localColumns}
          styleProps={styleProps && styleProps.Body}
          extraTableRow={extraTableRow}
        />
        {[1].map((x) => {if (usePagination)
        {
          return <DerbyFooter
            key={x}
            only10={false}
            styleProps={styleProps && styleProps.Footer}
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
