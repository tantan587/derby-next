import React from 'react'
import { connect } from 'react-redux'
import {
  TableCell,
  TableRow,
  TableBody
} from 'material-ui/Table'

import { handleOpenDialog } from '../../actions/dialog-actions.js'

class DerbyBody extends React.Component {

  render() {
    const {rows, columns, handleOpenDialog} = this.props

    console.log('HELLO', handleOpenDialog)
    return(

      <TableBody>
        {rows.map((n,i) => {
          return (
            <TableRow
              hover
              tabIndex={-1}
              key={i}
              style={i % 2 === 0 ? {} : {backgroundColor:'#d3d3d3'}}
            >
              <TableCell key={'order'}
                numeric
                // component={
                //   () => <div onClick={handleOpenDialog}>
                //     hi?
                //   </div>
                // }
              >
                {i+1+'hiii'} :)
              </TableCell>
              {columns.filter(
                header => header.id !=='order').map(
                header =>
                  <TableCell key={header.id}
                    numeric={header.numeric}>
                    {
                      header.id == 'logo_url' && n['logo_url'] !== 'none' ?
                        <img
                          src={n['logo_url']}
                          alt="Basketball"
                          width="40"
                          height="40"
                          onClick={() => handleOpenDialog(n)}
                        />
                        // : n[header.id]
                        : header.id == 'team_name' && n['team_name'] !== 'none' ?
                          <div onClick={handleOpenDialog}>
                            {n[header.id]}
                          </div>
                          : n[header.id]

                    }
                  </TableCell>
              )}
            </TableRow>
          )
        })}
      </TableBody>
    )}}

export default connect(null, { handleOpenDialog })(DerbyBody)
