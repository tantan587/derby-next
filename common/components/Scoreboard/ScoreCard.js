const R = require('ramda')
import {Component} from 'react'
import {withStyles} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import {LeftRight} from './ScoreCardLayouts'
import TeamSection from './TeamSection'
import MetaPB from './RightSideContent/MetaPB'
import TeamsDialog from '../TeamsDialog/TeamsDialog'


const styles = (theme) => (console.log(theme), {
  container: {
    maxWidth: 600,
    marginBottom: 20,
    marginRight:20,
  },
  title: {
    fontWeight: 'bold',
    color: theme.palette.primary.main,
  },
  left: {
    [theme.breakpoints.between('xs', 'sm')]: {
      borderBottom: `1px solid ${theme.palette.grey.A200}`,
    },
    [theme.breakpoints.up('md')]: {
      borderRight: `1px solid ${theme.palette.grey.A200}`,
    },
  },
  venue: {
    marginBottom: 10,
    marginLeft: 10,
  },
  right: {
    padding: '25px',
  },
  bb: {
    borderBottom: '1px solid #777'
  },
  Header: {marginBottom: 30, borderBottom: `1px solid ${theme.palette.grey.A200}`, padding: '10px 10px 10px 10px', height:50},
  Row: {marginBottom: 30, padding: '0 10px'},
  R: {},
  RValues: {justifyContent: 'center'}
})


const TeamScoreRow = ({classes, team, totalInd, activeLeague}) => {
  let record_and_points = team.record
  let owner_name = ''
  if(activeLeague.success){
    let owner_id = team.team_id in activeLeague.teams ? activeLeague.teams[team.team_id].owner_id : false
    owner_name = owner_id ? activeLeague.owners.find(owner => owner.owner_id===owner_id).owner_name : 'N/A'
    let points = team.team_id in activeLeague.teams ? `, ${activeLeague.teams[team.team_id].points} points` : ''
    record_and_points = `${team.record} ${points}`
  }
  return (
    <LeftRight
      totalInd={totalInd}
      className={classes.Row}
      style={ {color:team.lost ? '#777' : '#000'}}
      classes={R.pick(['R', 'RValues'], classes)}
      L={<TeamSection
        lostInd={team.lost}
        team_name={team.team_name}
        logo_url={team.url}
        record={record_and_points}
        owner_name={owner_name}/>}
      R={team.score.map(x => <Typography children={x} variant="subheading" color="inherit" />)}
    />
  )
}

class ScoreCard extends Component {

  render() {
    const {classes, useRightSide, scoreboardData, activeLeague} = this.props
    const totalInd=scoreboardData.header[scoreboardData.header.length-1] === 'T'
    return (
      <div>
      <TeamsDialog />

      <Grid
        item
        container
        className={classes.container}
        style={{maxWidth:useRightSide? 600: 400}}
        xs={12}
        direction="row"
        component={Paper}
      > 
        <Grid
          item
          className={classes.left}
          container
          xs={12}
          md={useRightSide ? 7 : 12}
        >
          <LeftRight
            totalInd={totalInd}
            className={classes.Header}
            classes={R.pick(['R', 'RValues'], classes)}
            L={<Typography children={<b>{scoreboardData.status}</b>} variant="subheading" color="primary"/>}
            R={scoreboardData.header.map((x,i) => <Typography key={i} children={x} variant="subheading" color="inherit" />)}
          />
          <TeamScoreRow totalInd={totalInd} classes={classes} team={scoreboardData.away} activeLeague={activeLeague}/>
          <TeamScoreRow totalInd={totalInd} classes={classes} team={scoreboardData.home} activeLeague={activeLeague}/>
          {/* <Typography className={classes.venue} variant="caption"><b>Location</b>{': ' + scoreboardData.stadium}</Typography> */}
        </Grid>
        {useRightSide ? 
          <Grid
            className={classes.right}
            xs={12}
            md={5}
            children={(
              <MetaPB />
            )}
          /> : <div/>
        }
      </Grid>
      </div>

    )
  }
}

export default withStyles(styles)(ScoreCard)