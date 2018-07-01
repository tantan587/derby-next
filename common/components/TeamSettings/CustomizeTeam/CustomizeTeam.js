import { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'

import TeamView from './TeamView'
import ChoosePattern from './ChoosePattern'
import ChooseColor from './ChooseColor'
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
    fontFamily: 'HorsebackSlab',
    fontSize: 15,
    color: '#299149'
  }
})

class CustomizeTeam extends Component {
  state = {
    teamName: '',
    pattern: '',
    patternColor: '',
    jerseyColor: ''
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    })
  }

  handleColorClick = (type, color) => this.setState({ [type]: color })
  handlePatternClick = pattern => {
    console.log(pattern)
    this.setState({ pattern })}

  render() {
    const { teamName, pattern, patternColor, jerseyColor } = this.state
    const { classes } = this.props

    const teamCopy = 'Jockeys wear elaborate “silks” when riding horses in a race. Receiving silks is a rite of passage for jockeys entering their first ride. Below, select your pattern and colors that will identify you throughout your league season. Note: you can change your silks up to the beginning of the first games in your league, but they lock in once play starts.'
    console.log(this.state)
    return (
      <Grid container justify="space-between" className={classes.root}>
        <Grid item sm={12} style={{ marginBottom: 30 }}>
          <div className={classes.top}>
            <TeamView
              className={classes.teamView}
              primary={jerseyColor}
              secondary={patternColor}
              pattern={pattern}
            />
            <div className={classes.nameForm}>
              <div className={classes.teamForm}>
                <div className={classes.teamName}>
                  Team Name
                </div>
                <TextField
                  value={teamName}
                  onChange={this.handleChange('teamName')}
                  placeholder="Team Name Here"
                />
              </div>
              <div className={classes.yourSilk}>Your Silk</div>
              <div>{teamCopy}</div>
            </div>
          </div>
        </Grid>
        <Grid item sm={12} md={5}>
          <div>
            <div className={classes.title}>Choose Pattern</div>
            <ChoosePattern handlePatternClick={this.handlePatternClick} />
          </div>
        </Grid>
        <Grid item sm={12} md={3} className={classes.gridMargins}>
          <div>
            <div className={classes.title}>Choose Jersey Color</div>
            <ChooseColor handleColorClick={this.handleColorClick.bind(null, 'jerseyColor')} />
          </div>
        </Grid>
        <Grid item sm={12} md={3} className={classes.gridMargins}>
          <div>
            <div className={classes.title}>Choose Pattern Color</div>
            <ChooseColor handleColorClick={this.handleColorClick.bind(null, 'patternColor')} />
          </div>
        </Grid>
        <StyledButton
          height={50}
          styles={{ fontSize: 16, fontWeight: 600, marginTop: 40 }}
          text="Save Settings"
        />
      </Grid>
    )
  }
}

export default withStyles(styles)(CustomizeTeam)
