import { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import {withRouter} from 'next/router'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
const R = require('ramda')
import TeamView from './TeamView'
import ChoosePattern from './ChoosePattern'
import ChooseColor from './ChooseColor'
import StyledButton from '../../Navigation/Buttons/StyledButton'
import {connect} from 'react-redux'
import {clickedSaveSilks} from '../../../actions/fantasy-actions'
import Typography from '@material-ui/core/Typography/Typography'
import C from '../../../constants'


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
    ownerName: '',
    pattern: 'Star',
    primary: 'Gray',
    secondary: 'White',
    fireRedirect:false
  }

  componentDidMount() {
    let active = this.props.activeLeague
    const myOwner = active.owners.filter(x => x.owner_id === active.my_owner_id)[0]
    if (myOwner.avatar)
    {
      let myAvatar = myOwner.avatar
      this.setState({pattern:myAvatar.pattern, primary:myAvatar.primary, secondary:myAvatar.secondary})
    }
    if(myOwner.owner_name)
    {
      this.setState({ownerName:myOwner.owner_name})
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.updatePage && this.state.fireRedirect && !nextProps.user.error[C.PAGES.CUSTOMIZE_TEAMS])
    {
      this.props.updatePage()
    }
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    })
  }

  onSave = () =>
  {
    this.setState({fireRedirect:true})
    this.props.onSaveSilks(...R.props(['ownerName','pattern', 'primary', 'secondary'], this.state),
      this.props.activeLeague.league_id, this.props.activeLeague.my_owner_id)
  }

  handleColorClick = (type, color) =>
  {

    let changeColor = true
    if(type === 'primary')
    {
      changeColor = this.state.secondary !== color
    }
    if(type === 'secondary')
    {
      changeColor = this.state.primary !== color
    }
    if(changeColor)
    {
      this.setState({
        [type]: color,
      })
    }
  }
  handlePatternClick = pattern => {
    console.log(pattern)
    this.setState({ pattern })}

  render() {
    const { ownerName, pattern, primary, secondary } = this.state
    const { classes, user } = this.props

    const errorText= user.error[C.PAGES.CUSTOMIZE_TEAMS]

    const teamCopy =`Jockeys wear elaborate “silks” when riding horses in a race.
     Receiving silks is a rite of passage for jockeys entering their first ride.
      Below, select your pattern and colors that will identify you throughout your
      league season. Note: you can change your silks up to the beginning of the
       first games in your league, but they lock in once play starts.`
    return (
      <div>
        <Grid container justify="space-between" className={classes.root}>
          <Grid item sm={12} style={{ marginBottom: 30 }}>
            <div className={classes.top}>
              <TeamView
                className={classes.teamView}
                primary={primary}
                secondary={secondary}
                pattern={pattern}
              />
              <div className={classes.nameForm}>
                <div className={classes.teamForm}>
                  <div className={classes.teamName}>
                    Owner Name
                  </div>
                  <TextField
                    value={ownerName}
                    onChange={this.handleChange('ownerName')}
                    placeholder="Owner Name Here"
                    error={this.props.activeLeague.error && this.props.activeLeague.error.ownerName}
                    helperText={this.props.activeLeague.error && this.props.activeLeague.error.ownerName}
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
            <Typography style={{textAlign:'center', marginTop:20, color:'red'}}>
              {errorText}
            </Typography>
          </Grid>
          <Grid item sm={12} md={3} className={classes.gridMargins}>
            <div>
              <div className={classes.title}>Choose Jersey Color</div>
              <ChooseColor handleColorClick={this.handleColorClick.bind(null, 'primary')} />
            </div>
          </Grid>
          <Grid item sm={12} md={3} className={classes.gridMargins}>
            <div>
              <div className={classes.title}>Choose Pattern Color</div>
              <ChooseColor handleColorClick={this.handleColorClick.bind(null, 'secondary')} />
            </div>
          </Grid>
          <StyledButton
            height={50}
            styles={{ fontSize: 16, fontWeight: 600, marginTop: 40 }}
            text="Save Settings"
            onClick={this.onSave}
          />
          
        </Grid>
        <br/>
        <br/>`
      </div>
    )
  }
}

export default R.compose(
  withRouter,
  withStyles(styles),
  connect(R.pick(['activeLeague', 'user']), {onSaveSilks: clickedSaveSilks})
)(CustomizeTeam)
