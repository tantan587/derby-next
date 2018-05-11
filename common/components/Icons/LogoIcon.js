
import React from 'react'

class HomeLogoIcon extends React.Component {

  
  render() {
    const {color, viewbox} = this.props
    const localViewbox = viewbox ? viewbox : '0 0 100 100'
    return (
      <svg
        width='100%'
        height='100%'
        id="Layer_1" 
        data-name="Layer 1" 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox={localViewbox}>
        <title>Artboard 1</title>
        <path fill={color} d="M70.76,22.4a1.34,1.34,0,0,0-1-.45H62.39c.08-.7.16-1.39.24-2.06s.12-1.13.16-1.47c0,0-2.17-2.82-12.77-4.28L37,28.71,50.62,43.9l-2.81,6.65-6.13-1.74V45.92l-10-2a15.5,15.5,0,0,0-2.91,6.39c-1.22,6.13,1.41,13,6.63,18.27l.21.08c2.51-1,9.69-4.09,16.18-14.25a43.45,43.45,0,0,0,8.31-6.6,42.65,42.65,0,0,0,11-24.35A1.34,1.34,0,0,0,70.76,22.4ZM58.18,46a30.7,30.7,0,0,1-3.32,3c.77-1.58,1.53-3.24,2.24-5.08A83,83,0,0,0,62,24.64h6.19A39.74,39.74,0,0,1,58.18,46Z"/>
        <path fill={color} d="M26.86,17.76l5.94,6.45,13-10.52c-2.88-.24-6.23-.39-10.13-.4-23.2,0-27.13,5.13-27.13,5.13,0,.34.09.85.16,1.47s.16,1.36.24,2.06H1.34A1.34,1.34,0,0,0,0,23.44,43.38,43.38,0,0,0,8,44.18a24,24,0,0,1,1-3.32A40.85,40.85,0,0,1,2.87,24.64H9.28a86.44,86.44,0,0,0,2.29,11.22c5.81-8.3,15.51-9.73,16.76-9.89a8.39,8.39,0,0,1-1.53-3A9.39,9.39,0,0,1,26.86,17.76Z"/>
        <path fill={color} d="M35.52,13.29h0Z"/>
        <path fill={color} d="M35.59,68.69h.2l-.13-.05-.09,0Z"/>
        <path fill={color} d="M62.7,0,45.81,13.69q2.31.19,4.22.46Z"/>
        <polygon fill={color} points="35.65 30.38 38.88 33.91 36.17 34.31 35.65 30.38"/>
      </svg>
    )
  }
}

{/* <defs>
        <style>.cls-1{{fill:'#229246'}}.cls-2{{fill:'#ebab38'}}
        </style></defs> */}
export default HomeLogoIcon