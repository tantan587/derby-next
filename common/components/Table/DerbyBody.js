import React from 'react'
import {
  TableCell,
  TableRow,
  TableBody} from 'material-ui/Table'

class DerbyBody extends React.Component {
  
  render() {
    const {rows, columns} = this.props
    return(
    
      <TableBody>
        {rows.map((n,i) => {
          return (
            <TableRow
              hover
              tabIndex={-1}
              key={i}
              style= {i % 2 === 0 ? {} : {backgroundColor:'#d3d3d3'}}
            >
              <TableCell key={'order'}
                numeric>
                {i+1}
              </TableCell>
              {columns.filter(
                header => header.id !=='order').map(
                header =>
                  <TableCell key={header.id}
                    numeric={header.numeric}>
                    {header.id == 'logo_url' && n['logo_url'] !== 'none' ? 
                      <img src={n['logo_url']} alt="Basketball" width="40" height="40"/>
                      : n[header.id]}
                  </TableCell>
              )}
            </TableRow>
          )
        })}
      </TableBody>
    )}}
export default DerbyBody