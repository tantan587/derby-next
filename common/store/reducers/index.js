import {combineReducers} from 'redux'
import activeLeagueReducer from './activeLeagueReducer'
import leaguesReducer from './leaguesReducer'
import previousPageReducer from './previousPageReducer'
import scheduleReducer from './scheduleReducer'
import sportLeaguesReducer from './sportLeaguesReducer'
import statusReducer from './statusReducer'
import teamsReducer from './teamsReducer'
import userReducer from './userReducer'

export default combineReducers({
  activeLeague: activeLeagueReducer,
  leagues: leaguesReducer,
  previousPage: previousPageReducer,
  schedule: scheduleReducer,
  sportLeagues: sportLeaguesReducer,
  status: statusReducer,
  teams: teamsReducer,
  user: userReducer,
})