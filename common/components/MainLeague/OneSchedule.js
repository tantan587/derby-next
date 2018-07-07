import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  center:{
    left: '50%',
    textAlign: 'center',
  },
  con1:{
    //borderStyle:'solid',
    borderLeft:'solid',
    borderRight:'solid',
    borderTop:'solid',
    borderWidth:'1px', 
    borderColor:'gray', 
    float:'left', 
    textAlign:'center'},
  con2:{
    //borderStyle:'solid',
    borderRight:'solid',
    borderTop:'solid',
    borderWidth:'1px', 
    borderColor:'gray', 
    float:'left', 
    textAlign:'center'},
  con3:{
    borderLeft:'solid',
    borderRight:'solid',
    borderBottom:'solid',
    borderBottomWidth:'1px',
    borderBottomColor:'gray',
    borderWidth:'1px', 
    borderColor:'gray', 
    float:'left', 
    textAlign:'center'},
  con4:{
    borderRight:'solid',
    borderBottom:'solid',
    borderBottomWidth:'1px',
    borderBottomColor:'gray',
    borderWidth:'1px', 
    borderColor:'gray', 
    float:'left', 
    textAlign:'center'},
  con5:{
    borderTop:'solid',
    borderRight:'solid',
    borderBottom:'solid',
    borderRightWidth:'1px',
    borderBottomWidth:'1px',
    borderBottomColor:'gray',
    borderWidth:'1px', 
    borderColor:'gray', 
    float:'left', 
    textAlign:'center',
    marginTop:-25, 
    paddingTop:12, paddingBottom:12},
})

class OneSchedule extends React.Component {
 
  render() {
    const {result, classes} = this.props
    let status = result.status !== 'Scheduled' ? result.status : result.time

    let points = 
      {
        'NBA':3,
        'NFL':15,
        'MLB':2,
        'NHL':3.5,
        'CFB':16.75,
        'CBB':7,
        'EPL':6.75}

    if(status === 'InProgress')
    {
      switch(result.sport){
      case 'NHL':
        status = result.game_time === '---' ? 'End P' + result.period : 'P' + result.period + ' ' +  result.game_time
        break
      case 'NBA': case 'CFB': case 'NFL':
        status = 'Q' + result.period + ' ' + result.game_time
        break
      case 'MLB':
        status = result.period + ' O:' + result.game_time
        break
      case 'EPL': case 'CBB':
        status = 'H' + result.period + ' ' + result.game_time
      }
    }

    return(
      <div style={{left:'50%', position:'relative', marginLeft:-300}}>
        <div className={classes.con1} style={{width:200}} >
          <Typography type="body2">Team</Typography>
        </div>
        <div className={classes.con2} style={{width:50}}>
          <Typography type="body2">Score</Typography>
        </div>
        <div className={classes.con2} style={{width:100}}>
          <Typography type="body2">Status</Typography>
        </div>
        <div className={classes.con2} style={{width:120}}>
          <Typography type="body2">Owner</Typography>
        </div>
        <div className={classes.con2} style={{width:50}}>
          <Typography type="body2">League</Typography>
        </div>
        <div className={classes.con2} style={{width:50}}>
          <Typography type="body2">Points</Typography>
        </div>
        <div className={classes.con2} style={{width:50}}>
          <Typography type="body2">Impact</Typography>
        </div>
        <br style={{clear: 'left'}}/>

        <div className={classes.con1} style={{width:200}} >
          {
            result.winner === 'A'
              ? <Typography style={{fontWeight:'bold'}} type="body2">{result.away_team}</Typography>
              : <Typography  type="body2">{result.away_team}</Typography>
          }
        </div>
        <div className={classes.con2} style={{width:50}}>
          <Typography type="body2">{result.away_team_score === -1 ? 0 : result.away_team_score}</Typography>
        </div>
        <div className={classes.con2} style={{width:100}}>
        </div>
        <div className={classes.con2} style={{width:120}}>
          <Typography type="body2">{result.away_team_owner}</Typography>
        </div>
        <div className={classes.con2} style={{width:50}}>
        </div>
        <div className={classes.con2} style={{width:50}}>
        </div>
        <div className={classes.con2} style={{width:50}}>
        </div>
        <br style={{clear: 'left'}}/>

        <div className={classes.con3} style={{width:200}} >
          {
            result.winner === 'H'
              ? <Typography style={{fontWeight:'bold'}} type="body2">{result.home_team}</Typography>
              : <Typography  type="body2">{result.home_team}</Typography>
          }
        </div>
        <div className={classes.con4} style={{width:50}}>
          <Typography type="body2">{result.home_team_score === -1 ? 0 : result.home_team_score}</Typography>
        </div>
        <div className={classes.con5} style={{width:100}}>
          <Typography type="body2">{status}</Typography>
        </div>
        <div className={classes.con4} style={{width:120}}>
          <Typography type="body2">{result.home_team_owner}</Typography>
        </div>
        <div className={classes.con5} style={{width:50}}>
          <Typography type="body2">{result.sport}</Typography>
        </div>
        <div className={classes.con5} style={{width:50}}>
          <Typography type="body2">{points[result.sport]}</Typography>
        </div>
        <div className={classes.con5} style={{width:50}}>
          <Typography type="body2">?</Typography>
        </div>
        <br style={{clear: 'left'}}/>
        <br/>
      </div>
    )
  }
}

OneSchedule.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(OneSchedule)