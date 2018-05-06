import React from 'react'
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table'

const DialogNextFive = ({ tableData, teams, nextFive, oneTeam }) =>
  <Table>
    <TableHead style={{ backgroundColor: '#229246' }}>
      <TableRow>
        <TableCell style={{ color: 'white' }}>Date</TableCell>
        <TableCell style={{ color: 'white' }}>Opponent</TableCell>
        {/* <TableCell style={{ color: 'white' }}>Result</TableCell> */}
        {/* <TableCell style={{ color: 'white' }}>Score</TableCell> */}
        <TableCell style={{ color: 'white' }}>Location</TableCell>
        <TableCell style={{ color: 'white' }}>Derby Points</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {
        nextFive.map((game, idx) => {
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
            <TableCell>{tableData[idx].opponent || 'Rockies'}</TableCell>
            {/* <TableCell>
              {
                (current.score > opponent.score ? 'W' : 'L')
                || 'L'
              }
            </TableCell> */}
            {/* <TableCell>
              {
                `${current.score}-${opponent.score}` || '5-2'
              }
            </TableCell> */}
            <TableCell>{tableData && tableData.location || 'Boston Celtics Stadium'}</TableCell>
            <TableCell>{tableData && tableData.derby_points || '0'}</TableCell>
          </TableRow>
        }
        )
      }
    </TableBody>
  </Table>

export default DialogNextFive
