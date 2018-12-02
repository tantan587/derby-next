
class SportRule {
  constructor(sportId, max, pointRule)
  {
    this.Id = sportId
    this.Max = max
    this.PointRule = pointRule
    this.Conferences = {}
  }

  AddConference(conference)
  {
    this.Conferences[conference.Id] = conference
  }
}

module.exports = SportRule