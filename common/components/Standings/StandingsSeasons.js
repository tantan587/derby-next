const StandingsSeasons = () => {
  let d = new Date()
  let month = d.getMonth() + 1
  month = month < 10 ? '0' + month : month.toString()
  let src = '/static/images/standings/Derby_Standings_BG_' + month + '.svg'
  return <img
    src={src}
  />
}

export default StandingsSeasons
