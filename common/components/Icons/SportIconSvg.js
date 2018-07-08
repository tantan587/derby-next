const SportIconSvg = ({ color, style, pattern, viewBox }) =>
{
  return (<svg
    version="1.1"
    id="Layer_1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox={viewBox}
    style={{ ...{ width: 30, height:'auto'}, ...style }}
  >
    <title>icon</title>
    <g id="pattern">
      {
        pattern.map((str,i) => {
          return <path key={i} fill={ color || '#555555' } d={str}/>
        })
      }
    </g>
  </svg>)
}

export default SportIconSvg
