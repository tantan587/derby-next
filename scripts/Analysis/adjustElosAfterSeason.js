const knex = require('../../server/db/connection')
const math = require('mathjs')
const getDayCount = require('./dayCount.js')
const asyncForEach = require('../asyncForEach')
const updatePastElos = require('./updatePastElos')

const adjustPastElosBySportEOS = async (sport_id) => {
    let teams = 
        await knex('analysis.current_elo')
            .leftOuterJoin('sports.team_info', 'sports.team_info.team_id', 'analysis.current_elo.team_id')
            .where('sport_id',sport_id)
            .where('year', sport_new_years[sport_id]-1)
            .select('*')
    
    let all_elos = teams.map(team => {
        return Number(team.elo)})
    
    var today = new Date()
    //this is the calculation of day count normally:
    let day_count = getDayCount(today)

    let professional_sports = [101,102,103,104]
    let teams_for_insert
    let average_elo = math.mean(all_elos)
    let standard_dev = math.std(all_elos)
    if(professional_sports.includes(sport_id)){
        teams_for_insert = teams.map(team => {
            let offseason_adjustment = 0
            let baseball_adjustment = sport_id===103 ? -.25 : 0
            if(team.team_id in adjust_objects_by_sport[sport_id]){
                offseason_adjustment = adjust_objects_by_sport[sport_id][team.team_id] * standard_dev
            }
            let new_elo = (average_elo + ((2+baseball_adjustment) * team.elo))/(3+baseball_adjustment) + offseason_adjustment
            return {team_id: team.team_id, elo: new_elo, year: sport_new_years[sport_id]}
        })
    }else{
        let elos_by_conference = {}
        teams.forEach(team => {
            if(!(team.conference in elos_by_conference)){
                elos_by_conference[team.conference] = []
            }
            elos_by_conference[team.conference].push(team.elo)
        })
        let average_elo_by_conference = {}
        Object.keys(elos_by_conference).forEach(conference => {
            average_elo_by_conference[conference] = math.mean(elos_by_conference[conference])
        })
        teams_for_insert = teams.map(team => {
            let offseason_adjustment = 0
            if(team.team_id in adjust_objects_by_sport[sport_id]){
                offseason_adjustment = adjust_objects_by_sport[sport_id][team.team_id] * standard_dev
            }
            let new_elo = (average_elo_by_conference[team.conference] + 2 * team.elo)/3 + offseason_adjustment
            return {team_id: team.team_id, elo: new_elo, year: sport_new_years[sport_id]}
        })
    }
    
    await updateElos(teams_for_insert, sport_id)
    
    let historical_teams = teams_for_insert.map(team => {
        return {...team, day_count: day_count}
    })
    console.log(`Sport_id: ${sport_id}, teams inserted: ${teams_for_insert.length}, average: ${average_elo}, standard dev: ${standard_dev}`)
}

const updateElos = async (teams_for_insert, sport_id) => {
    let current_elos =      
        await knex('analysis.current_elo')
            .leftOuterJoin('sports.team_info', 'sports.team_info.team_id', 'analysis.current_elo.team_id')
            .where('sport_id',sport_id)
            .where('year', sport_new_years[sport_id])
            .select('*')

    if(current_elos.length>0){
        await asyncForEach(teams_for_insert, async (team) => {
            await knex('analysis.current_elo')
                .where('team_id', team.team_id)
                .andWhere('year', team.year)
                .update('elo', team.elo)
        })
    }else{
        await knex('analysis.current_elo')
            .insert(teams_for_insert)
    }

}

const sport_new_years = {
    101: 2019, 
    102: 2018,
    103: 2019, 
    104: 2019,
    105: 2018,
    106: 2019,
    107: 2019
}
//all adjust values below are just for this upcoming season
const nba_adjust = {
    101106: -1, //Cavaliers
    101103: -0.3, //Nets
    101111: -0.25, //Rockets
    101108: -0.2, //Nuggets
    101113: -0.2, //Clippers
    101117: 0.2, //Bucks
    101105: 0.2, //Bulls
    101128: 0.25, //Raptors
    101102: 0.25, //Celtics
    101107: 0.25, //Mavericks
    101115: 0.3, //Grizzlies
    101114: 0.5, //Lakers
    101110: .25, //Warriors
    101128: -.25 //Jazz
    

}

