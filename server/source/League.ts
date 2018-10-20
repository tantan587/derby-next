import Team from './Team'

export default class League {
  LeagueId:string
  Teams:Team[] = []

  constructor(leagueId:string)
  {
    this.LeagueId = leagueId
  }

  async Create():Promise<void> {
    let team:Team = new Team(3)
    this.Teams.push(team)
  }

  Print():void {
    console.log("Hello", this.LeagueId)
    this.Teams.map(x => {
      console.log(x.TeamId, "myTeamId")
    })
  }
}