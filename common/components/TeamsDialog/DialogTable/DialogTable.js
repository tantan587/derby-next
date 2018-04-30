import React from 'react'
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table'

const DialogTable = ({ data }) =>
  <Table>
    <TableHead style={{ backgroundColor: 'green' }}>
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
      <TableRow>
        <TableCell>{data && data.date || '4/22/18'}</TableCell>
        <TableCell>{data && data.opponent || 'Rockies'}</TableCell>
        <TableCell>{data && data.result || 'L'}</TableCell>
        <TableCell>{data && data.score || '5-2'}</TableCell>
        <TableCell>{data && data.location || 'Coors Field'}</TableCell>
        <TableCell>{data && data.derby_points || '0'}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>{data && data.date || '4/22/18'}</TableCell>
        <TableCell>{data && data.opponent || 'Rockies'}</TableCell>
        <TableCell>{data && data.result || 'L'}</TableCell>
        <TableCell>{data && data.score || '5-2'}</TableCell>
        <TableCell>{data && data.location || 'Coors Field'}</TableCell>
        <TableCell>{data && data.derby_points || '0'}</TableCell>
      </TableRow>
    </TableBody>
  </Table>

export default DialogTable
