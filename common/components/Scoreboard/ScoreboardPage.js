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
      sportId:null
    }
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

    const {contentFilter, liveGames, schedule} = this.props
    const {dayCount, date} = this.state
    const page='scoreboard'

    let data = []
    if(liveGames[dayCount])
    {
      data = this.sortGames(Object.values(liveGames[dayCount]))
    }
    else if (schedule.length > 0){
      data = this.sortGames(schedule)
    }

    let filteredScoreData = data
    R.values(contentFilter[page]).forEach(filter => {
      filteredScoreData = Filterer(data, filter)
    })
    const sports = R.values(sportLeagues).sort((x,y) => x.order > y.order).map(x => x.sport_id)
    sports.unshift('All')

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
    return (
      <div>
        <Title color='white' backgroundColor='#EBAB38' title={'Scoreboard'}/>
        <FilterCreator filters={[filter]} page={page}/>
        <ScoreboardBody scoreData={filteredScoreData} date={date} onUpdateDate={this.onUpdateDate}/>
      </div>

    )
  }
}

export default R.compose(
  withStyles(styles),
  connect(R.pick(['contentFilter', 'teams', 'liveGames', 'activeLeague', 'schedule'])
    , {openDialog: handleOpenDialog,onDateChange:clickedDateChange })
)(ScoreboardPage)
