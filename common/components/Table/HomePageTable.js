import Table from 'material-ui/Table'
import React from 'react'
import {
  TableCell,
  TableHead,
  TableBody,
  TableRow} from 'material-ui/Table'
import CheckIcon from 'material-ui-icons/Check'


const headers = ['Leagues', 'Team Based', 'Draft Format',
  'No Roster Management', 'Social Competition', 'Includes Playoffs',
  'Multi-Sport-Year-Round']
const rows = [['Traditional Fantasy Leagues', false, true, false, true, false, false],
  ['Daily Fantasy', false, true, false, false, true, false],
  ['Sports Gambling', true, false, true, false, true, true],
  ['DERBY', true, true, true, true, true, true]]


class HomePageTable extends React.Component {
  render() {


    return (
      //maxWidth: 1000,
      <Table style={{width:'60%',marginLeft:'20%',color: 'white'}}>
        <TableHead>
          <TableRow>
            {headers.map((column,i) => {
              return (
                <TableCell
                  key={i}
                  padding='default'
                  style={{color:'white', fontSize:16, textAlign:'center'}}
                >
                  {column}
                </TableCell>
              )
            }, this)}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map( row=> {
            return <TableRow>
              {row.map((column,i) => {
                return (
                  i == 0 ?
                    <TableCell
                      key={i}
                      padding='default'
                      style={{color:'white', fontSize:16, textAlign:'center', fontFamily:column=='DERBY' ? 'museo-slab-bold' : 'roboto'}}
                    >
                      {column}
                    </TableCell>
                    : column ?
                      <TableCell
                        key={i}
                        padding='default'
                        style={{color:'white', width:'13%', textAlign:'center'}}>
                        <CheckIcon style={{color:'#EBAB38', fontSize:40}}/>
                      </TableCell>
                      : <TableCell
                        key={i}
                        padding='default'
                        style={{color:'white',  width:'13%', fontSize:16}}/>
                )
              })}
            </TableRow>
          })}

        </TableBody>
      </Table>
    )
  }
}

export default HomePageTable