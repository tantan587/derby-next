const FinishLine = () => {
  const BOX_COUNT = 16
  const boxPairs = []

  for (let i = 0; i < BOX_COUNT; i++) {
    boxPairs.push(
      [
        <div key={i} style={{
          backgroundColor: i % 2 === 0 ? 'black' : 'white',
          width: 10,
        }} />,
        <div key={'a' +i} style={{
          backgroundColor: i % 2 === 0 ? 'white' : 'black',
          width: 10,
        }} />
      ]
    )
  }

  return (
    // <div style={{ height: '100%' }}>
    <div>
      {
        boxPairs.map((box, i) => <div key={i} style={{ display: 'flex', height: 100 / BOX_COUNT + '%' }}>
          {box}
        </div>)
      }
    </div>
  )
}

export default FinishLine
