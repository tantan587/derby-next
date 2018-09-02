import React from 'react'
import { connect } from 'react-redux'
//import { compose } from 'redux'
import { withStyles } from '@material-ui/core/styles'
import { handleOpenDialog } from '../../actions/dialog-actions'
import {clickedDateChange} from '../../actions/sport-actions'
import Title from '../Navigation/Title'
import {GetDayCountStr} from '../../lib/time'
import sportLeagues from '../../../data/sportLeagues.json'
import ScoreboardBody from './'
import FilterCreator from '../Filters/FilterCreator'
import Filterer from '../Filters/Filterer'
const R = require('ramda')


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
    justifyContent: 'space-between',
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

class ScoreboardPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dayCount: GetDayCountStr(new Date()),
      date: new Date(),
      startTime: 1,
      sportId:null,
      mySchedule:[]
    }
  }

  componentDidUpdate(prevProps, prevState){

    const {dayCount} = this.state
    if(dayCount && (dayCount != prevState.dayCount || 
      prevProps.updateTime.games !== this.props.updateTime.games))
    {
      let mySchedule = []
      if(this.props.liveGames[dayCount])
      {
        mySchedule = this.sortGames(Object.values(this.props.liveGames[dayCount]))
      }
      else if (this.props.schedule.length > 0){
        mySchedule = this.sortGames(this.props.schedule)
      }
      this.setState({mySchedule})
    }
  }

  componentDidMount()
  {
    const {dayCount} = this.state
    let mySchedule = []
    if(this.props.liveGames[dayCount])
      mySchedule = this.sortGames(Object.values(this.props.liveGames[dayCount]))
    this.setState({mySchedule})
  }
  
  onUpdateDate = (date) =>
  {
    let dayCount = GetDayCountStr(date)
    if(!this.props.liveGames[dayCount])
    {
      this.props.onDateChange(dayCount)
    }
    this.setState({date, dayCount})
  }

  sortGames = (games) =>
  {
    games.sort((a,b) => {
      if (a.date_time < b.date_time)
        return -1
      return 1
    })
    return games
  }

  render() {
    //const { classes, liveGames} = this.props

    const { teams, activeLeague, contentFilter } = this.props
    const sportLeagueIds = R.keys(sportLeagues)
    const { mySchedule, date } = this.state
    const page = 'scoreboard'

    let filteredScoreData = mySchedule


    R.values(contentFilter[page]).forEach(filter => {
      filteredScoreData = Filterer(mySchedule, filter, { ownerName })
    })

    //Array of every eligible team along with owner name in this league
    let myTeams = Object.values(teams).filter(team => sportLeagueIds.includes(team.sport_id) && team.eligible).map(team => {
      let owner = null
      if (activeLeague.teams[team.team_id]) {
        owner = activeLeague.owners.find(owner => owner.owner_id === activeLeague.teams[team.team_id].owner_id)
      }
      return {
        ...team,
        owner_name: owner ? owner.owner_name : 'N/A',
      }
    })

    //Creates tab filters specific to this league 
    const values = R.map(x => x.sport_id, this.props.activeLeague.rules)
    values.unshift('All')
    values.push('My Teams')

    //Identifies owner that's logged in
    let ownerName = activeLeague.owners.find(x => x.owner_id === activeLeague.my_owner_id).owner_name

    //Missing step here

    let filteredMyTeams = myTeams

    R.values(contentFilter[page]).forEach(filter => {
      filteredMyTeams = Filterer(filteredMyTeams, filter, { ownerName })
    })

    console.log("------")
    console.log(filteredMyTeams)


    //Array of sorted sport IDs to match columns
    // const sports = R.values(sportLeagues).sort((x, y) => x.order > y.order).map(x => x.sport_id)
    // sports.unshift('All')
    // sports.push('My Teams')

    const sportFilter = {
      type: 'tab',
      displayType: 'sportsIcon',
      values: values,
      column: 'sport_id',
      defaultTab: 0,
      tabStyles: {
        backgroundColor: '#392007', color: 'white',
        selectedBackgroundColor: '#392007',
        selectedColor: '#EBAB38'
      }
    }

    const teamFilter = {
      type: 'tab',
      values: this.props.activeLeague.owners.map(x => x.owner_name).sort((a, b) => a > b),
      column: 'owner_name',
      defaultTab: 0,
      tabStyles: {
        backgroundColor: '#e3dac9',
        color: '#48311A',
        selectedBackgroundColor: 'white',
        selectedColor: '#229246',
        fontSize: 12
      }
    }


    return (
      <div>
        <Title color='white' backgroundColor='#EBAB38' title={'Scoreboard'} />
        <FilterCreator filters={[sportFilter]} page={page} />
        <FilterCreator filters={[teamFilter]} page={page} />
        <ScoreboardBody scoreData={filteredScoreData} date={date} onUpdateDate={this.onUpdateDate} />
      </div>

    )
  }
}

export default R.compose(
  withStyles(styles),
  connect(R.pick(['contentFilter', 'teams', 'liveGames', 'activeLeague', 'schedule', 'updateTime'])
    , {openDialog: handleOpenDialog,onDateChange:clickedDateChange })
)(ScoreboardPage)
