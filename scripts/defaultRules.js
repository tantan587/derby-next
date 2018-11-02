const knex = require('../server/db/connection')
const hash = require('object-hash')

//class that is oneRule, class that is all the Rules
//separating out the data into the pieces that you care about
//the more classes, the better

//runs new Rules()
//rules.create()
//rules.toDb()
//rules.toClient()
//use a rule Builder class

class Rules{
    constructor(sportStructureId, useEPL){
        this.sportStructureId = sportStructureId
        this.teams = {
            101: 2,
            102: 2,
            103: 2,
            104: 2,
            105: 3,
            106: 3,
        }

        this.strict = {
            101: true,
            102: true,
            103: true, 
            104: true,
            105: true,
            106: true
        }
        this.sport_ids = [101, 102, 103, 104, 105, 106]
        if(useEPL){
            this.strict[107] = true
            this.sport_ids.push(107)
            this.teams[107] = 1
        }
        this.ruleJson = {}
        this.hash
    }

    createRuleJson(){
        this.ruleJson = {}
        this.sport_ids.forEach(sport_id => {
            this.ruleJson[sport_id] = {
                teams: this.teams[sport_id],
                strict: this.strict[sport_id]
            }
        })
    }

    changeSportTeams(sport_id, newTeams){
        this.teams[sport_id] = newTeams
    }

    changeStrict(sport_id, newStrictBoolean){
        this.strict[sport_id] = newStrictBoolean
    }

    createHash(){
        this.createRuleJson()
        this.hash = hash(this.ruleJson)
    }

    checkIfNewHash(knex){
        let rule_id = 
            await knex('fantasy.league_rules')
                .where('league_rule_hash', this.hash)
                .select('league_rule_id')
        
        if(rule_id){
            return rule_id.league_rule_id
        }else{
            let max_rule_id = 
                await knex('fantasy.league_rules')
                    .max('league_rule_id')
            
            createAndInsertNewRulesToKnex(max_rule_id.league_rule_id+1)

            return max_rule_id.league_rule_id+1
        }

    }

    createAndInsertNewRulesToKnex(rule_id){
        this.createRuleJson()
        await knex('fantasy.league_rules').insert({
            league_rule_id: rule_id,
            league_rule_hash: this.hash,
            league_rules: this.ruleJson
        })
    }


}