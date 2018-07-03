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
    const { classes } = this.props

    return (
      <Grid container justify="space-between" className={classes.root}>
        <Grid item sm={12} md={7}>
          <div>
            <div className={classes.title}>Choose Pattern</div>
            <ChoosePattern handlePatternClick={this.handlePatternClick} />
          </div>
        </Grid>
        <Grid item sm={12} md={5} className={classes.gridMargins}>
          <div>
            <div className={classes.title}>Choose Jersey Color</div>
            <ChooseColor handleColorClick={this.handleColorClick.bind(null, 'jerseyColor')} />
          </div>
        </Grid>
        {/* <StyledButton
          height={50}
          styles={{ fontSize: 16, fontWeight: 600, marginTop: 40 }}
          text="Save Settings"
        /> */}
      </Grid>
    )
  }
}

export default withStyles(styles)(CustomizeTeam)
