class Rules {
  constructor()
  {
    this.Sports = {}
  }

  AddSport(sport)
  {
    this.Sports[sport.Id] = sport
  }

  SportAlreadyExists(sportId)
  {
    return this.Sports[sportId]
  }

  AddConference(sportId, conference)
  {
    this.Sports[sportId].AddConference(conference)
  }
}

module.exports = Rules