const Silk = ({ primary, secondary, style, pattern, darkPrimaryColorInd }) =>
{
  return (<svg
    version="1.1"
    id="Layer_1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-5 -5 80.7 73.3"
    style={{ ...{ height: 25, zIndex: 10}, ...style }}
  >
    <title>Artboard 1</title>
    <g id="background">
      <polygon id="svg_3"  fill={ primary || '#CCCCCC' } points="61.87 67.01 54.06 37.52 50.29 65.05 21.71 65.05 17.94 37.52 10.13 67.01 0.3 67.01 9.16 16.34 26.76 6 26.76 0.25 45.24 0.25 45.24 6 62.84 16.34 71.7 67.01 61.87 67.01"/>
      <path fill={ darkPrimaryColorInd ? '#FFFFFF' : '#333333' } d="M45,.5V6.15l.25.14L62.62,16.5,71.4,66.76H62.06L54.62,38.66,54,36.25l-.34,2.48L50.08,64.8H21.92L18.36,38.72,18,36.25l-.64,2.42L9.94,66.76H.6L9.38,16.5,26.76,6.29,27,6.15V.5H45m.5-.5h-19V5.86L8.93,16.19,0,67.26H10.33l7.53-28.47L21.49,65.3h29l3.63-26.51,7.53,28.47H72L63.07,16.19,45.49,5.86V0Z"/></g>
    <g id="pattern">
      {
        pattern.type === 'd' ?
          pattern.str.map((str,i) => {
            return <path key={i} fill={ secondary || '#555555' } d={str}/>
          }) : pattern.type==='points'?
            pattern.str.map((str,i) => {
              return <polygon key={i} fill={ secondary || '#555555' } points={str}/>
            }) : pattern.type === 'circle' ?
              <circle fill={ secondary || '#555555' } cx="36" cy="30.4" r="12.11"/>
              : null

      }
    </g>
  </svg>)
}

export default Silk
