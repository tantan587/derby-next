import React from 'react'
import  TableFooter from '@material-ui/core/TableFooter'
import  TableRow from '@material-ui/core/TableRow'
import  TablePagination   from '@material-ui/core/TablePagination'

class DerbyFooter extends React.Component {

  render() {
    const { styleProps, only20 } = this.props

    return (
      <TableFooter style={styleProps && styleProps.TableFooter}>
        <TableRow style={styleProps && styleProps.TableRow}>
          <TablePagination
            style={styleProps && styleProps.TablePagination}
            count={this.props.count}
            rowsPerPage={this.props.rowsPerPage}
            page={this.props.page}
            onChangePage={this.props.handleChangePage}
            onChangeRowsPerPage={this.props.handleChangeRowsPerPage}
            rowsPerPageOptions={only20 ? [20] : [5,10,20,40,80]}
          />
        </TableRow>
      </TableFooter>
    )
  }
}
export default (DerbyFooter)
