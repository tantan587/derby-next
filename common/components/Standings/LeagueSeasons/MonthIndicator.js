// 15 blocks
// blank | sep | blank | nov | blank | jan 18 | blank | mar | blank | may | blank | jul | blank | sep | blank

const MonthIndicator = () => {
  const monthsToRender = [null, 'sep', null, 'nov', null, 'jan \'18', null, 'mar', null, 'may', null, 'jul', null, 'sep', null]
  const NUM_MONTHS = monthsToRender.length

  return (
    <div style={{
      display: 'flex',
      overflow: 'hidden',
      height: 20,
      textTransform: 'uppercase',
      backgroundColor: '#299149',
      borderTop: '1px solid white',
      borderBottom: '1px solid white',
      paddingTop: '2px'
    }}>
      {
        monthsToRender.map((month, i) => <div key={i} style={{
          // backgroundColor: '#299149',
          color: 'white',
          width: 100 / NUM_MONTHS + '%',
          textAlign: 'center',
          borderLeft: '1px solid white',
          borderRight: '1px solid white',
        }}
        >
          { month ? month : '' }
        </div>)
      }
    </div>
  )
}

export default MonthIndicator
