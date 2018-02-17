import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import grey from 'material-ui/colors/grey'

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
    const {homeTeam, awayTeam, sport, dateTime, time, classes} = this.props
    //const date = fantasyHelpers.getDayCountStr(dateTime)
    //const time = fantasyHelpers.formatAMPM(new Date(dateTime))
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
          <Typography type="body2">{awayTeam}</Typography>
        </div>
        <div className={classes.con2} style={{width:50}}>
          <Typography type="body2">0</Typography>
        </div>
        <div className={classes.con2} style={{width:100}}>
        </div>
        <div className={classes.con2} style={{width:120}}>
          <Typography type="body2">Me</Typography>
        </div>
        <div className={classes.con2} style={{width:50}}>
        </div>
        <div className={classes.con2} style={{width:50}}>
        </div>
        <div className={classes.con2} style={{width:50}}>
        </div>
        <br style={{clear: 'left'}}/>

        <div className={classes.con3} style={{width:200}} >
          <Typography type="body2">{homeTeam}</Typography>
        </div>
        <div className={classes.con4} style={{width:50}}>
          <Typography type="body2">0</Typography>
        </div>
        <div className={classes.con5} style={{width:100}}>
          <Typography type="body2">{time}</Typography>
        </div>
        <div className={classes.con4} style={{width:120}}>
          <Typography type="body2">You</Typography>
        </div>
        <div className={classes.con5} style={{width:50}}>
          <Typography type="body2">{sport}</Typography>
        </div>
        <div className={classes.con5} style={{width:50}}>
          <Typography type="body2">3</Typography>
        </div>
        <div className={classes.con5} style={{width:50}}>
          <Typography type="body2">43</Typography>
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