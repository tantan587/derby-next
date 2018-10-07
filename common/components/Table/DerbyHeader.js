import React from 'react'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Tooltip from '@material-ui/core/Tooltip'
import { withStyles } from '@material-ui/core/styles'

const styles = () => ({
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
    textAlign: 'center',
    padding: '5px 5px 5px 5px'
  },
  deepheader : {
    color:'white',
    '&:hover': {
      color: 'white',
    },
    '&:focus': {
      color: 'white',
    }
  },
  icon: {
    display: 'none',
    // width: 0,
    // marginLeft: -16,
    // marginRigth: -16
  }
})


class DerbyHeader extends React.Component {

    createSortHandler = (property, propertyDisplay) => () => {
      this.props.onRequestSort(property, propertyDisplay)
    };

    render() {
      const { order, orderBy, orderByDisplay, columnData, orderInd, classes, styleProps } = this.props
      return (
        <TableHead className={classes.header} style={styleProps && styleProps.TableHead}>
          <TableRow style={{overflow: 'auto'}} style={styleProps && styleProps.TableRow}>
            {[0].map(() => {if (orderInd) return <TableCell key='order' classes={{root: classes.deeppadding}}/>})}
            {columnData.filter(col => col.id !== 'order').map((column,i) => {
              return (
                column.label ?
                  <TableCell
                    key={i}
                    classes={{root: classes.deepAlign}}
                    style={styleProps && styleProps.TableCell}
                    numeric={column.numeric}
                    padding={!column.disablePadding && column.label === 'Pick' ? 'default' : 'none'  }
                    sortDirection={orderBy === column.id ? order : false}
                  >
                    <Tooltip
                      title={column.toolTip || 'Sort'}
                      placement={column.numeric ? 'bottom-end' : 'bottom-start'}
                      enterDelay={300}
                    >
                      <TableSortLabel
                        classes={{root: classes.deepheader, icon: orderByDisplay !== column.id && classes.icon}}
                        //disabled={column.disableSort}
                        style={styleProps && styleProps.TableSortLabel}
                        active={orderByDisplay === column.id}
                        direction={order}
                        onClick={column.onClick  ? () => column.onClick(column.id) : this.createSortHandler(column.sortId, column.id) }
                      >
                        {column.label}
                      </TableSortLabel>
                    </Tooltip>
                  </TableCell>
                  : <TableCell
                    style={styleProps && styleProps.TableCell}
                    key={i}/>
              )
            }, this)}
          </TableRow>
        </TableHead>
      )
    }
}

export default withStyles(styles)(DerbyHeader)
