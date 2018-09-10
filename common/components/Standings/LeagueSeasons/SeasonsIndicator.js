import sportLeagues from '../../../../data/sportLeagues.json'



const SeasonsIndicator = ({ start, end, fullDifference, seasons }) =>
{
  return <div style={{ backgroundColor: '#299149', textTransform: 'uppercase' }}>
    {
      Object.keys(seasons).map(sportId => <div key={sportId} style={{ display: 'flex' }}>
        <div
          style={{ width: ( Date.parse(seasons[sportId].start) - start ) / fullDifference * 100 + '%' }}
        />
        <div
          style={{
            backgroundColor: '#0E7838',
            color: 'white',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            width: ( Date.parse(seasons[sportId].end) - Date.parse(seasons[sportId].start) ) / fullDifference * 100 + '%'
          }}>
          &nbsp; &nbsp; { sportLeagues[sportId].displayName } season
        </div>
        <div
          style={{ width: ( end - Date.parse(seasons[sportId]) ) / fullDifference * 100 + '%' }}
        />
      </div>)
    }
  </div>
}

export default SeasonsIndicator
