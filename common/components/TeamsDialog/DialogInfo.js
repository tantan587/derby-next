import React from 'react'

const DialogInfo = ({ data }) =>
  <div style={{
    borderTop: '10px solid #229246',
    paddingTop: 40,
    paddingLeft: 40,
    display: 'flex',
    justifyContent: 'center'
  }}>
    <div style={{ width: 700 }}>
      <div style={{ fontSize: 24 }}>
        Headline
      </div>
      <div style={{ fontSize: 16, marginTop: 40, color: 'grey' }}>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna wirl aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.
      </div>
    </div>
  </div>

export default DialogInfo
