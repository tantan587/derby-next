import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

const DialogNextFive = ({ tableData, nextFive, }) =>
  <Table style={{ width: '100%', display: 'block', overflowX: 'auto', whiteSpace: 'nowrap' }}>
    <TableHead style={{ backgroundColor: '#229246' }}>
      <TableRow>
        <TableCell style={{ color: 'white' }}>Date</TableCell>
        <TableCell style={{ color: 'white' }}>Opponent</TableCell>
        <TableCell style={{ color: 'white' }}>Location</TableCell>
        <TableCell style={{ color: 'white' }}>Derby Points</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {
        nextFive.map((game, idx) => {

          return <TableRow key={game.game_id}>
            <TableCell>{game.date_time|| '4/322/18'}</TableCell>
            <TableCell>{tableData[idx].opponent || 'Rockies'}</TableCell>
            <TableCell>{tableData && tableData[idx].location || 'Boston Celtics Stadium'}</TableCell>
            <TableCell>{tableData && tableData[idx].derby_points || '0'}</TableCell>
          </TableRow>
        }
        )
      }
    </TableBody>
  </Table>

export default DialogNextFive
