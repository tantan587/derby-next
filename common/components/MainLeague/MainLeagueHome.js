import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withStyles } from '@material-ui/core/styles'
import { handleOpenDialog } from '../../actions/dialog-actions'
import Title from '../Navigation/Title'
import Owner from '../Home/Owner'
import Card from '../Home/Card'
import Standings from '../Home/Cards/Standings'
import TheWire from '../Home/Cards/TheWire'
import Countdown from '../Home/Cards/Countdown'
import Upcoming from '../Home/Cards/Upcoming'
import StyledButton from '../Navigation/Buttons/StyledButton'


const styles = {
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
    justifyContent: 'space-between',
    width: '90%',
    margin: '50px 5% 0px 5%'
  }
}

class MainLeagueHome extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      startTime: Math.round((new Date(this.props.activeLeague.draft_start_time)-new Date())/1000)
    }
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      5000
    )
  }

  componentWillUnmount() {
    clearInterval(this.timerID)
  }

  tick() {
    this.setState({
      startTime: Math.round((new Date(this.props.activeLeague.draft_start_time)-new Date())/1000)
    })
  }

  render() {
    const { classes, activeLeague, sportLeagues, teams } = this.props
    const { startTime } = this.state

    let owners = []
    if (activeLeague.owners)
    {
      owners = activeLeague.owners
    }

    const myOwner =owners.find(owner => owner.owner_id === activeLeague.my_owner_id)
    return (
      <div>
        <Title color='white' backgroundColor='black' title={'Welcome Us'}/>
        <div className={classes.section1}>
          {/* <div className={classes.section1}/> */}
          <Owner myOwner={myOwner} num={owners.length} />
          <div className={classes.cards}>

            <Card
              title="Upcoming Games"
              Button={() => <StyledButton text="View Complete Schedules"/>}
            >
              <Upcoming
                sportLeagues={sportLeagues}
                upcomingGames={activeLeague.ownerGames}
                teams={teams}
              />
            </Card>

            <Card
              title="Draft Countdown"
              Button={() => <StyledButton text="Go to Draft Room"/>}
            >
              <Countdown
                startTime={startTime}
              />
            </Card>

            <Card
              title="Standings"
              scroll
              Button={() => <StyledButton text="View Complete Standings"/>}
            >
              <Standings owners={owners.sort((a, b) => a.rank - b.rank)} />
            </Card>

            <Card title="The Wire" scroll>
              <TheWire items={[
                {
                  headline: 'Headline placeholder copy here.',
                  body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                  Button: () => <StyledButton text="Link" />
                },
                {
                  headline: 'Headline placeholder copy here.',
                  body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                  Button: () => <StyledButton text="Link" />
                },
                {
                  headline: 'Headline placeholder copy here.',
                  body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                  Button: () => <StyledButton text="Link" />
                },
              ]}/>
            </Card>

            {/* <Card title="Standings">
              <Standings owners={ownersWithColors.sort((a, b) => a.rank - b.rank)} />
            </Card> */}

          </div>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  openDialog: () => dispatch(handleOpenDialog)
})

// export default connect(
//   state => ({
//     activeLeague: state.activeLeague,
//     sportLeagues : state.sportLeagues,
//     teams: state.teams,
//   }),
//   mapDispatchToProps,
// )(withStyles(styles)(MainLeagueHome))
export default compose(
  connect(state => ({
    activeLeague: state.activeLeague,
    sportLeagues : state.sportLeagues,
    teams: state.teams
  }),
  mapDispatchToProps),
  withStyles(styles)
)(MainLeagueHome)
