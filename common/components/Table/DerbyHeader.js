import React from 'react'
import {
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel} from 'material-ui/Table'
import Tooltip from 'material-ui/Tooltip'

class DerbyHeader extends React.Component {
  
    createSortHandler = (property, propertyDisplay) => () => {
      this.props.onRequestSort(property, propertyDisplay)
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

export default DerbyHeader