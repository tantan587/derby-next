import {withStyles} from '@material-ui/core/styles'
//import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import { connect } from 'react-redux'
import { handleOpenDialog } from '../../actions/dialog-actions.js'
import { clickedOneTeam } from '../../actions/sport-actions.js'

const styles = {
  L: {
    justifyContent: 'center'
  },
  pointer: {
    '&:hover': {
      textDecoration: 'underline',
      cursor: 'pointer',
    }
  }
}

const TeamSection = ({
  classes,
  lostInd,
  team_id = 101101,
  logo_url = 'https://upload.wikimedia.org/wikipedia/en/2/24/Atlanta_Hawks_logo.svg',
  team_name = 'Rays',
  //record='(28-30, 36 Points)',
  //owner_name='N/A',
  handleOpenDialog,
  clickedOneTeam,
  totalInd,
  score,
  nameRecordPoints
}) => {
  let total = totalInd ? score.pop() : null
  return (
    <Grid
      container
      alignItems="center"
      justifyContent='center'
      style={{marginBottom: 30, padding: '0 10px', height:50}}
    >
      <Grid item xs={2} style={{marginBottom:-4, textAlign:'center'}}>
        <img
          preserveAspectRatio='true' 
          src={logo_url}
          style={{ maxHeight:'40px', maxWidth:40}}
          className={classes.pointer}
          onClick={() => {
            clickedOneTeam(team_id)
              .then(() => handleOpenDialog())
          }}
        />
      </Grid>
      <Grid item xs={4}>
        <Typography
          variant="body2"
          className={classes.pointer}
          style={{fontWeight: lostInd ? 'normal':'bold', color: lostInd ? '#777':'#000'}}
          children={team_name}
          onClick={() => {
            clickedOneTeam(team_id)
              .then(() => handleOpenDialog())
          }}
        />
      </Grid>
      
      <Grid
        item
        className={classes.R}
        container
        variant="body2"
        xs={totalInd ? 4 : 6}
      >
        {score.map((x, i) => {
          return <Grid
            key={i}
            container
            item
            style={{justifyContent: 'center'}}
            //className={classes.RValues}
            xs={Math.floor(12/score.length)}
            children={<Typography children={x} variant="subheading" color="inherit" />}
            alignItems="center"
          />})}
      </Grid>
      { totalInd ? 
        <Grid 
          container
          style={{justifyContent: 'center'}}
          children={<Typography children={total} variant="subheading" color="inherit" />}
          variant="body2"
          alignItems="center"
          xs={2}/> :
        null
      }
      
      <Grid container alignItems='center'></Grid>
      <Grid item
        xs={2}/>
      <Grid item
        style={{display:'flex', justifyContent:'left'}}
        //className={classes.L}
        children={<Typography variant="caption">{nameRecordPoints}</Typography>}
        variant="body2"
        xs={10}/>
    </Grid>
  )}

export default connect(
  null,
  { handleOpenDialog, clickedOneTeam }
)(withStyles(styles)(TeamSection))