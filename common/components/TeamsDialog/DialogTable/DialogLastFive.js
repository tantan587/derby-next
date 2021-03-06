import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

const DialogLastFive = ({ tableData,lastFive }) => {

  return <Table style={{ width: '100%', display: 'block', overflowX: 'auto', whiteSpace: 'nowrap' }}>
    <TableHead style={{ backgroundColor: '#229246' }}>
      <TableRow>
        <TableCell style={{ color: 'white' }}>Date</TableCell>
        <TableCell style={{ color: 'white' }}>Opponent</TableCell>
        <TableCell style={{ color: 'white' }}>Result</TableCell>
        <TableCell style={{ color: 'white' }}>Score</TableCell>
        <TableCell style={{ color: 'white' }}>Location</TableCell>
        <TableCell style={{ color: 'white' }}>Derby Points</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {
        lastFive.map((game, idx) => {
          return <TableRow key={idx}>
            <TableCell>{game.date_time|| '4/322/18'}</TableCell>
            <TableCell>
              {/* { console.log('the data for opponent is', tableData[idx].opponent) } */}
              {tableData[idx].opponent|| 'Rockies'}</TableCell>
            <TableCell>
              {/* { console.log('the data for outcome is', tableData[idx].result) } */}
              {
                tableData[idx].result
                || 'L'
              }
            </TableCell>
            <TableCell>
              {/* { console.log('the data for score is', tableData[idx].score) } */}
              {
                `${tableData[idx].score}` || '5-2'
              }
            </TableCell>
            <TableCell>{tableData && tableData[idx].location || 'Boston Celtics Stadium'}</TableCell>
            <TableCell>{tableData && tableData[idx].derby_result_points || '0'}</TableCell>
          </TableRow>
        }
        )
      }
    </TableBody>
  </Table>
}

export default DialogLastFive
