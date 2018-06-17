import C from '../../constants'

export default (state = {}, action={ type: null }) => {
  switch (action.type){
  case C.UPDATE_GAMES:
    return action.games
  case C.UPDATE_GAME_DIFF:
  {
    console.log(state)
    Object.keys(action.gamesDiff).forEach(dayCount =>
    {
      //weve gone to the next day so delete 3 days before
      if (!state[dayCount])
      {
        state[dayCount] ={}
        delete state[(dayCount-3)]
      }

      Object.keys(action.gamesDiff[dayCount]).forEach(gameId =>
      {
        state[dayCount][gameId] = action.gamesDiff[dayCount][gameId]
      })
    })
    return state
  }
  default:
    return state
  } 
}
