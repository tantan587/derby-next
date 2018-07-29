import { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import BasicInformation from './BasicInformation'
import DraftSettings from './DraftSettings'
import StyledButton from '../../Navigation/Buttons/StyledButton'

const styles = theme => ({
  root: {
    marginTop: 50,
    fontFamily: 'Roboto',
    color: '#999999'
  },
  top: {
    display: 'flex',
    [theme.breakpoints.only('xs')]: {
      height: 440,
      flexDirection: 'column-reverse',
      justifyContent: 'space-between'
    }
  },
  gridMargins: {
    [theme.breakpoints.down('sm')]: {
      marginTop: 30
    }
  },
  teamForm: {
    display: 'flex',
    marginBottom: 16
  },
  teamView: {
    display: 'inline-flex',
    justifyContent: 'center',
    maxHeight: 100,
    padding: 25,
    borderTop: '1px solid black',
    borderRight: '1px solid black',
    borderBottom: '1px solid black',
    borderLeft: '1px solid black',
  },
  nameForm: {
    marginLeft: 20
  },
  teamName: {
    fontFamily: 'HorsebackSlab',
    fontSize: 16,
    color: '#299149',
    marginRight: 15,
    alignSelf: 'flex-end',
  },
  yourSilk: {
    fontFamily: 'HorsebackSlab',
    fontSize: 15,
    color: '#299149'
  },
  title: {
    marginBottom: 18,
    fontFamily: 'HorsebackSlab',
    fontSize: 15,
    color: '#299149'
  }
})

class LeagueInfo extends Component {
  
  keypress(e) {
    if (e.key === 'Enter') { 
      this.props.onSubmit(e)
    }
  }

  render() {
    const { classes, leagueInfo, onSubmit, handleChange, errorText } = this.props
    const {owners, draftType, pickTime, draftDate, premier} = leagueInfo
    return (
      <Grid container justify="space-between" className={classes.root} spacing={40} onKeyPress={(event) => this.keypress(event)}>
        <Grid item xs={12} md={12} lg={6}>
          <div>
            <div className={classes.title}>Basic League Information</div>
            <BasicInformation handleChange={handleChange} owners={owners} premier={premier}/>
          </div>
        </Grid>
        <Grid item xs={12} md={12} lg={6} className={classes.gridMargins}>
          <div>
            <div className={classes.title}>Draft Settings</div>
            <DraftSettings draftType={draftType} pickTime={pickTime} draftDate={draftDate} handleChange={handleChange}/>
          </div>
        </Grid>
        <Grid item xs={12} md={12} className={classes.gridMargins}>
          <Typography variant='subheading' style={{color:'red'}}>
            {errorText}
          </Typography>
        </Grid>
        
        <StyledButton
          height={50}
          styles={{ fontSize: 16, fontWeight: 600, marginTop: errorText ? 16 : 40, marginBottom:50 }}
          text="Save Settings"
          onClick={onSubmit}
        />
        <br/>
        <br/>
      </Grid>
    )
  }
}

export default (withStyles(styles))(LeagueInfo)
