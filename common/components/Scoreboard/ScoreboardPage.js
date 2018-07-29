import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withStyles } from '@material-ui/core/styles'
import { handleOpenDialog } from '../../actions/dialog-actions'
import Title from '../Navigation/Title'
import {GetDayCountStr} from '../../lib/time'
//import TabFilter from '../Table/Filters/TabFilter' 
import sportLeagues from '../../../data/sportLeagues.json'
import ScoreboardBody from './'
import scoreData from '../../../data/scoreData.js'
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
      dayCount: GetDayCountStr((new Date()).toJSON()),
      startTime: 1,
      sportId:null
    }
  }
  test = (x) => {
    console.log(x.scoreboard[0])
  }

  render() {
    //const { classes, liveGames} = this.props

    const {contentFilter} = this.props
    const page='scoreboard'

    let filteredScoreData = scoreData
    R.values(contentFilter[page]).forEach(filter => {
      filteredScoreData = Filterer(scoreData, filter)
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
        <ScoreboardBody scoreData={filteredScoreData}/>
      </div>

    )

        
    //     const { startTime } = this.state
    //     //const myOwner =owners.find(owner => owner.owner_id === activeLeague.my_owner_id)
    //     return (
    //       <div>
    //         <Title color='white' backgroundColor='#EBAB38' title={'Scoreboard'}/>
    //       </div>
    //     )
  }
}

const mapDispatchToProps = (dispatch) => ({
  openDialog: () => dispatch(handleOpenDialog)
})

export default compose(
  connect(state => ({
    contentFilter:state.contentFilter,
    teams: state.teams,
    liveGames: state.liveGames,
    activeLeague: state.activeLeague
  }),
  mapDispatchToProps),
  withStyles(styles)
)(ScoreboardPage)
