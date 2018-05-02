import React from 'react'
import {
  TableCell,
  TableRow,
  TableBody} from 'material-ui/Table'
import Button from 'material-ui/Button'
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
  deeppadding :
  {
    padding: '5px 20px 5px 5px'
  },
  deepAlign :
  {
    textAlign: 'center'
  },
  deepbutton :
  {
    minHeight: 3,
    minWidth: 3,
    padding: '5px 10px'
  },
})

class DerbyBody extends React.Component {
  
  rowRender = (classes, columns, n) =>
  {
    let ok = true
    return (
      columns.filter(
        header => header.id !=='order').map(
        (header,i) =>
          <TableCell key={i}
            classes={{root: classes.deepAlign}}
            padding={header.disablePadding ? 'none' : 'default'}
            numeric={header.numeric}>
            {header.id == 'logo_url' && n['logo_url'] !== 'none' 
              ?  <img src={n['logo_url']} alt="Basketball" width="40" height="40"/>
              : header.button 
                ? <Button
                  key={i} 
                  classes={ok ? {root: classes.deepbutton} :{}}
                  style={{color:header.button.color, 
                    backgroundColor:header.button.backgroundColor, 
                    fontSize:10, height:22, width:100}}
                  onClick={() => header.button.onClick(n[header.id])}>{header.button.label}</Button>
                : n[header.id]}
          </TableCell>
      )
    )
  }

  black

  render() {
    const {rows, columns, orderInd, classes} = this.props
    return(
    
      <TableBody>
        {rows.map((n,i) => {
          return (
            <TableRow 
              hover
              tabIndex={-1}
              key={i}
              style= {i % 2 === 0 ? {} : {backgroundColor:'#d3d3d3'} }
            >
              {
                [1].map(() => 
                {
                  if(orderInd)
                    return <TableCell key={'order'} classes={{root: classes.deeppadding}}
                      numeric>
                      {i+1}
                    </TableCell>
                })
              }
              {this.rowRender(classes, columns,n)}
            </TableRow>
          )
        })}
      </TableBody>
    )}}
export default withStyles(styles)(DerbyBody)