const nfl_adjust = {
    102101: -0.5, //Cardinals
    102102: -0.25, //Falcons
    102103: -0.5, //Ravens
    102104: -0.75, //Bills
    102105: -0.25, //Panthers
    102106: 0.25, //Bears
    102107: -0.25, //Bengals
    102108: 1, //Browns
    102109: -0.25, //Cowboys
    102110: 0.25, //Broncos
    102111: -0.5, //Lions
    102112: 1, //Packers
    102113: 1.25, //Texans
    102114: 0.5, //Colts
    102116: -0.25, //Chiefs
    102118: 0.25, //Rams
    102119: -0.25, //Dolphins
    102120: -0.25, //Vikings
    102122: -0.25, //Saints
    102123: 0.5, //Giants
    102124: -0.5, //Jets
    102125: 0.5, //Raiders
    102126: -0.75, //Eagles
    102128: 0.25, //49ers
    102129: -0.5, //Seahawks
    102130: -0.25, //Buccaneers
    102132: 0.25, //Redskins
}

const nhl_adjust = {
    104127: 0.5, // Maple Leafs 
    104103: 0.5, // Bruins  
    104125: 0.5, // Blues 
    104105: 0.5, // Flames  
    104107: 0.5, // Blackhawks  
    104123: 0.25, // Penguins  
    104114: 0.25, // Kings 
    104101: 0.125, // Ducks 
    104122: 0.125, // Flyers  
    104131: -0.25, // Jets  
    104108: -0.25, // Avalanche 
    104110: -0.25, // Stars 
    104102: -0.25, // Coyotes 
    104119: -0.25, // Islanders 
    104120: -0.25, // Rangers 
    104129: -0.5, // Golden Knights 
    104113: -0.5, // Panthers  
    104130: -1.25, // Capitals  
}

