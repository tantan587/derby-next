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
    color:'white',
  },
  deeppadding :
  {
    padding: '5px 20px 5px 5px'
  },
  deepAlign :
  {
    textAlign: 'center'
  },
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
      const { order, orderBy, orderByDisplay, columnData, orderInd,classes } = this.props
      return (
        <TableHead className={classes.header}>
          <TableRow style={{overflow: 'auto'}}>
            {[0].map(() => {if (orderInd) return <TableCell key='order' classes={{root: classes.deeppadding}}/>})}
            {columnData.filter(col => col.id !== 'order').map((column,i) => {
              return (
                column.label ?
                  <TableCell 
                    key={i}
                    numeric={column.numeric}
                    padding={column.disablePadding ? 'none' : 'default'}
                    sortDirection={orderBy === column.id ? order : false}
                    classes={{root: classes.deepAlign}}
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
                  : <TableCell 
                    key={i}/>
              )
            }, this)}
          </TableRow>
        </TableHead>
      )
    }
}

export default withStyles(styles)(DerbyHeader)