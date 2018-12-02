
class RuleCalculator {
  constructor(){

  }
  CalculateTotal(rule, record)
  {
    return rule.PointRule.RegularWin * record.Wins + 
    rule.PointRule.RegularTie * record.Ties
  }
}

module.exports = RuleCalculator