const mlb_adjust = {

}
//cbb is multiplied by a factor of 3
const cbb_adjust = {
    106183: 0.633, //American University
    106401: 0.604, //Saint Louis
    106259: 0.409, //George Mason
    106421: 0.425, //Connecticut
    106450: 0.295, //Yale
    106267: 0.311, //Holy Cross
    106372: 0.538, //South Alabama
    106253: 0.409, //Gardner-Webb
    106336: 0.265, //North Florida
    106340: 0.358, //Northern Illinois
    106433: 0.651, //Valparaiso
    106275: 0.517, //Illinois State
    106215: 0.28, //Cleveland State
    106186: 0.371, //Little Rock
    106403: 0.386, //Saint Peter's
    106419: 0.382, //UCF
    106348: 0.221, //Norfolk State
    106223: 0.309, //Cal State Bakersfield
    106187: 0.374, //Army
    106447: 0.33, //Wofford
    106434: 0.368, //VMI
    106264: 0.377, //Harvard
    106374: 0.216, //Santa Clara
    106317: 0.212, //Memphis
    106418: 0.382, //UC Davis
    106399: 0.197, //St. Francis (PA)
    106393: 0.439, //Southern Miss
    106301: 0.301, //Loyola Marymount
    106278: 0.344, //Iona
    106270: 0.422, //Howard
    106190: 0.276, //Ball State
    106361: 0.341, //Princeton
    106236: 0.05, //East Carolina
    106123: 0.483, //Iowa State
    106176: 0.249, //Abilene Christian
    106284: 0.397, //James Madison
    106199: 0.556, //Bryant
    106310: 0.259, //Morehead State
    106220: 0.347, //Colorado State
    106420: 0.401, //UC Irvine
    106432: 0.368, //UTSA
    106146: 0.447, //Oregon
    106214: 0.387, //The Citadel
    106422: 0.309, //UC Riverside
    106304: 0.316, //Marist
    106209: 0.385, //Charlotte
    106149: 0.187, //Pittsburgh
    106178: 0.124, //Akron
    106293: 0.402, //Liberty
    106387: 0.115, //South Florida
    106180: 0.374, //Alabama State
    106320: 0.553, //Mississippi Valley State
    106350: 0.377, //Northwestern State
    106122: 0.61, //Iowa
    106230: 0.528, //Delaware State
    106286: 0.092, //Kent State
    106369: 0.176, //Robert Morris
    106228: 0.227, //Dayton
    106276: 0.394, //Incarnate Word
    106416: 0.22, //Texas State
    106282: 0.009, //Jacksonville
    106195: 0.001, //Boston University
    106295: 0.034, //LIU Brooklyn
    106423: 0.265, //UMass
    106120: 0.611, //Illinois
    106357: 0.401, //Pepperdine
    106312: 0, //UMKC
    106385: 0.116, //San Francisco
    106196: 0.095, //Bowling Green
    106323: 0.383, //Northern Arizona
    106363: 0.198, //Quinnipiac
    106217: 0.288, //Coastal Carolina
    106334: 0.122, //Omaha
    106134: 0.549, //Minnesota
    106364: 0.136, //Radford
    106198: 0.225, //Brown
    106352: 0.218, //Ohio
    106226: 0.155, //Dartmouth
    106308: 0.354, //Maryland Eastern Shore
    106261: -0.063, //Grambling State
    106345: 0.38, //New Mexico
    106238: 0.138, //Eastern Kentucky
    106442: -0.02, //Western Illinois
    106174: 0.534, //Wisconsin
    106121: 0.465, //Indiana
    106367: 0.161, //Richmond
    106292: -0.056, //Lehigh
    106254: 0.17, //Georgia Southern
    106250: -0.029, //Fordham
    106289: 0.008, //Louisiana-Monroe
    106222: -0.024, //Cornell
    106300: 0.074, //Loyola Maryland
    106256: 0.133, //Green Bay
    106349: 0.722, //North Texas
    106296: 0.26, //Longwood
    106141: 0.525, //Northwestern
    106330: -0.016, //UNCW
    106281: 0.182, //Jackson State
    106263: -0.001, //Hartford
    106224: 0.064, //Cal State Fullerton
    106245: -0.03, //Fairleigh Dickinson
    106439: -0.072, //Western Carolina
    106177: 0.136, //Air Force
    106294: -0.01, //Lipscomb
    106257: 0.359, //Grand Canyon
    106371: 0.253, //Sacramento State
    106239: 0.052, //Elon
    106333: 0.122, //Northeastern
    106171: 0.359, //Washington
    106291: 0.155, //Long Beach State
    106203: 0.055, //Cal Poly
    106193: 0.071, //Binghamton
    106388: 0.155, //Siena
    106415: -0.031, //Texas Southern
    106331: 0.186, //North Dakota
    106111: 0.208, //Colorado
    106184: 0.115, //Appalachian State
    106211: 0.261, //Chicago St.
    106368: 0.112, //Rider
    106136: 0.41, //Mississippi State
    106342: 0.058, //NJIT
    106358: 0.198, //Portland
    106280: -0.051, //IUPUI
    106269: 0.238, //Houston Baptist
    106221: 0.27, //Coppin State
    106306: 0.049, //UMass Lowell
    106234: 0.047, //Drexel
    106101: 0.184, //Alabama
    106152: 0.312, //Rutgers
    106335: 0.132, //Nevada
    106274: 0.192, //UIC
    106360: 0.171, //Presbyterian
    106287: -0.04, //Lafayette
    106131: 0.237, //Miami (FL)
    106219: 0.068, //Columbia
    106147: 0.278, //Oregon State
    106452: 0.368, //SMU
    106408: 0.118, //UT Martin
    106197: 0.268, //Bradley
    106390: 0.053, //SIUE
    106103: 0.424, //Arizona State
    106157: 0.171, //Syracuse
    106150: 0.143, //Providence
    106138: 0.12, //Nebraska
    106188: -0.014, //UAPB
    106435: 0.125, //VCU
    106398: -0.066, //St. Francis Brooklyn
    106377: 0.169, //USC Upstate
    106405: -0.121, //Texas A&M-Corpus Christi
    106376: 0.035, //South Carolina State
    106135: 0.334, //Ole Miss
    106314: 0.099, //Montana State
    106169: 0.189, //Virginia Tech
    106125: 0.092, //Kansas State
    106154: 0.22, //South Carolina
    106105: 0.228, //Auburn
    106431: -0.035, //Texas-Rio Grande Valley
    106246: 0.051, //Florida A&M
    106126: 0.016, //Kentucky
    106332: 0.057, //North Dakota State
    106313: 0.045, //Monmouth
    106260: -0.071, //Gonzaga
    106124: -0.096, //Kansas
    106302: 0.264, //Maine
    106327: -0.049, //North Carolina Central
    106129: 0.196, //Marquette
    106378: 0.15, //San Diego
    106341: 0.238, //Northern Iowa
    106117: 0.34, //Georgetown
    106413: -0.013, //Tulsa
    106370: -0.056, //Sacred Heart
    106185: -0.023, //Arkansas State
    106231: -0.192, //Denver
    106235: 0.058, //Duquesne
    106109: 0.078, //California
    106207: -0.046, //Central Connecticut State
    106389: 0.1, //Southern Illinois
    106139: -0.068, //North Carolina
    106453: 0.139, //Temple
    106116: 0.01, //Florida State
    106208: -0.103, //Charleston
    106311: -0.107, //Miami (OH)
    106229: -0.134, //Delaware
    106315: 0.205, //Montana
    106262: -0.262, //Hampton
    106212: -0.027, //Charleston Southern
    106392: -0.1, //Sam Houston State
    106290: 0.116, //La Salle
    106347: -0.18, //New Orleans
    106225: 0.049, //Cal State Northridge
    106307: -0.104, //McNeese State
    106115: 0.057, //Florida
    106137: 0.213, //Missouri
    106381: 0.081, //San Diego State
    106182: -0.025, //Alcorn State
    106383: -0.344, //Southeastern Louisiana
    106144: 0.171, //Oklahoma
    106168: -0.388, //Virginia
    106402: 0.065, //Saint Mary's
    106161: 0.088, //Texas
    106244: -0.219, //Fairfield
    106189: -0.107, //Austin Peay
    106130: 0.259, //Maryland
    106119: 0.059, //Georgia Tech
    106428: 0.152, //Utah State
    106430: -0.073, //UTEP
    106118: 0.127, //Georgia
    106391: 0.056, //San Jose State
    106397: -0.041, //Stetson
    106142: 0.018, //Notre Dame
    106440: 0.116, //Weber State
    106316: -0.089, //Morgan State
    106173: -0.06, //West Virginia
    106159: -0.003, //Tennessee
    106451: -0.116, //Youngstown State
    106255: 0.066, //Georgia State
    106446: -0.157, //Western Michigan
    106127: 0, //Louisville
    106133: -0.151, //Michigan State
    106247: 0.049, //Florida Atlantic
    106191: -0.357, //Bethune-Cookman
    106158: 0.009, //TCU
    106396: -0.129, //Stony Brook
    106218: -0.253, //Colgate
    106153: 0.027, //Seton Hall
    106114: -0.218, //Duke
    106271: -0.065, //High Point
    106140: 0.019, //North Carolina State
    106298: 0.145, //Louisiana Tech
    106113: 0.236, //DePaul
    106288: -0.191, //Lamar
    106366: -0.03, //Rice
    106249: 0.006, //FIU
    106251: 0.116, //Fresno State
    106283: -0.055, //Jacksonville State
    106166: 0.209, //Vanderbilt
    106407: -0.213, //Tennessee Tech
    106155: 0.189, //St. John's
    106277: 0.158, //Indiana State
    106356: -0.257, //Penn
    106164: -0.071, //USC
    106448: -0.12, //Wright State
    106328: -0.074, //UNCG
    106265: -0.168, //Hawaii
    106444: 0.199, //Western Kentucky
    106252: 0.075, //Furman
    106232: -0.187, //Detroit
    106362: -0.241, //Prairie View A&M
    106248: -0.08, //FGCU
    106437: -0.318, //Wagner
    106324: -0.446, //Navy
    106406: -0.244, //Tennessee State
    106156: -0.077, //Stanford
    106107: -0.029, //Boston College
    106386: -0.051, //Stephen F. Austin
    106355: -0.198, //Pacific
    106163: -0.038, //UCLA
    106354: -0.288, //Oral Roberts
    106110: -0.252, //Clemson
    106404: -0.157, //Southern Utah
    106132: -0.407, //Michigan
    106167: -0.665, //Villanova
    106373: -0.217, //Samford
    106412: -0.241, //Tulane
    106162: -0.188, //Texas Tech
    106201: -0.27, //Buffalo
    106112: -0.009, //Creighton
    106172: -0.047, //Washington State
    106258: -0.341, //George Washington
    106338: -0.319, //Niagara
    106210: -0.252, //Chattanooga
    106409: -0.251, //Toledo
    106102: -0.184, //Arizona
    106143: -0.127, //Ohio State
    106128: -0.028, //LSU
    106299: -0.224, //Loyola Chicago
    106445: -0.352, //William & Mary
    106411: -0.137, //Troy
    106108: -0.122, //Butler
    106268: -0.247, //Houston
    106394: -0.368, //Southern University
    106175: -0.379, //Xavier
    106202: -0.107, //BYU
    106400: -0.239, //Saint Joseph's
    106145: -0.158, //Oklahoma State
    106204: -0.144, //Campbell
    106285: -0.322, //Kennesaw State
    106266: -0.256, //Hofstra
    106192: -0.078, //Belmont
    106279: -0.282, //Fort Wayne
    106243: -0.15, //Eastern Washington
    106343: -0.143, //Northern Kentucky
    106106: -0.128, //Baylor
    106240: -0.344, //Eastern Michigan
    106273: -0.164, //Idaho State
    106384: -0.396, //Southeast Missouri State
    106148: -0.021, //Penn State
    106151: -0.34, //Purdue
    106375: -0.553, //Savannah State
    106337: -0.3, //New Hampshire
    106443: -0.291, //Winthrop
    106165: -0.057, //Utah
    106436: -0.462, //Vermont
    106233: -0.263, //Drake
    106380: -0.32, //South Dakota State
    106326: -0.56, //North Carolina A&T
    106346: -0.136, //New Mexico State
    106170: -0.028, //Wake Forest
    106365: -0.343, //Rhode Island
    106237: -0.408, //Eastern Illinois
    106305: -0.303, //Marshall
    106303: -0.506, //Manhattan
    106426: -0.1, //UNLV
    106429: -0.077, //Utah Valley
    106104: -0.214, //Arkansas
    106206: -0.641, //Central Arkansas
    106382: -0.441, //Seattle
    106205: -0.483, //Canisius
    106424: -0.668, //UMBC
    106213: -0.543, //Cincinnati
    106242: -0.363, //Evansville
    106441: -0.524, //Wichita State
    106395: -0.484, //St. Bonaventure
    106160: -0.391, //Texas A&M
    106319: -0.752, //Mount St. Mary's
    106297: -0.393, //Louisiana-Lafayette
    106194: -0.306, //Boise State
    106427: -0.444, //UC Santa Barbara
    106438: -0.46, //Milwaukee
    106351: -0.628, //Oakland
    106216: -0.509, //Central Michigan
    106329: -0.132, //Northern Colorado
    106318: -0.297, //Missouri State
    106410: -0.552, //Towson
    106325: -0.644, //UNC Asheville
    106379: -0.466, //South Dakota
    106339: -0.654, //Nicholls State
    106272: -0.649, //Idaho
    106200: -0.67, //Bucknell
    106449: -0.58, //Wyoming
    106353: -0.409, //Old Dominion
    106417: -0.573, //UAB
    106227: -0.622, //Davidson
    106359: -0.716, //Portland State
    106414: -0.73, //UT Arlington
    106241: -0.895, //East Tennessee State
    106309: -0.812, //Mercer
    106181: -1.041, //Albany
    106321: -0.866, //Middle Tennessee
    106322: -1.13, //Murray State
}

