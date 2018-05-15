import React from 'react'
import  {
  TableFooter,
  TableRow,
  TablePagination,
}  from 'material-ui/Table'

class DerbyFooter extends React.Component {

  render() {
    const { styleProps } = this.props

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
            rowsPerPageOptions={[5,10,20,40,80]}
          />
        </TableRow>
      </TableFooter>
    )
  }
}
export default (DerbyFooter)
