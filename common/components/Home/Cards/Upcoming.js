import { withStyles } from '@material-ui/core/styles'

const styles = {
  root: {
    fontFamily: 'Roboto',
    fontSize: 11,
    color: '#848484',
  },
  game: {
    display: 'flex',
    height: 34,
    alignItems: 'center',
    '&:nth-child(even)' : {
      backgroundColor: '#F5F5F5'
    }
  },
  date: {
    width: '20%',
    fontWeight: 600,
    color: '#717171'
  },
  time: {
    width: '28%'
  },
  place: {
    width: '28%'
  },
  conference: {
    width: '24%'
  },
}

const Upcoming = withStyles(styles)(({ classes, sportLeagues, upcomingGames, teams }) =>
  <div className={classes.root}>
    {
      upcomingGames ? upcomingGames.map((game, idx) => <div key={idx} className={classes.game}>
        <div className={classes.date}>
          {game.date}
        </div>
        <div className={classes.time}>
          {game.time}
        </div>
        <div className={classes.place}>
          <span
            style={ game.my_team_id === game.away_team_id ?  { color: '#2D934C', fontWeight: 600 } : {}}>
            {teams[game.away_team_id].key}
          </span>
          &nbsp;@&nbsp;
          <span style={ game.my_team_id === game.home_team_id ?  { color: '#2D934C', fontWeight: 600 } : {}}>
            {teams[game.home_team_id].key}
          </span>
        </div>
        <div className={classes.conference}>
          {sportLeagues ? sportLeagues.filter(x => x.sport_id === game.sport_id)[0].sport: ''}
        </div>
      </div>)
        : <div/>
    }
  </div>)

export default Upcoming
