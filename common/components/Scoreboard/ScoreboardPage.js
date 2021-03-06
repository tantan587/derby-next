import React from 'react'
import { connect } from 'react-redux'
//import { compose } from 'redux'
import { withStyles } from '@material-ui/core/styles'
import {clickedDateChange} from '../../actions/sport-actions'
import Title from '../Navigation/Title'
import {GetDayCountStr} from '../../lib/time'
import sportLeagues from '../../../data/sportLeagues.json'
import ScoreboardBody from './'
import FilterCreator from '../Filters/FilterCreator'
import Filterer from '../Filters/Filterer'
import TeamsDialog from '../TeamsDialog/TeamsDialog'
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

  // componentWillMount(){
  //   this.props.onClickedLeague(this.props.activeLeague.league_id, this.props.user.id)
  // }

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
        .then(()=> this.setState({date, dayCount}))
    }
    else{
      this.setState({date, dayCount})
    }
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

    const {contentFilter, activeLeague, sportSeasons} = this.props
    const {mySchedule, date} = this.state
    const page='scoreboard'


    let myTeams = Object.keys(activeLeague.teams).filter(team_id => activeLeague.teams[team_id].owner_id === activeLeague.my_owner_id)
    let ownerName = activeLeague.owners.find(x => x.owner_id === activeLeague.my_owner_id).owner_name

    //filters data based on page
    //when data changes, filter changes based on the key. 
    //x[filter.key] == filter.value. key for scoreboard is sport_id
    //have to get owner name in here, or change how filters work

    let filteredSchedule = mySchedule.filter(game => {
      let game_eligible = (game.home.team_id in activeLeague.teams)||(game.away.team_id in activeLeague.teams)
      return (sportSeasons.includes(game.sport_season_id) && game_eligible)
    })
    
    let newSchedule = filteredSchedule.map(game => {
      let teamOwnerName = ''
      if(myTeams.includes(game.away.team_id)||myTeams.includes(game.home.team_id)){
        teamOwnerName = ownerName
      }
      return {...game, owner_name: teamOwnerName}
    })
  
    const sports = R.values(sportLeagues).sort((x,y) => x.order > y.order).map(x => x.sport_id)
    sports.unshift('All')
    sports.push('My Teams')

    // console.log(newSchedule)

    let filteredScoreData = newSchedule //mySchedule
    R.values(contentFilter[page]).forEach(filter => {
      filteredScoreData = Filterer(newSchedule, filter, {ownerName})
    })

    // const sports = R.values(sportLeagues).sort((x,y) => x.order > y.order).map(x => x.sport_id)
    // sports.unshift('All')
    // sports.push('My Teams')

    const filter = {
      type:'tab',
      displayType:'sportsIcon',
      values:sports,
      column:'sport_id',
      defaultTab:0,
      tabStyles:{backgroundColor:'#392007', color:'white',
        selectedBackgroundColor:'#392007', 
        selectedColor:'#EBAB38'}
    }
    // ,  
    // {
    //   type: 'tab',
    //   values: this.props.activeLeague.owners.filter(x => x.owner_id === this.props.activeLeague.my_owner_id).map(x => x.owner_name),
    //   column: 'My Teams'
    // }    
  
    return (
      <div>
        <TeamsDialog/>
        <Title color='white' backgroundColor='#EBAB38' title={'Scoreboard'} />
        <FilterCreator filters={[filter]} page={page} />
        <ScoreboardBody scoreData={filteredScoreData} date={date} onUpdateDate={this.onUpdateDate} activeLeague={activeLeague} />
      </div>

    )
  }
}

export default R.compose(
  withStyles(styles),
  connect(R.pick(['contentFilter', 'teams', 'liveGames', 'activeLeague', 'schedule', 'updateTime', 'sportSeasons'])
    , {onDateChange:clickedDateChange })
)(ScoreboardPage)
