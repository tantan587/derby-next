const data = [{
  sport_id : 103,
  status : 'Top 8th',
  header : ['R','H','E'],
  home : {
    team_name: 'Boston Red Sox',
    url: 'https://upload.wikimedia.org/wikipedia/en/6/6d/RedSoxPrimary_HangingSocks.svg',
    record: '33-25, 87 Points',
    score:[4,7,1]
  },
  away : {
    team_name: 'Atlanta Braves',
    url: 'https://upload.wikimedia.org/wikipedia/en/f/f2/Atlanta_Braves.svg',
    record: '23-35, 36 Points',
    score:[2,3,1]
  },
  stadium: 'Fenway Park'
},{
  sport_id : 103,
  status : 'Final',
  header : ['R','H','E'],
  home : {
    team_name: 'Boston Red Sox',
    url: 'https://upload.wikimedia.org/wikipedia/en/6/6d/RedSoxPrimary_HangingSocks.svg',
    record: '33-25, 87 Points',
    score:[6,8,1]
  },
  away : {
    team_name: 'Atlanta Braves',
    url: 'https://upload.wikimedia.org/wikipedia/en/f/f2/Atlanta_Braves.svg',
    record: '23-35, 36 Points',
    score:[3,5,1],
    lost:true
  },
  stadium: 'Fenway Park'
},{
  sport_id : 103,
  status : '7:00 PM EST',
  header : ['R','H','E'],
  home : {
    team_name: 'Boston Red Sox',
    url: 'https://upload.wikimedia.org/wikipedia/en/6/6d/RedSoxPrimary_HangingSocks.svg',
    record: '33-25, 87 Points',
    score:[0,0,0]
  },
  away : {
    team_name: 'Atlanta Braves',
    url: 'https://upload.wikimedia.org/wikipedia/en/f/f2/Atlanta_Braves.svg',
    record: '23-35, 36 Points',
    score:[0,0,0]
  },
  stadium: 'Fenway Park'
},{
  sport_id : 101,
  status : '0:45 4th',
  header : ['1','2','3','4', 'T'],
  home : {
    team_name: 'Boston Celtics',
    url: 'https://upload.wikimedia.org/wikipedia/en/8/8f/Boston_Celtics.svg',
    record: '33-25, 87 Points',
    score:[25,31,21,32,109]
  },
  away : {
    team_name: 'Atlanta Hawks',
    url: 'https://upload.wikimedia.org/wikipedia/en/2/24/Atlanta_Hawks_logo.svg',
    record: '23-35, 36 Points',
    score:[24,30,20,30,104]
  },
  stadium: 'TD Banknorth Garden'
},{
  sport_id : 102,
  status : 'Final',
  header : ['1','2','3','4', 'T'],
  home : {
    team_name: 'New England',
    url: 'https://upload.wikimedia.org/wikipedia/en/b/b9/New_England_Patriots_logo.svg',
    record: '33-25, 87 Points',
    score:[10,7,10,7,34]
  },
  away : {
    lost:true,
    team_name: 'Atlanta Falcons',
    url: 'https://upload.wikimedia.org/wikipedia/en/c/c5/Atlanta_Falcons_logo.svg',
    record: '23-35, 36 Points',
    score:[7,7,10,7,31]
  },
  stadium: 'Gilette Stadium'
},
]

export default data