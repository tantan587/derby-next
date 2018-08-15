import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import { handleOpenDialog } from '../../actions/dialog-actions'
import Title from '../Navigation/Title'
import Owner from '../Home/Owner'
import Card from '../Home/Card'
import Standings from '../Home/Cards/Standings'
//import TheWire from '../Home/Cards/TheWire'
import Countdown from '../Home/Cards/Countdown'
import Upcoming from '../Home/Cards/Upcoming'
import StyledButton from '../Navigation/Buttons/StyledButton'
import C from '../../constants'

const styles = theme => ({
  section1: {
    paddingTop: 100,
    color:'white',
    backgroundImage: 'url("/static/images/derbyhome2.svg")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    minHeight: '600px',
    marginLeft:'3%',
    width:'94%'
  },
  'cards': {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '90%',
    margin: '0px 5% 0px 5%',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
      '& > *': { // for all children when screen is sm or smaller
        margin: 'auto' // this is a HACK. Might not look great if card width is changed
      }
    },
  }
})

class MainLeagueHome extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      startTime: 0
    }
  }

  componentDidMount() {
    this.tick()
    this.timerID = setInterval(
      () => this.tick(),
      500
    )
  }

  componentWillUnmount() {
    clearInterval(this.timerID)
  }

  tick() {
    if(this.props.activeLeague && this.props.activeLeague.draftInfo && this.props.activeLeague.draftInfo.start_time)
      this.setState({
        startTime: Math.round((new Date(this.props.activeLeague.draftInfo.start_time)-new Date())/1000)
      })
  }

  render() {
    const { classes, activeLeague, teams } = this.props
    const { startTime } = this.state

    let owners = []
    if (activeLeague.owners)
    {
      owners = activeLeague.owners
    }

    const myOwner =owners.find(owner => owner.owner_id === activeLeague.my_owner_id)
    return (
      <div>
        <Title color='white' backgroundColor='#EBAB38' title={'League Home'}/>
        <div className={classes.section1}>
          {/* <div className={classes.section1}/> */}
          <Owner myOwner={myOwner} num={owners.length} />
          <Grid container className={classes.cards}>
            <Card
              title="Upcoming Games"
              Button={() => <StyledButton text="View Complete Schedules" link='/mainleagueschedule' />}
            >
              <Upcoming
                upcomingGames={activeLeague.ownerGames}
                teams={teams}
              />
            </Card>
            {
              activeLeague.draftInfo && activeLeague.draftInfo.mode !== C.DRAFT_STATE.POST ?
                <Card
                  title="Draft Countdown"
                  Button={() => <StyledButton text="Go to Draft Room" link='/livedraft'/>}
                >
                  <Countdown
                    startTime={startTime}
                  />
                </Card> :
                null
            }
            <Card
              title="Standings"
              scroll
              Button={() => <StyledButton text="View Complete Standings" link='/mainleaguestandings'/>}
            >
              <Standings owners={owners.sort((x,y) => {
                return x.rank > y.rank ? 1 
                  : x.rank < y.rank ? - 1 
                    : x.owner_name > y.owner_name ? 1
                      : -1
              }
              )} />
            </Card>

            {/* <Card title="The Wire" scroll>
              <TheWire items={[
                {
                  headline: 'Headline placeholder copy here.',
                  body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                  Button: () => <StyledButton text="Link" link='/login'/>
                },
                {
                  headline: 'Headline placeholder copy here.',
                  body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                  Button: () => <StyledButton text="Link" link='/login'/>
                },
                {
                  headline: 'Headline placeholder copy here.',
                  body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                  Button: () => <StyledButton text="Link" link='/login'/>
                },
              ]}/>
            </Card> */}
          </Grid>
          <br/>
          <br/>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  openDialog: () => dispatch(handleOpenDialog)
})

export default compose(
  connect(state => ({
    activeLeague: state.activeLeague,
    teams: state.teams
  }),
  mapDispatchToProps),
  withStyles(styles)
)(MainLeagueHome)
