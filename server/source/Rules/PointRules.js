class PointRules {
  constructor(sportId, regWin, regTie, playWin,
    bye, champion, finalist, appearance, bowlWin,
    milestonePoints, milestone)
  {
    this.SportId = sportId
    this.RegularWin = regWin
    this.RegularTie = regTie
    this.PlayoffWin = playWin
    this.Bye = bye
    this.Champion = champion
    this.Finalist = finalist
    this.Appearance = appearance
    this.BowlWin = bowlWin
    this.MilestonePoints = milestonePoints
    this.Milestone = milestone
  }
}

module.exports = PointRules