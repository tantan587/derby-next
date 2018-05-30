import React from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

const DialogLastFive = ({ data, teams, lastFive, oneTeam }) => {

  return <Table>
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
        lastFive.map(game => {
          let opponent
          let current

          if (teams[game.away_team_id].team_name === oneTeam.team_name) {
            current = {
              name: teams[game.away_team_id].team_name,
              score: game.away_team_score,
            }
            opponent = {
              name: teams[game.home_team_id].team_name,
              score: game.home_team_score,
            }
          } else {
            current = {
              name: teams[game.away_team_id].team_name,
              score: game.away_team_score,
            }
            opponent = {
              name: teams[game.home_team_id].team_name,
              score: game.home_team_score,
            }
          }


          return <TableRow key={game.game_id}>
            <TableCell>{game.date_time|| '4/322/18'}</TableCell>
            <TableCell>{opponent.name || 'Rockies'}</TableCell>
            <TableCell>
              {
                (current.score > opponent.score ? 'W' : 'L')
                || 'L'
              }
            </TableCell>
            <TableCell>
              {
                `${current.score}-${opponent.score}` || '5-2'
              }
            </TableCell>
            <TableCell>{data && data.location || 'Boston Celtics Stadium'}</TableCell>
            <TableCell>{data && data.derby_points || '0'}</TableCell>
          </TableRow>
        }
        )
      }
    </TableBody>
  </Table>
}

export default DialogLastFive