const cfb_adjust = {
    105107: 0.973975490144998, //Baylor
    105122: 0.74453786991467, //Kansas
    105114: 0.708702217912955, //Florida
    105154: 0.63322827400174, //Tennessee
    105136: 0.574700102129854, //Nebraska
    105104: 0.57208379975653, //Arkansas
    105118: 0.548414454468678, //Illinois
    105137: 0.524033741103236, //north carolina
    105155: 0.489183542694479, //Texas A&M
    105110: 0.484523671088046, //california
    105153: 0.467999170601499, //Syracuse
    105127: 0.434647907661717, //Maryland
    105130: 0.431903736301305, //Michigan
    105159: 0.431696053658579, //UCLA
    105144: 0.425576365438387, //Oregon
    105158: 0.402876209205204, //Texas Tech
    105117: 0.400228677868524, //Georgia Tech
    105145: 0.392257554499944, //Oregon State
    105165: 0.381864599374513, //Washington
    105167: 0.341212500967125, //West Virginia
    105135: 0.338410301380498, //Missouri
    105149: 0.333538063901991, //Rutgers
    105193: 0.321615660324513, //Cincinnati
    105102: 0.2971157832225, //Arizona
    105311: 0.279242078758728, //Tulsa
    105131: 0.266616119920283, //Michigan State
    105157: 0.258180914726622, //Texas
    105115: 0.258107360245535, //florida state
    105133: 0.250597619097219, //Ole Miss
    105214: 0.232941040810106, //georgia southern
    105109: 0.230605314352418, //BYU
    105191: 0.226542991524527, //Charlotte
    105111: 0.226038490731008, //Clemson
    105106: 0.203641918880868, //Auburn
    105132: 0.20023344296205, //Minnesota
    105180: 0.198084506151559, //Ball State
    105140: 0.191433110195663, //Notre Dame
    105129: 0.190905655706844, //Miami
    105162: 0.18127706074865, //virginia
    105160: 0.167850630793522, //Utah
    105108: 0.167799677100513, //Boston College
    105284: 0.166285931356948, //San Jose State
    105163: 0.164400005810584, //virginia tech
    105183: 0.160264205576844, //Bowling Green
    105134: 0.147999936422894, //mississippi state
    105103: 0.147868684319681, //Arizona State
    105152: 0.127325024184761, //Stanford
    105318: 0.109430195499744, //Utah State
    105113: 0.104125028084274, //Duke
    105119: 0.0834649038175983, //Indiana
    105253: 0.0794764660748822, //Nevada
    105161: 0.0748416636356253, //Vanderbilt
    105236: 0.0732699890442176, //UL Monroe
    105150: 0.0700578679880338, //South Carolina
    105147: 0.0687269892488686, //pittsburgh
    105112: 0.0630950525293403, //Colorado
    105319: 0.0619139052819251, //UTEP
    105124: 0.0528192775159501, //Kentucky
    105126: 0.0232849353977106, //Louisville
    105128: 0.0133225959806225, //UMass
    105278: 0.00724719459956069, //Rice
    105120: -0.000563563174327597, //Iowa
    105315: -0.00919708455202062, //UNLV
    105197: -0.0176825051552734, //UConn
    105148: -0.0182309844869657, //Purdue
    105268: -0.0192973976983062, //northern illinois
    105305: -0.0209798613798583, //Texas State
    105141: -0.0269649143807112, //ohio state
    105166: -0.0290578836647582, //washington state
    105125: -0.0302072948911176, //LSU
    105121: -0.0379233962658054, //Iowa State
    105201: -0.045506945424058, //east carolina
    105146: -0.0461229735911362, //Penn State
    105243: -0.0461496957787562, //Miami (OH)
    105255: -0.0478519612652002, //New Mexico
    105143: -0.0522838413663163, //Oklahoma State
    105142: -0.0557126038445918, //Oklahoma
    105286: -0.0573673758293909, //SMU
    105164: -0.0601560104825438, //Wake Forest
    105327: -0.0612783912203281, //western michigan
    105310: -0.0769844259562218, //Tulane
    105151: -0.0772824123728908, //USC
    105221: -0.0803252536612817, //Houston
    105116: -0.0838072617580532, //Georgia
    105218: -0.0909011751694827, //hawaii
    105123: -0.0952939364153821, //Kansas State
    105194: -0.110944180078442, //coastal carolina
    105239: -0.129581021671467, //Marshall
    105232: -0.130013235628147, //Kent State
    105353: -0.143219663348191, //Liberty
    105273: -0.150827444011832, //Old Dominion
    105283: -0.174973521321211, //San Diego State
    105139: -0.176057267958345, //Northwestern
    105287: -0.187289097075391, //South Alabama
    105244: -0.204834302139421, //middle tennessee
    105101: -0.207902597971183, //Alabama
    105170: -0.215548858584998, //Air Force
    105156: -0.22598406215292, //TCU
    105312: -0.228740167729496, //UAB
    105326: -0.230754645774259, //western kentucky
    105138: -0.235388864080577, //NC State
    105264: -0.236098193761529, //North Texas
    105177: -0.241872633289125, //Arkansas State
    105168: -0.254984459382074, //Wisconsin
    105241: -0.258437475668871, //Memphis
    105237: -0.27036990691322, //louisiana tech
    105252: -0.270421929493734, //Navy
    105204: -0.289551966403318, //eastern michigan
    105184: -0.294135815149566, //Buffalo
    105296: -0.302935255482059, //southern mississippi
    105182: -0.342717427388087, //Boise State
    105330: -0.364817897067718, //Wyoming
    105171: -0.368018690343809, //Akron
    105307: -0.383248631963221, //Toledo
    105196: -0.396096830190132, //Colorado State
    105272: -0.407256074335224, //Ohio
    105257: -0.41197043690127, //new mexico state
    105317: -0.432480983826673, //ut san antonio
    105300: -0.459772955773204, //Temple
    105235: -0.472219530101748, //Louisiana
    105211: -0.506763752823603, //Fresno State
    105209: -0.513937204058687, //florida intl
    105189: -0.526743484447195, //central michigan
    105291: -0.538259812122676, //south florida
    105215: -0.551859334944182, //Georgia State
    105176: -0.717668069564233, //appalachian state
    105208: -0.72929666289669, //florida atlantic
    105105: -0.810017922450771, //Army
    105309: -0.91641781505042, //Troy
    105314: -0.97608430159429, //UCF
}

const adjust_objects_by_sport = {
    101: nba_adjust,
    102: nfl_adjust,
    103: mlb_adjust,
    104: nhl_adjust,
    105: cfb_adjust,
    106: cbb_adjust
}

const copy_epl_elo = async () => {
    let epl_elos = 
        await knex('analysis.current_elo')
            .where('team_id', ">", 107000)
    
    let new_epl_elos = epl_elos.map(team => {
        return {team_id: team.team_id, elo: team.elo, year: 2019}
    })

    await knex('analysis.current_elo').insert(new_epl_elos)

}

const adjustElosAfterSeason = async (exitProcess, sports='baseball') => {
    if(sports === 'all'){
        await updatePastElos(knex)
        await adjustPastElosBySportEOS(101)
        await adjustPastElosBySportEOS(102)
        await adjustPastElosBySportEOS(103)
        await adjustPastElosBySportEOS(104)
        await adjustPastElosBySportEOS(105)
        await adjustPastElosBySportEOS(106)
        await copy_epl_elo()
    }else{
        await adjustPastElosBySportEOS(102)
    }
    if(exitProcess)
        process.exit()
}

module.exports = {adjustElosAfterSeason}

//copy_epl_elo()