import {combineReducers} from 'redux'
import activeLeagueReducer from './activeLeagueReducer'
import leaguesReducer from './leaguesReducer'
import previousPageReducer from './previousPageReducer'
import scheduleReducer from './scheduleReducer'
import statusReducer from './statusReducer'
import teamsReducer from './teamsReducer'
import userReducer from './userReducer'
import draftReducer from './draftReducer'
import dialogReducer from './dialogReducer'
import oneTeamReducer from './oneTeamReducer'
import updateTimeReducer from './updateTimeReducer'
import liveGamesReducer from './liveGamesReducer'

export default combineReducers({
  activeLeague: activeLeagueReducer,
  leagues: leaguesReducer,
  previousPage: previousPageReducer,
  schedule: scheduleReducer,
  status: statusReducer,
  teams: teamsReducer,
  user: userReducer,
  draft: draftReducer,
  teamsDialog: dialogReducer,
  oneTeam : oneTeamReducer,
  updateTime : updateTimeReducer,
  liveGames : liveGamesReducer
})
