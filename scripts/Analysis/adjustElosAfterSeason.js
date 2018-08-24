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
        if(sport_id === 106){
            let d1Teams = teams.filter(team => team.conference_id != 999).map(team => {return Number(team.elo)})
            standard_dev = math.std(d1Teams)
        }
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
    106183: 0.733, //American University
    106401: 0.745, //Saint Louis
    106259: 0.504, //George Mason
    106421: 0.521, //Connecticut
    106450: 0.412, //Yale
    106267: 0.447, //Holy Cross
    106372: 0.666, //South Alabama
    106253: 0.541, //Gardner-Webb
    106336: 0.433, //North Florida
    106340: 0.491, //Northern Illinois
    106433: 0.697, //Valparaiso
    106275: 0.599, //Illinois State
    106215: 0.39, //Cleveland State
    106186: 0.459, //Little Rock
    106403: 0.404, //Saint Peter's
    106419: 0.459, //UCF
    106348: 0.381, //Norfolk State
    106223: 0.39, //Cal State Bakersfield
    106187: 0.453, //Army
    106447: 0.467, //Wofford
    106434: 0.471, //VMI
    106264: 0.455, //Harvard
    106374: 0.233, //Santa Clara
    106317: 0.319, //Memphis
    106418: 0.532, //UC Davis
    106399: 0.373, //St. Francis (PA)
    106393: 0.555, //Southern Miss
    106301: 0.34, //Loyola Marymount
    106278: 0.429, //Iona
    106270: 0.504, //Howard
    106190: 0.375, //Ball State
    106361: 0.297, //Princeton
    106236: 0.087, //East Carolina
    106123: 0.46, //Iowa State
    106176: 0.38, //Abilene Christian
    106284: 0.439, //James Madison
    106199: 0.512, //Bryant
    106310: 0.326, //Morehead State
    106220: 0.33, //Colorado State
    106420: 0.486, //UC Irvine
    106432: 0.494, //UTSA
    106146: 0.368, //Oregon
    106214: 0.464, //The Citadel
    106422: 0.394, //UC Riverside
    106304: 0.372, //Marist
    106209: 0.369, //Charlotte
    106149: 0.147, //Pittsburgh
    106178: 0.158, //Akron
    106293: 0.505, //Liberty
    106387: 0.195, //South Florida
    106180: 0.46, //Alabama State
    106320: 0.569, //Mississippi Valley State
    106350: 0.359, //Northwestern State
    106122: 0.548, //Iowa
    106230: 0.528, //Delaware State
    106286: 0.176, //Kent State
    106369: 0.309, //Robert Morris
    106228: 0.21, //Dayton
    106276: 0.347, //Incarnate Word
    106416: 0.221, //Texas State
    106282: 0.131, //Jacksonville
    106195: 0.09, //Boston University
    106295: 0.172, //LIU Brooklyn
    106423: 0.267, //UMass
    106120: 0.517, //Illinois
    106357: 0.346, //Pepperdine
    106312: 0, //UMKC
    106385: 0.204, //San Francisco
    106196: 0.188, //Bowling Green
    106323: 0.409, //Northern Arizona
    106363: 0.272, //Quinnipiac
    106217: 0.306, //Coastal Carolina
    106334: 0.125, //Omaha
    106134: 0.443, //Minnesota
    106364: 0.33, //Radford
    106198: 0.232, //Brown
    106352: 0.246, //Ohio
    106226: 0.163, //Dartmouth
    106308: 0.349, //Maryland Eastern Shore
    106261: 0.16, //Grambling State
    106345: 0.387, //New Mexico
    106238: 0.214, //Eastern Kentucky
    106442: 0.069, //Western Illinois
    106174: 0.412, //Wisconsin
    106121: 0.399, //Indiana
    106367: 0.14, //Richmond
    106292: -0.006, //Lehigh
    106254: 0.247, //Georgia Southern
    106250: -0.008, //Fordham
    106289: 0.1, //Louisiana-Monroe
    106222: 0.055, //Cornell
    106300: 0.083, //Loyola Maryland
    106256: 0.118, //Green Bay
    106349: 0.757, //North Texas
    106296: 0.332, //Longwood
    106141: 0.422, //Northwestern
    106330: -0.011, //UNCW
    106281: 0.214, //Jackson State
    106263: 0.17, //Hartford
    106224: 0.18, //Cal State Fullerton
    106245: 0.091, //Fairleigh Dickinson
    106439: 0.046, //Western Carolina
    106177: 0.16, //Air Force
    106294: 0.122, //Lipscomb
    106257: 0.393, //Grand Canyon
    106371: 0.285, //Sacramento State
    106239: 0.07, //Elon
    106333: 0.23, //Northeastern
    106171: 0.35, //Washington
    106291: 0.205, //Long Beach State
    106203: 0.078, //Cal Poly
    106193: 0.155, //Binghamton
    106388: 0.102, //Siena
    106415: 0.058, //Texas Southern
    106331: 0.215, //North Dakota
    106111: 0.19, //Colorado
    106184: 0.183, //Appalachian State
    106211: 0.274, //Chicago St.
    106368: 0.185, //Rider
    106136: 0.424, //Mississippi State
    106342: 0.142, //NJIT
    106358: 0.178, //Portland
    106280: -0.035, //IUPUI
    106269: 0.157, //Houston Baptist
    106221: 0.266, //Coppin State
    106306: 0.132, //UMass Lowell
    106234: 0.098, //Drexel
    106101: 0.222, //Alabama
    106152: 0.267, //Rutgers
    106335: 0.196, //Nevada
    106274: 0.222, //UIC
    106360: 0.269, //Presbyterian
    106287: 0.031, //Lafayette
    106131: 0.185, //Miami (FL)
    106219: 0.052, //Columbia
    106147: 0.287, //Oregon State
    106452: 0.232, //SMU
    106408: 0.06, //UT Martin
    106197: 0.294, //Bradley
    106390: 0.115, //SIUE
    106103: 0.389, //Arizona State
    106157: 0.167, //Syracuse
    106150: 0.136, //Providence
    106138: 0.165, //Nebraska
    106188: 0.092, //UAPB
    106435: 0.023, //VCU
    106398: 0.078, //St. Francis Brooklyn
    106377: 0.114, //USC Upstate
    106405: -0.142, //Texas A&M-Corpus Christi
    106376: 0.07, //South Carolina State
    106135: 0.276, //Ole Miss
    106314: 0.128, //Montana State
    106169: 0.159, //Virginia Tech
    106125: 0.081, //Kansas State
    106154: 0.157, //South Carolina
    106105: 0.241, //Auburn
    106431: 0.087, //Texas-Rio Grande Valley
    106246: 0.127, //Florida A&M
    106126: -0.003, //Kentucky
    106332: 0.039, //North Dakota State
    106313: -0.016, //Monmouth
    106260: -0.037, //Gonzaga
    106124: -0.105, //Kansas
    106302: 0.211, //Maine
    106327: -0.053, //North Carolina Central
    106129: 0.153, //Marquette
    106378: 0.188, //San Diego
    106341: 0.232, //Northern Iowa
    106117: 0.229, //Georgetown
    106413: 0.022, //Tulsa
    106370: 0.006, //Sacred Heart
    106185: -0.075, //Arkansas State
    106231: -0.141, //Denver
    106235: 0.021, //Duquesne
    106109: -0.084, //California
    106207: 0.056, //Central Connecticut State
    106389: 0.106, //Southern Illinois
    106139: -0.086, //North Carolina
    106453: 0.131, //Temple
    106116: -0.003, //Florida State
    106208: -0.064, //Charleston
    106311: -0.033, //Miami (OH)
    106229: -0.1, //Delaware
    106315: 0.278, //Montana
    106262: -0.144, //Hampton
    106212: 0.051, //Charleston Southern
    106392: -0.036, //Sam Houston State
    106290: 0.073, //La Salle
    106347: -0.161, //New Orleans
    106225: -0.02, //Cal State Northridge
    106307: -0.054, //McNeese State
    106115: 0.003, //Florida
    106137: 0.239, //Missouri
    106381: 0.088, //San Diego State
    106182: -0.031, //Alcorn State
    106383: -0.201, //Southeastern Louisiana
    106144: 0.101, //Oklahoma
    106168: -0.288, //Virginia
    106402: 0.006, //Saint Mary's
    106161: 0.071, //Texas
    106244: -0.182, //Fairfield
    106189: -0.022, //Austin Peay
    106130: 0.162, //Maryland
    106119: -0.04, //Georgia Tech
    106428: 0.091, //Utah State
    106430: -0.1, //UTEP
    106118: 0.087, //Georgia
    106391: -0.071, //San Jose State
    106397: -0.06, //Stetson
    106142: -0.034, //Notre Dame
    106440: 0.111, //Weber State
    106316: -0.087, //Morgan State
    106173: -0.11, //West Virginia
    106159: 0.018, //Tennessee
    106451: -0.138, //Youngstown State
    106255: 0.04, //Georgia State
    106446: -0.168, //Western Michigan
    106127: -0.106, //Louisville
    106133: -0.134, //Michigan State
    106247: 0.03, //Florida Atlantic
    106191: -0.239, //Bethune-Cookman
    106158: -0.055, //TCU
    106396: -0.155, //Stony Brook
    106218: -0.201, //Colgate
    106153: -0.034, //Seton Hall
    106114: -0.24, //Duke
    106271: -0.052, //High Point
    106140: 0.012, //North Carolina State
    106298: 0.07, //Louisiana Tech
    106113: 0.174, //DePaul
    106288: -0.163, //Lamar
    106366: -0.146, //Rice
    106249: -0.016, //FIU
    106251: 0.052, //Fresno State
    106283: -0.039, //Jacksonville State
    106166: 0.092, //Vanderbilt
    106407: -0.169, //Tennessee Tech
    106155: 0.115, //St. John's
    106277: 0.11, //Indiana State
    106356: -0.215, //Penn
    106164: -0.163, //USC
    106448: -0.127, //Wright State
    106328: -0.038, //UNCG
    106265: -0.182, //Hawaii
    106444: 0.214, //Western Kentucky
    106252: 0.046, //Furman
    106232: -0.243, //Detroit
    106362: -0.192, //Prairie View A&M
    106248: -0.113, //FGCU
    106437: -0.238, //Wagner
    106324: -0.409, //Navy
    106406: -0.214, //Tennessee State
    106156: -0.145, //Stanford
    106107: -0.034, //Boston College
    106386: -0.023, //Stephen F. Austin
    106355: -0.183, //Pacific
    106163: -0.185, //UCLA
    106354: -0.305, //Oral Roberts
    106110: -0.228, //Clemson
    106404: -0.074, //Southern Utah
    106132: -0.392, //Michigan
    106167: -0.614, //Villanova
    106373: -0.277, //Samford
    106412: -0.225, //Tulane
    106162: -0.223, //Texas Tech
    106201: -0.231, //Buffalo
    106112: -0.12, //Creighton
    106172: -0.147, //Washington State
    106258: -0.419, //George Washington
    106338: -0.316, //Niagara
    106210: -0.345, //Chattanooga
    106409: -0.255, //Toledo
    106102: -0.318, //Arizona
    106143: -0.144, //Ohio State
    106128: -0.05, //LSU
    106299: -0.192, //Loyola Chicago
    106445: -0.37, //William & Mary
    106411: -0.209, //Troy
    106108: -0.215, //Butler
    106268: -0.248, //Houston
    106394: -0.358, //Southern University
    106175: -0.395, //Xavier
    106202: -0.184, //BYU
    106400: -0.275, //Saint Joseph's
    106145: -0.281, //Oklahoma State
    106204: -0.174, //Campbell
    106285: -0.374, //Kennesaw State
    106266: -0.324, //Hofstra
    106192: -0.125, //Belmont
    106279: -0.339, //Fort Wayne
    106243: -0.162, //Eastern Washington
    106343: -0.174, //Northern Kentucky
    106106: -0.271, //Baylor
    106240: -0.372, //Eastern Michigan
    106273: -0.163, //Idaho State
    106384: -0.408, //Southeast Missouri State
    106148: -0.124, //Penn State
    106151: -0.413, //Purdue
    106375: -0.516, //Savannah State
    106337: -0.435, //New Hampshire
    106443: -0.338, //Winthrop
    106165: -0.239, //Utah
    106436: -0.429, //Vermont
    106233: -0.281, //Drake
    106380: -0.337, //South Dakota State
    106326: -0.451, //North Carolina A&T
    106346: -0.163, //New Mexico State
    106170: -0.244, //Wake Forest
    106365: -0.435, //Rhode Island
    106237: -0.457, //Eastern Illinois
    106305: -0.346, //Marshall
    106303: -0.529, //Manhattan
    106426: -0.17, //UNLV
    106429: -0.146, //Utah Valley
    106104: -0.334, //Arkansas
    106206: -0.594, //Central Arkansas
    106382: -0.44, //Seattle
    106205: -0.552, //Canisius
    106424: -0.632, //UMBC
    106213: -0.587, //Cincinnati
    106242: -0.445, //Evansville
    106441: -0.627, //Wichita State
    106395: -0.559, //St. Bonaventure
    106160: -0.469, //Texas A&M
    106319: -0.773, //Mount St. Mary's
    106297: -0.441, //Louisiana-Lafayette
    106194: -0.42, //Boise State
    106427: -0.452, //UC Santa Barbara
    106438: -0.555, //Milwaukee
    106351: -0.743, //Oakland
    106216: -0.58, //Central Michigan
    106329: -0.193, //Northern Colorado
    106318: -0.414, //Missouri State
    106410: -0.685, //Towson
    106325: -0.712, //UNC Asheville
    106379: -0.566, //South Dakota
    106339: -0.681, //Nicholls State
    106272: -0.729, //Idaho
    106200: -0.787, //Bucknell
    106449: -0.724, //Wyoming
    106353: -0.564, //Old Dominion
    106417: -0.691, //UAB
    106227: -0.826, //Davidson
    106359: -0.828, //Portland State
    106414: -0.952, //UT Arlington
    106241: -1.023, //East Tennessee State
    106309: -0.975, //Mercer
    106181: -1.215, //Albany
    106321: -1.069, //Middle Tennessee
    106322: -1.273, //Murray State
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
