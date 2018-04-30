import React from 'react'
import  {
  TableRow,
  TablePagination,
  TableFooter,
}  from 'material-ui/Table'

class DerbyFooter extends React.Component {

  render() {
    return (
      <TableFooter>
        <TableRow>
          <TablePagination
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