import React from 'react'
import {
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel} from 'material-ui/Table'
import Tooltip from 'material-ui/Tooltip'
import { withStyles } from 'material-ui/styles'
const styles = theme => ({
  header:{
    backgroundColor:'#48311A',
    color:'white'},
  deepheader : {
    color:'white',
    '&:hover': {
      color: 'white',
    },
    '&:focus': {
      color: 'white', 
    }
  }
})


class DerbyHeader extends React.Component {
  
    createSortHandler = (property, propertyDisplay) => () => {
      this.props.onRequestSort(property, propertyDisplay)
    };
  
    render() {
      const { order, orderBy, orderByDisplay, columnData, classes } = this.props
  
      return (
        <TableHead className={classes.header}>
          <TableRow>
            <TableCell/>
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
                      classes={{root: classes.deepheader}}
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

export default withStyles(styles)(DerbyHeader)